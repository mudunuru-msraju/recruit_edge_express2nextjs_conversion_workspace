# RecruitEdge - Business Requirements Document (BRD)

## Executive Summary

**Project Name:** RecruitEdge  
**Version:** 1.0.0  
**Date:** October 23, 2025  
**Document Owner:** Product Team

### Project Overview
RecruitEdge is a next-generation AI-powered recruitment platform designed to transform the hiring process through intelligent, modular agents. The platform serves three distinct user categories: Job Seekers, Recruiters, and Administrators, each with specialized AI agents tailored to their specific needs.

### Vision
To create the most comprehensive, modular, and intelligent recruitment platform where self-contained AI agents empower users to achieve their hiring and career goals efficiently.

---

## 1. Business Objectives

### Primary Goals
1. **Democratize AI-Powered Recruitment:** Make advanced AI recruiting tools accessible to companies of all sizes
2. **Empower Job Seekers:** Provide intelligent tools for career development and job search optimization
3. **Streamline Recruitment Operations:** Reduce time-to-hire and improve candidate quality through automation
4. **Modular Architecture:** Build a platform where agents are reusable, portable, and easily extensible

### Success Metrics
- **Platform Adoption:** 10,000+ active users within first 6 months
- **Time-to-Hire Reduction:** 40% average reduction for recruiters
- **Job Seeker Success Rate:** 60% placement rate within 3 months
- **Agent Utilization:** Average 5+ agent interactions per user per week
- **User Satisfaction:** NPS score > 50

---

## 2. Target Audience

### Job Seekers
- **Primary:** Entry to mid-level professionals seeking new opportunities
- **Secondary:** Career changers and upskilling professionals
- **Pain Points:** 
  - Difficulty creating effective resumes
  - Lack of interview preparation
  - Uncertainty about skill gaps
  - Limited career guidance

### Recruiters
- **Primary:** Corporate recruiters and talent acquisition specialists
- **Secondary:** Recruitment agencies and headhunters
- **Pain Points:**
  - Time-consuming candidate sourcing
  - Manual resume screening
  - Inefficient candidate matching
  - Difficulty creating compelling job descriptions

### Administrators
- **Primary:** HR managers and recruitment operations leads
- **Secondary:** C-level executives monitoring hiring metrics
- **Pain Points:**
  - Lack of real-time analytics
  - Manual application tracking
  - Compliance and data privacy concerns
  - Fragmented workflow management

---

## 3. MVP Feature Requirements

### 3.1 Core Platform Features

#### 3.1.1 User Authentication & Authorization
- **Auth.js Integration** with Google OAuth provider
- Role-based access control (Job Seeker, Recruiter, Admin)
- User profile management
- Session management with JWT tokens

#### 3.1.2 Landing Page
- **Hero Section:** Value proposition and CTA
- **Agent Categories:** Visual navigation to Job Seeker, Recruiter, and Admin agents
- **Features Showcase:** Platform capabilities overview
- **Responsive Design:** Mobile-first approach with Tailwind CSS

#### 3.1.3 User Dashboard
- **Activity Feed:** Recent agent interactions
- **Statistics Cards:** Key metrics (applications, saved jobs, agent sessions)
- **Saved Jobs List:** Bookmarked opportunities
- **Interaction History:** Complete log of agent conversations
- **Notification Center:** System and job alert notifications

### 3.2 Agent Architecture

#### 3.2.1 Standardized Agent Structure
Each agent must follow this directory structure:
```
app/agents/<category>-agents/<agent-slug>/
├── data/
│   └── manifest.json          # Agent metadata and configuration
├── contexts/
│   ├── AgentProvider.tsx      # State management provider
│   └── hooks.ts               # Custom React hooks
├── _components/
│   ├── Component1.tsx         # Reusable UI components
│   ├── Component2.tsx
│   └── ...
├── workspace/
│   ├── layout.tsx             # Workspace layout with sidebar/navbar
│   └── page.tsx               # Main workspace interface
├── page.tsx                   # Agent landing page
├── types.ts                   # TypeScript type definitions
├── assets/                    # Images, icons, and media
└── README.md                  # Setup and usage instructions
```

#### 3.2.2 Agent Manifest Schema
```json
{
  "slug": "agent-slug",
  "category": "job-seeker-agents | recruiter-agents | admin-agents",
  "title": "Agent Display Name",
  "description": "Brief agent description",
  "image": "/path/to/agent/image.png",
  "tags": ["tag1", "tag2"],
  "sampleQuestions": ["Question 1?", "Question 2?"],
  "aiProvider": "openai | anthropic | gemini",
  "modelName": "model-identifier",
  "features": ["feature1", "feature2"]
}
```

#### 3.2.3 Agent Routing
- **Landing Page:** `/<category>/<slug>`
  - Displays agent information from manifest.json
  - Shows capabilities and sample questions
  - "Open Workspace" CTA button
  
- **Workspace:** `/<category>/<slug>/workspace`
  - Agent-specific sidebar/navbar from workspace/layout.tsx
  - Main interface from workspace/page.tsx
  - Context providers for state management

### 3.3 Job Seeker Agents (MVP)

#### 3.3.1 Resume Builder Agent
**Slug:** `resume-builder`  
**Purpose:** Help job seekers create professional, ATS-optimized resumes

**Components:**
- `ResumeForm.tsx` - Multi-step form for resume data entry
- `ResumePreview.tsx` - Live preview of resume
- `TemplateSelector.tsx` - Choose from multiple resume templates
- `SectionEditor.tsx` - Edit individual resume sections
- `ExportButton.tsx` - Download as PDF/DOCX

**Features:**
- Multiple professional templates
- ATS keyword optimization
- Real-time preview
- Section-by-section editing
- AI-powered content suggestions
- Export to multiple formats

**Workspace Layout:**
- **Sidebar:** Template selection, section navigation, export options
- **Main Panel:** Form and live preview side-by-side
- **Settings Panel:** AI provider configuration, template customization

#### 3.3.2 Interview Prep Agent
**Slug:** `interview-prep`  
**Purpose:** Prepare candidates for interviews with AI-powered practice sessions

**Components:**
- `ChatInterface.tsx` - Interactive chat for mock interviews
- `QuestionCard.tsx` - Display interview questions
- `FeedbackPanel.tsx` - Show AI feedback on answers
- `MockInterview.tsx` - Full mock interview flow
- `ProgressTracker.tsx` - Track preparation progress

**Features:**
- Role-specific interview questions
- Mock interview simulations
- Real-time feedback on answers
- Behavioral and technical question practice
- Interview tips and best practices
- Progress tracking

**Workspace Layout:**
- **Sidebar:** Interview type selection, question categories, history
- **Main Panel:** Chat interface or mock interview UI
- **Settings Panel:** Interview difficulty, AI model selection

#### 3.3.3 Skill Gap Agent
**Slug:** `skill-gap-agent`  
**Purpose:** Analyze candidate skills and identify gaps for target roles

**Components:**
- `SkillAnalyzer.tsx` - Input current skills and target role
- `GapVisualizer.tsx` - Visual representation of skill gaps
- `RecommendationList.tsx` - Learning resource recommendations
- `CourseCard.tsx` - Display recommended courses
- `ProgressChart.tsx` - Track skill development

**Features:**
- Skills assessment and comparison
- Job description parsing
- Gap identification and prioritization
- Learning path recommendations
- Course and certification suggestions
- Progress tracking

**Workspace Layout:**
- **Sidebar:** Role selection, skill categories, bookmarks
- **Main Panel:** Analysis results and visualizations
- **Settings Panel:** Target roles, learning preferences

### 3.4 Recruiter Agents (MVP)

#### 3.4.1 Job Description Agent
**Slug:** `job-description-agent`  
**Purpose:** Generate compelling, inclusive job descriptions

**Components:**
- `JDForm.tsx` - Input role requirements
- `TemplateLibrary.tsx` - Pre-built JD templates
- `AIGenerator.tsx` - AI-powered generation interface
- `PreviewCard.tsx` - Preview generated JD
- `BiasChecker.tsx` - Identify biased language

**Features:**
- AI-generated job descriptions
- Template library for common roles
- Bias detection and removal
- SEO optimization for job boards
- Tone and length customization
- Multi-language support

**Workspace Layout:**
- **Sidebar:** Templates, generation history, saved drafts
- **Main Panel:** Form input and preview
- **Settings Panel:** AI model, tone preferences, compliance checks

#### 3.4.2 Resume Shortlisting Agent
**Slug:** `resume-shortlisting`  
**Purpose:** Automatically screen and rank candidate resumes

**Components:**
- `UploadZone.tsx` - Drag-and-drop resume upload
- `ResumeCard.tsx` - Display candidate summary
- `FilterPanel.tsx` - Apply filters (skills, experience, education)
- `ShortlistGrid.tsx` - Grid view of candidates
- `ScoreIndicator.tsx` - Visual match score display

**Features:**
- Bulk resume upload and parsing
- AI-powered candidate ranking
- Skills and keyword matching
- Experience level filtering
- Education verification
- Export shortlist

**Workspace Layout:**
- **Sidebar:** Filter controls, upload zone, shortlist summary
- **Main Panel:** Candidate grid with scores and details
- **Settings Panel:** Scoring criteria, matching algorithm preferences

#### 3.4.3 Matching Engine Agent
**Slug:** `matching-engine`  
**Purpose:** Match candidates to jobs using advanced AI algorithms

**Components:**
- `MatchDashboard.tsx` - Overview of matches
- `CandidateCard.tsx` - Candidate profile summary
- `JobCard.tsx` - Job posting summary
- `MatchScore.tsx` - Detailed score breakdown
- `ComparisonView.tsx` - Side-by-side comparison

**Features:**
- AI-powered candidate-job matching
- Multi-factor scoring (skills, experience, location, culture fit)
- Batch matching for multiple roles
- Match explanation and insights
- Candidate recommendations
- Export match reports

**Workspace Layout:**
- **Sidebar:** Job selection, filter controls, match criteria
- **Main Panel:** Match results with scores and insights
- **Settings Panel:** Matching algorithm, weight configuration

### 3.5 Admin Agents (MVP)

#### 3.5.1 Analytics Dashboard Agent
**Slug:** `analytics-dashboard`  
**Purpose:** Provide comprehensive recruitment analytics and insights

**Components:**
- `MetricsCard.tsx` - Key performance indicators
- `ChartContainer.tsx` - Wrapper for charts
- `TrendGraph.tsx` - Time-series trend visualization
- `FunnelView.tsx` - Recruitment funnel visualization
- `ExportButton.tsx` - Export reports

**Features:**
- Real-time recruitment metrics
- Time-to-hire tracking
- Source effectiveness analysis
- Conversion rate funnels
- Department and recruiter performance
- Custom date ranges
- Export to PDF/Excel

**Workspace Layout:**
- **Sidebar:** Metric selection, date filters, export options
- **Main Panel:** Interactive charts and graphs
- **Settings Panel:** Dashboard customization, refresh intervals

#### 3.5.2 Application Tracking Agent
**Slug:** `application-tracking`  
**Purpose:** Track and manage candidate applications through hiring stages

**Components:**
- `StatusBoard.tsx` - Kanban-style application board
- `CandidateRow.tsx` - Candidate entry in table view
- `StageSelector.tsx` - Move candidates between stages
- `TimelineView.tsx` - Application timeline
- `BulkActions.tsx` - Batch operations toolbar

**Features:**
- Visual application pipeline (Kanban/Table views)
- Drag-and-drop stage management
- Bulk actions (move, reject, schedule)
- Application status updates
- Automated notifications
- Filter and search
- Activity timeline

**Workspace Layout:**
- **Sidebar:** Stage navigation, filters, bulk actions
- **Main Panel:** Kanban board or table view
- **Settings Panel:** Pipeline stages, automation rules

### 3.6 Job Management System

#### 3.6.1 Job Posting Features
- **JobForm.tsx** - Create/edit job postings
- **JobCard.tsx** - Job summary card
- **JobList.tsx** - Browse all jobs
- **JobDetail.tsx** - Full job details page
- **JobFilters.tsx** - Filter jobs by criteria

**Capabilities:**
- CRUD operations for job postings
- Draft/Published/Closed/Archived status
- Rich text editor for descriptions
- Skills and requirements tagging
- Salary range specification
- Location and employment type
- Multi-posting to job boards (future)

### 3.7 Multi-Channel Alert System

#### 3.7.1 Alert Configuration
- **AlertPreferences.tsx** - User notification preferences
- **AlertForm.tsx** - Create job alerts
- **AlertCard.tsx** - Display active alerts
- **NotificationBell.tsx** - Notification center icon

#### 3.7.2 Notification Channels
1. **Email Notifications**
   - Job alerts matching criteria
   - Application status updates
   - Interview reminders
   - System notifications

2. **WhatsApp Notifications** (via Twilio)
   - Urgent job matches
   - Interview confirmations
   - Offer letters
   - Time-sensitive alerts

3. **Telegram Notifications** (via Telegram Bot API)
   - Real-time job alerts
   - Application updates
   - Chat-based interactions
   - Command-based queries

#### 3.7.3 Inngest Background Jobs
- Job alert matching (hourly/daily/weekly)
- Email campaign delivery
- WhatsApp message queuing
- Telegram notification dispatch
- Analytics aggregation
- Data cleanup tasks

### 3.8 AI Integration

#### 3.8.1 Multi-Provider Support
**OpenAI (via Replit AI Integrations)**
- Models: GPT-4o, GPT-5, GPT-4.1
- Use Cases: Resume generation, interview prep, job description writing
- Benefits: No API key needed, billed to Replit credits

**Anthropic Claude**
- Models: Claude 3.5 Sonnet, Claude 3 Opus
- Use Cases: Long-form content, complex analysis, reasoning tasks
- Setup: User-provided API key

**Google Gemini**
- Models: Gemini 1.5 Pro, Gemini 1.5 Flash
- Use Cases: Multi-modal analysis, fast responses, cost optimization
- Setup: User-provided API key

#### 3.8.2 Per-Agent AI Configuration
- **AgentSettings.tsx** component in each agent's `_components/`
- Provider selection (OpenAI/Anthropic/Gemini)
- Model selection
- Temperature control (0-100 slider → 0.0-1.0)
- Max tokens configuration
- Custom system prompts
- Settings saved to PostgreSQL `agent_settings` table

---

## 4. Technical Architecture

### 4.1 Technology Stack

#### Frontend
- **Framework:** React 18 with TypeScript 5+
- **Build Tool:** Vite
- **Routing:** React Router v6
- **UI Library:** Shadcn UI components
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** Zustand
- **Data Fetching:** React Query (TanStack Query)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Utilities:** date-fns, axios, clsx, tailwind-merge

#### Backend
- **Language:** Python 3.11+ (planned migration to FastAPI)
- **Current:** Express.js (Node.js)
- **API Style:** RESTful
- **Authentication:** Auth.js with Google OAuth
- **Database ORM:** Drizzle ORM (TypeScript)
- **Background Jobs:** Inngest
- **Notifications:** Twilio (WhatsApp), Telegram Bot API, FastAPI-mail

#### Database
- **Engine:** PostgreSQL 18 (fallback to 17.6)
- **ORM:** Drizzle ORM with full TypeScript support
- **Migrations:** Drizzle Kit (push-based, no manual SQL)
- **Connection:** Neon Serverless with WebSocket support

#### AI & External Services
- **OpenAI:** Via Replit AI Integrations (no API key required)
- **Anthropic:** Claude API
- **Google:** Gemini API
- **Twilio:** WhatsApp Business API
- **Telegram:** Bot API for notifications

### 4.2 Database Schema

#### Core Tables
1. **users** - User accounts and authentication
2. **user_profiles** - Extended user information (bio, skills, experience)
3. **jobs** - Job postings
4. **applications** - Job applications
5. **agent_interactions** - Logs of user-agent conversations
6. **agent_settings** - Per-user, per-agent AI configuration
7. **job_alerts** - User job alert preferences
8. **notification_preferences** - Multi-channel notification settings

#### Key Relationships
- Users → UserProfiles (1:1)
- Users → Jobs (1:many, for recruiters)
- Users → Applications (1:many, for job seekers)
- Jobs → Applications (1:many)
- Users → AgentInteractions (1:many)
- Users → AgentSettings (1:many)
- Users → JobAlerts (1:many)

### 4.3 Security & Compliance

#### Authentication & Authorization
- OAuth 2.0 with Google Sign-In
- JWT-based session management
- Role-based access control (RBAC)
- Secure password hashing (bcrypt)

#### Data Privacy
- GDPR compliance measures
- Data encryption at rest and in transit
- User data export functionality
- Right to deletion (GDPR Article 17)
- Anonymization for analytics

#### API Security
- CORS configuration for frontend
- Rate limiting (future)
- Input validation and sanitization
- SQL injection prevention via ORM

---

## 5. User Workflows

### 5.1 Job Seeker Journey

#### Onboarding
1. User arrives at landing page
2. Clicks "Get Started" → Sign up with Google
3. Selects "Job Seeker" role
4. Completes profile (skills, experience, preferences)
5. Redirected to dashboard

#### Resume Creation
1. Navigates to Job Seeker Agents
2. Selects "Resume Builder" agent
3. Opens workspace
4. Fills in resume sections using forms
5. AI suggests improvements
6. Previews and downloads resume

#### Interview Preparation
1. Opens "Interview Prep" agent workspace
2. Selects target role (e.g., "Software Engineer")
3. Starts mock interview session
4. AI asks questions, user responds via chat
5. Receives instant feedback
6. Reviews session history and recommendations

#### Skill Development
1. Opens "Skill Gap Agent" workspace
2. Inputs current skills and target job description
3. Views gap analysis visualization
4. Receives learning path recommendations
5. Bookmarks courses and tracks progress

#### Job Search & Alerts
1. Browses jobs on platform
2. Creates job alert with criteria (role, location, salary)
3. Enables email + WhatsApp notifications
4. Receives real-time alerts
5. Applies to matching jobs

### 5.2 Recruiter Journey

#### Onboarding
1. Signs up as "Recruiter"
2. Completes company profile
3. Sets up team members (future)
4. Redirected to recruiter dashboard

#### Job Posting
1. Opens "Job Description Agent" workspace
2. Inputs role requirements
3. AI generates optimized job description
4. Reviews and edits
5. Publishes job to platform

#### Candidate Sourcing
1. Opens "Resume Shortlisting" agent workspace
2. Uploads candidate resumes in bulk
3. Sets filtering criteria (skills, experience)
4. AI ranks candidates by match score
5. Reviews top candidates

#### Candidate Matching
1. Opens "Matching Engine" workspace
2. Selects job posting
3. AI suggests best-fit candidates from database
4. Reviews match scores and explanations
5. Shortlists candidates for interviews

#### Application Management
1. Opens "Application Tracking" agent (admin access)
2. Views candidates in pipeline (Kanban view)
3. Moves candidates through stages
4. Sends automated status updates
5. Schedules interviews

### 5.3 Admin Journey

#### Platform Management
1. Logs in as "Admin"
2. Accesses admin dashboard
3. Views platform-wide metrics

#### Analytics Review
1. Opens "Analytics Dashboard" agent
2. Selects date range and metrics
3. Views recruitment funnel, time-to-hire, source effectiveness
4. Exports reports for stakeholders

#### Compliance Monitoring
1. Reviews data privacy compliance status
2. Processes data deletion requests
3. Monitors user activity logs
4. Ensures GDPR compliance

---

## 6. Future Enhancements (Post-MVP)

### 6.1 Phase 2 Features
1. **Stripe Integration**
   - Subscription plans (Free, Pro, Enterprise)
   - Billing dashboard
   - Usage-based pricing for AI credits

2. **Advanced Job Search**
   - Multi-criteria filters (salary, location, remote)
   - Saved searches
   - Job board integrations (LinkedIn, Indeed)

3. **File Storage**
   - Resume and portfolio uploads
   - Document management
   - Cloud storage integration

4. **Real-Time Notifications**
   - WebSocket-based live updates
   - In-app notification center
   - Push notifications (mobile)

5. **Conversation History**
   - Full agent interaction logs
   - Export to PDF/JSON
   - Search and replay

6. **Bulk Operations**
   - Batch resume processing
   - Multi-job posting
   - Mass email campaigns

### 6.2 Phase 3 Features
1. **LinkedIn Integration**
   - Import profiles
   - Auto-posting jobs
   - Candidate sourcing

2. **Video Interviews**
   - Integrated video platform
   - AI-powered interview analysis
   - Sentiment detection

3. **Advanced Analytics**
   - Predictive analytics (hire success rate)
   - Custom report builder
   - Scheduled reports

4. **Collaborative Features**
   - Team workspaces
   - Shared agent sessions
   - Comments and annotations
   - Role-based permissions

5. **Mobile Apps**
   - iOS and Android native apps
   - Mobile-optimized agent workspaces
   - Push notifications

6. **Additional Agent Categories**
   - **Learning & Development Agents:** Onboarding, training, skill tracking
   - **Compliance Agents:** Background checks, visa verification, legal compliance
   - **Marketing Agents:** Employer branding, social media, recruitment campaigns

---

## 7. Success Criteria & KPIs

### Platform Metrics
- **User Acquisition:** 10,000+ users in 6 months
- **Engagement:** 70% weekly active users
- **Retention:** 80% 30-day retention rate
- **Agent Utilization:** Average 5+ agent sessions per user per week

### Job Seeker Metrics
- **Resume Completion:** 85% of users complete resume
- **Interview Prep:** 60% complete at least one mock interview
- **Job Applications:** Average 10+ applications per user
- **Placement Rate:** 60% placement within 3 months

### Recruiter Metrics
- **Time-to-Hire:** 40% reduction
- **Candidate Quality:** 50% increase in qualified applicants
- **Cost-per-Hire:** 30% reduction
- **Offer Acceptance:** 75% acceptance rate

### Technical Metrics
- **Page Load Time:** < 2 seconds
- **API Response Time:** < 200ms (p95)
- **Uptime:** 99.9% availability
- **Error Rate:** < 0.1%

---

## 8. Risks & Mitigation

### Technical Risks
| Risk | Impact | Probability | Mitigation |
|------|---------|-------------|------------|
| AI provider rate limits | High | Medium | Multi-provider fallback, local caching |
| Database scaling issues | High | Low | Use Neon auto-scaling, optimize queries |
| Third-party API downtime | Medium | Medium | Graceful degradation, retry logic |
| Security vulnerabilities | High | Low | Regular audits, dependency updates |

### Business Risks
| Risk | Impact | Probability | Mitigation |
|------|---------|-------------|------------|
| Low user adoption | High | Medium | Strong marketing, freemium model |
| Competitor emergence | Medium | High | Unique value prop (modular agents) |
| AI accuracy issues | High | Medium | Human-in-the-loop review, feedback loops |
| Regulatory changes | High | Low | Legal compliance team, flexible architecture |

---

## 9. Dependencies & Constraints

### Dependencies
- **Replit AI Integrations:** For OpenAI access (no API key)
- **Neon PostgreSQL:** Database hosting
- **Twilio:** WhatsApp notifications
- **Google OAuth:** User authentication
- **Vercel/Netlify:** Future deployment (optional)

### Constraints
- **Budget:** Initial development on Replit free tier
- **Timeline:** MVP launch within 8-12 weeks
- **Team Size:** Small team (2-3 developers)
- **AI Costs:** Limited by Replit credits initially

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 10. Appendices

### A. Agent List Summary

#### Job Seeker Agents (MVP: 3, Future: 20+)
1. ✅ Resume Builder
2. ✅ Interview Prep Coach
3. ✅ Skill Gap Agent
4. Portfolio Builder (future)
5. Salary Benchmarking Agent (future)
6. Hot Skills Agent (future)
7. Progress Tracker (future)
8. Mentorship Connector (future)
9. ... (12 more agents)

#### Recruiter Agents (MVP: 3, Future: 19+)
1. ✅ Job Description Agent
2. ✅ Resume Shortlisting Agent
3. ✅ Matching Engine
4. Candidate Sourcing Agent (future)
5. AI Interview Maker (future)
6. Calendar Agent (future)
7. Background Verification Agent (future)
8. ... (12 more agents)

#### Admin Agents (MVP: 2, Future: 11+)
1. ✅ Analytics Dashboard Agent
2. ✅ Application Tracking Agent
3. Workflow Management Agent (future)
4. Background Check Agent (future)
5. Data Privacy Agent (future)
6. Communication Agent (SMS) (future)
7. ... (6 more agents)

### B. Glossary
- **ATS:** Applicant Tracking System
- **JD:** Job Description
- **NPS:** Net Promoter Score
- **GDPR:** General Data Protection Regulation
- **OAuth:** Open Authorization
- **JWT:** JSON Web Token
- **RBAC:** Role-Based Access Control
- **MVP:** Minimum Viable Product
- **KPI:** Key Performance Indicator

### C. References
- Drizzle ORM Documentation: https://orm.drizzle.team/
- Shadcn UI: https://ui.shadcn.com/
- React Router v6: https://reactrouter.com/
- Inngest Documentation: https://www.inngest.com/docs
- Auth.js: https://authjs.dev/

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Oct 23, 2025 | AI Agent | Initial BRD creation |

---

**Document Status:** ✅ Approved for Development  
**Next Review Date:** Nov 23, 2025
