import Link from "next/link";
import AuthHeader from "../../../components/AuthHeader";
import EntryDetail from "../../../components/EntryDetail";
import { displayContributor } from "../../../lib/displayContributor";
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
      <main className="page-shell" style={styles.wrap}>
        <AuthHeader />
        <p className="eyebrow" style={styles.kicker}>KHMER LIVING ARCHIVE</p>
        <h1 style={styles.title}>Entry not found</h1>
        <p style={styles.description}>
          This entry does not exist, or it could not be loaded right now.
        </p>
        <p style={styles.backLink}>
          <Link href="/" className="text-link" style={styles.link}>Back to the archive</Link>
        </p>
      </main>
    );
  }

  const isOwner = Boolean(user && entry[OWNER_COLUMN] === user.id);
  const displayTitle = entry.title || entry.title_khmer || "Untitled rice cake";

  return (
    <main className="page-shell" style={styles.wrap}>
      <AuthHeader />
      <div style={styles.breadcrumb}>
        <Link href="/" className="text-link" style={styles.link}>Archive</Link>
        <span aria-hidden="true">/</span>
        <span>Entry</span>
      </div>
      <article className="detail-article" style={styles.article}>
        <div style={styles.visualColumn}>
          <div style={styles.imageFrame}>
            <img src={entry.image} alt={`${displayTitle} rice cake`} style={styles.image} />
            <span style={styles.imageBadge}>Rice cake story</span>
          </div>
          <p style={styles.imageCaption}>A living record of Khmer food, memory, and place.</p>
        </div>
        <div style={styles.storyColumn}>
          <p className="eyebrow" style={styles.kicker}>ARCHIVE ENTRY</p>
          <h1 style={styles.title}>{displayTitle}</h1>
          {entry.title_khmer && entry.title_khmer !== entry.title && (
            <p style={styles.titleKhmer}>{entry.title_khmer}</p>
          )}
          <div style={styles.rule} />
          <p style={styles.description}>{entry.description}</p>
          <div style={styles.metaGrid}>
            <div style={styles.meta}>
              <span style={styles.metaLabel}>Contributor</span>
              <span>{displayContributor(entry.contributor)}</span>
            </div>
            {entry.place && (
              <div style={styles.meta}>
                <span style={styles.metaLabel}>From</span>
                <span>{entry.place}</span>
              </div>
            )}
          </div>
        </div>
      </article>
      <div className="action-footer" style={styles.actionFooter}>
        <Link href="/" className="text-link back-link" style={styles.backLink}>
          <span aria-hidden="true" style={styles.backIcon}>←</span>
          <span>Back to archive</span>
        </Link>
        <EntryDetail entryId={entry.id} isOwner={isOwner} />
      </div>
    </main>
  );
}

const styles = {
  wrap: { maxWidth: 820, margin: "0 auto", padding: "36px 24px 72px" },
  kicker: { margin: 0 },
  breadcrumb: { display: "flex", gap: 9, alignItems: "center", marginTop: 28, color: "var(--muted)", fontFamily: "'Courier New', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 },
  title: { fontSize: "clamp(38px, 6vw, 64px)", margin: "22px 0 8px", lineHeight: 1.02, color: "var(--text)", fontWeight: 600, letterSpacing: -1.5 },
  titleKhmer: { color: "var(--leaf)", fontSize: 21, margin: "0 0 22px", lineHeight: 1.35 },
  description: { fontSize: 18, color: "var(--muted)", lineHeight: 1.8, margin: 0 },
  article: { display: "grid", gap: 0, marginTop: 18, padding: 14, background: "linear-gradient(145deg, rgba(36, 30, 25, 0.98), rgba(27, 22, 18, 0.96))", border: "1px solid var(--border)", borderRadius: 22, boxShadow: "var(--shadow)" },
  visualColumn: { display: "grid", alignContent: "start", gap: 12 },
  imageFrame: { position: "relative", overflow: "hidden", borderRadius: 15, backgroundColor: "var(--muted-bg)" },
  image: { width: "100%", aspectRatio: "16 / 8", objectFit: "cover", display: "block", backgroundColor: "var(--border)" },
  imageBadge: { position: "absolute", left: 14, bottom: 14, padding: "7px 10px", borderRadius: 999, backgroundColor: "rgba(23, 20, 18, 0.8)", border: "1px solid rgba(245, 234, 215, 0.25)", color: "var(--text)", fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" },
  imageCaption: { color: "var(--muted)", fontSize: 12, lineHeight: 1.5, margin: 0, padding: "0 4px" },
  storyColumn: { display: "flex", flexDirection: "column", justifyContent: "center", padding: "30px 28px 28px" },
  rule: { width: 52, height: 3, backgroundColor: "var(--accent)", margin: "0 0 24px" },
  metaGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginTop: 30 },
  meta: { display: "grid", gap: 5, padding: "14px 0 0", borderTop: "1px solid var(--border)", color: "var(--text)", fontSize: 14, lineHeight: 1.4 },
  metaLabel: { color: "var(--accent)", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8 },
  actionFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginTop: 18, padding: "14px 4px 0" },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    margin: 0,
    padding: "10px 14px",
    border: "1px solid var(--border)",
    borderRadius: 999,
    color: "var(--muted)",
    fontSize: 13,
    fontWeight: 700,
    textDecoration: "none",
    backgroundColor: "rgba(36, 30, 25, 0.6)",
  },
  backIcon: {
    color: "var(--accent)",
    fontSize: 18,
    lineHeight: 1,
  },
  link: { color: "var(--accent)" },
};