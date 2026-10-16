import Link from "next/link";
import AuthForm from "../../components/AuthForm";

export default function SignupPage() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>Sign up</h1>
      <p style={styles.description}>Create an account to join the archive.</p>
      <AuthForm mode="signup" />
      <p style={styles.prompt}>Already have an account? <Link href="/login" className="text-link" style={styles.link}>Log in</Link></p>
    </main>
  );
}

const styles = {
  wrap: { maxWidth: 420, margin: "0 auto", padding: "clamp(40px, 10vw, 80px) 24px" },
  kicker: { fontFamily: "'Courier New', monospace", color: "var(--accent)", fontSize: 14, letterSpacing: 1 },
  title: { fontSize: "clamp(32px, 8vw, 48px)", margin: "16px 0 12px", color: "var(--text)", fontWeight: 600 },
  description: { color: "var(--muted)", lineHeight: 1.6 },
  prompt: { color: "var(--muted)", fontSize: 14, marginTop: 24 },
  link: { color: "var(--accent)" },
};
