// All /api/auth/* endpoints live in this one function to stay under Vercel's per-deployment function limit.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';

type Action = (req: VercelRequest, res: VercelResponse, supabase: SupabaseClient) => Promise<unknown>;

const login: Action = async (req, res, supabase) => {
  const { username, password, totpToken } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const { data: user, error: fetchError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .eq('is_active', true)
    .single();

  if (fetchError || !user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // If 2FA is enabled and no token was sent, signal the client to ask for it
  if (user.totp_enabled && user.totp_secret) {
    if (!totpToken) {
      return res.json({ success: true, requires2fa: true });
    }
    const isValidToken = authenticator.verify({ token: totpToken, secret: user.totp_secret });
    if (!isValidToken) {
      return res.status(401).json({ error: 'Invalid 2FA code. Try again.' });
    }
  }

  await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  return res.json({
    success: true,
    requires2fa: false,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
    },
  });
};

const createAdmin: Action = async (req, res, supabase) => {
  const { username, password, email, full_name } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const { data: existingUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('username', username)
    .single();

  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { data: user, error: createError } = await supabase
    .from('admin_users')
    .insert({
      username,
      password_hash: passwordHash,
      email: email || null,
      full_name: full_name || null,
      is_active: true,
    })
    .select('id, username, email, full_name')
    .single();

  if (createError) {
    console.error('Create user error:', createError);
    return res.status(500).json({ error: 'Failed to create user' });
  }

  return res.json({
    success: true,
    message: 'Admin user created successfully',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
    },
  });
};

const changePassword: Action = async (req, res, supabase) => {
  const { username, currentPassword, newPassword } = req.body;

  if (!username || !currentPassword || !newPassword)
    return res.status(400).json({ error: 'username, currentPassword and newPassword are required' });

  if (newPassword.length < 8)
    return res.status(400).json({ error: 'New password must be at least 8 characters' });

  const { data: user, error } = await supabase
    .from('admin_users')
    .select('id, password_hash')
    .eq('username', username)
    .eq('is_active', true)
    .single();

  if (error || !user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

  const hash = await bcrypt.hash(newPassword, 10);
  const { error: updateError } = await supabase
    .from('admin_users')
    .update({ password_hash: hash, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (updateError) throw updateError;

  return res.json({ success: true, message: 'Password updated successfully' });
};

const setup2fa: Action = async (req, res, supabase) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  const { data: user, error } = await supabase
    .from('admin_users')
    .select('id, password_hash, totp_enabled')
    .eq('username', username)
    .eq('is_active', true)
    .single();

  if (error || !user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  if (user.totp_enabled) return res.status(400).json({ error: '2FA is already enabled. Disable it first.' });

  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(username, 'The Kaash Journal Admin', secret);

  // Stored as pending: 2FA is only switched on after the code is verified
  await supabase
    .from('admin_users')
    .update({ totp_secret: secret })
    .eq('id', user.id);

  return res.json({ success: true, secret, otpauthUrl });
};

const verify2fa: Action = async (req, res, supabase) => {
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
};

const disable2fa: Action = async (req, res, supabase) => {
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
};

const actions: Record<string, Action> = {
  login,
  'create-admin': createAdmin,
  'change-password': changePassword,
  'setup-2fa': setup2fa,
  'verify-2fa': verify2fa,
  'disable-2fa': disable2fa,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = actions[String(req.query.action)];
  if (!action) return res.status(404).json({ error: 'Not found' });

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    return await action(req, res, createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY));
  } catch (err: any) {
    console.error('Auth error:', err);
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
