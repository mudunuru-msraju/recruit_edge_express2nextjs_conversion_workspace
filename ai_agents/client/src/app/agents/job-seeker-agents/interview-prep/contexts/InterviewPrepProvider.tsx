/**
 * Interview Prep Context Provider
 * Manages global state for the Interview Prep agent
 */

import { createContext, useContext, useState, ReactNode } from 'react';
import { InterviewSession, InterviewQuestion, InterviewPrepState } from '../types';

interface InterviewPrepContextValue extends InterviewPrepState {
  setCurrentSession: (session: InterviewSession | null) => void;
  setQuestions: (questions: InterviewQuestion[]) => void;
  addQuestion: (question: InterviewQuestion) => void;
  updateQuestion: (id: string | number, updates: Partial<InterviewQuestion>) => void;
  setCurrentQuestionIndex: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  startSession: () => void;
  endSession: () => void;
  reset: () => void;
}

const InterviewPrepContext = createContext<InterviewPrepContextValue | undefined>(undefined);

export function InterviewPrepProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const addQuestion = (question: InterviewQuestion) => {
    setQuestions(prev => [...prev, question]);
  };

  const updateQuestion = (id: string | number, updates: Partial<InterviewQuestion>) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const startSession = () => {
    setIsSessionActive(true);
    setSessionStartTime(Date.now());
  };

  const endSession = () => {
    setIsSessionActive(false);
    setSessionStartTime(null);
  };

  const reset = () => {
    setCurrentSession(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setIsSessionActive(false);
    setSessionStartTime(null);
  };

  const value: InterviewPrepContextValue = {
    currentSession,
    questions,
    currentQuestionIndex,
    isSessionActive,
    sessionStartTime,
    setCurrentSession,
    setQuestions,
    addQuestion,
    updateQuestion,
    setCurrentQuestionIndex,
    nextQuestion,
    previousQuestion,
    startSession,
    endSession,
    reset,
  };

  return (
    <InterviewPrepContext.Provider value={value}>
      {children}
    </InterviewPrepContext.Provider>
  );
}

export function useInterviewPrep() {
  const context = useContext(InterviewPrepContext);
  if (!context) {
    throw new Error('useInterviewPrep must be used within InterviewPrepProvider');
  }
  return context;
}
