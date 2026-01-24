import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { logout } from "../auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Mail, Eye, DollarSign, TrendingUp, MousePointerClick, LogOut, RefreshCw } from "lucide-react";
import {
  fetchAnalyticsOverview,
  fetchVisitorsData,
  fetchClicksData,
  fetchRevenueData,
  fetchTopPosts,
  fetchTrafficSources,
} from "../lib/analytics";
import type {
  AnalyticsData,
  ChartDataPoint,
  TopPost,
  TrafficSource,
} from "../types";
import { toast } from "sonner";

function AdminDashboard() {
  const [overview, setOverview] = useState<AnalyticsData | null>(null);
  const [visitors, setVisitors] = useState<ChartDataPoint[]>([]);
  const [clicks, setClicks] = useState<ChartDataPoint[]>([]);
  const [revenue, setRevenue] = useState<ChartDataPoint[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [overviewData, visitorsData, clicksData, revenueData, topPostsData, trafficData] = await Promise.all([
        fetchAnalyticsOverview(),
        fetchVisitorsData(30),
        fetchClicksData(30),
        fetchRevenueData(30),
        fetchTopPosts(10),
        fetchTrafficSources(),
      ]);

      setOverview(overviewData);
      setVisitors(visitorsData);
      setClicks(clicksData);
      setRevenue(revenueData);
      setTopPosts(topPostsData);
      setTrafficSources(trafficData);
    } catch (error) {
      console.error("Error loading analytics data:", error);
      toast.error("Failed to load analytics data. Please check your GA4 configuration.");
      // Set empty data instead of mock data
      setOverview({
        visitors: 0,
        subscribers: 0,
        clicks: 0,
        revenue: 0,
        visitorsChange: 0,
        subscribersChange: 0,
        clicksChange: 0,
        revenueChange: 0,
      });
      setVisitors([]);
      setClicks([]);
      setRevenue([]);
      setTopPosts([]);
      setTrafficSources([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    toast.success("Data refreshed");
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const displayOverview = overview || {
    visitors: 0,
    subscribers: 0,
    clicks: 0,
    revenue: 0,
    visitorsChange: 0,
    subscribersChange: 0,
    clicksChange: 0,
    revenueChange: 0,
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = (v: number) => v.toLocaleString() 
  }: {
    title: string;
    value: number;
    change: number;
    icon: any;
    format?: (value: number) => string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-black">{format(value)}</p>
            <p className={`text-sm mt-2 flex items-center gap-1 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
              <TrendingUp className={`w-4 h-4 ${change < 0 ? "rotate-180" : ""}`} />
              {change >= 0 ? "+" : ""}{change}% from last month
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading && !overview) {
    return (
      <div className="min-h-screen bg-white">
        <SEO title="Admin Dashboard" description="Analytics and revenue dashboard" />
        <Header />
        <main id="main-content" className="container py-12">
          <div className="text-center py-20">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO title="Admin Dashboard" description="Analytics and revenue dashboard" />
      <Header />
      
      <main id="main-content" className="container py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-oswald text-4xl lg:text-5xl font-bold uppercase mb-2">
              Admin <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-gray-600">Analytics, revenue tracking, and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="border-2 border-gray-300 rounded-none"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="border-2 border-gray-300 rounded-none"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Visitors"
            value={displayOverview.visitors}
            change={displayOverview.visitorsChange}
            icon={Eye}
          />
          <StatCard
            title="Newsletter Subscribers"
            value={displayOverview.subscribers}
            change={displayOverview.subscribersChange}
            icon={Mail}
          />
          <StatCard
            title="Total Clicks"
            value={displayOverview.clicks}
            change={displayOverview.clicksChange}
            icon={MousePointerClick}
          />
          <StatCard
            title="Total Revenue"
            value={displayOverview.revenue}
            change={displayOverview.revenueChange}
            icon={DollarSign}
            format={(v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="visitors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="clicks">Clicks</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                {visitors.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={visitors}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0066FF" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    <p>No visitor data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clicks">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                {clicks.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={clicks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#0066FF" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    <p>No click data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                {revenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                      <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    <p>No revenue data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                {trafficSources.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={trafficSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    <p>No traffic source data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Top Performing Posts */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-black">Post Title</th>
                    <th className="text-right py-3 px-4 font-semibold text-black">Views</th>
                    <th className="text-right py-3 px-4 font-semibold text-black">Clicks</th>
                    <th className="text-right py-3 px-4 font-semibold text-black">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topPosts.length > 0 ? (
                    topPosts.map((post, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{post.title}</td>
                        <td className="py-3 px-4 text-right">{post.views.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">{post.clicks.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-semibold">
                          ${post.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No post data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
