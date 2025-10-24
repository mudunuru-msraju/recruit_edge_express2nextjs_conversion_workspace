/**
 * API Route Definitions for Interview Prep
 */

export const INTERVIEW_PREP_API = {
  // Session endpoints
  GET_SESSIONS: '/api/agents/interview-prep/sessions',
  GET_SESSION: (id: string) => `/api/agents/interview-prep/sessions/${id}`,
  CREATE_SESSION: '/api/agents/interview-prep/sessions',
  UPDATE_SESSION: (id: string) => `/api/agents/interview-prep/sessions/${id}`,
  DELETE_SESSION: (id: string) => `/api/agents/interview-prep/sessions/${id}`,
  
  // Question endpoints
  GET_QUESTIONS: (sessionId: string) => `/api/agents/interview-prep/sessions/${sessionId}/questions`,
  CREATE_QUESTION: (sessionId: string) => `/api/agents/interview-prep/sessions/${sessionId}/questions`,
  UPDATE_QUESTION: (sessionId: string, questionId: string) => `/api/agents/interview-prep/sessions/${sessionId}/questions/${questionId}`,
  
  // AI endpoints
  GENERATE_QUESTIONS: '/api/agents/interview-prep/ai/generate-questions',
  EVALUATE_ANSWER: '/api/agents/interview-prep/ai/evaluate-answer',
  GET_FEEDBACK: '/api/agents/interview-prep/ai/feedback',
  
  // Stats endpoints
  GET_STATS: '/api/agents/interview-prep/stats',
  
  // History endpoints
  GET_HISTORY: '/api/agents/interview-prep/history',
  SAVE_INTERACTION: '/api/agents/interview-prep/history',
};
