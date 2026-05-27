import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = process.env.VITE_SITE_URL || "https://www.thekaashjournal.com";

const STATIC_PAGES = [
  { path: "/",                    priority: "1.0", changefreq: "daily"   },
  { path: "/blog",                priority: "0.9", changefreq: "daily"   },
  { path: "/about",               priority: "0.6", changefreq: "monthly" },
  { path: "/contact",             priority: "0.6", changefreq: "monthly" },
  { path: "/privacy-policy",      priority: "0.3", changefreq: "monthly" },
  { path: "/terms-and-conditions",priority: "0.3", changefreq: "monthly" },
];

const CATEGORY_SLUGS = [
  "ai-and-health",
  "debt-management",
  "real-time-finance",
  "fintech-trends",
  "case-studies",
];

function toDateString(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  try {
    return new Date(value).toISOString().split("T")[0];
  } catch {
    return fallback;
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string
): string {
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "";

  const today = new Date().toISOString().split("T")[0];

  let posts: Array<{ slug: string; date: string; updated_at?: string | null }> = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const sb = createClient(supabaseUrl, supabaseKey);
      const { data } = await sb
        .from("blog_posts")
        .select("slug,date,updated_at")
        .eq("status", "published")
        .order("date", { ascending: false });
      if (data) posts = data;
    } catch {
      // Supabase unreachable — sitemap will still include static pages
    }
  }

  const entries: string[] = [];

  for (const page of STATIC_PAGES) {
    entries.push(urlEntry(`${SITE_URL}${page.path}`, today, page.changefreq, page.priority));
  }

  for (const slug of CATEGORY_SLUGS) {
    entries.push(urlEntry(`${SITE_URL}/category/${slug}`, today, "weekly", "0.7"));
  }

  for (const post of posts) {
    const lastmod = toDateString(post.updated_at || post.date, today);
    entries.push(urlEntry(`${SITE_URL}/blog/${post.slug}`, lastmod, "monthly", "0.8"));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  return res.status(200).send(xml);
}
