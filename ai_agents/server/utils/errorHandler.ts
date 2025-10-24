/**
 * Centralized Error Handling Utilities
 * Provides consistent error responses and logging across all API routes
 */

import { Request, Response, NextFunction } from 'express';

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  statusCode: number;
  code?: string;
  details?: any;

  constructor(message: string, statusCode: number, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    const response: any = {
      error: err.message,
    };

    if (err.code) {
      response.code = err.code;
    }

    if (err.details) {
      response.details = err.details;
    }

    if (process.env.NODE_ENV === 'development') {
      console.error(`[${err.code || 'ERROR'}] ${err.message}`, err.details || '');
    }

    return res.status(err.statusCode).json(response);
  }

  console.error('Unhandled error:', err);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    ...(isDevelopment && { 
      message: err.message,
      stack: err.stack 
    }),
  });
}

/**
 * Async route handler wrapper
 * Automatically catches errors and passes them to error handler
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Validate required parameters
 */
export function requireParams(params: Record<string, any>, requiredFields: string[]) {
  const missing = requiredFields.filter(field => !params[field]);
  
  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`,
      { missingFields: missing }
    );
  }
}

/**
 * Validate ID parameter
 */
export function validateId(id: string | undefined, paramName: string = 'id'): number {
  if (!id) {
    throw new ValidationError(`${paramName} is required`);
  }

  const numId = parseInt(id);
  
  if (isNaN(numId) || numId <= 0) {
    throw new ValidationError(`Invalid ${paramName}: must be a positive number`);
  }

  return numId;
}

/**
 * Database operation wrapper with better error messages
 */
export async function dbOperation<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    console.error(`Database error in ${operationName}:`, error);
    
    if (error.code === '23505') {
      throw new ValidationError('Duplicate entry: this record already exists', {
        constraint: error.constraint,
      });
    }
    
    if (error.code === '23503') {
      throw new ValidationError('Invalid reference: related record does not exist', {
        constraint: error.constraint,
      });
    }
    
    throw new AppError(
      `Failed to ${operationName}`,
      500,
      'DATABASE_ERROR',
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}
