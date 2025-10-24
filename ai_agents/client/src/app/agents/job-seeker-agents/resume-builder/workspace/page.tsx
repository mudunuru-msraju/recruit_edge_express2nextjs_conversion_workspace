/**
 * Resume Builder Workspace Page
 * Main workspace interface for building resumes
 */

import { useResumeBuilder } from '../contexts/ResumeBuilderProvider';
import { PersonalInfoForm } from '../_components/PersonalInfoForm';
import { SummarySection } from '../_components/SummarySection';
import { TemplateSelector } from '../_components/TemplateSelector';
import { ResumePreview } from '../_components/ResumePreview';
import { ExportButton } from '../_components/ExportButton';
import { ExperienceSection } from '../_components/ExperienceSection';
import { EducationSection } from '../_components/EducationSection';
import { SkillsSection } from '../_components/SkillsSection';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Save, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { saveResume, updateResume } from '../api/client';

export default function ResumeBuilderWorkspace() {
  const { resumeData, isPreviewMode, setIsPreviewMode, isSaving, setIsSaving } = useResumeBuilder();
  const [savedResumeId, setSavedResumeId] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  /**
   * Auto-save resume every 30 seconds
   */
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (resumeData.personalInfo.fullName || resumeData.personalInfo.email) {
        handleSave(true);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [resumeData, savedResumeId]);

  /**
   * Save resume to database
   */
  const handleSave = async (isAutoSave = false) => {
    try {
      setIsSaving(true);
      setSaveStatus('saving');

      if (savedResumeId) {
        // Update existing resume
        await updateResume(savedResumeId, resumeData);
      } else {
        // Create new resume
        const result = await saveResume(resumeData);
        setSavedResumeId(result.id);
      }

      setSaveStatus('saved');
      
      if (!isAutoSave) {
        // Show saved message for manual saves
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        // Reset status faster for auto-saves
        setTimeout(() => setSaveStatus('idle'), 1000);
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-sm text-gray-500">Create your professional resume</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              size="sm"
            >
              {isPreviewMode ? (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Mode
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Mode
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isSaving || saveStatus === 'saving'}
              size="sm"
            >
              {saveStatus === 'saved' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <Save className="w-4 h-4 mr-2 text-red-600" />
                  Error
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Draft'}
                </>
              )}
            </Button>
            
            <ExportButton />
          </div>
        </div>
      </div>

      {/* Main Workspace Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isPreviewMode ? (
          /* Preview Mode - Full Resume Preview */
          <div className="max-w-5xl mx-auto">
            <ResumePreview />
          </div>
        ) : (
          /* Edit Mode - Split View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {/* Left Column - Form Sections */}
            <div className="space-y-6">
              <div id="template">
                <TemplateSelector />
              </div>
              
              <div id="personal">
                <PersonalInfoForm />
              </div>
              
              <div id="summary">
                <SummarySection />
              </div>

              <div id="experience">
                <ExperienceSection />
              </div>

              <div id="education">
                <EducationSection />
              </div>

              <div id="skills">
                <SkillsSection />
              </div>
            </div>

            {/* Right Column - Live Preview */}
            <div className="sticky top-6 h-fit">
              <ResumePreview />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
