import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostMeta } from "@/components/blog/PostMeta";
import { PostEditorialFooter } from "@/components/blog/PostEditorialFooter";
import { YmylDisclaimer } from "@/components/blog/YmylDisclaimer";
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
import { postContentBySlug } from "@/lib/postsContent";
import { AdUnit } from "@/components/AdUnit";
import { SITE_URL } from "@/lib/config";
import { buildCanonicalUrl } from "@shared/site-url";

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

  return (
    <pre className="bg-gray-900 text-gray-100 rounded p-4 my-4 overflow-x-auto text-sm">
      <code>{String(children).replace(/\n$/, "")}</code>
    </pre>
  );
}

function markdownLinkOpensNewTab(href: string | undefined): boolean {
  if (!href || href === "#") return false;
  if (href.startsWith("#")) return false;
  if (/^(mailto|tel|sms):/i.test(href)) return false;
  return true;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const items: TocItem[] = [];
  for (const line of lines) {
    const match = /^(#{2,4})\s+(.+)/.exec(line);
    if (match) {
      const text = match[2].replace(/[*_`[\]]/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      items.push({ id, text, level: match[1].length });
    }
  }
  return items;
}

function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 3) return null;
  return (
    <nav
      aria-label="Table of contents"
      className="my-5 md:my-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-700">
        In this article
      </p>
      <ol className="space-y-1.5 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className="text-blue-700 hover:text-blue-900 hover:underline"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function slugifyHeading(text: string): string {
  return text
    .replace(/[*_`[\]]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function extractFaqSchema(content: string) {
  const marker = "## Frequently Asked Questions";
  const faqIdx = content.indexOf(marker);
  if (faqIdx === -1) return null;
  const section = content.slice(faqIdx + marker.length);
  const pairs: Array<{ question: string; answer: string }> = [];

  const cleanAnswer = (raw: string) =>
    raw
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`#]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  // Format 1: ### Heading question (used in newer articles)
  const h3Re = /###\s+([^\n]+)\n+([\s\S]*?)(?=\n###\s|\n##\s|$)/g;
  let m: RegExpExecArray | null;
  while ((m = h3Re.exec(section)) !== null) {
    const question = m[1].trim();
    const answer = cleanAnswer(m[2]);
    if (question && answer) pairs.push({ question, answer });
  }

  // Format 2: **Bold question?** (used in older articles) — only if no H3 pairs found
  if (pairs.length === 0) {
    const boldRe = /\*\*([^*]+\?[^*]*)\*\*\s*\n+([\s\S]*?)(?=\n\*\*[^*]+\?|$)/g;
    while ((m = boldRe.exec(section)) !== null) {
      const question = m[1].trim();
      const answer = cleanAnswer(m[2]);
      if (question && answer) pairs.push({ question, answer });
    }
  }
  if (pairs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export default function Post() {
  const params = useParams();
  const slug = params.slug as string;
  const [postMeta, setPostMeta] = useState(getPostBySlug(slug));
  // Initialize from static data so Googlebot sees full content on first paint;
  // useEffect then updates with the latest version from Supabase.
  const [content, setContent] = useState<string | null>(postContentBySlug[slug] ?? null);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setContent(postContentBySlug[slug] ?? null);
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

    // Always fetch from Supabase — posts created via admin won't be in static data
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!postMeta) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main id="main-content" className="container pt-24 sm:pt-28 pb-20 text-center">
          <h1 className="font-oswald text-2xl sm:text-3xl font-bold mb-3">Article Not Found</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">The article you're looking for doesn't exist.</p>
          <a href="/blog" className="text-blue-600 font-semibold hover:text-blue-700">
            ← Back to Blog
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  const tocItems = content ? extractToc(content) : [];
  const postUrl = buildCanonicalUrl(SITE_URL, `/blog/${postMeta.slug}`);

  const FINANCE_CATEGORIES = ["Debt Management", "Real-Time Finance", "Fintech Trends", "Case Studies"];
  const HEALTH_CATEGORIES = ["AI and Health"];
  const isFinancePost = FINANCE_CATEGORIES.includes(postMeta.category || "");
  const isHealthPost = HEALTH_CATEGORIES.includes(postMeta.category || "");
  const postImage = postMeta.image?.startsWith("http")
    ? postMeta.image
    : `${SITE_URL}${postMeta.image}`;

  const GENERIC_AUTHOR_NAMES = ["The Kaash Journal", "Team Kaash", ""];
  const authorName = postMeta.author?.trim() || "";
  const isNamedAuthor = authorName && !GENERIC_AUTHOR_NAMES.includes(authorName);
  const authorSlug = authorName.toLowerCase(); // "Kash" → "kash", "Saga" → "saga"
  const authorPageUrl = isNamedAuthor ? `${SITE_URL}/author/${authorSlug}` : `${SITE_URL}/about`;

  const authorSchema = isNamedAuthor
    ? { "@type": "Person", name: authorName, url: authorPageUrl }
    : { "@type": "Organization", name: "The Kaash Journal", url: `${SITE_URL}/about` };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: postMeta.title,
    description: postMeta.excerpt,
    image: postImage,
    url: postUrl,
    datePublished: new Date(postMeta.date).toISOString(),
    dateModified: postMeta.updated
      ? new Date(postMeta.updated).toISOString()
      : new Date(postMeta.date).toISOString(),
    author: authorSchema,
    publisher: {
      "@type": "Organization",
      name: "The Kaash Journal",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/Kaash_logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    inLanguage: "en-GB",
    ...(postMeta.category ? { articleSection: postMeta.category } : {}),
    ...(postMeta.tags?.length ? { keywords: postMeta.tags.join(", ") } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      ...(postMeta.category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: postMeta.category,
              item: `${SITE_URL}/category/${postMeta.category
                .toLowerCase()
                .replace(/\s+/g, "-")}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: postMeta.title,
              item: postUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: postMeta.title,
              item: postUrl,
            },
          ]),
    ],
  };

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
        modifiedTime={
          postMeta.updated
            ? new Date(postMeta.updated).toISOString()
            : undefined
        }
        tags={postMeta.tags}
        category={postMeta.category}
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {content && (() => {
        const faq = extractFaqSchema(content);
        return faq ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
          />
        ) : null;
      })()}

      <ReadingProgress />
      <Header />

      <main id="main-content" className="pt-6 sm:pt-8 md:pt-10">
        {/* Hero Image */}
        <div className="w-full h-56 sm:h-72 md:h-96 lg:h-[420px] overflow-hidden bg-gray-200">
          <Image
            src={postMeta.image}
            alt={postMeta.title}
            className="w-full h-full object-cover"
            priority={true}
          />
        </div>

        {/* Article Container */}
        <div className="container py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            <article className="lg:col-span-3 max-w-3xl">

              {/* Breadcrumb nav (visible) */}
              <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500 flex flex-wrap gap-1 items-center">
                <a href="/" className="hover:text-blue-700 hover:underline">Home</a>
                <span aria-hidden="true">/</span>
                <a href="/blog" className="hover:text-blue-700 hover:underline">Blog</a>
                {postMeta.category && (
                  <>
                    <span aria-hidden="true">/</span>
                    <a
                      href={`/category/${postMeta.category.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:text-blue-700 hover:underline"
                    >
                      {postMeta.category}
                    </a>
                  </>
                )}
                <span aria-hidden="true">/</span>
                <span className="text-gray-700 truncate max-w-[200px]">{postMeta.title}</span>
              </nav>

              {/* Title */}
              <h1 className="font-oswald text-2xl sm:text-3xl lg:text-[2rem] font-bold normal-case tracking-tight mb-4 md:mb-5 leading-tight text-gray-900">
                {postMeta.title}
              </h1>

              {/* Meta Information */}
              <div className="mb-5 md:mb-6 pb-5 md:pb-6 border-b border-gray-200">
                <PostMeta post={postMeta as any} />
              </div>

              {/* YMYL Disclaimer */}
              {(isFinancePost || isHealthPost) && (
                <YmylDisclaimer type={isHealthPost ? "health" : "finance"} />
              )}

              {/* Table of Contents */}
              {content && <TableOfContents items={tocItems} />}

              {/* In-content ad — set VITE_ADSENSE_SLOT_IN_CONTENT in Vercel env vars */}
              {import.meta.env.VITE_ADSENSE_SLOT_IN_CONTENT && (
                <AdUnit
                  slot={import.meta.env.VITE_ADSENSE_SLOT_IN_CONTENT}
                  format="horizontal"
                  className="my-5"
                />
              )}

              {/* Content */}
              <div className="prose prose-sm md:prose-base max-w-none mb-8 md:mb-10">
                <div className="text-[1rem] md:text-[1.0625rem] text-gray-800 leading-[1.7] markdown-content article-body">
                  {contentError && (
                    <div className="border border-red-200 bg-red-50 text-red-800 p-4 rounded">
                      Failed to load article content. Please refresh and try again.
                    </div>
                  )}
                  {!content && !contentError && (
                    <div className="animate-pulse space-y-3" aria-label="Loading article content">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-11/12" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-4/5" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="mt-6 h-5 bg-gray-200 rounded w-2/3" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-10/12" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="mt-6 h-5 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-9/12" />
                    </div>
                  )}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="font-oswald text-2xl font-bold normal-case tracking-tight mt-8 mb-3 text-gray-900" {...props} />
                      ),
                      h2: ({ node, children, ...props }) => {
                        const text = String(children ?? "");
                        const id = slugifyHeading(text);
                        return (
                          <h2
                            id={id}
                            className="font-oswald text-xl sm:text-2xl font-bold normal-case tracking-tight mt-8 mb-3 text-gray-900"
                            {...props}
                          >
                            {children}
                          </h2>
                        );
                      },
                      h3: ({ node, children, ...props }) => {
                        const text = String(children ?? "");
                        const id = slugifyHeading(text);
                        return (
                          <h3
                            id={id}
                            className="font-oswald text-lg sm:text-xl font-bold normal-case tracking-tight mt-6 mb-2 text-gray-900"
                            {...props}
                          >
                            {children}
                          </h3>
                        );
                      },
                      h4: ({ node, children, ...props }) => {
                        const text = String(children ?? "");
                        const id = slugifyHeading(text);
                        return (
                          <h4
                            id={id}
                            className="font-oswald text-base md:text-lg font-bold normal-case tracking-tight mt-5 mb-1.5 text-gray-900"
                            {...props}
                          >
                            {children}
                          </h4>
                        );
                      },
                      p: ({ node, ...props }) => (
                        <p className="mb-4 leading-[1.7]" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-6 mb-4 space-y-1.5 marker:text-gray-400" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-6 mb-4 space-y-1.5 marker:text-gray-400" {...props} />
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
                          className="border-l-[3px] border-blue-600 bg-slate-50 py-3 px-4 my-4 rounded-r-md text-gray-700 not-italic text-[0.98em] leading-relaxed"
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

              {/* Post-content ad — high-engagement placement (reader just finished the article) */}
              {import.meta.env.VITE_ADSENSE_SLOT_POST_CONTENT && (
                <AdUnit
                  slot={import.meta.env.VITE_ADSENSE_SLOT_POST_CONTENT}
                  format="horizontal"
                  className="my-6"
                />
              )}

              <PostEditorialFooter post={postMeta} />

              {/* Author Bio */}
              {(() => {
                const displayName = authorName || "The Kaash Journal";
                const initials = displayName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((w: string) => w[0].toUpperCase())
                  .join("");

                const AUTHOR_BIOS: Record<string, { role: string; bio: string }> = {
                  kash: {
                    role: "Contributor — AI & Health Technology",
                    bio: "Kash covers AI in NHS services, wearable health technology, digital therapeutics, clinical AI tools, and real-time finance. Background in health technology, digital health research, and AI-driven financial systems. Every article is fact-checked against primary sources including NHS, GOV.UK, and peer-reviewed research.",
                  },
                  saga: {
                    role: "Contributor — Fintech & Regulation",
                    bio: "Saga covers UK fintech investment, FCA regulatory developments, open banking, BNPL, debt management strategies, and consumer finance. Background in UK financial services and compliance. All articles reference FCA guidance, MoneyHelper, and official regulatory sources.",
                  },
                };

                const authorBio = isNamedAuthor ? AUTHOR_BIOS[authorSlug] : null;
                const role = authorBio?.role || "The Kaash Journal";
                const bio = authorBio?.bio || "The Kaash Journal editorial team combines backgrounds in financial services, digital health, and investigative journalism. Every article is fact-checked against primary sources — including FCA guidance, NHS resources, GOV.UK, and peer-reviewed research — before publication.";
                const profileLink = isNamedAuthor ? `/author/${authorSlug}` : "/about";
                const profileLinkText = isNamedAuthor ? `About ${displayName} →` : "About our editorial team →";

                return (
                  <div className="border border-gray-200 rounded-lg p-5 md:p-6 mb-8 bg-gray-50">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Written by</p>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shrink-0 select-none">
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-0.5">{displayName}</p>
                        <p className="text-xs text-blue-600 font-medium mb-2 uppercase tracking-wide">{role}</p>
                        <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>
                        <a href={profileLink} className="inline-block mt-2 text-sm text-blue-700 hover:text-blue-800 font-medium hover:underline">
                          {profileLinkText}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Social Share */}
              <SocialShare
                title={postMeta.title}
                url={`/blog/${postMeta.slug}`}
                description={postMeta.excerpt}
              />

              {/* Post-related-posts ad — reader is browsing more content, high intent */}
              {import.meta.env.VITE_ADSENSE_SLOT_END_OF_ARTICLE && (
                <AdUnit
                  slot={import.meta.env.VITE_ADSENSE_SLOT_END_OF_ARTICLE}
                  format="horizontal"
                  className="mb-6"
                />
              )}

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
