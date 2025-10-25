'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { MessageSquare, Play, RotateCcw, CheckCircle } from "lucide-react";

export default function InterviewPrepPage() {
  const [activeTab, setActiveTab] = useState('practice');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');

  const questions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this position?",
    "What are your greatest strengths?",
    "Describe a challenging project you've worked on.",
    "Where do you see yourself in 5 years?"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Prep</h1>
              <p className="text-gray-600">Practice and improve your interview skills</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'practice'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Practice Session
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'sessions'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Past Sessions
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tips'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Interview Tips
          </button>
        </div>

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            {/* Session Setup */}
            <Card>
              <CardHeader>
                <CardTitle>Interview Practice Session</CardTitle>
                <CardDescription>Set up your practice session parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="interviewType">Interview Type</Label>
                    <select
                      id="interviewType"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      title="Select interview type"
                    >
                      <option value="behavioral">Behavioral</option>
                      <option value="technical">Technical</option>
                      <option value="coding">Coding</option>
                      <option value="system-design">System Design</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="jobRole">Job Role</Label>
                    <Input
                      id="jobRole"
                      placeholder="e.g., Frontend Developer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <select
                      id="difficulty"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      title="Select difficulty level"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Practice Session
                </Button>
              </CardContent>
            </Card>

            {/* Question Practice */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
                  <CardDescription>Take your time to think and provide a thoughtful answer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <p className="text-lg font-medium text-indigo-900">
                        {questions[currentQuestion]}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                        disabled={currentQuestion === questions.length - 1}
                      >
                        Next Question
                      </Button>
                      <Button variant="outline">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        New Question
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Answer</CardTitle>
                  <CardDescription>Record or type your response</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your answer here..."
                      rows={8}
                      value={answer}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button className="flex-1">Record Audio</Button>
                      <Button variant="outline" className="flex-1">Save Answer</Button>
                    </div>
                    <Button className="w-full">
                      Get AI Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Practice History</CardTitle>
                <CardDescription>Review your past interview practice sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '2024-01-15', type: 'Behavioral', score: 85, questions: 5 },
                    { date: '2024-01-10', type: 'Technical', score: 78, questions: 8 },
                    { date: '2024-01-05', type: 'Coding', score: 92, questions: 3 }
                  ].map((session, index) => (
                    <Card key={index} className="border-l-4 border-l-indigo-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{session.type} Interview</h3>
                            <p className="text-sm text-gray-600">
                              {session.date} • {session.questions} questions
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                              session.score >= 90 ? 'bg-green-100 text-green-800' :
                              session.score >= 80 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {session.score}% Score
                            </div>
                            <Button variant="outline" size="sm" className="mt-2">
                              Review
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Before the Interview',
                tips: [
                  'Research the company and role thoroughly',
                  'Prepare specific examples using the STAR method',
                  'Practice common behavioral questions',
                  'Prepare thoughtful questions to ask the interviewer'
                ]
              },
              {
                title: 'During the Interview',
                tips: [
                  'Maintain good eye contact and body language',
                  'Listen carefully to questions before answering',
                  'Be specific and provide concrete examples',
                  'Ask clarifying questions if needed'
                ]
              },
              {
                title: 'Technical Interviews',
                tips: [
                  'Think out loud when solving problems',
                  'Ask about constraints and edge cases',
                  'Start with a simple solution, then optimize',
                  'Test your solution with examples'
                ]
              },
              {
                title: 'After the Interview',
                tips: [
                  'Send a thank-you email within 24 hours',
                  'Reflect on what went well and areas for improvement',
                  'Follow up appropriately if you don\'t hear back',
                  'Continue practicing for future opportunities'
                ]
              }
            ].map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}