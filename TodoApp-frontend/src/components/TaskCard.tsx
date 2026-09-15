/**
 * components/TaskCard.tsx
 *
 * One row in the task list: a colored priority accent bar on the left
 * edge, title, description preview, deadline, tag chips, and
 * complete/delete controls. Scales down slightly on press for tactile
 * feedback, using React Native's built-in Animated API (no extra
 * dependency needed).
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Animated } from 'react-native';
import { Task, Priority } from '../types';
import { colors, spacing, radius, typography, shadow } from '../theme/colors';

const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.HIGH]: colors.danger,
  [Priority.MEDIUM]: colors.warning,
  [Priority.LOW]: colors.success,
};

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
  onPress: (task: Task) => void;
}

const formatDeadline = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onDelete, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  const accentColor = PRIORITY_COLORS[task.priority];

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={() => onPress(task)}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[styles.card, shadow.card, task.completed && styles.cardCompleted]}
      >
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <TouchableOpacity onPress={() => onToggleComplete(task)} style={styles.checkboxWrap}>
          <View
            style={[
              styles.checkbox,
              task.completed && { backgroundColor: colors.success, borderColor: colors.success },
            ]}
          >
            {task.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[styles.title, task.completed && styles.titleCompleted]} numberOfLines={1}>
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {task.description}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: accentColor }]}>
              <Text style={styles.badgeText}>{task.priority}</Text>
            </View>
            <Text style={styles.deadline}>Due {formatDeadline(task.deadline)}</Text>
          </View>

          {task.tags.length > 0 && (
            <View style={styles.tagRow}>
              {task.tags.map(tag => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity onPress={() => onDelete(task)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    paddingLeft: spacing.md + 8,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  cardCompleted: {
    opacity: 0.5,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  checkboxWrap: {
    marginRight: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  deadline: {
    ...typography.caption,
    color: colors.textMuted,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  tagChip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    marginRight: spacing.xs,
    marginTop: 2,
  },
  tagChipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  deleteText: {
    color: colors.textMuted,
    fontSize: 18,
  },
});

export default TaskCard;