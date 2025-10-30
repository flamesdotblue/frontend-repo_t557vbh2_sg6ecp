import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ query: '', status: 'all', priority: 'any', showCompleted: true });

  const addTask = (data) => {
    const task = {
      id: uid(),
      title: data.title,
      description: data.description || '',
      priority: data.priority || 'medium',
      status: 'open',
      dueDate: data.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((t) => [task, ...t]);
  };

  const toggleTask = (id) => {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, completed: !x.completed, status: !x.completed ? 'done' : 'open' } : x)));
  };

  const deleteTask = (id) => {
    setTasks((t) => t.filter((x) => x.id !== id));
  };

  const updateTask = (updated) => {
    setTasks((t) => t.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
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
                This is a live prototype. Your tasks are stored in the browser for now. We'll hook this up to a database next.
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
            <TaskList
              tasks={tasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
              filters={filters}
            />
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500">
        Built with care. Database integration coming next.
      </footer>
    </div>
  );
}
