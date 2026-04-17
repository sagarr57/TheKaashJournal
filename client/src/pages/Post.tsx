import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostMeta } from "@/components/blog/PostMeta";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { getPostBySlug } from "@/lib/blog-utils";
import { useParams } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Image } from "@/components/ui/image";
import { SEO } from "@/components/SEO";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SocialShare } from "@/components/SocialShare";
import { useEffect, useState } from "react";
import { fetchPostBySlugWithContent } from "@/lib/blog-data";

function MarkdownCode({
  inline,
  className,
  children,
  ...rest
}: {
  inline?: boolean;
  className?: string;
  children?: any;
}) {
  const match = /language-(\w+)/.exec(className || "");
  const isInline = !!inline || !match;

  if (isInline) {
    return (
      <code
        className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800"
        {...rest}
      >
        {children}
      </code>
    );
  }

  // Keep code blocks lightweight: avoid bundling syntax highlighting libraries.
  return (
    <pre className="bg-gray-900 text-gray-100 rounded p-4 my-4 overflow-x-auto text-sm">
      <code>{String(children).replace(/\n$/, "")}</code>
    </pre>
  );
}

/** Open article links in a new tab so readers keep this page (internal /… paths too). Same tab only for fragments and tel/mailto/sms. */
function markdownLinkOpensNewTab(href: string | undefined): boolean {
  if (!href || href === "#") return false;
  if (href.startsWith("#")) return false;
  if (/^(mailto|tel|sms):/i.test(href)) return false;
  return true;
}

export default function Post() {
  const params = useParams();
  const slug = params.slug as string;
  const [postMeta, setPostMeta] = useState(getPostBySlug(slug));
  const [content, setContent] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setContent(null);
    setContentError(null);
    setPostMeta(getPostBySlug(slug));

    async function load() {
      try {
        const supabasePost = await fetchPostBySlugWithContent(slug);
        if (!cancelled && supabasePost) {
          setPostMeta(supabasePost);
          setContent(supabasePost.content || "");
          return;
        }

        const mod = await import("@/lib/postsContent");
        const loaded = mod.postContentBySlug?.[slug];
        if (!loaded) throw new Error("Content not found");
        if (!cancelled) setContent(loaded);
      } catch (e: any) {
        if (!cancelled) setContentError(e?.message || "Failed to load content");
      }
    }

    if (postMeta) load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!postMeta) {
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
        title={postMeta.title}
        description={postMeta.excerpt}
        image={postMeta.image}
        url={`/blog/${postMeta.slug}`}
        type="article"
        author={postMeta.author}
        publishedTime={new Date(postMeta.date).toISOString()}
        tags={postMeta.tags}
      />
      <ReadingProgress />
      <Header />

      <main id="main-content">
        {/* Hero Image */}
        <div className="w-full h-52 sm:h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-200">
          <Image
            src={postMeta.image}
            alt={postMeta.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Container */}
        <div className="container py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Main Content — narrow measure reads like a real article */}
            <article className="lg:col-span-3 max-w-3xl">
              {/* Title */}
              <h1 className="font-oswald text-3xl sm:text-4xl lg:text-[2.5rem] font-bold normal-case tracking-tight mb-6 md:mb-8 leading-tight text-gray-900">
                {postMeta.title}
              </h1>

              {/* Meta Information */}
              <div className="mb-8 md:mb-10 pb-8 md:pb-10 border-b border-gray-200">
                <PostMeta post={postMeta as any} />
              </div>

              {/* Content */}
              <div className="prose prose-base md:prose-lg max-w-none mb-12 md:mb-16">
                <div className="text-[1.0625rem] md:text-lg text-gray-800 leading-[1.75] markdown-content article-body">
                  {contentError && (
                    <div className="border border-red-200 bg-red-50 text-red-800 p-4 rounded">
                      Failed to load article content. Please refresh and try again.
                    </div>
                  )}
                  {!content && !contentError && (
                    <div className="text-gray-500">Loading article...</div>
                  )}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="font-oswald text-3xl font-bold normal-case tracking-tight mt-10 mb-4 text-gray-900" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="font-oswald text-2xl sm:text-[1.65rem] font-bold normal-case tracking-tight mt-10 mb-4 text-gray-900" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="font-oswald text-xl sm:text-2xl font-bold normal-case tracking-tight mt-8 mb-3 text-gray-900" {...props} />
                      ),
                      h4: ({ node, ...props }) => (
                        <h4 className="font-oswald text-lg font-bold normal-case tracking-tight mt-6 mb-2 text-gray-900" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-5 leading-[1.75]" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-6 mb-5 space-y-2 marker:text-gray-400" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-6 mb-5 space-y-2 marker:text-gray-400" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="pl-1 leading-[1.7]" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-gray-900" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic text-gray-800" {...props} />
                      ),
                      a: ({ node, ...props }) => {
                        const href = typeof props.href === "string" ? props.href : undefined;
                        const newTab = markdownLinkOpensNewTab(href);
                        return (
                          <a
                            className="text-blue-700 hover:text-blue-800 underline underline-offset-[3px] decoration-blue-700/40 hover:decoration-blue-800"
                            {...props}
                            {...(newTab
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          />
                        );
                      },
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-[3px] border-blue-600 bg-slate-50 py-4 px-5 my-6 rounded-r-md text-gray-700 not-italic text-[0.98em] leading-relaxed"
                          {...props}
                        />
                      ),
                      code: (props: any) => <MarkdownCode {...props} />,
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
                        <Image
                          className="max-w-full h-auto rounded my-4"
                          {...props}
                          alt={props.alt || postMeta.title}
                        />
                      ),
                    }}
                  >
                    {content || ""}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Social Share */}
              <SocialShare
                title={postMeta.title}
                url={`/blog/${postMeta.slug}`}
                description={postMeta.excerpt}
              />

              {/* Related Posts */}
              <RelatedPosts currentPost={postMeta as any} />
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
