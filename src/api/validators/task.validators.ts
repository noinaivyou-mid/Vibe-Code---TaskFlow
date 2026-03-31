import { z } from 'zod';

const nullableTrimmedString = z
  .string()
  .transform((value) => value.trim())
  .nullable()
  .optional();

export const projectTaskQuerySchema = z.object({
  q: z.string().trim().optional(),
  status: z.enum(['To-Do', 'In Progress', 'Done', 'Stuck']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  assigneeId: z.string().trim().optional(),
});

export const taskBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: nullableTrimmedString,
  status: z.enum(['To-Do', 'In Progress', 'Done', 'Stuck']),
  priority: z.enum(['Low', 'Medium', 'High']),
  assigneeId: z.string().trim().min(1),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
});

export const updateTaskBodySchema = taskBodySchema.partial();

export const updateTaskStatusSchema = z.object({
  status: z.enum(['To-Do', 'In Progress', 'Done', 'Stuck']),
});

export const myTasksQuerySchema = z.object({
  q: z.string().trim().optional(),
  group: z.enum(['today', 'this-week', 'later', 'overdue', 'completed', 'all']).default('all'),
});

export const commentBodySchema = z.object({
  body: z.string().trim().min(1).max(5000),
});
