import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, 
  Search, 
  Menu, 
  X, 
  ChevronDown,
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
  Layers,
  ArrowRight,
  Info,
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
import { TOOLS_LIST, ToolItem } from '@/data/toolsData';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { BrandLogo } from '@/components/common/BrandLogo';

const TOOL_ICONS: Record<string, React.ReactNode> = {
  ArrowLeftRight: <ArrowLeftRight className="w-4 h-4 text-sky-600" />,
  Coins: <Coins className="w-4 h-4 text-emerald-600" />,
  Landmark: <Landmark className="w-4 h-4 text-indigo-600" />,
  Receipt: <Receipt className="w-4 h-4 text-rose-600" />,
  TrendingUp: <TrendingUp className="w-4 h-4 text-emerald-600" />,
  Percent: <Percent className="w-4 h-4 text-amber-600" />,
  Tag: <Tag className="w-4 h-4 text-pink-600" />,
  HeartPulse: <HeartPulse className="w-4 h-4 text-red-600" />,
  Calendar: <Calendar className="w-4 h-4 text-purple-600" />,
  Ruler: <Ruler className="w-4 h-4 text-cyan-600" />,
  Files: <Files className="w-4 h-4 text-red-600" />,
  FileText: <FileText className="w-4 h-4 text-orange-600" />,
  FileCode: <FileCode className="w-4 h-4 text-blue-600" />,
  FileSpreadsheet: <FileSpreadsheet className="w-4 h-4 text-emerald-600" />,
  TableIcon: <TableIcon className="w-4 h-4 text-teal-600" />,
  ImageIcon: <ImageIcon className="w-4 h-4 text-cyan-600" />,
  Sliders: <Sliders className="w-4 h-4 text-sky-600" />,
  Type: <Type className="w-4 h-4 text-violet-600" />,
  CaseSensitive: <CaseSensitive className="w-4 h-4 text-purple-600" />,
  KeyRound: <KeyRound className="w-4 h-4 text-emerald-600" />,
  QrCode: <QrCode className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
  Fingerprint: <Fingerprint className="w-4 h-4 text-teal-600" />,
  Braces: <Braces className="w-4 h-4 text-blue-600" />,
  Code2: <Code2 className="w-4 h-4 text-sky-600" />,
  Terminal: <Terminal className="w-4 h-4 text-indigo-600" />,
  Pipette: <Pipette className="w-4 h-4 text-pink-600" />,
  Palette: <Palette className="w-4 h-4 text-fuchsia-600" />,
};

interface NavbarProps {
  onNavigate?: (href: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  const filteredTools = searchQuery.trim() === '' ? [] : TOOLS_LIST.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = [
    { name: 'Financial Calculators', items: TOOLS_LIST.filter(t => t.category === 'Financial') },
    { name: 'Everyday Math & Finance', items: TOOLS_LIST.filter(t => t.category === 'Math & Everyday') },
    { name: 'PDF Studio & Documents', items: TOOLS_LIST.filter(t => t.category === 'PDF Tools') },
    { name: 'Health & Personal', items: TOOLS_LIST.filter(t => t.category === 'Health') },
    { name: 'Measurement & FX Converters', items: TOOLS_LIST.filter(t => t.category === 'Converters') },
    { name: 'Image Studio', items: TOOLS_LIST.filter(t => t.category === 'Image Tools') },
    { name: 'Text & Writing Tools', items: TOOLS_LIST.filter(t => t.category === 'Text Tools') },
    { name: 'Generators & Security', items: TOOLS_LIST.filter(t => t.category === 'Generators') },
    { name: 'Developer Tools', items: TOOLS_LIST.filter(t => t.category === 'Developer') },
    { name: 'Design & Colors', items: TOOLS_LIST.filter(t => t.category === 'Design') },
  ];

  return (
    <>
      <header id="main-header" className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
          
          {/* Brand Logo */}
          <a 
            href="/" 
            onClick={(e) => handleNav(e, '/')}
            id="header-brand-logo" 
            className="flex items-center group shrink-0 min-w-0"
            aria-label="QuickTools Home"
          >
            <BrandLogo size="md" />
          </a>

          {/* Search Trigger Button - Compact on tablets, full on desktop */}
          <button 
            type="button"
            id="global-search-trigger"
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs w-36 lg:w-44 xl:w-56 border border-slate-200/60 dark:border-slate-700/60 transition-colors shrink min-w-0 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="flex-1 text-left truncate">Search tools...</span>
            <kbd className="hidden xl:inline px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-300 shadow-xs">Ctrl K</kbd>
          </button>

          {/* Quick Category Nav Links - Visible on XL screens to prevent breaking on tablets & laptops */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
            <a 
              href="/zakat-calculator" 
              onClick={(e) => handleNav(e, '/zakat-calculator')}
              className="px-2.5 py-1.5 rounded-xl hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Calculators</span>
            </a>
            <a 
              href="/unit-converter" 
              onClick={(e) => handleNav(e, '/unit-converter')}
              className="px-2.5 py-1.5 rounded-xl hover:text-cyan-700 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Ruler className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>Converters</span>
            </a>
            <a 
              href="/background-remover" 
              onClick={(e) => handleNav(e, '/background-remover')}
              className="px-2.5 py-1.5 rounded-xl hover:text-sky-700 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>Image Studio</span>
            </a>
            <a 
              href="/word-to-pdf" 
              onClick={(e) => handleNav(e, '/word-to-pdf')}
              className="px-2.5 py-1.5 rounded-xl hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Files className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>PDF Studio</span>
            </a>
          </nav>

          {/* Right Navigation Controls: Dropdown and Theme Button at End */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>
            {/* "All Tools" Mega Dropdown Button */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                type="button"
                id="all-calculators-dropdown-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-xs border cursor-pointer ${
                  dropdownOpen
                    ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-900/50'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Layers className={`w-4 h-4 ${dropdownOpen ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                <span>All Tools ({TOOLS_LIST.length})</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Menu */}
              {dropdownOpen && (
                <div 
                  id="all-calculators-mega-menu"
                  className="absolute right-0 mt-2 w-[340px] sm:w-[540px] md:w-[620px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        Explore Complete Utility Suite
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Instant in-browser PDF, image, text, code &amp; finance tools</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {TOOLS_LIST.length} Free Tools
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto p-1">
                    {categories.map((cat) => (
                      <div key={cat.name} className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-2 mb-1">
                          {cat.name}
                        </span>
                        {cat.items.map((tool) => (
                          <a
                            key={tool.id}
                            href={tool.href}
                            onClick={(e) => handleNav(e, tool.href)}
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 flex items-center justify-center shrink-0 transition-colors border border-slate-200/50 dark:border-slate-700/50">
                              {TOOL_ICONS[tool.iconName] || <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5 leading-tight">
                                {tool.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-950/60 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 sm:px-5 rounded-b-3xl">
                    <div className="flex gap-3 text-[11px]">
                      <a href="/about" onClick={(e) => handleNav(e, '/about')} className="hover:text-indigo-600 dark:hover:text-indigo-400">About</a>
                      <a href="/contact" onClick={(e) => handleNav(e, '/contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</a>
                      <a href="/disclaimer" onClick={(e) => handleNav(e, '/disclaimer')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Disclaimer</a>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">• Live Rates Connected</span>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button At The End */}
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900 dark:text-white" /> : <Menu className="w-5 h-5 text-slate-900 dark:text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div id="mobile-navigation-drawer" className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5 px-1">
                Display Theme
              </span>
              <ThemeToggle showLabel />
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search calculators & converters..."
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                readOnly
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer focus:outline-none"
              />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 px-1">
                Popular Tools &amp; Utilities
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/word-to-pdf"
                  onClick={(e) => handleNav(e, '/word-to-pdf')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50/70 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 hover:bg-red-100/60 dark:hover:bg-red-900/60 transition-colors"
                >
                  <FileText className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span className="text-xs font-bold text-red-950 dark:text-red-200">Word → PDF</span>
                </a>
                <a
                  href="/image-converter"
                  onClick={(e) => handleNav(e, '/image-converter')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/50 hover:bg-cyan-100/60 dark:hover:bg-cyan-900/60 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span className="text-xs font-bold text-cyan-950 dark:text-cyan-200">Image Convert</span>
                </a>
                <a
                  href="/password-generator"
                  onClick={(e) => handleNav(e, '/password-generator')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/60 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Passwords</span>
                </a>
                <a
                  href="/zakat-calculator"
                  onClick={(e) => handleNav(e, '/zakat-calculator')}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 hover:bg-amber-100/60 dark:hover:bg-amber-900/60 transition-colors"
                >
                  <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-200">Zakat &amp; Tax</span>
                </a>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-1">
                    {cat.name}
                  </span>
                  <div className="space-y-1">
                    {cat.items.map((tool) => (
                      <a
                        key={tool.id}
                        href={tool.href}
                        onClick={(e) => handleNav(e, tool.href)}
                        className="flex items-center justify-between p-2 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            {TOOL_ICONS[tool.iconName] || <Calculator className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                          </div>
                          <span className="font-semibold">{tool.name}</span>
                        </div>
                        {tool.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {tool.badge}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex gap-3 text-xs">
                <a href="/about" onClick={(e) => handleNav(e, '/about')} className="hover:text-indigo-600 dark:hover:text-indigo-400">About</a>
                <a href="/contact" onClick={(e) => handleNav(e, '/contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</a>
                <a href="/disclaimer" onClick={(e) => handleNav(e, '/disclaimer')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Disclaimer</a>
                <a href="/privacy-policy" onClick={(e) => handleNav(e, '/privacy-policy')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</a>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">• Live Rates</span>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      {searchOpen && (
        <div 
          id="search-overlay" 
          className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3" />
              <input
                id="search-modal-input"
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search calculators (e.g., zakat, currency, loan, tax, bmi)..."
                className="w-full py-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-none text-base"
              />
              <button 
                type="button" 
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchQuery.trim() === '' ? (
                <div className="p-4 text-xs text-slate-400 dark:text-slate-500">
                  <p className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Popular Tools:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TOOLS_LIST.slice(0, 6).map(t => (
                      <a
                        key={t.id}
                        href={t.href}
                        onClick={(e) => handleNav(e, t.href)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1"
                      >
                        {TOOL_ICONS[t.iconName]}
                        <span>{t.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : filteredTools.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">No calculators found matching &ldquo;{searchQuery}&rdquo;</p>
              ) : (
                filteredTools.map(tool => (
                  <a
                    key={tool.id}
                    href={tool.href}
                    onClick={(e) => handleNav(e, tool.href)}
                    className="flex items-start justify-between p-3 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {TOOL_ICONS[tool.iconName] || <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{tool.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{tool.description}</p>
                      </div>
                    </div>
                    {tool.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                        {tool.badge}
                      </span>
                    )}
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
