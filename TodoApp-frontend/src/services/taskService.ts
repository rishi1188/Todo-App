/**
 * services/taskService.ts
 *
 * All calls to the backend's task API live here. fetchTasks() only
 * sends `sortBy` to the backend (since that's the one thing that
 * genuinely needs to be computed server-side, by the priority/deadline
 * scoring algorithm) — status, priority, and tag filtering are applied
 * client-side in TaskListScreen for instant, no-network filtering.
 */

import { authInstance } from './firebase';
import { Task, Priority } from '../types';

const API_BASE_URL = 'http://localhost:3000';

export type SortMode = 'smart' | 'deadline' | 'priority' | 'created';

async function authHeader(): Promise<Record<string, string>> {
  const user = authInstance.currentUser;
  if (!user) throw new Error('Not logged in.');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function handleResponse<T>(res: Response, action: string): Promise<T> {
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.message ? ` — ${JSON.stringify(body.message)}` : '';
    } catch {
      // response wasn't JSON, ignore
    }
    throw new Error(`${action} failed (${res.status})${detail}`);
  }
  return res.json();
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dateTime: string;
  deadline: string;
  priority?: Priority;
  tags?: string[];
}

export type UpdateTaskInput = Partial<CreateTaskInput> & { completed?: boolean };

export async function fetchTasks(sortBy: SortMode = 'smart'): Promise<Task[]> {
  const headers = await authHeader();
  const res = await fetch(`${API_BASE_URL}/tasks?sortBy=${sortBy}`, { headers });
  return handleResponse<Task[]>(res, 'Load tasks');
}

export async function fetchTask(id: string): Promise<Task> {
  const headers = await authHeader();
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, { headers });
  return handleResponse<Task>(res, 'Load task');
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const headers = await authHeader();
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(res, 'Create task');
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const headers = await authHeader();
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(res, 'Update task');
}

export async function deleteTask(id: string): Promise<void> {
  const headers = await authHeader();
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    await handleResponse(res, 'Delete task');
  }
}