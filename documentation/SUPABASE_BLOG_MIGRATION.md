# Supabase Blog Migration

This project is now configured to read blog data from `public.blog_posts` in Supabase, with a static fallback for safety.

## What was done

- Added Supabase-first data layer in `client/src/lib/blog-data.ts`
- `Blog` page now loads post index from Supabase (`fetchPublishedPostIndex`)
- `Post` page now loads full post content from Supabase (`fetchPostBySlugWithContent`)
- If Supabase has no data or fails, app falls back to local static post data

## Move current local blogs to Supabase

1. Generated SQL file:
   - `documentation/SUPABASE_BLOG_SEED.sql`
2. Open Supabase Dashboard -> SQL Editor
3. Paste and run the full SQL from that file
4. Verify:
   - `select count(*) from public.blog_posts;`
   - `select slug from public.blog_posts order by date desc;`

## Re-generate seed file later

If you edit local posts and want a fresh SQL seed:

```bash
pnpm seed:blogs:sql
```

## Important

- Keep Row Level Security (RLS) configured for read access to published blogs.
- Since app has fallback, your site won’t break during migration.

