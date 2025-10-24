/**
 * API Route Definitions for Skill Gap Analyzer
 */

export const SKILL_GAP_API = {
  GET_ANALYSES: '/api/agents/skill-gap-analyzer/analyses',
  GET_ANALYSIS: (id: string) => `/api/agents/skill-gap-analyzer/analyses/${id}`,
  CREATE_ANALYSIS: '/api/agents/skill-gap-analyzer/analyses',
  UPDATE_ANALYSIS: (id: string) => `/api/agents/skill-gap-analyzer/analyses/${id}`,
  DELETE_ANALYSIS: (id: string) => `/api/agents/skill-gap-analyzer/analyses/${id}`,
  
  GET_SKILL_GAPS: (analysisId: string) => `/api/agents/skill-gap-analyzer/analyses/${analysisId}/gaps`,
  UPDATE_SKILL_GAP: (analysisId: string, gapId: string) => `/api/agents/skill-gap-analyzer/analyses/${analysisId}/gaps/${gapId}`,
  
  ANALYZE_SKILLS: '/api/agents/skill-gap-analyzer/ai/analyze',
  GET_RESOURCES: '/api/agents/skill-gap-analyzer/ai/resources',
};
