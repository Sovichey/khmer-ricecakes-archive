-- ============================================================
-- Sprint 2 — server-side ownership and constraints
-- ============================================================
-- The pieces below are the database half of "you own your
-- entries". The app reads the owner from the authenticated
-- session (never from the form), and these policies make sure
-- the same rule holds even when someone calls Supabase directly
-- (the "console attack"): update and delete only succeed for the
-- row's real owner, and only the owner can upload into their own
-- photos folder.
--
-- Run this once in the Supabase project used by the live URL:
--   Dashboard → SQL Editor → New query → paste → Run.
-- Every statement is guarded (IF NOT EXISTS / drop+recreate), so
-- re-running it is safe. If a CHECK constraint fails against
-- existing rows, fix those rows first, then re-run.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- entries table
-- ------------------------------------------------------------
-- Owner defaults to the logged-in user and references auth.users,
-- so a row is always tied to a real account. Length and content
-- constraints mirror lib/validateEntry.js.
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text,
  title_khmer text not null,
  description text not null,
  contributor text not null,
  place text,
  image text not null,
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade
);

alter table public.entries
  drop constraint if exists entries_title_chk,
  add constraint entries_title_chk check (
    title is null or char_length(btrim(title)) between 1 and 120
  ),
  drop constraint if exists entries_title_khmer_chk,
  add constraint entries_title_khmer_chk check (
    char_length(btrim(title_khmer)) between 1 and 120
    and title_khmer ~ '^[\x1780-\x17FF\x19E0-\x19FF\s]+$'
  ),
  drop constraint if exists entries_description_chk,
  add constraint entries_description_chk check (
    char_length(btrim(description)) between 10 and 1000
  ),
  drop constraint if exists entries_contributor_chk,
  add constraint entries_contributor_chk check (
    char_length(btrim(contributor)) between 2 and 50
  ),
  drop constraint if exists entries_place_chk,
  add constraint entries_place_chk check (
    place is null or place in (
      'Banteay Meanchey', 'Battambang', 'Kampong Cham', 'Kampong Chhnang',
      'Kampong Speu', 'Kampong Thom', 'Kampot', 'Kandal', 'Kep', 'Koh Kong',
      'Kratie', 'Mondulkiri', 'Oddar Meanchey', 'Pailin', 'Phnom Penh',
      'Preah Sihanouk', 'Preah Vihear', 'Prey Veng', 'Pursat', 'Ratanakiri',
      'Siem Reap', 'Stung Treng', 'Svay Rieng', 'Takeo', 'Tboung Khmum'
    )
  );

-- ------------------------------------------------------------
-- Row Level Security on entries
-- ------------------------------------------------------------
-- Anyone may read; only the owner may insert (with the owner
-- forced to themselves), update, or delete.
alter table public.entries enable row level security;

drop policy if exists "entries_select_all" on public.entries;
create policy "entries_select_all" on public.entries
  for select using (true);

drop policy if exists "entries_insert_own" on public.entries;
create policy "entries_insert_own" on public.entries
  for insert with check (owner = auth.uid());

drop policy if exists "entries_update_own" on public.entries;
create policy "entries_update_own" on public.entries
  for update using (owner = auth.uid()) with check (owner = auth.uid());

drop policy if exists "entries_delete_own" on public.entries;
create policy "entries_delete_own" on public.entries
  for delete using (owner = auth.uid());

-- ------------------------------------------------------------
-- photos storage bucket
-- ------------------------------------------------------------
-- Public bucket so visitor pages can <img src="publicUrl">, but
-- uploads only into the uploader's own <user_id>/ folder, only
-- JPG/PNG/WebP, and only up to 5 MB (matches the form).
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "photos_select_public" on storage.objects;
create policy "photos_select_public" on storage.objects
  for select using (bucket_id = 'photos');

drop policy if exists "photos_insert_own" on storage.objects;
create policy "photos_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.objects.metadata->>'contentType') in
      ('image/jpeg', 'image/png', 'image/webp')
    and ((storage.objects.metadata->>'size')::numeric) <= 5242880
  );

drop policy if exists "photos_update_own" on storage.objects;
create policy "photos_update_own" on storage.objects
  for update using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "photos_delete_own" on storage.objects;
create policy "photos_delete_own" on storage.objects
  for delete using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );