import { OWNER_COLUMN } from "./schema";
import { removeUploadedPhoto, uploadPhoto } from "./photoUpload";

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
  let uploadedPhotoPath = null;
  if (values.image) {
    const photo = await uploadPhoto(supabase, user.id, values.image);
    if (photo.error) {
      console.error("Contribute: photo upload while editing failed.", photo.error);
      return { ok: false, message: "The new photo could not be uploaded. Try again in a moment, or choose a smaller image." };
    }
    imageUrl = photo.publicUrl;
    uploadedPhotoPath = photo.path;
  }

  // An owner's edit needs a fresh review, so it goes back to "pending".
  // Reviewers skip that step: when rpc("is_reviewer") returns true the status is
  // left untouched instead of being flipped back to pending.
  let isReviewer = false;
  const { data: reviewerFlag, error: reviewerError } = await supabase.rpc("is_reviewer");
  if (reviewerError) {
    console.error("Contribute: could not check the reviewer role.", reviewerError);
  } else {
    isReviewer = reviewerFlag === true;
  }

  const updateValues = {
    title: values.title,
    title_khmer: values.title_khmer,
    description: values.description,
    contributor: values.contributor,
    place: values.place,
    image: imageUrl,
  };
  if (!isReviewer) {
    updateValues.status = "pending";
  }

  const { data: updatedRows, error: updateError } = await supabase
    .from("entries")
    .update(updateValues)
    .eq("id", entryId)
    .eq(OWNER_COLUMN, user.id)
    .select("id");

  if (updateError) {
    console.error("Contribute: could not update the entry row.", updateError);
    if (uploadedPhotoPath) {
      await removeUploadedPhoto(supabase, uploadedPhotoPath);
    }
    return { ok: false, message: "That change wasn't saved. Please try again in a moment." };
  }

  if (!updatedRows || updatedRows.length === 0) {
    console.error("Contribute: update matched no row.", { entryId, owner: user.id });
    if (uploadedPhotoPath) {
      await removeUploadedPhoto(supabase, uploadedPhotoPath);
    }
    return { ok: false, message: "That change wasn't saved" };
  }

  return { ok: true, entryId };
}