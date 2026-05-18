import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { postIndex } from "../client/src/lib/postsIndex";
import { postContentBySlug } from "../client/src/lib/postsContent";
import { author } from "../client/src/lib/categories";

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const rows = postIndex.map((post) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: postContentBySlug[post.slug] ?? "",
  author: author.name,
  date: post.date,
  updated: post.updated ?? null,
  category: post.category,
  tags: post.tags ?? [],
  reading_time: post.readingTime,
  featured: post.featured,
  image: post.image,
  meta_description: post.seo?.metaDescription ?? post.excerpt,
  keywords: post.seo?.keywords ?? [],
  updated_at: new Date().toISOString(),
}));

const BATCH_SIZE = 10;

async function seed() {
  console.log(`Seeding ${rows.length} posts to Supabase…`);
  let inserted = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("blog_posts")
      .upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
      process.exit(1);
    }

    inserted += batch.length;
    console.log(`  ✓ ${inserted}/${rows.length} posts upserted`);
  }

  console.log(`\nDone — ${rows.length} posts are now in Supabase.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
