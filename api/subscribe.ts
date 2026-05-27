import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// Env vars (set in Vercel dashboard — no VITE_ prefix, server-side only)
// BREVO_API_KEY  — your Brevo API key
// BREVO_LIST_ID  — numeric list ID
// SUPABASE_URL   — same as VITE_SUPABASE_URL
// SUPABASE_SERVICE_KEY — service-role key (bypasses RLS)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { email, source = "unknown" } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address." });
  }

  const trimmed = email.trim().toLowerCase();

  // ── 1. Brevo ────────────────────────────────────────────────────────────────
  const brevoKey = process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY;
  const brevoListId = process.env.BREVO_LIST_ID || process.env.VITE_BREVO_LIST_ID;
  let brevoOk = false;

  if (brevoKey && brevoListId) {
    try {
      const r = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-key": brevoKey },
        body: JSON.stringify({
          email: trimmed,
          listIds: [parseInt(brevoListId, 10)],
          updateEnabled: true,
        }),
      });
      brevoOk = r.ok || r.status === 201 || r.status === 400;
    } catch {
      // network error — fall through to Supabase
    }
  }

  // ── 2. Supabase ─────────────────────────────────────────────────────────────
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "";
  let supabaseOk = false;

  if (supabaseUrl && supabaseKey) {
    try {
      const sb = createClient(supabaseUrl, supabaseKey);
      const { error } = await sb.from("newsletter_subscribers").insert({
        email: trimmed,
        source,
        subscribed_at: new Date().toISOString(),
      });
      supabaseOk = !error || error.code === "23505"; // 23505 = duplicate = already subscribed
    } catch {
      // silent
    }
  }

  if (brevoOk || supabaseOk) {
    return res.status(200).json({
      success: true,
      message: "Successfully subscribed! Check your email for confirmation.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Subscription failed. Please try again later.",
  });
}
