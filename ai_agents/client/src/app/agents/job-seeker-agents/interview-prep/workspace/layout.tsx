/**
 * Interview Prep Workspace Layout
 */

import { InterviewPrepProvider } from '../contexts/InterviewPrepProvider';

export default function InterviewPrepWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <InterviewPrepProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </InterviewPrepProvider>
  );
}
