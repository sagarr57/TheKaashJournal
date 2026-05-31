import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { NewsletterForm } from "@/components/NewsletterForm";
import { useState, useEffect, useMemo } from "react";
import { fetchPublishedPostIndex } from "@/lib/blog-data";
import { postIndex } from "@/lib/postsIndex";

export default function Home() {
  const [posts, setPosts] = useState(postIndex);

  useEffect(() => {
    let cancelled = false;
    async function loadPosts() {
      const data = await fetchPublishedPostIndex();
      if (!cancelled && data.length > 0) setPosts(data);
    }
    loadPosts();
    return () => { cancelled = true; };
  }, []);

  const featuredPosts = useMemo(
    () => posts.filter((p) => p.featured).slice(0, 4),
    [posts]
  );
  const recentPosts = useMemo(
    () => [...posts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6),
    [posts]
  );

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AI, Health & Fintech — Practical Guides for Everyone"
        description="In-depth guides on AI, health tech, fintech, and personal finance. Source-linked, jargon-free articles for curious readers everywhere."
        url="/"
      />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-b border-gray-100 py-14 md:py-20 lg:py-24">
          <div className="container max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              UK-focused · Source-linked · FCA-aware
            </div>
            <h1 className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold uppercase mb-4 md:mb-5 text-gray-900 leading-tight tracking-tight">
              AI, Health &amp; Fintech —{" "}
              <span className="text-blue-600">Practical Guides for Everyone</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto">
              In-depth guides on AI tools, health tech, debt management, and fintech trends. Every claim is source-linked so you can verify it yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                asChild
                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all"
              >
                <a href="/blog">
                  Explore Articles <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 px-6 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all"
              >
                <a href="#featured">Featured Posts</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Posts — hero layout: first post large, next two stacked */}
        <section id="featured" className="py-10 md:py-14">
          <div className="container">
            <div className="flex items-end justify-between mb-6 md:mb-8">
              <div>
                <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase mb-1">
                  Featured <span className="text-blue-600">Posts</span>
                </h2>
                <p className="text-gray-500 text-sm">Our most important and timely articles</p>
              </div>
              <a href="/blog" className="hidden md:flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700 text-sm transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {featuredPosts.length > 0 ? (
              <>
                {featuredPosts[0] && (
                  <article className="group relative rounded-2xl overflow-hidden">
                    <a href={`/blog/${featuredPosts[0].slug}`} className="block relative h-72 md:h-96 overflow-hidden bg-gray-900">
                      <img
                        src={featuredPosts[0].image}
                        alt={featuredPosts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    </a>
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
                      <span className="inline-block text-xs font-semibold uppercase tracking-wide text-blue-300 mb-3">{featuredPosts[0].category}</span>
                      <h3 className="font-oswald text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2 group-hover:text-blue-200 transition-colors">
                        <a href={`/blog/${featuredPosts[0].slug}`}>{featuredPosts[0].title}</a>
                      </h3>
                      <p className="text-white/70 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl mb-4 hidden sm:block">{featuredPosts[0].excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-white/60">
                        <span className="font-medium">{featuredPosts[0].author}</span>
                        <span aria-hidden>·</span>
                        <span>{featuredPosts[0].readingTime} min read</span>
                      </div>
                    </div>
                  </article>
                )}
                {featuredPosts.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                    {featuredPosts.slice(1, 4).map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">No featured posts available.</div>
            )}
          </div>
        </section>

        {/* Latest Articles */}
        <section className="py-10 md:py-14 bg-gray-50/60 border-y border-gray-100">
          <div className="container">
            <div className="flex items-end justify-between mb-6 md:mb-8">
              <div>
                <h2 className="font-oswald text-2xl sm:text-3xl font-bold uppercase mb-1">
                  Latest <span className="text-blue-600">Articles</span>
                </h2>
                <p className="text-gray-500 text-sm">Stay updated with our newest content</p>
              </div>
              <a href="/blog" className="hidden md:flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700 text-sm transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">No articles available yet.</div>
            )}

            <div className="text-center mt-8">
              <a href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 px-5 py-2.5 rounded-xl bg-white hover:bg-blue-50 transition-all">
                See all articles <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white relative overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="container text-center relative">
            <h2 className="font-oswald text-2xl sm:text-3xl md:text-4xl font-bold uppercase mb-3">
              Never Miss an Update
            </h2>
            <p className="text-blue-100 mb-7 max-w-xl mx-auto leading-relaxed">
              Subscribe and get the latest AI, fintech, and health tech insights delivered to your inbox every week.
            </p>
            <NewsletterForm
              placeholder="Enter your email address"
              buttonText="Subscribe"
              className="max-w-md mx-auto"
              source="homepage"
            />
            <p className="text-blue-200 text-xs mt-4">No spam. Unsubscribe any time.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
