import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { postIndex } from "../../client/src/lib/postsIndex";
import { postContentBySlug } from "../../client/src/lib/postsContent";
import type { BlogPost } from "../../client/src/lib/types";

export type PublishedPost = BlogPost & { content: string };

// Slugs that vercel.json redirects elsewhere: keep them out of the sitemap, feed and prerendered pages.
const REDIRECTED_SLUGS = new Set(["best-ai-health-apps-uk-2025"]);

function repoPosts(): PublishedPost[] {
  return postIndex
    .filter((post) => !REDIRECTED_SLUGS.has(post.slug))
    .map((post) => ({ ...post, content: postContentBySlug[post.slug] || "" }));
}

/** Published posts as the live site lists them: Supabase when reachable, the in-repo copy otherwise. */
export async function loadPublishedPosts(): Promise<PublishedPost[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("[posts] Supabase env vars not set, using in-repo posts");
    return repoPosts();
  }

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,title,slug,excerpt,content,author,date,updated_at,category,tags,reading_time,featured,image,meta_description,keywords"
      )
      .eq("status", "published")
      .order("date", { ascending: false });

    if (error || !data) throw new Error(error?.message || "no data returned");

    console.log(`[posts] Loaded ${data.length} published posts from Supabase`);
    return data.filter((row: any) => !REDIRECTED_SLUGS.has(row.slug)).map((row: any) => ({
      id: String(row.id),
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt || "",
      content: row.content || postContentBySlug[row.slug] || "",
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
    }));
  } catch (err: any) {
    console.warn(`[posts] Supabase unavailable (${err?.message}), using in-repo posts`);
    return repoPosts();
  }
}
