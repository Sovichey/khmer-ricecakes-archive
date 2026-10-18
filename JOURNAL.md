# Project journal — khmer-ricecakes-archive

Short notes kept alongside the commits. Each entry is dated with the day the
work actually landed (the dates match the git history), so this journal is a
readable map of the commit trail rather than a memory written after the fact.

## 2026-09-11 — Sprint 1 polish

- Added an image for every entry so the archive reads like a real collection
  (each photo lives in `public/assets/entries/`).
- Upgraded the search bar: filtering now covers the English title, the Khmer
  title, description, contributor, and place, with a clear button so a search
  is easy to reset. Khmer input searches Khmer text.

## 2026-09-17 — Sprint 2 kickoff

- Amended `AGENTS.md` to approve the two Sprint 2 dependencies
  (`@supabase/supabase-js`, `@supabase/ssr`) and to restate the no-secrets
  rule for this public repo.
- Wired Supabase in: a shared browser client and a server client, plus a
  `proxy.js` to keep the auth cookie refreshed (Next 16's proxy replaces
  middleware).

## 2026-09-22 — entries move to the database

- Retired `data/entries.js`: the home page now reads the live `entries` table
  instead of a hard-coded array. The archive's source of truth is a real
  database, and the first 8 seeded rice cakes came from family oral
  knowledge (my grandparents), with the source shown on the page.

## 2026-10-02 — contribution form with photo upload

- Contributor flow: sign-up/login, then a form that validates client-side
  (Khmer title required and checked against Khmer Unicode ranges, description
  10–1,000 characters, contributor 2–50, place from the 25 provinces, photo
  JPG/PNG/WebP ≤ 5 MB).
- The photo uploads to a `photos` storage bucket at `<user_id>/<random_uuid>`,
  and the entry row's `owner` is taken from the authenticated session — never
  from a form field.
- First pass at edit and delete for the entry's owner.

## 2026-10-16 — own-your-entries + theme

- Edit and delete are fully wired and filter by both entry ID and the
  authenticated owner ID; the code checks a row really came back so a failed
  or unauthorized change never looks successful.
- Reworked the palette in `globals.css` to a warm "market notebook" theme
  (cream paper, terracotta accent) with focus/hover/selection states.

## 2026-10-18 — Khmer-facing labels + server-side proof

- Fixed a session-check error surfaced during a live pass.
- Khmer labels now sit next to English across the site
  (Contributor — អ្នករួមចំណែក, Place — ទីកន្លែង, form prompts in Khmer too).
- Generic legacy attributions ("Market Vendor", "Market Stall") display as
  "Contributor not recorded" instead of pretending those are named people.
- Recorded Sprint 2 implementation notes in `README.md`.
- Added `supabase/migrations/0001_entries_and_storage.sql`, which is the
  database half of ownership: RLS policies that refuse update/delete to
  anyone but the row's owner (even by direct console calls), storage policies
  that confine uploads to the uploader's own folder and allowed image types,
  and CHECK constraints that mirror the form rules.

## Open policy notes

- Security boundary: the app-level owner checks are developer convenience;
  the real boundary is the RLS layer in the migration file. The live Supabase
  project must have that migration applied (Dashboard → SQL Editor) for the
  two-account attack to be refused on the server.
- The collection is small and curated, not exhaustive. Sourcing is oral
  family knowledge; no formal interviews were conducted.