import bcrypt from 'bcrypt';
import type { Request } from 'express';
import { env } from '../lib/env';
import { generateRefreshToken, hashToken, signAccessToken } from '../lib/auth';
import { conflict, unauthorized } from '../lib/http';
import { prisma } from '../lib/prisma';
import { serializePreferences, serializeUser } from '../lib/serializers';

function buildSessionMeta(req: Request) {
  return {
    userAgent: req.headers['user-agent'] || null,
    ipAddress: req.ip || req.socket.remoteAddress || null,
  };
}

async function createSession(userId: string, req: Request) {
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000);

  await prisma.authSession.create({
    data: {
      userId,
      refreshTokenHash,
      expiresAt,
      ...buildSessionMeta(req),
    },
  });

  return refreshToken;
}

export async function register(input: { email?: string; password: string; name: string }, req: Request) {
  if (!input.email) {
    throw unauthorized('Email is required');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw conflict('An account with that email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const avatarUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(input.email)}`;

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      avatarUrl,
      preferences: {
        create: {},
      },
    },
    include: {
      preferences: true,
    },
  });

  const refreshToken = await createSession(user.id, req);
  const accessToken = signAccessToken(user.id, user.email);

  return {
    accessToken,
    refreshToken,
    user: serializeUser(user),
    preferences: serializePreferences(user.preferences!),
  };
}

export async function login(input: { email?: string; password: string }, req: Request) {
  if (!input.email) {
    throw unauthorized('Email is required');
  }

  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { preferences: true },
  });

  if (!user || !user.isActive) {
    throw unauthorized('Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);

  if (!isValidPassword) {
    throw unauthorized('Invalid email or password');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const refreshToken = await createSession(user.id, req);
  const accessToken = signAccessToken(user.id, user.email);

  return {
    accessToken,
    refreshToken,
    user: serializeUser(user),
    preferences: serializePreferences(user.preferences!),
  };
}

export async function refresh(refreshToken: string | undefined, req: Request) {
  if (!refreshToken) {
    throw unauthorized('Refresh token is required');
  }

  const session = await prisma.authSession.findFirst({
    where: {
      refreshTokenHash: hashToken(refreshToken),
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        include: {
          preferences: true,
        },
      },
    },
  });

  if (!session || !session.user.isActive) {
    throw unauthorized('Refresh session is invalid or expired');
  }

  const nextRefreshToken = generateRefreshToken();

  await prisma.authSession.update({
    where: { id: session.id },
    data: {
      refreshTokenHash: hashToken(nextRefreshToken),
      expiresAt: new Date(Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000),
      lastUsedAt: new Date(),
      ...buildSessionMeta(req),
    },
  });

  return {
    accessToken: signAccessToken(session.user.id, session.user.email),
    refreshToken: nextRefreshToken,
    user: serializeUser(session.user),
    preferences: serializePreferences(session.user.preferences!),
  };
}

export async function logout(refreshToken: string | undefined) {
  if (!refreshToken) {
    return;
  }

  await prisma.authSession.updateMany({
    where: {
      refreshTokenHash: hashToken(refreshToken),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function getCurrentSessionUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  });

  if (!user || !user.preferences) {
    throw unauthorized();
  }

  return {
    user: serializeUser(user),
    preferences: serializePreferences(user.preferences),
  };
}
