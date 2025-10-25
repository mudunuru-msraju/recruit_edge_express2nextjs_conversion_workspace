'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { TrendingUp, Users, Mail, Calendar, Plus, Search } from "lucide-react";

export default function TalentPipelinePage() {
  const [activeTab, setActiveTab] = useState('pipeline');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Talent Pipeline</h1>
              <p className="text-gray-600">Manage candidate relationships and track recruitment progress</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pipeline View
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'candidates'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Candidates
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'jobs'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Jobs
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Pipeline View Tab */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { stage: 'Sourced', count: 45, color: 'blue' },
                { stage: 'Contacted', count: 23, color: 'yellow' },
                { stage: 'Screening', count: 12, color: 'purple' },
                { stage: 'Interview', count: 8, color: 'orange' },
                { stage: 'Offer', count: 3, color: 'green' }
              ].map((stage, index) => (
                <Card key={index} className="border-t-4 border-t-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stage.stage}</CardTitle>
                    <div className="text-2xl font-bold">{stage.count}</div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {/* Sample candidates in each stage */}
                      {index === 0 && (
                        <div className="space-y-1">
                          <div className="text-xs p-2 bg-gray-50 rounded">Sarah Johnson</div>
                          <div className="text-xs p-2 bg-gray-50 rounded">Mike Chen</div>
                          <div className="text-xs p-2 bg-gray-50 rounded">Emily Davis</div>
                        </div>
                      )}
                      <Button size="sm" variant="outline" className="w-full">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Candidate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest pipeline movements and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      action: 'moved to Interview stage',
                      candidate: 'Sarah Johnson',
                      job: 'Senior Frontend Developer',
                      time: '2 hours ago'
                    },
                    {
                      action: 'added to Sourced stage',
                      candidate: 'Alex Brown',
                      job: 'Backend Engineer',
                      time: '4 hours ago'
                    },
                    {
                      action: 'received offer acceptance',
                      candidate: 'Mike Chen',
                      job: 'Full Stack Developer',
                      time: '1 day ago'
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.candidate}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-600">{activity.job}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Candidates</h2>
              <div className="flex gap-2">
                <Input placeholder="Search candidates..." className="w-64" />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'Sarah Johnson',
                  title: 'Senior Frontend Developer',
                  location: 'San Francisco, CA',
                  stage: 'Interview',
                  lastContact: '2 days ago',
                  skills: ['React', 'TypeScript', 'CSS']
                },
                {
                  name: 'Mike Chen',
                  title: 'Backend Engineer',
                  location: 'Seattle, WA',
                  stage: 'Offer',
                  lastContact: '1 day ago',
                  skills: ['Node.js', 'Python', 'AWS']
                },
                {
                  name: 'Emily Davis',
                  title: 'Product Manager',
                  location: 'New York, NY',
                  stage: 'Screening',
                  lastContact: '3 days ago',
                  skills: ['Strategy', 'Analytics', 'Leadership']
                }
              ].map((candidate, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <CardDescription>
                      {candidate.title} • {candidate.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Stage:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          candidate.stage === 'Offer' ? 'bg-green-100 text-green-800' :
                          candidate.stage === 'Interview' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {candidate.stage}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">Last contact: {candidate.lastContact}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" className="flex-1">View Profile</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Active Job Positions</h2>
            
            <div className="space-y-4">
              {[
                {
                  title: 'Senior Frontend Developer',
                  department: 'Engineering',
                  candidates: 23,
                  stage_breakdown: { sourced: 12, contacted: 6, screening: 3, interview: 2 },
                  posted: '2 weeks ago'
                },
                {
                  title: 'Product Manager',
                  department: 'Product',
                  candidates: 18,
                  stage_breakdown: { sourced: 8, contacted: 5, screening: 3, interview: 2 },
                  posted: '1 week ago'
                },
                {
                  title: 'Data Scientist',
                  department: 'Analytics',
                  candidates: 15,
                  stage_breakdown: { sourced: 7, contacted: 4, screening: 2, interview: 2 },
                  posted: '3 days ago'
                }
              ].map((job, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-gray-600">{job.department} • Posted {job.posted}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{job.candidates}</div>
                        <div className="text-sm text-gray-600">candidates</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {Object.entries(job.stage_breakdown).map(([stage, count]) => (
                        <div key={stage} className="text-center">
                          <div className="text-lg font-semibold">{count as number}</div>
                          <div className="text-xs text-gray-600 capitalize">{stage}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Pipeline</Button>
                      <Button size="sm" variant="outline">Add Candidate</Button>
                      <Button size="sm">Manage Job</Button>
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
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <div className="text-sm text-gray-600">Total Candidates</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <div className="text-sm text-gray-600">Active Jobs</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">68%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">18</div>
                    <div className="text-sm text-gray-600">Days Avg. Hire</div>
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