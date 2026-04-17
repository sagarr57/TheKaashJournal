import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { lazy, Suspense, useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GTM } from "./components/GTM";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTracking } from "./hooks/usePageTracking";
import { useLinkTracking } from "./hooks/useLinkTracking";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import {
  COOKIE_CONSENT_EVENT,
  CookieConsentStatus,
  getCookieConsentStatus,
} from "./lib/cookie-consent";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Blog = lazy(() => import("./pages/Blog"));
const Post = lazy(() => import("./pages/Post"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Category = lazy(() => import("./pages/Category"));
const Tag = lazy(() => import("./pages/Tag"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <Skeleton className="w-12 h-12 rounded-full mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  );
}

function Router() {
  // Track page views automatically
  usePageTracking();
  // Track link clicks automatically
  useLinkTracking();
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/blog"} component={Blog} />
        <Route path={"/blog/:slug"} component={Post} />
        <Route path={"/category/:slug"} component={Category} />
        <Route path={"/tag/:tag"} component={Tag} />
        <Route path={"/about"} component={About} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/privacy-policy"} component={PrivacyPolicy} />
        <Route path={"/terms-and-conditions"} component={TermsAndConditions} />
        <Route path={"/cookie-policy"} component={CookiePolicy} />
        <Route path={"/admin/login"} component={AdminLogin} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const gtmId = import.meta.env.VITE_GTM_ID || "";
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus | null>(null);

  useEffect(() => {
    setConsentStatus(getCookieConsentStatus());

    const handleConsentUpdate = (event: Event) => {
      const consentEvent = event as CustomEvent<CookieConsentStatus>;
      setConsentStatus(consentEvent.detail);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentUpdate);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentUpdate);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {gtmId && consentStatus === "accepted" && <GTM gtmId={gtmId} />}
          <Router />
          <CookieConsentBanner />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
