// API endpoint to track page views
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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

    const { session_id, page_path, page_title, referrer, user_agent, device_type, browser } = req.body;

    if (!session_id || !page_path) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await supabase
      .from('page_views')
      .insert({
        session_id,
        page_path,
        page_title: page_title || null,
        referrer: referrer || null,
        user_agent: user_agent || null,
        device_type: device_type || null,
        browser: browser || null,
        view_time_seconds: 0, // Will be updated by page-time endpoint
        is_bounce: true, // Will be updated if user interacts
      });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to store page view' });
    }

    return res.json({ success: true });
  } catch (error: any) {
    console.error('Page view tracking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
