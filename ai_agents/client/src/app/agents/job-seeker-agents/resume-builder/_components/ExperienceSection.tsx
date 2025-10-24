/**
 * Work Experience Section Component
 * Manage work history with dynamic form entries
 */

import { useState } from 'react';
import { useResumeBuilder } from '../contexts/ResumeBuilderProvider';
import { WorkExperience } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function ExperienceSection() {
  const { resumeData, updateSection } = useResumeBuilder();
  const [experiences, setExperiences] = useState<WorkExperience[]>(resumeData.experience || []);

  /**
   * Add new experience entry
   */
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [''],
    };
    const updated = [...experiences, newExp];
    setExperiences(updated);
    updateSection('experience', updated);
  };

  /**
   * Update specific experience
   */
  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    const updated = experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setExperiences(updated);
    updateSection('experience', updated);
  };

  /**
   * Delete experience
   */
  const deleteExperience = (id: string) => {
    const updated = experiences.filter((exp) => exp.id !== id);
    setExperiences(updated);
    updateSection('experience', updated);
  };

  /**
   * Add achievement bullet point
   */
  const addAchievement = (expId: string) => {
    const updated = experiences.map((exp) =>
      exp.id === expId
        ? { ...exp, achievements: [...exp.achievements, ''] }
        : exp
    );
    setExperiences(updated);
    updateSection('experience', updated);
  };

  /**
   * Update achievement
   */
  const updateAchievement = (expId: string, index: number, value: string) => {
    const updated = experiences.map((exp) =>
      exp.id === expId
        ? {
            ...exp,
            achievements: exp.achievements.map((a, i) => (i === index ? value : a)),
          }
        : exp
    );
    setExperiences(updated);
    updateSection('experience', updated);
  };

  /**
   * Remove achievement
   */
  const removeAchievement = (expId: string, index: number) => {
    const updated = experiences.map((exp) =>
      exp.id === expId
        ? { ...exp, achievements: exp.achievements.filter((_, i) => i !== index) }
        : exp
    );
    setExperiences(updated);
    updateSection('experience', updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>
          Add your professional experience, starting with the most recent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {experiences.map((exp, expIndex) => (
          <div key={exp.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
            {/* Experience Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                <span className="text-sm font-medium text-gray-500">
                  Experience #{expIndex + 1}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteExperience(exp.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Position *</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company *</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Tech Corp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date *</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="month"
                    value={exp.endDate || ''}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Current Position Checkbox */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span className="text-sm">I currently work here</span>
            </label>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="Brief overview of your role and responsibilities..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            {/* Achievements */}
            <div>
              <label className="block text-sm font-medium mb-2">Key Achievements</label>
              <div className="space-y-2">
                {exp.achievements.map((achievement, achIndex) => (
                  <div key={achIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) =>
                        updateAchievement(exp.id, achIndex, e.target.value)
                      }
                      placeholder="Increased sales by 25% through strategic initiatives..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    {exp.achievements.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(exp.id, achIndex)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addAchievement(exp.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button onClick={addExperience} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Work Experience
        </Button>
      </CardContent>
    </Card>
  );
}
