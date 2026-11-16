// Admin-only database access. The browser never holds a key that can write: it sends its
// session token here and this function talks to Supabase with the service role key.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { verifySessionToken } from '../_lib/session.js';

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

  if (!verifySessionToken(req.headers.authorization)) {
    return res.status(401).json({ error: 'Not signed in' });
  }

  try {
    switch (String(req.query.action)) {
      case 'db':
        return await proxyDatabaseRequest(req, res, supabaseUrl, serviceKey);
      case 'upload-url':
        return await createImageUploadUrl(req, res, supabaseUrl, serviceKey);
      default:
        return res.status(404).json({ error: 'Not found' });
    }
  } catch (err: any) {
    console.error('Admin API error:', err);
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
