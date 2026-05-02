const BASE = '/api/todos';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const msg = await res.json().then(d => d.message).catch(() => 'Request failed');
    throw new Error(msg);
  }
  return res.json();
}

export const fetchTodos = () => request(BASE);

export const createTodo = (data) =>
  request(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateTodo = (id, data) =>
  request(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const toggleTodoDone = (id) =>
  request(`${BASE}/${id}/done`, { method: 'PATCH' });

export const deleteTodo = (id) =>
  request(`${BASE}/${id}`, { method: 'DELETE' });
