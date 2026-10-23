import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import AuthHeader from "../../components/AuthHeader";
import EntryCard from "../../components/EntryCard";
import { OWNER_COLUMN } from "../../lib/schema";
import { createSupabaseServerClient } from "../../lib/supabase/server";

// The entries table stores machine statuses ("pending", "published", "returned");
// this page shows them as plain words so contributors can read their own review
// state back to us. RLS already limits rows to what the logged-in user may see,
// and the query limits them to the session user's own entries.
const STATUS_LABELS = {
  pending: "Pending",
  published: "Published",
  returned: "Returned",
};

function statusLabel(status) {
  return STATUS_LABELS[status] ?? "Unknown";
}

export default async function MyEntriesPage() {
  const supabase = await createSupabaseServerClient();

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user ?? null;
  } catch (error) {
    unstable_rethrow(error);
    console.error("My entries: could not check the session.", error);
  }

  if (!user) {
    return (
      <main style={styles.wrap}>
        <AuthHeader />
        <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
        <h1 style={styles.title}>My entries</h1>
        <div style={styles.card}>
          <p style={styles.cardText}>
            Log in to see the entries you have contributed.
          </p>
          <Link href="/login" className="btn" style={styles.loginButton}>
            Log in
          </Link>
        </div>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq(OWNER_COLUMN, user.id)
    .order("created_at", { ascending: false });
  const entries = data ?? [];

  if (error) {
    console.error("My entries: could not load your entries.", error);
  }

  return (
    <main style={styles.wrap}>
      <AuthHeader />
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>My entries</h1>
      <p style={styles.description}>
        The entries you contributed, with their review status.
      </p>

      {error ? (
        <p style={styles.emptyState}>Your entries could not be loaded right now.</p>
      ) : entries.length === 0 ? (
        <p style={styles.emptyState}>
          You haven&apos;t contributed any entries yet.{" "}
          <Link href="/contribute" className="text-link" style={styles.link}>
            Add your first entry
          </Link>
          .
        </p>
      ) : (
        <section style={styles.entries} aria-label="Your entries">
          {entries.map((entry) => (
            <div key={entry.id} style={styles.entryItem}>
              <Link href={`/entries/${entry.id}`} style={styles.entryLink}>
                <EntryCard {...entry} />
              </Link>
              <p style={styles.statusRow}>
                <span style={styles.statusLabel}>Status — ស្ថានភាព</span>{" "}
                <span style={styles.statusValue}>{statusLabel(entry.status)}</span>
              </p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

const styles = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "clamp(40px, 10vw, 80px) 24px" },
  kicker: { fontFamily: "'Courier New', monospace", color: "var(--accent)", fontSize: 14, letterSpacing: 1 },
  title: { fontSize: "clamp(32px, 8vw, 48px)", margin: "16px 0 12px", lineHeight: 1.1, color: "var(--text)", fontWeight: 600 },
  description: { fontSize: 18, color: "var(--muted)", lineHeight: 1.6, margin: 0 },
  card: {
    marginTop: 32,
    padding: 24,
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
  },
  cardText: { color: "var(--text)", lineHeight: 1.6, margin: "0 0 16px" },
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
  emptyState: { margin: "28px 0 0", color: "var(--muted)", lineHeight: 1.6 },
  link: { color: "var(--accent)" },
  entries: { display: "grid", gap: 18, marginTop: 28 },
  entryItem: {
    display: "grid",
    gap: 8,
    paddingBottom: 8,
    borderBottom: "1px solid var(--border)",
  },
  entryLink: { textDecoration: "none", color: "inherit", display: "block" },
  statusRow: { margin: 0, color: "var(--text)", fontSize: 14 },
  statusLabel: { color: "var(--muted)", fontSize: 11, fontWeight: 900, textTransform: "uppercase" },
  statusValue: { color: "var(--accent)", fontWeight: 700 },
};
