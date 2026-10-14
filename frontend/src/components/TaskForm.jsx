import React, { useState } from 'react';
import { PlusCircle, AlertCircle, BookOpen, Calendar, Clock, Flag } from 'lucide-react';
import Card from './Card';

const SUBJECTS = [
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

/**
 * TaskForm Component
 * Satisfies Core Requirement 2: Add New Task form with input field and Add Task button.
 * Satisfies Core Requirement 7: Form Validation (blocks empty tasks and shows error).
 */
export default function TaskForm({ onAddTask, isSubmitting = false }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('30');
  
  // Validation state
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Block empty or whitespace-only task title
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title cannot be empty. Please enter your assignment or task name.');
      return;
    }

    if (trimmedTitle.length < 2) {
      setError('Task title must be at least 2 characters long.');
      return;
    }

    // Clear any previous error
    setError('');

    // Prepare payload
    const payload = {
      title: trimmedTitle,
      description: description.trim(),
      subject,
      priority,
      due_date: dueDate || null,
      estimated_minutes: parseInt(estimatedMinutes, 10) || 30,
      completed: false,
    };

    onAddTask(payload);

    // Reset inputs
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <Card
      title="Create New Task"
      icon={<PlusCircle className="w-5 h-5 text-indigo-400" />}
      className="mb-8 border-indigo-500/20"
      action={
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium py-1 px-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition"
        >
          {isExpanded ? 'Simple Mode' : '+ Add Details'}
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Validation error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Main Task Input Field (Requirement 2 & 7) */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., Complete Operating Systems Lab 3 & Git Push..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition text-sm sm:text-base font-normal shadow-inner"
              disabled={isSubmitting}
            />
          </div>

          {/* Quick Subject Select */}
          <div className="w-full sm:w-48">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-3 rounded-xl bg-slate-900/90 text-slate-200 border border-slate-700/80 focus:border-indigo-500 outline-none text-sm transition"
              disabled={isSubmitting}
            >
              {SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Add Task Button (Requirement 2) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/25 active:scale-95 disabled:opacity-50 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </div>

        {/* Detailed Options Drawer */}
        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 animate-fade-in">
            {/* Priority Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-amber-400" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-700/80 focus:border-indigo-500 outline-none text-sm"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority ⚡</option>
              </select>
            </div>

            {/* Due Date Picker */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-700/80 focus:border-indigo-500 outline-none text-sm"
              />
            </div>

            {/* Estimated Minutes */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Study Estimate (Min)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-700/80 focus:border-indigo-500 outline-none text-sm"
              />
            </div>

            {/* Optional Description / Assignment notes */}
            <div className="sm:col-span-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Assignment Notes / Sub-goals (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="2"
                placeholder="Include reference links, textbook pages, or specific steps..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-700/80 focus:border-indigo-500 outline-none text-sm"
              />
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}
