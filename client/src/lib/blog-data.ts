// Blog posts: Supabase `blog_posts` is the primary source when the table returns rows.
// `postIndex` + `postContentBySlug` are the static fallback (offline, tests, first paint).
// Repo edits to `postsContent.ts` apply live only after you upsert SQL (see `documentation/SUPABASE_BLOG_SEED.sql`)
// or publish via admin — otherwise production keeps the previous DB content.
import { postIndex } from "@/lib/postsIndex";
import { postContentBySlug } from "@/lib/postsContent";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/types";
import { author } from "@/lib/categories";

type BlogPostIndexItem = Omit<BlogPost, "content">;
const EDITORIAL_BYLINE = author.name;

function mapRowToPostIndex(row: any): BlogPostIndexItem {
  return {
    id: String(row.id),
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || "",
    author: EDITORIAL_BYLINE,
    date: row.date,
    updated: row.updated || undefined,
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

async function autoPublishScheduled() {
  try {
    await supabase
      .from("blog_posts")
      .update({ status: "published", publish_at: null })
      .eq("status", "scheduled")
      .lte("publish_at", new Date().toISOString());
  } catch {
    // silent — best-effort
  }
}

export async function fetchPublishedPostIndex(): Promise<BlogPostIndexItem[]> {
  try {
    await autoPublishScheduled();

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,title,slug,excerpt,author,date,updated,category,tags,reading_time,featured,image,meta_description,keywords"
      )
      .eq("status", "published")
      .order("date", { ascending: false });

    if (error || !data || data.length === 0) {
      return postIndex;
    }

    return data.map(mapRowToPostIndex);
  } catch {
    return postIndex;
  }
}

export async function fetchPostBySlugWithContent(
  slug: string
): Promise<BlogPost | null> {
  try {
    await autoPublishScheduled();

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,title,slug,excerpt,content,author,date,updated,category,tags,reading_time,featured,image,meta_description,keywords"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      const fallbackMeta = postIndex.find((p) => p.slug === slug);
      const fallbackContent = postContentBySlug[slug];
      if (!fallbackMeta || !fallbackContent) return null;
      return {
        ...fallbackMeta,
        author: EDITORIAL_BYLINE,
        content: fallbackContent,
      };
    }

    const mapped = mapRowToPostIndex(data);
    return {
      ...mapped,
      author: EDITORIAL_BYLINE,
      content: data.content || "",
    };
  } catch {
    const fallbackMeta = postIndex.find((p) => p.slug === slug);
    const fallbackContent = postContentBySlug[slug];
    if (!fallbackMeta || !fallbackContent) return null;
    return {
      ...fallbackMeta,
      author: EDITORIAL_BYLINE,
      content: fallbackContent,
    };
  }
}

