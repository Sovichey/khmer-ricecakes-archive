# Sprint 2 reflection

*A note on shape: I wrote this to match the three things the Sprint 2 rubric
explicitly checks for — specific answers about what the sprint actually
involved, an honest account of what I'd change, and a named worry with its
cost. If the Canvas prompt uses different wording, edit the section headings
to line the same answers up with the exact questions.*

## 1. What I built, and how ownership really works

This sprint turned the archive from a static page into a place people can
contribute to. Visitors can browse and search — Khmer included — and a
logged-in contributor can sign up, add an entry with a photo, and then edit
or delete only their own entries.

The "you own what you wrote" rule is enforced at three layers, not one:

1. On create, the entry's `owner` is read from the authenticated session and
   written to the database — it is never taken from a form field.
2. Every update and delete filters by *both* the entry id and the
   authenticated owner id, and the code checks that a row really came back, so
   a failed or unauthorized change never looks like it succeeded.
3. The database enforces the same rule independently, via Row Level Security
   in `supabase/migrations/0001_entries_and_storage.sql`: anyone may read the
   archive, but only the row's owner can update or delete it, and photo
   uploads can only land in the uploader's own folder.

I tested point 3 myself before submitting: I took the public anon key that the
live site ships to every browser and tried to update an entry directly through
the Supabase REST API — a "console attack" with no special access at all. The
database refused. That test is what convinced me the application-layer checks
are convenience, not a security boundary.

## 2. What went well, and what I would change

Two decisions I'm glad I made:

- **Khmer as a requirement, not an afterthought.** The Khmer title is the
  *required* field while the English title is optional, and validation checks
  the title against the Khmer Unicode ranges. Every label and error message in
  the contributor form is bilingual, the search covers the Khmer field, and
  even the empty search state explains itself in Khmer. I did this on purpose:
  a contributor typing in Khmer should feel the archive is theirs.
- **Honest attribution over invented names.** Three of my seed entries had
  generic "[Market Vendor]"-style contributor values left over from my earlier
  dataset. Instead of inventing people, the site displays "Contributor not
  recorded" for those, and the README explains why. A missing name is
  defensible in a code review; a fabricated one is not.

What I would change: **write the migration earlier.** The RLS policy existed
in the Supabase dashboard before it existed as a file in this repository, so
for most of the sprint the project's security could not be proven from the
repo itself. The README honestly said so. Commitment to keep the repo the
source of truth — schema included — would have saved me that hole.

## 3. My named worry, and what it cost

My worry is the free Supabase tier **going to sleep**. On that plan the
database pauses when nothing touches it, so the first click of the day — often
the grader's — can hit a cold start: the homepage loads while the entries
query waits, and the archive can briefly look broken even though nothing is
wrong.

The cost of this worry is in how I handled it. I verified the live URL and the
live entries API directly before submitting, and I made a habit of loading the
site before any checkpoint so the project is awake when a human first looks at
it. It is a manual step and it can be forgotten — and because the sleep is a
database property, not a code property, no commit can ever fully fix it. The
worry costs me a small ritual every time I hand this project over, and I
accept that; the alternative — pretending the archive never sleeps — is exactly
the kind of overconfidence that shows up as a blank page during grading.