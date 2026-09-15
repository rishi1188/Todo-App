/**
 * tasks/utils/sort-tasks.util.ts
 *
 * The "smart sort": ranks tasks by a blend of urgency (how close/overdue
 * the deadline is) and priority (low/medium/high), rather than sorting
 * by a single field. This is what SortMode.SMART uses; DEADLINE/PRIORITY/
 * CREATED are simple single-field sorts handled in the service directly.
 *
 * How the score works:
 * - Each priority level has a base weight (HIGH=30, MEDIUM=20, LOW=10).
 * - Urgency is measured in hours until the deadline. The fewer hours
 *   remaining, the higher the urgency score — and overdue tasks
 *   (negative hours remaining) get an extra boost so they always float
 *   above non-overdue tasks of the same priority.
 * - Completed tasks are always sorted to the bottom, regardless of score.
 *
 * Tune PRIORITY_WEIGHTS / URGENCY_SCALE to change how much priority vs.
 * deadline proximity influences the final order.
 */

import { TaskDocument } from '../schemas/task.schema';
import { Priority } from '../enums/priority.enum';

const PRIORITY_WEIGHTS: Record<Priority, number> = {
  [Priority.HIGH]: 30,
  [Priority.MEDIUM]: 20,
  [Priority.LOW]: 10,
};

// Caps how many "urgency points" a task can earn from deadline proximity,
// so priority still matters even for a very-soon low-priority task.
const URGENCY_SCALE = 40;
const OVERDUE_BONUS = 50;

function urgencyScore(deadline: Date, now: Date): number {
  const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursRemaining < 0) {
    // Overdue: fixed bonus plus a small extra for how overdue it is,
    // capped so a task overdue by a month doesn't dwarf everything else.
    return OVERDUE_BONUS + Math.min(Math.abs(hoursRemaining) / 24, 10);
  }

  // Not overdue: score decays as hoursRemaining grows. A task due in an
  // hour scores near URGENCY_SCALE; a task due in a week scores near 0.
  const decay = Math.max(0, 1 - hoursRemaining / (24 * 7));
  return decay * URGENCY_SCALE;
}

export function computeTaskScore(task: TaskDocument, now: Date = new Date()): number {
  const priorityScore = PRIORITY_WEIGHTS[task.priority] ?? PRIORITY_WEIGHTS[Priority.MEDIUM];
  return priorityScore + urgencyScore(new Date(task.deadline), now);
}

/**
 * Sorts tasks "smart": incomplete tasks first (by descending score), then
 * completed tasks last (most recently created first among themselves).
 */
export function sortTasksSmart(tasks: TaskDocument[]): TaskDocument[] {
  const now = new Date();

  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // incomplete tasks bubble above completed
    }
    if (a.completed && b.completed) {
      // Among completed tasks, most recently created first.
      return (b as any).createdAt?.getTime?.() - (a as any).createdAt?.getTime?.();
    }
    return computeTaskScore(b, now) - computeTaskScore(a, now);
  });
}
