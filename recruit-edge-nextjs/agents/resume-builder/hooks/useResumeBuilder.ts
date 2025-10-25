/**
 * Resume Builder Agent React Hook
 * Provides React Query hooks for resume operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { agentApiClient, type ResumeApiData } from '../lib/api-client';
import type { 
  CreateResumeData, 
  UpdateResumeData 
} from '../lib/validation';

export function useResumeBuilder(userId: number) {
  const queryClient = useQueryClient();
  
  // Query for user's resumes
  const {
    data: resumes,
    isLoading,
    error
  } = useQuery({
    queryKey: ['resumes', userId],
    queryFn: () => agentApiClient.getResumes(userId),
    enabled: !!userId,
  });

  // Create resume mutation
  const createResume = useMutation({
    mutationFn: (data: CreateResumeData & { userId: number }) => 
      agentApiClient.createResume(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes', userId] });
    },
  });

  // Update resume mutation
  const updateResume = useMutation({
    mutationFn: (data: UpdateResumeData & { id: number }) => 
      agentApiClient.updateResume(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes', userId] });
    },
  });

  // Delete resume mutation
  const deleteResume = useMutation({
    mutationFn: (id: number) => agentApiClient.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes', userId] });
    },
  });

  return {
    resumes,
    isLoading,
    error,
    createResume,
    updateResume,
    deleteResume,
  };
}

// Hook for individual resume
export function useResume(id: number) {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: () => agentApiClient.getResume(id),
    enabled: !!id,
  });
}

// Hook for AI-powered resume features
export function useResumeAI() {
  return {
    generateSummary: useMutation({
      mutationFn: (data: { resumeData: any; targetRole?: string; tone?: string }) =>
        agentApiClient.generateSummary(data),
    }),
    
    improveDescription: useMutation({
      mutationFn: (data: { description: string; role?: string; tone?: string }) =>
        agentApiClient.improveDescription(data),
    }),
    
    extractKeywords: useMutation({
      mutationFn: (data: { jobDescription: string; maxKeywords?: number }) =>
        agentApiClient.extractKeywords(data),
    }),
  };
}