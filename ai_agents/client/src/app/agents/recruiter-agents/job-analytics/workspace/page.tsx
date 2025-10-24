import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart, 
  TrendingUp,
  TrendingDown,
  Users, 
  Briefcase, 
  Clock, 
  Download, 
  Sparkles,
  Calendar,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type DateRange = '7d' | '30d' | '90d' | 'all';

interface JobAnalyticsData {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  avgTimeToHire: number;
  offerAcceptanceRate: number;
  topSource: string;
  trends: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    avgTimeToHire: number;
    offerAcceptanceRate: number;
  };
  applicationsOverTime: { date: string; count: number }[];
  applicationsBySource: { source: string; count: number; percentage: number }[];
  jobsByStatus: { status: string; count: number }[];
  timeToHireByRole: { role: string; days: number }[];
}

const generateMockData = (dateRange: DateRange): JobAnalyticsData => {
  const dataPoints = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 180;
  
  const applicationsOverTime = Array.from({ length: Math.min(dataPoints, 30) }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (dataPoints - i - 1));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: Math.floor(Math.random() * 50) + 20
    };
  });

  const sources = [
    { source: 'LinkedIn', count: 245, percentage: 42 },
    { source: 'Indeed', count: 168, percentage: 29 },
    { source: 'Referral', count: 95, percentage: 16 },
    { source: 'Company Website', count: 52, percentage: 9 },
    { source: 'Other', count: 23, percentage: 4 }
  ];

  const statuses = [
    { status: 'Open', count: 12 },
    { status: 'In Progress', count: 24 },
    { status: 'Interviewing', count: 18 },
    { status: 'Offer Extended', count: 6 },
    { status: 'Filled', count: 32 },
    { status: 'Closed', count: 8 }
  ];

  const roles = [
    { role: 'Software Engineer', days: 28 },
    { role: 'Product Manager', days: 35 },
    { role: 'Data Scientist', days: 42 },
    { role: 'UX Designer', days: 31 },
    { role: 'DevOps Engineer', days: 26 }
  ];

  return {
    totalJobs: 100,
    activeJobs: 60,
    totalApplications: 583,
    avgTimeToHire: 32,
    offerAcceptanceRate: 78,
    topSource: 'LinkedIn',
    trends: {
      totalJobs: 12,
      activeJobs: 8,
      totalApplications: 15,
      avgTimeToHire: -5,
      offerAcceptanceRate: 3
    },
    applicationsOverTime,
    applicationsBySource: sources,
    jobsByStatus: statuses,
    timeToHireByRole: roles
  };
};

export default function JobAnalyticsWorkspace() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [hasData] = useState(true);
  const [data, setData] = useState<JobAnalyticsData>(generateMockData(dateRange));

  const userId = 1;

  useEffect(() => {
    loadStats();
  }, [dateRange]);

  const loadStats = async () => {
    try {
      const [statsResponse, trendsResponse] = await Promise.all([
        fetch(`/api/agents/job-analytics/stats?userId=${userId}`),
        fetch(`/api/agents/job-analytics/trends?userId=${userId}`)
      ]);
      const stats = await statsResponse.json();
      const trends = await trendsResponse.json();
      
      const mockData = generateMockData(dateRange);
      
      const applicationsOverTime = trends && trends.length > 0 
        ? trends.map((t: any) => ({ date: t.month, count: t.applications }))
        : mockData.applicationsOverTime;
      
      setData({
        ...mockData,
        totalJobs: stats.totalJobs || mockData.totalJobs,
        activeJobs: stats.activeJobs || mockData.activeJobs,
        totalApplications: stats.totalApplications || mockData.totalApplications,
        applicationsOverTime,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      setData(generateMockData(dateRange));
    }
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      alert('AI Report generated! (This is a demo)');
    }, 2000);
  };

  const handleExportReport = () => {
    alert('Report exported! (This is a demo)');
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
    suffix = '',
    onClick
  }: { 
    icon: any; 
    title: string; 
    value: string | number; 
    trend: number; 
    color: string;
    suffix?: string;
    onClick?: () => void;
  }) => (
    <Card 
      className={`hover:shadow-lg transition-all ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <TrendIndicator value={trend} />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">
          {value}{suffix}
        </h3>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xs text-gray-500 mt-2">vs previous period</p>
      </CardContent>
    </Card>
  );

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center gap-4">
            <Link to="/agents/recruiter-agents/job-analytics" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Job Analytics</h1>
          </div>
          
          <Card className="h-96 flex items-center justify-center">
            <div className="text-center py-12 px-6">
              <BarChart className="w-20 h-20 text-green-200 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Not Enough Data Yet
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Start posting jobs and collecting applications to see analytics and insights here.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/agents/recruiter-agents/job-analytics" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Analytics Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Comprehensive insights into your recruitment pipeline</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
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
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-green-50 transition ${
                        dateRange === range ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
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
              onClick={handleExportReport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <Button
              onClick={handleGenerateReport}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              disabled={isGeneratingReport}
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingReport ? 'animate-spin' : ''}`} />
              {isGeneratingReport ? 'Generating...' : 'Generate Report with AI'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KPICard
            icon={Briefcase}
            title="Total Jobs"
            value={data.totalJobs}
            trend={data.trends.totalJobs}
            color="text-blue-600"
            onClick={() => setExpandedMetric(expandedMetric === 'totalJobs' ? null : 'totalJobs')}
          />
          
          <KPICard
            icon={Target}
            title="Active Jobs"
            value={data.activeJobs}
            trend={data.trends.activeJobs}
            color="text-green-600"
            onClick={() => setExpandedMetric(expandedMetric === 'activeJobs' ? null : 'activeJobs')}
          />
          
          <KPICard
            icon={Users}
            title="Total Applications"
            value={data.totalApplications}
            trend={data.trends.totalApplications}
            color="text-purple-600"
            onClick={() => setExpandedMetric(expandedMetric === 'totalApplications' ? null : 'totalApplications')}
          />
          
          <KPICard
            icon={Clock}
            title="Avg Time to Hire"
            value={data.avgTimeToHire}
            trend={data.trends.avgTimeToHire}
            color="text-orange-600"
            suffix=" days"
            onClick={() => setExpandedMetric(expandedMetric === 'avgTimeToHire' ? null : 'avgTimeToHire')}
          />
          
          <KPICard
            icon={Award}
            title="Offer Acceptance Rate"
            value={data.offerAcceptanceRate}
            trend={data.trends.offerAcceptanceRate}
            color="text-teal-600"
            suffix="%"
            onClick={() => setExpandedMetric(expandedMetric === 'offerAcceptanceRate' ? null : 'offerAcceptanceRate')}
          />
          
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-pink-600 bg-opacity-10">
                  <TrendingUp className="w-6 h-6 text-pink-600" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Top Source</div>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {data.topSource}
              </h3>
              <p className="text-sm text-gray-600">Primary talent source</p>
              <p className="text-xs text-gray-500 mt-2">
                {data.applicationsBySource[0].percentage}% of applications
              </p>
            </CardContent>
          </Card>
        </div>

        {expandedMetric && (
          <Card className="mb-8 border-2 border-green-500">
            <CardHeader className="bg-green-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-green-600" />
                  Detailed Breakdown: {expandedMetric.replace(/([A-Z])/g, ' $1').trim()}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedMetric(null)}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">
                This metric shows strong performance compared to the previous period. 
                {expandedMetric === 'avgTimeToHire' && ' Reducing time to hire improves candidate experience and reduces opportunity costs.'}
                {expandedMetric === 'offerAcceptanceRate' && ' High acceptance rates indicate competitive offers and positive candidate experiences.'}
                {expandedMetric === 'totalApplications' && ' Increasing applications suggest strong employer branding and effective job postings.'}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Applications Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end justify-between h-48 gap-1">
                  {data.applicationsOverTime.map((item, idx) => {
                    const maxCount = Math.max(...data.applicationsOverTime.map(d => d.count));
                    const height = (item.count / maxCount) * 100;
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-xs font-medium text-green-600">
                          {item.count}
                        </div>
                        <div 
                          className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all hover:from-green-700 hover:to-green-500"
                          style={{ height: `${height}%` }}
                          title={`${item.date}: ${item.count} applications`}
                        />
                        <div className="text-xs text-gray-500 rotate-45 origin-top-left mt-8">
                          {item.date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-purple-600" />
                Applications by Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.applicationsBySource.map((item, idx) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{item.source}</span>
                        <span className="text-sm text-gray-600">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full ${colors[idx]} transition-all`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Jobs by Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.jobsByStatus.map((item, idx) => {
                  const maxCount = Math.max(...data.jobsByStatus.map(s => s.count));
                  const width = (item.count / maxCount) * 100;
                  const colors = [
                    'bg-green-500',
                    'bg-blue-500',
                    'bg-purple-500',
                    'bg-orange-500',
                    'bg-teal-500',
                    'bg-gray-500'
                  ];
                  
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-32 text-sm font-medium text-gray-700">
                        {item.status}
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                          <div 
                            className={`h-full ${colors[idx]} flex items-center justify-end pr-3 transition-all`}
                            style={{ width: `${Math.max(width, 15)}%` }}
                          >
                            <span className="text-sm font-bold text-white">{item.count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Time to Hire by Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.timeToHireByRole.map((item, idx) => {
                  const maxDays = Math.max(...data.timeToHireByRole.map(r => r.days));
                  const width = (item.days / maxDays) * 100;
                  const getColor = (days: number) => {
                    if (days < 30) return 'bg-green-500';
                    if (days < 40) return 'bg-yellow-500';
                    return 'bg-red-500';
                  };
                  
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-40 text-sm font-medium text-gray-700 truncate">
                        {item.role}
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                          <div 
                            className={`h-full ${getColor(item.days)} flex items-center justify-end pr-3 transition-all`}
                            style={{ width: `${Math.max(width, 20)}%` }}
                          >
                            <span className="text-sm font-bold text-white">{item.days}d</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>&lt; 30 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>30-40 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>&gt; 40 days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
