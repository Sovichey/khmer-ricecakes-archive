"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EntryCard from "../components/EntryCard";
import AuthHeader from "../components/AuthHeader";
import Icon from "../components/Icon";
import collection from "../collection.config.js";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

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
    <main className="home-page">
      <div className="home-top">
        <AuthHeader />
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-kicker"><span lang="km">ខ្មែរ</span><span /></p>
            <h1 id="hero-title" className="hero-title">
              Every rice cake is a <em>memory</em> wrapped in leaf.
            </h1>
            <p className="hero-description">{collection.description}</p>
            <div className="hero-actions">
              <a className="hero-button hero-button-primary" href="#collection">
                Explore the collection
              </a>
              <Link className="hero-button hero-button-outline" href="/contribute">
                Add your story
              </Link>
            </div>
            <div className="archive-stats" aria-label="Archive details">
              <div className="stat-count">
                <strong>{loading ? "—" : entries.length}</strong>
                <span>published stories</span>
              </div>
              <div className="stat-detail">
                <span>Curator</span>
                <strong>{collection.curator}</strong>
              </div>
              <div className="stat-detail">
                <span>Place</span>
                <strong>{collection.province}</strong>
              </div>
            </div>
          </div>

          <figure className="hero-image">
            <div className="hero-image-frame">
              <img
                src="/assets/hero.png"
                alt="Khmer rice cakes wrapped in dark green banana leaves and tied with string"
              />
              <span className="image-callout callout-tie">String tie</span>
              <span className="image-callout callout-wrap">Banana leaf wrap</span>
            </div>
            <figcaption>Rice cakes wrapped in banana leaf, ready to share.</figcaption>
          </figure>
        </section>
      </div>

      <section id="collection" className="collection-section" aria-labelledby="collection-title">
        <div className="collection-inner">
          <div className="collection-intro">
            <h2 id="collection-title">Explore the collection</h2>
            <p>Search by cake name, story, contributor, or place.</p>
          </div>
          <form
            className="collection-search"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="search-icon" htmlFor="entry-search">
              <Icon name="search" size={19} />
            </label>
            <input
              id="entry-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, story, contributor, or place"
            />
            {hasQuery && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <Icon name="x" size={16} />
              </button>
            )}
          </form>
          <p className="collection-count">
            {loading
              ? "Loading the archive…"
              : loadError
                ? "The archive could not be loaded right now."
                : `Entries in the archive: ${visibleEntries.length} of ${entries.length}`}
          </p>

          {loading || loadError ? null : visibleEntries.length > 0 ? (
            <section className="entry-grid collection-entries" aria-label="Archive entries">
              {visibleEntries.map((entry) => (
                <Link key={entry.id} href={`/entries/${entry.id}`} className="entry-link">
                  <EntryCard {...entry} query={query} />
                </Link>
              ))}
            </section>
          ) : hasQuery ? (
            <p className="collection-empty">
              No rice cakes match that search yet. Try another English or Khmer word,
              or clear the search. មិនមាននំអង្ករត្រូវនឹងការស្វែងរកនេះទេ។
            </p>
          ) : (
            <p className="collection-empty">No entries in the archive yet. Come back soon.</p>
          )}
        </div>
      </section>
      <footer className="home-footer">
        Built in ICT 340 - Vibe Coding, American University of Phnom Penh, Fall 2026.
        Entries are added by contributors and stay owned by the account that wrote them.
      </footer>
    </main>
  );
}
