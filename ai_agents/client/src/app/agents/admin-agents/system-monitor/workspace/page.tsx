import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Activity,
  Server,
  Database,
  HardDrive,
  Wifi,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Zap,
  Mail,
  Radio,
  Cog,
  TrendingUp,
  Bell,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type SystemStatus = 'healthy' | 'warning' | 'critical';
type ServiceStatus = 'operational' | 'degraded' | 'down';

interface ServiceHealth {
  name: string;
  status: ServiceStatus;
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

interface PerformanceMetric {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface Incident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved';
  affectedServices: string[];
}

interface SystemData {
  overallStatus: SystemStatus;
  services: ServiceHealth[];
  performance: PerformanceMetric;
  uptime: {
    current: string;
    percentage30Day: number;
    incidentCount: number;
  };
  incidents: Incident[];
  performanceHistory: { time: string; cpu: number; memory: number }[];
}

const generateMockData = (): SystemData => {
  const performanceHistory = Array.from({ length: 24 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - (23 - i));
    return {
      time: date.getHours().toString().padStart(2, '0') + ':00',
      cpu: 30 + Math.random() * 40,
      memory: 50 + Math.random() * 30
    };
  });

  return {
    overallStatus: 'healthy',
    services: [
      { name: 'API Server', status: 'operational', uptime: 99.97, responseTime: 145, lastChecked: '2 mins ago' },
      { name: 'Database', status: 'operational', uptime: 99.99, responseTime: 23, lastChecked: '1 min ago' },
      { name: 'Storage', status: 'operational', uptime: 99.95, responseTime: 89, lastChecked: '3 mins ago' },
      { name: 'Email Service', status: 'degraded', uptime: 98.82, responseTime: 342, lastChecked: '5 mins ago' },
      { name: 'WebSocket', status: 'operational', uptime: 99.91, responseTime: 56, lastChecked: '2 mins ago' },
      { name: 'Background Jobs', status: 'operational', uptime: 99.88, responseTime: 178, lastChecked: '4 mins ago' }
    ],
    performance: {
      cpu: 42.5,
      memory: 68.3,
      disk: 54.2,
      network: 23.7
    },
    uptime: {
      current: '45d 12h 34m',
      percentage30Day: 99.94,
      incidentCount: 3
    },
    incidents: [
      {
        id: 'INC-2025-045',
        title: 'Email service experiencing high latency',
        severity: 'medium',
        timestamp: '2025-10-23 08:45:00',
        status: 'investigating',
        affectedServices: ['Email Service']
      },
      {
        id: 'INC-2025-044',
        title: 'Brief API timeout spike',
        severity: 'low',
        timestamp: '2025-10-22 14:20:00',
        status: 'resolved',
        affectedServices: ['API Server']
      },
      {
        id: 'INC-2025-043',
        title: 'Database connection pool exhaustion',
        severity: 'high',
        timestamp: '2025-10-21 03:15:00',
        status: 'resolved',
        affectedServices: ['Database', 'API Server']
      },
      {
        id: 'INC-2025-042',
        title: 'Storage backup completion delayed',
        severity: 'low',
        timestamp: '2025-10-20 22:30:00',
        status: 'resolved',
        affectedServices: ['Storage']
      }
    ],
    performanceHistory
  };
};

export default function SystemMonitorWorkspace() {
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [showAIReport, setShowAIReport] = useState(false);
  const [aiReport, setAIReport] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showAlertConfig, setShowAlertConfig] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState<SystemData>(generateMockData());

  const userId = 1;

  useEffect(() => {
    loadSystemStatus();
  }, [refreshKey]);

  const loadSystemStatus = async () => {
    try {
      const response = await fetch(`/api/agents/system-monitor/status?userId=${userId}`);
      const status = await response.json();
      
      const mockData = generateMockData();
      setData({
        ...mockData,
        overallStatus: status.overall || mockData.overallStatus,
        uptime: {
          ...mockData.uptime,
          percentage30Day: parseFloat(status.uptime) || mockData.uptime.percentage30Day,
        }
      });
    } catch (error) {
      console.error('Error loading system status:', error);
      setData(generateMockData());
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

  const getStatusColor = (status: SystemStatus | ServiceStatus) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: 'text-green-600' };
      case 'warning':
      case 'degraded':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: 'text-yellow-600' };
      case 'critical':
      case 'down':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: 'text-red-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: 'text-gray-600' };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'medium':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'high':
        return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' };
      case 'critical':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      case 'investigating':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'resolved':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'API Server':
        return Server;
      case 'Database':
        return Database;
      case 'Storage':
        return HardDrive;
      case 'Email Service':
        return Mail;
      case 'WebSocket':
        return Radio;
      case 'Background Jobs':
        return Cog;
      default:
        return Activity;
    }
  };

  const ProgressBar = ({ value }: { value: number }) => {
    const barColor = value > 80 ? 'bg-red-500' : value > 60 ? 'bg-yellow-500' : 'bg-teal-500';
    return (
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`${barColor} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    );
  };

  const handleRunDiagnostics = () => {
    setIsGeneratingReport(true);
    setAIReport('Running comprehensive system diagnostics...');
    setShowAIReport(true);
    
    setTimeout(() => {
      const report = `
🔍 **AI-Powered System Diagnostics Report**

**Executive Summary:**
Overall System Status: ${data.overallStatus.toUpperCase()}
System Uptime: ${data.uptime.current}
30-Day Availability: ${data.uptime.percentage30Day}%
Active Incidents: ${data.incidents.filter(i => i.status !== 'resolved').length}

**Service Health Analysis:**

${data.services.map(service => `
✓ **${service.name}**
  - Status: ${service.status.toUpperCase()}
  - Uptime: ${service.uptime}%
  - Avg Response Time: ${service.responseTime}ms
  - Last Checked: ${service.lastChecked}
  ${service.status === 'degraded' ? '  ⚠️ Recommendation: Investigate performance degradation' : ''}
`).join('')}

**Performance Metrics:**

💻 **CPU Usage**: ${data.performance.cpu.toFixed(1)}%
${data.performance.cpu > 80 ? '⚠️ HIGH - Consider scaling resources' : data.performance.cpu > 60 ? '⚡ MODERATE - Monitor closely' : '✅ NORMAL - Operating efficiently'}

🧠 **Memory Usage**: ${data.performance.memory.toFixed(1)}%
${data.performance.memory > 80 ? '⚠️ HIGH - Memory optimization recommended' : data.performance.memory > 60 ? '⚡ MODERATE - Within acceptable range' : '✅ NORMAL - Memory usage healthy'}

💾 **Disk Usage**: ${data.performance.disk.toFixed(1)}%
${data.performance.disk > 80 ? '⚠️ HIGH - Cleanup or expansion needed' : '✅ NORMAL - Sufficient storage available'}

🌐 **Network Traffic**: ${data.performance.network.toFixed(1)}%
${data.performance.network > 80 ? '⚠️ HIGH - Possible bandwidth saturation' : '✅ NORMAL - Network performing well'}

**Recent Incidents Analysis:**

${data.incidents.slice(0, 3).map(incident => `
📋 **${incident.id}**: ${incident.title}
  - Severity: ${incident.severity.toUpperCase()}
  - Status: ${incident.status.toUpperCase()}
  - Affected: ${incident.affectedServices.join(', ')}
  - Timestamp: ${incident.timestamp}
`).join('')}

**AI Recommendations:**

🎯 **Immediate Actions:**
${data.services.filter(s => s.status === 'degraded').length > 0 
  ? `1. Address degraded services: ${data.services.filter(s => s.status === 'degraded').map(s => s.name).join(', ')}
2. Review service logs for error patterns`
  : '1. No immediate actions required - all systems operational'}
${data.performance.cpu > 70 || data.performance.memory > 70 
  ? `${data.services.filter(s => s.status === 'degraded').length > 0 ? '3' : '2'}. Resource optimization recommended due to elevated ${data.performance.cpu > 70 ? 'CPU' : 'memory'} usage`
  : ''}

📈 **Proactive Measures:**
1. Implement automated scaling for services approaching capacity
2. Set up predictive alerting based on historical patterns
3. Schedule regular performance audits
4. Review and optimize database query performance
5. Implement caching strategies to reduce server load

⚡ **Performance Optimization Opportunities:**
- API response time optimization (current avg: ${data.services.find(s => s.name === 'API Server')?.responseTime}ms)
- Database connection pool tuning
- Background job queue optimization
- CDN configuration for static assets

**System Health Score:** ${data.overallStatus === 'healthy' ? '97/100 (Excellent)' : data.overallStatus === 'warning' ? '78/100 (Good)' : '45/100 (Needs Attention)'}

**Forecast:**
Based on current metrics and historical trends, the system is projected to maintain ${data.uptime.percentage30Day}%+ uptime over the next 30 days with current resource allocation.

*Report generated on ${new Date().toLocaleString()}*
*AI-powered diagnostics by RecruitEdge System Intelligence*
      `;
      setAIReport(report);
      setIsGeneratingReport(false);
    }, 2500);
  };

  const handleExportReport = () => {
    alert('System report exported as PDF! (This is a demo)');
  };

  const StatusIndicator = ({ status }: { status: SystemStatus }) => {
    const colors = getStatusColor(status);
    const Icon = status === 'healthy' ? CheckCircle : status === 'warning' ? AlertTriangle : XCircle;
    
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${colors.bg} ${colors.border}`}>
        <Icon className={`w-5 h-5 ${colors.icon}`} />
        <span className={`font-semibold ${colors.text}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/agents/admin-agents/system-monitor" className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Monitor</h1>
                <p className="text-sm text-gray-600 mt-1">Real-time system health and performance metrics</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
              <Zap className={`w-4 h-4 ${realtimeEnabled ? 'text-teal-600' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-600">Auto-refresh</span>
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
              onClick={() => setShowAlertConfig(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Alerts
            </Button>

            <Button
              onClick={handleExportReport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <Button
              onClick={handleRunDiagnostics}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white flex items-center gap-2"
              disabled={isGeneratingReport}
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingReport ? 'animate-spin' : ''}`} />
              {isGeneratingReport ? 'Running...' : 'Run Diagnostics with AI'}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Card className="bg-white border-l-4 border-l-teal-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-100 rounded-full">
                    <Activity className="w-8 h-8 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Overall System Status</h2>
                    <p className="text-sm text-gray-600">Last updated: {realtimeEnabled ? 'Live' : 'Just now'}</p>
                  </div>
                </div>
                <StatusIndicator status={data.overallStatus} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all border-l-4 border-l-teal-600">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-teal-600 bg-opacity-10">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Uptime</p>
                  <h3 className="text-2xl font-bold text-gray-900">{data.uptime.current}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-green-600">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-green-600 bg-opacity-10">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">30-Day Uptime</p>
                  <h3 className="text-2xl font-bold text-gray-900">{data.uptime.percentage30Day}%</h3>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${data.uptime.percentage30Day}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-orange-600">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-orange-600 bg-opacity-10">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Incidents (30d)</p>
                  <h3 className="text-2xl font-bold text-gray-900">{data.uptime.incidentCount}</h3>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {data.incidents.filter(i => i.status !== 'resolved').length} currently active
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Server className="w-6 h-6 text-teal-600" />
            Service Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.services.map((service) => {
              const Icon = getServiceIcon(service.name);
              const colors = getStatusColor(service.status);
              
              return (
                <Card key={service.name} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colors.bg}`}>
                          <Icon className={`w-5 h-5 ${colors.icon}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-xs text-gray-500">{service.lastChecked}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.border} ${colors.text}`}>
                        {service.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Uptime</span>
                        <span className="font-semibold text-gray-900">{service.uptime}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Response Time</span>
                        <span className="font-semibold text-gray-900">{service.responseTime}ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-teal-600" />
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Server className="w-5 h-5 text-teal-600" />
                        <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{data.performance.cpu.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={data.performance.cpu} />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{data.performance.memory.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={data.performance.memory} />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{data.performance.disk.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={data.performance.disk} />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Network Traffic</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{data.performance.network.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={data.performance.network} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  Performance Trend (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-48 gap-1">
                  {data.performanceHistory.filter((_, i) => i % 2 === 0).map((item, idx) => {
                    const maxCpu = Math.max(...data.performanceHistory.map(d => d.cpu));
                    const height = (item.cpu / maxCpu) * 100;
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-xs font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.cpu.toFixed(0)}%
                        </div>
                        <div 
                          className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t transition-all hover:from-teal-700 hover:to-teal-500"
                          style={{ height: `${Math.max(height, 5)}%` }}
                          title={`${item.time}: CPU ${item.cpu.toFixed(1)}%, Memory ${item.memory.toFixed(1)}%`}
                        />
                        {idx % 3 === 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.time}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Recent Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.incidents.map((incident) => {
                const severityColors = getSeverityColor(incident.severity);
                const statusColors = getIncidentStatusColor(incident.status);
                
                return (
                  <div key={incident.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-gray-600">{incident.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${severityColors.bg} ${severityColors.border} ${severityColors.text}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors.bg} ${statusColors.border} ${statusColors.text}`}>
                            {incident.status}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{incident.title}</h4>
                        <p className="text-sm text-gray-600">
                          Affected: {incident.affectedServices.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{incident.timestamp}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {showAIReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                AI Diagnostics Report
              </CardTitle>
              <button
                onClick={() => setShowAIReport(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 leading-relaxed">
                {aiReport}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}

      {showAlertConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                Alert Configuration
              </CardTitle>
              <button
                onClick={() => setShowAlertConfig(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Alert Thresholds</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">CPU Usage Alert (%)</label>
                      <input type="number" defaultValue="80" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Memory Usage Alert (%)</label>
                      <input type="number" defaultValue="85" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Disk Usage Alert (%)</label>
                      <input type="number" defaultValue="90" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Response Time Alert (ms)</label>
                      <input type="number" defaultValue="500" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowAlertConfig(false)}>Cancel</Button>
                  <Button 
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => {
                      alert('Alert configuration saved! (This is a demo)');
                      setShowAlertConfig(false);
                    }}
                  >
                    Save Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
