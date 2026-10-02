export default function FormField({ label, htmlFor, error, children }) {
  return (
    <div style={styles.field}>
      <label htmlFor={htmlFor} style={styles.label}>
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" style={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

const styles = {
  field: { display: "grid", gap: 6 },
  label: { color: "#97A1B3", fontSize: 14, fontWeight: 700 },
  error: { color: "#FF9E9E", fontSize: 13, margin: 0 },
};