import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle, TrendingUp } from 'lucide-react';
import Card from './Card';

/**
 * Task Statistics Component
 * Displays total tasks, completed tasks, remaining tasks counter,
 * and visual completion percentage bar.
 */
export default function TaskStats({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const today = new Date().toISOString().split('T')[0];
  const overdueCount = tasks.filter(t => !t.completed && t.due_date && t.due_date < today).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Tasks */}
      <Card className="!p-4 bg-slate-900/60 hover:border-indigo-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Total Tasks</p>
            <p className="text-2xl lg:text-3xl font-extrabold text-white mt-1">{total}</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <ListTodo className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
          <span>Overall workload</span>
        </div>
      </Card>

      {/* Remaining Tasks (Bonus Requirement 5) */}
      <Card className="!p-4 bg-slate-900/60 hover:border-amber-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-amber-400">Remaining Tasks</p>
            <p className="text-2xl lg:text-3xl font-extrabold text-amber-300 mt-1">{remaining}</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <Clock className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          {remaining === 0 && total > 0 ? (
            <span className="text-emerald-400 font-medium">All tasks cleared! 🎉</span>
          ) : (
            <span>Tasks to finish</span>
          )}
        </div>
      </Card>

      {/* Completed Tasks (Core Requirement 6) */}
      <Card className="!p-4 bg-slate-900/60 hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Completed</p>
            <p className="text-2xl lg:text-3xl font-extrabold text-emerald-300 mt-1">{completed}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          <span>{percentage}% finished</span>
        </div>
      </Card>

      {/* Completion Rate / Progress */}
      <Card className="!p-4 bg-slate-900/60 hover:border-violet-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-violet-400">Progress Rate</p>
            <p className="text-2xl lg:text-3xl font-extrabold text-violet-300 mt-1">{percentage}%</p>
          </div>
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-2xl border border-violet-500/20">
            <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
        </div>
        
        {/* Visual progress bar */}
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </Card>
    </div>
  );
}
