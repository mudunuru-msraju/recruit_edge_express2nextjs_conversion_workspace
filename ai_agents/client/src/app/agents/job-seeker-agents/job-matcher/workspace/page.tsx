import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Target, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  TrendingUp,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface JobMatch {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  matchingSkills: string[];
  description: string;
  experienceLevel: string;
  postedDate: string;
}

interface SearchCriteria {
  jobTitle: string;
  location: string;
  skills: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
}

export default function JobMatcherWorkspace() {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    jobTitle: '',
    location: '',
    skills: '',
    experienceLevel: 'intermediate',
    salaryMin: '',
    salaryMax: '',
  });
  
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);
  const [sortBy, setSortBy] = useState<'matchScore' | 'salary' | 'date'>('matchScore');
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const userId = 1;

  useEffect(() => {
    loadSavedMatches();
  }, []);

  const loadSavedMatches = async () => {
    try {
      const response = await fetch(`/api/agents/job-matcher/matches?userId=${userId}`);
      const savedMatches = await response.json();
      if (savedMatches.length > 0) {
        setMatches(savedMatches);
      }
    } catch (error) {
      console.error('Error loading saved matches:', error);
    }
  };

  const generateMockMatches = (): JobMatch[] => {
    const userSkills = searchCriteria.skills.split(',').map(s => s.trim()).filter(Boolean);
    const jobTitle = searchCriteria.jobTitle || 'Software Engineer';
    const location = searchCriteria.location || 'Remote';
    
    const companies = [
      'Google', 'Amazon', 'Microsoft', 'Apple', 'Meta',
      'Netflix', 'Tesla', 'Spotify', 'Stripe', 'Airbnb',
      'Uber', 'LinkedIn', 'Twitter', 'Salesforce', 'Adobe'
    ];
    
    const jobTitles = [
      jobTitle,
      `Senior ${jobTitle}`,
      `Junior ${jobTitle}`,
      `Lead ${jobTitle}`,
      `${jobTitle} II`,
      `Staff ${jobTitle}`,
      `Principal ${jobTitle}`
    ];
    
    const locations = [
      location,
      'San Francisco, CA',
      'New York, NY',
      'Seattle, WA',
      'Austin, TX',
      'Boston, MA',
      'Remote',
      'Hybrid - Bay Area'
    ];
    
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
      'Java', 'AWS', 'Docker', 'Kubernetes', 'GraphQL',
      'MongoDB', 'PostgreSQL', 'Redis', 'Git', 'CI/CD',
      'Agile', 'REST APIs', 'Microservices', 'Testing', 'DevOps'
    ];
    
    const descriptions = [
      'Join our innovative team to build cutting-edge solutions that impact millions of users.',
      'We are looking for a talented engineer to help shape the future of our platform.',
      'Work on challenging problems with the latest technologies in a collaborative environment.',
      'Help us scale our infrastructure to handle massive growth and complexity.',
      'Be part of a high-performing team building the next generation of products.',
    ];

    const numMatches = Math.floor(Math.random() * 6) + 5;
    const mockMatches: JobMatch[] = [];

    for (let i = 0; i < numMatches; i++) {
      const matchScore = Math.floor(Math.random() * 40) + 60;
      const numMatchingSkills = Math.min(
        Math.floor((matchScore / 100) * (userSkills.length || 5)) + 2,
        userSkills.length || commonSkills.length
      );
      
      const matchingSkills = userSkills.length > 0
        ? userSkills.slice(0, numMatchingSkills)
        : commonSkills.sort(() => 0.5 - Math.random()).slice(0, numMatchingSkills);

      const salaryMin = 80000 + Math.floor(Math.random() * 100000);
      const salaryMax = salaryMin + 30000 + Math.floor(Math.random() * 50000);

      mockMatches.push({
        id: `match-${Date.now()}-${i}`,
        jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
        company: companies[Math.floor(Math.random() * companies.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        salary: `$${(salaryMin / 1000).toFixed(0)}K - $${(salaryMax / 1000).toFixed(0)}K`,
        matchScore,
        matchingSkills,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        experienceLevel: searchCriteria.experienceLevel,
        postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return mockMatches.sort((a, b) => b.matchScore - a.matchScore);
  };

  const handleFindMatches = async () => {
    if (!searchCriteria.jobTitle) {
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newMatches = generateMockMatches();
      setMatches(newMatches);
    } catch (error) {
      console.error('Error generating matches:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAnalysis = async () => {
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving analysis:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getMatchScoreBarColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getSortedAndFilteredMatches = () => {
    let filtered = [...matches];

    if (filterScore !== 'all') {
      filtered = filtered.filter(match => {
        if (filterScore === 'high') return match.matchScore >= 90;
        if (filterScore === 'medium') return match.matchScore >= 70 && match.matchScore < 90;
        if (filterScore === 'low') return match.matchScore < 70;
        return true;
      });
    }

    filtered.sort((a, b) => {
      if (sortBy === 'matchScore') return b.matchScore - a.matchScore;
      if (sortBy === 'salary') {
        const getSalaryValue = (salary: string) => {
          const match = salary.match(/\$(\d+)K/);
          return match ? parseInt(match[1]) : 0;
        };
        return getSalaryValue(b.salary) - getSalaryValue(a.salary);
      }
      if (sortBy === 'date') {
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
      return 0;
    });

    return filtered;
  };

  const displayedMatches = getSortedAndFilteredMatches();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/agents/job-seeker-agents/job-matcher" 
              className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Matcher</h1>
              <p className="text-sm text-gray-600">Find your perfect job match with AI-powered analysis</p>
            </div>
          </div>

          {matches.length > 0 && (
            <Button
              onClick={handleSaveAnalysis}
              disabled={saveStatus === 'saving'}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {saveStatus === 'saved' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Error
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Analysis'}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Search Form */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-600" />
              Job Search Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Desired Job Title *
                </label>
                <input
                  type="text"
                  value={searchCriteria.jobTitle}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, jobTitle: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={searchCriteria.location}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, location: e.target.value })}
                  placeholder="e.g., Remote, San Francisco"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Experience Level
                </label>
                <select
                  value={searchCriteria.experienceLevel}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, experienceLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead/Principal</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={searchCriteria.skills}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, skills: e.target.value })}
                  placeholder="e.g., JavaScript, React, Node.js, Python, AWS"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Minimum Salary ($/year)
                </label>
                <input
                  type="text"
                  value={searchCriteria.salaryMin}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, salaryMin: e.target.value })}
                  placeholder="e.g., 80000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Maximum Salary ($/year)
                </label>
                <input
                  type="text"
                  value={searchCriteria.salaryMax}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, salaryMax: e.target.value })}
                  placeholder="e.g., 150000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleFindMatches}
                  disabled={isGenerating || !searchCriteria.jobTitle}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Find Matches with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {matches.length > 0 && (
          <>
            {/* Filter and Sort Bar */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {displayedMatches.length} {displayedMatches.length === 1 ? 'Match' : 'Matches'} Found
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="matchScore">Match Score</option>
                  <option value="salary">Salary</option>
                  <option value="date">Date Posted</option>
                </select>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <Card className="mb-4 bg-white/80">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Filter by Match Score:</span>
                    <div className="flex gap-2">
                      <Button
                        variant={filterScore === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterScore('all')}
                      >
                        All
                      </Button>
                      <Button
                        variant={filterScore === 'high' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterScore('high')}
                        className={filterScore === 'high' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        90%+ (Excellent)
                      </Button>
                      <Button
                        variant={filterScore === 'medium' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterScore('medium')}
                        className={filterScore === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                      >
                        70-89% (Good)
                      </Button>
                      <Button
                        variant={filterScore === 'low' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterScore('low')}
                        className={filterScore === 'low' ? 'bg-gray-600 hover:bg-gray-700' : ''}
                      >
                        Below 70%
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMatches.map((match) => (
                <Card 
                  key={match.id} 
                  className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-teal-200"
                  onClick={() => setSelectedMatch(match)}
                >
                  <CardContent className="p-6">
                    {/* Match Score Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1.5 rounded-lg border-2 ${getMatchScoreColor(match.matchScore)}`}>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-lg font-bold">{match.matchScore}%</span>
                        </div>
                      </div>
                      <Target className="w-5 h-5 text-teal-600" />
                    </div>

                    {/* Match Score Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getMatchScoreBarColor(match.matchScore)}`}
                          style={{ width: `${match.matchScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {match.jobTitle}
                    </h3>

                    {/* Company */}
                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-semibold">{match.company}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{match.location}</span>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">{match.salary}</span>
                    </div>

                    {/* Matching Skills */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2 font-medium">Matching Skills:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.matchingSkills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {match.matchingSkills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{match.matchingSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Posted Date */}
                    <p className="text-xs text-gray-400 mb-4">
                      Posted {new Date(match.postedDate).toLocaleDateString()}
                    </p>

                    {/* View Details Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMatch(match);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {matches.length === 0 && !isGenerating && (
          <Card className="shadow-lg">
            <CardContent className="py-16">
              <div className="text-center">
                <Target className="w-20 h-20 text-teal-200 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ready to Find Your Perfect Match?
                </h2>
                <p className="text-gray-600 mb-2 max-w-md mx-auto">
                  Enter your job preferences above and click "Find Matches with AI" to discover 
                  opportunities that align with your skills and career goals.
                </p>
                <p className="text-sm text-gray-500">
                  Our AI will analyze your criteria and provide personalized match scores for each position.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Details Modal */}
        {selectedMatch && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedMatch(null)}
          >
            <Card 
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{selectedMatch.jobTitle}</CardTitle>
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-semibold">{selectedMatch.company}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedMatch.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {selectedMatch.salary}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Match Score Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Match Score</h3>
                    <div className={`px-4 py-2 rounded-lg border-2 ${getMatchScoreColor(selectedMatch.matchScore)}`}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-2xl font-bold">{selectedMatch.matchScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${getMatchScoreBarColor(selectedMatch.matchScore)}`}
                      style={{ width: `${selectedMatch.matchScore}%` }}
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedMatch.description}</p>
                </div>

                {/* Matching Skills */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Your Matching Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMatch.matchingSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-teal-100 text-teal-700 text-sm rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Experience Level</p>
                    <p className="font-semibold text-gray-900 capitalize">{selectedMatch.experienceLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Posted Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedMatch.postedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save for Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
