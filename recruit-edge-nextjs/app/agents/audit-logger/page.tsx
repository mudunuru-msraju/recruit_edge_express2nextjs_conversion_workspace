'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheckIcon, 
  AlertTriangleIcon, 
  ClockIcon,
  EyeIcon,
  FileTextIcon,
  UserIcon,
  LockIcon,
  DatabaseIcon,
  DownloadIcon,
  FilterIcon,
  SearchIcon
} from 'lucide-react';

export default function AuditLoggerPage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'events' | 'compliance' | 'reports' | 'settings'>('logs');
  const [selectedPeriod, setSelectedPeriod] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const renderLogsTab = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <FilterIcon className="h-4 w-4 mr-1" />
            Filters
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <DownloadIcon className="h-4 w-4 mr-1" />
          Export Logs
        </Button>
      </div>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Logs</CardTitle>
          <CardDescription>Latest system activities and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 'log-001',
                timestamp: new Date(Date.now() - 5 * 60 * 1000),
                action: 'User Login',
                user: 'john.doe@company.com',
                resource: 'Authentication System',
                severity: 'low',
                status: 'Success',
                ip: '192.168.1.100'
              },
              {
                id: 'log-002',
                timestamp: new Date(Date.now() - 15 * 60 * 1000),
                action: 'Data Export',
                user: 'admin@company.com',
                resource: 'Candidate Database',
                severity: 'medium',
                status: 'Success',
                ip: '192.168.1.101'
              },
              {
                id: 'log-003',
                timestamp: new Date(Date.now() - 30 * 60 * 1000),
                action: 'Failed Login Attempt',
                user: 'unknown@suspicious.com',
                resource: 'Authentication System',
                severity: 'high',
                status: 'Failed',
                ip: '203.0.113.1'
              },
              {
                id: 'log-004',
                timestamp: new Date(Date.now() - 45 * 60 * 1000),
                action: 'Permission Change',
                user: 'admin@company.com',
                resource: 'User Management',
                severity: 'medium',
                status: 'Success',
                ip: '192.168.1.101'
              },
              {
                id: 'log-005',
                timestamp: new Date(Date.now() - 60 * 60 * 1000),
                action: 'Data Access',
                user: 'recruiter@company.com',
                resource: 'Job Analytics',
                severity: 'low',
                status: 'Success',
                ip: '192.168.1.102'
              }
            ].map((log) => (
              <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Badge variant={getSeverityColor(log.severity) as any}>
                      {log.severity.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{log.action}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      log.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-3 w-3" />
                    <span>{log.user}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DatabaseIcon className="h-3 w-3" />
                    <span>{log.resource}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="h-3 w-3" />
                    <span>{log.ip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Security Events</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Alerts</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-yellow-600">3 require attention</p>
              </div>
              <AlertTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Logins</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-red-600">Last 24 hours</p>
              </div>
              <LockIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Exports</p>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-blue-600">This week</p>
              </div>
              <DatabaseIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Events</p>
                <p className="text-2xl font-bold">234</p>
                <p className="text-sm text-green-600">All normal</p>
              </div>
              <ClockIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Critical Events</CardTitle>
          <CardDescription>High-priority security events requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: 'Multiple Failed Logins',
                description: 'Repeated failed login attempts from suspicious IP',
                severity: 'critical',
                timestamp: new Date(Date.now() - 30 * 60 * 1000),
                ip: '203.0.113.1'
              },
              {
                type: 'Privilege Escalation',
                description: 'User attempted to access admin-only resources',
                severity: 'high',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                ip: '192.168.1.150'
              },
              {
                type: 'Unusual Data Access',
                description: 'Large volume data export outside business hours',
                severity: 'medium',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                ip: '192.168.1.201'
              }
            ].map((event, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getSeverityColor(event.severity) as any}>
                      {event.severity.toUpperCase()}
                    </Badge>
                    <h3 className="font-medium">{event.type}</h3>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>IP: {event.ip}</span>
                  <Button size="sm" variant="outline">
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplianceTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Compliance Monitoring</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-3xl font-bold text-green-600">98%</p>
              <p className="text-sm text-green-600">Excellent</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Policy Violations</p>
              <p className="text-3xl font-bold text-yellow-600">2</p>
              <p className="text-sm text-yellow-600">Minor issues</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Audit Readiness</p>
              <p className="text-3xl font-bold text-blue-600">Ready</p>
              <p className="text-sm text-blue-600">All systems go</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Requirements</CardTitle>
          <CardDescription>Current status of regulatory compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { requirement: 'GDPR Data Protection', status: 'Compliant', score: 100 },
              { requirement: 'SOX Financial Controls', status: 'Compliant', score: 98 },
              { requirement: 'HIPAA Privacy Rules', status: 'Minor Issues', score: 92 },
              { requirement: 'PCI DSS Standards', status: 'Compliant', score: 100 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{item.requirement}</h3>
                  <p className="text-sm text-gray-600">Score: {item.score}%</p>
                </div>
                <Badge variant={item.status === 'Compliant' ? 'success' : 'warning' as any}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Audit Reports</h2>
        <Button>
          Generate Report
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Pre-configured and custom audit reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Daily Security Summary',
                description: 'Daily overview of security events and activities',
                lastGenerated: '2 hours ago',
                format: 'PDF'
              },
              {
                name: 'Compliance Assessment',
                description: 'Monthly compliance status and violations report',
                lastGenerated: '1 day ago',
                format: 'Excel'
              },
              {
                name: 'User Activity Report',
                description: 'Detailed user access and activity analysis',
                lastGenerated: '1 week ago',
                format: 'PDF'
              },
              {
                name: 'Risk Assessment',
                description: 'Security risk analysis and recommendations',
                lastGenerated: '2 weeks ago',
                format: 'PDF'
              }
            ].map((report, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{report.name}</h3>
                  <Badge variant="outline">{report.format}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last: {report.lastGenerated}</span>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm">Download</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Audit Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Logging Configuration</CardTitle>
          <CardDescription>Configure what events to log and retention policies</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Audit logging configuration settings will be implemented here
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
              <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Audit Logger</h1>
                <p className="text-gray-600">
                  Comprehensive audit trails, security logging, and compliance monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm"
                title="Select time period"
                aria-label="Select time period for audit logs"
              >
                <option value="1h">Last hour</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'logs', label: 'Audit Logs', icon: FileTextIcon },
            { id: 'events', label: 'Security Events', icon: AlertTriangleIcon },
            { id: 'compliance', label: 'Compliance', icon: ShieldCheckIcon },
            { id: 'reports', label: 'Reports', icon: DownloadIcon },
            { id: 'settings', label: 'Settings', icon: LockIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm'
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
        {activeTab === 'logs' && renderLogsTab()}
        {activeTab === 'events' && renderEventsTab()}
        {activeTab === 'compliance' && renderComplianceTab()}
        {activeTab === 'reports' && renderReportsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
}