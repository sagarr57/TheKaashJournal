// Admin module types

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
