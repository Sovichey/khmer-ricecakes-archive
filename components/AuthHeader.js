"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    <nav aria-label="Account" style={styles.nav}>
      {user ? (
        <>
          <span style={styles.email}>{user.email}</span>
          <button type="button" onClick={logOut} style={styles.button}>Log out</button>
        </>
      ) : (
        <>
          <Link href="/login" style={styles.link}>Log in</Link>
          <Link href="/signup" style={styles.button}>Sign up</Link>
        </>
      )}
    </nav>
  );
}

const styles = {
  nav: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14, marginBottom: 28, minHeight: 34, flexWrap: "wrap" },
  email: { color: "#97A1B3", fontSize: 14, overflowWrap: "anywhere" },
  link: { color: "#2EE6A8", fontSize: 14, textDecoration: "none" },
  button: { padding: "8px 12px", border: 0, borderRadius: 6, backgroundColor: "#2EE6A8", color: "#11223f", fontSize: 14, fontWeight: 700, textDecoration: "none", cursor: "pointer" },
};
