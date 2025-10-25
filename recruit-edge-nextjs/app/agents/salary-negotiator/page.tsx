'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { DollarSign, TrendingUp, Target, FileText, BarChart3 } from "lucide-react";

export default function SalaryNegotiatorPage() {
  const [activeTab, setActiveTab] = useState('research');
  const [researchData, setResearchData] = useState({
    jobTitle: '',
    location: '',
    experienceYears: 0,
    industry: '',
    companySize: 'medium',
    currentSalary: '',
    targetSalary: ''
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Salary Negotiator</h1>
              <p className="text-gray-600">Get market insights and develop winning negotiation strategies</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('research')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'research'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Market Research
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Salary Analysis
          </button>
          <button
            onClick={() => setActiveTab('negotiation')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'negotiation'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Negotiation Strategy
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'offers'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Offer Analysis
          </button>
        </div>

        {/* Market Research Tab */}
        {activeTab === 'research' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Information</CardTitle>
                  <CardDescription>Tell us about the position you're researching</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        placeholder="e.g., Senior Software Engineer"
                        value={researchData.jobTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResearchData(prev => ({
                          ...prev,
                          jobTitle: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., San Francisco, CA"
                        value={researchData.location}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResearchData(prev => ({
                          ...prev,
                          location: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <select
                        id="industry"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        title="Select industry"
                        value={researchData.industry}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setResearchData(prev => ({
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
                        <option value="government">Government</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="experienceYears">Years of Experience</Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        min="0"
                        max="50"
                        placeholder="5"
                        value={researchData.experienceYears}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResearchData(prev => ({
                          ...prev,
                          experienceYears: parseInt(e.target.value) || 0
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="companySize">Company Size</Label>
                    <select
                      id="companySize"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      title="Select company size"
                      value={researchData.companySize}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setResearchData(prev => ({
                        ...prev,
                        companySize: e.target.value
                      }))}
                    >
                      <option value="startup">Startup (1-50 employees)</option>
                      <option value="small">Small (51-200 employees)</option>
                      <option value="medium">Medium (201-1000 employees)</option>
                      <option value="large">Large (1001-5000 employees)</option>
                      <option value="enterprise">Enterprise (5000+ employees)</option>
                    </select>
                  </div>
                  <Button className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Research Market Data
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Market Insights</CardTitle>
                  <CardDescription>Salary data and market trends for your role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">Enter job details to see market salary data</p>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">$--k</div>
                        <div className="text-sm text-gray-600">25th Percentile</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">$--k</div>
                        <div className="text-sm text-gray-600">Median</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">$--k</div>
                        <div className="text-sm text-gray-600">75th Percentile</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Salary Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-emerald-600">Market Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">75th</div>
                    <div className="text-sm text-gray-600">Percentile</div>
                    <div className="mt-2">
                      <TrendingUp className="h-5 w-5 mx-auto text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Negotiation Power</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">Strong</div>
                    <div className="text-sm text-gray-600">Position</div>
                    <div className="mt-2">
                      <Target className="h-5 w-5 mx-auto text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-purple-600">Recommended Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">$120k - $140k</div>
                    <div className="text-sm text-gray-600">Total Compensation</div>
                    <div className="mt-2">
                      <DollarSign className="h-5 w-5 mx-auto text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Compensation Breakdown</CardTitle>
                <CardDescription>Detailed analysis of your compensation package</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { component: 'Base Salary', current: '$100k', market: '$110k', recommendation: '$115k' },
                    { component: 'Bonus', current: '$10k', market: '$15k', recommendation: '$15k' },
                    { component: 'Equity', current: '$0', market: '$20k', recommendation: '$15k' },
                    { component: 'Benefits', current: '$8k', market: '$12k', recommendation: '$12k' }
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 items-center py-2 border-b">
                      <div className="font-medium">{item.component}</div>
                      <div className="text-center text-gray-600">{item.current}</div>
                      <div className="text-center text-blue-600">{item.market}</div>
                      <div className="text-center text-emerald-600 font-semibold">{item.recommendation}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Negotiation Strategy Tab */}
        {activeTab === 'negotiation' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Negotiation Strategy Builder</CardTitle>
                <CardDescription>Develop a customized approach for your salary negotiation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerAmount">Current Offer Amount</Label>
                    <Input
                      id="offerAmount"
                      type="number"
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetAmount">Your Target Amount</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      placeholder="120000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="strategyType">Negotiation Approach</Label>
                  <select
                    id="strategyType"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    title="Select negotiation strategy"
                  >
                    <option value="collaborative">Collaborative - Win-win approach</option>
                    <option value="competitive">Competitive - Strong position</option>
                    <option value="value-based">Value-based - Focus on contributions</option>
                    <option value="market-based">Market-based - Industry standards</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="valueProposition">Your Value Proposition</Label>
                  <Textarea
                    id="valueProposition"
                    placeholder="Describe your unique value, achievements, and contributions..."
                    rows={4}
                  />
                </div>
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Negotiation Script
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Negotiation Script</CardTitle>
                <CardDescription>AI-generated talking points for your negotiation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Opening Statement</h4>
                    <p className="text-emerald-800 text-sm">
                      "Thank you for the offer. I'm excited about the opportunity to contribute to [Company]. 
                      Based on my research and the value I bring, I'd like to discuss the compensation package."
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Value Proposition</h4>
                    <p className="text-blue-800 text-sm">
                      "In my previous role, I [specific achievement]. I bring [unique skills] that align perfectly 
                      with your needs for [role requirements]."
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Salary Request</h4>
                    <p className="text-purple-800 text-sm">
                      "Based on market research and my experience, I was hoping we could discuss a salary 
                      in the range of [target range]. This aligns with industry standards for similar roles."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Offer Analysis Tab */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Offer Comparison</CardTitle>
                <CardDescription>Compare multiple job offers side by side</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Component</th>
                        <th className="text-center py-2">Offer A</th>
                        <th className="text-center py-2">Offer B</th>
                        <th className="text-center py-2">Market Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { component: 'Base Salary', offerA: '$110k', offerB: '$105k', market: '$112k' },
                        { component: 'Bonus', offerA: '$15k', offerB: '$12k', market: '$14k' },
                        { component: 'Equity', offerA: '$20k', offerB: '$25k', market: '$18k' },
                        { component: 'Benefits', offerA: '$12k', offerB: '$10k', market: '$11k' },
                        { component: 'PTO Days', offerA: '25', offerB: '20', market: '22' },
                        { component: 'Remote Work', offerA: 'Yes', offerB: 'Hybrid', market: 'Varies' }
                      ].map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 font-medium">{row.component}</td>
                          <td className="text-center py-2">{row.offerA}</td>
                          <td className="text-center py-2">{row.offerB}</td>
                          <td className="text-center py-2 text-gray-600">{row.market}</td>
                        </tr>
                      ))}
                      <tr className="border-b-2 border-gray-300 font-semibold">
                        <td className="py-2">Total Value</td>
                        <td className="text-center py-2 text-emerald-600">$157k</td>
                        <td className="text-center py-2 text-blue-600">$152k</td>
                        <td className="text-center py-2 text-gray-600">$155k</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Recommendation</h4>
                  <p className="text-yellow-800 text-sm">
                    Offer A provides better total compensation and aligns closer to market rates. 
                    Consider negotiating remote work flexibility with Offer A for optimal package.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}