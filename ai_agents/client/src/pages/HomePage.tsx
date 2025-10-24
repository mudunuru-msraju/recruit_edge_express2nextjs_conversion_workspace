/**
 * RecruitEdge Home Page
 * Landing page with hero section, features, and agent categories
 */

import { Link } from 'react-router-dom';
import { Users, Briefcase, Settings } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-teal-600">RecruitEdge</h1>
            <div className="flex gap-4">
              <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-teal-600">
                Sign In
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          AI-Powered Recruitment Platform
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform your hiring process with intelligent agents that streamline recruitment,
          empower job seekers, and provide powerful analytics.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/signup" 
            className="px-8 py-4 bg-teal-600 text-white rounded-lg text-lg font-semibold hover:bg-teal-700"
          >
            Start Free Trial
          </Link>
          <Link 
            to="#features" 
            className="px-8 py-4 border-2 border-teal-600 text-teal-600 rounded-lg text-lg font-semibold hover:bg-teal-50"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Agent Categories */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Choose Your Agent Category</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Job Seeker Agents */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <Users className="w-12 h-12 text-teal-600 mb-4" />
            <h4 className="text-2xl font-bold mb-4">Job Seeker Agents</h4>
            <p className="text-gray-600 mb-6">
              Resume builder, interview prep, skill gap analysis, and career coaching.
            </p>
            <Link 
              to="/job-seeker-agents" 
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Explore Agents →
            </Link>
          </div>

          {/* Recruiter Agents */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <Briefcase className="w-12 h-12 text-green-600 mb-4" />
            <h4 className="text-2xl font-bold mb-4">Recruiter Agents</h4>
            <p className="text-gray-600 mb-6">
              Job description generation, candidate sourcing, resume shortlisting, and matching.
            </p>
            <Link 
              to="/recruiter-agents" 
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Explore Agents →
            </Link>
          </div>

          {/* Admin Agents */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <Settings className="w-12 h-12 text-teal-600 mb-4" />
            <h4 className="text-2xl font-bold mb-4">Admin Agents</h4>
            <p className="text-gray-600 mb-6">
              Analytics dashboards, application tracking, compliance, and workflow management.
            </p>
            <Link 
              to="/admin-agents" 
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Explore Agents →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 RecruitEdge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
