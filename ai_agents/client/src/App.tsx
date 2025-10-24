/**
 * RecruitEdge Main Application Component
 * Handles routing for the entire platform including agents
 */

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobSeekerAgentsPage from './app/job-seeker-agents/page';
import RecruiterAgentsPage from './app/recruiter-agents/page';
import AdminAgentsPage from './app/admin-agents/page';
import AuthPage from './pages/AuthPage';

// Job Seeker Agents
import ResumeBuilderLanding from './app/agents/job-seeker-agents/resume-builder/page';
import ResumeBuilderWorkspace from './app/agents/job-seeker-agents/resume-builder/workspace/page';
import ResumeBuilderLayout from './app/agents/job-seeker-agents/resume-builder/workspace/layout';

import InterviewPrepLanding from './app/agents/job-seeker-agents/interview-prep/page';
import InterviewPrepWorkspace from './app/agents/job-seeker-agents/interview-prep/workspace/page';
import InterviewPrepLayout from './app/agents/job-seeker-agents/interview-prep/workspace/layout';

import SkillGapAnalyzerLanding from './app/agents/job-seeker-agents/skill-gap-analyzer/page';
import SkillGapAnalyzerWorkspace from './app/agents/job-seeker-agents/skill-gap-analyzer/workspace/page';
import SkillGapAnalyzerLayout from './app/agents/job-seeker-agents/skill-gap-analyzer/workspace/layout';

import CoverLetterWriterLanding from './app/agents/job-seeker-agents/cover-letter-writer/page';
import CoverLetterWriterWorkspace from './app/agents/job-seeker-agents/cover-letter-writer/workspace/page';

import JobMatcherLanding from './app/agents/job-seeker-agents/job-matcher/page';
import JobMatcherWorkspace from './app/agents/job-seeker-agents/job-matcher/workspace/page';

import SalaryNegotiatorLanding from './app/agents/job-seeker-agents/salary-negotiator/page';
import SalaryNegotiatorWorkspace from './app/agents/job-seeker-agents/salary-negotiator/workspace/page';

// Recruiter Agents
import JobDescriptionGeneratorLanding from './app/agents/recruiter-agents/job-description-generator/page';
import JobDescriptionGeneratorWorkspace from './app/agents/recruiter-agents/job-description-generator/workspace/page';

import CandidateScreenerLanding from './app/agents/recruiter-agents/candidate-screener/page';
import CandidateScreenerWorkspace from './app/agents/recruiter-agents/candidate-screener/workspace/page';

import InterviewSchedulerLanding from './app/agents/recruiter-agents/interview-scheduler/page';
import InterviewSchedulerWorkspace from './app/agents/recruiter-agents/interview-scheduler/workspace/page';

import OfferLetterBuilderLanding from './app/agents/recruiter-agents/offer-letter-builder/page';
import OfferLetterBuilderWorkspace from './app/agents/recruiter-agents/offer-letter-builder/workspace/page';

import TalentPipelineLanding from './app/agents/recruiter-agents/talent-pipeline/page';
import TalentPipelineWorkspace from './app/agents/recruiter-agents/talent-pipeline/workspace/page';

import JobAnalyticsLanding from './app/agents/recruiter-agents/job-analytics/page';
import JobAnalyticsWorkspace from './app/agents/recruiter-agents/job-analytics/workspace/page';

// Admin Agents
import UserManagementLanding from './app/agents/admin-agents/user-management/page';
import UserManagementWorkspace from './app/agents/admin-agents/user-management/workspace/page';

import PlatformAnalyticsLanding from './app/agents/admin-agents/platform-analytics/page';
import PlatformAnalyticsWorkspace from './app/agents/admin-agents/platform-analytics/workspace/page';

import ContentModeratorLanding from './app/agents/admin-agents/content-moderator/page';
import ContentModeratorWorkspace from './app/agents/admin-agents/content-moderator/workspace/page';

import BillingManagerLanding from './app/agents/admin-agents/billing-manager/page';
import BillingManagerWorkspace from './app/agents/admin-agents/billing-manager/workspace/page';

import SystemMonitorLanding from './app/agents/admin-agents/system-monitor/page';
import SystemMonitorWorkspace from './app/agents/admin-agents/system-monitor/workspace/page';

import AuditLoggerLanding from './app/agents/admin-agents/audit-logger/page';
import AuditLoggerWorkspace from './app/agents/admin-agents/audit-logger/workspace/page';

function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<HomePage />} />
      
      {/* Agent Category Pages */}
      <Route path="/job-seeker-agents" element={<JobSeekerAgentsPage />} />
      <Route path="/recruiter-agents" element={<RecruiterAgentsPage />} />
      <Route path="/admin-agents" element={<AdminAgentsPage />} />
      
      {/* Authentication (Placeholder) */}
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      
      {/* Resume Builder Agent */}
      <Route 
        path="/job-seeker-agents/resume-builder" 
        element={<ResumeBuilderLanding />} 
      />
      <Route 
        path="/job-seeker-agents/resume-builder/workspace" 
        element={
          <ResumeBuilderLayout>
            <ResumeBuilderWorkspace />
          </ResumeBuilderLayout>
        } 
      />

      {/* Interview Prep Agent */}
      <Route 
        path="/job-seeker-agents/interview-prep" 
        element={<InterviewPrepLanding />} 
      />
      <Route 
        path="/job-seeker-agents/interview-prep/workspace" 
        element={
          <InterviewPrepLayout>
            <InterviewPrepWorkspace />
          </InterviewPrepLayout>
        } 
      />

      {/* Skill Gap Analyzer Agent */}
      <Route 
        path="/job-seeker-agents/skill-gap-analyzer" 
        element={<SkillGapAnalyzerLanding />} 
      />
      <Route 
        path="/job-seeker-agents/skill-gap-analyzer/workspace" 
        element={
          <SkillGapAnalyzerLayout>
            <SkillGapAnalyzerWorkspace />
          </SkillGapAnalyzerLayout>
        } 
      />

      {/* Cover Letter Writer Agent */}
      <Route path="/job-seeker-agents/cover-letter-writer" element={<CoverLetterWriterLanding />} />
      <Route path="/job-seeker-agents/cover-letter-writer/workspace" element={<CoverLetterWriterWorkspace />} />

      {/* Job Matcher Agent */}
      <Route path="/job-seeker-agents/job-matcher" element={<JobMatcherLanding />} />
      <Route path="/job-seeker-agents/job-matcher/workspace" element={<JobMatcherWorkspace />} />

      {/* Salary Negotiator Agent */}
      <Route path="/job-seeker-agents/salary-negotiator" element={<SalaryNegotiatorLanding />} />
      <Route path="/job-seeker-agents/salary-negotiator/workspace" element={<SalaryNegotiatorWorkspace />} />

      {/* Recruiter Agents */}
      <Route path="/recruiter-agents/job-description-generator" element={<JobDescriptionGeneratorLanding />} />
      <Route path="/recruiter-agents/job-description-generator/workspace" element={<JobDescriptionGeneratorWorkspace />} />

      <Route path="/recruiter-agents/candidate-screener" element={<CandidateScreenerLanding />} />
      <Route path="/recruiter-agents/candidate-screener/workspace" element={<CandidateScreenerWorkspace />} />

      <Route path="/recruiter-agents/interview-scheduler" element={<InterviewSchedulerLanding />} />
      <Route path="/recruiter-agents/interview-scheduler/workspace" element={<InterviewSchedulerWorkspace />} />

      <Route path="/recruiter-agents/offer-letter-builder" element={<OfferLetterBuilderLanding />} />
      <Route path="/recruiter-agents/offer-letter-builder/workspace" element={<OfferLetterBuilderWorkspace />} />

      <Route path="/recruiter-agents/talent-pipeline" element={<TalentPipelineLanding />} />
      <Route path="/recruiter-agents/talent-pipeline/workspace" element={<TalentPipelineWorkspace />} />

      <Route path="/recruiter-agents/job-analytics" element={<JobAnalyticsLanding />} />
      <Route path="/recruiter-agents/job-analytics/workspace" element={<JobAnalyticsWorkspace />} />

      {/* Admin Agents */}
      <Route path="/admin-agents/user-management" element={<UserManagementLanding />} />
      <Route path="/admin-agents/user-management/workspace" element={<UserManagementWorkspace />} />

      <Route path="/admin-agents/platform-analytics" element={<PlatformAnalyticsLanding />} />
      <Route path="/admin-agents/platform-analytics/workspace" element={<PlatformAnalyticsWorkspace />} />

      <Route path="/admin-agents/content-moderator" element={<ContentModeratorLanding />} />
      <Route path="/admin-agents/content-moderator/workspace" element={<ContentModeratorWorkspace />} />

      <Route path="/admin-agents/billing-manager" element={<BillingManagerLanding />} />
      <Route path="/admin-agents/billing-manager/workspace" element={<BillingManagerWorkspace />} />

      <Route path="/admin-agents/system-monitor" element={<SystemMonitorLanding />} />
      <Route path="/admin-agents/system-monitor/workspace" element={<SystemMonitorWorkspace />} />

      <Route path="/admin-agents/audit-logger" element={<AuditLoggerLanding />} />
      <Route path="/admin-agents/audit-logger/workspace" element={<AuditLoggerWorkspace />} />
    </Routes>
  );
}

export default App;
