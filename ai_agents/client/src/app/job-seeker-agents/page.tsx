/**
 * Job Seeker Agents Category Page
 * Lists all available job seeker agents
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, TrendingUp, Home, ArrowRight, Target, DollarSign } from 'lucide-react';

export default function JobSeekerAgentsPage() {
  const agents = [
    {
      slug: 'resume-builder',
      title: 'Resume Builder',
      description: 'Create professional, ATS-optimized resumes with AI-powered suggestions',
      icon: FileText,
      color: 'teal',
      available: true,
    },
    {
      slug: 'cover-letter-writer',
      title: 'Cover Letter Writer',
      description: 'Create compelling, tailored cover letters with AI assistance',
      icon: FileText,
      color: 'teal',
      available: true,
    },
    {
      slug: 'interview-prep',
      title: 'Interview Prep',
      description: 'Practice interviews with AI and get personalized feedback',
      icon: MessageSquare,
      color: 'teal',
      available: true,
    },
    {
      slug: 'skill-gap-analyzer',
      title: 'Skill Gap Analyzer',
      description: 'Identify skill gaps and get personalized learning recommendations',
      icon: TrendingUp,
      color: 'teal',
      available: true,
    },
    {
      slug: 'job-matcher',
      title: 'Job Matcher',
      description: 'Find jobs that match your skills and preferences with AI recommendations',
      icon: Target,
      color: 'teal',
      available: true,
    },
    {
      slug: 'salary-negotiator',
      title: 'Salary Negotiator',
      description: 'Research salaries and negotiate better offers',
      icon: DollarSign,
      color: 'teal',
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-teal-600">
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-teal-600">RecruitEdge</h1>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Job Seeker Agents
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Powerful AI agents to help you land your dream job
        </p>
      </section>

      {/* Agents Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isAvailable = agent.available;
            
            return (
              <Card 
                key={agent.slug} 
                className={`hover:shadow-lg transition-shadow ${
                  !isAvailable ? 'opacity-60' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-10 h-10 text-teal-600" />
                    {!isAvailable && (
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl">{agent.title}</CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isAvailable ? (
                    <Link
                      to={`/job-seeker-agents/${agent.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      Open Agent <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
