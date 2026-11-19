// Reads Google Analytics 4 and Search Console data for the admin dashboard, using a service
// account. Env: GA_CREDENTIALS (service account JSON, raw or base64), GA_PROPERTY_ID (numeric),
// GSC_SITE_URL (e.g. "sc-domain:thekaashjournal.com" or "https://www.thekaashjournal.com/").
import { GoogleAuth } from 'google-auth-library';

type Row = Record<string, string | number>;

const DAY = 86_400_000;
const CACHE_MS = 10 * 60 * 1000;
let cache: { at: number; value: unknown } | null = null;

function credentials(): Record<string, string> | null {
  const raw = process.env.GA_CREDENTIALS?.trim();
  if (!raw) return null;
  try {
    const json = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
    const parsed = JSON.parse(json);
    if (!parsed.client_email || !parsed.private_key) return null;
    parsed.private_key = String(parsed.private_key).replace(/\\n/g, '\n');
    return parsed;
  } catch {
    return null;
  }
}

function isoDay(offsetDays: number): string {
  return new Date(Date.now() - offsetDays * DAY).toISOString().slice(0, 10);
}

async function client(scopes: string[]) {
  const creds = credentials();
  if (!creds) throw new Error('GA_CREDENTIALS is missing or is not a service account key');
  return new GoogleAuth({ credentials: creds, scopes }).getClient();
}

function errorMessage(err: any): string {
  return err?.response?.data?.error?.message || err?.message || 'Unknown error';
}

async function analytics() {
  const propertyId = process.env.GA_PROPERTY_ID?.replace(/\D/g, '');
  if (!propertyId || !credentials()) return { configured: false as const };

  try {
    const api = await client(['https://www.googleapis.com/auth/analytics.readonly']);
    const current = { startDate: '28daysAgo', endDate: 'yesterday', name: 'current' };
    const previous = { startDate: '56daysAgo', endDate: '29daysAgo', name: 'previous' };
    const totalsMetrics = ['activeUsers', 'sessions', 'screenPageViews', 'userEngagementDuration', 'engagedSessions'];

    const { data }: any = await api.request({
      url: `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
      method: 'POST',
      data: {
        requests: [
          { dateRanges: [current, previous], metrics: totalsMetrics.map((name) => ({ name })) },
          {
            dateRanges: [current],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
            orderBys: [{ dimension: { dimensionName: 'date' } }],
          },
          {
            dateRanges: [current],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'userEngagementDuration' }],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 20,
          },
          {
            dateRanges: [current],
            dimensions: [{ name: 'sessionDefaultChannelGroup' }],
            metrics: [{ name: 'sessions' }],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          },
          {
            dateRanges: [current, previous],
            dimensions: [{ name: 'eventName' }],
            metrics: [{ name: 'eventCount' }],
            dimensionFilter: { filter: { fieldName: 'eventName', stringFilter: { value: 'newsletter_subscribe' } } },
          },
        ],
      },
    });

    const [totals, daily, pages, channels, signups] = data.reports;
    const metricsFor = (report: any, range: string) => {
      const row = (report.rows || []).find((r: any) => r.dimensionValues?.some((d: any) => d.value === range));
      return Object.fromEntries(totalsMetrics.map((m, i) => [m, Number(row?.metricValues?.[i]?.value || 0)]));
    };
    const signupsFor = (range: string) =>
      Number((signups.rows || []).find((r: any) => r.dimensionValues?.some((d: any) => d.value === range))?.metricValues?.[0]?.value || 0);

    return {
      configured: true as const,
      period: { current: [isoDay(28), isoDay(1)], previous: [isoDay(56), isoDay(29)] },
      totals: { current: { ...metricsFor(totals, 'current'), signups: signupsFor('current') }, previous: { ...metricsFor(totals, 'previous'), signups: signupsFor('previous') } },
      daily: (daily.rows || []).map((r: any): Row => {
        const d = r.dimensionValues[0].value;
        return { date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, users: Number(r.metricValues[0].value), views: Number(r.metricValues[1].value) };
      }),
      pages: (pages.rows || []).map((r: any): Row => ({
        path: r.dimensionValues[0].value,
        views: Number(r.metricValues[0].value),
        users: Number(r.metricValues[1].value),
        engagementSeconds: Number(r.metricValues[1].value) ? Math.round(Number(r.metricValues[2].value) / Number(r.metricValues[1].value)) : 0,
      })),
      channels: (channels.rows || []).map((r: any): Row => ({ channel: r.dimensionValues[0].value, sessions: Number(r.metricValues[0].value) })),
    };
  } catch (err) {
    return { configured: true as const, error: errorMessage(err) };
  }
}

async function searchConsole() {
  const site = process.env.GSC_SITE_URL?.trim() || 'sc-domain:thekaashjournal.com';
  if (!credentials()) return { configured: false as const };

  try {
    const api = await client(['https://www.googleapis.com/auth/webmasters.readonly']);
    const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
    // Search Console data lags by about two days.
    const current = { startDate: isoDay(30), endDate: isoDay(3) };
    const previous = { startDate: isoDay(58), endDate: isoDay(31) };
    const query = async (body: Record<string, unknown>) => ((await api.request({ url, method: 'POST', data: body })) as any).data.rows || [];

    const [totalNow, totalBefore, byDate, byQuery, byPage] = await Promise.all([
      query({ ...current }),
      query({ ...previous }),
      query({ ...current, dimensions: ['date'] }),
      query({ ...current, dimensions: ['query'], rowLimit: 25 }),
      query({ ...current, dimensions: ['page'], rowLimit: 25 }),
    ]);
    const totals = (rows: any[]) => ({
      clicks: rows[0]?.clicks || 0,
      impressions: rows[0]?.impressions || 0,
      ctr: rows[0]?.ctr || 0,
      position: rows[0]?.position || 0,
    });
    const row = (key: string) => (r: any): Row => ({ [key]: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position });

    return {
      configured: true as const,
      site,
      period: { current: [current.startDate, current.endDate], previous: [previous.startDate, previous.endDate] },
      totals: { current: totals(totalNow), previous: totals(totalBefore) },
      daily: byDate.map((r: any): Row => ({ date: r.keys[0], clicks: r.clicks, impressions: r.impressions })),
      queries: byQuery.map(row('query')),
      pages: byPage.map(row('page')),
    };
  } catch (err) {
    return { configured: true as const, site, error: errorMessage(err) };
  }
}

export async function googleReports(fresh = false) {
  if (!fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  const [ga, gsc] = await Promise.all([analytics(), searchConsole()]);
  const value = { ga, gsc, fetchedAt: new Date().toISOString() };
  if (!('error' in ga) && !('error' in gsc)) cache = { at: Date.now(), value };
  return value;
}
