// Supabase analytics data operations
// Functions to store and retrieve analytics data from Supabase

import { supabase } from './supabase';
import type { Database } from './supabase';

type AnalyticsDaily = Database['public']['Tables']['analytics_daily']['Row'];
type AnalyticsDailyInsert = Database['public']['Tables']['analytics_daily']['Insert'];

/**
 * Store daily analytics data in Supabase
 */
export async function storeDailyAnalytics(data: {
  date: string;
  visitors: number;
  clicks: number;
  revenue: number;
  subscribers: number;
}) {
  try {
    const { error } = await supabase
      .from('analytics_daily')
      .upsert(
        {
          date: data.date,
          visitors: data.visitors,
          clicks: data.clicks,
          revenue: data.revenue,
          subscribers: data.subscribers,
        },
        {
          onConflict: 'date', // Update if date already exists
        }
      );

    if (error) {
      console.error('Error storing analytics data:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to store analytics data:', error);
    return { success: false, error };
  }
}

/**
 * Get analytics data for a date range
 */
export async function getAnalyticsData(startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Failed to fetch analytics data:', error);
    return { data: [], error };
  }
}

/**
 * Get analytics overview (last 30 days vs previous 30 days)
 */
export async function getAnalyticsOverview() {
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

    // Fetch current period
    const { data: currentData, error: currentError } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('date', currentStart)
      .lte('date', currentEnd);

    // Fetch previous period
    const { data: previousData, error: previousError } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('date', previousStart)
      .lte('date', previousEnd);

    if (currentError || previousError) {
      throw currentError || previousError;
    }

    // Calculate totals
    const current = {
      visitors: currentData?.reduce((sum, row) => sum + (row.visitors || 0), 0) || 0,
      clicks: currentData?.reduce((sum, row) => sum + (row.clicks || 0), 0) || 0,
      revenue: currentData?.reduce((sum, row) => sum + (row.revenue || 0), 0) || 0,
      subscribers: currentData?.reduce((sum, row) => sum + (row.subscribers || 0), 0) || 0,
    };

    const previous = {
      visitors: previousData?.reduce((sum, row) => sum + (row.visitors || 0), 0) || 0,
      clicks: previousData?.reduce((sum, row) => sum + (row.clicks || 0), 0) || 0,
      revenue: previousData?.reduce((sum, row) => sum + (row.revenue || 0), 0) || 0,
      subscribers: previousData?.reduce((sum, row) => sum + (row.subscribers || 0), 0) || 0,
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
  } catch (error) {
    console.error('Failed to get analytics overview:', error);
    return {
      visitors: 0,
      subscribers: 0,
      clicks: 0,
      revenue: 0,
      visitorsChange: 0,
      subscribersChange: 0,
      clicksChange: 0,
      revenueChange: 0,
    };
  }
}

/**
 * Get chart data for a specific metric
 */
export async function getChartData(
  metric: 'visitors' | 'clicks' | 'revenue' | 'subscribers',
  days: number = 30
) {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_daily')
      .select(`date, ${metric}`)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []).map((row) => ({
      date: row.date,
      value: row[metric] || 0,
    }));
  } catch (error) {
    console.error(`Failed to get ${metric} chart data:`, error);
    return [];
  }
}
