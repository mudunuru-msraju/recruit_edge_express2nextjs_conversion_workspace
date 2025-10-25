/**
 * Cover Letter Writer Agent Validation Schemas
 * Zod schemas for validating cover letter data
 */

import { z } from 'zod';

// Cover letter tone validation
export const coverLetterToneSchema = z.enum(['professional', 'enthusiastic', 'creative']);

// Cover letter creation validation
export const createCoverLetterSchema = z.object({
  userId: z.number().positive('User ID must be positive'),
  resumeId: z.number().positive('Resume ID must be positive').optional(),
  jobId: z.number().positive('Job ID must be positive').optional(),
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  recipientName: z.string().max(255, 'Recipient name too long').optional(),
  recipientTitle: z.string().max(255, 'Recipient title too long').optional(),
  companyName: z.string().max(255, 'Company name too long').optional(),
  jobTitle: z.string().max(255, 'Job title too long').optional(),
  tone: coverLetterToneSchema.default('professional')
});

// Cover letter update validation
export const updateCoverLetterSchema = z.object({
  id: z.number().positive('Cover letter ID must be positive'),
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  content: z.string().min(10, 'Content must be at least 10 characters').optional(),
  recipientName: z.string().max(255, 'Recipient name too long').optional(),
  recipientTitle: z.string().max(255, 'Recipient title too long').optional(),
  companyName: z.string().max(255, 'Company name too long').optional(),
  jobTitle: z.string().max(255, 'Job title too long').optional(),
  tone: coverLetterToneSchema.optional()
});

// AI generation request validation
export const generateCoverLetterSchema = z.object({
  userId: z.number().positive('User ID must be positive'),
  resumeId: z.number().positive('Resume ID must be positive').optional(),
  jobId: z.number().positive('Job ID must be positive').optional(),
  jobDescription: z.string().min(10, 'Job description must be at least 10 characters').optional(),
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  recipientName: z.string().optional(),
  recipientTitle: z.string().optional(),
  tone: coverLetterToneSchema.default('professional'),
  keywords: z.array(z.string()).default([]).optional(),
  customInstructions: z.string().max(500, 'Instructions too long').optional()
});

// Template creation validation
export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(255, 'Name too long'),
  industry: z.string().max(100, 'Industry name too long').optional(),
  jobLevel: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
  tone: coverLetterToneSchema.default('professional'),
  template: z.string().min(10, 'Template content must be at least 10 characters'),
  placeholders: z.record(z.string(), z.string()).default({}).optional()
});

// Content improvement validation
export const improveCoverLetterSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
  jobDescription: z.string().optional(),
  targetTone: coverLetterToneSchema.default('professional'),
  improvementType: z.enum(['grammar', 'clarity', 'persuasiveness', 'keywords']).default('clarity')
});

// Validation functions
export function validateCreateCoverLetter(data: unknown) {
  return createCoverLetterSchema.safeParse(data);
}

export function validateUpdateCoverLetter(data: unknown) {
  return updateCoverLetterSchema.safeParse(data);
}

export function validateGenerateCoverLetter(data: unknown) {
  return generateCoverLetterSchema.safeParse(data);
}

export function validateCreateTemplate(data: unknown) {
  return createTemplateSchema.safeParse(data);
}

export function validateImproveCoverLetter(data: unknown) {
  return improveCoverLetterSchema.safeParse(data);
}

// Type exports
export type CoverLetterTone = z.infer<typeof coverLetterToneSchema>;
export type CreateCoverLetterData = z.infer<typeof createCoverLetterSchema>;
export type UpdateCoverLetterData = z.infer<typeof updateCoverLetterSchema>;
export type GenerateCoverLetterData = z.infer<typeof generateCoverLetterSchema>;
export type CreateTemplateData = z.infer<typeof createTemplateSchema>;
export type ImproveCoverLetterData = z.infer<typeof improveCoverLetterSchema>;