import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostCard } from "@/components/blog/PostCard";
import { blogPosts, categories } from "@/lib/posts";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Filter posts
  const filteredPosts = useMemo(() => {
    let posts = [...blogPosts];

    // Filter by category
    if (selectedCategory) {
      posts = posts.filter((post) => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, selectedCategory]);

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
        title="Blog & Articles"
        description="Discover insights on AI, fintech, debt management, and real-time financial solutions."
        url="/blog"
      />
      <Header />

      <main id="main-content">
        {/* Page Header */}
        <section className="bg-gray-50 border-b border-gray-200 py-12">
          <div className="container">
            <h1 className="font-oswald text-4xl lg:text-5xl font-bold uppercase mb-4">
              Blog & <span className="text-blue-600">Articles</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Discover insights on AI, fintech, debt management, and real-time financial solutions.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <div className="mb-8">
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
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
                      className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {paginatedPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 py-8">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded font-semibold ${
                            currentPage === page
                              ? "bg-black text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No articles found. Try adjusting your filters.</p>
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
