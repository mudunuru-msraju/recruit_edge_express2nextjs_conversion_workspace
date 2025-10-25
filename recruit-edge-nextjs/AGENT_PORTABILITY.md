# Agent Portability Guide

## Overview

This guide provides step-by-step instructions for creating new agents or copying existing agents in the RecruitEdge platform. The agent system uses a portable architecture where each agent is self-contained with its own manifest, schema, and UI components.

## Agent Architecture

Each agent consists of three core files:

```
app/agents/[agent-name]/
├── manifest.json       # Agent metadata and configuration
├── lib/schema.ts       # Zod validation schemas and types
└── page.tsx           # React component with complete UI
```

## Dependencies Required

### Core NPM Dependencies
```json
{
  "dependencies": {
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "next": "16.0.0",
    "lucide-react": "^0.547.0",
    "zod": "^4.1.12",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1",
    "class-variance-authority": "^0.7.1",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-label": "^2.1.7"
  }
}
```

### Required UI Components
The following components must exist in your target application:

- `@/components/ui/card` - Card, CardContent, CardDescription, CardHeader, CardTitle
- `@/components/ui/button` - Button component
- `@/components/ui/input` - Input component
- `@/components/ui/textarea` - Textarea component
- `@/components/ui/label` - Label component
- `@/components/ui/badge` - Badge component (optional for some agents)
- `@/components/ui/loading-spinner` - Loading spinner component (optional)
- `@/components/ui/error-state` - Error state component (optional)
- `@/components/ui/empty-state` - Empty state component (optional)

### Required Utility Functions
- `@/lib/utils` - Must contain `cn` function for className merging

## Step 1: Setting Up Your Environment

### 1.1 Install Required Dependencies

```bash
npm install react react-dom next lucide-react zod clsx tailwind-merge class-variance-authority @radix-ui/react-slot @radix-ui/react-label
```

### 1.2 Create Required UI Components

Create the following file structure in your project:

```
components/
└── ui/
    ├── card.tsx
    ├── button.tsx
    ├── input.tsx
    ├── textarea.tsx
    ├── label.tsx
    ├── badge.tsx            # Optional
    ├── loading-spinner.tsx  # Optional
    ├── error-state.tsx      # Optional
    └── empty-state.tsx      # Optional
```

### 1.3 Create Utility Functions

Create `lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Step 2: Copying an Existing Agent

### 2.1 Copy Agent Folder

1. Copy the entire agent folder from the source project:
   ```bash
   cp -r /source/app/agents/[agent-name] /target/app/agents/[agent-name]
   ```

2. Or manually copy the three files:
   - `manifest.json`
   - `lib/schema.ts`
   - `page.tsx`

### 2.2 Update Agent Configuration

1. **Update manifest.json** (if needed):
   ```json
   {
     "id": "your-agent-id",
     "name": "Your Agent Name",
     "description": "Agent description",
     "category": "job-seeker-agents|recruiter-agents|admin-agents",
     "ui": {
       "route": "/agents/your-agent-id"
     }
   }
   ```

2. **Update routing** (if needed):
   - Ensure the folder name matches the agent ID
   - Update the route in manifest.json

### 2.3 Test the Agent

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/agents/[agent-name]`

## Step 3: Creating a New Agent from Scratch

### 3.1 Create Agent Directory Structure

```bash
mkdir -p app/agents/[your-agent-name]/lib
```

### 3.2 Create manifest.json

```json
{
  "id": "your-agent-id",
  "name": "Your Agent Name",
  "description": "Brief description of what your agent does",
  "category": "job-seeker-agents",
  "version": "1.0.0",
  "author": "Your Name",
  "tags": ["tag1", "tag2", "tag3"],
  "capabilities": [
    "Capability 1",
    "Capability 2",
    "Capability 3"
  ],
  "requiredPermissions": ["user"],
  "apiEndpoints": {
    "main": "/api/agents/your-agent-id/main",
    "data": "/api/agents/your-agent-id/data"
  },
  "ui": {
    "icon": "icon-name",
    "color": "blue",
    "route": "/agents/your-agent-id"
  }
}
```

### 3.3 Create lib/schema.ts

```typescript
import { z } from 'zod';

// Define your data schemas
export const yourDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Input schemas for forms
export const createYourDataSchema = yourDataSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const updateYourDataSchema = createYourDataSchema.partial();

// Query schemas for filtering
export const yourDataQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  limit: z.number().default(10),
  offset: z.number().default(0)
});

// Export types
export type YourData = z.infer<typeof yourDataSchema>;
export type CreateYourData = z.infer<typeof createYourDataSchema>;
export type UpdateYourData = z.infer<typeof updateYourDataSchema>;
export type YourDataQuery = z.infer<typeof yourDataQuerySchema>;
```

### 3.4 Create page.tsx

```typescript
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { YourIconName } from 'lucide-react';

export default function YourAgentPage() {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2' | 'tab3'>('tab1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Your component logic here

  const renderTab1 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tab 1 Content</CardTitle>
          <CardDescription>Description for tab 1</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Your tab content */}
        </CardContent>
      </Card>
    </div>
  );

  const renderTab2 = () => (
    <div className="space-y-6">
      {/* Tab 2 content */}
    </div>
  );

  const renderTab3 = () => (
    <div className="space-y-6">
      {/* Tab 3 content */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <YourIconName className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Your Agent Name</h1>
          </div>
          <p className="text-gray-600">
            Description of what your agent does
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'tab1', label: 'Tab 1', icon: YourIconName },
            { id: 'tab2', label: 'Tab 2', icon: YourIconName },
            { id: 'tab3', label: 'Tab 3', icon: YourIconName }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'tab1' && renderTab1()}
        {activeTab === 'tab2' && renderTab2()}
        {activeTab === 'tab3' && renderTab3()}
      </div>
    </div>
  );
}
```

## Step 4: Agent Categories

Choose the appropriate category for your agent:

### job-seeker-agents
- Agents that help job seekers (e.g., Resume Builder, Job Matcher)
- Route: `/agents/[agent-name]`

### recruiter-agents
- Agents that help recruiters (e.g., Job Analytics, Candidate Screener)
- Route: `/agents/[agent-name]`

### admin-agents
- Administrative agents (e.g., User Management, System Monitor)
- Route: `/agents/[agent-name]`

## Step 5: Testing and Validation

### 5.1 Validate manifest.json
Ensure your manifest.json follows the correct schema and all required fields are present.

### 5.2 Test Schema Validation
Test your Zod schemas with sample data to ensure they work correctly.

### 5.3 Test UI Components
- Verify all tabs and functionality work
- Test responsive design on different screen sizes
- Ensure all imported components exist

### 5.4 Check Routing
Navigate to your agent URL and ensure it loads without errors.

## Step 6: Best Practices

### 6.1 Naming Conventions
- Use kebab-case for agent IDs and folder names
- Use PascalCase for component names
- Use camelCase for variable names

### 6.2 Error Handling
- Always include error states in your UI
- Use try-catch blocks for async operations
- Provide meaningful error messages

### 6.3 Loading States
- Show loading spinners for async operations
- Disable buttons during form submissions
- Provide feedback for user actions

### 6.4 Accessibility
- Use proper semantic HTML
- Include aria-labels where needed
- Ensure keyboard navigation works

## Troubleshooting

### Common Issues

1. **Missing UI Components**
   - Ensure all imported components exist
   - Check component export/import syntax

2. **Routing Issues**
   - Verify folder name matches agent ID
   - Check Next.js App Router structure

3. **Schema Validation Errors**
   - Test schemas with sample data
   - Check Zod schema syntax

4. **Styling Issues**
   - Ensure Tailwind CSS is configured
   - Check utility function imports

### Getting Help

- Check the console for error messages
- Verify all dependencies are installed
- Ensure file paths and imports are correct
- Test with minimal examples first

## Conclusion

Following this guide, you should be able to successfully copy existing agents or create new ones for your application. Remember to test thoroughly and follow the established patterns for consistency across your agent ecosystem.