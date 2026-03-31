import type { Request, Response } from 'express';
import * as dashboardService from '../services/dashboard.service';

export async function getDashboardSummary(req: Request, res: Response) {
  const summary = await dashboardService.getDashboardSummary(req.auth!.userId);
  res.json(summary);
}
