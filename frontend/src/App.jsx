import { useState, useEffect } from 'react';
import { getTodos, getMyDayTodos, searchTodos, addTodo, updateTodo, deleteTodo, getLists, createList, deleteList } from './api/todoApi';
import Sidebar from './components/Sidebar';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

function App() {
  const [lists, setLists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [activeView, setActiveView] = useState('inbox'); // 'inbox', 'my-day', 'search', or `list_${id}`
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAppData = async () => {
    try {
      setLoading(true);
      const listsData = await getLists();
      setLists(listsData);
      await fetchTodosForView(activeView);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const priorityWeights = { HIGH: 3, MEDIUM: 2, LOW: 1, NONE: 0 };

  const sortTodos = (data) => {
    return [...data].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
      // Secondary sort: Due date (closest first)
      if (a.dueDate && b.dueDate) {
        const timeDiff = new Date(a.dueDate) - new Date(b.dueDate);
        if (timeDiff !== 0) return timeDiff;
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }
      
      // Tertiary sort: Priority (Highest first)
      const pA = priorityWeights[a.priority || 'NONE'];
      const pB = priorityWeights[b.priority || 'NONE'];
      if (pA !== pB) return pB - pA;
      
      return 0;
    });
  };

  const fetchTodosForView = async (view) => {
    let data = [];
    if (view === 'inbox') {
      data = await getTodos(null); 
    } else if (view === 'my-day') {
      data = await getMyDayTodos();
    } else if (view === 'search') {
      data = await searchTodos(searchQuery);
    } else if (view && view.startsWith && view.startsWith('list_')) {
      const listId = parseInt(view.split('_')[1]);
      data = await getTodos(listId);
    }
    setTodos(sortTodos(data));
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        setActiveView('search');
        fetchTodosForView('search');
      } else if (activeView === 'search') {
        setActiveView('inbox');
        fetchTodosForView('inbox');
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (activeView !== 'search') {
      fetchTodosForView(activeView);
    }
  }, [activeView]);

  const handleAddList = async (name) => {
    const nl = await createList(name);
    setLists([...lists, nl]);
    setActiveView(`list_${nl.id}`);
  };

  const handleAddTodo = async (todoData) => {
    const newTodo = await addTodo(todoData);
    setTodos(sortTodos([newTodo, ...todos]));
    if (newTodo.listId) {
      setLists(lists.map(l => l.id === newTodo.listId ? {...l, todoCount: l.todoCount + 1} : l));
    }
  };

  const handleToggleTodo = async (todo) => {
    const newTodos = todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t);
    setTodos(sortTodos(newTodos));
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
    } catch (err) {
      setTodos(todos.map(t => t.id === todo.id ? { ...t, completed: todo.completed } : t));
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    const newTodos = todos.map(t => t.id === id ? { ...t, ...updates } : t);
    setTodos(sortTodos(newTodos));
    try {
      await updateTodo(id, updates);
    } catch (err) {
      fetchTodosForView(activeView); // revert
    }
  }

  const handleDeleteTodo = async (id) => {
    const deletedTodo = todos.find(t => t.id === id);
    setTodos(todos.filter(t => t.id !== id));
    try {
      await deleteTodo(id);
      if (deletedTodo && deletedTodo.listId) {
        setLists(lists.map(l => l.id === deletedTodo.listId ? {...l, todoCount: Math.max(0, l.todoCount - 1)} : l));
      }
    } catch (err) {
      fetchTodosForView(activeView);
    }
  };

  const deleteCurrentList = async () => {
    if (activeView.startsWith('list_')) {
      const listId = parseInt(activeView.split('_')[1]);
      if (confirm('删除此清单？任务将移至收件箱。')) {
        await deleteList(listId);
        setLists(lists.filter(l => l.id !== listId));
        setActiveView('inbox');
      }
    }
  };

  const getFormatDate = () => {
    return new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getHeaderTitle = () => {
    if (activeView === 'inbox') return '收件箱';
    if (activeView === 'my-day') return '我的一天';
    if (activeView === 'search') return '搜索结果';
    if (activeView.startsWith('list_')) {
      const l = lists.find(list => list.id === parseInt(activeView.split('_')[1]));
      return l ? l.name : '清单';
    }
    return '任务';
  };

  return (
    <>
      <div className="background-mesh">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="blob-3"></div>
      </div>
      
      <div className="app-container">
        <Sidebar 
          lists={lists} 
          activeView={activeView} 
          onViewChange={setActiveView} 
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onCreateList={handleAddList}
        />

        <main className="main-content">
          <div className="header-container">
            <div>
              <h1>{getHeaderTitle()}</h1>
              <p className="date">{activeView === 'my-day' ? getFormatDate() : `${todos.length} 个任务`}</p>
            </div>
            {activeView.startsWith('list_') && (
              <button className="icon-btn danger" onClick={deleteCurrentList} title="Delete List">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            )}
          </div>

          {activeView !== 'search' && (
            <AddTodo 
              onAdd={handleAddTodo} 
              activeListId={activeView.startsWith('list_') ? parseInt(activeView.split('_')[1]) : null}
              isMyDay={activeView === 'my-day'}
            />
          )}

          <div className="todo-list-scroll">
            {loading ? (
              <div className="empty-state">加载中...</div>
            ) : (
              <TodoList 
                todos={todos} 
                onToggle={handleToggleTodo} 
                onDelete={handleDeleteTodo} 
                onUpdate={handleUpdateTodo}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
