import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { postIndex } from "../client/src/lib/postsIndex";
import { postContentBySlug } from "../client/src/lib/postsContent";
import { author } from "../client/src/lib/categories";

function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''");
}

function toSqlText(value: string | undefined | null): string {
  if (!value) return "NULL";
  return `'${escapeSqlString(value)}'`;
}

function toSqlBool(value: boolean): string {
  return value ? "TRUE" : "FALSE";
}

function toSqlTextArray(values: string[] | undefined): string {
  if (!values || values.length === 0) return "ARRAY[]::text[]";
  const escaped = values.map((v) => `'${escapeSqlString(v)}'`).join(", ");
  return `ARRAY[${escaped}]::text[]`;
}

const EDITORIAL_BYLINE = author.name;

const rows = postIndex
  .map((post) => {
    const content = postContentBySlug[post.slug] ?? "";
    if (!content) {
      console.warn(`[seed] Missing markdown for slug "${post.slug}" (id ${post.id}) — SQL content will be empty.`);
    }
    const updatedValue = post.updated ? `'${escapeSqlString(post.updated)}'` : "NULL";
    return `(
  '${escapeSqlString(post.id)}',
  '${escapeSqlString(post.title)}',
  '${escapeSqlString(post.slug)}',
  '${escapeSqlString(post.excerpt)}',
  '${escapeSqlString(content)}',
  '${escapeSqlString(EDITORIAL_BYLINE)}',
  '${escapeSqlString(post.date)}',
  ${updatedValue},
  '${escapeSqlString(post.category)}',
  ${toSqlTextArray(post.tags)},
  ${post.readingTime},
  ${toSqlBool(post.featured)},
  '${escapeSqlString(post.image)}',
  ${toSqlText(post.seo?.metaDescription)},
  ${toSqlTextArray(post.seo?.keywords)}
)`;
  })
  .join(",\n");

const sql = `-- Seed blog_posts from local source
-- Generated automatically by scripts/generate-blog-seed-sql.ts

create table if not exists public.blog_posts (
  id text primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  author text not null,
  date date not null,
  updated date null,
  category text not null,
  tags text[] not null default '{}',
  reading_time integer not null default 5,
  featured boolean not null default false,
  image text not null,
  meta_description text null,
  keywords text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.blog_posts (
  id, title, slug, excerpt, content, author, date, updated, category, tags,
  reading_time, featured, image, meta_description, keywords
)
values
${rows}
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  excerpt = excluded.excerpt,
  content = excluded.content,
  author = excluded.author,
  date = excluded.date,
  updated = excluded.updated,
  category = excluded.category,
  tags = excluded.tags,
  reading_time = excluded.reading_time,
  featured = excluded.featured,
  image = excluded.image,
  meta_description = excluded.meta_description,
  keywords = excluded.keywords,
  updated_at = now();
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, "../documentation/SUPABASE_BLOG_SEED.sql");
writeFileSync(outputPath, sql, "utf8");
console.log(`Generated ${outputPath}`);

