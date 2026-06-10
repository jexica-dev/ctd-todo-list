import TodoListItem from './TodoListItem';
import { useMemo } from 'react';

function TodoList({
  todoList,
  dataVersion,
  onCompleteTodo,
  onUpdateTodo,
  sortBy,
  sortDirection,
}) {
  const filteredTodoList = useMemo(() => {
    console.log(`Recalculating filtered todos (v${dataVersion})`);

    const incompleteTodos = todoList.filter((todo) => !todo.isCompleted);

    return {
      version: dataVersion,
      todos: incompleteTodos,
    };
  }, [todoList, dataVersion, sortBy, sortDirection]);

  return (
    <>
      {filteredTodoList.todos.length === 0 ? (
        <p className="empty-state-notice">Add todo above to get started</p>
      ) : (
        <ul>
          {filteredTodoList.todos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;
