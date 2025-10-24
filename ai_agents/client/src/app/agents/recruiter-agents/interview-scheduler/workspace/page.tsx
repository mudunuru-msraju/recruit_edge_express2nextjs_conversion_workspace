import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  Users, 
  Bell, 
  CheckCircle,
  Plus,
  X,
  Phone,
  Building2,
  Sparkles,
  AlertCircle,
  ListFilter,
  LayoutGrid,
  Edit2,
  Send
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Interview {
  id: number;
  candidateName: string;
  position: string;
  interviewType: 'phone' | 'video' | 'onsite';
  scheduledAt: string;
  duration: number;
  interviewers: string;
  location: string | null;
  meetingLink: string | null;
  notes: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  cancelReason: string | null;
  createdAt: string;
}

interface FormData {
  candidateName: string;
  position: string;
  interviewType: 'phone' | 'video' | 'onsite';
  date: string;
  time: string;
  duration: number;
  interviewers: string;
  location: string;
  meetingLink: string;
  notes: string;
}

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  conflicts: string[];
}

export default function InterviewSchedulerWorkspace() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [isGeneratingSlots, setIsGeneratingSlots] = useState(false);
  const [suggestedSlots, setSuggestedSlots] = useState<TimeSlot[]>([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    candidateName: '',
    position: '',
    interviewType: 'video',
    date: '',
    time: '',
    duration: 60,
    interviewers: '',
    location: '',
    meetingLink: '',
    notes: '',
  });

  const userId = 1;

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch(`/api/agents/interview-scheduler/schedules?userId=${userId}`);
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const today = new Date();
    const times = ['09:00', '10:30', '13:00', '14:30', '16:00'];
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const time = times[Math.floor(Math.random() * times.length)];
      const available = Math.random() > 0.3;
      
      slots.push({
        date: dateStr,
        time: time,
        available: available,
        conflicts: available ? [] : ['Team meeting at 10:00', 'Interview with another candidate'],
      });
    }
    
    return slots.slice(0, 5);
  };

  const handleFindSlots = async () => {
    setIsGeneratingSlots(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const slots = generateMockTimeSlots();
      setSuggestedSlots(slots);
    } catch (error) {
      console.error('Error generating slots:', error);
    } finally {
      setIsGeneratingSlots(false);
    }
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    if (slot.available) {
      setFormData({
        ...formData,
        date: slot.date,
        time: slot.time,
      });
      setSuggestedSlots([]);
    }
  };

  const handleSchedule = async () => {
    setIsSaving(true);
    try {
      const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      const response = await fetch('/api/agents/interview-scheduler/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          candidateName: formData.candidateName,
          position: formData.position,
          interviewType: formData.interviewType,
          scheduledAt,
          duration: formData.duration,
          interviewers: formData.interviewers,
          location: formData.location || null,
          meetingLink: formData.meetingLink || null,
          notes: formData.notes || null,
          status: 'scheduled',
        }),
      });
      
      const newInterview = await response.json();
      setInterviews([newInterview, ...interviews]);
      setShowScheduleForm(false);
      resetForm();
    } catch (error) {
      console.error('Error scheduling interview:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedInterview) return;
    
    setIsSaving(true);
    try {
      const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      const response = await fetch(`/api/agents/interview-scheduler/schedules/${selectedInterview.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          scheduledAt,
          duration: formData.duration,
          status: 'rescheduled',
        }),
      });
      
      const updatedInterview = await response.json();
      setInterviews(interviews.map(i => i.id === updatedInterview.id ? updatedInterview : i));
      setShowRescheduleForm(false);
      setSelectedInterview(null);
      resetForm();
    } catch (error) {
      console.error('Error rescheduling interview:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedInterview) return;
    
    try {
      const response = await fetch(`/api/agents/interview-scheduler/schedules/${selectedInterview.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          status: 'cancelled',
          cancelReason: cancelReason,
        }),
      });
      
      const updatedInterview = await response.json();
      setInterviews(interviews.map(i => i.id === updatedInterview.id ? updatedInterview : i));
      setShowCancelDialog(false);
      setCancelReason('');
      setSelectedInterview(null);
    } catch (error) {
      console.error('Error cancelling interview:', error);
    }
  };

  const handleSendReminder = async (interview: Interview) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert(`Reminder sent for interview with ${interview.candidateName}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      candidateName: '',
      position: '',
      interviewType: 'video',
      date: '',
      time: '',
      duration: 60,
      interviewers: '',
      location: '',
      meetingLink: '',
      notes: '',
    });
    setSuggestedSlots([]);
  };

  const handleNewInterview = () => {
    resetForm();
    setShowScheduleForm(true);
    setSelectedInterview(null);
  };

  const getStatusBadge = (status: Interview['status']) => {
    const statusConfig = {
      scheduled: { bg: 'bg-green-100', text: 'text-green-800', icon: CalendarIcon },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: X },
      rescheduled: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getInterviewTypeBadge = (type: Interview['interviewType']) => {
    const typeConfig = {
      phone: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Phone },
      video: { bg: 'bg-green-100', text: 'text-green-800', icon: Video },
      onsite: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Building2 },
    };
    
    const config = typeConfig[type];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const upcomingInterviews = interviews
    .filter(i => new Date(i.scheduledAt) >= new Date() && i.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
        <div className="text-green-600 text-lg">Loading...</div>
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
              to="/recruiter-agents/interview-scheduler" 
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interview Scheduler</h1>
              <p className="text-sm text-gray-500">Manage and schedule candidate interviews</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  viewMode === 'calendar' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  viewMode === 'list' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListFilter className="w-4 h-4" />
                List
              </button>
            </div>
            
            <Button 
              onClick={handleNewInterview} 
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-6 py-6">
          <div className="h-full grid grid-cols-12 gap-6">
            {/* Left Sidebar - Upcoming Interviews */}
            <div className="col-span-12 lg:col-span-4 overflow-y-auto">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-green-600" />
                    Upcoming Interviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {upcomingInterviews.length === 0 ? (
                    <div className="p-6 text-center">
                      <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No upcoming interviews</p>
                      <p className="text-xs text-gray-400 mt-1">Schedule your first interview to get started</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {upcomingInterviews.map((interview) => (
                        <div
                          key={interview.id}
                          className="p-4 hover:bg-gray-50 transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {interview.candidateName}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">{interview.position}</p>
                            </div>
                            {getInterviewTypeBadge(interview.interviewType)}
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(interview.scheduledAt).toLocaleString()} ({interview.duration} min)
                            </div>
                            {interview.interviewers && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {interview.interviewers}
                              </div>
                            )}
                            {interview.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {interview.location}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendReminder(interview)}
                              className="text-xs"
                            >
                              <Bell className="w-3 h-3 mr-1" />
                              Remind
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedInterview(interview);
                                setFormData({
                                  ...formData,
                                  date: interview.scheduledAt.split('T')[0],
                                  time: interview.scheduledAt.split('T')[1].substring(0, 5),
                                  duration: interview.duration,
                                });
                                setShowRescheduleForm(true);
                              }}
                              className="text-xs"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedInterview(interview);
                                setShowCancelDialog(true);
                              }}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Main Area - Calendar/List View or Schedule Form */}
            <div className="col-span-12 lg:col-span-8 overflow-y-auto">
              {showScheduleForm || showRescheduleForm ? (
                <Card className="h-fit">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {showRescheduleForm ? 'Reschedule Interview' : 'Schedule New Interview'}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowScheduleForm(false);
                          setShowRescheduleForm(false);
                          setSelectedInterview(null);
                          resetForm();
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {!showRescheduleForm && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                Candidate Name *
                              </label>
                              <input
                                type="text"
                                value={formData.candidateName}
                                onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                                placeholder="e.g., John Doe"
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

                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Interview Type *
                            </label>
                            <div className="flex gap-3">
                              {(['phone', 'video', 'onsite'] as const).map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, interviewType: type })}
                                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                                    formData.interviewType === type
                                      ? 'border-green-600 bg-green-50 text-green-700'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  {type === 'phone' && <Phone className="w-4 h-4" />}
                                  {type === 'video' && <Video className="w-4 h-4" />}
                                  {type === 'onsite' && <Building2 className="w-4 h-4" />}
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Date & Time *
                          </label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleFindSlots}
                            disabled={isGeneratingSlots}
                            className="text-xs"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            {isGeneratingSlots ? 'Finding Slots...' : 'Find Available Slots with AI'}
                          </Button>
                        </div>
                        
                        {suggestedSlots.length > 0 && (
                          <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm font-medium text-green-900 mb-3">AI-Suggested Time Slots:</p>
                            <div className="grid grid-cols-1 gap-2">
                              {suggestedSlots.map((slot, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSelectSlot(slot)}
                                  disabled={!slot.available}
                                  className={`p-3 rounded-lg border-2 text-left transition ${
                                    slot.available
                                      ? 'border-green-300 bg-white hover:border-green-500 hover:bg-green-50 cursor-pointer'
                                      : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <CalendarIcon className={`w-4 h-4 ${slot.available ? 'text-green-600' : 'text-gray-400'}`} />
                                      <span className="text-sm font-medium">
                                        {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {slot.time}
                                      </span>
                                    </div>
                                    {slot.available ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <AlertCircle className="w-4 h-4 text-red-500" />
                                    )}
                                  </div>
                                  {!slot.available && slot.conflicts.length > 0 && (
                                    <p className="text-xs text-red-600 mt-1 ml-6">
                                      Conflicts: {slot.conflicts.join(', ')}
                                    </p>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              type="date"
                              value={formData.date}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <input
                              type="time"
                              value={formData.time}
                              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Duration (minutes) *
                        </label>
                        <select
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={90}>1.5 hours</option>
                          <option value={120}>2 hours</option>
                        </select>
                      </div>

                      {!showRescheduleForm && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Interviewers
                            </label>
                            <textarea
                              value={formData.interviewers}
                              onChange={(e) => setFormData({ ...formData, interviewers: e.target.value })}
                              placeholder="e.g., Jane Smith, John Doe"
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            />
                          </div>

                          {formData.interviewType === 'onsite' && (
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
                                  placeholder="e.g., Conference Room A, 123 Main St"
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                            </div>
                          )}

                          {formData.interviewType === 'video' && (
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                Meeting Link
                              </label>
                              <div className="relative">
                                <Video className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input
                                  type="url"
                                  value={formData.meetingLink}
                                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                  placeholder="e.g., https://zoom.us/j/123456789"
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Notes
                            </label>
                            <textarea
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              placeholder="Add any additional notes or instructions..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            />
                          </div>
                        </>
                      )}

                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowScheduleForm(false);
                            setShowRescheduleForm(false);
                            setSelectedInterview(null);
                            resetForm();
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={showRescheduleForm ? handleReschedule : handleSchedule}
                          disabled={isSaving || !formData.date || !formData.time || (!showRescheduleForm && (!formData.candidateName || !formData.position))}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {isSaving ? 'Saving...' : showRescheduleForm ? 'Reschedule' : 'Schedule Interview'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : interviews.length === 0 ? (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center py-12 px-6">
                    <CalendarIcon className="w-20 h-20 text-green-200 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      No Interviews Scheduled Yet
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Start organizing your hiring process by scheduling interviews with candidates.
                      Use AI to find optimal time slots that work for everyone.
                    </p>
                    <Button 
                      onClick={handleNewInterview} 
                      className="bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Schedule First Interview
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {viewMode === 'calendar' ? (
                        <>
                          <LayoutGrid className="w-5 h-5 text-green-600" />
                          All Interviews
                        </>
                      ) : (
                        <>
                          <ListFilter className="w-5 h-5 text-green-600" />
                          Interview List
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {interviews.map((interview) => (
                        <div
                          key={interview.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {interview.candidateName}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">{interview.position}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {getInterviewTypeBadge(interview.interviewType)}
                              {getStatusBadge(interview.status)}
                            </div>
                          </div>
                          
                          <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(interview.scheduledAt).toLocaleString()} ({interview.duration} min)
                            </div>
                            {interview.interviewers && (
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5" />
                                {interview.interviewers}
                              </div>
                            )}
                            {interview.location && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {interview.location}
                              </div>
                            )}
                            {interview.meetingLink && (
                              <div className="flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5" />
                                <a 
                                  href={interview.meetingLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:underline truncate"
                                >
                                  Join Meeting
                                </a>
                              </div>
                            )}
                          </div>
                          
                          {interview.notes && (
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                              {interview.notes}
                            </p>
                          )}
                          
                          {interview.status === 'cancelled' && interview.cancelReason && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                              Cancelled: {interview.cancelReason}
                            </div>
                          )}
                          
                          {interview.status === 'scheduled' && (
                            <div className="flex items-center gap-2 pt-3 border-t">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendReminder(interview)}
                                className="text-xs flex-1"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Send Reminder
                              </Button>
                            </div>
                          )}
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

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Cancel Interview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel the interview with {selectedInterview?.candidateName}?
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Cancellation Reason *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelDialog(false);
                    setCancelReason('');
                    setSelectedInterview(null);
                  }}
                  className="flex-1"
                >
                  Keep Interview
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={!cancelReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
