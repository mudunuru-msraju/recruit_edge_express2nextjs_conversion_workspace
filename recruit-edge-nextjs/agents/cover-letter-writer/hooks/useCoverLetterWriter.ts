/**
 * Cover Letter Writer Agent React Hooks
 * Provides React Query hooks for cover letter operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { agentApiClient, type CoverLetterApiData, type TemplateApiData } from '../lib/api-client';
import type { 
  CreateCoverLetterData,
  UpdateCoverLetterData,
  GenerateCoverLetterData,
  ImproveCoverLetterData
} from '../lib/validation';

export function useCoverLetterWriter(userId: number) {
  const queryClient = useQueryClient();
  
  // Query for user's cover letters
  const {
    data: coverLetters,
    isLoading,
    error
  } = useQuery({
    queryKey: ['coverLetters', userId],
    queryFn: () => agentApiClient.getCoverLetters(userId),
    enabled: !!userId,
  });

  // Create cover letter mutation
  const createCoverLetter = useMutation({
    mutationFn: (data: CreateCoverLetterData) => 
      agentApiClient.createCoverLetter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverLetters', userId] });
    },
  });

  // Update cover letter mutation
  const updateCoverLetter = useMutation({
    mutationFn: (data: UpdateCoverLetterData) => 
      agentApiClient.updateCoverLetter(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverLetters', userId] });
    },
  });

  // Delete cover letter mutation
  const deleteCoverLetter = useMutation({
    mutationFn: (id: number) => agentApiClient.deleteCoverLetter(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverLetters', userId] });
    },
  });

  return {
    coverLetters,
    isLoading,
    error,
    createCoverLetter,
    updateCoverLetter,
    deleteCoverLetter,
  };
}

// Hook for individual cover letter
export function useCoverLetter(id: number, userId: number) {
  return useQuery({
    queryKey: ['coverLetter', id],
    queryFn: () => agentApiClient.getCoverLetter(id, userId),
    enabled: !!id && !!userId,
  });
}

// Hook for cover letter templates
export function useCoverLetterTemplates() {
  return useQuery({
    queryKey: ['coverLetterTemplates'],
    queryFn: () => agentApiClient.getTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for AI-powered cover letter generation
export function useCoverLetterAI() {
  return {
    generateCoverLetter: useMutation({
      mutationFn: (data: GenerateCoverLetterData) =>
        agentApiClient.generateCoverLetter(data),
    }),
    
    improveCoverLetter: useMutation({
      mutationFn: (data: ImproveCoverLetterData) =>
        agentApiClient.improveCoverLetter(data),
    }),
    
    analyzeCoverLetter: useMutation({
      mutationFn: (data: { content: string; jobDescription?: string }) =>
        agentApiClient.analyzeCoverLetter(data),
    }),
  };
}

// Hook for cover letter export
export function useCoverLetterExport() {
  return useMutation({
    mutationFn: async ({ id, format }: { id: number; format: 'pdf' | 'docx' | 'txt' }) => {
      const blob = await agentApiClient.exportCoverLetter(id, format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cover-letter.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    },
  });
}

// Hook for auto-save functionality
export function useAutoSave(
  coverLetterId: number | null,
  content: string,
  userId: number,
  delay: number = 2000
) {
  const { updateCoverLetter } = useCoverLetterWriter(userId);
  
  const saveContent = useMutation({
    mutationFn: async () => {
      if (!coverLetterId || !content.trim()) return;
      
      return updateCoverLetter.mutateAsync({
        id: coverLetterId,
        content: content.trim(),
      });
    },
    meta: {
      suppressNotification: true, // Don't show success notifications for auto-save
    }
  });

  // Use effect for debounced auto-save would go here in a real implementation
  // For now, we return the save function to be called manually

  return {
    saveContent,
    isSaving: saveContent.isPending,
    lastSaved: saveContent.isSuccess ? new Date() : null,
  };
}