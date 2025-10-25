'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { 
  AcademicCapIcon, 
  PlusIcon, 
  ClockIcon, 
  StarIcon,
  ChartBarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import {
  useInterviewSessions,
  useCreateInterviewSession,
  useDeleteInterviewSession,
} from '@/agents/interview-prep/hooks';

function InterviewPrepContent() {
  const searchParams = useSearchParams();
  const userId = parseInt(searchParams.get('userId') || '1');
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');

  const { 
    data: sessions, 
    isLoading, 
    error,
    refetch
  } = useInterviewSessions(userId);

  const createSession = useCreateInterviewSession();
  const deleteSession = useDeleteInterviewSession();

  const handleCreateSession = async (formData: any) => {
    try {
      await createSession.mutateAsync({
        ...formData,
        userId,
      });
      setShowCreateForm(false);
      refetch();
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (confirm('Are you sure you want to delete this interview session?')) {
      try {
        await deleteSession.mutateAsync({ id: sessionId, userId });
        refetch();
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  const interviewTypes = [
    { value: 'behavioral', label: 'Behavioral', description: 'Situational and experience-based questions' },
    { value: 'technical', label: 'Technical', description: 'Role-specific technical knowledge' },
    { value: 'coding', label: 'Coding', description: 'Programming challenges and algorithms' },
    { value: 'system_design', label: 'System Design', description: 'Architecture and scalability questions' },
    { value: 'case_study', label: 'Case Study', description: 'Business scenarios and problem-solving' },
    { value: 'general', label: 'General', description: 'Standard interview questions' },
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'hard', label: 'Hard', color: 'text-red-600' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load interview sessions"
        description="There was an error loading your interview practice sessions."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <AcademicCapIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Prep</h1>
            <p className="text-gray-600">Practice interviews with AI-powered feedback and question generation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold">{sessions?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <StarIcon className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold">
                    {sessions?.length 
                      ? Math.round(sessions.filter(s => s.score).reduce((acc, s) => acc + (s.score || 0), 0) / sessions.filter(s => s.score).length) || 'N/A'
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">
                    {sessions?.filter(s => s.score).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <PlayIcon className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold">
                    {sessions?.filter(s => !s.score).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button 
          onClick={() => setShowCreateForm(true)}
          className="mb-6"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Interview Session
        </Button>
      </div>

      {/* Create Session Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Interview Session</CardTitle>
            <CardDescription>Set up a new practice interview session</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleCreateSession({
                title: formData.get('title'),
                interviewType: formData.get('interviewType'),
                difficulty: formData.get('difficulty') || undefined,
                targetRole: formData.get('targetRole') || undefined,
                targetCompany: formData.get('targetCompany') || undefined,
                numberOfQuestions: parseInt(formData.get('numberOfQuestions') as string) || 5,
              });
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Title *
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Frontend Developer Interview Prep"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Type *
                  </label>
                  <select
                    name="interviewType"
                    required
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type...</option>
                    {interviewTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    name="difficulty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any difficulty</option>
                    {difficultyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Questions
                  </label>
                  <input
                    name="numberOfQuestions"
                    type="number"
                    min="1"
                    max="20"
                    defaultValue="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Role
                  </label>
                  <input
                    name="targetRole"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Company
                  </label>
                  <input
                    name="targetCompany"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Google, Microsoft"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={createSession.isPending}>
                  {createSession.isPending ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  Create Session
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      {!sessions || sessions.length === 0 ? (
        <EmptyState
          icon={AcademicCapIcon}
          title="No interview sessions yet"
          description="Create your first interview practice session to get started."
          action={
            <Button onClick={() => setShowCreateForm(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Create First Session
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <CardDescription>
                      {interviewTypes.find(t => t.value === session.interviewType)?.label || session.interviewType}
                      {session.difficulty && (
                        <span className={`ml-2 ${difficultyLevels.find(d => d.value === session.difficulty)?.color}`}>
                          • {difficultyLevels.find(d => d.value === session.difficulty)?.label}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {session.score && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{session.score}%</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {session.targetRole && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Role:</span> {session.targetRole}
                    </p>
                  )}
                  {session.targetCompany && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Company:</span> {session.targetCompany}
                    </p>
                  )}
                  {session.duration && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Duration:</span> {session.duration} minutes
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Created:</span> {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.location.href = `/agents/job-seeker-agents/interview-prep/session/${session.id}?userId=${userId}`}
                  >
                    {session.score ? 'Review' : 'Continue'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteSession(session.id)}
                    disabled={deleteSession.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InterviewPrepPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <InterviewPrepContent />
    </Suspense>
  );
}