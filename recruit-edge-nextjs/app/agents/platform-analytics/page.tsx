'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChartIcon, 
  TrendingUpIcon, 
  UsersIcon,
  ActivityIcon,
  DollarSignIcon,
  EyeIcon,
  MousePointerClickIcon,
  ClockIcon,
  DownloadIcon,
  FilterIcon
} from 'lucide-react';

export default function PlatformAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'usage' | 'revenue' | 'performance'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{formatNumber(12847)}</p>
                <p className="text-sm text-green-600">+15.2% from last month</p>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold">{formatNumber(3241)}</p>
                <p className="text-sm text-blue-600">+8.7% from yesterday</p>
              </div>
              <ActivityIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(48500)}</p>
                <p className="text-sm text-green-600">+12.4% growth</p>
              </div>
              <DollarSignIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{formatPercentage(3.2)}</p>
                <p className="text-sm text-green-600">+0.5% improvement</p>
              </div>
              <TrendingUpIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Features</CardTitle>
            <CardDescription>Most used platform features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { feature: 'Resume Builder', usage: 89, trend: '+12%' },
                { feature: 'Job Matching', usage: 76, trend: '+8%' },
                { feature: 'Interview Prep', usage: 54, trend: '+15%' },
                { feature: 'Candidate Screening', usage: 43, trend: '+6%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{item.feature}</h3>
                    <p className="text-sm text-gray-600">{item.usage}% utilization</p>
                  </div>
                  <span className="text-sm text-green-600 font-medium">{item.trend}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Recent platform engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: 'Page Views', value: '847K', change: '+18%' },
                { metric: 'Unique Visitors', value: '12.8K', change: '+15%' },
                { metric: 'Avg Session Duration', value: '8m 32s', change: '+2%' },
                { metric: 'Bounce Rate', value: '24.3%', change: '-5%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{item.metric}</h3>
                    <p className="text-sm text-gray-600">{item.value}</p>
                  </div>
                  <span className={`text-sm font-medium ${
                    item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Analytics</h2>
        <Button variant="outline" size="sm">
          <DownloadIcon className="h-4 w-4 mr-1" />
          Export Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">New Users</p>
              <p className="text-3xl font-bold text-blue-600">{formatNumber(1247)}</p>
              <p className="text-sm text-green-600">+22% this month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Returning Users</p>
              <p className="text-3xl font-bold text-purple-600">{formatNumber(8543)}</p>
              <p className="text-sm text-blue-600">67% of total</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">User Retention</p>
              <p className="text-3xl font-bold text-green-600">{formatPercentage(78.5)}</p>
              <p className="text-sm text-green-600">+3.2% improvement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Demographics</CardTitle>
          <CardDescription>Breakdown of user characteristics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            User demographic charts and analytics will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsageTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Usage Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Calls</p>
                <p className="text-2xl font-bold">{formatNumber(542000)}</p>
                <p className="text-sm text-blue-600">+8% this week</p>
              </div>
              <ActivityIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">1.2TB</p>
                <p className="text-sm text-yellow-600">73% of capacity</p>
              </div>
              <EyeIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Features</p>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-green-600">All operational</p>
              </div>
              <MousePointerClickIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold">{formatPercentage(99.9)}</p>
                <p className="text-sm text-green-600">Excellent</p>
              </div>
              <ClockIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Usage Trends</CardTitle>
          <CardDescription>Platform feature adoption over time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Feature usage trend charts will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderRevenueTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Revenue Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(485000)}</p>
              <p className="text-sm text-green-600">+18% YoY growth</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(127)}</p>
              <p className="text-sm text-blue-600">+5% improvement</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Revenue per User</p>
              <p className="text-3xl font-bold text-purple-600">{formatCurrency(38)}</p>
              <p className="text-sm text-green-600">+12% increase</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Revenue sources and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Revenue analytics and breakdown charts will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-3xl font-bold text-green-600">142ms</p>
              <p className="text-sm text-green-600">Excellent</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Error Rate</p>
              <p className="text-3xl font-bold text-blue-600">{formatPercentage(0.1)}</p>
              <p className="text-sm text-green-600">Very Low</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Throughput</p>
              <p className="text-3xl font-bold text-purple-600">1.2K</p>
              <p className="text-sm text-blue-600">req/min</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">CPU Usage</p>
              <p className="text-3xl font-bold text-orange-600">{formatPercentage(45)}</p>
              <p className="text-sm text-green-600">Normal</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Real-time performance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            System performance charts and health indicators will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChartIcon className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
                <p className="text-gray-600">
                  Comprehensive analytics dashboard with usage statistics and performance insights
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
              <Button variant="outline" size="sm">
                <FilterIcon className="h-4 w-4 mr-1" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChartIcon },
            { id: 'users', label: 'Users', icon: UsersIcon },
            { id: 'usage', label: 'Usage', icon: ActivityIcon },
            { id: 'revenue', label: 'Revenue', icon: DollarSignIcon },
            { id: 'performance', label: 'Performance', icon: TrendingUpIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
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
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'usage' && renderUsageTab()}
        {activeTab === 'revenue' && renderRevenueTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
      </div>
    </div>
  );
}