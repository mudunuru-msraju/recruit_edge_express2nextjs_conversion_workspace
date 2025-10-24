/**
 * Skill Gap Analyzer Type Definitions
 */

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type SkillLevel = 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ResourceType = 'course' | 'article' | 'video' | 'book' | 'certification';

export interface SkillAnalysis {
  id?: number;
  userId: number;
  resumeId?: number;
  targetRole: string;
  targetCompany?: string;
  jobDescription?: string;
  currentSkills: string[];
  requiredSkills: string[];
  overallScore?: number;
  summary?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillGap {
  id?: number;
  analysisId: number;
  skillName: string;
  priority: Priority;
  category?: string;
  currentLevel: SkillLevel;
  requiredLevel: SkillLevel;
  learningResources?: LearningResource[];
  estimatedTime?: string;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface LearningResource {
  title: string;
  url: string;
  type: ResourceType;
  provider?: string;
  duration?: string;
  cost?: string;
}

export interface SkillGapAnalyzerState {
  currentAnalysis: SkillAnalysis | null;
  skillGaps: SkillGap[];
  isAnalyzing: boolean;
}
