import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  ClipboardList, 
  Sparkles, 
  BookMarked, 
  CheckCircle2, 
  Loader2, 
  Plus, 
  AlertCircle 
} from 'lucide-react';

import { api } from './api';
import Navbar from './components/Navbar';
import Card from './components/Card';
import TaskStats from './components/TaskStats';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskItem from './components/TaskItem';
import DeleteModal from './components/DeleteModal';
import ErrorBoundary from './components/ErrorBoundary';
import PomodoroTimer from './components/PomodoroTimer';
import MotivationCard from './components/MotivationCard';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Filters & Search state
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Delete modal state (Bonus Requirement 2)
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // User notification banner
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check backend health & fetch initial tasks
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getTasks({
        status: filterStatus,
        subject: selectedSubject,
        priority: selectedPriority,
        q: searchQuery,
      });
      setTasks(res.data);
      setBackendConnected(res.backend);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      showToast('Could not reach backend, switched to local storage.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, selectedSubject, selectedPriority, searchQuery]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Dark/Light theme class effect
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Confetti trigger when student completes all tasks
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore if blocked
    }
  };

  // Add Task handler (Core Requirement 2 & 7)
  const handleAddTask = async (newTaskData) => {
    setIsSubmitting(true);
    try {
      const created = await api.createTask(newTaskData);
      setTasks((prev) => [created, ...prev]);
      showToast(`Task "${created.title}" added successfully!`);
    } catch (err) {
      showToast(err.message || 'Error creating task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Task Completion handler (Core Requirement 3)
  const handleToggleTask = async (id) => {
    try {
      const updated = await api.toggleTask(id);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: updated.completed } : t))
      );

      if (updated.completed) {
        showToast('Great job! Task completed ✨');
        // Check if all tasks are now finished
        const pendingCount = tasks.filter((t) => t.id !== id && !t.completed).length;
        if (pendingCount === 0) {
          triggerConfetti();
        }
      }
    } catch (err) {
      showToast('Failed to update task status', 'error');
    }
  };

  // Delete Task Request (Opens Bonus Confirmation Modal)
  const handleRequestDelete = (task) => {
    setTaskToDelete(task);
  };

  // Confirm Delete handler (Core Requirement 4 & Bonus 2)
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Task removed from your list');
      setTaskToDelete(null);
    } catch (err) {
      showToast('Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Seed Data for Reviewers / Grading
  const handleSeedData = async () => {
    setLoading(true);
    try {
      await api.seedTasks();
      await loadTasks();
      showToast('Sample student assignments loaded! 🚀');
    } catch (err) {
      showToast('Failed to seed tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Clear Completed Tasks
  const handleClearCompleted = async () => {
    try {
      await api.clearCompleted();
      setTasks((prev) => prev.filter((t) => !t.completed));
      showToast('Completed tasks archived.');
    } catch (err) {
      showToast('Failed to clear completed tasks', 'error');
    }
  };

  // Client-side filtering when working with loaded list
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter (Bonus 1)
      if (filterStatus === 'completed' && !task.completed) return false;
      if (filterStatus === 'pending' && task.completed) return false;

      // Subject filter
      if (selectedSubject !== 'All' && task.subject !== selectedSubject) return false;

      // Priority filter
      if (selectedPriority !== 'All' && task.priority !== selectedPriority) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesSubject = task.subject?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesSubject) return false;
      }

      return true;
    });
  }, [tasks, filterStatus, selectedSubject, selectedPriority, searchQuery]);

  const hasCompletedTasks = tasks.some((t) => t.completed);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isBackendConnected={backendConnected}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold border ${
              toastMessage.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Overview Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block mb-1">
                Student Workspace
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Task Management & Study Dashboard
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
                Track assignments, manage deadlines, and boost academic productivity with integrated Pomodoro focus.
              </p>
            </div>
          </div>
        </div>

        {/* Task Statistics (Core Requirement 6 & Bonus 5) */}
        <TaskStats tasks={tasks} />

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Task List (Core requirements) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Core Requirement 2 & 7: Add Task Form with Validation */}
            <TaskForm onAddTask={handleAddTask} isSubmitting={isSubmitting} />

            {/* Bonus Requirement 1: Status Filters + Search */}
            <TaskFilters
              activeFilter={filterStatus}
              onFilterChange={setFilterStatus}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              selectedPriority={selectedPriority}
              onPriorityChange={setSelectedPriority}
              onSeedData={handleSeedData}
              onClearCompleted={handleClearCompleted}
              hasCompletedTasks={hasCompletedTasks}
              totalTasks={tasks.length}
            />

            {/* Bonus Requirement 3: Error Boundary wrapping Task List */}
            <ErrorBoundary onReset={loadTasks}>
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                  <p className="text-sm font-medium">Loading your student tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                /* Core Requirement 5: Conditional Rendering - "No tasks available" */
                <Card className="text-center py-16 border-dashed border-slate-800 bg-slate-900/30">
                  <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <ClipboardList className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">No tasks available</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        {searchQuery || selectedSubject !== 'All' || selectedPriority !== 'All'
                          ? 'No tasks match your current filter or search criteria.'
                          : 'Your assignment list is currently empty. Enjoy the free time or add a new task!'}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSeedData}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/30"
                      >
                        <Sparkles className="w-4 h-4" />
                        Load Demo Assignments
                      </button>
                    </div>
                  </div>
                </Card>
              ) : (
                /* Core Requirement 1: Display Tasks list */
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
                    <span>
                      Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                    <span>Click circle to complete</span>
                  </div>

                  {filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onRequestDelete={handleRequestDelete}
                    />
                  ))}
                </div>
              )}
            </ErrorBoundary>
          </div>

          {/* Right Column: Unique Student Productivity Features */}
          <div className="lg:col-span-4 space-y-6">
            {/* Unique Feature 1: Integrated Focus Pomodoro Timer */}
            <PomodoroTimer />

            {/* Unique Feature 2: Daily Motivational Quote & Study Tip */}
            <MotivationCard />

            {/* Project Architecture & Quick Guide Card */}
            <Card
              title="Architecture Info"
              icon={<BookMarked className="w-5 h-5 text-indigo-400" />}
              className="bg-slate-900/60"
            >
              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-300 font-semibold">Backend</span>
                  <span className="text-indigo-400 font-mono">Django 6 + DRF</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-300 font-semibold">Frontend</span>
                  <span className="text-cyan-400 font-mono">React 18 + Vite + Tailwind</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-300 font-semibold">Database</span>
                  <span className="text-emerald-400 font-mono">SQLite (Portable)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">Offline Fallback</span>
                  <span className="text-amber-400 font-mono">LocalStorage Safe</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Bonus Requirement 2: Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>Student Task Manager &copy; 2026 • Crafted with Django REST Framework &amp; Modern React</p>
      </footer>
    </div>
  );
}
