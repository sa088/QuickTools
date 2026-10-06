import React, { useState } from 'react';
import { FileDown, Printer, Check, Loader2, ChevronDown } from 'lucide-react';
import { generatePdfReport, PdfReportOptions, triggerPrintWindow } from '@/lib/pdfGenerator';

interface DownloadPdfButtonProps {
  getReportOptions: () => PdfReportOptions;
  buttonLabel?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPrintOption?: boolean;
}

export function DownloadPdfButton({
  getReportOptions,
  buttonLabel = 'Download PDF Report',
  variant = 'secondary',
  size = 'md',
  className = '',
  showPrintOption = true,
}: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const options = getReportOptions();
      setTimeout(() => {
        try {
          generatePdfReport(options);
          setIsGenerating(false);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 2500);
        } catch (err) {
          console.error('Failed to generate PDF report:', err);
          setIsGenerating(false);
        }
      }, 120);
    } catch (err) {
      console.error('Error preparing PDF data:', err);
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    setMenuOpen(false);
    triggerPrintWindow();
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-3.5 py-2 text-xs rounded-xl gap-2 font-bold',
    lg: 'px-4 py-2.5 text-sm rounded-2xl gap-2.5 font-bold',
  }[size];

  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs',
    outline: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs',
  }[variant];

  return (
    <div className={`relative inline-flex items-center rounded-xl shadow-2xs ${className}`}>
      <button
        type="button"
        id="btn-download-pdf-report"
        onClick={handleDownload}
        disabled={isGenerating}
        className={`inline-flex items-center justify-center transition-all ${sizeClasses} ${variantClasses} ${
          showPrintOption ? 'rounded-r-none border-r border-white/20' : ''
        }`}
        title="Download printable PDF report with full breakdown and reference code"
      >
        {isGenerating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
        ) : downloadSuccess ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <FileDown className="w-3.5 h-3.5 text-rose-400" />
        )}
        <span>
          {isGenerating
            ? 'Generating...'
            : downloadSuccess
            ? 'Downloaded!'
            : buttonLabel}
        </span>
      </button>

      {showPrintOption && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 transition-all rounded-r-xl ${variantClasses} flex items-center justify-center`}
            title="Additional print & export options"
            aria-label="Export options"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 bottom-full mb-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleDownload();
                  }}
                  className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <FileDown className="w-3.5 h-3.5 text-rose-600" />
                  <span>Download .PDF File</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
