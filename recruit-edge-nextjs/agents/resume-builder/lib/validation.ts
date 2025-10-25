/**
 * Resume Builder Agent Validation Schemas
 * Zod schemas for validating resume data
 */

import { z } from 'zod';

// Personal info validation
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid portfolio URL').optional().or(z.literal(''))
});

// Experience item validation
export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  isCurrent: z.boolean(),
  description: z.string().min(1, 'Description is required'),
  achievements: z.array(z.string()).default([])
});

// Education item validation
export const educationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  isCurrent: z.boolean(),
  gpa: z.string().optional(),
  achievements: z.array(z.string()).default([])
});

// Project item validation
export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()).default([]),
  url: z.string().url('Invalid project URL').optional().or(z.literal(''))
});

// Certification item validation
export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  url: z.string().url('Invalid certification URL').optional().or(z.literal(''))
});

// Main resume data validation
export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().optional(),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(projectItemSchema).default([]).optional(),
  certifications: z.array(certificationItemSchema).default([]).optional()
});

// Resume creation/update validation
export const createResumeSchema = z.object({
  title: z.string().min(1, 'Resume title is required').max(255, 'Title too long'),
  template: z.string().default('modern'),
  isPublic: z.boolean().default(false),
  ...resumeDataSchema.shape
});

export const updateResumeSchema = createResumeSchema.partial();

// AI generation schemas
export const generateSummarySchema = z.object({
  resumeData: resumeDataSchema,
  targetRole: z.string().optional(),
  tone: z.enum(['professional', 'enthusiastic', 'creative']).default('professional')
});

export const improveDescriptionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  role: z.string().optional(),
  company: z.string().optional(),
  tone: z.enum(['professional', 'enthusiastic', 'creative']).default('professional')
});

export const extractKeywordsSchema = z.object({
  jobDescription: z.string().min(1, 'Job description is required'),
  maxKeywords: z.number().min(1).max(50).default(20)
});

// Export validation functions
export function validateResumeData(data: unknown) {
  return resumeDataSchema.safeParse(data);
}

export function validateCreateResume(data: unknown) {
  return createResumeSchema.safeParse(data);
}

export function validateUpdateResume(data: unknown) {
  return updateResumeSchema.safeParse(data);
}

export function validatePersonalInfo(data: unknown) {
  return personalInfoSchema.safeParse(data);
}

export function validateExperience(data: unknown) {
  return z.array(experienceItemSchema).safeParse(data);
}

export function validateEducation(data: unknown) {
  return z.array(educationItemSchema).safeParse(data);
}

// Type exports
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type CertificationItem = z.infer<typeof certificationItemSchema>;
export type ResumeData = z.infer<typeof resumeDataSchema>;
export type CreateResumeData = z.infer<typeof createResumeSchema>;
export type UpdateResumeData = z.infer<typeof updateResumeSchema>;