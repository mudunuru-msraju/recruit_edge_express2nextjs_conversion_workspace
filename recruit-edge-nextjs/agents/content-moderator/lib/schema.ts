import { z } from 'zod';

export const contentReviewSchema = z.object({
  id: z.string().optional(),
  contentType: z.enum(['job_posting', 'email', 'message', 'profile', 'comment']),
  content: z.string().min(1, 'Content is required'),
  authorId: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'flagged']).default('pending'),
  moderationScore: z.number().min(0).max(100).optional(),
  flags: z.array(z.string()).default([]),
  violations: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  reviewedBy: z.string().optional(),
  reviewedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const moderationRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Rule name is required'),
  description: z.string().optional(),
  ruleType: z.enum(['keyword', 'pattern', 'ai_model', 'policy']),
  contentTypes: z.array(z.enum(['job_posting', 'email', 'message', 'profile', 'comment'])),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  action: z.enum(['flag', 'block', 'review', 'auto_approve']),
  keywords: z.array(z.string()).default([]),
  patterns: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const moderationLogSchema = z.object({
  id: z.string().optional(),
  contentReviewId: z.string(),
  action: z.string(),
  reason: z.string(),
  moderatorId: z.string(),
  previousStatus: z.string(),
  newStatus: z.string(),
  notes: z.string().optional(),
  createdAt: z.date().optional()
});

export type ContentReview = z.infer<typeof contentReviewSchema>;
export type ModerationRule = z.infer<typeof moderationRuleSchema>;
export type ModerationLog = z.infer<typeof moderationLogSchema>;

// API request schemas
export const createContentReviewSchema = contentReviewSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateContentReviewSchema = contentReviewSchema.omit({ createdAt: true, updatedAt: true });
export const createModerationRuleSchema = moderationRuleSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateModerationRuleSchema = moderationRuleSchema.omit({ createdAt: true, updatedAt: true });

export type CreateContentReviewRequest = z.infer<typeof createContentReviewSchema>;
export type UpdateContentReviewRequest = z.infer<typeof updateContentReviewSchema>;
export type CreateModerationRuleRequest = z.infer<typeof createModerationRuleSchema>;
export type UpdateModerationRuleRequest = z.infer<typeof updateModerationRuleSchema>;