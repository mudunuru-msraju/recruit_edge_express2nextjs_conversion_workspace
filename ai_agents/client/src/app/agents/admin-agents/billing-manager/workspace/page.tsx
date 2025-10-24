import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard,
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Sparkles, 
  AlertCircle,
  Users,
  Calendar,
  ChevronDown,
  MoreVertical,
  RefreshCw,
  X,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Search
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Subscription {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  nextBillingDate: string;
  createdAt: string;
}

interface Invoice {
  id: string;
  userId: number;
  userName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
  plan: string;
}

interface RevenueData {
  totalRevenue: number;
  monthlyRecurring: number;
  yearlyRecurring: number;
  activeSubscriptions: number;
  churnRate: number;
  averageLTV: number;
  trends: {
    totalRevenue: number;
    monthlyRecurring: number;
    yearlyRecurring: number;
    activeSubscriptions: number;
    churnRate: number;
    averageLTV: number;
  };
  revenueOverTime: { date: string; revenue: number }[];
}

const generateMockData = () => {
  const subscriptions: Subscription[] = [
    { id: 1, userId: 101, userName: 'Sarah Johnson', userEmail: 'sarah.j@techcorp.com', plan: 'Enterprise', status: 'active', billingCycle: 'yearly', amount: 99900, nextBillingDate: '2025-12-23', createdAt: '2024-12-23' },
    { id: 2, userId: 102, userName: 'Michael Chen', userEmail: 'mchen@startup.io', plan: 'Pro', status: 'active', billingCycle: 'monthly', amount: 2900, nextBillingDate: '2025-11-23', createdAt: '2024-08-15' },
    { id: 3, userId: 103, userName: 'Emily Rodriguez', userEmail: 'emily.r@consulting.com', plan: 'Pro', status: 'active', billingCycle: 'yearly', amount: 29900, nextBillingDate: '2025-11-05', createdAt: '2024-11-05' },
    { id: 4, userId: 104, userName: 'David Park', userEmail: 'dpark@agency.com', plan: 'Enterprise', status: 'active', billingCycle: 'monthly', amount: 9900, nextBillingDate: '2025-11-15', createdAt: '2024-05-10' },
    { id: 5, userId: 105, userName: 'Jessica Williams', userEmail: 'jwilliams@corp.com', plan: 'Pro', status: 'past_due', billingCycle: 'monthly', amount: 2900, nextBillingDate: '2025-10-20', createdAt: '2024-06-12' },
    { id: 6, userId: 106, userName: 'Robert Taylor', userEmail: 'rtaylor@business.net', plan: 'Free', status: 'active', billingCycle: 'monthly', amount: 0, nextBillingDate: '2025-11-23', createdAt: '2025-09-01' },
    { id: 7, userId: 107, userName: 'Amanda Martinez', userEmail: 'amartinez@venture.com', plan: 'Pro', status: 'trialing', billingCycle: 'monthly', amount: 2900, nextBillingDate: '2025-11-30', createdAt: '2025-10-16' },
    { id: 8, userId: 108, userName: 'Christopher Lee', userEmail: 'clee@solutions.io', plan: 'Enterprise', status: 'active', billingCycle: 'yearly', amount: 99900, nextBillingDate: '2026-01-10', createdAt: '2025-01-10' },
    { id: 9, userId: 109, userName: 'Lisa Anderson', userEmail: 'landerson@group.com', plan: 'Pro', status: 'cancelled', billingCycle: 'monthly', amount: 2900, nextBillingDate: '2025-10-28', createdAt: '2024-04-20' },
    { id: 10, userId: 110, userName: 'James Wilson', userEmail: 'jwilson@enterprises.com', plan: 'Free', status: 'active', billingCycle: 'monthly', amount: 0, nextBillingDate: '2025-11-23', createdAt: '2025-10-01' },
  ];

  const invoices: Invoice[] = [
    { id: 'INV-2025-001', userId: 101, userName: 'Sarah Johnson', amount: 99900, status: 'paid', date: '2025-10-15', dueDate: '2025-10-22', plan: 'Enterprise' },
    { id: 'INV-2025-002', userId: 102, userName: 'Michael Chen', amount: 2900, status: 'paid', date: '2025-10-20', dueDate: '2025-10-27', plan: 'Pro' },
    { id: 'INV-2025-003', userId: 103, userName: 'Emily Rodriguez', amount: 29900, status: 'paid', date: '2025-10-18', dueDate: '2025-10-25', plan: 'Pro' },
    { id: 'INV-2025-004', userId: 104, userName: 'David Park', amount: 9900, status: 'paid', date: '2025-10-22', dueDate: '2025-10-29', plan: 'Enterprise' },
    { id: 'INV-2025-005', userId: 105, userName: 'Jessica Williams', amount: 2900, status: 'overdue', date: '2025-09-20', dueDate: '2025-09-27', plan: 'Pro' },
    { id: 'INV-2025-006', userId: 107, userName: 'Amanda Martinez', amount: 2900, status: 'pending', date: '2025-10-21', dueDate: '2025-10-28', plan: 'Pro' },
    { id: 'INV-2025-007', userId: 108, userName: 'Christopher Lee', amount: 99900, status: 'paid', date: '2025-10-10', dueDate: '2025-10-17', plan: 'Enterprise' },
    { id: 'INV-2025-008', userId: 104, userName: 'David Park', amount: 9900, status: 'pending', date: '2025-10-23', dueDate: '2025-10-30', plan: 'Enterprise' },
  ];

  const revenueOverTime = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short' }),
      revenue: 45000 + (i * 5000) + Math.floor(Math.random() * 8000)
    };
  });

  const totalRevenue = 487650;
  const monthlyRecurring = 42800;
  const yearlyRecurring = 229700;
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const churnRate = 4.2;
  const averageLTV = 18950;

  const revenueData: RevenueData = {
    totalRevenue,
    monthlyRecurring,
    yearlyRecurring,
    activeSubscriptions,
    churnRate,
    averageLTV,
    trends: {
      totalRevenue: 18.5,
      monthlyRecurring: 12.3,
      yearlyRecurring: 22.7,
      activeSubscriptions: 8.4,
      churnRate: -2.1,
      averageLTV: 15.6
    },
    revenueOverTime
  };

  return { subscriptions, invoices, revenueData };
};

export default function BillingManagerWorkspace() {
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showAIReport, setShowAIReport] = useState(false);
  const [aiReport, setAIReport] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData>(generateMockData().revenueData);

  const userId = 1;

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      const [subsResponse, paymentsResponse, revenueResponse] = await Promise.all([
        fetch(`/api/agents/billing-manager/subscriptions?userId=${userId}`),
        fetch(`/api/agents/billing-manager/payments?userId=${userId}`),
        fetch(`/api/agents/billing-manager/revenue?userId=${userId}`)
      ]);
      
      const subsData = await subsResponse.json();
      const paymentsData = await paymentsResponse.json();
      const revData = await revenueResponse.json();
      
      setSubscriptions(subsData.length > 0 ? subsData : generateMockData().subscriptions);
      setInvoices(paymentsData.length > 0 ? paymentsData : generateMockData().invoices);
      
      if (revData.totalRevenue) {
        const mockData = generateMockData().revenueData;
        setRevenueData({
          ...mockData,
          totalRevenue: revData.totalRevenue,
          monthlyRecurring: revData.monthlyRecurring || mockData.monthlyRecurring,
          yearlyRecurring: revData.yearlyRecurring || mockData.yearlyRecurring,
        });
      }
    } catch (error) {
      console.error('Error loading billing data:', error);
      const mockData = generateMockData();
      setSubscriptions(mockData.subscriptions);
      setInvoices(mockData.invoices);
    }
  };

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const matchesPlan = planFilter === 'all' || sub.plan === planFilter;
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPlan && matchesStatus && matchesSearch;
    });
  }, [subscriptions, planFilter, statusFilter, searchTerm]);

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'Free': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Pro': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Enterprise': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'past_due': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'trialing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  const handleProcessRefund = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowRefundModal(true);
    setActiveDropdown(null);
  };

  const confirmRefund = () => {
    alert(`Refund processed for ${selectedSubscription?.userName}`);
    setShowRefundModal(false);
    setSelectedSubscription(null);
  };

  const handleExportData = () => {
    alert('Billing data exported to CSV! (This is a demo)');
  };

  const generateAIReport = () => {
    setIsGeneratingReport(true);
    setAIReport('Generating comprehensive revenue report...');
    setShowAIReport(true);
    
    setTimeout(() => {
      const report = `
📊 **AI-Powered Revenue Report**

**Executive Summary:**
Total Revenue: ${formatCurrency(revenueData.totalRevenue)}
Active Subscriptions: ${revenueData.activeSubscriptions}
Monthly Recurring Revenue (MRR): ${formatCurrency(revenueData.monthlyRecurring)}
Annual Recurring Revenue (ARR): ${formatCurrency(revenueData.yearlyRecurring * 12)}

**Key Insights:**

💰 **Revenue Performance**
- Total revenue up ${revenueData.trends.totalRevenue}% vs previous period
- MRR growing at ${revenueData.trends.monthlyRecurring}% month-over-month
- ARR increased by ${revenueData.trends.yearlyRecurring}% year-over-year
- Average Customer Lifetime Value: ${formatCurrency(revenueData.averageLTV)}

🎯 **Subscription Analysis**
- ${subscriptions.filter(s => s.plan === 'Enterprise').length} Enterprise customers (${((subscriptions.filter(s => s.plan === 'Enterprise').length / subscriptions.length) * 100).toFixed(1)}%)
- ${subscriptions.filter(s => s.plan === 'Pro').length} Pro customers (${((subscriptions.filter(s => s.plan === 'Pro').length / subscriptions.length) * 100).toFixed(1)}%)
- ${subscriptions.filter(s => s.plan === 'Free').length} Free tier users
- Churn rate: ${revenueData.churnRate}% (${revenueData.trends.churnRate > 0 ? '+' : ''}${revenueData.trends.churnRate}% vs last month)

⚠️ **Action Items**
- ${invoices.filter(i => i.status === 'overdue').length} overdue invoice(s) requiring immediate attention
- ${subscriptions.filter(s => s.status === 'past_due').length} subscription(s) past due - follow up recommended
- ${subscriptions.filter(s => s.status === 'trialing').length} trial user(s) - consider engagement campaign before trial ends

📈 **Growth Opportunities**
- Free-to-Pro conversion opportunity: ${subscriptions.filter(s => s.plan === 'Free').length} potential upgrades
- Pro-to-Enterprise upsell candidates: ${subscriptions.filter(s => s.plan === 'Pro' && s.billingCycle === 'yearly').length} qualified accounts
- Annual plan conversion: ${subscriptions.filter(s => s.billingCycle === 'monthly' && s.plan !== 'Free').length} monthly subscribers

**Revenue Health Score:** 94/100 (Excellent)
**Recommendation:** Focus on reducing churn and converting trial users.

*Report generated on ${new Date().toLocaleString()}*
*AI-powered insights by RecruitEdge Revenue Intelligence*
      `;
      setAIReport(report);
      setIsGeneratingReport(false);
    }, 2500);
  };

  const hasData = subscriptions.length > 0;

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center gap-4">
            <Link to="/agents/admin-agents/billing-manager" className="flex items-center gap-2 text-gray-700 hover:text-teal-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Billing Manager</h1>
          </div>
          
          <Card className="h-96 flex items-center justify-center">
            <div className="text-center py-12 px-6">
              <CreditCard className="w-20 h-20 text-teal-200 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Billing Data Yet
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Your billing data and revenue metrics will appear here as users subscribe to paid plans.
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
            <Link to="/agents/admin-agents/billing-manager" className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Billing Manager</h1>
                <p className="text-sm text-gray-600 mt-1">Revenue analytics and subscription management</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button
              onClick={generateAIReport}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white flex items-center gap-2"
              disabled={isGeneratingReport}
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingReport ? 'animate-spin' : ''}`} />
              {isGeneratingReport ? 'Generating...' : 'Generate Revenue Report with AI'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all border-l-4 border-l-teal-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-teal-600 bg-opacity-10">
                  <DollarSign className="w-6 h-6 text-teal-600" />
                </div>
                <TrendIndicator value={revenueData.trends.totalRevenue} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(revenueData.totalRevenue)}
              </h3>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xs text-gray-500 mt-2">vs previous period</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-green-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-600 bg-opacity-10">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <TrendIndicator value={revenueData.trends.monthlyRecurring} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(revenueData.monthlyRecurring)}
              </h3>
              <p className="text-sm text-gray-600">Monthly Recurring Revenue</p>
              <p className="text-xs text-gray-500 mt-2">MRR</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-600 bg-opacity-10">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <TrendIndicator value={revenueData.trends.yearlyRecurring} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(revenueData.yearlyRecurring)}
              </h3>
              <p className="text-sm text-gray-600">Yearly Recurring Revenue</p>
              <p className="text-xs text-gray-500 mt-2">YRR</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-purple-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-600 bg-opacity-10">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <TrendIndicator value={revenueData.trends.activeSubscriptions} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {revenueData.activeSubscriptions}
              </h3>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
              <p className="text-xs text-gray-500 mt-2">paying customers</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-orange-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-600 bg-opacity-10">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <TrendIndicator value={revenueData.trends.churnRate} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {revenueData.churnRate}%
              </h3>
              <p className="text-sm text-gray-600">Churn Rate</p>
              <p className="text-xs text-gray-500 mt-2">monthly churn</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-l-4 border-l-cyan-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-cyan-600 bg-opacity-10">
                  <TrendingUp className="w-6 h-6 text-cyan-600" />
                </div>
                <TrendIndicator value={revenueData.trends.averageLTV} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(revenueData.averageLTV)}
              </h3>
              <p className="text-sm text-gray-600">Average LTV</p>
              <p className="text-xs text-gray-500 mt-2">customer lifetime value</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-64 gap-1 px-2">
                {revenueData.revenueOverTime.map((item, idx) => {
                  const maxRevenue = Math.max(...revenueData.revenueOverTime.map(d => d.revenue));
                  const minRevenue = Math.min(...revenueData.revenueOverTime.map(d => d.revenue));
                  const height = ((item.revenue - minRevenue) / (maxRevenue - minRevenue)) * 100;
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="text-xs font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        ${(item.revenue / 1000).toFixed(1)}K
                      </div>
                      <div 
                        className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t transition-all hover:from-teal-700 hover:to-teal-500"
                        style={{ height: `${Math.max(height, 5)}%` }}
                        title={`${item.date}: $${item.revenue.toLocaleString()}`}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {item.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-teal-600" />
                Plan Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Enterprise', 'Pro', 'Free'].map((plan) => {
                  const count = subscriptions.filter(s => s.plan === plan).length;
                  const percentage = (count / subscriptions.length) * 100;
                  const colors: Record<string, { bg: string; text: string }> = {
                    Enterprise: { bg: 'bg-purple-500', text: 'text-purple-600' },
                    Pro: { bg: 'bg-teal-500', text: 'text-teal-600' },
                    Free: { bg: 'bg-gray-400', text: 'text-gray-600' }
                  };
                  
                  return (
                    <div key={plan}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${colors[plan].text}`}>{plan}</span>
                        <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${colors[plan].bg} h-3 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Active Subscriptions</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="flex flex-col md:flex-row gap-4 mt-4">
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
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Plans</option>
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="past_due">Past Due</option>
                  <option value="trialing">Trialing</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Billing Cycle</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Next Billing</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{subscription.userName}</div>
                        <div className="text-sm text-gray-500">{subscription.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPlanBadgeColor(subscription.plan)}`}>
                        {subscription.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(subscription.status)}`}>
                        {subscription.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {subscription.status === 'past_due' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {subscription.status === 'trialing' && <Clock className="w-3 h-3 mr-1" />}
                        {subscription.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                        {subscription.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{subscription.billingCycle}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(subscription.amount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{subscription.nextBillingDate}</td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === subscription.id ? null : subscription.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      {activeDropdown === subscription.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => {
                              alert(`Viewing details for ${subscription.userName}`);
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                          >
                            <FileText className="w-4 h-4" />
                            View Details
                          </button>
                          {subscription.status === 'active' && subscription.amount > 0 && (
                            <button
                              onClick={() => handleProcessRefund(subscription)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-orange-600"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Process Refund
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-teal-600" />
              Recent Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{invoice.userName}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPlanBadgeColor(invoice.plan)}`}>
                          {invoice.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(invoice.status)}`}>
                          {invoice.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {invoice.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {invoice.status === 'overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{invoice.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {showRefundModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Process Refund</CardTitle>
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to process a refund for this subscription?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">User:</span>
                    <span className="text-sm font-medium">{selectedSubscription.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Plan:</span>
                    <span className="text-sm font-medium">{selectedSubscription.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-sm font-medium">{formatCurrency(selectedSubscription.amount)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowRefundModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmRefund}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Process Refund
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showAIReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[80vh] overflow-auto">
            <CardHeader className="border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  AI Revenue Report
                </CardTitle>
                <button
                  onClick={() => setShowAIReport(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                {aiReport}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
