import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeftRight, Check, Copy, RefreshCw, Globe, Info } from 'lucide-react';
import { fetchLiveRates, getDefaultRates } from '@/lib/liveRates';
import { ShareResultButton } from './ShareResultButton';

const INITIAL_RATES: Record<string, { rate: number; name: string; symbol: string; flag: string }> = {
  USD: { rate: 1.0, name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  PKR: { rate: 277.0, name: 'Pakistani Rupee', symbol: 'Rs', flag: '🇵🇰' },
  EUR: { rate: 0.88, name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { rate: 0.75, name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  AED: { rate: 3.67, name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  SAR: { rate: 3.75, name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦' },
  CAD: { rate: 1.39, name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  AUD: { rate: 1.41, name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  CNY: { rate: 7.24, name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  JPY: { rate: 152.40, name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  INR: { rate: 95.90, name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  TRY: { rate: 36.50, name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  QAR: { rate: 3.64, name: 'Qatari Riyal', symbol: 'QAR', flag: '🇶🇦' },
  KWD: { rate: 0.31, name: 'Kuwaiti Dinar', symbol: 'KD', flag: '🇰🇼' },
};

export function CurrencyConverterTool() {
  const [ratesMap, setRatesMap] = useState(INITIAL_RATES);
  const [amount, setAmount] = useState<number | string>(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('PKR');
  const [feeMargin, setFeeMargin] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live Market Connected');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const a = sp.get('amount');
      if (a) setAmount(Number(a) || 100);
      const f = sp.get('from');
      if (f && f in INITIAL_RATES) setFromCurrency(f);
      const t = sp.get('to');
      if (t && t in INITIAL_RATES) setToCurrency(t);
    } catch {}
  }, []);

  const loadRates = async (force = false) => {
    setIsRefreshing(true);
    try {
      const data = await fetchLiveRates(force);
      if (data && data.currencies) {
        setRatesMap(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(code => {
            if (data.currencies[code]) {
              updated[code] = {
                ...updated[code],
                rate: data.currencies[code]
              };
            }
          });
          return updated;
        });
        setLastUpdated(data.lastUpdated || 'Today • Live Market Connected');
      }
    } catch (e) {
      console.warn('Live forex update notice:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // ALWAYS fetch live rates on mount, reload, or refresh!
    loadRates(true);

    const handleRatesUpdate = (e: any) => {
      const data = e.detail;
      if (data?.currencies) {
        setRatesMap(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(code => {
            if (data.currencies[code]) {
              updated[code] = {
                ...updated[code],
                rate: data.currencies[code]
              };
            }
          });
          return updated;
        });
        setLastUpdated(data.lastUpdated || 'Today • Live Market Connected');
      }
    };

    window.addEventListener('quicktools_rates_updated', handleRatesUpdate);

    // Auto-refresh every 60 seconds while open
    const interval = setInterval(() => {
      loadRates(true);
    }, 60000);

    // Refresh when user returns to this tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadRates(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('quicktools_rates_updated', handleRatesUpdate);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;

  const { convertedAmount, exchangeRate, bankFeeCost, netAmount } = useMemo(() => {
    const fromRate = ratesMap[fromCurrency]?.rate || 1;
    const toRate = ratesMap[toCurrency]?.rate || 1;
    const rate = toRate / fromRate;
    const baseConverted = numAmount * rate;
    const feeCost = baseConverted * (feeMargin / 100);
    const net = baseConverted - feeCost;
    return {
      convertedAmount: baseConverted,
      exchangeRate: rate,
      bankFeeCost: feeCost,
      netAmount: net,
    };
  }, [numAmount, fromCurrency, toCurrency, feeMargin, ratesMap]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const copyResult = () => {
    const text = `${numAmount.toLocaleString()} ${fromCurrency} = ${netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Main Converter Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-6 gap-3">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              Live Mid-Market Rates
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Currency Converter with PKR Rates
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected to Markets
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{lastUpdated}</p>
            </div>
            <button
              type="button"
              id="refresh-rates-btn"
              onClick={() => loadRates(true)}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              title="Refresh Live Exchange Rates"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          {/* Amount input */}
          <div className="md:col-span-3 space-y-1.5">
            <label htmlFor="currency-amount" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Amount to Convert
            </label>
            <div className="relative">
              <input
                id="currency-amount"
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                placeholder="100"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                {ratesMap[fromCurrency]?.symbol}
              </span>
            </div>
          </div>

          {/* From Currency */}
          <div className="md:col-span-2 space-y-1.5">
            <label htmlFor="from-currency" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              From Currency
            </label>
            <select
              id="from-currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3.5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(ratesMap).map(([code, cur]) => (
                <option key={code} value={code} className="dark:bg-slate-900">
                  {cur.flag} {code} - {cur.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <div className="flex justify-center md:pt-6">
            <button
              type="button"
              id="swap-currencies-btn"
              onClick={swapCurrencies}
              className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
              title="Swap currencies"
              aria-label="Swap from and to currencies"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To Currency */}
          <div className="md:col-span-1 space-y-1.5 md:col-start-7">
            <label htmlFor="to-currency" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              To Currency
            </label>
            <select
              id="to-currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3.5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(ratesMap).map(([code, cur]) => (
                <option key={code} value={code} className="dark:bg-slate-900">
                  {cur.flag} {code} - {cur.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bank Margin Simulator */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-800/40 p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Bank / Exchange Spread Margin</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Simulate bank transfer charges or foreign card markup</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[0, 1.5, 2.5, 3.5].map((fee) => (
              <button
                key={fee}
                type="button"
                onClick={() => setFeeMargin(fee)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  feeMargin === fee
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {fee === 0 ? '0% (Mid-Market)' : `${fee}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Results Banner */}
        <div className="mt-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-indigo-100/80 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Converted Total Amount
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                {netAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {toCurrency}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              1 {fromCurrency} ={' '}
              <strong className="text-slate-800 dark:text-slate-200 font-mono">
                {exchangeRate.toLocaleString(undefined, {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                })}{' '}
                {toCurrency}
              </strong>{' '}
              • 1 {toCurrency} ={' '}
              <span className="font-mono">
                {(1 / (exchangeRate || 1)).toLocaleString(undefined, {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                })}{' '}
                {fromCurrency}
              </span>
            </p>
            {feeMargin > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Deducted bank fee markup ({feeMargin}%): -
                {bankFeeCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {toCurrency}
              </p>
            )}
          </div>
          <div className="flex flex-row sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              id="copy-currency-result"
              onClick={copyResult}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Result</span>
                </>
              )}
            </button>
            <ShareResultButton
              title={`Currency Conversion (${numAmount.toLocaleString()} ${fromCurrency} → ${toCurrency}) - QuickTools`}
              outcomeText={`${numAmount.toLocaleString()} ${fromCurrency} = ${netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}\nRate: 1 ${fromCurrency} = ${exchangeRate.toFixed(4)} ${toCurrency}`}
              toolName="Currency Converter"
              params={{
                amount: numAmount,
                from: fromCurrency,
                to: toCurrency,
              }}
            />
          </div>
        </div>
      </div>

      {/* Popular PKR Conversions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
          { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
          { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
          { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
          { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
          { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
          { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
          { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
        ].map((item) => {
          const fromR = ratesMap[item.code]?.rate || 1;
          const pkrR = ratesMap['PKR']?.rate || 278.65;
          const rateToPkr = (pkrR / fromR).toFixed(2);
          return (
            <div
              key={item.code}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.flag}</span>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{item.code}/PKR</span>
                  <p className="text-[10px] text-slate-400">{item.name}</p>
                </div>
              </div>
              <p className="text-sm font-extrabold font-mono text-slate-900 dark:text-slate-100">
                Rs {Number(rateToPkr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
