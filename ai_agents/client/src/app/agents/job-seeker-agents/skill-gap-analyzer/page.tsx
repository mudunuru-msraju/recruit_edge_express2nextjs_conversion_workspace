import { Link } from 'react-router-dom';
import { Target, TrendingUp, BookOpen, Award } from 'lucide-react';

export default function SkillGapAnalyzerLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Skill Gap Analyzer</h1>
            <p className="text-xl text-gray-600 mb-8">
              Identify skill gaps and get personalized learning paths
            </p>
            <Link to="/job-seeker-agents/skill-gap-analyzer/workspace" className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition">
              Analyze My Skills
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard icon={<Target className="w-8 h-8 text-teal-600" />} title="Gap Analysis" description="Compare your skills against job requirements" />
            <FeatureCard icon={<TrendingUp className="w-8 h-8 text-teal-600" />} title="Priority Tracking" description="Focus on high-priority skills first" />
            <FeatureCard icon={<BookOpen className="w-8 h-8 text-teal-600" />} title="Learning Resources" description="Get personalized course recommendations" />
            <FeatureCard icon={<Award className="w-8 h-8 text-teal-600" />} title="Progress Tracking" description="Monitor your skill development journey" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
