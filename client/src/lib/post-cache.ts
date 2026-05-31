import { useState, useEffect } from "react";
import { fetchPublishedPostIndex } from "./blog-data";
import { postIndex } from "./postsIndex";
import type { BlogPost } from "./types";

type PostIndexItem = Omit<BlogPost, "content">;

const SESSION_KEY = "kaash_post_index";
const SESSION_TTL = 10 * 60 * 1000; // 10 minutes

function loadIndexFromSession(): PostIndexItem[] | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > SESSION_TTL) return null;
    return data as PostIndexItem[];
  } catch { return null; }
}

function saveIndexToSession(data: PostIndexItem[]) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

let cachedPosts: PostIndexItem[] | null = loadIndexFromSession();
let fetchPromise: Promise<PostIndexItem[]> | null = null;

function fetchAndCache(): Promise<PostIndexItem[]> {
  if (cachedPosts) return Promise.resolve(cachedPosts);
  if (!fetchPromise) {
    fetchPromise = fetchPublishedPostIndex()
      .then((data) => {
        const result = data.length > 0 ? data : postIndex;
        cachedPosts = result;
        saveIndexToSession(result);
        return result;
      })
      .catch(() => {
        fetchPromise = null;
        return postIndex;
      });
  }
  return fetchPromise;
}

export function usePostIndex(): PostIndexItem[] {
  const [posts, setPosts] = useState<PostIndexItem[]>(cachedPosts || postIndex);

  useEffect(() => {
    if (cachedPosts) {
      setPosts(cachedPosts);
      return;
    }
    let cancelled = false;
    fetchAndCache().then((data) => {
      if (!cancelled) setPosts(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return posts;
}
