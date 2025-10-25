import { pgTable, serial, integer, varchar, text, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const interviewTypeEnum = pgEnum('interview_type', [
  'behavioral',
  'technical',
  'case_study',
  'system_design',
  'coding',
  'general'
]);

export const difficultyLevelEnum = pgEnum('difficulty_level', ['easy', 'medium', 'hard']);

// Interview Sessions Table
export const interviewSessions = pgTable('interview_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  interviewType: interviewTypeEnum('interview_type').notNull(),
  difficulty: difficultyLevelEnum('difficulty'),
  targetRole: varchar('target_role', { length: 255 }),
  targetCompany: varchar('target_company', { length: 255 }),
  duration: integer('duration'), // in minutes
  score: integer('score'), // 0-100
  feedback: text('feedback'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Interview Questions Table
export const interviewQuestions = pgTable('interview_questions', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').references(() => interviewSessions.id).notNull(),
  question: text('question').notNull(),
  interviewType: interviewTypeEnum('interview_type').notNull(),
  difficulty: difficultyLevelEnum('difficulty'),
  userAnswer: text('user_answer'),
  aiSuggestion: text('ai_suggestion'),
  evaluation: jsonb('evaluation').$type<{
    score: number;
    strengths: string[];
    improvements: string[];
    feedback: string;
  }>(),
  timeSpent: integer('time_spent'), // in seconds
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const interviewSessionsRelations = relations(interviewSessions, ({ many }) => ({
  questions: many(interviewQuestions),
}));

export const interviewQuestionsRelations = relations(interviewQuestions, ({ one }) => ({
  session: one(interviewSessions, {
    fields: [interviewQuestions.sessionId],
    references: [interviewSessions.id],
  }),
}));

// Types
export type InterviewSession = typeof interviewSessions.$inferSelect;
export type InsertInterviewSession = typeof interviewSessions.$inferInsert;
export type UpdateInterviewSession = Partial<InsertInterviewSession>;

export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
export type InsertInterviewQuestion = typeof interviewQuestions.$inferInsert;
export type UpdateInterviewQuestion = Partial<InsertInterviewQuestion>;

export type InterviewType = 'behavioral' | 'technical' | 'case_study' | 'system_design' | 'coding' | 'general';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionEvaluation = {
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
};

export type GeneratedQuestion = {
  question: string;
  interviewType: InterviewType;
  difficulty: DifficultyLevel;
};

export type AnswerEvaluationRequest = {
  question: string;
  answer: string;
};

export type AnswerEvaluationResponse = QuestionEvaluation;