import Link from "next/link";
import AuthForm from "../../components/AuthForm";

export default function LoginPage() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>Log in</h1>
      <p style={styles.description}>Return to your archive account.</p>
      <AuthForm mode="login" />
      <p style={styles.prompt}>Need an account? <Link href="/signup" style={styles.link}>Sign up</Link></p>
    </main>
  );
}

const styles = {
  wrap: { maxWidth: 420, margin: "0 auto", padding: "clamp(40px, 10vw, 80px) 24px" },
  kicker: { fontFamily: "'Courier New', monospace", color: "#2EE6A8", fontSize: 14, letterSpacing: 1 },
  title: { fontSize: "clamp(32px, 8vw, 48px)", margin: "16px 0 12px" },
  description: { color: "#97A1B3", lineHeight: 1.6 },
  prompt: { color: "#97A1B3", fontSize: 14, marginTop: 24 },
  link: { color: "#2EE6A8" },
};
