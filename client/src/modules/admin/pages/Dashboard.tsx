import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { logout } from "../auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Mail, Eye, DollarSign, TrendingUp, MousePointerClick, LogOut, RefreshCw, Pencil, Trash2, Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { author, categories } from "@/lib/categories";
import {
  fetchAnalyticsOverview,
  fetchVisitorsData,
  fetchClicksData,
  fetchRevenueData,
  fetchTopPosts,
  fetchTrafficSources,
  fetchSubscribers,
  type Subscriber,
} from "../lib/analytics";
import type {
  AnalyticsData,
  ChartDataPoint,
  TopPost,
  TrafficSource,
} from "../types";
import { toast } from "sonner";

const DEFAULT_POST_IMAGE = "/images/hero-abstract.jpg";
const DEFAULT_READING_TIME = 5;
const getInitialPostForm = () => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: author.name,
  date: new Date().toISOString().split("T")[0],
  category: categories[0]?.name || "",
  tags: "",
  readingTime: DEFAULT_READING_TIME,
  featured: false,
  image: DEFAULT_POST_IMAGE,
  metaDescription: "",
  keywords: "",
  status: "published" as "published" | "draft" | "scheduled",
  publishAt: "",
});

type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  reading_time: number;
  featured: boolean;
  image: string;
  meta_description: string;
  keywords: string[];
  status: "published" | "draft" | "scheduled";
  publish_at: string | null;
  updated_at: string;
};

function PagerBar({ total, page, perPage, onPageChange }: { total: number; page: number; perPage: number; onPageChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      <p className="text-xs text-gray-500">
        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >← Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-2.5 py-1 text-xs border rounded ${p === page ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}
          >{p}</button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >Next →</button>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [overview, setOverview] = useState<AnalyticsData | null>(null);
  const [visitors, setVisitors] = useState<ChartDataPoint[]>([]);
  const [clicks, setClicks] = useState<ChartDataPoint[]>([]);
  const [revenue, setRevenue] = useState<ChartDataPoint[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPublishingPost, setIsPublishingPost] = useState(false);
  const [postForm, setPostForm] = useState(getInitialPostForm());
  const [allPosts, setAllPosts] = useState<BlogPostRow[]>([]);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; title: string } | null>(null);
  const [postsView, setPostsView] = useState<"list" | "form">("list");
  const [postsPage, setPostsPage] = useState(1);
  const [postsFilter, setPostsFilter] = useState<"all" | "published" | "draft" | "scheduled">("all");
  const [subPage, setSubPage] = useState(1);
  const [topPostsPage, setTopPostsPage] = useState(1);
  const [pvPage, setPvPage] = useState(1);
  const [clicksPage, setClicksPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const TRACK_PER_PAGE = 20;
  const SUB_PER_PAGE = 15;
  const TOP_POSTS_PER_PAGE = 10;

  type PageViewRow = { id: string; page_path: string; page_title: string; referrer: string; device_type: string; browser: string; view_time_seconds: number; created_at: string };
  type EventRow = { id: string; event_type: string; event_name: string; page_path: string; element_text: string; created_at: string };
  type RedirectionRow = { id: string; source_url: string; destination_url: string; link_text: string; link_type: string; is_external: boolean; created_at: string };
  const [trackingPageViews, setTrackingPageViews] = useState<PageViewRow[]>([]);
  const [trackingEvents, setTrackingEvents] = useState<EventRow[]>([]);
  const [trackingRedirections, setTrackingRedirections] = useState<RedirectionRow[]>([]);
  const [isFetchingTracking, setIsFetchingTracking] = useState(false);
  const [trackingTab, setTrackingTab] = useState<"pageviews" | "events" | "clicks">("pageviews");
  const POSTS_PER_PAGE = 10;
  const [contentEditorTab, setContentEditorTab] = useState<"write" | "preview">("write");

  const filteredPosts = useMemo(
    () => postsFilter === "all" ? allPosts : allPosts.filter((p) => p.status === postsFilter),
    [allPosts, postsFilter]
  );
  const pagedPosts = useMemo(
    () => filteredPosts.slice((postsPage - 1) * POSTS_PER_PAGE, postsPage * POSTS_PER_PAGE),
    [filteredPosts, postsPage]
  );
  const pagedSubscribers = useMemo(() => subscribers.slice((subPage - 1) * SUB_PER_PAGE, subPage * SUB_PER_PAGE), [subscribers, subPage]);
  const pagedTopPosts = useMemo(() => topPosts.slice((topPostsPage - 1) * TOP_POSTS_PER_PAGE, topPostsPage * TOP_POSTS_PER_PAGE), [topPosts, topPostsPage]);
  const pagedPv = useMemo(() => trackingPageViews.slice((pvPage - 1) * TRACK_PER_PAGE, pvPage * TRACK_PER_PAGE), [trackingPageViews, pvPage]);
  const pagedClicks = useMemo(() => trackingRedirections.slice((clicksPage - 1) * TRACK_PER_PAGE, clicksPage * TRACK_PER_PAGE), [trackingRedirections, clicksPage]);
  const pagedEvents = useMemo(() => trackingEvents.slice((eventsPage - 1) * TRACK_PER_PAGE, eventsPage * TRACK_PER_PAGE), [trackingEvents, eventsPage]);

  const tocItems = useMemo(() => {
    return postForm.content
      .split("\n")
      .map((line) => {
        const m = line.match(/^(#{1,3})\s+(.*)/);
        return m ? { level: m[1].length, text: m[2].trim() } : null;
      })
      .filter(Boolean) as { level: number; text: string }[];
  }, [postForm.content]);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handlePostFieldChange = (field: string, value: string | boolean | number) => {
    setPostForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePostTitleBlur = () => {
    if (!postForm.slug.trim() && postForm.title.trim()) {
      handlePostFieldChange("slug", slugify(postForm.title));
    }
  };

  const fetchAllPosts = async () => {
    setIsFetchingPosts(true);
    try {
      // Publish any overdue scheduled posts (fallback for when cron hasn't run yet)
      await supabase
        .from("blog_posts")
        .update({ status: "published", publish_at: null })
        .eq("status", "scheduled")
        .lte("publish_at", new Date().toISOString());

      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,title,slug,excerpt,content,author,date,category,tags,reading_time,featured,image,meta_description,keywords,status,publish_at,updated_at")
        .order("date", { ascending: false });
      if (error) throw new Error(error.message);
      setAllPosts((data as BlogPostRow[]) || []);
      setPostsPage(1);
    } catch (err: any) {
      toast.error("Failed to load posts", { description: err?.message });
    } finally {
      setIsFetchingPosts(false);
    }
  };

  const handleEditPost = (post: BlogPostRow) => {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      category: post.category,
      tags: (post.tags || []).join(", "),
      readingTime: post.reading_time,
      featured: post.featured,
      image: post.image || DEFAULT_POST_IMAGE,
      metaDescription: post.meta_description || "",
      keywords: (post.keywords || []).join(", "),
      status: post.status || "published",
      publishAt: post.publish_at ? post.publish_at.slice(0, 16) : "",
    });
    setPostsView("form");
  };

  const handleDeletePost = (id: string, title: string) => {
    setDeleteModal({ id, title });
  };

  const confirmDeletePost = async () => {
    if (!deleteModal) return;
    setDeletingPostId(deleteModal.id);
    setDeleteModal(null);
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", deleteModal.id);
      if (error) throw new Error(error.message);
      toast.success("Post deleted");
      await fetchAllPosts();
    } catch (err: any) {
      toast.error("Failed to delete post", { description: err?.message });
    } finally {
      setDeletingPostId(null);
    }
  };

  const fetchTrackingData = async () => {
    setIsFetchingTracking(true);
    try {
      const [pvRes, evRes, rdRes] = await Promise.all([
        supabase.from("page_views").select("id,page_path,page_title,referrer,device_type,browser,view_time_seconds,created_at").order("created_at", { ascending: false }).limit(200),
        supabase.from("events").select("id,event_type,event_name,page_path,element_text,created_at").order("created_at", { ascending: false }).limit(200),
        supabase.from("redirections").select("id,source_url,destination_url,link_text,link_type,is_external,created_at").order("created_at", { ascending: false }).limit(200),
      ]);
      setTrackingPageViews((pvRes.data as PageViewRow[]) || []);
      setTrackingEvents((evRes.data as EventRow[]) || []);
      setTrackingRedirections((rdRes.data as RedirectionRow[]) || []);
      setPvPage(1); setClicksPage(1); setEventsPage(1);
    } catch (err: any) {
      toast.error("Failed to load tracking data", { description: err?.message });
    } finally {
      setIsFetchingTracking(false);
    }
  };

  const handleTrackingTabChange = (t: "pageviews" | "clicks" | "events") => {
    setTrackingTab(t);
    setPvPage(1); setClicksPage(1); setEventsPage(1);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setPostForm(getInitialPostForm());
    setPostsView("list");
  };

  const handleSavePost = async (status: "published" | "draft" | "scheduled") => {
    const slug = postForm.slug.trim() || slugify(postForm.title);

    if (!postForm.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (status === "scheduled" && !postForm.publishAt) {
      toast.error("Pick a publish date/time to schedule this post.");
      return;
    }

    if (status === "scheduled" && new Date(postForm.publishAt) <= new Date()) {
      toast.error("Scheduled time must be in the future.");
      return;
    }

    if ((status === "published" || status === "scheduled") && (!slug || !postForm.excerpt.trim() || !postForm.content.trim() || !postForm.category.trim())) {
      toast.error("Missing required fields", {
        description: "Slug, excerpt, content, and category are required.",
      });
      return;
    }

    setIsPublishingPost(true);
    try {
      const tags = postForm.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const keywords = postForm.keywords.split(",").map((k) => k.trim()).filter(Boolean);

      const { error } = await supabase.from("blog_posts").upsert(
        {
          id: editingPostId || slug,
          title: postForm.title.trim(),
          slug,
          excerpt: postForm.excerpt.trim(),
          content: postForm.content,
          author: postForm.author.trim() || author.name,
          date: postForm.date,
          category: postForm.category.trim(),
          tags,
          reading_time: Number(postForm.readingTime) || DEFAULT_READING_TIME,
          featured: postForm.featured,
          image: postForm.image.trim() || DEFAULT_POST_IMAGE,
          meta_description: postForm.metaDescription.trim() || postForm.excerpt.trim(),
          keywords,
          status,
          publish_at: status === "scheduled" ? new Date(postForm.publishAt).toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) throw new Error(error.message || "Failed to save post");

      const label =
        status === "draft" ? "Draft saved" :
        status === "scheduled" ? `Scheduled for ${new Date(postForm.publishAt).toLocaleString()}` :
        editingPostId ? "Post updated" : "Post published";
      toast.success(label, { description: "The blog post has been saved to Supabase." });

      setEditingPostId(null);
      setPostForm(getInitialPostForm());
      setPostsView("list");
      await fetchAllPosts();
    } catch (error: any) {
      toast.error("Failed to save post", {
        description: error?.message || "Please check inputs and try again.",
      });
    } finally {
      setIsPublishingPost(false);
    }
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSavePost("published");
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Use Promise.allSettled to handle partial failures gracefully
      const results = await Promise.allSettled([
        fetchAnalyticsOverview(),
        fetchVisitorsData(30),
        fetchClicksData(30),
        fetchRevenueData(30),
        fetchTopPosts(10),
        fetchTrafficSources(),
        fetchSubscribers(),
      ]);

      // Process results and show errors for failed requests
      const [overviewResult, visitorsResult, clicksResult, revenueResult, topPostsResult, trafficResult, subscribersResult] = results;

      // Handle overview
      if (overviewResult.status === 'fulfilled') {
        setOverview(overviewResult.value);
      } else {
        toast.error("Failed to load analytics overview", {
          description: overviewResult.reason?.message || "Unable to fetch analytics data",
        });
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
      }

      // Handle visitors data
      if (visitorsResult.status === 'fulfilled') {
        setVisitors(visitorsResult.value);
      } else {
        toast.error("Failed to load visitors data", {
          description: visitorsResult.reason?.message || "Unable to fetch visitors chart data",
        });
        setVisitors([]);
      }

      // Handle clicks data
      if (clicksResult.status === 'fulfilled') {
        setClicks(clicksResult.value);
      } else {
        toast.error("Failed to load clicks data", {
          description: clicksResult.reason?.message || "Unable to fetch clicks chart data",
        });
        setClicks([]);
      }

      // Handle revenue data
      if (revenueResult.status === 'fulfilled') {
        setRevenue(revenueResult.value);
      } else {
        toast.error("Failed to load revenue data", {
          description: revenueResult.reason?.message || "Unable to fetch revenue chart data",
        });
        setRevenue([]);
      }

      // Handle top posts
      if (topPostsResult.status === 'fulfilled') {
        setTopPosts(topPostsResult.value);
        setTopPostsPage(1);
      } else {
        toast.error("Failed to load top posts", {
          description: topPostsResult.reason?.message || "Unable to fetch top posts data",
        });
        setTopPosts([]);
      }

      // Handle traffic sources (optional, don't show error)
      if (trafficResult.status === 'fulfilled') {
        setTrafficSources(trafficResult.value);
      } else {
        setTrafficSources([]);
      }

      // Handle subscribers
      if (subscribersResult.status === 'fulfilled') {
        setSubscribers(subscribersResult.value);
        setSubPage(1);
      } else {
        toast.error("Failed to load subscribers", {
          description: subscribersResult.reason?.message || "Unable to fetch subscriber list",
        });
        setSubscribers([]);
      }
    } catch (error: any) {
      // Fallback for unexpected errors
      const errorMessage = error?.message || "Failed to load dashboard data";
      toast.error("Unexpected error", {
        description: errorMessage,
      });
      // Set empty data to prevent UI errors
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
      setSubscribers([]);
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
    fetchAllPosts();
    fetchTrackingData();
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
      
      <main id="main-content" className="container py-8 md:py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-oswald text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-2">
              Admin <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Analytics, revenue tracking, and performance metrics</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="border-2 border-gray-300 rounded-none w-full sm:w-auto"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="border-2 border-gray-300 rounded-none w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6 mb-8">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex min-w-max w-full lg:grid lg:grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="tracking">Tracking Data</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="settings" className="hidden lg:block">Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="overflow-x-auto">
                <TabsList className="inline-flex min-w-max w-full lg:grid lg:grid-cols-4">
                <TabsTrigger value="visitors">Visitors</TabsTrigger>
                <TabsTrigger value="clicks">Clicks</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
                </TabsList>
              </div>

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
            <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-black">Post</th>
                    <th className="text-right py-3 px-4 font-semibold text-black">Views</th>
                    <th className="text-right py-3 px-4 font-semibold text-black">Clicks</th>
                    <th className="text-right py-3 px-4 font-semibold text-black">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topPosts.length > 0 ? (
                    pagedTopPosts.map((post, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 max-w-[320px]">
                          <span className="block font-medium text-gray-900 leading-snug">{post.title}</span>
                          <span className="block text-xs text-gray-400 mt-0.5">/blog/{post.slug}</span>
                        </td>
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
                        No post data available yet — views will appear here once visitors land on blog posts.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <PagerBar total={topPosts.length} page={topPostsPage} perPage={TOP_POSTS_PER_PAGE} onPageChange={setTopPostsPage} />
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                {subscribers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No subscribers yet</p>
                    <p className="text-sm mt-2">Subscribers will appear here once they sign up</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Total: <span className="font-semibold">{subscribers.length}</span> subscribers
                      </p>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full min-w-[680px]">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {pagedSubscribers.map((subscriber) => (
                            <tr key={subscriber.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{subscriber.email}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {subscriber.source || 'unknown'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {new Date(subscriber.subscribed_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {subscriber.unsubscribed_at ? (
                                  <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Unsubscribed</span>
                                ) : (
                                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Active</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <PagerBar total={subscribers.length} page={subPage} perPage={SUB_PER_PAGE} onPageChange={setSubPage} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Data Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tracking Data</CardTitle>
                <Button variant="outline" size="sm" onClick={fetchTrackingData} disabled={isFetchingTracking} className="rounded-none border-gray-300">
                  <RefreshCw className={`w-4 h-4 mr-1 ${isFetchingTracking ? "animate-spin" : ""}`} />Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {/* Sub-tabs */}
                <div className="flex gap-1 border-b border-gray-200 mb-4">
                  {(["pageviews", "clicks", "events"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTrackingTabChange(t)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        trackingTab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {t === "pageviews" ? `Page Views (${trackingPageViews.length})` : t === "clicks" ? `Outbound Clicks (${trackingRedirections.length})` : `Events (${trackingEvents.length})`}
                    </button>
                  ))}
                </div>

                {isFetchingTracking ? (
                  <div className="py-12 text-center text-gray-500">
                    <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-600" />
                    <p>Loading tracking data…</p>
                  </div>
                ) : trackingTab === "clicks" ? (
                  trackingRedirections.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <MousePointerClick className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No outbound clicks recorded yet</p>
                      <p className="text-sm mt-1">Every external link click on your site will appear here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
                            <th className="py-2 px-3">Destination</th>
                            <th className="py-2 px-3">Link Text</th>
                            <th className="py-2 px-3">Type</th>
                            <th className="py-2 px-3">Source Page</th>
                            <th className="py-2 px-3 text-right">When</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedClicks.map((row) => (
                            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3 max-w-[200px]">
                                <a href={row.destination_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs truncate block">
                                  {(() => { try { return new URL(row.destination_url).hostname; } catch { return row.destination_url; } })()}
                                </a>
                              </td>
                              <td className="py-2 px-3 text-gray-600 text-xs max-w-[160px] truncate">{row.link_text || "—"}</td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">{row.link_type || "outbound"}</span>
                              </td>
                              <td className="py-2 px-3 text-gray-400 text-xs max-w-[160px] truncate">
                                {(() => { try { return new URL(row.source_url).pathname; } catch { return row.source_url; } })()}
                              </td>
                              <td className="py-2 px-3 text-right text-gray-400 text-xs whitespace-nowrap">
                                {new Date(row.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <PagerBar total={trackingRedirections.length} page={clicksPage} perPage={TRACK_PER_PAGE} onPageChange={setClicksPage} />
                    </div>
                  )
                ) : trackingTab === "pageviews" ? (
                  trackingPageViews.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <Eye className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No page views recorded yet</p>
                      <p className="text-sm mt-1">Data appears here once visitors land on your site with cookie consent enabled.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px] text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
                            <th className="py-2 px-3">Page</th>
                            <th className="py-2 px-3">Referrer</th>
                            <th className="py-2 px-3">Device</th>
                            <th className="py-2 px-3">Browser</th>
                            <th className="py-2 px-3 text-right">Time (s)</th>
                            <th className="py-2 px-3 text-right">When</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedPv.map((row) => (
                            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3 max-w-[220px]">
                                <span className="block font-medium text-gray-800 truncate">{row.page_title || "—"}</span>
                                <span className="text-xs text-gray-400 truncate block">{row.page_path}</span>
                              </td>
                              <td className="py-2 px-3 text-gray-500 text-xs max-w-[160px] truncate">
                                {row.referrer ? new URL(row.referrer).hostname : <span className="italic">direct</span>}
                              </td>
                              <td className="py-2 px-3 text-gray-600 capitalize">{row.device_type || "—"}</td>
                              <td className="py-2 px-3 text-gray-600">{row.browser || "—"}</td>
                              <td className="py-2 px-3 text-right text-gray-600">{row.view_time_seconds ?? 0}</td>
                              <td className="py-2 px-3 text-right text-gray-400 text-xs whitespace-nowrap">
                                {new Date(row.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <PagerBar total={trackingPageViews.length} page={pvPage} perPage={TRACK_PER_PAGE} onPageChange={setPvPage} />
                    </div>
                  )
                ) : (
                  trackingEvents.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <MousePointerClick className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No events recorded yet</p>
                      <p className="text-sm mt-1">Click events and custom events will appear here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
                            <th className="py-2 px-3">Event</th>
                            <th className="py-2 px-3">Type</th>
                            <th className="py-2 px-3">Page</th>
                            <th className="py-2 px-3">Element</th>
                            <th className="py-2 px-3 text-right">When</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedEvents.map((row) => (
                            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3 font-medium text-gray-800">{row.event_name}</td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-700">{row.event_type}</span>
                              </td>
                              <td className="py-2 px-3 text-gray-500 text-xs max-w-[180px] truncate">{row.page_path || "—"}</td>
                              <td className="py-2 px-3 text-gray-500 text-xs max-w-[160px] truncate">{row.element_text || "—"}</td>
                              <td className="py-2 px-3 text-right text-gray-400 text-xs whitespace-nowrap">
                                {new Date(row.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <PagerBar total={trackingEvents.length} page={eventsPage} perPage={TRACK_PER_PAGE} onPageChange={setEventsPage} />
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">

            {/* List view */}
            {postsView === "list" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle>Posts</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchAllPosts} disabled={isFetchingPosts} className="rounded-none border-gray-300">
                      <RefreshCw className={`w-4 h-4 mr-1 ${isFetchingPosts ? "animate-spin" : ""}`} />Refresh
                    </Button>
                    <Button size="sm" onClick={() => { setEditingPostId(null); setPostForm(getInitialPostForm()); setPostsView("form"); }} className="rounded-none">
                      <Plus className="w-4 h-4 mr-1" />New Post
                    </Button>
                  </div>
                </CardHeader>

                {/* Filter bar */}
                <div className="px-6 pb-3 flex gap-2 flex-wrap border-b border-gray-100">
                  {(["all", "published", "draft", "scheduled"] as const).map((f) => {
                    const count = f === "all" ? allPosts.length : allPosts.filter((p) => p.status === f).length;
                    const active = postsFilter === f;
                    const colours =
                      f === "draft"      ? active ? "bg-yellow-500 text-white border-yellow-500"    : "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                    : f === "scheduled"  ? active ? "bg-purple-600 text-white border-purple-600"    : "border-purple-300 text-purple-700 hover:bg-purple-50"
                    : f === "published"  ? active ? "bg-green-600  text-white border-green-600"     : "border-green-300  text-green-700  hover:bg-green-50"
                    :                     active ? "bg-blue-600   text-white border-blue-600"      : "border-gray-200   text-gray-600   hover:bg-gray-50";
                    return (
                      <button
                        key={f}
                        onClick={() => { setPostsFilter(f); setPostsPage(1); }}
                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${colours}`}
                      >
                        {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({count})
                      </button>
                    );
                  })}
                </div>

                <CardContent className="pt-4">
                  {isFetchingPosts ? (
                    <div className="py-12 text-center text-gray-500">
                      <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-600" />
                      <p>Loading posts…</p>
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">
                      <p>{allPosts.length === 0 ? "No posts found in Supabase." : `No ${postsFilter} posts.`}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px] text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-left">
                            <th className="py-2 px-3 font-semibold text-gray-700">Title</th>
                            <th className="py-2 px-3 font-semibold text-gray-700">Category</th>
                            <th className="py-2 px-3 font-semibold text-gray-700">Date</th>
                            <th className="py-2 px-3 font-semibold text-gray-700">Featured</th>
                            <th className="py-2 px-3 font-semibold text-gray-700 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedPosts.map((post) => (
                            <tr key={post.id} className={`border-b border-gray-100 hover:bg-gray-50 ${post.status === "draft" ? "opacity-70" : ""}`}>
                              <td className="py-2 px-3 max-w-[280px]">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-gray-900 line-clamp-1">{post.title}</span>
                                  {post.status === "draft" && (
                                    <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-yellow-100 text-yellow-700">Draft</span>
                                  )}
                                  {post.status === "scheduled" && (
                                    <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-purple-100 text-purple-700">Scheduled</span>
                                  )}
                                </div>
                                <span className="block text-xs text-gray-400 mt-0.5">
                                  {post.slug}
                                  {post.status === "scheduled" && post.publish_at && (
                                    <span className="ml-2 text-purple-500 font-medium">→ {new Date(post.publish_at).toLocaleString()}</span>
                                  )}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-gray-600">{post.category}</td>
                              <td className="py-2 px-3 text-gray-600 whitespace-nowrap">{post.date}</td>
                              <td className="py-2 px-3">
                                {post.featured ? (
                                  <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">Yes</span>
                                ) : (
                                  <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-500">No</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => handleEditPost(post)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="Edit">
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePost(post.id, post.title)}
                                    disabled={deletingPostId === post.id}
                                    className="p-1.5 rounded hover:bg-red-50 text-red-500 disabled:opacity-40"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <PagerBar total={filteredPosts.length} page={postsPage} perPage={POSTS_PER_PAGE} onPageChange={(p) => setPostsPage(p)} />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Create / Edit form */}
            {postsView === "form" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{editingPostId ? "Edit Post" : "New Post"}</CardTitle>
                  <button onClick={handleCancelEdit} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Back to list">
                    <X className="w-5 h-5" />
                  </button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePublishPost} className="space-y-5">

                    {/* Row 1: Title + Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Post Title <span className="text-red-500">*</span></span>
                        <input
                          value={postForm.title}
                          onChange={(e) => handlePostFieldChange("title", e.target.value)}
                          onBlur={handlePostTitleBlur}
                          placeholder="e.g. How AI is Changing Personal Finance"
                          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">URL Slug <span className="text-red-500">*</span></span>
                        <input
                          value={postForm.slug}
                          onChange={(e) => handlePostFieldChange("slug", slugify(e.target.value))}
                          placeholder="e.g. how-ai-is-changing-personal-finance"
                          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <span className="text-[11px] text-gray-400">Auto-generated from title. Used in the blog URL.</span>
                      </label>
                    </div>

                    {/* Row 2: Author + Publish Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Author Name</span>
                        <input
                          value={postForm.author}
                          onChange={(e) => handlePostFieldChange("author", e.target.value)}
                          placeholder="Team Kaash"
                          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-[11px] text-gray-400">Defaults to "Team Kaash" if left blank.</span>
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Publish Date <span className="text-red-500">*</span></span>
                        <input
                          type="date"
                          value={postForm.date}
                          onChange={(e) => handlePostFieldChange("date", e.target.value)}
                          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </label>
                    </div>

                    {/* Row 3: Category + Reading Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Category <span className="text-red-500">*</span></span>
                        <select
                          value={postForm.category}
                          onChange={(e) => handlePostFieldChange("category", e.target.value)}
                          className="w-full border border-gray-300 px-3 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Reading Time (minutes)</span>
                        <input
                          type="number"
                          min={1}
                          value={postForm.readingTime}
                          onChange={(e) => handlePostFieldChange("readingTime", Number(e.target.value))}
                          placeholder="5"
                          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-[11px] text-gray-400">Shown as "5 min read" on the blog post.</span>
                      </label>
                    </div>

                    {/* Cover Image */}
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cover Image Path</span>
                      <input
                        value={postForm.image}
                        onChange={(e) => handlePostFieldChange("image", e.target.value)}
                        placeholder="/images/hero-abstract.jpg"
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-[11px] text-gray-400">Path to the post's hero image. Leave as default if unsure.</span>
                    </label>

                    {/* Excerpt */}
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Excerpt / Summary <span className="text-red-500">*</span></span>
                      <textarea
                        value={postForm.excerpt}
                        onChange={(e) => handlePostFieldChange("excerpt", e.target.value)}
                        placeholder="A short 1–2 sentence summary shown on the blog listing page and in Google search results."
                        className="w-full border border-gray-300 px-3 py-2 rounded min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <span className="text-[11px] text-gray-400">Keep under 160 characters for best SEO results.</span>
                    </label>

                    {/* Content editor with live preview + TOC */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Main Content <span className="text-red-500">*</span></span>
                      <span className="text-[11px] text-gray-400 mb-1">Write in Markdown. Use ## for headings, **bold**, - for bullet lists. Switch to Preview to see how it looks.</span>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        {/* Write / Preview tabs */}
                        <div className="flex border-b border-gray-200 mb-2">
                          <button
                            type="button"
                            onClick={() => setContentEditorTab("write")}
                            className={`px-4 py-1.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                              contentEditorTab === "write"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            Write
                          </button>
                          <button
                            type="button"
                            onClick={() => setContentEditorTab("preview")}
                            className={`px-4 py-1.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                              contentEditorTab === "preview"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            Preview
                          </button>
                        </div>
                        {contentEditorTab === "write" ? (
                          <textarea
                            value={postForm.content}
                            onChange={(e) => handlePostFieldChange("content", e.target.value)}
                            placeholder="Markdown content *"
                            className="w-full border border-gray-300 px-3 py-2 rounded min-h-[400px] font-mono text-sm"
                            required
                          />
                        ) : (
                          <div className="w-full border border-gray-200 rounded px-4 py-3 min-h-[400px] overflow-y-auto prose prose-sm max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-3">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-2">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
                                h4: ({ children }) => <h4 className="text-base font-semibold mt-3 mb-1">{children}</h4>,
                                p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc pl-5 mb-3">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-5 mb-3">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                a: ({ href, children }) => <a href={href} className="text-blue-600 underline">{children}</a>,
                                blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-3">{children}</blockquote>,
                                code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                              }}
                            >
                              {postForm.content || "*Nothing to preview yet…*"}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>

                      {/* Live Table of Contents */}
                      <div className="lg:col-span-1">
                        <div className="border border-gray-200 rounded p-3 sticky top-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Table of Contents</p>
                          {tocItems.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">Add ## headings to see TOC</p>
                          ) : (
                            <ol className="space-y-1">
                              {tocItems.map((item, i) => (
                                <li
                                  key={i}
                                  className={`text-xs text-gray-700 leading-snug ${
                                    item.level === 1 ? "font-bold" :
                                    item.level === 2 ? "font-semibold pl-2" :
                                    "pl-4 text-gray-500"
                                  }`}
                                >
                                  {item.text}
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>
                      </div>
                    </div>
                    </div> {/* close content label wrapper */}

                    {/* Tags + SEO Keywords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tags</span>
                        <input
                          value={postForm.tags}
                          onChange={(e) => handlePostFieldChange("tags", e.target.value)}
                          placeholder="e.g. AI, Fintech, Personal Finance"
                          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-[11px] text-gray-400">Comma-separated. Used for filtering and related posts.</span>
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">SEO Keywords</span>
                        <input
                          value={postForm.keywords}
                          onChange={(e) => handlePostFieldChange("keywords", e.target.value)}
                          placeholder="e.g. AI finance tools, debt management 2026"
                          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-[11px] text-gray-400">Comma-separated. Added to the page's meta keywords tag.</span>
                      </label>
                    </div>

                    {/* Meta Description */}
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Meta Description</span>
                      <input
                        value={postForm.metaDescription}
                        onChange={(e) => handlePostFieldChange("metaDescription", e.target.value)}
                        placeholder="Short description shown in Google search results (max 160 chars)"
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-[11px] text-gray-400">Falls back to the excerpt if left blank.</span>
                    </label>

                    {/* Featured toggle */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={postForm.featured}
                        onChange={(e) => handlePostFieldChange("featured", e.target.checked)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm font-medium text-gray-700">Feature this post</span>
                      <span className="text-[11px] text-gray-400">(Pinned to the top of the blog listing page)</span>
                    </label>

                    {/* Schedule section — for new posts, drafts, and scheduled; not for already-published */}
                    {(!editingPostId || postForm.status !== "published") && (
                      <div className="border border-purple-200 rounded p-4 bg-purple-50">
                        <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Schedule to go live</p>
                        <p className="text-[11px] text-purple-500 mb-3">Pick a date and time — the post will automatically publish at that moment.</p>
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                          <input
                            type="datetime-local"
                            value={postForm.publishAt}
                            min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                            onChange={(e) => {
                              handlePostFieldChange("publishAt", e.target.value);
                              if (e.target.value) handlePostFieldChange("date", e.target.value.slice(0, 10));
                            }}
                            className="border border-purple-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isPublishingPost || !postForm.publishAt}
                            onClick={() => handleSavePost("scheduled")}
                            className="rounded-none border-purple-400 text-purple-700 hover:bg-purple-100 disabled:opacity-40"
                          >
                            Schedule Post
                          </Button>
                          {postForm.publishAt && (
                            <span className="text-xs text-purple-600 font-medium">
                              Goes live: {new Date(postForm.publishAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <Button type="button" variant="outline" onClick={handleCancelEdit} className="rounded-none">
                        Cancel
                      </Button>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isPublishingPost}
                          onClick={() => handleSavePost("draft")}
                          className="rounded-none border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                        >
                          {isPublishingPost ? "Saving…" : "Save as Draft"}
                        </Button>
                        <Button type="submit" disabled={isPublishingPost} className="rounded-none">
                          {isPublishingPost ? "Publishing…" : editingPostId ? "Update Post" : "Publish Post"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <p>Settings coming soon</p>
                  <p className="text-sm mt-2">Configure analytics, integrations, and preferences</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Post?</h2>
            <p className="text-sm text-gray-600 mb-1">You are about to permanently delete:</p>
            <p className="text-sm font-semibold text-gray-800 mb-5 line-clamp-2">"{deleteModal.title}"</p>
            <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-5 py-2 text-sm font-medium rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Keep
              </button>
              <button
                onClick={confirmDeletePost}
                className="px-5 py-2 text-sm font-medium rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
