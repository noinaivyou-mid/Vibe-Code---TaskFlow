import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/async-handler';

export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.get('/', asyncHandler(userController.listUsers));
userRouter.get('/me', asyncHandler(userController.getMe));
userRouter.patch('/me', asyncHandler(userController.updateMe));
userRouter.patch('/me/preferences', asyncHandler(userController.updatePreferences));
