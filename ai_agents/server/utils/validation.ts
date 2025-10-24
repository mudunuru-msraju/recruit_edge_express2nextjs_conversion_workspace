/**
 * Validation Utilities
 * Zod schemas for request validation across all agents
 */

import { z } from 'zod';

/**
 * Common validation schemas
 */
export const schemas = {
  userId: z.number().int().positive('User ID must be a positive integer'),
  
  resumeId: z.number().int().positive('Resume ID must be a positive integer'),
  
  sessionId: z.number().int().positive('Session ID must be a positive integer'),
  
  analysisId: z.number().int().positive('Analysis ID must be a positive integer'),
  
  email: z.string().email('Invalid email address'),
  
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
    .optional(),
  
  url: z.string().url('Invalid URL format').optional(),
  
  nonEmptyString: z.string().min(1, 'This field cannot be empty'),
  
  template: z.enum(['modern', 'classic', 'creative', 'minimal']),
  
  interviewType: z.enum(['behavioral', 'technical', 'case_study', 'general']),
  
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  
  priority: z.enum(['low', 'medium', 'high', 'critical']),
};

/**
 * Resume Builder Schemas
 */
export const resumeBuilderSchemas = {
  createResume: z.object({
    userId: schemas.userId,
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    personalInfo: z.object({
      name: schemas.nonEmptyString,
      email: schemas.email,
      phone: schemas.phone,
      location: z.string().optional(),
      linkedin: schemas.url,
      website: schemas.url,
    }),
    summary: z.string().max(1000, 'Summary too long').optional(),
    template: schemas.template.optional(),
  }),
  
  updateResume: z.object({
    userId: schemas.userId,
    title: z.string().min(1).max(200).optional(),
    personalInfo: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: schemas.phone,
      location: z.string().optional(),
      linkedin: schemas.url,
      website: schemas.url,
    }).optional(),
    summary: z.string().max(1000).optional(),
    experience: z.array(z.any()).optional(),
    education: z.array(z.any()).optional(),
    skills: z.array(z.any()).optional(),
    projects: z.array(z.any()).optional(),
    certifications: z.array(z.any()).optional(),
    template: schemas.template.optional(),
  }),
};

/**
 * Interview Prep Schemas
 */
export const interviewPrepSchemas = {
  createSession: z.object({
    userId: schemas.userId,
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    interviewType: schemas.interviewType,
    difficulty: schemas.difficulty,
    targetRole: z.string().max(100).optional(),
    targetCompany: z.string().max(100).optional(),
    numberOfQuestions: z.number().int().min(1).max(50).optional(),
  }),
  
  createQuestion: z.object({
    sessionId: schemas.sessionId,
    questionText: z.string().min(1, 'Question text is required').max(1000),
    questionType: z.enum(['behavioral', 'technical', 'situational', 'general']).optional(),
  }),
  
  answerQuestion: z.object({
    userId: schemas.userId,
    userAnswer: z.string().min(1, 'Answer is required').max(5000, 'Answer too long'),
  }),
};

/**
 * Skill Gap Analyzer Schemas
 */
export const skillGapAnalyzerSchemas = {
  createAnalysis: z.object({
    userId: schemas.userId,
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    resumeText: z.string().min(10, 'Resume text is too short').max(10000, 'Resume text too long'),
    jobDescriptionText: z.string().min(10, 'Job description too short').max(10000, 'Job description too long'),
    targetRole: z.string().max(100).optional(),
  }),
  
  updateGap: z.object({
    userId: schemas.userId,
    priority: schemas.priority.optional(),
    isAddressed: z.boolean().optional(),
  }),
};

/**
 * Validation middleware factory
 */
export function validate(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedBody = validated;
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
}
