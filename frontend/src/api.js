/**
 * API Service for Student Task Manager
 * Communicates with the Django REST Framework backend.
 * Gracefully provides local fallback if backend is offline.
 */

const API_BASE = 'http://127.0.0.1:8000/api';

const DEFAULT_LOCAL_TASKS = [
  {
    id: 1,
    title: "Complete CS301 Binary Trees & Graph Algorithms Lab",
    description: "Implement BFS, DFS traversal and submit GitHub repository link with unit tests.",
    completed: false,
    subject: "Computer Science",
    priority: "high",
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    estimated_minutes: 60,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Calculus III Problem Set: Stokes' Theorem & Green's Theorem",
    description: "Exercises 4.1 to 4.15 from Chapter 8. Check answers against online study portal.",
    completed: true,
    subject: "Mathematics",
    priority: "medium",
    due_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    estimated_minutes: 45,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 3,
    title: "Draft Literature Research Essay: Postmodern Symbolism",
    description: "Write a 1,500-word comparative draft examining motifs and historical context.",
    completed: false,
    subject: "Literature",
    priority: "medium",
    due_date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
    estimated_minutes: 90,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Physics Quiz Prep: Electromagnetic Induction Formulas",
    description: "Review Faraday's Law, Lenz's Law, and solve 5 sample past paper problems.",
    completed: false,
    subject: "Physics",
    priority: "high",
    due_date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    estimated_minutes: 40,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Biology Lab Report: Cellular Respiration in Yeast",
    description: "Record gas fermentation rates, plot graph curves, and format reference citations.",
    completed: true,
    subject: "Biology",
    priority: "low",
    due_date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    estimated_minutes: 35,
    created_at: new Date().toISOString(),
  }
];

function getStoredLocalTasks() {
  try {
    const raw = localStorage.getItem('stm_tasks');
    if (!raw) {
      localStorage.setItem('stm_tasks', JSON.stringify(DEFAULT_LOCAL_TASKS));
      return DEFAULT_LOCAL_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_LOCAL_TASKS;
  }
}

function saveStoredLocalTasks(tasks) {
  try {
    localStorage.setItem('stm_tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const api = {
  isBackendConnected: false,

  async checkConnection() {
    try {
      const res = await fetch(`${API_BASE}/tasks/`, { method: 'HEAD', signal: AbortSignal.timeout(1500) });
      this.isBackendConnected = res.ok;
      return this.isBackendConnected;
    } catch {
      this.isBackendConnected = false;
      return false;
    }
  },

  async getTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.subject && params.subject !== 'All') query.append('subject', params.subject);
    if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params.q) query.append('q', params.q);
    if (params.sort) query.append('sort', params.sort);

    const qs = query.toString() ? `?${query.toString()}` : '';

    try {
      const res = await fetch(`${API_BASE}/tasks/${qs}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.isBackendConnected = true;
      return { data, backend: true };
    } catch (err) {
      this.isBackendConnected = false;
      // Local filter fallback
      let tasks = getStoredLocalTasks();
      if (params.status === 'completed') tasks = tasks.filter(t => t.completed);
      if (params.status === 'pending') tasks = tasks.filter(t => !t.completed);
      if (params.subject && params.subject !== 'All') tasks = tasks.filter(t => t.subject === params.subject);
      if (params.priority && params.priority !== 'All') tasks = tasks.filter(t => t.priority === params.priority);
      if (params.q) {
        const q = params.q.toLowerCase();
        tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
      }
      return { data: tasks, backend: false };
    }
  },

  async createTask(taskData) {
    try {
      const res = await fetch(`${API_BASE}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.title?.[0] || 'Failed to create task on backend');
      }
      return await res.json();
    } catch (err) {
      // Local fallback
      const tasks = getStoredLocalTasks();
      const newTask = {
        ...taskData,
        id: Date.now(),
        completed: false,
        created_at: new Date().toISOString()
      };
      saveStoredLocalTasks([newTask, ...tasks]);
      return newTask;
    }
  },

  async updateTask(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Update failed');
      return await res.json();
    } catch {
      const tasks = getStoredLocalTasks();
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        tasks[idx] = { ...tasks[idx], ...updates };
        saveStoredLocalTasks(tasks);
        return tasks[idx];
      }
      throw new Error('Task not found');
    }
  },

  async toggleTask(id) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/toggle/`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Toggle failed');
      return await res.json();
    } catch {
      const tasks = getStoredLocalTasks();
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        tasks[idx].completed = !tasks[idx].completed;
        saveStoredLocalTasks(tasks);
        return tasks[idx];
      }
      throw new Error('Task not found');
    }
  },

  async deleteTask(id) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      return true;
    } catch {
      const tasks = getStoredLocalTasks();
      const filtered = tasks.filter(t => t.id !== id);
      saveStoredLocalTasks(filtered);
      return true;
    }
  },

  async seedTasks() {
    try {
      const res = await fetch(`${API_BASE}/tasks/seed/`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    saveStoredLocalTasks(DEFAULT_LOCAL_TASKS);
    return { count: DEFAULT_LOCAL_TASKS.length };
  },

  async clearCompleted() {
    try {
      const res = await fetch(`${API_BASE}/tasks/clear_completed/`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const tasks = getStoredLocalTasks().filter(t => !t.completed);
    saveStoredLocalTasks(tasks);
    return { deleted: true };
  }
};
