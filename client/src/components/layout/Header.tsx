import { Button } from "@/components/ui/button";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePostIndex } from "@/lib/post-cache";
import { useMemo } from "react";
import { SkipToContent } from "@/components/SkipToContent";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Blog listing, post, category, tag: hide header while reading; show again only near top of page.
  const isBlogPage = useMemo(() => {
    return (
      location === '/blog' ||
      location.startsWith('/blog/') ||
      location.startsWith('/category/') ||
      location.startsWith('/tag/')
    );
  }, [location]);

  const BLOG_HEADER_TOP_THRESHOLD_PX = 48;

  useEffect(() => {
    if (!isBlogPage) {
      setIsHeaderVisible(true);
      return;
    }

    const syncHeader = () => {
      if (isOpen) {
        setIsHeaderVisible(true);
        return;
      }
      setIsHeaderVisible(window.scrollY <= BLOG_HEADER_TOP_THRESHOLD_PX);
    };

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
    return () => window.removeEventListener("scroll", syncHeader);
  }, [isBlogPage, isOpen, location]);

  const allPosts = usePostIndex();

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allPosts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          post.category.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery, allPosts]);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleResultClick = (slug: string) => {
    setLocation(`/blog/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ];

  return (
    <header
      className={`sticky top-3 sm:top-4 z-50 px-3 sm:px-4 lg:px-6 transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      role="banner"
    >
      <SkipToContent />
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white">
        <div className="relative flex min-h-16 items-center justify-center px-3 py-1.5 sm:px-5 sm:py-2">
          <a href="/" className="flex items-center hover:opacity-85 transition-opacity">
            <img
              src="/images/Kaash_logo.png"
              alt="The Kaash Journal"
              className="h-16 w-auto object-contain"
            />
          </a>

          <nav
            className="hidden md:flex items-center justify-center gap-1 absolute right-3 sm:right-5"
            role="navigation"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                  location === item.href
                    ? "text-slate-950 bg-slate-100"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80"
                }`}
                aria-current={location === item.href ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={handleSearchClick}
              className="text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-colors p-2 rounded-lg"
              aria-label="Search articles"
              aria-expanded={isSearchOpen}
            >
              <Search className="w-5 h-5" />
            </button>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden absolute right-3"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {isOpen && (
          <nav
            className="md:hidden border-t border-slate-200/80 px-3 pb-3 pt-2 space-y-1"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  location === item.href
                    ? "text-slate-950 bg-slate-100"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80"
                }`}
                aria-current={location === item.href ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={handleSearchClick}
              className="w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-colors flex items-center gap-2"
              aria-label="Search articles"
              aria-expanded={isSearchOpen}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </nav>
        )}
      </div>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Search Articles</DialogTitle>
            <DialogDescription>
              Search through our blog posts by title, content, tags, or category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />
            
            {searchQuery.trim() && (
              <div className="max-h-[400px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => handleResultClick(post.slug)}
                        className="w-full text-left p-4 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors rounded"
                      >
                        <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">{post.category}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{post.readingTime} min read</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No articles found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
            
            {!searchQuery.trim() && (
              <div className="text-center py-8 text-gray-500">
                <p>Start typing to search...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
