'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { 
  ActivityIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon,
  CpuIcon,
  DatabaseIcon,
  HardDriveIcon,
  NetworkIcon,
  ServerIcon,
  ShieldIcon,
  TrendingUpIcon,
  XCircleIcon
} from 'lucide-react';

interface SystemService {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  uptime: number;
  responseTime: number;
  lastCheck: string;
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'performance' | 'security' | 'error' | 'capacity';
  status: 'active' | 'acknowledged' | 'resolved';
  triggeredAt: string;
  assignedTo?: string;
}

interface PerformanceMetric {
  id: string;
  endpoint: string;
  avgResponseTime: number;
  requestCount: number;
  errorRate: number;
  timestamp: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy': return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    case 'warning': return <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />;
    case 'critical': return <XCircleIcon className="h-4 w-4 text-red-500" />;
    default: return <ActivityIcon className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'bg-green-100 text-green-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'bg-blue-100 text-blue-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatUptime = (uptime: number) => {
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

export default function SystemMonitorPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'performance' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  const systemServices: SystemService[] = [
    {
      id: '1',
      name: 'API Gateway',
      status: 'healthy',
      uptime: 2592000, // 30 days
      responseTime: 45,
      lastCheck: '2025-10-25T10:00:00Z',
      metrics: { cpu: 35, memory: 67, disk: 45, network: 23 }
    },
    {
      id: '2',
      name: 'Database',
      status: 'warning',
      uptime: 1814400, // 21 days
      responseTime: 120,
      lastCheck: '2025-10-25T10:00:00Z',
      metrics: { cpu: 78, memory: 89, disk: 67, network: 45 }
    },
    {
      id: '3',
      name: 'File Storage',
      status: 'healthy',
      uptime: 3456000, // 40 days
      responseTime: 25,
      lastCheck: '2025-10-25T10:00:00Z',
      metrics: { cpu: 12, memory: 34, disk: 89, network: 15 }
    }
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      title: 'High Memory Usage',
      description: 'Database server memory usage exceeded 85% threshold',
      severity: 'high',
      category: 'performance',
      status: 'active',
      triggeredAt: '2025-10-25T09:30:00Z',
      assignedTo: 'admin@example.com'
    },
    {
      id: '2',
      title: 'Disk Space Warning',
      description: 'File storage disk usage is approaching capacity',
      severity: 'medium',
      category: 'capacity',
      status: 'acknowledged',
      triggeredAt: '2025-10-25T08:15:00Z'
    }
  ];

  const performanceMetrics: PerformanceMetric[] = [
    {
      id: '1',
      endpoint: '/api/auth/login',
      avgResponseTime: 234,
      requestCount: 1547,
      errorRate: 0.2,
      timestamp: '2025-10-25T10:00:00Z'
    },
    {
      id: '2',
      endpoint: '/api/jobs/search',
      avgResponseTime: 456,
      requestCount: 3421,
      errorRate: 1.1,
      timestamp: '2025-10-25T10:00:00Z'
    }
  ];

  const handleAcknowledgeAlert = (alertId: string) => {
    console.log('Acknowledging alert:', alertId);
  };

  const handleResolveAlert = (alertId: string) => {
    console.log('Resolving alert:', alertId);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">{systemServices.length}</p>
              </div>
              <ServerIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Healthy Services</p>
                <p className="text-2xl font-bold text-green-600">
                  {systemServices.filter(s => s.status === 'healthy').length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.status === 'active').length}
                </p>
              </div>
              <AlertTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">
                  {Math.round(systemServices.reduce((acc, s) => acc + s.responseTime, 0) / systemServices.length)}ms
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
          <CardDescription>Current status of all system services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(service.status)}
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-gray-500">
                      Uptime: {formatUptime(service.uptime)} | Response: {service.responseTime}ms
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <CpuIcon className="h-3 w-3" />
                      <span>{service.metrics.cpu}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DatabaseIcon className="h-3 w-3" />
                      <span>{service.metrics.memory}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <HardDriveIcon className="h-3 w-3" />
                      <span>{service.metrics.disk}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <NetworkIcon className="h-3 w-3" />
                      <span>{service.metrics.network}%</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAlertsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Alerts</h2>
        <Button>Create Alert Rule</Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {alerts.length === 0 ? (
            <EmptyState 
              icon={ShieldIcon}
              title="No alerts"
              description="All systems are running normally. New alerts will appear here."
            />
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium">{alert.title}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline">{alert.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Triggered: {new Date(alert.triggeredAt).toLocaleString()}</span>
                        {alert.assignedTo && <span>Assigned to: {alert.assignedTo}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {alert.status === 'active' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        </>
                      )}
                      <Badge className={`${alert.status === 'active' ? 'bg-red-100 text-red-800' : 
                        alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Performance Metrics</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>API Endpoint Performance</CardTitle>
          <CardDescription>Response times and error rates for key endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceMetrics.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{metric.endpoint}</h3>
                  <p className="text-sm text-gray-500">
                    {metric.requestCount} requests | {metric.errorRate}% error rate
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{metric.avgResponseTime}ms</p>
                    <p className="text-xs text-gray-500">avg response time</p>
                  </div>
                  <TrendingUpIcon className="h-5 w-5 text-blue-600" />
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
      <h2 className="text-2xl font-bold">Monitoring Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Alert Configuration</CardTitle>
          <CardDescription>Configure monitoring thresholds and notification settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CPU Threshold (%)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  defaultValue={80}
                  min={0}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Memory Threshold (%)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  defaultValue={85}
                  min={0}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Disk Threshold (%)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  defaultValue={90}
                  min={0}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Response Time Threshold (ms)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  defaultValue={1000}
                  min={0}
                />
              </div>
            </div>
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (error) {
    return (
      <ErrorState 
        title="Failed to load system monitor"
        description={error}
        onRetry={() => {
          setError(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <ActivityIcon className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">System Monitor</h1>
          </div>
          <p className="text-gray-600">
            Monitor system health, performance metrics, and manage alerts for the recruitment platform
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: ActivityIcon },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangleIcon },
            { id: 'performance', label: 'Performance', icon: TrendingUpIcon },
            { id: 'settings', label: 'Settings', icon: ServerIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-red-600 shadow-sm'
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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'alerts' && renderAlertsTab()}
            {activeTab === 'performance' && renderPerformanceTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </>
        )}
      </div>
    </div>
  );
}