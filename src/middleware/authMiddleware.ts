import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/authHelper.js';
import { sendError } from '../utils/response.js';

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    sendError(res, 'Invalid or expired token', 401);
    return;
  }

  req.user = decoded;
  next();
}
