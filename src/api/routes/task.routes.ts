import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/async-handler';

export const taskRouter = Router();

taskRouter.use(requireAuth);
taskRouter.get('/my', asyncHandler(taskController.listMyTasks));
taskRouter.get('/:taskId', asyncHandler(taskController.getTask));
taskRouter.patch('/:taskId', asyncHandler(taskController.updateTask));
taskRouter.patch('/:taskId/status', asyncHandler(taskController.updateTaskStatus));
taskRouter.delete('/:taskId', asyncHandler(taskController.deleteTask));
taskRouter.post('/:taskId/comments', asyncHandler(taskController.addComment));
taskRouter.patch('/:taskId/comments/:commentId', asyncHandler(taskController.updateComment));
taskRouter.delete('/:taskId/comments/:commentId', asyncHandler(taskController.deleteComment));
