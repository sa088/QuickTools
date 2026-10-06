import React from 'react';
import { AlertCircle } from 'lucide-react';

export function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Disclaimer</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last Updated: 2026</p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 dark:text-amber-300 font-medium">
          The information, formulas, and calculations provided on QuickTools are for educational and estimation purposes only. They do not constitute certified financial, tax, legal, or medical advice.
        </p>
      </div>

      <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Financial and Tax Calculators</h2>
      <p>
        Calculations for Income Tax (FBR Pakistan), Loans, Compound Interest, and Currency Exchange are estimates based on standard published formulas and mid-market rates. For formal filings, consult a certified tax practitioner, chartered accountant, or bank representative.
      </p>

      <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Zakat Calculation</h2>
      <p>
        The Zakat calculator uses canonical Nisab guidelines for gold (87.48g) and silver (612.36g). Because bullion market values fluctuate throughout the day, users may manually adjust the per-gram market rate for utmost precision.
      </p>

      <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Health & BMI Calculations</h2>
      <p>
        The BMI calculator is based on World Health Organization (WHO) reference classifications. BMI is a screening metric and does not account for muscle mass, bone density, or individual clinical conditions. Consult a healthcare professional for clinical health assessments.
      </p>
    </div>
  );
}
