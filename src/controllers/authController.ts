import { Request, Response, NextFunction } from 'express';
import { loginUser } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { loginSchema } from '../validators/authValidator.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/authHelper.js';
import prisma from '../utils/prisma.js';

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

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      sendError(res, 'Refresh token is required', 400);
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      sendError(res, 'Invalid or expired refresh token', 401);
      return;
    }

    // Optionally check if user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      sendError(res, 'User no longer exists', 401);
      return;
    }

    const newToken = generateToken({ userId: user.id, email: user.email });
    const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    sendSuccess(res, { token: newToken, refreshToken: newRefreshToken }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
}
