"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EntryCard from "../components/EntryCard";
import AuthHeader from "../components/AuthHeader";
import collection from "../collection.config.js";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

const styles = {
  wrap: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: "24px 24px 72px",
  },
  kicker: {
    margin: 0,
  },
  title: {
    fontSize: "clamp(42px, 7vw, 72px)",
    fontWeight: 600,
    margin: "22px 0 18px",
    lineHeight: 0.98,
    color: "var(--text)",
    maxWidth: 620,
    letterSpacing: -2,
  },
  description: {
    fontSize: 18,
    color: "var(--muted)",
    lineHeight: 1.65,
    margin: 0,
    maxWidth: 590,
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.65fr)",
    gap: 28,
    alignItems: "stretch",
    marginTop: 32,
  },
  heroCopy: {
    padding: "34px 0 30px",
  },
  heroRule: {
    width: 76,
    height: 3,
    border: 0,
    margin: "0 0 24px",
    backgroundColor: "var(--accent)",
  },
  indexPanel: {
    display: "grid",
    alignContent: "space-between",
    gap: 24,
    padding: 24,
    background: "linear-gradient(150deg, var(--surface), rgba(58, 46, 34, 0.62))",
    border: "1px solid var(--border)",
    borderRadius: 18,
    boxShadow: "var(--shadow)",
  },
  indexHeading: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    margin: 0,
    color: "var(--accent)",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  indexNumber: {
    color: "var(--text)",
    fontFamily: "Georgia, serif",
    fontSize: 54,
    lineHeight: 1,
    margin: 0,
  },
  indexText: {
    color: "var(--muted)",
    fontSize: 13,
    lineHeight: 1.6,
    margin: 0,
  },
  indexDetails: {
    display: "grid",
    gap: 12,
    paddingTop: 18,
    borderTop: "1px solid var(--border)",
  },
  indexDetail: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    color: "var(--text)",
    fontSize: 13,
    margin: 0,
  },
  indexLabel: {
    color: "var(--muted)",
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    textTransform: "uppercase",
  },
  searchPanel: {
    marginTop: 38,
    padding: 18,
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
  },
  metadata: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
    marginTop: 0,
  },
  card: {
    padding: "18px 20px",
    backgroundColor: "rgba(29, 37, 33, 0.82)",
    border: "1px solid var(--border)",
    borderRadius: 14,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "var(--accent)",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
    color: "var(--text)",
    lineHeight: 1.5,
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    color: "var(--leaf)",
    margin: "34px 0 0",
    letterSpacing: 0.3,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid var(--border)",
    fontSize: 13,
    color: "var(--muted)",
  },
  entries: {
    display: "grid",
    gap: 22,
    marginTop: 20,
  },
  entriesHeading: {
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 48,
  },
  sectionTitle: {
    color: "var(--text)",
    fontFamily: "Georgia, serif",
    fontSize: 28,
    margin: 0,
  },
  sectionNote: {
    color: "var(--muted)",
    fontSize: 13,
    margin: 0,
  },
  entryLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
  searchLabel: {
    display: "block",
    fontSize: 14,
    fontWeight: 700,
    marginTop: 0,
    marginBottom: 8,
    color: "var(--text)",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 44px 14px 16px",
    border: "1px solid var(--border)",
    borderRadius: 10,
    backgroundColor: "var(--bg)",
    color: "var(--text)",
    fontSize: 16,
  },
  searchBox: {
    position: "relative",
  },
  clearButton: {
    position: "absolute",
    top: "50%",
    right: 10,
    transform: "translateY(-50%)",
    border: 0,
    background: "transparent",
    color: "var(--muted)",
    fontSize: 22,
    lineHeight: 1,
    cursor: "pointer",
    padding: "4px 8px",
  },
  emptyState: {
    margin: "28px 0 0",
    color: "var(--muted)",
    lineHeight: 1.6,
  },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const hasQuery = normalizedQuery.length > 0;
  const visibleEntries = entries.filter((entry) =>
    `${entry.title} ${entry.title_khmer ?? ""} ${entry.description} ${entry.contributor} ${entry.place ?? ""}`
      .toLocaleLowerCase()
      .includes(normalizedQuery),
  );

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("entries")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setLoadError(error.message);
        } else {
          setEntries(data ?? []);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadError(error.message ?? String(error));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="page-shell" style={styles.wrap}>
      <AuthHeader />
      <section className="hero-layout" style={styles.hero}>
        <div style={styles.heroCopy}>
          <p className="eyebrow" style={styles.kicker}>KHMER LIVING ARCHIVE</p>
          <hr style={styles.heroRule} />
          <h1 style={styles.title}>{collection.name}</h1>
          <p style={styles.description}>{collection.description}</p>
        </div>
        <aside style={styles.indexPanel} aria-label="Archive index">
          <p style={styles.indexHeading}>
            <span>Archive index</span>
            <span>01 / 04</span>
          </p>
          <div>
            <p style={styles.indexNumber}>{loading ? "—" : entries.length}</p>
            <p style={styles.indexText}>published rice-cake stories held in this living collection</p>
          </div>
          <div style={styles.indexDetails}>
            <p style={styles.indexDetail}><span style={styles.indexLabel}>Curator</span><span>{collection.curator}</span></p>
            <p style={styles.indexDetail}><span style={styles.indexLabel}>Place</span><span>{collection.province}</span></p>
          </div>
        </aside>
      </section>

      <section style={styles.searchPanel} aria-label="Search">
        <label htmlFor="entry-search" style={styles.searchLabel}>
          Explore the collection
        </label>
        <div style={styles.searchBox}>
          <input
            id="entry-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, story, contributor, or place"
            style={styles.searchInput}
          />
          {hasQuery && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" style={styles.clearButton}>
              ×
            </button>
          )}
        </div>
        <p style={styles.count}>
          {loading
            ? "Loading the archive…"
            : loadError
              ? "The archive could not be loaded right now."
              : `entries in the archive: ${visibleEntries.length} of ${entries.length}`}
        </p>
      </section>

      <div className="entries-heading" style={styles.entriesHeading}>
        <h2 style={styles.sectionTitle}>The collection</h2>
        <p style={styles.sectionNote}>Stories of making, memory, and place</p>
      </div>

      {loading || loadError ? null : visibleEntries.length > 0 ? (
        <section className="entry-grid" style={styles.entries} aria-label="Archive entries">
          {visibleEntries.map((entry) => (
            <Link key={entry.id} href={`/entries/${entry.id}`} style={styles.entryLink}>
              <EntryCard {...entry} query={query} />
            </Link>
          ))}
        </section>
      ) : hasQuery ? (
        <p style={styles.emptyState}>
          No rice cakes match that search yet. Try another English or Khmer word,
          or clear the search. មិនមាននំអង្ករត្រូវនឹងការស្វែងរកនេះទេ។
        </p>
      ) : (
        <p style={styles.emptyState}>
          No entries in the archive yet. Come back soon.
        </p>
      )}

      <footer style={styles.footer}>
        Built in ICT 340 - Vibe Coding, American University of Phnom Penh, Fall
        2026. Entries are added by contributors and stay owned by the account
        that wrote them.
      </footer>
    </main>
  );
}
