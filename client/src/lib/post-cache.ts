import { useState, useEffect } from "react";
import { fetchPublishedPostIndex } from "./blog-data";
import { postIndex } from "./postsIndex";
import type { BlogPost } from "./types";

type PostIndexItem = Omit<BlogPost, "content">;

let cachedPosts: PostIndexItem[] | null = null;
let fetchPromise: Promise<PostIndexItem[]> | null = null;

function fetchAndCache(): Promise<PostIndexItem[]> {
  if (cachedPosts) return Promise.resolve(cachedPosts);
  if (!fetchPromise) {
    fetchPromise = fetchPublishedPostIndex()
      .then((data) => {
        const result = data.length > 0 ? data : postIndex;
        cachedPosts = result;
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
