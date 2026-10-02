import { OWNER_COLUMN } from "./schema";
import { uploadPhoto } from "./photoUpload";

// The owner is read strictly from the logged-in session via
// supabase.auth.getUser() and written into the "owner" column — never from a
// form input. Returns { ok, entryId } on success or { ok: false, message }
// with a friendly message; real errors are logged with console.error only.
export async function saveContributedEntry(supabase, values) {
  const { data, error: sessionError } = await supabase.auth.getUser();
  const user = data?.user ?? null;
  if (sessionError || !user) {
    console.error("Contribute: no logged-in session for this entry.", sessionError);
    return { ok: false, message: "Your session has expired. Log in again and try once more." };
  }

  const photo = await uploadPhoto(supabase, user.id, values.image);
  if (photo.error) {
    console.error("Contribute: photo upload to the 'photos' bucket failed.", photo.error);
    return { ok: false, message: "The photo could not be uploaded. Try again in a moment, or choose a smaller image." };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("entries")
    .insert({
      title: values.title,
      title_khmer: values.title_khmer,
      description: values.description,
      contributor: values.contributor,
      place: values.place,
      image: photo.publicUrl,
      [OWNER_COLUMN]: user.id,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Contribute: could not save the entry row.", insertError);
    return { ok: false, message: "Your entry could not be saved. Please try again in a moment." };
  }

  return { ok: true, entryId: inserted.id };
}