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
  const displayTitle = title || title_khmer || "Untitled rice cake";
  const displayPlace = place || "Place not recorded";

  return (
    <article className="card" style={styles.card}>
      <div style={styles.imageFrame}>
        <img src={image} alt={`${displayTitle} rice cake`} style={styles.image} />
        <div style={styles.imageOverlay}>
          <span style={styles.imageTag}>Archive entry</span>
          <span style={styles.imageArrow} aria-hidden="true">↗</span>
        </div>
      </div>
      <div style={styles.content}>
        <div style={styles.heading}>
          <p style={styles.category}>RICE CAKE STORY</p>
          <h3 style={styles.title}>{highlightText(displayTitle, query)}</h3>
        </div>
        {title_khmer && (
          <p style={styles.titleKhmer}>{highlightText(title_khmer, query)}</p>
        )}
        <p style={styles.description}>{highlightText(description, query)}</p>
        <footer style={styles.metaRow}>
          <p style={styles.meta}>
            <span style={styles.metaIcon} aria-hidden="true">✦</span>
            <span style={styles.metaLabel}>Contributor</span>
            {highlightText(displayContributor(contributor), query)}
          </p>
          <p style={styles.meta}>
            <span style={styles.metaIcon} aria-hidden="true">⌖</span>
            <span style={styles.metaLabel}>From</span>
            {highlightText(displayPlace, query)}
          </p>
        </footer>
      </div>
    </article>
  );
}
const styles = {
  card: {
    background: "linear-gradient(145deg, rgba(36, 30, 25, 0.98), rgba(27, 22, 18, 0.96))",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  imageFrame: {
    position: "relative",
    backgroundColor: "var(--muted-bg)",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 292,
    objectFit: "cover",
    backgroundColor: "var(--muted-bg)",
    display: "block",
    transition: "transform 0.35s ease, filter 0.35s ease",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 16,
    background: "linear-gradient(180deg, transparent 48%, rgba(23, 20, 18, 0.72) 100%)",
  },
  imageTag: {
    padding: "6px 9px",
    borderRadius: 999,
    backgroundColor: "rgba(21, 26, 24, 0.82)",
    color: "var(--text)",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    border: "1px solid rgba(245, 234, 215, 0.25)",
  },
  imageArrow: {
    display: "grid",
    placeItems: "center",
    width: 34,
    height: 34,
    borderRadius: "50%",
    backgroundColor: "var(--accent)",
    color: "var(--accent-ink)",
    fontSize: 20,
    fontWeight: 700,
  },
  content: {
    padding: "22px 22px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  heading: {
    display: "grid",
    gap: 7,
  },
  category: {
    margin: 0,
    color: "var(--accent)",
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.2,
  },
  title: {
    margin: 0,
    color: "var(--text)",
    fontSize: 27,
    lineHeight: 1.12,
  },
  titleKhmer: {
    margin: 0,
    color: "var(--leaf)",
    fontSize: 18,
    lineHeight: 1.35,
  },
  description: {
    margin: 0,
    color: "var(--muted)",
    fontSize: 14,
    lineHeight: 1.65,
    overflowWrap: "break-word",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 9,
    marginTop: "auto",
    paddingTop: 17,
    borderTop: "1px solid var(--border)",
    gap: 9,
  },
  meta: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: 7,
    margin: 0,
    color: "var(--muted)",
    fontSize: 14,
    lineHeight: 1.45,
    flex: "1 1 150px",
    alignItems: "center",
  },
  metaIcon: {
    gridRow: "1 / span 2",
    color: "var(--leaf)",
    fontSize: 16,
  },
  metaLabel: {
    display: "block",
    color: "var(--muted)",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 1,
    lineHeight: 1.1,
  },
  highlight: {
    backgroundColor: "var(--accent)",
    color: "var(--accent-ink)",
    borderRadius: 2,
    padding: "0 2px",
  },
};
