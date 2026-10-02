import { OWNER_COLUMN } from "./schema";

// Deletes one entry owned by the logged-in user. The delete appends .select()
// and we check a row came back, so a failed or unauthorized delete shows a
// friendly message instead of a raw error.
export async function deleteEntry(supabase, entryId) {
  const { data, error: sessionError } = await supabase.auth.getUser();
  const user = data?.user ?? null;
  if (sessionError || !user) {
    console.error("Contribute: no logged-in session for this delete.", sessionError);
    return { ok: false, message: "Your session has expired. Log in again and try once more." };
  }

  const { data: deletedRows, error: deleteError } = await supabase
    .from("entries")
    .delete()
    .eq("id", entryId)
    .eq(OWNER_COLUMN, user.id)
    .select("id");

  if (deleteError) {
    console.error("Contribute: could not delete the entry row.", deleteError);
    return { ok: false, message: "That change wasn't saved. Please try again in a moment." };
  }

  if (!deletedRows || deletedRows.length === 0) {
    console.error("Contribute: delete matched no row.", { entryId, owner: user.id });
    return { ok: false, message: "That change wasn't saved" };
  }

  return { ok: true };
}