import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Trash2, 
  Save, 
  Eye, 
  Edit, 
  Sparkles,
  Briefcase,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Building2,
  GraduationCap,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface JobPosting {
  id: number;
  title: string;
  department: string | null;
  location: string | null;
  employmentType: string;
  experienceLevel: string;
  salaryMin: number | null;
  salaryMax: number | null;
  responsibilities: string;
  qualifications: string;
  benefits: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  responsibilities: string;
  qualifications: string;
  benefits: string;
  status: 'draft' | 'published';
}

export default function JobDescriptionGeneratorWorkspace() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    department: '',
    location: '',
    employmentType: 'full-time',
    experienceLevel: 'mid-level',
    salaryMin: '',
    salaryMax: '',
    responsibilities: '',
    qualifications: '',
    benefits: '',
    status: 'draft',
  });

  const userId = 1;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`/api/agents/job-description-generator/jobs?userId=${userId}`);
      const data = await response.json();
      setJobs(data);
      if (data.length > 0 && !selectedJob) {
        setSelectedJob(data[0]);
        loadJobIntoForm(data[0]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJobIntoForm = (job: JobPosting) => {
    setFormData({
      title: job.title,
      department: job.department || '',
      location: job.location || '',
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      salaryMin: job.salaryMin?.toString() || '',
      salaryMax: job.salaryMax?.toString() || '',
      responsibilities: job.responsibilities,
      qualifications: job.qualifications,
      benefits: job.benefits,
      status: job.status,
    });
  };

  const handleSelectJob = (job: JobPosting) => {
    setSelectedJob(job);
    loadJobIntoForm(job);
    setIsPreviewMode(false);
  };

  const handleNewJob = () => {
    setSelectedJob(null);
    setFormData({
      title: '',
      department: '',
      location: '',
      employmentType: 'full-time',
      experienceLevel: 'mid-level',
      salaryMin: '',
      salaryMax: '',
      responsibilities: '',
      qualifications: '',
      benefits: '',
      status: 'draft',
    });
    setIsPreviewMode(false);
  };

  const generateResponsibilities = (data: FormData): string => {
    const level = data.experienceLevel;
    
    const responsibilities = [
      `Lead and execute strategic initiatives aligned with the ${data.department || 'department'}'s goals and objectives`,
      `Collaborate with cross-functional teams to deliver high-quality results and drive innovation`,
      `Analyze complex problems and develop creative solutions that meet business requirements`,
      `Mentor and guide ${level === 'entry-level' ? 'peers' : level === 'senior' ? 'junior team members' : 'team members'} to foster professional growth`,
      `Participate in planning sessions and contribute to the technical direction of projects`,
      `Ensure adherence to best practices, coding standards, and quality assurance protocols`,
      `Communicate effectively with stakeholders at all levels to ensure project alignment`,
      `Stay current with industry trends and emerging technologies to maintain competitive advantage`,
      `Contribute to process improvements and operational efficiency initiatives`,
      `Take ownership of deliverables and ensure timely completion of assigned tasks`
    ];

    return responsibilities.join('\n• ');
  };

  const generateQualifications = (data: FormData): string => {
    const level = data.experienceLevel;
    const yearsMap: Record<string, string> = {
      'entry-level': '1-2',
      'mid-level': '3-5',
      'senior': '5-8',
      'lead': '8-10',
      'executive': '10+'
    };
    
    const qualifications = [
      `${yearsMap[level] || '3-5'} years of proven experience in a similar role`,
      `Bachelor's degree in ${data.department || 'relevant field'} or equivalent practical experience`,
      `Strong analytical and problem-solving skills with attention to detail`,
      `Excellent written and verbal communication abilities`,
      `Demonstrated ability to work effectively both independently and in team environments`,
      `Proficiency with industry-standard tools and technologies`,
      `Track record of successfully delivering projects on time and within scope`,
      level !== 'entry-level' ? `Experience mentoring or leading team members` : `Eagerness to learn and grow professionally`,
      `Strong organizational skills and ability to manage multiple priorities`,
      `Commitment to continuous learning and professional development`
    ];

    return qualifications.join('\n• ');
  };

  const generateBenefits = (data: FormData): string => {
    const benefits = [
      `Competitive salary range of ${data.salaryMin && data.salaryMax ? `$${parseInt(data.salaryMin).toLocaleString()} - $${parseInt(data.salaryMax).toLocaleString()}` : '$XX,XXX - $XXX,XXX'} annually`,
      `Comprehensive health, dental, and vision insurance coverage`,
      `401(k) retirement plan with generous company matching`,
      `Flexible work arrangements including remote work options`,
      `Generous paid time off (PTO) and holiday schedule`,
      `Professional development budget for courses, conferences, and certifications`,
      `Modern workspace with state-of-the-art equipment and tools`,
      `Collaborative and inclusive company culture that values diversity`,
      `Regular team building activities and company-sponsored events`,
      `Employee wellness programs including gym memberships and mental health support`,
      `Stock options or equity participation for eligible positions`,
      `Parental leave and family-friendly policies`
    ];

    return benefits.join('\n• ');
  };

  const handleGenerateSection = async (section: 'responsibilities' | 'qualifications' | 'benefits') => {
    setIsGenerating(section);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let generatedContent = '';
      switch (section) {
        case 'responsibilities':
          generatedContent = generateResponsibilities(formData);
          break;
        case 'qualifications':
          generatedContent = generateQualifications(formData);
          break;
        case 'benefits':
          generatedContent = generateBenefits(formData);
          break;
      }
      
      setFormData({ ...formData, [section]: generatedContent });
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(null);
    }
  };

  const handleGenerateComplete = async () => {
    setIsGenerating('complete');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFormData({
        ...formData,
        responsibilities: generateResponsibilities(formData),
        qualifications: generateQualifications(formData),
        benefits: generateBenefits(formData),
      });
    } catch (error) {
      console.error('Error generating complete JD:', error);
    } finally {
      setIsGenerating(null);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const jobData = {
        userId,
        title: formData.title || 'Untitled Position',
        department: formData.department,
        location: formData.location,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        responsibilities: formData.responsibilities,
        qualifications: formData.qualifications,
        benefits: formData.benefits,
        status: formData.status,
      };

      if (selectedJob) {
        const response = await fetch(`/api/agents/job-description-generator/jobs/${selectedJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobData),
        });
        const updatedJob = await response.json();
        setJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
        setSelectedJob(updatedJob);
      } else {
        const response = await fetch('/api/agents/job-description-generator/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobData),
        });
        const newJob = await response.json();
        setJobs([newJob, ...jobs]);
        setSelectedJob(newJob);
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving job:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handlePublish = async () => {
    setFormData({ ...formData, status: 'published' });
    setTimeout(handleSave, 100);
  };

  const handleDelete = async () => {
    if (!selectedJob) return;
    
    try {
      await fetch(`/api/agents/job-description-generator/jobs/${selectedJob.id}?userId=${userId}`, { 
        method: 'DELETE' 
      });
      const updatedJobs = jobs.filter(j => j.id !== selectedJob.id);
      setJobs(updatedJobs);
      setShowDeleteConfirm(false);
      
      if (updatedJobs.length > 0) {
        handleSelectJob(updatedJobs[0]);
      } else {
        handleNewJob();
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const formatSalaryRange = () => {
    if (formData.salaryMin && formData.salaryMax) {
      return `$${parseInt(formData.salaryMin).toLocaleString()} - $${parseInt(formData.salaryMax).toLocaleString()}`;
    }
    return 'Competitive salary';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
        <div className="text-green-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-teal-100 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link 
              to="/agents/recruiter-agents/job-description-generator" 
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Description Generator</h1>
              <p className="text-sm text-gray-500">Create professional job postings with AI assistance</p>
            </div>
          </div>
          
          <Button 
            onClick={handleNewJob} 
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Job Posting
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-6 py-6">
          <div className="h-full grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3 overflow-y-auto">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">Job Postings</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {jobs.length === 0 ? (
                    <div className="p-6 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No job postings yet</p>
                      <p className="text-xs text-gray-400 mt-1">Click "New Job Posting" to start</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {jobs.map((job) => (
                        <button
                          key={job.id}
                          onClick={() => handleSelectJob(job)}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                            selectedJob?.id === job.id ? 'bg-green-50 border-l-4 border-green-600' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Briefcase className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              selectedJob?.id === job.id ? 'text-green-600' : 'text-gray-400'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {job.title}
                              </h3>
                              {job.department && (
                                <p className="text-sm text-gray-600 truncate">{job.department}</p>
                              )}
                              {job.location && (
                                <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" />
                                  {job.location}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  job.status === 'published' 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                  {job.status === 'published' ? 'Published' : 'Draft'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="col-span-12 lg:col-span-9 overflow-y-auto">
              {jobs.length === 0 && !selectedJob && !formData.title ? (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center py-12 px-6">
                    <Briefcase className="w-20 h-20 text-green-200 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Create Your First Job Posting
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Get started by creating a new job posting. Use our AI assistant to generate 
                      professional job descriptions tailored to your needs.
                    </p>
                    <Button 
                      onClick={handleNewJob} 
                      className="bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create First Job Posting
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="h-full flex flex-col">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Job Title"
                          className="text-xl font-bold text-gray-900 bg-transparent border-none outline-none w-full"
                          disabled={isPreviewMode}
                        />
                        {(formData.department || formData.location) && (
                          <p className="text-sm text-gray-600 mt-1 flex items-center gap-3">
                            {formData.department && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {formData.department}
                              </span>
                            )}
                            {formData.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {formData.location}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          formData.status === 'published' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {formData.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPreviewMode(!isPreviewMode)}
                        >
                          {isPreviewMode ? (
                            <>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </>
                          )}
                        </Button>
                        
                        {selectedJob && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(true)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                        
                        {formData.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={handlePublish}
                            disabled={saveStatus === 'saving'}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Publish
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={saveStatus === 'saving'}
                          className="bg-green-600 hover:bg-green-700"
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
                              {saveStatus === 'saving' ? 'Saving...' : 'Save'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-6">
                    {isPreviewMode ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-white p-8 rounded-lg shadow-sm border">
                          <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || 'Job Title'}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                              {formData.department && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  {formData.department}
                                </span>
                              )}
                              {formData.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {formData.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formData.employmentType.charAt(0).toUpperCase() + formData.employmentType.slice(1).replace('-', ' ')}
                              </span>
                              <span className="flex items-center gap-1">
                                <GraduationCap className="w-4 h-4" />
                                {formData.experienceLevel.charAt(0).toUpperCase() + formData.experienceLevel.slice(1).replace('-', ' ')}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {formatSalaryRange()}
                              </span>
                            </div>
                          </div>

                          {formData.responsibilities && (
                            <div className="mb-6">
                              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-green-600" />
                                Key Responsibilities
                              </h2>
                              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                • {formData.responsibilities}
                              </div>
                            </div>
                          )}

                          {formData.qualifications && (
                            <div className="mb-6">
                              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-green-600" />
                                Qualifications
                              </h2>
                              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                • {formData.qualifications}
                              </div>
                            </div>
                          )}

                          {formData.benefits && (
                            <div className="mb-6">
                              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                Benefits & Perks
                              </h2>
                              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                • {formData.benefits}
                              </div>
                            </div>
                          )}

                          {!formData.responsibilities && !formData.qualifications && !formData.benefits && (
                            <p className="text-gray-400 italic text-center py-8">
                              No content to preview. Fill in the job details or use AI generation to create content.
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-green-900">AI-Powered Generation</span>
                            </div>
                            <Button
                              onClick={handleGenerateComplete}
                              disabled={isGenerating !== null}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              {isGenerating === 'complete' ? (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Generate Complete JD with AI
                                </>
                              )}
                            </Button>
                          </div>
                          <p className="text-sm text-green-700 mt-2">
                            Let AI generate all sections at once, or use the individual generate buttons below for each section.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Job Title *
                            </label>
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              placeholder="e.g., Senior Software Engineer"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Department
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                placeholder="e.g., Engineering"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Location
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g., San Francisco, CA"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Employment Type
                            </label>
                            <select
                              value={formData.employmentType}
                              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              <option value="full-time">Full-time</option>
                              <option value="part-time">Part-time</option>
                              <option value="contract">Contract</option>
                              <option value="temporary">Temporary</option>
                              <option value="internship">Internship</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Experience Level
                            </label>
                            <div className="relative">
                              <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                              <select
                                value={formData.experienceLevel}
                                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                              >
                                <option value="entry-level">Entry Level</option>
                                <option value="mid-level">Mid Level</option>
                                <option value="senior">Senior</option>
                                <option value="lead">Lead</option>
                                <option value="executive">Executive</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Salary Range
                            </label>
                            <div className="flex gap-2 items-center">
                              <div className="relative flex-1">
                                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input
                                  type="number"
                                  value={formData.salaryMin}
                                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                                  placeholder="Min"
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                              <span className="text-gray-500">-</span>
                              <div className="relative flex-1">
                                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input
                                  type="number"
                                  value={formData.salaryMax}
                                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                                  placeholder="Max"
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Key Responsibilities
                            </label>
                            <Button
                              onClick={() => handleGenerateSection('responsibilities')}
                              disabled={isGenerating !== null}
                              size="sm"
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-50"
                            >
                              {isGenerating === 'responsibilities' ? (
                                <>
                                  <Sparkles className="w-3 h-3 mr-2 animate-pulse" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3 mr-2" />
                                  Generate with AI
                                </>
                              )}
                            </Button>
                          </div>
                          <textarea
                            value={formData.responsibilities}
                            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                            placeholder="List the key responsibilities for this position..."
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-mono text-sm"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Qualifications
                            </label>
                            <Button
                              onClick={() => handleGenerateSection('qualifications')}
                              disabled={isGenerating !== null}
                              size="sm"
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-50"
                            >
                              {isGenerating === 'qualifications' ? (
                                <>
                                  <Sparkles className="w-3 h-3 mr-2 animate-pulse" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3 mr-2" />
                                  Generate with AI
                                </>
                              )}
                            </Button>
                          </div>
                          <textarea
                            value={formData.qualifications}
                            onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                            placeholder="List the required qualifications and skills..."
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-mono text-sm"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Benefits & Perks
                            </label>
                            <Button
                              onClick={() => handleGenerateSection('benefits')}
                              disabled={isGenerating !== null}
                              size="sm"
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-50"
                            >
                              {isGenerating === 'benefits' ? (
                                <>
                                  <Sparkles className="w-3 h-3 mr-2 animate-pulse" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3 mr-2" />
                                  Generate with AI
                                </>
                              )}
                            </Button>
                          </div>
                          <textarea
                            value={formData.benefits}
                            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                            placeholder="List the benefits and perks offered..."
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-mono text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-lg">Delete Job Posting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedJob?.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
