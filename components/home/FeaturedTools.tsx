import React, { useState } from 'react';
import { 
  Coins, 
  Receipt, 
  Landmark, 
  TrendingUp, 
  Percent, 
  Tag, 
  Files, 
  FileText, 
  FileCode, 
  FileSpreadsheet, 
  Table as TableIcon,
  HeartPulse, 
  Calendar, 
  Ruler, 
  ArrowLeftRight, 
  Image as ImageIcon, 
  Sliders, 
  Sparkles, 
  Type, 
  CaseSensitive, 
  KeyRound, 
  QrCode, 
  Fingerprint, 
  Braces, 
  Code2, 
  Terminal, 
  Pipette, 
  Palette, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { TOOLS_LIST } from '@/data/toolsData';

interface FeaturedToolsProps {
  onNavigate?: (href: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

interface ToolCardItem {
  name: string;
  description: string;
  href: string;
  badge: string;
  badgeStyle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  rank: number;
  features: string[];
  actionLabel: string;
  highlightTag?: string;
}

interface CategorySection {
  id: string;
  name: string;
  shortTitle: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  accentBg: string;
  accentText: string;
  borderColor: string;
  containerBg: string;
  headerBg: string;
  tools: ToolCardItem[];
}

const CATEGORY_SECTIONS: CategorySection[] = [
  // 1. FINANCIAL CALCULATORS (On Top)
  {
    id: 'financial',
    name: 'Financial & Tax Calculators',
    shortTitle: 'Financial',
    badge: 'FBR Slabs • Bullion Rates • Fiqh',
    description: 'High-precision financial calculators powered by official government tax slabs and live market bullion feeds.',
    icon: Coins,
    gradient: 'from-emerald-600 to-teal-700',
    accentBg: 'bg-emerald-100 dark:bg-emerald-950/80',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-300 dark:border-emerald-700/80',
    containerBg: 'bg-emerald-50/25 dark:bg-emerald-950/20',
    headerBg: 'bg-emerald-500/10 dark:bg-emerald-900/30',
    tools: [
      {
        name: 'Zakat Calculator',
        description: 'Authentic Islamic Zakat calculator compliant with classical Fiqh. Automatic Nisab for Gold (87.48g) & Silver (612.36g) in PKR & USD.',
        href: '/zakat-calculator',
        badge: 'NISAB & BULLION',
        badgeStyle: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300',
        icon: Coins,
        iconBg: 'bg-emerald-600 shadow-emerald-500/30',
        rank: 1,
        features: ['Gold 87.48g & Silver 612.36g', 'Live Bullion Rates', 'Tola & Grams'],
        actionLabel: 'Open Calculator',
        highlightTag: 'Official'
      },
      {
        name: 'Income Tax Calculator (Pakistan)',
        description: 'Official Pakistan FBR progressive tax calculator for salaried individuals. Supports latest FY 2025–26 & FY 2026–27 Finance Act slabs.',
        href: '/income-tax-calculator',
        badge: 'FBR FY 25–26 & 26–27',
        badgeStyle: 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300',
        icon: Receipt,
        iconBg: 'bg-rose-600 shadow-rose-500/30',
        rank: 2,
        features: ['Official FBR Slabs', 'Monthly Take-Home', 'Tax Thresholds'],
        actionLabel: 'Open Calculator',
        highlightTag: 'Tax Season'
      },
      {
        name: 'Loan & Car EMI Calculator',
        description: 'Plan home mortgages, car auto financing, and personal loans with complete monthly breakdown and amortization schedule.',
        href: '/loan-emi-calculator',
        badge: 'AMORTIZATION PLAN',
        badgeStyle: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300',
        icon: Landmark,
        iconBg: 'bg-indigo-600 shadow-indigo-500/30',
        rank: 3,
        features: ['Principal vs Interest', 'Full Amortization', 'Early Prepayment'],
        actionLabel: 'Open Calculator',
      },
      {
        name: 'Compound Interest Calculator',
        description: 'Forecast savings growth and compound wealth with monthly recurring deposits, variable returns, and yearly projections.',
        href: '/compound-interest',
        badge: 'WEALTH FORECAST',
        badgeStyle: 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300',
        icon: TrendingUp,
        iconBg: 'bg-teal-600 shadow-teal-500/30',
        rank: 4,
        features: ['Monthly Deposits', 'APY Compounding', 'Growth Curves'],
        actionLabel: 'Open Calculator',
      }
    ]
  },

  // 2. EVERYDAY MATH & FINANCE
  {
    id: 'math-everyday',
    name: 'Everyday Math & Shopping Calculators',
    shortTitle: 'Everyday Math',
    badge: '6-in-1 Math • Stacked Discounts',
    description: 'Everyday mathematical solvers for quick percentage computations, sale discounts, GST, and savings ratios.',
    icon: Percent,
    gradient: 'from-amber-500 to-orange-600',
    accentBg: 'bg-amber-100 dark:bg-amber-950/80',
    accentText: 'text-amber-800 dark:text-amber-300',
    borderColor: 'border-amber-300 dark:border-amber-700/80',
    containerBg: 'bg-amber-50/25 dark:bg-amber-950/20',
    headerBg: 'bg-amber-500/10 dark:bg-amber-900/30',
    tools: [
      {
        name: 'Percentage Calculator',
        description: '6-in-1 versatile percentage solver: Calculate X% of Y, percentage increase/decrease, percentage difference, and markup solver.',
        href: '/percentage-calculator',
        badge: '6-IN-1 SOLVER',
        badgeStyle: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300',
        icon: Percent,
        iconBg: 'bg-violet-600 shadow-violet-500/30',
        rank: 5,
        features: ['6-in-1 Modes', 'Increase & Decrease', 'Markup Solver'],
        actionLabel: 'Open Calculator',
        highlightTag: 'Essential'
      },
      {
        name: 'Discount & Sale Calculator',
        description: 'Calculate final shopping checkout prices, stacked double discounts, coupon percentages, and sales tax with net cash savings.',
        href: '/discount-calculator',
        badge: 'SMART SHOPPING',
        badgeStyle: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300',
        icon: Tag,
        iconBg: 'bg-amber-500 shadow-amber-500/30',
        rank: 6,
        features: ['Stacked Discounts', 'Sales Tax (GST)', 'Net Cash Savings'],
        actionLabel: 'Open Calculator',
      }
    ]
  },

  // 3. IMAGE STUDIO & MEDIA (PLACED ABOVE PDF STUDIO)
  {
    id: 'image-tools',
    name: 'Image Studio & AI Cutout Suite',
    shortTitle: 'Image Tools',
    badge: 'AI Background Removal • Format & Compress',
    description: 'Transform, remove backgrounds, compress, resize, and isolate image elements in real time with 100% in-browser privacy.',
    icon: ImageIcon,
    gradient: 'from-sky-500 to-indigo-600',
    accentBg: 'bg-sky-100 dark:bg-sky-950/80',
    accentText: 'text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-300 dark:border-sky-700/80',
    containerBg: 'bg-sky-50/25 dark:bg-sky-950/20',
    headerBg: 'bg-sky-500/10 dark:bg-sky-900/30',
    tools: [
      {
        name: 'Transparent Background Remover',
        description: 'Remove complete outer & enclosed background pockets with smart automatic detection or custom color picker to create crisp transparent PNGs.',
        href: '/background-remover',
        badge: 'AI CUTOUT PNG',
        badgeStyle: 'border-fuchsia-200 dark:border-fuchsia-800 bg-fuchsia-50 dark:bg-fuchsia-950/70 text-fuchsia-700 dark:text-fuchsia-300',
        icon: Sparkles,
        iconBg: 'bg-fuchsia-600 shadow-fuchsia-500/30',
        rank: 7,
        features: ['Smart Auto Cutout', 'Enclosed Hole Removal', '1-Click Transparent Export'],
        actionLabel: 'Open Tool',
        highlightTag: 'Top Tool'
      },
      {
        name: 'Image Format Converter',
        description: 'Instant format cross-conversion: JPG to PNG, PNG to JPG, WebP to JPG, and SVG to raster PNG with high-resolution retention.',
        href: '/image-converter',
        badge: 'JPG • PNG • WEBP',
        badgeStyle: 'border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300',
        icon: ImageIcon,
        iconBg: 'bg-cyan-600 shadow-cyan-500/30',
        rank: 8,
        features: ['Cross-Format Convert', 'Transparency Support', 'Batch Friendly'],
        actionLabel: 'Open Converter',
        highlightTag: 'Popular'
      },
      {
        name: 'Image Compressor & Resizer',
        description: 'Reduce file size with a real-time before/after quality slider, or resize pixel dimensions with aspect ratio lock.',
        href: '/image-compressor',
        badge: 'KB REDUCER',
        badgeStyle: 'border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300',
        icon: Sliders,
        iconBg: 'bg-sky-600 shadow-sky-500/30',
        rank: 9,
        features: ['Quality Slider', 'Real-Time KB Savings', 'Aspect Ratio Lock'],
        actionLabel: 'Open Tool',
      }
    ]
  },

  // 4. HEALTH & PERSONAL CALCULATORS
  {
    id: 'health',
    name: 'Health & Personal Calculators',
    shortTitle: 'Health',
    badge: 'WHO Benchmark • Exact Milestones',
    description: 'Personal health and life calculators providing medically recognized Body Mass Index benchmarks and exact birthday metrics.',
    icon: HeartPulse,
    gradient: 'from-rose-500 to-pink-600',
    accentBg: 'bg-rose-100 dark:bg-rose-950/80',
    accentText: 'text-rose-700 dark:text-rose-300',
    borderColor: 'border-rose-300 dark:border-rose-700/80',
    containerBg: 'bg-rose-50/25 dark:bg-rose-950/20',
    headerBg: 'bg-rose-500/10 dark:bg-rose-900/30',
    tools: [
      {
        name: 'BMI & Body Health Calculator',
        description: 'Evaluate Body Mass Index using WHO standards. Find your ideal healthy weight with metric (cm/kg) and imperial (ft/lbs) support.',
        href: '/bmi-calculator',
        badge: 'WHO BENCHMARK',
        badgeStyle: 'border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300',
        icon: HeartPulse,
        iconBg: 'bg-pink-600 shadow-pink-500/30',
        rank: 14,
        features: ['Metric & Imperial Toggle', 'Ideal Weight Range', 'Health Category Class'],
        actionLabel: 'Open Calculator',
        highlightTag: 'Health'
      },
      {
        name: 'Exact Age & Birthday Calculator',
        description: 'Calculate exact age down to years, months, days, and total hours. Features next birthday live countdown and day of birth.',
        href: '/age-calculator',
        badge: 'BIRTHDAY COUNTDOWN',
        badgeStyle: 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300',
        icon: Calendar,
        iconBg: 'bg-teal-600 shadow-teal-500/30',
        rank: 15,
        features: ['Exact Years, Months & Days', 'Live Birthday Countdown', 'Day of the Week'],
        actionLabel: 'Open Calculator',
      }
    ]
  },

  // 5. MEASUREMENT & CURRENCY CONVERTERS
  {
    id: 'converters',
    name: 'Measurement & Currency Converters',
    shortTitle: 'Converters',
    badge: 'Multi-Unit • 150+ Currencies',
    description: 'Instant conversion utilities across international measurements, local units (Tola, Marla), and global foreign exchange rates.',
    icon: Ruler,
    gradient: 'from-cyan-600 to-blue-700',
    accentBg: 'bg-cyan-100 dark:bg-cyan-950/80',
    accentText: 'text-cyan-800 dark:text-cyan-300',
    borderColor: 'border-cyan-300 dark:border-cyan-700/80',
    containerBg: 'bg-cyan-50/25 dark:bg-cyan-950/20',
    headerBg: 'bg-cyan-500/10 dark:bg-cyan-900/30',
    tools: [
      {
        name: 'Universal Unit Converter',
        description: 'Instant measurement converter across Length, Weight, Temperature, Area (Marla/Kanal), Speed, and Volume. High-precision.',
        href: '/unit-converter',
        badge: 'MULTI-UNIT PRECISION',
        badgeStyle: 'border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300',
        icon: Ruler,
        iconBg: 'bg-sky-500 shadow-sky-500/30',
        rank: 16,
        features: ['Length, Weight, Temp', 'Metric & Imperial', 'High Precision'],
        actionLabel: 'Open Converter',
        highlightTag: 'Top Tool'
      },
      {
        name: 'Currency Converter (150+ FX)',
        description: 'Convert 150+ world currencies with live mid-market exchange rates, Pakistani Rupee (PKR) default focus, and banking spread markup.',
        href: '/currency-converter',
        badge: 'LIVE MARKET RATES',
        badgeStyle: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300',
        icon: ArrowLeftRight,
        iconBg: 'bg-blue-600 shadow-blue-500/30',
        rank: 17,
        features: ['150+ World Currencies', 'PKR & Major Currencies', 'Banking Spread Estimator'],
        actionLabel: 'Open Converter',
      }
    ]
  },

  // 6. TEXT & WRITING UTILITIES
  {
    id: 'text-tools',
    name: 'Text & Writing Utilities',
    shortTitle: 'Text Tools',
    badge: 'Real-Time Stats • Clean Formatting',
    description: 'Streamline copy editing, essay writing, case transforms, and paragraph statistics with live feedback.',
    icon: Type,
    gradient: 'from-violet-500 to-purple-600',
    accentBg: 'bg-violet-100 dark:bg-violet-950/80',
    accentText: 'text-violet-700 dark:text-violet-300',
    borderColor: 'border-violet-300 dark:border-violet-700/80',
    containerBg: 'bg-violet-50/25 dark:bg-violet-950/20',
    headerBg: 'bg-violet-500/10 dark:bg-violet-900/30',
    tools: [
      {
        name: 'Word & Character Counter',
        description: 'Live real-time statistics: Exact word count, character tally with and without spaces, reading time, and keyword density.',
        href: '/word-counter',
        badge: 'LIVE WORD STATS',
        badgeStyle: 'border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300',
        icon: Type,
        iconBg: 'bg-violet-600 shadow-violet-500/30',
        rank: 21,
        features: ['Reading & Speaking Time', 'Character Count ± Spaces', 'Keyword Frequency'],
        actionLabel: 'Open Counter',
        highlightTag: 'Essential'
      },
      {
        name: 'Case Converter & Text Cleaner',
        description: 'Convert between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and remove duplicate lines.',
        href: '/case-converter',
        badge: '10+ TRANSFORMS',
        badgeStyle: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300',
        icon: CaseSensitive,
        iconBg: 'bg-purple-600 shadow-purple-500/30',
        rank: 22,
        features: ['Code & Grammar Cases', 'Deduplicate Lines', 'Alphabetical Sorter'],
        actionLabel: 'Open Converter',
      }
    ]
  },

  // 7. DEVELOPER & CODE UTILITIES
  {
    id: 'developer',
    name: 'Developer & Code Utilities',
    shortTitle: 'Developer',
    badge: 'Syntax Highlighting • Fast Debugging',
    description: 'Format messy JSON, test regular expressions, and encode/decode web URLs with zero latency.',
    icon: Braces,
    gradient: 'from-indigo-600 to-blue-700',
    accentBg: 'bg-indigo-100 dark:bg-indigo-950/80',
    accentText: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-300 dark:border-indigo-700/80',
    containerBg: 'bg-indigo-50/25 dark:bg-indigo-950/20',
    headerBg: 'bg-indigo-500/10 dark:bg-indigo-900/30',
    tools: [
      {
        name: 'JSON Formatter & Validator',
        description: 'Beautify unformatted JSON, inspect syntax errors with exact line numbers, minify for production, and count keys.',
        href: '/json-formatter',
        badge: 'BEAUTIFY & MINIFY',
        badgeStyle: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300',
        icon: Braces,
        iconBg: 'bg-blue-600 shadow-blue-500/30',
        rank: 26,
        features: ['Line Syntax Check', '2 & 4 Space Indent', '1-Click Minify'],
        actionLabel: 'Open Formatter',
        highlightTag: 'Top Dev Tool'
      },
      {
        name: 'URL & Base64 Encoder / Decoder',
        description: 'Encode and decode URI strings, parse query parameters into clear tables, and convert text to Base64 safely.',
        href: '/url-encoder',
        badge: 'URL & BASE64',
        badgeStyle: 'border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300',
        icon: Code2,
        iconBg: 'bg-sky-600 shadow-sky-500/30',
        rank: 27,
        features: ['URI Component Encoding', 'URL Query Parser', 'Base64 Text Converter'],
        actionLabel: 'Open Encoder',
      },
      {
        name: 'Regex Tester & Live Matcher',
        description: 'Test regular expressions interactively with pattern highlighting, flag support (g, i, m, s), and match group breakdown.',
        href: '/regex-tester',
        badge: 'LIVE REGEX MATCH',
        badgeStyle: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300',
        icon: Terminal,
        iconBg: 'bg-indigo-600 shadow-indigo-500/30',
        rank: 28,
        features: ['Match Highlighting', 'Flag Controls', 'Capture Group Inspector'],
        actionLabel: 'Open Tester',
      }
    ]
  },

  // 10. DESIGN & COLOR STUDIO
  {
    id: 'design',
    name: 'Design & Color Studio',
    shortTitle: 'Design',
    badge: 'WCAG Accessible • CSS Generation',
    description: 'Inspect color harmonies, check WCAG accessibility contrast, and generate production CSS gradients.',
    icon: Palette,
    gradient: 'from-fuchsia-500 to-pink-600',
    accentBg: 'bg-fuchsia-100 dark:bg-fuchsia-950/80',
    accentText: 'text-fuchsia-700 dark:text-fuchsia-300',
    borderColor: 'border-fuchsia-300 dark:border-fuchsia-700/80',
    containerBg: 'bg-fuchsia-50/25 dark:bg-fuchsia-950/20',
    headerBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-900/30',
    tools: [
      {
        name: 'Color Picker & Contrast Checker',
        description: 'Inspect colors across HEX, RGB, and HSL formats. Evaluate WCAG AA/AAA contrast ratios against black & white.',
        href: '/color-picker',
        badge: 'WCAG AA/AAA',
        badgeStyle: 'border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300',
        icon: Pipette,
        iconBg: 'bg-pink-600 shadow-pink-500/30',
        rank: 29,
        features: ['HEX / RGB / HSL Conversion', 'WCAG Contrast Score', 'Tints & Shades Palette'],
        actionLabel: 'Open Studio',
        highlightTag: 'Designer Favorite'
      },
      {
        name: 'CSS Gradient & Palette Studio',
        description: 'Design linear and radial CSS gradients with multi-color stops, custom angles, instant CSS code generation, and palettes.',
        href: '/gradient-generator',
        badge: 'CSS GRADIENTS',
        badgeStyle: 'border-fuchsia-200 dark:border-fuchsia-800 bg-fuchsia-50 dark:bg-fuchsia-950/70 text-fuchsia-700 dark:text-fuchsia-300',
        icon: Palette,
        iconBg: 'bg-fuchsia-600 shadow-fuchsia-500/30',
        rank: 30,
        features: ['Linear & Radial Presets', 'Interactive Angle Wheel', 'Copy-Ready CSS Code'],
        actionLabel: 'Open Studio',
      }
    ]
  },

  // 9. PDF STUDIO & DOCUMENTS (SECOND LAST SECTION)
  {
    id: 'pdf-tools',
    name: 'PDF Studio & Document Conversion',
    shortTitle: 'PDF Tools',
    badge: '100% In-Browser • Zero Uploads',
    description: 'High-demand PDF conversion & editing utilities running 100% inside your browser. No file size caps, no registration, and complete privacy.',
    icon: Files,
    gradient: 'from-red-500 to-rose-600',
    accentBg: 'bg-red-100 dark:bg-red-950/80',
    accentText: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-300 dark:border-red-700/80',
    containerBg: 'bg-red-50/25 dark:bg-red-950/20',
    headerBg: 'bg-red-500/10 dark:bg-red-900/30',
    tools: [
      {
        name: 'Word to PDF Converter',
        description: 'Convert Microsoft Word (.docx, .doc) files into clean, vector-rendered A4 PDF documents with zero server uploads.',
        href: '/word-to-pdf',
        badge: 'DOCX → PDF',
        badgeStyle: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300',
        icon: FileText,
        iconBg: 'bg-blue-600 shadow-blue-500/30',
        rank: 10,
        features: ['Format Preservation', 'Live Document Preview', 'Zero Server Uploads'],
        actionLabel: 'Open Converter',
        highlightTag: 'Top Search'
      },
      {
        name: 'PDF to Word Converter',
        description: 'Extract layout, paragraphs, and text from PDF documents into editable Word (.docx / rich text) files.',
        href: '/pdf-to-word',
        badge: 'PDF → DOCX',
        badgeStyle: 'border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300',
        icon: FileCode,
        iconBg: 'bg-sky-600 shadow-sky-500/30',
        rank: 11,
        features: ['Editable Text Output', 'Contract & Report Editing', '100% Client-Side'],
        actionLabel: 'Open Converter',
        highlightTag: 'High Demand'
      },
      {
        name: 'Excel to PDF Converter',
        description: 'Convert Excel spreadsheets (.xlsx, .xls, .csv) into clean, auto-paginated PDF tables with customizable orientation.',
        href: '/excel-to-pdf',
        badge: 'XLSX → PDF',
        badgeStyle: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300',
        icon: FileSpreadsheet,
        iconBg: 'bg-emerald-600 shadow-emerald-500/30',
        rank: 12,
        features: ['Multi-Sheet Parser', 'Responsive Grid Table', 'Landscape & Portrait'],
        actionLabel: 'Open Converter',
        highlightTag: 'New'
      },
      {
        name: 'PDF to Excel Converter',
        description: 'Extract tables, numeric columns, and row data from PDF files directly into Microsoft Excel (.xlsx) spreadsheets.',
        href: '/pdf-to-excel',
        badge: 'PDF → XLSX',
        badgeStyle: 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300',
        icon: TableIcon,
        iconBg: 'bg-teal-600 shadow-teal-500/30',
        rank: 13,
        features: ['Table Row Extraction', 'Direct .XLSX Export', 'Instant Audit Format'],
        actionLabel: 'Open Converter',
        highlightTag: 'New'
      },
      {
        name: 'PDF to JPG Converter',
        description: 'Export PDF document pages into high-resolution JPG images. Fast browser rendering with zero watermarks.',
        href: '/pdf-to-jpg',
        badge: 'PDF → JPG',
        badgeStyle: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300',
        icon: ImageIcon,
        iconBg: 'bg-amber-600 shadow-amber-500/30',
        rank: 14,
        features: ['High-Res 150 DPI', 'Single & Multi-Page', 'No Page Caps'],
        actionLabel: 'Open Converter',
      },
      {
        name: 'JPG to PDF Converter',
        description: 'Combine multiple photos, scans, and images (JPG, PNG, WebP) into an official multi-page PDF document.',
        href: '/jpg-to-pdf',
        badge: 'IMAGES → PDF',
        badgeStyle: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300',
        icon: FileText,
        iconBg: 'bg-orange-600 shadow-orange-500/30',
        rank: 15,
        features: ['Multi-Image Merge', 'Custom Page Margins', 'A4 & Letter Options'],
        actionLabel: 'Open Converter',
      },
      {
        name: 'PDF Studio (Merge, Split, Compress)',
        description: 'Combine multiple PDFs, split custom page ranges, and compress heavy documents directly on your device.',
        href: '/pdf-tools',
        badge: 'MERGE • SPLIT • SHRINK',
        badgeStyle: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300',
        icon: Files,
        iconBg: 'bg-rose-600 shadow-rose-500/30',
        rank: 16,
        features: ['Reorder Documents', 'Custom Page Ranges', 'Object Stream Opt'],
        actionLabel: 'Open PDF Studio',
      }
    ]
  },

  // 10. GENERATORS & CRYPTOGRAPHY (LAST SECTION)
  {
    id: 'generators',
    name: 'Generators & Cryptography',
    shortTitle: 'Generators',
    badge: 'Cryptographic Entropy • Vector QR',
    description: 'Create high-entropy passwords, custom QR codes, standard UUID v4 tokens, and secure PINs instantly.',
    icon: KeyRound,
    gradient: 'from-teal-500 to-emerald-600',
    accentBg: 'bg-teal-100 dark:bg-teal-950/80',
    accentText: 'text-teal-700 dark:text-teal-300',
    borderColor: 'border-teal-300 dark:border-teal-700/80',
    containerBg: 'bg-teal-50/25 dark:bg-teal-950/20',
    headerBg: 'bg-teal-500/10 dark:bg-teal-900/30',
    tools: [
      {
        name: 'Secure Password Generator',
        description: 'Generate uncrackable passwords with custom lengths, symbols, numbers, and lookalike avoidance with real-time entropy scoring.',
        href: '/password-generator',
        badge: 'CRYPTO ENTROPY',
        badgeStyle: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300',
        icon: KeyRound,
        iconBg: 'bg-emerald-600 shadow-emerald-500/30',
        rank: 23,
        features: ['Entropy Scoring', 'Batch Generation', 'Exclude Confusing'],
        actionLabel: 'Open Generator',
        highlightTag: 'Security'
      },
      {
        name: 'QR Code Generator',
        description: 'Create sharp vector and raster QR codes for website URLs, WiFi network log-in, email templates, and plain text.',
        href: '/qr-code-generator',
        badge: 'PNG & VECTOR SVG',
        badgeStyle: 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
        icon: QrCode,
        iconBg: 'bg-slate-800 dark:bg-slate-700 shadow-slate-500/30',
        rank: 24,
        features: ['WiFi One-Touch Connect', 'Scalable Vector SVG', 'Custom Colors'],
        actionLabel: 'Open Generator',
        highlightTag: 'Popular'
      },
      {
        name: 'UUID & Random Number Generator',
        description: 'Generate authentic RFC4122 Version 4 UUIDs, custom range random numbers, and secure 4/6-digit PIN codes.',
        href: '/uuid-generator',
        badge: 'UUID V4 & PINS',
        badgeStyle: 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300',
        icon: Fingerprint,
        iconBg: 'bg-teal-600 shadow-teal-500/30',
        rank: 25,
        features: ['Bulk UUID v4 Tokens', 'Custom Min/Max Range', 'Secure PIN Generator'],
        actionLabel: 'Open Generator',
      }
    ]
  }
];

// Determine responsive visibility for expand/collapse button:
// - 1 tool: never show button
// - 2 tools: fits in 1 line on tablet (2 cols) and desktop (3 cols) -> only show on mobile (< sm)
// - 3 tools: fits in 1 line on desktop (3 cols) -> only show on mobile & tablet (< lg)
// - 4+ tools: does not fit in 1 line on any screen -> show on all screens
const getExpandResponsiveClass = (toolCount: number) => {
  if (toolCount <= 1) return 'hidden';
  if (toolCount === 2) return 'sm:hidden';
  if (toolCount === 3) return 'lg:hidden';
  return '';
};

export function FeaturedTools({ onNavigate, selectedCategory, onSelectCategory }: FeaturedToolsProps) {
  // Track expanded state for categories
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeFilterId, setActiveFilterId] = useState<string>('all');

  const handleToolClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    CATEGORY_SECTIONS.forEach((s) => {
      allExpanded[s.id] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const handleFilterClick = (id: string) => {
    setActiveFilterId(id);
    if (onSelectCategory) {
      const match = CATEGORY_SECTIONS.find((s) => s.id === id);
      onSelectCategory(id === 'all' ? 'All' : match ? match.name : 'All');
    }
    if (id !== 'all') {
      // Auto-expand the filtered section so all its tools are immediately visible
      setExpandedSections((prev) => ({
        ...prev,
        [id]: true
      }));
    }
  };

  const visibleSections = activeFilterId === 'all'
    ? CATEGORY_SECTIONS
    : CATEGORY_SECTIONS.filter((s) => s.id === activeFilterId);

  // Total real tool count
  const totalCount = TOOLS_LIST.length;

  const areAllExpanded = CATEGORY_SECTIONS.every((s) => expandedSections[s.id]);

  return (
    <div id="featured-tools-section" className="space-y-6">
      {/* Top Filter & Compression Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Category Filter &amp; View Controls
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
              {totalCount} Tools Ready
            </span>
          </div>

          {/* Expand / Collapse All Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={areAllExpanded ? collapseAll : expandAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
              title={areAllExpanded ? 'Collapse all categories' : 'Expand all categories'}
            >
              {areAllExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Compress View</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Expand All</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Category Filter Pills with Live Real Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => handleFilterClick('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
              activeFilterId === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>⚡ All Categories</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
              activeFilterId === 'all' 
                ? 'bg-white/25 dark:bg-slate-900/20 text-white dark:text-slate-900 font-black' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {totalCount}
            </span>
          </button>

          {CATEGORY_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeFilterId === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleFilterClick(sec.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.shortTitle}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {sec.tools.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prominent Distinctly Colored Category Containers */}
      <div className="space-y-8">
        {visibleSections.map((section) => {
          const SectionIcon = section.icon;
          const isExpanded = !!expandedSections[section.id];
          const expandClass = getExpandResponsiveClass(section.tools.length);

          return (
            <section 
              key={section.id} 
              id={`section-${section.id}`}
              className={`rounded-3xl border-2 ${section.borderColor} ${section.containerBg} p-4 sm:p-5 shadow-xs transition-all duration-200`}
            >
              {/* Prominent Container Header Card with Dropdown Control */}
              <div className={`p-4 sm:p-5 rounded-2xl ${section.headerBg} border ${section.borderColor} mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${section.gradient} text-white flex items-center justify-center shadow-md shadow-slate-200/50 dark:shadow-none shrink-0`}>
                    <SectionIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        {section.name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${section.accentBg} ${section.accentText} border ${section.borderColor}`}>
                        {section.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Right Header Controls: Tool Count Badge & Dropdown Expand Toggle */}
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-xl shadow-2xs">
                    {section.tools.length} Tools
                  </span>

                  {expandClass !== 'hidden' && (
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className={`items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs border ${
                        expandClass === '' ? 'inline-flex' : `${expandClass} inline-flex`
                      } ${
                        isExpanded
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      {isExpanded ? (
                        <>
                          <span>Collapse</span>
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Show All ({section.tools.length})</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Tools Grid: Shows only 1 line at first irrespective of screen size:
                  - Mobile (< sm, 1 col): only card 0 visible (1 card)
                  - Tablet (sm to lg, 2 cols): card 0 & 1 visible (2 cards)
                  - Desktop (lg+, 3 cols): card 0, 1 & 2 visible (3 cards)
                  When expanded, all cards are visible on all screens! */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {section.tools.map((tool, idx) => {
                  const ToolIcon = tool.icon;
                  let displayClass = 'flex';
                  if (!isExpanded) {
                    if (idx === 1) {
                      displayClass = 'hidden sm:flex';
                    } else if (idx === 2) {
                      displayClass = 'hidden lg:flex';
                    } else if (idx >= 3) {
                      displayClass = 'hidden';
                    }
                  }

                  return (
                    <a
                      key={tool.name}
                      href={tool.href}
                      onClick={(e) => handleToolClick(e, tool.href)}
                      className={`group relative flex-col justify-between p-4.5 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-150 cursor-pointer overflow-hidden ${displayClass}`}
                    >
                      <div>
                        {/* Top Row: Saturated Filled Squircle Icon & High-Contrast Badge (No Numbering) */}
                        <div className="flex items-start justify-between gap-2">
                          <div className={`w-11 h-11 rounded-2xl ${tool.iconBg} text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                            <ToolIcon className="w-5 h-5 stroke-[2.2]" />
                          </div>

                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tool.badgeStyle}`}>
                            {tool.badge}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="text-[15px] sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-3 leading-snug">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1.5">
                          {tool.description}
                        </p>

                        {/* Clean Rounded-Full Tag Chips (matching image.png) */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {tool.features.map((feat, fIdx) => (
                            <span 
                              key={fIdx}
                              className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200/70 dark:border-slate-700/70"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Action Row: Zap Open Button & Circle Arrow */}
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          <span>{tool.actionLabel}</span>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:translate-x-0.5 transition-all shadow-2xs">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Bottom Expand Toggle Bar: only show on screen sizes where tools overflow line 1 */}
              {expandClass !== 'hidden' && (
                <div className={`mt-3.5 pt-2 text-center ${expandClass}`}>
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span>Collapse {section.shortTitle}</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span>View All {section.tools.length} Tools in {section.shortTitle}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
