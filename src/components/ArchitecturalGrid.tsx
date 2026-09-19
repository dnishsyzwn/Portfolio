export default function ArchitecturalGrid() {
  return (
    <div className="swiss-grid-overlay" aria-hidden="true">
      <div className="swiss-grid-col" />
      <div className="swiss-grid-col hidden sm:block" />
      <div className="swiss-grid-col hidden sm:block" />
      <div className="swiss-grid-col" />
    </div>
  );
}
