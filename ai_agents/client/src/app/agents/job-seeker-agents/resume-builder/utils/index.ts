/**
 * Resume Builder Utility Functions
 * Helper functions specific to resume building operations
 */

import { ResumeData, WorkExperience, Education } from '../types';

/**
 * Format date for display (e.g., "Jan 2020" or "Present")
 */
export const formatDate = (date: string, isCurrent: boolean = false): string => {
  if (isCurrent) return 'Present';
  if (!date) return '';
  
  const [year, month] = date.split('-');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

/**
 * Calculate duration between two dates
 */
export const calculateDuration = (startDate: string, endDate: string | null, isCurrent: boolean): string => {
  if (!startDate) return '';
  
  const start = new Date(startDate);
  const end = isCurrent || !endDate ? new Date() : new Date(endDate);
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                 (end.getMonth() - start.getMonth());
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
  }
  
  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  
  return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
};

/**
 * Calculate resume completeness percentage
 */
export const calculateCompleteness = (resumeData: ResumeData): number => {
  let total = 0;
  let completed = 0;
  
  // Personal Info (weight: 20%)
  total += 20;
  if (resumeData.personalInfo.fullName && resumeData.personalInfo.email && resumeData.personalInfo.phone) {
    completed += 20;
  } else if (resumeData.personalInfo.fullName || resumeData.personalInfo.email) {
    completed += 10;
  }
  
  // Summary (weight: 15%)
  total += 15;
  if (resumeData.summary && resumeData.summary.length > 50) {
    completed += 15;
  } else if (resumeData.summary) {
    completed += 7;
  }
  
  // Experience (weight: 30%)
  total += 30;
  if (resumeData.experience.length > 0) {
    completed += 30;
  }
  
  // Education (weight: 20%)
  total += 20;
  if (resumeData.education.length > 0) {
    completed += 20;
  }
  
  // Skills (weight: 15%)
  total += 15;
  if (resumeData.skills.length >= 5) {
    completed += 15;
  } else if (resumeData.skills.length > 0) {
    completed += 7;
  }
  
  return Math.round((completed / total) * 100);
};

/**
 * Generate resume filename
 */
export const generateFilename = (fullName: string, format: 'pdf' | 'docx'): string => {
  const cleanName = fullName.trim().replace(/\s+/g, '_').toLowerCase();
  const timestamp = new Date().toISOString().split('T')[0];
  return `${cleanName}_resume_${timestamp}.${format}`;
};

/**
 * Sanitize text for export (remove special characters)
 */
export const sanitizeText = (text: string): string => {
  return text.replace(/[^\w\s\-.,;:()'"/&@#]/g, '');
};

/**
 * Count total words in resume
 */
export const countWords = (resumeData: ResumeData): number => {
  let wordCount = 0;
  
  if (resumeData.summary) {
    wordCount += resumeData.summary.split(/\s+/).length;
  }
  
  resumeData.experience.forEach(exp => {
    if (exp.description) {
      wordCount += exp.description.split(/\s+/).length;
    }
    exp.achievements.forEach(achievement => {
      wordCount += achievement.split(/\s+/).length;
    });
  });
  
  return wordCount;
};

/**
 * Extract keywords from resume for ATS optimization
 */
export const extractKeywords = (resumeData: ResumeData): string[] => {
  const keywords = new Set<string>();
  
  // Add skills
  resumeData.skills.forEach(skill => keywords.add(skill.toLowerCase()));
  
  // Extract from experience descriptions and achievements
  resumeData.experience.forEach(exp => {
    const text = `${exp.description} ${exp.achievements.join(' ')}`;
    // Simple keyword extraction (can be enhanced with NLP)
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    words.forEach(word => keywords.add(word));
  });
  
  return Array.from(keywords).slice(0, 50); // Top 50 keywords
};

/**
 * Validate resume data completeness
 */
export const validateResume = (resumeData: ResumeData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!resumeData.personalInfo.fullName) {
    errors.push('Full name is required');
  }
  
  if (!resumeData.personalInfo.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(resumeData.personalInfo.email)) {
    errors.push('Invalid email format');
  }
  
  if (!resumeData.personalInfo.phone) {
    errors.push('Phone number is required');
  } else if (!isValidPhone(resumeData.personalInfo.phone)) {
    errors.push('Invalid phone number format');
  }
  
  if (resumeData.experience.length === 0) {
    errors.push('At least one work experience is required');
  }
  
  if (resumeData.education.length === 0) {
    errors.push('At least one education entry is required');
  }
  
  if (resumeData.skills.length < 3) {
    errors.push('At least 3 skills are recommended');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
