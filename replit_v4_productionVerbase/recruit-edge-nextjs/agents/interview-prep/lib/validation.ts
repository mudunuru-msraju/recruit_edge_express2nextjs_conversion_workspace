import { z } from 'zod';

// Enums
export const InterviewTypeSchema = z.enum([
  'behavioral',
  'technical', 
  'case_study',
  'system_design',
  'coding',
  'general'
]);

export const DifficultyLevelSchema = z.enum(['easy', 'medium', 'hard']);

// Interview Session Schemas
export const CreateInterviewSessionSchema = z.object({
  userId: z.number().int().positive(),
  title: z.string().min(1).max(255),
  interviewType: InterviewTypeSchema,
  difficulty: DifficultyLevelSchema.optional(),
  targetRole: z.string().max(255).optional(),
  targetCompany: z.string().max(255).optional(),
  numberOfQuestions: z.number().int().min(1).max(20).default(5),
});

export const UpdateInterviewSessionSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  score: z.number().int().min(0).max(100).optional(),
  feedback: z.string().optional(),
  duration: z.number().int().positive().optional(),
});

export const InterviewSessionQuerySchema = z.object({
  userId: z.string().transform((val) => parseInt(val, 10)),
});

// Interview Question Schemas
export const CreateInterviewQuestionSchema = z.object({
  question: z.string().min(1),
  interviewType: InterviewTypeSchema,
  difficulty: DifficultyLevelSchema.optional(),
  userAnswer: z.string().optional(),
});

export const UpdateInterviewQuestionSchema = z.object({
  userAnswer: z.string().optional(),
  evaluation: z.object({
    score: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    feedback: z.string(),
  }).optional(),
  timeSpent: z.number().int().positive().optional(),
});

// AI Generation Schemas
export const GenerateQuestionsSchema = z.object({
  interviewType: InterviewTypeSchema,
  difficulty: DifficultyLevelSchema.default('medium'),
  targetRole: z.string().optional(),
  count: z.number().int().min(1).max(20).default(5),
});

export const EvaluateAnswerSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

// Response Schemas
export const InterviewSessionResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  interviewType: InterviewTypeSchema,
  difficulty: DifficultyLevelSchema.nullable(),
  targetRole: z.string().nullable(),
  targetCompany: z.string().nullable(),
  duration: z.number().nullable(),
  score: z.number().nullable(),
  feedback: z.string().nullable(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const InterviewQuestionResponseSchema = z.object({
  id: z.number(),
  sessionId: z.number(),
  question: z.string(),
  interviewType: InterviewTypeSchema,
  difficulty: DifficultyLevelSchema.nullable(),
  userAnswer: z.string().nullable(),
  aiSuggestion: z.string().nullable(),
  evaluation: z.object({
    score: z.number(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    feedback: z.string(),
  }).nullable(),
  timeSpent: z.number().nullable(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GeneratedQuestionSchema = z.object({
  question: z.string(),
  interviewType: InterviewTypeSchema,
  difficulty: DifficultyLevelSchema,
});

export const AnswerEvaluationResponseSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  feedback: z.string(),
});

// Type exports
export type CreateInterviewSessionInput = z.infer<typeof CreateInterviewSessionSchema>;
export type UpdateInterviewSessionInput = z.infer<typeof UpdateInterviewSessionSchema>;
export type InterviewSessionQueryInput = z.infer<typeof InterviewSessionQuerySchema>;

export type CreateInterviewQuestionInput = z.infer<typeof CreateInterviewQuestionSchema>;
export type UpdateInterviewQuestionInput = z.infer<typeof UpdateInterviewQuestionSchema>;

export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsSchema>;
export type EvaluateAnswerInput = z.infer<typeof EvaluateAnswerSchema>;

export type InterviewSessionResponse = z.infer<typeof InterviewSessionResponseSchema>;
export type InterviewQuestionResponse = z.infer<typeof InterviewQuestionResponseSchema>;
export type GeneratedQuestionResponse = z.infer<typeof GeneratedQuestionSchema>;
export type AnswerEvaluationResponse = z.infer<typeof AnswerEvaluationResponseSchema>;