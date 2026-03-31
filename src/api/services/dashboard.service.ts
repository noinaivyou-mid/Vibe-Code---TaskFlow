import { isPast, isToday } from 'date-fns';
import { dbTaskPriorityToApi, dbTaskStatusToApi } from '../lib/mappers';
import { prisma } from '../lib/prisma';

export async function getDashboardSummary(currentUserId: string) {
  const myTasks = await prisma.task.findMany({
    where: {
      assigneeId: currentUserId,
      deletedAt: null,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const stats = {
    dueToday: myTasks.filter((task) => task.dueAt && isToday(task.dueAt) && task.status !== 'DONE').length,
    overdue: myTasks.filter(
      (task) => task.dueAt && isPast(task.dueAt) && !isToday(task.dueAt) && task.status !== 'DONE',
    ).length,
    completed: myTasks.filter((task) => task.status === 'DONE').length,
    totalTasks: myTasks.length,
  };

  const statusDistribution = Object.entries(
    myTasks.reduce<Record<string, number>>((accumulator, task) => {
      const key = dbTaskStatusToApi(task.status);
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const priorityDistribution = Object.entries(
    myTasks.reduce<Record<string, number>>((accumulator, task) => {
      const key = dbTaskPriorityToApi(task.priority);
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const projectMemberships = await prisma.project.findMany({
    where: {
      archivedAt: null,
      memberships: {
        some: {
          userId: currentUserId,
        },
      },
    },
    include: {
      tasks: {
        where: {
          deletedAt: null,
        },
      },
    },
  });

  const projectProgress = projectMemberships.map((project) => {
    const total = project.tasks.length;
    const done = project.tasks.filter((task) => task.status === 'DONE').length;
    return {
      projectId: project.id,
      projectName: project.name,
      total,
      completed: done,
      percent: total ? Math.round((done / total) * 100) : 0,
    };
  });

  const recentActivity = await prisma.taskComment.findMany({
    where: {
      task: {
        deletedAt: null,
        project: {
          memberships: {
            some: {
              userId: currentUserId,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
    include: {
      user: true,
      task: {
        include: {
          project: true,
        },
      },
    },
  });

  return {
    stats,
    statusDistribution,
    priorityDistribution,
    projectProgress,
    recentActivity: recentActivity.map((comment) => ({
      id: comment.id,
      user: comment.user.name,
      taskId: comment.taskId,
      taskTitle: comment.task.title,
      projectId: comment.task.projectId,
      projectName: comment.task.project.name,
      text: comment.body,
      createdAt: comment.createdAt.toISOString(),
    })),
  };
}
