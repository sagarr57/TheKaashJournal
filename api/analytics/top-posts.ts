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

  const limit = parseInt(req.query.limit as string) || 10;

  try {
    // TODO: Implement top posts query from GA4 or your database
    // For now, return mock data
    const mockData = Array.from({ length: limit }, (_, i) => ({
      title: `Top Post ${i + 1}`,
      views: Math.floor(Math.random() * 5000) + 1000,
      clicks: Math.floor(Math.random() * 500) + 50,
      revenue: Math.random() * 500 + 100,
    }));

    res.json(mockData);
  } catch (error) {
    console.error('Top posts API error:', error);
    res.status(500).json({ error: 'Failed to fetch top posts' });
  }
}
