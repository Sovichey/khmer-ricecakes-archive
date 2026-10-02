import Link from "next/link";
import AuthHeader from "../../../components/AuthHeader";
import EntryDetail from "../../../components/EntryDetail";
import { OWNER_COLUMN } from "../../../lib/schema";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export default async function EntryPage({ params }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  let user = null;
  try {
    const { data: sessionData } = await supabase.auth.getUser();
    user = sessionData?.user ?? null;
  } catch (sessionError) {
    console.error("Entry detail: could not check the session.", sessionError);
  }

  const { data: entry, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Entry detail: could not load the entry.", error);
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
      <article style={styles.article}>
        <img
          src={entry.image}
          alt={`${entry.title || entry.title_khmer} rice cake`}
          style={styles.image}
        />
        <h1 style={styles.title}>{entry.title || entry.title_khmer}</h1>
        {entry.title_khmer && entry.title_khmer !== entry.title && (
          <p style={styles.titleKhmer}>{entry.title_khmer}</p>
        )}
        <p style={styles.description}>{entry.description}</p>
        <p style={styles.meta}>
          <span style={styles.metaLabel}>Contributor</span> {entry.contributor}
        </p>
        {entry.place && (
          <p style={styles.meta}>
            <span style={styles.metaLabel}>Place</span> {entry.place}
          </p>
        )}
      </article>
      <EntryDetail entryId={entry.id} isOwner={isOwner} />
      <p style={styles.backLink}>
        <Link href="/" style={styles.link}>← Back to the archive</Link>
      </p>
    </main>
  );
}

const styles = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "clamp(40px, 10vw, 80px) 24px" },
  kicker: { fontFamily: "'Courier New', monospace", color: "#2EE6A8", fontSize: 14, letterSpacing: 1 },
  title: { fontSize: "clamp(32px, 8vw, 48px)", margin: "16px 0 4px", lineHeight: 1.15 },
  titleKhmer: { color: "#2EE6A8", fontSize: 18, margin: "0 0 16px" },
  description: { fontSize: 17, color: "#97A1B3", lineHeight: 1.7, margin: 0 },
  article: { display: "grid", gap: 10 },
  image: { width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderRadius: 10, backgroundColor: "#2E3644" },
  meta: { color: "#E8EDF2", fontSize: 15, margin: "8px 0 0" },
  metaLabel: { color: "#97A1B3", fontSize: 11, fontWeight: 900, textTransform: "uppercase" },
  backLink: { marginTop: 28 },
  link: { color: "#2EE6A8" },
};