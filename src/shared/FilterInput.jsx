export default function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-[180px]">
      <label
        className="text-sm text-gray-500 whitespace-nowrap shrink-0"
        htmlFor="filterInput"
      >
        Search todos:
      </label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search by title..."
        className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
      />
    </div>
  );
}
