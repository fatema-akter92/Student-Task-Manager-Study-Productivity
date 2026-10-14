import React from 'react';
import { Search, Filter, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';

/**
 * TaskFilters Component
 * Satisfies Bonus Requirement 1: Filter tasks by All, Completed, and Pending.
 * Also includes fast search, subject filtering, and quick demo data action.
 */
export default function TaskFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedPriority,
  onPriorityChange,
  onSeedData,
  onClearCompleted,
  hasCompletedTasks = false,
  totalTasks = 0,
}) {
  const FILTER_TABS = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
  ];

  const SUBJECTS = [
    'All',
    'General',
    'Computer Science',
    'Mathematics',
    'Physics',
    'Biology',
    'Chemistry',
    'Literature',
    'History',
    'Exam Prep'
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Tabs: All, Completed, Pending (Bonus Requirement 1) */}
        <div className="inline-flex p-1 bg-slate-900/90 rounded-2xl border border-slate-800 self-start">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, subjects, or notes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 border border-slate-800 focus:border-indigo-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end lg:self-center">
          {hasCompletedTasks && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition"
              title="Delete completed tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Completed
            </button>
          )}

          <button
            type="button"
            onClick={onSeedData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition shadow-sm"
            title="Load sample student assignments for testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Seed Sample Data
          </button>
        </div>
      </div>

      {/* Sub-Filters: Subject & Priority */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
        <span className="flex items-center gap-1 text-slate-500 font-medium">
          <Filter className="w-3 h-3" /> Filters:
        </span>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 outline-none hover:border-slate-700"
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s === 'All' ? 'All Subjects' : s}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 outline-none hover:border-slate-700"
        >
          <option value="All">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>
    </div>
  );
}
