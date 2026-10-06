import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PdfReportField {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface PdfTableData {
  head: string[];
  body: (string | number)[][];
}

export interface PdfReportOptions {
  title: string;
  subtitle?: string;
  category: 'tax' | 'loan' | 'zakat' | 'investment' | 'discount';
  referenceId?: string;
  summaryCards: {
    title: string;
    value: string;
    subtitle?: string;
    type?: 'primary' | 'secondary' | 'neutral' | 'accent';
  }[];
  inputParameters: PdfReportField[];
  detailedTables?: {
    title: string;
    head: string[];
    body: (string | number)[][];
    notes?: string;
  }[];
  notesAndDisclaimers?: string[];
  filename?: string;
}

// Format date timestamp
function getFormattedDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Generate random verification reference
function generateReference(prefix: string): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `QT-${prefix.toUpperCase()}-${rand}`;
}

type RGB = [number, number, number];

interface ThemeColors {
  primary: RGB;
  dark: RGB;
  light: RGB;
  border: RGB;
}

// Category theme colors [R, G, B]
const colorMap: Record<string, ThemeColors> = {
  tax: { primary: [225, 29, 72], dark: [159, 18, 57], light: [255, 241, 242], border: [254, 205, 211] }, // Rose
  loan: { primary: [79, 70, 229], dark: [55, 48, 163], light: [238, 242, 255], border: [199, 210, 254] }, // Indigo
  zakat: { primary: [5, 150, 105], dark: [4, 120, 87], light: [236, 253, 245], border: [167, 243, 208] }, // Emerald
  investment: { primary: [13, 148, 136], dark: [15, 118, 110], light: [240, 253, 250], border: [153, 246, 228] }, // Teal
  discount: { primary: [217, 119, 6], dark: [180, 83, 9], light: [254, 243, 199], border: [253, 230, 138] }, // Amber
};

export function generatePdfReport(options: PdfReportOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const theme = colorMap[options.category] || colorMap.tax;
  const refCode = options.referenceId || generateReference(options.category.slice(0, 3));
  const generatedAt = getFormattedDate();

  let currentY = margin;

  // 1. TOP BRAND HEADER BAR
  doc.setFillColor(theme.dark[0], theme.dark[1], theme.dark[2]);
  doc.rect(margin, currentY, contentWidth, 22, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('QUICKTOOLS', margin + 6, currentY + 9);

  // Brand Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(230, 230, 230);
  doc.text('Financial & Mathematical Precision Engine', margin + 6, currentY + 15);

  // Right-side Verification & Ref
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`REF: ${refCode}`, pageWidth - margin - 6, currentY + 9, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(230, 230, 230);
  doc.text(`Generated: ${generatedAt}`, pageWidth - margin - 6, currentY + 15, { align: 'right' });

  currentY += 26;

  // 2. REPORT TITLE & SUBTITLE
  doc.setTextColor(24, 32, 47);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(options.title, margin, currentY);
  currentY += 5;

  if (options.subtitle) {
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(options.subtitle, margin, currentY);
    currentY += 6;
  } else {
    currentY += 2;
  }

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  // 3. EXECUTIVE SUMMARY CARDS
  const cardCount = options.summaryCards.length;
  if (cardCount > 0) {
    const cardGap = 3.5;
    const cardWidth = (contentWidth - (cardCount - 1) * cardGap) / cardCount;
    const cardHeight = 22;

    options.summaryCards.forEach((card, idx) => {
      const cardX = margin + idx * (cardWidth + cardGap);

      // Card Background
      if (card.type === 'primary') {
        doc.setFillColor(theme.light[0], theme.light[1], theme.light[2]);
        doc.setDrawColor(theme.border[0], theme.border[1], theme.border[2]);
      } else {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
      }
      doc.setLineWidth(0.3);
      doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 2, 2, 'FD');

      // Card Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      if (card.type === 'primary') {
        doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
      } else {
        doc.setTextColor(100, 116, 139);
      }
      doc.text(card.title.toUpperCase(), cardX + 3.5, currentY + 5.5);

      // Card Value
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(card.value.length > 18 ? 9 : 11);
      if (card.type === 'primary') {
        doc.setTextColor(theme.dark[0], theme.dark[1], theme.dark[2]);
      } else {
        doc.setTextColor(15, 23, 42);
      }
      doc.text(card.value, cardX + 3.5, currentY + 12.5);

      // Card Subtitle (if any)
      if (card.subtitle) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(card.subtitle, cardX + 3.5, currentY + 17.5);
      }
    });

    currentY += cardHeight + 6;
  }

  // 4. INPUT PARAMETERS (2-COLUMN KEY-VALUE TABLE)
  if (options.inputParameters && options.inputParameters.length > 0) {
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Assessment & Calculation Inputs', margin, currentY);
    currentY += 3;

    const paramRows: string[][] = [];
    const params = options.inputParameters;
    for (let i = 0; i < params.length; i += 2) {
      const p1 = params[i];
      const p2 = params[i + 1];
      paramRows.push([
        p1.label,
        p1.value,
        p2 ? p2.label : '',
        p2 ? p2.value : '',
      ]);
    }

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Parameter', 'Input Value', 'Parameter', 'Input Value']],
      body: paramRows,
      theme: 'grid',
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [51, 65, 85],
        fontStyle: 'bold',
        fontSize: 7.5,
        cellPadding: 2,
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [71, 85, 105], cellWidth: 38 },
        1: { fontStyle: 'bold', cellWidth: 53 },
        2: { fontStyle: 'bold', textColor: [71, 85, 105], cellWidth: 38 },
        3: { fontStyle: 'bold', cellWidth: 53 },
      },
    });

    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  }

  // 5. DETAILED CALCULATION TABLES
  if (options.detailedTables && options.detailedTables.length > 0) {
    options.detailedTables.forEach((table) => {
      if (currentY > pageHeight - 65) {
        doc.addPage();
        currentY = margin + 5;
      }

      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(table.title, margin, currentY);
      currentY += 3;

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [table.head],
        body: table.body,
        theme: 'striped',
        headStyles: {
          fillColor: theme.dark,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 7.5,
          cellPadding: 2.2,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        styles: {
          fontSize: 7.2,
          cellPadding: 2,
          textColor: [30, 41, 59],
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
      });

      currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 3;

      if (table.notes) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(6.8);
        doc.setTextColor(100, 116, 139);
        doc.text(table.notes, margin, currentY);
        currentY += 5;
      } else {
        currentY += 3;
      }
    });
  }

  // 6. NOTES & REGULATORY DISCLAIMERS
  const disclaimers = options.notesAndDisclaimers || [
    'This report is generated for informational and computational estimation purposes by QuickTools.',
    'Please verify with an accredited tax professional or financial advisor before official filing.',
  ];

  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = margin + 5;
  }

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  const noteBoxHeight = Math.min(26, 8 + disclaimers.length * 3.5);
  doc.roundedRect(margin, currentY, contentWidth, noteBoxHeight, 2, 2, 'FD');

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Regulatory Notes & Authenticity Disclaimer:', margin + 3.5, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  let noteY = currentY + 8.5;
  disclaimers.forEach((note) => {
    doc.text(`* ${note}`, margin + 3.5, noteY);
    noteY += 3.5;
  });

  // 7. FOOTER WITH PAGE NUMBERS
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'QuickTools Online Calculations - Official Report Export - https://quicktoolsonline.vercel.app',
      margin,
      pageHeight - 6
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 6,
      { align: 'right' }
    );
  }

  const filename = options.filename || `QuickTools_${options.category}_report_${Date.now()}.pdf`;
  doc.save(filename);
}

export function triggerPrintWindow(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
