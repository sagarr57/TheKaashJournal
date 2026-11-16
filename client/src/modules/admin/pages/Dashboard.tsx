import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SEO } from "@/components/SEO";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { logout, getUsername } from "../auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import {
  Mail, Eye, DollarSign, TrendingUp, MousePointerClick, LogOut, RefreshCw,
  Pencil, Trash2, Plus, X, Upload, ImageIcon, EyeOff, Shield, KeyRound,
  User, CheckCircle2, XCircle, Menu, FileText, Users, Activity, Settings,
  BarChart2, ExternalLink,
} from "lucide-react";
import { adminSupabase as supabase, uploadBlogImage } from "../lib/admin-supabase";
import { categories } from "@/lib/categories";
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
import type { AnalyticsData, ChartDataPoint, TopPost, TrafficSource } from "../types";
import { toast } from "sonner";

const DEFAULT_POST_IMAGE = "/images/hero-abstract.jpg";
const DEFAULT_READING_TIME = 5;

const CATEGORY_IMAGES: Record<string, string> = {
  "AI and Health":     "/images/ai-health.jpg",
  "Debt Management":   "/images/debt-money.jpg",
  "Real-Time Finance": "/images/investment-charts.jpg",
  "Fintech Trends":    "/images/investment-charts.jpg",
  "Case Studies":      "/images/business-analytics.jpg",
};

const CATEGORY_AUTHOR: Record<string, string> = {
  "AI and Health":     "Kash",
  "Real-Time Finance": "Kash",
  "Case Studies":      "Kash",
  "Debt Management":   "Saga",
  "Fintech Trends":    "Saga",
};

const PEN_NAME_OPTIONS = [
  { value: "Kash",              label: "Kash — AI & Health, Real-Time Finance, Case Studies" },
  { value: "Saga",              label: "Saga — Debt Management, Fintech Trends" },
  { value: "The Kaash Journal", label: "The Kaash Journal (generic / no pen name)" },
];

const IMAGE_PRESETS = [
  { label: "AI & Health",         value: "/images/ai-health.jpg" },
  { label: "Finance/Fintech",     value: "/images/fintech.jpg" },
  { label: "Investment Charts",   value: "/images/investment-charts.jpg" },
  { label: "Fraud / Security",    value: "/images/fraud-security.jpg" },
  { label: "Payments Mobile",     value: "/images/payments-mobile.jpg" },
  { label: "Open Banking",        value: "/images/open-banking.jpg" },
  { label: "Regulation / Law",    value: "/images/regulation-law.jpg" },
  { label: "Neobank App",         value: "/images/neobank-app.jpg" },
  { label: "ESG / Green",         value: "/images/esg-green.jpg" },
  { label: "Crypto / Blockchain", value: "/images/crypto-blockchain.jpg" },
  { label: "Debt",                value: "/images/debt-money.jpg" },
  { label: "Nutrition",           value: "/images/nutrition.jpg" },
  { label: "Fitness",             value: "/images/fitness.jpg" },
  { label: "Sleep",               value: "/images/sleep-health.jpg" },
  { label: "Wellness",            value: "/images/wellness-mental.jpg" },
  { label: "Analytics",           value: "/images/business-analytics.jpg" },
  { label: "Case Study",          value: "/images/business-case.jpg" },
  { label: "Abstract",            value: "/images/hero-abstract.jpg" },
  { label: "Data Viz",            value: "/images/data-visualization-bg.jpg" },
];

const getInitialPostForm = () => {
  const firstCategory = categories[0]?.name || "";
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: CATEGORY_AUTHOR[firstCategory] || "The Kaash Journal",
    date: new Date().toISOString().split("T")[0],
    category: firstCategory,
    tags: "",
    readingTime: DEFAULT_READING_TIME,
    featured: false,
    image: CATEGORY_IMAGES[firstCategory] || DEFAULT_POST_IMAGE,
    metaDescription: "",
    keywords: "",
    status: "published" as "published" | "draft" | "scheduled",
    publishAt: "",
  };
};

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

function PagerBar({
  total, page, perPage, onPageChange,
}: { total: number; page: number; perPage: number; onPageChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
      <p className="text-xs text-slate-500">
        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-2 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >← Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-2.5 py-1 text-xs border rounded-lg ${
              p === page ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 hover:bg-slate-50"
            }`}
          >{p}</button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-2 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >Next →</button>
      </div>
    </div>
  );
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

// Kept outside SettingsPanel: a component declared inside another remounts on every render and loses input focus.
const PasswordInput = ({
  value, onChange, show, onToggle, placeholder, id,
}: { value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder?: string; id?: string }) => (
  <div className="relative">
    <input
      id={id}
      type={show ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="w-full border border-slate-300 px-3 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      tabIndex={-1}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>
);

function SettingsPanel() {
  const username = getUsername();

  const [cpCurrent, setCpCurrent]       = useState("");
  const [cpNew, setCpNew]               = useState("");
  const [cpConfirm, setCpConfirm]       = useState("");
  const [showCpCurrent, setShowCpCurrent] = useState(false);
  const [showCpNew, setShowCpNew]       = useState(false);
  const [showCpConfirm, setShowCpConfirm] = useState(false);
  const [cpLoading, setCpLoading]       = useState(false);

  const [twoFaPassword, setTwoFaPassword]           = useState("");
  const [showTwoFaPassword, setShowTwoFaPassword]   = useState(false);
  const [twoFaStep, setTwoFaStep]                   = useState<"idle" | "setup" | "disable">("idle");
  const [twoFaSecret, setTwoFaSecret]               = useState("");
  const [twoFaQrUrl, setTwoFaQrUrl]                 = useState("");
  const [twoFaToken, setTwoFaToken]                 = useState("");
  const [twoFaDisableToken, setTwoFaDisableToken]   = useState("");
  const [twoFaDisablePassword, setTwoFaDisablePassword]     = useState("");
  const [showTwoFaDisablePassword, setShowTwoFaDisablePassword] = useState(false);
  const [twoFaLoading, setTwoFaLoading]             = useState(false);
  const [twoFaEnabled, setTwoFaEnabled]             = useState<boolean | null>(null);

  const fetchTwoFaStatus = async () => {
    if (!username) return;
    try {
      const { data } = await supabase
        .from("admin_users")
        .select("totp_enabled")
        .eq("username", username)
        .single();
      setTwoFaEnabled(data?.totp_enabled ?? false);
    } catch { setTwoFaEnabled(false); }
  };

  useState(() => { fetchTwoFaStatus(); });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cpNew !== cpConfirm) { toast.error("New passwords don't match"); return; }
    if (cpNew.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setCpLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, currentPassword: cpCurrent, newPassword: cpNew }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to change password"); return; }
      toast.success("Password changed successfully");
      setCpCurrent(""); setCpNew(""); setCpConfirm("");
    } catch { toast.error("Request failed"); }
    finally { setCpLoading(false); }
  };

  const handleSetup2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFaLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/setup-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: twoFaPassword }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Setup failed"); return; }
      setTwoFaSecret(data.secret);
      setTwoFaQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.otpauthUrl)}`);
      setTwoFaStep("setup");
    } catch { toast.error("Request failed"); }
    finally { setTwoFaLoading(false); }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFaLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, token: twoFaToken }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Verification failed"); return; }
      toast.success("2FA enabled successfully!");
      setTwoFaStep("idle"); setTwoFaPassword(""); setTwoFaToken(""); setTwoFaSecret(""); setTwoFaQrUrl("");
      setTwoFaEnabled(true);
    } catch { toast.error("Request failed"); }
    finally { setTwoFaLoading(false); }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFaLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/disable-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: twoFaDisablePassword, token: twoFaDisableToken }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to disable 2FA"); return; }
      toast.success("2FA disabled");
      setTwoFaStep("idle"); setTwoFaDisablePassword(""); setTwoFaDisableToken("");
      setTwoFaEnabled(false);
    } catch { toast.error("Request failed"); }
    finally { setTwoFaLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Account Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-slate-900">Account</h2>
        </div>
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg uppercase flex-shrink-0">
            {username.charAt(0) || "A"}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{username || "Admin"}</p>
            <p className="text-sm text-slate-500">The Kaash Journal Admin</p>
          </div>
          <div className="ml-auto">
            {twoFaEnabled === true && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> 2FA On
              </span>
            )}
            {twoFaEnabled === false && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                <XCircle className="w-3.5 h-3.5" /> 2FA Off
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-slate-900">Change Password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Password</label>
            <PasswordInput value={cpCurrent} onChange={setCpCurrent} show={showCpCurrent} onToggle={() => setShowCpCurrent(!showCpCurrent)} placeholder="Enter current password" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">New Password</label>
            <PasswordInput value={cpNew} onChange={setCpNew} show={showCpNew} onToggle={() => setShowCpNew(!showCpNew)} placeholder="At least 8 characters" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Confirm New Password</label>
            <PasswordInput value={cpConfirm} onChange={setCpConfirm} show={showCpConfirm} onToggle={() => setShowCpConfirm(!showCpConfirm)} placeholder="Repeat new password" />
            {cpNew && cpConfirm && cpNew !== cpConfirm && (
              <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Passwords don't match</p>
            )}
            {cpNew && cpConfirm && cpNew === cpConfirm && cpConfirm.length >= 8 && (
              <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Passwords match</p>
            )}
          </div>
          <Button type="submit" disabled={cpLoading || cpNew !== cpConfirm || cpNew.length < 8} className="rounded-lg">
            {cpLoading ? "Updating…" : "Update Password"}
          </Button>
        </form>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-slate-900">Two-Factor Authentication</h2>
        </div>
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-5">
          <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-800">Authenticator App (TOTP)</p>
            <p className="text-xs text-slate-500 mt-0.5">Use Google Authenticator, Authy, or any TOTP app. Adds an extra layer of security on every login.</p>
          </div>
        </div>

        {twoFaEnabled === null && <p className="text-sm text-slate-400">Loading 2FA status…</p>}

        {twoFaEnabled === false && twoFaStep === "idle" && (
          <form onSubmit={handleSetup2FA} className="space-y-4">
            <p className="text-sm text-slate-600">Enter your password to begin 2FA setup.</p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Your Password</label>
              <PasswordInput value={twoFaPassword} onChange={setTwoFaPassword} show={showTwoFaPassword} onToggle={() => setShowTwoFaPassword(!showTwoFaPassword)} placeholder="Confirm your password" />
            </div>
            <Button type="submit" disabled={twoFaLoading || !twoFaPassword} className="rounded-lg">
              {twoFaLoading ? "Setting up…" : "Set Up 2FA"}
            </Button>
          </form>
        )}

        {twoFaEnabled === false && twoFaStep === "setup" && (
          <div className="space-y-5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <p className="text-sm font-semibold text-slate-800">Step 1 — Scan this QR code</p>
              <p className="text-xs text-slate-500">Open your authenticator app and scan the QR code below.</p>
              <div className="flex justify-center py-2">
                <img src={twoFaQrUrl} alt="2FA QR Code" className="w-48 h-48 rounded-lg border border-slate-200" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Or enter manually:</p>
                <code className="block w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs font-mono text-slate-700 break-all select-all">
                  {twoFaSecret}
                </code>
              </div>
            </div>
            <form onSubmit={handleVerify2FA} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Step 2 — Enter verification code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={twoFaToken}
                  onChange={(e) => setTwoFaToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000 000"
                  required
                  className="w-full border border-slate-300 px-4 py-3 rounded-lg text-xl font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => { setTwoFaStep("idle"); setTwoFaPassword(""); }} className="rounded-lg">Cancel</Button>
                <Button type="submit" disabled={twoFaLoading || twoFaToken.length !== 6} className="rounded-lg">
                  {twoFaLoading ? "Verifying…" : "Enable 2FA"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {twoFaEnabled === true && twoFaStep === "idle" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Two-factor authentication is active on your account.
            </div>
            <Button variant="outline" onClick={() => setTwoFaStep("disable")} className="rounded-lg border-red-300 text-red-600 hover:bg-red-50">
              Disable 2FA
            </Button>
          </div>
        )}

        {twoFaEnabled === true && twoFaStep === "disable" && (
          <form onSubmit={handleDisable2FA} className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              This will remove 2FA protection from your account. You'll need your password and a valid authenticator code.
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Your Password</label>
              <PasswordInput value={twoFaDisablePassword} onChange={setTwoFaDisablePassword} show={showTwoFaDisablePassword} onToggle={() => setShowTwoFaDisablePassword(!showTwoFaDisablePassword)} placeholder="Enter your password" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Authenticator Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={twoFaDisableToken}
                onChange={(e) => setTwoFaDisableToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000 000"
                required
                className="w-full border border-slate-300 px-4 py-2.5 rounded-lg text-lg font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => { setTwoFaStep("idle"); setTwoFaDisablePassword(""); setTwoFaDisableToken(""); }} className="rounded-lg">Cancel</Button>
              <Button type="submit" disabled={twoFaLoading || twoFaDisableToken.length !== 6 || !twoFaDisablePassword} className="rounded-lg bg-red-600 hover:bg-red-700 text-white">
                {twoFaLoading ? "Disabling…" : "Confirm Disable 2FA"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [overview, setOverview]           = useState<AnalyticsData | null>(null);
  const [visitors, setVisitors]           = useState<ChartDataPoint[]>([]);
  const [clicks, setClicks]               = useState<ChartDataPoint[]>([]);
  const [revenue, setRevenue]             = useState<ChartDataPoint[]>([]);
  const [topPosts, setTopPosts]           = useState<TopPost[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [subscribers, setSubscribers]     = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [isRefreshing, setIsRefreshing]   = useState(false);
  const [isPublishingPost, setIsPublishingPost] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [postForm, setPostForm]           = useState(getInitialPostForm());
  const [allPosts, setAllPosts]           = useState<BlogPostRow[]>([]);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal]     = useState<{ id: string; title: string } | null>(null);
  const [postsView, setPostsView]         = useState<"list" | "form">("list");
  const [postsPage, setPostsPage]         = useState(1);
  const [postsFilter, setPostsFilter]     = useState<"all" | "published" | "draft" | "scheduled">("all");
  const [subPage, setSubPage]             = useState(1);
  const [topPostsPage, setTopPostsPage]   = useState(1);
  const [pvPage, setPvPage]               = useState(1);
  const [clicksPage, setClicksPage]       = useState(1);
  const [eventsPage, setEventsPage]       = useState(1);
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [activeSection, setActiveSection] = useState<"analytics" | "posts" | "subscribers" | "tracking" | "settings">("analytics");
  const [contentEditorTab, setContentEditorTab] = useState<"write" | "preview">("write");

  const TRACK_PER_PAGE = 20;
  const SUB_PER_PAGE   = 15;
  const TOP_POSTS_PER_PAGE = 10;
  const POSTS_PER_PAGE = 10;

  type PageViewRow = { id: string; page_path: string; page_title: string; referrer: string; device_type: string; browser: string; view_time_seconds: number; created_at: string };
  type EventRow = { id: string; event_type: string; event_name: string; page_path: string; element_text: string; created_at: string };
  type RedirectionRow = { id: string; source_url: string; destination_url: string; link_text: string; link_type: string; is_external: boolean; created_at: string };

  const [trackingPageViews, setTrackingPageViews] = useState<PageViewRow[]>([]);
  const [trackingEvents, setTrackingEvents]       = useState<EventRow[]>([]);
  const [trackingRedirections, setTrackingRedirections] = useState<RedirectionRow[]>([]);
  const [isFetchingTracking, setIsFetchingTracking] = useState(false);
  const [trackingTab, setTrackingTab] = useState<"pageviews" | "events" | "clicks">("pageviews");

  const filteredPosts = useMemo(
    () => postsFilter === "all" ? allPosts : allPosts.filter((p) => p.status === postsFilter),
    [allPosts, postsFilter]
  );
  const pagedPosts      = useMemo(() => filteredPosts.slice((postsPage - 1) * POSTS_PER_PAGE, postsPage * POSTS_PER_PAGE), [filteredPosts, postsPage]);
  const pagedSubscribers = useMemo(() => subscribers.slice((subPage - 1) * SUB_PER_PAGE, subPage * SUB_PER_PAGE), [subscribers, subPage]);
  const pagedTopPosts   = useMemo(() => topPosts.slice((topPostsPage - 1) * TOP_POSTS_PER_PAGE, topPostsPage * TOP_POSTS_PER_PAGE), [topPosts, topPostsPage]);
  const pagedPv         = useMemo(() => trackingPageViews.slice((pvPage - 1) * TRACK_PER_PAGE, pvPage * TRACK_PER_PAGE), [trackingPageViews, pvPage]);
  const pagedClicks     = useMemo(() => trackingRedirections.slice((clicksPage - 1) * TRACK_PER_PAGE, clicksPage * TRACK_PER_PAGE), [trackingRedirections, clicksPage]);
  const pagedEvents     = useMemo(() => trackingEvents.slice((eventsPage - 1) * TRACK_PER_PAGE, eventsPage * TRACK_PER_PAGE), [trackingEvents, eventsPage]);

  const tocItems = useMemo(() => {
    return postForm.content
      .split("\n")
      .map((line) => { const m = line.match(/^(#{1,3})\s+(.*)/); return m ? { level: m[1].length, text: m[2].trim() } : null; })
      .filter(Boolean) as { level: number; text: string }[];
  }, [postForm.content]);

  const slugify = (value: string) =>
    value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  const handlePostFieldChange = (field: string, value: string | boolean | number) => {
    setPostForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePostTitleBlur = () => {
    if (!postForm.slug.trim() && postForm.title.trim()) handlePostFieldChange("slug", slugify(postForm.title));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      handlePostFieldChange("image", await uploadBlogImage(file));
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      toast.error("Upload failed", { description: err?.message || "Check that the 'blog-images' storage bucket exists in Supabase." });
    } finally { setIsUploadingImage(false); e.target.value = ""; }
  };

  const fetchAllPosts = async () => {
    setIsFetchingPosts(true);
    try {
      await supabase.from("blog_posts").update({ status: "published", publish_at: null }).eq("status", "scheduled").lte("publish_at", new Date().toISOString());
      const { data, error } = await supabase.from("blog_posts").select("id,title,slug,excerpt,content,author,date,category,tags,reading_time,featured,image,meta_description,keywords,status,publish_at,updated_at").order("date", { ascending: false });
      if (error) throw new Error(error.message);
      setAllPosts((data as BlogPostRow[]) || []);
      setPostsPage(1);
    } catch (err: any) {
      toast.error("Failed to load posts", { description: err?.message });
    } finally { setIsFetchingPosts(false); }
  };

  const handleEditPost = (post: BlogPostRow) => {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content,
      author: post.author, date: post.date, category: post.category,
      tags: (post.tags || []).join(", "), readingTime: post.reading_time,
      featured: post.featured, image: post.image || DEFAULT_POST_IMAGE,
      metaDescription: post.meta_description || "", keywords: (post.keywords || []).join(", "),
      status: post.status || "published", publishAt: post.publish_at ? post.publish_at.slice(0, 16) : "",
    });
    setPostsView("form");
  };

  const handleDeletePost = (id: string, title: string) => { setDeleteModal({ id, title }); };

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
    } finally { setDeletingPostId(null); }
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
    } finally { setIsFetchingTracking(false); }
  };

  const handleTrackingTabChange = (t: "pageviews" | "clicks" | "events") => {
    setTrackingTab(t);
    setPvPage(1); setClicksPage(1); setEventsPage(1);
  };

  const handleCancelEdit = () => { setEditingPostId(null); setPostForm(getInitialPostForm()); setPostsView("list"); };

  const handleSavePost = async (status: "published" | "draft" | "scheduled") => {
    const slug = postForm.slug.trim() || slugify(postForm.title);
    if (!postForm.title.trim()) { toast.error("Title is required"); return; }
    if (status === "scheduled" && !postForm.publishAt) { toast.error("Pick a publish date/time to schedule this post."); return; }
    if (status === "scheduled" && new Date(postForm.publishAt) <= new Date()) { toast.error("Scheduled time must be in the future."); return; }
    if ((status === "published" || status === "scheduled") && (!slug || !postForm.excerpt.trim() || !postForm.content.trim() || !postForm.category.trim())) {
      toast.error("Missing required fields", { description: "Slug, excerpt, content, and category are required." });
      return;
    }
    setIsPublishingPost(true);
    try {
      const tags = postForm.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const keywords = postForm.keywords.split(",").map((k) => k.trim()).filter(Boolean);
      const { error } = await supabase.from("blog_posts").upsert({
        id: editingPostId || slug,
        title: postForm.title.trim(), slug,
        excerpt: postForm.excerpt.trim(), content: postForm.content,
        author: postForm.author.trim() || "The Kaash Journal",
        date: postForm.date, category: postForm.category.trim(), tags,
        reading_time: Number(postForm.readingTime) || DEFAULT_READING_TIME,
        featured: postForm.featured, image: postForm.image.trim() || DEFAULT_POST_IMAGE,
        meta_description: postForm.metaDescription.trim() || postForm.excerpt.trim(),
        keywords, status,
        publish_at: status === "scheduled" ? new Date(postForm.publishAt).toISOString() : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });
      if (error) throw new Error(error.message || "Failed to save post");
      const label = status === "draft" ? "Draft saved" : status === "scheduled" ? `Scheduled for ${new Date(postForm.publishAt).toLocaleString()}` : editingPostId ? "Post updated" : "Post published";
      toast.success(label, { description: "The blog post has been saved to Supabase." });
      setEditingPostId(null); setPostForm(getInitialPostForm()); setPostsView("list");
      await fetchAllPosts();
    } catch (error: any) {
      toast.error("Failed to save post", { description: error?.message || "Please check inputs and try again." });
    } finally { setIsPublishingPost(false); }
  };

  const handlePublishPost = async (e: React.FormEvent) => { e.preventDefault(); await handleSavePost("published"); };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const results = await Promise.allSettled([
        fetchAnalyticsOverview(), fetchVisitorsData(30), fetchClicksData(30),
        fetchRevenueData(30), fetchTopPosts(10), fetchTrafficSources(), fetchSubscribers(),
      ]);
      const [overviewResult, visitorsResult, clicksResult, revenueResult, topPostsResult, trafficResult, subscribersResult] = results;
      const failed = (title: string, result: PromiseRejectedResult, fallback: string) =>
        toast.error(title, { description: result.reason?.message || fallback });

      if (overviewResult.status === "fulfilled") { setOverview(overviewResult.value); }
      else { setOverview({ visitors: 0, subscribers: 0, clicks: 0, revenue: 0, visitorsChange: 0, subscribersChange: 0, clicksChange: 0, revenueChange: 0 }); failed("Failed to load analytics overview", overviewResult, "Unable to fetch analytics data"); }
      if (visitorsResult.status === "fulfilled") { setVisitors(visitorsResult.value); }
      else { setVisitors([]); failed("Failed to load visitors data", visitorsResult, "Unable to fetch visitors chart data"); }
      if (clicksResult.status === "fulfilled") { setClicks(clicksResult.value); }
      else { setClicks([]); failed("Failed to load clicks data", clicksResult, "Unable to fetch clicks chart data"); }
      if (revenueResult.status === "fulfilled") { setRevenue(revenueResult.value); }
      else { setRevenue([]); failed("Failed to load revenue data", revenueResult, "Unable to fetch revenue chart data"); }
      if (topPostsResult.status === "fulfilled") { setTopPosts(topPostsResult.value); setTopPostsPage(1); }
      else { setTopPosts([]); failed("Failed to load top posts", topPostsResult, "Unable to fetch top posts data"); }
      setTrafficSources(trafficResult.status === "fulfilled" ? trafficResult.value : []);
      if (subscribersResult.status === "fulfilled") { setSubscribers(subscribersResult.value); setSubPage(1); }
      else { setSubscribers([]); failed("Failed to load subscribers", subscribersResult, "Unable to fetch subscriber list"); }
    } catch (error: any) {
      toast.error("Unexpected error", { description: error?.message || "Failed to load dashboard data" });
      setOverview({ visitors: 0, subscribers: 0, clicks: 0, revenue: 0, visitorsChange: 0, subscribersChange: 0, clicksChange: 0, revenueChange: 0 });
      setVisitors([]); setClicks([]); setRevenue([]); setTopPosts([]); setTrafficSources([]); setSubscribers([]);
    } finally { setIsLoading(false); }
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

  const displayOverview = overview || { visitors: 0, subscribers: 0, clicks: 0, revenue: 0, visitorsChange: 0, subscribersChange: 0, clicksChange: 0, revenueChange: 0 };

  const navItems = [
    { id: "analytics"   as const, label: "Analytics",   icon: BarChart2  },
    { id: "posts"       as const, label: "Posts",        icon: FileText   },
    { id: "subscribers" as const, label: "Subscribers",  icon: Users      },
    { id: "tracking"    as const, label: "Tracking",     icon: Activity   },
    { id: "settings"    as const, label: "Settings",     icon: Settings   },
  ];

  const StatCard = ({
    title, value, change, icon: Icon, format = (v: number) => v.toLocaleString(),
    colorIcon = "bg-blue-100 text-blue-600", colorBorder = "border-l-blue-500",
  }: { title: string; value: number; change: number; icon: any; format?: (v: number) => string; colorIcon?: string; colorBorder?: string }) => (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${colorBorder} p-5 hover:shadow-sm transition-shadow`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{title}</p>
          <p className="text-2xl font-bold text-slate-900 leading-none mb-2">{format(value)}</p>
          <p className={`text-xs font-medium flex items-center gap-1 ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            <TrendingUp className={`w-3 h-3 flex-shrink-0 ${change < 0 ? "rotate-180" : ""}`} />
            {change >= 0 ? "+" : ""}{change}% vs last month
          </p>
        </div>
        <div className={`p-2.5 rounded-lg flex-shrink-0 ${colorIcon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );

  if (isLoading && !overview) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <SEO title="Admin Dashboard" description="Admin dashboard" noIndex={true} />
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const username = getUsername();

  return (
    <div className="h-dvh overflow-hidden bg-slate-100 flex">
      <SEO title="Admin Dashboard" description="Admin dashboard" noIndex={true} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 flex-shrink-0 bg-slate-900 flex flex-col lg:static lg:h-full transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/30">
              <span className="text-white font-black text-sm tracking-tight">KJ</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Kaash Journal</p>
              <p className="text-slate-400 text-[11px]">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.id === "posts" && allPosts.length > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>
                    {allPosts.length}
                  </span>
                )}
                {item.id === "subscribers" && subscribers.length > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>
                    {subscribers.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase flex-shrink-0">
              {username.charAt(0) || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{username || "Admin"}</p>
              <p className="text-slate-400 text-[10px]">Administrator</p>
            </div>
          </div>
          <a
            href="/"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View site
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3.5 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {navItems.find((n) => n.id === activeSection)?.label}
            </h1>
            <p className="text-xs text-slate-400 leading-none mt-0.5">
              {activeSection === "analytics"   && "Performance metrics & insights"}
              {activeSection === "posts"       && `${allPosts.length} posts total`}
              {activeSection === "subscribers" && `${subscribers.length} active subscribers`}
              {activeSection === "tracking"    && "Real-time page views & events"}
              {activeSection === "settings"    && "Account settings & security"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(activeSection === "analytics" || activeSection === "subscribers") && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            )}
            {activeSection === "posts" && postsView === "list" && (
              <button
                onClick={() => { setEditingPostId(null); setPostForm(getInitialPostForm()); setPostsView("form"); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                New Post
              </button>
            )}
            {activeSection === "tracking" && (
              <button
                onClick={fetchTrackingData}
                disabled={isFetchingTracking}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingTracking ? "animate-spin" : ""}`} />
                Refresh
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          <div className="mx-auto w-full max-w-[1400px]">

          {/* ── ANALYTICS ── */}
          {activeSection === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard title="Total Visitors"  value={displayOverview.visitors}   change={displayOverview.visitorsChange}   icon={Eye}             colorIcon="bg-blue-100 text-blue-600"    colorBorder="border-l-blue-500" />
                <StatCard title="Subscribers"     value={displayOverview.subscribers} change={displayOverview.subscribersChange} icon={Mail}            colorIcon="bg-emerald-100 text-emerald-600" colorBorder="border-l-emerald-500" />
                <StatCard title="Total Clicks"    value={displayOverview.clicks}     change={displayOverview.clicksChange}     icon={MousePointerClick} colorIcon="bg-violet-100 text-violet-600"  colorBorder="border-l-violet-500" />
                <StatCard
                  title="Revenue"
                  value={displayOverview.revenue}
                  change={displayOverview.revenueChange}
                  icon={DollarSign}
                  colorIcon="bg-amber-100 text-amber-600"
                  colorBorder="border-l-amber-500"
                  format={(v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                />
              </div>

              {/* Charts */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <Tabs defaultValue="visitors">
                  <div className="px-3 sm:px-5 pt-4 border-b border-slate-100 overflow-x-auto">
                    <TabsList className="mb-0">
                      <TabsTrigger value="visitors">Visitors</TabsTrigger>
                      <TabsTrigger value="clicks">Clicks</TabsTrigger>
                      <TabsTrigger value="revenue">Revenue</TabsTrigger>
                      <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="p-5">
                    <TabsContent value="visitors">
                      <h3 className="font-semibold text-slate-900 text-sm mb-4">Monthly Visitors</h3>
                      {visitors.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <BarChart data={visitors}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">No visitor data yet</div>
                      )}
                    </TabsContent>
                    <TabsContent value="clicks">
                      <h3 className="font-semibold text-slate-900 text-sm mb-4">Monthly Clicks</h3>
                      {clicks.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <LineChart data={clicks}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">No click data yet</div>
                      )}
                    </TabsContent>
                    <TabsContent value="revenue">
                      <h3 className="font-semibold text-slate-900 text-sm mb-4">Monthly Revenue</h3>
                      {revenue.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <LineChart data={revenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">No revenue data yet</div>
                      )}
                    </TabsContent>
                    <TabsContent value="sources">
                      <h3 className="font-semibold text-slate-900 text-sm mb-4">Traffic Sources</h3>
                      {trafficSources.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <PieChart>
                            <Pie data={trafficSources} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                              {trafficSources.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">No traffic source data yet</div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Top posts */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-900 text-sm">Top Performing Posts</h2>
                </div>
                <div className="p-5 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="text-left border-b border-slate-100">
                        <th className="pb-3 pr-4 font-semibold text-slate-600 text-xs uppercase tracking-wide">Post</th>
                        <th className="pb-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wide text-right">Views</th>
                        <th className="pb-3 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wide text-right">Clicks</th>
                        <th className="pb-3 pl-4 font-semibold text-slate-600 text-xs uppercase tracking-wide text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPosts.length > 0 ? (
                        pagedTopPosts.map((post, index) => (
                          <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-3 pr-4 max-w-[300px]">
                              <span className="block font-medium text-slate-900 leading-snug line-clamp-1">{post.title}</span>
                              <span className="block text-xs text-slate-400 mt-0.5">/blog/{post.slug}</span>
                            </td>
                            <td className="py-3 px-4 text-right text-slate-700">{post.views.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-slate-700">{post.clicks.toLocaleString()}</td>
                            <td className="py-3 pl-4 text-right font-semibold text-slate-900">${post.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="py-10 text-center text-slate-400 text-sm">No post data yet — views appear here once visitors land on blog posts.</td></tr>
                      )}
                    </tbody>
                  </table>
                  <PagerBar total={topPosts.length} page={topPostsPage} perPage={TOP_POSTS_PER_PAGE} onPageChange={setTopPostsPage} />
                </div>
              </div>
            </div>
          )}

          {/* ── POSTS ── */}
          {activeSection === "posts" && (
            <div>
              {postsView === "list" && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  {/* Filter bar */}
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={fetchAllPosts}
                      disabled={isFetchingPosts}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors mr-2"
                    >
                      <RefreshCw className={`w-3 h-3 ${isFetchingPosts ? "animate-spin" : ""}`} /> Refresh
                    </button>
                    {(["all", "published", "draft", "scheduled"] as const).map((f) => {
                      const count = f === "all" ? allPosts.length : allPosts.filter((p) => p.status === f).length;
                      const active = postsFilter === f;
                      const colours =
                        f === "draft"     ? active ? "bg-amber-500 text-white border-amber-500"    : "border-amber-300 text-amber-700 hover:bg-amber-50"
                        : f === "scheduled" ? active ? "bg-violet-600 text-white border-violet-600"  : "border-violet-300 text-violet-700 hover:bg-violet-50"
                        : f === "published" ? active ? "bg-emerald-600 text-white border-emerald-600" : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                        :                   active ? "bg-blue-600 text-white border-blue-600"      : "border-slate-200 text-slate-600 hover:bg-slate-50";
                      return (
                        <button key={f} onClick={() => { setPostsFilter(f); setPostsPage(1); }} className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${colours}`}>
                          {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({count})
                        </button>
                      );
                    })}
                  </div>

                  <div className="overflow-x-auto">
                    {isFetchingPosts ? (
                      <div className="py-16 text-center text-slate-500">
                        <div className="w-7 h-7 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-3" />
                        <p className="text-sm">Loading posts…</p>
                      </div>
                    ) : filteredPosts.length === 0 ? (
                      <div className="py-16 text-center text-slate-400">
                        <FileText className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                        <p className="font-medium text-sm">{allPosts.length === 0 ? "No posts yet" : `No ${postsFilter} posts`}</p>
                        <p className="text-xs mt-1">{allPosts.length === 0 && "Create your first post using the button above."}</p>
                      </div>
                    ) : (
                      <table className="w-full min-w-[700px] text-sm">
                        <thead>
                          <tr className="text-left bg-slate-50 border-b border-slate-100">
                            <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Title</th>
                            <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Category</th>
                            <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Date</th>
                            <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Featured</th>
                            <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedPosts.map((post) => (
                            <tr key={post.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${post.status === "draft" ? "opacity-70" : ""}`}>
                              <td className="py-3 px-4 max-w-[280px]">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-slate-900 line-clamp-1">{post.title}</span>
                                  {post.status === "draft" && <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700">Draft</span>}
                                  {post.status === "scheduled" && <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-violet-100 text-violet-700">Scheduled</span>}
                                </div>
                                <span className="block text-xs text-slate-400 mt-0.5">
                                  {post.slug}
                                  {post.status === "scheduled" && post.publish_at && <span className="ml-2 text-violet-500 font-medium">→ {new Date(post.publish_at).toLocaleString()}</span>}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-500 text-xs">{post.category}</td>
                              <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-xs">{post.date}</td>
                              <td className="py-3 px-4">
                                {post.featured
                                  ? <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">Yes</span>
                                  : <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-500">No</span>
                                }
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button onClick={() => handleEditPost(post)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleDeletePost(post.id, post.title)} disabled={deletingPostId === post.id} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 disabled:opacity-40 transition-colors" title="Delete">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {!isFetchingPosts && filteredPosts.length > 0 && (
                      <div className="px-5">
                        <PagerBar total={filteredPosts.length} page={postsPage} perPage={POSTS_PER_PAGE} onPageChange={(p) => setPostsPage(p)} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {postsView === "form" && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-slate-900">{editingPostId ? "Edit Post" : "New Post"}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{editingPostId ? "Update an existing post" : "Create and publish a new article"}</p>
                    </div>
                    <button onClick={handleCancelEdit} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Back to list">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handlePublishPost} className="space-y-5">
                      {/* Row 1: Title + Slug */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Post Title <span className="text-red-500">*</span></span>
                          <input value={postForm.title} onChange={(e) => handlePostFieldChange("title", e.target.value)} onBlur={handlePostTitleBlur} placeholder="e.g. How AI is Changing Personal Finance" className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" required />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">URL Slug <span className="text-red-500">*</span></span>
                          <input value={postForm.slug} onChange={(e) => handlePostFieldChange("slug", slugify(e.target.value))} placeholder="e.g. how-ai-is-changing-personal-finance" className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" required />
                          <span className="text-[11px] text-slate-400">Auto-generated from title. Used in the blog URL.</span>
                        </label>
                      </div>

                      {/* Row 2: Author + Date */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Author</span>
                          <select value={postForm.author} onChange={(e) => handlePostFieldChange("author", e.target.value)} className="w-full border border-slate-300 px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                            {PEN_NAME_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                          <span className="text-[11px] text-slate-400">Auto-selected when you pick a category. Override here if needed.</span>
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Publish Date <span className="text-red-500">*</span></span>
                          <input type="date" value={postForm.date} onChange={(e) => handlePostFieldChange("date", e.target.value)} className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                        </label>
                      </div>

                      {/* Row 3: Category + Reading Time */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category <span className="text-red-500">*</span></span>
                          <select
                            value={postForm.category}
                            onChange={(e) => {
                              const cat = e.target.value;
                              handlePostFieldChange("category", cat);
                              handlePostFieldChange("author", CATEGORY_AUTHOR[cat] || "The Kaash Journal");
                              const currentIsPreset = IMAGE_PRESETS.some((p) => p.value === postForm.image);
                              if (currentIsPreset || !postForm.image) handlePostFieldChange("image", CATEGORY_IMAGES[cat] || DEFAULT_POST_IMAGE);
                            }}
                            className="w-full border border-slate-300 px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            required
                          >
                            {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                          </select>
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Reading Time (minutes)</span>
                          <input type="number" min={1} value={postForm.readingTime} onChange={(e) => handlePostFieldChange("readingTime", Number(e.target.value))} placeholder="5" className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                          <span className="text-[11px] text-slate-400">Shown as "5 min read" on the blog post.</span>
                        </label>
                      </div>

                      {/* Cover Image */}
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cover Image</span>
                        <div className="flex gap-4 items-start">
                          <div className="w-36 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                            {postForm.image ? (
                              <img src={postForm.image} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1">
                                <ImageIcon className="w-6 h-6" />
                                <span className="text-[10px]">No image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col gap-2 min-w-0">
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-[11px] text-slate-400 self-center mr-0.5">Quick pick:</span>
                              {IMAGE_PRESETS.map((opt) => (
                                <button key={opt.value} type="button" onClick={() => handlePostFieldChange("image", opt.value)} className={`px-2 py-0.5 text-[11px] rounded border transition-colors ${postForm.image === opt.value ? "bg-blue-600 text-white border-blue-600" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}>
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                            <input value={postForm.image} onChange={(e) => handlePostFieldChange("image", e.target.value)} placeholder="/images/hero-abstract.jpg or https://..." className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer">
                                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageUpload} />
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${isUploadingImage ? "border-blue-300 text-blue-400 bg-blue-50 cursor-not-allowed" : "border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"}`}>
                                  <Upload className="w-3.5 h-3.5" />
                                  {isUploadingImage ? "Uploading…" : "Upload image"}
                                </span>
                              </label>
                              <span className="text-[11px] text-slate-400">JPG, PNG, WebP · uploads to Supabase Storage</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Excerpt */}
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Excerpt / Summary <span className="text-red-500">*</span></span>
                        <textarea value={postForm.excerpt} onChange={(e) => handlePostFieldChange("excerpt", e.target.value)} placeholder="A short 1–2 sentence summary shown on the blog listing page and in Google search results." className="w-full border border-slate-300 px-3 py-2 rounded-lg min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" required />
                        <span className="text-[11px] text-slate-400">Keep under 160 characters for best SEO results.</span>
                      </label>

                      {/* Content editor */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Main Content <span className="text-red-500">*</span></span>
                        <span className="text-[11px] text-slate-400 mb-1">Write in Markdown. Use ## for headings, **bold**, - for bullet lists. Switch to Preview to see how it looks.</span>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="lg:col-span-2">
                            <div className="flex border-b border-slate-200 mb-2">
                              <button type="button" onClick={() => setContentEditorTab("write")} className={`px-4 py-1.5 text-sm font-medium border-b-2 -mb-px transition-colors ${contentEditorTab === "write" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Write</button>
                              <button type="button" onClick={() => setContentEditorTab("preview")} className={`px-4 py-1.5 text-sm font-medium border-b-2 -mb-px transition-colors ${contentEditorTab === "preview" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Preview</button>
                            </div>
                            {contentEditorTab === "write" ? (
                              <textarea value={postForm.content} onChange={(e) => handlePostFieldChange("content", e.target.value)} placeholder="Markdown content *" className="w-full border border-slate-300 px-3 py-2 rounded-lg min-h-[400px] font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            ) : (
                              <div className="w-full border border-slate-200 rounded-lg px-4 py-3 min-h-[400px] overflow-y-auto prose prose-sm max-w-none bg-white">
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
                                    blockquote: ({ children }) => <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-3">{children}</blockquote>,
                                    code: ({ children }) => <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                                  }}
                                >
                                  {postForm.content || "*Nothing to preview yet…*"}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>
                          <div className="lg:col-span-1">
                            <div className="border border-slate-200 rounded-lg p-3 sticky top-4 bg-slate-50">
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Table of Contents</p>
                              {tocItems.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">Add ## headings to see TOC</p>
                              ) : (
                                <ol className="space-y-1">
                                  {tocItems.map((item, i) => (
                                    <li key={i} className={`text-xs text-slate-700 leading-snug ${item.level === 1 ? "font-bold" : item.level === 2 ? "font-semibold pl-2" : "pl-4 text-slate-500"}`}>{item.text}</li>
                                  ))}
                                </ol>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags + Keywords */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tags</span>
                          <input value={postForm.tags} onChange={(e) => handlePostFieldChange("tags", e.target.value)} placeholder="e.g. AI, Fintech, Personal Finance" className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                          <span className="text-[11px] text-slate-400">Comma-separated. Used for filtering and related posts.</span>
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">SEO Keywords</span>
                          <input value={postForm.keywords} onChange={(e) => handlePostFieldChange("keywords", e.target.value)} placeholder="e.g. AI finance tools, debt management 2026" className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                          <span className="text-[11px] text-slate-400">Comma-separated. Added to the page's meta keywords tag.</span>
                        </label>
                      </div>

                      {/* Meta Description */}
                      <label className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Meta Description</span>
                        <input value={postForm.metaDescription} onChange={(e) => handlePostFieldChange("metaDescription", e.target.value)} placeholder="Short description shown in Google search results (max 160 chars)" className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                        <span className="text-[11px] text-slate-400">Falls back to the excerpt if left blank.</span>
                      </label>

                      {/* Featured toggle */}
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={postForm.featured} onChange={(e) => handlePostFieldChange("featured", e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" />
                        <span className="text-sm font-medium text-slate-700">Feature this post</span>
                        <span className="text-[11px] text-slate-400">(Pinned to the top of the blog listing page)</span>
                      </label>

                      {/* Schedule section */}
                      {(!editingPostId || postForm.status !== "published") && (
                        <div className="border border-violet-200 rounded-xl p-4 bg-violet-50">
                          <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide mb-1">Schedule to go live</p>
                          <p className="text-[11px] text-violet-500 mb-3">Pick a date and time — the post will automatically publish at that moment.</p>
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <input
                              type="datetime-local"
                              value={postForm.publishAt}
                              min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                              onChange={(e) => { handlePostFieldChange("publishAt", e.target.value); if (e.target.value) handlePostFieldChange("date", e.target.value.slice(0, 10)); }}
                              className="border border-violet-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                            />
                            <Button type="button" variant="outline" disabled={isPublishingPost || !postForm.publishAt} onClick={() => handleSavePost("scheduled")} className="rounded-lg border-violet-400 text-violet-700 hover:bg-violet-100 disabled:opacity-40">
                              Schedule Post
                            </Button>
                            {postForm.publishAt && (
                              <span className="text-xs text-violet-600 font-medium">Goes live: {new Date(postForm.publishAt).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={handleCancelEdit} className="rounded-lg">Cancel</Button>
                        <div className="flex gap-3">
                          <Button type="button" variant="outline" disabled={isPublishingPost} onClick={() => handleSavePost("draft")} className="rounded-lg border-amber-400 text-amber-700 hover:bg-amber-50">
                            {isPublishingPost ? "Saving…" : "Save as Draft"}
                          </Button>
                          <Button type="submit" disabled={isPublishingPost} className="rounded-lg">
                            {isPublishingPost ? "Publishing…" : editingPostId ? "Update Post" : "Publish Post"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SUBSCRIBERS ── */}
          {activeSection === "subscribers" && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 text-sm">Newsletter Subscribers</h2>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{subscribers.length} total</span>
              </div>
              {subscribers.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <Mail className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                  <p className="font-medium text-sm">No subscribers yet</p>
                  <p className="text-xs mt-1">Subscribers will appear here once they sign up</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="text-left bg-slate-50 border-b border-slate-100">
                        <th className="py-3 px-5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Email</th>
                        <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Source</th>
                        <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Subscribed</th>
                        <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedSubscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-5 font-medium text-slate-900 text-sm">{subscriber.email}</td>
                          <td className="py-3 px-4 text-slate-500 text-xs">{subscriber.source || "unknown"}</td>
                          <td className="py-3 px-4 text-slate-500 text-xs">{new Date(subscriber.subscribed_at).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            {subscriber.unsubscribed_at
                              ? <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 font-medium">Unsubscribed</span>
                              : <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 font-medium">Active</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5">
                    <PagerBar total={subscribers.length} page={subPage} perPage={SUB_PER_PAGE} onPageChange={setSubPage} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TRACKING ── */}
          {activeSection === "tracking" && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Sub-tabs */}
              <div className="px-2 sm:px-5 border-b border-slate-100 flex gap-0 overflow-x-auto">
                {(["pageviews", "clicks", "events"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTrackingTabChange(t)}
                    className={`px-3 sm:px-4 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors -mb-px ${
                      trackingTab === t ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {t === "pageviews" ? `Page Views (${trackingPageViews.length})` : t === "clicks" ? `Outbound Clicks (${trackingRedirections.length})` : `Events (${trackingEvents.length})`}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {isFetchingTracking ? (
                  <div className="py-16 text-center text-slate-400">
                    <div className="w-7 h-7 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-3" />
                    <p className="text-sm">Loading tracking data…</p>
                  </div>
                ) : trackingTab === "pageviews" ? (
                  trackingPageViews.length === 0 ? (
                    <div className="py-14 text-center text-slate-400">
                      <Eye className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                      <p className="font-medium text-sm">No page views recorded yet</p>
                      <p className="text-xs mt-1">Data appears here once visitors land on your site with cookie consent enabled.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px] text-sm">
                        <thead>
                          <tr className="text-left bg-slate-50 border-b border-slate-100">
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Page</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Referrer</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Device</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Browser</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">Secs</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">When</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedPv.map((row) => (
                            <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-3 max-w-[220px]">
                                <span className="block font-medium text-slate-800 text-xs truncate">{row.page_title || "—"}</span>
                                <span className="text-[11px] text-slate-400 truncate block">{row.page_path}</span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 text-xs max-w-[160px] truncate">
                                {row.referrer ? new URL(row.referrer).hostname : <span className="italic">direct</span>}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 text-xs capitalize">{row.device_type || "—"}</td>
                              <td className="py-2.5 px-3 text-slate-600 text-xs">{row.browser || "—"}</td>
                              <td className="py-2.5 px-3 text-right text-slate-600 text-xs">{row.view_time_seconds ?? 0}</td>
                              <td className="py-2.5 px-3 text-right text-slate-400 text-xs whitespace-nowrap">{new Date(row.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <PagerBar total={trackingPageViews.length} page={pvPage} perPage={TRACK_PER_PAGE} onPageChange={setPvPage} />
                    </div>
                  )
                ) : trackingTab === "clicks" ? (
                  trackingRedirections.length === 0 ? (
                    <div className="py-14 text-center text-slate-400">
                      <MousePointerClick className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                      <p className="font-medium text-sm">No outbound clicks recorded yet</p>
                      <p className="text-xs mt-1">Every external link click on your site will appear here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] text-sm">
                        <thead>
                          <tr className="text-left bg-slate-50 border-b border-slate-100">
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Destination</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Link Text</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Type</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Source Page</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">When</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedClicks.map((row) => (
                            <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-3 max-w-[200px]">
                                <a href={row.destination_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs truncate block">
                                  {(() => { try { return new URL(row.destination_url).hostname; } catch { return row.destination_url; } })()}
                                </a>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 text-xs max-w-[160px] truncate">{row.link_text || "—"}</td>
                              <td className="py-2.5 px-3"><span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-medium">{row.link_type || "outbound"}</span></td>
                              <td className="py-2.5 px-3 text-slate-400 text-xs max-w-[160px] truncate">{(() => { try { return new URL(row.source_url).pathname; } catch { return row.source_url; } })()}</td>
                              <td className="py-2.5 px-3 text-right text-slate-400 text-xs whitespace-nowrap">{new Date(row.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <PagerBar total={trackingRedirections.length} page={clicksPage} perPage={TRACK_PER_PAGE} onPageChange={setClicksPage} />
                    </div>
                  )
                ) : (
                  trackingEvents.length === 0 ? (
                    <div className="py-14 text-center text-slate-400">
                      <Activity className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                      <p className="font-medium text-sm">No events recorded yet</p>
                      <p className="text-xs mt-1">Click events and custom events will appear here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] text-sm">
                        <thead>
                          <tr className="text-left bg-slate-50 border-b border-slate-100">
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Event</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Type</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Page</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Element</th>
                            <th className="py-2.5 px-3 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">When</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedEvents.map((row) => (
                            <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-3 font-medium text-slate-800 text-xs">{row.event_name}</td>
                              <td className="py-2.5 px-3"><span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 font-medium">{row.event_type}</span></td>
                              <td className="py-2.5 px-3 text-slate-500 text-xs max-w-[180px] truncate">{row.page_path || "—"}</td>
                              <td className="py-2.5 px-3 text-slate-500 text-xs max-w-[160px] truncate">{row.element_text || "—"}</td>
                              <td className="py-2.5 px-3 text-right text-slate-400 text-xs whitespace-nowrap">{new Date(row.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <PagerBar total={trackingEvents.length} page={eventsPage} perPage={TRACK_PER_PAGE} onPageChange={setEventsPage} />
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeSection === "settings" && <SettingsPanel />}

          </div>
        </main>
      </div>

      {/* Delete modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Delete Post?</h2>
            <p className="text-sm text-slate-600 mb-1">You are about to permanently delete:</p>
            <p className="text-sm font-semibold text-slate-800 mb-5 line-clamp-2">"{deleteModal.title}"</p>
            <p className="text-xs text-slate-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Keep</button>
              <button onClick={confirmDeletePost} className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
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
