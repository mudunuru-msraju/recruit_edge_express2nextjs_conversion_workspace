import { 
  CreateInterviewSessionInput,
  UpdateInterviewSessionInput,
  InterviewSessionResponse,
  CreateInterviewQuestionInput,
  UpdateInterviewQuestionInput,
  InterviewQuestionResponse,
  GenerateQuestionsInput,
  GeneratedQuestionResponse,
  EvaluateAnswerInput,
  AnswerEvaluationResponse
} from './validation';

const BASE_URL = '/api/agents/job-seeker-agents/interview-prep';

export class InterviewPrepApiClient {
  // Session Management
  async getSessions(userId: number): Promise<InterviewSessionResponse[]> {
    const response = await fetch(`${BASE_URL}/sessions?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch interview sessions');
    }
    return response.json();
  }

  async getSession(id: number, userId: number): Promise<InterviewSessionResponse> {
    const response = await fetch(`${BASE_URL}/sessions/${id}?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch interview session');
    }
    return response.json();
  }

  async createSession(data: CreateInterviewSessionInput): Promise<{ id: number; session: InterviewSessionResponse }> {
    const response = await fetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create interview session');
    }
    return response.json();
  }

  async updateSession(
    id: number, 
    userId: number, 
    data: UpdateInterviewSessionInput
  ): Promise<{ success: boolean; session: InterviewSessionResponse }> {
    const response = await fetch(`${BASE_URL}/sessions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, userId }),
    });
    if (!response.ok) {
      throw new Error('Failed to update interview session');
    }
    return response.json();
  }

  async deleteSession(id: number, userId: number): Promise<{ success: boolean }> {
    const response = await fetch(`${BASE_URL}/sessions/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete interview session');
    }
    return response.json();
  }

  // Question Management
  async getSessionQuestions(sessionId: number): Promise<InterviewQuestionResponse[]> {
    const response = await fetch(`${BASE_URL}/sessions/${sessionId}/questions`);
    if (!response.ok) {
      throw new Error('Failed to fetch session questions');
    }
    return response.json();
  }

  async createQuestion(
    sessionId: number, 
    data: CreateInterviewQuestionInput
  ): Promise<{ id: number; question: InterviewQuestionResponse }> {
    const response = await fetch(`${BASE_URL}/sessions/${sessionId}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create question');
    }
    return response.json();
  }

  async updateQuestion(
    sessionId: number,
    questionId: number,
    data: UpdateInterviewQuestionInput
  ): Promise<{ success: boolean; question: InterviewQuestionResponse }> {
    const response = await fetch(`${BASE_URL}/sessions/${sessionId}/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update question');
    }
    return response.json();
  }

  // AI Features
  async generateQuestions(data: GenerateQuestionsInput): Promise<GeneratedQuestionResponse[]> {
    const response = await fetch(`${BASE_URL}/ai/generate-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to generate questions');
    }
    return response.json();
  }

  async evaluateAnswer(data: EvaluateAnswerInput): Promise<AnswerEvaluationResponse> {
    const response = await fetch(`${BASE_URL}/ai/evaluate-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to evaluate answer');
    }
    return response.json();
  }
}

export const interviewPrepApi = new InterviewPrepApiClient();