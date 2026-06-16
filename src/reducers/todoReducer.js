export const TODO_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',
  COMPLETE_TODO_START: 'COMPLETE_TODO_START',
  COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
  COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',
  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',
  REORDER_TODOS: 'REORDER_TODOS',
  SET_SORT: 'SET_SORT',
  SET_FILTER: 'SET_FILTER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',
  RESET_FILTERS: 'RESET_FILTERS',
  INCREMENT_VERSION: 'INCREMENT_VERSION',
};

export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: true,
  sortBy: 'creationDate',
  sortDirection: 'desc',
  filterTerm: '',
  dataVersion: 0,
};

export function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.FETCH_START:
      return { ...state, isTodoListLoading: true, error: '', filterError: '' };
    case TODO_ACTIONS.FETCH_SUCCESS:
      return { ...state, isTodoListLoading: false, todoList: action.payload };
    case TODO_ACTIONS.FETCH_ERROR:
      return action.payload.isFilterError
        ? {
            ...state,
            isTodoListLoading: false,
            filterError: action.payload.message,
          }
        : { ...state, isTodoListLoading: false, error: action.payload.message };

    case TODO_ACTIONS.ADD_TODO_START:
      return { ...state, todoList: [...state.todoList, action.payload] };
    case TODO_ACTIONS.ADD_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.tempId ? action.payload.savedTodo : t,
        ),
      };
    case TODO_ACTIONS.ADD_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        todoList: state.todoList.filter((t) => t.id !== action.payload.tempId),
      };

    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        error: '',
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, isCompleted: !todo.isCompleted }
            : todo,
        ),
      };
    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.originalTodo : t,
        ),
      };
    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      return { ...state };

    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return { ...state, error: '' };
    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.originalTodo : t,
        ),
      };

    case TODO_ACTIONS.REORDER_TODOS: {
      const { dragIndex, dropIndex } = action.payload;
      const newList = [...state.todoList];
      const [moved] = newList.splice(dragIndex, 1);
      newList.splice(dropIndex, 0, moved);
      return { ...state, todoList: newList };
    }

    case TODO_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection,
      };
    case TODO_ACTIONS.SET_FILTER:
      return { ...state, filterTerm: action.payload };
    case TODO_ACTIONS.CLEAR_ERROR:
      return { ...state, error: '' };
    case TODO_ACTIONS.CLEAR_FILTER_ERROR:
      return { ...state, filterError: '' };
    case TODO_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filterTerm: '',
        sortBy: 'creationDate',
        sortDirection: 'desc',
        filterError: '',
      };
    case TODO_ACTIONS.INCREMENT_VERSION:
      return { ...state, dataVersion: state.dataVersion + 1 };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
