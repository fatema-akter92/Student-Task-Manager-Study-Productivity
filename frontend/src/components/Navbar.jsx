import React from 'react';
import { GraduationCap, Sun, Moon, Database, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({ isDark, onToggleTheme, isBackendConnected }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                Student Task Manager
              </h1>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                v1.0 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Study Planner & Assignment Tracker
            </p>
          </div>
        </div>

        {/* Right tools: Backend Status Badge & Theme toggle */}
        <div className="flex items-center gap-3">
          {/* Connection status indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
              isBackendConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
            title={
              isBackendConnected
                ? 'Connected to Django REST Framework (SQLite)'
                : 'Running in Local Storage Mode (Offline resilient)'
            }
          >
            {isBackendConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Django API Connected</span>
                <span className="md:hidden">Django API</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Local Mode (Django Offline)</span>
                <span className="md:hidden">Local Mode</span>
              </>
            )}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
}
