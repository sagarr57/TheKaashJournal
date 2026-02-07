// API endpoint to create admin user (one-time setup)
// This should be protected or removed after creating your first admin
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { username, password, email, full_name } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
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
  } catch (error: any) {
    console.error('Create admin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
