import React from 'react';
import { Check, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';

const PRIORITY_BADGES = {
  high: { label: 'High Priority', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
  medium: { label: 'Medium', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  low: { label: 'Low', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
};

const SUBJECT_COLORS = {
  'Computer Science': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  'Mathematics': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  'Physics': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  'Biology': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'Chemistry': 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  'Literature': 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  'History': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'Exam Prep': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  'General': 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

/**
 * TaskItem Component
 * Satisfies:
 * - Core 1: Display title and status
 * - Core 3: Checkbox/button to complete task
 * - Core 4: Delete button
 */
export default function TaskItem({ task, onToggle, onRequestDelete }) {
  const priorityInfo = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium;
  const subjectClass = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.General;

  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = !task.completed && task.due_date && task.due_date < todayStr;
  const isToday = !task.completed && task.due_date && task.due_date === todayStr;

  return (
    <div
      className={`group relative flex items-start justify-between gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-200 border ${
        task.completed
          ? 'bg-slate-900/40 border-slate-800/50 opacity-75'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-lg shadow-black/20'
      }`}
    >
      {/* Left section: Checkbox & Task details */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Core Requirement 3: Checkbox to complete task */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 border ${
            task.completed
              ? 'bg-emerald-500 border-emerald-400 text-white shadow-sm shadow-emerald-500/50'
              : 'border-slate-600 hover:border-indigo-400 bg-slate-950/60'
          }`}
          aria-label={task.completed ? "Mark task as incomplete" : "Mark task as completed"}
        >
          {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Badges: Subject, Priority, Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${subjectClass}`}>
              {task.subject || 'General'}
            </span>

            <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${priorityInfo.bg}`}>
              {priorityInfo.label}
            </span>

            {/* Status indicator (Core 1) */}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              task.completed 
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40' 
                : 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
            }`}>
              {task.completed ? 'Completed' : 'Pending'}
            </span>

            {/* Overdue alert */}
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                <AlertCircle className="w-3 h-3" /> Overdue
              </span>
            )}

            {isToday && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Due Today
              </span>
            )}
          </div>

          {/* Core Requirement 1: Display Task Title */}
          <h4
            className={`font-semibold text-sm sm:text-base tracking-tight transition break-words ${
              task.completed
                ? 'line-through text-slate-500 dark:text-slate-500'
                : 'text-slate-100 group-hover:text-indigo-300'
            }`}
          >
            {task.title}
          </h4>

          {/* Optional description */}
          {task.description && (
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed break-words">
              {task.description}
            </p>
          )}

          {/* Meta footer: Due Date and Study Minutes */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            {task.due_date && (
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Due: {task.due_date}
              </span>
            )}

            {task.estimated_minutes && (
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Est: {task.estimated_minutes} mins
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Core Requirement 4: Delete Button (triggers confirmation modal) */}
      <button
        type="button"
        onClick={() => onRequestDelete(task)}
        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition duration-150 shrink-0"
        aria-label="Delete task"
        title="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
