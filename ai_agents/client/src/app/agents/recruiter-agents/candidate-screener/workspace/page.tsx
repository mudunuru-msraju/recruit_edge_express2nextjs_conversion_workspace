import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  UserCheck, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  BarChart,
  Upload,
  Save,
  Plus,
  FileText,
  Clock,
  Award,
  X,
  Filter,
  Users
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ScreeningResult {
  overallScore: number;
  skillsMatch: number;
  experienceMatch: number;
  culturalFit: number;
  strengths: string[];
  concerns: string[];
  recommendation: 'hire' | 'maybe' | 'reject';
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  yearsExperience: number;
  skills: string[];
  resume: string;
  screening?: ScreeningResult;
  status: 'pending' | 'screened';
  createdAt: string;
}

interface FormData {
  name: string;
  email: string;
  position: string;
  yearsExperience: string;
  skills: string;
  resume: string;
}

export default function CandidateScreenerWorkspace() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareCandidates, setCompareCandidates] = useState<Candidate[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'screened'>('all');
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showFilters, setShowFilters] = useState(false);

  const userId = 1;

  useEffect(() => {
    loadScreenings();
  }, []);

  const loadScreenings = async () => {
    try {
      const response = await fetch(`/api/agents/candidate-screener/screenings?userId=${userId}`);
      const screenings = await response.json();
      if (screenings.length > 0) {
        setCandidates(screenings);
      }
    } catch (error) {
      console.error('Error loading screenings:', error);
    }
  };
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    position: '',
    yearsExperience: '',
    skills: '',
    resume: '',
  });

  const generateMockScreening = (candidate: FormData): ScreeningResult => {
    const skills = candidate.skills.split(',').map(s => s.trim()).filter(Boolean);
    const experience = parseInt(candidate.yearsExperience) || 0;
    
    const baseScore = Math.floor(Math.random() * 30) + 60;
    const skillsMatch = Math.min(100, baseScore + Math.floor(Math.random() * 15));
    const experienceMatch = Math.min(100, baseScore + (experience >= 3 ? 15 : -10) + Math.floor(Math.random() * 10));
    const culturalFit = Math.min(100, baseScore + Math.floor(Math.random() * 20));
    const overallScore = Math.floor((skillsMatch + experienceMatch + culturalFit) / 3);

    const allStrengths = [
      `Strong technical background in ${skills[0] || 'core technologies'}`,
      `${experience} years of relevant industry experience`,
      'Excellent communication and collaboration skills',
      'Proven track record of delivering results',
      'Quick learner with adaptability to new technologies',
      'Strong problem-solving and analytical abilities',
      'Experience with agile methodologies',
      'Leadership potential and team player mentality',
    ];

    const allConcerns = [
      'Limited experience with specific required tools',
      'May need onboarding support in company processes',
      'Salary expectations might be above range',
      'Notice period is longer than ideal',
      'Geographic relocation required',
      'Gap in employment history',
      'Limited experience in similar company size',
    ];

    const numStrengths = Math.floor(Math.random() * 3) + 3;
    const numConcerns = overallScore > 80 ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 2;

    const strengths = allStrengths.sort(() => 0.5 - Math.random()).slice(0, numStrengths);
    const concerns = allConcerns.sort(() => 0.5 - Math.random()).slice(0, numConcerns);

    let recommendation: 'hire' | 'maybe' | 'reject';
    if (overallScore >= 80) {
      recommendation = 'hire';
    } else if (overallScore >= 60) {
      recommendation = 'maybe';
    } else {
      recommendation = 'reject';
    }

    return {
      overallScore,
      skillsMatch,
      experienceMatch,
      culturalFit,
      strengths,
      concerns,
      recommendation,
    };
  };

  const handleScreenWithAI = async () => {
    if (!formData.name || !formData.position) {
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const screening = generateMockScreening(formData);
      const newCandidate: Candidate = {
        id: `candidate-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        position: formData.position,
        yearsExperience: parseInt(formData.yearsExperience) || 0,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        resume: formData.resume,
        screening,
        status: 'screened',
        createdAt: new Date().toISOString(),
      };

      if (selectedCandidate && !selectedCandidate.screening) {
        setCandidates(candidates.map(c => c.id === selectedCandidate.id ? newCandidate : c));
        setSelectedCandidate(newCandidate);
      } else {
        setCandidates([newCandidate, ...candidates]);
        setSelectedCandidate(newCandidate);
      }

      setFormData({
        name: '',
        email: '',
        position: '',
        yearsExperience: '',
        skills: '',
        resume: '',
      });
    } catch (error) {
      console.error('Error generating screening:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveScreening = async () => {
    if (!selectedCandidate) return;

    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving screening:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleNewCandidate = () => {
    setSelectedCandidate(null);
    setFormData({
      name: '',
      email: '',
      position: '',
      yearsExperience: '',
      skills: '',
      resume: '',
    });
    setCompareMode(false);
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setFormData({
      name: candidate.name,
      email: candidate.email,
      position: candidate.position,
      yearsExperience: candidate.yearsExperience.toString(),
      skills: candidate.skills.join(', '),
      resume: candidate.resume,
    });
    setCompareMode(false);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, resume: event.target?.result as string || '' });
      };
      reader.readAsText(file);
    }
  };

  const toggleCompareCandidate = (candidate: Candidate) => {
    if (compareCandidates.find(c => c.id === candidate.id)) {
      setCompareCandidates(compareCandidates.filter(c => c.id !== candidate.id));
    } else if (compareCandidates.length < 3) {
      setCompareCandidates([...compareCandidates, candidate]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRecommendationBadge = (recommendation: 'hire' | 'maybe' | 'reject') => {
    switch (recommendation) {
      case 'hire':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-4 h-4" />
            Recommend Hire
          </span>
        );
      case 'maybe':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
            <AlertCircle className="w-4 h-4" />
            Maybe
          </span>
        );
      case 'reject':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-4 h-4" />
            Not Recommended
          </span>
        );
    }
  };

  const getFilteredCandidates = () => {
    let filtered = [...candidates];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    if (filterScore !== 'all') {
      filtered = filtered.filter(c => {
        if (!c.screening) return false;
        const score = c.screening.overallScore;
        if (filterScore === 'high') return score >= 80;
        if (filterScore === 'medium') return score >= 60 && score < 80;
        if (filterScore === 'low') return score < 60;
        return true;
      });
    }

    return filtered;
  };

  const displayedCandidates = getFilteredCandidates();

  if (compareMode && compareCandidates.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCompareMode(false);
                  setCompareCandidates([]);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Screening
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Compare Candidates</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compareCandidates.map((candidate) => (
              <Card key={candidate.id} className="border-2 border-green-200">
                <CardHeader className="border-b bg-green-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCompareCandidate(candidate)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
                </CardHeader>
                <CardContent className="p-6">
                  {candidate.screening ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getScoreColor(candidate.screening.overallScore)}`}>
                          <TrendingUp className="w-5 h-5" />
                          <span className="text-2xl font-bold">{candidate.screening.overallScore}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Overall Score</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Skills Match</span>
                            <span className="font-semibold">{candidate.screening.skillsMatch}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBarColor(candidate.screening.skillsMatch)}`}
                              style={{ width: `${candidate.screening.skillsMatch}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Experience Match</span>
                            <span className="font-semibold">{candidate.screening.experienceMatch}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBarColor(candidate.screening.experienceMatch)}`}
                              style={{ width: `${candidate.screening.experienceMatch}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Cultural Fit</span>
                            <span className="font-semibold">{candidate.screening.culturalFit}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBarColor(candidate.screening.culturalFit)}`}
                              style={{ width: `${candidate.screening.culturalFit}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        {getRecommendationBadge(candidate.screening.recommendation)}
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Top Strengths:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {candidate.screening.strengths.slice(0, 3).map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Key Concerns:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {candidate.screening.concerns.slice(0, 3).map((concern, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Not screened yet</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-teal-100 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <Link 
              to="/agents/recruiter-agents/candidate-screener" 
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Candidate Screener</h1>
              <p className="text-sm text-gray-500">AI-powered candidate screening and evaluation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {compareCandidates.length > 0 && (
              <Button
                onClick={() => setCompareMode(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Users className="w-4 h-4 mr-2" />
                Compare ({compareCandidates.length})
              </Button>
            )}
            <Button 
              onClick={handleNewCandidate} 
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Candidate
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1800px] mx-auto px-6 py-6">
          {candidates.length === 0 && !selectedCandidate ? (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center py-12 px-6">
                <UserCheck className="w-20 h-20 text-green-200 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Start Screening Candidates
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Add candidate information and use AI to generate comprehensive screening results 
                  including skill matching, experience analysis, and hiring recommendations.
                </p>
                <Button 
                  onClick={handleNewCandidate} 
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Screen First Candidate
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-full grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-3 overflow-y-auto">
                <Card className="h-fit">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Candidates</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                    {showFilters && (
                      <div className="mt-4 space-y-3 pt-3 border-t">
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">Status</label>
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="screened">Screened</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">Score</label>
                          <select
                            value={filterScore}
                            onChange={(e) => setFilterScore(e.target.value as any)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="all">All Scores</option>
                            <option value="high">High (80+)</option>
                            <option value="medium">Medium (60-79)</option>
                            <option value="low">Low (&lt;60)</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {displayedCandidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                            selectedCandidate?.id === candidate.id ? 'bg-green-50 border-l-4 border-green-600' : ''
                          }`}
                          onClick={() => handleSelectCandidate(candidate)}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">{candidate.name}</h3>
                              <p className="text-sm text-gray-600 truncate">{candidate.position}</p>
                            </div>
                            {candidate.screening && (
                              <div className={`px-2 py-1 rounded-lg border ${getScoreColor(candidate.screening.overallScore)}`}>
                                <span className="text-sm font-bold">{candidate.screening.overallScore}%</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {candidate.yearsExperience}y exp
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-medium ${
                              candidate.status === 'screened' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {candidate.status}
                            </span>
                          </div>

                          {candidate.screening && (
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="checkbox"
                                checked={compareCandidates.some(c => c.id === candidate.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleCompareCandidate(candidate);
                                }}
                                disabled={compareCandidates.length >= 3 && !compareCandidates.some(c => c.id === candidate.id)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <label className="text-xs text-gray-600">Compare</label>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-12 lg:col-span-5 overflow-y-auto">
                <Card className="h-fit">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      Candidate Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Job Position *
                          </label>
                          <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            placeholder="e.g., Senior Software Engineer"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Years of Experience *
                          </label>
                          <input
                            type="number"
                            value={formData.yearsExperience}
                            onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                            placeholder="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Key Skills (comma-separated) *
                        </label>
                        <input
                          type="text"
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                          placeholder="e.g., JavaScript, React, Node.js, Python, AWS"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Resume
                        </label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <label className="flex-1">
                              <input
                                type="file"
                                accept=".txt,.pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                                className="hidden"
                              />
                              <div className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-green-500 transition cursor-pointer flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-green-600">
                                <Upload className="w-4 h-4" />
                                Upload Resume
                              </div>
                            </label>
                          </div>
                          <textarea
                            value={formData.resume}
                            onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                            placeholder="Or paste resume text here..."
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleScreenWithAI}
                        disabled={isGenerating || !formData.name || !formData.position}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                            Analyzing Candidate...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Screen with AI
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-12 lg:col-span-4 overflow-y-auto">
                {selectedCandidate?.screening ? (
                  <Card className="h-fit">
                    <CardHeader className="border-b bg-green-50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart className="w-5 h-5 text-green-600" />
                          Screening Results
                        </CardTitle>
                        <Button
                          onClick={handleSaveScreening}
                          disabled={saveStatus === 'saving'}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {saveStatus === 'saved' ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Saved!
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              {saveStatus === 'saving' ? 'Saving...' : 'Save'}
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="text-center pb-6 border-b">
                          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 ${getScoreColor(selectedCandidate.screening.overallScore)}`}>
                            <TrendingUp className="w-6 h-6" />
                            <span className="text-3xl font-bold">{selectedCandidate.screening.overallScore}%</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2 font-medium">Overall Match Score</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Skills Match</span>
                              <span className="text-sm font-bold text-gray-900">{selectedCandidate.screening.skillsMatch}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all ${getScoreBarColor(selectedCandidate.screening.skillsMatch)}`}
                                style={{ width: `${selectedCandidate.screening.skillsMatch}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Experience Match</span>
                              <span className="text-sm font-bold text-gray-900">{selectedCandidate.screening.experienceMatch}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all ${getScoreBarColor(selectedCandidate.screening.experienceMatch)}`}
                                style={{ width: `${selectedCandidate.screening.experienceMatch}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Cultural Fit</span>
                              <span className="text-sm font-bold text-gray-900">{selectedCandidate.screening.culturalFit}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all ${getScoreBarColor(selectedCandidate.screening.culturalFit)}`}
                                style={{ width: `${selectedCandidate.screening.culturalFit}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-sm font-medium text-gray-700 mb-3">Recommendation</p>
                          {getRecommendationBadge(selectedCandidate.screening.recommendation)}
                        </div>

                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="w-4 h-4 text-green-600" />
                            <p className="text-sm font-semibold text-gray-900">Strengths</p>
                          </div>
                          <ul className="space-y-2">
                            {selectedCandidate.screening.strengths.map((strength, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <p className="text-sm font-semibold text-gray-900">Concerns</p>
                          </div>
                          <ul className="space-y-2">
                            {selectedCandidate.screening.concerns.map((concern, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <XCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span>{concern}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-fit">
                    <CardContent className="p-12 text-center">
                      <UserCheck className="w-16 h-16 text-green-200 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Screening Results Yet
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Fill in candidate information and click "Screen with AI" to generate comprehensive analysis
                      </p>
                      <div className="space-y-2 text-left bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-xs font-semibold text-green-900 mb-2">Analysis Includes:</p>
                        <ul className="text-xs text-green-800 space-y-1">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            Overall match score (0-100)
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            Skills & experience evaluation
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            Cultural fit assessment
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            Strengths & concerns analysis
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            Hiring recommendation
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
