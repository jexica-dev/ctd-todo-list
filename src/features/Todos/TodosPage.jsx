import { useState, useEffect, useCallback } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';
import SortBy from '../../shared/SortBy';
import FilterInput from '../../shared/FilterInput';
import { useDebounce } from '../../utils/useDebounce';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  const [filterError, setFilterError] = useState('');

  const [sortBy, setSortBy] = useState('creationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const [dataVersion, setDataVersion] = useState(0);

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  const invalidateCache = useCallback(() => {
    console.log(
      '[invalidateCache]: Invalidating memo cache after todo mutation',
    );
    setDataVersion((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsTodoListLoading(true);
      setError('');

      try {
        const paramsObject = {
          sortBy,
          sortDirection,
        };

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
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

        setFilterError('');
      } catch (err) {
        if (
          debouncedFilterTerm ||
          sortBy !== 'creationDate' ||
          sortDirection !== 'desc'
        ) {
          setFilterError(`Error filtering/sorting todos: ${err.message}`);
        } else {
          setError(`Error fetching todos: ${err.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

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

      invalidateCache();
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

      invalidateCache();
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

      invalidateCache();
    } catch (err) {
      setError(err.message);
      setTodoList((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editedTodo.id ? originalTodo : todo,
        ),
      );
    }
  };

  const handleResetFilters = () => {
    setFilterTerm('');
    setSortBy('creationDate');
    setSortDirection('desc');
    setFilterError('');
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

      {filterError && (
        <div
          className="filter-error-banner"
          style={{
            border: '1px solid orange',
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#fff3cd',
          }}
        >
          <p style={{ color: '#856404', margin: '0 0 0.5rem 0' }}>
            <strong>Filter Error:</strong> {filterError}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={() => setFilterError('')}>
              Clear Filter Error
            </button>
            <button type="button" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {isTodoListLoading && (
        <p className="loading-indicator">Loading tasks...</p>
      )}

      <h2>My Dashboard</h2>

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        dataVersion={dataVersion}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;
