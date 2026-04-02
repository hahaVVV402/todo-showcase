import { useState } from 'react';

const AddTodo = ({ onAdd, activeListId, isMyDay }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('NONE');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAdd({ 
        text: text.trim(), 
        priority, 
        listId: typeof activeListId === 'number' ? activeListId : null,
        myDay: isMyDay,
        dueDate: dueDate || null
      });
      setText('');
      setPriority('NONE');
      setDueDate('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="input-group">
        <input
          type="text"
          className="todo-input"
          placeholder="添加新任务..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSubmitting}
        />
        <button type="submit" className="add-btn" disabled={!text.trim() || isSubmitting}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      {text.trim() && (
        <div className="quick-pickers">
          <button type="button" className={`picker-btn ${priority === 'HIGH' ? 'picker-active' : ''}`} onClick={() => setPriority(priority === 'HIGH' ? 'NONE' : 'HIGH')}>
            <span className="priority-dot" style={{ backgroundColor: 'var(--high-priority)' }}></span> 高
          </button>
          <button type="button" className={`picker-btn ${priority === 'MEDIUM' ? 'picker-active' : ''}`} onClick={() => setPriority(priority === 'MEDIUM' ? 'NONE' : 'MEDIUM')}>
            <span className="priority-dot" style={{ backgroundColor: 'var(--medium-priority)' }}></span> 中
          </button>
          <button type="button" className={`picker-btn ${priority === 'LOW' ? 'picker-active' : ''}`} onClick={() => setPriority(priority === 'LOW' ? 'NONE' : 'LOW')}>
            <span className="priority-dot" style={{ backgroundColor: 'var(--low-priority)' }}></span> 低
          </button>
          <input 
            type="date" 
            className="picker-btn" 
            value={dueDate} 
            style={{ color: dueDate ? 'var(--text-main)' : 'var(--text-muted)' }}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      )}
    </form>
  );
};

export default AddTodo;
