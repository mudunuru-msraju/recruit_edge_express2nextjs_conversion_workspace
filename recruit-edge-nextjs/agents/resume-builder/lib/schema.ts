/**
 * Resume Builder Agent Schema
 * Self-contained database schema for the Resume Builder agent
 */

import { pgTable, serial, varchar, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Resume data structure type
 */
export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary?: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    gpa?: string;
    achievements: string[];
  }>;
  skills: string[];
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
}

/**
 * Agent-specific resume table
 * Note: This references the main schema but is self-contained for the agent
 */
export const agentResumes = pgTable('resumes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull().default('Untitled Resume'),
  personalInfo: jsonb('personal_info').$type<ResumeData['personalInfo']>().notNull(),
  summary: text('summary'),
  experience: jsonb('experience').$type<ResumeData['experience']>().notNull().default([]),
  education: jsonb('education').$type<ResumeData['education']>().notNull().default([]),
  skills: jsonb('skills').$type<string[]>().notNull().default([]),
  projects: jsonb('projects').$type<ResumeData['projects']>(),
  certifications: jsonb('certifications').$type<ResumeData['certifications']>(),
  template: varchar('template', { length: 100 }).default('modern'),
  isPublic: boolean('is_public').default(false),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Agent-specific interaction tracking
 */
export const agentInteractions = pgTable('agent_interactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  agentSlug: varchar('agent_slug', { length: 255 }).notNull().default('resume-builder'),
  agentCategory: varchar('agent_category', { length: 100 }).notNull().default('job-seeker-agents'),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  messages: jsonb('messages').$type<Array<{ role: string; content: string; timestamp: string }>>(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Resume templates for this agent
 */
export const resumeTemplates = pgTable('resume_templates', {
  id: varchar('id', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  description: text('description'),
  template: jsonb('template').notNull(),
  preview: text('preview'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const resumeRelations = relations(agentResumes, ({ many }) => ({
  interactions: many(agentInteractions),
}));

// Export types
export type AgentResume = typeof agentResumes.$inferSelect;
export type InsertAgentResume = typeof agentResumes.$inferInsert;

export type AgentInteraction = typeof agentInteractions.$inferSelect;
export type InsertAgentInteraction = typeof agentInteractions.$inferInsert;

export type ResumeTemplate = typeof resumeTemplates.$inferSelect;
export type InsertResumeTemplate = typeof resumeTemplates.$inferInsert;

// Export all tables for migration
export const agentTables = {
  resumes: agentResumes,
  agentInteractions,
  resumeTemplates
};

// Migration SQL for this agent
export const agentMigrations = `
-- Resume Builder Agent Tables
CREATE TABLE IF NOT EXISTS resumes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL DEFAULT 'Untitled Resume',
  personal_info JSONB NOT NULL,
  summary TEXT,
  experience JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '[]',
  projects JSONB,
  certifications JSONB,
  template VARCHAR(100) DEFAULT 'modern',
  is_public BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS agent_interactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  agent_slug VARCHAR(255) NOT NULL DEFAULT 'resume-builder',
  agent_category VARCHAR(100) NOT NULL DEFAULT 'job-seeker-agents',
  session_id VARCHAR(255) NOT NULL,
  messages JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS resume_templates (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  template JSONB NOT NULL,
  preview TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_user_id ON agent_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_session_id ON agent_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_resume_templates_category ON resume_templates(category);
`;