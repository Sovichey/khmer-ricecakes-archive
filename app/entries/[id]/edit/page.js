import Link from "next/link";
import AuthHeader from "../../../../components/AuthHeader";
import EntryForm from "../../../../components/EntryForm";
import { OWNER_COLUMN } from "../../../../lib/schema";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export default async function EditEntryPage({ params }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  let user = null;
  try {
    const { data: sessionData } = await supabase.auth.getUser();
    user = sessionData?.user ?? null;
  } catch (sessionError) {
    console.error("Edit entry: could not check the session.", sessionError);
  }

  const { data: entry, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Edit entry: could not load the entry.", error);
  }
  if (error || !entry) {
    return (
      <main style={styles.wrap}>
        <AuthHeader />
        <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
        <h1 style={styles.title}>Entry not found</h1>
        <p style={styles.description}>
          This entry does not exist, or it could not be loaded right now.
        </p>
        <p style={styles.backLink}>
          <Link href="/" style={styles.link}>Back to the archive</Link>
        </p>
      </main>
    );
  }

  const isOwner = Boolean(user && entry[OWNER_COLUMN] === user.id);

  return (
    <main style={styles.wrap}>
      <AuthHeader />
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>Edit entry</h1>
      {isOwner ? (
        <EntryForm mode="edit" entryId={entry.id} initialValues={entry} />
      ) : (
        <div style={styles.card}>
          <p style={styles.cardText}>Only the entry's owner can edit it.</p>
          <Link href={`/entries/${entry.id}`} style={styles.link}>
            Back to the entry
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
  description: { fontSize: 17, color: "#97A1B3", lineHeight: 1.7, margin: 0 },
  card: { marginTop: 32, padding: 24, backgroundColor: "#1C222C", border: "1px solid #2E3644", borderRadius: 10 },
  cardText: { color: "#E8EDF2", lineHeight: 1.6, margin: "0 0 16px" },
  backLink: { marginTop: 28 },
  link: { color: "#2EE6A8" },
};