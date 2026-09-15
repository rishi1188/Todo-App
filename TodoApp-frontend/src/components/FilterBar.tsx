/**
 * components/FilterBar.tsx
 *
 * Status, sort, priority, and tag filter controls shown above the task
 * list. All filtering happens client-side in TaskListScreen (instant,
 * no network call) — only the sort mode is ever sent to the backend.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Priority } from '../types';
import { colors, spacing, radius, typography } from '../theme/colors';
import { SortMode } from '../services/taskService';

export type StatusFilter = 'all' | 'active' | 'completed';

interface FilterBarProps {
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  priority: Priority | 'all';
  onPriorityChange: (p: Priority | 'all') => void;
  sortBy: SortMode;
  onSortChange: (s: SortMode) => void;
  tags: string[];
  selectedTag: string | null;
  onTagChange: (t: string | null) => void;
}

const STATUS_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'smart', label: 'Smart' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'priority', label: 'Priority' },
  { key: 'created', label: 'Newest' },
];

const PRIORITY_OPTIONS: { key: Priority | 'all'; label: string; color?: string }[] = [
  { key: 'all', label: 'All' },
  { key: Priority.HIGH, label: 'High', color: colors.danger },
  { key: Priority.MEDIUM, label: 'Medium', color: colors.warning },
  { key: Priority.LOW, label: 'Low', color: colors.success },
];

const FilterBar: React.FC<FilterBarProps> = ({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortChange,
  tags,
  selectedTag,
  onTagChange,
}) => (
  <View style={styles.container}>
    <View style={styles.statusRow}>
      {STATUS_OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.key}
          onPress={() => onStatusChange(opt.key)}
          style={[styles.statusChip, status === opt.key && styles.statusChipActive]}
        >
          <Text style={[styles.statusChipText, status === opt.key && styles.statusChipTextActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
      <Text style={styles.rowLabel}>Sort</Text>
      {SORT_OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.key}
          onPress={() => onSortChange(opt.key)}
          style={[styles.pill, sortBy === opt.key && styles.pillActive]}
        >
          <Text style={[styles.pillText, sortBy === opt.key && styles.pillTextActive]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
      <Text style={styles.rowLabel}>Priority</Text>
      {PRIORITY_OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.key}
          onPress={() => onPriorityChange(opt.key)}
          style={[styles.pill, priority === opt.key && { backgroundColor: opt.color ?? colors.primary }]}
        >
          <Text style={[styles.pillText, priority === opt.key && styles.pillTextActive]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {tags.length > 0 && (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
        <Text style={styles.rowLabel}>Tag</Text>
        <TouchableOpacity
          onPress={() => onTagChange(null)}
          style={[styles.pill, selectedTag === null && styles.pillActive]}
        >
          <Text style={[styles.pillText, selectedTag === null && styles.pillTextActive]}>All</Text>
        </TouchableOpacity>
        {tags.map(tag => (
          <TouchableOpacity
            key={tag}
            onPress={() => onTagChange(tag)}
            style={[styles.pill, selectedTag === tag && styles.pillActive]}
          >
            <Text style={[styles.pillText, selectedTag === tag && styles.pillTextActive]}>#{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: spacing.sm },
  statusRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  statusChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  statusChipActive: { borderBottomColor: colors.primary },
  statusChipText: { ...typography.body, color: colors.textMuted, fontWeight: '600' },
  statusChipTextActive: { color: colors.textPrimary },
  scrollRow: { paddingLeft: spacing.lg, marginBottom: spacing.xs },
  rowLabel: {
    ...typography.caption,
    color: colors.textMuted,
    alignSelf: 'center',
    marginRight: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    justifyContent: 'center',
  },
  pillActive: { backgroundColor: colors.primary },
  pillText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  pillTextActive: { color: colors.textPrimary },
});

export default FilterBar;