import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  const handleEdit = (e) => {
    setWorkingTitle(e.target.value);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onUpdateTodo(todo.id, workingTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <li>
      <form onSubmit={handleEditSubmit}>
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
