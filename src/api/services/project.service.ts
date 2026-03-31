import { ProjectMembershipRole } from '@prisma/client';
import { conflict, notFound } from '../lib/http';
import { prisma } from '../lib/prisma';
import { serializeProject, serializeUser } from '../lib/serializers';

async function getProjectOrThrow(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
      tasks: true,
    },
  });

  if (!project) {
    throw notFound('Project not found');
  }

  return project;
}

export async function listProjects(currentUserId: string) {
  const projects = await prisma.project.findMany({
    where: {
      archivedAt: null,
      memberships: {
        some: { userId: currentUserId },
      },
    },
    include: {
      memberships: {
        include: { user: true },
      },
      tasks: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return projects.map(serializeProject);
}

export async function createProject(
  currentUserId: string,
  input: { name: string; description?: string | null },
) {
  const project = await prisma.project.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      ownerId: currentUserId,
      createdById: currentUserId,
      memberships: {
        create: {
          userId: currentUserId,
          role: ProjectMembershipRole.OWNER,
        },
      },
    },
    include: {
      memberships: {
        include: { user: true },
      },
      tasks: true,
    },
  });

  return serializeProject(project);
}

export async function getProject(projectId: string) {
  const project = await getProjectOrThrow(projectId);
  return serializeProject(project);
}

export async function updateProject(
  projectId: string,
  input: { name?: string; description?: string | null; archivedAt?: string | null },
) {
  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.archivedAt !== undefined
        ? { archivedAt: input.archivedAt ? new Date(input.archivedAt) : null }
        : {}),
    },
    include: {
      memberships: {
        include: { user: true },
      },
      tasks: true,
    },
  });

  return serializeProject(project);
}

export async function deleteProject(projectId: string) {
  await prisma.project.delete({
    where: { id: projectId },
  });
}

export async function listProjectMembers(projectId: string) {
  const memberships = await prisma.projectMember.findMany({
    where: { projectId },
    include: { user: true },
    orderBy: [{ role: 'asc' }, { user: { name: 'asc' } }],
  });

  return memberships.map((membership) => ({
    role: membership.role,
    joinedAt: membership.joinedAt.toISOString(),
    user: serializeUser(membership.user),
  }));
}

export async function addProjectMember(
  projectId: string,
  input: { userId: string; role: 'OWNER' | 'MEMBER' },
) {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
  });

  if (!user || !user.isActive) {
    throw notFound('User not found');
  }

  const existingMembership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: input.userId,
      },
    },
  });

  if (existingMembership) {
    throw conflict('User is already a project member');
  }

  const membership = await prisma.projectMember.create({
    data: {
      projectId,
      userId: input.userId,
      role: input.role,
    },
    include: { user: true },
  });

  return {
    role: membership.role,
    joinedAt: membership.joinedAt.toISOString(),
    user: serializeUser(membership.user),
  };
}

export async function updateProjectMemberRole(
  projectId: string,
  userId: string,
  input: { role: 'OWNER' | 'MEMBER' },
) {
  const membership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
    include: { user: true },
  });

  if (!membership) {
    throw notFound('Project member not found');
  }

  if (membership.role === ProjectMembershipRole.OWNER && input.role === 'MEMBER') {
    const ownerCount = await prisma.projectMember.count({
      where: {
        projectId,
        role: ProjectMembershipRole.OWNER,
      },
    });

    if (ownerCount <= 1) {
      throw conflict('A project must have at least one owner');
    }
  }

  const updatedMembership = await prisma.projectMember.update({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
    data: {
      role: input.role,
    },
    include: { user: true },
  });

  return {
    role: updatedMembership.role,
    joinedAt: updatedMembership.joinedAt.toISOString(),
    user: serializeUser(updatedMembership.user),
  };
}

export async function removeProjectMember(projectId: string, userId: string) {
  const membership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!membership) {
    throw notFound('Project member not found');
  }

  if (membership.role === ProjectMembershipRole.OWNER) {
    const ownerCount = await prisma.projectMember.count({
      where: {
        projectId,
        role: ProjectMembershipRole.OWNER,
      },
    });

    if (ownerCount <= 1) {
      throw conflict('A project must have at least one owner');
    }
  }

  const assignedTaskCount = await prisma.task.count({
    where: {
      projectId,
      assigneeId: userId,
      deletedAt: null,
    },
  });

  if (assignedTaskCount > 0) {
    throw conflict('Reassign this member’s tasks before removing them from the project');
  }

  await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });
}
