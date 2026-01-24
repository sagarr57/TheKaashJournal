import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostMeta } from "@/components/blog/PostMeta";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { getPostBySlug } from "@/lib/blog-utils";
import { useParams } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Image } from "@/components/ui/image";
import { SEO } from "@/components/SEO";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SocialShare } from "@/components/SocialShare";

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
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.image}
        url={`/blog/${post.slug}`}
        type="article"
        author={post.author}
        publishedTime={new Date(post.date).toISOString()}
        tags={post.tags}
      />
      <ReadingProgress />
      <Header />

      <main id="main-content">
        {/* Hero Image */}
        <div className="w-full h-96 overflow-hidden bg-gray-200">
          <Image
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
                <div className="space-y-6 text-gray-700 leading-relaxed markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="font-oswald text-4xl font-bold uppercase mt-8 mb-4 text-black" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="font-oswald text-3xl font-bold uppercase mt-8 mb-4 text-black" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="font-oswald text-2xl font-bold uppercase mt-6 mb-3 text-black" {...props} />
                      ),
                      h4: ({ node, ...props }) => (
                        <h4 className="font-oswald text-xl font-bold uppercase mt-4 mb-2 text-black" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-4 leading-relaxed" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside mb-4 space-y-2 ml-4" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-2 ml-4" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-bold text-black" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-blue-600 hover:text-blue-700 underline" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600" {...props} />
                      ),
                      code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded my-4"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800" {...props}>
                            {children}
                          </code>
                        );
                      },
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="w-full border-collapse border border-gray-300" {...props} />
                        </div>
                      ),
                      thead: ({ node, ...props }) => (
                        <thead className="bg-gray-50" {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th className="border border-gray-300 p-3 text-left font-bold text-black" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="border border-gray-300 p-3" {...props} />
                      ),
                      img: ({ node, ...props }: any) => (
                        <Image className="max-w-full h-auto rounded my-4" {...props} alt={props.alt || post.title} />
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Social Share */}
              <SocialShare
                title={post.title}
                url={`/blog/${post.slug}`}
                description={post.excerpt}
              />

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
