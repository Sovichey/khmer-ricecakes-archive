"use client";

import { useState } from "react";
import EntryCard from "../components/EntryCard";
import AuthHeader from "../components/AuthHeader";
import collection from "../collection.config.js";
import entries from "../data/entries.js";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "clamp(40px, 10vw, 80px) 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: "clamp(32px, 8vw, 48px)",
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#2EE6A8",
    marginTop: 48,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
  },
  entries: {
    display: "grid",
    gap: 18,
    marginTop: 28,
  },
  searchLabel: {
    display: "block",
    fontSize: 14,
    fontWeight: 700,
    marginTop: 48,
    marginBottom: 8,
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 44px 12px 14px",
    border: "1px solid #2E3644",
    borderRadius: 8,
    backgroundColor: "#1C222C",
    color: "#E8EDF2",
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
    color: "#97A1B3",
    fontSize: 22,
    lineHeight: 1,
    cursor: "pointer",
    padding: "4px 8px",
  },
  emptyState: {
    margin: "28px 0 0",
    color: "#97A1B3",
    lineHeight: 1.6,
  },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const hasQuery = normalizedQuery.length > 0;
  const visibleEntries = entries.filter((entry) =>
    `${entry.title} ${entry.description} ${entry.contributor} ${entry.place}`
      .toLocaleLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <main style={styles.wrap}>
      <AuthHeader />
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      <label htmlFor="entry-search" style={styles.searchLabel}>
        Search the archive
      </label>
      <div style={styles.searchBox}>
        <input
          id="entry-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, description, contributor, or place"
          style={styles.searchInput}
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            style={styles.clearButton}
          >
            ×
          </button>
        )}
      </div>

      <p style={styles.count}>
        entries in the archive: {visibleEntries.length} of {entries.length}
      </p>

      {visibleEntries.length > 0 ? (
        <section style={styles.entries} aria-label="Archive entries">
          {visibleEntries.map((entry) => (
            <EntryCard key={entry.title} {...entry} query={query} />
          ))}
        </section>
      ) : (
        <p style={styles.emptyState}>
          No rice cakes match that search yet. Try another English or Khmer word,
          or clear the search. មិនមាននំអង្ករត្រូវនឹងការស្វែងរកនេះទេ។
        </p>
      )}

      <footer style={styles.footer}>
        Built in ICT 340 - Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
