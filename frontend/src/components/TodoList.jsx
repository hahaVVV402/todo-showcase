import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggle, onDelete, onUpdate }) => {
  if (!todos || todos.length === 0) {
    return <div className="empty-state">暂无任务</div>;
  }

  // sort todos by completion
  const sortedTodos = [...todos].sort((a,b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1);

  return (
    <ul className="todo-list">
      {sortedTodos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onToggle={onToggle} 
          onDelete={onDelete} 
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
};

export default TodoList;
