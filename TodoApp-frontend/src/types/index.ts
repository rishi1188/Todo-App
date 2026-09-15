/**
 * types/index.ts
 *
 * Shared type definitions used across the app. Defining these once
 * keeps the shape of a "Task" and "AuthUser" consistent between the
 * auth layer, the (future) task service, and every screen/component.
 */

// Priority levels a task can have. Used both for display (badges/colors)
// and for the sort-scoring algorithm we'll add once the task list exists.
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// A single to-do item. `userId` ties it to the Firebase UID of its owner
// so the backend can scope queries per-user.
export interface Task {
  id: string;
  title: string;
  description: string;
  dateTime: string; // ISO string — when the task is scheduled/created for
  deadline: string; // ISO string — when the task is due
  priority: Priority;
  tags: string[];
  completed: boolean;
  userId: string;
  createdAt: string;
}

// Minimal representation of the logged-in user, derived from the
// Firebase Auth user object. We only keep what the UI actually needs.
export interface AuthUser {
  uid: string;
  email: string | null;
}

// Shape of the value exposed by AuthContext to the rest of the app.
export interface AuthContextValue {
  user: AuthUser | null;
  initializing: boolean; // true while Firebase restores the session on app start
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
