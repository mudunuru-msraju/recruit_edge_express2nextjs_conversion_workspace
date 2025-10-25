'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUpIcon, 
  BarChartIcon, 
  UsersIcon,
  ClockIcon,
  DollarSignIcon,
  EyeIcon,
  FileTextIcon,
  UserCheckIcon,
  FilterIcon
} from 'lucide-react';

export default function JobAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'funnel' | 'sources' | 'insights'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold">{formatNumber(201)}</p>
                <p className="text-sm text-green-600">+15.3% from last period</p>
              </div>
              <FileTextIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hires</p>
                <p className="text-2xl font-bold">{formatNumber(3)}</p>
                <p className="text-sm text-blue-600">2 in progress</p>
              </div>
              <UserCheckIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Time to Fill</p>
                <p className="text-2xl font-bold">21</p>
                <p className="text-sm text-yellow-600">days</p>
              </div>
              <ClockIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Cost per Hire</p>
                <p className="text-2xl font-bold">{formatCurrency(3000)}</p>
                <p className="text-sm text-red-600">+5.2% from target</p>
              </div>
              <DollarSignIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Performance Overview</CardTitle>
          <CardDescription>Summary of recent job posting performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: 'Senior Software Engineer', applications: 89, views: 1247, status: 'active' },
              { title: 'Product Manager', applications: 67, views: 892, status: 'closed' },
              { title: 'UX Designer', applications: 45, views: 654, status: 'active' }
            ].map((job, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{job.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Views: {formatNumber(job.views)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Applications: {formatNumber(job.applications)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Performance</h2>
        <Button variant="outline" size="sm">
          <FilterIcon className="h-4 w-4 mr-1" />
          Filter
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500 py-8">
            Detailed job performance metrics and analytics will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderFunnelTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hiring Funnel Analysis</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Funnel</CardTitle>
          <CardDescription>Candidate progression through hiring stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { stage: 'Applications', count: 201, percentage: 100 },
              { stage: 'Screening', count: 80, percentage: 40 },
              { stage: 'Interview', count: 26, percentage: 13 },
              { stage: 'Offer', count: 8, percentage: 4 },
              { stage: 'Hired', count: 3, percentage: 1.5 }
            ].map((stage, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{stage.stage}</h3>
                    <span className="font-bold">{stage.count} ({stage.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`bg-amber-500 h-3 rounded-full ${stage.percentage === 100 ? 'w-full' : stage.percentage >= 50 ? 'w-1/2' : stage.percentage >= 25 ? 'w-1/4' : stage.percentage >= 10 ? 'w-1/12' : 'w-1'}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSourcesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Source Attribution</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Source Performance</CardTitle>
          <CardDescription>Performance by recruitment source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { source: 'LinkedIn', applications: 89, hires: 2, cost: 4500 },
              { source: 'Indeed', applications: 67, hires: 1, cost: 1200 },
              { source: 'Company Website', applications: 45, hires: 0, cost: 0 },
              { source: 'Referrals', applications: 23, hires: 1, cost: 500 }
            ].map((source, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{source.source}</h3>
                  <span className="text-sm text-gray-500">
                    {((source.hires / source.applications) * 100).toFixed(1)}% conversion
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Applications: {source.applications}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Hires: {source.hires}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cost: {formatCurrency(source.cost)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recruitment Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>Data-driven recruitment insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                'Referrals have the highest conversion rate at 4.3%',
                'Technical interviews take the longest (8 days average)',
                'Job descriptions with salary ranges get 23% more applications',
                'Remote positions attract 40% more candidates'
              ].map((insight, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Suggested improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Expand Referral Program', priority: 'High' },
                { title: 'Optimize Job Descriptions', priority: 'Medium' },
                { title: 'Streamline Interview Process', priority: 'High' },
                { title: 'Increase Remote Opportunities', priority: 'Medium' }
              ].map((rec, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{rec.title}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUpIcon className="h-8 w-8 text-amber-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Analytics</h1>
                <p className="text-gray-600">
                  Track job performance, analyze hiring funnels, and optimize recruitment ROI
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
                title="Select time period"
                aria-label="Select time period for analytics"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChartIcon },
            { id: 'performance', label: 'Job Performance', icon: TrendingUpIcon },
            { id: 'funnel', label: 'Hiring Funnel', icon: UsersIcon },
            { id: 'sources', label: 'Source Attribution', icon: EyeIcon },
            { id: 'insights', label: 'Insights', icon: FileTextIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
        {activeTab === 'funnel' && renderFunnelTab()}
        {activeTab === 'sources' && renderSourcesTab()}
        {activeTab === 'insights' && renderInsightsTab()}
      </div>
    </div>
  );
}