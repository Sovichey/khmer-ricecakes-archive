"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "./FormField";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { validateEntry, ALLOWED_IMAGE_TYPES } from "../lib/validateEntry";
import { saveContributedEntry } from "../lib/saveContributedEntry";
import { saveEditedEntry } from "../lib/saveEditedEntry";
import { CAMBODIA_PROVINCES } from "../lib/provinces";

// One form for both /contribute (mode "create") and /entries/[id]/edit
// (mode "edit"). Edit pre-fills from the entry row and keeps the current
// photo unless a new file is picked.
export default function EntryForm({ mode = "create", entryId = null, initialValues = null }) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const existingImage = initialValues?.image ?? "";

  const [values, setValues] = useState(() => ({
    title: initialValues?.title ?? "",
    title_khmer: initialValues?.title_khmer ?? "",
    description: initialValues?.description ?? "",
    contributor: initialValues?.contributor ?? "",
    place: initialValues?.place ?? "",
    image: null,
  }));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    const result = validateEntry(values, mode);
    setErrors(result.errors);
    if (Object.keys(result.errors).length > 0) return;

    setSubmitting(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const saveResult = isEdit
        ? await saveEditedEntry(supabase, entryId, result.values, existingImage)
        : await saveContributedEntry(supabase, result.values);

      if (!saveResult.ok) {
        setSubmitError(saveResult.message);
        return;
      }
      router.push(`/entries/${saveResult.entryId}`);
      router.refresh();
    } catch (error) {
      console.error("EntryForm: unexpected failure while saving.", error);
      setSubmitError("Something went wrong while saving. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={styles.form}>
      <FormField label="Title (English)" htmlFor="title" error={errors.title}>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
          maxLength={120}
          placeholder="Optional: name of the rice cake"
          style={styles.input}
          aria-invalid={Boolean(errors.title)}
        />
      </FormField>

      <FormField label="Title (Khmer)" htmlFor="title_khmer" error={errors.title_khmer}>
        <input
          id="title_khmer"
          type="text"
          required
          value={values.title_khmer}
          onChange={(event) => update("title_khmer", event.target.value)}
          maxLength={120}
          placeholder="នំអង្ករ"
          style={styles.input}
          aria-invalid={Boolean(errors.title_khmer)}
        />
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          required
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          maxLength={1000}
          rows={6}
          placeholder="Ingredients, how it is made, and what it means to you — 10 to 1000 characters."
          style={styles.textarea}
          aria-invalid={Boolean(errors.description)}
        />
      </FormField>

      <FormField label="Contributor name" htmlFor="contributor" error={errors.contributor}>
        <input
          id="contributor"
          type="text"
          required
          value={values.contributor}
          onChange={(event) => update("contributor", event.target.value)}
          maxLength={50}
          placeholder="How should your name appear?"
          style={styles.input}
          aria-invalid={Boolean(errors.contributor)}
        />
      </FormField>

      <FormField label="Place (optional)" htmlFor="place" error={errors.place}>
        <select
          id="place"
          value={values.place}
          onChange={(event) => update("place", event.target.value)}
          style={styles.select}
          aria-invalid={Boolean(errors.place)}
        >
          <option value="">Select a province or city…</option>
          {CAMBODIA_PROVINCES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label={isEdit ? "Photo (optional)" : "Photo"} htmlFor="image" error={errors.image}>
        {isEdit && existingImage && (
          <img src={existingImage} alt="Current photo" style={styles.preview} />
        )}
        <input
          id="image"
          type="file"
          required={!isEdit}
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          onChange={(event) => update("image", event.target.files?.[0] ?? null)}
          style={styles.fileInput}
          aria-invalid={Boolean(errors.image)}
        />
        {isEdit ? (
          <p style={styles.fileName}>
            Leave unchanged to keep the current photo, or pick a new JPG, PNG, or WebP (max 5 MB).
          </p>
        ) : (
          values.image && <p style={styles.fileName}>{values.image.name} — ready to upload</p>
        )}
      </FormField>

      {submitError && (
        <p role="alert" style={styles.submitError}>
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={submitting ? styles.buttonDisabled : styles.button}
      >
        {submitting ? "Saving…" : isEdit ? "Save changes" : "Save entry"}
      </button>
    </form>
  );
}

const styles = {
  form: { display: "grid", gap: 18, marginTop: 32 },
  input: { boxSizing: "border-box", width: "100%", padding: "12px 14px", border: "1px solid #2E3644", borderRadius: 8, backgroundColor: "#1C222C", color: "#E8EDF2", fontSize: 16 },
  textarea: { boxSizing: "border-box", width: "100%", padding: "12px 14px", border: "1px solid #2E3644", borderRadius: 8, backgroundColor: "#1C222C", color: "#E8EDF2", fontSize: 16, fontFamily: "inherit", minHeight: 140, resize: "vertical" },
  select: { boxSizing: "border-box", width: "100%", padding: "12px 14px", border: "1px solid #2E3644", borderRadius: 8, backgroundColor: "#1C222C", color: "#E8EDF2", fontSize: 16 },
  fileInput: { color: "#97A1B3", fontSize: 14 },
  fileName: { margin: 0, color: "#97A1B3", fontSize: 13, lineHeight: 1.5 },
  preview: { width: 160, height: 120, objectFit: "cover", borderRadius: 6, border: "1px solid #2E3644" },
  submitError: { color: "#FF9E9E", margin: 0, lineHeight: 1.5 },
  button: { padding: "12px 16px", border: 0, borderRadius: 8, backgroundColor: "#2EE6A8", color: "#11223f", fontSize: 16, fontWeight: 700, cursor: "pointer" },
  buttonDisabled: { padding: "12px 16px", border: 0, borderRadius: 8, backgroundColor: "#5A6373", color: "#11223f", fontSize: 16, fontWeight: 700, cursor: "not-allowed" },
};