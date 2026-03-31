import type { Request, Response } from 'express';
import { parseWithSchema } from '../lib/http';
import * as taskService from '../services/task.service';
import {
  commentBodySchema,
  myTasksQuerySchema,
  projectTaskQuerySchema,
  taskBodySchema,
  updateTaskBodySchema,
  updateTaskStatusSchema,
} from '../validators/task.validators';

export async function listProjectTasks(req: Request, res: Response) {
  const filters = parseWithSchema(projectTaskQuerySchema, req.query);
  const tasks = await taskService.listProjectTasks(req.params.projectId, filters);
  res.json({ tasks });
}

export async function createTask(req: Request, res: Response) {
  const input = parseWithSchema(taskBodySchema, req.body);
  const task = await taskService.createTask(req.params.projectId, req.auth!.userId, input);
  res.status(201).json({ task });
}

export async function getTask(req: Request, res: Response) {
  const task = await taskService.getTask(req.params.taskId, req.auth!.userId);
  res.json({ task });
}

export async function updateTask(req: Request, res: Response) {
  const input = parseWithSchema(updateTaskBodySchema, req.body);
  const task = await taskService.updateTask(req.params.taskId, req.auth!.userId, input);
  res.json({ task });
}

export async function updateTaskStatus(req: Request, res: Response) {
  const input = parseWithSchema(updateTaskStatusSchema, req.body);
  const task = await taskService.updateTaskStatus(req.params.taskId, req.auth!.userId, input);
  res.json({ task });
}

export async function deleteTask(req: Request, res: Response) {
  await taskService.deleteTask(req.params.taskId, req.auth!.userId);
  res.status(204).send();
}

export async function listMyTasks(req: Request, res: Response) {
  const query = parseWithSchema(myTasksQuerySchema, req.query);
  const tasks = await taskService.listMyTasks(req.auth!.userId, query);
  res.json({ tasks });
}

export async function addComment(req: Request, res: Response) {
  const input = parseWithSchema(commentBodySchema, req.body);
  const comment = await taskService.addComment(req.params.taskId, req.auth!.userId, input);
  res.status(201).json({ comment });
}

export async function updateComment(req: Request, res: Response) {
  const input = parseWithSchema(commentBodySchema, req.body);
  const comment = await taskService.updateComment(
    req.params.taskId,
    req.params.commentId,
    req.auth!.userId,
    input,
  );
  res.json({ comment });
}

export async function deleteComment(req: Request, res: Response) {
  await taskService.deleteComment(req.params.taskId, req.params.commentId, req.auth!.userId);
  res.status(204).send();
}
