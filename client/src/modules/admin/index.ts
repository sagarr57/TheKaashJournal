// Admin Module - Main Export File
// This module contains all admin-related functionality including authentication and dashboard

// Auth exports
export { isAuthenticated, setAuth, clearAuth, logout, getAdminPassword } from "./auth";
export { LoginForm } from "./auth/LoginForm";

// Component exports
export { ProtectedRoute } from "./components/ProtectedRoute";

// Page exports
export { default as AdminDashboard } from "./pages/Dashboard";
export { default as AdminLogin } from "./pages/Login";

// Type exports
export type {
  AnalyticsData,
  ChartDataPoint,
  TopPost,
  TrafficSource,
} from "./types";

// Library exports
export {
  fetchAnalyticsOverview,
  fetchVisitorsData,
  fetchClicksData,
  fetchRevenueData,
  fetchTopPosts,
  fetchTrafficSources,
} from "./lib/analytics";
