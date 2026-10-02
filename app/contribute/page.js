import Link from "next/link";
import AuthHeader from "../../components/AuthHeader";
import EntryForm from "../../components/EntryForm";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export default async function ContributePage() {
  // Logged-in users see the form; logged-out visitors get a link to log in.
  let user = null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    user = data.user ?? null;
  } catch (error) {
    console.error("Contribute: could not check the session.", error);
  }

  return (
    <main style={styles.wrap}>
      <AuthHeader />
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>Contribute an entry</h1>
      <p style={styles.description}>
        Add a rice cake and its story to the archive. The entry is attached to
        your account; your name goes in the contributor field.
      </p>

      {user ? (
        <EntryForm mode="create" />
      ) : (
        <div style={styles.card}>
          <p style={styles.loginText}>
            Only logged-in contributors can add entries to the archive.
          </p>
          <Link href="/login" style={styles.loginButton}>
            Log in to contribute
          </Link>
        </div>
      )}
    </main>
  );
}

const styles = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "clamp(40px, 10vw, 80px) 24px" },
  kicker: { fontFamily: "'Courier New', monospace", color: "#2EE6A8", fontSize: 14, letterSpacing: 1 },
  title: { fontSize: "clamp(32px, 8vw, 48px)", margin: "16px 0 12px", lineHeight: 1.1 },
  description: { fontSize: 18, color: "#97A1B3", lineHeight: 1.6, margin: 0 },
  card: {
    marginTop: 32,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  loginText: { color: "#E8EDF2", lineHeight: 1.6, margin: "0 0 16px" },
  loginButton: {
    display: "inline-block",
    padding: "12px 16px",
    borderRadius: 8,
    backgroundColor: "#2EE6A8",
    color: "#11223f",
    fontSize: 16,
    fontWeight: 700,
    textDecoration: "none",
  },
};