import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart } from 'lucide-react';

export default function job_analyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/recruiter-agents" className="flex items-center gap-2 text-gray-700 hover:text-green-600 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Recruiter Agents</span>
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-2xl mb-6">
            <BarChart className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Job Analytics</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">Track hiring metrics and performance</p>
          <Link to="/recruiter-agents/job-analytics/workspace" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
