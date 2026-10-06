import React from 'react';
import { ShieldCheck, Zap, Heart } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">About QuickTools</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Our mission: Precision calculations made simple, instant, and private.</p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <p>
          <strong className="text-slate-900 dark:text-white">QuickTools</strong> was created to provide individuals, students, professionals, and businesses with a comprehensive, fast, and 100% free suite of online calculators.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">Why QuickTools?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Instant In-Browser</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Every calculation happens right in your browser. No server lag, no waiting.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Authentic Standards</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Formulated in accordance with Pakistan FBR FY 2025–26 & 2026–27, Islamic Fiqh for Zakat, and WHO BMI parameters.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400 mb-2" />
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Always Free & Private</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Free forever with zero registration barriers, no paywalls, zero ads, and strict privacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
