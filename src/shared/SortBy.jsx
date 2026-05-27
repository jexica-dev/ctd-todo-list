export default function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <div
      className="sort-by-container"
      style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}
    >
      <div className="sort-group">
        <label htmlFor="sortBySelect">Sort by: </label>
        <select
          id="sortBySelect"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="creationDate">Creation Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="sort-group">
        <label htmlFor="sortDirectionSelect">Order: </label>
        <select
          id="sortDirectionSelect"
          value={sortDirection}
          onChange={(e) => onSortDirectionChange(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}
