import { z } from 'zod';

export const userQuerySchema = z.object({
  q: z.string().trim().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  roleLabel: z.string().trim().max(120).nullable().optional(),
  avatarUrl: z.string().trim().url().nullable().optional(),
});

export const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  compactView: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  taskReminders: z.boolean().optional(),
  weeklySummary: z.boolean().optional(),
});
