# RecruitEdge Agent Architecture Guide

> **Definitive guide for building self-contained, portable AI agents**
> 
> **Use this document to maintain consistency across all agents**

---

## 📐 Core Design Philosophy

### Guiding Principles

1. **Self-Contained First** - Each agent is a complete, standalone module
2. **Workspace-First Design** - Landing and workspace are separate apps with different layouts
3. **Hook-Based Architecture** - Composable hooks for maximum reusability
4. **Progressive Enhancement** - Works without backend, enhances with it
5. **Framework Agnostic** - Works with Next.js, Vite, CRA, or any React setup
6. **README as Contract** - Complete integration guide in every agent

---

## 🗂️ **Mandatory Folder Structure**

Every agent MUST follow this exact structure:

```
app/agents/<category>-agents/<agent-slug>/
├── data/
│   ├── manifest.json              # ✅ REQUIRED: JSON configuration
│   └── manifest.ts                # ✅ REQUIRED: TypeScript configuration
├── types.ts                       # ✅ REQUIRED: All TypeScript types
├── contexts/
│   ├── <Agent>Provider.tsx        # ✅ REQUIRED: Context provider
│   └── hooks.ts                   # ✅ REQUIRED: Custom React hooks
├── _components/                   # ✅ REQUIRED: UI components
│   ├── Component1.tsx
│   ├── Component2.tsx
│   └── ...
├── utils/                         # ✅ REQUIRED: Utility functions
│   └── index.ts
├── api/                           # ✅ REQUIRED: API client & routes
│   ├── routes.ts                  # API endpoint definitions
│   └── client.ts                  # API client functions
├── workspace/
│   ├── layout.tsx                 # ✅ REQUIRED: Workspace layout
│   └── page.tsx                   # ✅ REQUIRED: Workspace content
├── page.tsx                       # ✅ REQUIRED: Landing page
└── README.md                      # ✅ REQUIRED: Integration guide
```

### ⚠️ Critical Rules

1. **✅ ALWAYS include all folders** even if some are minimal
2. **✅ ALWAYS include both** `manifest.json` AND `manifest.ts`
3. **✅ ALWAYS include** `utils/` and `api/` folders
4. **✅ Types at root level** (types.ts), not in _components/
5. **✅ Layout in workspace/** folder, not at agent root
6. **✅ Components prefixed with _** (_components/ not components/)

---

## 📄 **File Templates & Patterns**

### 1. `data/manifest.json`

**Purpose:** JSON configuration for runtime reading

```json
{
  "slug": "agent-slug",
  "category": "category-agents",
  "title": "Agent Title",
  "description": "Brief description of what this agent does",
  "tags": ["tag1", "tag2", "tag3"],
  "aiProvider": "openai",
  "modelName": "gpt-4",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "sampleQuestions": [
    "Question users might ask?",
    "Another common question?",
    "How do I...?"
  ]
}
```

### 2. `data/manifest.ts`

**Purpose:** TypeScript configuration with type safety

```typescript
/**
 * [Agent Name] Manifest (TypeScript)
 * Type-safe configuration for the agent
 */

export interface AgentManifest {
  slug: string;
  category: string;
  title: string;
  description: string;
  icon?: string;
  tags: string[];
  aiProvider?: 'openai' | 'anthropic' | 'gemini';
  modelName?: string;
  features: string[];
  sampleQuestions: string[];
  version?: string;
  author?: string;
  license?: string;
}

export const [agentName]Manifest: AgentManifest = {
  slug: "agent-slug",
  category: "category-agents",
  title: "Agent Title",
  description: "Detailed description",
  tags: ["tag1", "tag2"],
  aiProvider: "openai",
  modelName: "gpt-4",
  features: [
    "Feature 1 with details",
    "Feature 2 with details"
  ],
  sampleQuestions: [
    "Sample question 1?",
    "Sample question 2?"
  ],
  version: "1.0.0",
  author: "RecruitEdge",
  license: "MIT"
};

export default [agentName]Manifest;
```

### 3. `types.ts`

**Purpose:** All TypeScript types for the agent

**Pattern:**
- Use PascalCase for types/interfaces
- Export all types
- Include JSDoc comments
- Group related types together

```typescript
/**
 * [Agent Name] Type Definitions
 * All TypeScript types for this agent
 */

/**
 * Main data structure for [feature]
 */
export interface MainDataType {
  id: string;
  field1: string;
  field2: number;
  // ... all fields
}

/**
 * Sub-section data
 */
export interface SubSection {
  id: string;
  // ... fields
}

/**
 * Context state shape
 */
export interface AgentContextState {
  mainData: MainDataType;
  subSections: SubSection[];
  // ... all state
}

// Export all types
export type TemplateType = 'template1' | 'template2' | 'template3';
```

### 4. `contexts/<Agent>Provider.tsx`

**Purpose:** State management with React Context

**Pattern:**
```typescript
/**
 * [Agent Name] Context Provider
 * Manages global state for the agent
 */

import { createContext, useContext, useState, ReactNode } from 'react';
import { MainDataType, AgentContextState } from '../types';

interface AgentContextValue extends AgentContextState {
  // State
  mainData: MainDataType;
  
  // Setters
  setMainData: (data: MainDataType) => void;
  updateSection: (section: string, data: any) => void;
  
  // UI State
  isPreviewMode: boolean;
  setIsPreviewMode: (mode: boolean) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
}

const AgentContext = createContext<AgentContextValue | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  // Initialize state
  const [mainData, setMainData] = useState<MainDataType>({
    // default values
  });
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Update methods
  const updateSection = (section: string, data: any) => {
    setMainData(prev => ({
      ...prev,
      [section]: data
    }));
  };
  
  const value = {
    mainData,
    setMainData,
    updateSection,
    isPreviewMode,
    setIsPreviewMode,
    isSaving,
    setIsSaving,
  };
  
  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}

// Custom hook to use context
export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within AgentProvider');
  }
  return context;
}
```

### 5. `contexts/hooks.ts`

**Purpose:** Custom React hooks for business logic

**Pattern:**
- Separate hooks file for better organization
- Each hook should have single responsibility
- Use descriptive names (useAI..., useExport..., useValidation...)

```typescript
/**
 * Custom Hooks for [Agent Name]
 * Reusable business logic hooks
 */

import { useState } from 'react';
import { MainDataType } from '../types';

/**
 * Hook for AI-powered operations
 */
export function useAISuggestions() {
  const [isLoading, setIsLoading] = useState(false);
  
  const generateContent = async (data: MainDataType) => {
    setIsLoading(true);
    try {
      // Call API
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return await response.json();
    } finally {
      setIsLoading(false);
    }
  };
  
  return { generateContent, isLoading };
}

/**
 * Hook for export operations
 */
export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  
  const exportAsPDF = async (data: MainDataType) => {
    setIsExporting(true);
    try {
      // Export logic
    } finally {
      setIsExporting(false);
    }
  };
  
  return { exportAsPDF, isExporting };
}
```

### 6. `utils/index.ts`

**Purpose:** Utility functions specific to this agent

**Pattern:**
```typescript
/**
 * [Agent Name] Utility Functions
 * Helper functions specific to this agent
 */

/**
 * Format date for display
 */
export const formatDate = (date: string): string => {
  // Implementation
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calculate completion percentage
 */
export const calculateCompleteness = (data: any): number => {
  // Implementation
  return percentage;
};

// Export all utilities
```

**Guidelines:**
- Pure functions only
- No side effects
- Well documented
- Include JSDoc comments

### 7. `api/routes.ts`

**Purpose:** Define all API endpoints as constants

**Pattern:**
```typescript
/**
 * [Agent Name] API Routes
 * Agent-specific API endpoints
 */

export const AGENT_API = {
  // CRUD operations
  SAVE: '/api/agents/agent-slug/save',
  GET: (id: string) => `/api/agents/agent-slug/${id}`,
  UPDATE: (id: string) => `/api/agents/agent-slug/${id}`,
  DELETE: (id: string) => `/api/agents/agent-slug/${id}`,
  LIST: '/api/agents/agent-slug/list',
  
  // AI operations
  AI_GENERATE: '/api/agents/agent-slug/ai/generate',
  AI_IMPROVE: '/api/agents/agent-slug/ai/improve',
  
  // Export operations
  EXPORT_PDF: '/api/agents/agent-slug/export/pdf',
  EXPORT_DOCX: '/api/agents/agent-slug/export/docx',
  
  // Interaction history
  GET_HISTORY: '/api/agents/agent-slug/history',
  SAVE_INTERACTION: '/api/agents/agent-slug/history',
} as const;
```

### 8. `api/client.ts`

**Purpose:** API client functions

**Pattern:**
```typescript
/**
 * [Agent Name] API Client
 * Client-side functions to interact with backend
 */

import { MainDataType } from '../types';
import { AGENT_API } from './routes';

/**
 * Save data to database
 */
export const saveData = async (data: MainDataType): Promise<{ id: string; success: boolean }> => {
  const response = await fetch(AGENT_API.SAVE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save data');
  }
  
  return response.json();
};

/**
 * Get data by ID
 */
export const getData = async (id: string): Promise<MainDataType> => {
  const response = await fetch(AGENT_API.GET(id));
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return response.json();
};

// More API functions...
```

### 9. `_components/ComponentName.tsx`

**Purpose:** UI components

**Naming Pattern:**
- Use PascalCase
- Name by feature/purpose (not agent prefix)
- Examples: `PersonalInfoForm`, `DataPreview`, `ExportButton`

**Template:**
```typescript
/**
 * [Component Name]
 * Brief description of what it does
 */

import { useAgent } from '../contexts/AgentProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ComponentName() {
  const { mainData, updateSection } = useAgent();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Title</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  );
}
```

### 10. `workspace/layout.tsx`

**Purpose:** Workspace-specific layout with sidebar

**Pattern:**
```typescript
/**
 * [Agent Name] Workspace Layout
 * Defines the agent-specific sidebar and navigation
 */

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AgentProvider } from '../contexts/AgentProvider';
import { Home, ArrowLeft, Icon1, Icon2 } from 'lucide-react';

interface WorkspaceLayoutProps {
  children: ReactNode;
}

// Agent-specific navigation
const navigationItems = [
  { icon: Icon1, label: 'Section 1', section: 'section1' },
  { icon: Icon2, label: 'Section 2', section: 'section2' },
  // ... more sections
];

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const location = useLocation();
  
  return (
    <AgentProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Agent-Specific Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Agent Header */}
          <div className="p-4 border-b border-gray-200">
            <Link to="/category-agents/agent-slug" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3">
              <ArrowLeft className="w-4 h-4" />
              Back to Agent Info
            </Link>
            <h2 className="text-lg font-bold text-gray-900">Agent Name</h2>
            <p className="text-sm text-gray-500">Agent tagline</p>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.hash === `#${item.section}`;
                
                return (
                  <li key={item.section}>
                    <a
                      href={`#${item.section}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <Link to="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </AgentProvider>
  );
}
```

### 11. `workspace/page.tsx`

**Purpose:** Main workspace interface

**Pattern:**
```typescript
/**
 * [Agent Name] Workspace Page
 * Main workspace interface
 */

import { useAgent } from '../contexts/AgentProvider';
import { Component1 } from '../_components/Component1';
import { Component2 } from '../_components/Component2';
import { PreviewComponent } from '../_components/PreviewComponent';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Save } from 'lucide-react';

export default function AgentWorkspace() {
  const { isPreviewMode, setIsPreviewMode, isSaving } = useAgent();
  
  const handleSave = async () => {
    // Save logic
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Name</h1>
            <p className="text-sm text-gray-500">Workspace description</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              size="sm"
            >
              {isPreviewMode ? (
                <><Edit className="w-4 h-4 mr-2" />Edit Mode</>
              ) : (
                <><Eye className="w-4 h-4 mr-2" />Preview Mode</>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Workspace Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isPreviewMode ? (
          <div className="max-w-5xl mx-auto">
            <PreviewComponent />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {/* Left: Form Sections */}
            <div className="space-y-6">
              <div id="section1">
                <Component1 />
              </div>
              
              <div id="section2">
                <Component2 />
              </div>
            </div>
            
            {/* Right: Live Preview */}
            <div className="sticky top-6 h-fit">
              <PreviewComponent />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 12. `page.tsx` (Landing Page)

**Purpose:** Agent landing/marketing page

**Pattern:**
```typescript
/**
 * [Agent Name] Landing Page
 * Displays agent information, features, and sample questions
 */

import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, MainIcon } from 'lucide-react';
import manifest from './data/manifest.json';

export default function AgentLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Link to={`/${manifest.category}/${manifest.slug}/workspace`}>
              <Button>
                Open Workspace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center">
              <MainIcon className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {manifest.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {manifest.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {manifest.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <Link to={`/${manifest.category}/${manifest.slug}/workspace`}>
            <Button size="lg" className="px-8">
              Start Using Agent
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {manifest.features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <p className="text-gray-700">{feature}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Sample Questions */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How Can I Help You?</h2>
          <p className="text-center text-gray-600 mb-8">
            Here are some common questions I can answer
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {manifest.sampleQuestions.map((question, index) => (
              <Card key={index} className="hover:border-blue-400 cursor-pointer transition-colors">
                <CardContent className="p-6">
                  <p className="text-gray-700">{question}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start using {manifest.title} now
          </p>
          <Link to={`/${manifest.category}/${manifest.slug}/workspace`}>
            <Button size="lg" className="px-8">
              Open Workspace
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Part of the RecruitEdge AI Agent Platform</p>
        </div>
      </footer>
    </div>
  );
}
```

### 13. `README.md`

**Purpose:** Complete integration guide

**Must Include:**
1. Overview
2. Quick Start (Next.js & React Router)
3. Folder Structure
4. Features
5. Dependencies
6. API Integration
7. Customization
8. Troubleshooting

---

## 🎯 URL Structure

### Standard Pattern

All agents MUST follow this URL structure:

```
Landing Page:  /<category>-agents/<agent-slug>
Workspace:     /<category>-agents/<agent-slug>/workspace
```

**Examples:**
```
/job-seeker-agents/resume-builder
/job-seeker-agents/resume-builder/workspace

/recruiter-agents/job-description-generator
/recruiter-agents/job-description-generator/workspace

/admin-agents/analytics-dashboard
/admin-agents/analytics-dashboard/workspace
```

---

## 🔧 Portability Checklist

Before marking an agent as "complete", verify:

- [ ] All required folders exist (even if minimal)
- [ ] Both manifest.json AND manifest.ts exist
- [ ] types.ts at root level
- [ ] utils/index.ts exists with at least 3 helper functions
- [ ] api/routes.ts and api/client.ts exist
- [ ] contexts/ has Provider and hooks.ts
- [ ] workspace/layout.tsx and workspace/page.tsx exist
- [ ] page.tsx (landing page) exists
- [ ] README.md has integration guides for Next.js AND React Router
- [ ] All components import from correct relative paths
- [ ] No hardcoded API URLs (use api/routes.ts)
- [ ] README includes all dependencies
- [ ] README has troubleshooting section

---

## 📦 Dependencies

### Required for All Agents

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "lucide-react": "^0.263.0"
}
```

### Shadcn UI Components

```bash
npx shadcn-ui@latest add button card
```

### Optional (Backend)
```json
{
  "axios": "^1.6.0"
}
```

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T

1. **Don't put types in _components/** - Always at root
2. **Don't put layout at agent root** - Always in workspace/
3. **Don't prefix component names with agent name** - Use feature names
4. **Don't skip utils/ or api/ folders** - Required for consistency
5. **Don't forget manifest.ts** - Always include both .json and .ts
6. **Don't use absolute API URLs** - Always use api/routes.ts
7. **Don't mix component logic with data fetching** - Use hooks
8. **Don't skip README.md** - Critical for portability

### ✅ DO

1. **Do keep agents self-contained** - Zero external dependencies
2. **Do use hooks for business logic** - Composable and reusable
3. **Do document utilities** - JSDoc comments
4. **Do validate props** - TypeScript types
5. **Do test independently** - Agent should work standalone
6. **Do include both integration guides** - Next.js AND React Router
7. **Do use manifest for configuration** - Never hardcode metadata
8. **Do make API calls optional** - Work without backend

---

## 🧪 Testing Agents

### Standalone Test

```bash
# Copy agent to new test project
cp -r agent-name /test-project/app/agents/category-agents/

# Install dependencies
npm install react react-dom lucide-react
npx shadcn-ui add button card

# Add routes and test
npm run dev
```

### Integration Test

1. Visit landing page: `/<category>-agents/<slug>`
2. Verify all features, tags, questions display from manifest
3. Click "Open Workspace"
4. Verify workspace loads
5. Verify sidebar navigation works
6. Verify preview mode toggle works
7. Verify all sections are accessible

### API Test (if backend exists)

1. Save data
2. Load data
3. Export functionality
4. AI generation
5. History tracking

---

## 📊 Metrics for Success

Good agent should have:

- ✅ **< 10 minutes** integration time
- ✅ **Zero breaking errors** when copied
- ✅ **Works without backend** (graceful degradation)
- ✅ **Complete TypeScript types** (no `any`)
- ✅ **Comprehensive README** (can follow without asking questions)
- ✅ **Reusable hooks** (can use in other agents)
- ✅ **Clear separation** (landing vs workspace)

---

## 🔄 Agent Update Process

When updating an agent:

1. Update version in manifest.ts
2. Update README.md with changes
3. Test integration in clean project
4. Verify all examples still work
5. Update CHANGELOG if exists

---

## 📝 Summary Checklist for LLMs

When building a new agent:

1. **Create folder structure** (all required folders)
2. **Create manifest.json** (runtime config)
3. **Create manifest.ts** (TypeScript config)
4. **Create types.ts** (all agent types)
5. **Create contexts/Provider** (state management)
6. **Create contexts/hooks** (business logic)
7. **Create utils/** (helper functions)
8. **Create api/** (routes + client)
9. **Create _components/** (5-10 components)
10. **Create workspace/layout** (sidebar + navigation)
11. **Create workspace/page** (main workspace)
12. **Create page.tsx** (landing page)
13. **Create README.md** (both integration guides)
14. **Test standalone** (copy & run)
15. **Verify checklist** (all items checked)

---

**This guide is the single source of truth for RecruitEdge agent architecture.**

**Follow it precisely for consistency across all agents.**

---

*Version: 1.0.0*  
*Last Updated: October 2025*  
*Maintained by: RecruitEdge Core Team*
