import { useState, useEffect } from 'react';
import { getSubTasks, addSubTask, updateSubTask } from '../api/todoApi';

const PriorityColors = {
  HIGH: 'var(--high-priority)',
  MEDIUM: 'var(--medium-priority)',
  LOW: 'var(--low-priority)',
  NONE: 'transparent'
};

const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [noteContent, setNoteContent] = useState(todo.note || '');

  useEffect(() => {
    if (expanded && todo.id && subtasks.length === 0) {
      getSubTasks(todo.id).then(setSubtasks).catch(console.error);
    }
  }, [expanded, todo.id]);

  const completedSubtasks = subtasks.filter(st => st.completed).length;

  const handleToggleSubtask = async (st) => {
    const updated = { ...st, completed: !st.completed };
    setSubtasks(subtasks.map(s => s.id === st.id ? updated : s));
    await updateSubTask(todo.id, st.id, { completed: !st.completed });
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    const added = await addSubTask(todo.id, newSubtask.trim(), subtasks.length);
    setSubtasks([...subtasks, added]);
    setNewSubtask('');
  };

  const handleNoteBlur = async () => {
    if (noteContent !== (todo.note || '')) {
      await onUpdate(todo.id, { note: noteContent });
    }
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <li className={`todo-wrapper ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-main" onClick={(e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
          setExpanded(!expanded);
        }
      }}>
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
        
        {todo.priority !== 'NONE' && (
          <span className="priority-dot" style={{ backgroundColor: PriorityColors[todo.priority], flexShrink: 0 }}></span>
        )}

        <div className="todo-content">
          <span className="todo-text">{todo.text}</span>
          <div className="todo-badges">
            {todo.dueDate && <span className={`badge ${isOverdue && !todo.completed ? 'overdue' : ''}`}>📅 {todo.dueDate}</span>}
            {todo.myDay && <span className="badge" style={{color: '#fbbf24'}}>☀️ 我的一天</span>}
            {subtasks.length > 0 && <span className="badge">☑️ {completedSubtasks}/{subtasks.length}</span>}
            {todo.note && <span className="badge">📝 备注</span>}
          </div>
        </div>

        <div className="todo-actions">
          <button className={`icon-btn ${todo.myDay ? 'active' : ''}`} onClick={() => onUpdate(todo.id, { myDay: !todo.myDay })} title="Toggle My Day">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          </button>
          <button className="icon-btn danger" onClick={() => onDelete(todo.id)} title="Delete Task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="todo-details">
          <div className="due-date-container" style={{ marginBottom: '16px', display: 'flex', gap: '32px' }}>
            <div>
              <h4>截止日期</h4>
              <input 
                type="date" 
                className="note-textarea"
                style={{ width: 'auto', minHeight: 'auto', padding: '6px 12px' }}
                value={todo.dueDate || ''}
                onChange={(e) => onUpdate(todo.id, { dueDate: e.target.value || null })}
              />
            </div>
            <div>
              <h4>优先级</h4>
              <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                <button className={`picker-btn ${todo.priority === 'HIGH' ? 'picker-active' : ''}`} onClick={() => onUpdate(todo.id, { priority: todo.priority === 'HIGH' ? 'NONE' : 'HIGH' })}>
                  <span className="priority-dot" style={{ backgroundColor: 'var(--high-priority)' }}></span> 高
                </button>
                <button className={`picker-btn ${todo.priority === 'MEDIUM' ? 'picker-active' : ''}`} onClick={() => onUpdate(todo.id, { priority: todo.priority === 'MEDIUM' ? 'NONE' : 'MEDIUM' })}>
                  <span className="priority-dot" style={{ backgroundColor: 'var(--medium-priority)' }}></span> 中
                </button>
                <button className={`picker-btn ${todo.priority === 'LOW' ? 'picker-active' : ''}`} onClick={() => onUpdate(todo.id, { priority: todo.priority === 'LOW' ? 'NONE' : 'LOW' })}>
                  <span className="priority-dot" style={{ backgroundColor: 'var(--low-priority)' }}></span> 低
                </button>
              </div>
            </div>
          </div>

          <div className="subtasks-container">
            <h4>子步骤</h4>
            {subtasks.map(st => (
              <div key={st.id} className="subtask-item">
                <input 
                  type="checkbox" 
                  className="subtask-checkbox" 
                  checked={st.completed} 
                  onChange={() => handleToggleSubtask(st)}
                />
                <span style={{ textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? 'var(--text-muted)' : 'inherit', fontSize: '0.9rem' }}>{st.text}</span>
              </div>
            ))}
            <form onSubmit={handleAddSubtask} className="subtask-item">
              <span style={{width: '22px', display:'inline-block'}}>+</span>
              <input 
                type="text" 
                className="subtask-input" 
                placeholder="添加子步骤" 
                value={newSubtask} 
                onChange={e => setNewSubtask(e.target.value)}
              />
            </form>
          </div>
          
          <div className="note-container">
            <h4>备注</h4>
            <textarea 
              className="note-textarea" 
              placeholder="添加备注..." 
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              onBlur={handleNoteBlur}
            />
          </div>
        </div>
      )}
    </li>
  );
};

export default TodoItem;
