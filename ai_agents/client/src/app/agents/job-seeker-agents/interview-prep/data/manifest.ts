/**
 * Interview Prep Manifest (TypeScript)
 * Type-safe configuration for the Interview Prep agent
 */

export interface AgentManifest {
  slug: string;
  category: string;
  title: string;
  description: string;
  icon?: string;
  tags: string[];
  aiProvider?: 'openai' | 'anthropic' | 'gemini';
  modelName?: string;
  features: string[];
  sampleQuestions: string[];
  version?: string;
  author?: string;
  license?: string;
}

export const interviewPrepManifest: AgentManifest = {
  slug: "interview-prep",
  category: "job-seeker-agents",
  title: "Interview Prep",
  description: "AI-powered mock interviews with personalized feedback and evaluation. Practice behavioral and technical questions, get real-time scoring, and track your progress across sessions.",
  tags: ["interview", "practice", "ai-feedback", "career-prep"],
  aiProvider: "openai",
  modelName: "gpt-4",
  features: [
    "Mock interview sessions with AI interviewer",
    "Behavioral, technical, and case study questions",
    "Real-time answer evaluation with scoring (0-100)",
    "Personalized improvement suggestions",
    "Track progress and performance trends",
    "Custom question banks by target role and company",
    "Session recordings and review",
    "Export interview reports"
  ],
  sampleQuestions: [
    "How can I prepare for behavioral interviews?",
    "Can you generate technical questions for a software engineer role?",
    "What are common interview mistakes to avoid?",
    "How do I answer 'Tell me about yourself' effectively?"
  ],
  version: "1.0.0",
  author: "RecruitEdge",
  license: "MIT"
};

export default interviewPrepManifest;
