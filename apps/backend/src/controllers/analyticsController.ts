import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { httpStatus } from '../constants/httpStatus';
import { AnalyticsService } from '../services/analyticsService';

export const getAnalyticsOverview = asyncHandler(async (_req: Request, res: Response) => {
  const overview = await AnalyticsService.getOverview();

  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, overview, 'Analytics overview fetched successfully')
  );
});