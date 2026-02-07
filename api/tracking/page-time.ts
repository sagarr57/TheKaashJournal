// API endpoint to update time spent on page
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

    const { session_id, page_path, view_time_seconds } = req.body;

    if (!session_id || !page_path || view_time_seconds === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update the most recent page view for this session and page
    const { data: existingView, error: fetchError } = await supabase
      .from('page_views')
      .select('id')
      .eq('session_id', session_id)
      .eq('page_path', page_path)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching page view:', fetchError);
    }

    if (existingView) {
      // Update existing page view
      const { error: updateError } = await supabase
        .from('page_views')
        .update({
          view_time_seconds,
          is_bounce: false, // User is still on page, not a bounce
        })
        .eq('id', existingView.id);

      if (updateError) {
        console.error('Error updating page view:', updateError);
        return res.status(500).json({ error: 'Failed to update page view' });
      }
    }

    return res.json({ success: true });
  } catch (error: any) {
    console.error('Page time tracking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
