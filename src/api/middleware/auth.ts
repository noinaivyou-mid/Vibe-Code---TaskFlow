import type { NextFunction, Request, Response } from 'express';
import { requireAuth as baseRequireAuth } from '../../middleware/auth';
import { forbidden, notFound, unauthorized } from '../lib/http';
import { prisma } from '../lib/prisma';

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  return baseRequireAuth(req, _res, next);
}

export async function requireProjectMember(req: Request, _res: Response, next: NextFunction) {
  const userId = req.auth?.userId;
  const projectId = req.params.projectId;

  if (!userId) {
    return next(unauthorized());
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, archivedAt: true },
  });

  if (!project || project.archivedAt) {
    return next(notFound('Project not found'));
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!membership) {
    return next(forbidden('You are not a member of this project'));
  }

  return next();
}

export async function requireProjectOwner(req: Request, _res: Response, next: NextFunction) {
  const userId = req.auth?.userId;
  const projectId = req.params.projectId;

  if (!userId) {
    return next(unauthorized());
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!membership) {
    return next(forbidden('You are not a member of this project'));
  }

  if (membership.role !== 'OWNER') {
    return next(forbidden('Project owner access required'));
  }

  return next();
}
