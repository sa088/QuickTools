import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, 
  Search, 
  ArrowLeftRight, 
  Coins, 
  Landmark, 
  Receipt, 
  TrendingUp, 
  Percent, 
  Tag, 
  HeartPulse, 
  Calendar, 
  Ruler, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Zap,
  X,
  Files,
  FileText,
  FileCode,
  FileSpreadsheet,
  Table as TableIcon,
  Image as ImageIcon,
  Sliders,
  Type,
  CaseSensitive,
  KeyRound,
  QrCode,
  Fingerprint,
  Braces,
  Code2,
  Terminal,
  Pipette,
  Palette
} from 'lucide-react';
import { TOOLS_LIST } from '@/data/toolsData';
import { RecentCalculations } from '@/components/RecentCalculations';
import { FeaturedTools } from '@/components/home/FeaturedTools';

const ICONS_MAP: Record<string, React.ReactNode> = {
  Coins: <Coins className="w-5 h-5 sm:w-6 sm:h-6" />,
  Percent: <Percent className="w-5 h-5 sm:w-6 sm:h-6" />,
  Ruler: <Ruler className="w-5 h-5 sm:w-6 sm:h-6" />,
  Receipt: <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />,
  HeartPulse: <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" />,
  Tag: <Tag className="w-5 h-5 sm:w-6 sm:h-6" />,
  ArrowLeftRight: <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6" />,
  Landmark: <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />,
  Calendar: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />,
  TrendingUp: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
  Files: <Files className="w-5 h-5 sm:w-6 sm:h-6" />,
  FileText: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
  FileCode: <FileCode className="w-5 h-5 sm:w-6 sm:h-6" />,
  FileSpreadsheet: <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />,
  TableIcon: <TableIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
  ImageIcon: <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
  Sliders: <Sliders className="w-5 h-5 sm:w-6 sm:h-6" />,
  Type: <Type className="w-5 h-5 sm:w-6 sm:h-6" />,
  CaseSensitive: <CaseSensitive className="w-5 h-5 sm:w-6 sm:h-6" />,
  KeyRound: <KeyRound className="w-5 h-5 sm:w-6 sm:h-6" />,
  QrCode: <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />,
  Fingerprint: <Fingerprint className="w-5 h-5 sm:w-6 sm:h-6" />,
  Braces: <Braces className="w-5 h-5 sm:w-6 sm:h-6" />,
  Code2: <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />,
  Terminal: <Terminal className="w-5 h-5 sm:w-6 sm:h-6" />,
  Pipette: <Pipette className="w-5 h-5 sm:w-6 sm:h-6" />,
  Palette: <Palette className="w-5 h-5 sm:w-6 sm:h-6" />,
};

const TOOL_HIGHLIGHTS: Record<string, string[]> = {
  'zakat-calculator': ['Gold 87.48g & Silver 612.36g', 'Live Bullion Rates', 'Tola & Grams'],
  'income-tax-calculator': ['Official FBR Slabs', 'FY 25–26 & 26–27', 'Monthly Take-Home'],
  'currency-converter': ['150+ Currencies', 'Live PKR Focus', 'Interbank Spread'],
  'loan-emi-calculator': ['Monthly Breakdown', 'Amortization Plan', 'Car & Home Loans'],
  'percentage-calculator': ['6-in-1 Modes', 'Increase & Decrease', 'Markup Solver'],
  'unit-converter': ['Length, Weight, Temp', 'Metric & Imperial', 'High Precision'],
  'bmi-calculator': ['WHO Standards', 'Ideal Weight Range', 'Metric (cm) & Feet (in)'],
  'discount-calculator': ['Stacked Discounts', 'Sales Tax (GST)', 'Net Savings'],
  'age-calculator': ['Exact Years & Days', 'Birthday Countdown', 'Day of Birth'],
  'compound-interest': ['Wealth Growth Curve', 'Monthly Additions', 'APY Forecast'],
  'word-to-pdf': ['DOCX & DOC to PDF', 'A4 Clean Formatting', 'Zero Uploads'],
  'pdf-to-word': ['PDF to DOCX / RTF', 'Extract Layout & Text', '100% Private'],
  'excel-to-pdf': ['XLSX & CSV to PDF', 'Multi-Sheet Selector', 'Styled PDF Tables'],
  'pdf-to-excel': ['Extract PDF Tables', 'Direct to XLSX', 'Data Rows & Columns'],
  'pdf-to-jpg': ['High-Res JPG Export', 'All Pages Supported', 'No Size Caps'],
  'pdf-tools': ['Merge Multiple PDFs', 'Split & Extract Pages', 'Compress File Size'],
  'jpg-to-pdf': ['Photos to PDF', 'A4 & Letter Formatting', 'Zero Watermarks'],
  'image-converter': ['JPG, PNG & WebP', 'Lossless Conversion', 'Instant Download'],
  'image-compressor': ['Quality Control Slider', 'KB File Reducer', 'Aspect Ratio Lock'],
  'background-remover': ['Transparent PNG Cutouts', 'Color Thresholding', 'Checkerboard Preview'],
  'word-counter': ['Live Word & Char Tally', 'Reading & Speaking Time', 'Top Keyword Density'],
  'case-converter': ['UPPERCASE & camelCase', 'Title & Sentence Case', 'Deduplicate & Sort'],
  'password-generator': ['Cryptographic Entropy', 'Custom Symbols & Length', 'Batch Generator'],
  'qr-code-generator': ['Website & WiFi QR', 'PNG & Scalable SVG', 'Custom Brand Colors'],
  'uuid-generator': ['RFC4122 Version 4', 'Bulk Token Generation', 'Secure Random PINs'],
  'json-formatter': ['2 & 4 Space Beautify', 'Syntax Error Detector', 'One-Click Minify'],
  'url-encoder': ['Encode & Decode URIs', 'Query Parameter Parser', 'Base64 Support'],
  'regex-tester': ['Live Pattern Matcher', 'Global & Multiline Flags', 'Capture Groups'],
  'color-picker': ['HEX, RGB & HSL Values', 'WCAG Contrast Checker', 'Tints & Shades'],
  'gradient-generator': ['Linear & Radial CSS', 'Interactive Angle Wheel', 'Color Harmony Palettes'],
};

interface HomePageProps {
  onNavigate?: (href: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const filteredTools = TOOLS_LIST.filter((tool) => {
    const matchesCat = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToGrid = () => {
    setShowDropdown(false);
    const el = document.getElementById('tools-grid-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setShowDropdown(false);
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Compact, Well-Proportioned Hero Section */}
      <section className="relative z-30 bg-gradient-to-b from-indigo-50/70 via-emerald-50/20 to-slate-50 dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-950 pt-5 sm:pt-7 pb-5 sm:pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute -top-20 right-1/4 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3.5 sm:space-y-4 relative z-10">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold tracking-wide shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span>All Tools 100% Free • In-Browser Client-Side Processing • Live Rates Active</span>
          </div>

          {/* Heading showcasing full rich breadth */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight max-w-4xl mx-auto leading-tight text-slate-900 dark:text-white">
            <span>Fast Online Tools for </span>
            <span className="bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
              PDF
            </span>
            <span className="text-slate-400 font-bold">, </span>
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              Images
            </span>
            <span className="text-slate-400 font-bold">, </span>
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              Finance
            </span>{' '}
            <span className="text-slate-400 font-bold">&amp;</span>{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Code
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-normal px-2">
            Powerful utilities for documents, images, text, passwords, JSON, and financial calculations. Free forever, no registration, 100% private.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-2xl mx-auto pt-1 px-1 sm:px-0 relative z-50" ref={searchContainerRef}>
            <div className="relative flex items-center shadow-sm sm:shadow-md shadow-indigo-100/50 dark:shadow-none rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus-within:border-indigo-600 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-950 transition-all">
              <Search className="w-4 h-4 text-indigo-500 dark:text-indigo-400 absolute left-3.5 pointer-events-none" />
              <input
                id="hero-tools-search"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onClick={() => setShowDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (filteredTools.length > 0 && onNavigate) {
                      onNavigate(filteredTools[0].href);
                    } else {
                      scrollToGrid();
                    }
                  } else if (e.key === 'Escape') {
                    setShowDropdown(false);
                  }
                }}
                placeholder="Search tools (e.g. merge pdf, jpg to png, word counter, password, json, tax)..."
                className="w-full pl-10 pr-20 py-2.5 sm:py-3 rounded-xl bg-transparent text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowDropdown(false);
                  }}
                  className="absolute right-2.5 text-[11px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer"
                >
                  Clear
                </button>
              ) : (
                <span className="absolute right-2.5 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md hidden sm:inline">
                  Instant
                </span>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            {showDropdown && (
              <div 
                id="hero-live-search-results"
                className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-indigo-200/80 dark:border-indigo-900/60 p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Instant Results ({filteredTools.length})</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={scrollToGrid}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px] cursor-pointer"
                    >
                      View in Grid ↓
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowDropdown(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {searchQuery.trim().length > 0 && filteredTools.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">No tools found for &ldquo;{searchQuery}&rdquo;</p>
                    <p className="text-slate-400 dark:text-slate-500 mt-1">Try searching for keywords like pdf, jpg, qr, password, tax, or json.</p>
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-1">
                    {(searchQuery.trim().length > 0 ? filteredTools : TOOLS_LIST).map((tool) => (
                      <a
                        key={tool.id}
                        href={tool.href}
                        onClick={(e) => handleNav(e, tool.href)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700 text-indigo-600 dark:text-indigo-400">
                            {ICONS_MAP[tool.iconName] || <Calculator className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                                {tool.name}
                              </p>
                              {tool.badge && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 shrink-0">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 pl-2">
                          <span className="hidden sm:inline">Open</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Compact Quick-Resume Bar */}
      <RecentCalculations onNavigate={onNavigate} variant="compact" />

      {/* Main Content Area: Featured Categorized Sections vs Filtered Search Grid */}
      <section id="tools-grid-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {!searchQuery.trim() ? (
          /* Show FeaturedTools: Visually categorizes all tools into color containers with 1-row collapse & dropdowns */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Tools &amp; In-Browser Utility Suites
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Organized by category in compact containers with instant dropdown expansion. 100% client-side privacy.
                </p>
              </div>
              <div className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                {TOOLS_LIST.length} total tools ready
              </div>
            </div>

            <FeaturedTools 
              onNavigate={onNavigate} 
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </div>
        ) : (
          /* Show Filtered Results when user searches or clicks a specific category filter */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {searchQuery.trim() ? `Search Results` : `${selectedCategory}`}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {searchQuery.trim() ? (
                    <span>Found {filteredTools.length} tools matching &ldquo;<strong className="text-indigo-600 dark:text-indigo-400">{searchQuery}</strong>&rdquo;</span>
                  ) : (
                    <span>Displaying all {filteredTools.length} tools in {selectedCategory}. Click any card to launch.</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  ← Show All Categorized Sections
                </button>
                <div className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                  {filteredTools.length} of {TOOLS_LIST.length} tools
                </div>
              </div>
            </div>

            {/* Filtered Tools Grid */}
            {filteredTools.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">No tools found matching your criteria</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Try searching for keywords like &ldquo;word to pdf&rdquo;, &ldquo;compress&rdquo;, &ldquo;qr&rdquo;, &ldquo;password&rdquo;, or &ldquo;tax&rdquo;.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Reset Filter &amp; View All Tools
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredTools.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.href}
                    onClick={(e) => handleNav(e, tool.href)}
                    className="group relative flex flex-col justify-between p-4.5 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-150 cursor-pointer overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tool.gradient} text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                          {ICONS_MAP[tool.iconName] || <Calculator className="w-5 h-5 text-white" />}
                        </div>
                        {tool.badge && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shrink-0">
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-[15px] sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-3 leading-snug">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1.5 line-clamp-2">
                        {tool.description}
                      </p>

                      {/* Tool Highlights Chips */}
                      {TOOL_HIGHLIGHTS[tool.id] && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {TOOL_HIGHLIGHTS[tool.id].map((chip, i) => (
                            <span 
                              key={i} 
                              className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200/70 dark:border-slate-700/70"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Row matching image.png */}
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        <span>Open Tool</span>
                      </div>

                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:translate-x-0.5 transition-all shadow-2xs">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Why QuickTools Trust & Privacy Feature Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>100% In-Browser &amp; Zero Lag</span>
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every operation from PDF merging to cryptographic hashing runs entirely inside your browser engine. Nothing is queued or throttled.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Zero File Uploads • Absolute Privacy</span>
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your PDFs, images, text, and financial numbers never touch an external server or database. Strict client-side confidentiality.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Official Formulas &amp; Real Data</span>
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Engineered with official Pakistan FBR Finance Act slabs, live bullion bullion spot feeds, interbank forex rates, and ISO standard conversions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
