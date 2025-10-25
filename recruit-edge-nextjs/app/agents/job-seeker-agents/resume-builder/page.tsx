'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, DocumentTextIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useResumeBuilder } from '@/agents/resume-builder/hooks/useResumeBuilder';

interface Resume {
  id: number;
  title: string;
  template: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ResumeBuilderPage() {
  const userId = 1; // TODO: Get from auth context
  const { resumes, isLoading, deleteResume } = useResumeBuilder(userId);

  const handleDeleteResume = async (id: number) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      await deleteResume.mutateAsync(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Builder</h1>
        <p className="text-gray-600 max-w-2xl">
          Create professional resumes with our AI-powered builder. Choose from templates, 
          get AI suggestions, and export to multiple formats.
        </p>
      </div>

      {/* Actions */}
      <div className="mb-8">
        <Link href="/agents/job-seeker-agents/resume-builder/workspace">
          <Button className="inline-flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Create New Resume
          </Button>
        </Link>
      </div>

      {/* Resume List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resumes?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first professional resume.
              </p>
              <Link href="/agents/job-seeker-agents/resume-builder/workspace">
                <Button>Create Your First Resume</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes?.map((resume: Resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{resume.title}</span>
                    <div className="flex items-center gap-1 ml-2">
                      {resume.isPublic && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Public
                        </span>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Template: {resume.template}
                    <br />
                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Link href={`/agents/job-seeker-agents/resume-builder/workspace?id=${resume.id}`}>
                        <Button variant="outline" size="sm" className="inline-flex items-center gap-1">
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          // TODO: Implement preview functionality
                          console.log('Preview resume:', resume.id);
                        }}
                      >
                        Preview
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteResume(resume.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Use Our Resume Builder?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI-Powered Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get intelligent recommendations for improving your resume content, 
                formatting, and keyword optimization.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professional Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Choose from a variety of professionally designed templates 
                optimized for different industries and roles.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Multiple Export Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Export your resume as PDF, Word document, or HTML. 
                Perfect for different application requirements.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}