import { CAMBODIA_PROVINCES } from "./provinces.js";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Maps a MIME type to the file extension used in the storage path.
export const EXTENSION_BY_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// English letters, numbers, spaces, and common punctuation (no brackets/angle).
const TITLE_LATIN_RE = /^[A-Za-z0-9 .,!?'"()\-:;@#&%$+=_/]+$/;

// Khmer script block, Khmer symbols, Khmer digits/punctuation, and whitespace.
const TITLE_KHMER_RE = /^[\u1780-\u17FF\u19E0-\u19FF\s]+$/;

// Trims every text field first, checks each rule, and returns the trimmed
// values so the caller saves exactly what was validated.
export function validateEntry(input, mode = "create") {
  const errors = {};

  const values = {
    title: (input.title ?? "").trim(),
    title_khmer: (input.title_khmer ?? "").trim(),
    description: (input.description ?? "").trim(),
    contributor: (input.contributor ?? "").trim(),
    place: (input.place ?? "").trim(),
    image: input.image ?? null,
  };

  // title: optional, 1-120 chars, English letters/numbers/punctuation.
  if (values.title.length > 0) {
    if (values.title.length > 120) {
      errors.title = `Keep it under 120 characters (${values.title.length}).`;
    } else if (!TITLE_LATIN_RE.test(values.title)) {
      errors.title = "Use English letters, numbers, and punctuation only.";
    }
  }

  // title_khmer: required, 1-120 chars, Khmer script only.
  if (!values.title_khmer) {
    errors.title_khmer = "Required.";
  } else if (values.title_khmer.length > 120) {
    errors.title_khmer = `Keep it under 120 characters (${values.title_khmer.length}).`;
  } else if (!TITLE_KHMER_RE.test(values.title_khmer)) {
    errors.title_khmer = "Use Khmer script, spaces, and Khmer numbers.";
  }

  // description: required, 10-1000 chars, any language/script.
  if (!values.description) {
    errors.description = "Required.";
  } else if (values.description.length < 10) {
    errors.description = "Write at least 10 characters.";
  } else if (values.description.length > 1000) {
    errors.description = `Keep it under 1000 characters (${values.description.length}).`;
  }

  // contributor: required, 2-50 chars after trimming (whitespace-only fails).
  if (!values.contributor) {
    errors.contributor = "Required.";
  } else if (values.contributor.length < 2) {
    errors.contributor = "At least 2 characters.";
  } else if (values.contributor.length > 50) {
    errors.contributor = `Keep it under 50 characters (${values.contributor.length}).`;
  }

  // place: optional, but must be one of the 25 provinces when chosen.
  if (values.place && !CAMBODIA_PROVINCES.includes(values.place)) {
    errors.place = "Choose a province from the list.";
  }

  // image: required on create, optional on edit. When a file is present it
  // must be exactly one allowed type at most 5 MB.
  const requireImage = mode !== "edit";
  if (requireImage && !values.image) {
    errors.image = "Required.";
  } else if (values.image && !ALLOWED_IMAGE_TYPES.includes(values.image.type)) {
    errors.image = "Use a JPG, PNG, or WebP image.";
  } else if (values.image && values.image.size > MAX_IMAGE_BYTES) {
    errors.image = "Keep it under 5 MB.";
  }

  return { errors, values };
}