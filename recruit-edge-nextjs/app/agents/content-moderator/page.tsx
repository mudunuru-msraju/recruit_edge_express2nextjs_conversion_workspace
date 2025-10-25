'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Eye, Settings, Flag } from "lucide-react";

export default function ContentModeratorPage() {
  const [activeTab, setActiveTab] = useState('review');
  const [contentToReview, setContentToReview] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Moderator</h1>
              <p className="text-gray-600">Ensure content compliance and maintain platform standards</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'review'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Content Review
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'queue'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Review Queue
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rules'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Moderation Rules
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Content Review Tab */}
        {activeTab === 'review' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Content for Review</CardTitle>
                  <CardDescription>Analyze content for policy compliance and potential issues</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contentType">Content Type</Label>
                    <select
                      id="contentType"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      title="Select content type"
                    >
                      <option value="job_posting">Job Posting</option>
                      <option value="email">Email</option>
                      <option value="message">Message</option>
                      <option value="profile">Profile</option>
                      <option value="comment">Comment</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="content">Content to Review</Label>
                    <Textarea
                      id="content"
                      placeholder="Paste the content you want to review for compliance..."
                      rows={8}
                      value={contentToReview}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContentToReview(e.target.value)}
                    />
                  </div>
                  <Button className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Analyze Content
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Moderation Report</CardTitle>
                  <CardDescription>AI-powered content analysis results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Overall Score */}
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">85/100</div>
                      <div className="text-sm text-gray-600">Compliance Score</div>
                      <div className="mt-2">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Approved
                        </span>
                      </div>
                    </div>

                    {/* Issues Found */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Issues Detected</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm">Minor: Consider more inclusive language</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">No discriminatory content found</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Legal compliance verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Recommendations</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Replace "guys" with "team" or "everyone"</li>
                        <li>• Add accessibility requirements</li>
                        <li>• Consider mentioning flexible work options</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Review Queue Tab */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Pending Reviews</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">Sort</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  id: '1',
                  type: 'Job Posting',
                  title: 'Senior Developer Position',
                  author: 'John Smith',
                  submitted: '2 hours ago',
                  priority: 'High',
                  flags: ['Potential bias', 'Salary missing']
                },
                {
                  id: '2',
                  type: 'Email',
                  title: 'Candidate follow-up message',
                  author: 'Sarah Johnson',
                  submitted: '4 hours ago',
                  priority: 'Medium',
                  flags: ['Language check needed']
                },
                {
                  id: '3',
                  type: 'Profile',
                  title: 'Recruiter profile update',
                  author: 'Mike Chen',
                  submitted: '1 day ago',
                  priority: 'Low',
                  flags: []
                }
              ].map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-600">{item.type}</span>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            item.priority === 'High' ? 'bg-red-100 text-red-800' :
                            item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.priority} Priority
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          By {item.author} • {item.submitted}
                        </p>
                        {item.flags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.flags.map((flag, flagIndex) => (
                              <span
                                key={flagIndex}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                              >
                                <Flag className="h-3 w-3" />
                                {flag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Moderation Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Moderation Rules</h2>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Add New Rule
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Discriminatory Language',
                  description: 'Detect and flag discriminatory or biased language',
                  type: 'AI Model',
                  severity: 'High',
                  active: true,
                  triggers: 157
                },
                {
                  name: 'Salary Transparency',
                  description: 'Ensure job postings include salary ranges',
                  type: 'Policy',
                  severity: 'Medium',
                  active: true,
                  triggers: 23
                },
                {
                  name: 'Contact Information',
                  description: 'Flag inappropriate sharing of personal contact info',
                  type: 'Pattern',
                  severity: 'Medium',
                  active: true,
                  triggers: 8
                },
                {
                  name: 'Spam Content',
                  description: 'Detect spam or promotional content',
                  type: 'Keyword',
                  severity: 'Low',
                  active: false,
                  triggers: 3
                }
              ].map((rule, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <CardDescription>{rule.description}</CardDescription>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        rule.active ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span>{rule.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Severity:</span>
                        <span className={`font-medium ${
                          rule.severity === 'High' ? 'text-red-600' :
                          rule.severity === 'Medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {rule.severity}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Triggers (30d):</span>
                        <span>{rule.triggers}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        {rule.active ? 'Disable' : 'Enable'}
                      </Button>
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
                    <div className="text-2xl font-bold text-gray-900">1,247</div>
                    <div className="text-sm text-gray-600">Total Reviews</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <div className="text-sm text-gray-600">Approval Rate</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">23</div>
                    <div className="text-sm text-gray-600">Pending Reviews</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">12</div>
                    <div className="text-sm text-gray-600">Violations Found</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Common Violations</CardTitle>
                <CardDescription>Most frequent content issues detected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { violation: 'Missing salary information', count: 45, trend: '+12%' },
                    { violation: 'Non-inclusive language', count: 23, trend: '-5%' },
                    { violation: 'Excessive requirements', count: 18, trend: '+8%' },
                    { violation: 'Contact info sharing', count: 12, trend: '-15%' },
                    { violation: 'Discriminatory content', count: 8, trend: '-25%' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{item.violation}</div>
                        <div className="text-sm text-gray-600">{item.count} occurrences</div>
                      </div>
                      <div className={`text-sm font-medium ${
                        item.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {item.trend}
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