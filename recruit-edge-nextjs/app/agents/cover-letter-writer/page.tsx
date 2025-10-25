'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FileText, Download, Eye, Wand2 } from "lucide-react";

export default function CoverLetterWriterPage() {
  const [activeTab, setActiveTab] = useState('writer');
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    tone: 'professional',
    content: ''
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cover Letter Writer</h1>
              <p className="text-gray-600">Create compelling cover letters with AI assistance</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('writer')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'writer'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Write Letter
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Saved Letters
          </button>
        </div>

        {/* Writer Tab */}
        {activeTab === 'writer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Job Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Information</CardTitle>
                  <CardDescription>Tell us about the position you're applying for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      placeholder="e.g., Senior Frontend Developer"
                      value={formData.jobTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                        ...prev,
                        jobTitle: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="e.g., TechCorp Inc."
                      value={formData.companyName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({
                        ...prev,
                        companyName: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobDescription">Job Description (Optional)</Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="Paste the job description here for better customization..."
                      rows={4}
                      value={formData.jobDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({
                        ...prev,
                        jobDescription: e.target.value
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Letter Customization */}
              <Card>
                <CardHeader>
                  <CardTitle>Letter Style</CardTitle>
                  <CardDescription>Choose the tone and style for your cover letter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <select
                      id="tone"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      value={formData.tone}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({
                        ...prev,
                        tone: e.target.value
                      }))}
                    >
                      <option value="professional">Professional</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="conversational">Conversational</option>
                      <option value="formal">Formal</option>
                    </select>
                  </div>
                  <Button className="mt-4 w-full">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Cover Letter
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Cover Letter Preview</CardTitle>
                  <CardDescription>Edit and customize your cover letter</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Your generated cover letter will appear here. You can edit it directly..."
                    rows={20}
                    className="resize-none"
                    value={formData.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({
                      ...prev,
                      content: e.target.value
                    }))}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
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
              { name: 'Professional', description: 'Clean and formal tone' },
              { name: 'Creative', description: 'Show your personality' },
              { name: 'Technical', description: 'Focus on technical skills' },
              { name: 'Career Change', description: 'Transitioning careers' },
              { name: 'Entry Level', description: 'New to the field' },
              { name: 'Executive', description: 'Leadership positions' }
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

        {/* Saved Letters Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Saved Cover Letters</h2>
              <Button onClick={() => setActiveTab('writer')}>
                Create New Letter
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Frontend Developer at TechCorp', date: '2 days ago', template: 'Professional' },
                { title: 'Senior Engineer at StartupXYZ', date: '1 week ago', template: 'Technical' },
                { title: 'Product Manager at BigTech', date: '2 weeks ago', template: 'Creative' }
              ].map((letter, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{letter.title}</CardTitle>
                    <CardDescription>
                      {letter.template} • {letter.date}
                    </CardDescription>
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