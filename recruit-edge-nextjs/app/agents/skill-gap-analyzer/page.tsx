'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Target, TrendingUp, Book, CheckCircle } from "lucide-react";

export default function SkillGapAnalyzerPage() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [currentSkill, setCurrentSkill] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Skill Gap Analyzer</h1>
              <p className="text-gray-600">Identify skill gaps and get personalized learning recommendations</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'assessment'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Assessment
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'results'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Learning Path
          </button>
        </div>

        {/* Assessment Tab */}
        {activeTab === 'assessment' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
                <CardDescription>Tell us about your current skills and desired role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="targetRole">Target Job Role</Label>
                  <Input
                    id="targetRole"
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="addSkill">Add Your Current Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      id="addSkill"
                      placeholder="e.g., React, TypeScript, Node.js"
                      value={currentSkill}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentSkill(e.target.value)}
                    />
                    <Button>Add</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Your Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'JavaScript', 'CSS', 'HTML'].map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <Button className="w-full">Analyze Skills</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Strong Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['React', 'JavaScript', 'CSS'].map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Skill Gaps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['TypeScript', 'Node.js', 'GraphQL'].map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-600" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Improvement Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['Testing', 'Performance', 'Security'].map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Learning Path</CardTitle>
                <CardDescription>Recommended courses and resources to bridge your skill gaps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { skill: 'TypeScript', priority: 'High', courses: ['TypeScript Fundamentals', 'Advanced TypeScript'] },
                    { skill: 'Node.js', priority: 'Medium', courses: ['Node.js Complete Guide', 'Express.js Mastery'] },
                    { skill: 'GraphQL', priority: 'Low', courses: ['GraphQL Basics', 'Apollo Server'] }
                  ].map((item, index) => (
                    <Card key={index} className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{item.skill}</CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.priority === 'High' ? 'bg-red-100 text-red-800' :
                            item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.priority} Priority
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {item.courses.map((course, courseIndex) => (
                            <div key={courseIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <Book className="h-4 w-4" />
                                <span>{course}</span>
                              </div>
                              <Button size="sm" variant="outline">View Course</Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
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