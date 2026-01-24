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
import { blogPosts } from "@/lib/posts";
import { useMemo } from "react";
import { SkipToContent } from "@/components/SkipToContent";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        post.category.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery]);

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200" role="banner">
      <SkipToContent />
      {/* Logo Section - Centered */}
      <div className="container py-6 relative">
        {/* Mobile Menu Button - Top Right Corner (Mobile Only) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden absolute top-6 right-4"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

        {/* Logo - Centered */}
        <a href="/" className="flex justify-center items-center hover:opacity-80 transition-opacity">
          <img 
            src="/images/kaash_logo1.png" 
            alt="The Kaash Journal" 
            className="h-32 md:h-40 lg:h-48 xl:h-52 w-auto object-contain max-w-full"
          />
        </a>

        {/* Mobile Navigation - Below Logo */}
        {isOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`block py-2 text-sm font-medium transition-colors ${
                  location === item.href
                    ? "text-black"
                    : "text-gray-600 hover:text-black"
                }`}
                aria-current={location === item.href ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
            <button 
              onClick={handleSearchClick}
              className="block py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-2"
              aria-label="Search articles"
              aria-expanded={isSearchOpen}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </nav>
        )}
      </div>

      {/* Navigation Section - Below Logo (Desktop Only) */}
      <div className="border-t border-gray-200 bg-white hidden md:block">
        <div className="container py-3">
          <div className="flex items-center justify-center">
            {/* Desktop Navigation */}
            <nav className="flex items-center justify-center gap-8" role="navigation" aria-label="Main navigation">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors px-2 py-1 ${
                    location === item.href
                      ? "text-black border-b-2 border-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                  aria-current={location === item.href ? "page" : undefined}
                >
                  {item.label}
                </a>
              ))}
              {/* Search Option */}
              <button 
                onClick={handleSearchClick}
                className="text-gray-600 hover:text-black transition-colors p-2"
                aria-label="Search articles"
                aria-expanded={isSearchOpen}
              >
                <Search className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
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
