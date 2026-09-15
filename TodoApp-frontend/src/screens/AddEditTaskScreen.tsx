/**
 * screens/AddEditTaskScreen.tsx
 *
 * Handles both creating a new task and editing an existing one — if
 * route.params.taskId is present, it loads that task and calls
 * updateTask() on save; otherwise it calls createTask().
 *
 * Date/deadline are plain text fields (format: YYYY-MM-DDTHH:mm) rather
 * than a native date picker, to avoid adding another native dependency
 * on top of everything already installed.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppStack';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { colors, spacing, radius, typography } from '../theme/colors';
import { Priority } from '../types';
import { createTask, updateTask, fetchTask, deleteTask } from '../services/taskService';

type Props = NativeStackScreenProps<AppStackParamList, 'AddEditTask'>;

const PRIORITY_OPTIONS: Priority[] = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];
const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.HIGH]: colors.danger,
  [Priority.MEDIUM]: colors.warning,
  [Priority.LOW]: colors.success,
};

const AddEditTaskScreen: React.FC<Props> = ({ route, navigation }) => {
  const taskId = route.params?.taskId;
  const isEditing = !!taskId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [tags, setTags] = useState('');

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;
    fetchTask(taskId)
      .then(task => {
        setTitle(task.title);
        setDescription(task.description ?? '');
        setDateTime(task.dateTime.slice(0, 16));
        setDeadline(task.deadline.slice(0, 16));
        setPriority(task.priority);
        setTags(task.tags.join(', '));
      })
      .catch(() => setError('Could not load this task.'))
      .finally(() => setLoading(false));
  }, [taskId]);

  const handleSave = async () => {
    setError(null);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!dateTime.trim() || !deadline.trim()) {
      setError('Please fill in both the date/time and deadline fields.');
      return;
    }

    // Validate BEFORE calling toISOString() — an invalid Date's
    // toISOString() throws immediately, which previously happened
    // before this check ever ran.
    const parsedDateTime = new Date(dateTime);
    const parsedDeadline = new Date(deadline);

    if (isNaN(parsedDateTime.getTime()) || isNaN(parsedDeadline.getTime())) {
      setError('Use the format YYYY-MM-DDTHH:mm for both dates, e.g. 2026-09-20T14:30');
      return;
    }

    const input = {
      title: title.trim(),
      description: description.trim(),
      dateTime: parsedDateTime.toISOString(),
      deadline: parsedDeadline.toISOString(),
      priority,
      tags: tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      if (isEditing && taskId) {
        await updateTask(taskId, input);
      } else {
        await createTask(input);
      }
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the task.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!taskId) return;
    Alert.alert('Delete task?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(taskId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>{isEditing ? 'Edit Task' : 'New Task'}</Text>

      <AppTextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <AppTextInput
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <AppTextInput
        placeholder="Date/time: 2026-09-20T14:30"
        value={dateTime}
        onChangeText={setDateTime}
      />
      <AppTextInput
        placeholder="Deadline: 2026-09-21T18:00"
        value={deadline}
        onChangeText={setDeadline}
      />
      <AppTextInput
        placeholder="Tags, comma separated (e.g. work, urgent)"
        value={tags}
        onChangeText={setTags}
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {PRIORITY_OPTIONS.map(option => (
          <TouchableOpacity
            key={option}
            onPress={() => setPriority(option)}
            style={[
              styles.priorityChip,
              {
                backgroundColor:
                  priority === option ? PRIORITY_COLORS[option] : colors.surface,
              },
            ]}
          >
            <Text style={styles.priorityChipText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton title="Save Task" onPress={handleSave} loading={saving} />

      {isEditing && (
        <AppButton
          title="Delete Task"
          variant="secondary"
          onPress={handleDelete}
          style={{ marginTop: spacing.md, borderColor: colors.danger }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  priorityRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  priorityChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },
  priorityChipText: {
    color: colors.textPrimary,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.md,
  },
});

export default AddEditTaskScreen;