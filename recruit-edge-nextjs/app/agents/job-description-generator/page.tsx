'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FileText, Wand2, Eye, Download, Save, Search, TrendingUp } from "lucide-react";

export default function JobDescriptionGeneratorPage() {
  const [activeTab, setActiveTab] = useState('generator');
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    employmentType: 'full-time',
    experienceLevel: 'mid',
    industry: '',
    salaryMin: '',
    salaryMax: ''
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
              <h1 className="text-3xl font-bold text-gray-900">Job Description Generator</h1>
              <p className="text-gray-600">Create compelling job postings with AI assistance</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'generator'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            AI Generator
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
            Saved Jobs
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Performance
          </button>
        </div>

        {/* AI Generator Tab */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>Provide basic information about the position</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        placeholder="e.g., Senior Software Engineer"
                        value={jobData.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobData(prev => ({
                          ...prev,
                          title: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        placeholder="e.g., TechCorp Inc."
                        value={jobData.company}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobData(prev => ({
                          ...prev,
                          company: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., San Francisco, CA"
                        value={jobData.location}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobData(prev => ({
                          ...prev,
                          location: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <select
                        id="industry"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        title="Select industry"
                        value={jobData.industry}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setJobData(prev => ({
                          ...prev,
                          industry: e.target.value
                        }))}
                      >
                        <option value="">Select Industry</option>
                        <option value="technology">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="consulting">Consulting</option>
                        <option value="retail">Retail</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="education">Education</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employmentType">Employment Type</Label>
                      <select
                        id="employmentType"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        title="Select employment type"
                        value={jobData.employmentType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setJobData(prev => ({
                          ...prev,
                          employmentType: e.target.value
                        }))}
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="temporary">Temporary</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="experienceLevel">Experience Level</Label>
                      <select
                        id="experienceLevel"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        title="Select experience level"
                        value={jobData.experienceLevel}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setJobData(prev => ({
                          ...prev,
                          experienceLevel: e.target.value
                        }))}
                      >
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior Level</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salaryMin">Salary Min</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        placeholder="80000"
                        value={jobData.salaryMin}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobData(prev => ({
                          ...prev,
                          salaryMin: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="salaryMax">Salary Max</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        placeholder="120000"
                        value={jobData.salaryMax}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobData(prev => ({
                          ...prev,
                          salaryMax: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                  <Button className="w-full">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Job Description
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Generated Description</CardTitle>
                  <CardDescription>AI-generated job posting with optimization suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Quality Scores */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">85</div>
                        <div className="text-xs text-gray-600">SEO Score</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">92</div>
                        <div className="text-xs text-gray-600">Readability</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">88</div>
                        <div className="text-xs text-gray-600">Inclusivity</div>
                      </div>
                    </div>

                    {/* Generated Content Preview */}
                    <div className="border rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
                      <h3 className="font-bold text-lg mb-2">Senior Software Engineer</h3>
                      <p className="text-sm text-gray-600 mb-4">TechCorp Inc. • San Francisco, CA • Full-time</p>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <h4 className="font-semibold">About the Role</h4>
                          <p className="text-gray-700">
                            We're seeking a talented Senior Software Engineer to join our dynamic team...
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">Key Responsibilities</h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            <li>Design and develop scalable software solutions</li>
                            <li>Collaborate with cross-functional teams</li>
                            <li>Mentor junior developers and provide technical guidance</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">Requirements</h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            <li>5+ years of software development experience</li>
                            <li>Proficiency in React, Node.js, and TypeScript</li>
                            <li>Experience with cloud platforms (AWS, Azure)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Job Description Templates</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>Create Template</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Software Engineer',
                  category: 'Technology',
                  level: 'Mid-Senior',
                  usage: 245,
                  rating: 4.8
                },
                {
                  name: 'Product Manager',
                  category: 'Product',
                  level: 'Senior',
                  usage: 189,
                  rating: 4.6
                },
                {
                  name: 'Data Scientist',
                  category: 'Analytics',
                  level: 'Mid-Level',
                  usage: 156,
                  rating: 4.7
                },
                {
                  name: 'UX Designer',
                  category: 'Design',
                  level: 'Mid-Level',
                  usage: 134,
                  rating: 4.5
                },
                {
                  name: 'Sales Representative',
                  category: 'Sales',
                  level: 'Entry-Mid',
                  usage: 98,
                  rating: 4.4
                },
                {
                  name: 'DevOps Engineer',
                  category: 'Technology',
                  level: 'Senior',
                  usage: 87,
                  rating: 4.6
                }
              ].map((template, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>
                      {template.category} • {template.level}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Used {template.usage} times</span>
                        <span className="text-yellow-600">★ {template.rating}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Saved Jobs Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Job Descriptions</h2>
              <Button onClick={() => setActiveTab('generator')}>
                Create New
              </Button>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  title: 'Senior Frontend Developer',
                  company: 'TechStart Inc.',
                  status: 'Published',
                  created: '2 days ago',
                  views: 1247,
                  applications: 23
                },
                {
                  title: 'Product Marketing Manager',
                  company: 'GrowthCorp',
                  status: 'Draft',
                  created: '1 week ago',
                  views: 0,
                  applications: 0
                },
                {
                  title: 'Data Engineer',
                  company: 'DataFlow Ltd.',
                  status: 'Published',
                  created: '2 weeks ago',
                  views: 856,
                  applications: 18
                }
              ].map((job, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Created {job.created}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === 'Published' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {job.views} views • {job.applications} applications
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Duplicate</Button>
                          <Button size="sm">View Analytics</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Performance Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Active Jobs</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">3,247</div>
                    <div className="text-sm text-gray-600">Total Views</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <div className="text-sm text-gray-600">Applications</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">4.8%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Job Descriptions</CardTitle>
                <CardDescription>Jobs with highest application rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'Senior Frontend Developer', applications: 45, views: 892, rate: '5.04%' },
                    { title: 'Product Marketing Manager', applications: 38, views: 756, rate: '5.03%' },
                    { title: 'Data Engineer', applications: 32, views: 654, rate: '4.89%' },
                    { title: 'UX Designer', applications: 28, views: 623, rate: '4.49%' },
                    { title: 'DevOps Engineer', applications: 23, views: 534, rate: '4.31%' }
                  ].map((job, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-gray-600">
                          {job.applications} applications from {job.views} views
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">{job.rate}</div>
                        <div className="text-sm text-gray-600">conversion</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}