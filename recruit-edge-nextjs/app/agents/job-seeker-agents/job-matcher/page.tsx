'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  SparklesIcon, 
  ChartBarIcon, 
  BookmarkIcon, 
  AcademicCapIcon,
  BriefcaseIcon,
  MapPinIcon 
} from '@heroicons/react/24/outline';
import { useJobMatcher } from '@/agents/job-matcher/hooks/useJobMatcher';
import { type JobMatchApiData } from '@/agents/job-matcher/lib/api-client';

export default function JobMatcherPage() {
  const userId = 1; // TODO: Get from auth context
  const { jobMatches, isLoading } = useJobMatcher(userId);

  // Get recent matches (last 5)
  const recentMatches = jobMatches?.slice(0, 5) || [];
  const topMatches = jobMatches?.filter(match => match.matchScore >= 85) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Job Matcher</h1>
        <p className="text-gray-600 max-w-2xl">
          Find your perfect job match with AI-powered analysis. Get personalized recommendations 
          based on your skills, experience, and career preferences.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <ChartBarIcon className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {jobMatches?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Total Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <SparklesIcon className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {topMatches.length}
                </p>
                <p className="text-sm text-gray-600">High Matches (85%+)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BookmarkIcon className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {jobMatches?.filter(match => match.isBookmarked).length || 0}
                </p>
                <p className="text-sm text-gray-600">Bookmarked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {jobMatches?.filter(match => match.isApplied).length || 0}
                </p>
                <p className="text-sm text-gray-600">Applied</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link href="/agents/job-seeker-agents/job-matcher/dashboard">
          <Button className="inline-flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5" />
            View Dashboard
          </Button>
        </Link>
        <Button variant="outline">
          <SparklesIcon className="w-5 h-5 mr-2" />
          Analyze New Job
        </Button>
        <Button variant="outline">
          <AcademicCapIcon className="w-5 h-5 mr-2" />
          Update Preferences
        </Button>
      </div>

      {/* Recent Matches */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Job Matches</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentMatches.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No job matches yet</h3>
              <p className="text-gray-600 mb-4">
                Start analyzing jobs to find your perfect matches with AI-powered insights.
              </p>
              <Button>Analyze Your First Job</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentMatches.map((match: JobMatchApiData) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span>Job #{match.jobId}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          match.matchScore >= 90 ? 'bg-green-100 text-green-800' :
                          match.matchScore >= 80 ? 'bg-blue-100 text-blue-800' :
                          match.matchScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {match.matchScore}% Match
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Analyzed {new Date(match.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {match.isBookmarked && (
                        <BookmarkIcon className="w-5 h-5 text-yellow-600 fill-current" />
                      )}
                      {match.isApplied && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Applied
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{match.aiSummary || 'AI analysis in progress...'}</p>
                  
                  {match.skillsMatch && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm font-medium text-gray-700">Skills:</span>
                      {match.skillsMatch.matched.slice(0, 3).map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {match.skillsMatch.matched.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{match.skillsMatch.matched.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <Link href={`/agents/job-seeker-agents/job-matcher/match/${match.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <BookmarkIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">How Our AI Job Matching Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
                Smart Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our AI analyzes job descriptions against your skills, experience, and 
                preferences to calculate precise match scores.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AcademicCapIcon className="w-6 h-6 text-green-600" />
                Skills Gap Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Discover which skills you already have and which ones you need to develop 
                for your target roles.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-purple-600" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get job recommendations tailored to your location preferences, 
                salary expectations, and career goals.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}