import { useState, useEffect } from 'react';
import TodoForm from '../features/TodoForm';
import TodoList from './TodoList';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);

  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsTodoListLoading(true);
      setError('');

      try {
        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });
        if (response.status === 401) {
          throw new Error('unauthorized');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch tasks from server');
        }
        const data = await response.json();
        setTodoList(data.tasks || []);
      } catch (err) {
        setError(err.message || 'An error has occurred while fetching tasks.');
      } finally {
        setIsTodoListLoading(false);
      }
    };
    if (token) {
      fetchTodos();
    }
  }, [token]);

  const addTodo = async (title) => {
    const tempId = Date.now().toString();
    const tempTodo = {
      id: tempId,
      title: title,
      isCompleted: false,
    };

    setTodoList((prevTodos) => [...prevTodos, tempTodo]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: tempTodo.title,
          isCompleted: tempTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not save new task to the server.');
      }

      const exactServerTodo = await response.json();

      setTodoList((prevTodos) =>
        prevTodos.map((todo) => (todo.id === tempId ? exactServerTodo : todo)),
      );
    } catch (err) {
      setError(err.message);
      setTodoList((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== tempId),
      );
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    setTodoList((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          isCompleted: !originalTodo.isCompleted,
          createdAt: originalTodo.createdAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task completion on server.');
      }
    } catch (err) {
      setError(err.message);
      setTodoList((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? originalTodo : todo)),
      );
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;

    setTodoList((prevTodos) =>
      prevTodos.map((todo) => (todo.id === editedTodo.id ? editedTodo : todo)),
    );

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
          createdAt: editedTodo.createdAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save edited title to server.');
      }
    } catch (err) {
      setError(err.message);
      setTodoList((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editedTodo.id ? originalTodo : todo,
        ),
      );
    }
  };

  return (
    <div className="todos-page-container">
      {error && (
        <div
          className="error-banner"
          style={{ color: 'red', marginBottom: '1rem' }}
        >
          <p>
            <strong>Error:</strong> {error}
          </p>
          <button type="button" onClick={() => setError('')}>
            Clear Error
          </button>
        </div>
      )}

      {isTodoListLoading && (
        <p className="loading-indicator">Loading tasks...</p>
      )}

      <h2>My Dashboard</h2>

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;
