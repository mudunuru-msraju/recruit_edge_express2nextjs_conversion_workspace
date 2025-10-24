import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Mail, 
  FileText, 
  Trash2, 
  Save, 
  Eye, 
  Edit, 
  Sparkles,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Copy,
  Building2,
  MapPin,
  Briefcase,
  Award,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OfferLetter {
  id: string;
  candidateName: string;
  position: string;
  department: string;
  startDate: string;
  salary: number;
  bonus: number;
  benefits: string;
  equity: string;
  workLocation: string;
  employmentType: string;
  template: 'formal' | 'friendly' | 'tech-startup';
  content: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  candidateName: string;
  position: string;
  department: string;
  startDate: string;
  salary: string;
  bonus: string;
  benefits: string;
  equity: string;
  workLocation: string;
  employmentType: string;
  template: 'formal' | 'friendly' | 'tech-startup';
  content: string;
}

export default function OfferLetterBuilderWorkspace() {
  const [offers, setOffers] = useState<OfferLetter[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<OfferLetter | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  
  const [formData, setFormData] = useState<FormData>({
    candidateName: '',
    position: '',
    department: '',
    startDate: '',
    salary: '',
    bonus: '',
    benefits: '',
    equity: '',
    workLocation: '',
    employmentType: 'full-time',
    template: 'formal',
    content: '',
  });

  const generateOfferLetter = (data: FormData): string => {
    const candidateName = data.candidateName || '[Candidate Name]';
    const position = data.position || '[Position]';
    const department = data.department || '[Department]';
    const startDate = data.startDate ? new Date(data.startDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '[Start Date]';
    const salary = data.salary ? `$${parseInt(data.salary).toLocaleString()}` : '[Salary]';
    const bonus = data.bonus ? `$${parseInt(data.bonus).toLocaleString()}` : '0';
    const equity = data.equity || 'N/A';
    const workLocation = data.workLocation || '[Location]';
    const employmentType = data.employmentType || 'full-time';
    const benefits = data.benefits || 'Comprehensive benefits package';

    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    if (data.template === 'friendly') {
      return `${today}

Dear ${candidateName},

We're thrilled to offer you the position of ${position} in our ${department} team! 🎉

After getting to know you through the interview process, we're confident that you'll be a fantastic addition to our team. Your skills and enthusiasm really stood out, and we can't wait to see what we'll accomplish together.

Here's what we're offering:

💼 Position Details:
• Role: ${position}
• Department: ${department}
• Start Date: ${startDate}
• Employment Type: ${employmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
• Location: ${workLocation}

💰 Compensation Package:
• Annual Salary: ${salary}
• Annual Bonus: ${bonus}
• Equity/Stock Options: ${equity}

🌟 Benefits & Perks:
${benefits}

We believe in creating an environment where everyone can do their best work. You'll be joining a team that values innovation, collaboration, and personal growth.

Please review this offer and let us know your decision by [response deadline]. We're here to answer any questions you might have!

Looking forward to having you on board!

Warm regards,

[Your Name]
[Your Title]
[Company Name]`;
    } else if (data.template === 'tech-startup') {
      return `${today}

Hey ${candidateName}! 👋

We're excited to officially offer you the ${position} role on our ${department} team!

Your interview process showed us exactly what we were looking for – someone who gets it, brings fresh ideas, and will help us build something amazing together.

🚀 The Details:

Role & Team:
• Position: ${position}
• Team: ${department}
• Start Date: ${startDate}
• Type: ${employmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
• Base: ${workLocation}

💎 Compensation:
• Base Salary: ${salary}/year
• Performance Bonus: ${bonus}/year
• Equity: ${equity}

🎁 What Else You Get:
${benefits}

Why This Is Awesome:
• Work with cutting-edge technology and solve real problems
• Shape product direction and company culture
• Fast-paced, collaborative environment
• Room to grow as we scale

We're building something special here, and we want you to be part of it. Take a look at everything, ask us anything, and let us know what you think!

This offer is valid until [response deadline].

Can't wait to have you on the team!

Cheers,

[Your Name]
[Your Title]
[Company Name]

P.S. - Seriously, if you have any questions, just reach out. We're here to help!`;
    } else {
      return `${today}

Dear ${candidateName},

On behalf of [Company Name], I am pleased to extend to you an offer of employment for the position of ${position} within our ${department} department.

POSITION DETAILS

Position Title: ${position}
Department: ${department}
Reports To: [Manager Name/Title]
Start Date: ${startDate}
Employment Type: ${employmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
Work Location: ${workLocation}

COMPENSATION

Your compensation package includes:

Annual Base Salary: ${salary}
The above amount represents your gross annual salary, payable in accordance with the Company's standard payroll practices.

Annual Performance Bonus: ${bonus}
You will be eligible for an annual performance bonus based on individual and company performance metrics.

Equity Compensation: ${equity}
Subject to board approval and the terms of the applicable equity plan.

BENEFITS

You will be eligible for the Company's comprehensive benefits package, which includes:

${benefits}

EMPLOYMENT TERMS

This offer is contingent upon:
• Successful completion of background check and reference verification
• Proof of authorization to work in the United States
• Execution of the Company's standard Employee Agreement
• Compliance with any applicable regulations

This is an at-will employment relationship, which means that either you or the Company may terminate the employment relationship at any time, with or without cause or notice.

ACCEPTANCE

Please indicate your acceptance of this offer by signing and returning this letter by [response deadline]. If you have any questions regarding this offer, please do not hesitate to contact me.

We are excited about the prospect of you joining our team and look forward to your positive response.

Sincerely,

[Your Name]
[Your Title]
[Company Name]

___________________________          ___________________________
Employee Signature                   Date

___________________________
${candidateName} (Print Name)`;
    }
  };

  const handleGenerateWithAI = async () => {
    if (!formData.candidateName || !formData.position) {
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const generatedContent = generateOfferLetter(formData);
      setFormData({ ...formData, content: generatedContent });
    } catch (error) {
      console.error('Error generating offer letter:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewOffer = () => {
    setSelectedOffer(null);
    setFormData({
      candidateName: '',
      position: '',
      department: '',
      startDate: '',
      salary: '',
      bonus: '',
      benefits: '',
      equity: '',
      workLocation: '',
      employmentType: 'full-time',
      template: 'formal',
      content: '',
    });
    setIsPreviewMode(false);
  };

  const handleSelectOffer = (offer: OfferLetter) => {
    setSelectedOffer(offer);
    setFormData({
      candidateName: offer.candidateName,
      position: offer.position,
      department: offer.department,
      startDate: offer.startDate,
      salary: offer.salary.toString(),
      bonus: offer.bonus.toString(),
      benefits: offer.benefits,
      equity: offer.equity,
      workLocation: offer.workLocation,
      employmentType: offer.employmentType,
      template: offer.template,
      content: offer.content,
    });
    setIsPreviewMode(false);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const offerData: OfferLetter = {
        id: selectedOffer?.id || `offer-${Date.now()}`,
        candidateName: formData.candidateName || 'Unnamed Candidate',
        position: formData.position || 'Position TBD',
        department: formData.department,
        startDate: formData.startDate,
        salary: parseInt(formData.salary) || 0,
        bonus: parseInt(formData.bonus) || 0,
        benefits: formData.benefits,
        equity: formData.equity,
        workLocation: formData.workLocation,
        employmentType: formData.employmentType,
        template: formData.template,
        content: formData.content,
        status: selectedOffer?.status || 'draft',
        createdAt: selectedOffer?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (selectedOffer) {
        setOffers(offers.map(o => o.id === offerData.id ? offerData : o));
        setSelectedOffer(offerData);
      } else {
        setOffers([offerData, ...offers]);
        setSelectedOffer(offerData);
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving offer:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleDelete = async () => {
    if (!selectedOffer) return;
    
    try {
      const updatedOffers = offers.filter(o => o.id !== selectedOffer.id);
      setOffers(updatedOffers);
      setShowDeleteConfirm(false);
      
      if (updatedOffers.length > 0) {
        handleSelectOffer(updatedOffers[0]);
      } else {
        handleNewOffer();
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  const handleClone = () => {
    if (!selectedOffer) return;
    
    const clonedOffer: OfferLetter = {
      ...selectedOffer,
      id: `offer-${Date.now()}`,
      candidateName: `${selectedOffer.candidateName} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setOffers([clonedOffer, ...offers]);
    setSelectedOffer(clonedOffer);
    setFormData({
      candidateName: clonedOffer.candidateName,
      position: clonedOffer.position,
      department: clonedOffer.department,
      startDate: clonedOffer.startDate,
      salary: clonedOffer.salary.toString(),
      bonus: clonedOffer.bonus.toString(),
      benefits: clonedOffer.benefits,
      equity: clonedOffer.equity,
      workLocation: clonedOffer.workLocation,
      employmentType: clonedOffer.employmentType,
      template: clonedOffer.template,
      content: clonedOffer.content,
    });
  };

  const handleSendOffer = async () => {
    if (!selectedOffer) return;
    
    setSendStatus('sending');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedOffer = { ...selectedOffer, status: 'sent' as const };
      setOffers(offers.map(o => o.id === updatedOffer.id ? updatedOffer : o));
      setSelectedOffer(updatedOffer);
      
      setSendStatus('sent');
      setTimeout(() => {
        setSendStatus('idle');
        setShowSendModal(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending offer:', error);
      setSendStatus('error');
      setTimeout(() => setSendStatus('idle'), 3000);
    }
  };

  const getStatusBadge = (status: OfferLetter['status']) => {
    const statusConfig = {
      draft: {
        icon: Edit,
        label: 'Draft',
        className: 'bg-gray-100 text-gray-700 border-gray-200',
      },
      sent: {
        icon: Mail,
        label: 'Sent',
        className: 'bg-blue-100 text-blue-700 border-blue-200',
      },
      accepted: {
        icon: CheckCircle,
        label: 'Accepted',
        className: 'bg-green-100 text-green-700 border-green-200',
      },
      declined: {
        icon: XCircle,
        label: 'Declined',
        className: 'bg-red-100 text-red-700 border-red-200',
      },
      expired: {
        icon: Clock,
        label: 'Expired',
        className: 'bg-orange-100 text-orange-700 border-orange-200',
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-teal-100 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <Link 
              to="/agents/recruiter-agents/offer-letter-builder" 
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Offer Letter Builder</h1>
              <p className="text-sm text-gray-500">Create professional offer letters with AI assistance</p>
            </div>
          </div>
          
          <Button 
            onClick={handleNewOffer} 
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Offer Letter
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1800px] mx-auto px-6 py-6">
          {offers.length === 0 && !selectedOffer && !formData.candidateName ? (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center py-12 px-6">
                <FileText className="w-20 h-20 text-green-200 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Your First Offer Letter
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Get started by creating a new offer letter. Use our AI assistant to generate 
                  professional, customized offer letters for your candidates.
                </p>
                <Button 
                  onClick={handleNewOffer} 
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Offer Letter
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-full grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-3 overflow-y-auto">
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg">Offer Letters</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {offers.length === 0 ? (
                      <div className="p-6 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No offer letters yet</p>
                        <p className="text-xs text-gray-400 mt-1">Click "New Offer Letter" to start</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {offers.map((offer) => (
                          <button
                            key={offer.id}
                            onClick={() => handleSelectOffer(offer)}
                            className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                              selectedOffer?.id === offer.id ? 'bg-green-50 border-l-4 border-green-600' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Mail className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                selectedOffer?.id === offer.id ? 'text-green-600' : 'text-gray-400'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {offer.candidateName}
                                </h3>
                                <p className="text-sm text-gray-600 truncate">{offer.position}</p>
                                {offer.department && (
                                  <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-1">
                                    <Building2 className="w-3 h-3" />
                                    {offer.department}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  {getStatusBadge(offer.status)}
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
                <Card className="h-full flex flex-col">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-bold text-gray-900">
                            {formData.candidateName || 'New Offer Letter'}
                          </h2>
                          {selectedOffer && getStatusBadge(selectedOffer.status)}
                        </div>
                        {formData.position && (
                          <p className="text-sm text-gray-600 mt-1">{formData.position}</p>
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
                        
                        {selectedOffer && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleClone}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Clone
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowDeleteConfirm(true)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </>
                        )}
                        
                        {selectedOffer?.status === 'draft' && formData.content && (
                          <Button
                            size="sm"
                            onClick={() => setShowSendModal(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Offer
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
                          <div className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
                            {formData.content || (
                              <p className="text-gray-400 italic">No content to preview. Generate an offer letter to see it here.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Candidate Name *
                            </label>
                            <input
                              type="text"
                              value={formData.candidateName}
                              onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                              placeholder="e.g., John Smith"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Position *
                            </label>
                            <input
                              type="text"
                              value={formData.position}
                              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                              placeholder="e.g., Senior Software Engineer"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              Department
                            </label>
                            <input
                              type="text"
                              value={formData.department}
                              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                              placeholder="e.g., Engineering"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={formData.startDate}
                              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              Annual Salary
                            </label>
                            <input
                              type="number"
                              value={formData.salary}
                              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                              placeholder="e.g., 120000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              Annual Bonus
                            </label>
                            <input
                              type="number"
                              value={formData.bonus}
                              onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                              placeholder="e.g., 15000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Equity/Stock Options
                            </label>
                            <input
                              type="text"
                              value={formData.equity}
                              onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                              placeholder="e.g., 10,000 stock options"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Work Location
                            </label>
                            <input
                              type="text"
                              value={formData.workLocation}
                              onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                              placeholder="e.g., San Francisco, CA (Hybrid)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
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
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Benefits
                          </label>
                          <textarea
                            value={formData.benefits}
                            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                            placeholder="e.g., Health insurance, 401(k) matching, unlimited PTO, professional development budget"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Template Style
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { value: 'formal', label: 'Formal', desc: 'Traditional & professional' },
                              { value: 'friendly', label: 'Friendly', desc: 'Warm & welcoming' },
                              { value: 'tech-startup', label: 'Tech Startup', desc: 'Modern & casual' },
                            ].map((template) => (
                              <button
                                key={template.value}
                                onClick={() => setFormData({ ...formData, template: template.value as any })}
                                className={`p-4 border-2 rounded-lg text-left transition ${
                                  formData.template === template.value
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300'
                                }`}
                              >
                                <div className="font-semibold text-gray-900">{template.label}</div>
                                <div className="text-xs text-gray-500 mt-1">{template.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <Button
                            onClick={handleGenerateWithAI}
                            disabled={isGenerating || !formData.candidateName || !formData.position}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                          >
                            {isGenerating ? (
                              <>
                                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                Generating Offer Letter...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Generate Offer Letter with AI
                              </>
                            )}
                          </Button>
                          {(!formData.candidateName || !formData.position) && (
                            <p className="text-xs text-gray-500 text-center mt-2">
                              Please fill in candidate name and position to generate
                            </p>
                          )}
                        </div>

                        {formData.content && (
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Generated Content (Editable)
                            </label>
                            <textarea
                              value={formData.content}
                              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                              rows={15}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm resize-none"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Confirm Delete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete this offer letter for <strong>{selectedOffer?.candidateName}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
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

      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Send Offer Letter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Recipient
                </label>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="font-semibold text-gray-900">{formData.candidateName}</p>
                  <p className="text-sm text-gray-600">{formData.position}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email Subject
                </label>
                <input
                  type="text"
                  defaultValue={`Offer Letter - ${formData.position} at [Company Name]`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email Preview
                </label>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    Dear {formData.candidateName},

                    Please find attached your official offer letter for the position of {formData.position}.

                    We're excited about the possibility of you joining our team. Please review the offer details carefully and let us know if you have any questions.

                    Best regards,
                    [Your Name]
                    [Company Name]
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSendModal(false);
                    setSendStatus('idle');
                  }}
                  disabled={sendStatus === 'sending'}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendOffer}
                  disabled={sendStatus === 'sending'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {sendStatus === 'sent' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Sent!
                    </>
                  ) : sendStatus === 'error' ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Error
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {sendStatus === 'sending' ? 'Sending...' : 'Send Offer Letter'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
