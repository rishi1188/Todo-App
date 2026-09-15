/**
 * screens/TaskListScreen.tsx
 *
 * The real task list: fetches tasks (smart-sorted by the backend),
 * then applies status/priority/tag filters client-side for instant
 * filtering. Includes pull-to-refresh, tap-to-edit, checkbox-to-
 * complete, delete, and a floating "+" to add a task.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppStack';
import { useAuth } from '../context/AuthContext';
import { fetchTasks, updateTask, deleteTask, SortMode } from '../services/taskService';
import { Task, Priority } from '../types';
import TaskCard from '../components/TaskCard';
import FilterBar, { StatusFilter } from '../components/FilterBar';
import { colors, spacing, typography, radius, shadow } from '../theme/colors';

type Props = NativeStackScreenProps<AppStackParamList, 'TaskList'>;

const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<StatusFilter>('all');
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortMode>('smart');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const loadTasks = useCallback(async (mode: SortMode) => {
    try {
      const data = await fetchTasks(mode);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Could not load tasks. Is the backend running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks(sortBy);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy]),
  );

  const handleSortChange = (mode: SortMode) => {
    setSortBy(mode);
    setLoading(true);
    loadTasks(mode);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTasks(sortBy);
  };

  const handleToggleComplete = async (task: Task) => {
    setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, completed: !t.completed } : t)));
    try {
      await updateTask(task.id, { completed: !task.completed });
    } catch {
      loadTasks(sortBy);
    }
  };

  const handleDelete = (task: Task) => {
    Alert.alert('Delete task?', `"${task.title}" will be permanently deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setTasks(prev => prev.filter(t => t.id !== task.id));
          try {
            await deleteTask(task.id);
          } catch {
            loadTasks(sortBy);
          }
        },
      },
    ]);
  };

  // All tags seen across the currently loaded tasks, for the tag filter row.
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => t.tags.forEach(tag => set.add(tag)));
    return Array.from(set).sort();
  }, [tasks]);

  // Client-side filtering — instant, no network round-trip.
  const visibleTasks = useMemo(() => {
    return tasks.filter(t => {
      if (status === 'active' && t.completed) return false;
      if (status === 'completed' && !t.completed) return false;
      if (priority !== 'all' && t.priority !== priority) return false;
      if (selectedTag && !t.tags.includes(selectedTag)) return false;
      return true;
    });
  }, [tasks, status, priority, selectedTag]);

  return (
    <View style={styles.container}>
      <View style={styles.heroShape} pointerEvents="none" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your Tasks</Text>
          <Text style={styles.subtitle}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <FilterBar
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        tags={availableTags}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={visibleTasks}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyCircle}>
                <Text style={styles.emptyIcon}>✓</Text>
              </View>
              <Text style={styles.emptyText}>
                {tasks.length === 0 ? 'No tasks yet — tap + to add one.' : 'No tasks match these filters.'}
              </Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            onPress={task => navigation.navigate('AddEditTask', { taskId: task.id })}
          />
        )}
      />

      <TouchableOpacity
        style={[styles.fab, shadow.card]}
        onPress={() => navigation.navigate('AddEditTask', undefined)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroShape: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primary,
    opacity: 0.12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 1.5,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logout: {
    color: colors.primary,
    ...typography.body,
  },
  error: {
    color: colors.danger,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
  },
  emptyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyIcon: {
    fontSize: 28,
    color: colors.textMuted,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: colors.textPrimary,
    fontSize: 28,
    lineHeight: 30,
  },
});

export default TaskListScreen;