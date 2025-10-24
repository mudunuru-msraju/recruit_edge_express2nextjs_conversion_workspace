import { SkillGapAnalyzerProvider } from '../contexts/SkillGapAnalyzerProvider';

export default function SkillGapAnalyzerWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <SkillGapAnalyzerProvider>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </SkillGapAnalyzerProvider>
  );
}
