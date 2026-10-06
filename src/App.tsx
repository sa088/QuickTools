import React, { useState, useEffect } from 'react';
import { TickerBar } from '@/components/layout/TickerBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

import { HomePage } from '@/components/pages/HomePage';
import { ToolPageWrapper } from '@/components/pages/ToolPageWrapper';
import { AboutPage } from '@/components/pages/AboutPage';
import { ContactPage } from '@/components/pages/ContactPage';
import { DisclaimerPage } from '@/components/pages/DisclaimerPage';
import { PrivacyPolicyPage } from '@/components/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from '@/components/pages/TermsOfServicePage';

// Route normalizer
function normalizePath(path: string): string {
  if (!path || path === '' || path === '/') return '/';
  // Strip trailing slashes
  const clean = path.replace(/\/+$/, '');
  
  // Friendly redirects / aliases
  switch (clean) {
    case '/zakat':
      return '/zakat-calculator';
    case '/tax':
    case '/tax-calculator':
    case '/income-tax':
      return '/income-tax-calculator';
    case '/loan':
    case '/loan-calculator':
    case '/emi':
    case '/emi-calculator':
      return '/loan-emi-calculator';
    case '/currency':
      return '/currency-converter';
    case '/bmi':
      return '/bmi-calculator';
    case '/discount':
      return '/discount-calculator';
    case '/percent':
    case '/percentage':
      return '/percentage-calculator';
    case '/unit':
    case '/units':
      return '/unit-converter';
    case '/age':
      return '/age-calculator';
    case '/compound-interest-calculator':
    case '/compound':
      return '/compound-interest';

    // PDF Aliases
    case '/pdf':
    case '/merge-pdf':
    case '/split-pdf':
    case '/compress-pdf':
      return '/pdf-tools';
    case '/docx-to-pdf':
    case '/doc-to-pdf':
      return '/word-to-pdf';
    case '/pdf-to-doc':
    case '/pdf-to-docx':
      return '/pdf-to-word';
    case '/xlsx-to-pdf':
    case '/sheet-to-pdf':
    case '/spreadsheet-to-pdf':
      return '/excel-to-pdf';
    case '/pdf-to-xlsx':
    case '/pdf-to-sheet':
      return '/pdf-to-excel';
    case '/pdf-to-jpeg':
    case '/pdf-to-image':
      return '/pdf-to-jpg';
    case '/image-to-pdf':
    case '/png-to-pdf':
      return '/jpg-to-pdf';

    // Image Aliases
    case '/jpg-to-png':
    case '/png-to-jpg':
    case '/webp-to-jpg':
    case '/convert-image':
      return '/image-converter';
    case '/resize-image':
    case '/compress-image':
      return '/image-compressor';
    case '/remove-bg':
    case '/transparent-png':
      return '/background-remover';

    // Text Aliases
    case '/character-counter':
    case '/word-count':
      return '/word-counter';
    case '/case':
    case '/title-case':
      return '/case-converter';

    // Generator Aliases
    case '/password':
    case '/passwords':
      return '/password-generator';
    case '/qr':
    case '/qrcode':
      return '/qr-code-generator';
    case '/uuid':
    case '/guid':
    case '/random-number-generator':
    case '/random':
      return '/uuid-generator';

    // Developer Aliases
    case '/json':
    case '/json-validator':
    case '/json-beautifier':
      return '/json-formatter';
    case '/url':
    case '/base64':
      return '/url-encoder';
    case '/regex':
      return '/regex-tester';

    // Design Aliases
    case '/hex-to-rgb':
    case '/contrast-checker':
      return '/color-picker';
    case '/gradient':
    case '/color-palette':
    case '/palette':
      return '/gradient-generator';

    default:
      return clean;
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  const navigate = (to: string) => {
    if (typeof window === 'undefined') return;
    const urlObj = new URL(to, window.location.origin);
    const normalized = normalizePath(urlObj.pathname);
    window.history.pushState({}, '', to);
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update document title for home/info pages
  useEffect(() => {
    if (currentPath === '/') {
      document.title = 'QuickTools - Fast Online Tools & Daily Utilities';
    } else if (currentPath === '/about') {
      document.title = 'About QuickTools - Fast Online Tools';
    } else if (currentPath === '/contact') {
      document.title = 'Contact & Feedback - QuickTools';
    } else if (currentPath === '/privacy-policy') {
      document.title = 'Privacy Policy - QuickTools';
    } else if (currentPath === '/terms-of-service') {
      document.title = 'Terms of Service - QuickTools';
    } else if (currentPath === '/disclaimer') {
      document.title = 'Financial & Calculation Disclaimer - QuickTools';
    }
  }, [currentPath]);

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      
      // Financial
      case '/zakat-calculator':
        return <ToolPageWrapper toolId="zakat-calculator" onNavigate={navigate} />;
      case '/income-tax-calculator':
        return <ToolPageWrapper toolId="income-tax-calculator" onNavigate={navigate} />;
      case '/loan-emi-calculator':
        return <ToolPageWrapper toolId="loan-emi-calculator" onNavigate={navigate} />;
      case '/currency-converter':
        return <ToolPageWrapper toolId="currency-converter" onNavigate={navigate} />;
      case '/compound-interest':
        return <ToolPageWrapper toolId="compound-interest" onNavigate={navigate} />;

      // Everyday & Math
      case '/percentage-calculator':
        return <ToolPageWrapper toolId="percentage-calculator" onNavigate={navigate} />;
      case '/discount-calculator':
        return <ToolPageWrapper toolId="discount-calculator" onNavigate={navigate} />;

      // Health
      case '/bmi-calculator':
        return <ToolPageWrapper toolId="bmi-calculator" onNavigate={navigate} />;
      case '/age-calculator':
        return <ToolPageWrapper toolId="age-calculator" onNavigate={navigate} />;

      // Converters
      case '/unit-converter':
        return <ToolPageWrapper toolId="unit-converter" onNavigate={navigate} />;

      // PDF Tools
      case '/word-to-pdf':
        return <ToolPageWrapper toolId="word-to-pdf" onNavigate={navigate} />;
      case '/pdf-to-word':
        return <ToolPageWrapper toolId="pdf-to-word" onNavigate={navigate} />;
      case '/excel-to-pdf':
        return <ToolPageWrapper toolId="excel-to-pdf" onNavigate={navigate} />;
      case '/pdf-to-excel':
        return <ToolPageWrapper toolId="pdf-to-excel" onNavigate={navigate} />;
      case '/pdf-to-jpg':
        return <ToolPageWrapper toolId="pdf-to-jpg" onNavigate={navigate} />;
      case '/pdf-tools':
        return <ToolPageWrapper toolId="pdf-tools" onNavigate={navigate} />;
      case '/jpg-to-pdf':
        return <ToolPageWrapper toolId="jpg-to-pdf" onNavigate={navigate} />;

      // Image Tools
      case '/image-converter':
        return <ToolPageWrapper toolId="image-converter" onNavigate={navigate} />;
      case '/image-compressor':
        return <ToolPageWrapper toolId="image-compressor" onNavigate={navigate} />;
      case '/background-remover':
        return <ToolPageWrapper toolId="background-remover" onNavigate={navigate} />;

      // Text Tools
      case '/word-counter':
        return <ToolPageWrapper toolId="word-counter" onNavigate={navigate} />;
      case '/case-converter':
        return <ToolPageWrapper toolId="case-converter" onNavigate={navigate} />;

      // Generators
      case '/password-generator':
        return <ToolPageWrapper toolId="password-generator" onNavigate={navigate} />;
      case '/qr-code-generator':
        return <ToolPageWrapper toolId="qr-code-generator" onNavigate={navigate} />;
      case '/uuid-generator':
        return <ToolPageWrapper toolId="uuid-generator" onNavigate={navigate} />;

      // Developer Tools
      case '/json-formatter':
        return <ToolPageWrapper toolId="json-formatter" onNavigate={navigate} />;
      case '/url-encoder':
        return <ToolPageWrapper toolId="url-encoder" onNavigate={navigate} />;
      case '/regex-tester':
        return <ToolPageWrapper toolId="regex-tester" onNavigate={navigate} />;

      // Design Tools
      case '/color-picker':
        return <ToolPageWrapper toolId="color-picker" onNavigate={navigate} />;
      case '/gradient-generator':
        return <ToolPageWrapper toolId="gradient-generator" onNavigate={navigate} />;

      // Informational & Legal Pages
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/disclaimer':
        return <DisclaimerPage />;
      case '/privacy-policy':
        return <PrivacyPolicyPage />;
      case '/terms-of-service':
        return <TermsOfServicePage />;

      // 404 fallback
      default:
        return (
          <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full text-center space-y-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60">
                404 Not Found
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Tool Not Found</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">The tool or page you requested does not exist.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
              >
                Back to All Tools
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-600 selection:text-white transition-colors duration-150">
      <TickerBar onNavigate={navigate} />
      <Navbar onNavigate={navigate} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer onNavigate={navigate} />
      <ScrollToTop />
    </div>
  );
}
