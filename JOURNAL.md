# Prompt journal — Sprint 2: khmer-ricecakes-archive

This journal is the running record of the Sprint 2 build. Each entry keeps the
prompt that mattered most, the technique behind it, what the AI produced, and
— most importantly — what I changed before accepting any diff. The commit
trail at the bottom maps these entries to the actual git history.

## Entry 1 — Week 6, the database (the /contribute form)

### The prompt that mattered most

Build a page at /contribute with a form for adding an entry to my entries table. Only logged-in users can see the form; logged-out visitors get a link to log in.

My table columns in Supabase are: title (text, optional), title_khmer (text, required), description (text, required), contributor (text, required), place (text, optional), image (text, required).

Validation rules to enforce before form submission:

- title: Optional, 1-120 chars. Allow English characters, numbers, and common punctuation.
- title_khmer: Required, 1-120 chars. Allow Khmer script, spaces, and Khmer numbers/punctuation.
- description: Required, 10-1000 chars. Any language/script allowed.
- place: Optional select dropdown containing the 25 Cambodian provinces/cities.
- contributor: Required, 2-50 chars. Trimmed text (disallow whitespace-only).
- image: Required file input, allowed formats image/jpeg, image/png, image/webp, max 5 MB. Exactly one image.

Requirements: validate these rules in the form before submit, displaying a short error message next to any invalid field; trim every text field before length checks; set owner strictly from the logged-in session using supabase.auth.getUser(), never from a form input; upload the image to the Supabase Storage bucket called photos at path <user_id>/<random_uuid>.<ext>, saving its public URL in the image column; disable the submit button while the upload/save runs; if anything fails, show a helpful message to the user and log the real error with console.error, never showing error.message directly; do not use dangerouslySetInnerHTML; do not add any new npm packages; after a successful save, redirect to the new entry page.

### Technique

Constraint enumeration — laying out the entire specification (field-by-field
validation combined with a numbered contract) within a single upfront message
instead of drip-feeding rules across multiple turns.

### What came back

The AI generated a complete contribution form with per-field client
validation, a 5 MB image upload handler targeting the photos bucket, and clean
error masking via console.error, but omitted writing the owner column during
the database INSERT statement because it wasn't explicitly listed under the
column list in the prompt text.

### What I changed before accepting

I caught that inserting rows without an owner would bypass row-level ownership
locks entirely, so I stopped before accepting the diff, verified the actual
live schema column name (owner), and enforced that the insert payload
explicitly stamped owner directly from supabase.auth.getUser().

## Entry 2 — Week 7, the locks (edit + delete, own entries only)

### The prompt that mattered most

Part 2: edit and delete, your own only (20 minutes). On each entry's page, show Edit and Delete buttons only when the logged-in user is the entry's owner. Edit goes to a page with the same form as /contribute, pre-filled, using the same validation rules; saving updates the entry through supabase-js. Changing the photo is optional; if the user doesn't pick a new one, keep the old one. Delete asks for confirmation first, then deletes through supabase-js. After every update or delete, call .select() and check that a row actually came back; if none did, tell the user "That change wasn't saved" and log it with console.error. Do not add any package.

That last instruction matters more than it looks. When your row-level security policy refuses an update or a delete, Supabase doesn't throw an error. It quietly changes zero rows and says success. Code that doesn't check will tell the user "Saved!" about a change that never happened. Checking for the returned row is how your app finds out the database said no.

Read the diff. The buttons are politeness, and hiding them is fine. Look for anything that looks like enforcement in the interface: "if not the owner, return early" in the page code is nice manners and nothing more. The actual refusal is your week 6 policies, and Part 4 tests them.

Try it: edit your Part 1 entry, fix something real in it. Then add a throwaway entry and delete it.

Commit: sprint 2: edit and delete own entries (AI-assisted). Make sure a new user can only add, edit, or delete their own entries.

### Technique

Adversarial framing — specifying "your own only" while explicitly framing UI
elements as mere convenience, directing the model to focus on database-level
enforcement mechanisms.

### What came back

Owner-gated edit/delete interfaces, coupled with .eq('owner', user.id) query
parameters and mandatory .select() array length checks that convert Supabase
RLS's silent data: [] responses into an actionable user notification ("That
change wasn't saved").

### What I changed before accepting

I rejected initial diff attempts that treated hidden UI buttons as the core
security barrier, forcing the owner column filter into every write query and
verifying that returned array checks explicitly handled empty datasets when
RLS refused write access.

## Entry 3 — Review day fix (second-account testing)

### The prompt that mattered most

i didn't see the add entry button in test1@gmail.com which is my second account

### Technique

Reproduce-first — testing directly with a secondary non-owner account
(test1@gmail.com) to observe UI state and identify workflow dead-ends prior
to prompting.

### What came back

Identification of a navigation flaw: while /contribute was fully functional
and protected by authentication, the shared global layout lacked a persistent
link or call-to-action button, leaving logged-in users with no clear path to
the submission form.

### What I changed before accepting

I instructed the AI to place a single, clear "Add Entry" navigation link inside
the main header layout, explicitly rejecting suggestions to add extra
non-essential pages (such as custom user dashboards or feed filters) to keep
the scope tightly controlled.

## Entry 4 — UI direction (after review feedback)

### The prompt that mattered most

make all the page design to something else nice

### Technique

Iterative refinement by direction — applying high-level aesthetic feedback in
single rounds, reviewing generated diffs, and steering color systems centrally
rather than micro-managing element styles individually.

### What came back

A complete site-wide restyle featuring a light paper aesthetic with cream
backgrounds, structured white content cards, and warm terracotta accents,
driven through centralized CSS custom properties.

### What I changed before accepting

I rejected two darker draft themes (dark navy and dark charcoal) generated by
the AI in earlier steps and enforced that all color values remain mapped to
global CSS variables (var(--token)) in a single stylesheet for easy
maintainability.

---

## Appendix — commit trail (dates match git log)

- 2026-09-11 — Sprint 1 polish: images for all entries; search covers English + Khmer fields with a clear button.
- 2026-09-17 — Sprint 2 kickoff: AGENTS.md amended for the two approved Supabase deps; browser + server Supabase clients and the proxy (auth-cookie refresh).
- 2026-09-22 — Retired data/entries.js; home page reads the live entries table; archive title update.
- 2026-10-02 — Contribution form with photo upload (client validation, owner from session, photos bucket). First pass at edit/delete.
- 2026-10-16 — Edit + delete wired with owner filters and returned-row checks; site-wide "market notebook" theme in globals.css.
- 2026-10-18 — Session-check fix; bilingual labels; "Contributor not recorded" for generic attributions; Sprint 2 notes in README.
- 2026-10-18 — supabase/migrations/0001_entries_and_storage.sql: RLS policies, storage policies, CHECK constraints (server-side half of ownership). Journal + reflection written up.

## Open policy notes

- Security boundary: the app-level owner checks are developer convenience; the real boundary is the RLS layer in the migration file. The live Supabase project must have that migration applied (Dashboard → SQL Editor) for the two-account attack to be refused on the server.
- The collection is small and curated, not exhaustive. Sourcing is oral family knowledge; no formal interviews were conducted.
- The Sprint 2 reflection (what I built, what I would change, and a named worry with its cost) lives in REFLECTION.md.
