import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Files, 
  Scissors, 
  FileArchive, 
  Image as ImageIcon, 
  Download, 
  Trash2, 
  Plus, 
  ArrowUpDown, 
  Check, 
  AlertCircle,
  FileCode,
  Sparkles,
  RefreshCw,
  Copy,
  Table as TableIcon,
  FileSpreadsheet,
  FileType,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import { DocumentConverterEngine } from './DocumentConverterEngine';

// Configure Mozilla PDF.js worker for client-side execution
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

export type PdfMode = 
  | 'merge' 
  | 'split' 
  | 'wordToPdf' 
  | 'pdfToWord' 
  | 'excelToPdf' 
  | 'pdfToExcel' 
  | 'pdfToJpg' 
  | 'imgToPdf' 
  | 'textToPdf' 
  | 'compress';

interface PdfSuiteToolProps {
  defaultMode?: PdfMode;
}

export function PdfSuiteTool({ defaultMode = 'merge' }: PdfSuiteToolProps) {
  const [activeTab, setActiveTab] = useState<PdfMode>(defaultMode);

  // --- MERGE STATE ---
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeSuccess, setMergeSuccess] = useState<string | null>(null);

  // --- SPLIT STATE ---
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitPageCount, setSplitPageCount] = useState<number>(0);
  const [splitRange, setSplitRange] = useState<string>('1');
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitError, setSplitError] = useState<string | null>(null);

  // --- WORD TO PDF STATE ---
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [wordHtmlPreview, setWordHtmlPreview] = useState<string>('');
  const [wordRawText, setWordRawText] = useState<string>('');
  const [isConvertingWord, setIsConvertingWord] = useState(false);
  const [wordPageOrientation, setWordPageOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // --- PDF TO WORD STATE ---
  const [pdfForWordFile, setPdfForWordFile] = useState<File | null>(null);
  const [pdfExtractedText, setPdfExtractedText] = useState<string>('');
  const [isExtractingPdfToWord, setIsExtractingPdfToWord] = useState(false);
  const [pdfWordReady, setPdfWordReady] = useState(false);

  // --- EXCEL TO PDF STATE ---
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelSheets, setExcelSheets] = useState<{ name: string; data: (string | number)[][] }[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState<number>(0);
  const [isConvertingExcel, setIsConvertingExcel] = useState(false);

  // --- PDF TO EXCEL STATE ---
  const [pdfForExcelFile, setPdfForExcelFile] = useState<File | null>(null);
  const [extractedTableData, setExtractedTableData] = useState<string[][]>([]);
  const [isConvertingPdfToExcel, setIsConvertingPdfToExcel] = useState(false);
  const [pdfExcelReady, setPdfExcelReady] = useState(false);

  // --- PDF TO JPG STATE ---
  const [pdfForJpgFile, setPdfForJpgFile] = useState<File | null>(null);
  const [pdfPageCountForJpg, setPdfPageCountForJpg] = useState<number>(0);
  const [renderedJpgPages, setRenderedJpgPages] = useState<Array<{ pageNum: number; dataUrl: string; width: number; height: number }>>([]);
  const [selectedJpgPage, setSelectedJpgPage] = useState<number>(1);
  const [isConvertingPdfToJpg, setIsConvertingPdfToJpg] = useState(false);
  const [jpgSuccessMessage, setJpgSuccessMessage] = useState<string | null>(null);

  // --- IMAGES TO PDF STATE ---
  const [imageFiles, setImageFiles] = useState<{ file: File; preview: string }[]>([]);
  const [pageOrientation, setPageOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [imageMargin, setImageMargin] = useState<number>(10);
  const [isConvertingImages, setIsConvertingImages] = useState(false);

  // --- TEXT TO PDF STATE ---
  const [textDocTitle, setTextDocTitle] = useState('My Document');
  const [textDocContent, setTextDocContent] = useState(
`# Official Project Summary & Overview

Welcome to QuickTools Document Engine. Type, edit, or paste contracts, reports, or invoices here.

Key Advantages:
1. 100% In-Browser & Private: No documents are ever uploaded to any external server.
2. Clean A4 Typography: Standard margins, crisp vector rendering, and zero watermarks.
3. Fast & Free: Convert unlimited documents directly on your device.`
  );
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

  // --- COMPRESS STATE ---
  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressResult, setCompressResult] = useState<{ origSize: number; newSize: number; savedPercent: number } | null>(null);

  // File Inputs
  const mergeInputRef = useRef<HTMLInputElement>(null);
  const splitInputRef = useRef<HTMLInputElement>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);
  const pdfToWordInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const pdfToExcelInputRef = useRef<HTMLInputElement>(null);
  const pdfToJpgInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const compressInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // --- 1. MERGE LOGIC ---
  const handleMergeFilesAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      setMergeFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeMergeFile = (index: number) => {
    setMergeFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveMergeFile = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === mergeFiles.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...mergeFiles];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setMergeFiles(updated);
  };

  const executeMerge = async () => {
    if (mergeFiles.length < 2) return;
    setIsMerging(true);
    setMergeSuccess(null);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of mergeFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QuickTools_Merged_${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setMergeSuccess('PDFs merged and downloaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Error merging PDFs. Please ensure valid unencrypted PDF files.');
    } finally {
      setIsMerging(false);
    }
  };

  // --- 2. SPLIT LOGIC ---
  const handleSplitFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSplitFile(file);
      setSplitError(null);
      try {
        const buffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const count = pdf.getPageCount();
        setSplitPageCount(count);
        setSplitRange(count > 1 ? `1-${Math.min(count, 3)}` : '1');
      } catch (err) {
        console.error(err);
        setSplitError('Failed to read PDF. It might be password protected.');
      }
    }
  };

  const executeSplit = async () => {
    if (!splitFile || splitPageCount === 0) return;
    setIsSplitting(true);
    setSplitError(null);
    try {
      const pagesToExtract: number[] = [];
      const parts = splitRange.split(',').map(s => s.trim());
      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
              if (i >= 1 && i <= splitPageCount) pagesToExtract.push(i - 1);
            }
          }
        } else {
          const p = parseInt(part, 10);
          if (!isNaN(p) && p >= 1 && p <= splitPageCount) {
            pagesToExtract.push(p - 1);
          }
        }
      }

      const uniquePages = Array.from(new Set(pagesToExtract)).sort((a, b) => a - b);
      if (uniquePages.length === 0) {
        setSplitError(`Invalid page range. Valid pages: 1 to ${splitPageCount}`);
        setIsSplitting(false);
        return;
      }

      const buffer = await splitFile.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(srcPdf, uniquePages);
      copiedPages.forEach(p => newPdf.addPage(p));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QuickTools_Split_${splitRange.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setSplitError('An error occurred while splitting the PDF.');
    } finally {
      setIsSplitting(false);
    }
  };

  // --- 3. WORD TO PDF LOGIC (.docx -> PDF) ---
  const handleWordFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setWordFile(file);
      try {
        const buffer = await file.arrayBuffer();
        const htmlRes = await mammoth.convertToHtml({ arrayBuffer: buffer });
        const rawRes = await mammoth.extractRawText({ arrayBuffer: buffer });
        setWordHtmlPreview(htmlRes.value || '<p>Document converted successfully</p>');
        setWordRawText(rawRes.value || '');
      } catch (err) {
        console.error('Word extraction error:', err);
        setWordHtmlPreview('<p class="text-rose-500">Could not extract Word file content. Please ensure unencrypted .docx format.</p>');
      }
    }
  };

  const executeWordToPdf = () => {
    if (!wordFile || !wordRawText.trim()) return;
    setIsConvertingWord(true);
    try {
      const doc = new jsPDF({
        orientation: wordPageOrientation,
        unit: 'pt',
        format: 'a4'
      });

      const margin = 45;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxLineWidth = pageWidth - margin * 2;

      // Header branding
      doc.setFillColor(79, 70, 229);
      doc.rect(margin, 35, 10, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(79, 70, 229);
      doc.text('QuickTools Document Converter', margin + 15, 43);

      // Document Title
      const title = wordFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text(title, margin, 70);

      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 82, pageWidth - margin, 82);

      // Paragraph lines
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(51, 65, 85);

      const paragraphs = wordRawText.split(/\n+/);
      let currentY = 105;
      const lineHeight = 15;

      for (const para of paragraphs) {
        if (!para.trim()) continue;
        const lines = doc.splitTextToSize(para.trim(), maxLineWidth);
        
        for (const line of lines) {
          if (currentY + lineHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin + 20;
          }
          doc.text(line, margin, currentY);
          currentY += lineHeight;
        }
        currentY += 8; // Paragraph spacing
      }

      const outName = `${wordFile.name.replace(/\.[^/.]+$/, '')}_QuickTools.pdf`;
      doc.save(outName);
    } catch (err) {
      console.error(err);
      alert('Error creating PDF from Word document.');
    } finally {
      setIsConvertingWord(false);
    }
  };

  // --- 4. PDF TO WORD LOGIC (.pdf -> .doc / .docx) ---
  const handlePdfToWordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfForWordFile(file);
      setIsExtractingPdfToWord(true);
      setPdfWordReady(false);
      setPdfExtractedText('');
      try {
        const buffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        let fullDocumentText = '';

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const items = (textContent.items || []) as Array<any>;

          // Sort items top-to-bottom (Y descending in PDF), then left-to-right (X ascending)
          items.sort((a, b) => {
            const yDiff = b.transform[5] - a.transform[5];
            if (Math.abs(yDiff) > 5) return yDiff;
            return a.transform[4] - b.transform[4];
          });

          let pageText = '';
          let lastY: number | null = null;
          let lastHeight: number = 10;

          for (const item of items) {
            const str = item.str;
            if (str === undefined || str === null) continue;
            const currentY = item.transform[5];
            const currentHeight = Math.abs(item.transform[3]) || 10;

            if (lastY !== null) {
              const diffY = Math.abs(currentY - lastY);
              if (diffY > Math.max(lastHeight, 8) * 1.5) {
                pageText += '\n\n'; // New paragraph
              } else if (diffY > 4) {
                pageText += '\n'; // Line break
              } else {
                pageText += ' '; // Word space on same line
              }
            }
            pageText += str;
            lastY = currentY;
            lastHeight = currentHeight;
          }

          if (pageText.trim()) {
            if (fullDocumentText) {
              fullDocumentText += `\n\n--- Page ${pageNum} ---\n\n`;
            }
            fullDocumentText += pageText.trim();
          }
        }

        if (!fullDocumentText.trim()) {
          fullDocumentText = `Document loaded (${totalPages} page${totalPages > 1 ? 's' : ''}), but no text streams were found. If this is a scanned image, please ensure it has embedded OCR text.`;
        }

        setPdfExtractedText(fullDocumentText);
        setPdfWordReady(true);
      } catch (err) {
        console.error('PDF to Word extraction error:', err);
        setPdfExtractedText('Could not extract text. File might be password-protected or corrupted.');
      } finally {
        setIsExtractingPdfToWord(false);
      }
    }
  };

  const executeDownloadWordDoc = () => {
    if (!pdfForWordFile || !pdfExtractedText.trim()) return;

    // Convert extracted paragraphs into Word HTML with styles & page headers
    const rawParas = pdfExtractedText.split('\n\n');
    const parasHtml = rawParas.map(p => {
      if (p.startsWith('--- Page ')) {
        return `<div class="page-break"></div><div class="page-header">${p}</div>`;
      }
      return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('');

    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${pdfForWordFile.name}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Calibri', 'Segoe UI', 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; padding: 40px; }
          h1 { font-size: 20pt; color: #0f172a; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-bottom: 16px; }
          .header-meta { font-size: 9pt; color: #64748b; margin-bottom: 24px; }
          p { margin-bottom: 12pt; text-align: justify; }
          .page-header { font-size: 10pt; font-weight: bold; color: #4f46e5; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 24px 0 12px 0; }
          .page-break { page-break-after: always; }
        </style>
      </head>
      <body>
        <h1>${pdfForWordFile.name.replace(/\.[^/.]+$/, '')}</h1>
        <div class="header-meta">Converted via QuickTools In-Browser PDF Studio • 100% Client-Side Privacy</div>
        ${parasHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuickTools_${pdfForWordFile.name.replace(/\.[^/.]+$/, '')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- 5. EXCEL TO PDF LOGIC (.xlsx / .csv -> PDF) ---
  const handleExcelFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setExcelFile(file);
      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetsData = workbook.SheetNames.map(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const json: (string | number)[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          return { name: sheetName, data: json };
        });
        setExcelSheets(sheetsData);
        setSelectedSheetIndex(0);
      } catch (err) {
        console.error('Error parsing excel:', err);
        alert('Could not read Excel file. Please ensure a valid .xlsx, .xls, or .csv file.');
      }
    }
  };

  const executeExcelToPdf = () => {
    if (!excelFile || excelSheets.length === 0) return;
    setIsConvertingExcel(true);
    try {
      const sheet = excelSheets[selectedSheetIndex];
      const rows = sheet.data;
      if (!rows || rows.length === 0) {
        alert('Selected sheet contains no rows.');
        setIsConvertingExcel(false);
        return;
      }

      // First row as header, remaining as body
      const rawHeader = rows[0] || [];
      const headers = rawHeader.map((h, i) => String(h || `Col ${i + 1}`));
      const body = rows.slice(1).map(r => r.map(c => String(c ?? '')));

      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text(`${excelFile.name} - Sheet: ${sheet.name}`, 40, 35);
      
      autoTable(doc, {
        head: [headers],
        body: body,
        startY: 50,
        styles: { fontSize: 8, cellPadding: 4 },
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        theme: 'striped',
      });

      doc.save(`QuickTools_${excelFile.name.replace(/\.[^/.]+$/, '')}_${sheet.name}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error exporting Excel to PDF.');
    } finally {
      setIsConvertingExcel(false);
    }
  };

  // --- 6. PDF TO EXCEL LOGIC (.pdf -> .xlsx) ---
  const handlePdfToExcelChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfForExcelFile(file);
      setIsConvertingPdfToExcel(true);
      setPdfExcelReady(false);
      setExtractedTableData([]);
      try {
        const buffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        const tableRows: string[][] = [];

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const items = (textContent.items || []) as Array<any>;

          // Sort items by Y descending (top to bottom)
          items.sort((a, b) => {
            const yDiff = b.transform[5] - a.transform[5];
            if (Math.abs(yDiff) > 5) return yDiff;
            return a.transform[4] - b.transform[4];
          });

          // Cluster into rows by similar Y
          const rowsByY: Array<Array<any>> = [];
          let currentRow: Array<any> = [];
          let lastY: number | null = null;

          for (const item of items) {
            if (!item.str || !item.str.trim()) continue;
            const currentY = item.transform[5];
            if (lastY === null || Math.abs(currentY - lastY) <= 5) {
              currentRow.push(item);
            } else {
              if (currentRow.length > 0) rowsByY.push(currentRow);
              currentRow = [item];
            }
            lastY = currentY;
          }
          if (currentRow.length > 0) rowsByY.push(currentRow);

          // For each row, sort by X and separate columns
          for (const rowItems of rowsByY) {
            rowItems.sort((a, b) => a.transform[4] - b.transform[4]);
            const cells: string[] = [];
            for (const it of rowItems) {
              const text = it.str.trim();
              if (text.includes('\t')) {
                cells.push(...text.split('\t').map((s: string) => s.trim()));
              } else if (text.includes('  ')) {
                cells.push(...text.split(/\s{2,}/).map((s: string) => s.trim()));
              } else {
                cells.push(text);
              }
            }
            if (cells.length > 0) {
              tableRows.push(cells);
            }
          }
        }

        if (tableRows.length > 0) {
          const maxCols = Math.max(...tableRows.map(r => r.length));
          const normalizedRows = tableRows.map(row => {
            const padded = [...row];
            while (padded.length < maxCols) padded.push('');
            return padded;
          });
          setExtractedTableData(normalizedRows);
          setPdfExcelReady(true);
        } else {
          setExtractedTableData([['Page 1', 'No structured tabular rows detected in document.']]);
          setPdfExcelReady(true);
        }
      } catch (err) {
        console.error('PDF to Excel parse error:', err);
        alert('Could not parse PDF for spreadsheet conversion.');
      } finally {
        setIsConvertingPdfToExcel(false);
      }
    }
  };

  const executeDownloadExcelSpreadsheet = () => {
    if (!pdfForExcelFile || extractedTableData.length === 0) return;
    const ws = XLSX.utils.aoa_to_sheet(extractedTableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Extracted Data');
    XLSX.writeFile(wb, `QuickTools_${pdfForExcelFile.name.replace(/\.[^/.]+$/, '')}.xlsx`);
  };

  // --- 7. PDF TO JPG LOGIC (.pdf -> .jpg) ---
  const handlePdfToJpgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfForJpgFile(file);
      setJpgSuccessMessage(null);
      setIsConvertingPdfToJpg(true);
      setRenderedJpgPages([]);
      setSelectedJpgPage(1);

      try {
        const buffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        setPdfPageCountForJpg(totalPages);

        const pagesData: Array<{ pageNum: number; dataUrl: string; width: number; height: number }> = [];

        // Render each page with high-definition 1.5x scale
        const renderLimit = Math.min(totalPages, 20);
        for (let p = 1; p <= renderLimit; p++) {
          const page = await pdf.getPage(p);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({
              canvasContext: ctx,
              viewport: viewport
            }).promise;

            pagesData.push({
              pageNum: p,
              dataUrl: canvas.toDataURL('image/jpeg', 0.92),
              width: viewport.width,
              height: viewport.height
            });
          }
        }

        setRenderedJpgPages(pagesData);
        if (pagesData.length > 0) {
          setJpgSuccessMessage(`Rendered ${pagesData.length} page${pagesData.length > 1 ? 's' : ''} in high resolution! Click any page to preview or download.`);
        }
      } catch (err) {
        console.error('PDF to JPG render error:', err);
        alert('Could not render PDF pages to JPG images.');
      } finally {
        setIsConvertingPdfToJpg(false);
      }
    }
  };

  const executePdfToJpgDownload = async (pageIdx?: number) => {
    if (!pdfForJpgFile || renderedJpgPages.length === 0) return;

    if (pageIdx !== undefined && renderedJpgPages[pageIdx]) {
      // Download single page
      const page = renderedJpgPages[pageIdx];
      const link = document.createElement('a');
      link.download = `QuickTools_${pdfForJpgFile.name.replace(/\.[^/.]+$/, '')}_Page_${page.pageNum}.jpg`;
      link.href = page.dataUrl;
      link.click();
    } else {
      // Download all pages sequentially
      for (let i = 0; i < renderedJpgPages.length; i++) {
        const page = renderedJpgPages[i];
        setTimeout(() => {
          const link = document.createElement('a');
          link.download = `QuickTools_${pdfForJpgFile.name.replace(/\.[^/.]+$/, '')}_Page_${page.pageNum}.jpg`;
          link.href = page.dataUrl;
          link.click();
        }, i * 350);
      }
      setJpgSuccessMessage(`Downloaded all ${renderedJpgPages.length} pages as high-resolution JPG images!`);
    }
  };

  // --- 8. IMAGES TO PDF LOGIC (JPG/PNG -> PDF) ---
  const handleImageFilesAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      const newItems = files.map(f => ({
        file: f,
        preview: URL.createObjectURL(f)
      }));
      setImageFiles(prev => [...prev, ...newItems]);
    }
  };

  const removeImageItem = (index: number) => {
    setImageFiles(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const executeImagesToPdf = async () => {
    if (imageFiles.length === 0) return;
    setIsConvertingImages(true);
    try {
      const doc = new jsPDF({
        orientation: pageOrientation,
        unit: 'mm',
        format: pageSize
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < imageFiles.length; i++) {
        if (i > 0) doc.addPage(pageSize, pageOrientation);
        const item = imageFiles[i];

        const img = new Image();
        img.src = item.preview;
        await new Promise(res => {
          img.onload = res;
          img.onerror = res;
        });

        const availW = pageWidth - imageMargin * 2;
        const availH = pageHeight - imageMargin * 2;
        const imgRatio = (img.width || 1) / (img.height || 1);
        const availRatio = availW / availH;

        let renderW = availW;
        let renderH = availH;
        if (imgRatio > availRatio) {
          renderW = availW;
          renderH = availW / imgRatio;
        } else {
          renderH = availH;
          renderW = availH * imgRatio;
        }

        const posX = imageMargin + (availW - renderW) / 2;
        const posY = imageMargin + (availH - renderH) / 2;
        const imgFormat = item.file.type.includes('png') ? 'PNG' : 'JPEG';
        doc.addImage(img, imgFormat, posX, posY, renderW, renderH);
      }

      doc.save(`QuickTools_Images_${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error creating PDF from images.');
    } finally {
      setIsConvertingImages(false);
    }
  };

  // --- 9. TEXT / NOTES TO PDF LOGIC ---
  const executeTextToPdf = () => {
    if (!textDocContent.trim()) return;
    setIsGeneratingDoc(true);
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxLineWidth = pageWidth - margin * 2;

      doc.setFillColor(79, 70, 229);
      doc.rect(margin, 35, 12, 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229);
      doc.text('QuickTools Document Engine', margin + 18, 45);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42);
      doc.text(textDocTitle || 'Untitled Document', margin, 75);

      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 88, pageWidth - margin, 88);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);

      const lines = doc.splitTextToSize(textDocContent, maxLineWidth);
      let currentY = 110;
      const lineHeight = 16;
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < lines.length; i++) {
        if (currentY + lineHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin + 20;
        }
        doc.text(lines[i], margin, currentY);
        currentY += lineHeight;
      }

      doc.save(`${(textDocTitle || 'Document').replace(/\s+/g, '_')}_QuickTools.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error generating document PDF.');
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  // --- 10. COMPRESS PDF LOGIC ---
  const handleCompressFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompressFile(e.target.files[0]);
      setCompressResult(null);
    }
  };

  const executeCompress = async () => {
    if (!compressFile) return;
    setIsCompressing(true);
    setCompressResult(null);
    try {
      const origSize = compressFile.size;
      const buffer = await compressFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
      const newSize = compressedBytes.length;
      const savedPercent = Math.max(0, Math.round(((origSize - newSize) / origSize) * 100));

      setCompressResult({ origSize, newSize, savedPercent });

      const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QuickTools_Compressed_${compressFile.name}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Could not compress this PDF. File may be encrypted or already optimized.');
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs font-bold">
              <Files className="w-3.5 h-3.5" />
              <span>Full-Featured In-Browser PDF Suite • Zero Uploads</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              PDF Studio: Word, Excel, JPG, Merge &amp; Split
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Convert Word to PDF, PDF to Word, Excel to PDF, PDF to Excel, PDF to JPG, and Merge/Split/Compress with 100% in-browser confidentiality.
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Zero Server Uploads</span>
            </span>
          </div>
        </div>

        {/* Tab Switcher - All High-Demand PDF Tools in One Glance */}
        <div className="mt-6 flex flex-wrap gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
          {[
            { id: 'merge', label: 'Merge PDF', icon: Files },
            { id: 'split', label: 'Split PDF', icon: Scissors },
            { id: 'wordToPdf', label: 'Word → PDF', icon: FileText },
            { id: 'pdfToWord', label: 'PDF → Word', icon: FileCode },
            { id: 'excelToPdf', label: 'Excel → PDF', icon: FileSpreadsheet },
            { id: 'pdfToExcel', label: 'PDF → Excel', icon: TableIcon },
            { id: 'pdfToJpg', label: 'PDF → JPG', icon: ImageIcon },
            { id: 'imgToPdf', label: 'JPG → PDF', icon: ImageIcon },
            { id: 'compress', label: 'Compress PDF', icon: FileArchive },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PdfMode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- TAB 1: MERGE PDF --- */}
      {activeTab === 'merge' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Merge Multiple PDF Files</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Combine 2 or more PDF documents into a single organized file in any order.</p>
            </div>
            <input 
              type="file" 
              accept=".pdf" 
              multiple 
              ref={mergeInputRef} 
              onChange={handleMergeFilesAdd} 
              className="hidden" 
            />
            <button
              onClick={() => mergeInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-red-200 dark:shadow-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add PDF Files</span>
            </button>
          </div>

          {mergeFiles.length === 0 ? (
            <div 
              onClick={() => mergeInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center space-y-3 cursor-pointer hover:border-red-500 hover:bg-red-50/20 dark:hover:bg-red-950/20 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                <Files className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Click to upload PDF files to merge</p>
              <p className="text-xs text-slate-400">Select two or more PDF files from your computer</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {mergeFiles.map((file, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                        <p className="text-[11px] text-slate-400">{formatBytes(file.size)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => moveMergeFile(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUpDown className="w-4 h-4 rotate-180" />
                      </button>
                      <button
                        onClick={() => moveMergeFile(idx, 'down')}
                        disabled={idx === mergeFiles.length - 1}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeMergeFile(idx)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {mergeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{mergeSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium text-slate-500">
                  {mergeFiles.length} file{mergeFiles.length > 1 ? 's' : ''} ready
                </span>
                <button
                  onClick={executeMerge}
                  disabled={isMerging || mergeFiles.length < 2}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-red-200 dark:shadow-none cursor-pointer flex items-center gap-2"
                >
                  {isMerging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{isMerging ? 'Merging Documents...' : 'Merge & Download PDF'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: SPLIT PDF --- */}
      {activeTab === 'split' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Split PDF &amp; Extract Specific Pages</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Extract individual pages or custom ranges (e.g. 1-4, 7, 9-12) into a fresh PDF.</p>
          </div>

          <input 
            type="file" 
            accept=".pdf" 
            ref={splitInputRef} 
            onChange={handleSplitFileChange} 
            className="hidden" 
          />

          {!splitFile ? (
            <div 
              onClick={() => splitInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center space-y-3 cursor-pointer hover:border-red-500 hover:bg-red-50/20 dark:hover:bg-red-950/20 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                <Scissors className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Click to upload a PDF file to split</p>
              <p className="text-xs text-slate-400">Select any PDF document</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{splitFile.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Total Pages: <strong className="text-red-600 dark:text-red-400">{splitPageCount}</strong> • {formatBytes(splitFile.size)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSplitFile(null);
                    setSplitPageCount(0);
                  }}
                  className="text-xs text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                >
                  Change File
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Pages to Extract (Range or Comma-Separated):
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={splitRange}
                    onChange={(e) => setSplitRange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8-10"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={executeSplit}
                    disabled={isSplitting}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-200 dark:shadow-none cursor-pointer flex items-center gap-2"
                  >
                    {isSplitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>{isSplitting ? 'Splitting...' : 'Extract & Download'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Example: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">1-2</code> extracts first 2 pages, or <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">1, 3, 5</code> extracts odd pages.
                </p>
              </div>

              {splitError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{splitError}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: WORD TO PDF (.docx -> PDF) --- */}
      {activeTab === 'wordToPdf' && (
        <DocumentConverterEngine type="wordToPdf" />
      )}

      {/* --- TAB 4: PDF TO WORD (.pdf -> .docx) --- */}
      {activeTab === 'pdfToWord' && (
        <DocumentConverterEngine type="pdfToWord" />
      )}

      {/* --- TAB 5: EXCEL TO PDF (.xlsx -> PDF) --- */}
      {activeTab === 'excelToPdf' && (
        <DocumentConverterEngine type="excelToPdf" />
      )}

      {/* --- TAB 6: PDF TO EXCEL (.pdf -> .xlsx) --- */}
      {activeTab === 'pdfToExcel' && (
        <DocumentConverterEngine type="pdfToExcel" />
      )}

      {/* --- TAB 7: PDF TO JPG --- */}
      {activeTab === 'pdfToJpg' && (
        <DocumentConverterEngine type="pdfToJpg" />
      )}

      {/* --- TAB 8: JPG TO PDF (Images to PDF) --- */}
      {activeTab === 'imgToPdf' && (
        <DocumentConverterEngine type="imgToPdf" />
      )}

      {/* --- TAB 9: COMPRESS PDF --- */}
      {activeTab === 'compress' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Compress &amp; Optimize PDF File Size</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Reduce PDF file weight by packing object streams and stripping redundant metadata.</p>
          </div>

          <input 
            type="file" 
            accept=".pdf" 
            ref={compressInputRef} 
            onChange={handleCompressFile} 
            className="hidden" 
          />

          {!compressFile ? (
            <div 
              onClick={() => compressInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center space-y-3 cursor-pointer hover:border-red-500 hover:bg-red-50/20 dark:hover:bg-red-950/20 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                <FileArchive className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Click to upload a PDF file to compress</p>
              <p className="text-xs text-slate-400">Clean client-side stream optimization</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{compressFile.name}</p>
                  <p className="text-[11px] text-slate-500">Current Size: <strong className="text-slate-800 dark:text-slate-200">{formatBytes(compressFile.size)}</strong></p>
                </div>
                <button
                  onClick={() => {
                    setCompressFile(null);
                    setCompressResult(null);
                  }}
                  className="text-xs text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                >
                  Change
                </button>
              </div>

              {compressResult && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Optimization Complete!</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Reduced from <span className="line-through">{formatBytes(compressResult.origSize)}</span> to{' '}
                    <strong className="text-emerald-700 dark:text-emerald-400">{formatBytes(compressResult.newSize)}</strong>{' '}
                    {compressResult.savedPercent > 0 ? `(${compressResult.savedPercent}% saved)` : '(already optimal)'}
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={executeCompress}
                  disabled={isCompressing}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-200 dark:shadow-none cursor-pointer flex items-center gap-2"
                >
                  {isCompressing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{isCompressing ? 'Compressing...' : 'Compress & Download PDF'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
