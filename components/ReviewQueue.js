"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard";

// Holds the pending queue in client state so a successful review can drop its
// entry from the list without a page reload. An entry left in place (failed
// action) stays where it is — only a confirmed success is filtered out.
export default function ReviewQueue({ entries }) {
  const [queue, setQueue] = useState(entries);

  function handleReviewed(entryId) {
    setQueue((current) => current.filter((entry) => entry.id !== entryId));
  }

  if (queue.length === 0) {
    return (
      <p style={styles.empty}>
        គ្មានការដាក់ស្នើដែលកំពុងរង់ចាំទេ / No pending entries in the queue.
      </p>
    );
  }

  return (
    <section aria-label="Pending entries" style={styles.list}>
      {queue.map((entry) => (
        <ReviewCard key={entry.id} entry={entry} onReviewed={handleReviewed} />
      ))}
    </section>
  );
}

const styles = {
  list: { display: "grid", gap: 22, marginTop: 28 },
  empty: { margin: "28px 0 0", color: "var(--muted)", lineHeight: 1.6 },
};