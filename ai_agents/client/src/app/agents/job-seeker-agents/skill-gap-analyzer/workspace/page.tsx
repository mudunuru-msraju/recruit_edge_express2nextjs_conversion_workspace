import { useState, useEffect } from 'react';
import { 
  Target, TrendingUp, BookOpen, CheckCircle, XCircle, AlertCircle,
  Plus, BarChart, Calendar, Sparkles, Download, X, Upload,
  ArrowRight, Clock
} from 'lucide-react';
import { useSkillGapAnalyzer } from '../contexts/SkillGapAnalyzerProvider';
import { API_BASE_URL, getMockUserId } from '../api/config';
import type { SkillAnalysis, Priority, LearningResource } from '../types';

export default function SkillGapAnalyzerWorkspace() {
  const { currentAnalysis, skillGaps, isAnalyzing, setCurrentAnalysis, setSkillGaps, setIsAnalyzing } = useSkillGapAnalyzer();
  const [analyses, setAnalyses] = useState<SkillAnalysis[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [currentSkillInput, setCurrentSkillInput] = useState('');
  
  const [formData, setFormData] = useState({
    currentRole: '',
    targetRole: '',
    targetCompany: '',
    currentSkills: [] as string[],
    yearsExperience: '',
    jobDescription: '',
  });

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const userId = getMockUserId();
      const response = await fetch(`${API_BASE_URL}/api/agents/skill-gap-analyzer/analyses?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data);
      }
    } catch (error) {
      console.error('Error loading analyses:', error);
    }
  };

  const loadSkillGaps = async (analysisId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/skill-gap-analyzer/analyses/${analysisId}/gaps`);
      if (response.ok) {
        const gaps = await response.json();
        setSkillGaps(gaps);
      }
    } catch (error) {
      console.error('Error loading skill gaps:', error);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentSkillInput.trim()) {
      e.preventDefault();
      if (!formData.currentSkills.includes(currentSkillInput.trim())) {
        setFormData({
          ...formData,
          currentSkills: [...formData.currentSkills, currentSkillInput.trim()],
        });
      }
      setCurrentSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      currentSkills: formData.currentSkills.filter(s => s !== skillToRemove),
    });
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      const userId = getMockUserId();

      const aiResponse = await fetch(`${API_BASE_URL}/api/agents/skill-gap-analyzer/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: formData.jobDescription,
          currentSkills: formData.currentSkills,
        }),
      });

      let requiredSkills: string[] = [];
      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        requiredSkills = aiData.requiredSkills || [];
      }

      const analysisResponse = await fetch(`${API_BASE_URL}/api/agents/skill-gap-analyzer/analyses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          targetRole: formData.targetRole,
          targetCompany: formData.targetCompany || null,
          jobDescription: formData.jobDescription || null,
          currentSkills: formData.currentSkills,
          requiredSkills: requiredSkills.length > 0 ? requiredSkills : [...formData.currentSkills, 'TypeScript', 'Docker', 'AWS'],
        }),
      });

      if (analysisResponse.ok) {
        const result = await analysisResponse.json();
        setCurrentAnalysis(result.analysis);
        await loadSkillGaps(result.analysis.id);
        await loadAnalyses();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error analyzing skills:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setSkillGaps([]);
    setFormData({
      currentRole: '',
      targetRole: '',
      targetCompany: '',
      currentSkills: [],
      yearsExperience: '',
      jobDescription: '',
    });
    setShowForm(true);
  };

  const handleSelectAnalysis = async (analysis: SkillAnalysis) => {
    setCurrentAnalysis(analysis);
    await loadSkillGaps(analysis.id!);
    setShowForm(false);
  };

  const handleExportPlan = () => {
    if (!currentAnalysis || skillGaps.length === 0) return;

    const content = `
# Learning Plan for ${currentAnalysis.targetRole}
Generated on: ${new Date().toLocaleDateString()}

## Overall Match Score: ${currentAnalysis.overallScore}%

## Summary
${currentAnalysis.summary}

## Skills to Develop

${skillGaps.map((gap, idx) => `
### ${idx + 1}. ${gap.skillName}
- **Priority**: ${gap.priority}
- **Current Level**: ${gap.currentLevel}
- **Required Level**: ${gap.requiredLevel}
- **Estimated Time**: ${gap.estimatedTime || '2-4 weeks'}
${gap.learningResources && gap.learningResources.length > 0 ? `
**Learning Resources**:
${gap.learningResources.map(r => `  - [${r.title}](${r.url}) - ${r.type}`).join('\n')}
` : ''}
`).join('\n')}

## Next Steps
1. Start with high-priority skills
2. Follow the recommended learning resources
3. Practice regularly and build projects
4. Track your progress and update your skills
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning-plan-${currentAnalysis.targetRole.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMockLearningResources = (skillName: string): LearningResource[] => [
    {
      title: `${skillName} Complete Guide`,
      url: `https://example.com/learn/${skillName.toLowerCase()}`,
      type: 'course',
      provider: 'Udemy',
      duration: '20 hours',
      cost: '$49.99',
    },
    {
      title: `${skillName} Documentation`,
      url: `https://docs.example.com/${skillName.toLowerCase()}`,
      type: 'article',
      provider: 'Official Docs',
      duration: '5 hours',
      cost: 'Free',
    },
    {
      title: `Master ${skillName}`,
      url: `https://youtube.com/${skillName.toLowerCase()}`,
      type: 'video',
      provider: 'YouTube',
      duration: '10 hours',
      cost: 'Free',
    },
  ];

  const totalAnalyses = analyses.length;
  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (a.overallScore || 0), 0) / analyses.length)
    : 0;

  const matchingSkills = currentAnalysis
    ? currentAnalysis.currentSkills.filter(cs =>
        currentAnalysis.requiredSkills.some(rs => rs.toLowerCase() === cs.toLowerCase())
      )
    : [];
  const missingSkills = currentAnalysis
    ? currentAnalysis.requiredSkills.filter(rs =>
        !currentAnalysis.currentSkills.some(cs => cs.toLowerCase() === rs.toLowerCase())
      )
    : [];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Skill Gap Analyzer</h1>
            <p className="text-sm text-gray-500">Identify skill gaps and create personalized learning plans</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 mr-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{totalAnalyses}</div>
                <div className="text-xs text-gray-500">Analyses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{avgScore > 0 ? `${avgScore}%` : '--'}</div>
                <div className="text-xs text-gray-500">Avg Match</div>
              </div>
            </div>
            {!showForm && currentAnalysis && (
              <button
                onClick={handleExportPlan}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Plan
              </button>
            )}
            <button
              onClick={handleNewAnalysis}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {showForm ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-teal-600" />
                  Skill Gap Analysis Form
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Current Role
                      </label>
                      <input
                        type="text"
                        value={formData.currentRole}
                        onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                        placeholder="e.g., Junior Developer"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Target Role
                      </label>
                      <input
                        type="text"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        placeholder="e.g., Full Stack Developer"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Target Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.targetCompany}
                        onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                        placeholder="e.g., Google, Amazon"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={formData.yearsExperience}
                        onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                        placeholder="e.g., 3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Your Current Skills
                    </label>
                    <div className="mb-2">
                      <input
                        type="text"
                        value={currentSkillInput}
                        onChange={(e) => setCurrentSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        placeholder="Type a skill and press Enter"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Press Enter to add each skill</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.currentSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:bg-teal-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {formData.currentSkills.length === 0 && (
                        <span className="text-sm text-gray-400 italic">No skills added yet</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Job Description (Optional)
                    </label>
                    <textarea
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                      placeholder="Paste the job description here for more accurate analysis..."
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-900 mb-1">Upload Resume (Optional)</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Upload your resume to auto-extract skills
                    </p>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm">
                      Choose File
                    </button>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !formData.targetRole || formData.currentSkills.length === 0}
                    className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isAnalyzing ? 'Analyzing Skills...' : 'Analyze Skills with AI'}
                  </button>
                </div>
              </div>

              {analyses.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Previous Analyses</h3>
                  <div className="space-y-3">
                    {analyses.slice(0, 5).map((analysis) => (
                      <div
                        key={analysis.id}
                        onClick={() => handleSelectAnalysis(analysis)}
                        className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer hover:border-teal-300"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{analysis.targetRole}</h4>
                            {analysis.targetCompany && (
                              <p className="text-sm text-gray-600 mt-1">{analysis.targetCompany}</p>
                            )}
                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(analysis.createdAt!).toLocaleDateString()}
                              </span>
                              <span>{analysis.currentSkills.length} skills</span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className={`text-2xl font-bold ${
                              analysis.overallScore! >= 70 ? 'text-green-600' :
                              analysis.overallScore! >= 50 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {analysis.overallScore}%
                            </div>
                            <div className="text-xs text-gray-500">Match</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : currentAnalysis ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-6">
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-8 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentAnalysis.targetRole}</h2>
                    {currentAnalysis.targetCompany && (
                      <p className="text-lg text-gray-700 mb-4">at {currentAnalysis.targetCompany}</p>
                    )}
                    <p className="text-gray-700 mb-4">{currentAnalysis.summary}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Analyzed on {new Date(currentAnalysis.createdAt!).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-center ml-6">
                    <div className={`text-6xl font-bold mb-2 ${
                      currentAnalysis.overallScore! >= 70 ? 'text-green-600' :
                      currentAnalysis.overallScore! >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {currentAnalysis.overallScore}%
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">Overall Match</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{matchingSkills.length}</div>
                      <div className="text-sm text-gray-600">Skills You Have</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-4">
                    {matchingSkills.slice(0, 5).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {matchingSkills.length > 5 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">+{matchingSkills.length - 5} more</span>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{missingSkills.length}</div>
                      <div className="text-sm text-gray-600">Skills to Learn</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-4">
                    {missingSkills.slice(0, 5).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {missingSkills.length > 5 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">+{missingSkills.length - 5} more</span>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{skillGaps.length}</div>
                      <div className="text-sm text-gray-600">Learning Goals</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Focus on high-priority skills to maximize impact
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-teal-600" />
                  Skill Gap Analysis & Learning Plan
                </h3>

                <div className="space-y-4">
                  {skillGaps.map((gap, index) => (
                    <div key={gap.id} className="border rounded-lg p-5 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                            <h4 className="text-lg font-semibold text-gray-900">{gap.skillName}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(gap.priority)}`}>
                              {gap.priority.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Current:</span>
                              <span className="capitalize">{gap.currentLevel}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Target:</span>
                              <span className="capitalize">{gap.requiredLevel}</span>
                            </div>
                            {gap.estimatedTime && (
                              <div className="flex items-center gap-1 ml-4">
                                <Clock className="w-4 h-4" />
                                <span>{gap.estimatedTime || '2-4 weeks'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-teal-600" />
                          Recommended Learning Resources
                        </h5>
                        <div className="grid grid-cols-3 gap-3">
                          {getMockLearningResources(gap.skillName).map((resource, idx) => (
                            <a
                              key={idx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 border border-gray-200 rounded-lg hover:border-teal-300 hover:shadow-sm transition"
                            >
                              <div className="flex items-start gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                                <h6 className="text-sm font-semibold text-gray-900 line-clamp-2">{resource.title}</h6>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                <span className="capitalize">{resource.type}</span>
                                <span>{resource.cost}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{resource.duration}</div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {skillGaps.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                      <p className="text-lg font-semibold">Perfect Match!</p>
                      <p className="text-sm">You have all the required skills for this role.</p>
                    </div>
                  )}
                </div>
              </div>

              {skillGaps.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Next Steps</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Start with high-priority skills to maximize your impact</li>
                        <li>• Follow the recommended learning resources for structured learning</li>
                        <li>• Build projects to practice and demonstrate your new skills</li>
                        <li>• Update your resume and portfolio as you learn</li>
                        <li>• Click "Export Plan" to save your personalized learning roadmap</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
