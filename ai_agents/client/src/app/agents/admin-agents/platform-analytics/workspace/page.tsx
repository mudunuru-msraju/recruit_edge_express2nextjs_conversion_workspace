import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp,
  TrendingDown,
  DollarSign, 
  Users, 
  Briefcase, 
  Activity,
  Globe,
  Download, 
  Sparkles,
  Calendar,
  ChevronDown,
  FileCheck,
  Zap,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type DateRange = '7d' | '30d' | '90d' | 'all';

interface PlatformAnalyticsData {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  platformRevenue: number;
  activeSessions: number;
  systemHealth: number;
  trends: {
    totalUsers: number;
    totalJobs: number;
    totalApplications: number;
    platformRevenue: number;
    activeSessions: number;
    systemHealth: number;
  };
  userGrowth: { date: string; users: number }[];
  jobsByCategory: { category: string; count: number; percentage: number }[];
  revenueOverTime: { date: string; revenue: number }[];
  geographicDistribution: { country: string; users: number }[];
}

const generateMockData = (dateRange: DateRange): PlatformAnalyticsData => {
  const dataPoints = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 180;
  
  const userGrowth = Array.from({ length: Math.min(dataPoints, 30) }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (dataPoints - i - 1));
    const baseUsers = 5000 + (i * 150);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: baseUsers + Math.floor(Math.random() * 200)
    };
  });

  const revenueOverTime = Array.from({ length: Math.min(dataPoints, 30) }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (dataPoints - i - 1));
    const baseRevenue = 25000 + (i * 800);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: baseRevenue + Math.floor(Math.random() * 3000)
    };
  });

  const jobsByCategory = [
    { category: 'Technology', count: 1245, percentage: 35 },
    { category: 'Healthcare', count: 892, percentage: 25 },
    { category: 'Finance', count: 623, percentage: 18 },
    { category: 'Education', count: 445, percentage: 13 },
    { category: 'Manufacturing', count: 320, percentage: 9 }
  ];

  const geographicDistribution = [
    { country: 'United States', users: 12450 },
    { country: 'United Kingdom', users: 8920 },
    { country: 'Canada', users: 6230 },
    { country: 'Australia', users: 4450 },
    { country: 'Germany', users: 3890 },
    { country: 'India', users: 3200 },
    { country: 'France', users: 2850 }
  ];

  return {
    totalUsers: 45820,
    totalJobs: 3525,
    totalApplications: 28640,
    platformRevenue: 847500,
    activeSessions: 1834,
    systemHealth: 98.5,
    trends: {
      totalUsers: 12.5,
      totalJobs: 8.3,
      totalApplications: 15.7,
      platformRevenue: 22.4,
      activeSessions: 5.2,
      systemHealth: 0.3
    },
    userGrowth,
    jobsByCategory,
    revenueOverTime,
    geographicDistribution
  };
};

export default function PlatformAnalyticsWorkspace() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [hasData] = useState(true);
  const [data, setData] = useState<PlatformAnalyticsData>(generateMockData(dateRange));

  const userId = 1;

  useEffect(() => {
    loadOverview();
  }, [dateRange]);

  const loadOverview = async () => {
    try {
      const response = await fetch(`/api/agents/platform-analytics/overview?userId=${userId}`);
      const overview = await response.json();
      
      const mockData = generateMockData(dateRange);
      setData({
        ...mockData,
        totalUsers: overview.totalUsers || mockData.totalUsers,
        totalJobs: overview.totalJobs || mockData.totalJobs,
        totalApplications: overview.totalApplications || mockData.totalApplications,
      });
    } catch (error) {
      console.error('Error loading overview:', error);
      setData(generateMockData(dateRange));
    }
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      alert('AI-powered analytics report generated! (This is a demo)');
    }, 2000);
  };

  const handleExportDashboard = () => {
    alert('Dashboard exported as PDF! (This is a demo)');
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      case 'all': return 'All Time';
    }
  };

  const TrendIndicator = ({ value }: { value: number }) => {
    const isPositive = value > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${color}`}>
        <Icon className="w-4 h-4" />
        <span>{Math.abs(value)}%</span>
      </div>
    );
  };

  const KPICard = ({ 
    icon: Icon, 
    title, 
    value, 
    trend, 
    color,
    prefix = '',
    suffix = ''
  }: { 
    icon: any; 
    title: string; 
    value: string | number; 
    trend: number; 
    color: string;
    prefix?: string;
    suffix?: string;
  }) => (
    <Card className="hover:shadow-lg transition-all border-l-4 border-l-teal-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <TrendIndicator value={trend} />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">
          {prefix}{typeof value === 'number' && value >= 1000 ? value.toLocaleString() : value}{suffix}
        </h3>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xs text-gray-500 mt-2">vs previous period</p>
      </CardContent>
    </Card>
  );

  const HealthIndicator = ({ health }: { health: number }) => {
    let icon, color, label;
    if (health >= 95) {
      icon = CheckCircle;
      color = 'text-green-600';
      label = 'Excellent';
    } else if (health >= 80) {
      icon = AlertCircle;
      color = 'text-yellow-600';
      label = 'Good';
    } else {
      icon = XCircle;
      color = 'text-red-600';
      label = 'Critical';
    }
    const Icon = icon;
    return (
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className={`text-sm font-medium ${color}`}>{label}</span>
      </div>
    );
  };

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center gap-4">
            <Link to="/agents/admin-agents/platform-analytics" className="flex items-center gap-2 text-gray-700 hover:text-teal-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          </div>
          
          <Card className="h-96 flex items-center justify-center">
            <div className="text-center py-12 px-6">
              <Activity className="w-20 h-20 text-teal-200 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Collecting Data
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Your platform analytics will appear here as users engage with the system.
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
            <Link to="/agents/admin-agents/platform-analytics" className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Analytics Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Comprehensive insights into platform performance</p>
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

            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {getDateRangeLabel()}
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showDatePicker && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  {(['7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setDateRange(range);
                        setShowDatePicker(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-teal-50 transition ${
                        dateRange === range ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {range === '7d' && 'Last 7 Days'}
                      {range === '30d' && 'Last 30 Days'}
                      {range === '90d' && 'Last 90 Days'}
                      {range === 'all' && 'All Time'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              onClick={handleExportDashboard}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <Button
              onClick={handleGenerateReport}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white flex items-center gap-2"
              disabled={isGeneratingReport}
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingReport ? 'animate-spin' : ''}`} />
              {isGeneratingReport ? 'Generating...' : 'Generate Analytics Report with AI'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KPICard
            icon={Users}
            title="Total Users"
            value={data.totalUsers}
            trend={data.trends.totalUsers}
            color="text-teal-600"
          />
          
          <KPICard
            icon={Briefcase}
            title="Total Jobs"
            value={data.totalJobs}
            trend={data.trends.totalJobs}
            color="text-blue-600"
          />
          
          <KPICard
            icon={FileCheck}
            title="Total Applications"
            value={data.totalApplications}
            trend={data.trends.totalApplications}
            color="text-purple-600"
          />
          
          <KPICard
            icon={DollarSign}
            title="Platform Revenue"
            value={(data.platformRevenue / 1000).toFixed(1)}
            trend={data.trends.platformRevenue}
            color="text-green-600"
            prefix="$"
            suffix="K"
          />
          
          <KPICard
            icon={Activity}
            title="Active Sessions"
            value={data.activeSessions}
            trend={data.trends.activeSessions}
            color="text-orange-600"
          />
          
          <Card className="hover:shadow-lg transition-all border-l-4 border-l-teal-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-teal-600 bg-opacity-10">
                  <Activity className="w-6 h-6 text-teal-600" />
                </div>
                <TrendIndicator value={data.trends.systemHealth} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {data.systemHealth}%
              </h3>
              <p className="text-sm text-gray-600">System Health</p>
              <div className="mt-3">
                <HealthIndicator health={data.systemHealth} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                User Growth Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end justify-between h-56 gap-1 px-2">
                  {data.userGrowth.map((item, idx) => {
                    const maxUsers = Math.max(...data.userGrowth.map(d => d.users));
                    const minUsers = Math.min(...data.userGrowth.map(d => d.users));
                    const height = ((item.users - minUsers) / (maxUsers - minUsers)) * 100;
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-xs font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.users.toLocaleString()}
                        </div>
                        <div 
                          className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t transition-all hover:from-teal-700 hover:to-teal-500"
                          style={{ height: `${Math.max(height, 5)}%` }}
                          title={`${item.date}: ${item.users.toLocaleString()} users`}
                        />
                        {idx % Math.floor(data.userGrowth.length / 6) === 0 && (
                          <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                            {item.date}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Jobs by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {data.jobsByCategory.map((item, idx) => {
                    const colors = [
                      { bg: 'bg-teal-500', text: 'text-teal-600', light: 'bg-teal-100' },
                      { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100' },
                      { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-100' },
                      { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-100' },
                      { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-100' }
                    ];
                    const color = colors[idx];
                    
                    return (
                      <div key={idx} className={`p-3 rounded-lg ${color.light} border border-gray-200`}>
                        <div className={`text-xs font-medium ${color.text} mb-1`}>
                          {item.category}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {item.count.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {item.percentage}% of total
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-center gap-8 pt-4 border-t border-gray-200">
                  <div className="relative w-40 h-40">
                    <svg className="transform -rotate-90 w-full h-full">
                      {data.jobsByCategory.map((item, idx) => {
                        const colors = ['#14b8a6', '#3b82f6', '#a855f7', '#f97316', '#ec4899'];
                        let currentAngle = 0;
                        data.jobsByCategory.slice(0, idx).forEach(i => {
                          currentAngle += (i.percentage / 100) * 360;
                        });
                        const angle = (item.percentage / 100) * 360;
                        const radius = 60;
                        const circumference = 2 * Math.PI * radius;
                        const dashArray = (angle / 360) * circumference;
                        const dashOffset = -currentAngle / 360 * circumference;
                        
                        return (
                          <circle
                            key={idx}
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="none"
                            stroke={colors[idx]}
                            strokeWidth="24"
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={dashOffset}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {data.jobsByCategory.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end justify-between h-56 gap-1 px-2">
                  {data.revenueOverTime.map((item, idx) => {
                    const maxRevenue = Math.max(...data.revenueOverTime.map(d => d.revenue));
                    const minRevenue = Math.min(...data.revenueOverTime.map(d => d.revenue));
                    const height = ((item.revenue - minRevenue) / (maxRevenue - minRevenue)) * 100;
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="text-xs font-medium text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          ${(item.revenue / 1000).toFixed(1)}K
                        </div>
                        <div 
                          className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all hover:from-green-700 hover:to-green-500"
                          style={{ height: `${Math.max(height, 5)}%` }}
                          title={`${item.date}: $${item.revenue.toLocaleString()}`}
                        />
                        {idx % Math.floor(data.revenueOverTime.length / 6) === 0 && (
                          <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                            {item.date}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Total Revenue: <span className="font-bold text-green-600">${data.platformRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+{data.trends.platformRevenue}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-teal-600" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.geographicDistribution.map((item, idx) => {
                  const maxUsers = Math.max(...data.geographicDistribution.map(d => d.users));
                  const width = (item.users / maxUsers) * 100;
                  const colors = [
                    'bg-teal-500',
                    'bg-blue-500',
                    'bg-purple-500',
                    'bg-cyan-500',
                    'bg-indigo-500',
                    'bg-sky-500',
                    'bg-emerald-500'
                  ];
                  
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-32 text-sm font-medium text-gray-700 truncate">
                        {item.country}
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                          <div 
                            className={`h-full ${colors[idx]} flex items-center justify-end pr-3 transition-all`}
                            style={{ width: `${Math.max(width, 15)}%` }}
                          >
                            <span className="text-sm font-bold text-white">
                              {item.users.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Total Global Users: <span className="font-bold text-teal-600">
                    {data.geographicDistribution.reduce((sum, item) => sum + item.users, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
