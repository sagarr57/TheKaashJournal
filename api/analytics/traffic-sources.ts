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

    const [response] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: thirtyDaysAgo.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
        },
      ],
      dimensions: [{ name: 'sessionSourceMedium' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [
        {
          metric: { metricName: 'sessions' },
          desc: true,
        },
      ],
      limit: 10,
    });

    // Color mapping for common traffic sources
    const colorMap: Record<string, string> = {
      'google / organic': '#0066FF',
      'google / cpc': '#4285F4',
      '(direct) / (none)': '#10B981',
      'facebook / referral': '#1877F2',
      'twitter / referral': '#1DA1F2',
      'linkedin / referral': '#0077B5',
      'youtube / referral': '#FF0000',
    };

    const totalSessions = response.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    ) || 1;

    const data = response.rows?.map((row) => {
      const sourceMedium = row.dimensionValues?.[0]?.value || 'unknown';
      const sessions = parseInt(row.metricValues?.[0]?.value || '0');
      const percentage = (sessions / totalSessions) * 100;

      // Extract source name
      const [source] = sourceMedium.split(' / ');
      const sourceName = source === '(direct)' ? 'Direct' : 
                        source === 'google' && sourceMedium.includes('organic') ? 'Organic Search' :
                        source === 'google' && sourceMedium.includes('cpc') ? 'Google Ads' :
                        source === 'facebook' ? 'Social Media' :
                        source === 'twitter' ? 'Social Media' :
                        source === 'linkedin' ? 'Social Media' :
                        sourceMedium.includes('referral') ? 'Referral' :
                        source;

      return {
        name: sourceName,
        value: Math.round(percentage),
        color: colorMap[sourceMedium.toLowerCase()] || '#6366F1',
      };
    }) || [];

    // Group by source name and sum percentages
    const grouped = data.reduce((acc, item) => {
      const existing = acc.find((i) => i.name === item.name);
      if (existing) {
        existing.value += item.value;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, [] as typeof data);

    res.json(grouped);
  } catch (error) {
    console.error('Traffic sources API error:', error);
    res.json([]);
  }
}
