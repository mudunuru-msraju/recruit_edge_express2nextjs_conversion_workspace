import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Star, 
  Mail, 
  Phone, 
  Linkedin, 
  ArrowRight, 
  TrendingUp,
  Plus,
  X,
  Search,
  Sparkles,
  Filter,
  Briefcase
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Stage = 'sourced' | 'contacted' | 'interested' | 'interview' | 'offer' | 'hired';
type Source = 'linkedin' | 'referral' | 'job_board';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  currentRole: string;
  targetRole: string;
  skills: string[];
  source: Source;
  notes: string;
  stage: Stage;
  rating: number;
  daysInStage: number;
  addedAt: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  currentRole: string;
  targetRole: string;
  skills: string;
  source: Source;
  notes: string;
}

interface AIAction {
  type: 'email' | 'next_step';
  title: string;
  content: string;
}

const STAGES: { id: Stage; label: string; color: string }[] = [
  { id: 'sourced', label: 'Sourced', color: 'bg-gray-100 border-gray-300 text-gray-700' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { id: 'interested', label: 'Interested', color: 'bg-purple-100 border-purple-300 text-purple-700' },
  { id: 'interview', label: 'Interview', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { id: 'offer', label: 'Offer', color: 'bg-orange-100 border-orange-300 text-orange-700' },
  { id: 'hired', label: 'Hired', color: 'bg-green-100 border-green-300 text-green-700' },
];

export default function TalentPipelineWorkspace() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const userId = 1;

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const response = await fetch(`/api/agents/talent-pipeline/candidates?userId=${userId}`);
      const pipelineCandidates = await response.json();
      if (pipelineCandidates.length > 0) {
        setCandidates(pipelineCandidates);
      }
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiActions, setAiActions] = useState<AIAction[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<Stage | 'all'>('all');
  const [filterSource, setFilterSource] = useState<Source | 'all'>('all');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    currentRole: '',
    targetRole: '',
    skills: '',
    source: 'linkedin',
    notes: '',
  });

  const handleAddCandidate = () => {
    if (!formData.name || !formData.email) return;

    const newCandidate: Candidate = {
      id: `candidate-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      currentRole: formData.currentRole,
      targetRole: formData.targetRole,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      source: formData.source,
      notes: formData.notes,
      stage: 'sourced',
      rating: 3,
      daysInStage: 0,
      addedAt: new Date().toISOString(),
    };

    setCandidates([...candidates, newCandidate]);
    setShowAddForm(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      currentRole: '',
      targetRole: '',
      skills: '',
      source: 'linkedin',
      notes: '',
    });
  };

  const handleMoveStage = (candidateId: string, newStage: Stage) => {
    setCandidates(candidates.map(c => 
      c.id === candidateId 
        ? { ...c, stage: newStage, daysInStage: 0 }
        : c
    ));
  };

  const handleUpdateRating = (candidateId: string, rating: number) => {
    setCandidates(candidates.map(c => 
      c.id === candidateId ? { ...c, rating } : c
    ));
  };

  const generateMockAIActions = (candidate: Candidate): AIAction[] => {
    const emailTemplates = [
      {
        type: 'email' as const,
        title: 'Follow-up Email Template',
        content: `Subject: Exciting Opportunity - ${candidate.targetRole} Position

Hi ${candidate.name.split(' ')[0]},

I hope this email finds you well! I wanted to reach out regarding an exciting ${candidate.targetRole} opportunity that aligns perfectly with your background in ${candidate.skills[0]}.

Based on your experience as a ${candidate.currentRole}, I believe you'd be a great fit for our team. Would you be available for a brief call this week to discuss this further?

Looking forward to connecting!

Best regards,
[Your Name]`,
      },
      {
        type: 'next_step' as const,
        title: 'Recommended Next Actions',
        content: `1. Schedule a 30-minute introductory call to discuss career goals
2. Send detailed job description for ${candidate.targetRole} position
3. Request updated portfolio/work samples
4. Connect on LinkedIn to build relationship
5. Share company culture deck and team information
6. Ask for 2-3 references if conversation goes well`,
      },
    ];

    return emailTemplates;
  };

  const handleNurtureWithAI = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsGenerating(true);
    setShowAIDialog(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const actions = generateMockAIActions(candidate);
    setAiActions(actions);
    setIsGenerating(false);
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.targetRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStage = filterStage === 'all' || candidate.stage === filterStage;
      const matchesSource = filterSource === 'all' || candidate.source === filterSource;
      const matchesRating = filterRating === 'all' || candidate.rating === filterRating;
      
      return matchesSearch && matchesStage && matchesSource && matchesRating;
    });
  }, [candidates, searchTerm, filterStage, filterSource, filterRating]);

  const getCandidatesByStage = (stage: Stage) => {
    return filteredCandidates.filter(c => c.stage === stage);
  };

  const getSourceIcon = (source: Source) => {
    switch (source) {
      case 'linkedin': return <Linkedin className="w-3 h-3" />;
      case 'referral': return <Users className="w-3 h-3" />;
      case 'job_board': return <Briefcase className="w-3 h-3" />;
    }
  };

  const getSourceLabel = (source: Source) => {
    switch (source) {
      case 'linkedin': return 'LinkedIn';
      case 'referral': return 'Referral';
      case 'job_board': return 'Job Board';
    }
  };

  const StarRating = ({ rating, onChange, readonly = false }: { rating: number; onChange?: (r: number) => void; readonly?: boolean }) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${!readonly ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => !readonly && onChange?.(star)}
          />
        ))}
      </div>
    );
  };

  const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
    const currentStageIndex = STAGES.findIndex(s => s.id === candidate.stage);
    const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;

    return (
      <Card className="mb-3 hover:shadow-md transition">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{candidate.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{candidate.targetRole}</p>
            </div>
            <div className="text-right">
              <StarRating 
                rating={candidate.rating} 
                onChange={(rating) => handleUpdateRating(candidate.id, rating)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {candidate.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                {skill}
              </span>
            ))}
            {candidate.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                +{candidate.skills.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {candidate.daysInStage} days
            </div>
            <div className="flex items-center gap-1">
              {getSourceIcon(candidate.source)}
              {getSourceLabel(candidate.source)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {nextStage && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMoveStage(candidate.id, nextStage.id)}
                className="flex-1 text-xs border-green-600 text-green-700 hover:bg-green-50"
              >
                Move to {nextStage.label}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleNurtureWithAI(candidate)}
              className="text-xs"
              title="Nurture with AI"
            >
              <Sparkles className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-teal-100 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <Link 
              to="/agents/recruiter-agents/talent-pipeline" 
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Talent Pipeline</h1>
              <p className="text-sm text-gray-500">Manage your recruitment pipeline with AI-powered insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-green-50 border-green-600 text-green-700' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="max-w-[1800px] mx-auto mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search candidates..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Stage</label>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value as Stage | 'all')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Stages</option>
                  {STAGES.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Source</label>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value as Source | 'all')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Sources</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="referral">Referral</option>
                  <option value="job_board">Job Board</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Rating</label>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1800px] mx-auto px-6 py-6">
          {candidates.length === 0 ? (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center py-12 px-6">
                <Users className="w-20 h-20 text-green-200 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Build Your Talent Pipeline
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start adding candidates to your pipeline. Track their progress through each stage,
                  rate their potential, and use AI to nurture relationships with personalized outreach.
                </p>
                <Button 
                  onClick={() => setShowAddForm(true)} 
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Candidate
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-full overflow-x-auto">
              <div className="flex gap-4 h-full pb-4" style={{ minWidth: 'max-content' }}>
                {STAGES.map((stage) => {
                  const stageCandidates = getCandidatesByStage(stage.id);
                  return (
                    <div key={stage.id} className="flex-shrink-0 w-80">
                      <Card className={`h-full flex flex-col border-2 ${stage.color}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">
                              {stage.label}
                            </CardTitle>
                            <span className="px-2 py-1 bg-white rounded-full text-sm font-bold text-gray-700 border border-gray-300">
                              {stageCandidates.length}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto pt-0">
                          {stageCandidates.length === 0 ? (
                            <div className="text-center py-8 text-sm text-gray-500">
                              No candidates in this stage
                            </div>
                          ) : (
                            stageCandidates.map((candidate) => (
                              <CandidateCard key={candidate.id} candidate={candidate} />
                            ))
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Add New Candidate</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john.doe@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Source
                    </label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value as Source })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="referral">Referral</option>
                      <option value="job_board">Job Board</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Current Role
                    </label>
                    <input
                      type="text"
                      value={formData.currentRole}
                      onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                      placeholder="e.g., Software Engineer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Target Role
                    </label>
                    <input
                      type="text"
                      value={formData.targetRole}
                      onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g., React, TypeScript, Node.js"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional notes about this candidate..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    onClick={handleAddCandidate}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!formData.name || !formData.email}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Candidate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showAIDialog && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>AI Nurture Assistant</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Personalized outreach for {selectedCandidate.name}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAIDialog(false);
                    setSelectedCandidate(null);
                    setAiActions([]);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                  <p className="text-gray-600">Generating personalized recommendations...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{selectedCandidate.name}</h3>
                        <p className="text-sm text-gray-600">{selectedCandidate.targetRole}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {selectedCandidate.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {selectedCandidate.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {aiActions.map((action, idx) => (
                    <div key={idx}>
                      <div className="flex items-center gap-2 mb-3">
                        {action.type === 'email' ? (
                          <Mail className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        )}
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                          {action.content}
                        </pre>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        alert('Email template copied to clipboard!');
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Use Email Template
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAIDialog(false);
                        setSelectedCandidate(null);
                        setAiActions([]);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
