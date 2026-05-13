import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();

    // .trim prevents whitespace only todos
    const trimmedTitle = workingTodoTitle.trim();
    if (trimmedTitle) {
      onAddTodo(trimmedTitle);

      setWorkingTodoTitle('');
    }
  };

  return (
    <>
      <form onSubmit={handleAddTodo}>
        <TextInputWithLabel
          elementId="todoTitle"
          labelText="Todo"
          value={workingTodoTitle}
          onChange={(e) => setWorkingTodoTitle(e.target.value)}
        />

        <button type="submit" disabled={!workingTodoTitle.trim()}>
          Add Todo
        </button>
      </form>
    </>
  );
}

export default TodoForm;
