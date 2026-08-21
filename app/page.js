import collection from "../collection.config.js";

const angkorImage =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Angkor_Wat_sunrise.jpg";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F4EFE4",
    color: "#1D1B18",
  },
  hero: {
    minHeight: 620,
    display: "flex",
    alignItems: "flex-end",
    backgroundImage: `linear-gradient(180deg, rgba(20, 16, 12, 0.28) 0%, rgba(20, 16, 12, 0.58) 55%, rgba(244, 239, 228, 0.98) 100%), url(${angkorImage})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  heroInner: {
    width: "100%",
    maxWidth: 1120,
    margin: "0 auto",
    padding: "34px 24px 58px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
    marginBottom: 168,
    color: "#FFF9EE",
  },
  brand: {
    margin: 0,
    fontSize: 15,
    fontWeight: 800,
  },
  nav: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  navLink: {
    color: "#FFF9EE",
    textDecoration: "none",
    padding: "9px 11px",
    border: "1px solid rgba(255, 249, 238, 0.3)",
    borderRadius: 8,
    backgroundColor: "rgba(29, 27, 24, 0.22)",
    fontSize: 14,
    fontWeight: 700,
  },
  eyebrow: {
    margin: "0 0 14px",
    color: "#F5C45B",
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  title: {
    maxWidth: 760,
    margin: 0,
    color: "#FFF9EE",
    fontSize: 60,
    lineHeight: 1,
    letterSpacing: 0,
    overflowWrap: "break-word",
  },
  description: {
    maxWidth: 700,
    margin: "22px 0 0",
    color: "#FFF1D7",
    fontSize: 20,
    lineHeight: 1.6,
  },
  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 28,
  },
  primaryAction: {
    padding: "13px 16px",
    backgroundColor: "#C4492D",
    color: "#FFF9EE",
    borderRadius: 8,
    fontWeight: 800,
    textDecoration: "none",
  },
  secondaryAction: {
    padding: "13px 16px",
    backgroundColor: "rgba(255, 249, 238, 0.16)",
    color: "#FFF9EE",
    border: "1px solid rgba(255, 249, 238, 0.4)",
    borderRadius: 8,
    fontWeight: 800,
    textDecoration: "none",
  },
  content: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "28px 24px 52px",
  },
  band: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    marginTop: -32,
  },
  stat: {
    padding: 22,
    backgroundColor: "#FFF9EE",
    border: "1px solid #DFD2BC",
    borderRadius: 8,
    boxShadow: "0 16px 34px rgba(73, 56, 38, 0.14)",
  },
  label: {
    margin: 0,
    color: "#7B4B2A",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  value: {
    margin: "10px 0 0",
    color: "#1D1B18",
    fontSize: 19,
    lineHeight: 1.45,
    overflowWrap: "break-word",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 22,
    marginTop: 36,
  },
  panel: {
    backgroundColor: "#FFF9EE",
    border: "1px solid #DFD2BC",
    borderRadius: 8,
    padding: 28,
  },
  panelTitle: {
    margin: 0,
    fontSize: 32,
    lineHeight: 1.15,
    letterSpacing: 0,
  },
  panelText: {
    margin: "16px 0 0",
    color: "#5D5448",
    fontSize: 17,
    lineHeight: 1.7,
  },
  motifRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
    marginTop: 24,
  },
  motif: {
    minHeight: 126,
    padding: 18,
    borderRadius: 8,
    backgroundColor: "#ECE3D2",
    border: "1px solid #D8C6A9",
  },
  motifMark: {
    margin: 0,
    color: "#C4492D",
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1,
  },
  motifText: {
    margin: "16px 0 0",
    color: "#4A4036",
    fontWeight: 800,
    lineHeight: 1.35,
  },
  timeline: {
    display: "grid",
    gap: 12,
    marginTop: 18,
  },
  timelineItem: {
    display: "grid",
    gridTemplateColumns: "38px 1fr",
    gap: 12,
    alignItems: "start",
  },
  number: {
    width: 38,
    height: 38,
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    backgroundColor: "#1F6A5A",
    color: "#FFF9EE",
    fontWeight: 900,
  },
  timelineTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 900,
  },
  timelineText: {
    margin: "4px 0 0",
    color: "#6A5E50",
    lineHeight: 1.5,
  },
  credit: {
    margin: "20px 0 0",
    color: "#6A5E50",
    fontSize: 13,
    lineHeight: 1.5,
  },
  footer: {
    marginTop: 40,
    paddingTop: 22,
    borderTop: "1px solid #D8C6A9",
    color: "#6A5E50",
    fontSize: 13,
    lineHeight: 1.6,
  },
};

export default function Home() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <header style={styles.topBar}>
            <p style={styles.brand}>Khmer Living Archive</p>
            <nav style={styles.nav} aria-label="Archive sections">
              <a href="#archive-details" style={styles.navLink}>
                Details
              </a>
              <a href="#culture-focus" style={styles.navLink}>
                Culture
              </a>
              <a href="#status" style={styles.navLink}>
                Progress
              </a>
            </nav>
          </header>

          <p style={styles.eyebrow}>អង្គរ Wat inspired archive</p>
          <h1 style={styles.title}>{collection.name}</h1>
          <p style={styles.description}>{collection.description}</p>

          <div style={styles.actions}>
            <a href="#archive-details" style={styles.primaryAction}>
              View archive details
            </a>
            <a href="#culture-focus" style={styles.secondaryAction}>
              Explore the theme
            </a>
          </div>
        </div>
      </section>

      <div style={styles.content}>
        <section id="archive-details" style={styles.band}>
          <div style={styles.stat}>
            <p style={styles.label}>Curated by</p>
            <p style={styles.value}>{collection.curator}</p>
          </div>
          <div style={styles.stat}>
            <p style={styles.label}>Knowledge source</p>
            <p style={styles.value}>{collection.source}</p>
          </div>
          <div style={styles.stat}>
            <p style={styles.label}>Archive home</p>
            <p style={styles.value}>{collection.province}</p>
          </div>
        </section>

        <section id="culture-focus" style={styles.featureGrid}>
          <article style={styles.panel}>
            <p style={styles.label}>Visual direction</p>
            <h2 style={styles.panelTitle}>
              A warm stone, temple, and lotus-inspired home for Khmer stories.
            </h2>
            <p style={styles.panelText}>
              The interface takes cues from Angkor Wat at sunrise: sandstone
              walls, temple silhouettes, quiet water, red earth, and ceremonial
              gold. It gives the archive a Khmer cultural identity while keeping
              the content easy to read.
            </p>

            <div style={styles.motifRow} aria-label="Khmer cultural motifs">
              <div style={styles.motif}>
                <p style={styles.motifMark}>អ</p>
                <p style={styles.motifText}>Khmer language is treated as core content.</p>
              </div>
              <div style={styles.motif}>
                <p style={styles.motifMark}>ប្រាសាទ</p>
                <p style={styles.motifText}>Temple forms guide the page structure.</p>
              </div>
              <div style={styles.motif}>
                <p style={styles.motifMark}>ពន្លឺ</p>
                <p style={styles.motifText}>Sunrise colors make the archive feel local.</p>
              </div>
            </div>
          </article>

          <aside id="status" style={styles.panel}>
            <p style={styles.label}>Sprint status</p>
            <h2 style={styles.panelTitle}>Archive progress</h2>
            <div style={styles.timeline}>
              <div style={styles.timelineItem}>
                <span style={styles.number}>1</span>
                <div>
                  <p style={styles.timelineTitle}>Identity page</p>
                  <p style={styles.timelineText}>
                    Collection name, curator, source, and province are shown.
                  </p>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.number}>2</span>
                <div>
                  <p style={styles.timelineTitle}>Entries</p>
                  <p style={styles.timelineText}>0 published entries for now.</p>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.number}>3</span>
                <div>
                  <p style={styles.timelineTitle}>Future sprints</p>
                  <p style={styles.timelineText}>
                    Browse, search, accounts, and review tools come later.
                  </p>
                </div>
              </div>
            </div>
            <p style={styles.credit}>
              Hero photo: Angkor Wat sunrise by mendhak, via Wikimedia Commons,
              CC BY-SA 2.0.
            </p>
          </aside>
        </section>

        <footer style={styles.footer}>
          Built in ICT 340, American University of Phnom Penh. This archive is
          under construction all semester and will grow through researched
          Khmer cultural entries.
        </footer>
      </div>
    </main>
  );
}
