import { categories } from "./categories";
import { postIndex } from "./postsIndex";
import type { BlogPost } from "./types";

export function getPostBySlug(slug: string): BlogPost | undefined {
  // Used as initial state in Post.tsx before Supabase resolves.
  return postIndex.find((post) => post.slug === slug) as unknown as BlogPost | undefined;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getCategoryColor(categoryName: string): string {
  const category = categories.find((cat) => cat.name === categoryName);
  return category?.color || "#0066FF";
}
