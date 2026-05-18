import { useState } from 'react';
import TodoForm from '../features/TodoForm';
import TodoList from './TodoList';

function TodosPage() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList((prevTodoList) => [newTodo, ...prevTodoList]);
  }

  function completeTodo(id) {
    const updatedList = todoList.map((item) => {
      if (item.id === id) {
        return { ...item, isCompleted: true };
      }
      return item;
    });

    setTodoList(updatedList);
  }

  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return editedTodo;
      }
      return todo;
    });

    setTodoList(updatedTodos);
  };

  return (
    <>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </>
  );
}

export default TodosPage;
