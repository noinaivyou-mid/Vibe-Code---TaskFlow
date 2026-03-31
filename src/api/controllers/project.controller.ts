import type { Request, Response } from 'express';
import { parseWithSchema } from '../lib/http';
import * as projectService from '../services/project.service';
import {
  addProjectMemberSchema,
  createProjectSchema,
  updateProjectMemberSchema,
  updateProjectSchema,
} from '../validators/project.validators';

export async function listProjects(req: Request, res: Response) {
  const projects = await projectService.listProjects(req.auth!.userId);
  res.json({ projects });
}

export async function createProject(req: Request, res: Response) {
  const input = parseWithSchema(createProjectSchema, req.body);
  const project = await projectService.createProject(req.auth!.userId, input);
  res.status(201).json({ project });
}

export async function getProject(req: Request, res: Response) {
  const project = await projectService.getProject(req.params.projectId);
  res.json({ project });
}

export async function updateProject(req: Request, res: Response) {
  const input = parseWithSchema(updateProjectSchema, req.body);
  const project = await projectService.updateProject(req.params.projectId, input);
  res.json({ project });
}

export async function deleteProject(req: Request, res: Response) {
  await projectService.deleteProject(req.params.projectId);
  res.status(204).send();
}

export async function listProjectMembers(req: Request, res: Response) {
  const members = await projectService.listProjectMembers(req.params.projectId);
  res.json({ members });
}

export async function addProjectMember(req: Request, res: Response) {
  const input = parseWithSchema(addProjectMemberSchema, req.body);
  const member = await projectService.addProjectMember(req.params.projectId, input);
  res.status(201).json({ member });
}

export async function updateProjectMember(req: Request, res: Response) {
  const input = parseWithSchema(updateProjectMemberSchema, req.body);
  const member = await projectService.updateProjectMemberRole(
    req.params.projectId,
    req.params.userId,
    input,
  );
  res.json({ member });
}

export async function deleteProjectMember(req: Request, res: Response) {
  await projectService.removeProjectMember(req.params.projectId, req.params.userId);
  res.status(204).send();
}
