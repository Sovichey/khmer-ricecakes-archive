# Khmer Living Archive — starter

This is the starting point for your ICT 340 capstone: a community archive that preserves a piece of Khmer culture. Right now it's one page. By December it will browse, search, take contributions, and publish reviewed entries. Same skeleton for everyone; the collection is yours.

## Lab 1: get this live

Follow the Lab 1 guide on Canvas. The short version:

1. Click **Use this template** (top right) → **Create a new repository**. Name it after your archive.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, **Add New → Project**, import your new repository, and click **Deploy**.
3. Clone your repo, open it in VS Code, edit `collection.config.js` (the only file you touch today), then commit and push:

   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   code .
   # edit collection.config.js, then:
   git add .
   git commit -m "make it mine"
   git push
   ```

4. Watch Vercel redeploy on its own, then submit your live URL to the Lab 1 assignment on Canvas.

## Running it locally (optional today, needed from week 2)

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Rules of the road

You own what you ship. Every line that lands in this repository is yours to explain, whoever or whatever wrote it.

## Sprint 2 implementation notes

The application reads and writes entry fields named `title`, `title_khmer`,
`description`, `contributor`, `place`, `image`, and `owner`. The owner value on
creation comes from the authenticated Supabase user, not from the form. Updates
and deletes filter by both entry ID and the authenticated owner ID. Database
Row Level Security enforces these rules on the server (see the migration
below); application code alone is not a security boundary.

The contribution form performs client-side validation in
`lib/validateEntry.js`:

- English title is optional, limited to 120 characters, and restricted to its
  accepted English character set.
- Khmer title is required, limited to 120 characters, and checked against
  Khmer Unicode ranges.
- Description is required and limited to 10–1,000 characters.
- Contributor name is required and limited to 2–50 characters after trimming.
- Place is optional and must match one of the listed Cambodian provinces.
- A JPG, PNG, or WebP photo up to 5 MB is required on creation and optional on
  edit.

These are browser-side checks. The server-side rules that back them up live
in `supabase/migrations/0001_entries_and_storage.sql`. That migration enables
row-level security on the entries table (public read, but insert/update/delete
only for the row's own authenticated owner), confines photo uploads to the
uploader's own folder with JPG/PNG/WebP content types under 5 MB, and adds
CHECK constraints that mirror the form rules above. Apply it to the Supabase
project from Dashboard → SQL Editor; without it the app-level owner checks are
not a security boundary. `lib/displayContributor.js` and the entry pages are
described in `JOURNAL.md`.

The curator reports that the cultural knowledge for the eight existing rice
cake entries comes from their grandparents. This family source is shown
separately from the contributor field, which identifies who submitted an entry.
No formal interviews were conducted, and generic legacy contributor values
are displayed as “Contributor not recorded” rather than presented as named
people.
