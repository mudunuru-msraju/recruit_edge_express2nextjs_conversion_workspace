'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Calendar, Clock, Users, Mail } from "lucide-react";

export default function InterviewSchedulerPage() {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Scheduler</h1>
              <p className="text-gray-600">Schedule and manage your interviews efficiently</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Schedule Interview
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'availability'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Availability
          </button>
        </div>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule New Interview</CardTitle>
                <CardDescription>Set up a new interview session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="candidateName">Candidate Name</Label>
                    <Input
                      id="candidateName"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="candidateEmail">Candidate Email</Label>
                    <Input
                      id="candidateEmail"
                      type="email"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Senior Frontend Developer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="interviewType">Interview Type</Label>
                    <select
                      id="interviewType"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      title="Select interview type"
                    >
                      <option value="phone">Phone Screen</option>
                      <option value="video">Video Call</option>
                      <option value="onsite">On-site</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <select
                      id="duration"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      title="Select duration"
                    >
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="interviewer">Interviewer(s)</Label>
                  <Input
                    id="interviewer"
                    placeholder="Add interviewer emails separated by commas"
                  />
                </div>
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upcoming Tab */}
        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Upcoming Interviews</h2>
              <Button onClick={() => setActiveTab('schedule')}>
                Schedule New
              </Button>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  candidate: 'Sarah Johnson',
                  position: 'Senior Frontend Developer',
                  date: 'Oct 26, 2024',
                  time: '2:00 PM',
                  type: 'Video Call',
                  interviewer: 'John Smith'
                },
                {
                  candidate: 'Mike Chen',
                  position: 'Backend Engineer',
                  date: 'Oct 27, 2024',
                  time: '10:00 AM',
                  type: 'Technical',
                  interviewer: 'Jane Doe'
                },
                {
                  candidate: 'Emily Davis',
                  position: 'Product Manager',
                  date: 'Oct 28, 2024',
                  time: '3:30 PM',
                  type: 'Phone Screen',
                  interviewer: 'Alex Brown'
                }
              ].map((interview, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {interview.candidate}
                        </h3>
                        <p className="text-gray-600 mb-2">{interview.position}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{interview.date}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{interview.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{interview.type}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{interview.interviewer}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                        <Button size="sm">
                          Join Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Set Your Availability</CardTitle>
                <CardDescription>Configure your available time slots for interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
                  ].map((day, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-24">
                        <Label className="font-medium">{day}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id={`${day}-available`} className="rounded" />
                        <Label htmlFor={`${day}-available`}>Available</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          className="w-32"
                          defaultValue="09:00"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          className="w-32"
                          defaultValue="17:00"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <Button>Save Availability</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar Integration</CardTitle>
                <CardDescription>Connect your calendar to avoid scheduling conflicts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-gray-600">Sync with your Google Calendar</p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Outlook Calendar</p>
                      <p className="text-sm text-gray-600">Sync with your Outlook Calendar</p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}