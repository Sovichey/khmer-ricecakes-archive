import AuthHeader from "../../components/AuthHeader";
import ReviewQueue from "../../components/ReviewQueue";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export const metadata = {
  title: "Review queue — khmer-ricecakes-archive",
};

export default async function ReviewPage() {
  const supabase = await createSupabaseServerClient();

  // The is_reviewer() database function — not app code — decides who may open
  // the queue. Anyone it does not confirm gets the message below and nothing
  // else; no pending entries are fetched or shown.
  const { data: isReviewer } = await supabase.rpc("is_reviewer");

  if (isReviewer !== true) {
    return (
      <main className="page-shell" style={styles.wrap}>
        <AuthHeader />
        <p style={styles.permission}>
          អ្នកមិនមានសិទ្ធិចូលមើលទំព័រនេះទេ / You do not have permission
          to access the review queue.
        </p>
      </main>
    );
  }

  // RLS already limits which pending rows a reviewer can read; we just ask for
  // the pending ones, oldest first so nothing waits too long.
  const { data: entries, error } = await supabase
    .from("entries")
    .select("id, title, title_khmer, description, place, image, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Review: could not load the pending queue.", error);
  }

  return (
    <main className="page-shell" style={styles.wrap}>
      <AuthHeader />
      <p className="eyebrow" style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>Review queue</h1>
      <p style={styles.description}>
        Publish or return new contributions before they reach the archive.
      </p>
      <ReviewQueue entries={entries ?? []} />
    </main>
  );
}

const styles = {
  wrap: { maxWidth: 900, margin: "0 auto", padding: "36px 24px 72px" },
  kicker: { margin: 0 },
  permission: {
    marginTop: 40,
    padding: 22,
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    color: "var(--text)",
    lineHeight: 1.6,
  },
  title: { fontSize: "clamp(34px, 7vw, 52px)", margin: "16px 0 10px", lineHeight: 1.1, color: "var(--text)", fontWeight: 600 },
  description: { fontSize: 17, color: "var(--muted)", lineHeight: 1.6, margin: 0 },
};