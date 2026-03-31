import type { Request, Response } from 'express';
import { parseWithSchema } from '../lib/http';
import * as userService from '../services/user.service';
import {
  updatePreferencesSchema,
  updateProfileSchema,
  userQuerySchema,
} from '../validators/user.validators';

export async function listUsers(req: Request, res: Response) {
  const query = parseWithSchema(userQuerySchema, req.query);
  const users = await userService.listVisibleUsers(req.auth!.userId, query.q);
  res.json({ users });
}

export async function getMe(req: Request, res: Response) {
  const data = await userService.getCurrentUser(req.auth!.userId);
  res.json(data);
}

export async function updateMe(req: Request, res: Response) {
  const input = parseWithSchema(updateProfileSchema, req.body);
  const user = await userService.updateCurrentUser(req.auth!.userId, input);
  res.json({ user });
}

export async function updatePreferences(req: Request, res: Response) {
  const input = parseWithSchema(updatePreferencesSchema, req.body);
  const preferences = await userService.updatePreferences(req.auth!.userId, input);
  res.json({ preferences });
}
