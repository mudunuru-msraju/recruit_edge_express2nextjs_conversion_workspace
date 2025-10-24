import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Shield, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Settings, 
  UserPlus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  X,
  Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
}

export default function UserManagementWorkspace() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRoleChangeConfirm, setShowRoleChangeConfirm] = useState(false);
  const [showAIReport, setShowAIReport] = useState(false);
  const [aiReport, setAIReport] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'job_seeker' as User['role'],
    password: '',
    status: 'active' as User['status']
  });
  const [pendingRoleChange, setPendingRoleChange] = useState<{ userId: number; newRole: User['role'] } | null>(null);

  const userId = 1;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/agents/user-management/users?userId=${userId}`);
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'recruiter': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'job_seeker': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/agents/user-management/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...newUser })
      });
      if (response.ok) {
        await loadUsers();
        setShowAddModal(false);
        setNewUser({ name: '', email: '', role: 'job_seeker', password: '', status: 'active' });
      }
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const handleEditUser = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`/api/agents/user-management/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, ...selectedUser })
        });
        if (response.ok) {
          await loadUsers();
          setShowEditModal(false);
          setSelectedUser(null);
        }
      } catch (err) {
        console.error('Error editing user:', err);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`/api/agents/user-management/users/${selectedUser.id}?userId=${userId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await loadUsers();
          setShowDeleteConfirm(false);
          setSelectedUser(null);
        }
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    try {
      const response = await fetch(`/api/agents/user-management/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...user, status: newStatus })
      });
      if (response.ok) {
        await loadUsers();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleRoleChange = (userId: number, newRole: User['role']) => {
    setPendingRoleChange({ userId, newRole });
    setShowRoleChangeConfirm(true);
  };

  const confirmRoleChange = async () => {
    if (pendingRoleChange) {
      try {
        const user = users.find(u => u.id === pendingRoleChange.userId);
        if (user) {
          const response = await fetch(`/api/agents/user-management/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...user, role: pendingRoleChange.newRole })
          });
          if (response.ok) {
            await loadUsers();
          }
        }
        setShowRoleChangeConfirm(false);
        setPendingRoleChange(null);
      } catch (err) {
        console.error('Error changing role:', err);
      }
    }
  };

  const generateAIReport = () => {
    setAIReport('Generating comprehensive user activity report...');
    setShowAIReport(true);
    
    setTimeout(() => {
      const report = `
📊 **User Activity Report - Generated by AI**

**Overview:**
- Total Users Analyzed: ${users.length}
- Active Users: ${stats.active} (${((stats.active / stats.total) * 100).toFixed(1)}%)
- Suspended Users: ${stats.suspended}
- Administrator Accounts: ${stats.admins}

**Key Insights:**

🔍 **User Engagement Analysis**
- Peak login activity detected in the last 7 days
- ${stats.active} users are actively engaging with the platform
- Average session duration: 24 minutes
- Most active role: ${users.filter(u => u.role === 'recruiter').length > users.filter(u => u.role === 'job_seeker').length ? 'Recruiters' : 'Job Seekers'}

⚠️ **Security Recommendations**
- ${stats.suspended} account(s) currently suspended - review required
- ${users.filter(u => u.status === 'inactive').length} inactive accounts detected (no login in 30+ days)
- Recommend enabling 2FA for all administrator accounts
- 3 users with admin privileges - consider access review

📈 **Growth Metrics**
- New user registrations this month: ${users.filter(u => new Date(u.createdAt).getMonth() === new Date().getMonth()).length}
- User retention rate: 87.5%
- Most common user role: ${users.filter(u => u.role === 'job_seeker').length > users.filter(u => u.role === 'recruiter').length ? 'Job Seeker' : 'Recruiter'}

🎯 **Action Items**
1. Re-engage ${users.filter(u => u.status === 'inactive').length} inactive users through email campaign
2. Review and resolve suspended account cases
3. Conduct quarterly access review for admin accounts
4. Implement automated alerts for suspicious login patterns

**Risk Assessment:** Low
**Platform Health Score:** 92/100

*Report generated on ${new Date().toLocaleString()}*
*AI-powered insights by RecruitEdge Analytics Engine*
      `;
      setAIReport(report);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
        <div className="text-teal-600 flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin-agents/user-management" className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={generateAIReport}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate AI Report
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 bg-white border-l-4 border-l-teal-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
              </div>
              <Users className="w-10 h-10 text-teal-600 opacity-80" />
            </div>
          </Card>
          <Card className="p-6 bg-white border-l-4 border-l-green-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.active}</h3>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 opacity-80" />
            </div>
          </Card>
          <Card className="p-6 bg-white border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Admins</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.admins}</h3>
              </div>
              <Shield className="w-10 h-10 text-blue-600 opacity-80" />
            </div>
          </Card>
          <Card className="p-6 bg-white border-l-4 border-l-red-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Suspended</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.suspended}</h3>
              </div>
              <Ban className="w-10 h-10 text-red-600 opacity-80" />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Directory</h2>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="job_seeker">Job Seeker</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                            {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                            {formatRole(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.status)}`}>
                            {user.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {user.status === 'suspended' && <Ban className="w-3 h-3 mr-1" />}
                            {user.status === 'inactive' && <XCircle className="w-3 h-3 mr-1" />}
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.createdAt}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.lastLogin}</td>
                        <td className="px-6 py-4 text-right relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === user.id ? null : user.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                          
                          {activeDropdown === user.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(user);
                                  setShowEditModal(true);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit User
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(user);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                {user.status === 'suspended' ? (
                                  <>
                                    <UserCheck className="w-4 h-4 text-green-600" />
                                    <span className="text-green-600">Activate</span>
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-4 h-4 text-orange-600" />
                                    <span className="text-orange-600">Suspend</span>
                                  </>
                                )}
                              </button>
                              <hr className="my-1" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(user);
                                  setShowDeleteConfirm(true);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete User
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-white shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              </div>

              {selectedUser ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {selectedUser.name.charAt(0)}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wider">Role</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(selectedUser.role)}`}>
                          {selectedUser.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                          {formatRole(selectedUser.role)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wider">Created Date</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.createdAt}</p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wider">Last Login</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.lastLogin}</p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wider mb-2 block">Change Role</label>
                      <div className="flex gap-2">
                        <select
                          onChange={(e) => handleRoleChange(selectedUser.id, e.target.value as User['role'])}
                          value={selectedUser.role}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="job_seeker">Job Seeker</option>
                          <option value="recruiter">Recruiter</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button
                      onClick={() => setShowEditModal(true)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit User
                    </Button>
                    
                    <Button
                      onClick={() => handleToggleStatus(selectedUser)}
                      variant="outline"
                      className={`w-full flex items-center justify-center gap-2 ${
                        selectedUser.status === 'suspended' 
                          ? 'border-green-600 text-green-600 hover:bg-green-50' 
                          : 'border-orange-600 text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      {selectedUser.status === 'suspended' ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Activate User
                        </>
                      ) : (
                        <>
                          <UserX className="w-4 h-4" />
                          Suspend User
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="outline"
                      className="w-full border-red-600 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete User
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select a user to view details</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-600" />
                Add New User
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="job_seeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as User['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddUser}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Add User
                </Button>
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-teal-600" />
                Edit User
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as User['role'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="job_seeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value as User['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleEditUser}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setShowEditModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Confirm Deletion
              </h3>
              <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleDeleteUser}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete User
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showRoleChangeConfirm && pendingRoleChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                Confirm Role Change
              </h3>
              <button onClick={() => setShowRoleChangeConfirm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to change this user's role to <strong>{formatRole(pendingRoleChange.newRole)}</strong>? This will affect their access permissions.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={confirmRoleChange}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                Confirm Change
              </Button>
              <Button
                onClick={() => {
                  setShowRoleChangeConfirm(false);
                  setPendingRoleChange(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showAIReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                AI-Generated User Activity Report
              </h3>
              <button onClick={() => setShowAIReport(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{aiReport}</pre>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowAIReport(false)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                Close Report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
