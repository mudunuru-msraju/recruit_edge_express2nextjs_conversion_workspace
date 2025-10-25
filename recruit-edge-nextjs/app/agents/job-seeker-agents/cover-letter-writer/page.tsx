'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  PencilIcon, 
  TrashIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useCoverLetterWriter } from '@/agents/cover-letter-writer/hooks/useCoverLetterWriter';
import { type CoverLetterApiData } from '@/agents/cover-letter-writer/lib/api-client';

export default function CoverLetterWriterPage() {
  const userId = 1; // TODO: Get from auth context
  const { coverLetters, isLoading, deleteCoverLetter } = useCoverLetterWriter(userId);

  const handleDeleteCoverLetter = async (id: number) => {
    if (confirm('Are you sure you want to delete this cover letter?')) {
      await deleteCoverLetter.mutateAsync(id);
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'enthusiastic': return 'bg-green-100 text-green-800';
      case 'creative': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cover Letter Writer</h1>
        <p className="text-gray-600 max-w-2xl">
          Create compelling, personalized cover letters with AI assistance. Generate tailored content 
          for any job application and customize tone to match company culture.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {coverLetters?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Total Letters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {coverLetters?.filter(letter => 
                    new Date(letter.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length || 0}
                </p>
                <p className="text-sm text-gray-600">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {coverLetters?.filter(letter => letter.content.length > 500).length || 0}
                </p>
                <p className="text-sm text-gray-600">Complete Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link href="/agents/job-seeker-agents/cover-letter-writer/editor">
          <Button className="inline-flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Write New Letter
          </Button>
        </Link>
        <Button variant="outline">
          <SparklesIcon className="w-5 h-5 mr-2" />
          AI Generation
        </Button>
        <Button variant="outline">
          <DocumentTextIcon className="w-5 h-5 mr-2" />
          Browse Templates
        </Button>
      </div>

      {/* Cover Letters List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Cover Letters</h2>
        
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
        ) : coverLetters?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cover letters yet</h3>
              <p className="text-gray-600 mb-4">
                Start creating professional cover letters with AI assistance to land your dream job.
              </p>
              <Link href="/agents/job-seeker-agents/cover-letter-writer/editor">
                <Button>Create Your First Cover Letter</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverLetters?.map((letter: CoverLetterApiData) => (
              <Card key={letter.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{letter.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getToneColor(letter.tone)}`}>
                      {letter.tone}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {letter.companyName && (
                      <span>for {letter.companyName}</span>
                    )}
                    {letter.jobTitle && (
                      <span> • {letter.jobTitle}</span>
                    )}
                    <br />
                    Last updated: {new Date(letter.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {letter.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Link href={`/agents/job-seeker-agents/cover-letter-writer/editor?id=${letter.id}`}>
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
                          console.log('Preview cover letter:', letter.id);
                        }}
                      >
                        Preview
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCoverLetter(letter.id)}
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
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Use Our Cover Letter Writer?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
                AI-Powered Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Generate personalized cover letters in seconds using AI that understands 
                job requirements and company culture.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PencilIcon className="w-6 h-6 text-green-600" />
                Tone Customization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Choose from professional, enthusiastic, or creative tones to match 
                the company culture and role requirements.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                Professional Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Access a library of industry-specific templates and formats 
                that follow hiring manager preferences.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}