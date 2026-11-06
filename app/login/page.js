import Link from "next/link";
import AuthForm from "../../components/AuthForm";
import AuthHeader from "../../components/AuthHeader";

export default function LoginPage() {
  return (
    <main className="page-shell archive-page archive-page-narrow" style={styles.wrap}>
      <AuthHeader />
      <p className="eyebrow" style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>Log in</h1>
      <p style={styles.description}>Return to your archive account.</p>
      <AuthForm mode="login" />
      <p style={styles.prompt}>Need an account? <Link href="/signup" className="text-link" style={styles.link}>Sign up</Link></p>
    </main>
  );
}

const styles = {
  wrap: { maxWidth: 480, margin: "0 auto", padding: "72px 24px" },
  kicker: { margin: 0 },
  title: { fontSize: "clamp(32px, 8vw, 48px)", margin: "16px 0 12px", color: "var(--text)", fontWeight: 600 },
  description: { color: "var(--muted)", lineHeight: 1.6 },
  prompt: { color: "var(--muted)", fontSize: 14, marginTop: 24 },
  link: { color: "var(--accent)" },
};
