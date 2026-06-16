import { useState, useRef } from 'react';
import DOMPurify from 'dompurify';

const MAX_TITLE_LENGTH = 200;

function isValidTodoTitle(title) {
  const trimmed = title.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_TITLE_LENGTH;
}

function TodoListItem({
  todo,
  index,
  onCompleteTodo,
  onUpdateTodo,
  onDragStart,
  onDrop,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);
  const [isDragOver, setIsDragOver] = useState(false);
  const itemRef = useRef(null);

  const isInvalid = !isValidTodoTitle(workingTitle);

  const handleUpdate = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isEditing || isInvalid) return;

    const cleanTitle = DOMPurify.sanitize(workingTitle.trim(), {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    if (!cleanTitle) return;

    onUpdateTodo({ ...todo, title: cleanTitle });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  // Drag handlers
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(index);
    // Slight delay so the ghost image renders before we dim
    setTimeout(() => {
      if (itemRef.current) itemRef.current.classList.add('opacity-40');
    }, 0);
  };

  const handleDragEnd = () => {
    if (itemRef.current) itemRef.current.classList.remove('opacity-40');
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(index);
  };

  return (
    <li
      ref={itemRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group bg-white rounded-xl border transition-all duration-150 ${
        isDragOver
          ? 'border-brand-400 shadow-sm -translate-y-0.5'
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {isEditing ? (
        <form
          onSubmit={handleUpdate}
          className="flex items-center gap-2 px-4 py-3"
        >
          <input
            type="text"
            value={workingTitle}
            onChange={(e) => setWorkingTitle(e.target.value)}
            autoFocus
            maxLength={MAX_TITLE_LENGTH}
            aria-label="Edit task title"
            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-gray-400 hover:text-gray-600 px-2 py-1 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isInvalid}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium px-2 py-1 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Drag handle */}
          <span
            className="text-gray-300 cursor-grab active:cursor-grabbing select-none opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            aria-hidden="true"
          >
            ⠿
          </span>

          {/* Checkbox */}
          <input
            type="checkbox"
            id={`checkbox-${todo.id}`}
            checked={todo.isCompleted}
            onChange={() => onCompleteTodo(todo.id)}
            className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 focus:ring-offset-0 cursor-pointer accent-brand-500 shrink-0"
          />

          {/* Title */}
          <label
            htmlFor={`checkbox-${todo.id}`}
            onClick={(e) => {
              // Allow clicking the label to check, but double-click to edit
              e.preventDefault();
            }}
            onDoubleClick={() => {
              setWorkingTitle(todo.title);
              setIsEditing(true);
            }}
            className={`flex-1 text-sm cursor-pointer select-none ${
              todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {todo.title}
          </label>

          {/* Edit button (visible on hover) */}
          <button
            onClick={() => {
              setWorkingTitle(todo.title);
              setIsEditing(true);
            }}
            aria-label={`Edit "${todo.title}"`}
            className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1"
          >
            ✎
          </button>
        </div>
      )}
    </li>
  );
}

export default TodoListItem;
