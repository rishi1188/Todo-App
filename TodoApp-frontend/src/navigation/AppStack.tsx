/**
 * navigation/AppStack.tsx
 *
 * Navigation stack shown once a user is logged in: the task list, plus
 * the add/edit task screen (taskId param present = editing, absent =
 * creating a new task).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/TaskListScreen';
import AddEditTaskScreen from '../screens/AddEditTaskScreen';
import { colors } from '../theme/colors';

export type AppStackParamList = {
  TaskList: undefined;
  AddEditTask: { taskId?: string } | undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
    }}
  >
    <Stack.Screen name="TaskList" component={TaskListScreen} />
    <Stack.Screen name="AddEditTask" component={AddEditTaskScreen} />
  </Stack.Navigator>
);

export default AppStack;