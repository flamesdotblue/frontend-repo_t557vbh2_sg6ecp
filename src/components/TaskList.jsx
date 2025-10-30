import React, { useMemo, useState } from 'react';
import { Trash2, CheckCircle2, Circle, Edit2, Save, X, CalendarDays, Flag } from 'lucide-react';

function PriorityBadge({ value }) {
  const styles = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  const label = value?.[0]?.toUpperCase() + value?.slice(1);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border ${styles[value] || ''}`}>
      <Flag className="h-3 w-3" />
      {label || '—'}
    </span>
  );
}

function StatusBadge({ value }) {
  const map = {
    open: { label: 'Open', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    in_progress: { label: 'In Progress', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    done: { label: 'Done', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };
  const s = map[value] || map.open;
  return <span className={`px-2 py-1 rounded-md text-xs border ${s.color}`}>{s.label}</span>;
}

function TaskRow({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...task });

  const save = () => {
    onUpdate({ ...draft, title: draft.title.trim() || task.title });
    setEditing(false);
  };

  return (
    <li className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <button
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          onClick={() => onToggle(task.id)}
          className="mt-0.5 text-slate-500 hover:text-indigo-600"
        >
          {task.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Circle className="h-5 w-5" />}
        </button>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="flex flex-wrap gap-3">
                <select
                  value={draft.status}
                  onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <select
                  value={draft.priority}
                  onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="relative">
                  <CalendarDays className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={draft.dueDate || ''}
                    onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
                    className="pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className={`font-medium truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.title}</h3>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge value={task.priority} />
                  <StatusBadge value={task.status} />
                </div>
              </div>
              {task.description && (
                <p className={`mt-1 text-sm text-slate-600 ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.description}</p>
              )}
              <div className="mt-2 text-xs text-slate-500 flex items-center gap-4">
                {task.dueDate && (
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Due {task.dueDate}</span>
                )}
                <span>Created {new Date(task.createdAt).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <button onClick={save} className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50" aria-label="Save">
                <Save className="h-4 w-4" />
              </button>
              <button onClick={() => { setEditing(false); setDraft(task); }} className="p-2 rounded-lg text-slate-700 hover:bg-slate-50" aria-label="Cancel">
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="p-2 rounded-lg text-slate-700 hover:bg-slate-50" aria-label="Edit">
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => onDelete(task.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default function TaskList({ tasks, onToggle, onDelete, onUpdate, filters }) {
  const filtered = useMemo(() => {
    let list = [...tasks];
    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (filters.status !== 'all') list = list.filter(t => t.status === filters.status);
    if (filters.priority !== 'any') list = list.filter(t => t.priority === filters.priority);
    if (!filters.showCompleted) list = list.filter(t => !t.completed);
    return list;
  }, [tasks, filters]);

  if (!filtered.length) {
    return (
      <div className="text-center py-14 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
        No tasks match your filters.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {filtered.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />)
      )}
    </ul>
  );
}
