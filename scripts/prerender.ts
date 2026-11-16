// Writes real HTML for each public page into client/dist after `vite build`, so crawlers and
// link previews get the page's own title, description, canonical URL and text without running JS.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { categories } from "../client/src/lib/categories";
import { getAuthorProfilePath } from "../client/src/lib/authors";
import { buildCanonicalUrl, buildPageTitle, DEFAULT_SITE_URL, normalizeSiteUrl } from "../shared/site-url";
import { loadPublishedPosts, type PublishedPost } from "./lib/load-posts";

const SITE_URL = normalizeSiteUrl(process.env.SITE_URL || process.env.VITE_SITE_URL || DEFAULT_SITE_URL);
const SITE_NAME = "The Kaash Journal";
const DEFAULT_IMAGE = "/images/Kaash_logo.png";
const ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../client/dist");
const template = readFileSync(path.join(distDir, "index.html"), "utf8");

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const absolute = (url: string) => (url.startsWith("http") ? url : `${SITE_URL}${url}`);
const jsonLd = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
const isoDate = (value?: string) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined;
};
const longDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

type PageHead = {
  route: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  extra?: string;
};

// data-rh marks tags as owned by react-helmet, so the app replaces them instead of duplicating them.
function headTags({ route, title, description, image = DEFAULT_IMAGE, type = "website", extra = "" }: PageHead) {
  const canonical = buildCanonicalUrl(SITE_URL, route === "/" ? "" : route);
  const fullTitle = buildPageTitle(title, SITE_NAME);
  const rh = 'data-rh="true"';
  return {
    fullTitle,
    tags: [
      `<meta ${rh} name="description" content="${esc(description)}" />`,
      `<meta ${rh} name="robots" content="${ROBOTS}" />`,
      `<link ${rh} rel="canonical" href="${canonical}" />`,
      `<meta ${rh} property="og:type" content="${type}" />`,
      `<meta ${rh} property="og:url" content="${canonical}" />`,
      `<meta ${rh} property="og:title" content="${esc(fullTitle)}" />`,
      `<meta ${rh} property="og:description" content="${esc(description)}" />`,
      `<meta ${rh} property="og:image" content="${esc(absolute(image))}" />`,
      `<meta ${rh} property="og:site_name" content="${SITE_NAME}" />`,
      `<meta ${rh} property="og:locale" content="en_GB" />`,
      `<meta ${rh} name="twitter:card" content="summary_large_image" />`,
      `<meta ${rh} name="twitter:site" content="@TheKaashJournal" />`,
      `<meta ${rh} name="twitter:title" content="${esc(fullTitle)}" />`,
      `<meta ${rh} name="twitter:description" content="${esc(description)}" />`,
      `<meta ${rh} name="twitter:image" content="${esc(absolute(image))}" />`,
      extra,
    ]
      .filter(Boolean)
      .join("\n    "),
  };
}

function stripPageSpecificTags(html: string) {
  return html
    .replace(/\s*<link rel="canonical"[^>]*>/, "")
    .replace(/\s*<meta name="description"[^>]*>/, "")
    .replace(/\s*<meta name="robots"[^>]*>/, "");
}

function writePage(head: PageHead, body: string) {
  const { fullTitle, tags } = headTags(head);
  const html = stripPageSpecificTags(template)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace("</head>", `  ${tags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const file =
    head.route === "/" ? path.join(distDir, "index.html") : path.join(distDir, head.route, "index.html");
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html, "utf8");
}

const siteNav = `<nav class="container py-6 text-sm"><a href="/">Home</a> · <a href="/blog">All articles</a> · ${categories
  .map((c) => `<a href="/category/${c.slug}">${esc(c.name)}</a>`)
  .join(" · ")} · <a href="/about">About</a> · <a href="/contact">Contact</a></nav>`;

function shell(inner: string) {
  return `${siteNav}<main id="main-content" class="container max-w-4xl pb-20">${inner}</main>`;
}

function postList(posts: PublishedPost[]) {
  return `<ul class="space-y-6 list-none p-0">${posts
    .map(
      (post) =>
        `<li><h2 class="font-oswald text-xl font-bold"><a href="/blog/${post.slug}">${esc(post.title)}</a></h2>` +
        `<p class="text-sm text-gray-500">${esc(post.category)} · ${longDate(post.date)} · ${post.readingTime} min read</p>` +
        `<p class="text-gray-700">${esc(post.excerpt)}</p></li>`
    )
    .join("")}</ul>`;
}

function listingPage(head: PageHead, heading: string, posts: PublishedPost[]) {
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: head.title,
    description: head.description,
    url: buildCanonicalUrl(SITE_URL, head.route === "/" ? "" : head.route),
    inLanguage: "en-GB",
  };
  writePage(
    head,
    shell(
      `<h1 class="font-oswald text-3xl md:text-4xl font-bold mb-3">${esc(heading)}</h1>` +
        `<p class="text-gray-600 mb-8">${esc(head.description)}</p>${postList(posts)}${jsonLd(collection)}`
    )
  );
}

function postPage(post: PublishedPost, related: PublishedPost[]) {
  const route = `/blog/${post.slug}`;
  const url = buildCanonicalUrl(SITE_URL, route);
  const published = isoDate(post.date);
  const modified = isoDate(post.updated) || published;
  const authorPath = getAuthorProfilePath(post.author);
  const category = categories.find((c) => c.name === post.category);
  const keywords = [...(post.seo?.keywords || []), ...(post.tags || [])];

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: absolute(post.image),
    url,
    datePublished: published,
    dateModified: modified,
    author: authorPath
      ? { "@type": "Person", name: post.author, url: `${SITE_URL}${authorPath}` }
      : { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/about` },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}${DEFAULT_IMAGE}` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en-GB",
    articleSection: post.category,
    ...(keywords.length ? { keywords: keywords.join(", ") } : {}),
  };

  // The page renders its own <h1>, so drop a leading markdown title to avoid two of them.
  const markdown = post.content.replace(/^\s*#\s+.+\n/, "");
  const contentHtml = renderToStaticMarkup(
    createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, markdown)
  );

  const extra = [
    published && `<meta data-rh="true" property="article:published_time" content="${published}" />`,
    modified && `<meta data-rh="true" property="article:modified_time" content="${modified}" />`,
    `<meta data-rh="true" property="article:author" content="${esc(post.author)}" />`,
    `<meta data-rh="true" property="article:section" content="${esc(post.category)}" />`,
    keywords.length && `<meta data-rh="true" name="keywords" content="${esc(keywords.join(", "))}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");

  const byline = authorPath ? `<a href="${authorPath}">${esc(post.author)}</a>` : esc(post.author);
  const categoryLink = category
    ? `<a href="/category/${category.slug}">${esc(post.category)}</a>`
    : esc(post.category);

  writePage(
    {
      route,
      title: post.title,
      description: post.seo?.metaDescription || post.excerpt,
      image: post.image,
      type: "article",
      extra,
    },
    shell(
      `<article>` +
        `<p class="text-sm text-gray-500 mb-2"><a href="/blog">Blog</a> › ${categoryLink}</p>` +
        `<h1 class="font-oswald text-3xl md:text-4xl font-bold mb-3">${esc(post.title)}</h1>` +
        `<p class="text-sm text-gray-500 mb-6">By ${byline} · <time datetime="${published || ""}">${longDate(post.date)}</time> · ${post.readingTime} min read</p>` +
        `<img src="${esc(post.image)}" alt="${esc(post.title)}" width="1200" height="630" class="w-full h-auto rounded-lg mb-6" />` +
        `<p class="text-lg text-gray-700 mb-6">${esc(post.excerpt)}</p>` +
        `<div class="prose prose-sm md:prose-base max-w-none">${contentHtml}</div>` +
        `</article>` +
        (related.length
          ? `<section class="mt-12"><h2 class="font-oswald text-2xl font-bold mb-4">More in ${esc(post.category)}</h2>${postList(related)}</section>`
          : "") +
        jsonLd(article)
    )
  );
}

function rssFeed(posts: PublishedPost[]) {
  const items = posts
    .slice(0, 50)
    .map((post) => {
      const link = buildCanonicalUrl(SITE_URL, `/blog/${post.slug}`);
      return `    <item>
      <title>${esc(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator>${esc(post.author)}</dc:creator>
      <category>${esc(post.category)}</category>
      <description>${esc(post.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>In-depth guides on AI, health tech, fintech, and personal finance for UK readers.</description>
    <language>en-GB</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

const staticPages: PageHead[] = [
  { route: "/about", title: "About The Kaash Journal", description: "The Kaash Journal publishes in-depth guides on AI, fintech, and personal finance for UK readers. Learn about our editorial standards, research process, and affiliate disclosure." },
  { route: "/contact", title: "Contact Us — The Kaash Journal", description: "Contact The Kaash Journal editorial team for corrections, partnership enquiries, reader feedback, and media requests. We respond within 1–2 business days." },
  { route: "/editorial-policy", title: "Editorial Policy", description: "How The Kaash Journal researches, writes, and publishes content — including our fact-checking process, affiliate disclosure, corrections policy, and editorial independence statement." },
  { route: "/disclaimer", title: "Disclaimer & Advertising Disclosure", description: "Important disclaimers for The Kaash Journal: financial and health information, Google AdSense advertising, affiliate links, and editorial limitations." },
  { route: "/privacy-policy", title: "Privacy Policy", description: "Read the privacy policy for The Kaash Journal, including data collection, advertising, cookies, analytics, and your rights under UK GDPR." },
  { route: "/terms-and-conditions", title: "Terms and Conditions", description: "Read the terms and conditions for using The Kaash Journal website, including content disclaimer, intellectual property, advertising disclosure, and governing law." },
  { route: "/cookie-policy", title: "Cookie Policy", description: "Full details of how The Kaash Journal uses cookies — including strictly necessary, analytics, and advertising cookies set by Google Analytics and Google AdSense." },
];

const posts = (await loadPublishedPosts())
  .filter((post) => post.slug && post.title && !Number.isNaN(new Date(post.date).getTime()))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Routes with no page of their own (tags, authors, admin) get a neutral shell, not the homepage's tags.
writeFileSync(path.join(distDir, "app.html"), stripPageSpecificTags(template), "utf8");

listingPage(
  { route: "/", title: "AI, Health & Fintech — Practical Guides for Everyone", description: "In-depth guides on AI, health tech, fintech, and personal finance. Source-linked, jargon-free articles for curious readers everywhere." },
  "The Kaash Journal — latest articles",
  posts.slice(0, 20)
);
listingPage(
  { route: "/blog", title: "All Articles — AI, Fintech, Debt & Health Guides", description: `${posts.length} in-depth guides on AI tools in the NHS, UK debt management (IVAs, DROs), open banking, FCA regulation, and fintech case studies. Source-linked and FCA-aware.` },
  "All articles",
  posts
);
for (const category of categories) {
  listingPage(
    { route: `/category/${category.slug}`, title: `${category.name} Articles — The Kaash Journal`, description: category.longDescription ?? category.description },
    `${category.name} articles`,
    posts.filter((post) => post.category === category.name)
  );
}
for (const page of staticPages) {
  writePage(
    page,
    shell(`<h1 class="font-oswald text-3xl md:text-4xl font-bold mb-3">${esc(page.title)}</h1><p class="text-gray-600">${esc(page.description)}</p>`)
  );
}
for (const post of posts) {
  if (!post.content) continue;
  postPage(post, posts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 5));
}

writeFileSync(path.join(distDir, "rss.xml"), rssFeed(posts), "utf8");

console.log(`Prerendered ${posts.length} posts, ${categories.length} categories, ${staticPages.length + 2} pages and rss.xml`);
