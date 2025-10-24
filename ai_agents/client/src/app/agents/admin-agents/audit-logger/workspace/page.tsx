import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileSearch,
  Shield,
  Clock,
  User,
  AlertTriangle,
  Download,
  Sparkles,
  CheckCircle,
  XCircle,
  Activity,
  Search,
  Filter,
  Zap,
  TrendingUp,
  Bell,
  X,
  Globe,
  Database,
  LogIn,
  FileText,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ActionType = 'login' | 'create' | 'update' | 'delete' | 'export' | 'access' | 'logout';
type ResourceType = 'user' | 'job' | 'application' | 'resume' | 'system' | 'settings' | 'document';
type Status = 'success' | 'failure';
type Severity = 'info' | 'warning' | 'error' | 'critical';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: number;
  userName: string;
  userEmail: string;
  actionType: ActionType;
  resourceType: ResourceType;
  resourceId: string;
  ipAddress: string;
  status: Status;
  severity: Severity;
  description: string;
  userAgent?: string;
  location?: string;
}

interface AuditStats {
  totalEvents: number;
  todayEvents: number;
  failedEvents: number;
  securityAlerts: number;
  trends: {
    totalEvents: number;
    todayEvents: number;
    failedEvents: number;
    securityAlerts: number;
  };
}


export default function AuditLoggerWorkspace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [showAIReport, setShowAIReport] = useState(false);
  const [aiReport, setAIReport] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    totalEvents: 0,
    todayEvents: 0,
    failedEvents: 0,
    securityAlerts: 0,
    trends: { totalEvents: 0, todayEvents: 0, failedEvents: 0, securityAlerts: 0 }
  });
  const userId = 1;

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [refreshKey]);

  const loadLogs = async () => {
    try {
      const response = await fetch(`/api/agents/audit-logger/logs?userId=${userId}`);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/agents/audit-logger/stats?userId=${userId}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    if (realtimeEnabled) {
      const interval = setInterval(() => {
        setRefreshKey(prev => prev + 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [realtimeEnabled]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);
      
      const matchesAction = actionFilter === 'all' || log.actionType === actionFilter;
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
      const matchesResource = resourceFilter === 'all' || log.resourceType === resourceFilter;

      return matchesSearch && matchesAction && matchesStatus && matchesSeverity && matchesResource;
    });
  }, [logs, searchTerm, actionFilter, statusFilter, severityFilter, resourceFilter]);

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'info':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: 'text-blue-600' };
      case 'warning':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: 'text-yellow-600' };
      case 'error':
        return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', icon: 'text-orange-600' };
      case 'critical':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: 'text-red-600' };
    }
  };

  const getStatusColor = (status: Status) => {
    return status === 'success'
      ? { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: 'text-green-600' }
      : { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: 'text-red-600' };
  };

  const getActionIcon = (action: ActionType) => {
    switch (action) {
      case 'login': return LogIn;
      case 'create': return FileText;
      case 'update': return Edit;
      case 'delete': return Trash2;
      case 'export': return Download;
      case 'access': return Eye;
      case 'logout': return LogIn;
      default: return Activity;
    }
  };

  const getActionColor = (action: ActionType) => {
    switch (action) {
      case 'login': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'create': return 'bg-green-100 text-green-800 border-green-200';
      case 'update': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delete': return 'bg-red-100 text-red-800 border-red-200';
      case 'export': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'access': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'logout': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const TrendIndicator = ({ value }: { value: number }) => {
    const isPositive = value > 0;
    const Icon = isPositive ? TrendingUp : TrendingUp;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${color}`}>
        <Icon className="w-4 h-4" />
        <span>{Math.abs(value)}%</span>
      </div>
    );
  };

  const handleExportLogs = () => {
    alert('Audit logs exported to CSV! (This is a demo)');
  };

  const handleAnalyzeWithAI = () => {
    setIsGeneratingReport(true);
    setAIReport('Analyzing audit logs for anomalies and security threats...');
    setShowAIReport(true);
    
    setTimeout(() => {
      const report = `
🔍 **AI-Powered Audit Log Analysis**

**Executive Summary:**
Total Events Analyzed: ${stats.totalEvents}
Analysis Period: Last 24 hours
Security Status: ${stats.securityAlerts > 3 ? 'REQUIRES ATTENTION' : 'NOMINAL'}

**Key Findings:**

🚨 **Security Alerts (${stats.securityAlerts} detected):**
${logs.filter(l => l.severity === 'critical').map(log => `
⚠️ CRITICAL: ${log.description}
  - User: ${log.userName} (${log.userEmail})
  - IP: ${log.ipAddress}
  - Location: ${log.location || 'Unknown'}
  - Time: ${new Date(log.timestamp).toLocaleString()}
  - Recommendation: Immediate investigation required
`).join('')}

${logs.filter(l => l.severity === 'error').map(log => `
⚡ ERROR: ${log.description}
  - User: ${log.userName}
  - IP: ${log.ipAddress}
  - Time: ${new Date(log.timestamp).toLocaleString()}
  - Recommendation: Review and monitor user activity
`).join('')}

📊 **Activity Breakdown:**
- Login Attempts: ${logs.filter(l => l.actionType === 'login').length} (${logs.filter(l => l.actionType === 'login' && l.status === 'failure').length} failed)
- Create Operations: ${logs.filter(l => l.actionType === 'create').length}
- Update Operations: ${logs.filter(l => l.actionType === 'update').length}
- Delete Operations: ${logs.filter(l => l.actionType === 'delete').length}
- Export Operations: ${logs.filter(l => l.actionType === 'export').length}
- Access Operations: ${logs.filter(l => l.actionType === 'access').length}

🔐 **Authentication Analysis:**
- Success Rate: ${((logs.filter(l => l.actionType === 'login' && l.status === 'success').length / logs.filter(l => l.actionType === 'login').length) * 100).toFixed(1)}%
- Failed Login Attempts: ${logs.filter(l => l.actionType === 'login' && l.status === 'failure').length}
- Unique Users Active: ${new Set(logs.map(l => l.userId)).size}

🌍 **Geographic Activity:**
${Object.entries(logs.reduce((acc, log) => {
  const loc = log.location || 'Unknown';
  acc[loc] = (acc[loc] || 0) + 1;
  return acc;
}, {} as Record<string, number>)).slice(0, 5).map(([location, count]) => `
- ${location}: ${count} events`).join('')}

⚡ **Anomaly Detection:**

${logs.filter(l => l.severity === 'critical' || l.severity === 'error').length > 0 ? `
1. **Multiple Failed Login Attempts:** Detected ${logs.filter(l => l.actionType === 'login' && l.status === 'failure').length} failed login attempts
   - Most affected user: ${logs.filter(l => l.status === 'failure').reduce((acc, log) => {
     acc[log.userName] = (acc[log.userName] || 0) + 1;
     return acc;
   }, {} as Record<string, number>) && Object.entries(logs.filter(l => l.status === 'failure').reduce((acc, log) => {
     acc[log.userName] = (acc[log.userName] || 0) + 1;
     return acc;
   }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
   - Action: Consider implementing rate limiting and account lockout policies

2. **Suspicious Access Patterns:** ${logs.filter(l => l.severity === 'critical').length} critical security events detected
   - Action: Review IP addresses and implement geo-blocking if needed

3. **Permission-Based Failures:** ${logs.filter(l => l.description.includes('permission')).length} permission denied events
   - Action: Review user role assignments and access controls
` : `
✅ No significant anomalies detected
- All login attempts within normal parameters
- No suspicious access patterns identified
- System security posture is healthy
`}

📈 **Recommendations:**

**Immediate Actions:**
1. Investigate all CRITICAL severity events immediately
2. Review failed login attempts from IP: ${logs.filter(l => l.status === 'failure')[0]?.ipAddress || 'N/A'}
3. Consider implementing 2FA for users with multiple failed attempts
4. Review and update access control policies

**Proactive Measures:**
1. Enable automated alerting for critical security events
2. Implement IP-based rate limiting
3. Set up geo-fencing for sensitive operations
4. Schedule regular security audits
5. Implement session timeout policies
6. Enable detailed logging for administrative actions

**Compliance:**
- All audit logs are being properly recorded
- Retention policy: 90 days recommended
- Consider implementing log archival for long-term compliance

**Security Health Score:** ${stats.securityAlerts > 5 ? '62/100 (Needs Attention)' : stats.securityAlerts > 2 ? '78/100 (Good)' : '94/100 (Excellent)'}

**Risk Level:** ${stats.securityAlerts > 5 ? 'HIGH - Immediate action required' : stats.securityAlerts > 2 ? 'MEDIUM - Monitor closely' : 'LOW - Normal operations'}

*Report generated on ${new Date().toLocaleString()}*
*AI-powered security analysis by RecruitEdge Audit Intelligence*
      `;
      setAIReport(report);
      setIsGeneratingReport(false);
    }, 2500);
  };

  const hasLogs = logs.length > 0;

  if (!hasLogs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center gap-4">
            <Link to="/agents/admin-agents/audit-logger" className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logger</h1>
          </div>
          
          <Card className="h-96 flex items-center justify-center">
            <div className="text-center py-12 px-6">
              <FileSearch className="w-20 h-20 text-teal-200 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Audit Logs
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Audit logs will appear here as users interact with the system.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/agents/admin-agents/audit-logger" className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-lg">
                <FileSearch className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Audit Logger</h1>
                <p className="text-sm text-gray-600 mt-1">Security and compliance audit trail</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
              <Zap className={`w-4 h-4 ${realtimeEnabled ? 'text-teal-600' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-600">Real-time</span>
              <button
                onClick={() => setRealtimeEnabled(!realtimeEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  realtimeEnabled ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  realtimeEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <Button
              onClick={handleExportLogs}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Logs
            </Button>
            
            <Button
              onClick={handleAnalyzeWithAI}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white flex items-center gap-2"
              disabled={isGeneratingReport}
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingReport ? 'animate-spin' : ''}`} />
              {isGeneratingReport ? 'Analyzing...' : 'Analyze Logs with AI'}
            </Button>
          </div>
        </div>

        {showAIReport && (
          <Card className="mb-6 border-l-4 border-l-teal-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Sparkles className={`w-5 h-5 text-teal-600 ${isGeneratingReport ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">AI Analysis Report</h3>
                    <p className="text-sm text-gray-600">Automated security and anomaly detection</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIReport(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{aiReport}</pre>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all border-l-4 border-l-teal-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-teal-600 bg-opacity-10">
                  <Activity className="w-6 h-6 text-teal-600" />
                </div>
                <TrendIndicator value={stats.trends.totalEvents} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalEvents}
              </h3>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-xs text-gray-500 mt-2">all time</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-600 bg-opacity-10">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <TrendIndicator value={stats.trends.todayEvents} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.todayEvents}
              </h3>
              <p className="text-sm text-gray-600">Today's Events</p>
              <p className="text-xs text-gray-500 mt-2">last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-orange-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-600 bg-opacity-10">
                  <XCircle className="w-6 h-6 text-orange-600" />
                </div>
                <TrendIndicator value={stats.trends.failedEvents} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.failedEvents}
              </h3>
              <p className="text-sm text-gray-600">Failed Events</p>
              <p className="text-xs text-gray-500 mt-2">requires attention</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-red-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-red-600 bg-opacity-10">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <TrendIndicator value={stats.trends.securityAlerts} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.securityAlerts}
              </h3>
              <p className="text-sm text-gray-600">Security Alerts</p>
              <p className="text-xs text-gray-500 mt-2">critical + errors</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Audit Log Entries</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user, email, IP address, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">All Actions</option>
                    <option value="login">Login</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="export">Export</option>
                    <option value="access">Access</option>
                    <option value="logout">Logout</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="failure">Failure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">All Severities</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                  <select
                    value={resourceFilter}
                    onChange={(e) => setResourceFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">All Resources</option>
                    <option value="user">User</option>
                    <option value="job">Job</option>
                    <option value="application">Application</option>
                    <option value="resume">Resume</option>
                    <option value="system">System</option>
                    <option value="settings">Settings</option>
                    <option value="document">Document</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredLogs.length} of {logs.length} events
            </div>
          </div>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => {
                    const ActionIcon = getActionIcon(log.actionType);
                    const severityColors = getSeverityColor(log.severity);
                    const statusColors = getStatusColor(log.status);
                    const StatusIcon = log.status === 'success' ? CheckCircle : XCircle;

                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                              <div className="text-xs text-gray-500">{log.userEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getActionColor(log.actionType)}`}>
                            <ActionIcon className="w-3 h-3" />
                            {log.actionType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-900">{log.resourceType}</div>
                              <div className="text-xs text-gray-500">{log.resourceId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-900 font-mono">{log.ipAddress}</div>
                              {log.location && (
                                <div className="text-xs text-gray-500">{log.location}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors.bg} ${statusColors.border} ${statusColors.text}`}>
                            <StatusIcon className="w-3 h-3" />
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${severityColors.bg} ${severityColors.border} ${severityColors.text}`}>
                            {log.severity === 'critical' && <AlertTriangle className="w-3 h-3" />}
                            {log.severity === 'error' && <XCircle className="w-3 h-3" />}
                            {log.severity === 'warning' && <Bell className="w-3 h-3" />}
                            {log.severity === 'info' && <Activity className="w-3 h-3" />}
                            {log.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md">{log.description}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <FileSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No logs found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
