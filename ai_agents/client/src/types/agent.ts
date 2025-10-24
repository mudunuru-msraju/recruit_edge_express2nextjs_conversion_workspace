/**
 * Agent Type Definitions for RecruitEdge
 * TypeScript interfaces for agent manifest and configuration
 */

/**
 * Agent category types
 */
export type AgentCategory =
  | "job-seeker-agents"
  | "recruiter-agents"
  | "admin-agents";

/**
 * AI Provider types supported by the platform
 */
export type AIProvider = "openai" | "anthropic" | "gemini";

/**
 * Agent manifest structure
 * This is loaded from each agent's data/manifest.json file
 */
export interface AgentManifest {
  slug: string;
  category: AgentCategory;
  title: string;
  description: string;
  image: string;
  tags: string[];
  sampleQuestions?: string[];
  aiProvider?: AIProvider;
  modelName?: string;
  features?: string[];
}

/**
 * Agent navigation menu item
 */
export interface AgentMenuItem {
  label: string;
  icon?: string;
  path: string;
  badge?: string;
}

/**
 * Agent settings for AI configuration
 */
export interface AgentAISettings {
  provider: AIProvider;
  modelName: string;
  temperature?: number;
  maxTokens?: number;
  additionalConfig?: Record<string, any>;
}
