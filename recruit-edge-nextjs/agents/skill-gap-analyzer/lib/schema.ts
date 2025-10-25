import { pgTable, serial, integer, varchar, text, timestamp, jsonb, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'critical']);

// Skill Analyses Table
export const skillAnalyses = pgTable('skill_analyses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  resumeId: integer('resume_id'),
  targetRole: varchar('target_role', { length: 255 }).notNull(),
  targetCompany: varchar('target_company', { length: 255 }),
  jobDescription: text('job_description'),
  currentSkills: jsonb('current_skills').$type<string[]>().notNull(),
  requiredSkills: jsonb('required_skills').$type<string[]>().notNull(),
  overallScore: integer('overall_score'), // 0-100
  summary: text('summary'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Skill Gaps Table
export const skillGaps = pgTable('skill_gaps', {
  id: serial('id').primaryKey(),
  analysisId: integer('analysis_id').references(() => skillAnalyses.id).notNull(),
  skillName: varchar('skill_name', { length: 255 }).notNull(),
  priority: priorityEnum('priority').notNull(),
  category: varchar('category', { length: 100 }), // e.g., 'technical', 'soft_skill', 'tool', 'framework'
  currentLevel: varchar('current_level', { length: 50 }), // e.g., 'none', 'beginner', 'intermediate', 'advanced'
  requiredLevel: varchar('required_level', { length: 50 }).notNull(),
  learningResources: jsonb('learning_resources').$type<Array<{
    title: string;
    url: string;
    type: 'course' | 'article' | 'video' | 'book' | 'certification';
    provider?: string;
    duration?: string;
    cost?: string;
  }>>(),
  estimatedTime: varchar('estimated_time', { length: 100 }), // e.g., '2 weeks', '3 months'
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  notes: text('notes'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const skillAnalysesRelations = relations(skillAnalyses, ({ many }) => ({
  skillGaps: many(skillGaps),
}));

export const skillGapsRelations = relations(skillGaps, ({ one }) => ({
  analysis: one(skillAnalyses, {
    fields: [skillGaps.analysisId],
    references: [skillAnalyses.id],
  }),
}));

// Types
export type SkillAnalysis = typeof skillAnalyses.$inferSelect;
export type InsertSkillAnalysis = typeof skillAnalyses.$inferInsert;
export type UpdateSkillAnalysis = Partial<InsertSkillAnalysis>;

export type SkillGap = typeof skillGaps.$inferSelect;
export type InsertSkillGap = typeof skillGaps.$inferInsert;
export type UpdateSkillGap = Partial<InsertSkillGap>;

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type SkillLevel = 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillCategory = 'technical' | 'soft_skill' | 'tool' | 'framework' | 'language' | 'certification';

export type LearningResource = {
  title: string;
  url: string;
  type: 'course' | 'article' | 'video' | 'book' | 'certification';
  provider?: string;
  duration?: string;
  cost?: string;
};

export type AnalysisRequest = {
  jobDescription: string;
  currentSkills: string[];
};

export type AnalysisResponse = {
  requiredSkills: string[];
  matchScore: number;
  suggestions: string[];
};