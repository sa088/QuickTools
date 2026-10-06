import React, { useState, useMemo, useEffect } from 'react';
import { 
  Receipt, 
  Info, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Building2, 
  Sliders, 
  Calendar, 
  Percent, 
  Coins 
} from 'lucide-react';
import { saveRecentCalculation } from '@/lib/recentCalculations';
import { ShareResultButton } from './ShareResultButton';
import { DownloadPdfButton } from './DownloadPdfButton';

interface SlabItem {
  min: number;
  max: number | null;
  rate: number;
  fixed: number;
  label: string;
}

interface TaxYearConfig {
  title: string;
  authority: string;
  exemptionLimit: number;
  slabs: SlabItem[];
  surcharge?: {
    threshold: number;
    rate: number;
  };
}

const DEFAULT_TAX_YEARS: Record<string, TaxYearConfig> = {
  '2026-2027': {
    title: 'Tax Year 2026–2027 (Section 149 Salary - Finance Act 2026)',
    authority: 'Federal Board of Revenue (FBR) Pakistan - WHT Card 2027',
    exemptionLimit: 600000,
    slabs: [
      { min: 0, max: 600000, rate: 0, fixed: 0, label: 'Up to Rs 600,000 (0% Tax-Exempt)' },
      { min: 600000, max: 1200000, rate: 0.01, fixed: 0, label: 'Rs 600,001 – 1,200,000: 1% of amount exceeding Rs 600,000' },
      { min: 1200000, max: 2200000, rate: 0.11, fixed: 6000, label: 'Rs 1,200,001 – 2,200,000: Rs 6,000 + 11% exceeding Rs 1.2M' },
      { min: 2200000, max: 3200000, rate: 0.20, fixed: 116000, label: 'Rs 2,200,001 – 3,200,000: Rs 116,000 + 20% exceeding Rs 2.2M' },
      { min: 3200000, max: 4100000, rate: 0.25, fixed: 316000, label: 'Rs 3,200,001 – 4,100,000: Rs 316,000 + 25% exceeding Rs 3.2M' },
      { min: 4100000, max: 5600000, rate: 0.29, fixed: 541000, label: 'Rs 4,100,001 – 5,600,000: Rs 541,000 + 29% exceeding Rs 4.1M' },
      { min: 5600000, max: 7000000, rate: 0.32, fixed: 976000, label: 'Rs 5,600,001 – 7,000,000: Rs 976,000 + 32% exceeding Rs 5.6M' },
      { min: 7000000, max: Infinity, rate: 0.35, fixed: 1424000, label: 'Exceeding Rs 7,000,000: Rs 1,424,000 + 35% exceeding Rs 7.0M' },
    ],
    surcharge: {
      threshold: Infinity,
      rate: 0,
    },
  },
  '2025-2026': {
    title: 'Tax Year 2025–2026 (Finance Act 2025)',
    authority: 'Federal Board of Revenue (FBR) Pakistan',
    exemptionLimit: 600000,
    slabs: [
      { min: 0, max: 600000, rate: 0, fixed: 0, label: 'Up to Rs 600,000 (0% Tax-Exempt)' },
      { min: 600000, max: 1200000, rate: 0.01, fixed: 0, label: 'Rs 600,001 – 1,200,000: 1% of amount exceeding Rs 600,000' },
      { min: 1200000, max: 2200000, rate: 0.11, fixed: 6000, label: 'Rs 1,200,001 – 2,200,000: Rs 6,000 + 11% exceeding Rs 1.2M' },
      { min: 2200000, max: 3200000, rate: 0.23, fixed: 116000, label: 'Rs 2,200,001 – 3,200,000: Rs 116,000 + 23% exceeding Rs 2.2M' },
      { min: 3200000, max: 4100000, rate: 0.30, fixed: 346000, label: 'Rs 3,200,001 – 4,100,000: Rs 346,000 + 30% exceeding Rs 3.2M' },
      { min: 4100000, max: Infinity, rate: 0.35, fixed: 616000, label: 'Exceeding Rs 4,100,000: Rs 616,000 + 35% exceeding Rs 4.1M' },
    ],
    surcharge: {
      threshold: 10000000,
      rate: 0.09,
    },
  },
  '2024-2025': {
    title: 'Tax Year 2024–2025 (Finance Act 2024)',
    authority: 'Federal Board of Revenue (FBR) Pakistan',
    exemptionLimit: 600000,
    slabs: [
      { min: 0, max: 600000, rate: 0, fixed: 0, label: 'Up to Rs 600,000 (0% Tax-Exempt)' },
      { min: 600000, max: 1200000, rate: 0.05, fixed: 0, label: 'Rs 600,001 – 1,200,000: 5% of amount exceeding Rs 600,000' },
      { min: 1200000, max: 2200000, rate: 0.15, fixed: 30000, label: 'Rs 1,200,001 – 2,200,000: Rs 30,000 + 15% exceeding Rs 1.2M' },
      { min: 2200000, max: 3200000, rate: 0.25, fixed: 180000, label: 'Rs 2,200,001 – 3,200,000: Rs 180,000 + 25% exceeding Rs 2.2M' },
      { min: 3200000, max: 4100000, rate: 0.30, fixed: 430000, label: 'Rs 3,200,001 – 4,100,000: Rs 430,000 + 30% exceeding Rs 3.2M' },
      { min: 4100000, max: Infinity, rate: 0.35, fixed: 700000, label: 'Exceeding Rs 4,100,000: Rs 700,000 + 35% exceeding Rs 4.1M' },
    ],
    surcharge: {
      threshold: 10000000,
      rate: 0.10,
    },
  },
};

type FiscalYearKey = '2026-2027' | '2025-2026' | '2024-2025' | 'custom';

export function IncomeTaxCalculatorTool() {
  const [fiscalYear, setFiscalYear] = useState<FiscalYearKey>('2026-2027');
  const [salaryInput, setSalaryInput] = useState<number | string>(175000);
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [copied, setCopied] = useState(false);
  const [manualMode, setManualMode] = useState<'percentage' | 'fixedAmount'>('percentage');
  const [customTaxPercent, setCustomTaxPercent] = useState<number | string>(7.5);
  const [customFixedAmount, setCustomFixedAmount] = useState<number | string>(12000);
  const [customPeriod, setCustomPeriod] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const sal = sp.get('salary');
      if (sal) setSalaryInput(Number(sal) || 175000);
      const p = sp.get('period');
      if (p === 'monthly' || p === 'annual') setPeriod(p);
      const yr = sp.get('year') as FiscalYearKey;
      if (yr && (yr in DEFAULT_TAX_YEARS || yr === 'custom')) setFiscalYear(yr);
    } catch {}
  }, []);

  const rawSalary = Number(salaryInput) || 0;
  const annualSalary = period === 'monthly' ? rawSalary * 12 : rawSalary;
  const monthlySalary = period === 'monthly' ? rawSalary : rawSalary / 12;

  const { annualTax, monthlyTax, slabInfo, effectiveRate, slabNumber, activeSlabsList } = useMemo(() => {
    if (fiscalYear === 'custom') {
      let tax = 0;
      let desc = '';
      if (manualMode === 'percentage') {
        const p = Number(customTaxPercent) || 0;
        tax = annualSalary * (p / 100);
        desc = `Manual Custom Rate: ${p}% flat tax applied to gross salary`;
      } else {
        const amt = Number(customFixedAmount) || 0;
        tax = customPeriod === 'monthly' ? amt * 12 : amt;
        desc = `Manual Fixed Tax: PKR ${amt.toLocaleString()} (${customPeriod}) override`;
      }
      const mTax = tax / 12;
      const rate = annualSalary > 0 ? (tax / annualSalary) * 100 : 0;
      return {
        annualTax: Math.round(tax),
        monthlyTax: Math.round(mTax),
        slabInfo: desc,
        effectiveRate: rate,
        slabNumber: 0,
        activeSlabsList: [],
      };
    }

    const config = DEFAULT_TAX_YEARS[fiscalYear] || DEFAULT_TAX_YEARS['2026-2027'];
    const slabs = config.slabs;
    let computedTax = 0;
    let desc = '';
    let foundIndex = 0;

    for (let i = 0; i < slabs.length; i++) {
      const s = slabs[i];
      const slabMax = (s.max === null || s.max === undefined) ? Infinity : s.max;
      const slabMin = s.min ?? 0;
      const slabFixed = s.fixed ?? 0;
      const slabRate = s.rate ?? 0;

      if (annualSalary <= slabMax) {
        foundIndex = i + 1;
        const taxablePortion = Math.max(0, annualSalary - slabMin);
        computedTax = slabFixed + taxablePortion * slabRate;

        if (slabRate === 0) {
          desc = `Slab ${foundIndex}: Up to Rs ${(slabMax === Infinity ? 'Limit' : slabMax.toLocaleString())} is 100% Tax-Exempt (0% Tax)`;
        } else if (slabFixed > 0) {
          desc = `Slab ${foundIndex}: Rs ${slabFixed.toLocaleString()} + ${(slabRate * 100).toFixed(1)}% of amount exceeding Rs ${slabMin.toLocaleString()}`;
        } else {
          desc = `Slab ${foundIndex}: ${(slabRate * 100).toFixed(1)}% of amount exceeding Rs ${slabMin.toLocaleString()}`;
        }
        break;
      }
    }

    if (config.surcharge && config.surcharge.threshold && annualSalary > config.surcharge.threshold && config.surcharge.rate > 0) {
      const surchargeVal = computedTax * config.surcharge.rate;
      computedTax += surchargeVal;
      desc += ` (Includes ${(config.surcharge.rate * 100).toFixed(0)}% Super Tax Surcharge on income above Rs ${(config.surcharge.threshold / 1000000).toFixed(0)}M)`;
    }

    const mTax = computedTax / 12;
    const rate = annualSalary > 0 ? (computedTax / annualSalary) * 100 : 0;

    return {
      annualTax: Math.round(computedTax),
      monthlyTax: Math.round(mTax),
      slabInfo: desc,
      effectiveRate: rate,
      slabNumber: foundIndex,
      activeSlabsList: slabs,
    };
  }, [annualSalary, fiscalYear, manualMode, customTaxPercent, customFixedAmount, customPeriod]);

  const monthlyTakeHome = Math.max(0, monthlySalary - monthlyTax);
  const annualTakeHome = Math.max(0, annualSalary - annualTax);

  useEffect(() => {
    if (rawSalary > 0) {
      saveRecentCalculation({
        id: 'income-tax-calculator',
        name: 'Income Tax Calculator (Pakistan)',
        href: '/income-tax-calculator',
        iconName: 'Receipt',
        category: 'Financial',
        summary: `Gross: PKR ${Math.round(monthlySalary).toLocaleString()}/mo • Tax: PKR ${monthlyTax.toLocaleString()} (Take-Home: PKR ${Math.round(monthlyTakeHome).toLocaleString()})`,
        tag: fiscalYear === 'custom' ? 'Manual Override' : `FY ${fiscalYear}`,
        gradient: 'from-rose-500 to-red-700',
      });
    }
  }, [monthlySalary, monthlyTax, monthlyTakeHome, fiscalYear, rawSalary]);

  const copyResult = () => {
    const text = `Pakistan FBR Income Tax Calculation (${fiscalYear === 'custom' ? 'Custom Override' : `FY ${fiscalYear}`}):
- Monthly Gross: PKR ${Math.round(monthlySalary).toLocaleString()}
- Monthly Tax: PKR ${monthlyTax.toLocaleString()}
- Monthly Take-Home: PKR ${Math.round(monthlyTakeHome).toLocaleString()}
- Annual Gross: PKR ${Math.round(annualSalary).toLocaleString()}
- Annual Tax: PKR ${annualTax.toLocaleString()}
- Effective Tax Rate: ${effectiveRate.toFixed(2)}%
- Bracket: ${slabInfo}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold tracking-wider uppercase text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Official FBR Pakistan Tax Engine
              </span>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                {fiscalYear === 'custom' ? 'Custom Tax Mode' : `FY ${fiscalYear} Slabs`}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pakistan Salary Income Tax Calculator
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Accurate withholding tax deduction under Section 149 of Income Tax Ordinance, updated for FY 2026–27, FY 2025–26, and custom modes.
            </p>
          </div>
        </div>

        {/* Fiscal Year & Manual Selection Tabs */}
        <div className="mb-6 space-y-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Select Tax Year (Current, Upcoming, Historical) or Custom Override:
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/80 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              id="btn-fy-26-27"
              onClick={() => setFiscalYear('2026-2027')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                fiscalYear === '2026-2027'
                  ? 'bg-rose-600 text-white shadow-xs scale-102'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>FY 2026–27 (Latest FBR)</span>
              <span className="text-[10px] bg-rose-700 text-white px-1.5 py-0.5 rounded-full uppercase">New</span>
            </button>
            <button
              type="button"
              id="btn-fy-25-26"
              onClick={() => setFiscalYear('2025-2026')}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                fiscalYear === '2025-2026'
                  ? 'bg-rose-600 text-white shadow-xs scale-102'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              FY 2025–26 (Active)
            </button>
            <button
              type="button"
              id="btn-fy-24-25"
              onClick={() => setFiscalYear('2024-2025')}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                fiscalYear === '2024-2025'
                  ? 'bg-rose-600 text-white shadow-xs scale-102'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              FY 2024–25
            </button>
            <button
              type="button"
              id="btn-fy-custom"
              onClick={() => setFiscalYear('custom')}
              className={`px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 ml-auto cursor-pointer ${
                fiscalYear === 'custom'
                  ? 'bg-amber-600 text-white shadow-xs scale-102'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Manual / Custom Mode</span>
            </button>
          </div>
        </div>

        {/* Manual Custom Controls Box */}
        {fiscalYear === 'custom' && (
          <div className="mb-6 p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 dark:border-amber-800/80 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  Manual Tax Configuration
                </span>
                <p className="text-xs text-amber-800 dark:text-amber-400 mt-0.5">
                  Directly customize either the tax percentage (%) or the exact tax amount (PKR).
                </p>
              </div>
              <div className="inline-flex rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 p-1 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setManualMode('percentage')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    manualMode === 'percentage'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-amber-900 dark:text-amber-300 hover:text-amber-950'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  Tax Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setManualMode('fixedAmount')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    manualMode === 'fixedAmount'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-amber-900 dark:text-amber-300 hover:text-amber-950'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  Fixed Amount (PKR)
                </button>
              </div>
            </div>

            {manualMode === 'percentage' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-1.5">
                  <label htmlFor="custom-pct-input" className="block text-xs font-bold text-amber-950 dark:text-amber-300">
                    Custom Tax Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      id="custom-pct-input"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={customTaxPercent}
                      onChange={(e) => setCustomTaxPercent(e.target.value)}
                      placeholder="e.g. 7.5"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 font-mono font-bold text-amber-950 dark:text-amber-200 focus:border-amber-600 focus:outline-hidden"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-amber-700 dark:text-amber-400 text-sm">%</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 mr-1">Presets:</span>
                  {[2.5, 5, 7.5, 10, 12.5, 15, 20, 25].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setCustomTaxPercent(pct)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        Number(customTaxPercent) === pct
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 hover:bg-amber-100 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-1.5">
                  <label htmlFor="custom-amt-input" className="block text-xs font-bold text-amber-950 dark:text-amber-300">
                    Exact Tax Amount (PKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-amber-700 dark:text-amber-400 text-xs">PKR</span>
                    <input
                      id="custom-amt-input"
                      type="number"
                      min="0"
                      value={customFixedAmount}
                      onChange={(e) => setCustomFixedAmount(e.target.value)}
                      placeholder="e.g. 12000"
                      className="w-full pl-14 pr-4 py-2.5 rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 font-mono font-bold text-amber-950 dark:text-amber-200 focus:border-amber-600 focus:outline-hidden"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-amber-950 dark:text-amber-300">
                    Amount Specified As:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomPeriod('monthly')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        customPeriod === 'monthly'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      Per Month
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomPeriod('annual')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        customPeriod === 'annual'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      Per Year
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input & Mode Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 items-end">
          <div className="md:col-span-8 space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="salary-amount-input" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Enter {period === 'monthly' ? 'Monthly Gross Salary (PKR)' : 'Annual Gross Salary (PKR)'}
              </label>
              <span className="text-xs text-rose-700 dark:text-rose-400 font-bold font-mono">
                {period === 'monthly' ? `Annual: PKR ${Math.round(annualSalary).toLocaleString()}` : `Monthly: PKR ${Math.round(monthlySalary).toLocaleString()}`}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-slate-400 text-base">
                PKR
              </span>
              <input
                id="salary-amount-input"
                type="number"
                min="0"
                value={salaryInput}
                onChange={(e) => setSalaryInput(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 175000"
                className="w-full pl-16 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono text-xl md:text-2xl font-black focus:bg-white dark:focus:bg-slate-850 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 dark:focus:ring-rose-950 transition-all outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mr-1">Quick Select:</span>
              {[60000, 100000, 150000, 175000, 250000, 350000, 500000, 1000000].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setPeriod('monthly');
                    setSalaryInput(s);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition-all cursor-pointer ${
                    period === 'monthly' && Number(salaryInput) === s
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {(s / 1000).toFixed(0)}k/mo
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-end space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Calculation Basis
            </label>
            <div className="grid grid-cols-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5">
              <button
                type="button"
                onClick={() => setPeriod('monthly')}
                className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  period === 'monthly'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Monthly Salary
              </button>
              <button
                type="button"
                onClick={() => setPeriod('annual')}
                className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  period === 'annual'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Annual Salary
              </button>
            </div>
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Take-Home */}
          <div className="p-6 md:p-7 rounded-3xl bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Net Take-Home Pay
              </span>
              <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                Monthly in Hand
              </span>
            </div>
            <div>
              <p className="text-xs text-emerald-100 font-medium">After Full FBR Withholding Tax:</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight mt-1 text-white">
                PKR {Math.round(monthlyTakeHome).toLocaleString()}
              </p>
            </div>
            <div className="space-y-2 pt-4 mt-4 border-t border-white/20 text-xs font-mono text-emerald-50">
              <div className="flex justify-between">
                <span>Gross Monthly Salary:</span>
                <span className="font-bold text-white">PKR {Math.round(monthlySalary).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-200">
                <span>Monthly Tax Deducted:</span>
                <span className="font-bold">- PKR {monthlyTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>Annual Net Take-Home:</span>
                <span className="font-bold text-white">PKR {Math.round(annualTakeHome).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Annual Tax Liability */}
          <div className="p-6 md:p-7 rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-zinc-900 text-white shadow-md relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Tax Liability
              </span>
              <span className="text-xs font-mono font-bold bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 rounded-full text-rose-300">
                {fiscalYear === 'custom' ? 'Manual Rate' : `FY ${fiscalYear}`}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Annual Tax:</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight mt-1 text-rose-400">
                PKR {annualTax.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2 pt-4 mt-4 border-t border-slate-700 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span>Annual Gross Salary:</span>
                <span className="font-bold text-white">PKR {Math.round(annualSalary).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Effective Tax Rate:</span>
                <span className="font-bold text-emerald-400">{effectiveRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax Breakdown Status:</span>
                <span className="font-bold text-white">
                  {annualTax === 0 ? 'Tax-Exempt' : `${effectiveRate.toFixed(1)}% effective`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Bracket Details Box */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950 dark:text-amber-300">
                {fiscalYear === 'custom' ? 'Active Custom Settings: ' : `Active Tax Bracket (Slab ${slabNumber}): `}
              </span>
              <span className="text-amber-900 dark:text-amber-300 font-medium">{slabInfo}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              id="copy-tax-breakdown-btn"
              onClick={copyResult}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-100 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700 shadow-xs flex items-center gap-1.5 transition-colors text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-700" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <DownloadPdfButton
              buttonLabel="Tax PDF Report"
              variant="secondary"
              getReportOptions={() => ({
                title: 'Pakistan Salary Income Tax Assessment Report',
                subtitle: `Section 149 Withholding Tax (Salary) - ${fiscalYear === 'custom' ? 'Custom Tax Mode' : `Tax Year ${fiscalYear}`}`,
                category: 'tax',
                filename: `QuickTools_FBR_Income_Tax_${fiscalYear}_${Math.round(monthlySalary)}.pdf`,
                summaryCards: [
                  {
                    title: 'Net Monthly Take-Home',
                    value: `PKR ${Math.round(monthlyTakeHome).toLocaleString()}`,
                    subtitle: `Annual: PKR ${Math.round(annualTakeHome).toLocaleString()}`,
                    type: 'primary',
                  },
                  {
                    title: 'Monthly Tax Deduction',
                    value: `PKR ${monthlyTax.toLocaleString()}`,
                    subtitle: `Annual: PKR ${annualTax.toLocaleString()}`,
                    type: 'secondary',
                  },
                  {
                    title: 'Gross Salary',
                    value: `PKR ${Math.round(monthlySalary).toLocaleString()}/mo`,
                    subtitle: `Annual: PKR ${Math.round(annualSalary).toLocaleString()}`,
                    type: 'neutral',
                  },
                  {
                    title: 'Effective Tax Rate',
                    value: `${effectiveRate.toFixed(2)}%`,
                    subtitle: slabInfo.split(':')[0] || 'Active Bracket',
                    type: 'neutral',
                  },
                ],
                inputParameters: [
                  { label: 'Gross Salary Input', value: `PKR ${Number(salaryInput || 0).toLocaleString()}` },
                  { label: 'Salary Basis', value: period === 'monthly' ? 'Monthly Salary' : 'Annual Salary' },
                  { label: 'Tax Year / Regime', value: fiscalYear === 'custom' ? 'Custom Mode' : `FY ${fiscalYear}` },
                  { label: 'Regulatory Authority', value: 'Federal Board of Revenue (FBR)' },
                  { label: 'Annual Gross Equivalent', value: `PKR ${Math.round(annualSalary).toLocaleString()}` },
                  { label: 'Active Slab / Bracket', value: `Slab ${slabNumber}` },
                ],
                detailedTables: [
                  {
                    title: 'Monthly & Annual Salary Take-Home Breakdown',
                    head: ['Salary Component', 'Monthly Value (PKR)', 'Annual Value (PKR)', 'Percentage'],
                    body: [
                      ['Gross Salary', `PKR ${Math.round(monthlySalary).toLocaleString()}`, `PKR ${Math.round(annualSalary).toLocaleString()}`, '100.0%'],
                      ['Income Tax Deducted (WHT)', `PKR ${monthlyTax.toLocaleString()}`, `PKR ${annualTax.toLocaleString()}`, `${effectiveRate.toFixed(2)}%`],
                      ['Net Take-Home Pay (In-Hand)', `PKR ${Math.round(monthlyTakeHome).toLocaleString()}`, `PKR ${Math.round(annualTakeHome).toLocaleString()}`, `${(100 - effectiveRate).toFixed(2)}%`],
                    ],
                    notes: `Applicable Formula: ${slabInfo}`,
                  },
                ],
                notesAndDisclaimers: [
                  'Tax computation is based on Section 149 of the Pakistan Income Tax Ordinance 2001 (Finance Act).',
                  'Employers are required to deduct withholding tax in 12 equal monthly installments from employee salary.',
                  'This assessment does not include tax credits for donations (Sec 61), investments (Sec 62), or health insurance.',
                  'For official tax returns and Iris portal e-filing, consult a licensed tax practitioner or chartered accountant.',
                ],
              })}
            />
            <ShareResultButton
              title={`Pakistan FBR Income Tax Breakdown (PKR ${Math.round(monthlySalary).toLocaleString()}/mo) - QuickTools`}
              outcomeText={`Gross Monthly: PKR ${Math.round(monthlySalary).toLocaleString()}\nMonthly Tax: PKR ${monthlyTax.toLocaleString()} (Effective: ${effectiveRate.toFixed(1)}%)\nNet Take-Home: PKR ${Math.round(monthlyTakeHome).toLocaleString()}\nAnnual Tax: PKR ${annualTax.toLocaleString()}\nTax Slab: ${slabInfo}`}
              toolName="Income Tax Calculator"
              params={{
                salary: rawSalary,
                period,
                year: fiscalYear,
              }}
            />
          </div>
        </div>

        {/* Official Slabs Reference Table */}
        {fiscalYear !== 'custom' && activeSlabsList.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-rose-600" />
                  Official Salaried Tax Slabs (Tax Year {fiscalYear})
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Reference: Section 149 Withholding Tax Rates Card & Finance Act provisions
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 self-start">
                Active Slab: #{slabNumber}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 font-bold">
                  <tr>
                    <th className="p-3 w-16">Slab</th>
                    <th className="p-3">Annual Taxable Income Range</th>
                    <th className="p-3">Prescribed Tax Rate & Calculation</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {activeSlabsList.map((slab, idx) => {
                    const isCurrent = slabNumber === idx + 1;
                    const slabMin = slab.min ?? 0;
                    const slabMax = (slab.max === null || slab.max === undefined) ? Infinity : slab.max;
                    const slabFixed = slab.fixed ?? 0;
                    const slabRate = slab.rate ?? 0;
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isCurrent
                            ? 'bg-rose-50/90 dark:bg-rose-950/40 font-bold text-rose-950 dark:text-rose-200 border-l-4 border-l-rose-600'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="p-3 font-bold text-slate-900 dark:text-white">Slab {idx + 1}</td>
                        <td className="p-3">
                          {slabMin === 0
                            ? `Up to Rs ${slabMax === Infinity ? 'Limit' : slabMax.toLocaleString()}`
                            : slabMax === Infinity
                            ? `Exceeding Rs ${slabMin.toLocaleString()}`
                            : `Rs ${(slabMin + 1).toLocaleString()} to Rs ${slabMax.toLocaleString()}`}
                        </td>
                        <td className="p-3">
                          {slabRate === 0 ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">0% (Completely Tax-Exempt)</span>
                          ) : slabFixed > 0 ? (
                            <span>Rs {slabFixed.toLocaleString()} + {(slabRate * 100).toFixed(0)}% exceeding Rs {slabMin.toLocaleString()}</span>
                          ) : (
                            <span>{(slabRate * 100).toFixed(0)}% exceeding Rs {slabMin.toLocaleString()}</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                              <Check className="w-3 h-3" /> Your Bracket
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
