import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../api/lib/prisma';
import { verifyToken } from '../utils/jwt';

function unauthorized(res: Response, message: string) {
  return res.status(401).json({
    error: {
      code: 'UNAUTHORIZED',
      message,
    },
  });
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return unauthorized(res, 'Missing bearer token');
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = verifyToken(token);
    const userId = payload.sub;

    if (!userId) {
      return unauthorized(res, 'Invalid token payload');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        roleLabel: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return unauthorized(res, 'User not found or inactive');
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      roleLabel: user.roleLabel,
      isActive: user.isActive,
    };

    req.auth = {
      userId: user.id,
      email: user.email,
    };

    return next();
  } catch {
    return unauthorized(res, 'Invalid or expired token');
  }
}
