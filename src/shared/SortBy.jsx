export default function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  const selectClass =
    'text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white transition';

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2">
        <label
          className="text-sm text-gray-500 shrink-0"
          htmlFor="sortBySelect"
        >
          Sort by:
        </label>
        <select
          className={selectClass}
          id="sortBySelect"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="creationDate">Creation Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label
          className="text-sm text-gray-500 shrink-0"
          htmlFor="sortDirectionSelect"
        >
          Order:
        </label>
        <select
          className={selectClass}
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
