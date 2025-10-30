import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';

const API_BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ query: '', status: 'all', priority: 'any', showCompleted: true });

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.query) params.set('q', filters.query);
      if (filters.status !== 'all') params.set('status', filters.status);
      if (filters.priority !== 'any') params.set('priority', filters.priority);
      if (!filters.showCompleted) params.set('show_completed', 'false');
      const data = await api(`/tasks?${params.toString()}`);
      setTasks(data);
    } catch (e) {
      setError('Failed to load tasks. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.query, filters.status, filters.priority, filters.showCompleted]);

  const addTask = async (data) => {
    try {
      const created = await api('/tasks', { method: 'POST', body: JSON.stringify({
        title: data.title,
        description: data.description || '',
        priority: data.priority || 'medium',
        dueDate: data.dueDate || null,
      }) });
      setTasks((t) => [created, ...t]);
    } catch (e) {
      alert('Failed to add task.');
    }
  };

  const toggleTask = async (id) => {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;
    try {
      const updated = await api(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ completed: !current.completed }) });
      setTasks((t) => t.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      alert('Failed to update task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api(`/tasks/${id}`, { method: 'DELETE' });
      setTasks((t) => t.filter((x) => x.id !== id));
    } catch (e) {
      alert('Failed to delete task.');
    }
  };

  const updateTask = async (updated) => {
    const payload = {
      title: updated.title,
      description: updated.description,
      priority: updated.priority,
      status: updated.status,
      dueDate: updated.dueDate || null,
    };
    try {
      const saved = await api(`/tasks/${updated.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      setTasks((t) => t.map((x) => (x.id === updated.id ? saved : x)));
    } catch (e) {
      alert('Failed to save changes.');
    }
  };

  const openCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onOpenSettings={() => alert('Settings panel will come later.')} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <TaskForm onAdd={addTask} />
            <div className="mt-4 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-sm text-slate-700">
                Your tasks are now stored in a database. Use the filters to find exactly what you need.
              </p>
              <p className="mt-2 text-sm"><span className="font-medium">Open tasks:</span> {openCount}</p>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <FilterBar
              query={filters.query}
              onQueryChange={(v) => setFilters((f) => ({ ...f, query: v }))}
              status={filters.status}
              onStatusChange={(v) => setFilters((f) => ({ ...f, status: v }))}
              priority={filters.priority}
              onPriorityChange={(v) => setFilters((f) => ({ ...f, priority: v }))}
              showCompleted={filters.showCompleted}
              onShowCompleted={(v) => setFilters((f) => ({ ...f, showCompleted: v }))}
            />
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
            )}
            {loading ? (
              <div className="text-center py-14 bg-white rounded-xl border border-slate-200">Loading tasks…</div>
            ) : (
              <TaskList
                tasks={tasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
                filters={filters}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500">
        MySQL-ready backend with a clean React UI.
      </footer>
    </div>
  );
}
