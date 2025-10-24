import { useState } from 'react';

export function useSkillAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const analyze = async (data: any) => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return { analyze, isAnalyzing };
}
