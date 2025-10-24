/**
 * Interview Prep Landing Page
 */

import { Link } from 'react-router-dom';
import { MessageSquare, Target, TrendingUp, Award } from 'lucide-react';

export default function InterviewPrepLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Interview Prep
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Practice with AI-powered mock interviews and ace your next opportunity
            </p>
            <Link
              to="/job-seeker-agents/interview-prep/workspace"
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              Start Practicing
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-teal-600" />}
              title="AI Mock Interviews"
              description="Practice with intelligent AI that adapts to your answers and provides real-time feedback"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8 text-teal-600" />}
              title="Role-Specific Questions"
              description="Get questions tailored to your target role, company, and industry"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-teal-600" />}
              title="Track Progress"
              description="Monitor your improvement across sessions with detailed analytics and scoring"
            />
            <FeatureCard
              icon={<Award className="w-8 h-8 text-teal-600" />}
              title="Personalized Feedback"
              description="Receive actionable suggestions to improve your interview performance"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
