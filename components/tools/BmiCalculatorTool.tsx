import React, { useState, useMemo, useEffect } from 'react';
import { HeartPulse, Check, Copy, Info } from 'lucide-react';
import { saveRecentCalculation } from '@/lib/recentCalculations';
import { ShareResultButton } from './ShareResultButton';

export function BmiCalculatorTool() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<number | string>(175);
  const [weightKg, setWeightKg] = useState<number | string>(70);
  const [heightFt, setHeightFt] = useState<number | string>(5);
  const [heightIn, setHeightIn] = useState<number | string>(9);
  const [weightLbs, setWeightLbs] = useState<number | string>(154);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const u = sp.get('unit');
      if (u === 'metric' || u === 'imperial') setUnit(u);
      const h = sp.get('height');
      if (h) setHeightCm(Number(h) || 175);
      const w = sp.get('weight');
      if (w) setWeightKg(Number(w) || 70);
      const hf = sp.get('heightFt');
      if (hf) setHeightFt(Number(hf) || 5);
      const hi = sp.get('heightIn');
      if (hi) setHeightIn(Number(hi) || 9);
      const wl = sp.get('weightLbs');
      if (wl) setWeightLbs(Number(wl) || 154);
    } catch {}
  }, []);

  const { bmi, category, color, idealWeightMin, idealWeightMax, needlePercent } = useMemo(() => {
    let hMeters = 0;
    let wKg = 0;
    if (unit === 'metric') {
      hMeters = (Number(heightCm) || 0) / 100;
      wKg = Number(weightKg) || 0;
    } else {
      const totalInches = (Number(heightFt) || 0) * 12 + (Number(heightIn) || 0);
      hMeters = totalInches * 0.0254;
      wKg = (Number(weightLbs) || 0) * 0.45359237;
    }

    if (hMeters <= 0 || wKg <= 0) {
      return { bmi: 0, category: 'N/A', color: 'slate', idealWeightMin: 0, idealWeightMax: 0, needlePercent: 0 };
    }

    const calculatedBmi = wKg / (hMeters * hMeters);
    let cat = '';
    let clr = 'emerald';

    if (calculatedBmi < 18.5) {
      cat = 'Underweight';
      clr = 'text-sky-600 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800';
    } else if (calculatedBmi <= 24.9) {
      cat = 'Normal (Healthy Weight)';
      clr = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    } else if (calculatedBmi <= 29.9) {
      cat = 'Overweight';
      clr = 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
    } else if (calculatedBmi <= 34.9) {
      cat = 'Obesity Class I';
      clr = 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800';
    } else {
      cat = 'Obesity Class II (High Risk)';
      clr = 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
    }

    const minW = 18.5 * (hMeters * hMeters);
    const maxW = 24.9 * (hMeters * hMeters);
    const clampedBmi = Math.min(Math.max(calculatedBmi, 10), 45);
    const needle = ((clampedBmi - 10) / (45 - 10)) * 100;

    return {
      bmi: calculatedBmi,
      category: cat,
      color: clr,
      idealWeightMin: unit === 'metric' ? minW : minW * 2.20462,
      idealWeightMax: unit === 'metric' ? maxW : maxW * 2.20462,
      needlePercent: needle,
    };
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightLbs]);

  useEffect(() => {
    if (bmi > 0) {
      saveRecentCalculation({
        id: 'bmi-calculator',
        name: 'BMI & Body Health Calculator',
        href: '/bmi-calculator',
        iconName: 'HeartPulse',
        category: 'Health',
        summary: `BMI Score: ${bmi.toFixed(1)} (${category})`,
        tag: 'WHO Health Benchmark',
        gradient: 'from-pink-500 to-rose-600',
      });
    }
  }, [bmi, category]);

  const copyResult = () => {
    const text = `BMI Evaluation:
- BMI Score: ${bmi.toFixed(1)}
- Classification: ${category}
- Ideal Weight Range: ${idealWeightMin.toFixed(1)} - ${idealWeightMax.toFixed(1)} ${unit === 'metric' ? 'kg' : 'lbs'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5" />
              WHO Classification
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Body Mass Index (BMI) & Health Calculator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Find your healthy body weight range based on official World Health Organization parameters.
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 self-start">
            <button
              type="button"
              onClick={() => setUnit('metric')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                unit === 'metric' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Metric (cm / kg)
            </button>
            <button
              type="button"
              onClick={() => setUnit('imperial')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                unit === 'imperial' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Imperial (ft / lbs)
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {unit === 'metric' ? (
            <>
              <div>
                <label htmlFor="height-cm" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Height (centimeters)
                </label>
                <div className="relative">
                  <input
                    id="height-cm"
                    type="number"
                    min="50"
                    max="250"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono text-base font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    cm
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="weight-kg" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Weight (kilograms)
                </label>
                <div className="relative">
                  <input
                    id="weight-kg"
                    type="number"
                    min="20"
                    max="300"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono text-base font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    kg
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Height (feet & inches)</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      min="2"
                      max="8"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono text-base font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">ft</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono text-base font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">in</span>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="weight-lbs" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Weight (pounds)
                </label>
                <div className="relative">
                  <input
                    id="weight-lbs"
                    type="number"
                    min="40"
                    max="600"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono text-base font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    lbs
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Results */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-850 border border-slate-200/80 dark:border-slate-700 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your Body Mass Index (BMI):</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl md:text-5xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {bmi.toFixed(1)}
                </span>
                <span className={`text-xs md:text-sm font-bold px-3 py-1 rounded-full border ${color}`}>
                  {category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="copy-bmi-result-btn"
                onClick={copyResult}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied' : 'Copy Score'}</span>
              </button>
              <ShareResultButton
                title="Body Mass Index (BMI) & Health Evaluation - QuickTools"
                outcomeText={`BMI Score: ${bmi.toFixed(1)} (${category})\nIdeal Healthy Weight: ${idealWeightMin.toFixed(1)} - ${idealWeightMax.toFixed(1)} ${unit === 'metric' ? 'kg' : 'lbs'}`}
                toolName="BMI Calculator"
                buttonLabel="Share"
                params={
                  unit === 'metric'
                    ? { unit, height: heightCm, weight: weightKg }
                    : { unit, heightFt, heightIn, weightLbs }
                }
              />
            </div>
          </div>

          {/* Visual BMI Bar */}
          <div>
            <div className="relative w-full h-4 rounded-full overflow-hidden flex shadow-inner bg-slate-200 dark:bg-slate-700">
              <div className="w-[24%] bg-sky-400" title="Underweight (<18.5)"></div>
              <div className="w-[18%] bg-emerald-500" title="Normal (18.5 - 24.9)"></div>
              <div className="w-[14%] bg-amber-400" title="Overweight (25 - 29.9)"></div>
              <div className="w-[14%] bg-orange-500" title="Obese I (30 - 34.9)"></div>
              <div className="w-[30%] bg-rose-500" title="Severe Obese (35+)"></div>
            </div>

            <div className="relative w-full h-4 mt-1">
              <div
                style={{ left: `${needlePercent}%` }}
                className="absolute -translate-x-1/2 flex flex-col items-center transition-all duration-300"
              >
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-slate-800 dark:border-b-white"></div>
                <span className="text-[10px] font-bold font-mono text-slate-800 dark:text-white mt-0.5">{bmi.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-3">
              <span>Underweight (&lt;18.5)</span>
              <span>Healthy (18.5 - 24.9)</span>
              <span>Overweight (25 - 29.9)</span>
              <span>Obese (30+)</span>
            </div>
          </div>

          {/* Healthy weight range feedback */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Ideal Healthy Weight Range for your height:</span>
            </div>
            <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
              {idealWeightMin.toFixed(1)} - {idealWeightMax.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
