import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { RefreshCw, Search, BarChart2, AlertCircle } from "lucide-react";
import { getAdminToken, logout } from "../auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

type Totals = Record<string, number>;
interface GaReport {
  configured: boolean;
  error?: string;
  period?: { current: string[] };
  totals?: { current: Totals; previous: Totals };
  daily?: { date: string; users: number; views: number }[];
  pages?: { path: string; views: number; users: number; engagementSeconds: number }[];
  channels?: { channel: string; sessions: number }[];
}
interface GscReport {
  configured: boolean;
  error?: string;
  site?: string;
  period?: { current: string[] };
  totals?: { current: Totals; previous: Totals };
  daily?: { date: string; clicks: number; impressions: number }[];
  queries?: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
  pages?: { page: string; clicks: number; impressions: number; ctr: number; position: number }[];
}
interface Reports { ga: GaReport; gsc: GscReport; fetchedAt: string }

const fmt = (n: number) => Math.round(n).toLocaleString("en-GB");
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const secs = (n: number) => (n >= 60 ? `${Math.floor(n / 60)}m ${Math.round(n % 60)}s` : `${Math.round(n)}s`);
const shortDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const path = (url: string) => { try { return new URL(url).pathname; } catch { return url; } };

function Change({ now, before, invert = false }: { now: number; before: number; invert?: boolean }) {
  if (!before) return <span className="text-xs text-slate-400">no earlier data</span>;
  const change = ((now - before) / before) * 100;
  const good = invert ? change <= 0 : change >= 0;
  return (
    <span className={`text-xs font-medium ${good ? "text-emerald-600" : "text-red-500"}`}>
      {change >= 0 ? "+" : ""}{change.toFixed(0)}% vs previous 28 days
    </span>
  );
}

function Metric({ label, value, change }: { label: string; value: string; change?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 leading-none mb-1.5">{value}</p>
      {change}
    </div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex gap-3">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <div><p className="font-semibold mb-1">{title}</p>{children}</div>
    </div>
  );
}

const SETUP = (
  <ol className="list-decimal pl-5 space-y-1 text-xs leading-relaxed">
    <li>In Google Cloud, enable the Google Analytics Data API and the Google Search Console API.</li>
    <li>Create a service account and download its JSON key.</li>
    <li>Add the service account's email as a Viewer in Analytics (Admin → Property access management) and as a user in Search Console (Settings → Users and permissions).</li>
    <li>In Vercel, set <code>GA_CREDENTIALS</code> (the JSON), <code>GA_PROPERTY_ID</code> (533563572) and optionally <code>GSC_SITE_URL</code>, then redeploy.</li>
  </ol>
);

export function GooglePanel() {
  const [data, setData] = useState<Reports | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState("");

  const load = async (fresh = false) => {
    setLoading(true); setFailed("");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/google${fresh ? "?fresh=1" : ""}`, { headers: { Authorization: `Bearer ${getAdminToken()}` } });
      if (res.status === 401) { logout(); return; }
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setData(await res.json());
    } catch (err: any) {
      setFailed(err?.message || "Could not load Google data");
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const ga = data?.ga; const gsc = data?.gsc;
  const gaOk = ga?.configured && !ga.error && ga.totals;
  const gscOk = gsc?.configured && !gsc.error && gsc.totals;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-semibold text-slate-900">Google data</h2>
          <p className="text-xs text-slate-500">
            Google Analytics: last 28 days to yesterday. Search Console: 28 days ending 3 days ago (its data lags).
          </p>
        </div>
        <button onClick={() => load(true)} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh from Google
        </button>
      </div>

      {failed && <Notice title="Could not reach the dashboard API">{failed}</Notice>}
      {loading && !data && <div className="py-10 text-center text-sm text-slate-400">Loading Google Analytics and Search Console…</div>}

      {data && (!ga?.configured || !gsc?.configured) && (
        <Notice title="Google Analytics and Search Console are not connected yet">{SETUP}</Notice>
      )}
      {ga?.error && <Notice title="Google Analytics returned an error">{ga.error}</Notice>}
      {gsc?.error && <Notice title={`Search Console returned an error (${gsc.site})`}>{gsc.error}</Notice>}

      {gaOk && (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <Metric label="Users" value={fmt(ga.totals!.current.activeUsers)} change={<Change now={ga.totals!.current.activeUsers} before={ga.totals!.previous.activeUsers} />} />
            <Metric label="Page views" value={fmt(ga.totals!.current.screenPageViews)} change={<Change now={ga.totals!.current.screenPageViews} before={ga.totals!.previous.screenPageViews} />} />
            <Metric label="Avg engagement / user" value={secs(ga.totals!.current.activeUsers ? ga.totals!.current.userEngagementDuration / ga.totals!.current.activeUsers : 0)} change={<Change now={ga.totals!.current.userEngagementDuration / (ga.totals!.current.activeUsers || 1)} before={ga.totals!.previous.userEngagementDuration / (ga.totals!.previous.activeUsers || 1)} />} />
            <Metric label="Newsletter signups" value={fmt(ga.totals!.current.signups)} change={<Change now={ga.totals!.current.signups} before={ga.totals!.previous.signups} />} />
          </div>
        </>
      )}

      {gscOk && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <Metric label="Search clicks" value={fmt(gsc.totals!.current.clicks)} change={<Change now={gsc.totals!.current.clicks} before={gsc.totals!.previous.clicks} />} />
          <Metric label="Search impressions" value={fmt(gsc.totals!.current.impressions)} change={<Change now={gsc.totals!.current.impressions} before={gsc.totals!.previous.impressions} />} />
          <Metric label="Click-through rate" value={pct(gsc.totals!.current.ctr)} change={<Change now={gsc.totals!.current.ctr} before={gsc.totals!.previous.ctr} />} />
          <Metric label="Avg position" value={gsc.totals!.current.position ? gsc.totals!.current.position.toFixed(1) : "–"} change={<Change now={gsc.totals!.current.position} before={gsc.totals!.previous.position} invert />} />
        </div>
      )}

      {(gaOk || gscOk) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {gaOk && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-blue-600" /> Users and page views per day</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={ga.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                  <Tooltip labelFormatter={(d) => shortDate(String(d))} />
                  <Line type="monotone" dataKey="users" name="Users" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="views" name="Page views" stroke="#94a3b8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {gscOk && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2"><Search className="w-4 h-4 text-emerald-600" /> Google search clicks and impressions per day</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={gsc.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="c" allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                  <YAxis yAxisId="i" orientation="right" allowDecimals={false} tick={{ fontSize: 11 }} width={36} />
                  <Tooltip labelFormatter={(d) => shortDate(String(d))} />
                  <Line yAxisId="c" type="monotone" dataKey="clicks" name="Clicks" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line yAxisId="i" type="monotone" dataKey="impressions" name="Impressions" stroke="#cbd5e1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {gaOk && !!ga.pages?.length && (
          <Table title="Top pages (Google Analytics)" head={["Page", "Views", "Users", "Engagement"]}
            rows={ga.pages!.map((p) => [p.path, fmt(p.views), fmt(p.users), secs(p.engagementSeconds)])} />
        )}
        {gaOk && !!ga.channels?.length && (
          <Table title="Where visitors come from (sessions)" head={["Channel", "Sessions"]}
            rows={ga.channels!.map((c) => [c.channel, fmt(c.sessions)])} />
        )}
        {gscOk && !!gsc.queries?.length && (
          <Table title="Top Google searches" head={["Search", "Clicks", "Impr.", "CTR", "Pos."]}
            rows={gsc.queries!.map((q) => [q.query, fmt(q.clicks), fmt(q.impressions), pct(q.ctr), q.position.toFixed(1)])} />
        )}
        {gscOk && !!gsc.pages?.length && (
          <Table title="Top pages in Google search" head={["Page", "Clicks", "Impr.", "CTR", "Pos."]}
            rows={gsc.pages!.map((p) => [path(p.page), fmt(p.clicks), fmt(p.impressions), pct(p.ctr), p.position.toFixed(1)])} />
        )}
      </div>
      {data && <p className="text-[11px] text-slate-400">Fetched {new Date(data.fetchedAt).toLocaleString("en-GB")}; refreshed from Google at most every 10 minutes.</p>}
    </section>
  );
}

function Table({ title, head, rows }: { title: string; head: string[]; rows: string[][] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden min-w-0">
      <h3 className="font-semibold text-slate-900 text-sm px-4 pt-4 pb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-slate-500 border-b border-slate-100">
            {head.map((h, i) => <th key={h} className={`px-4 py-2 font-medium ${i ? "text-right" : ""}`}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-slate-50 last:border-0">
                {r.map((cell, j) => <td key={j} className={`px-4 py-2 ${j ? "text-right tabular-nums text-slate-600 whitespace-nowrap" : "text-slate-800 max-w-[260px] truncate"}`} title={j ? undefined : cell}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
