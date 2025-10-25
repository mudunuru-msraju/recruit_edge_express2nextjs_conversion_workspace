import { z } from 'zod';

export const jobDescriptionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  department: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'temporary', 'internship']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'executive']),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  currency: z.string().default('USD'),
  industry: z.string().optional(),
  description: z.string().optional(),
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  qualifications: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  companyDescription: z.string().optional(),
  applicationInstructions: z.string().optional(),
  templateId: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  seoScore: z.number().min(0).max(100).optional(),
  biasScore: z.number().min(0).max(100).optional(),
  createdBy: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const jobTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  industry: z.string().optional(),
  jobLevel: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
  template: z.object({
    title: z.string(),
    description: z.string(),
    responsibilities: z.array(z.string()),
    requirements: z.array(z.string()),
    qualifications: z.array(z.string()),
    skills: z.array(z.string()),
    benefits: z.array(z.string())
  }),
  isPublic: z.boolean().default(true),
  usageCount: z.number().default(0),
  rating: z.number().min(0).max(5).optional(),
  createdBy: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const jobPostingAnalyticsSchema = z.object({
  id: z.string().optional(),
  jobDescriptionId: z.string(),
  platform: z.string(),
  views: z.number().default(0),
  applications: z.number().default(0),
  clickThroughRate: z.number().optional(),
  conversionRate: z.number().optional(),
  averageTimeOnPage: z.number().optional(),
  topKeywords: z.array(z.string()).default([]),
  performanceScore: z.number().min(0).max(100).optional(),
  createdAt: z.date().optional()
});

export type JobDescription = z.infer<typeof jobDescriptionSchema>;
export type JobTemplate = z.infer<typeof jobTemplateSchema>;
export type JobPostingAnalytics = z.infer<typeof jobPostingAnalyticsSchema>;

// API request schemas
export const createJobDescriptionSchema = jobDescriptionSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateJobDescriptionSchema = jobDescriptionSchema.omit({ createdAt: true, updatedAt: true });
export const createJobTemplateSchema = jobTemplateSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateJobTemplateSchema = jobTemplateSchema.omit({ createdAt: true, updatedAt: true });

export type CreateJobDescriptionRequest = z.infer<typeof createJobDescriptionSchema>;
export type UpdateJobDescriptionRequest = z.infer<typeof updateJobDescriptionSchema>;
export type CreateJobTemplateRequest = z.infer<typeof createJobTemplateSchema>;
export type UpdateJobTemplateRequest = z.infer<typeof updateJobTemplateSchema>;