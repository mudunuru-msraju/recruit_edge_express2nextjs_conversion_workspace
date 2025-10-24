# Interview Prep Agent

## Overview

The Interview Prep agent is an AI-powered mock interview platform that helps job seekers practice interviews and receive personalized feedback. Users can create interview sessions, answer questions, and track their progress over time.

## Features

- **AI Mock Interviews**: Practice with intelligent AI that adapts to your answers
- **Role-Specific Questions**: Get questions tailored to your target role, company, and industry
- **Progress Tracking**: Monitor improvement across sessions with detailed analytics and scoring
- **Personalized Feedback**: Receive actionable suggestions to improve interview performance
- **Session Management**: Create, view, and manage multiple interview practice sessions
- **Question Bank**: Access and answer various types of interview questions (behavioral, technical, situational)

## Architecture

This agent follows the RecruitEdge standardized agent architecture:

```
interview-prep/
├── data/
│   ├── manifest.json          # Agent metadata and configuration
│   └── manifest.ts            # TypeScript manifest
├── types.ts                   # TypeScript type definitions
├── contexts/
│   ├── InterviewPrepProvider.tsx  # Global state management
│   └── hooks.ts               # Custom hooks for business logic
├── _components/               # Reusable UI components
├── api/
│   ├── config.ts             # API configuration
│   ├── routes.ts             # API route definitions
│   └── client.ts             # API client functions
├── utils/
│   └── index.ts              # Utility functions
├── workspace/
│   ├── layout.tsx            # Workspace layout with context
│   └── page.tsx              # Main workspace UI
├── page.tsx                  # Landing page
└── README.md                 # This file
```

## Database Schema

### `interview_sessions` Table
- `id` (serial): Primary key
- `userId` (integer): User who owns the session
- `title` (text): Session title
- `interviewType` (enum): Type of interview (behavioral, technical, case-study, mixed)
- `difficulty` (enum): Difficulty level (easy, medium, hard)
- `targetRole` (text): Job role being prepared for
- `targetCompany` (text): Company name
- `duration` (integer): Total session duration in seconds
- `score` (integer): Overall session score (0-100)
- `feedback` (text): AI-generated feedback summary
- `metadata` (jsonb): Additional session metadata
- `createdAt`, `updatedAt`: Timestamps

### `interview_questions` Table
- `id` (serial): Primary key
- `sessionId` (integer): Foreign key to interview_sessions
- `question` (text): The interview question
- `interviewType` (enum): Question type
- `difficulty` (enum): Question difficulty
- `userAnswer` (text): User's answer
- `aiSuggestion` (text): AI-suggested answer
- `evaluation` (jsonb): Detailed answer evaluation
- `timeSpent` (integer): Time spent on question in seconds
- `metadata` (jsonb): Additional question metadata
- `createdAt`, `updatedAt`: Timestamps

## API Endpoints

All endpoints are prefixed with `/api/agents/interview-prep`

### Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sessions?userId={userId}` | Get all sessions for a user |
| GET | `/sessions/:id?userId={userId}` | Get a single session by ID |
| POST | `/sessions` | Create a new interview session |
| PUT | `/sessions/:id` | Update session details (score, feedback, duration) |
| DELETE | `/sessions/:id?userId={userId}` | Delete a session |

### Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sessions/:sessionId/questions` | Get all questions for a session |
| POST | `/sessions/:sessionId/questions` | Add a question to a session |
| PUT | `/sessions/:sessionId/questions/:questionId` | Update question (answer, evaluation) |

### AI Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/generate-questions` | Generate interview questions (mock) |
| POST | `/ai/evaluate-answer` | Evaluate user's answer (mock) |

### History

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/history?userId={userId}` | Get agent interaction history |

## Usage Example

### Creating a New Session

```typescript
import { API_BASE_URL, getMockUserId } from './api/config';

const createSession = async () => {
  const userId = getMockUserId();
  const response = await fetch(`${API_BASE_URL}/api/agents/interview-prep/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: parseInt(userId),
      title: 'Senior Developer Interview',
      interviewType: 'technical',
      difficulty: 'hard',
      targetRole: 'Senior Software Engineer',
      targetCompany: 'Google',
      numberOfQuestions: 10,
    }),
  });
  
  const result = await response.json();
  console.log('Session created:', result.session);
};
```

### Using Context Provider

```typescript
import { useInterviewPrep } from './contexts/InterviewPrepProvider';

function MyComponent() {
  const {
    currentSession,
    questions,
    currentQuestionIndex,
    nextQuestion,
    previousQuestion,
    startSession,
    endSession
  } = useInterviewPrep();
  
  // Use state and functions...
}
```

## Security Warning

⚠️ **DEVELOPMENT ONLY** - This agent currently accepts `userId` from request parameters, which is insecure. In production, authentication must be implemented using Auth.js with Google OAuth, and userId must be extracted from the authenticated session. See `server/routes/SECURITY_WARNING.md` for details.

## Future Enhancements

1. **AI Integration**: Connect to OpenAI/Anthropic for real question generation and answer evaluation
2. **Video Recording**: Add video recording capability for behavioral interview practice
3. **Speech-to-Text**: Enable voice answers with transcription
4. **Performance Analytics**: Advanced analytics dashboard with charts and trends
5. **Interview Scheduling**: Calendar integration for practice scheduling
6. **Peer Feedback**: Allow sharing sessions for peer review
7. **Company-Specific Prep**: Curated questions based on company interview patterns
8. **Mock Interview Matching**: Connect with mentors for live mock interviews

## Contributing

When extending this agent:
1. Follow the standardized folder structure
2. Add new types to `types.ts`
3. Create reusable components in `_components/`
4. Add API functions to `api/client.ts`
5. Update this README with new features
6. Maintain security warnings until Auth.js is implemented

## License

MIT
