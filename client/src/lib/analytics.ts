// Google Analytics Data API integration
// This will be called from serverless functions to avoid exposing API keys

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export interface AnalyticsData {
  visitors: number;
  subscribers: number;
  clicks: number;
  revenue: number;
  visitorsChange: number;
  subscribersChange: number;
  clicksChange: number;
  revenueChange: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface TopPost {
  title: string;
  views: number;
  clicks: number;
  revenue: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

// Fetch analytics overview data
export async function fetchAnalyticsOverview(): Promise<AnalyticsData> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/overview`);
    if (!response.ok) {
      throw new Error("Failed to fetch analytics data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    // Return mock data as fallback
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

// Fetch visitors chart data
export async function fetchVisitorsData(days: number = 30): Promise<ChartDataPoint[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/visitors?days=${days}`);
    if (!response.ok) {
      throw new Error("Failed to fetch visitors data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching visitors data:", error);
    return [];
  }
}

// Fetch clicks chart data
export async function fetchClicksData(days: number = 30): Promise<ChartDataPoint[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/clicks?days=${days}`);
    if (!response.ok) {
      throw new Error("Failed to fetch clicks data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching clicks data:", error);
    return [];
  }
}

// Fetch revenue chart data
export async function fetchRevenueData(days: number = 30): Promise<ChartDataPoint[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/revenue?days=${days}`);
    if (!response.ok) {
      throw new Error("Failed to fetch revenue data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return [];
  }
}

// Fetch top performing posts
export async function fetchTopPosts(limit: number = 10): Promise<TopPost[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/top-posts?limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch top posts");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching top posts:", error);
    return [];
  }
}

// Fetch traffic sources
export async function fetchTrafficSources(): Promise<TrafficSource[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/traffic-sources`);
    if (!response.ok) {
      throw new Error("Failed to fetch traffic sources");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching traffic sources:", error);
    return [];
  }
}
