import { EXTENSION_BY_TYPE } from "./validateEntry";

function newUuid() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Uploads one photo to the "photos" bucket at <user_id>/<random_uuid>.<ext>
// and returns its public URL, or the raw error for the caller to log. Nothing
// here is shown directly to the user.
export async function uploadPhoto(supabase, userId, file) {
  const imagePath = `${userId}/${newUuid()}.${EXTENSION_BY_TYPE[file.type]}`;

  const { error } = await supabase.storage
    .from("photos")
    .upload(imagePath, file, { contentType: file.type, upsert: false });

  if (error) {
    return { error };
  }

  const { data } = supabase.storage.from("photos").getPublicUrl(imagePath);
  return { path: imagePath, publicUrl: data.publicUrl };
}

export async function removeUploadedPhoto(supabase, imagePath) {
  try {
    const { error } = await supabase.storage.from("photos").remove([imagePath]);
    if (error) {
      console.error("Photo upload cleanup failed.", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Photo upload cleanup failed.", error);
    return false;
  }
}
