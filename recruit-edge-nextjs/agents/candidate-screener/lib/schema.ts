import { z } from 'zod';

export const candidateProfileSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  resumeUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  yearsExperience: z.number().min(0).optional(),
  currentTitle: z.string().optional(),
  currentCompany: z.string().optional(),
  expectedSalary: z.number().optional(),
  availability: z.enum(['immediate', 'two-weeks', 'one-month', 'negotiable']).optional(),
  skills: z.array(z.string()).default([]),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    year: z.number().optional()
  })).default([]),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    duration: z.string(),
    description: z.string().optional()
  })).default([]),
  status: z.enum(['new', 'screening', 'passed', 'rejected', 'on-hold']).default('new'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const screeningCriteriaSchema = z.object({
  id: z.string().optional(),
  jobId: z.string(),
  jobTitle: z.string(),
  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  minExperience: z.number().min(0).optional(),
  maxExperience: z.number().optional(),
  educationRequirements: z.array(z.string()).default([]),
  locationPreferences: z.array(z.string()).default([]),
  salaryRange: z.object({
    min: z.number().optional(),
    max: z.number().optional()
  }).optional(),
  keywordFilters: z.array(z.string()).default([]),
  excludeKeywords: z.array(z.string()).default([]),
  culturalFitCriteria: z.array(z.string()).default([]),
  weights: z.object({
    skills: z.number().min(0).max(100).default(30),
    experience: z.number().min(0).max(100).default(25),
    education: z.number().min(0).max(100).default(15),
    cultural: z.number().min(0).max(100).default(20),
    other: z.number().min(0).max(100).default(10)
  }).optional(),
  passThreshold: z.number().min(0).max(100).default(70),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const screeningResultSchema = z.object({
  id: z.string().optional(),
  candidateId: z.string(),
  criteriaId: z.string(),
  overallScore: z.number().min(0).max(100),
  skillsScore: z.number().min(0).max(100),
  experienceScore: z.number().min(0).max(100),
  educationScore: z.number().min(0).max(100),
  culturalScore: z.number().min(0).max(100),
  status: z.enum(['passed', 'failed', 'review-required']),
  matchedSkills: z.array(z.string()).default([]),
  missingSkills: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  concerns: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  aiAnalysis: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.date().optional(),
  createdAt: z.date().optional()
});

export type CandidateProfile = z.infer<typeof candidateProfileSchema>;
export type ScreeningCriteria = z.infer<typeof screeningCriteriaSchema>;
export type ScreeningResult = z.infer<typeof screeningResultSchema>;

// API request schemas
export const createCandidateProfileSchema = candidateProfileSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateCandidateProfileSchema = candidateProfileSchema.omit({ createdAt: true, updatedAt: true });
export const createScreeningCriteriaSchema = screeningCriteriaSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateScreeningCriteriaSchema = screeningCriteriaSchema.omit({ createdAt: true, updatedAt: true });

export type CreateCandidateProfileRequest = z.infer<typeof createCandidateProfileSchema>;
export type UpdateCandidateProfileRequest = z.infer<typeof updateCandidateProfileSchema>;
export type CreateScreeningCriteriaRequest = z.infer<typeof createScreeningCriteriaSchema>;
export type UpdateScreeningCriteriaRequest = z.infer<typeof updateScreeningCriteriaSchema>;