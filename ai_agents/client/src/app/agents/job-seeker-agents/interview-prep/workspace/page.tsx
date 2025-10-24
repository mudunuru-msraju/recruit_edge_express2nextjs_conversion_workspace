import { useState, useEffect, useRef } from 'react';
import { 
  Play, Clock, Calendar, MessageSquare, Sparkles, 
  CheckCircle, Star, ChevronLeft, ChevronRight, Plus,
  Target, TrendingUp, BarChart3, AlertCircle
} from 'lucide-react';
import { useInterviewPrep } from '../contexts/InterviewPrepProvider';
import { API_BASE_URL, getMockUserId } from '../api/config';
import type { InterviewSession, InterviewType, DifficultyLevel } from '../types';

export default function InterviewPrepWorkspace() {
  const { 
    currentSession, 
    questions, 
    currentQuestionIndex,
    isSessionActive,
    setCurrentSession, 
    setQuestions,
    setCurrentQuestionIndex,
    startSession,
    endSession,
    updateQuestion,
  } = useInterviewPrep();

  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    targetRole: '',
    targetCompany: '',
    interviewType: 'technical' as InterviewType,
    difficulty: 'medium' as DifficultyLevel,
    numberOfQuestions: 5,
  });

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (isSessionActive && currentSession) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - questionStartTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive, questionStartTime]);

  useEffect(() => {
    const currentQ = questions[currentQuestionIndex];
    if (currentQ) {
      setCurrentAnswer(currentQ.userAnswer || '');
      setQuestionStartTime(Date.now());
      setElapsedTime(0);
    }
  }, [currentQuestionIndex, questions]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const userId = getMockUserId();
      const response = await fetch(`${API_BASE_URL}/api/agents/interview-prep/sessions?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      setIsGenerating(true);
      const userId = getMockUserId();
      
      const sessionResponse = await fetch(`${API_BASE_URL}/api/agents/interview-prep/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          title: formData.title || `${formData.targetRole} Interview`,
          interviewType: formData.interviewType,
          difficulty: formData.difficulty,
          targetRole: formData.targetRole,
          targetCompany: formData.targetCompany,
          numberOfQuestions: formData.numberOfQuestions,
        }),
      });

      if (sessionResponse.ok) {
        const result = await sessionResponse.json();
        const newSession = result.session;
        
        const questionsResponse = await fetch(`${API_BASE_URL}/api/agents/interview-prep/ai/generate-questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interviewType: formData.interviewType,
            difficulty: formData.difficulty,
            targetRole: formData.targetRole,
            count: formData.numberOfQuestions,
          }),
        });

        if (questionsResponse.ok) {
          const generatedQuestions = await questionsResponse.json();
          const questionPromises = generatedQuestions.map((q: any) =>
            fetch(`${API_BASE_URL}/api/agents/interview-prep/sessions/${newSession.id}/questions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(q),
            }).then(res => res.json())
          );

          const savedQuestions = await Promise.all(questionPromises);
          const questionsData = savedQuestions.map(r => r.question);
          
          setQuestions(questionsData);
          setCurrentSession(newSession);
          setCurrentQuestionIndex(0);
          startSession();
          setShowCreateForm(false);
          await loadSessions();
          
          setFormData({
            title: '',
            targetRole: '',
            targetCompany: '',
            interviewType: 'technical',
            difficulty: 'medium',
            numberOfQuestions: 5,
          });
        }
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetFeedback = async () => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ || !currentAnswer.trim()) return;

    try {
      setIsEvaluating(true);
      
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      
      const response = await fetch(`${API_BASE_URL}/api/agents/interview-prep/ai/evaluate-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          answer: currentAnswer,
        }),
      });

      if (response.ok) {
        const evaluation = await response.json();
        
        await fetch(`${API_BASE_URL}/api/agents/interview-prep/sessions/${currentSession?.id}/questions/${currentQ.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAnswer: currentAnswer,
            evaluation,
            timeSpent,
          }),
        });

        updateQuestion(currentQ.id!, {
          userAnswer: currentAnswer,
          evaluation,
          timeSpent,
        });
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleEndSession = async () => {
    if (!currentSession) return;
    
    const answeredQuestions = questions.filter(q => q.evaluation);
    const avgScore = answeredQuestions.length > 0
      ? Math.round(answeredQuestions.reduce((sum, q) => sum + (q.evaluation?.score || 0), 0) / answeredQuestions.length)
      : 0;

    try {
      await fetch(`${API_BASE_URL}/api/agents/interview-prep/sessions/${currentSession.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(getMockUserId()),
          score: avgScore,
        }),
      });

      endSession();
      setCurrentSession(null);
      setQuestions([]);
      await loadSessions();
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSessions = sessions.length;
  const avgScore = sessions.length > 0
    ? Math.round(sessions.filter(s => s.score).reduce((sum, s) => sum + (s.score || 0), 0) / sessions.filter(s => s.score).length) || 0
    : 0;
  const totalQuestions = sessions.reduce((sum, s) => sum + ((s.metadata as any)?.numberOfQuestions || 0), 0);

  return (
    <div className="h-full flex bg-gray-50">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Practice Sessions</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Session
            </button>
          </div>

          {showCreateForm && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Create Session</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={formData.targetCompany}
                  onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <select
                  value={formData.interviewType}
                  onChange={(e) => setFormData({ ...formData, interviewType: e.target.value as InterviewType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="behavioral">Behavioral</option>
                  <option value="technical">Technical</option>
                  <option value="case_study">Case Study</option>
                  <option value="system_design">System Design</option>
                  <option value="coding">Coding</option>
                </select>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as DifficultyLevel })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select
                  value={formData.numberOfQuestions}
                  onChange={(e) => setFormData({ ...formData, numberOfQuestions: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="3">3 Questions</option>
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                </select>
                <button
                  onClick={handleCreateSession}
                  disabled={isGenerating || !formData.targetRole}
                  className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGenerating ? 'Generating...' : 'Generate Questions'}
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="text-center text-gray-500 py-8 text-sm">Loading...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center text-gray-500 py-8 text-sm">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No sessions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg border transition cursor-pointer ${
                      currentSession?.id === session.id
                        ? 'bg-teal-50 border-teal-300'
                        : 'bg-white border-gray-200 hover:border-teal-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{session.title}</h4>
                      {session.score && (
                        <span className="text-xs font-bold text-teal-600">{session.score}%</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(session.createdAt!).toLocaleDateString()}
                    </div>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                        {session.interviewType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900">{totalSessions}</div>
                <div className="text-xs text-gray-500">Sessions</div>
              </div>
              <div>
                <div className="text-xl font-bold text-teal-600">{avgScore > 0 ? `${avgScore}%` : '--'}</div>
                <div className="text-xs text-gray-500">Avg Score</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{totalQuestions}</div>
                <div className="text-xs text-gray-500">Questions</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white">
          {!isSessionActive || !currentSession ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <Play className="w-20 h-20 mx-auto mb-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Practice?</h2>
                <p className="text-gray-600 mb-6">
                  Create a new interview session to start practicing with AI-generated questions
                  tailored to your target role and interview type.
                </p>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">AI-Generated Questions</p>
                      <p className="text-xs text-gray-500">Tailored to your role</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Real-time Timer</p>
                      <p className="text-xs text-gray-500">Track your pace</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Instant Feedback</p>
                      <p className="text-xs text-gray-500">AI-powered analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Progress Tracking</p>
                      <p className="text-xs text-gray-500">Monitor improvement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentSession.title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {currentSession.targetRole}
                      </span>
                      <span className="capitalize">{currentSession.interviewType}</span>
                      {currentSession.difficulty && (
                        <span className="capitalize">{currentSession.difficulty}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleEndSession}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    End Session
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                      <span className="font-semibold text-teal-600">{Math.round(progressPercent)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-mono font-bold text-gray-900">
                    <Clock className="w-5 h-5 text-teal-600" />
                    {formatTime(elapsedTime)}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {currentQuestion && (
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {currentQuestion.question}
                          </h3>
                          <div className="flex gap-2">
                            <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                              {currentQuestion.interviewType}
                            </span>
                            {currentQuestion.difficulty && (
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs capitalize">
                                {currentQuestion.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Your Answer
                      </label>
                      <textarea
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={handleGetFeedback}
                        disabled={!currentAnswer.trim() || isEvaluating}
                        className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles className="w-5 h-5" />
                        {isEvaluating ? 'Analyzing...' : 'Get AI Feedback'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      <button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-teal-600" />
              Feedback
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!currentQuestion?.evaluation ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-sm">
                  Answer the question and click "Get AI Feedback" to see detailed feedback
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold text-teal-600 mb-2">
                      {currentQuestion.evaluation.score}
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                  {currentQuestion.timeSpent && (
                    <div className="text-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time: {formatTime(currentQuestion.timeSpent)}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {currentQuestion.evaluation.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {currentQuestion.evaluation.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    Detailed Feedback
                  </h3>
                  <p className="text-sm text-gray-700">{currentQuestion.evaluation.feedback}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
