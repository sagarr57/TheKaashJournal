import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import About from "./pages/About";
import Category from "./pages/Category";
import Tag from "./pages/Tag";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import { GTM } from "./components/GTM";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={Post} />
      <Route path={"/category/:slug"} component={Category} />
      <Route path={"/tag/:tag"} component={Tag} />
      <Route path={"/about"} component={About} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const gtmId = import.meta.env.VITE_GTM_ID || "";

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {gtmId && <GTM gtmId={gtmId} />}
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
