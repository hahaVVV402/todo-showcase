const API_BASE = '/api/todos';
const LIST_API_BASE = '/api/lists';

// --- TODOS ---
export const getTodos = async (listId = null) => {
  const url = listId ? `${API_BASE}?listId=${listId}` : API_BASE;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
};

export const getMyDayTodos = async () => {
  const response = await fetch(`${API_BASE}/my-day`);
  if (!response.ok) throw new Error('Failed to fetch my day todos');
  return response.json();
};

export const searchTodos = async (query) => {
  const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search todos');
  return response.json();
};

export const addTodo = async (todoData) => {
  const payload = typeof todoData === 'string' ? { text: todoData } : todoData;
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Failed to add todo');
  return response.json();
};

export const updateTodo = async (id, updates) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
};

export const deleteTodo = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete todo');
};

// --- LISTS ---
export const getLists = async () => {
  const response = await fetch(LIST_API_BASE);
  if (!response.ok) throw new Error('Failed to fetch lists');
  return response.json();
};

export const createList = async (name) => {
  const response = await fetch(LIST_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error('Failed to create list');
  return response.json();
};

export const updateList = async (id, name) => {
  const response = await fetch(`${LIST_API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error('Failed to update list');
  return response.json();
};

export const deleteList = async (id) => {
  const response = await fetch(`${LIST_API_BASE}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete list');
};

// --- SUBTASKS ---
export const getSubTasks = async (todoId) => {
  const response = await fetch(`${API_BASE}/${todoId}/subtasks`);
  if (!response.ok) throw new Error('Failed to fetch subtasks');
  return response.json();
};

export const addSubTask = async (todoId, text, sortOrder = 0) => {
  const response = await fetch(`${API_BASE}/${todoId}/subtasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sortOrder })
  });
  if (!response.ok) throw new Error('Failed to add subtask');
  return response.json();
};

export const updateSubTask = async (todoId, subTaskId, updates) => {
  const response = await fetch(`${API_BASE}/${todoId}/subtasks/${subTaskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Failed to update subtask');
  return response.json();
};

export const deleteSubTask = async (todoId, subTaskId) => {
  const response = await fetch(`${API_BASE}/${todoId}/subtasks/${subTaskId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete subtask');
};
