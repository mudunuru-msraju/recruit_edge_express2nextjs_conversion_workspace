'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCardIcon, 
  DollarSignIcon, 
  CalendarIcon,
  DownloadIcon,
  TrendingUpIcon,
  UsersIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from 'lucide-react';

export default function BillingManagerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'payments' | 'invoices' | 'analytics'>('overview');

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(12840)}</p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>
              <DollarSignIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-blue-600">2 new this month</p>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(3980)}</p>
                <p className="text-sm text-green-600">+8.2% growth rate</p>
              </div>
              <TrendingUpIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                <p className="text-2xl font-bold">2.1%</p>
                <p className="text-sm text-green-600">-0.5% improvement</p>
              </div>
              <AlertTriangleIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest billing and subscription activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-gray-500 py-8">
              Recent billing activities will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSubscriptionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subscriptions</h2>
        <Button>Add New Subscription</Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500 py-8">
            Subscription management interface will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment History</h2>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500 py-8">
            Payment history and processing interface will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderInvoicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <Button>Generate Invoice</Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500 py-8">
            Invoice management and generation interface will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Billing Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Average Revenue Per User</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(127.50)}</p>
              <p className="text-sm text-green-600">+5.2% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Customer Lifetime Value</p>
              <p className="text-3xl font-bold text-purple-600">{formatCurrency(2450)}</p>
              <p className="text-sm text-green-600">+12.8% improvement</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Payment Success Rate</p>
              <p className="text-3xl font-bold text-green-600">98.7%</p>
              <p className="text-sm text-green-600">+0.3% improvement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>Detailed billing and revenue insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Detailed billing analytics and charts will be implemented here
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
          <div className="flex items-center space-x-3 mb-2">
            <CreditCardIcon className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Billing Manager</h1>
          </div>
          <p className="text-gray-600">
            Manage subscriptions, payments, invoices, and track billing analytics
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: DollarSignIcon },
            { id: 'subscriptions', label: 'Subscriptions', icon: CalendarIcon },
            { id: 'payments', label: 'Payments', icon: CreditCardIcon },
            { id: 'invoices', label: 'Invoices', icon: DownloadIcon },
            { id: 'analytics', label: 'Analytics', icon: TrendingUpIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-600 shadow-sm'
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
        {activeTab === 'subscriptions' && renderSubscriptionsTab()}
        {activeTab === 'payments' && renderPaymentsTab()}
        {activeTab === 'invoices' && renderInvoicesTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
}