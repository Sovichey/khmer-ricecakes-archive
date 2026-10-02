import { EXTENSION_BY_TYPE } from "./validateEntry";

function newUuid() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Owns nothing from the form: the owner (user id) is read strictly from the
// logged-in session via supabase.auth.getUser(). It is used only to build the
// storage path <user_id>/<random_uuid>.<ext> in the "photos" bucket and to
// gate the whole save. Returns a plain result: { ok, entryId } on success or
// { ok: false, message } with a friendly message; real errors go to
// console.error, never to the user.
export async function saveContributedEntry(supabase, values) {
  const { data, error: sessionError } = await supabase.auth.getUser();
  const user = data?.user ?? null;
  if (sessionError || !user) {
    console.error("Contribute: no logged-in session for this entry.", sessionError);
    return {
      ok: false,
      message: "Your session has expired. Log in again and try once more.",
    };
  }

  const imagePath = `${user.id}/${newUuid()}.${EXTENSION_BY_TYPE[values.image.type]}`;

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(imagePath, values.image, { contentType: values.image.type, upsert: false });

  if (uploadError) {
    console.error("Contribute: photo upload to the 'photos' bucket failed.", uploadError);
    return {
      ok: false,
      message: "The photo could not be uploaded. Try again in a moment, or choose a smaller image.",
    };
  }

  const { data: publicUrlData } = supabase.storage.from("photos").getPublicUrl(imagePath);

  const { data: inserted, error: insertError } = await supabase
    .from("entries")
    .insert({
      title: values.title,
      title_khmer: values.title_khmer,
      description: values.description,
      contributor: values.contributor,
      place: values.place,
      image: publicUrlData.publicUrl,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Contribute: could not save the entry row.", insertError);
    return {
      ok: false,
      message: "Your entry could not be saved. Please try again in a moment.",
    };
  }

  return { ok: true, entryId: inserted.id };
}