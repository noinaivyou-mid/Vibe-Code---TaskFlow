import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import * as taskController from '../controllers/task.controller';
import { requireAuth, requireProjectMember, requireProjectOwner } from '../middleware/auth';
import { asyncHandler } from '../middleware/async-handler';

export const projectRouter = Router();

projectRouter.use(requireAuth);

projectRouter.get('/', asyncHandler(projectController.listProjects));
projectRouter.post('/', asyncHandler(projectController.createProject));
projectRouter.get('/:projectId', requireProjectMember, asyncHandler(projectController.getProject));
projectRouter.patch('/:projectId', requireProjectOwner, asyncHandler(projectController.updateProject));
projectRouter.delete('/:projectId', requireProjectOwner, asyncHandler(projectController.deleteProject));

projectRouter.get(
  '/:projectId/members',
  requireProjectMember,
  asyncHandler(projectController.listProjectMembers),
);
projectRouter.post(
  '/:projectId/members',
  requireProjectOwner,
  asyncHandler(projectController.addProjectMember),
);
projectRouter.patch(
  '/:projectId/members/:userId',
  requireProjectOwner,
  asyncHandler(projectController.updateProjectMember),
);
projectRouter.delete(
  '/:projectId/members/:userId',
  requireProjectOwner,
  asyncHandler(projectController.deleteProjectMember),
);

projectRouter.get(
  '/:projectId/tasks',
  requireProjectMember,
  asyncHandler(taskController.listProjectTasks),
);
projectRouter.post(
  '/:projectId/tasks',
  requireProjectMember,
  asyncHandler(taskController.createTask),
);
