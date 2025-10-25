'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Search, MapPin, DollarSign, Clock, Building } from "lucide-react";

export default function JobMatcherPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Search className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Matcher</h1>
              <p className="text-gray-600">Find jobs that match your skills and preferences</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Job Search
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'matches'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Matches
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Form */}
            <Card>
              <CardHeader>
                <CardTitle>Find Your Next Job</CardTitle>
                <CardDescription>Search for jobs that match your skills and interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="search">Job Title or Keywords</Label>
                    <Input
                      id="search"
                      placeholder="e.g., Software Engineer, Frontend Developer"
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA"
                      value={location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                <Button className="mt-4 w-full md:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Search Jobs
                </Button>
              </CardContent>
            </Card>

            {/* Job Results */}
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  title: 'Senior Frontend Developer',
                  company: 'TechCorp Inc.',
                  location: 'San Francisco, CA',
                  salary: '$120k - $150k',
                  type: 'Full-time',
                  match: 95,
                  skills: ['React', 'TypeScript', 'Next.js']
                },
                {
                  title: 'Full Stack Engineer',
                  company: 'StartupXYZ',
                  location: 'Remote',
                  salary: '$100k - $130k',
                  type: 'Full-time',
                  match: 88,
                  skills: ['Node.js', 'React', 'PostgreSQL']
                },
                {
                  title: 'Software Engineer',
                  company: 'BigTech Corp',
                  location: 'Seattle, WA',
                  salary: '$130k - $170k',
                  type: 'Full-time',
                  match: 82,
                  skills: ['Python', 'AWS', 'Docker']
                }
              ].map((job, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Building className="h-4 w-4 mr-1" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          job.match >= 90 ? 'bg-green-100 text-green-800' :
                          job.match >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.match}% Match
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{job.type}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">View Details</Button>
                      <Button variant="outline" className="flex-1">Save Job</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Job Matches</CardTitle>
                <CardDescription>Jobs that match your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No saved matches yet. Start searching to find your perfect job!</p>
                  <Button className="mt-4" onClick={() => setActiveTab('search')}>
                    Start Searching
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Preferences</CardTitle>
                <CardDescription>Set your preferences to get better job matches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferred-location">Preferred Location</Label>
                    <Input id="preferred-location" placeholder="e.g., San Francisco, CA" />
                  </div>
                  <div>
                    <Label htmlFor="salary-range">Salary Range</Label>
                    <Input id="salary-range" placeholder="e.g., $100k - $150k" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="job-type">Job Type</Label>
                    <Input id="job-type" placeholder="e.g., Full-time, Contract" />
                  </div>
                  <div>
                    <Label htmlFor="experience-level">Experience Level</Label>
                    <Input id="experience-level" placeholder="e.g., Senior, Mid-level" />
                  </div>
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}