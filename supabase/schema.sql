-- ============================================================
-- BB2 Burger - Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. CATEGORIES
create table if not exists public.categories (
  id   text primary key,          -- e.g. 'a', 'b', 'c', 'd', 'e'
  name text not null
);

alter table public.categories enable row level security;

create policy "Public read categories"
  on public.categories for select using (true);

create policy "Admin manage categories"
  on public.categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- 2. MENU ITEMS
create table if not exists public.menu_items (
  id           bigserial primary key,
  name         text    not null,
  description  text    default '',
  category_id  text    references public.categories(id) on delete set null,
  image_url    text    default '',
  price_single numeric not null default 0,
  price_double numeric,
  available    boolean not null default true,
  featured     boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.menu_items enable row level security;

create policy "Public read available items"
  on public.menu_items for select using (true);

create policy "Admin manage menu items"
  on public.menu_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- 3. ADDONS
create table if not exists public.addons (
  id    text primary key,
  name  text    not null,
  price numeric not null default 0
);

alter table public.addons enable row level security;

create policy "Public read addons"
  on public.addons for select using (true);

create policy "Admin manage addons"
  on public.addons for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- 4. REVIEWS
create table if not exists public.reviews (
  id          bigserial primary key,
  name        text    not null,
  rating      smallint not null check (rating between 1 and 5),
  comment     text    default '',
  is_approved boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Public read approved reviews"
  on public.reviews for select using (is_approved = true);

create policy "Anyone can insert review"
  on public.reviews for insert with check (true);

create policy "Admin manage reviews"
  on public.reviews for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- 5. SETTINGS  (key/value store)
create table if not exists public.settings (
  key   text primary key,
  value text default ''
);

alter table public.settings enable row level security;

create policy "Public read settings"
  on public.settings for select using (true);

create policy "Admin manage settings"
  on public.settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ============================================================
-- SUPABASE STORAGE BUCKET
-- Run separately or via Dashboard:
-- ============================================================
-- insert into storage.buckets (id, name, public)
-- values ('images', 'images', true);

-- create policy "Public read images"
--   on storage.objects for select
--   using (bucket_id = 'images');

-- create policy "Auth upload images"
--   on storage.objects for insert
--   with check (bucket_id = 'images' and auth.role() = 'authenticated');

-- create policy "Auth delete images"
--   on storage.objects for delete
--   using (bucket_id = 'images' and auth.role() = 'authenticated');
