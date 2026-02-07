import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/blog/PostCard";
import { getFeaturedPosts, getRecentPosts } from "@/lib/blog-utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { NewsletterForm } from "@/components/NewsletterForm";

export default function Home() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(6);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Home"
        description="Explore the intersection of artificial intelligence and financial technology. Real-time solutions, debt management strategies, and the latest fintech innovations."
      />
      <Header />

      <main id="main-content">
        {/* Hero Section */}
        <section className="bg-gray-50 border-b border-gray-200 py-16 lg:py-20">
          <div className="container max-w-4xl mx-auto text-center">
            {/* Logo - Commented out since we have logo in header */}
            {/*
            <img 
              src="/images/Kaash_logo.png" 
              alt="The Kaash Journal" 
              className="h-32 md:h-40 lg:h-48 xl:h-56 w-auto object-contain mx-auto mb-0"
            />
            */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed px-4">
              Explore the intersection of artificial intelligence and financial technology. Real-time solutions, debt management strategies, and the latest fintech innovations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 text-lg rounded-none"
              >
                <a href="/blog">
                  Explore Articles <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white font-bold px-8 py-6 text-lg rounded-none"
              >
                <a href="#featured">Featured Posts</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section id="featured" className="py-20 bg-gray-50 border-b border-gray-200">
          <div className="container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase mb-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No featured posts available.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-20">
          <div className="container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-oswald text-4xl lg:text-5xl font-bold uppercase mb-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No articles available yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-700 text-white py-16">
          <div className="container text-center">
            <h2 className="font-oswald text-3xl lg:text-4xl font-bold uppercase mb-4">
              Never Miss an Update
            </h2>
            <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto">
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
