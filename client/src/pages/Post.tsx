import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostMeta } from "@/components/blog/PostMeta";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { getPostBySlug } from "@/lib/blog-utils";
import { useParams } from "wouter";

export default function Post() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="font-oswald text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
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
      <Header />

      <main>
        {/* Hero Image */}
        <div className="w-full h-96 overflow-hidden bg-gray-200">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Container */}
        <div className="container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-3">
              {/* Title */}
              <h1 className="font-oswald text-4xl lg:text-5xl font-bold uppercase mb-8 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="mb-12 pb-12 border-b border-gray-200">
                <PostMeta post={post} />
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-16">
                <div
                  className="space-y-6 text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: post.content
                      .split("\n")
                      .map((line) => {
                        if (line.startsWith("# ")) {
                          return `<h2 class="font-oswald text-3xl font-bold uppercase mt-8 mb-4">${line.substring(2)}</h2>`;
                        }
                        if (line.startsWith("## ")) {
                          return `<h3 class="font-oswald text-2xl font-bold uppercase mt-6 mb-3">${line.substring(3)}</h3>`;
                        }
                        if (line.startsWith("### ")) {
                          return `<h4 class="font-oswald text-xl font-bold uppercase mt-4 mb-2">${line.substring(4)}</h4>`;
                        }
                        if (line.startsWith("- ")) {
                          return `<li class="ml-6">${line.substring(2)}</li>`;
                        }
                        if (line.startsWith("| ")) {
                          return `<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-gray-300"><tr>${line
                            .split("|")
                            .slice(1, -1)
                            .map((cell) => `<td class="border border-gray-300 p-2">${cell.trim()}</td>`)
                            .join("")}</tr></table></div>`;
                        }
                        if (line === "") {
                          return "<br>";
                        }
                        if (line.includes("**")) {
                          return `<p>${line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`;
                        }
                        return `<p>${line}</p>`;
                      })
                      .join(""),
                  }}
                />
              </div>

              {/* Related Posts */}
              <RelatedPosts currentPost={post} />
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <Sidebar />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
