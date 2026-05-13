import { useState } from 'react';

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
        <label htmlFor="todoTitle">Todo</label>
        <input
          type="text"
          id="todoTitle"
          name="todoTitle"
          placeholder="Todo text"
          value={workingTodoTitle}
          onChange={(e) => setWorkingTodoTitle(e.target.value)}
          required
        />
        <button type="submit" disabled={!workingTodoTitle.trim()}>
          Add Todo
        </button>
      </form>
    </>
  );
}

export default TodoForm;
