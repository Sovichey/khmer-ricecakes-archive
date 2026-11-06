"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { reviewEntry } from "../lib/reviewEntry";

// Shown only when the database tells us the change was not kept.
const FAILED_MESSAGE =
  "ការផ្លាស់ប្តូរមិនត្រូវបានរក្សាទុកទេ / Action failed. Please refresh and try again.";

// One pending entry with its review controls. The buttons call the review_entry
// database function; on success the parent removes the entry from the queue,
// on failure this card stays put and shows a message.
export default function ReviewCard({ entry, onReviewed }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const submittedDate = new Date(entry.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displayTitle = entry.title || entry.title_khmer || "Untitled rice cake";

  async function decide(decision) {
    if (busy) return;
    setBusy(true);
    setFailed(false);

    const result = await reviewEntry(getSupabaseBrowserClient(), entry.id, decision);
    if (!result.ok) {
      setFailed(true);
      setBusy(false);
      return;
    }
    onReviewed(entry.id);
  }

  return (
    <article className="surface-panel" style={styles.card}>
      <div className="review-top" style={styles.top}>
        <div style={styles.imageFrame}>
          <img src={entry.image} alt={`${displayTitle} rice cake`} style={styles.image} />
        </div>
        <div style={styles.body}>
          <div style={styles.heading}>
            <p style={styles.kicker}>PENDING — កំពុងរង់ចាំ</p>
            <h2 style={styles.title}>{displayTitle}</h2>
            {entry.title_khmer && entry.title_khmer !== entry.title && (
              <p style={styles.titleKhmer}>{entry.title_khmer}</p>
            )}
          </div>
          <p style={styles.description}>{entry.description}</p>
          <div style={styles.metaRow}>
            <p style={styles.meta}>
              <span style={styles.metaLabel}>Place — ទីកន្លែង</span>
              <span>{entry.place || "Not recorded"}</span>
            </p>
            <p style={styles.meta}>
              <span style={styles.metaLabel}>Submitted — កាលបរិច្ឆេទ</span>
              <span>{submittedDate}</span>
            </p>
          </div>
        </div>
      </div>
      <footer style={styles.footer}>
        <button
          type="button"
          className="btn review-publish"
          style={styles.publish}
          disabled={busy}
          onClick={() => decide("published")}
        >
          ផ្សព្វផ្សាយ / Publish
        </button>
        <button
          type="button"
          className="btn review-return"
          style={styles.returned}
          disabled={busy}
          onClick={() => decide("returned")}
        >
          បដិសេធ / Return
        </button>
        {failed && <p role="alert" style={styles.failed}>{FAILED_MESSAGE}</p>}
      </footer>
    </article>
  );
}

const styles = {
  card: { overflow: "hidden" },
  top: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)", alignItems: "stretch" },
  imageFrame: { backgroundColor: "var(--muted-bg)" },
  image: { width: "100%", height: "100%", minHeight: 220, objectFit: "cover", display: "block", backgroundColor: "var(--muted-bg)" },
  body: { padding: "22px 22px 18px", display: "flex", flexDirection: "column", gap: 12 },
  heading: { display: "grid", gap: 6 },
  kicker: { margin: 0, color: "var(--accent)", fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" },
  title: { margin: 0, color: "var(--text)", fontSize: 26, lineHeight: 1.15 },
  titleKhmer: { margin: 0, color: "var(--leaf)", fontSize: 18, lineHeight: 1.35 },
  description: { margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.65, overflowWrap: "break-word" },
  metaRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--border)" },
  meta: { display: "grid", gap: 4, margin: 0, color: "var(--text)", fontSize: 14, lineHeight: 1.4, flex: "1 1 180px" },
  metaLabel: { color: "var(--muted)", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5 },
  footer: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "16px 22px 20px", borderTop: "1px solid var(--border)" },
  publish: { padding: "11px 18px", border: 0, borderRadius: 999, backgroundColor: "var(--leaf)", color: "var(--accent-ink)", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 6px 18px rgba(140, 163, 107, 0.16)" },
  returned: { padding: "11px 18px", border: "1px solid var(--border)", borderRadius: 999, backgroundColor: "transparent", color: "var(--text)", fontSize: 15, fontWeight: 800, cursor: "pointer" },
  failed: { margin: 0, color: "var(--error)", fontSize: 14, lineHeight: 1.5, flexBasis: "100%" },
};