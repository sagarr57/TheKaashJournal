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

  try {
    // TODO: Implement traffic sources query from GA4
    // For now, return mock data
    const mockData = [
      { name: 'Organic Search', value: 45, color: '#0066FF' },
      { name: 'Direct', value: 25, color: '#10B981' },
      { name: 'Social Media', value: 20, color: '#F59E0B' },
      { name: 'Referral', value: 10, color: '#EF4444' },
    ];

    res.json(mockData);
  } catch (error) {
    console.error('Traffic sources API error:', error);
    res.status(500).json({ error: 'Failed to fetch traffic sources' });
  }
}
