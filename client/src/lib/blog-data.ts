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

export async function fetchPublishedPostIndex(): Promise<BlogPostIndexItem[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,title,slug,excerpt,author,date,updated,category,tags,reading_time,featured,image,meta_description,keywords"
      )
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
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,title,slug,excerpt,content,author,date,updated,category,tags,reading_time,featured,image,meta_description,keywords"
      )
      .eq("slug", slug)
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

