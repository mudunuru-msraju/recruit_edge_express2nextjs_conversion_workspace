import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillGapAnalyzerApi } from '../lib/api-client';
import {
  CreateSkillAnalysisInput,
  UpdateSkillAnalysisInput,
  UpdateSkillGapInput,
  AnalyzeSkillsInput,
} from '../lib/validation';

// Query Keys
export const skillGapAnalyzerKeys = {
  all: ['skill-gap-analyzer'] as const,
  analyses: (userId: number) => [...skillGapAnalyzerKeys.all, 'analyses', userId] as const,
  analysis: (id: number, userId: number) => [...skillGapAnalyzerKeys.all, 'analysis', id, userId] as const,
  gaps: (analysisId: number) => [...skillGapAnalyzerKeys.all, 'gaps', analysisId] as const,
};

// Analysis Hooks
export function useSkillAnalyses(userId: number) {
  return useQuery({
    queryKey: skillGapAnalyzerKeys.analyses(userId),
    queryFn: () => skillGapAnalyzerApi.getAnalyses(userId),
    enabled: !!userId,
  });
}

export function useSkillAnalysis(id: number, userId: number) {
  return useQuery({
    queryKey: skillGapAnalyzerKeys.analysis(id, userId),
    queryFn: () => skillGapAnalyzerApi.getAnalysis(id, userId),
    enabled: !!id && !!userId,
  });
}

export function useCreateSkillAnalysis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSkillAnalysisInput) => 
      skillGapAnalyzerApi.createAnalysis(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: skillGapAnalyzerKeys.analyses(variables.userId),
      });
    },
  });
}

export function useUpdateSkillAnalysis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      userId, 
      data 
    }: { 
      id: number; 
      userId: number; 
      data: UpdateSkillAnalysisInput 
    }) => skillGapAnalyzerApi.updateAnalysis(id, userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: skillGapAnalyzerKeys.analyses(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: skillGapAnalyzerKeys.analysis(variables.id, variables.userId),
      });
    },
  });
}

export function useDeleteSkillAnalysis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId }: { id: number; userId: number }) => 
      skillGapAnalyzerApi.deleteAnalysis(id, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: skillGapAnalyzerKeys.analyses(variables.userId),
      });
    },
  });
}

// Skill Gap Hooks
export function useAnalysisGaps(analysisId: number) {
  return useQuery({
    queryKey: skillGapAnalyzerKeys.gaps(analysisId),
    queryFn: () => skillGapAnalyzerApi.getAnalysisGaps(analysisId),
    enabled: !!analysisId,
  });
}

export function useUpdateSkillGap() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      analysisId, 
      gapId, 
      data 
    }: { 
      analysisId: number; 
      gapId: number; 
      data: UpdateSkillGapInput 
    }) => skillGapAnalyzerApi.updateSkillGap(analysisId, gapId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: skillGapAnalyzerKeys.gaps(variables.analysisId),
      });
    },
  });
}

// AI Hooks
export function useAnalyzeSkills() {
  return useMutation({
    mutationFn: (data: AnalyzeSkillsInput) => 
      skillGapAnalyzerApi.analyzeSkills(data),
  });
}

// Composite Hooks
export function useAnalysisWithGaps(analysisId: number, userId: number) {
  const analysisQuery = useSkillAnalysis(analysisId, userId);
  const gapsQuery = useAnalysisGaps(analysisId);
  
  return {
    analysis: analysisQuery.data,
    gaps: gapsQuery.data,
    isLoading: analysisQuery.isLoading || gapsQuery.isLoading,
    error: analysisQuery.error || gapsQuery.error,
    refetch: () => {
      analysisQuery.refetch();
      gapsQuery.refetch();
    },
  };
}