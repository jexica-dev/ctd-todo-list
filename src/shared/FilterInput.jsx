export default function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className="filter-input-container" style={{ marginBottom: '1.5rem' }}>
      <label htmlFor="filterInput" style={{ marginRight: '0.5rem' }}>
        Search todos:
      </label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search by title..."
        style={{ padding: '0.25rem 0.5rem', width: '100%', maxWidth: '300px' }}
      />
    </div>
  );
}
