/**
 * Resume Builder Workspace Layout
 * Defines the agent-specific sidebar and navigation for the workspace
 */

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ResumeBuilderProvider } from '../contexts/ResumeBuilderProvider';
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Settings,
  Home,
  ArrowLeft
} from 'lucide-react';

interface WorkspaceLayoutProps {
  children: ReactNode;
}

// Agent-specific navigation items
const navigationItems = [
  { icon: Settings, label: 'Template', section: 'template' },
  { icon: User, label: 'Personal Info', section: 'personal' },
  { icon: FileText, label: 'Summary', section: 'summary' },
  { icon: Briefcase, label: 'Experience', section: 'experience' },
  { icon: GraduationCap, label: 'Education', section: 'education' },
  { icon: Award, label: 'Skills', section: 'skills' },
];

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const location = useLocation();

  return (
    <ResumeBuilderProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Agent-Specific Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Agent Header */}
          <div className="p-4 border-b border-gray-200">
            <Link to="/job-seeker-agents/resume-builder" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3">
              <ArrowLeft className="w-4 h-4" />
              Back to Agent Info
            </Link>
            <h2 className="text-lg font-bold text-gray-900">Resume Builder</h2>
            <p className="text-sm text-gray-500">Build your perfect resume</p>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.hash === `#${item.section}`;
                
                return (
                  <li key={item.section}>
                    <a
                      href={`#${item.section}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-teal-50 text-teal-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </ResumeBuilderProvider>
  );
}
