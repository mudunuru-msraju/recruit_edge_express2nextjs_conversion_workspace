/**
 * Resume Builder Agent Manifest (TypeScript)
 * Type-safe configuration for the agent
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

export const resumeBuilderManifest: AgentManifest = {
  slug: "resume-builder",
  category: "job-seeker-agents",
  title: "Resume Builder",
  description: "Create professional, ATS-optimized resumes with AI-powered suggestions and multiple templates. Build section-by-section with real-time preview.",
  tags: [
    "resume",
    "cv",
    "job-application",
    "career",
    "ats-optimization",
    "professional"
  ],
  aiProvider: "openai",
  modelName: "gpt-4",
  features: [
    "Multiple professional resume templates",
    "Real-time resume preview",
    "AI-powered content suggestions",
    "ATS keyword optimization",
    "Export to PDF and DOCX",
    "Section-by-section editing"
  ],
  sampleQuestions: [
    "How do I make my resume ATS-friendly?",
    "What's the best format for a software engineer resume?",
    "Can you help me write achievement bullets?",
    "How long should my resume be?",
    "What skills should I highlight for a product manager role?",
    "How do I format my education section?"
  ],
  version: "1.0.0",
  author: "RecruitEdge",
  license: "MIT"
};

export default resumeBuilderManifest;
