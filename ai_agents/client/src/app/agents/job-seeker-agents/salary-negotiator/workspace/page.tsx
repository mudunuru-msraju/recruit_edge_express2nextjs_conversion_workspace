import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  BarChart, 
  Lightbulb, 
  Target,
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  TrendingDown,
  Award,
  Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SalaryData {
  id: string;
  jobTitle: string;
  location: string;
  yearsExperience: number;
  companySize: string;
  industry: string;
  salaryRange: {
    min: number;
    median: number;
    max: number;
    currency: string;
  };
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  marketInsights: {
    demand: 'high' | 'medium' | 'low';
    growthTrend: 'increasing' | 'stable' | 'declining';
    topCompanies: string[];
    averageBonus: number;
    marketDescription: string;
  };
  negotiationTips: string[];
  timestamp: string;
}

interface FormData {
  jobTitle: string;
  location: string;
  yearsExperience: string;
  companySize: string;
  industry: string;
}

export default function SalaryNegotiatorWorkspace() {
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    location: '',
    yearsExperience: '',
    companySize: 'medium',
    industry: 'technology',
  });

  const [researchResults, setResearchResults] = useState<SalaryData[]>([]);
  const [currentResearch, setCurrentResearch] = useState<SalaryData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const userId = 1;

  useEffect(() => {
    loadResearch();
  }, []);

  const loadResearch = async () => {
    try {
      const response = await fetch(`/api/agents/salary-negotiator/research?userId=${userId}`);
      const research = await response.json();
      if (research.length > 0) {
        setResearchResults(research);
      }
    } catch (error) {
      console.error('Error loading research:', error);
    }
  };

  const generateMockSalaryData = (data: FormData): SalaryData => {
    const yearsExp = parseInt(data.yearsExperience) || 3;
    const baseMultiplier = yearsExp < 2 ? 0.7 : yearsExp < 5 ? 1 : yearsExp < 10 ? 1.4 : 1.8;
    
    const industryMultipliers: Record<string, number> = {
      technology: 1.3,
      finance: 1.25,
      healthcare: 1.0,
      education: 0.8,
      retail: 0.75,
      manufacturing: 0.9,
      consulting: 1.2,
    };

    const companySizeMultipliers: Record<string, number> = {
      startup: 0.9,
      small: 0.95,
      medium: 1.0,
      large: 1.15,
      enterprise: 1.25,
    };

    const industryMult = industryMultipliers[data.industry] || 1.0;
    const sizeMult = companySizeMultipliers[data.companySize] || 1.0;
    const totalMultiplier = baseMultiplier * industryMult * sizeMult;

    const baseMedian = 80000;
    const median = Math.round(baseMedian * totalMultiplier);
    const min = Math.round(median * 0.75);
    const max = Math.round(median * 1.35);

    const p25 = Math.round(median * 0.85);
    const p50 = median;
    const p75 = Math.round(median * 1.15);
    const p90 = Math.round(median * 1.28);

    const topCompaniesMap: Record<string, string[]> = {
      technology: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
      finance: ['Goldman Sachs', 'JPMorgan', 'Morgan Stanley', 'BlackRock', 'Citadel'],
      healthcare: ['UnitedHealth', 'Kaiser Permanente', 'Mayo Clinic', 'CVS Health', 'Johnson & Johnson'],
      education: ['MIT', 'Stanford', 'Harvard', 'Princeton', 'Yale'],
      retail: ['Amazon', 'Walmart', 'Target', 'Costco', 'Home Depot'],
      manufacturing: ['Tesla', 'Boeing', 'General Electric', '3M', 'Caterpillar'],
      consulting: ['McKinsey', 'BCG', 'Bain', 'Deloitte', 'Accenture'],
    };

    const demandLevels: Array<'high' | 'medium' | 'low'> = yearsExp > 5 ? ['high', 'high', 'medium'] : ['medium', 'high', 'medium'];
    const growthTrends: Array<'increasing' | 'stable' | 'declining'> = data.industry === 'technology' ? ['increasing', 'increasing', 'stable'] : ['stable', 'increasing', 'stable'];

    const negotiationTipsPool = [
      `With ${yearsExp} years of experience, emphasize your proven track record and quantifiable achievements`,
      'Research the company\'s recent funding rounds or financial performance to gauge their budget',
      'Don\'t reveal your current salary - focus on market rates and your value proposition',
      `In ${data.industry}, non-cash compensation like stock options can be 20-40% of total comp`,
      'Consider negotiating for sign-on bonuses, especially if leaving unvested equity',
      'Ask about promotion timelines and salary review cycles during negotiation',
      `For ${data.companySize} companies, flexible work arrangements can be easier to negotiate than salary`,
      'Get the offer in writing before resigning from your current position',
      'Be prepared to justify your ask with specific examples of your impact and skills',
      'Consider the total compensation package including benefits, equity, and work-life balance',
    ];

    const shuffledTips = [...negotiationTipsPool].sort(() => 0.5 - Math.random());
    const selectedTips = shuffledTips.slice(0, 5);

    const marketDescriptions: Record<string, string> = {
      technology: 'The tech sector continues to show strong demand for skilled professionals, with particularly high competition for senior talent. Remote work options have expanded the talent pool globally.',
      finance: 'Financial services maintain competitive compensation packages, especially in investment banking and quantitative roles. Performance bonuses often exceed base salary.',
      healthcare: 'Healthcare professionals are in high demand with steady growth. Specialized roles command premium compensation, particularly in major metropolitan areas.',
      education: 'Education sector salaries vary significantly by institution type and location. Private institutions and research universities typically offer higher compensation.',
      retail: 'Retail sector compensation is evolving with digital transformation. E-commerce and supply chain roles see increasing demand and competitive pay.',
      manufacturing: 'Manufacturing shows stable growth with increasing focus on automation and advanced manufacturing techniques. Engineering roles particularly valued.',
      consulting: 'Consulting firms offer competitive packages with performance-based bonuses. Travel requirements often come with additional compensation and perks.',
    };

    return {
      id: `research-${Date.now()}`,
      jobTitle: data.jobTitle,
      location: data.location,
      yearsExperience: yearsExp,
      companySize: data.companySize,
      industry: data.industry,
      salaryRange: {
        min,
        median,
        max,
        currency: 'USD',
      },
      percentiles: {
        p25,
        p50,
        p75,
        p90,
      },
      marketInsights: {
        demand: demandLevels[Math.floor(Math.random() * demandLevels.length)],
        growthTrend: growthTrends[Math.floor(Math.random() * growthTrends.length)],
        topCompanies: topCompaniesMap[data.industry] || ['Company A', 'Company B', 'Company C'],
        averageBonus: Math.round(median * (0.1 + Math.random() * 0.15)),
        marketDescription: marketDescriptions[data.industry] || 'Market conditions vary by specific role and location.',
      },
      negotiationTips: selectedTips,
      timestamp: new Date().toISOString(),
    };
  };

  const handleResearch = async () => {
    if (!formData.jobTitle || !formData.location) {
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newResearch = generateMockSalaryData(formData);
      setCurrentResearch(newResearch);
      setResearchResults([newResearch, ...researchResults]);
    } catch (error) {
      console.error('Error generating research:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!currentResearch) return;

    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving research:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const toggleCompareSelection = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(researchId => researchId !== id));
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4" />;
      case 'stable': return <BarChart className="w-4 h-4" />;
      case 'declining': return <TrendingDown className="w-4 h-4" />;
      default: return <BarChart className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'bg-purple-500';
    if (percentile >= 75) return 'bg-blue-500';
    if (percentile >= 50) return 'bg-teal-500';
    return 'bg-green-500';
  };

  const compareResearch = researchResults.filter(r => selectedForCompare.includes(r.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/agents/job-seeker-agents/salary-negotiator" 
              className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Salary Negotiator</h1>
              <p className="text-sm text-gray-600">Research salaries and get AI-powered negotiation insights</p>
            </div>
          </div>

          {researchResults.length > 1 && (
            <Button
              onClick={() => setCompareMode(!compareMode)}
              variant={compareMode ? 'default' : 'outline'}
              className={compareMode ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              <Target className="w-4 h-4 mr-2" />
              {compareMode ? 'Exit Compare Mode' : 'Compare Roles'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="w-5 h-5 text-teal-600" />
                  Research Salary Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., San Francisco, CA"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Years of Experience
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                      placeholder="e.g., 5"
                      min="0"
                      max="50"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Company Size
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                    >
                      <option value="startup">Startup (1-50)</option>
                      <option value="small">Small (51-200)</option>
                      <option value="medium">Medium (201-1000)</option>
                      <option value="large">Large (1001-10000)</option>
                      <option value="enterprise">Enterprise (10000+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Industry
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                    >
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="consulting">Consulting</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleResearch}
                  disabled={isGenerating || !formData.jobTitle || !formData.location}
                  className="w-full bg-teal-600 hover:bg-teal-700 h-11"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Research Salary with AI
                    </>
                  )}
                </Button>

                {currentResearch && (
                  <Button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    variant="outline"
                    className="w-full"
                  >
                    {saveStatus === 'saved' ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Saved!
                      </>
                    ) : saveStatus === 'error' ? (
                      <>
                        <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                        Error
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {saveStatus === 'saving' ? 'Saving...' : 'Save Research'}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {compareMode && compareResearch.length > 0 ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-teal-600" />
                      Comparing {compareResearch.length} {compareResearch.length === 1 ? 'Role' : 'Roles'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2 font-semibold text-gray-700">Metric</th>
                            {compareResearch.map((research) => (
                              <th key={research.id} className="text-left py-3 px-2 font-semibold text-gray-700">
                                {research.jobTitle}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr>
                            <td className="py-3 px-2 font-medium text-gray-600">Location</td>
                            {compareResearch.map((research) => (
                              <td key={research.id} className="py-3 px-2">{research.location}</td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-2 font-medium text-gray-600">Median Salary</td>
                            {compareResearch.map((research) => (
                              <td key={research.id} className="py-3 px-2 font-bold text-teal-600">
                                {formatCurrency(research.salaryRange.median)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-2 font-medium text-gray-600">Salary Range</td>
                            {compareResearch.map((research) => (
                              <td key={research.id} className="py-3 px-2 text-gray-700">
                                {formatCurrency(research.salaryRange.min)} - {formatCurrency(research.salaryRange.max)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-2 font-medium text-gray-600">90th Percentile</td>
                            {compareResearch.map((research) => (
                              <td key={research.id} className="py-3 px-2 text-purple-600 font-semibold">
                                {formatCurrency(research.percentiles.p90)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-2 font-medium text-gray-600">Demand</td>
                            {compareResearch.map((research) => (
                              <td key={research.id} className="py-3 px-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDemandColor(research.marketInsights.demand)}`}>
                                  {research.marketInsights.demand.toUpperCase()}
                                </span>
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 px-2 font-medium text-gray-600">Trend</td>
                            {compareResearch.map((research) => (
                              <td key={research.id} className="py-3 px-2">
                                <span className={`flex items-center gap-1 ${getTrendColor(research.marketInsights.growthTrend)}`}>
                                  {getTrendIcon(research.marketInsights.growthTrend)}
                                  {research.marketInsights.growthTrend}
                                </span>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Select up to 3 research results from your history to compare
                      </p>
                      <Button onClick={() => setCompareMode(false)} variant="outline">
                        Exit Compare Mode
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : currentResearch ? (
              <div className="space-y-6">
                <Card className="shadow-lg border-2 border-teal-200">
                  <CardHeader className="bg-gradient-to-r from-teal-50 to-green-50">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-teal-600" />
                      Salary Range for {currentResearch.jobTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">Minimum</p>
                        <p className="text-2xl font-bold text-green-700">
                          {formatCurrency(currentResearch.salaryRange.min)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-teal-50 rounded-lg border-2 border-teal-300">
                        <p className="text-sm text-gray-600 mb-1">Median</p>
                        <p className="text-3xl font-bold text-teal-700">
                          {formatCurrency(currentResearch.salaryRange.median)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Maximum</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {formatCurrency(currentResearch.salaryRange.max)}
                        </p>
                      </div>
                    </div>

                    <div className="relative h-16 bg-gradient-to-r from-green-200 via-teal-300 to-blue-300 rounded-lg overflow-hidden mb-2">
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <span className="text-white font-bold text-sm drop-shadow">
                          {formatCurrency(currentResearch.salaryRange.min)}
                        </span>
                        <span className="text-white font-bold text-lg drop-shadow">
                          {formatCurrency(currentResearch.salaryRange.median)}
                        </span>
                        <span className="text-white font-bold text-sm drop-shadow">
                          {formatCurrency(currentResearch.salaryRange.max)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Based on {currentResearch.yearsExperience} years experience in {currentResearch.industry}
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BarChart className="w-5 h-5 text-teal-600" />
                      Salary Percentiles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">25th Percentile</span>
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(currentResearch.percentiles.p25)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className={`${getPercentileColor(25)} h-3 rounded-full`} style={{ width: '25%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">50th Percentile (Median)</span>
                          <span className="text-lg font-bold text-teal-600">
                            {formatCurrency(currentResearch.percentiles.p50)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className={`${getPercentileColor(50)} h-3 rounded-full`} style={{ width: '50%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">75th Percentile</span>
                          <span className="text-lg font-bold text-blue-600">
                            {formatCurrency(currentResearch.percentiles.p75)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className={`${getPercentileColor(75)} h-3 rounded-full`} style={{ width: '75%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">90th Percentile</span>
                          <span className="text-lg font-bold text-purple-600">
                            {formatCurrency(currentResearch.percentiles.p90)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className={`${getPercentileColor(90)} h-3 rounded-full`} style={{ width: '90%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-blue-900 font-medium mb-1">Understanding Percentiles</p>
                          <p className="text-xs text-blue-700">
                            The 75th percentile means you would earn more than 75% of professionals in this role. 
                            Aim for 75th-90th percentile if you have strong experience and skills.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-teal-600" />
                      Market Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-teal-200">
                        <p className="text-sm text-gray-600 mb-2">Market Demand</p>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border-2 ${getDemandColor(currentResearch.marketInsights.demand)}`}>
                          <Target className="w-4 h-4" />
                          {currentResearch.marketInsights.demand.toUpperCase()}
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-2">Growth Trend</p>
                        <div className={`inline-flex items-center gap-2 font-bold text-sm ${getTrendColor(currentResearch.marketInsights.growthTrend)}`}>
                          {getTrendIcon(currentResearch.marketInsights.growthTrend)}
                          {currentResearch.marketInsights.growthTrend.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <p className="text-sm font-semibold text-gray-700">Average Bonus</p>
                      </div>
                      <p className="text-2xl font-bold text-yellow-700">
                        {formatCurrency(currentResearch.marketInsights.averageBonus)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {((currentResearch.marketInsights.averageBonus / currentResearch.salaryRange.median) * 100).toFixed(0)}% of base salary
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Market Overview</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {currentResearch.marketInsights.marketDescription}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Top-Paying Companies</p>
                      <div className="grid grid-cols-2 gap-2">
                        {currentResearch.marketInsights.topCompanies.map((company, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">{company}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-2 border-yellow-200">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Lightbulb className="w-6 h-6 text-yellow-600" />
                      Negotiation Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {currentResearch.negotiationTips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="shadow-lg h-full flex items-center justify-center min-h-[600px]">
                <CardContent className="text-center py-12">
                  <div className="mb-6">
                    <DollarSign className="w-24 h-24 text-teal-200 mx-auto mb-4" />
                    <BarChart className="w-16 h-16 text-green-200 mx-auto -mt-8 ml-12" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Ready to Research Salaries?
                  </h2>
                  <p className="text-gray-600 mb-2 max-w-md mx-auto">
                    Enter your job details in the form to get comprehensive salary data, 
                    market insights, and personalized negotiation tips powered by AI.
                  </p>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Get salary ranges, percentiles, market demand, growth trends, and actionable 
                    advice to help you negotiate your best compensation package.
                  </p>
                </CardContent>
              </Card>
            )}

            {researchResults.length > 0 && !compareMode && (
              <Card className="shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-teal-600" />
                      Research History
                    </span>
                    {researchResults.length > 1 && (
                      <span className="text-sm text-gray-500 font-normal">
                        {researchResults.length} {researchResults.length === 1 ? 'result' : 'results'}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {researchResults.map((research) => (
                      <div
                        key={research.id}
                        className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                          currentResearch?.id === research.id
                            ? 'bg-teal-50 border-teal-300'
                            : 'bg-white border-gray-200 hover:border-teal-200'
                        } ${
                          selectedForCompare.includes(research.id)
                            ? 'ring-2 ring-purple-400'
                            : ''
                        }`}
                        onClick={() => {
                          if (compareMode) {
                            toggleCompareSelection(research.id);
                          } else {
                            setCurrentResearch(research);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {research.jobTitle}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {research.location} • {research.industry} • {research.companySize}
                            </p>
                            <p className="text-sm font-medium text-teal-600">
                              Median: {formatCurrency(research.salaryRange.median)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">
                              {new Date(research.timestamp).toLocaleDateString()}
                            </p>
                            {compareMode && (
                              <div className="mt-2">
                                <input
                                  type="checkbox"
                                  checked={selectedForCompare.includes(research.id)}
                                  onChange={() => toggleCompareSelection(research.id)}
                                  className="w-4 h-4"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
