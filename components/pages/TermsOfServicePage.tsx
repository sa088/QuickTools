import React from 'react';

export function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Terms governing the use of QuickTools.</p>
      </div>

      <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
      <p>
        By accessing or using QuickTools, you agree to comply with these terms. If you do not agree, please do not use the service.
      </p>

      <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Free Use License</h2>
      <p>
        QuickTools grants you a personal, non-exclusive, non-transferable license to use the calculators for personal and commercial estimation purposes.
      </p>

      <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Accuracy of Calculations</h2>
      <p>
        While we strive for mathematical precision and align our tools with official standards, QuickTools is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind.
      </p>
    </div>
  );
}
