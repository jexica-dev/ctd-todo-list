import { useEffect, useCallback, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import StatusFilter from '../shared/StatusFilter';
import TodoForm from '../features/Todos/TodoForm';
import TodoList from '../features/Todos/TodoList/TodoList';
import FilterInput from '../shared/FilterInput';
import useDebounce from '../utils/useDebounce';
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer';
import { useAuth } from '../contexts/AuthContext';
import SortBy from '../shared/SortBy';

function TodosPage() {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get('status') || 'all';

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const handleFilterChange = (newTerm) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: newTerm });
  };

  const invalidateCache = useCallback(() => {
    console.log('Invalidating memo cache after todo mutation');
    dispatch({ type: TODO_ACTIONS.INCREMENT_VERSION });
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: TODO_ACTIONS.FETCH_START });

      try {
        const params = new URLSearchParams({
          sortBy: sortBy,
          sortDirection: sortDirection,
          ...(debouncedFilterTerm && { find: debouncedFilterTerm }),
        });

        console.log('SENDING REQUEST TO:', `/api/tasks?${params.toString()}`);

        const response = await fetch(`/api/tasks?${params}`, {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: data.tasks || [],
        });
      } catch (err) {
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: err.message,
            isFilterError:
              debouncedFilterTerm ||
              sortBy !== 'creationDate' ||
              sortDirection !== 'desc',
          },
        });
      }
    };

    if (token) fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  const addTodo = async (title) => {
    const tempId = Date.now().toString();
    const tempTodo = {
      id: tempId,
      title: title,
      isCompleted: false,
    };

    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: tempTodo });

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({
          title: tempTodo.title,
          isCompleted: tempTodo.isCompleted,
        }),
      });

      const savedTodo = await response.json();
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { tempId, savedTodo },
      });
      invalidateCache();
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { message: err.message, tempId },
      });
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id: id },
    });

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
          // Removed createdAt entirely to test backend strictness
        }),
      });

      if (!response.ok) {
        // Capture the server's specific reason for the 400 error
        const errorData = await response.json();
        console.error('Server Error Details:', errorData);
        throw new Error(errorData.message || 'Failed to update task');
      }

      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS, payload: id });
      invalidateCache();
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { id, originalTodo, message: err.message },
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    console.log('Updating Todo Payload:', editedTodo);

    // 1. Destructure only the fields the server allows
    const { title, isCompleted } = editedTodo;

    // 2. Build a strictly clean object
    const cleanPayload = { title, isCompleted };

    console.log('CLEAN PAYLOAD BEING SENT:', cleanPayload);

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;

    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: editedTodo });

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify(cleanPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // This will show us if it's 'title', 'isCompleted', or 'createdAt'
        console.error('SERVER REJECTED PAYLOAD FIELDS:', errorData);
        throw new Error(errorData.message || 'Failed to save edited title');
      }

      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS, payload: editedTodo });
      invalidateCache();
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: { id: editedTodo.id, originalTodo, message: err.message },
      });
    }
  };

  return (
    <div className="todos-page-container">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>
            Clear Error
          </button>
        </div>
      )}
      {filterError && (
        <div className="filter-error-banner">
          <p>{filterError}</p>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
            Clear Filter Error
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading tasks...</p>}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(s) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy: s, sortDirection: sortDirection },
          })
        }
        onSortDirectionChange={(dir) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy: state.sortBy, sortDirection: dir },
          })
        }
      />
      <StatusFilter />
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
        sortBy={sortBy}
        sortDirection={sortDirection}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;
