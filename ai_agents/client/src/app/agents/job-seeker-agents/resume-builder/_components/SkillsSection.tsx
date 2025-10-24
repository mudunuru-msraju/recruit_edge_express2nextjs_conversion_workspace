/**
 * Skills Section Component
 * Manage professional skills with tags
 */

import { useState } from 'react';
import { useResumeBuilder } from '../contexts/ResumeBuilderProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

export function SkillsSection() {
  const { resumeData, updateSection } = useResumeBuilder();
  const [skills, setSkills] = useState<string[]>(resumeData.skills || []);
  const [inputValue, setInputValue] = useState('');

  /**
   * Add skill
   */
  const addSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      const updated = [...skills, inputValue.trim()];
      setSkills(updated);
      updateSection('skills', updated);
      setInputValue('');
    }
  };

  /**
   * Remove skill
   */
  const removeSkill = (skill: string) => {
    const updated = skills.filter((s) => s !== skill);
    setSkills(updated);
    updateSection('skills', updated);
  };

  /**
   * Handle Enter key
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // Suggested skills for common roles
  const suggestedSkills = [
    'JavaScript', 'Python', 'React', 'TypeScript', 'Node.js',
    'AWS', 'Docker', 'Git', 'SQL', 'Leadership',
    'Project Management', 'Communication', 'Problem Solving'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>
          Add your technical and soft skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input for adding skills */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a skill and press Enter"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Button onClick={addSkill} disabled={!inputValue.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Current skills */}
        {skills.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Your Skills ({skills.length})</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-teal-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested skills */}
        <div>
          <p className="text-sm font-medium mb-2">Suggested Skills</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills
              .filter((skill) => !skills.includes(skill))
              .map((skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    const updated = [...skills, skill];
                    setSkills(updated);
                    updateSection('skills', updated);
                  }}
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50 transition-colors"
                >
                  + {skill}
                </button>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
