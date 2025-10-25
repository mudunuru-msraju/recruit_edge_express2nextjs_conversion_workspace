/**
 * Cover Letter Writer Agent API Client
 * Self-contained API client for cover letter operations
 */

interface ApiResponse<T> {
  coverLetter?: T;
  coverLetters?: T[];
  templates?: T[];
  generatedContent?: string;
  improvedContent?: string;
  message?: string;
  error?: string;
}

interface CoverLetterApiData {
  id: number;
  userId: number;
  resumeId?: number;
  jobId?: number;
  title: string;
  content: string;
  recipientName?: string;
  recipientTitle?: string;
  companyName?: string;
  jobTitle?: string;
  tone: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateApiData {
  id: number;
  name: string;
  industry?: string;
  jobLevel?: string;
  tone: string;
  template: string;
  placeholders?: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class AgentApiClient {
  private baseUrl = '/api/agents/job-seeker-agents/cover-letter-writer';

  async getCoverLetters(userId: number): Promise<CoverLetterApiData[]> {
    const response = await fetch(`${this.baseUrl}?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cover letters');
    }
    const data: ApiResponse<CoverLetterApiData> = await response.json();
    return data.coverLetters || [];
  }

  async getCoverLetter(id: number, userId: number): Promise<CoverLetterApiData> {
    const response = await fetch(`${this.baseUrl}/${id}?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cover letter');
    }
    const data: ApiResponse<CoverLetterApiData> = await response.json();
    if (!data.coverLetter) {
      throw new Error('Cover letter not found');
    }
    return data.coverLetter;
  }

  async createCoverLetter(letterData: any): Promise<CoverLetterApiData> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(letterData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create cover letter');
    }
    
    const data: ApiResponse<CoverLetterApiData> = await response.json();
    if (!data.coverLetter) {
      throw new Error('Failed to create cover letter');
    }
    return data.coverLetter;
  }

  async updateCoverLetter(id: number, letterData: any): Promise<CoverLetterApiData> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(letterData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update cover letter');
    }
    
    const data: ApiResponse<CoverLetterApiData> = await response.json();
    if (!data.coverLetter) {
      throw new Error('Failed to update cover letter');
    }
    return data.coverLetter;
  }

  async deleteCoverLetter(id: number, userId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete cover letter');
    }
  }

  async getTemplates(): Promise<TemplateApiData[]> {
    const response = await fetch(`${this.baseUrl}/templates`);
    if (!response.ok) {
      throw new Error('Failed to fetch templates');
    }
    const data: ApiResponse<TemplateApiData> = await response.json();
    return data.templates || [];
  }

  // AI-powered features
  async generateCoverLetter(data: {
    userId: number;
    resumeId?: number;
    jobId?: number;
    jobDescription?: string;
    companyName: string;
    jobTitle: string;
    recipientName?: string;
    recipientTitle?: string;
    tone?: string;
    keywords?: string[];
    customInstructions?: string;
  }): Promise<{ generatedContent: string }> {
    const response = await fetch(`${this.baseUrl}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate cover letter');
    }
    
    return response.json();
  }

  async improveCoverLetter(data: {
    content: string;
    jobDescription?: string;
    targetTone?: string;
    improvementType?: string;
  }): Promise<{ improvedContent: string; suggestions: string[] }> {
    const response = await fetch(`${this.baseUrl}/ai/improve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to improve cover letter');
    }
    
    return response.json();
  }

  async analyzeCoverLetter(data: {
    content: string;
    jobDescription?: string;
  }): Promise<{ 
    score: number; 
    analysis: string; 
    suggestions: string[];
    keywords: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze cover letter');
    }
    
    return response.json();
  }

  async exportCoverLetter(id: number, format: 'pdf' | 'docx' | 'txt'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/${id}/export?format=${format}`);
    
    if (!response.ok) {
      throw new Error('Failed to export cover letter');
    }
    
    return response.blob();
  }
}

export const agentApiClient = new AgentApiClient();
export type { CoverLetterApiData, TemplateApiData };