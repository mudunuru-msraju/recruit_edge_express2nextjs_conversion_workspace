'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Settings, Users, Shield, Key, Plus, Search, Edit, Trash2 } from "lucide-react";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Settings className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-gray-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'roles'
                ? 'bg-gray-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Roles & Permissions
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-gray-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Security Settings
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'activity'
                ? 'bg-gray-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Activity Logs
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Accounts</h2>
              <div className="flex gap-2">
                <Input placeholder="Search users..." className="w-64" />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      {
                        name: 'John Smith',
                        email: 'john@company.com',
                        role: 'Admin',
                        status: 'Active',
                        lastLogin: '2 hours ago'
                      },
                      {
                        name: 'Sarah Johnson',
                        email: 'sarah@company.com',
                        role: 'Recruiter',
                        status: 'Active',
                        lastLogin: '1 day ago'
                      },
                      {
                        name: 'Mike Chen',
                        email: 'mike@company.com',
                        role: 'Job Seeker',
                        status: 'Inactive',
                        lastLogin: '1 week ago'
                      },
                      {
                        name: 'Emily Davis',
                        email: 'emily@company.com',
                        role: 'Recruiter',
                        status: 'Active',
                        lastLogin: '3 hours ago'
                      }
                    ].map((user, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <Users className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'Recruiter' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Roles & Permissions</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Super Admin',
                  description: 'Full system access and control',
                  users: 2,
                  permissions: ['All Permissions']
                },
                {
                  name: 'Admin',
                  description: 'Administrative access with some restrictions',
                  users: 5,
                  permissions: ['User Management', 'System Settings', 'Analytics']
                },
                {
                  name: 'Recruiter',
                  description: 'Access to recruitment tools and candidate management',
                  users: 12,
                  permissions: ['Candidate Management', 'Job Posting', 'Pipeline Management']
                },
                {
                  name: 'Job Seeker',
                  description: 'Basic access for job seekers',
                  users: 1247,
                  permissions: ['Profile Management', 'Job Search', 'Application Tracking']
                }
              ].map((role, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-medium">{role.users}</span> users assigned
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Permissions:</p>
                        <div className="space-y-1">
                          {role.permissions.map((permission, permIndex) => (
                            <div key={permIndex} className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {permission}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Assign
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Security Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password Policy</CardTitle>
                  <CardDescription>Configure password requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input id="minLength" type="number" defaultValue="8" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="requireUppercase" defaultChecked />
                    <Label htmlFor="requireUppercase">Require uppercase letters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="requireNumbers" defaultChecked />
                    <Label htmlFor="requireNumbers">Require numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="requireSpecial" defaultChecked />
                    <Label htmlFor="requireSpecial">Require special characters</Label>
                  </div>
                  <Button>Update Policy</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Manage 2FA settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enforce 2FA for Admins</p>
                      <p className="text-sm text-gray-600">Require all admin users to use 2FA</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Optional 2FA for Users</p>
                      <p className="text-sm text-gray-600">Allow users to enable 2FA</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Session Management</CardTitle>
                  <CardDescription>Control user session behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxSessions">Max Concurrent Sessions</Label>
                    <Input id="maxSessions" type="number" defaultValue="3" />
                  </div>
                  <Button>Update Settings</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Login Restrictions</CardTitle>
                  <CardDescription>Configure login security measures</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Failed Login Attempts</Label>
                    <Input id="maxAttempts" type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration">Account Lockout Duration (minutes)</Label>
                    <Input id="lockoutDuration" type="number" defaultValue="15" />
                  </div>
                  <Button>Update Restrictions</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Activity Logs</h2>
              <div className="flex gap-2">
                <Input type="date" className="w-auto" />
                <Button variant="outline">Filter</Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {[
                    {
                      user: 'John Smith',
                      action: 'Updated user role for Sarah Johnson',
                      timestamp: '2 hours ago',
                      ip: '192.168.1.100'
                    },
                    {
                      user: 'Sarah Johnson',
                      action: 'Created new job posting',
                      timestamp: '4 hours ago',
                      ip: '192.168.1.101'
                    },
                    {
                      user: 'Mike Chen',
                      action: 'Failed login attempt',
                      timestamp: '6 hours ago',
                      ip: '192.168.1.102'
                    },
                    {
                      user: 'Emily Davis',
                      action: 'Downloaded candidate report',
                      timestamp: '1 day ago',
                      ip: '192.168.1.103'
                    }
                  ].map((log, index) => (
                    <div key={index} className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{log.user}</p>
                          <p className="text-sm text-gray-600">{log.action}</p>
                          <p className="text-xs text-gray-500">IP: {log.ip}</p>
                        </div>
                        <span className="text-sm text-gray-500">{log.timestamp}</span>
                      </div>
                    </div>
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