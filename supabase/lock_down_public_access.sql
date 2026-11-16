-- Locks the database down so the public (anon) key can only:
--   * read published blog posts
--   * record page views, events, conversions and outbound clicks (insert only)
-- Everything else (editing posts, reading subscribers, admin accounts, analytics) is done by
-- server functions with the service role key, which is not affected by these rules.
--
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run. Safe to run again.

begin;

-- 1. Remove every existing policy on the site's tables (several allowed anyone to do anything).
do $$
declare p record;
begin
  for p in
    select schemaname, tablename, policyname from pg_policies
    where schemaname = 'public'
      and tablename in ('blog_posts', 'admin_users', 'newsletter_subscribers', 'analytics_daily',
                        'page_views', 'events', 'conversions', 'redirections')
  loop
    execute format('drop policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

-- 2. Turn row level security on. With it on and no policy, the public key gets nothing.
alter table if exists public.blog_posts             enable row level security;
alter table if exists public.admin_users            enable row level security;
alter table if exists public.newsletter_subscribers enable row level security;
alter table if exists public.analytics_daily        enable row level security;
alter table if exists public.page_views             enable row level security;
alter table if exists public.events                 enable row level security;
alter table if exists public.conversions            enable row level security;
alter table if exists public.redirections           enable row level security;

-- 3. The only things the public key may do.
create policy "Public can read published posts" on public.blog_posts
  for select to anon, authenticated using (status = 'published');

do $$
declare t text;
begin
  foreach t in array array['page_views', 'events', 'conversions', 'redirections'] loop
    if to_regclass('public.' || t) is not null then
      execute format(
        'create policy "Visitors can record %s" on public.%I for insert to anon, authenticated with check (true)',
        replace(t, '_', ' '), t);
    end if;
  end loop;
end $$;

-- 4. Image bucket: stop the public key uploading, replacing or deleting files.
--    Images stay publicly viewable because the bucket itself is public.
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      and (coalesce(qual, '') || coalesce(with_check, '')) ilike '%blog-images%'
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;

commit;

-- 5. Review: this should list exactly one SELECT policy on blog_posts and one INSERT policy
--    on each tracking table. Any storage.objects row that allows INSERT/UPDATE/DELETE to
--    "anon" or "public" should be removed by hand in Storage -> Policies.
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, cmd;
