// Blog posts: Supabase `blog_posts` is the primary source when the table returns rows.
// `postIndex` + `postContentBySlug` are the static fallback (offline, tests, first paint).
// Repo edits to `postsContent.ts` apply live only after you upsert SQL (see `documentation/SUPABASE_BLOG_SEED.sql`)
// or publish via admin — otherwise production keeps the previous DB content.
import { postIndex } from "@/lib/postsIndex";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/types";

type BlogPostIndexItem = Omit<BlogPost, "content">;

function mapRowToPostIndex(row: any): BlogPostIndexItem {
  return {
    id: String(row.id),
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || "",
    author: row.author || "The Kaash Journal",
    date: row.date,
    updated: row.updated_at || undefined,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags : [],
    readingTime: row.reading_time || 5,
    featured: !!row.featured,
    image: row.image || "/images/hero-abstract.jpg",
    seo: {
      metaDescription: row.meta_description || row.excerpt || "",
      keywords: Array.isArray(row.keywords) ? row.keywords : [],
    },
  };
}

// Run at most once per JS session — it's best-effort, the cron is authoritative
let autoPublishRan = false;
async function autoPublishScheduled() {
  if (autoPublishRan) return;
  autoPublishRan = true;
  try {
    await supabase
      .from("blog_posts")
      .update({ status: "published", publish_at: null })
      .eq("status", "scheduled")
      .lte("publish_at", new Date().toISOString());
  } catch {
    // silent
  }
}

// --- Per-post content cache (sessionStorage, 30-min TTL) ---
const POST_TTL = 30 * 60 * 1000;
function postCacheKey(slug: string) { return `kaash_post_${slug}`; }

function loadPostFromSession(slug: string): BlogPost | null {
  try {
    const raw = sessionStorage.getItem(postCacheKey(slug));
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > POST_TTL) return null;
    return data as BlogPost;
  } catch { return null; }
}

function savePostToSession(slug: string, post: BlogPost) {
  try {
    sessionStorage.setItem(postCacheKey(slug), JSON.stringify({ data: post, ts: Date.now() }));
  } catch {}
}

export async function fetchPublishedPostIndex(): Promise<BlogPostIndexItem[]> {
  try {
    await autoPublishScheduled();

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,title,slug,excerpt,author,date,updated_at,category,tags,reading_time,featured,image,meta_description,keywords"
      )
      .eq("status", "published")
      .order("date", { ascending: false });

    // Only fall back to static data on a real error (network/RLS), not when DB has 0 published posts
    if (error) return postIndex;
    if (!data) return postIndex;

    return data.map(mapRowToPostIndex);
  } catch {
    return postIndex;
  }
}

export async function fetchPostBySlugWithContent(
  slug: string
): Promise<BlogPost | null> {
  // Serve from session cache first for instant repeat visits
  const cached = loadPostFromSession(slug);
  if (cached) return cached;

  try {
    await autoPublishScheduled();

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,title,slug,excerpt,content,author,date,updated_at,category,tags,reading_time,featured,image,meta_description,keywords"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      // postsContent.ts (432KB) loaded lazily — only when Supabase fails
      const { postContentBySlug } = await import("@/lib/postsContent");
      const fallbackMeta = postIndex.find((p) => p.slug === slug);
      const fallbackContent = postContentBySlug[slug];
      if (!fallbackMeta || !fallbackContent) return null;
      return { ...fallbackMeta, content: fallbackContent };
    }

    const mapped = mapRowToPostIndex(data);
    const post: BlogPost = { ...mapped, content: data.content || "" };
    savePostToSession(slug, post);
    return post;
  } catch {
    const { postContentBySlug } = await import("@/lib/postsContent");
    const fallbackMeta = postIndex.find((p) => p.slug === slug);
    const fallbackContent = postContentBySlug[slug];
    if (!fallbackMeta || !fallbackContent) return null;
    return { ...fallbackMeta, content: fallbackContent };
  }
}

