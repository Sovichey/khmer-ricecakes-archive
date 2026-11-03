"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import collection from "../collection.config.js";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export default function AuthHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function logOut() {
    await getSupabaseBrowserClient().auth.signOut();
  }

  return (
    <header style={styles.header}>
      <Link href="/" className="text-link" style={styles.brand}>
        <span style={styles.brandMark} aria-hidden="true">៚</span>
        <span style={styles.brandText}>
          <strong style={styles.brandTitle}>{collection.name}</strong>
          <small style={styles.brandSubtitle}>Khmer living archive</small>
        </span>
      </Link>
      <nav aria-label="Account" style={styles.nav}>
        {user ? (
          <>
            <span style={styles.userPill}>
              <span style={styles.avatar} aria-hidden="true">
                {(user.email?.[0] ?? "U").toUpperCase()}
              </span>
              <span style={styles.email}>{user.email}</span>
            </span>
            <span style={styles.divider} aria-hidden="true" />
            <Link href="/my-entries" className="text-link" style={styles.link}>
              My entries
            </Link>
            <Link href="/contribute" className="btn" style={styles.button}>
              <span aria-hidden="true">+</span> Add entry
            </Link>
            <button type="button" onClick={logOut} className="btn" style={styles.ghostButton}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-link" style={styles.link}>
              Log in
            </Link>
            <Link href="/signup" className="btn" style={styles.button}>
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
    gap: 16,
    flexWrap: "wrap",
    padding: "14px 0 20px",
    marginBottom: 42,
    borderBottom: "1px solid var(--border)",
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 11,
    color: "var(--text)",
    textDecoration: "none",
  },
  brandMark: {
    display: "grid",
    placeItems: "center",
    width: 38,
    height: 38,
    border: "1px solid var(--accent)",
    borderRadius: "12px 12px 12px 3px",
    color: "var(--accent)",
    background: "linear-gradient(145deg, var(--muted-bg), var(--surface))",
    fontSize: 24,
    lineHeight: 1,
  },
  brandText: {
    display: "grid",
    gap: 2,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: 0.4,
  },
  brandSubtitle: {
    color: "var(--muted)",
    fontFamily: "'Courier New', monospace",
    fontSize: 9,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  nav: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" },
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
  link: { color: "var(--accent)", fontSize: 14, fontWeight: 700, textDecoration: "none" },
  button: { display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 15px", border: 0, borderRadius: 999, backgroundColor: "var(--accent)", color: "var(--accent-ink)", fontSize: 13, fontWeight: 800, textDecoration: "none", cursor: "pointer", boxShadow: "0 6px 18px rgba(215, 168, 76, 0.16)" },
  ghostButton: { padding: "9px 14px", border: "1px solid var(--border)", borderRadius: 999, backgroundColor: "transparent", color: "var(--text)", fontSize: 13, fontWeight: 800, cursor: "pointer" },
};
