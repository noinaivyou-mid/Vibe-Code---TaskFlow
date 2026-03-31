import type { Prisma } from '@prisma/client';
import { ProjectMembershipRole } from '@prisma/client';
import {
  endOfWeek,
  isPast,
  isToday,
  isWithinInterval,
  startOfWeek,
} from 'date-fns';
import { combineDueAt, splitDueAt } from '../lib/dates';
import { conflict, forbidden, notFound } from '../lib/http';
import { apiTaskPriorityToDb, apiTaskStatusToDb } from '../lib/mappers';
import { prisma } from '../lib/prisma';
import { serializeComment, serializeTask } from '../lib/serializers';

const taskInclude = {
  assignee: true,
  createdBy: true,
  comments: {
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'asc' as const,
    },
  },
  project: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.TaskInclude;

async function ensureAssigneeIsProjectMember(projectId: string, assigneeId: string) {
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: assigneeId,
      },
    },
    include: {
      user: true,
    },
  });

  if (!member || !member.user.isActive) {
    throw conflict('Assignee must be an active member of the project');
  }
}

async function getTaskForMember(taskId: string, currentUserId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      deletedAt: null,
      project: {
        memberships: {
          some: {
            userId: currentUserId,
          },
        },
      },
    },
    include: taskInclude,
  });

  if (!task) {
    throw notFound('Task not found');
  }

  return task;
}

async function isProjectOwner(projectId: string, userId: string) {
  const membership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  return membership?.role === ProjectMembershipRole.OWNER;
}

export async function listProjectTasks(
  projectId: string,
  filters: { q?: string; status?: string; priority?: string; assigneeId?: string },
) {
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      deletedAt: null,
      ...(filters.status ? { status: apiTaskStatusToDb(filters.status) } : {}),
      ...(filters.priority ? { priority: apiTaskPriorityToDb(filters.priority) } : {}),
      ...(filters.assigneeId ? { assigneeId: filters.assigneeId } : {}),
      ...(filters.q
        ? {
            OR: [
              { title: { contains: filters.q } },
              { description: { contains: filters.q } },
            ],
          }
        : {}),
    },
    include: taskInclude,
    orderBy: [{ status: 'asc' }, { dueAt: 'asc' }, { createdAt: 'desc' }],
  });

  return tasks.map(serializeTask);
}

export async function createTask(
  projectId: string,
  currentUserId: string,
  input: {
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    assigneeId: string;
    dueDate?: string | null;
    dueTime?: string | null;
  },
) {
  await ensureAssigneeIsProjectMember(projectId, input.assigneeId);
  const status = apiTaskStatusToDb(input.status);

  const task = await prisma.task.create({
    data: {
      projectId,
      title: input.title,
      description: input.description ?? '',
      status,
      priority: apiTaskPriorityToDb(input.priority),
      assigneeId: input.assigneeId,
      createdById: currentUserId,
      dueAt: combineDueAt(input.dueDate, input.dueTime),
      completedAt: status === 'DONE' ? new Date() : null,
    },
    include: taskInclude,
  });

  return serializeTask(task);
}

export async function getTask(taskId: string, currentUserId: string) {
  const task = await getTaskForMember(taskId, currentUserId);
  return serializeTask(task);
}

export async function updateTask(
  taskId: string,
  currentUserId: string,
  input: {
    title?: string;
    description?: string | null;
    status?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: string | null;
    dueTime?: string | null;
  },
) {
  const existingTask = await getTaskForMember(taskId, currentUserId);

  if (input.assigneeId) {
    await ensureAssigneeIsProjectMember(existingTask.projectId, input.assigneeId);
  }

  const nextStatus = input.status ? apiTaskStatusToDb(input.status) : existingTask.status;
  const fallbackDue = splitDueAt(existingTask.dueAt);

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description ?? '' } : {}),
      ...(input.status !== undefined ? { status: nextStatus } : {}),
      ...(input.priority !== undefined ? { priority: apiTaskPriorityToDb(input.priority) } : {}),
      ...(input.assigneeId !== undefined ? { assigneeId: input.assigneeId } : {}),
      ...(input.dueDate !== undefined || input.dueTime !== undefined
        ? {
            dueAt: combineDueAt(
              input.dueDate ?? fallbackDue.dueDate,
              input.dueTime ?? fallbackDue.dueTime,
            ),
          }
        : {}),
      completedAt: nextStatus === 'DONE' ? existingTask.completedAt ?? new Date() : null,
    },
    include: taskInclude,
  });

  return serializeTask(task);
}

export async function updateTaskStatus(taskId: string, currentUserId: string, input: { status: string }) {
  const existingTask = await getTaskForMember(taskId, currentUserId);
  const nextStatus = apiTaskStatusToDb(input.status);

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: nextStatus,
      completedAt: nextStatus === 'DONE' ? existingTask.completedAt ?? new Date() : null,
    },
    include: taskInclude,
  });

  return serializeTask(task);
}

export async function deleteTask(taskId: string, currentUserId: string) {
  await getTaskForMember(taskId, currentUserId);

  await prisma.task.update({
    where: { id: taskId },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function listMyTasks(
  currentUserId: string,
  filters: { q?: string; group: 'today' | 'this-week' | 'later' | 'overdue' | 'completed' | 'all' },
) {
  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: currentUserId,
      deletedAt: null,
    },
    include: taskInclude,
    orderBy: [{ dueAt: 'asc' }, { createdAt: 'desc' }],
  });

  const normalizedQuery = filters.q?.toLowerCase();
  const queried = normalizedQuery
    ? tasks.filter((task) => {
        const projectName = task.project?.name ?? '';
        return `${task.title} ${projectName}`.toLowerCase().includes(normalizedQuery);
      })
    : tasks;

  const now = new Date();
  const weekWindow = {
    start: startOfWeek(now),
    end: endOfWeek(now),
  };

  const filtered = queried.filter((task) => {
    if (filters.group === 'all') {
      return true;
    }

    const dueAt = task.dueAt;
    const isCompleted = task.status === 'DONE';

    if (filters.group === 'completed') {
      return isCompleted;
    }

    if (isCompleted || !dueAt) {
      return false;
    }

    if (filters.group === 'today') {
      return isToday(dueAt);
    }

    if (filters.group === 'this-week') {
      return !isToday(dueAt) && isWithinInterval(dueAt, weekWindow);
    }

    if (filters.group === 'later') {
      return !isToday(dueAt) && !isWithinInterval(dueAt, weekWindow) && !isPast(dueAt);
    }

    if (filters.group === 'overdue') {
      return isPast(dueAt) && !isToday(dueAt);
    }

    return true;
  });

  return filtered.map(serializeTask);
}

export async function addComment(taskId: string, currentUserId: string, input: { body: string }) {
  await getTaskForMember(taskId, currentUserId);

  const comment = await prisma.taskComment.create({
    data: {
      taskId,
      userId: currentUserId,
      body: input.body,
    },
    include: {
      user: true,
    },
  });

  return serializeComment(comment);
}

export async function updateComment(
  taskId: string,
  commentId: string,
  currentUserId: string,
  input: { body: string },
) {
  const comment = await prisma.taskComment.findFirst({
    where: {
      id: commentId,
      taskId,
      task: {
        deletedAt: null,
      },
    },
    include: {
      user: true,
      task: true,
    },
  });

  if (!comment) {
    throw notFound('Comment not found');
  }

  const owner = await isProjectOwner(comment.task.projectId, currentUserId);

  if (comment.userId !== currentUserId && !owner) {
    throw forbidden('Only the comment author or a project owner can edit this comment');
  }

  const updatedComment = await prisma.taskComment.update({
    where: { id: commentId },
    data: {
      body: input.body,
    },
    include: {
      user: true,
    },
  });

  return serializeComment(updatedComment);
}

export async function deleteComment(taskId: string, commentId: string, currentUserId: string) {
  const comment = await prisma.taskComment.findFirst({
    where: {
      id: commentId,
      taskId,
      task: {
        deletedAt: null,
      },
    },
    include: {
      task: true,
    },
  });

  if (!comment) {
    throw notFound('Comment not found');
  }

  const owner = await isProjectOwner(comment.task.projectId, currentUserId);

  if (comment.userId !== currentUserId && !owner) {
    throw forbidden('Only the comment author or a project owner can delete this comment');
  }

  await prisma.taskComment.delete({
    where: { id: commentId },
  });
}
