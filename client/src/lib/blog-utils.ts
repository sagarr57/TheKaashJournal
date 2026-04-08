import { categories } from "./categories";
import { postIndex } from "./postsIndex";
import type { BlogPost } from "./types";

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  // Content is loaded separately on the single-post route.
  return postIndex.find((post) => post.slug === slug) as unknown as BlogPost | undefined;
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  const category = categories.find((cat) => cat.slug === categorySlug);
  if (!category) return [];
  return postIndex.filter((post) => post.category === category.name) as unknown as BlogPost[];
}

export function getFeaturedPosts(): BlogPost[] {
  return postIndex.filter((post) => post.featured).slice(0, 3) as unknown as BlogPost[];
}

export function getRecentPosts(limit: number = 5): BlogPost[] {
  return [...postIndex]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit) as unknown as BlogPost[];
}

export function getRelatedPosts(post: BlogPost, limit: number = 3): BlogPost[] {
  return postIndex
    .filter(
      (p) =>
        p.id !== post.id &&
        (p.category === post.category || p.tags.some((tag) => post.tags.includes(tag)))
    )
    .slice(0, limit) as unknown as BlogPost[];
}

export function searchPosts(query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase();
  // Intentionally exclude `content` search to keep list routes lightweight.
  return postIndex.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  ) as unknown as BlogPost[];
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

export function getCategoryByName(categoryName: string) {
  return categories.find((cat) => cat.name === categoryName);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  postIndex.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): BlogPost[] {
  return postIndex.filter((post) => post.tags.includes(tag)) as unknown as BlogPost[];
}

export function paginate<T>(items: T[], page: number, pageSize: number = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}
