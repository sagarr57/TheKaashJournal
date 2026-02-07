// Analytics API client for admin module
// Uses Supabase client-side directly (no API endpoints needed)

import type {
  AnalyticsData,
  ChartDataPoint,
  TopPost,
  TrafficSource,
} from "../types";
import { supabase } from "@/lib/supabase";

/**
 * Fetch analytics overview data (from Supabase)
 */
export async function fetchAnalyticsOverview(): Promise<AnalyticsData> {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);

    const currentStart = thirtyDaysAgo.toISOString().split('T')[0];
    const currentEnd = today.toISOString().split('T')[0];
    const previousStart = sixtyDaysAgo.toISOString().split('T')[0];
    const previousEnd = thirtyDaysAgo.toISOString().split('T')[0];

    // Fetch current period analytics
    const { data: currentData } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('date', currentStart)
      .lte('date', currentEnd);

    // Fetch previous period analytics
    const { data: previousData } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('date', previousStart)
      .lte('date', previousEnd);

    // Get subscriber counts
    const { count: currentSubscribersCount } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .is('unsubscribed_at', null)
      .gte('subscribed_at', currentStart);

    const { count: previousSubscribersCount } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .is('unsubscribed_at', null)
      .gte('subscribed_at', previousStart)
      .lt('subscribed_at', previousEnd);

    // Calculate totals
    const current = {
      visitors: currentData?.reduce((sum, row) => sum + (row.visitors || 0), 0) || 0,
      clicks: currentData?.reduce((sum, row) => sum + (row.clicks || 0), 0) || 0,
      revenue: currentData?.reduce((sum, row) => sum + (row.revenue || 0), 0) || 0,
      subscribers: currentSubscribersCount || 0,
    };

    const previous = {
      visitors: previousData?.reduce((sum, row) => sum + (row.visitors || 0), 0) || 0,
      clicks: previousData?.reduce((sum, row) => sum + (row.clicks || 0), 0) || 0,
      revenue: previousData?.reduce((sum, row) => sum + (row.revenue || 0), 0) || 0,
      subscribers: previousSubscribersCount || 0,
    };

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    };

    return {
      visitors: current.visitors,
      subscribers: current.subscribers,
      clicks: current.clicks,
      revenue: current.revenue,
      visitorsChange: calculateChange(current.visitors, previous.visitors),
      subscribersChange: calculateChange(current.subscribers, previous.subscribers),
      clicksChange: calculateChange(current.clicks, previous.clicks),
      revenueChange: calculateChange(current.revenue, previous.revenue),
    };
  } catch (error: any) {
    // Re-throw with context for better error handling in Dashboard
    const errorMessage = error?.message || "Failed to fetch analytics overview";
    throw new Error(`Analytics Overview: ${errorMessage}`);
  }
}

/**
 * Fetch visitors chart data (from Supabase)
 */
export async function fetchVisitorsData(days: number = 30): Promise<ChartDataPoint[]> {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    const { data } = await supabase
      .from('analytics_daily')
      .select('date, visitors')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    return (data || []).map((row) => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: row.visitors || 0,
    }));
  } catch (error: any) {
    // Re-throw with context for better error handling
    const errorMessage = error?.message || "Failed to fetch data";
    throw new Error(`Visitors Data: ${errorMessage}`);
  }
}

/**
 * Fetch clicks chart data (from Supabase)
 */
export async function fetchClicksData(days: number = 30): Promise<ChartDataPoint[]> {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    const { data } = await supabase
      .from('analytics_daily')
      .select('date, clicks')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    return (data || []).map((row) => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: row.clicks || 0,
    }));
  } catch (error: any) {
    // Re-throw with context for better error handling
    const errorMessage = error?.message || "Failed to fetch data";
    throw new Error(`Clicks Data: ${errorMessage}`);
  }
}

/**
 * Fetch revenue chart data (from Supabase)
 */
export async function fetchRevenueData(days: number = 30): Promise<ChartDataPoint[]> {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    const { data } = await supabase
      .from('analytics_daily')
      .select('date, revenue')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    return (data || []).map((row) => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: row.revenue || 0,
    }));
  } catch (error: any) {
    // Re-throw with context for better error handling
    const errorMessage = error?.message || "Failed to fetch data";
    throw new Error(`Revenue Data: ${errorMessage}`);
  }
}

/**
 * Fetch top performing posts (from Supabase)
 */
export async function fetchTopPosts(limit: number = 10): Promise<TopPost[]> {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Get page views grouped by page_path
    const { data } = await supabase
      .from('page_views')
      .select('page_path, page_title')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .like('page_path', '%/blog/%');

    // Aggregate by page_path
    const pageStats: Record<string, TopPost> = {};
    (data || []).forEach((row) => {
      const path = row.page_path;
      if (!pageStats[path]) {
        pageStats[path] = {
          title: row.page_title || 'Untitled Post',
          views: 0,
          clicks: 0,
          revenue: 0,
        };
      }
      pageStats[path].views += 1;
    });

    // Convert to array and sort by views
    return Object.values(pageStats)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  } catch (error: any) {
    // Re-throw with context for better error handling
    const errorMessage = error?.message || "Failed to fetch data";
    throw new Error(`Top Posts: ${errorMessage}`);
  }
}

/**
 * Fetch traffic sources (from Supabase)
 */
export async function fetchTrafficSources(): Promise<TrafficSource[]> {
  try {
    // For now, return empty array as we need to track referrer in page_views
    // Can be implemented later by aggregating referrer data from page_views table
    return [];
  } catch (error: any) {
    // Re-throw with context for better error handling
    const errorMessage = error?.message || "Failed to fetch data";
    throw new Error(`Visitors Data: ${errorMessage}`);
  }
}

/**
 * Fetch newsletter subscribers
 */
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
    // Use Supabase client directly (client-side)
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      // Re-throw with context for better error handling
      throw new Error(`Subscribers: ${error.message || 'Failed to fetch subscribers'}`);
    }

    return data || [];
  } catch (error: any) {
    // Re-throw with context for better error handling
    const errorMessage = error?.message || "Failed to fetch subscribers";
    throw new Error(`Subscribers: ${errorMessage}`);
  }
}
