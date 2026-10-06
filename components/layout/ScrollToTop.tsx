import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      id="global-floating-back-to-top"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 px-3.5 py-3 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white shadow-xl shadow-indigo-900/30 border border-indigo-400/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
    >
      <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
        <ArrowUp className="w-4 h-4 text-white group-hover:-translate-y-0.5 transition-transform" />
      </div>
      <span className="text-xs font-bold hidden sm:inline tracking-wide">Back to Top</span>
    </button>
  );
}
