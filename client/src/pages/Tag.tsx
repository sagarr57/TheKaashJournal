import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostCard } from "@/components/blog/PostCard";
import { useState, useMemo } from "react";
import { useParams } from "wouter";
import { SEO } from "@/components/SEO";
import { usePostIndex } from "@/lib/post-cache";

const SITE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL
    ? import.meta.env.VITE_SITE_URL
    : "https://www.thekaashjournal.com";

export default function Tag() {
  const params = useParams();
  const tagSlug = params.tag as string;
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const allPosts = usePostIndex();

  // Convert slug to display name
  const tagName = tagSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [allPosts]);

  const tagExists = allTags.some((t) => t.toLowerCase() === tagSlug.toLowerCase());

  const filteredPosts = useMemo(() => {
    if (!tagExists) return [];
    const actualTag = allTags.find((t) => t.toLowerCase() === tagSlug.toLowerCase());
    if (!actualTag) return [];
    return [...allPosts]
      .filter((post) => post.tags.includes(actualTag))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [tagSlug, tagExists, allTags, allPosts]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  if (!tagExists) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main id="main-content" className="container pt-24 sm:pt-28 pb-20 text-center">
          <h1 className="font-oswald text-2xl sm:text-3xl font-bold mb-3">Tag Not Found</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            The tag you're looking for doesn't exist.
          </p>
          <a href="/blog" className="text-blue-600 font-semibold hover:text-blue-700">
            ← Back to Blog
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `#${tagName} Articles`,
    description: `All articles tagged with "${tagName}"`,
    url: `${SITE_URL}/tag/${tagSlug}`,
    inLanguage: "en-GB",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: `#${tagName}`, item: `${SITE_URL}/tag/${tagSlug}` },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: filteredPosts.length,
      itemListElement: filteredPosts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: post.title,
        url: `${SITE_URL}/blog/${post.slug}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`#${tagName} Articles`}
        description={`All articles tagged with "${tagName}"`}
        url={`/tag/${tagSlug}`}
        noIndex={true}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Header />
      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        {/* Page Header */}
        <section className="bg-gray-50 border-b border-gray-200 py-5 md:py-6">
          <div className="container">
            <h1 className="font-oswald text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-1.5 md:mb-2">
              #{tagName} <span className="text-blue-600">Articles</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              All articles tagged with "{tagName}"
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="container py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {paginatedPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 md:mb-9">
                    {paginatedPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center gap-2 py-5">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        aria-label="Previous page"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 md:px-4 py-2 text-sm rounded-none font-semibold transition-colors ${
                            currentPage === page
                              ? "bg-black text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                          aria-label={`Go to page ${page}`}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        aria-label="Next page"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    No articles found with the tag "{tagName}".
                  </p>
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
