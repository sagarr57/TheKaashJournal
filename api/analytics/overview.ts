// Vercel Serverless Function for Analytics Overview
// Fetches real-time data from Google Analytics 4

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;
    const GA_CREDENTIALS = process.env.GA_CREDENTIALS;

    if (!GA_PROPERTY_ID || !GA_CREDENTIALS) {
      // Return zeros if not configured - dashboard will show empty state
      return res.json({
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

    let credentials;
    try {
      credentials = JSON.parse(GA_CREDENTIALS);
    } catch {
      return res.status(500).json({ error: 'Invalid GA credentials format' });
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials,
    });

    const propertyId = `properties/${GA_PROPERTY_ID}`;
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);

    // Fetch current period data (last 30 days)
    const [currentResponse] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: thirtyDaysAgo.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
        },
      ],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'eventCount' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
      ],
    });

    // Fetch previous period data (30-60 days ago) for comparison
    const [previousResponse] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: sixtyDaysAgo.toISOString().split('T')[0],
          endDate: thirtyDaysAgo.toISOString().split('T')[0],
        },
      ],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'eventCount' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
      ],
    });

    // Calculate totals for current period
    const currentVisitors = currentResponse.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    ) || 0;

    const currentClicks = currentResponse.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[1]?.value || '0'),
      0
    ) || 0;

    const currentRevenue = currentResponse.rows?.reduce(
      (sum, row) => sum + parseFloat(row.metricValues?.[3]?.value || '0'),
      0
    ) || 0;

    // Calculate totals for previous period
    const previousVisitors = previousResponse.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    ) || 0;

    const previousClicks = previousResponse.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[1]?.value || '0'),
      0
    ) || 0;

    const previousRevenue = previousResponse.rows?.reduce(
      (sum, row) => sum + parseFloat(row.metricValues?.[3]?.value || '0'),
      0
    ) || 0;

    // Calculate percentage changes
    const visitorsChange = previousVisitors > 0
      ? ((currentVisitors - previousVisitors) / previousVisitors) * 100
      : 0;
    const clicksChange = previousClicks > 0
      ? ((currentClicks - previousClicks) / previousClicks) * 100
      : 0;
    const revenueChange = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    // Fetch newsletter subscribers from conversions (custom event)
    // This assumes you have a 'newsletter_signup' conversion event set up in GA4
    const [subscribersResponse] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: thirtyDaysAgo.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
        },
      ],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            matchType: 'EXACT',
            value: 'newsletter_signup',
          },
        },
      },
    });

    const currentSubscribers = subscribersResponse.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    ) || 0;

    // Previous period subscribers
    const [prevSubscribersResponse] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: sixtyDaysAgo.toISOString().split('T')[0],
          endDate: thirtyDaysAgo.toISOString().split('T')[0],
        },
      ],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            matchType: 'EXACT',
            value: 'newsletter_signup',
          },
        },
      },
    });

    const previousSubscribers = prevSubscribersResponse.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    ) || 0;

    const subscribersChange = previousSubscribers > 0
      ? ((currentSubscribers - previousSubscribers) / previousSubscribers) * 100
      : 0;

    res.json({
      visitors: currentVisitors,
      subscribers: currentSubscribers,
      clicks: currentClicks,
      revenue: currentRevenue,
      visitorsChange: Math.round(visitorsChange * 10) / 10,
      subscribersChange: Math.round(subscribersChange * 10) / 10,
      clicksChange: Math.round(clicksChange * 10) / 10,
      revenueChange: Math.round(revenueChange * 10) / 10,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    // Return zeros on error - dashboard will show empty state
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
}
