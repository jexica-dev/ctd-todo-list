import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../../utils/todoValidation.js';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  const isInvalid = !isValidTodoTitle(workingTitle);

  const handleUpdate = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!isEditing || isInvalid) return;

    onUpdateTodo({
      ...todo,
      title: workingTitle.trim(),
    });

    setIsEditing(false);
  };

  const handleEdit = (e) => {
    setWorkingTitle(e.target.value);
  };

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              labelText="Edit Todo"
              elementId={`edit${todo.id}`}
              value={workingTitle}
              onChange={handleEdit}
            />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleUpdate} disabled={isInvalid}>
              Update
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span
              onClick={() => setIsEditing(true)}
              style={{ cursor: 'pointer' }}
            >
              {todo.title}
            </span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
