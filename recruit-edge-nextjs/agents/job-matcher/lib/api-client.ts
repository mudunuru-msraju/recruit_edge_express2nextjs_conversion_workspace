/**
 * Job Matcher Agent API Client
 * Self-contained API client for job matching operations
 */

interface ApiResponse<T> {
  match?: T;
  matches?: T[];
  preferences?: T;
  message?: string;
  error?: string;
}

interface JobMatchApiData {
  id: number;
  userId: number;
  jobId: number;
  resumeId?: number;
  matchScore: number;
  skillsMatch?: {
    matched: string[];
    missing: string[];
    additional: string[];
  };
  experienceMatch?: number;
  locationMatch?: number;
  salaryMatch?: number;
  cultureFit?: number;
  aiSummary?: string;
  strengths?: string[];
  weaknesses?: string[];
  isBookmarked: boolean;
  isApplied: boolean;
  createdAt: string;
  updatedAt: string;
}

interface JobPreferencesApiData {
  id: number;
  userId: number;
  preferredJobTypes: string[];
  preferredLocations: string[];
  remotePreference: string;
  minSalary?: number;
  maxSalary?: number;
  preferredCompanySize?: string;
  preferredIndustries: string[];
  workExperienceLevel?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class AgentApiClient {
  private baseUrl = '/api/agents/job-seeker-agents/job-matcher';

  async getJobMatches(userId: number): Promise<JobMatchApiData[]> {
    const response = await fetch(`${this.baseUrl}/matches?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch job matches');
    }
    const data: ApiResponse<JobMatchApiData> = await response.json();
    return data.matches || [];
  }

  async analyzeJobMatch(matchData: {
    userId: number;
    jobId: number;
    resumeId?: number;
  }): Promise<JobMatchApiData> {
    const response = await fetch(`${this.baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze job match');
    }
    
    const data: ApiResponse<JobMatchApiData> = await response.json();
    if (!data.match) {
      throw new Error('Failed to analyze job match');
    }
    return data.match;
  }

  async updateJobMatch(id: number, updateData: {
    isBookmarked?: boolean;
    isApplied?: boolean;
  }): Promise<JobMatchApiData> {
    const response = await fetch(`${this.baseUrl}/matches/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update job match');
    }
    
    const data: ApiResponse<JobMatchApiData> = await response.json();
    if (!data.match) {
      throw new Error('Failed to update job match');
    }
    return data.match;
  }

  async deleteJobMatch(id: number, userId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/matches/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete job match');
    }
  }

  async getJobPreferences(userId: number): Promise<JobPreferencesApiData> {
    const response = await fetch(`${this.baseUrl}/preferences?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch job preferences');
    }
    const data: ApiResponse<JobPreferencesApiData> = await response.json();
    if (!data.preferences) {
      throw new Error('No job preferences found');
    }
    return data.preferences;
  }

  async updateJobPreferences(userId: number, preferencesData: any): Promise<JobPreferencesApiData> {
    const response = await fetch(`${this.baseUrl}/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...preferencesData }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update job preferences');
    }
    
    const data: ApiResponse<JobPreferencesApiData> = await response.json();
    if (!data.preferences) {
      throw new Error('Failed to update job preferences');
    }
    return data.preferences;
  }

  // AI-powered features
  async getPersonalizedRecommendations(userId: number): Promise<{ recommendations: any[] }> {
    const response = await fetch(`${this.baseUrl}/ai/recommendations?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }
    
    return response.json();
  }

  async analyzeSkillsGap(data: {
    userId: number;
    jobId: number;
  }): Promise<{ skillsGap: string[]; recommendations: string[] }> {
    const response = await fetch(`${this.baseUrl}/ai/skills-gap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze skills gap');
    }
    
    return response.json();
  }

  async getCareerInsights(userId: number): Promise<{ insights: any }> {
    const response = await fetch(`${this.baseUrl}/ai/career-insights?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get career insights');
    }
    
    return response.json();
  }
}

export const agentApiClient = new AgentApiClient();
export type { JobMatchApiData, JobPreferencesApiData };