/**
 * Resume Builder Context Provider
 * Manages global state for the Resume Builder agent
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData, ResumeTemplate } from '../types';

interface ResumeBuilderContextType {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  selectedTemplate: ResumeTemplate | null;
  setSelectedTemplate: (template: ResumeTemplate | null) => void;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateSection: (section: keyof ResumeData, data: any) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (mode: boolean) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
}

const ResumeBuilderContext = createContext<ResumeBuilderContextType | undefined>(undefined);

// Default resume data structure
const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
};

interface ResumeBuilderProviderProps {
  children: ReactNode;
}

export function ResumeBuilderProvider({ children }: ResumeBuilderProviderProps) {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Update personal information section
   */
  const updatePersonalInfo = (info: Partial<ResumeData['personalInfo']>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  /**
   * Update any section of the resume
   */
  const updateSection = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const value = {
    resumeData,
    setResumeData,
    selectedTemplate,
    setSelectedTemplate,
    updatePersonalInfo,
    updateSection,
    isPreviewMode,
    setIsPreviewMode,
    isSaving,
    setIsSaving,
  };

  return (
    <ResumeBuilderContext.Provider value={value}>
      {children}
    </ResumeBuilderContext.Provider>
  );
}

/**
 * Custom hook to use Resume Builder context
 * Throws error if used outside provider
 */
export function useResumeBuilder() {
  const context = useContext(ResumeBuilderContext);
  if (context === undefined) {
    throw new Error('useResumeBuilder must be used within ResumeBuilderProvider');
  }
  return context;
}
