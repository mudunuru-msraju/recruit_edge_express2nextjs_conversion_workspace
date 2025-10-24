/**
 * Resume Preview Component
 * Shows real-time preview of the resume
 */

import { useResumeBuilder } from '../contexts/ResumeBuilderProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

export function ResumePreview() {
  const { resumeData, selectedTemplate } = useResumeBuilder();
  const { personalInfo, summary, experience, education, skills } = resumeData;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg p-8 shadow-sm max-w-[8.5in] mx-auto">
          {/* Header */}
          <div className="text-center mb-6 pb-4 border-b-2 border-teal-600">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {personalInfo.location}
                </span>
              )}
            </div>
            {(personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && (
              <div className="flex flex-wrap justify-center gap-4 text-sm text-teal-600 mt-2">
                {personalInfo.linkedin && (
                  <a href={personalInfo.linkedin} className="flex items-center gap-1 hover:underline">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {personalInfo.github && (
                  <a href={personalInfo.github} className="flex items-center gap-1 hover:underline">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {personalInfo.portfolio && (
                  <a href={personalInfo.portfolio} className="flex items-center gap-1 hover:underline">
                    <Globe className="w-4 h-4" /> Portfolio
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-300">
                Professional Summary
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-300">
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-gray-700">{exp.company}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{exp.location}</p>
                        <p>
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                    {exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-300">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{edu.location}</p>
                      <p>{edu.graduationDate}</p>
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-300">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Template watermark */}
          {selectedTemplate && (
            <div className="text-center text-xs text-gray-400 mt-8">
              Template: {selectedTemplate.name}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
