/**
 * Professional Summary Section Component
 * Allows users to write or generate an AI-powered summary
 */

import { useState } from 'react';
import { useResumeBuilder } from '../contexts/ResumeBuilderProvider';
import { useAISuggestions } from '../contexts/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

export function SummarySection() {
  const { resumeData, updateSection } = useResumeBuilder();
  const { generateSummary, isLoading } = useAISuggestions();
  const [localSummary, setLocalSummary] = useState(resumeData.summary || '');

  /**
   * Handle AI summary generation
   */
  const handleGenerateSummary = async () => {
    try {
      const generated = await generateSummary(resumeData);
      setLocalSummary(generated);
      updateSection('summary', generated);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    }
  };

  /**
   * Update summary in context on blur
   */
  const handleBlur = () => {
    updateSection('summary', localSummary);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Summary</CardTitle>
        <CardDescription>
          A brief overview of your professional background and key achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          value={localSummary}
          onChange={(e) => setLocalSummary(e.target.value)}
          onBlur={handleBlur}
          placeholder="Write a compelling summary that highlights your expertise and career goals..."
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {localSummary.length} characters (recommended: 150-300)
          </p>
          <Button
            onClick={handleGenerateSummary}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
