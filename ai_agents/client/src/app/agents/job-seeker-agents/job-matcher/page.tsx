import { Link } from 'react-router-dom';
import { ArrowLeft, Target } from 'lucide-react';

export default function job_matcherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/job-seeker-agents" className="flex items-center gap-2 text-gray-700 hover:text-teal-600 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to job-seeker-agents</span>
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-100 rounded-2xl mb-6">
            <Target className="w-12 h-12 text-teal-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Job Matcher</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find jobs that match your skills and preferences
          </p>
          <Link
            to="/job-seeker-agents/job-matcher/workspace"
            className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
