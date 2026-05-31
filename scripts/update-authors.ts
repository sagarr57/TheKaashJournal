/**
 * update-authors.ts
 *
 * Assigns pen-name authors to all published and scheduled posts
 * based on their category:
 *
 *   AI and Health      → Kash
 *   Real-Time Finance  → Kash
 *   Case Studies       → Kash
 *   Debt Management    → Saga
 *   Fintech Trends     → Saga
 *
 * Run:      pnpm tsx scripts/update-authors.ts
 * Dry-run:  DRY_RUN=true pnpm tsx scripts/update-authors.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://zvlwzxsrpychzaijksvb.supabase.co";

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2bHd6eHNycHljaHphaWprc3ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0Mzg4NzAsImV4cCI6MjA4NjAxNDg3MH0.Lu4EErbcxWrGlKXOhEFYwwUdAV_ICkgB47wuZhP5nak";

const DRY_RUN = process.env.DRY_RUN === "true";

const CATEGORY_AUTHOR: Record<string, string> = {
  "AI and Health": "Kash",
  "Real-Time Finance": "Kash",
  "Case Studies": "Kash",
  "Debt Management": "Saga",
  "Fintech Trends": "Saga",
};

interface Post {
  id: number;
  slug: string;
  category: string;
  author: string | null;
  status: string;
}

async function main() {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log("Fetching all published and scheduled posts…");
  const { data, error } = await sb
    .from("blog_posts")
    .select("id,slug,category,author,status")
    .in("status", ["published", "scheduled"])
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("Failed to fetch posts:", error?.message);
    process.exit(1);
  }

  const posts: Post[] = data;
  console.log(`Fetched ${posts.length} posts.`);
  if (DRY_RUN) console.log("DRY_RUN=true — no writes will happen.\n");

  let updated = 0;
  let skipped = 0;
  let unknown = 0;

  for (const post of posts) {
    const penName = CATEGORY_AUTHOR[post.category];

    if (!penName) {
      console.log(`  [unknown category] ${post.slug} — "${post.category}"`);
      unknown++;
      continue;
    }

    if (post.author === penName) {
      console.log(`  [skip] ${post.slug} — already "${penName}"`);
      skipped++;
      continue;
    }

    console.log(
      `  [update] ${post.slug} (${post.status}) | "${post.author ?? "none"}" → "${penName}"`
    );

    if (!DRY_RUN) {
      const { error: patchError } = await sb
        .from("blog_posts")
        .update({ author: penName, updated_at: new Date().toISOString() })
        .eq("id", post.id);

      if (patchError) {
        console.error(`    ERROR updating ${post.slug}:`, patchError.message);
      } else {
        updated++;
      }
    } else {
      updated++;
    }
  }

  console.log(
    `\nDone. ${updated} posts ${DRY_RUN ? "would be" : "were"} updated, ${skipped} already correct, ${unknown} unknown category.`
  );
}

main();
