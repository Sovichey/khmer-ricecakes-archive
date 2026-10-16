"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const isLogin = mode === "login";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    const result = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setError(isLogin ? "Invalid email or password" : "Unable to create account");
      return;
    }

    if (isLogin || result.data.session) {
      router.push("/");
      router.refresh();
    } else {
      setMessage("Account created. You can now log in.");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label htmlFor="email" style={styles.label}>Email</label>
      <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} style={styles.input} />
      <label htmlFor="password" style={styles.label}>Password</label>
      <input id="password" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} style={styles.input} />
      <button type="submit" className="btn" style={styles.button}>{isLogin ? "Log in" : "Sign up"}</button>
      {error && <p role="alert" style={styles.error}>{error}</p>}
      {message && <p role="status" style={styles.message}>{message}</p>}
    </form>
  );
}

const styles = {
  form: { display: "grid", gap: 10, marginTop: 28 },
  label: { color: "var(--muted)", fontSize: 14 },
  input: { padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8, backgroundColor: "var(--surface)", color: "var(--text)", fontSize: 16 },
  button: { marginTop: 10, padding: "12px 16px", border: 0, borderRadius: 8, backgroundColor: "var(--accent)", color: "var(--accent-ink)", fontSize: 16, fontWeight: 700, cursor: "pointer" },
  error: { color: "var(--error)", margin: "8px 0 0" },
  message: { color: "var(--accent)", margin: "8px 0 0" },
};
