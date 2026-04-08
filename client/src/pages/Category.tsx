import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostCard } from "@/components/blog/PostCard";
import { postIndex } from "@/lib/postsIndex";
import { categories } from "@/lib/categories";
import { useState, useMemo } from "react";
import { useParams } from "wouter";
import { SEO } from "@/components/SEO";

export default function Category() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Find category by slug
  const category = categories.find((cat) => cat.slug === categorySlug);

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    if (!category) return [];
    
    return postIndex
      .filter((post) => post.category === category.name)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [category]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="font-oswald text-4xl font-bold mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
          <a href="/blog" className="text-blue-600 font-semibold hover:text-blue-700">
            ← Back to Blog
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${category.name} Articles`}
        description={category.description}
        url={`/category/${category.slug}`}
      />
      <Header />

      <main id="main-content">
        {/* Page Header */}
        <section className="bg-gray-50 border-b border-gray-200 py-10 md:py-12">
          <div className="container">
            <h1 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-bold uppercase mb-3 md:mb-4">
              {category.name}
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              {category.description}
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="container py-10 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {paginatedPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {paginatedPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center gap-2 py-8">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 md:px-4 py-2 text-sm rounded font-semibold ${
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
                        className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No articles found in this category.</p>
                  <a href="/blog" className="text-blue-600 font-semibold hover:text-blue-700 mt-4 inline-block">
                    ← Back to Blog
                  </a>
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
