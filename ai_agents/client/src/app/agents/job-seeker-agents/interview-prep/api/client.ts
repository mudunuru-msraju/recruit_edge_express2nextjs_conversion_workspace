/**
 * API Client for Interview Prep
 * Functions for making API calls to the backend
 */

import { API_BASE_URL, getMockUserId } from './config';
import { INTERVIEW_PREP_API } from './routes';
import {
  InterviewSession,
  InterviewQuestion,
  SessionConfig,
  InterviewType,
} from '../types';

/**
 * Get all sessions for a user
 */
export const getSessions = async (): Promise<InterviewSession[]> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${INTERVIEW_PREP_API.GET_SESSIONS}?userId=${userId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch sessions');
  }
  
  return response.json();
};

/**
 * Get a single session by ID
 */
export const getSession = async (id: number): Promise<InterviewSession> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${INTERVIEW_PREP_API.GET_SESSION(id.toString())}?userId=${userId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch session');
  }
  
  return response.json();
};

/**
 * Create a new interview session
 */
export const createSession = async (config: SessionConfig): Promise<{ id: number; session: InterviewSession }> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${INTERVIEW_PREP_API.CREATE_SESSION}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: parseInt(userId),
      ...config,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create session');
  }
  
  return response.json();
};

/**
 * Update an existing session
 */
export const updateSession = async (id: number, data: Partial<InterviewSession>): Promise<{ success: boolean; session: InterviewSession }> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${INTERVIEW_PREP_API.UPDATE_SESSION(id.toString())}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: parseInt(userId),
      ...data,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update session');
  }
  
  return response.json();
};

/**
 * Delete a session
 */
export const deleteSession = async (id: number): Promise<{ success: boolean }> => {
  const userId = getMockUserId();
  
  const response = await fetch(`${API_BASE_URL}${INTERVIEW_PREP_API.DELETE_SESSION(id.toString())}?userId=${userId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete session');
  }
  
  return response.json();
};

/**
 * Get questions for a session
 */
export const getQuestions = async (sessionId: number): Promise<InterviewQuestion[]> => {
  const response = await fetch(`${API_BASE_URL}${INTERVIEW_PREP_API.GET_QUESTIONS(sessionId.toString())}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch questions');
  }
  
  return response.json();
};

/**
 * Generate AI questions for a session
 */
export const generateQuestions = async (config: {
  interviewType: InterviewType;
  difficulty?: string;
  targetRole?: string;
  count?: number;
}): Promise<InterviewQuestion[]> => {
  const response = await fetch(`${API_BASE_URL}${INTERVIEW_PREP_API.GENERATE_QUESTIONS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate questions');
  }
  
  return response.json();
};

/**
 * Evaluate user's answer
 */
export const evaluateAnswer = async (question: string, answer: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}${INTERVIEW_PREP_API.EVALUATE_ANSWER}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to evaluate answer');
  }
  
  return response.json();
};
