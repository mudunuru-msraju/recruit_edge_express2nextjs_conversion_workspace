import { 
  CreateSkillAnalysisInput,
  UpdateSkillAnalysisInput,
  SkillAnalysisResponse,
  UpdateSkillGapInput,
  SkillGapResponse,
  AnalyzeSkillsInput,
  AnalysisResultResponse
} from './validation';

const BASE_URL = '/api/agents/job-seeker-agents/skill-gap-analyzer';

export class SkillGapAnalyzerApiClient {
  // Analysis Management
  async getAnalyses(userId: number): Promise<SkillAnalysisResponse[]> {
    const response = await fetch(`${BASE_URL}/analyses?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch skill analyses');
    }
    return response.json();
  }

  async getAnalysis(id: number, userId: number): Promise<SkillAnalysisResponse> {
    const response = await fetch(`${BASE_URL}/analyses/${id}?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch skill analysis');
    }
    return response.json();
  }

  async createAnalysis(data: CreateSkillAnalysisInput): Promise<{ id: number; analysis: SkillAnalysisResponse }> {
    const response = await fetch(`${BASE_URL}/analyses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create skill analysis');
    }
    return response.json();
  }

  async updateAnalysis(
    id: number, 
    userId: number, 
    data: UpdateSkillAnalysisInput
  ): Promise<{ success: boolean; analysis: SkillAnalysisResponse }> {
    const response = await fetch(`${BASE_URL}/analyses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, userId }),
    });
    if (!response.ok) {
      throw new Error('Failed to update skill analysis');
    }
    return response.json();
  }

  async deleteAnalysis(id: number, userId: number): Promise<{ success: boolean }> {
    const response = await fetch(`${BASE_URL}/analyses/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete skill analysis');
    }
    return response.json();
  }

  // Skill Gap Management
  async getAnalysisGaps(analysisId: number): Promise<SkillGapResponse[]> {
    const response = await fetch(`${BASE_URL}/analyses/${analysisId}/gaps`);
    if (!response.ok) {
      throw new Error('Failed to fetch skill gaps');
    }
    return response.json();
  }

  async updateSkillGap(
    analysisId: number,
    gapId: number,
    data: UpdateSkillGapInput
  ): Promise<{ success: boolean; gap: SkillGapResponse }> {
    const response = await fetch(`${BASE_URL}/analyses/${analysisId}/gaps/${gapId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update skill gap');
    }
    return response.json();
  }

  // AI Features
  async analyzeSkills(data: AnalyzeSkillsInput): Promise<AnalysisResultResponse> {
    const response = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to analyze skills');
    }
    return response.json();
  }
}

export const skillGapAnalyzerApi = new SkillGapAnalyzerApiClient();