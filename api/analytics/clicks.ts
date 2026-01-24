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

  const days = parseInt(req.query.days as string) || 30;

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
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    // Track clicks from events (button clicks, link clicks, etc.)
    const [response] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: startDate.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
        },
      ],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            matchType: 'CONTAINS',
            value: 'click',
            caseSensitive: false,
          },
        },
      },
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    const data = response.rows?.map((row) => {
      const dateStr = row.dimensionValues?.[0]?.value || '';
      const date = new Date(
        parseInt(dateStr.substring(0, 4)),
        parseInt(dateStr.substring(4, 6)) - 1,
        parseInt(dateStr.substring(6, 8))
      );
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: parseInt(row.metricValues?.[0]?.value || '0'),
      };
    }) || [];

    res.json(data);
  } catch (error) {
    console.error('Clicks API error:', error);
    res.json([]);
  }
}
