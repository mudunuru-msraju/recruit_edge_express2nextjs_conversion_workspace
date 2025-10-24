# Skill Gap Analyzer Agent

## Overview

The Skill Gap Analyzer agent is an AI-powered tool that compares a job seeker's current skills against job requirements, identifies missing competencies, and provides personalized learning paths to close those gaps.

## Features

- **Resume vs Job Comparison**: Analyze skills from resume against job description requirements
- **Gap Identification**: Automatically identify missing skills and competencies
- **Priority-Based Recommendations**: Rank skill gaps by importance (low, medium, high, critical)
- **Learning Resources**: Get personalized course and resource recommendations
- **Progress Tracking**: Monitor skill development journey and mark gaps as completed
- **Match Scoring**: Calculate overall skill match percentage
- **Learning Roadmaps**: Generate custom learning paths based on skill gaps

## Architecture

This agent follows the RecruitEdge standardized agent architecture:

```
skill-gap-analyzer/
├── data/
│   ├── manifest.json          # Agent metadata and configuration
│   └── manifest.ts            # TypeScript manifest
├── types.ts                   # TypeScript type definitions
├── contexts/
│   ├── SkillGapAnalyzerProvider.tsx  # Global state management
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

### `skill_analyses` Table
- `id` (serial): Primary key
- `userId` (integer): User who owns the analysis
- `resumeId` (integer): Optional reference to resume
- `targetRole` (text): Job role being analyzed
- `targetCompany` (text): Company name
- `jobDescription` (text): Full job description
- `currentSkills` (text[]): Array of user's current skills
- `requiredSkills` (text[]): Array of required skills from job
- `overallScore` (integer): Match percentage (0-100)
- `summary` (text): AI-generated analysis summary
- `metadata` (jsonb): Additional analysis metadata
- `createdAt`, `updatedAt`: Timestamps

### `skill_gaps` Table
- `id` (serial): Primary key
- `analysisId` (integer): Foreign key to skill_analyses
- `skillName` (text): Name of the missing skill
- `priority` (enum): Gap priority (low, medium, high, critical)
- `category` (text): Skill category (technical, soft-skill, domain-knowledge)
- `currentLevel` (enum): Current proficiency (none, beginner, intermediate, advanced, expert)
- `requiredLevel` (enum): Required proficiency level
- `learningResources` (jsonb): Recommended courses/resources
- `estimatedTime` (text): Estimated time to learn (e.g., "2 months")
- `isCompleted` (boolean): Whether gap has been closed
- `completedAt` (timestamp): When gap was marked complete
- `notes` (text): User notes on progress
- `metadata` (jsonb): Additional gap metadata
- `createdAt`, `updatedAt`: Timestamps

## API Endpoints

All endpoints are prefixed with `/api/agents/skill-gap-analyzer`

### Analyses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analyses?userId={userId}` | Get all analyses for a user |
| GET | `/analyses/:id?userId={userId}` | Get a single analysis by ID |
| POST | `/analyses` | Create a new skill gap analysis |
| PUT | `/analyses/:id` | Update analysis (score, summary) |
| DELETE | `/analyses/:id?userId={userId}` | Delete an analysis |

### Skill Gaps

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analyses/:analysisId/gaps` | Get all skill gaps for an analysis |
| PUT | `/analyses/:analysisId/gaps/:gapId` | Update a skill gap (completion, notes, level) |

### AI Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/analyze` | AI-powered skill analysis (mock) |

### History

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/history?userId={userId}` | Get agent interaction history |

## Usage Example

### Creating a New Analysis

```typescript
import { API_BASE_URL, getMockUserId } from './api/config';

const createAnalysis = async () => {
  const userId = getMockUserId();
  const response = await fetch(`${API_BASE_URL}/api/agents/skill-gap-analyzer/analyses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: parseInt(userId),
      targetRole: 'Senior Full Stack Developer',
      targetCompany: 'Stripe',
      currentSkills: ['JavaScript', 'React', 'Node.js', 'Python'],
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'GraphQL'],
    }),
  });
  
  const result = await response.json();
  console.log('Analysis created:', result.analysis);
  
  // Skill gaps are automatically created for missing skills
};
```

### Fetching Skill Gaps

```typescript
const getSkillGaps = async (analysisId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/api/agents/skill-gap-analyzer/analyses/${analysisId}/gaps`
  );
  const gaps = await response.json();
  
  // Group by priority
  const highPriority = gaps.filter(g => g.priority === 'high');
  console.log('High priority gaps:', highPriority);
};
```

### Using Context Provider

```typescript
import { useSkillGapAnalyzer } from './contexts/SkillGapAnalyzerProvider';

function MyComponent() {
  const {
    currentAnalysis,
    skillGaps,
    isAnalyzing,
    setCurrentAnalysis,
    setSkillGaps
  } = useSkillGapAnalyzer();
  
  // Use state and functions...
}
```

## Utility Functions

### Calculate Match Score

```typescript
import { calculateMatchScore } from './utils';

const currentSkills = ['JavaScript', 'React', 'Node.js'];
const requiredSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Docker'];
const score = calculateMatchScore(currentSkills, requiredSkills);
// Returns 60 (3 out of 5 = 60%)
```

### Group Gaps by Priority

```typescript
import { groupGapsByPriority } from './utils';

const groupedGaps = groupGapsByPriority(skillGaps);
// Returns: { critical: [...], high: [...], medium: [...], low: [...] }
```

## Security Warning

⚠️ **DEVELOPMENT ONLY** - This agent currently accepts `userId` from request parameters, which is insecure. In production, authentication must be implemented using Auth.js with Google OAuth, and userId must be extracted from the authenticated session. See `server/routes/SECURITY_WARNING.md` for details.

## Future Enhancements

1. **AI Integration**: Connect to OpenAI for intelligent job description parsing and skill extraction
2. **Learning Platform Integration**: Direct links to Coursera, Udemy, LinkedIn Learning courses
3. **Skill Endorsements**: Import skills from LinkedIn profile
4. **Market Demand Analysis**: Show which skills are most in-demand in the market
5. **Salary Impact**: Estimate salary increase potential from closing skill gaps
6. **Skill Verification**: Integration with certification platforms
7. **Peer Comparison**: Anonymous benchmarking against similar professionals
8. **Automated Resume Updates**: Suggest resume updates as skills are learned

## Priority Color Coding

The agent uses color coding to visualize skill gap priorities:

- **Critical** (Red): Must-have skills for the role
- **High** (Orange): Important skills that significantly impact candidacy
- **Medium** (Yellow): Nice-to-have skills that provide advantage
- **Low** (Gray): Optional skills for extra competitiveness

## Match Score Interpretation

- **75-100%**: Excellent match, ready to apply
- **50-74%**: Good match, focus on high-priority gaps
- **25-49%**: Partial match, significant upskilling needed
- **0-24%**: Poor match, consider different role or extensive training

## Contributing

When extending this agent:
1. Follow the standardized folder structure
2. Add new types to `types.ts`
3. Create reusable components in `_components/`
4. Add API functions to `api/client.ts`
5. Update utility functions in `utils/`
6. Update this README with new features
7. Maintain security warnings until Auth.js is implemented

## License

MIT
