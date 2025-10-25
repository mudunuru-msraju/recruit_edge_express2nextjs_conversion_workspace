import { z } from 'zod';

// Enums
export const PrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export const SkillLevelSchema = z.enum(['none', 'beginner', 'intermediate', 'advanced', 'expert']);
export const SkillCategorySchema = z.enum(['technical', 'soft_skill', 'tool', 'framework', 'language', 'certification']);
export const ResourceTypeSchema = z.enum(['course', 'article', 'video', 'book', 'certification']);

// Learning Resource Schema
export const LearningResourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  type: ResourceTypeSchema,
  provider: z.string().optional(),
  duration: z.string().optional(),
  cost: z.string().optional(),
});

// Skill Analysis Schemas
export const CreateSkillAnalysisSchema = z.object({
  userId: z.number().int().positive(),
  resumeId: z.number().int().positive().optional(),
  targetRole: z.string().min(1).max(255),
  targetCompany: z.string().max(255).optional(),
  jobDescription: z.string().optional(),
  currentSkills: z.array(z.string().min(1)),
  requiredSkills: z.array(z.string().min(1)),
});

export const UpdateSkillAnalysisSchema = z.object({
  overallScore: z.number().int().min(0).max(100).optional(),
  summary: z.string().optional(),
});

export const SkillAnalysisQuerySchema = z.object({
  userId: z.string().transform((val) => parseInt(val, 10)),
});

// Skill Gap Schemas
export const UpdateSkillGapSchema = z.object({
  isCompleted: z.boolean().optional(),
  notes: z.string().optional(),
  currentLevel: SkillLevelSchema.optional(),
  learningResources: z.array(LearningResourceSchema).optional(),
  estimatedTime: z.string().optional(),
});

// AI Analysis Schemas
export const AnalyzeSkillsSchema = z.object({
  jobDescription: z.string().min(1),
  currentSkills: z.array(z.string().min(1)),
});

// Response Schemas
export const SkillAnalysisResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  resumeId: z.number().nullable(),
  targetRole: z.string(),
  targetCompany: z.string().nullable(),
  jobDescription: z.string().nullable(),
  currentSkills: z.array(z.string()),
  requiredSkills: z.array(z.string()),
  overallScore: z.number().nullable(),
  summary: z.string().nullable(),
  metadata: z.record(z.string(), z.any()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SkillGapResponseSchema = z.object({
  id: z.number(),
  analysisId: z.number(),
  skillName: z.string(),
  priority: PrioritySchema,
  category: z.string().nullable(),
  currentLevel: z.string().nullable(),
  requiredLevel: z.string(),
  learningResources: z.array(LearningResourceSchema).nullable(),
  estimatedTime: z.string().nullable(),
  isCompleted: z.boolean(),
  completedAt: z.date().nullable(),
  notes: z.string().nullable(),
  metadata: z.record(z.string(), z.any()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AnalysisResultSchema = z.object({
  requiredSkills: z.array(z.string()),
  matchScore: z.number().min(0).max(100),
  suggestions: z.array(z.string()),
});

// Type exports
export type CreateSkillAnalysisInput = z.infer<typeof CreateSkillAnalysisSchema>;
export type UpdateSkillAnalysisInput = z.infer<typeof UpdateSkillAnalysisSchema>;
export type SkillAnalysisQueryInput = z.infer<typeof SkillAnalysisQuerySchema>;

export type UpdateSkillGapInput = z.infer<typeof UpdateSkillGapSchema>;
export type AnalyzeSkillsInput = z.infer<typeof AnalyzeSkillsSchema>;

export type SkillAnalysisResponse = z.infer<typeof SkillAnalysisResponseSchema>;
export type SkillGapResponse = z.infer<typeof SkillGapResponseSchema>;
export type AnalysisResultResponse = z.infer<typeof AnalysisResultSchema>;
export type LearningResourceResponse = z.infer<typeof LearningResourceSchema>;