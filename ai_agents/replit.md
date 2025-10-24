# RecruitEdge

## Overview
RecruitEdge is an AI-powered recruitment platform designed with a modular agent architecture. It offers self-contained, portable AI agents for job seekers, recruiters, and administrators, each with its own UI, state management, and API integration. The platform aims to streamline recruitment processes using AI, providing a comprehensive solution for various hiring and job-seeking needs. It follows a monorepo structure, utilizing React with Vite for the client, Express with Node.js for the server, and PostgreSQL with Drizzle ORM for data management.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes
**October 23, 2025**
- Completed comprehensive UI rebuild of all 17 agent workspaces (excluding resume-builder which was already excellent)
- All agents now feature professional UI with forms, AI generation buttons (mock), CRUD operations, and database integration
- Fixed Tailwind dynamic class issue - using explicit classes for proper teal/green color rendering
- Fixed User Management agent to properly use database API instead of mock data
- Updated database schema: Added `userStatusEnum` ('active', 'inactive', 'suspended') and fields `status` and `lastLogin` to users table
- All 27 LSP errors fixed (removed unused imports and variables)
- All agent workspaces now match or exceed resume-builder quality standards

## System Architecture

### UI/UX Decisions
The frontend is built with React 18, TypeScript, and Vite. Styling is handled by Tailwind CSS with Shadcn UI components. The application enforces an agent-based modular design, where each agent is a self-contained module with its own directory structure, including data, types, contexts, components, API functions, and workspace UI. Agents are categorized into Job Seeker, Recruiter, and Admin, with consistent routing patterns for landing and workspace pages. All agents use unified teal color scheme for Job Seeker/Admin (bg-teal-600) and green for Recruiter (bg-green-600).

### Technical Implementations
- **Frontend**: React 18, TypeScript, Vite, React Router, Tailwind CSS, Shadcn UI, Tanstack Query (server state), Zustand (client state).
- **Backend**: Express.js, TypeScript, Drizzle ORM, Neon Serverless PostgreSQL.
- **State Management**: Agent-specific state uses React Context, global app state uses Zustand, and server state is managed by Tanstack Query with a 5-minute stale time.
- **API Design**: RESTful API with agent-specific endpoints (`/api/agents/<agent-slug>/*`).

### Feature Specifications
The platform currently features 18 complete agents:
- **Job Seeker Agents**: Resume Builder, Cover Letter Writer, Interview Prep, Skill Gap Analyzer, Job Matcher, Salary Negotiator.
- **Recruiter Agents**: Job Description Generator, Candidate Screener, Interview Scheduler, Offer Letter Builder, Talent Pipeline, Job Analytics.
- **Admin Agents**: User Management, Platform Analytics, Content Moderator, Billing Manager, System Monitor, Audit Logger.
Each agent provides full CRUD functionality and integrates with the database.

### System Design Choices
- **Monorepo Structure**: Organizes `client/`, `server/`, and `shared/` directories.
- **Database Schema**: Utilizes PostgreSQL with Drizzle ORM, featuring 26 tables. Employs JSONB columns for flexible data storage (e.g., resume sections, agent interaction metadata) and PostgreSQL enums for type safety (e.g., user roles, user status, job status). The users table includes status management (active/inactive/suspended) and lastLogin tracking for User Management agent.
- **Security Model**: Currently in development mode with user IDs accepted from request parameters (insecure). Future production implementation requires Auth.js integration for secure user authentication.

## External Dependencies

### Database
- **Neon Serverless PostgreSQL**: Cloud database solution.
- **Drizzle ORM**: Type-safe ORM for database interactions.

### AI Services (Planned)
- **OpenAI (GPT-4)**
- **Anthropic (Claude)**
- **Google Gemini**
(Currently placeholder implementations; actual integration pending).

### Authentication (Pending)
- **Auth.js (NextAuth.js)**: Planned for Google OAuth integration.

### Frontend Libraries
- **React Router DOM**: Client-side routing.
- **Tanstack React Query**: Server state management.
- **Axios**: HTTP client.
- **Zustand**: Lightweight client state management.
- **Lucide React**: Icon library.
- **Shadcn UI**: Component library.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Hook Form**: Form management.
- **Zod**: Schema validation.
- **Recharts**: Charting library.

### Backend Libraries
- **Express**: Web framework.
- **cors**: CORS middleware.
- **bcrypt**: Password hashing.
- **jsonwebtoken**: JWT tokens.
- **dotenv**: Environment variables.
- **ws**: WebSocket support.

### Development Tools
- **TypeScript**: Type safety.
- **tsx**: TypeScript execution for server.
- **Vite**: Frontend build tool.
- **Concurrently**: Run client and server simultaneously.
- **ESLint**: Code linting.
- **Prettier**: Code formatting.