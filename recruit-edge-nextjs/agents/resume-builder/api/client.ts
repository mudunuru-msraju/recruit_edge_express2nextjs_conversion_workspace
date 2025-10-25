/**
 * Resume Builder Agent API Client
 * Self-contained API client for the Resume Builder agent
 */

import { ResumeData, CreateResumeData, UpdateResumeData } from '../lib/validation';

// API configuration
const API_BASE = '/api/agents/job-seeker-agents/resume-builder';

// API endpoints
export const RESUME_BUILDER_API = {
  // CRUD operations
  RESUMES: `${API_BASE}/resumes`,
  RESUME: (id: string) => `${API_BASE}/resumes/${id}`,
  
  // AI operations
  AI_GENERATE_SUMMARY: `${API_BASE}/ai/generate-summary`,
  AI_IMPROVE_DESCRIPTIONS: `${API_BASE}/ai/improve-descriptions`,
  AI_EXTRACT_KEYWORDS: `${API_BASE}/ai/extract-keywords`,
  
  // Export operations
  EXPORT_PDF: `${API_BASE}/export/pdf`,
  EXPORT_DOCX: `${API_BASE}/export/docx`,
  
  // Templates and history
  TEMPLATES: `${API_BASE}/templates`,
  HISTORY: `${API_BASE}/history`,
} as const;

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ResumeListResponse {
  resumes: Array<{
    id: number;
    title: string;
    template: string;
    updatedAt: string;
    createdAt: string;
  }>;
  total: number;
}

export interface ResumeResponse {
  id: number;
  title: string;
  template: string;
  isPublic: boolean;
  personalInfo: ResumeData['personalInfo'];
  summary?: string;
  experience: ResumeData['experience'];
  education: ResumeData['education'];
  skills: string[];
  projects?: ResumeData['projects'];
  certifications?: ResumeData['certifications'];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateResponse {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
}

// API client class
export class ResumeBuilderAPIClient {
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Get all resumes for current user
  async getResumes(): Promise<ApiResponse<ResumeListResponse>> {
    return this.request<ResumeListResponse>(RESUME_BUILDER_API.RESUMES);
  }

  // Get specific resume by ID
  async getResume(id: string): Promise<ApiResponse<ResumeResponse>> {
    return this.request<ResumeResponse>(RESUME_BUILDER_API.RESUME(id));
  }

  // Create new resume
  async createResume(resumeData: CreateResumeData): Promise<ApiResponse<{ id: number; message: string }>> {
    return this.request<{ id: number; message: string }>(RESUME_BUILDER_API.RESUMES, {
      method: 'POST',
      body: JSON.stringify(resumeData),
    });
  }

  // Update existing resume
  async updateResume(id: string, resumeData: UpdateResumeData): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(RESUME_BUILDER_API.RESUME(id), {
      method: 'PUT',
      body: JSON.stringify(resumeData),
    });
  }

  // Delete resume
  async deleteResume(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(RESUME_BUILDER_API.RESUME(id), {
      method: 'DELETE',
    });
  }

  // AI: Generate summary
  async generateSummary(params: {
    resumeData: ResumeData;
    targetRole?: string;
    tone?: 'professional' | 'enthusiastic' | 'creative';
  }): Promise<ApiResponse<{ summary: string }>> {
    return this.request<{ summary: string }>(RESUME_BUILDER_API.AI_GENERATE_SUMMARY, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // AI: Improve descriptions
  async improveDescription(params: {
    description: string;
    role?: string;
    company?: string;
    tone?: 'professional' | 'enthusiastic' | 'creative';
  }): Promise<ApiResponse<{ improvedDescription: string; suggestions: string[] }>> {
    return this.request<{ improvedDescription: string; suggestions: string[] }>(
      RESUME_BUILDER_API.AI_IMPROVE_DESCRIPTIONS,
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
  }

  // AI: Extract keywords from job description
  async extractKeywords(params: {
    jobDescription: string;
    maxKeywords?: number;
  }): Promise<ApiResponse<{ keywords: string[]; suggestions: string[] }>> {
    return this.request<{ keywords: string[]; suggestions: string[] }>(
      RESUME_BUILDER_API.AI_EXTRACT_KEYWORDS,
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
  }

  // Export resume as PDF
  async exportPDF(resumeData: ResumeData & { title: string; template: string }): Promise<Blob | null> {
    try {
      const response = await fetch(RESUME_BUILDER_API.EXPORT_PDF, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('PDF export failed:', error);
      return null;
    }
  }

  // Export resume as DOCX
  async exportDOCX(resumeData: ResumeData & { title: string; template: string }): Promise<Blob | null> {
    try {
      const response = await fetch(RESUME_BUILDER_API.EXPORT_DOCX, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('DOCX export failed:', error);
      return null;
    }
  }

  // Get available templates
  async getTemplates(): Promise<ApiResponse<TemplateResponse[]>> {
    return this.request<TemplateResponse[]>(RESUME_BUILDER_API.TEMPLATES);
  }

  // Get interaction history
  async getHistory(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(RESUME_BUILDER_API.HISTORY);
  }

  // Save interaction to history
  async saveInteraction(interaction: {
    action: string;
    metadata?: Record<string, any>;
  }): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(RESUME_BUILDER_API.HISTORY, {
      method: 'POST',
      body: JSON.stringify(interaction),
    });
  }
}

// Export singleton instance
export const resumeBuilderAPI = new ResumeBuilderAPIClient();

// Export individual functions for convenience
export const {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  generateSummary,
  improveDescription,
  extractKeywords,
  exportPDF,
  exportDOCX,
  getTemplates,
  getHistory,
  saveInteraction,
} = resumeBuilderAPI;