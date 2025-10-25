/**
 * Job Matcher Agent React Hooks
 * Provides React Query hooks for job matching operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { agentApiClient, type JobMatchApiData, type JobPreferencesApiData } from '../lib/api-client';
import type { 
  AnalyzeJobMatchData,
  UpdateJobMatchData,
  JobPreferencesData,
  UpdateJobPreferencesData
} from '../lib/validation';

export function useJobMatcher(userId: number) {
  const queryClient = useQueryClient();
  
  // Query for user's job matches
  const {
    data: jobMatches,
    isLoading,
    error
  } = useQuery({
    queryKey: ['jobMatches', userId],
    queryFn: () => agentApiClient.getJobMatches(userId),
    enabled: !!userId,
  });

  // Analyze job match mutation
  const analyzeJobMatch = useMutation({
    mutationFn: (data: AnalyzeJobMatchData) => 
      agentApiClient.analyzeJobMatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobMatches', userId] });
    },
  });

  // Update job match mutation
  const updateJobMatch = useMutation({
    mutationFn: (data: { id: number; isBookmarked?: boolean; isApplied?: boolean }) => 
      agentApiClient.updateJobMatch(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobMatches', userId] });
    },
  });

  // Delete job match mutation
  const deleteJobMatch = useMutation({
    mutationFn: (id: number) => agentApiClient.deleteJobMatch(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobMatches', userId] });
    },
  });

  return {
    jobMatches,
    isLoading,
    error,
    analyzeJobMatch,
    updateJobMatch,
    deleteJobMatch,
  };
}

// Hook for job preferences
export function useJobPreferences(userId: number) {
  const queryClient = useQueryClient();

  const {
    data: preferences,
    isLoading,
    error
  } = useQuery({
    queryKey: ['jobPreferences', userId],
    queryFn: () => agentApiClient.getJobPreferences(userId),
    enabled: !!userId,
    retry: false, // Don't retry if preferences don't exist yet
  });

  const updatePreferences = useMutation({
    mutationFn: (data: UpdateJobPreferencesData) => 
      agentApiClient.updateJobPreferences(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPreferences', userId] });
    },
  });

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
  };
}

// Hook for AI-powered job recommendations
export function useJobRecommendations(userId: number) {
  return useQuery({
    queryKey: ['jobRecommendations', userId],
    queryFn: () => agentApiClient.getPersonalizedRecommendations(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for skills gap analysis
export function useSkillsGapAnalysis() {
  return useMutation({
    mutationFn: (data: { userId: number; jobId: number }) =>
      agentApiClient.analyzeSkillsGap(data),
  });
}

// Hook for career insights
export function useCareerInsights(userId: number) {
  return useQuery({
    queryKey: ['careerInsights', userId],
    queryFn: () => agentApiClient.getCareerInsights(userId),
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook for bookmark management
export function useJobBookmarks(userId: number) {
  const queryClient = useQueryClient();

  const toggleBookmark = useMutation({
    mutationFn: async ({ matchId, isBookmarked }: { matchId: number; isBookmarked: boolean }) => {
      return agentApiClient.updateJobMatch(matchId, { isBookmarked: !isBookmarked });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobMatches', userId] });
    },
  });

  const markAsApplied = useMutation({
    mutationFn: async ({ matchId }: { matchId: number }) => {
      return agentApiClient.updateJobMatch(matchId, { isApplied: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobMatches', userId] });
    },
  });

  return {
    toggleBookmark,
    markAsApplied,
  };
}