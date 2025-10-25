import { z } from 'zod';

export const salaryResearchSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1, 'Job title is required'),
  location: z.string().min(1, 'Location is required'),
  experienceYears: z.number().min(0).max(50),
  industry: z.string().min(1, 'Industry is required'),
  companySize: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
  currentSalary: z.number().optional(),
  targetSalary: z.number().optional(),
  skills: z.array(z.string()).default([]),
  education: z.string().optional(),
  certifications: z.array(z.string()).default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const negotiationSessionSchema = z.object({
  id: z.string().optional(),
  researchId: z.string(),
  offerAmount: z.number().min(0),
  offerDetails: z.string().optional(),
  negotiationGoals: z.array(z.string()).default([]),
  strategyType: z.enum(['collaborative', 'competitive', 'value-based', 'market-based']),
  counterOfferAmount: z.number().optional(),
  negotiationScript: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'declined']).default('draft'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const marketDataSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string(),
  location: z.string(),
  industry: z.string(),
  experienceLevel: z.string(),
  salaryMin: z.number(),
  salaryMax: z.number(),
  salaryMedian: z.number(),
  totalCompMin: z.number().optional(),
  totalCompMax: z.number().optional(),
  dataSource: z.string(),
  confidence: z.number().min(0).max(100),
  createdAt: z.date().optional()
});

export type SalaryResearch = z.infer<typeof salaryResearchSchema>;
export type NegotiationSession = z.infer<typeof negotiationSessionSchema>;
export type MarketData = z.infer<typeof marketDataSchema>;

// API request schemas
export const createSalaryResearchSchema = salaryResearchSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateSalaryResearchSchema = salaryResearchSchema.omit({ createdAt: true, updatedAt: true });
export const createNegotiationSessionSchema = negotiationSessionSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateNegotiationSessionSchema = negotiationSessionSchema.omit({ createdAt: true, updatedAt: true });

export type CreateSalaryResearchRequest = z.infer<typeof createSalaryResearchSchema>;
export type UpdateSalaryResearchRequest = z.infer<typeof updateSalaryResearchSchema>;
export type CreateNegotiationSessionRequest = z.infer<typeof createNegotiationSessionSchema>;
export type UpdateNegotiationSessionRequest = z.infer<typeof updateNegotiationSessionSchema>;