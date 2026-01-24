import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    // TODO: Implement revenue tracking from conversions/affiliate links
    // For now, return mock data
    const mockData = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.floor(Math.random() * 2000) + 500,
      };
    });

    res.json(mockData);
  } catch (error) {
    console.error('Revenue API error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
}
