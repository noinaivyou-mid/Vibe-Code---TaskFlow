import type { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../lib/env';
import { getRefreshCookieOptions } from '../lib/auth';
import { parseWithSchema } from '../lib/http';
import * as authService from '../services/auth.service';
import { loginSchema, registerSchema } from '../validators/auth.validators';

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie(env.refreshCookieName, refreshToken, getRefreshCookieOptions());
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(env.refreshCookieName, getRefreshCookieOptions());
}

export async function register(req: Request, res: Response) {
  const input: z.infer<typeof registerSchema> = parseWithSchema(registerSchema, req.body);
  const result = await authService.register(input, req);
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json({
    accessToken: result.accessToken,
    user: result.user,
    preferences: result.preferences,
  });
}

export async function login(req: Request, res: Response) {
  const input: z.infer<typeof loginSchema> = parseWithSchema(loginSchema, req.body);
  const result = await authService.login(input, req);
  setRefreshCookie(res, result.refreshToken);
  res.json({
    accessToken: result.accessToken,
    user: result.user,
    preferences: result.preferences,
  });
}

export async function refresh(req: Request, res: Response) {
  const result = await authService.refresh(req.cookies[env.refreshCookieName], req);
  setRefreshCookie(res, result.refreshToken);
  res.json({
    accessToken: result.accessToken,
    user: result.user,
    preferences: result.preferences,
  });
}

export async function logout(req: Request, res: Response) {
  await authService.logout(req.cookies[env.refreshCookieName]);
  clearRefreshCookie(res);
  res.status(204).send();
}

export async function me(req: Request, res: Response) {
  const data = await authService.getCurrentSessionUser(req.auth!.userId);
  res.json(data);
}
