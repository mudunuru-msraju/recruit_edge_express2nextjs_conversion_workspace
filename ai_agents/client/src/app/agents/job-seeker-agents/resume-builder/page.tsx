/**
 * Resume Builder Agent Landing Page
 * Displays agent information, features, and sample questions
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Layout, 
  CheckCircle,
  ArrowRight,
  Home
} from 'lucide-react';
import manifest from './data/manifest.json';

export default function ResumeBuilderLanding() {
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
            <Link 
              to={`/${manifest.category}/${manifest.slug}/workspace`}
              className="flex items-center gap-2"
            >
              <Button>
                Open Workspace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-teal-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-12 h-12 text-teal-600" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {manifest.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {manifest.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {manifest.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          <Link to={`/${manifest.category}/${manifest.slug}/workspace`}>
            <Button size="lg" className="px-8">
              Start Building Your Resume
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {manifest.features.map((feature, index) => {
            const icons = [Layout, Sparkles, FileText, Download, CheckCircle, FileText];
            const Icon = icons[index % icons.length];
            
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="w-8 h-8 text-teal-600 mb-2" />
                  <CardTitle className="text-lg">{feature}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Sample Questions */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How Can I Help You?</h2>
          <p className="text-center text-gray-600 mb-8">
            Here are some common questions I can answer
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {manifest.sampleQuestions.map((question, index) => (
              <Card key={index} className="hover:border-teal-400 cursor-pointer transition-colors">
                <CardContent className="p-6">
                  <p className="text-gray-700">{question}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Perfect Resume?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Create a professional, ATS-optimized resume in minutes with AI-powered assistance
          </p>
          <Link to={`/${manifest.category}/${manifest.slug}/workspace`}>
            <Button size="lg" className="px-8">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Part of the RecruitEdge AI Agent Platform</p>
        </div>
      </footer>
    </div>
  );
}
