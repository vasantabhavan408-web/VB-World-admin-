import { Response } from 'express';

interface StandardResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Operation successful',
  statusCode = 200
): Response {
  const responseBody: StandardResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(responseBody);
}

export function sendError(
  res: Response,
  message = 'An unexpected error occurred',
  statusCode = 500,
  errors: unknown = null
): Response {
  const responseBody: StandardResponse = {
    success: false,
    message,
  };
  if (errors !== undefined && errors !== null) {
    responseBody.errors = errors;
  }
  return res.status(statusCode).json(responseBody);
}
