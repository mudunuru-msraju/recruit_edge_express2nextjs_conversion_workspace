/**
 * Resume Builder Agent Hooks
 * Self-contained React hooks for the Resume Builder agent
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeBuilderAPI, type ResumeResponse, type ResumeListResponse } from '../api/client';
import { ResumeData, CreateResumeData, UpdateResumeData, validateResumeData } from '../lib/validation';
import { generateSessionId, calculateCompletenessPercentage } from '../lib/utils';

// Query keys for React Query
const QUERY_KEYS = {
  resumes: ['resume-builder', 'resumes'] as const,
  resume: (id: string) => ['resume-builder', 'resume', id] as const,
  templates: ['resume-builder', 'templates'] as const,
  history: ['resume-builder', 'history'] as const,
} as const;

/**
 * Hook for managing resume list
 */
export function useResumes() {
  return useQuery({
    queryKey: QUERY_KEYS.resumes,
    queryFn: async () => {
      const response = await resumeBuilderAPI.getResumes();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch resumes');
      }
      return response.data;
    },
  });
}

/**
 * Hook for managing single resume
 */
export function useResume(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.resume(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Resume ID is required');
      
      const response = await resumeBuilderAPI.getResume(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch resume');
      }
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook for creating resumes
 */
export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resumeData: CreateResumeData) => {
      const response = await resumeBuilderAPI.createResume(resumeData);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create resume');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resumes });
    },
  });
}

/**
 * Hook for updating resumes
 */
export function useUpdateResume(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resumeData: UpdateResumeData) => {
      const response = await resumeBuilderAPI.updateResume(id, resumeData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update resume');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resumes });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resume(id) });
    },
  });
}

/**
 * Hook for deleting resumes
 */
export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await resumeBuilderAPI.deleteResume(id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete resume');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resumes });
    },
  });
}

/**
 * Hook for AI summary generation
 */
export function useGenerateSummary() {
  return useMutation({
    mutationFn: async (params: {
      resumeData: ResumeData;
      targetRole?: string;
      tone?: 'professional' | 'enthusiastic' | 'creative';
    }) => {
      const response = await resumeBuilderAPI.generateSummary(params);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to generate summary');
      }
      return response.data;
    },
  });
}

/**
 * Hook for AI description improvement
 */
export function useImproveDescription() {
  return useMutation({
    mutationFn: async (params: {
      description: string;
      role?: string;
      company?: string;
      tone?: 'professional' | 'enthusiastic' | 'creative';
    }) => {
      const response = await resumeBuilderAPI.improveDescription(params);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to improve description');
      }
      return response.data;
    },
  });
}

/**
 * Hook for keyword extraction
 */
export function useExtractKeywords() {
  return useMutation({
    mutationFn: async (params: {
      jobDescription: string;
      maxKeywords?: number;
    }) => {
      const response = await resumeBuilderAPI.extractKeywords(params);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to extract keywords');
      }
      return response.data;
    },
  });
}

/**
 * Hook for resume templates
 */
export function useTemplates() {
  return useQuery({
    queryKey: QUERY_KEYS.templates,
    queryFn: async () => {
      const response = await resumeBuilderAPI.getTemplates();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch templates');
      }
      return response.data;
    },
  });
}

/**
 * Hook for auto-save functionality
 */
export function useAutoSave(
  resumeId: string | null,
  resumeData: ResumeData,
  enabled: boolean = true,
  interval: number = 30000 // 30 seconds
) {
  const updateResumeMutation = useUpdateResume(resumeId || '');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const saveResume = useCallback(async () => {
    if (!resumeId || !enabled) return;

    setSaveStatus('saving');
    
    try {
      await updateResumeMutation.mutateAsync(resumeData);
      setLastSaved(new Date());
      setSaveStatus('saved');
      
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  }, [resumeId, resumeData, enabled, updateResumeMutation]);

  useEffect(() => {
    if (!enabled || !resumeId) return;

    const intervalId = setInterval(saveResume, interval);
    return () => clearInterval(intervalId);
  }, [saveResume, interval, enabled, resumeId]);

  return {
    saveStatus,
    lastSaved,
    saveResume,
    isLoading: updateResumeMutation.isPending,
  };
}

/**
 * Hook for managing resume form state
 */
export function useResumeForm(initialData?: Partial<ResumeData>) {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    ...initialData,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((field: keyof ResumeData, value: any) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updatePersonalInfo = useCallback((field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  }, []);

  const validate = useCallback(() => {
    const result = validateResumeData(resumeData);
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        errors[issue.path.join('.')] = issue.message;
      });
      setValidationErrors(errors);
      return false;
    }
    
    setValidationErrors({});
    return true;
  }, [resumeData]);

  const completenessPercentage = calculateCompletenessPercentage(resumeData);

  return {
    resumeData,
    setResumeData,
    updateField,
    updatePersonalInfo,
    validationErrors,
    validate,
    isValid: Object.keys(validationErrors).length === 0,
    completenessPercentage,
  };
}

/**
 * Hook for export functionality
 */
export function useExportResume() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = useCallback(async (resumeData: ResumeData & { title: string; template: string }) => {
    setIsExporting(true);
    try {
      const blob = await resumeBuilderAPI.exportPDF(resumeData);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const exportToDOCX = useCallback(async (resumeData: ResumeData & { title: string; template: string }) => {
    setIsExporting(true);
    try {
      const blob = await resumeBuilderAPI.exportDOCX(resumeData);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.title}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('DOCX export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    exportToPDF,
    exportToDOCX,
    isExporting,
  };
}

/**
 * Hook for interaction tracking
 */
export function useInteractionTracking() {
  const [sessionId] = useState(() => generateSessionId());

  const trackInteraction = useCallback(async (action: string, metadata?: Record<string, any>) => {
    try {
      await resumeBuilderAPI.saveInteraction({
        action,
        metadata: {
          ...metadata,
          sessionId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  }, [sessionId]);

  return {
    sessionId,
    trackInteraction,
  };
}