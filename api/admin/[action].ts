// Admin-only database access. The browser never holds a key that can write: it sends its
// session token here and this function talks to Supabase with the service role key.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { verifySessionToken } from '../_lib/session.js';
import { triggerRebuild } from '../_lib/rebuild.js';
import { googleReports } from '../_lib/google.js';

const FORWARDED_REQUEST_HEADERS = ['accept', 'content-type', 'prefer', 'range', 'range-unit', 'accept-profile', 'content-profile'];
const FORWARDED_RESPONSE_HEADERS = ['content-type', 'content-range', 'preference-applied'];
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']);
const IMAGE_BUCKET = 'blog-images';

async function proxyDatabaseRequest(req: VercelRequest, res: VercelResponse, supabaseUrl: string, serviceKey: string) {
  const path = String(req.query.path || '');
  // Only this project's REST API, and never the table holding password hashes and 2FA secrets.
  if (!/^\/rest\/v1\/[a-z_]+(\?|$)/.test(path) || path.startsWith('/rest/v1/admin_users')) {
    return res.status(400).json({ error: 'Unsupported path' });
  }

  const headers: Record<string, string> = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = req.headers[name];
    if (typeof value === 'string') headers[name] = value;
  }

  const method = req.method || 'GET';
  const hasBody = method !== 'GET' && method !== 'HEAD' && req.body != null;
  const upstream = await fetch(`${supabaseUrl}${path}`, {
    method,
    headers,
    body: hasBody ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) : undefined,
  });

  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) res.setHeader(name, value);
  }
  res.status(upstream.status);
  return method === 'HEAD' ? res.end() : res.send(await upstream.text());
}

const TEAM_COLUMNS = 'id, username, full_name, email, is_active, totp_enabled, last_login, created_at';

// Admin accounts are managed here rather than through the generic database proxy, which never
// exposes this table, so password hashes and 2FA secrets can't be read from the browser.
async function handleTeam(req: VercelRequest, res: VercelResponse, supabaseUrl: string, serviceKey: string, sessionUser: string) {
  const supabase = createClient(supabaseUrl, serviceKey);
  const action = String(req.query.action);

  if (action === 'me') {
    const { data, error } = await supabase.from('admin_users').select('username, full_name, totp_enabled').eq('username', sessionUser).single();
    if (error || !data) return res.status(404).json({ error: 'Account not found' });
    return res.json(data);
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('admin_users').select(TEAM_COLUMNS).order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ me: sessionUser, users: data });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { id, change } = req.body || {};
  const { data: target } = await supabase.from('admin_users').select('id, username, is_active').eq('id', id).single();
  if (!target) return res.status(404).json({ error: 'User not found' });
  if (target.username === sessionUser) return res.status(400).json({ error: 'Use your own settings above to change your account' });

  if (change === 'deactivate' || change === 'activate') {
    if (change === 'deactivate') {
      const { count } = await supabase.from('admin_users').select('id', { count: 'exact', head: true }).eq('is_active', true);
      if ((count ?? 0) <= 1) return res.status(400).json({ error: 'At least one active admin is required' });
    }
    await supabase.from('admin_users').update({ is_active: change === 'activate', updated_at: new Date().toISOString() }).eq('id', id);
  } else if (change === 'reset-2fa') {
    await supabase.from('admin_users').update({ totp_enabled: false, totp_secret: null, updated_at: new Date().toISOString() }).eq('id', id);
  } else {
    return res.status(400).json({ error: 'Unknown change' });
  }
  const { data } = await supabase.from('admin_users').select(TEAM_COLUMNS).eq('id', id).single();
  return res.json({ user: data });
}

async function createImageUploadUrl(req: VercelRequest, res: VercelResponse, supabaseUrl: string, serviceKey: string) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const extension = String(req.body?.fileName || '').split('.').pop()?.toLowerCase() || '';
  if (!IMAGE_EXTENSIONS.has(extension)) {
    return res.status(400).json({ error: 'Only JPG, PNG, WebP, GIF or AVIF images can be uploaded' });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const path = `blog-${Date.now()}.${extension}`;
  const { data, error } = await supabase.storage.from(IMAGE_BUCKET).createSignedUploadUrl(path);
  if (error || !data) return res.status(500).json({ error: error?.message || 'Could not prepare upload' });

  const { data: publicUrl } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return res.json({ bucket: IMAGE_BUCKET, path: data.path, token: data.token, publicUrl: publicUrl.publicUrl });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(500).json({ error: 'Supabase not configured' });

  const sessionUser = verifySessionToken(req.headers.authorization);
  if (!sessionUser) {
    return res.status(401).json({ error: 'Not signed in' });
  }

  try {
    switch (String(req.query.action)) {
      case 'db':
        return await proxyDatabaseRequest(req, res, supabaseUrl, serviceKey);
      case 'upload-url':
        return await createImageUploadUrl(req, res, supabaseUrl, serviceKey);
      case 'me':
      case 'team':
        return await handleTeam(req, res, supabaseUrl, serviceKey, sessionUser);
      case 'google':
        return res.json(await googleReports(req.query.fresh === '1'));
      case 'rebuild':
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        return res.json(await triggerRebuild());
      default:
        return res.status(404).json({ error: 'Not found' });
    }
  } catch (err: any) {
    console.error('Admin API error:', err);
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
