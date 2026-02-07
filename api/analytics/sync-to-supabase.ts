// Vercel Serverless Function to sync GA4 data to Supabase
// This should be called daily via cron job or manually from admin dashboard

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get environment variables
    const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;
    const GA_CREDENTIALS = process.env.GA_CREDENTIALS;
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!GA_PROPERTY_ID || !GA_CREDENTIALS) {
      return res.status(500).json({ error: 'Google Analytics not configured' });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // Initialize clients
    let credentials;
    try {
      credentials = JSON.parse(GA_CREDENTIALS);
    } catch {
      return res.status(500).json({ error: 'Invalid GA credentials format' });
    }

    const analyticsClient = new BetaAnalyticsDataClient({ credentials });
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get date range (default: yesterday, or from query params)
    const targetDate = req.body?.date || req.query?.date;
    let date: Date;
    
    if (targetDate) {
      date = new Date(targetDate);
    } else {
      // Default to yesterday
      date = new Date();
      date.setDate(date.getDate() - 1);
    }

    const dateString = date.toISOString().split('T')[0];
    const startDate = dateString;
    const endDate = dateString;

    // Fetch data from GA4
    const propertyId = `properties/${GA_PROPERTY_ID}`;
    
    const [response] = await analyticsClient.runReport({
      property: propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'eventCount' },
        { name: 'totalRevenue' },
      ],
    });

    // Get newsletter subscribers count (from conversions)
    const [subscribersResponse] = await analyticsClient.runReport({
      property: propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            matchType: 'EXACT',
            value: 'newsletter_subscribe',
          },
        },
      },
    });

    // Calculate totals
    const visitors = response.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    ) || 0;

    const clicks = response.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[1]?.value || '0'),
      0
    ) || 0;

    const revenue = response.rows?.reduce(
      (sum, row) => sum + parseFloat(row.metricValues?.[2]?.value || '0'),
      0
    ) || 0;

    const subscribers = subscribersResponse.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    ) || 0;

    // Store in Supabase
    const { error: supabaseError } = await supabase
      .from('analytics_daily')
      .upsert(
        {
          date: dateString,
          visitors,
          clicks,
          revenue,
          subscribers,
        },
        {
          onConflict: 'date',
        }
      );

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return res.status(500).json({ error: 'Failed to store in Supabase', details: supabaseError.message });
    }

    return res.json({
      success: true,
      date: dateString,
      data: {
        visitors,
        clicks,
        revenue,
        subscribers,
      },
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    return res.status(500).json({ 
      error: 'Failed to sync analytics data', 
      details: error.message 
    });
  }
}
