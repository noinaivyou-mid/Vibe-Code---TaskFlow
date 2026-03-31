import type {
  AuthSession,
  Project,
  ProjectMember,
  Task,
  TaskComment,
  User,
  UserPreference,
} from '@prisma/client';
import { splitDueAt } from './dates';
import { dbMembershipRoleToApi, dbTaskPriorityToApi, dbTaskStatusToApi, dbThemeToApi } from './mappers';

type PublicUser = Pick<User, 'id' | 'email' | 'name' | 'avatarUrl' | 'roleLabel'>;

type SerializedComment = TaskComment & {
  user: User;
};

type SerializedTask = Task & {
  assignee: User;
  createdBy: User;
  comments?: SerializedComment[];
  project?: Pick<Project, 'id' | 'name'>;
};

type SerializedProject = Project & {
  memberships?: Array<ProjectMember & { user: User }>;
  tasks?: Task[];
};

export function serializeUser(user: PublicUser) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatarUrl,
    avatarUrl: user.avatarUrl,
    role: user.roleLabel,
    roleLabel: user.roleLabel,
  };
}

export function serializePreferences(preferences: UserPreference) {
  return {
    theme: dbThemeToApi(preferences.theme),
    compactView: preferences.compactView,
    emailNotifications: preferences.emailNotifications,
    pushNotifications: preferences.pushNotifications,
    taskReminders: preferences.taskReminders,
    weeklySummary: preferences.weeklySummary,
  };
}

export function serializeComment(comment: SerializedComment) {
  return {
    id: comment.id,
    user: comment.user.name,
    text: comment.body,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    author: serializeUser(comment.user),
  };
}

export function serializeTask(task: SerializedTask) {
  const { dueDate, dueTime } = splitDueAt(task.dueAt);
  const comments = task.comments?.map(serializeComment) ?? [];

  return {
    id: task.id,
    title: task.title,
    description: task.description ?? '',
    status: dbTaskStatusToApi(task.status),
    priority: dbTaskPriorityToApi(task.priority),
    assignee: serializeUser(task.assignee),
    createdBy: serializeUser(task.createdBy),
    projectId: task.projectId,
    project: task.project
      ? {
          id: task.project.id,
          name: task.project.name,
        }
      : undefined,
    dueDate,
    dueTime,
    comments,
    commentCount: comments.length,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    completedAt: task.completedAt?.toISOString() ?? null,
    deletedAt: task.deletedAt?.toISOString() ?? null,
  };
}

export function serializeProject(project: SerializedProject) {
  const tasks = (project.tasks ?? []).filter((task) => !task.deletedAt);
  const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
  const totalTasks = tasks.length;

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    ownerId: project.ownerId,
    createdById: project.createdById,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    archivedAt: project.archivedAt?.toISOString() ?? null,
    memberCount: project.memberships?.length ?? 0,
    members:
      project.memberships?.map((membership) => ({
        role: dbMembershipRoleToApi(membership.role),
        joinedAt: membership.joinedAt.toISOString(),
        user: serializeUser(membership.user),
      })) ?? [],
    taskCounts: {
      total: totalTasks,
      completed: completedTasks,
      open: totalTasks - completedTasks,
    },
    completionPercent: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
  };
}

export function serializeAuthSession(session: AuthSession) {
  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt.toISOString(),
    revokedAt: session.revokedAt?.toISOString() ?? null,
    createdAt: session.createdAt.toISOString(),
    lastUsedAt: session.lastUsedAt.toISOString(),
  };
}
