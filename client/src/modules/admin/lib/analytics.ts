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
    const { data } = await supabase
      .from("redirections")
      .select("created_at")
      .eq("is_external", true)
      .gte("created_at", daysAgo(days))
      .order("created_at", { ascending: true });

    const map: Record<string, number> = {};
    (data || []).forEach((row) => {
      const key = toDateKey(row.created_at);
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
    const { data } = await supabase
      .from("page_views")
      .select("page_path, page_title")
      .gte("created_at", daysAgo(30))
      .like("page_path", "%/blog/%");

    const map: Record<string, TopPost> = {};
    (data || []).forEach((row) => {
      const path = row.page_path;
      if (!map[path]) {
        map[path] = { title: row.page_title || path.split("/").pop() || path, views: 0, clicks: 0, revenue: 0 };
      }
      map[path].views += 1;
    });

    return Object.values(map)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  } catch (err: any) {
    throw new Error(`Top Posts: ${err?.message}`);
  }
}

export async function fetchTrafficSources(): Promise<TrafficSource[]> {
  try {
    const { data } = await supabase
      .from("page_views")
      .select("referrer")
      .gte("created_at", daysAgo(30))
      .not("referrer", "is", null);

    const map: Record<string, number> = { Direct: 0 };
    (data || []).forEach((row) => {
      const ref = row.referrer as string;
      if (!ref) { map["Direct"]++; return; }
      let source = "Other";
      if (ref.includes("google")) source = "Google";
      else if (ref.includes("bing")) source = "Bing";
      else if (ref.includes("facebook") || ref.includes("fb.com")) source = "Facebook";
      else if (ref.includes("twitter") || ref.includes("x.com")) source = "Twitter/X";
      else if (ref.includes("linkedin")) source = "LinkedIn";
      else if (ref.includes("reddit")) source = "Reddit";
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
