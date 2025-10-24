/**
 * Skill Gap Analyzer Manifest (TypeScript)
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

export const skillGapAnalyzerManifest: AgentManifest = {
  slug: "skill-gap-analyzer",
  category: "job-seeker-agents",
  title: "Skill Gap Analyzer",
  description: "AI-powered skill analysis that compares your current skills against job requirements and provides personalized learning paths to close the gaps.",
  tags: ["skills", "career-development", "learning", "gap-analysis"],
  aiProvider: "openai",
  modelName: "gpt-4",
  features: [
    "Resume vs job requirement comparison",
    "Identify missing competencies",
    "Priority-based skill gap analysis",
    "Personalized learning resource recommendations",
    "Track skill development progress",
    "Generate custom learning roadmaps",
    "ATS-optimized skill suggestions",
    "Industry-specific skill trends"
  ],
  sampleQuestions: [
    "What skills am I missing for this job?",
    "How do I close skill gaps for a senior developer role?",
    "What courses should I take to improve my profile?",
    "How long will it take to learn the required skills?"
  ],
  version: "1.0.0",
  author: "RecruitEdge",
  license: "MIT"
};

export default skillGapAnalyzerManifest;
