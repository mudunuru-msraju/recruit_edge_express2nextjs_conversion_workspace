/**
 * API Client for Skill Gap Analyzer
 */

import { API_BASE_URL, getMockUserId } from './config';
import { SKILL_GAP_API } from './routes';
import { SkillAnalysis, SkillGap } from '../types';

export const getAnalyses = async (): Promise<SkillAnalysis[]> => {
  const userId = getMockUserId();
  const response = await fetch(`${API_BASE_URL}${SKILL_GAP_API.GET_ANALYSES}?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch analyses');
  return response.json();
};

export const createAnalysis = async (data: Partial<SkillAnalysis>): Promise<{ id: number; analysis: SkillAnalysis }> => {
  const userId = getMockUserId();
  const response = await fetch(`${API_BASE_URL}${SKILL_GAP_API.CREATE_ANALYSIS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: parseInt(userId), ...data }),
  });
  if (!response.ok) throw new Error('Failed to create analysis');
  return response.json();
};

export const getSkillGaps = async (analysisId: number): Promise<SkillGap[]> => {
  const response = await fetch(`${API_BASE_URL}${SKILL_GAP_API.GET_SKILL_GAPS(analysisId.toString())}`);
  if (!response.ok) throw new Error('Failed to fetch skill gaps');
  return response.json();
};
