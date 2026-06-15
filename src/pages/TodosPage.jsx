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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
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
    const { title, isCompleted } = editedTodo;

    const cleanPayload = { title, isCompleted };

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

  const reorderTodos = useCallback((dragIndex, dropIndex) => {
    dispatch({
      type: TODO_ACTIONS.REORDER_TODOS,
      payload: { dragIndex, dropIndex },
    });
  }, []);

  return (
    <div className="animate-fade-in space-y-4 py-2">
      {error && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
            className="ml-4 text-red-500 hover:text-red-700 transition-colors"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {filterError && (
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
          <span>{filterError}</span>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
            className="ml-4 text-amber-500 hover:text-amber-700 transition-colors"
            aria-label="Dismiss filter error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Controls row */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <SortBy
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortByChange={(s) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: { sortBy: s, sortDirection },
            })
          }
          onSortDirectionChange={(dir) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: { sortBy: state.sortBy, sortDirection: dir },
            })
          }
        />
        <div className="flex flex-wrap gap-3 items-end">
          <StatusFilter />
          <FilterInput
            filterTerm={filterTerm}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Add todo form */}
      <TodoForm onAddTodo={addTodo} />

      {/* List */}
      {isTodoListLoading ? (
        <div className="flex items-center justify-center h-24">
          <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <TodoList
          todoList={todoList}
          dataVersion={dataVersion}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          onReorderTodos={reorderTodos}
          sortBy={sortBy}
          sortDirection={sortDirection}
          statusFilter={statusFilter}
        />
      )}
    </div>
  );
}

export default TodosPage;
