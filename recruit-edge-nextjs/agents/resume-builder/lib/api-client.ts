/**
 * Resume Builder Agent API Client
 * Self-contained API client for resume operations
 */

interface ApiResponse<T> {
  resume?: T;
  resumes?: T[];
  message?: string;
  error?: string;
}

interface ResumeApiData {
  id: number;
  userId: number;
  title: string;
  personalInfo: any;
  summary?: string;
  experience: any[];
  education: any[];
  skills: string[];
  projects?: any[];
  certifications?: any[];
  template: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

class AgentApiClient {
  private baseUrl = '/api/agents/job-seeker-agents/resume-builder';

  async getResumes(userId: number): Promise<ResumeApiData[]> {
    const response = await fetch(`${this.baseUrl}?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch resumes');
    }
    const data: ApiResponse<ResumeApiData> = await response.json();
    return data.resumes || [];
  }

  async getResume(id: number): Promise<ResumeApiData> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch resume');
    }
    const data: ApiResponse<ResumeApiData> = await response.json();
    if (!data.resume) {
      throw new Error('Resume not found');
    }
    return data.resume;
  }

  async createResume(resumeData: any): Promise<ResumeApiData> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create resume');
    }
    
    const data: ApiResponse<ResumeApiData> = await response.json();
    if (!data.resume) {
      throw new Error('Failed to create resume');
    }
    return data.resume;
  }

  async updateResume(id: number, resumeData: any): Promise<ResumeApiData> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update resume');
    }
    
    const data: ApiResponse<ResumeApiData> = await response.json();
    if (!data.resume) {
      throw new Error('Failed to update resume');
    }
    return data.resume;
  }

  async deleteResume(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete resume');
    }
  }

  // AI-powered features
  async generateSummary(data: {
    resumeData: any;
    targetRole?: string;
    tone?: string;
  }): Promise<{ summary: string }> {
    const response = await fetch(`${this.baseUrl}/ai/generate-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }
    
    return response.json();
  }

  async improveDescription(data: {
    description: string;
    role?: string;
    tone?: string;
  }): Promise<{ improvedDescription: string }> {
    const response = await fetch(`${this.baseUrl}/ai/improve-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to improve description');
    }
    
    return response.json();
  }

  async extractKeywords(data: {
    jobDescription: string;
    maxKeywords?: number;
  }): Promise<{ keywords: string[] }> {
    const response = await fetch(`${this.baseUrl}/ai/extract-keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to extract keywords');
    }
    
    return response.json();
  }
}

export const agentApiClient = new AgentApiClient();
export type { ResumeApiData };