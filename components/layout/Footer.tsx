import React from 'react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { 
  Calculator, 
  ShieldCheck, 
  Zap, 
  Lock, 
  ArrowUp, 
  Coins, 
  Receipt, 
  Percent, 
  Ruler, 
  HeartPulse, 
  ArrowLeftRight,
  TrendingUp,
  Tag,
  Calendar,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Files,
  FileText,
  Image as ImageIcon,
  Sliders,
  Type,
  KeyRound,
  Braces,
  Palette
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (href: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <footer id="main-footer" className="relative bg-slate-950 text-slate-300 border-t border-slate-800 mt-16 sm:mt-24 overflow-hidden">
      {/* Ambient Gradient Glow Backdrops */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Value Propositions Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-xs py-8 sm:py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Instant Client Speed</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Runs 100% locally in your browser with zero latency.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">100% Private & Safe</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Your financial and medical numbers never leave your device.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">FBR & Nisab Verified</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Aligned with official FBR FY 25-26 & Islamic Nisab rules.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Live Market Feeds</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">Real-time exchange rates & gold/silver bullion indices.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation & Brand Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          
          {/* Brand Presentation */}
          <div className="space-y-4 lg:col-span-2">
            <a 
              href="/" 
              onClick={(e) => handleNav(e, '/')}
              id="footer-brand-logo" 
              className="group inline-flex items-center"
              aria-label="QuickTools Home"
            >
              <BrandLogo size="lg" inverted={true} />
            </a>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your comprehensive online suite of fast, mathematically verified calculators. Engineered with official Pakistan FBR tax formulas, authentic Nisab thresholds, interbank rates, and universal conversions.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">Live Bullion & Currency Synced</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% In-Browser
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Zero Advertisements
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-violet-400" /> Strict Privacy
              </span>
            </div>
          </div>

          {/* Column 2: PDF & Image Tools */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              PDF &amp; Documents
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="/word-to-pdf" onClick={(e) => handleNav(e, '/word-to-pdf')} className="hover:text-red-400 transition-colors flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Word to PDF Converter</span>
                </a>
              </li>
              <li>
                <a href="/pdf-to-word" onClick={(e) => handleNav(e, '/pdf-to-word')} className="hover:text-sky-400 transition-colors flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>PDF to Word Converter</span>
                </a>
              </li>
              <li>
                <a href="/excel-to-pdf" onClick={(e) => handleNav(e, '/excel-to-pdf')} className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Excel to PDF Converter</span>
                </a>
              </li>
              <li>
                <a href="/pdf-to-excel" onClick={(e) => handleNav(e, '/pdf-to-excel')} className="hover:text-teal-400 transition-colors flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span>PDF to Excel Converter</span>
                </a>
              </li>
              <li>
                <a href="/pdf-tools" onClick={(e) => handleNav(e, '/pdf-tools')} className="hover:text-red-400 transition-colors flex items-center gap-2">
                  <Files className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>PDF Studio (Merge &amp; Split)</span>
                </a>
              </li>
              <li>
                <a href="/jpg-to-pdf" onClick={(e) => handleNav(e, '/jpg-to-pdf')} className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>JPG &amp; Images to PDF</span>
                </a>
              </li>
              <li>
                <a href="/image-converter" onClick={(e) => handleNav(e, '/image-converter')} className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>Image Converter</span>
                </a>
              </li>
              <li>
                <a href="/background-remover" onClick={(e) => handleNav(e, '/background-remover')} className="hover:text-fuchsia-400 transition-colors flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-500 shrink-0" />
                  <span>Background Remover</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Text, Generators & Code */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              Text, Code &amp; Security
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="/word-counter" onClick={(e) => handleNav(e, '/word-counter')} className="hover:text-violet-400 transition-colors flex items-center gap-2">
                  <Type className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                  <span>Word &amp; Character Counter</span>
                </a>
              </li>
              <li>
                <a href="/password-generator" onClick={(e) => handleNav(e, '/password-generator')} className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Password Generator</span>
                </a>
              </li>
              <li>
                <a href="/qr-code-generator" onClick={(e) => handleNav(e, '/qr-code-generator')} className="hover:text-slate-300 transition-colors flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>QR Code Generator</span>
                </a>
              </li>
              <li>
                <a href="/json-formatter" onClick={(e) => handleNav(e, '/json-formatter')} className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Braces className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>JSON Formatter &amp; Validator</span>
                </a>
              </li>
              <li>
                <a href="/color-picker" onClick={(e) => handleNav(e, '/color-picker')} className="hover:text-pink-400 transition-colors flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span>Color Picker &amp; Gradients</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Financial & Everyday */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Finance &amp; Math
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="/zakat-calculator" onClick={(e) => handleNav(e, '/zakat-calculator')} className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Zakat Calculator (PKR)</span>
                </a>
              </li>
              <li>
                <a href="/income-tax-calculator" onClick={(e) => handleNav(e, '/income-tax-calculator')} className="hover:text-rose-400 transition-colors flex items-center gap-2">
                  <Receipt className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Pakistan FBR Tax</span>
                </a>
              </li>
              <li>
                <a href="/currency-converter" onClick={(e) => handleNav(e, '/currency-converter')} className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Currency Converter</span>
                </a>
              </li>
              <li>
                <a href="/loan-emi-calculator" onClick={(e) => handleNav(e, '/loan-emi-calculator')} className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                  <Calculator className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Loan &amp; Car EMI</span>
                </a>
              </li>
              <li>
                <a href="/unit-converter" onClick={(e) => handleNav(e, '/unit-converter')} className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>Unit Converter</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Trust */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              Company & Trust
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="/about" onClick={(e) => handleNav(e, '/about')} className="hover:text-white transition-colors">About QuickTools</a></li>
              <li><a href="/contact" onClick={(e) => handleNav(e, '/contact')} className="hover:text-white transition-colors">Contact & Support</a></li>
              <li><a href="/privacy-policy" onClick={(e) => handleNav(e, '/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy (No Logs)</a></li>
              <li><a href="/terms-of-service" onClick={(e) => handleNav(e, '/terms-of-service')} className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/disclaimer" onClick={(e) => handleNav(e, '/disclaimer')} className="hover:text-white transition-colors">Financial Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/90 my-8 sm:my-10"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-semibold text-slate-300">
              © {new Date().getFullYear()} QuickTools Suite. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-500">
              Built for speed, mathematical accuracy, and privacy. Zero tracking and no client-data harvesting.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            id="footer-back-to-top-btn"
            aria-label="Back to top"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-bold transition-all hover:scale-105 shadow-md shadow-black/20 group cursor-pointer"
          >
            <span>Back to Top</span>
            <div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
