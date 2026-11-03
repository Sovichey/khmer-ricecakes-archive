// Reviews one pending entry. The status change happens inside the database
// function review_entry(entry_id, decision) — never in the app — so this helper
// only forwards the reviewer's choice through the logged-in session's client and
// reports whether it succeeded. The function is the security boundary: it
// decides who may publish or return and only acts on those still pending.
export async function reviewEntry(supabase, entryId, decision) {
  const { data, error } = await supabase.rpc("review_entry", {
    entry_id: entryId,
    decision,
  });

  if (error) {
    console.error("Review: could not review the entry.", error);
    return { ok: false };
  }

  // The function returns true/false; only a true means the change stuck.
  return { ok: data === true };
}