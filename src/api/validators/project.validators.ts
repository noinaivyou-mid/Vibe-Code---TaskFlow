import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).nullable().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  archivedAt: z.union([z.string().datetime(), z.null()]).optional(),
});

export const addProjectMemberSchema = z.object({
  userId: z.string().trim().min(1),
  role: z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
});

export const updateProjectMemberSchema = z.object({
  role: z.enum(['OWNER', 'MEMBER']),
});
