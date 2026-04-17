import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { postIndex } from "../client/src/lib/postsIndex";
import { categories } from "../client/src/lib/categories";

const DEFAULT_SITE_URL = "https://www.thekaashjournal.com";
const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

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
  { loc: `${SITE_URL}/`, changefreq: "daily", priority: "1.0" },
  { loc: `${SITE_URL}/blog`, changefreq: "daily", priority: "0.9" },
  { loc: `${SITE_URL}/about`, changefreq: "monthly", priority: "0.6" },
  { loc: `${SITE_URL}/contact`, changefreq: "monthly", priority: "0.6" },
  { loc: `${SITE_URL}/privacy-policy`, changefreq: "monthly", priority: "0.3" },
  { loc: `${SITE_URL}/terms-and-conditions`, changefreq: "monthly", priority: "0.3" },
  { loc: `${SITE_URL}/cookie-policy`, changefreq: "monthly", priority: "0.3" },
];

const categoryRoutes: SitemapUrl[] = categories.map((category) => ({
  loc: `${SITE_URL}/category/${category.slug}`,
  changefreq: "weekly",
  priority: "0.7",
}));

const postRoutes: SitemapUrl[] = postIndex.map((post) => ({
  loc: `${SITE_URL}/blog/${post.slug}`,
  lastmod: normalizeDate(post.updated || post.date),
  changefreq: "weekly",
  priority: post.featured ? "0.8" : "0.7",
}));

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
