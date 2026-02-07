// Local dev server for API routes
// Run: node server.js (in a separate terminal)

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials!');
  console.error('\nCurrent values:');
  console.error('VITE_SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing');
  console.error('\nMake sure your .env file has:');
  console.error('VITE_SUPABASE_URL=https://zvlwzxsrpychzaijksvb.supabase.co');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  console.error('\nGet service role key from: Supabase → Settings → API → service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Fetch user from database
    const { data: user, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (fetchError || !user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create admin endpoint
app.post('/api/auth/create-admin', async (req, res) => {
  try {
    const { username, password, email, full_name } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if username exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

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
  } catch (error) {
    console.error('Create admin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics Overview
app.get('/api/analytics/overview', async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);

    const currentStart = thirtyDaysAgo.toISOString().split('T')[0];
    const currentEnd = today.toISOString().split('T')[0];
    const previousStart = sixtyDaysAgo.toISOString().split('T')[0];
    const previousEnd = thirtyDaysAgo.toISOString().split('T')[0];

    // Fetch current period
    const { data: currentData } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('date', currentStart)
      .lte('date', currentEnd);

    // Fetch previous period
    const { data: previousData } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('date', previousStart)
      .lte('date', previousEnd);

    // Get actual subscriber count from newsletter_subscribers table
    const { count: currentSubscribersCount } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .is('unsubscribed_at', null)
      .gte('subscribed_at', currentStart);

    const { count: previousSubscribersCount } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .is('unsubscribed_at', null)
      .gte('subscribed_at', previousStart)
      .lt('subscribed_at', previousEnd);

    // Calculate totals
    const current = {
      visitors: currentData?.reduce((sum, row) => sum + (row.visitors || 0), 0) || 0,
      clicks: currentData?.reduce((sum, row) => sum + (row.clicks || 0), 0) || 0,
      revenue: currentData?.reduce((sum, row) => sum + (row.revenue || 0), 0) || 0,
      subscribers: currentSubscribersCount || 0,
    };

    const previous = {
      visitors: previousData?.reduce((sum, row) => sum + (row.visitors || 0), 0) || 0,
      clicks: previousData?.reduce((sum, row) => sum + (row.clicks || 0), 0) || 0,
      revenue: previousData?.reduce((sum, row) => sum + (row.revenue || 0), 0) || 0,
      subscribers: previousSubscribersCount || 0,
    };

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    };

    res.json({
      visitors: current.visitors,
      subscribers: current.subscribers,
      clicks: current.clicks,
      revenue: current.revenue,
      visitorsChange: calculateChange(current.visitors, previous.visitors),
      subscribersChange: calculateChange(current.subscribers, previous.subscribers),
      clicksChange: calculateChange(current.clicks, previous.clicks),
      revenueChange: calculateChange(current.revenue, previous.revenue),
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.json({
      visitors: 0,
      subscribers: 0,
      clicks: 0,
      revenue: 0,
      visitorsChange: 0,
      subscribersChange: 0,
      clicksChange: 0,
      revenueChange: 0,
    });
  }
});

// Visitors Chart Data
app.get('/api/analytics/visitors', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    const { data } = await supabase
      .from('analytics_daily')
      .select('date, visitors')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    const chartData = (data || []).map((row) => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: row.visitors || 0,
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Visitors data error:', error);
    res.json([]);
  }
});

// Clicks Chart Data
app.get('/api/analytics/clicks', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    const { data } = await supabase
      .from('analytics_daily')
      .select('date, clicks')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    const chartData = (data || []).map((row) => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: row.clicks || 0,
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Clicks data error:', error);
    res.json([]);
  }
});

// Revenue Chart Data
app.get('/api/analytics/revenue', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    const { data } = await supabase
      .from('analytics_daily')
      .select('date, revenue')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    const chartData = (data || []).map((row) => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: row.revenue || 0,
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Revenue data error:', error);
    res.json([]);
  }
});

// Top Posts
app.get('/api/analytics/top-posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Get page views grouped by page_path
    const { data } = await supabase
      .from('page_views')
      .select('page_path, page_title')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .like('page_path', '%/blog/%');

    // Aggregate by page_path
    const pageStats = {};
    (data || []).forEach((row) => {
      const path = row.page_path;
      if (!pageStats[path]) {
        pageStats[path] = {
          title: row.page_title || 'Untitled Post',
          views: 0,
          clicks: 0,
          revenue: 0,
        };
      }
      pageStats[path].views += 1;
    });

    // Convert to array and sort by views
    const topPosts = Object.values(pageStats)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    res.json(topPosts);
  } catch (error) {
    console.error('Top posts error:', error);
    res.json([]);
  }
});

// Traffic Sources
app.get('/api/analytics/traffic-sources', async (req, res) => {
  try {
    // Get traffic sources from page_views or events table
    // For now, return empty array as we need to track referrer in page_views
    res.json([]);
  } catch (error) {
    console.error('Traffic sources error:', error);
    res.json([]);
  }
});

// Newsletter Subscribers - Get all
app.get('/api/subscribers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Subscribers fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch subscribers' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Subscribers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Newsletter Subscribers - Create (server-side, uses service role key)
app.post('/api/subscribers', async (req, res) => {
  try {
    const { email, source } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.trim(),
        source: source || 'unknown',
        subscribed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        return res.json({
          success: true,
          message: 'Already subscribed',
          data: null,
        });
      }
      console.error('Subscriber insert error:', error);
      return res.status(500).json({ error: 'Failed to save subscriber' });
    }

    res.json({
      success: true,
      message: 'Subscriber saved',
      data,
    });
  } catch (error) {
    console.error('Subscriber create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sync Brevo subscribers to Supabase
app.post('/api/subscribers/sync-brevo', async (req, res) => {
  try {
    const BREVO_API_KEY = process.env.VITE_BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.VITE_BREVO_LIST_ID;

    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
      return res.status(400).json({ error: 'Brevo API key or list ID not configured' });
    }

    // Fetch contacts from Brevo
    const brevoResponse = await fetch(`https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}/contacts?limit=1000`, {
      headers: {
        'api-key': BREVO_API_KEY,
      },
    });

    if (!brevoResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch from Brevo' });
    }

    const brevoData = await brevoResponse.json();
    const contacts = brevoData.contacts || [];

    // Insert/update in Supabase
    const subscribers = contacts.map((contact) => ({
      email: contact.email,
      source: 'brevo_sync',
      subscribed_at: contact.createdAt || new Date().toISOString(),
    }));

    // Upsert to avoid duplicates
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .upsert(subscribers, {
        onConflict: 'email',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error('Sync error:', error);
      return res.status(500).json({ error: 'Failed to sync to Supabase' });
    }

    res.json({
      success: true,
      synced: subscribers.length,
      message: `Synced ${subscribers.length} subscribers from Brevo`,
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📝 Login endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log(`📊 Analytics endpoints available`);
  console.log(`📧 Subscribers endpoint: http://localhost:${PORT}/api/subscribers`);
});
