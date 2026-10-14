# Student Task Manager — Full-Stack Study & Productivity Suite

An aesthetic, responsive, and resilient Full-Stack Student Task Manager built with **React 18 (Vite + Tailwind CSS)** and a robust **Django 6 + Django REST Framework** backend.

---

## 🌟 Key Highlights & Rubric Checklist

### Core Requirements (from Assignment Rubric)
1. **Display Tasks**: Lists all tasks showing titles, subjects, priority badges, and status.
2. **Add New Task**: Clean form with task title input, subject selector, priority levels, deadline picker, and "Add Task" button.
3. **Complete a Task**: Interactive checkbox / toggle to mark tasks as completed with visual strike-through and badge updates.
4. **Delete a Task**: Remove tasks safely with instant state update.
5. **Conditional Rendering**: Beautiful empty state with encouraging illustration and "Load Demo Assignments" button when no tasks exist.
6. **Task Statistics**: Dynamic counter cards showing Total Tasks, Remaining Tasks, Completed Tasks, and Progress percentage.
7. **Form Validation**: Strict client-side and server-side validation preventing empty or whitespace-only submissions with descriptive error messages.

### Bonus Tasks
- **Filter Tasks**: Filter tabs for **All**, **Pending**, and **Completed** tasks.
- **Delete Confirmation Modal**: Accessible modal popup confirming task removal before permanent deletion.
- **Resilient Fallback UI (Error Boundary)**: React `ErrorBoundary` component that catches runtime errors and presents a friendly recovery UI.
- **Reusable Card Component**: Flexible `Card` component using React's `children` prop and header/footer slots.
- **Remaining Task Counter**: Dedicated counter tracking unfinished assignments.

###  Unique Aesthetic & Study Enhancements
- **Obsidian / Aurora Glass Aesthetic**: Dark/Light mode toggle, sleek glassmorphism panels, glowing borders, and smooth micro-animations.
- **Focus Pomodoro Study Timer**: Integrated 25-minute study focus & 5-minute break timer with audio completion chimes and session cycle tracking.
- **Study Spark Motivation**: Curated academic motivational quotes and actionable study tips.
- **Instant Demo Seeder**: One-click "Seed Sample Data" button to instantly populate realistic coursework across CS, Math, Literature, Physics, and Biology.
- **Live Backend Connection Monitor**: Automatic detection of Django REST API status with seamless fallback to browser `localStorage` if backend is disconnected.
- **Celebration Confetti**: Physics-based confetti shower when completing all coursework!

---


---


Open your browser at: `http://localhost:5173`

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks/` | List tasks (supports `?status=`, `?subject=`, `?priority=`, `?q=`, `?sort=`) |
| `POST` | `/api/tasks/` | Create a new task |
| `GET` | `/api/tasks/{id}/` | Retrieve single task details |
| `PATCH` | `/api/tasks/{id}/` | Partial update of task attributes |
| `PATCH` | `/api/tasks/{id}/toggle/` | Quick toggle of `completed` status |
| `DELETE` | `/api/tasks/{id}/` | Delete a task |
| `GET` | `/api/tasks/stats/` | Returns aggregated metrics & completion rates |
| `POST` | `/api/tasks/seed/` | Seeds sample coursework assignments |
| `DELETE` | `/api/tasks/clear_completed/` | Bulk removes all completed tasks |
| `GET` | `/api/status/` | API health check & available route directory |

---

## Code & Feature Explanation

### 1. Reusable Card Component (`Card.jsx`)
Implements React's **Component Composition** pattern using the `children` prop. It exposes standard slots for title, icons, action buttons, and a footer, guaranteeing visual consistency throughout the interface.

### 2. Resilient API Layer (`api.js`)
The frontend client intelligently pings the Django REST API (`http://127.0.0.1:8000/api`). If the Django server is temporarily offline, the service automatically switches to browser `localStorage` mode without throwing unhandled exceptions.

### 3. Pomodoro Focus Timer (`PomodoroTimer.jsx`)
Features a 25/5-minute interval timer built directly using React's `useEffect` and `useRef`. Audio notifications use the native browser Web Audio API oscillator, requiring zero external MP3 assets.

### 4. Delete Confirmation (`DeleteModal.jsx`)
Prevents accidental data loss. Uses React state (`taskToDelete`) to conditionally display an accessible modal overlay with keyboard escape handling.
