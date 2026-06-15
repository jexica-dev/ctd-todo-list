import { useState } from 'react';
import DOMPurify from 'dompurify';

const MAX_TITLE_LENGTH = 200;

// Validate before sanitizing
function isValidTodoTitle(title) {
  const trimmed = title.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_TITLE_LENGTH;
}

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();

    const trimmed = workingTodoTitle.trim();
    if (!isValidTodoTitle(trimmed)) return;

    // Sanitize after validation
    const cleanTitle = DOMPurify.sanitize(trimmed, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });

    if (!cleanTitle) return;

    onAddTodo(cleanTitle);
    setWorkingTodoTitle('');
  };

  const isDisabled = !isValidTodoTitle(workingTodoTitle);

  return (
    <form
      onSubmit={handleAddTodo}
      className="flex gap-2 bg-white rounded-xl border border-gray-100 p-3"
    >
      <input
        type="text"
        id="todoTitle"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
        placeholder="Add a new task…"
        maxLength={MAX_TITLE_LENGTH}
        aria-label="New task title"
        className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
      />
      <button
        type="submit"
        disabled={isDisabled}
        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Add
      </button>
    </form>
  );
}

export default TodoForm;
