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
        {collection.name}
      </Link>
      <nav aria-label="Account" style={styles.nav}>
        {user ? (
          <>
            <span style={styles.email}>{user.email}</span>
            <Link href="/my-entries" className="text-link" style={styles.link}>
              My entries
            </Link>
            <Link href="/contribute" className="btn" style={styles.button}>
              Add entry
            </Link>
            <button type="button" onClick={logOut} className="btn" style={styles.button}>
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
    padding: "0 0 20px",
    marginBottom: 28,
    borderBottom: "1px solid var(--border)",
  },
  brand: {
    color: "var(--text)",
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: 0.5,
    textDecoration: "none",
  },
  nav: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" },
  email: { color: "var(--muted)", fontSize: 14, overflowWrap: "anywhere" },
  link: { color: "var(--accent)", fontSize: 14, textDecoration: "none" },
  button: { padding: "8px 12px", border: 0, borderRadius: 6, backgroundColor: "var(--accent)", color: "var(--accent-ink)", fontSize: 14, fontWeight: 700, textDecoration: "none", cursor: "pointer" },
};
