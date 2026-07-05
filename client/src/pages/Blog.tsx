import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/ui/Pagination";
import { categories } from "@/lib/categories";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { SEO } from "@/components/SEO";
import { usePostIndex } from "@/lib/post-cache";
import { useSearch } from "wouter";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const posts = usePostIndex();
  const postsPerPage = 9;

  // Pre-fill search from ?q= (supports Google sitelinks search box)
  const search = useSearch();
  useEffect(() => {
    const q = new URLSearchParams(search).get("q");
    if (q) setSearchQuery(q);
  }, [search]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, selectedCategory, posts]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Blog — Money, AI & Fintech Articles"
        description="Long-form articles on AI, fintech, debt, and personal finance—with sources linked in the text."
        url="/blog"
      />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        {/* Page Header */}
        <section className="bg-gray-50 border-b border-gray-200 py-5 md:py-6">
          <div className="container">
            <h1 className="font-oswald text-xl sm:text-2xl md:text-3xl font-bold normal-case tracking-tight mb-1.5 md:mb-2 text-gray-900">
              The <span className="text-blue-600">Kaash Journal</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl leading-relaxed mb-3">
              Long-form guides on AI, fintech, debt, and money psychology—sources linked in the copy so you can verify claims yourself.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Written by{" "}
              <a href="/author/saga" className="text-blue-700 hover:underline font-medium">Saga</a>{" "}
              and{" "}
              <a href="/author/kash" className="text-blue-700 hover:underline font-medium">Kash</a>.{" "}
              <a href="/editorial-policy" className="text-blue-700 hover:underline">Editorial standards</a> ·{" "}
              <a href="/disclaimer" className="text-blue-700 hover:underline">Disclaimers</a>
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="container py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <div className="mb-5 md:mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-12 pr-4 py-3 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-5 md:mb-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`px-3 md:px-4 py-2 rounded font-semibold text-xs sm:text-sm transition-colors ${
                      selectedCategory === null
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Posts
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.name)}
                      className={`px-3 md:px-4 py-2 rounded font-semibold text-xs sm:text-sm transition-colors ${
                        selectedCategory === category.name
                          ? "text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      style={
                        selectedCategory === category.name
                          ? { backgroundColor: category.color }
                          : {}
                      }
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts Grid */}
              {paginatedPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    {paginatedPosts.map((post, i) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        className={paginatedPosts.length % 2 === 1 && i === paginatedPosts.length - 1 ? "md:col-span-2" : ""}
                      />
                    ))}
                  </div>

                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-base">No articles found. Try adjusting your filters.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
