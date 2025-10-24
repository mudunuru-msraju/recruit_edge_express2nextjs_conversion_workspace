import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Wand2, Target, Download } from 'lucide-react';

export default function CoverLetterWriterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/job-seeker-agents" className="flex items-center gap-2 text-gray-700 hover:text-teal-600 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Job Seeker Agents</span>
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-100 rounded-2xl mb-6">
            <FileText className="w-12 h-12 text-teal-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Cover Letter Writer</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Create compelling, tailored cover letters with AI assistance
          </p>
          <Link
            to="/job-seeker-agents/cover-letter-writer/workspace"
            className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Start Writing
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard icon={<Wand2 className="w-8 h-8 text-teal-600" />} title="AI Generation" description="Generate professional cover letters in seconds" />
          <FeatureCard icon={<Target className="w-8 h-8 text-teal-600" />} title="Job-Specific" description="Customize for each position and company" />
          <FeatureCard icon={<FileText className="w-8 h-8 text-teal-600" />} title="Multiple Tones" description="Professional, enthusiastic, or creative styles" />
          <FeatureCard icon={<Download className="w-8 h-8 text-teal-600" />} title="Easy Export" description="Download as PDF or copy to clipboard" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
