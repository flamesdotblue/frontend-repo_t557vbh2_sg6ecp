import React from 'react';
import { Filter, Search, ListChecks } from 'lucide-react';

export default function FilterBar({ query, onQueryChange, status, onStatusChange, priority, onPriorityChange, showCompleted, onShowCompleted }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="flex-1 flex items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search tasks"
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="hidden sm:flex items-center text-slate-500 gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm">Filters</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
        >
          <option value="any">Any priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => onShowCompleted(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm flex items-center gap-1 text-slate-700">
            <ListChecks className="h-4 w-4 text-slate-500" />
            Show completed
          </span>
        </label>
      </div>
    </div>
  );
}
