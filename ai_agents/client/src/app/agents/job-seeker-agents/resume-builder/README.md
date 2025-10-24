# Resume Builder Agent

> **Self-contained, portable AI agent for building professional resumes**

## 📋 Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
  - [Next.js App Router Integration](#nextjs-app-router-integration)
  - [React Router Integration](#react-router-integration)
- [Folder Structure](#folder-structure)
- [Features](#features)
- [Dependencies](#dependencies)
- [API Integration](#api-integration)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Resume Builder agent is a **100% self-contained module** that can be dropped into any React project. It provides:

- ✅ Full resume building interface with 5 sections
- ✅ Real-time preview with template selection
- ✅ AI-powered content generation (when backend connected)
- ✅ Export to PDF/DOCX (when backend connected)
- ✅ State management with React Context
- ✅ Interaction history tracking
- ✅ Complete TypeScript type safety

**Agent URL Pattern:**
- Landing: `/job-seeker-agents/resume-builder`
- Workspace: `/job-seeker-agents/resume-builder/workspace`

---

## Quick Start

### Prerequisites

Ensure your project has:
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "lucide-react": "^0.263.0"
  }
}
```

### Installation Steps

#### 1️⃣ **Copy Agent Folder**
```bash
# Copy the entire resume-builder folder to your project
cp -r resume-builder /your-project/[path-to-agents]/job-seeker-agents/
```

#### 2️⃣ **Install Dependencies**
```bash
npm install react react-dom lucide-react

# Install Shadcn UI components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card
```

#### 3️⃣ **Configure Tailwind CSS**

Ensure `tailwind.config.js` includes the agent path:
```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",          // For Next.js
    "./src/**/*.{js,ts,jsx,tsx}",          // For Vite/CRA
    // Add agent path explicitly if needed:
    "./src/app/agents/**/*.{js,ts,jsx,tsx}"
  ],
  // ... rest of config
}
```

#### 4️⃣ **Set Up TypeScript Paths**

In `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],                  // For Vite/CRA
      "@/*": ["./app/*"]                   // For Next.js
    }
  }
}
```

---

## Next.js App Router Integration

### 📁 File Structure in Next.js
```
app/
├── agents/
│   └── job-seeker-agents/
│       └── resume-builder/          ← Copy here
└── ...
```

### 🔧 Routing Setup

Next.js App Router automatically handles routing based on folder structure.

**No additional routing code needed!** Just ensure:

1. **Agent folder is in correct location:**
   ```
   app/agents/job-seeker-agents/resume-builder/
   ```

2. **Files are named correctly:**
   - `page.tsx` - Landing page
   - `workspace/page.tsx` - Workspace page
   - `workspace/layout.tsx` - Workspace layout

3. **URLs will automatically work:**
   - `/agents/job-seeker-agents/resume-builder` → `page.tsx`
   - `/agents/job-seeker-agents/resume-builder/workspace` → `workspace/page.tsx`

### ✅ Verification

Start your Next.js app and visit:
```
http://localhost:3000/agents/job-seeker-agents/resume-builder
http://localhost:3000/agents/job-seeker-agents/resume-builder/workspace
```

### 🎨 Optional: Custom Root Layout

If you want a custom layout for ALL agents:

```tsx
// app/agents/layout.tsx
export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optional: Global agent navigation */}
      <nav>Agent Navigation</nav>
      {children}
    </div>
  );
}
```

---

## React Router Integration

### 📁 File Structure in React Router Projects
```
src/
├── app/
│   └── agents/
│       └── job-seeker-agents/
│           └── resume-builder/      ← Copy here
└── App.tsx                          ← Update routing here
```

### 🔧 Routing Setup

#### Option A: React Router v6 (Recommended)

In your `App.tsx` or routing file:

```tsx
import { Routes, Route } from 'react-router-dom';

// Import Resume Builder components
import ResumeBuilderLanding from './app/agents/job-seeker-agents/resume-builder/page';
import ResumeBuilderWorkspace from './app/agents/job-seeker-agents/resume-builder/workspace/page';
import ResumeBuilderLayout from './app/agents/job-seeker-agents/resume-builder/workspace/layout';

function App() {
  return (
    <Routes>
      {/* Your other routes */}
      <Route path="/" element={<HomePage />} />
      
      {/* Resume Builder Agent Routes */}
      <Route 
        path="/job-seeker-agents/resume-builder" 
        element={<ResumeBuilderLanding />} 
      />
      <Route 
        path="/job-seeker-agents/resume-builder/workspace" 
        element={
          <ResumeBuilderLayout>
            <ResumeBuilderWorkspace />
          </ResumeBuilderLayout>
        } 
      />
    </Routes>
  );
}

export default App;
```

#### Option B: Dynamic Agent Routing (For Multiple Agents)

For a more scalable approach when you have multiple agents:

```tsx
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load agent components
const ResumeBuilderLanding = lazy(() => import('./app/agents/job-seeker-agents/resume-builder/page'));
const ResumeBuilderWorkspace = lazy(() => import('./app/agents/job-seeker-agents/resume-builder/workspace/page'));
const ResumeBuilderLayout = lazy(() => import('./app/agents/job-seeker-agents/resume-builder/workspace/layout'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/job-seeker-agents/resume-builder" element={<ResumeBuilderLanding />} />
        <Route 
          path="/job-seeker-agents/resume-builder/workspace" 
          element={
            <ResumeBuilderLayout>
              <ResumeBuilderWorkspace />
            </ResumeBuilderLayout>
          } 
        />
      </Routes>
    </Suspense>
  );
}
```

### ✅ Verification

Start your development server and visit:
```
http://localhost:5000/job-seeker-agents/resume-builder
http://localhost:5000/job-seeker-agents/resume-builder/workspace
```

---

## Folder Structure

```
resume-builder/
├── data/
│   ├── manifest.json              # JSON configuration
│   └── manifest.ts                # TypeScript configuration ⭐
├── types.ts                       # TypeScript type definitions
├── contexts/
│   ├── ResumeBuilderProvider.tsx  # State management context
│   └── hooks.ts                   # Custom React hooks
├── _components/                   # UI components (private)
│   ├── PersonalInfoForm.tsx
│   ├── SummarySection.tsx
│   ├── ExperienceSection.tsx
│   ├── EducationSection.tsx
│   ├── SkillsSection.tsx
│   ├── TemplateSelector.tsx
│   ├── ResumePreview.tsx
│   └── ExportButton.tsx
├── utils/                         # Utility functions ⭐
│   └── index.ts
├── api/                           # API client & routes ⭐
│   ├── routes.ts                  # API endpoint definitions
│   └── client.ts                  # API client functions
├── workspace/
│   ├── layout.tsx                 # Workspace layout with sidebar
│   └── page.tsx                   # Main workspace interface
├── page.tsx                       # Agent landing page
└── README.md                      # This file
```

**⭐ = New additions for consistency**

---

## Features

### Core Functionality
- ✅ **Personal Information** - Contact details form with validation
- ✅ **Professional Summary** - AI-assisted summary generation
- ✅ **Work Experience** - Dynamic entries with achievements
- ✅ **Education** - Academic credentials
- ✅ **Skills** - Tag-based skill management

### Advanced Features
- ✅ **Template Selection** - Multiple resume templates
- ✅ **Real-time Preview** - Live resume preview as you type
- ✅ **Edit/Preview Modes** - Toggle between editing and preview
- ✅ **Export Functionality** - PDF/DOCX export (backend required)
- ✅ **AI Suggestions** - Content generation (backend required)
- ✅ **Interaction History** - Track all user actions (backend required)

---

## Dependencies

### Required
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

The agent uses:
- `Button` from `@/components/ui/button`
- `Card, CardContent, CardDescription, CardHeader, CardTitle` from `@/components/ui/card`

### Optional (for backend integration)
```json
{
  "axios": "^1.6.0"  // If you prefer axios over fetch
}
```

---

## API Integration

The agent includes a complete API client setup in the `api/` folder.

### API Routes

All endpoints are defined in `api/routes.ts`:

```typescript
import { RESUME_BUILDER_API } from './api/routes';

// Examples:
RESUME_BUILDER_API.SAVE_RESUME
RESUME_BUILDER_API.GET_RESUME(id)
RESUME_BUILDER_API.EXPORT_PDF
RESUME_BUILDER_API.AI_GENERATE_SUMMARY
RESUME_BUILDER_API.GET_HISTORY
```

### Using the API Client

```typescript
import { saveResume, getResume, exportPDF } from './api/client';

// Save resume
const result = await saveResume(resumeData);

// Get resume
const resume = await getResume('resume-id');

// Export as PDF
const pdfBlob = await exportPDF(resumeData);
```

### Backend Implementation Required

You need to implement these endpoints in your backend:

#### 1. **Save Resume**
```typescript
POST /api/agents/resume-builder/resumes
Body: { resumeData: ResumeData }
Response: { id: string, success: boolean }
```

#### 2. **Get Resume**
```typescript
GET /api/agents/resume-builder/resumes/:id
Response: ResumeData
```

#### 3. **Export PDF**
```typescript
POST /api/agents/resume-builder/export/pdf
Body: { resumeData: ResumeData }
Response: Blob (PDF file)
```

#### 4. **AI Generation**
```typescript
POST /api/agents/resume-builder/ai/generate-summary
Body: { resumeData: ResumeData }
Response: { summary: string }
```

#### 5. **Interaction History**
```typescript
GET /api/agents/resume-builder/history
Response: Array<Interaction>

POST /api/agents/resume-builder/history
Body: { type: string, data: any, timestamp: string }
Response: { success: boolean }
```

---

## Customization

### 1. Modify Manifest

Edit `data/manifest.ts` to customize agent metadata:

```typescript
export const resumeBuilderManifest = {
  title: "Your Custom Title",
  description: "Your custom description",
  aiProvider: "anthropic",  // Change AI provider
  modelName: "claude-3-opus",
  features: ["Your custom features"],
  // ...
};
```

### 2. Add Custom Components

Create new components in `_components/`:

```tsx
// _components/CustomSection.tsx
export function CustomSection() {
  const { updateSection } = useResumeBuilder();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Section</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your custom form */}
      </CardContent>
    </Card>
  );
}
```

Then add to workspace:

```tsx
// workspace/page.tsx
import { CustomSection } from '../_components/CustomSection';

// In your render:
<div id="custom">
  <CustomSection />
</div>
```

### 3. Add Utility Functions

Add helpers in `utils/index.ts`:

```typescript
export const yourCustomUtil = (data: any) => {
  // Your logic
  return processedData;
};
```

### 4. Customize Templates

Edit `_components/TemplateSelector.tsx` to add more resume templates:

```typescript
const templates = [
  { id: 'modern', name: 'Modern', preview: '/templates/modern.png' },
  { id: 'classic', name: 'Classic', preview: '/templates/classic.png' },
  { id: 'creative', name: 'Creative', preview: '/templates/creative.png' },
  // Add your custom template
  { id: 'custom', name: 'My Template', preview: '/templates/custom.png' },
];
```

---

## Utility Functions

The agent includes helpful utilities in `utils/index.ts`:

```typescript
import { 
  formatDate,                // Format dates for display
  calculateDuration,         // Calculate job duration
  isValidEmail,              // Email validation
  isValidPhone,              // Phone validation
  calculateCompleteness,     // Resume completion %
  generateFilename,          // Generate export filename
  countWords,                // Count total words
  extractKeywords,           // Extract ATS keywords
  validateResume             // Validate resume data
} from './utils';

// Example usage:
const duration = calculateDuration('2020-01', '2023-05', false);
// Returns: "3 years 4 months"

const completeness = calculateCompleteness(resumeData);
// Returns: 85 (percentage)

const validation = validateResume(resumeData);
// Returns: { isValid: true, errors: [] }
```

---

## Troubleshooting

### Issue: Components not rendering

**Solution:**
1. Verify Tailwind CSS is configured correctly
2. Check that Shadcn UI components are installed
3. Ensure TypeScript paths are set up

```bash
# Reinstall Shadcn components
npx shadcn-ui@latest add button card
```

### Issue: Routes not working (React Router)

**Solution:**
1. Verify imports are correct
2. Check that `react-router-dom` is installed
3. Ensure paths match exactly

```tsx
// Correct import paths
import ResumeBuilderLanding from './app/agents/job-seeker-agents/resume-builder/page';
```

### Issue: API calls failing

**Solution:**
1. Implement backend endpoints (see API Integration section)
2. Check CORS configuration
3. Verify API routes match your backend

### Issue: TypeScript errors

**Solution:**
1. Ensure all types are imported from `./types.ts`
2. Check `tsconfig.json` paths configuration
3. Run `npm run type-check` to identify issues

### Issue: Styles not applying

**Solution:**
1. Check Tailwind CSS content paths
2. Verify Tailwind is processing the agent folder
3. Rebuild Tailwind: `npm run build:css`

---

## Component API

### ResumeBuilderProvider

Context provider that manages all resume state.

```tsx
import { ResumeBuilderProvider, useResumeBuilder } from './contexts/ResumeBuilderProvider';

function MyComponent() {
  const {
    resumeData,           // Current resume data
    setResumeData,        // Set complete resume data
    updatePersonalInfo,   // Update personal info section
    updateSection,        // Update any section
    selectedTemplate,     // Current template
    setSelectedTemplate,  // Change template
    isPreviewMode,        // Preview mode state
    setIsPreviewMode,     // Toggle preview mode
    isSaving,             // Saving state
    setIsSaving           // Set saving state
  } = useResumeBuilder();
  
  // Use the context values
}
```

### Custom Hooks

```tsx
import { useAISuggestions, useResumeExport } from './contexts/hooks';

// AI Suggestions hook
function MyComponent() {
  const {
    generateSummary,      // Generate professional summary
    improveDescription,   // Improve job description
    extractKeywords,      // Extract ATS keywords
    isLoading             // Loading state
  } = useAISuggestions();
}

// Export hook
function ExportComponent() {
  const {
    exportAsPDF,          // Export as PDF
    exportAsDOCX,         // Export as DOCX
    isExporting           // Exporting state
  } = useResumeExport();
}
```

---

## Migration Guide

### From Another Resume Builder

If migrating from another resume builder solution:

1. **Map your data structure** to our `ResumeData` type (see `types.ts`)
2. **Import existing resumes:**
   ```typescript
   const migratedData = mapYourDataToResumeData(existingData);
   setResumeData(migratedData);
   ```
3. **Update API endpoints** in `api/routes.ts` to match your backend

### Upgrading from Version 0.x

If you used an earlier version:

1. **Add new folders:** `utils/` and `api/`
2. **Add `manifest.ts`** alongside `manifest.json`
3. **Update imports** to use new utility functions
4. **Migrate API calls** to use the new client

---

## Performance Tips

1. **Lazy load the agent:**
   ```tsx
   const ResumeBuilder = lazy(() => import('./resume-builder/page'));
   ```

2. **Memoize expensive operations:**
   ```tsx
   const completeness = useMemo(() => 
     calculateCompleteness(resumeData), 
     [resumeData]
   );
   ```

3. **Debounce auto-save:**
   ```tsx
   const debouncedSave = useMemo(
     () => debounce((data) => saveResume(data), 1000),
     []
   );
   ```

---

## License

MIT - This agent is part of the RecruitEdge platform.

---

## Support

For issues or questions:
1. Check this README first
2. Review the `types.ts` file for data structure
3. Check `utils/index.ts` for available helper functions
4. Open an issue on the main RecruitEdge repository

---

**Built with ❤️ using the RecruitEdge Agent Architecture**
