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
  Copy,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CoverLetter {
  id: number;
  title: string;
  content: string;
  companyName: string | null;
  jobTitle: string | null;
  tone: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  hiringManager: string;
  tone: string;
  content: string;
}

export default function CoverLetterWriterWorkspace() {
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    hiringManager: '',
    tone: 'professional',
    content: '',
  });

  const userId = 1;

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await fetch(`/api/agents/cover-letter-writer/cover-letters?userId=${userId}`);
      const data = await response.json();
      setLetters(data);
      if (data.length > 0 && !selectedLetter) {
        setSelectedLetter(data[0]);
        setFormData({
          title: data[0].title,
          companyName: data[0].companyName || '',
          jobTitle: data[0].jobTitle || '',
          jobDescription: '',
          hiringManager: '',
          tone: data[0].tone,
          content: data[0].content,
        });
      }
    } catch (error) {
      console.error('Error fetching cover letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLetter = (letter: CoverLetter) => {
    setSelectedLetter(letter);
    setFormData({
      title: letter.title,
      companyName: letter.companyName || '',
      jobTitle: letter.jobTitle || '',
      jobDescription: '',
      hiringManager: '',
      tone: letter.tone,
      content: letter.content,
    });
    setIsPreviewMode(false);
  };

  const handleNewLetter = () => {
    setSelectedLetter(null);
    setFormData({
      title: '',
      companyName: '',
      jobTitle: '',
      jobDescription: '',
      hiringManager: '',
      tone: 'professional',
      content: '',
    });
    setIsPreviewMode(false);
  };

  const generateMockCoverLetter = (data: FormData): string => {
    const greeting = data.hiringManager 
      ? `Dear ${data.hiringManager},`
      : 'Dear Hiring Manager,';
    
    const companyName = data.companyName || '[Company Name]';
    const jobTitle = data.jobTitle || '[Job Title]';
    const jobDesc = data.jobDescription || '';
    
    const paragraphs = [];
    
    paragraphs.push(`${greeting}\n`);
    
    paragraphs.push(
      `I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. ` +
      `With my background in delivering high-quality results and my passion for innovation, ` +
      `I am confident that I would be a valuable addition to your team.`
    );
    
    if (jobDesc) {
      paragraphs.push(
        `I was particularly excited to learn about this opportunity because ${jobDesc.substring(0, 100)}... ` +
        `My experience aligns perfectly with the requirements outlined in the job description, ` +
        `and I am eager to contribute my skills to help ${companyName} achieve its goals.`
      );
    } else {
      paragraphs.push(
        `Throughout my career, I have consistently demonstrated my ability to adapt to new challenges ` +
        `and deliver exceptional results. My experience has equipped me with the skills necessary ` +
        `to excel in this role and contribute meaningfully to ${companyName}'s continued success.`
      );
    }
    
    paragraphs.push(
      `In my previous roles, I have developed strong expertise in problem-solving, collaboration, ` +
      `and project management. I pride myself on my ability to work effectively both independently ` +
      `and as part of a team, and I am always seeking opportunities to learn and grow professionally.`
    );
    
    paragraphs.push(
      `I am excited about the possibility of bringing my unique perspective and dedication to ${companyName}. ` +
      `I would welcome the opportunity to discuss how my background, skills, and enthusiasm ` +
      `align with your team's needs.`
    );
    
    paragraphs.push(
      `Thank you for considering my application. I look forward to the opportunity to speak with you further ` +
      `about how I can contribute to ${companyName}'s success.`
    );
    
    paragraphs.push(`\nSincerely,\n[Your Name]`);
    
    return paragraphs.join('\n\n');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const generatedContent = generateMockCoverLetter(formData);
      setFormData({ ...formData, content: generatedContent });
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      if (selectedLetter) {
        const response = await fetch(`/api/agents/cover-letter-writer/cover-letters/${selectedLetter.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId, 
            title: formData.title,
            content: formData.content,
            companyName: formData.companyName,
            jobTitle: formData.jobTitle,
            tone: formData.tone
          }),
        });
        const updatedLetter = await response.json();
        setLetters(letters.map(l => l.id === updatedLetter.id ? updatedLetter : l));
        setSelectedLetter(updatedLetter);
        setSaveStatus('saved');
      } else {
        const response = await fetch('/api/agents/cover-letter-writer/cover-letters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId, 
            title: formData.title || 'Untitled Cover Letter',
            content: formData.content,
            companyName: formData.companyName,
            jobTitle: formData.jobTitle,
            tone: formData.tone
          }),
        });
        const newLetter = await response.json();
        setLetters([newLetter, ...letters]);
        setSelectedLetter(newLetter);
        setSaveStatus('saved');
      }
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving cover letter:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleDelete = async () => {
    if (!selectedLetter) return;
    
    try {
      await fetch(`/api/agents/cover-letter-writer/cover-letters/${selectedLetter.id}?userId=${userId}`, { 
        method: 'DELETE' 
      });
      const updatedLetters = letters.filter(l => l.id !== selectedLetter.id);
      setLetters(updatedLetters);
      setShowDeleteConfirm(false);
      
      if (updatedLetters.length > 0) {
        handleSelectLetter(updatedLetters[0]);
      } else {
        handleNewLetter();
      }
    } catch (error) {
      console.error('Error deleting cover letter:', error);
    }
  };

  const handleExport = () => {
    if (!formData.content) return;
    
    const blob = new Blob([formData.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title || 'cover-letter'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!formData.content) return;
    
    try {
      await navigator.clipboard.writeText(formData.content);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
        <div className="text-teal-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-teal-100 flex flex-col">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link 
              to="/agents/job-seeker-agents/cover-letter-writer" 
              className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cover Letter Writer</h1>
              <p className="text-sm text-gray-500">Create professional cover letters with AI assistance</p>
            </div>
          </div>
          
          <Button 
            onClick={handleNewLetter} 
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Letter
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-6 py-6">
          <div className="h-full grid grid-cols-12 gap-6">
            {/* Left Sidebar - Letters List */}
            <div className="col-span-12 lg:col-span-3 overflow-y-auto">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">My Cover Letters</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {letters.length === 0 ? (
                    <div className="p-6 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No letters yet</p>
                      <p className="text-xs text-gray-400 mt-1">Click "New Letter" to start</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {letters.map((letter) => (
                        <button
                          key={letter.id}
                          onClick={() => handleSelectLetter(letter)}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                            selectedLetter?.id === letter.id ? 'bg-teal-50 border-l-4 border-teal-600' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <FileText className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              selectedLetter?.id === letter.id ? 'text-teal-600' : 'text-gray-400'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {letter.title}
                              </h3>
                              {letter.companyName && (
                                <p className="text-sm text-gray-600 truncate">{letter.companyName}</p>
                              )}
                              {letter.jobTitle && (
                                <p className="text-xs text-gray-500 truncate">{letter.jobTitle}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(letter.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Main Area - Editor/Preview */}
            <div className="col-span-12 lg:col-span-9 overflow-y-auto">
              {letters.length === 0 && !selectedLetter && !formData.title && !formData.content ? (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center py-12 px-6">
                    <FileText className="w-20 h-20 text-teal-200 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Create Your First Cover Letter
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Get started by creating a new cover letter. Use our AI assistant to generate 
                      professional content tailored to your job application.
                    </p>
                    <Button 
                      onClick={handleNewLetter} 
                      className="bg-teal-600 hover:bg-teal-700"
                      size="lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create First Letter
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="h-full flex flex-col">
                  {/* Editor Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Untitled Cover Letter"
                          className="text-xl font-bold text-gray-900 bg-transparent border-none outline-none w-full"
                          disabled={isPreviewMode}
                        />
                        {formData.companyName && (
                          <p className="text-sm text-gray-600 mt-1">
                            {formData.companyName} {formData.jobTitle && `• ${formData.jobTitle}`}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
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
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          disabled={!formData.content}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExport}
                          disabled={!formData.content}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        
                        {selectedLetter && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(true)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={saveStatus === 'saving' || !formData.content}
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
                              {saveStatus === 'saving' ? 'Saving...' : 'Save'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Editor Content */}
                  <CardContent className="flex-1 overflow-y-auto p-6">
                    {isPreviewMode ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-white p-8 rounded-lg shadow-sm border">
                          <div className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
                            {formData.content || (
                              <p className="text-gray-400 italic">No content to preview</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Form Fields */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Company Name
                            </label>
                            <input
                              type="text"
                              value={formData.companyName}
                              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                              placeholder="e.g., Google"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Job Title
                            </label>
                            <input
                              type="text"
                              value={formData.jobTitle}
                              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                              placeholder="e.g., Software Engineer"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Hiring Manager (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.hiringManager}
                            onChange={(e) => setFormData({ ...formData, hiringManager: e.target.value })}
                            placeholder="e.g., Jane Smith"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Job Description (Optional)
                          </label>
                          <textarea
                            value={formData.jobDescription}
                            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                            placeholder="Paste the job description here to help AI generate better content..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Tone
                          </label>
                          <select
                            value={formData.tone}
                            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="professional">Professional</option>
                            <option value="enthusiastic">Enthusiastic</option>
                            <option value="creative">Creative</option>
                            <option value="formal">Formal</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Cover Letter Content
                            </label>
                            <Button
                              type="button"
                              onClick={handleGenerate}
                              disabled={isGenerating || !formData.companyName || !formData.jobTitle}
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              {isGenerating ? 'Generating...' : 'Generate with AI'}
                            </Button>
                          </div>
                          <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Your cover letter content will appear here... Click 'Generate with AI' to create content automatically, or write your own."
                            rows={16}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm resize-none"
                          />
                          {!formData.companyName || !formData.jobTitle ? (
                            <p className="text-xs text-amber-600 mt-1">
                              Please fill in Company Name and Job Title to use AI generation
                            </p>
                          ) : null}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Delete Cover Letter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete "{formData.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
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
