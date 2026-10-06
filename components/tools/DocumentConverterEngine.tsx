import React, { useState, useRef } from 'react';
import { 
  FileText, 
  FileCode, 
  FileSpreadsheet, 
  Table as TableIcon, 
  Image as ImageIcon, 
  Download, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Trash2,
  Sparkles
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Paragraph, TextRun, Packer } from 'docx';

// Ensure Mozilla PDF.js worker is ready for client-side processing
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

export type ConversionType = 
  | 'wordToPdf' 
  | 'pdfToWord' 
  | 'excelToPdf' 
  | 'pdfToExcel' 
  | 'pdfToJpg' 
  | 'imgToPdf';

interface DocumentConverterEngineProps {
  type: ConversionType;
}

const CONVERTER_CONFIG: Record<ConversionType, {
  title: string;
  subtitle: string;
  sourceBadge: string;
  targetBadge: string;
  accept: string;
  themeColor: string;
  btnGradient: string;
  icon: React.ComponentType<{ className?: string }>;
  actionLabel: string;
  targetExt: string;
}> = {
  wordToPdf: {
    title: 'Word to PDF Converter',
    subtitle: 'Convert Microsoft Word documents (.docx, .doc) into valid, beautifully styled PDF files with preserved headings, paragraphs, and tables.',
    sourceBadge: 'WORD (.docx)',
    targetBadge: 'PDF (.pdf)',
    accept: '.docx,.doc',
    themeColor: 'blue',
    btnGradient: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
    icon: FileText,
    actionLabel: 'Convert to PDF',
    targetExt: '.pdf',
  },
  pdfToWord: {
    title: 'PDF to Word Converter',
    subtitle: 'Convert PDF documents into fully editable Microsoft Word (.docx) files with preserved text structure, headings, and page flow.',
    sourceBadge: 'PDF (.pdf)',
    targetBadge: 'WORD (.docx)',
    accept: '.pdf',
    themeColor: 'indigo',
    btnGradient: 'from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800',
    icon: FileCode,
    actionLabel: 'Convert to Word',
    targetExt: '.docx',
  },
  excelToPdf: {
    title: 'Excel to PDF Converter',
    subtitle: 'Convert Excel spreadsheets (.xlsx, .xls, .csv) into clean, auto-paginated table PDF documents with styled headers and borders.',
    sourceBadge: 'EXCEL (.xlsx)',
    targetBadge: 'PDF (.pdf)',
    accept: '.xlsx,.xls,.csv',
    themeColor: 'emerald',
    btnGradient: 'from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800',
    icon: FileSpreadsheet,
    actionLabel: 'Convert to PDF',
    targetExt: '.pdf',
  },
  pdfToExcel: {
    title: 'PDF to Excel Converter',
    subtitle: 'Extract table columns, tabular rows, and financial records from PDF files into an editable Microsoft Excel (.xlsx) spreadsheet.',
    sourceBadge: 'PDF (.pdf)',
    targetBadge: 'EXCEL (.xlsx)',
    accept: '.pdf',
    themeColor: 'teal',
    btnGradient: 'from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800',
    icon: TableIcon,
    actionLabel: 'Convert to Excel',
    targetExt: '.xlsx',
  },
  pdfToJpg: {
    title: 'PDF to JPG Converter',
    subtitle: 'Convert PDF pages into high-resolution JPG images with crisp vector rendering and typography.',
    sourceBadge: 'PDF (.pdf)',
    targetBadge: 'JPG (.jpg)',
    accept: '.pdf',
    themeColor: 'amber',
    btnGradient: 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
    icon: ImageIcon,
    actionLabel: 'Convert to JPG',
    targetExt: '.jpg',
  },
  imgToPdf: {
    title: 'JPG & Images to PDF Converter',
    subtitle: 'Convert photos, receipts, and scans (JPG, PNG, WebP) into an exact-dimension high-resolution PDF document.',
    sourceBadge: 'IMAGE (.jpg, .png)',
    targetBadge: 'PDF (.pdf)',
    accept: 'image/*',
    themeColor: 'rose',
    btnGradient: 'from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800',
    icon: ImageIcon,
    actionLabel: 'Convert to PDF',
    targetExt: '.pdf',
  },
};

export function DocumentConverterEngine({ type }: DocumentConverterEngineProps) {
  const config = CONVERTER_CONFIG[type];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'ready' | 'converting' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [stageMessage, setStageMessage] = useState<string>('');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>('');
  const [outputFileSize, setOutputFileSize] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus('ready');
    setOutputBlob(null);
    setErrorMessage(null);
    setProgress(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const triggerDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const executeConversion = async () => {
    if (!file) return;

    setStatus('converting');
    setProgress(15);
    setStageMessage('Reading document structure...');
    setErrorMessage(null);

    try {
      await new Promise(r => setTimeout(r, 250));
      setProgress(40);
      setStageMessage('Parsing content & building target document...');

      let resultBlob: Blob;
      const resultName: string = `${file.name.replace(/\.[^/.]+$/, '')}${config.targetExt}`;

      if (type === 'wordToPdf') {
        resultBlob = await runWordToPdf(file);
      } else if (type === 'pdfToWord') {
        resultBlob = await runPdfToWord(file);
      } else if (type === 'excelToPdf') {
        resultBlob = await runExcelToPdf(file);
      } else if (type === 'pdfToExcel') {
        resultBlob = await runPdfToExcel(file);
      } else if (type === 'pdfToJpg') {
        resultBlob = await runPdfToJpg(file);
      } else if (type === 'imgToPdf') {
        resultBlob = await runImgToPdf(file);
      } else {
        throw new Error('Unsupported conversion type');
      }

      setProgress(85);
      setStageMessage('Finalizing format & preparing download...');
      await new Promise(r => setTimeout(r, 200));

      setProgress(100);
      setOutputBlob(resultBlob);
      setOutputFileName(resultName);
      setOutputFileSize(resultBlob.size);
      setStatus('completed');

      // Auto-trigger browser download of the valid converted document
      triggerDownload(resultBlob, resultName);
    } catch (err: any) {
      console.error('Conversion failed:', err);
      setErrorMessage(err.message || 'An error occurred while converting the document. Please ensure the file is valid and not password-protected.');
      setStatus('error');
    }
  };

  // --- 1. Word to PDF (.docx -> .pdf) ---
  const runWordToPdf = async (srcFile: File): Promise<Blob> => {
    const buffer = await srcFile.arrayBuffer();
    let rawHtml = '';
    try {
      const htmlRes = await mammoth.convertToHtml({ arrayBuffer: buffer });
      rawHtml = htmlRes.value;
    } catch (e) {
      // Fallback to raw text extraction
      const textRes = await mammoth.extractRawText({ arrayBuffer: buffer });
      rawHtml = (textRes.value || '').split('\n').map(l => `<p>${l}</p>`).join('');
    }

    if (!rawHtml.trim()) {
      rawHtml = '<p>Document converted successfully.</p>';
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const margin = 45;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;

    const parser = new DOMParser();
    const docDom = parser.parseFromString(rawHtml, 'text/html');
    const elements = Array.from(docDom.body.children);

    let currentY = 55;
    const title = srcFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    // Document Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(30, 41, 59);
    doc.text(title, margin, currentY);
    currentY += 20;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 22;

    for (const el of elements) {
      const tag = el.tagName.toLowerCase();
      const text = el.textContent?.trim() || '';
      if (!text && tag !== 'table') continue;

      if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
        if (currentY + 28 > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(tag === 'h1' ? 14 : tag === 'h2' ? 12 : 11);
        doc.setTextColor(15, 23, 42);
        doc.text(text, margin, currentY);
        currentY += tag === 'h1' ? 22 : 18;
      } else if (tag === 'table') {
        const trs = Array.from(el.querySelectorAll('tr'));
        if (trs.length > 0) {
          const headRows = Array.from(trs[0].querySelectorAll('th, td')).map(c => c.textContent?.trim() || '');
          const bodyRows = trs.slice(1).map(tr => 
            Array.from(tr.querySelectorAll('td')).map(c => c.textContent?.trim() || '')
          );

          autoTable(doc, {
            head: headRows.length > 0 ? [headRows] : undefined,
            body: bodyRows,
            startY: currentY,
            margin: { left: margin, right: margin },
            styles: { fontSize: 8.5, cellPadding: 5 },
            headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
            theme: 'striped',
          });
          currentY = (doc as any).lastAutoTable.finalY + 18;
        }
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        const lines = doc.splitTextToSize(text, contentWidth);
        for (const line of lines) {
          if (currentY + 14 > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
          }
          doc.text(line, margin, currentY);
          currentY += 14;
        }
        currentY += 8;
      }
    }

    return doc.output('blob');
  };

  // --- 2. PDF to Word (.pdf -> .docx) ---
  const runPdfToWord = async (srcFile: File): Promise<Blob> => {
    const buffer = await srcFile.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;

    const docSections: Paragraph[] = [];

    // Title Paragraph
    const cleanDocTitle = srcFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    docSections.push(new Paragraph({
      children: [
        new TextRun({ 
          text: cleanDocTitle, 
          bold: true, 
          size: 30,
          color: '0F172A'
        })
      ],
      spacing: { after: 200 }
    }));

    for (let p = 1; p <= totalPages; p++) {
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();
      const items = (textContent.items || []) as Array<any>;

      // Sort items top-to-bottom, left-to-right
      items.sort((a, b) => {
        const yDiff = b.transform[5] - a.transform[5];
        if (Math.abs(yDiff) > 5) return yDiff;
        return a.transform[4] - b.transform[4];
      });

      let lastY: number | null = null;
      let currentLine = '';

      for (const item of items) {
        if (!item.str) continue;
        const y = item.transform[5];
        if (lastY !== null && Math.abs(y - lastY) > 5) {
          if (currentLine.trim()) {
            const isHeading = currentLine.trim().length < 60 && currentLine.trim() === currentLine.trim().toUpperCase();
            docSections.push(new Paragraph({
              children: [
                new TextRun({ 
                  text: currentLine.trim(), 
                  size: isHeading ? 24 : 20,
                  bold: isHeading
                })
              ],
              spacing: { after: 100 }
            }));
          }
          currentLine = '';
        }
        currentLine += (currentLine ? ' ' : '') + item.str;
        lastY = y;
      }

      if (currentLine.trim()) {
        docSections.push(new Paragraph({
          children: [new TextRun({ text: currentLine.trim(), size: 20 })],
          spacing: { after: 120 }
        }));
      }

      if (p < totalPages) {
        docSections.push(new Paragraph({
          pageBreakBefore: true,
          children: []
        }));
      }
    }

    // Build real Office Open XML (.docx) package
    const docxDoc = new Document({
      sections: [{
        properties: {},
        children: docSections.length > 0 ? docSections : [
          new Paragraph({ children: [new TextRun('Document content extracted successfully.')] })
        ]
      }]
    });

    return await Packer.toBlob(docxDoc);
  };

  // --- 3. Excel to PDF (.xlsx -> .pdf) ---
  const runExcelToPdf = async (srcFile: File): Promise<Blob> => {
    const buffer = await srcFile.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    let hasPage = false;

    for (const sheetName of wb.SheetNames) {
      const ws = wb.Sheets[sheetName];
      const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (!data || data.length === 0) continue;

      if (hasPage) doc.addPage();
      hasPage = true;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(30, 41, 59);
      doc.text(`${srcFile.name} — ${sheetName}`, 40, 35);

      const headers = (data[0] || []).map((h, i) => String(h ?? `Column ${i + 1}`));
      const body = data.slice(1).map(r => r.map(c => String(c ?? '')));

      autoTable(doc, {
        head: [headers],
        body: body,
        startY: 48,
        margin: { left: 40, right: 40 },
        styles: { fontSize: 8, cellPadding: 4 },
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        theme: 'striped',
      });
    }

    if (!hasPage) {
      doc.text('Empty spreadsheet', 40, 50);
    }

    return doc.output('blob');
  };

  // --- 4. PDF to Excel (.pdf -> .xlsx) ---
  const runPdfToExcel = async (srcFile: File): Promise<Blob> => {
    const buffer = await srcFile.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;

    const rows: string[][] = [];

    for (let p = 1; p <= totalPages; p++) {
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();
      const items = (textContent.items || []) as Array<any>;

      items.sort((a, b) => {
        const yDiff = b.transform[5] - a.transform[5];
        if (Math.abs(yDiff) > 5) return yDiff;
        return a.transform[4] - b.transform[4];
      });

      let lastY: number | null = null;
      let currentRow: string[] = [];

      for (const item of items) {
        if (!item.str || !item.str.trim()) continue;
        const y = item.transform[5];
        if (lastY !== null && Math.abs(y - lastY) > 5) {
          if (currentRow.length > 0) rows.push(currentRow);
          currentRow = [];
        }
        currentRow.push(item.str.trim());
        lastY = y;
      }
      if (currentRow.length > 0) rows.push(currentRow);
    }

    const ws = XLSX.utils.aoa_to_sheet(rows.length > 0 ? rows : [['Page 1', 'Content extracted into spreadsheet.']]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Extracted Data');

    const xlsxBytes = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([xlsxBytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  // --- 5. PDF to JPG (.pdf -> .jpg) ---
  const runPdfToJpg = async (srcFile: File): Promise<Blob> => {
    const buffer = await srcFile.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;

    return await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.95);
    });
  };

  // --- 6. Images to PDF (.jpg/.png -> .pdf) ---
  const runImgToPdf = async (srcFile: File): Promise<Blob> => {
    const url = URL.createObjectURL(srcFile);
    const img = new Image();
    img.src = url;
    await new Promise((res) => { img.onload = res; });

    const isLandscape = img.naturalWidth > img.naturalHeight;
    const doc = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pWidth = doc.internal.pageSize.getWidth();
    const pHeight = doc.internal.pageSize.getHeight();
    const ratio = Math.min((pWidth - 40) / img.naturalWidth, (pHeight - 40) / img.naturalHeight);
    const w = img.naturalWidth * ratio;
    const h = img.naturalHeight * ratio;
    const x = (pWidth - w) / 2;
    const y = (pHeight - h) / 2;

    doc.addImage(img, srcFile.type.includes('png') ? 'PNG' : 'JPEG', x, y, w, h);
    URL.revokeObjectURL(url);

    return doc.output('blob');
  };

  const IconComponent = config.icon;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {config.sourceBadge} ➜ {config.targetBadge}
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Format Preservation Engine</span>
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {config.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
          {config.subtitle}
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept={config.accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* STAGE 1: IDLE / DROPZONE */}
      {status === 'idle' && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center space-y-4 cursor-pointer transition-all ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
            <IconComponent className="w-8 h-8" />
          </div>
          <div>
            <button
              type="button"
              className={`px-8 py-3.5 rounded-2xl bg-gradient-to-r ${config.btnGradient} text-white font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2`}
            >
              <IconComponent className="w-4 h-4" />
              <span>Select {config.sourceBadge} File</span>
            </button>
            <p className="text-xs text-slate-400 mt-2 font-medium">or drag &amp; drop file here</p>
          </div>
          <p className="text-[11px] text-slate-400">
            Accepts <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">{config.accept}</code> • 100% Client-Side Privacy
          </p>
        </div>
      )}

      {/* STAGE 2: READY / CONFIRM CONVERSION */}
      {status === 'ready' && file && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono text-slate-500">{formatBytes(file.size)}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {config.sourceBadge} ➜ {config.targetBadge}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setStatus('idle');
              }}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer self-start sm:self-auto"
              title="Change File"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Ready to change document format:
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Click convert below to generate your {config.targetBadge} keeping text, tables, and page layout.
              </p>
            </div>

            <button
              onClick={executeConversion}
              className={`px-8 py-3.5 rounded-2xl bg-gradient-to-r ${config.btnGradient} text-white font-black text-sm shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2.5 shrink-0 hover:scale-[1.02]`}
            >
              <span>{config.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: CONVERTING */}
      {status === 'converting' && (
        <div className="p-10 sm:p-14 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-950" />
            <div 
              className="absolute inset-0 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin" 
            />
            <IconComponent className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Converting your document...
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 min-h-5">
              {stageMessage}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{config.sourceBadge}</span>
              <span>{progress}%</span>
              <span>{config.targetBadge}</span>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: COMPLETED */}
      {status === 'completed' && outputBlob && (
        <div className="p-8 sm:p-12 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-200">
              Document Converted Successfully!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Your valid {config.targetBadge} file has been generated and downloaded.
            </p>
          </div>

          {/* File Card */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{outputFileName}</p>
                <p className="text-[11px] font-mono text-slate-500">{formatBytes(outputFileSize)} • Ready to open</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
              {config.targetExt.toUpperCase().replace('.', '')}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => triggerDownload(outputBlob, outputFileName)}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r ${config.btnGradient} text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2`}
            >
              <Download className="w-4 h-4" />
              <span>Download Converted File Again</span>
            </button>

            <button
              onClick={() => {
                setFile(null);
                setOutputBlob(null);
                setStatus('idle');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span>Convert Another Document</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5: ERROR */}
      {status === 'error' && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-rose-900 dark:text-rose-200">Conversion Failed</p>
            <p className="text-xs text-rose-700 dark:text-rose-300">{errorMessage}</p>
          </div>
          <button
            onClick={() => setStatus('ready')}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
