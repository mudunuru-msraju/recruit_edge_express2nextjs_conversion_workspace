/**
 * Resume Builder API Routes
 * Agent-specific API endpoints for resume operations
 */

export const RESUME_BUILDER_API = {
  // Resume CRUD operations
  SAVE_RESUME: '/api/agents/resume-builder/resumes',
  GET_RESUME: (id: string) => `/api/agents/resume-builder/resumes/${id}`,
  UPDATE_RESUME: (id: string) => `/api/agents/resume-builder/resumes/${id}`,
  DELETE_RESUME: (id: string) => `/api/agents/resume-builder/resumes/${id}`,
  LIST_RESUMES: '/api/agents/resume-builder/resumes',
  
  // Export operations
  EXPORT_PDF: '/api/agents/resume-builder/export/pdf',
  EXPORT_DOCX: '/api/agents/resume-builder/export/docx',
  
  // AI operations
  AI_GENERATE_SUMMARY: '/api/agents/resume-builder/ai/generate-summary',
  AI_IMPROVE_DESCRIPTION: '/api/agents/resume-builder/ai/improve-description',
  AI_EXTRACT_KEYWORDS: '/api/agents/resume-builder/ai/extract-keywords',
  AI_OPTIMIZE_ATS: '/api/agents/resume-builder/ai/optimize-ats',
  
  // Interaction history
  GET_HISTORY: '/api/agents/resume-builder/history',
  SAVE_INTERACTION: '/api/agents/resume-builder/history',
  
  // Templates
  GET_TEMPLATES: '/api/agents/resume-builder/templates',
  GET_TEMPLATE: (id: string) => `/api/agents/resume-builder/templates/${id}`,
} as const;
