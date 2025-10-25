/**
 * Job Matcher Agent Validation Schemas
 * Zod schemas for validating job matching data
 */

import { z } from 'zod';

// Job match skills validation
export const jobMatchSkillsSchema = z.object({
  matched: z.array(z.string()).default([]),
  missing: z.array(z.string()).default([]),
  additional: z.array(z.string()).default([])
});

// Job match analysis request
export const analyzeJobMatchSchema = z.object({
  userId: z.number().positive('User ID must be positive'),
  jobId: z.number().positive('Job ID must be positive'),
  resumeId: z.number().positive('Resume ID must be positive').optional()
});

// Job match creation
export const createJobMatchSchema = z.object({
  userId: z.number().positive('User ID must be positive'),
  jobId: z.number().positive('Job ID must be positive'),
  resumeId: z.number().positive('Resume ID must be positive').optional(),
  matchScore: z.number().min(0).max(100, 'Match score must be between 0 and 100'),
  skillsMatch: jobMatchSkillsSchema.optional(),
  experienceMatch: z.number().min(0).max(100).optional(),
  locationMatch: z.number().min(0).max(100).optional(),
  salaryMatch: z.number().min(0).max(100).optional(),
  cultureFit: z.number().min(0).max(100).optional(),
  aiSummary: z.string().optional(),
  strengths: z.array(z.string()).default([]).optional(),
  weaknesses: z.array(z.string()).default([]).optional(),
  isBookmarked: z.boolean().default(false).optional(),
  isApplied: z.boolean().default(false).optional()
});

// Job match update
export const updateJobMatchSchema = z.object({
  id: z.number().positive('Match ID must be positive'),
  isBookmarked: z.boolean().optional(),
  isApplied: z.boolean().optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

// Job preferences validation
export const jobPreferencesSchema = z.object({
  userId: z.number().positive('User ID must be positive'),
  preferredJobTypes: z.array(z.string()).default([]),
  preferredLocations: z.array(z.string()).default([]),
  remotePreference: z.enum(['remote', 'onsite', 'hybrid']).default('hybrid'),
  minSalary: z.number().positive().optional(),
  maxSalary: z.number().positive().optional(),
  preferredCompanySize: z.enum(['startup', 'small', 'medium', 'large']).optional(),
  preferredIndustries: z.array(z.string()).default([]),
  workExperienceLevel: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
  isActive: z.boolean().default(true)
});

// Update job preferences
export const updateJobPreferencesSchema = jobPreferencesSchema.partial().omit({ userId: true });

// Job search request
export const jobSearchSchema = z.object({
  userId: z.number().positive('User ID must be positive'),
  keywords: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  experienceLevel: z.string().optional(),
  minSalary: z.number().positive().optional(),
  maxSalary: z.number().positive().optional(),
  limit: z.number().positive().max(100).default(20),
  offset: z.number().min(0).default(0)
});

// Validation functions
export function validateAnalyzeJobMatch(data: unknown) {
  return analyzeJobMatchSchema.safeParse(data);
}

export function validateCreateJobMatch(data: unknown) {
  return createJobMatchSchema.safeParse(data);
}

export function validateUpdateJobMatch(data: unknown) {
  return updateJobMatchSchema.safeParse(data);
}

export function validateJobPreferences(data: unknown) {
  return jobPreferencesSchema.safeParse(data);
}

export function validateUpdateJobPreferences(data: unknown) {
  return updateJobPreferencesSchema.safeParse(data);
}

export function validateJobSearch(data: unknown) {
  return jobSearchSchema.safeParse(data);
}

// Type exports
export type JobMatchSkills = z.infer<typeof jobMatchSkillsSchema>;
export type AnalyzeJobMatchData = z.infer<typeof analyzeJobMatchSchema>;
export type CreateJobMatchData = z.infer<typeof createJobMatchSchema>;
export type UpdateJobMatchData = z.infer<typeof updateJobMatchSchema>;
export type JobPreferencesData = z.infer<typeof jobPreferencesSchema>;
export type UpdateJobPreferencesData = z.infer<typeof updateJobPreferencesSchema>;
export type JobSearchData = z.infer<typeof jobSearchSchema>;