import React, { useState, useEffect } from 'react';
import { Percent, Check, Copy } from 'lucide-react';
import { saveRecentCalculation } from '@/lib/recentCalculations';
import { ShareResultButton } from './ShareResultButton';

export function PercentageCalculatorTool() {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<number | string>(15);
  const [m1Y, setM1Y] = useState<number | string>(250);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const x = sp.get('x');
      if (x) setM1X(Number(x) || 15);
      const y = sp.get('y');
      if (y) setM1Y(Number(y) || 250);
    } catch {}
  }, []);

  // Mode 2: X is what percent of Y?
  const [m2X, setM2X] = useState<number | string>(75);
  const [m2Y, setM2Y] = useState<number | string>(300);

  // Mode 3: Percentage increase / decrease from X to Y
  const [m3X, setM3X] = useState<number | string>(150);
  const [m3Y, setM3Y] = useState<number | string>(195);

  // Mode 4: Add / Subtract X% to Y
  const [m4X, setM4X] = useState<number | string>(10);
  const [m4Y, setM4Y] = useState<number | string>(500);

  // Mode 5: Profit Margin & Selling Markup
  const [costPrice, setCostPrice] = useState<number | string>(1000);
  const [markupPct, setMarkupPct] = useState<number | string>(25);

  // Mode 6: Fraction to Percentage
  const [numerator, setNumerator] = useState<number | string>(3);
  const [denominator, setDenominator] = useState<number | string>(8);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Calculations
  const res1 = ((Number(m1X) || 0) / 100) * (Number(m1Y) || 0);
  const numM2Y = Number(m2Y) || 0;
  const res2 = numM2Y !== 0 ? ((Number(m2X) || 0) / numM2Y) * 100 : 0;
  const numM3X = Number(m3X) || 0;
  const numM3Y = Number(m3Y) || 0;
  const diff3 = numM3Y - numM3X;
  const res3Pct = numM3X !== 0 ? (diff3 / numM3X) * 100 : 0;
  const m4Added = (Number(m4Y) || 0) * (1 + (Number(m4X) || 0) / 100);
  const m4Subtracted = (Number(m4Y) || 0) * (1 - (Number(m4X) || 0) / 100);

  // Mode 5 results
  const cp = Number(costPrice) || 0;
  const mk = Number(markupPct) || 0;
  const profitAmount = (cp * mk) / 100;
  const sellingPrice = cp + profitAmount;
  const grossMargin = sellingPrice > 0 ? (profitAmount / sellingPrice) * 100 : 0;

  // Mode 6 results
  const num = Number(numerator) || 0;
  const den = Number(denominator) || 1;
  const fractionPct = den !== 0 ? (num / den) * 100 : 0;

  useEffect(() => {
    saveRecentCalculation({
      id: 'percentage-calculator',
      name: 'Percentage Calculator',
      href: '/percentage-calculator',
      iconName: 'Percent',
      category: 'Math & Everyday',
      summary: `${m1X}% of ${m1Y} = ${res1.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      tag: '6-in-1 Solver',
      gradient: 'from-violet-500 to-purple-700',
    });
  }, [m1X, m1Y, res1]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border border-violet-200/60 dark:border-violet-800 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
              <Percent className="w-3.5 h-3.5" />
              Complete 6-in-1 Math Solver
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
              Interactive Percentage Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Solve percent increase/decrease, ratios, discounts, profit markups, and fractional growth with live equations.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <ShareResultButton
              title="Interactive Percentage Calculator - QuickTools"
              outcomeText={`${m1X}% of ${m1Y} = ${res1.toFixed(2)}\n${m2X} is ${res2.toFixed(1)}% of ${m2Y}\nMargin markup: ${markupPct}% on Rs ${cp} = Rs ${sellingPrice.toFixed(0)}`}
              toolName="Percentage Calculator"
              params={{
                x: m1X,
                y: m1Y,
              }}
            />
          </div>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: What is X% of Y? */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-violet-50/70 to-purple-50/40 dark:from-slate-800 dark:to-slate-850 border border-violet-200/70 dark:border-slate-700 flex flex-col justify-between shadow-2xs hover:border-violet-400 transition-all">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-violet-900 dark:text-violet-300">
                  1. Percentage of a Number
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(`What is ${m1X}% of ${m1Y}? Answer: ${res1.toFixed(2)}`, 1)}
                    className="text-slate-400 hover:text-violet-600 p-1"
                    title="Copy Result"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">What is</span>
                <input
                  type="number"
                  value={m1X}
                  onChange={(e) => setM1X(e.target.value)}
                  className="w-20 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">% of</span>
                <input
                  type="number"
                  value={m1Y}
                  onChange={(e) => setM1Y(e.target.value)}
                  className="w-28 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">?</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-violet-200/60 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Formula: ({m1X} ÷ 100) × {m1Y}</span>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-violet-700 dark:text-violet-300">{res1.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Card 2: X is what percent of Y? */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-violet-50/70 to-purple-50/40 dark:from-slate-800 dark:to-slate-850 border border-violet-200/70 dark:border-slate-700 flex flex-col justify-between shadow-2xs hover:border-violet-400 transition-all">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-violet-900 dark:text-violet-300">
                  2. Proportion Percentage
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(`${m2X} is what % of ${m2Y}? Answer: ${res2.toFixed(2)}%`, 2)}
                  className="text-slate-400 hover:text-violet-600 p-1"
                >
                  {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  value={m2X}
                  onChange={(e) => setM2X(e.target.value)}
                  className="w-24 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">is what % of</span>
                <input
                  type="number"
                  value={m2Y}
                  onChange={(e) => setM2Y(e.target.value)}
                  className="w-28 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">?</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-violet-200/60 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Formula: ({m2X} ÷ {m2Y}) × 100</span>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-violet-700 dark:text-violet-300">{res2.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Card 3: % Increase or Decrease */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-violet-50/70 to-purple-50/40 dark:from-slate-800 dark:to-slate-850 border border-violet-200/70 dark:border-slate-700 flex flex-col justify-between shadow-2xs hover:border-violet-400 transition-all">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-violet-900 dark:text-violet-300">
                  3. % Increase or Decrease
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(`Change from ${m3X} to ${m3Y}: ${res3Pct.toFixed(2)}%`, 3)}
                  className="text-slate-400 hover:text-violet-600 p-1"
                >
                  {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">From</span>
                <input
                  type="number"
                  value={m3X}
                  onChange={(e) => setM3X(e.target.value)}
                  className="w-24 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">to</span>
                <input
                  type="number"
                  value={m3Y}
                  onChange={(e) => setM3Y(e.target.value)}
                  className="w-28 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-violet-200/60 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Diff: {diff3 >= 0 ? `+${diff3}` : diff3}</span>
              <div className="text-right">
                <span className={`text-2xl font-black font-mono ${res3Pct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {res3Pct >= 0 ? `+${res3Pct.toFixed(2)}%` : `${res3Pct.toFixed(2)}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Add / Subtract Percentage */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-violet-50/70 to-purple-50/40 dark:from-slate-800 dark:to-slate-850 border border-violet-200/70 dark:border-slate-700 flex flex-col justify-between shadow-2xs hover:border-violet-400 transition-all">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-violet-900 dark:text-violet-300">
                  4. Add or Subtract Percentage
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(`Add ${m4X}% to ${m4Y} = ${m4Added.toFixed(2)}, Subtract = ${m4Subtracted.toFixed(2)}`, 4)}
                  className="text-slate-400 hover:text-violet-600 p-1"
                >
                  {copiedIndex === 4 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">Apply</span>
                <input
                  type="number"
                  value={m4X}
                  onChange={(e) => setM4X(e.target.value)}
                  className="w-20 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">% to value</span>
                <input
                  type="number"
                  value={m4Y}
                  onChange={(e) => setM4Y(e.target.value)}
                  className="w-28 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-violet-200/60 dark:border-slate-700 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                +{m4X}% = {m4Added.toFixed(2)}
              </span>
              <span className="text-rose-700 dark:text-rose-400 font-bold bg-rose-100/70 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg">
                -{m4X}% = {m4Subtracted.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Card 5: Profit Margin & Selling Price */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-violet-50/70 to-purple-50/40 dark:from-slate-800 dark:to-slate-850 border border-violet-200/70 dark:border-slate-700 flex flex-col justify-between shadow-2xs hover:border-violet-400 transition-all">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-violet-900 dark:text-violet-300">
                  5. Cost, Markup & Profit Margin
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(`Cost: ${costPrice}, Markup: ${markupPct}%, Selling Price: ${sellingPrice.toFixed(2)}, Margin: ${grossMargin.toFixed(2)}%`, 5)}
                  className="text-slate-400 hover:text-violet-600 p-1"
                >
                  {copiedIndex === 5 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">Cost:</span>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-24 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">Markup %:</span>
                <input
                  type="number"
                  value={markupPct}
                  onChange={(e) => setMarkupPct(e.target.value)}
                  className="w-20 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-violet-200/60 dark:border-slate-700 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-300">Sell Price: <strong className="text-violet-700 dark:text-violet-400 font-bold">{sellingPrice.toFixed(2)}</strong></span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Margin: {grossMargin.toFixed(2)}%</span>
            </div>
          </div>

          {/* Card 6: Fraction to Percentage */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-violet-50/70 to-purple-50/40 dark:from-slate-800 dark:to-slate-850 border border-violet-200/70 dark:border-slate-700 flex flex-col justify-between shadow-2xs hover:border-violet-400 transition-all">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-violet-900 dark:text-violet-300">
                  6. Fraction / Ratio to Percentage
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(`${numerator} / ${denominator} = ${fractionPct.toFixed(2)}%`, 6)}
                  className="text-slate-400 hover:text-violet-600 p-1"
                >
                  {copiedIndex === 6 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={numerator}
                  onChange={(e) => setNumerator(e.target.value)}
                  className="w-20 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
                <span className="text-lg font-bold text-slate-400">/</span>
                <input
                  type="number"
                  value={denominator}
                  onChange={(e) => setDenominator(e.target.value)}
                  className="w-20 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-hidden"
                />
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-violet-200/60 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Decimal: {(num / (den || 1)).toFixed(4)}</span>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-violet-700 dark:text-violet-300">{fractionPct.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
