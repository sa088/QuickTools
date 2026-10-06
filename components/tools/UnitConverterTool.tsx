import React, { useState, useMemo, useEffect } from 'react';
import { Ruler, ArrowLeftRight, Check, Copy } from 'lucide-react';
import { saveRecentCalculation } from '@/lib/recentCalculations';
import { ShareResultButton } from './ShareResultButton';

type UnitCategory = 'length' | 'weight' | 'area' | 'temperature' | 'speed' | 'volume';

const CATEGORIES: Record<UnitCategory, { name: string; icon: string; units: Record<string, number | ((val: number, toBase: boolean) => number)> }> = {
  length: {
    name: 'Length & Distance',
    icon: '📏',
    units: {
      Meter: 1,
      Kilometer: 1000,
      Centimeter: 0.01,
      Millimeter: 0.001,
      Mile: 1609.344,
      Yard: 0.9144,
      Foot: 0.3048,
      Inch: 0.0254,
      NauticalMile: 1852,
    },
  },
  weight: {
    name: 'Weight & Mass (incl. Tola)',
    icon: '⚖️',
    units: {
      Kilogram: 1,
      Gram: 0.001,
      Milligram: 0.000001,
      Pound: 0.45359237,
      Ounce: 0.028349523,
      MetricTon: 1000,
      'Tola (Pakistan/Gold)': 0.0116638,
      'Maund / Man (40 kg)': 40,
    },
  },
  area: {
    name: 'Area (incl. Marla & Kanal)',
    icon: '📐',
    units: {
      'Square Meter': 1,
      'Square Foot': 0.092903,
      'Square Yard (Gaj)': 0.836127,
      'Acre': 4046.86,
      'Hectare': 10000,
      'Marla (225 sq ft)': 20.903,
      'Marla (272.25 sq ft)': 25.2929,
      'Kanal (20 Marla - 4500 sq ft)': 418.06,
    },
  },
  temperature: {
    name: 'Temperature',
    icon: '🌡️',
    units: {
      Celsius: 1,
      Fahrenheit: 1,
      Kelvin: 1,
    },
  },
  speed: {
    name: 'Speed & Velocity',
    icon: '⚡',
    units: {
      'Kilometers per hour (km/h)': 1,
      'Miles per hour (mph)': 1.60934,
      'Meters per second (m/s)': 3.6,
      'Knots': 1.852,
    },
  },
  volume: {
    name: 'Volume & Capacity',
    icon: '🧪',
    units: {
      Liter: 1,
      Milliliter: 0.001,
      'US Gallon': 3.78541,
      'Imperial Gallon': 4.54609,
      'Cubic Meter': 1000,
      'Fluid Ounce (US)': 0.0295735,
    },
  },
};

export function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputVal, setInputVal] = useState<number | string>(100);
  const [fromUnit, setFromUnit] = useState<string>('Meter');
  const [toUnit, setToUnit] = useState<string>('Foot');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const cat = sp.get('category') as UnitCategory;
      if (cat && cat in CATEGORIES) {
        setCategory(cat);
      }
      const val = sp.get('val') || sp.get('value');
      if (val) setInputVal(Number(val) || 100);
      const f = sp.get('from');
      if (f) setFromUnit(f);
      const t = sp.get('to');
      if (t) setToUnit(t);
    } catch {}
  }, []);

  const numVal = Number(inputVal) || 0;

  const convertedResult = useMemo(() => {
    if (category === 'temperature') {
      let celsius = numVal;
      if (fromUnit === 'Fahrenheit') {
        celsius = (numVal - 32) * (5 / 9);
      } else if (fromUnit === 'Kelvin') {
        celsius = numVal - 273.15;
      }

      if (toUnit === 'Celsius') return celsius;
      if (toUnit === 'Fahrenheit') return (celsius * 9) / 5 + 32;
      if (toUnit === 'Kelvin') return celsius + 273.15;
      return celsius;
    }

    const units = CATEGORIES[category].units as Record<string, number>;
    const fromFactor = units[fromUnit] || 1;
    const toFactor = units[toUnit] || 1;
    const baseValue = numVal * fromFactor;
    return baseValue / toFactor;
  }, [category, numVal, fromUnit, toUnit]);

  useEffect(() => {
    saveRecentCalculation({
      id: 'unit-converter',
      name: 'Universal Unit Converter',
      href: '/unit-converter',
      iconName: 'Ruler',
      category: 'Converters',
      summary: `${numVal} ${fromUnit} = ${convertedResult.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toUnit}`,
      tag: CATEGORIES[category].name,
      gradient: 'from-cyan-500 to-blue-600',
    });
  }, [numVal, fromUnit, toUnit, convertedResult, category]);

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const unitKeys = Object.keys(CATEGORIES[newCat].units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyResult = () => {
    const text = `${numVal} ${fromUnit} = ${convertedResult.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toUnit}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const unitKeys = Object.keys(CATEGORIES[category].units);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
              <Ruler className="w-3.5 h-3.5" />
              Universal Metric & Imperial Suite
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
              Universal Unit & Measurement Converter
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              High-precision converter supporting global SI units plus regional land (Marla/Kanal) & bullion (Tola) scales.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-200 dark:border-cyan-800">
              6 Dimensions • 40+ Units
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(Object.keys(CATEGORIES) as UnitCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-200 dark:shadow-none scale-105'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>{CATEGORIES[cat].icon}</span>
              <span>{CATEGORIES[cat].name}</span>
            </button>
          ))}
        </div>

        {/* Interactive Converter Box */}
        <div className="p-6 md:p-8 rounded-3xl bg-linear-to-br from-cyan-50/60 via-slate-50 to-indigo-50/30 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-cyan-200/80 dark:border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            
            {/* Input Value */}
            <div className="md:col-span-4 space-y-2">
              <label htmlFor="unit-val" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Amount / Value
              </label>
              <input
                id="unit-val"
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-lg font-bold focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            {/* From Unit */}
            <div className="md:col-span-3 space-y-2">
              <label htmlFor="from-unit-select" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                From Unit
              </label>
              <select
                id="from-unit-select"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3.5 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:border-cyan-500 focus:outline-hidden"
              >
                {unitKeys.map((u) => (
                  <option key={u} value={u} className="dark:bg-slate-900">
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center pt-2 md:pt-6">
              <button
                type="button"
                id="swap-units-btn"
                onClick={swapUnits}
                className="w-12 h-12 rounded-2xl bg-cyan-600 text-white hover:bg-cyan-700 shadow-md shadow-cyan-200 dark:shadow-none flex items-center justify-center transition-all hover:scale-105"
                title="Swap Units"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </div>

            {/* To Unit */}
            <div className="md:col-span-3 space-y-2">
              <label htmlFor="to-unit-select" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                To Target Unit
              </label>
              <select
                id="to-unit-select"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3.5 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:border-cyan-500 focus:outline-hidden"
              >
                {unitKeys.map((u) => (
                  <option key={u} value={u} className="dark:bg-slate-900">
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Result Display */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-cyan-300 dark:border-cyan-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Converted Equivalent
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3 mt-2">
              <span className="text-3xl md:text-5xl font-black font-mono text-cyan-900 dark:text-cyan-300 tracking-tight">
                {convertedResult.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </span>
              <span className="text-xl font-bold text-cyan-700 dark:text-cyan-400 font-sans">{toUnit}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-2">
              Base: {numVal} {fromUnit}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="copy-unit-btn"
              onClick={copyResult}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 text-cyan-900 dark:text-cyan-300 text-xs font-bold border border-cyan-200 dark:border-cyan-800 shadow-xs transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Result'}</span>
            </button>
            <ShareResultButton
              title={`Unit Conversion (${numVal} ${fromUnit} → ${toUnit}) - QuickTools`}
              outcomeText={`${numVal} ${fromUnit} = ${convertedResult.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toUnit}\nCategory: ${CATEGORIES[category].name}`}
              toolName="Unit Converter"
              params={{
                category,
                value: numVal,
                from: fromUnit,
                to: toUnit,
              }}
            />
          </div>
        </div>

        {/* Quick Presets for current category */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Popular Conversions in this Category
          </span>
          <div className="flex flex-wrap gap-2">
            {category === 'length' && (
              <>
                <button type="button" onClick={() => { setFromUnit('Kilometer'); setToUnit('Mile'); setInputVal(10); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">10 Km → Miles</button>
                <button type="button" onClick={() => { setFromUnit('Foot'); setToUnit('Meter'); setInputVal(6); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">6 Feet → Meters</button>
                <button type="button" onClick={() => { setFromUnit('Inch'); setToUnit('Centimeter'); setInputVal(1); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">1 Inch → cm</button>
              </>
            )}
            {category === 'weight' && (
              <>
                <button type="button" onClick={() => { setFromUnit('Tola (Pakistan/Gold)'); setToUnit('Gram'); setInputVal(1); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">1 Tola → Grams (11.66g)</button>
                <button type="button" onClick={() => { setFromUnit('Kilogram'); setToUnit('Pound'); setInputVal(1); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">1 Kg → Pounds (2.2 lbs)</button>
                <button type="button" onClick={() => { setFromUnit('Maund / Man (40 kg)'); setToUnit('Kilogram'); setInputVal(1); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">1 Maund → 40 Kg</button>
              </>
            )}
            {category === 'area' && (
              <>
                <button type="button" onClick={() => { setFromUnit('Marla (225 sq ft)'); setToUnit('Square Foot'); setInputVal(5); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">5 Marla → Sq Ft</button>
                <button type="button" onClick={() => { setFromUnit('Kanal (20 Marla - 4500 sq ft)'); setToUnit('Marla (225 sq ft)'); setInputVal(1); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">1 Kanal → 20 Marla</button>
                <button type="button" onClick={() => { setFromUnit('Acre'); setToUnit('Square Foot'); setInputVal(1); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">1 Acre → 43,560 Sq Ft</button>
              </>
            )}
            {category === 'temperature' && (
              <>
                <button type="button" onClick={() => { setFromUnit('Celsius'); setToUnit('Fahrenheit'); setInputVal(37); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">37°C (Body Temp) → °F</button>
                <button type="button" onClick={() => { setFromUnit('Celsius'); setToUnit('Fahrenheit'); setInputVal(100); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">100°C (Boiling) → 212°F</button>
                <button type="button" onClick={() => { setFromUnit('Fahrenheit'); setToUnit('Celsius'); setInputVal(98.6); }} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-800 text-xs font-semibold">98.6°F → 37°C</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
