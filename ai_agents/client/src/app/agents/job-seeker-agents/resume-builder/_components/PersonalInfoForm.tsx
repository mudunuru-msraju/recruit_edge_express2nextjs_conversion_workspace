/**
 * Personal Information Form Component
 * Collects basic contact information for the resume
 */

import { useResumeBuilder } from '../contexts/ResumeBuilderProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResumeBuilder();
  const { personalInfo } = resumeData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Your contact details and professional links
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              value={personalInfo.fullName}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              placeholder="john.doe@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">Phone *</label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => updatePersonalInfo({ location: e.target.value })}
              placeholder="San Francisco, CA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <input
              type="url"
              value={personalInfo.linkedin || ''}
              onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/johndoe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium mb-2">GitHub</label>
            <input
              type="url"
              value={personalInfo.github || ''}
              onChange={(e) => updatePersonalInfo({ github: e.target.value })}
              placeholder="github.com/johndoe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Portfolio */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Portfolio Website</label>
            <input
              type="url"
              value={personalInfo.portfolio || ''}
              onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
              placeholder="https://johndoe.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
