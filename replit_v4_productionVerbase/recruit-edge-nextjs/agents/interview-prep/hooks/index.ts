import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewPrepApi } from '../lib/api-client';
import {
  CreateInterviewSessionInput,
  UpdateInterviewSessionInput,
  CreateInterviewQuestionInput,
  UpdateInterviewQuestionInput,
  GenerateQuestionsInput,
  EvaluateAnswerInput,
} from '../lib/validation';

// Query Keys
export const interviewPrepKeys = {
  all: ['interview-prep'] as const,
  sessions: (userId: number) => [...interviewPrepKeys.all, 'sessions', userId] as const,
  session: (id: number, userId: number) => [...interviewPrepKeys.all, 'session', id, userId] as const,
  questions: (sessionId: number) => [...interviewPrepKeys.all, 'questions', sessionId] as const,
};

// Session Hooks
export function useInterviewSessions(userId: number) {
  return useQuery({
    queryKey: interviewPrepKeys.sessions(userId),
    queryFn: () => interviewPrepApi.getSessions(userId),
    enabled: !!userId,
  });
}

export function useInterviewSession(id: number, userId: number) {
  return useQuery({
    queryKey: interviewPrepKeys.session(id, userId),
    queryFn: () => interviewPrepApi.getSession(id, userId),
    enabled: !!id && !!userId,
  });
}

export function useCreateInterviewSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateInterviewSessionInput) => 
      interviewPrepApi.createSession(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: interviewPrepKeys.sessions(variables.userId),
      });
    },
  });
}

export function useUpdateInterviewSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      userId, 
      data 
    }: { 
      id: number; 
      userId: number; 
      data: UpdateInterviewSessionInput 
    }) => interviewPrepApi.updateSession(id, userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: interviewPrepKeys.sessions(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: interviewPrepKeys.session(variables.id, variables.userId),
      });
    },
  });
}

export function useDeleteInterviewSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId }: { id: number; userId: number }) => 
      interviewPrepApi.deleteSession(id, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: interviewPrepKeys.sessions(variables.userId),
      });
    },
  });
}

// Question Hooks
export function useSessionQuestions(sessionId: number) {
  return useQuery({
    queryKey: interviewPrepKeys.questions(sessionId),
    queryFn: () => interviewPrepApi.getSessionQuestions(sessionId),
    enabled: !!sessionId,
  });
}

export function useCreateInterviewQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      sessionId, 
      data 
    }: { 
      sessionId: number; 
      data: CreateInterviewQuestionInput 
    }) => interviewPrepApi.createQuestion(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: interviewPrepKeys.questions(variables.sessionId),
      });
    },
  });
}

export function useUpdateInterviewQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      sessionId, 
      questionId, 
      data 
    }: { 
      sessionId: number; 
      questionId: number; 
      data: UpdateInterviewQuestionInput 
    }) => interviewPrepApi.updateQuestion(sessionId, questionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: interviewPrepKeys.questions(variables.sessionId),
      });
    },
  });
}

// AI Hooks
export function useGenerateQuestions() {
  return useMutation({
    mutationFn: (data: GenerateQuestionsInput) => 
      interviewPrepApi.generateQuestions(data),
  });
}

export function useEvaluateAnswer() {
  return useMutation({
    mutationFn: (data: EvaluateAnswerInput) => 
      interviewPrepApi.evaluateAnswer(data),
  });
}

// Composite Hooks
export function useInterviewSessionWithQuestions(sessionId: number, userId: number) {
  const sessionQuery = useInterviewSession(sessionId, userId);
  const questionsQuery = useSessionQuestions(sessionId);
  
  return {
    session: sessionQuery.data,
    questions: questionsQuery.data,
    isLoading: sessionQuery.isLoading || questionsQuery.isLoading,
    error: sessionQuery.error || questionsQuery.error,
    refetch: () => {
      sessionQuery.refetch();
      questionsQuery.refetch();
    },
  };
}