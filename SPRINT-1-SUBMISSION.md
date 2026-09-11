# Sprint 1 Submission

## Links

- Live URL: **Add the deployed Vercel URL here before submitting.**
- Repository: https://github.com/Sovichey/khmer-legends-archive

## Prompt journal

### 1. Adding entries

- **Prompt:** “add 3 more entries” followed by the Num Ansom Chek, Num Treap, and Num Pang Patté details.
- **Technique:** Structured data extension.
- **What came back:** Three objects were added to `data/entries.js` using the existing title, description, contributor, and place fields.
- **What I changed before accepting:** I checked that the wording, Khmer names, contributors, and places matched the supplied entries.

### 2. Improving browse and search

- **Prompt:** Requested images for each entry, an X icon for clearing the search, and search handling for empty strings and keyword emphasis.
- **Technique:** Incremental UI enhancement.
- **What came back:** The cards gained image support, the search gained a clear button, whitespace-only input was normalized, and matching text was highlighted.
- **What I changed before accepting:** I replaced the browser-native search input clear control with a text input so only one X icon appears, and used local files in `public/assets/entries` instead of remote image URLs.

### 3. Correcting archive content and image paths

- **Prompt:** Corrected the Khmer spelling and transliteration for Num Korm, then asked to use the matching images in `public`.
- **Technique:** Targeted content correction and asset-path wiring.
- **What came back:** The entry title was changed to `Num Korm (នំគម)` and all eight entries were assigned matching local asset paths.
- **What I changed before accepting:** I checked the actual filenames in `public/assets/entries` and matched each data record to its file, including the capital `K` in `num-Krok.png`.

## Reflection

### What did you build?

I built a browse-and-search archive of eight Khmer rice cakes. Visitors can browse the entries with Khmer and English names, descriptions, contributor and place information, and entry images. They can search across the title, description, contributor, and place, see matching keywords highlighted, clear the search with one X button, and receive an empty result message in English and Khmer.

### What did you learn?

I learned that a small search feature needs explicit edge-case handling. Trimming the query prevents whitespace-only input from behaving like a real keyword, and matching the same normalized query used for filtering keeps highlighting consistent. I also caught an AI-created issue where a `type="search"` input added a second browser clear icon; changing it to `type="text"` kept the custom button as the only X.

### What changes in Sprint 2?

In Sprint 2 I will move from a read-only archive toward contributor accounts and ownership of entries. I want to preserve the current browse/search experience while adding a clear way for a contributor to identify their own submissions, edit them, and see their review status without mixing draft content into the public archive.
