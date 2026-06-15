import { useMemo, useRef } from 'react';
import TodoListItem from './TodoListItem';

function TodoList({
  todoList,
  dataVersion,
  onCompleteTodo,
  onUpdateTodo,
  onReorderTodos,
  sortBy,
  sortDirection,
  statusFilter = 'active',
}) {
  const dragIndexRef = useRef(null);

  const filteredTodoList = useMemo(() => {
    let filteredTodos;
    switch (statusFilter) {
      case 'completed':
        filteredTodos = todoList.filter((todo) => todo.isCompleted);
        break;
      case 'active':
        filteredTodos = todoList.filter((todo) => !todo.isCompleted);
        break;
      case 'all':
      default:
        filteredTodos = todoList;
    }
    return { version: dataVersion, todos: filteredTodos };
  }, [todoList, dataVersion, sortBy, sortDirection, statusFilter]);

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'completed':
        return 'No completed tasks yet.';
      case 'active':
        return 'No active tasks. Add one above!';
      default:
        return 'No tasks yet. Add one above to get started.';
    }
  };

  // Map filtered index back to todoList index for reordering
  const getOriginalIndex = (filteredIndex) => {
    const filteredTodo = filteredTodoList.todos[filteredIndex];
    return todoList.findIndex((t) => t.id === filteredTodo.id);
  };

  const handleDragStart = (filteredIndex) => {
    dragIndexRef.current = filteredIndex;
  };

  const handleDrop = (dropFilteredIndex) => {
    const dragFiltered = dragIndexRef.current;
    if (dragFiltered === null || dragFiltered === dropFilteredIndex) return;

    const fromOriginal = getOriginalIndex(dragFiltered);
    const toOriginal = getOriginalIndex(dropFilteredIndex);
    onReorderTodos(fromOriginal, toOriginal);
    dragIndexRef.current = null;
  };

  if (filteredTodoList.todos.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-12">
        {getEmptyMessage()}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {filteredTodoList.todos.map((todo, filteredIndex) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          index={filteredIndex}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}
    </ul>
  );
}

export default TodoList;
