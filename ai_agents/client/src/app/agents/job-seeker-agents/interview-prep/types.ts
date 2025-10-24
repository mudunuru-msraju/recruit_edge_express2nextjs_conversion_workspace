/**
 * Interview Prep Type Definitions
 * All TypeScript types for the Interview Prep agent
 */

/**
 * Interview type categories
 */
export type InterviewType = 'behavioral' | 'technical' | 'case_study' | 'system_design' | 'coding' | 'general';

/**
 * Difficulty levels for questions
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Interview session data structure
 */
export interface InterviewSession {
  id?: number;
  userId: number;
  title: string;
  interviewType: InterviewType;
  difficulty?: DifficultyLevel;
  targetRole?: string;
  targetCompany?: string;
  duration?: number; // in minutes
  score?: number; // 0-100
  feedback?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Individual question with answer and evaluation
 */
export interface InterviewQuestion {
  id?: string | number;
  sessionId?: number;
  question: string;
  interviewType: InterviewType;
  difficulty?: DifficultyLevel;
  userAnswer?: string;
  aiSuggestion?: string;
  evaluation?: QuestionEvaluation;
  timeSpent?: number; // in seconds
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * AI evaluation of an answer
 */
export interface QuestionEvaluation {
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  feedback: string;
}

/**
 * Context state for Interview Prep agent
 */
export interface InterviewPrepState {
  currentSession: InterviewSession | null;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  isSessionActive: boolean;
  sessionStartTime: number | null;
}

/**
 * Session configuration for starting a new interview
 */
export interface SessionConfig {
  title: string;
  interviewType: InterviewType;
  difficulty?: DifficultyLevel;
  targetRole?: string;
  targetCompany?: string;
  numberOfQuestions?: number;
}

/**
 * Interview statistics
 */
export interface InterviewStats {
  totalSessions: number;
  averageScore: number;
  strongAreas: string[];
  improvementAreas: string[];
  sessionHistory: {
    date: string;
    score: number;
    type: InterviewType;
  }[];
}
