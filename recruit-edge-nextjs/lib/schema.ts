/**
 * Database Schema for RecruitEdge Platform
 * Using Drizzle ORM with TypeScript for type-safe database operations
 * Migrated from Neon to standard PostgreSQL
 */

import { pgTable, serial, varchar, text, timestamp, integer, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Enum for user roles in the platform
 */
export const userRoleEnum = pgEnum('user_role', ['job_seeker', 'recruiter', 'admin']);

/**
 * Enum for AI provider types
 */
export const aiProviderEnum = pgEnum('ai_provider', ['openai', 'anthropic', 'gemini']);

/**
 * Enum for job status
 */
export const jobStatusEnum = pgEnum('job_status', ['draft', 'published', 'closed', 'archived']);

/**
 * Enum for application status
 */
export const applicationStatusEnum = pgEnum('application_status', [
  'applied',
  'screening',
  'interview_scheduled',
  'interviewing',
  'offer_sent',
  'accepted',
  'rejected',
  'withdrawn'
]);

/**
 * Enum for interview types
 */
export const interviewTypeEnum = pgEnum('interview_type', [
  'behavioral',
  'technical',
  'case_study',
  'system_design',
  'coding',
  'general'
]);

/**
 * Enum for difficulty levels
 */
export const difficultyLevelEnum = pgEnum('difficulty_level', ['easy', 'medium', 'hard']);

/**
 * Enum for skill gap priority
 */
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'critical']);

/**
 * Enum for subscription plans
 */
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['free', 'basic', 'professional', 'enterprise']);

/**
 * Enum for payment status
 */
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);

/**
 * Enum for content flag status
 */
export const flagStatusEnum = pgEnum('flag_status', ['pending', 'reviewed', 'resolved', 'dismissed']);

/**
 * Enum for user status
 */
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'suspended']);

/**
 * Enum for audit event types
 */
export const auditEventTypeEnum = pgEnum('audit_event_type', [
  'user_login',
  'user_logout',
  'user_created',
  'user_updated',
  'user_deleted',
  'data_exported',
  'settings_changed',
  'payment_processed',
  'content_flagged',
  'system_alert'
]);

/**
 * Users table - stores all platform users (job seekers, recruiters, admins)
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
  status: userStatusEnum('status').notNull().default('active'),
  googleId: varchar('google_id', { length: 255 }).unique(),
  avatarUrl: text('avatar_url'),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * User profiles - extended information for users
 */
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  bio: text('bio'),
  skills: jsonb('skills').$type<string[]>(),
  experience: jsonb('experience').$type<any[]>(),
  education: jsonb('education').$type<any[]>(),
  resumeUrl: text('resume_url'),
  portfolioUrl: text('portfolio_url'),
  preferences: jsonb('preferences').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Jobs table - stores job postings
 */
export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  recruiterId: integer('recruiter_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  requirements: jsonb('requirements').$type<string[]>(),
  skills: jsonb('skills').$type<string[]>(),
  location: varchar('location', { length: 255 }),
  salary: jsonb('salary').$type<{ min?: number; max?: number; currency: string }>(),
  employmentType: varchar('employment_type', { length: 100 }),
  status: jobStatusEnum('status').notNull().default('draft'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Applications table - stores job applications
 */
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').references(() => jobs.id).notNull(),
  applicantId: integer('applicant_id').references(() => users.id).notNull(),
  status: applicationStatusEnum('status').notNull().default('applied'),
  coverLetter: text('cover_letter'),
  resumeUrl: text('resume_url'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Agent interactions - stores user interactions with AI agents
 */
export const agentInteractions = pgTable('agent_interactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  agentSlug: varchar('agent_slug', { length: 255 }).notNull(),
  agentCategory: varchar('agent_category', { length: 100 }).notNull(),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  messages: jsonb('messages').$type<Array<{ role: string; content: string; timestamp: string }>>(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Agent settings - stores per-agent AI provider configuration
 */
export const agentSettings = pgTable('agent_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  agentSlug: varchar('agent_slug', { length: 255 }).notNull(),
  aiProvider: aiProviderEnum('ai_provider').notNull(),
  modelName: varchar('model_name', { length: 255 }).notNull(),
  temperature: integer('temperature'), // stored as integer (0-100), converted to 0.0-1.0
  maxTokens: integer('max_tokens'),
  additionalConfig: jsonb('additional_config').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Job alerts - stores user preferences for job notifications
 */
export const jobAlerts = pgTable('job_alerts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  criteria: jsonb('criteria').$type<Record<string, any>>().notNull(),
  emailEnabled: boolean('email_enabled').default(true),
  whatsappEnabled: boolean('whatsapp_enabled').default(false),
  telegramEnabled: boolean('telegram_enabled').default(false),
  frequency: varchar('frequency', { length: 50 }).default('daily'),
  lastSent: timestamp('last_sent'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Notification preferences - stores user notification settings
 */
export const notificationPreferences = pgTable('notification_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  email: varchar('email', { length: 255 }),
  whatsappNumber: varchar('whatsapp_number', { length: 50 }),
  telegramUsername: varchar('telegram_username', { length: 255 }),
  emailVerified: boolean('email_verified').default(false),
  whatsappVerified: boolean('whatsapp_verified').default(false),
  telegramVerified: boolean('telegram_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Resumes table - stores resume data from Resume Builder agent
 */
export const resumes = pgTable('resumes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull().default('Untitled Resume'),
  personalInfo: jsonb('personal_info').$type<{
    fullName: string;
    email: string;
    phone: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  }>().notNull(),
  summary: text('summary'),
  experience: jsonb('experience').$type<Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    description: string;
    achievements: string[];
  }>>().notNull().default([]),
  education: jsonb('education').$type<Array<{
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
  }>>().notNull().default([]),
  skills: jsonb('skills').$type<string[]>().notNull().default([]),
  projects: jsonb('projects').$type<Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>>(),
  certifications: jsonb('certifications').$type<Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>>(),
  template: varchar('template', { length: 100 }).default('modern'),
  isPublic: boolean('is_public').default(false),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Interview Sessions - stores interview practice sessions from Interview Prep agent
 */
export const interviewSessions = pgTable('interview_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
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

/**
 * Interview Questions - stores questions and answers from Interview Prep sessions
 */
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

/**
 * Skill Analyses - stores skill gap analysis results from Skill Gap Analyzer agent
 */
export const skillAnalyses = pgTable('skill_analyses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  resumeId: integer('resume_id').references(() => resumes.id),
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

/**
 * Skill Gaps - stores individual skill gaps identified in analyses
 */
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

/**
 * Cover Letters - stores cover letters from Cover Letter Writer agent
 */
export const coverLetters = pgTable('cover_letters', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  resumeId: integer('resume_id').references(() => resumes.id),
  jobId: integer('job_id').references(() => jobs.id),
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
 * Job Matches - stores AI job matching results from Job Matcher agent
 */
export const jobMatches = pgTable('job_matches', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  jobId: integer('job_id').references(() => jobs.id).notNull(),
  resumeId: integer('resume_id').references(() => resumes.id),
  matchScore: integer('match_score').notNull(), // 0-100
  skillsMatch: jsonb('skills_match').$type<{
    matched: string[];
    missing: string[];
    additional: string[];
  }>(),
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
 * Salary Research - stores salary data from Salary Negotiator agent
 */
export const salaryResearch = pgTable('salary_research', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  experienceLevel: varchar('experience_level', { length: 50 }), // entry, mid, senior, lead, principal
  industry: varchar('industry', { length: 100 }),
  salaryRange: jsonb('salary_range').$type<{
    min: number;
    max: number;
    median: number;
    currency: string;
  }>().notNull(),
  marketData: jsonb('market_data').$type<{
    percentile25: number;
    percentile50: number;
    percentile75: number;
    percentile90: number;
  }>(),
  benefits: jsonb('benefits').$type<string[]>(),
  negotiationTips: jsonb('negotiation_tips').$type<Array<{
    category: string;
    tip: string;
  }>>(),
  sources: jsonb('sources').$type<string[]>(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Candidate Screenings - stores screening results from Candidate Screener agent
 */
export const candidateScreenings = pgTable('candidate_screenings', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references(() => applications.id).notNull(),
  recruiterId: integer('recruiter_id').references(() => users.id).notNull(),
  overallScore: integer('overall_score').notNull(), // 0-100
  resumeScore: integer('resume_score'), // 0-100
  skillsScore: integer('skills_score'), // 0-100
  experienceScore: integer('experience_score'), // 0-100
  educationScore: integer('education_score'), // 0-100
  cultureFitScore: integer('culture_fit_score'), // 0-100
  recommendation: varchar('recommendation', { length: 50 }).notNull(), // strong_yes, yes, maybe, no, strong_no
  strengths: jsonb('strengths').$type<string[]>(),
  concerns: jsonb('concerns').$type<string[]>(),
  notes: text('notes'),
  aiAnalysis: text('ai_analysis'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Interview Schedules - stores interview scheduling from Interview Scheduler agent
 */
export const interviewSchedules = pgTable('interview_schedules', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references(() => applications.id).notNull(),
  interviewerId: integer('interviewer_id').references(() => users.id).notNull(),
  candidateId: integer('candidate_id').references(() => users.id).notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  duration: integer('duration').notNull(), // in minutes
  interviewType: interviewTypeEnum('interview_type').notNull(),
  location: varchar('location', { length: 255 }), // physical address or video link
  meetingLink: text('meeting_link'),
  status: varchar('status', { length: 50 }).notNull().default('scheduled'), // scheduled, completed, cancelled, no_show
  notes: text('notes'),
  feedback: text('feedback'),
  score: integer('score'), // 0-100
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Offer Letters - stores offer letters from Offer Letter Builder agent
 */
export const offerLetters = pgTable('offer_letters', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references(() => applications.id).notNull(),
  recruiterId: integer('recruiter_id').references(() => users.id).notNull(),
  candidateId: integer('candidate_id').references(() => users.id).notNull(),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  salary: jsonb('salary').$type<{
    amount: number;
    currency: string;
    frequency: string; // yearly, monthly, hourly
  }>().notNull(),
  benefits: jsonb('benefits').$type<string[]>(),
  startDate: timestamp('start_date'),
  employmentType: varchar('employment_type', { length: 100 }), // full_time, part_time, contract, internship
  location: varchar('location', { length: 255 }),
  content: text('content').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, sent, accepted, rejected, negotiating
  expiresAt: timestamp('expires_at'),
  acceptedAt: timestamp('accepted_at'),
  rejectedAt: timestamp('rejected_at'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Talent Pipeline - stores candidate relationship data from Talent Pipeline Manager agent
 */
export const talentPipeline = pgTable('talent_pipeline', {
  id: serial('id').primaryKey(),
  recruiterId: integer('recruiter_id').references(() => users.id).notNull(),
  candidateId: integer('candidate_id').references(() => users.id).notNull(),
  stage: varchar('stage', { length: 100 }).notNull(), // sourced, contacted, interested, interviewing, offered, hired, archived
  source: varchar('source', { length: 255 }), // linkedin, referral, job_board, etc.
  tags: jsonb('tags').$type<string[]>(),
  rating: integer('rating'), // 1-5
  lastContactedAt: timestamp('last_contacted_at'),
  nextFollowUpAt: timestamp('next_follow_up_at'),
  notes: text('notes'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Platform Metrics - stores system-wide analytics from Platform Analytics agent
 */
export const platformMetrics = pgTable('platform_metrics', {
  id: serial('id').primaryKey(),
  metricType: varchar('metric_type', { length: 100 }).notNull(), // daily_active_users, jobs_posted, applications_submitted, etc.
  metricDate: timestamp('metric_date').notNull(),
  value: integer('value').notNull(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Content Flags - stores flagged content from Content Moderator agent
 */
export const contentFlags = pgTable('content_flags', {
  id: serial('id').primaryKey(),
  reporterId: integer('reporter_id').references(() => users.id),
  contentType: varchar('content_type', { length: 100 }).notNull(), // resume, job, application, profile, etc.
  contentId: integer('content_id').notNull(),
  reason: varchar('reason', { length: 255 }).notNull(),
  description: text('description'),
  status: flagStatusEnum('status').notNull().default('pending'),
  reviewerId: integer('reviewer_id').references(() => users.id),
  reviewNotes: text('review_notes'),
  reviewedAt: timestamp('reviewed_at'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Subscriptions - stores user subscription data for Billing Manager agent
 */
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  plan: subscriptionPlanEnum('plan').notNull().default('free'),
  status: varchar('status', { length: 50 }).notNull().default('active'), // active, cancelled, expired, suspended
  billingCycle: varchar('billing_cycle', { length: 50 }), // monthly, yearly
  amount: integer('amount'), // in cents
  currency: varchar('currency', { length: 10 }).default('USD'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  renewsAt: timestamp('renews_at'),
  cancelledAt: timestamp('cancelled_at'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Payments - stores payment transaction history for Billing Manager agent
 */
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  subscriptionId: integer('subscription_id').references(() => subscriptions.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  amount: integer('amount').notNull(), // in cents
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
  status: paymentStatusEnum('status').notNull(),
  paymentMethod: varchar('payment_method', { length: 100 }), // credit_card, paypal, stripe, etc.
  transactionId: varchar('transaction_id', { length: 255 }),
  description: text('description'),
  paidAt: timestamp('paid_at'),
  refundedAt: timestamp('refunded_at'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * System Health - stores system monitoring data from System Health Monitor agent
 */
export const systemHealth = pgTable('system_health', {
  id: serial('id').primaryKey(),
  checkTime: timestamp('check_time').notNull(),
  service: varchar('service', { length: 100 }).notNull(), // api, database, storage, queue, etc.
  status: varchar('status', { length: 50 }).notNull(), // healthy, degraded, down
  responseTime: integer('response_time'), // in milliseconds
  errorCount: integer('error_count').default(0),
  metrics: jsonb('metrics').$type<Record<string, any>>(),
  alerts: jsonb('alerts').$type<Array<{
    severity: string;
    message: string;
  }>>(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Audit Logs - stores audit trail from Audit Logger agent
 */
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  eventType: auditEventTypeEnum('event_type').notNull(),
  entityType: varchar('entity_type', { length: 100 }), // user, job, application, etc.
  entityId: integer('entity_id'),
  action: varchar('action', { length: 255 }).notNull(),
  changes: jsonb('changes').$type<Record<string, any>>(),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relationships between tables

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  jobsPosted: many(jobs),
  applications: many(applications),
  agentInteractions: many(agentInteractions),
  agentSettings: many(agentSettings),
  jobAlerts: many(jobAlerts),
  resumes: many(resumes),
  interviewSessions: many(interviewSessions),
  skillAnalyses: many(skillAnalyses),
  notificationPreferences: one(notificationPreferences, {
    fields: [users.id],
    references: [notificationPreferences.userId],
  }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  recruiter: one(users, {
    fields: [jobs.recruiterId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  applicant: one(users, {
    fields: [applications.applicantId],
    references: [users.id],
  }),
}));

export const interviewSessionsRelations = relations(interviewSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [interviewSessions.userId],
    references: [users.id],
  }),
  questions: many(interviewQuestions),
}));

export const interviewQuestionsRelations = relations(interviewQuestions, ({ one }) => ({
  session: one(interviewSessions, {
    fields: [interviewQuestions.sessionId],
    references: [interviewSessions.id],
  }),
}));

export const skillAnalysesRelations = relations(skillAnalyses, ({ one, many }) => ({
  user: one(users, {
    fields: [skillAnalyses.userId],
    references: [users.id],
  }),
  resume: one(resumes, {
    fields: [skillAnalyses.resumeId],
    references: [resumes.id],
  }),
  skillGaps: many(skillGaps),
}));

export const skillGapsRelations = relations(skillGaps, ({ one }) => ({
  analysis: one(skillAnalyses, {
    fields: [skillGaps.analysisId],
    references: [skillAnalyses.id],
  }),
}));

// Export types for use in application
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

export type AgentInteraction = typeof agentInteractions.$inferSelect;
export type InsertAgentInteraction = typeof agentInteractions.$inferInsert;

export type AgentSetting = typeof agentSettings.$inferSelect;
export type InsertAgentSetting = typeof agentSettings.$inferInsert;

export type JobAlert = typeof jobAlerts.$inferSelect;
export type InsertJobAlert = typeof jobAlerts.$inferInsert;

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = typeof resumes.$inferInsert;

export type InterviewSession = typeof interviewSessions.$inferSelect;
export type InsertInterviewSession = typeof interviewSessions.$inferInsert;

export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
export type InsertInterviewQuestion = typeof interviewQuestions.$inferInsert;

export type SkillAnalysis = typeof skillAnalyses.$inferSelect;
export type InsertSkillAnalysis = typeof skillAnalyses.$inferInsert;

export type SkillGap = typeof skillGaps.$inferSelect;
export type InsertSkillGap = typeof skillGaps.$inferInsert;

export type CoverLetter = typeof coverLetters.$inferSelect;
export type InsertCoverLetter = typeof coverLetters.$inferInsert;

export type JobMatch = typeof jobMatches.$inferSelect;
export type InsertJobMatch = typeof jobMatches.$inferInsert;

export type SalaryResearch = typeof salaryResearch.$inferSelect;
export type InsertSalaryResearch = typeof salaryResearch.$inferInsert;

export type CandidateScreening = typeof candidateScreenings.$inferSelect;
export type InsertCandidateScreening = typeof candidateScreenings.$inferInsert;

export type InterviewSchedule = typeof interviewSchedules.$inferSelect;
export type InsertInterviewSchedule = typeof interviewSchedules.$inferInsert;

export type OfferLetter = typeof offerLetters.$inferSelect;
export type InsertOfferLetter = typeof offerLetters.$inferInsert;

export type TalentPipeline = typeof talentPipeline.$inferSelect;
export type InsertTalentPipeline = typeof talentPipeline.$inferInsert;

export type PlatformMetric = typeof platformMetrics.$inferSelect;
export type InsertPlatformMetric = typeof platformMetrics.$inferInsert;

export type ContentFlag = typeof contentFlags.$inferSelect;
export type InsertContentFlag = typeof contentFlags.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export type SystemHealth = typeof systemHealth.$inferSelect;
export type InsertSystemHealth = typeof systemHealth.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;