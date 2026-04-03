function StatsCard({ title, value, note }) {
  return (
    <article className="stat-card">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
      <p className="stat-note">{note}</p>
    </article>
  );
}

export default StatsCard;
