import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/blog/PostCard";
import { getFeaturedPosts, getRecentPosts } from "@/lib/blog-utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { NewsletterForm } from "@/components/NewsletterForm";
import { cn } from "@/lib/utils";

export default function Home() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(6);

  const heroCtaClass =
    "box-border h-10 sm:h-11 w-full sm:w-44 md:w-48 justify-center rounded-none text-sm md:text-base font-semibold px-4 md:px-5 border-2";

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
        <section className="bg-white border-b border-gray-200 py-5 md:py-6 lg:py-7">
          <div className="container max-w-4xl mx-auto text-center">
            <h1 className="font-oswald text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-2 md:mb-3 text-gray-900">
              AI, Health &amp; Fintech — <span className="text-blue-600">Practical Guides for Everyone</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 md:mb-5 leading-relaxed px-1 sm:px-4">
              Explore AI tools, health tech, debt management, and fintech trends — clear, source-linked articles you can actually use.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center items-stretch sm:items-center">
              <Button
                asChild
                className={cn(
                  heroCtaClass,
                  "border-transparent bg-blue-600 hover:bg-blue-700 text-white shadow-none"
                )}
              >
                <a href="/blog">
                  Explore Articles <ArrowRight className="ml-1.5 w-4 h-4 shrink-0" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className={cn(
                  heroCtaClass,
                  "border-gray-800 bg-transparent text-gray-800 hover:bg-gray-800 hover:text-white shadow-none"
                )}
              >
                <a href="#featured">Featured Posts</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section id="featured" className="py-6 md:py-7 bg-gray-50 border-b border-gray-200">
          <div className="container">
            <div className="flex items-end justify-between mb-4 md:mb-5">
              <div>
                <h2 className="font-oswald text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-1.5">
                  Featured <span className="text-blue-600">Posts</span>
                </h2>
                <p className="text-gray-600">Our most important and timely articles</p>
              </div>
              <a
                href="/blog"
                className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
              >
                View All <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {featuredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No featured posts available.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-6 md:py-7">
          <div className="container">
            <div className="flex items-end justify-between mb-4 md:mb-5">
              <div>
                <h2 className="font-oswald text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-1.5">
                  Latest <span className="text-blue-600">Articles</span>
                </h2>
                <p className="text-gray-600">Stay updated with our newest content</p>
              </div>
              <a
                href="/blog"
                className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
              >
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
              <div className="text-center py-6">
                <p className="text-gray-500">No articles available yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-700 text-white py-5 md:py-7">
          <div className="container text-center">
            <h2 className="font-oswald text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-2">
              Never Miss an Update
            </h2>
            <p className="text-sm md:text-base text-blue-50 mb-4 md:mb-5 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest insights delivered to your inbox weekly.
            </p>
            <NewsletterForm
              placeholder="Enter your email"
              buttonText="Subscribe"
              className="max-w-md mx-auto"
              source="homepage"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
