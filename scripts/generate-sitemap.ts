import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { postIndex } from "../client/src/lib/postsIndex";
import { categories } from "../client/src/lib/categories";
import { buildCanonicalUrl, DEFAULT_SITE_URL, normalizeSiteUrl } from "../shared/site-url";

const SITE_URL = normalizeSiteUrl(
  process.env.SITE_URL || process.env.VITE_SITE_URL || DEFAULT_SITE_URL
);

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: string;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeDate(date?: string): string | undefined {
  if (!date) return undefined;
  const normalized = new Date(date);
  if (Number.isNaN(normalized.getTime())) return undefined;
  return normalized.toISOString().split("T")[0];
}

function buildUrlEntry({ loc, lastmod, changefreq, priority }: SitemapUrl): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}${changefreq ? `    <changefreq>${changefreq}</changefreq>\n` : ""}${priority ? `    <priority>${priority}</priority>\n` : ""}  </url>`;
}

const staticRoutes: SitemapUrl[] = [
  { loc: buildCanonicalUrl(SITE_URL, "/"), changefreq: "daily", priority: "1.0" },
  { loc: buildCanonicalUrl(SITE_URL, "/blog"), changefreq: "daily", priority: "0.9" },
  { loc: buildCanonicalUrl(SITE_URL, "/about"), changefreq: "monthly", priority: "0.6" },
  { loc: buildCanonicalUrl(SITE_URL, "/contact"), changefreq: "monthly", priority: "0.6" },
  { loc: buildCanonicalUrl(SITE_URL, "/editorial-policy"), changefreq: "monthly", priority: "0.4" },
  { loc: buildCanonicalUrl(SITE_URL, "/disclaimer"), changefreq: "monthly", priority: "0.4" },
  { loc: buildCanonicalUrl(SITE_URL, "/author/kash"), changefreq: "monthly", priority: "0.5" },
  { loc: buildCanonicalUrl(SITE_URL, "/author/saga"), changefreq: "monthly", priority: "0.5" },
  { loc: buildCanonicalUrl(SITE_URL, "/privacy-policy"), changefreq: "monthly", priority: "0.3" },
  { loc: buildCanonicalUrl(SITE_URL, "/terms-and-conditions"), changefreq: "monthly", priority: "0.3" },
  { loc: buildCanonicalUrl(SITE_URL, "/cookie-policy"), changefreq: "monthly", priority: "0.3" },
];

const categoryRoutes: SitemapUrl[] = categories.map((category) => ({
  loc: buildCanonicalUrl(SITE_URL, `/category/${category.slug}`),
  changefreq: "weekly",
  priority: "0.7",
}));

const postRoutes: SitemapUrl[] = postIndex.map((post) => ({
  loc: buildCanonicalUrl(SITE_URL, `/blog/${post.slug}`),
  lastmod: normalizeDate(post.updated || post.date),
  changefreq: "weekly",
  priority: post.featured ? "0.8" : "0.7",
}));

// Tag archive pages are noindex (thin listings) — do not submit them in the sitemap.
const allRoutes = [...staticRoutes, ...categoryRoutes, ...postRoutes];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(buildUrlEntry).join("\n")}
</urlset>
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, "../client/public/sitemap.xml");

writeFileSync(outputPath, xml, "utf8");
console.log(`Generated ${outputPath} with ${allRoutes.length} URLs`);
