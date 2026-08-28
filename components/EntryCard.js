export default function EntryCard({ title, description, contributor, place }) {
  return (
    <article style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.description}>{description}</p>
      <footer style={styles.metaRow}>
        <p style={styles.meta}>
          <span style={styles.metaLabel}>Contributor</span> {contributor}
        </p>
        <p style={styles.meta}>
          <span style={styles.metaLabel}>Place</span> {place}
        </p>
      </footer>
    </article>
  );
}
const styles = {
  card: {
    backgroundColor: "#FFF9EE",
    border: "1px solid #DFD2BC",
    borderRadius: 8,
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  title: {
    margin: 0,
    color: "#111827",
    fontSize: 21,
    lineHeight: 1.35,
  },
  description: {
    margin: 0,
    color: "#5D5448",
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
    borderTop: "1px solid #ECE3D2",
  },
  meta: {
    margin: 0,
    color: "#374151",
    fontSize: 14,
  },
  metaLabel: {
    color: "#374151",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
  },
};
