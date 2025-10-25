'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FileText, Download, Eye, Plus, Trash2 } from "lucide-react";

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState('builder');
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      title: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: []
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-gray-600">Create professional resumes with AI assistance</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'builder'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Build Resume
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Saved Resumes
          </button>
        </div>

        {/* Builder Tab */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Basic contact details and professional title</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        placeholder="Software Engineer"
                        value={resumeData.personalInfo.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, title: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={resumeData.personalInfo.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={resumeData.personalInfo.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="San Francisco, CA"
                      value={resumeData.personalInfo.location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                  <CardDescription>Brief overview of your experience and skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write a compelling summary of your professional background..."
                    rows={4}
                    value={resumeData.summary}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  />
                  <Button className="mt-2" variant="outline" size="sm">
                    Generate with AI
                  </Button>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Resume Preview</CardTitle>
                  <CardDescription>Live preview of your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border rounded-lg p-6 min-h-[600px]">
                    {/* Resume Preview Content */}
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {resumeData.personalInfo.fullName || 'Your Name'}
                      </h2>
                      <p className="text-lg text-gray-600">
                        {resumeData.personalInfo.title || 'Professional Title'}
                      </p>
                      <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{resumeData.personalInfo.email || 'email@example.com'}</span>
                        <span>{resumeData.personalInfo.phone || '+1 (555) 123-4567'}</span>
                        <span>{resumeData.personalInfo.location || 'City, State'}</span>
                      </div>
                    </div>
                    
                    {resumeData.summary && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{resumeData.summary}</p>
                      </div>
                    )}
                    
                    <div className="text-center text-gray-400 mt-8">
                      <FileText className="h-12 w-12 mx-auto mb-2" />
                      <p>Fill in your information to see the preview</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Professional', description: 'Clean and modern design' },
              { name: 'Creative', description: 'Stand out with unique styling' },
              { name: 'Technical', description: 'Perfect for tech roles' },
              { name: 'Executive', description: 'Professional leadership template' },
              { name: 'Minimalist', description: 'Simple and elegant' },
              { name: 'Academic', description: 'For research and academic positions' }
            ].map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Use Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Saved Resumes Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Saved Resumes</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Resume
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Software Engineer Resume', updated: '2 days ago', template: 'Professional' },
                { name: 'Senior Developer Resume', updated: '1 week ago', template: 'Technical' },
                { name: 'Team Lead Position', updated: '2 weeks ago', template: 'Executive' }
              ].map((resume, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{resume.name}</CardTitle>
                        <CardDescription>
                          {resume.template} • Updated {resume.updated}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}