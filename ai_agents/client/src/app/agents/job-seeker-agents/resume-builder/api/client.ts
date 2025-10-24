/**
 * Resume Builder API Client
 * Client-side functions to interact with backend API
 */

import { ResumeData } from '../types';
import { RESUME_BUILDER_API } from './routes';
import { API_BASE_URL, getMockUserId } from './config';

/**
 * Save resume to database
 */
export const saveResume = async (resumeData: ResumeData): Promise<{ id: number; success: boolean; resume: any }> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${RESUME_BUILDER_API.SAVE_RESUME}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      title: 'My Resume',
      ...resumeData,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save resume');
  }
  
  return response.json();
};

/**
 * Get resume by ID
 */
export const getResume = async (id: number): Promise<any> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${RESUME_BUILDER_API.GET_RESUME(id.toString())}?userId=${userId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch resume');
  }
  
  return response.json();
};

/**
 * Update existing resume
 */
export const updateResume = async (id: number, resumeData: ResumeData): Promise<{ success: boolean; resume: any }> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${RESUME_BUILDER_API.UPDATE_RESUME(id.toString())}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      title: 'My Resume',
      ...resumeData,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update resume');
  }
  
  return response.json();
};

/**
 * Delete resume
 */
export const deleteResume = async (id: number): Promise<{ success: boolean }> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${RESUME_BUILDER_API.DELETE_RESUME(id.toString())}?userId=${userId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete resume');
  }
  
  return response.json();
};

/**
 * List all user's resumes
 */
export const listResumes = async (): Promise<any[]> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${RESUME_BUILDER_API.LIST_RESUMES}?userId=${userId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch resumes');
  }
  
  return response.json();
};

/**
 * Export resume as PDF
 */
export const exportPDF = async (resumeData: ResumeData): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}${RESUME_BUILDER_API.EXPORT_PDF}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resumeData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to export PDF');
  }
  
  return response.blob();
};

/**
 * Export resume as DOCX
 */
export const exportDOCX = async (resumeData: ResumeData): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}${RESUME_BUILDER_API.EXPORT_DOCX}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resumeData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to export DOCX');
  }
  
  return response.blob();
};

/**
 * Generate AI summary
 */
export const generateAISummary = async (resumeData: ResumeData): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}${RESUME_BUILDER_API.AI_GENERATE_SUMMARY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resumeData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate summary');
  }
  
  const data = await response.json();
  return data.summary;
};

/**
 * Get agent interaction history
 */
export const getInteractionHistory = async (): Promise<any[]> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${RESUME_BUILDER_API.GET_HISTORY}?userId=${userId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch history');
  }
  
  return response.json();
};

/**
 * Save interaction to history
 */
export const saveInteraction = async (interaction: {
  type: string;
  data: any;
  timestamp: string;
}): Promise<{ success: boolean }> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${RESUME_BUILDER_API.SAVE_INTERACTION}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      ...interaction,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save interaction');
  }
  
  return response.json();
};
