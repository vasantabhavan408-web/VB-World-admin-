import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('[Error Handler]', err);

  if (err instanceof ZodError) {
    sendError(res, 'Validation failed', 400, err.errors);
    return;
  }

  // Handle Prisma unique constraint failed errors (P2002)
  if ('code' in err && err.code === 'P2002') {
    const meta = (err as any).meta;
    const target = meta && Array.isArray(meta.target) ? meta.target.join(', ') : 'field';
    sendError(res, `A record with this ${target} already exists.`, 400);
    return;
  }

  // Handle Prisma record not found errors (P2025)
  if ('code' in err && err.code === 'P2025') {
    sendError(res, 'Record not found.', 404);
    return;
  }

  // Handle Prisma foreign key constraint violation errors (P2003)
  if ('code' in err && err.code === 'P2003') {
    const field = (err as any).meta?.field_name || 'foreign key';
    sendError(res, `Foreign key constraint failed: Invalid reference for ${field}.`, 400);
    return;
  }

  // Handle generic error
  sendError(res, err.message || 'Internal Server Error', 500);
}
