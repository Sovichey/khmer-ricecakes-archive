import { OWNER_COLUMN } from "./schema";
import { uploadPhoto } from "./photoUpload";

// Saves an edit. The photo is optional: if the form picked no new file the old
// image URL is kept. The update appends .select() and we check that a row
// actually came back, so a failed or unauthorized update shows a friendly
// message instead of a raw error.
export async function saveEditedEntry(supabase, entryId, values, existingImageUrl) {
  const { data, error: sessionError } = await supabase.auth.getUser();
  const user = data?.user ?? null;
  if (sessionError || !user) {
    console.error("Contribute: no logged-in session for this edit.", sessionError);
    return { ok: false, message: "Your session has expired. Log in again and try once more." };
  }

  let imageUrl = existingImageUrl;
  if (values.image) {
    const photo = await uploadPhoto(supabase, user.id, values.image);
    if (photo.error) {
      console.error("Contribute: photo upload while editing failed.", photo.error);
      return { ok: false, message: "The new photo could not be uploaded. Try again in a moment, or choose a smaller image." };
    }
    imageUrl = photo.publicUrl;
  }

  const { data: updatedRows, error: updateError } = await supabase
    .from("entries")
    .update({
      title: values.title,
      title_khmer: values.title_khmer,
      description: values.description,
      contributor: values.contributor,
      place: values.place,
      image: imageUrl,
    })
    .eq("id", entryId)
    .eq(OWNER_COLUMN, user.id)
    .select("id");

  if (updateError) {
    console.error("Contribute: could not update the entry row.", updateError);
    return { ok: false, message: "That change wasn't saved. Please try again in a moment." };
  }

  if (!updatedRows || updatedRows.length === 0) {
    console.error("Contribute: update matched no row.", { entryId, owner: user.id });
    return { ok: false, message: "That change wasn't saved" };
  }

  return { ok: true, entryId };
}