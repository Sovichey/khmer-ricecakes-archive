"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import collection from "../collection.config.js";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import Icon from "./Icon";

export default function AuthHeader() {
  const [user, setUser] = useState(null);
  const [isReviewer, setIsReviewer] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    supabase.rpc("is_reviewer").then(({ data }) => setIsReviewer(data === true));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.rpc("is_reviewer").then(({ data }) => setIsReviewer(data === true));
      } else {
        setIsReviewer(false);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function logOut() {
    await getSupabaseBrowserClient().auth.signOut();
  }

  return (
    <header className="archive-header" style={styles.header}>
      <Link href="/" className="text-link" style={styles.brand}>
        <span style={styles.brandMark} aria-hidden="true"><Icon name="archive" size={20} /></span>
        <span style={styles.brandText}>
          <strong style={styles.brandTitle}>{collection.name}</strong>
          <small style={styles.brandSubtitle}>Khmer living archive</small>
        </span>
      </Link>
      <nav aria-label="Account" className="account-nav" style={styles.nav}>
        {user ? (
          <>
            <span className="user-pill" style={styles.userPill}>
              <span style={styles.avatar} aria-hidden="true">
                {(user.email?.[0] ?? "U").toUpperCase()}
              </span>
              <span style={styles.email}>{user.email}</span>
            </span>
            <span className="account-divider" style={styles.divider} aria-hidden="true" />
            <Link href="/my-entries" className="text-link header-link" style={styles.link}>
              My entries
            </Link>
            {isReviewer && (
              <Link href="/review" className="text-link header-link" style={styles.link}>
                Review queue
              </Link>
            )}
            <Link href="/contribute" className="btn header-action" style={styles.button}>
              <Icon name="plus" size={16} /> Add entry
            </Link>
            <button type="button" onClick={logOut} className="btn header-action-secondary" style={styles.ghostButton}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-link header-link header-login" style={styles.link}>
              Log in
            </Link>
            <Link href="/signup" className="btn header-action" style={styles.button}>
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
    padding: "16px 0 22px",
    marginBottom: 0,
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
    color: "var(--text)",
    textDecoration: "none",
  },
  brandMark: {
    display: "grid",
    placeItems: "center",
    width: 42,
    height: 42,
    flex: "0 0 42px",
    border: "1px solid var(--accent)",
    borderRadius: "14px 14px 14px 4px",
    color: "var(--accent)",
    background: "transparent",
    fontSize: 24,
    lineHeight: 1,
  },
  brandText: {
    display: "grid",
    gap: 2,
    minWidth: 0,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: 0.4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  brandSubtitle: {
    color: "var(--muted)",
    fontSize: 11,
  },
  nav: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" },
  userPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    maxWidth: 210,
    padding: "5px 10px 5px 5px",
    border: "1px solid var(--border)",
    borderRadius: 999,
    color: "var(--muted)",
    fontSize: 13,
  },
  avatar: {
    display: "grid",
    placeItems: "center",
    width: 25,
    height: 25,
    borderRadius: "50%",
    backgroundColor: "var(--leaf)",
    color: "var(--accent-ink)",
    fontSize: 11,
    fontWeight: 800,
  },
  email: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  divider: { width: 1, height: 24, backgroundColor: "var(--border)" },
  link: { color: "var(--muted)", fontSize: 13, fontWeight: 600, textDecoration: "none" },
  button: { display: "inline-flex", minHeight: 44, alignItems: "center", justifyContent: "center", gap: 6, padding: "0 19px", border: "1px solid var(--accent)", borderRadius: 999, backgroundColor: "var(--accent)", color: "var(--accent-ink)", fontSize: 13, fontWeight: 700, textDecoration: "none", cursor: "pointer", boxShadow: "none", whiteSpace: "nowrap" },
  ghostButton: { display: "inline-flex", minHeight: 42, alignItems: "center", justifyContent: "center", padding: "0 16px", border: "1px solid var(--accent)", borderRadius: 999, backgroundColor: "transparent", color: "var(--accent)", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
};
