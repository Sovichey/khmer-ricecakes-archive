import { displayContributor } from "../lib/displayContributor";

function highlightText(text, query) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return text;
  }

  const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));

  return parts.map((part, index) =>
    part.toLocaleLowerCase() === normalizedQuery.toLocaleLowerCase() ? (
      <mark key={`${part}-${index}`} style={styles.highlight}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default function EntryCard({
  title,
  title_khmer,
  description,
  contributor,
  place,
  image,
  query = "",
}) {
  return (
    <article className="card" style={styles.card}>
      <div style={styles.imageFrame}>
        <img src={image} alt={`${title} rice cake`} style={styles.image} />
        <span style={styles.imageTag}>Archive entry</span>
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{highlightText(title, query)}</h3>
        {title_khmer && (
          <p style={styles.titleKhmer}>{highlightText(title_khmer, query)}</p>
        )}
        <p style={styles.description}>{highlightText(description, query)}</p>
        <footer style={styles.metaRow}>
          <p style={styles.meta}>
            <span style={styles.metaLabel}>Contributor</span>
            {highlightText(displayContributor(contributor), query)}
          </p>
          <p style={styles.meta}>
            <span style={styles.metaLabel}>Place</span>
            {highlightText(place, query)}
          </p>
        </footer>
      </div>
    </article>
  );
}
const styles = {
  card: {
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  imageFrame: {
    position: "relative",
    backgroundColor: "var(--muted-bg)",
  },
  image: {
    width: "100%",
    height: 270,
    objectFit: "cover",
    backgroundColor: "var(--muted-bg)",
    display: "block",
  },
  imageTag: {
    position: "absolute",
    left: 14,
    bottom: 14,
    padding: "6px 9px",
    borderRadius: 999,
    backgroundColor: "rgba(21, 26, 24, 0.82)",
    color: "var(--accent)",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  content: {
    padding: "20px 20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  title: {
    margin: 0,
    color: "var(--text)",
    fontSize: 25,
    lineHeight: 1.2,
  },
  titleKhmer: {
    margin: 0,
    color: "var(--accent)",
    fontSize: 17,
    lineHeight: 1.35,
  },
  description: {
    margin: 0,
    color: "var(--muted)",
    fontSize: 15,
    lineHeight: 1.65,
    overflowWrap: "break-word",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 28,
    marginTop: "auto",
    paddingTop: 16,
    borderTop: "1px solid var(--border)",
    gap: 10,
  },
  meta: {
    margin: 0,
    color: "var(--muted)",
    fontSize: 14,
    lineHeight: 1.45,
    flex: "1 1 180px",
  },
  metaLabel: {
    display: "block",
    color: "var(--muted)",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  highlight: {
    backgroundColor: "var(--muted-bg)",
    color: "var(--text)",
    borderRadius: 2,
    padding: "0 2px",
  },
};
