// What the build-time prerender put on this page, captured before React replaces it.
import type { BlogPost } from "./types";

const root = typeof document !== "undefined" ? document.getElementById("root") : null;

export const prerenderedHtml = root?.innerHTML ?? "";
export const prerenderedPath = typeof window !== "undefined" ? window.location.pathname : "";

function readPost(): (BlogPost & { content: string }) | null {
  try {
    const data = document.getElementById("prerendered-post")?.textContent;
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export const prerenderedPost = readPost();
