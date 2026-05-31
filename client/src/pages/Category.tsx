import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/ui/Pagination";
import { categories } from "@/lib/categories";
import { useState, useMemo } from "react";
import { useParams } from "wouter";
import { SEO } from "@/components/SEO";
import { usePostIndex } from "@/lib/post-cache";
import { SITE_URL } from "@/lib/config";

export default function Category() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const allPosts = usePostIndex();
  const category = categories.find((cat) => cat.slug === categorySlug);

  const filteredPosts = useMemo(() => {
    if (!category) return [];
    return [...allPosts]
      .filter((post) => post.category === category.name)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [category, allPosts]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main id="main-content" className="container pt-24 sm:pt-28 pb-20 text-center">
          <h1 className="font-oswald text-2xl sm:text-3xl font-bold mb-3">Category Not Found</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">The category you're looking for doesn't exist.</p>
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
    name: `${category.name} Articles`,
    description: category.description,
    url: `${SITE_URL}/category/${category.slug}`,
    inLanguage: "en-GB",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/category/${category.slug}` },
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
        title={`${category.name} Articles`}
        description={category.description}
        url={`/category/${category.slug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        <PageHeader title={category.name} subtitle={category.description} />

        {/* Content */}
        <div className="container py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
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
                  <p className="text-gray-500 text-base">No articles found in this category.</p>
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
