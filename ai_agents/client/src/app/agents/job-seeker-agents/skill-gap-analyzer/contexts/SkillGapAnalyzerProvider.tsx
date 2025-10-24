import { createContext, useContext, useState, ReactNode } from 'react';
import { SkillAnalysis, SkillGap, SkillGapAnalyzerState } from '../types';

interface SkillGapAnalyzerContextValue extends SkillGapAnalyzerState {
  setCurrentAnalysis: (analysis: SkillAnalysis | null) => void;
  setSkillGaps: (gaps: SkillGap[]) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

const SkillGapAnalyzerContext = createContext<SkillGapAnalyzerContextValue | undefined>(undefined);

export function SkillGapAnalyzerProvider({ children }: { children: ReactNode }) {
  const [currentAnalysis, setCurrentAnalysis] = useState<SkillAnalysis | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <SkillGapAnalyzerContext.Provider value={{
      currentAnalysis,
      skillGaps,
      isAnalyzing,
      setCurrentAnalysis,
      setSkillGaps,
      setIsAnalyzing,
    }}>
      {children}
    </SkillGapAnalyzerContext.Provider>
  );
}

export function useSkillGapAnalyzer() {
  const context = useContext(SkillGapAnalyzerContext);
  if (!context) throw new Error('useSkillGapAnalyzer must be used within Provider');
  return context;
}
