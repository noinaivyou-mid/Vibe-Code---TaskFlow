import { apiThemeToDb } from '../lib/mappers';
import { notFound } from '../lib/http';
import { prisma } from '../lib/prisma';
import { serializePreferences, serializeUser } from '../lib/serializers';

export async function listVisibleUsers(currentUserId: string, query?: string) {
  const memberships = await prisma.projectMember.findMany({
    where: { userId: currentUserId },
    select: { projectId: true },
  });

  const projectIds = memberships.map((membership) => membership.projectId);

  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      OR: [
        { id: currentUserId },
        projectIds.length
          ? {
              memberships: {
                some: {
                  projectId: { in: projectIds },
                },
              },
            }
          : { id: currentUserId },
      ],
    },
    orderBy: { name: 'asc' },
  });

  const normalizedQuery = query?.toLowerCase();
  const filteredUsers = normalizedQuery
    ? users.filter((user) => {
        const haystack = `${user.name} ${user.email} ${user.roleLabel ?? ''}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : users;

  return filteredUsers.map(serializeUser);
}

export async function getCurrentUser(currentUserId: string) {
  const user = await prisma.user.findUnique({
    where: { id: currentUserId },
    include: { preferences: true },
  });

  if (!user || !user.preferences) {
    throw notFound('User not found');
  }

  return {
    user: serializeUser(user),
    preferences: serializePreferences(user.preferences),
  };
}

export async function updateCurrentUser(
  currentUserId: string,
  input: { name?: string; roleLabel?: string | null; avatarUrl?: string | null },
) {
  const user = await prisma.user.update({
    where: { id: currentUserId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.roleLabel !== undefined ? { roleLabel: input.roleLabel } : {}),
      ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {}),
    },
  });

  return serializeUser(user);
}

export async function updatePreferences(
  currentUserId: string,
  input: {
    theme?: 'light' | 'dark';
    compactView?: boolean;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    taskReminders?: boolean;
    weeklySummary?: boolean;
  },
) {
  const preferences = await prisma.userPreference.upsert({
    where: { userId: currentUserId },
    update: {
      ...(input.theme !== undefined ? { theme: apiThemeToDb(input.theme) } : {}),
      ...(input.compactView !== undefined ? { compactView: input.compactView } : {}),
      ...(input.emailNotifications !== undefined
        ? { emailNotifications: input.emailNotifications }
        : {}),
      ...(input.pushNotifications !== undefined ? { pushNotifications: input.pushNotifications } : {}),
      ...(input.taskReminders !== undefined ? { taskReminders: input.taskReminders } : {}),
      ...(input.weeklySummary !== undefined ? { weeklySummary: input.weeklySummary } : {}),
    },
    create: {
      userId: currentUserId,
      theme: input.theme ? apiThemeToDb(input.theme) : undefined,
      compactView: input.compactView ?? false,
      emailNotifications: input.emailNotifications ?? true,
      pushNotifications: input.pushNotifications ?? true,
      taskReminders: input.taskReminders ?? true,
      weeklySummary: input.weeklySummary ?? true,
    },
  });

  return serializePreferences(preferences);
}
