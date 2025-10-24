/**
 * RecruitEdge Server - Main entry point
 * Express server with CORS support for React frontend
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';
import { users, jobs, applications } from '../shared/schema.js';
// Job Seeker Agent Routes
import resumeBuilderRoutes from './routes/resumeBuilder.js';
import interviewPrepRoutes from './routes/interviewPrep.js';
import skillGapAnalyzerRoutes from './routes/skillGapAnalyzer.js';
import coverLetterWriterRoutes from './routes/coverLetterWriter.js';
import jobMatcherRoutes from './routes/jobMatcher.js';
import salaryNegotiatorRoutes from './routes/salaryNegotiator.js';

// Recruiter Agent Routes
import jobDescriptionGeneratorRoutes from './routes/jobDescriptionGenerator.js';
import candidateScreenerRoutes from './routes/candidateScreener.js';
import interviewSchedulerRoutes from './routes/interviewScheduler.js';
import offerLetterBuilderRoutes from './routes/offerLetterBuilder.js';
import talentPipelineRoutes from './routes/talentPipeline.js';
import jobAnalyticsRoutes from './routes/jobAnalytics.js';

// Admin Agent Routes
import userManagementRoutes from './routes/userManagement.js';
import platformAnalyticsRoutes from './routes/platformAnalytics.js';
import contentModeratorRoutes from './routes/contentModerator.js';
import billingManagerRoutes from './routes/billingManager.js';
import systemMonitorRoutes from './routes/systemMonitor.js';
import auditLoggerRoutes from './routes/auditLogger.js';

import { errorHandler } from './utils/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RecruitEdge API is running' });
});

// Job Seeker Agent Routes
app.use('/api/agents/resume-builder', resumeBuilderRoutes);
app.use('/api/agents/interview-prep', interviewPrepRoutes);
app.use('/api/agents/skill-gap-analyzer', skillGapAnalyzerRoutes);
app.use('/api/agents/cover-letter-writer', coverLetterWriterRoutes);
app.use('/api/agents/job-matcher', jobMatcherRoutes);
app.use('/api/agents/salary-negotiator', salaryNegotiatorRoutes);

// Recruiter Agent Routes
app.use('/api/agents/job-description-generator', jobDescriptionGeneratorRoutes);
app.use('/api/agents/candidate-screener', candidateScreenerRoutes);
app.use('/api/agents/interview-scheduler', interviewSchedulerRoutes);
app.use('/api/agents/offer-letter-builder', offerLetterBuilderRoutes);
app.use('/api/agents/talent-pipeline', talentPipelineRoutes);
app.use('/api/agents/job-analytics', jobAnalyticsRoutes);

// Admin Agent Routes
app.use('/api/agents/user-management', userManagementRoutes);
app.use('/api/agents/platform-analytics', platformAnalyticsRoutes);
app.use('/api/agents/content-moderator', contentModeratorRoutes);
app.use('/api/agents/billing-manager', billingManagerRoutes);
app.use('/api/agents/system-monitor', systemMonitorRoutes);
app.use('/api/agents/audit-logger', auditLoggerRoutes);

// User endpoints
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Jobs endpoints
app.get('/api/jobs', async (req, res) => {
  try {
    const allJobs = await db.select().from(jobs);
    res.json(allJobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Applications endpoints
app.get('/api/applications', async (req, res) => {
  try {
    const allApplications = await db.select().from(applications);
    res.json(allApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND',
    path: req.path,
  });
});

// Global error handler - must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RecruitEdge server running on port ${PORT}`);
  console.log(`📊 Database connected: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0]}`);
});
