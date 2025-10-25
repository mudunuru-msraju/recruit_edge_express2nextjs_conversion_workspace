/**
 * Job Matcher Agent Schema
 * Self-contained database schema for the Job Matcher agent
 */

import { pgTable, serial, varchar, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Job match data structure types
 */
export interface JobMatchSkills {
  matched: string[];
  missing: string[];
  additional: string[];
}

export interface JobMatchData {
  userId: number;
  jobId: number;
  resumeId?: number;
  matchScore: number; // 0-100
  skillsMatch?: JobMatchSkills;
  experienceMatch?: number; // 0-100
  locationMatch?: number; // 0-100
  salaryMatch?: number; // 0-100
  cultureFit?: number; // 0-100
  aiSummary?: string;
  strengths?: string[];
  weaknesses?: string[];
  isBookmarked?: boolean;
  isApplied?: boolean;
}

/**
 * Agent-specific job matches table
 */
export const agentJobMatches = pgTable('job_matches', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  jobId: integer('job_id').notNull(),
  resumeId: integer('resume_id'),
  matchScore: integer('match_score').notNull(), // 0-100
  skillsMatch: jsonb('skills_match').$type<JobMatchSkills>(),
  experienceMatch: integer('experience_match'), // 0-100
  locationMatch: integer('location_match'), // 0-100
  salaryMatch: integer('salary_match'), // 0-100
  cultureFit: integer('culture_fit'), // 0-100
  aiSummary: text('ai_summary'),
  strengths: jsonb('strengths').$type<string[]>(),
  weaknesses: jsonb('weaknesses').$type<string[]>(),
  isBookmarked: boolean('is_bookmarked').default(false),
  isApplied: boolean('is_applied').default(false),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Agent-specific interaction tracking
 */
export const agentInteractions = pgTable('agent_interactions_job_matcher', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  agentSlug: varchar('agent_slug', { length: 255 }).notNull().default('job-matcher'),
  agentCategory: varchar('agent_category', { length: 100 }).notNull().default('job-seeker-agents'),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  messages: jsonb('messages').$type<Array<{ role: string; content: string; timestamp: string }>>(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Job search preferences for better matching
 */
export const jobPreferences = pgTable('job_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  preferredJobTypes: jsonb('preferred_job_types').$type<string[]>().default([]),
  preferredLocations: jsonb('preferred_locations').$type<string[]>().default([]),
  remotePreference: varchar('remote_preference', { length: 50 }).default('hybrid'), // remote, onsite, hybrid
  minSalary: integer('min_salary'),
  maxSalary: integer('max_salary'),
  preferredCompanySize: varchar('preferred_company_size', { length: 50 }), // startup, small, medium, large
  preferredIndustries: jsonb('preferred_industries').$type<string[]>().default([]),
  workExperienceLevel: varchar('work_experience_level', { length: 50 }), // entry, mid, senior, executive
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const jobMatchRelations = relations(agentJobMatches, ({ many }) => ({
  interactions: many(agentInteractions),
}));

// Export types
export type AgentJobMatch = typeof agentJobMatches.$inferSelect;
export type InsertAgentJobMatch = typeof agentJobMatches.$inferInsert;

export type AgentInteraction = typeof agentInteractions.$inferSelect;
export type InsertAgentInteraction = typeof agentInteractions.$inferInsert;

export type JobPreference = typeof jobPreferences.$inferSelect;
export type InsertJobPreference = typeof jobPreferences.$inferInsert;

// Export all tables for migration
export const agentTables = {
  jobMatches: agentJobMatches,
  agentInteractions,
  jobPreferences
};

// Migration SQL for this agent
export const agentMigrations = `
-- Job Matcher Agent Tables
CREATE TABLE IF NOT EXISTS job_matches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  job_id INTEGER NOT NULL,
  resume_id INTEGER,
  match_score INTEGER NOT NULL,
  skills_match JSONB,
  experience_match INTEGER,
  location_match INTEGER,
  salary_match INTEGER,
  culture_fit INTEGER,
  ai_summary TEXT,
  strengths JSONB,
  weaknesses JSONB,
  is_bookmarked BOOLEAN DEFAULT false,
  is_applied BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS agent_interactions_job_matcher (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  agent_slug VARCHAR(255) NOT NULL DEFAULT 'job-matcher',
  agent_category VARCHAR(100) NOT NULL DEFAULT 'job-seeker-agents',
  session_id VARCHAR(255) NOT NULL,
  messages JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS job_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  preferred_job_types JSONB DEFAULT '[]',
  preferred_locations JSONB DEFAULT '[]',
  remote_preference VARCHAR(50) DEFAULT 'hybrid',
  min_salary INTEGER,
  max_salary INTEGER,
  preferred_company_size VARCHAR(50),
  preferred_industries JSONB DEFAULT '[]',
  work_experience_level VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_matches_user_id ON job_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_match_score ON job_matches(match_score);
CREATE INDEX IF NOT EXISTS idx_job_matches_created_at ON job_matches(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_job_matcher_user_id ON agent_interactions_job_matcher(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_job_matcher_session_id ON agent_interactions_job_matcher(session_id);
CREATE INDEX IF NOT EXISTS idx_job_preferences_user_id ON job_preferences(user_id);
`;