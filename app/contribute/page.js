import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
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
    unstable_rethrow(error);
    console.error("Contribute: could not check the session.", error);
  }

  return (
    <main className="page-shell archive-page" style={styles.wrap}>
      <AuthHeader />
      <p className="eyebrow" style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>Contribute an entry</h1>
      <p style={styles.description}>
        Add a rice cake and its story to the archive. The entry is attached to
        your account; your name goes in the contributor field.
      </p>

      {user ? (
        <EntryForm mode="create" />
      ) : (
        <div className="archive-notice" style={styles.card}>
          <p style={styles.loginText}>
            Only logged-in contributors can add entries to the archive.
          </p>
          <Link href="/login" className="btn" style={styles.loginButton}>
            Log in to contribute
          </Link>
        </div>
      )}
    </main>
  );
}

const styles = {
  wrap: { maxWidth: 760, margin: "0 auto", padding: "36px 24px 72px" },
  kicker: { margin: 0 },
  title: { fontSize: "clamp(32px, 8vw, 48px)", margin: "16px 0 12px", lineHeight: 1.1, color: "var(--text)", fontWeight: 600 },
  description: { fontSize: 18, color: "var(--muted)", lineHeight: 1.6, margin: 0 },
  card: {
    marginTop: 32,
    padding: 24,
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
  },
  loginText: { color: "var(--text)", lineHeight: 1.6, margin: "0 0 16px" },
  loginButton: {
    display: "inline-block",
    padding: "12px 16px",
    borderRadius: 8,
    backgroundColor: "var(--accent)",
    color: "var(--accent-ink)",
    fontSize: 16,
    fontWeight: 700,
    textDecoration: "none",
  },
};