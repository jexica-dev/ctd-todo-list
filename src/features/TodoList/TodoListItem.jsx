import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };
  return (
    <li>
      <form onSubmit={handleEditSubmit}>
        {isEditing ? (
          <TextInputWithLabel
            labelText="Edit Todo"
            elementId={`edit${todo.id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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
