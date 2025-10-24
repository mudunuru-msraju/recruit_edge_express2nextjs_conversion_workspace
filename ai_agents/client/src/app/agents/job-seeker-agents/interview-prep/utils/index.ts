/**
 * Interview Prep Utility Functions
 * Helper functions for the Interview Prep agent
 */

import { InterviewQuestion, InterviewType, DifficultyLevel } from '../types';

/**
 * Generate a unique ID for a question (client-side)
 */
export function generateQuestionId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format duration in minutes to readable time
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Format time spent in seconds to readable format
 */
export function formatTimeSpent(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${minutes}:${secs.toString().padStart(2, '0')}` : `${minutes}:00`;
}

/**
 * Calculate average score from questions
 */
export function calculateAverageScore(questions: InterviewQuestion[]): number {
  const scoredQuestions = questions.filter(q => q.evaluation?.score !== undefined);
  if (scoredQuestions.length === 0) return 0;
  
  const total = scoredQuestions.reduce((sum, q) => sum + (q.evaluation?.score || 0), 0);
  return Math.round(total / scoredQuestions.length);
}

/**
 * Get score category label
 */
export function getScoreCategory(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Needs Improvement';
  return 'Poor';
}

/**
 * Get score color for UI display
 */
export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Get interview type display label
 */
export function getInterviewTypeLabel(type: InterviewType): string {
  const labels: Record<InterviewType, string> = {
    behavioral: 'Behavioral',
    technical: 'Technical',
    case_study: 'Case Study',
    system_design: 'System Design',
    coding: 'Coding',
    general: 'General'
  };
  return labels[type];
}

/**
 * Get difficulty badge color
 */
export function getDifficultyColor(difficulty: DifficultyLevel): string {
  const colors: Record<DifficultyLevel, string> = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };
  return colors[difficulty];
}

/**
 * Validate session configuration
 */
export function validateSessionConfig(config: any): string[] {
  const errors: string[] = [];
  
  if (!config.title || config.title.trim().length === 0) {
    errors.push('Session title is required');
  }
  
  if (!config.interviewType) {
    errors.push('Interview type is required');
  }
  
  if (config.numberOfQuestions && (config.numberOfQuestions < 1 || config.numberOfQuestions > 50)) {
    errors.push('Number of questions must be between 1 and 50');
  }
  
  return errors;
}

/**
 * Calculate session progress percentage
 */
export function calculateProgress(answered: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((answered / total) * 100);
}

/**
 * Export session data as JSON
 */
export function exportSessionAsJSON(session: any, questions: InterviewQuestion[]): string {
  const exportData = {
    session,
    questions,
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Get recommended practice areas based on scores
 */
export function getRecommendedAreas(questions: InterviewQuestion[]): string[] {
  const lowScoreQuestions = questions.filter(q => 
    q.evaluation && q.evaluation.score < 60
  );
  
  const typeScores: Record<string, { total: number; count: number }> = {};
  
  lowScoreQuestions.forEach(q => {
    if (!typeScores[q.interviewType]) {
      typeScores[q.interviewType] = { total: 0, count: 0 };
    }
    typeScores[q.interviewType].total += (q.evaluation?.score || 0);
    typeScores[q.interviewType].count += 1;
  });
  
  return Object.entries(typeScores)
    .sort((a, b) => (a[1].total / a[1].count) - (b[1].total / b[1].count))
    .slice(0, 3)
    .map(([type]) => getInterviewTypeLabel(type as InterviewType));
}
