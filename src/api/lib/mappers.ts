import {
  ProjectMembershipRole,
  TaskPriority,
  TaskStatus,
  Theme,
} from '@prisma/client';

const apiToDbStatusMap: Record<string, TaskStatus> = {
  'To-Do': TaskStatus.TO_DO,
  'In Progress': TaskStatus.IN_PROGRESS,
  Done: TaskStatus.DONE,
  Stuck: TaskStatus.STUCK,
};

const dbToApiStatusMap: Record<TaskStatus, string> = {
  [TaskStatus.TO_DO]: 'To-Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done',
  [TaskStatus.STUCK]: 'Stuck',
};

const apiToDbPriorityMap: Record<string, TaskPriority> = {
  Low: TaskPriority.LOW,
  Medium: TaskPriority.MEDIUM,
  High: TaskPriority.HIGH,
};

const dbToApiPriorityMap: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.HIGH]: 'High',
};

const apiToDbThemeMap: Record<string, Theme> = {
  light: Theme.LIGHT,
  dark: Theme.DARK,
};

const dbToApiThemeMap: Record<Theme, string> = {
  [Theme.LIGHT]: 'light',
  [Theme.DARK]: 'dark',
};

export function apiTaskStatusToDb(value: string) {
  return apiToDbStatusMap[value];
}

export function dbTaskStatusToApi(value: TaskStatus) {
  return dbToApiStatusMap[value];
}

export function apiTaskPriorityToDb(value: string) {
  return apiToDbPriorityMap[value];
}

export function dbTaskPriorityToApi(value: TaskPriority) {
  return dbToApiPriorityMap[value];
}

export function apiThemeToDb(value: string) {
  return apiToDbThemeMap[value];
}

export function dbThemeToApi(value: Theme) {
  return dbToApiThemeMap[value];
}

export function dbMembershipRoleToApi(value: ProjectMembershipRole) {
  return value;
}
