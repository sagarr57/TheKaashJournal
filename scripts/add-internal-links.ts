/**
 * add-internal-links.ts
 *
 * Fetches every published post from Supabase, injects a "## Further Reading"
 * section at the end of posts that don't already have one, then PATCHes the
 * updated content back.
 *
 * Related-post selection uses a simple weighted score:
 *   +3 per matching category
 *   +2 per matching tag
 *   +1 per keyword overlap in title (common words ignored)
 *
 * Run with:  pnpm tsx scripts/add-internal-links.ts
 * Dry-run:   DRY_RUN=true pnpm tsx scripts/add-internal-links.ts
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
const MAX_LINKS = 4; // max related links per post

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "is","are","was","were","be","been","being","have","has","had","do","does",
  "did","will","would","can","could","should","may","might","shall","must",
  "that","this","these","those","it","its","how","what","when","where","why",
  "uk","us","your","our","their","you","we","i","me","my","by","as","from",
  "into","about","best","top","guide","2025","2026",
]);

interface Post {
  id: number;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
}

function titleKeywords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
}

function scoreRelevance(post: Post, candidate: Post): number {
  let score = 0;
  if (post.category === candidate.category) score += 3;

  const sharedTags = post.tags.filter((t) => candidate.tags.includes(t));
  score += sharedTags.length * 2;

  const postKw = new Set(titleKeywords(post.title));
  const candKw = titleKeywords(candidate.title);
  for (const kw of candKw) {
    if (postKw.has(kw)) score += 1;
  }

  // Slight bonus if post content already mentions the candidate's slug
  if (post.content.includes(`/blog/${candidate.slug}`)) score -= 10; // already linked

  return score;
}

function findRelated(post: Post, all: Post[]): Post[] {
  return all
    .filter((c) => c.id !== post.id)
    .map((c) => ({ post: c, score: scoreRelevance(post, c) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_LINKS)
    .map(({ post: c }) => c);
}

function buildFurtherReading(related: Post[]): string {
  const lines = related.map((r) => `- [${r.title}](/blog/${r.slug})`);
  return `\n\n## Further Reading\n\n${lines.join("\n")}\n`;
}

const FURTHER_READING_MARKERS = [
  "## Further Reading",
  "## Related Articles",
  "## Related Posts",
  "## See Also",
  "## You May Also Like",
];

function hasRelatedSection(content: string): boolean {
  return FURTHER_READING_MARKERS.some((m) =>
    content.includes(m)
  );
}

async function main() {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log("Fetching all published posts…");
  const { data, error } = await sb
    .from("blog_posts")
    .select("id,slug,title,category,tags,content")
    .eq("status", "published")
    .order("date", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch posts:", error?.message);
    process.exit(1);
  }

  const posts: Post[] = data.map((p) => ({
    ...p,
    tags: Array.isArray(p.tags) ? p.tags : [],
    content: p.content ?? "",
  }));

  console.log(`Fetched ${posts.length} published posts.`);
  if (DRY_RUN) console.log("DRY_RUN=true — no writes will happen.\n");

  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    if (hasRelatedSection(post.content)) {
      console.log(`  [skip] ${post.slug} — already has a related section`);
      skipped++;
      continue;
    }

    const related = findRelated(post, posts);
    if (related.length === 0) {
      console.log(`  [skip] ${post.slug} — no related posts found`);
      skipped++;
      continue;
    }

    const addition = buildFurtherReading(related);
    const newContent = post.content.trimEnd() + addition;

    console.log(`  [update] ${post.slug}`);
    for (const r of related) console.log(`    → /blog/${r.slug}`);

    if (!DRY_RUN) {
      const { error: patchError } = await sb
        .from("blog_posts")
        .update({ content: newContent, updated_at: new Date().toISOString() })
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
    `\nDone. ${updated} posts ${DRY_RUN ? "would be" : "were"} updated, ${skipped} skipped.`
  );
}

main();
