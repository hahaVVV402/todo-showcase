import { useState, useRef, useEffect } from 'react';

const Sidebar = ({ 
  lists, 
  activeView, 
  onViewChange, 
  searchQuery, 
  onSearch, 
  onCreateList, 
  onDeleteList 
}) => {
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAddingList && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingList]);

  const handleAddListSubmit = () => {
    if (newListName.trim()) {
      onCreateList(newListName.trim());
    }
    setIsAddingList(false);
    setNewListName('');
  };

  return (
    <aside className="sidebar">
      <div className="search-container">
        <input 
          type="text" 
          className="search-box" 
          placeholder="搜索任务或备注..." 
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="nav-section">
        <div 
          className={`nav-item ${activeView === 'my-day' ? 'active' : ''}`}
          onClick={() => onViewChange('my-day')}
        >
          <div className="nav-item-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <span>我的一天</span>
          </div>
        </div>

        <div 
          className={`nav-item ${activeView === 'inbox' ? 'active' : ''}`}
          onClick={() => onViewChange('inbox')}
        >
          <div className="nav-item-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span>收件箱</span>
          </div>
        </div>
      </div>

      <div style={{ margin: '10px 0', borderTop: '1px solid var(--border)' }}></div>

      <div className="nav-section" style={{ flexGrow: 1 }}>
        <h3>我的清单</h3>
        {lists.map(list => (
          <div 
            key={list.id} 
            className={`nav-item ${activeView === `list_${list.id}` ? 'active' : ''}`}
            onClick={() => onViewChange(`list_${list.id}`)}
          >
            <div className="nav-item-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              <span>{list.name}</span>
            </div>
            {list.todoCount > 0 && <span className="nav-badge">{list.todoCount}</span>}
          </div>
        ))}
        
        {isAddingList ? (
          <div className="nav-item active" style={{ padding: '8px', cursor: 'default' }}>
            <div className="nav-item-left" style={{ width: '100%' }}>
              <input 
                ref={inputRef}
                type="text"
                autoFocus
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onBlur={handleAddListSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddListSubmit();
                  if (e.key === 'Escape') {
                    setIsAddingList(false);
                    setNewListName('');
                  }
                }}
                className="search-box"
                style={{ flexGrow: 1, padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px' }}
                placeholder="清单名称并回车..."
              />
            </div>
          </div>
        ) : (
          <button 
            className="add-list-btn" 
            onClick={() => setIsAddingList(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            新建清单
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
