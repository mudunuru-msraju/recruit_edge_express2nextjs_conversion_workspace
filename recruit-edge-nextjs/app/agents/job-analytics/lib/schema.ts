import { z } from 'zod';

// Job Performance Schema
export const jobPerformanceSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  jobTitle: z.string(),
  postedDate: z.date(),
  status: z.enum(['active', 'paused', 'closed', 'draft']),
  views: z.number(),
  applications: z.number(),
  qualified: z.number(),
  interviewed: z.number(),
  hired: z.number(),
  conversionRate: z.number(),
  timeToFill: z.number(), // in days
  costPerHire: z.number(),
  sourceBreakdown: z.record(z.string(), z.number()),
  updatedAt: z.date()
});

// Application Analytics Schema
export const applicationAnalyticsSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  applicationId: z.string(),
  candidateId: z.string(),
  appliedDate: z.date(),
  source: z.string(),
  stage: z.enum(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']),
  stageChangedAt: z.date(),
  timeInStage: z.number(), // in hours
  qualityScore: z.number(), // 1-100
  fitScore: z.number(), // 1-100
  salaryExpectation: z.number().optional(),
  location: z.string().optional()
});

// Candidate Insights Schema
export const candidateInsightsSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  totalApplications: z.number(),
  activeApplications: z.number(),
  averageResponseTime: z.number(), // in hours
  skillsMatch: z.array(z.object({
    skill: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    matchScore: z.number()
  })),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'executive']),
  educationLevel: z.enum(['high_school', 'bachelors', 'masters', 'phd']),
  locationPreferences: z.array(z.string()),
  salaryRange: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string()
  }),
  lastActive: z.date(),
  engagementScore: z.number() // 1-100
});

// ROI Tracking Schema
export const roiTrackingSchema = z.object({
  id: z.string(),
  period: z.enum(['week', 'month', 'quarter', 'year']),
  timestamp: z.date(),
  metrics: z.object({
    totalJobPostings: z.number(),
    totalApplications: z.number(),
    totalHires: z.number(),
    recruitmentCosts: z.number(),
    costPerApplication: z.number(),
    costPerHire: z.number(),
    timeToFill: z.number(),
    qualityOfHire: z.number(),
    retentionRate: z.number(),
    revenuePerHire: z.number(),
    roi: z.number()
  })
});

// Hiring Funnel Schema
export const hiringFunnelSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  funnelData: z.array(z.object({
    stage: z.string(),
    count: z.number(),
    percentage: z.number(),
    averageTime: z.number(), // days in stage
    dropoffRate: z.number()
  })),
  totalCandidates: z.number(),
  conversionRates: z.record(z.string(), z.number()),
  bottlenecks: z.array(z.object({
    stage: z.string(),
    issue: z.string(),
    impact: z.enum(['low', 'medium', 'high']),
    recommendation: z.string()
  })),
  updatedAt: z.date()
});

// Source Attribution Schema
export const sourceAttributionSchema = z.object({
  id: z.string(),
  source: z.string(),
  sourceType: z.enum(['job_board', 'social_media', 'referral', 'direct', 'agency', 'career_page']),
  totalApplications: z.number(),
  qualifiedApplications: z.number(),
  hires: z.number(),
  cost: z.number(),
  costPerApplication: z.number(),
  costPerHire: z.number(),
  qualityScore: z.number(),
  conversionRate: z.number(),
  roi: z.number(),
  period: z.object({
    start: z.date(),
    end: z.date()
  })
});

// Input Schemas
export const createJobAnalyticsSchema = z.object({
  jobId: z.string(),
  jobTitle: z.string(),
  department: z.string().optional(),
  location: z.string().optional(),
  salaryRange: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string()
  }).optional()
});

// Query Schemas
export const jobPerformanceQuerySchema = z.object({
  jobId: z.string().optional(),
  status: z.enum(['active', 'paused', 'closed', 'draft']).optional(),
  department: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().default(10),
  offset: z.number().default(0),
  sortBy: z.enum(['views', 'applications', 'conversionRate', 'timeToFill']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export const applicationAnalyticsQuerySchema = z.object({
  jobId: z.string().optional(),
  candidateId: z.string().optional(),
  stage: z.enum(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']).optional(),
  source: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minQualityScore: z.number().optional(),
  limit: z.number().default(10),
  offset: z.number().default(0)
});

export const candidateInsightsQuerySchema = z.object({
  candidateId: z.string().optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
  educationLevel: z.enum(['high_school', 'bachelors', 'masters', 'phd']).optional(),
  minEngagementScore: z.number().optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  limit: z.number().default(10),
  offset: z.number().default(0)
});

export const roiAnalyticsQuerySchema = z.object({
  period: z.enum(['week', 'month', 'quarter', 'year']),
  startDate: z.date(),
  endDate: z.date(),
  department: z.string().optional(),
  jobType: z.string().optional()
});

// Export types
export type JobPerformance = z.infer<typeof jobPerformanceSchema>;
export type ApplicationAnalytics = z.infer<typeof applicationAnalyticsSchema>;
export type CandidateInsights = z.infer<typeof candidateInsightsSchema>;
export type ROITracking = z.infer<typeof roiTrackingSchema>;
export type HiringFunnel = z.infer<typeof hiringFunnelSchema>;
export type SourceAttribution = z.infer<typeof sourceAttributionSchema>;
export type CreateJobAnalytics = z.infer<typeof createJobAnalyticsSchema>;
export type JobPerformanceQuery = z.infer<typeof jobPerformanceQuerySchema>;
export type ApplicationAnalyticsQuery = z.infer<typeof applicationAnalyticsQuerySchema>;
export type CandidateInsightsQuery = z.infer<typeof candidateInsightsQuerySchema>;
export type ROIAnalyticsQuery = z.infer<typeof roiAnalyticsQuerySchema>;