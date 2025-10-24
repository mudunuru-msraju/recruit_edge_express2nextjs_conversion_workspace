/**
 * Resume Template Selector Component
 * Allows users to choose from different resume templates
 */

import { useResumeBuilder } from '../contexts/ResumeBuilderProvider';
import { ResumeTemplate } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

// Available resume templates
const templates: ResumeTemplate[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    preview: '/templates/modern.png',
    description: 'Clean and contemporary design with bold headers',
  },
  {
    id: 'classic',
    name: 'Classic',
    preview: '/templates/classic.png',
    description: 'Traditional layout, perfect for conservative industries',
  },
  {
    id: 'creative',
    name: 'Creative',
    preview: '/templates/creative.png',
    description: 'Eye-catching design for creative professionals',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    preview: '/templates/minimal.png',
    description: 'Simple and elegant, focuses on content',
  },
];

export function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate } = useResumeBuilder();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Template</CardTitle>
        <CardDescription>
          Select a professional template for your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`relative p-4 border-2 rounded-lg transition-all hover:border-teal-400 ${
                selectedTemplate?.id === template.id
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-gray-200'
              }`}
            >
              {/* Selected indicator */}
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Template preview placeholder */}
              <div className="aspect-[8.5/11] bg-gray-100 rounded mb-2 flex items-center justify-center">
                <span className="text-gray-400 text-sm">{template.name}</span>
              </div>

              {/* Template info */}
              <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
              <p className="text-xs text-gray-600">{template.description}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
