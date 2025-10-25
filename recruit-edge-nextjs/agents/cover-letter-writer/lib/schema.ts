/**
 * Cover Letter Writer Agent Schema
 * Self-contained database schema for the Cover Letter Writer agent
 */

import { pgTable, serial, varchar, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Cover letter data structure types
 */
export interface CoverLetterData {
  userId: number;
  resumeId?: number;
  jobId?: number;
  title: string;
  content: string;
  recipientName?: string;
  recipientTitle?: string;
  companyName?: string;
  jobTitle?: string;
  tone: 'professional' | 'enthusiastic' | 'creative';
}

/**
 * Agent-specific cover letters table
 */
export const agentCoverLetters = pgTable('cover_letters', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  resumeId: integer('resume_id'),
  jobId: integer('job_id'),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  recipientName: varchar('recipient_name', { length: 255 }),
  recipientTitle: varchar('recipient_title', { length: 255 }),
  companyName: varchar('company_name', { length: 255 }),
  jobTitle: varchar('job_title', { length: 255 }),
  tone: varchar('tone', { length: 50 }).default('professional'), // professional, enthusiastic, creative
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Agent-specific interaction tracking
 */
export const agentInteractions = pgTable('agent_interactions_cover_letter', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  agentSlug: varchar('agent_slug', { length: 255 }).notNull().default('cover-letter-writer'),
  agentCategory: varchar('agent_category', { length: 100 }).notNull().default('job-seeker-agents'),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  messages: jsonb('messages').$type<Array<{ role: string; content: string; timestamp: string }>>(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Cover letter templates for reusability
 */
export const coverLetterTemplates = pgTable('cover_letter_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  industry: varchar('industry', { length: 100 }),
  jobLevel: varchar('job_level', { length: 50 }), // entry, mid, senior, executive
  tone: varchar('tone', { length: 50 }).default('professional'),
  template: text('template').notNull(),
  placeholders: jsonb('placeholders').$type<Record<string, string>>(),
  isActive: jsonb('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const coverLetterRelations = relations(agentCoverLetters, ({ many }) => ({
  interactions: many(agentInteractions),
}));

// Export types
export type AgentCoverLetter = typeof agentCoverLetters.$inferSelect;
export type InsertAgentCoverLetter = typeof agentCoverLetters.$inferInsert;

export type AgentInteraction = typeof agentInteractions.$inferSelect;
export type InsertAgentInteraction = typeof agentInteractions.$inferInsert;

export type CoverLetterTemplate = typeof coverLetterTemplates.$inferSelect;
export type InsertCoverLetterTemplate = typeof coverLetterTemplates.$inferInsert;

// Export all tables for migration
export const agentTables = {
  coverLetters: agentCoverLetters,
  agentInteractions,
  coverLetterTemplates
};

// Migration SQL for this agent
export const agentMigrations = `
-- Cover Letter Writer Agent Tables
CREATE TABLE IF NOT EXISTS cover_letters (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  resume_id INTEGER,
  job_id INTEGER,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  recipient_name VARCHAR(255),
  recipient_title VARCHAR(255),
  company_name VARCHAR(255),
  job_title VARCHAR(255),
  tone VARCHAR(50) DEFAULT 'professional',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS agent_interactions_cover_letter (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  agent_slug VARCHAR(255) NOT NULL DEFAULT 'cover-letter-writer',
  agent_category VARCHAR(100) NOT NULL DEFAULT 'job-seeker-agents',
  session_id VARCHAR(255) NOT NULL,
  messages JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS cover_letter_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  job_level VARCHAR(50),
  tone VARCHAR(50) DEFAULT 'professional',
  template TEXT NOT NULL,
  placeholders JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_created_at ON cover_letters(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_cover_letter_user_id ON agent_interactions_cover_letter(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_cover_letter_session_id ON agent_interactions_cover_letter(session_id);
CREATE INDEX IF NOT EXISTS idx_cover_letter_templates_industry ON cover_letter_templates(industry);
CREATE INDEX IF NOT EXISTS idx_cover_letter_templates_job_level ON cover_letter_templates(job_level);
`;