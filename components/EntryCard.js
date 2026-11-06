import { displayContributor } from "../lib/displayContributor";
import Icon from "./Icon";

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
          <span style={styles.imageArrow}><Icon name="arrow-up-right" size={18} /></span>
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
            <span style={styles.metaIcon}><Icon name="user-round" size={15} /></span>
            <span style={styles.metaLabel}>Contributor</span>
            {highlightText(displayContributor(contributor), query)}
          </p>
          <p style={styles.meta}>
            <span style={styles.metaIcon}><Icon name="map-pin" size={15} /></span>
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
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 18,
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
    aspectRatio: "1.65 / 1",
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
    padding: 14,
    background: "linear-gradient(180deg, transparent 45%, rgba(8, 28, 20, 0.68) 100%)",
  },
  imageTag: {
    padding: "6px 10px",
    borderRadius: 999,
    backgroundColor: "rgba(8, 28, 20, 0.82)",
    color: "var(--text)",
    fontSize: 11,
    fontWeight: 600,
    border: "1px solid rgba(244, 239, 223, 0.2)",
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
    padding: "19px 20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 11,
  },
  heading: {
    display: "grid",
    gap: 6,
  },
  category: {
    margin: 0,
    color: "var(--accent)",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    color: "var(--text)",
    fontSize: 25,
    lineHeight: 1.12,
  },
  titleKhmer: {
    margin: 0,
    color: "var(--leaf)",
    fontSize: 17,
    lineHeight: 1.35,
  },
  description: {
    margin: 0,
    color: "var(--muted)",
    fontSize: 14,
    lineHeight: 1.6,
    overflowWrap: "break-word",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  metaRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
    marginTop: 2,
    paddingTop: 14,
    borderTop: "1px solid var(--border)",
  },
  meta: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: 6,
    margin: 0,
    color: "var(--muted)",
    fontSize: 12,
    lineHeight: 1.4,
    alignItems: "center",
    overflowWrap: "anywhere",
  },
  metaIcon: {
    gridRow: "1 / span 2",
    color: "var(--leaf)",
    fontSize: 16,
  },
  metaLabel: {
    display: "block",
    color: "var(--muted)",
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
