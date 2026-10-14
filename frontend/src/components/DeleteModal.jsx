import React, { useEffect } from 'react';
import { Trash2, AlertCircle, X } from 'lucide-react';

/**
 * Confirmation modal before deleting a task.
 * Implements bonus requirement: "Display a confirmation message before deleting a task".
 */
export default function DeleteModal({ isOpen, task, onConfirm, onCancel, isDeleting }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 relative animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition p-1.5 rounded-lg hover:bg-slate-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20 shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 id="modal-title" className="text-lg font-bold text-white">
              Delete Task Confirmation
            </h3>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>

            <div className="p-3 my-2 bg-slate-950/60 rounded-xl border border-slate-800 text-sm">
              <span className="font-semibold text-indigo-400 block truncate">{task.title}</span>
              {task.subject && (
                <span className="text-xs text-slate-400 block mt-0.5">Subject: {task.subject}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition border border-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(task.id)}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition shadow-lg shadow-rose-600/30 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Yes, Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
