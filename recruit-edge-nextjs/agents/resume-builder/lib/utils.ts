/**
 * Resume Builder Agent Utilities
 * Helper functions specific to the Resume Builder agent
 */

import { ResumeData, ExperienceItem, EducationItem } from './validation';

/**
 * Generate a unique ID for resume items
 */
export function generateItemId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Format date for display in resume
 */
export function formatResumeDate(date: string | null, isCurrent: boolean = false): string {
  if (isCurrent) return 'Present';
  if (!date) return '';
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });
}

/**
 * Calculate duration between dates
 */
export function calculateDuration(startDate: string, endDate: string | null, isCurrent: boolean = false): string {
  const start = new Date(startDate);
  const end = isCurrent ? new Date() : (endDate ? new Date(endDate) : new Date());
  
  const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  
  if (diffInMonths < 1) return 'Less than 1 month';
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''}`;
  
  const years = Math.floor(diffInMonths / 12);
  const months = diffInMonths % 12;
  
  let result = `${years} year${years > 1 ? 's' : ''}`;
  if (months > 0) {
    result += ` ${months} month${months > 1 ? 's' : ''}`;
  }
  
  return result;
}

/**
 * Calculate resume completeness percentage
 */
export function calculateCompletenessPercentage(resumeData: ResumeData): number {
  const checks = [
    // Personal info (40% weight)
    resumeData.personalInfo.fullName.length > 0,
    resumeData.personalInfo.email.length > 0,
    resumeData.personalInfo.phone.length > 0,
    resumeData.personalInfo.location && resumeData.personalInfo.location.length > 0,
    
    // Summary (15% weight)
    resumeData.summary && resumeData.summary.length > 50,
    
    // Experience (25% weight)
    resumeData.experience.length > 0,
    resumeData.experience.some(exp => exp.description.length > 50),
    
    // Education (15% weight)
    resumeData.education.length > 0,
    
    // Skills (5% weight)
    resumeData.skills.length >= 3
  ];
  
  const completedChecks = checks.filter(Boolean).length;
  return Math.round((completedChecks / checks.length) * 100);
}

/**
 * Get completion suggestions based on missing data
 */
export function getCompletionSuggestions(resumeData: ResumeData): string[] {
  const suggestions: string[] = [];
  
  // Personal info suggestions
  if (!resumeData.personalInfo.location) {
    suggestions.push('Add your location to help recruiters understand your geographic preferences');
  }
  
  if (!resumeData.personalInfo.linkedin) {
    suggestions.push('Add your LinkedIn profile to increase credibility');
  }
  
  // Summary suggestions
  if (!resumeData.summary || resumeData.summary.length < 50) {
    suggestions.push('Add a professional summary to give recruiters a quick overview of your background');
  }
  
  // Experience suggestions
  if (resumeData.experience.length === 0) {
    suggestions.push('Add your work experience to showcase your professional background');
  } else {
    const experienceIssues = resumeData.experience.filter(exp => 
      exp.description.length < 50 || exp.achievements.length === 0
    );
    
    if (experienceIssues.length > 0) {
      suggestions.push('Add more detailed descriptions and achievements to your work experience');
    }
  }
  
  // Education suggestions
  if (resumeData.education.length === 0) {
    suggestions.push('Add your educational background');
  }
  
  // Skills suggestions
  if (resumeData.skills.length < 3) {
    suggestions.push('Add more relevant skills to highlight your capabilities');
  }
  
  // Projects suggestions
  if (!resumeData.projects || resumeData.projects.length === 0) {
    suggestions.push('Consider adding relevant projects to showcase your practical experience');
  }
  
  return suggestions;
}

/**
 * Sort experience by start date (most recent first)
 */
export function sortExperienceByDate(experience: ExperienceItem[]): ExperienceItem[] {
  return [...experience].sort((a, b) => {
    // Current positions first
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    
    // Then by start date (most recent first)
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Sort education by start date (most recent first)
 */
export function sortEducationByDate(education: EducationItem[]): EducationItem[] {
  return [...education].sort((a, b) => {
    // Current education first
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    
    // Then by start date (most recent first)
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Extract skills from experience descriptions
 */
export function extractSkillsFromExperience(experience: ExperienceItem[]): string[] {
  const skillKeywords = [
    // Programming languages
    'javascript', 'python', 'java', 'typescript', 'react', 'node.js', 'vue.js', 'angular',
    'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'c++', 'c#',
    
    // Technologies & frameworks
    'aws', 'azure', 'docker', 'kubernetes', 'jenkins', 'git', 'mongodb', 'postgresql',
    'mysql', 'redis', 'elasticsearch', 'graphql', 'rest api', 'microservices',
    
    // Soft skills
    'leadership', 'management', 'communication', 'teamwork', 'problem solving',
    'project management', 'agile', 'scrum', 'mentoring'
  ];
  
  const extractedSkills = new Set<string>();
  const allText = experience.map(exp => 
    `${exp.description} ${exp.achievements.join(' ')}`
  ).join(' ').toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (allText.includes(skill.toLowerCase())) {
      extractedSkills.add(skill);
    }
  });
  
  return Array.from(extractedSkills);
}

/**
 * Generate default templates data
 */
export function getDefaultTemplates() {
  return [
    {
      id: 'modern',
      name: 'Modern',
      category: 'professional',
      description: 'Clean and modern design perfect for tech roles',
      preview: '/templates/modern-preview.png'
    },
    {
      id: 'classic',
      name: 'Classic',
      category: 'traditional',
      description: 'Traditional format suitable for corporate environments',
      preview: '/templates/classic-preview.png'
    },
    {
      id: 'creative',
      name: 'Creative',
      category: 'design',
      description: 'Eye-catching design for creative professionals',
      preview: '/templates/creative-preview.png'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      category: 'simple',
      description: 'Simple and clean layout focusing on content',
      preview: '/templates/minimal-preview.png'
    }
  ];
}

/**
 * Validate resume data integrity
 */
export function validateResumeIntegrity(resumeData: ResumeData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for required fields
  if (!resumeData.personalInfo.fullName.trim()) {
    errors.push('Full name is required');
  }
  
  if (!resumeData.personalInfo.email.trim()) {
    errors.push('Email is required');
  }
  
  if (!resumeData.personalInfo.phone.trim()) {
    errors.push('Phone number is required');
  }
  
  // Check experience data integrity
  resumeData.experience.forEach((exp, index) => {
    if (!exp.company.trim()) {
      errors.push(`Experience ${index + 1}: Company name is required`);
    }
    
    if (!exp.position.trim()) {
      errors.push(`Experience ${index + 1}: Position is required`);
    }
    
    if (!exp.isCurrent && !exp.endDate) {
      errors.push(`Experience ${index + 1}: End date is required for past positions`);
    }
    
    if (exp.endDate && exp.startDate && new Date(exp.endDate) < new Date(exp.startDate)) {
      errors.push(`Experience ${index + 1}: End date cannot be before start date`);
    }
  });
  
  // Check education data integrity
  resumeData.education.forEach((edu, index) => {
    if (!edu.institution.trim()) {
      errors.push(`Education ${index + 1}: Institution is required`);
    }
    
    if (!edu.degree.trim()) {
      errors.push(`Education ${index + 1}: Degree is required`);
    }
    
    if (!edu.isCurrent && !edu.endDate) {
      errors.push(`Education ${index + 1}: End date is required for completed education`);
    }
    
    if (edu.endDate && edu.startDate && new Date(edu.endDate) < new Date(edu.startDate)) {
      errors.push(`Education ${index + 1}: End date cannot be before start date`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate session ID for interactions
 */
export function generateSessionId(): string {
  return `resume-builder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}