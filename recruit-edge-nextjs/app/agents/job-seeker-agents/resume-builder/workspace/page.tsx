'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookmarkIcon, EyeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useResumeBuilder } from '@/agents/resume-builder/hooks/useResumeBuilder';
import { type ResumeData } from '@/agents/resume-builder/lib/validation';

interface WorkspaceTab {
  id: string;
  label: string;
  component: React.ComponentType<any>;
}

// Individual section components
const PersonalInfoSection = ({ data, onChange }: { data: any; onChange: (data: any) => void }) => (
  <Card>
    <CardHeader>
      <CardTitle>Personal Information</CardTitle>
      <CardDescription>Your contact details and basic information</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="City, State"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">LinkedIn</label>
          <input
            type="url"
            value={data.linkedin || ''}
            onChange={(e) => onChange({ ...data, linkedin: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GitHub</label>
          <input
            type="url"
            value={data.github || ''}
            onChange={(e) => onChange({ ...data, github: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="https://github.com/johndoe"
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

const SummarySection = ({ data, onChange }: { data: string; onChange: (data: string) => void }) => (
  <Card>
    <CardHeader>
      <CardTitle>Professional Summary</CardTitle>
      <CardDescription>A brief overview of your professional background</CardDescription>
    </CardHeader>
    <CardContent>
      <textarea
        value={data || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-md px-3 py-2 h-32 resize-none"
        placeholder="Write a compelling summary of your professional experience and skills..."
      />
      <div className="mt-2">
        <Button variant="outline" size="sm">
          ✨ Generate AI Summary
        </Button>
      </div>
    </CardContent>
  </Card>
);

const SkillsSection = ({ data, onChange }: { data: string[]; onChange: (data: string[]) => void }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(data.filter(skill => skill !== skillToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Your technical and professional skills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1 border rounded-md px-3 py-2"
            placeholder="Add a skill..."
          />
          <Button onClick={addSkill}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

function ResumeWorkspaceContent() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('id');
  const userId = 1; // TODO: Get from auth context
  
  const { resumes, createResume, updateResume, isLoading } = useResumeBuilder(userId);
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });

  // Load existing resume if ID is provided
  useEffect(() => {
    if (resumeId && resumes) {
      const existingResume = resumes.find((r: any) => r.id === parseInt(resumeId));
      if (existingResume) {
        setResumeTitle(existingResume.title);
        setResumeData({
          personalInfo: existingResume.personalInfo,
          summary: existingResume.summary || '',
          experience: existingResume.experience || [],
          education: existingResume.education || [],
          skills: existingResume.skills || [],
          projects: existingResume.projects || [],
          certifications: existingResume.certifications || []
        });
      }
    }
  }, [resumeId, resumes]);

  const handleSave = async () => {
    try {
      const resumePayload = {
        title: resumeTitle,
        ...resumeData,
        template: 'modern',
        isPublic: false
      };

      if (resumeId) {
        await updateResume.mutateAsync({
          id: parseInt(resumeId),
          ...resumePayload
        });
      } else {
        await createResume.mutateAsync({
          userId,
          ...resumePayload
        });
      }
      
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume. Please try again.');
    }
  };

  const tabs: WorkspaceTab[] = [
    { id: 'personal', label: 'Personal Info', component: PersonalInfoSection },
    { id: 'summary', label: 'Summary', component: SummarySection },
    { id: 'skills', label: 'Skills', component: SkillsSection },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="text-xl font-semibold border-none bg-transparent focus:outline-none focus:bg-gray-50 rounded px-2 py-1"
                placeholder="Resume Title"
                aria-label="Resume Title"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <EyeIcon className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button onClick={handleSave} disabled={createResume.isPending || updateResume.isPending}>
                <BookmarkIcon className="w-4 h-4 mr-1" />
                {createResume.isPending || updateResume.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resume Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'personal' && (
              <PersonalInfoSection
                data={resumeData.personalInfo}
                onChange={(newData) => setResumeData({ ...resumeData, personalInfo: newData })}
              />
            )}
            {activeTab === 'summary' && (
              <SummarySection
                data={resumeData.summary || ''}
                onChange={(newData) => setResumeData({ ...resumeData, summary: newData })}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsSection
                data={resumeData.skills}
                onChange={(newData) => setResumeData({ ...resumeData, skills: newData })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeWorkspace() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResumeWorkspaceContent />
    </Suspense>
  );
}