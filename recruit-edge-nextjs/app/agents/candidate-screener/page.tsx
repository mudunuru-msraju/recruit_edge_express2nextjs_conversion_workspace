'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Users, Search, Filter, CheckCircle, X, Upload, BarChart3 } from "lucide-react";

export default function CandidateScreenerPage() {
  const [activeTab, setActiveTab] = useState('screen');
  const [batchScreening, setBatchScreening] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Candidate Screener</h1>
              <p className="text-gray-600">Automate candidate evaluation with AI-powered screening</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('screen')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'screen'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Screen Candidates
          </button>
          <button
            onClick={() => setActiveTab('criteria')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'criteria'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Screening Criteria
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'results'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Screen Candidates Tab */}
        {activeTab === 'screen' && (
          <div className="space-y-6">
            {/* Screening Options */}
            <Card>
              <CardHeader>
                <CardTitle>Screening Options</CardTitle>
                <CardDescription>Choose how you want to screen candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="h-6 w-6 text-green-600" />
                      <h3 className="font-semibold">Single Candidate</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Screen individual candidate profiles manually or by uploading resume
                    </p>
                    <Button className="w-full">
                      <Search className="h-4 w-4 mr-2" />
                      Start Single Screening
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <Upload className="h-6 w-6 text-blue-600" />
                      <h3 className="font-semibold">Batch Upload</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload multiple resumes or CSV file for bulk screening
                    </p>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Batch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Single Candidate Form */}
            <Card>
              <CardHeader>
                <CardTitle>Candidate Information</CardTitle>
                <CardDescription>Enter candidate details for screening</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentTitle">Current Title</Label>
                    <Input id="currentTitle" placeholder="Software Engineer" />
                  </div>
                  <div>
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input id="yearsExperience" type="number" placeholder="5" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input id="skills" placeholder="React, TypeScript, Node.js, Python" />
                </div>
                
                <div>
                  <Label htmlFor="resumeText">Resume/CV Text</Label>
                  <Textarea
                    id="resumeText"
                    placeholder="Paste resume content here or upload file above..."
                    rows={6}
                  />
                </div>
                
                <div>
                  <Label htmlFor="jobPosition">Position to Screen For</Label>
                  <select
                    id="jobPosition"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    title="Select position"
                  >
                    <option value="">Select Position</option>
                    <option value="senior-frontend">Senior Frontend Developer</option>
                    <option value="backend-engineer">Backend Engineer</option>
                    <option value="fullstack-dev">Full Stack Developer</option>
                    <option value="data-scientist">Data Scientist</option>
                    <option value="product-manager">Product Manager</option>
                  </select>
                </div>
                
                <Button className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Screen Candidate
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Screening Criteria Tab */}
        {activeTab === 'criteria' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Screening Criteria Templates</h2>
              <Button>
                <Filter className="h-4 w-4 mr-2" />
                Create New Criteria
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Senior Frontend Developer',
                  skills: ['React', 'TypeScript', 'CSS'],
                  minExp: 5,
                  threshold: 75,
                  used: 23
                },
                {
                  name: 'Backend Engineer',
                  skills: ['Node.js', 'Python', 'SQL'],
                  minExp: 3,
                  threshold: 70,
                  used: 18
                },
                {
                  name: 'Data Scientist',
                  skills: ['Python', 'ML', 'Statistics'],
                  minExp: 4,
                  threshold: 80,
                  used: 12
                },
                {
                  name: 'Product Manager',
                  skills: ['Strategy', 'Analytics', 'Leadership'],
                  minExp: 6,
                  threshold: 85,
                  used: 8
                }
              ].map((criteria, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{criteria.name}</CardTitle>
                    <CardDescription>Used {criteria.used} times</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Key Skills:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {criteria.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Min Experience:</span>
                        <span>{criteria.minExp} years</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pass Threshold:</span>
                        <span>{criteria.threshold}%</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                        <Button size="sm" className="flex-1">
                          Use
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Screening Results</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">Export</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  name: 'Sarah Johnson',
                  email: 'sarah@example.com',
                  position: 'Senior Frontend Developer',
                  score: 87,
                  status: 'Passed',
                  skills: ['React', 'TypeScript', 'CSS'],
                  experience: '6 years',
                  screening: '2 hours ago'
                },
                {
                  name: 'Mike Chen',
                  email: 'mike@example.com',
                  position: 'Backend Engineer',
                  score: 92,
                  status: 'Passed',
                  skills: ['Node.js', 'Python', 'Docker'],
                  experience: '5 years',
                  screening: '4 hours ago'
                },
                {
                  name: 'Emily Davis',
                  email: 'emily@example.com',
                  position: 'Data Scientist',
                  score: 65,
                  status: 'Review Required',
                  skills: ['Python', 'SQL'],
                  experience: '3 years',
                  screening: '1 day ago'
                },
                {
                  name: 'Alex Brown',
                  email: 'alex@example.com',
                  position: 'Frontend Developer',
                  score: 45,
                  status: 'Failed',
                  skills: ['HTML', 'CSS'],
                  experience: '2 years',
                  screening: '1 day ago'
                }
              ].map((candidate, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            candidate.status === 'Passed' ? 'bg-green-100 text-green-800' :
                            candidate.status === 'Review Required' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {candidate.status === 'Passed' && <CheckCircle className="h-3 w-3" />}
                            {candidate.status === 'Failed' && <X className="h-3 w-3" />}
                            {candidate.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {candidate.email} • {candidate.position} • {candidate.experience}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {candidate.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-sm text-gray-500">Screened {candidate.screening}</p>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-gray-900 mb-1">{candidate.score}</div>
                        <div className="text-sm text-gray-600 mb-3">Overall Score</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {candidate.status !== 'Failed' && (
                            <Button size="sm">
                              Contact
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">247</div>
                    <div className="text-sm text-gray-600">Total Screened</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">68%</div>
                    <div className="text-sm text-gray-600">Pass Rate</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">78</div>
                    <div className="text-sm text-gray-600">Avg Score</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">2.3min</div>
                    <div className="text-sm text-gray-600">Avg Screen Time</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Skills in Demand</CardTitle>
                  <CardDescription>Most frequently required skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { skill: 'React', count: 45, percentage: 85 },
                      { skill: 'TypeScript', count: 38, percentage: 72 },
                      { skill: 'Node.js', count: 34, percentage: 64 },
                      { skill: 'Python', count: 29, percentage: 55 },
                      { skill: 'AWS', count: 23, percentage: 43 }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{item.skill}</div>
                          <div className="text-sm text-gray-600">{item.count} positions</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{item.percentage}%</div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Screening Performance</CardTitle>
                  <CardDescription>Success rates by position type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { position: 'Frontend Developer', screened: 67, passed: 48, rate: 72 },
                      { position: 'Backend Engineer', screened: 54, passed: 39, rate: 72 },
                      { position: 'Data Scientist', screened: 34, passed: 21, rate: 62 },
                      { position: 'Product Manager', screened: 28, passed: 19, rate: 68 },
                      { position: 'DevOps Engineer', screened: 22, passed: 16, rate: 73 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.position}</span>
                          <span className="text-sm text-gray-600">{item.rate}% pass rate</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{item.passed} passed</span>
                          <span>{item.screened} total</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${item.rate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}