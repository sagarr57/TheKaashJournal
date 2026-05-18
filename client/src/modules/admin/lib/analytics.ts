// Analytics — reads directly from Supabase page_views, events, conversions tables
import type { AnalyticsData, ChartDataPoint, TopPost, TrafficSource } from "../types";
import { supabase } from "@/lib/supabase";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function toDateKey(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function fetchAnalyticsOverview(): Promise<AnalyticsData> {
  try {
    const [
      { count: currentViews },
      { count: prevViews },
      { count: totalSubscribers },
      { count: newSubscribers },
      { count: prevSubscribers },
      { count: currentClicks },
      { count: prevClicks },
    ] = await Promise.all([
      // Page views last 30 days
      supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", daysAgo(30)),
      // Page views prev 30 days
      supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", daysAgo(60)).lt("created_at", daysAgo(30)),
      // Total active subscribers
      supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).is("unsubscribed_at", null),
      // New subscribers last 30 days
      supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).is("unsubscribed_at", null).gte("subscribed_at", daysAgo(30)),
      // New subscribers prev 30 days
      supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).is("unsubscribed_at", null).gte("subscribed_at", daysAgo(60)).lt("subscribed_at", daysAgo(30)),
      // Outbound clicks last 30 days
      supabase.from("redirections").select("*", { count: "exact", head: true }).eq("is_external", true).gte("created_at", daysAgo(30)),
      // Outbound clicks prev 30 days
      supabase.from("redirections").select("*", { count: "exact", head: true }).eq("is_external", true).gte("created_at", daysAgo(60)).lt("created_at", daysAgo(30)),
    ]);

    const pct = (curr: number, prev: number) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 1000) / 10;

    return {
      visitors: currentViews ?? 0,
      subscribers: totalSubscribers ?? 0,
      clicks: currentClicks ?? 0,
      revenue: 0, // AdSense revenue not available via API yet
      visitorsChange: pct(currentViews ?? 0, prevViews ?? 0),
      subscribersChange: pct(newSubscribers ?? 0, prevSubscribers ?? 0),
      clicksChange: pct(currentClicks ?? 0, prevClicks ?? 0),
      revenueChange: 0,
    };
  } catch (err: any) {
    throw new Error(`Analytics Overview: ${err?.message}`);
  }
}

export async function fetchVisitorsData(days: number = 30): Promise<ChartDataPoint[]> {
  try {
    const { data } = await supabase
      .from("page_views")
      .select("created_at")
      .gte("created_at", daysAgo(days))
      .order("created_at", { ascending: true });

    // Group by date
    const map: Record<string, number> = {};
    (data || []).forEach((row) => {
      const key = toDateKey(row.created_at);
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map).map(([date, value]) => ({ date, value }));
  } catch (err: any) {
    throw new Error(`Visitors Data: ${err?.message}`);
  }
}

export async function fetchClicksData(days: number = 30): Promise<ChartDataPoint[]> {
  try {
    // Combine external redirections + all click events for a full clicks picture
    const [rdRes, evRes] = await Promise.all([
      supabase.from("redirections").select("created_at").eq("is_external", true).gte("created_at", daysAgo(days)),
      supabase.from("events").select("created_at").eq("event_type", "click").gte("created_at", daysAgo(days)),
    ]);

    // Collect all timestamps, sort by date, then group
    const all = [
      ...(rdRes.data || []).map((r) => r.created_at as string),
      ...(evRes.data || []).map((r) => r.created_at as string),
    ].sort();

    const map: Record<string, number> = {};
    all.forEach((iso) => {
      const key = toDateKey(iso);
      map[key] = (map[key] ?? 0) + 1;
    });

    return Object.entries(map).map(([date, value]) => ({ date, value }));
  } catch (err: any) {
    throw new Error(`Clicks Data: ${err?.message}`);
  }
}

export async function fetchRevenueData(_days: number = 30): Promise<ChartDataPoint[]> {
  // AdSense revenue API not integrated — return empty so chart shows "no data" placeholder
  return [];
}

export async function fetchTopPosts(limit: number = 10): Promise<TopPost[]> {
  try {
    const [pvRes, evRes, rdRes] = await Promise.all([
      // Page views per blog path
      supabase.from("page_views").select("page_path").gte("created_at", daysAgo(30)).like("page_path", "%/blog/%"),
      // Click events on blog pages
      supabase.from("events").select("page_path").eq("event_type", "click").gte("created_at", daysAgo(30)).like("page_path", "%/blog/%"),
      // Outbound redirections originating from blog pages
      supabase.from("redirections").select("source_url").eq("is_external", true).gte("created_at", daysAgo(30)),
    ]);

    // Count views per path
    const viewCounts: Record<string, number> = {};
    (pvRes.data || []).forEach((r) => {
      viewCounts[r.page_path] = (viewCounts[r.page_path] ?? 0) + 1;
    });

    if (Object.keys(viewCounts).length === 0) return [];

    // Count clicks per path (events)
    const clickCounts: Record<string, number> = {};
    (evRes.data || []).forEach((r) => {
      if (!r.page_path) return;
      clickCounts[r.page_path] = (clickCounts[r.page_path] ?? 0) + 1;
    });

    // Count clicks from redirections — extract path from source_url
    (rdRes.data || []).forEach((r) => {
      try {
        const path = new URL(r.source_url).pathname;
        if (path.includes("/blog/")) {
          clickCounts[path] = (clickCounts[path] ?? 0) + 1;
        }
      } catch { /* ignore malformed URLs */ }
    });

    // Extract slugs and cross-reference blog_posts for real titles
    const slugs = Object.keys(viewCounts).map((p) =>
      p.replace(/^\/blog\//, "").replace(/\/$/, "")
    );

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, title")
      .in("slug", slugs);

    const slugToTitle: Record<string, string> = {};
    (posts || []).forEach((p) => { slugToTitle[p.slug] = p.title; });

    return Object.entries(viewCounts)
      .map(([path, views]) => {
        const slug = path.replace(/^\/blog\//, "").replace(/\/$/, "");
        return {
          title: slugToTitle[slug] || slug,
          slug,
          views,
          clicks: clickCounts[path] ?? 0,
          revenue: 0,
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  } catch (err: any) {
    throw new Error(`Top Posts: ${err?.message}`);
  }
}

export async function fetchTrafficSources(): Promise<TrafficSource[]> {
  try {
    // Fetch all page views including null referrers (= Direct traffic)
    const { data } = await supabase
      .from("page_views")
      .select("referrer")
      .gte("created_at", daysAgo(30));

    const map: Record<string, number> = {};
    (data || []).forEach((row) => {
      const ref = row.referrer as string | null;
      let source = "Direct";
      if (ref) {
        if (ref.includes("google")) source = "Google";
        else if (ref.includes("bing")) source = "Bing";
        else if (ref.includes("facebook") || ref.includes("fb.com")) source = "Facebook";
        else if (ref.includes("twitter") || ref.includes("x.com")) source = "Twitter/X";
        else if (ref.includes("linkedin")) source = "LinkedIn";
        else if (ref.includes("reddit")) source = "Reddit";
        else source = "Other";
      }
      map[source] = (map[source] ?? 0) + 1;
    });

    const colors: Record<string, string> = {
      Direct: "#6366f1", Google: "#0066FF", Bing: "#00a2ed",
      Facebook: "#1877f2", "Twitter/X": "#000000", LinkedIn: "#0a66c2",
      Reddit: "#ff4500", Other: "#9ca3af",
    };

    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value, color: colors[name] ?? "#9ca3af" }));
  } catch {
    return [];
  }
}

export interface Subscriber {
  id: string;
  email: string;
  source?: string;
  subscribed_at: string;
  unsubscribed_at?: string;
  created_at: string;
}

export async function fetchSubscribers(): Promise<Subscriber[]> {
  try {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  } catch (err: any) {
    throw new Error(`Subscribers: ${err?.message}`);
  }
}
