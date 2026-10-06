import React from 'react';
import { Lock } from 'lucide-react';

export function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your privacy is fundamental to our platform.</p>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
        <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-900 dark:text-emerald-300 font-medium">
          QuickTools does not store, collect, or transmit any numbers, financial assets, salaries, debts, or health metrics entered into our calculators.
        </p>
      </div>

      <h2 className="text-base font-bold text-slate-900 dark:text-white">Client-Side Processing</h2>
      <p>
        Every computation executed on QuickTools is carried out entirely within your browser&apos;s JavaScript engine. Your inputs never reach our backend servers.
      </p>

      <h2 className="text-base font-bold text-slate-900 dark:text-white">Cookies & Analytics</h2>
      <p>
        We do not use invasive tracking cookies or data broker analytics. Calculation history is stored strictly on your local browser device via HTML5 LocalStorage and can be cleared at any time with one click.
      </p>
    </div>
  );
}
