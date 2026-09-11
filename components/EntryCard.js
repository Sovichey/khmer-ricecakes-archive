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
  description,
  contributor,
  place,
  image,
  query = "",
}) {
  return (
    <article style={styles.card}>
      <img src={image} alt={`${title} rice cake`} style={styles.image} />
      <h3 style={styles.title}>{highlightText(title, query)}</h3>
      <p style={styles.description}>{highlightText(description, query)}</p>
      <footer style={styles.metaRow}>
        <p style={styles.meta}>
          <span style={styles.metaLabel}>Contributor</span>{" "}
          {highlightText(contributor, query)}
        </p>
        <p style={styles.meta}>
          <span style={styles.metaLabel}>Place</span> {highlightText(place, query)}
        </p>
      </footer>
    </article>
  );
}
const styles = {
  card: {
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 8,
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  image: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderRadius: 6,
    backgroundColor: "#2E3644",
  },
  title: {
    margin: 0,
    color: "#E8EDF2",
    fontSize: 21,
    lineHeight: 1.35,
  },
  description: {
    margin: 0,
    color: "#97A1B3",
    fontSize: 15,
    lineHeight: 1.65,
    overflowWrap: "break-word",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 28,
    marginTop: "auto",
    paddingTop: 12,
    borderTop: "1px solid #2E3644",
  },
  meta: {
    margin: 0,
    color: "#E8EDF2",
    fontSize: 14,
  },
  metaLabel: {
    color: "#97A1B3",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
  },
  highlight: {
    backgroundColor: "#2EE6A8",
    color: "#11223f",
    borderRadius: 2,
    padding: "0 2px",
  },
};
