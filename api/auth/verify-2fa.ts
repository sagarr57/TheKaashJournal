import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
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

    const { username, token } = req.body;
    if (!username || !token) return res.status(400).json({ error: 'Username and token required' });

    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, totp_secret, totp_enabled')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (error || !user || !user.totp_secret)
      return res.status(400).json({ error: 'Setup 2FA first before verifying' });

    const isValid = authenticator.verify({ token, secret: user.totp_secret });
    if (!isValid) return res.status(400).json({ error: 'Invalid verification code. Check your authenticator app.' });

    await supabase
      .from('admin_users')
      .update({ totp_enabled: true, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    return res.json({ success: true, message: '2FA enabled successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
