import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    );

    const { username, password, token } = req.body;
    if (!username || !password || !token)
      return res.status(400).json({ error: 'Username, password and authenticator token are required' });

    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, password_hash, totp_secret, totp_enabled')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (error || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPw = await bcrypt.compare(password, user.password_hash);
    if (!validPw) return res.status(401).json({ error: 'Incorrect password' });

    if (!user.totp_enabled) return res.status(400).json({ error: '2FA is not enabled' });

    const validToken = authenticator.verify({ token, secret: user.totp_secret });
    if (!validToken) return res.status(400).json({ error: 'Invalid authenticator code' });

    await supabase
      .from('admin_users')
      .update({ totp_enabled: false, totp_secret: null, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    return res.json({ success: true, message: '2FA disabled successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
