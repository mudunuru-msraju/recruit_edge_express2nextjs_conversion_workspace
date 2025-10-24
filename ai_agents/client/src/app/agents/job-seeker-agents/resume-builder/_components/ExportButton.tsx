/**
 * Export Button Component
 * Allows users to download resume in different formats
 */

import { useState } from 'react';
import { useResumeBuilder } from '../contexts/ResumeBuilderProvider';
import { useResumeExport } from '../contexts/hooks';
import { Button } from '@/components/ui/button';
import { Download, FileText, File, Loader2 } from 'lucide-react';

export function ExportButton() {
  const { resumeData } = useResumeBuilder();
  const { exportAsPDF, exportAsDOCX, isExporting } = useResumeExport();
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = (format: 'pdf' | 'docx') => {
    alert(`Export as ${format.toUpperCase()} - Backend integration coming soon!\n\nThis feature will be connected to the backend API to generate downloadable resume files.`);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        size="lg"
        className="w-full md:w-auto"
        title="Export functionality - Backend integration pending"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Export Resume
          </>
        )}
      </Button>

      {/* Export format dropdown */}
      {showMenu && !isExporting && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            onClick={() => handleExport('pdf')}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 rounded-t-lg"
          >
            <FileText className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium">Export as PDF</p>
              <p className="text-xs text-gray-500">Recommended (Coming Soon)</p>
            </div>
          </button>
          <button
            onClick={() => handleExport('docx')}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 rounded-b-lg border-t"
          >
            <File className="w-5 h-5 text-teal-600" />
            <div>
              <p className="font-medium">Export as DOCX</p>
              <p className="text-xs text-gray-500">Microsoft Word (Coming Soon)</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
