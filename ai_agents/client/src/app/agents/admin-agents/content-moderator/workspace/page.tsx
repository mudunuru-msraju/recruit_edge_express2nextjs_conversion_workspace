import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Ban,
  Eye,
  Sparkles,
  FileText,
  Briefcase,
  User,
  Clock,
  Filter,
  Search,
  AlertOctagon,
  Flag,
  MessageSquare,
  History,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ContentType = 'resume' | 'job' | 'profile';
type FlagStatus = 'pending' | 'approved' | 'removed' | 'spam';
type Severity = 'high' | 'medium' | 'low';

interface FlaggedContent {
  id: string;
  contentType: ContentType;
  contentId: string;
  title: string;
  reason: string;
  severity: Severity;
  reporter: string;
  reportedAt: string;
  status: FlagStatus;
  content: string;
  contentPreview: string;
}

interface AISuggestion {
  action: 'approve' | 'remove' | 'spam' | 'request_changes' | 'ban_user';
  confidence: number;
  reasoning: string;
}

interface ModerationHistory {
  id: string;
  contentId: string;
  action: string;
  moderator: string;
  timestamp: string;
  notes?: string;
}

const mockFlaggedContent: FlaggedContent[] = [
  {
    id: 'flag-1',
    contentType: 'resume',
    contentId: 'resume-001',
    title: 'Senior Software Engineer Resume',
    reason: 'Inappropriate language',
    severity: 'high',
    reporter: 'AutoMod System',
    reportedAt: '2025-10-23T08:30:00',
    status: 'pending',
    content: 'Full resume content with inappropriate language detected in the summary section...',
    contentPreview: 'John Doe - Senior Software Engineer with 10+ years experience...'
  },
  {
    id: 'flag-2',
    contentType: 'job',
    contentId: 'job-045',
    title: 'Frontend Developer Position',
    reason: 'Discriminatory content',
    severity: 'high',
    reporter: 'user@example.com',
    reportedAt: '2025-10-23T07:15:00',
    status: 'pending',
    content: 'Job posting content with potential discriminatory language...',
    contentPreview: 'Looking for a Frontend Developer to join our team...'
  },
  {
    id: 'flag-3',
    contentType: 'profile',
    contentId: 'profile-129',
    title: 'User Profile: Jane Smith',
    reason: 'Spam content',
    severity: 'medium',
    reporter: 'moderator@recruitedge.com',
    reportedAt: '2025-10-23T06:45:00',
    status: 'pending',
    content: 'Profile contains multiple external links and promotional content...',
    contentPreview: 'Professional marketer with extensive experience...'
  },
  {
    id: 'flag-4',
    contentType: 'resume',
    contentId: 'resume-089',
    title: 'Marketing Manager Resume',
    reason: 'False credentials',
    severity: 'medium',
    reporter: 'verification@recruitedge.com',
    reportedAt: '2025-10-22T15:20:00',
    status: 'approved',
    content: 'Resume verified and credentials confirmed as accurate...',
    contentPreview: 'Marketing Manager with proven track record...'
  },
  {
    id: 'flag-5',
    contentType: 'job',
    contentId: 'job-078',
    title: 'Data Analyst Opening',
    reason: 'Scam/Phishing',
    severity: 'high',
    reporter: 'security@recruitedge.com',
    reportedAt: '2025-10-22T14:00:00',
    status: 'removed',
    content: 'Job posting removed due to verified scam attempt...',
    contentPreview: 'Data Analyst needed urgently. Send payment for background check...'
  },
  {
    id: 'flag-6',
    contentType: 'profile',
    contentId: 'profile-256',
    title: 'User Profile: Bob Wilson',
    reason: 'Harassment',
    severity: 'high',
    reporter: 'user-complaint@recruitedge.com',
    reportedAt: '2025-10-22T12:30:00',
    status: 'removed',
    content: 'Profile removed for violating community guidelines on harassment...',
    contentPreview: 'Tech enthusiast and recruiter...'
  },
];

const mockHistory: ModerationHistory[] = [
  {
    id: 'hist-1',
    contentId: 'resume-089',
    action: 'Approved',
    moderator: 'Admin User',
    timestamp: '2025-10-22T16:00:00',
    notes: 'Credentials verified and content is appropriate'
  },
  {
    id: 'hist-2',
    contentId: 'job-078',
    action: 'Removed',
    moderator: 'Admin User',
    timestamp: '2025-10-22T14:30:00',
    notes: 'Confirmed phishing attempt, user banned'
  },
  {
    id: 'hist-3',
    contentId: 'profile-256',
    action: 'Removed',
    moderator: 'Admin User',
    timestamp: '2025-10-22T13:00:00',
    notes: 'Multiple harassment reports confirmed'
  },
];

export default function ContentModeratorWorkspace() {
  const [flaggedItems, setFlaggedItems] = useState<FlaggedContent[]>(mockFlaggedContent);
  const [selectedItem, setSelectedItem] = useState<FlaggedContent | null>(null);
  const [history, setHistory] = useState<ModerationHistory[]>(mockHistory);
  const [filterType, setFilterType] = useState<'all' | ContentType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | FlagStatus>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | Severity>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const stats = {
    pending: flaggedItems.filter(f => f.status === 'pending').length,
    approved: flaggedItems.filter(f => f.status === 'approved').length,
    removed: flaggedItems.filter(f => f.status === 'removed').length,
    spam: flaggedItems.filter(f => f.status === 'spam').length,
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getSeverityIcon = (severity: Severity) => {
    switch (severity) {
      case 'high': return <AlertOctagon className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <Flag className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: FlagStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'removed': return 'bg-red-100 text-red-800 border-red-200';
      case 'spam': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'resume': return <FileText className="w-4 h-4" />;
      case 'job': return <Briefcase className="w-4 h-4" />;
      case 'profile': return <User className="w-4 h-4" />;
    }
  };

  const getFilteredItems = () => {
    let filtered = [...flaggedItems];

    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.contentType === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    if (filterSeverity !== 'all') {
      filtered = filtered.filter(item => item.severity === filterSeverity);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reporter.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  };

  const generateAISuggestion = (item: FlaggedContent) => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const suggestions: Record<string, AISuggestion> = {
        'Inappropriate language': {
          action: 'remove',
          confidence: 92,
          reasoning: 'Content contains multiple instances of inappropriate language that violate community guidelines. Recommend removal and warning to user.'
        },
        'Discriminatory content': {
          action: 'remove',
          confidence: 95,
          reasoning: 'Content contains discriminatory language that violates anti-discrimination policies. Immediate removal recommended with possible account suspension.'
        },
        'Spam content': {
          action: 'spam',
          confidence: 88,
          reasoning: 'Profile shows patterns consistent with spam behavior including excessive external links and promotional content. Mark as spam and notify user.'
        },
        'False credentials': {
          action: 'request_changes',
          confidence: 75,
          reasoning: 'Some credentials appear questionable but may be verifiable. Request user to provide verification documents before making final decision.'
        },
        'Scam/Phishing': {
          action: 'ban_user',
          confidence: 98,
          reasoning: 'Clear indicators of phishing attempt detected. Immediate ban recommended along with content removal to protect other users.'
        },
        'Harassment': {
          action: 'ban_user',
          confidence: 94,
          reasoning: 'Multiple harassment reports confirmed. User has violated community guidelines. Recommend permanent ban and content removal.'
        },
      };

      setAiSuggestion(suggestions[item.reason] || {
        action: 'request_changes',
        confidence: 70,
        reasoning: 'Content requires manual review. Consider requesting additional information or clarification from the user.'
      });
      setIsGeneratingAI(false);
    }, 1500);
  };

  const handleAction = (action: string, notes?: string) => {
    if (!selectedItem) return;

    const newStatus: FlagStatus = 
      action === 'approve' ? 'approved' :
      action === 'remove' || action === 'ban_user' ? 'removed' :
      action === 'spam' ? 'spam' :
      selectedItem.status;

    setFlaggedItems(flaggedItems.map(item =>
      item.id === selectedItem.id ? { ...item, status: newStatus } : item
    ));

    const newHistoryItem: ModerationHistory = {
      id: `hist-${Date.now()}`,
      contentId: selectedItem.contentId,
      action: action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      moderator: 'Admin User',
      timestamp: new Date().toISOString(),
      notes: notes || aiSuggestion?.reasoning
    };

    setHistory([newHistoryItem, ...history]);
    setAiSuggestion(null);
  };

  const filteredItems = getFilteredItems();

  useEffect(() => {
    if (selectedItem) {
      const updated = flaggedItems.find(item => item.id === selectedItem.id);
      if (updated) {
        setSelectedItem(updated);
      }
    }
  }, [flaggedItems]);

  const ActionButton = ({ 
    icon: Icon, 
    label, 
    onClick, 
    variant = 'primary' 
  }: { 
    icon: any; 
    label: string; 
    onClick: () => void;
    variant?: 'primary' | 'success' | 'danger' | 'warning' | 'secondary';
  }) => {
    const variantClasses = {
      primary: 'bg-teal-600 hover:bg-teal-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      warning: 'bg-orange-600 hover:bg-orange-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white'
    };

    return (
      <Button onClick={onClick} className={`w-full flex items-center justify-center gap-2 ${variantClasses[variant]}`}>
        <Icon className="w-4 h-4" />
        {label}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/agents/admin-agents/content-moderator" className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Content Moderator</h1>
                <p className="text-sm text-gray-600 mt-1">Review and moderate flagged content</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 bg-white border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.pending}</h3>
              </div>
              <AlertTriangle className="w-10 h-10 text-yellow-500 opacity-80" />
            </div>
          </Card>
          <Card className="p-6 bg-white border-l-4 border-l-green-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.approved}</h3>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 opacity-80" />
            </div>
          </Card>
          <Card className="p-6 bg-white border-l-4 border-l-red-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Removed</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.removed}</h3>
              </div>
              <XCircle className="w-10 h-10 text-red-600 opacity-80" />
            </div>
          </Card>
          <Card className="p-6 bg-white border-l-4 border-l-gray-600 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Marked as Spam</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.spam}</h3>
              </div>
              <Flag className="w-10 h-10 text-gray-600 opacity-80" />
            </div>
          </Card>
        </div>

        {showHistory ? (
          <Card className="bg-white shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-teal-600" />
                  Moderation History
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowHistory(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{item.action}</span>
                          <span className="text-sm text-gray-500">on {item.contentId}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          By {item.moderator} • {new Date(item.timestamp).toLocaleString()}
                        </div>
                        {item.notes && (
                          <p className="text-sm text-gray-700 mt-2 italic">"{item.notes}"</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No moderation history yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card className="bg-white shadow-lg">
            <CardContent className="p-12">
              <div className="text-center">
                <Shield className="w-20 h-20 text-teal-200 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Flagged Content</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Great job! There's no flagged content requiring moderation at the moment.
                  {searchTerm && ' Try adjusting your search or filters.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Card className="bg-white shadow-lg">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle className="text-lg">Flagged Content Queue</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search flagged content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    />
                  </div>
                  {showFilters && (
                    <div className="mt-3 space-y-2 pt-3 border-t">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="all">All Types</option>
                        <option value="resume">Resumes</option>
                        <option value="job">Jobs</option>
                        <option value="profile">Profiles</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="removed">Removed</option>
                        <option value="spam">Spam</option>
                      </select>
                      <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="all">All Severities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                  <div className="divide-y">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                          selectedItem?.id === item.id ? 'bg-teal-50 border-l-4 border-teal-600' : ''
                        }`}
                        onClick={() => {
                          setSelectedItem(item);
                          setAiSuggestion(null);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getSeverityColor(item.severity)}`}>
                            {getSeverityIcon(item.severity)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getContentTypeIcon(item.contentType)}
                              <h3 className="font-semibold text-gray-900 text-sm truncate">{item.title}</h3>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{item.reason}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(item.severity)}`}>
                                {item.severity}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                              <Clock className="w-3 h-3" />
                              {new Date(item.reportedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-5">
              <Card className="bg-white shadow-lg h-full">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-teal-600" />
                    Content Viewer
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedItem ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getContentTypeIcon(selectedItem.contentType)}
                            <h2 className="text-xl font-bold text-gray-900">{selectedItem.title}</h2>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">ID: {selectedItem.contentId}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedItem.status)}`}>
                            {selectedItem.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(selectedItem.severity)}`}>
                            {selectedItem.severity} severity
                          </span>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-yellow-900 mb-1">Flag Reason</h3>
                            <p className="text-sm text-yellow-800">{selectedItem.reason}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Report Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Reported By</p>
                            <p className="font-medium text-gray-900">{selectedItem.reporter}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Reported At</p>
                            <p className="font-medium text-gray-900">
                              {new Date(selectedItem.reportedAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Content Type</p>
                            <p className="font-medium text-gray-900 capitalize">{selectedItem.contentType}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Current Status</p>
                            <p className="font-medium text-gray-900 capitalize">{selectedItem.status}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Content Preview</h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedItem.content}</p>
                        </div>
                      </div>

                      {aiSuggestion && (
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-teal-600 mt-0.5" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-teal-900 mb-1">AI Recommendation</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-teal-700 font-medium capitalize">
                                  {aiSuggestion.action.replace('_', ' ')}
                                </span>
                                <span className="px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full">
                                  {aiSuggestion.confidence}% confidence
                                </span>
                              </div>
                              <p className="text-sm text-teal-800">{aiSuggestion.reasoning}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Select a flagged item to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="bg-white shadow-lg">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedItem ? (
                    <div className="space-y-4">
                      <Button
                        onClick={() => selectedItem && generateAISuggestion(selectedItem)}
                        disabled={isGeneratingAI || selectedItem.status !== 'pending'}
                        className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white flex items-center justify-center gap-2"
                      >
                        <Sparkles className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                        {isGeneratingAI ? 'Analyzing...' : 'Auto-Moderate with AI'}
                      </Button>

                      <div className="pt-4 border-t space-y-3">
                        <h3 className="font-semibold text-gray-900 text-sm">Quick Actions</h3>
                        
                        <ActionButton
                          icon={CheckCircle}
                          label="Approve Content"
                          onClick={() => handleAction('approve')}
                          variant="success"
                        />

                        <ActionButton
                          icon={XCircle}
                          label="Remove Content"
                          onClick={() => handleAction('remove')}
                          variant="danger"
                        />

                        <ActionButton
                          icon={Flag}
                          label="Mark as Spam"
                          onClick={() => handleAction('spam')}
                          variant="warning"
                        />

                        <ActionButton
                          icon={MessageSquare}
                          label="Request Changes"
                          onClick={() => handleAction('request_changes')}
                          variant="secondary"
                        />

                        <ActionButton
                          icon={Ban}
                          label="Ban User"
                          onClick={() => handleAction('ban_user')}
                          variant="danger"
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2">Related History</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {history
                            .filter(h => h.contentId === selectedItem.contentId)
                            .map((item) => (
                              <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                                <div className="font-medium text-gray-900">{item.action}</div>
                                <div className="text-xs text-gray-600">
                                  {item.moderator} • {new Date(item.timestamp).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          {history.filter(h => h.contentId === selectedItem.contentId).length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No history for this item</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-sm text-gray-500">Select content to view actions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
