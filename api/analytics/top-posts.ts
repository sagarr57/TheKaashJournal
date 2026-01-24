import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;
    const GA_CREDENTIALS = process.env.GA_CREDENTIALS;

    if (!GA_PROPERTY_ID || !GA_CREDENTIALS) {
      return res.json([]);
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

    // Fetch top pages by page views, clicks, and revenue
    const [response] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: thirtyDaysAgo.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
        },
      ],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'eventCount' },
        { name: 'totalRevenue' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'CONTAINS',
            value: '/blog/',
            caseSensitive: false,
          },
        },
      },
      orderBys: [
        {
          metric: { metricName: 'screenPageViews' },
          desc: true,
        },
      ],
      limit,
    });

    const data = response.rows?.map((row) => {
      const pageTitle = row.dimensionValues?.[1]?.value || 'Untitled Post';
      const views = parseInt(row.metricValues?.[0]?.value || '0');
      const clicks = parseInt(row.metricValues?.[1]?.value || '0');
      const revenue = parseFloat(row.metricValues?.[2]?.value || '0');

      return {
        title: pageTitle,
        views,
        clicks,
        revenue,
      };
    }) || [];

    res.json(data);
  } catch (error) {
    console.error('Top posts API error:', error);
    res.json([]);
  }
}
