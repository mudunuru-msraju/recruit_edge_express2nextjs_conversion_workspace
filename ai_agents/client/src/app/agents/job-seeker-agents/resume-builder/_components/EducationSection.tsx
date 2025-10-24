/**
 * Education Section Component
 * Manage educational background
 */

import { useState } from 'react';
import { useResumeBuilder } from '../contexts/ResumeBuilderProvider';
import { Education } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export function EducationSection() {
  const { resumeData, updateSection } = useResumeBuilder();
  const [education, setEducation] = useState<Education[]>(resumeData.education || []);

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      graduationDate: '',
      gpa: '',
    };
    const updated = [...education, newEdu];
    setEducation(updated);
    updateSection('education', updated);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updated = education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setEducation(updated);
    updateSection('education', updated);
  };

  const deleteEducation = (id: string) => {
    const updated = education.filter((edu) => edu.id !== id);
    setEducation(updated);
    updateSection('education', updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>
          Add your educational qualifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {education.map((edu, index) => (
          <div key={edu.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                Education #{index + 1}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteEducation(edu.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Institution *</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="Stanford University"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Degree *</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Field of Study *</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Computer Science"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                  placeholder="Stanford, CA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Graduation Date *</label>
                <input
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">GPA (optional)</label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        ))}

        <Button onClick={addEducation} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </CardContent>
    </Card>
  );
}
