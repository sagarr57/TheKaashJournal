// Supabase client for the admin dashboard. Every request is sent to /api/admin/db with the
// admin session token; the server performs it with the service role key. The public anon key
// used elsewhere on the site can only read published posts and record page views.
import { createClient } from "@supabase/supabase-js";
import { getAdminToken, logout } from "../auth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const adminFetch: typeof fetch = async (input, init) => {
  const target = new URL(input instanceof Request ? input.url : String(input));
  const headers = new Headers(init?.headers);
  headers.delete("apikey");
  headers.set("Authorization", `Bearer ${getAdminToken()}`);

  const response = await fetch(
    `${API_BASE_URL}/admin/db?path=${encodeURIComponent(target.pathname + target.search)}`,
    { ...init, headers }
  );
  if (response.status === 401) logout();
  return response;
};

export const adminSupabase = createClient(supabaseUrl, "admin-proxy", {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: adminFetch },
});

/**
 * Asks the server to redeploy the site so its prerendered pages and sitemap include content changes.
 * Returns false when no deploy hook is configured.
 */
export async function requestSiteRebuild(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/rebuild`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    const result = await response.json().catch(() => ({}));
    return Boolean(result.triggered);
  } catch {
    return false;
  }
}

/** Asks the server for a one-time upload link, uploads the image to it, and returns its public URL. */
export async function uploadBlogImage(file: File): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/admin/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAdminToken()}` },
    body: JSON.stringify({ fileName: file.name }),
  });
  if (response.status === 401) logout();
  const ticket = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(ticket.error || "Could not prepare upload");

  const { supabase } = await import("@/lib/supabase");
  const { error } = await supabase.storage
    .from(ticket.bucket)
    .uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type });
  if (error) throw error;
  return ticket.publicUrl;
}
