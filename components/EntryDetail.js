"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { deleteEntry } from "../lib/deleteEntry";

// Renders nothing unless the logged-in user owns the entry (isOwner is
// computed in the server page). Delete asks for confirmation first, then
// deletes through supabase-js and checks a row actually came back.
export default function EntryDetail({ entryId, isOwner }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [deleting, setDeleting] = useState(false);

  if (!isOwner) {
    return null;
  }

  async function handleDelete() {
    if (deleting) return;
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;

    setDeleting(true);
    setStatus("Deleting…");
    const result = await deleteEntry(getSupabaseBrowserClient(), entryId);
    if (!result.ok) {
      setStatus(result.message);
      setDeleting(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div style={styles.bar}>
      <Link href={`/entries/${entryId}/edit`} style={styles.edit}>
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        style={deleting ? styles.deleteDisabled : styles.delete}
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
      {status && (
        <p role="status" style={styles.status}>
          {status}
        </p>
      )}
    </div>
  );
}

const styles = {
  bar: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid #2E3644" },
  edit: { padding: "10px 14px", borderRadius: 8, backgroundColor: "#2EE6A8", color: "#11223f", fontSize: 15, fontWeight: 700, textDecoration: "none" },
  delete: { padding: "10px 14px", border: "1px solid #FF9E9E", borderRadius: 8, backgroundColor: "transparent", color: "#FF9E9E", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  deleteDisabled: { padding: "10px 14px", border: "1px solid #5A6373", borderRadius: 8, backgroundColor: "transparent", color: "#5A6373", fontSize: 15, fontWeight: 700, cursor: "not-allowed" },
  status: { color: "#97A1B3", fontSize: 14, margin: 0 },
};