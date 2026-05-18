// Vercel Cron Job endpoint — publishes any scheduled posts whose time has arrived.
// Called automatically by Vercel on the schedule defined in vercel.json.
// Vercel sends `Authorization: Bearer <CRON_SECRET>` so external callers can't trigger it.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only GET is used by Vercel cron; block everything else
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify Vercel's cron secret so random HTTP requests can't trigger this
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: "Supabase env vars not configured" });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("blog_posts")
    .update({ status: "published", publish_at: null })
    .eq("status", "scheduled")
    .lte("publish_at", new Date().toISOString())
    .select("id, title, slug");

  if (error) {
    console.error("[publish-scheduled] Supabase error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  const published = data || [];
  if (published.length > 0) {
    console.log(`[publish-scheduled] Published ${published.length} post(s):`, published.map((p: any) => p.slug));
  }

  return res.status(200).json({
    ok: true,
    published: published.length,
    posts: published.map((p: any) => ({ id: p.id, slug: p.slug, title: p.title })),
    checkedAt: new Date().toISOString(),
  });
}
