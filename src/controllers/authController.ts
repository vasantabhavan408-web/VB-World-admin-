import { Request, Response, NextFunction } from 'express';
import { loginUser } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { loginSchema } from '../validators/authValidator.js';

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validatedBody = loginSchema.parse(req.body);

    const result = await loginUser(validatedBody);

    if (!result) {
      sendError(res, 'Invalid email or password', 400);
      return;
    }

    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
}
