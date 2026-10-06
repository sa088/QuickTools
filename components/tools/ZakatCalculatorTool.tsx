import React, { useState, useMemo, useEffect } from 'react';
import { Coins, Check, Copy, RefreshCw, Sparkles, Scale } from 'lucide-react';
import { saveRecentCalculation } from '@/lib/recentCalculations';
import { fetchLiveRates, getDefaultRates } from '@/lib/liveRates';
import { ShareResultButton } from './ShareResultButton';
import { DownloadPdfButton } from './DownloadPdfButton';

export function ZakatCalculatorTool() {
  const initialRates = getDefaultRates();
  const [ratesData, setRatesData] = useState(initialRates);
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');
  const [nisabStandard, setNisabStandard] = useState<'silver' | 'gold'>('silver');
  const [goldPricePKR, setGoldPricePKR] = useState<number>(initialRates.metals.goldPerGramPKR);
  const [silverPricePKR, setSilverPricePKR] = useState<number>(initialRates.metals.silverPerGramPKR);
  const [goldPriceUSD, setGoldPriceUSD] = useState<number>(initialRates.metals.goldPerGramUSD);
  const [silverPriceUSD, setSilverPriceUSD] = useState<number>(initialRates.metals.silverPerGramUSD);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedStatus, setFeedStatus] = useState('Today • Live Market Connected');
  const [goldUnit, setGoldUnit] = useState<'tola' | 'grams'>('tola');
  const [silverUnit, setSilverUnit] = useState<'tola' | 'grams'>('tola');
  const TOLA_GRAMS = 11.6638038;

  const fetchLiveBullion = async (force = false) => {
    setIsRefreshing(true);
    try {
      const data = await fetchLiveRates(force);
      if (data && data.metals) {
        setRatesData(data);
        setGoldPricePKR(data.metals.goldPerGramPKR);
        setSilverPricePKR(data.metals.silverPerGramPKR);
        setGoldPriceUSD(data.metals.goldPerGramUSD);
        setSilverPriceUSD(data.metals.silverPerGramUSD);
        setFeedStatus(data.lastUpdated || 'Today • Live Market Connected');
      }
    } catch (e) {
      console.warn('Bullion rate fetch notice:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // ALWAYS fetch fresh rates on page load, reload, or refresh!
    fetchLiveBullion(true);

    const handleRatesUpdate = (e: any) => {
      const data = e.detail;
      if (data?.metals) {
        setRatesData(data);
        setGoldPricePKR(data.metals.goldPerGramPKR);
        setSilverPricePKR(data.metals.silverPerGramPKR);
        setGoldPriceUSD(data.metals.goldPerGramUSD);
        setSilverPriceUSD(data.metals.silverPerGramUSD);
        setFeedStatus(data.lastUpdated || 'Today • Live Market Connected');
      }
    };

    window.addEventListener('quicktools_rates_updated', handleRatesUpdate);

    // Auto-refresh every 60 seconds while open
    const interval = setInterval(() => {
      fetchLiveBullion(true);
    }, 60000);

    // Refresh when user returns to this tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchLiveBullion(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('quicktools_rates_updated', handleRatesUpdate);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Asset inputs
  const [cash, setCash] = useState<string>('');
  const [goldAmount, setGoldAmount] = useState<string>('');
  const [silverAmount, setSilverAmount] = useState<string>('');
  const [investments, setInvestments] = useState<string>('');
  const [businessInventory, setBusinessInventory] = useState<string>('');
  const [receivables, setReceivables] = useState<string>('');

  // Liabilities
  const [debtsDue, setDebtsDue] = useState<string>('');
  const [pendingBills, setPendingBills] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const GOLD_NISAB_GRAMS = 87.48;
  const SILVER_NISAB_GRAMS = 612.36;

  const currentGoldPrice = currency === 'PKR' ? goldPricePKR : goldPriceUSD;
  const currentSilverPrice = currency === 'PKR' ? silverPricePKR : silverPriceUSD;

  const goldNisabValue = GOLD_NISAB_GRAMS * currentGoldPrice;
  const silverNisabValue = SILVER_NISAB_GRAMS * currentSilverPrice;
  const selectedNisabThreshold = nisabStandard === 'silver' ? silverNisabValue : goldNisabValue;

  const {
    totalCash,
    goldValue,
    silverValue,
    totalInvestments,
    totalInventory,
    totalReceivables,
    totalAssets,
    totalLiabilities,
    netZakatableWealth,
    isEligible,
    zakatDue
  } = useMemo(() => {
    const c = parseFloat(cash) || 0;
    
    const gInput = parseFloat(goldAmount) || 0;
    const gGrams = goldUnit === 'tola' ? gInput * TOLA_GRAMS : gInput;
    const gVal = gGrams * currentGoldPrice;

    const sInput = parseFloat(silverAmount) || 0;
    const sGrams = silverUnit === 'tola' ? sInput * TOLA_GRAMS : sInput;
    const sVal = sGrams * currentSilverPrice;

    const inv = parseFloat(investments) || 0;
    const binv = parseFloat(businessInventory) || 0;
    const rec = parseFloat(receivables) || 0;

    const dDue = parseFloat(debtsDue) || 0;
    const pBills = parseFloat(pendingBills) || 0;

    const assets = c + gVal + sVal + inv + binv + rec;
    const liab = dDue + pBills;
    const net = Math.max(0, assets - liab);
    const eligible = net >= selectedNisabThreshold;
    const due = eligible ? net * 0.025 : 0;

    return {
      totalCash: c,
      goldValue: gVal,
      silverValue: sVal,
      totalInvestments: inv,
      totalInventory: binv,
      totalReceivables: rec,
      totalAssets: assets,
      totalLiabilities: liab,
      netZakatableWealth: net,
      isEligible: eligible,
      zakatDue: due,
    };
  }, [
    cash,
    goldAmount,
    goldUnit,
    silverAmount,
    silverUnit,
    investments,
    businessInventory,
    receivables,
    debtsDue,
    pendingBills,
    currentGoldPrice,
    currentSilverPrice,
    selectedNisabThreshold
  ]);

  useEffect(() => {
    saveRecentCalculation({
      id: 'zakat-calculator',
      name: 'Zakat Calculator',
      href: '/zakat-calculator',
      iconName: 'Coins',
      category: 'Financial',
      summary: isEligible
        ? `Net Wealth: ${currency} ${Math.round(netZakatableWealth).toLocaleString()} • Zakat: ${currency} ${Math.round(zakatDue).toLocaleString()}`
        : `Net Wealth: ${currency} ${Math.round(netZakatableWealth).toLocaleString()} (${currency} ${Math.round(selectedNisabThreshold).toLocaleString()} Nisab)`,
      tag: `${nisabStandard === 'silver' ? 'Silver' : 'Gold'} Nisab`,
      gradient: 'from-emerald-500 to-teal-700',
    });
  }, [netZakatableWealth, zakatDue, isEligible, currency, nisabStandard, selectedNisabThreshold]);

  const copyResult = () => {
    const text = `Islamic Zakat Calculation (${currency}):
- Nisab Standard: ${nisabStandard === 'silver' ? 'Silver (52.5 Tola / 612.36g)' : 'Gold (7.5 Tola / 87.48g)'}
- Nisab Limit: ${currency} ${Math.round(selectedNisabThreshold).toLocaleString()}
- Total Assets: ${currency} ${Math.round(totalAssets).toLocaleString()}
- Total Liabilities: ${currency} ${Math.round(totalLiabilities).toLocaleString()}
- Net Zakatable Wealth: ${currency} ${Math.round(netZakatableWealth).toLocaleString()}
- Obligation: ${isEligible ? 'FARDH (Obligatory)' : 'Below Nisab Limit'}
- Zakat Due (2.5%): ${currency} ${Math.round(zakatDue).toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Classical Fiqh Compliant
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">2.5% Lunar Rate</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Authentic Islamic Zakat Calculator
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Accurate calculation based on current bullion market rates (Gold & Silver Nisab thresholds).
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="text-right text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Bullion Feed
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{feedStatus}</p>
            </div>
            <button
              type="button"
              id="refresh-bullion-btn"
              onClick={() => fetchLiveBullion(true)}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              title="Refresh Live Bullion Rates"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
            <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setCurrency('PKR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'PKR' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                PKR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                USD
              </button>
            </div>
          </div>
        </div>

        {/* Nisab Standard Selector & Live Rate Bar */}
        <div className="bg-linear-to-r from-emerald-50 via-teal-50/60 to-emerald-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl p-5 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-emerald-950 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                Select Nisab Benchmark (Hanafi Consensus / Jumhoor):
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  type="button"
                  id="btn-nisab-silver"
                  onClick={() => setNisabStandard('silver')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    nisabStandard === 'silver'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  Silver Standard (52.5 Tola / 612.36g) • Preferred
                </button>
                <button
                  type="button"
                  id="btn-nisab-gold"
                  onClick={() => setNisabStandard('gold')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    nisabStandard === 'gold'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-amber-50'
                  }`}
                >
                  Gold Standard (7.5 Tola / 87.48g)
                </button>
              </div>
            </div>
            <div className="text-left lg:text-right border-t lg:border-t-0 pt-3 lg:pt-0 border-emerald-200/60 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Nisab Obligation Limit:</p>
              <p className="text-2xl font-black font-mono text-emerald-950 dark:text-emerald-300">
                {currency} {Math.round(selectedNisabThreshold).toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold">
                {nisabStandard === 'silver' ? 'Silver: 52.5 Tola (612.36g)' : 'Gold: 7.5 Tola (87.48g)'}
              </p>
            </div>
          </div>

          {/* Live Bullion Market Breakdown (24K, 22K & Silver) */}
          <div className="mt-5 pt-4 border-t border-emerald-200/70 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                Today's Bullion Market Rates (Pakistan Sarafa & Spot Market)
              </span>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold bg-emerald-100/70 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full inline-flex items-center gap-1 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {feedStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4">
              {/* 24K Gold Card */}
              <div className="bg-white/90 dark:bg-slate-800/90 p-3.5 rounded-xl border border-amber-200/80 dark:border-slate-700 shadow-xs space-y-1.5">
                <div className="flex justify-between items-center border-b border-amber-100 dark:border-slate-700/60 pb-1.5">
                  <span className="font-extrabold text-amber-900 dark:text-amber-300">24K Gold (Pure Bullion)</span>
                  <button
                    type="button"
                    onClick={() => {
                      const g = currency === 'PKR' ? (ratesData.metals.gold24kGramPKR || 37466) : (ratesData.metals.goldPerGramUSD || 133.16);
                      currency === 'PKR' ? setGoldPricePKR(g) : setGoldPriceUSD(g);
                    }}
                    className="text-[10px] font-bold text-amber-800 dark:text-amber-400 hover:text-amber-950 underline cursor-pointer"
                  >
                    Apply 24K
                  </button>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Per Tola:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {currency === 'PKR' ? `Rs ${(ratesData.metals.gold24kTolaPKR || 437000).toLocaleString()}` : `$ ${(ratesData.metals.goldOzUSD || 4141.80).toLocaleString()}/oz`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Per 10 Grams:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {currency === 'PKR' ? `Rs ${(ratesData.metals.gold24k10gPKR || 374660).toLocaleString()}` : `$ ${((ratesData.metals.goldPerGramUSD || 133.16) * 10).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-800 dark:text-emerald-400 font-semibold pt-1 border-t border-slate-100 dark:border-slate-700/40">
                  <span>Per Gram:</span>
                  <span className="font-mono font-bold">
                    {currency === 'PKR' ? `Rs ${(ratesData.metals.gold24kGramPKR || 37466).toLocaleString()}` : `$ ${(ratesData.metals.goldPerGramUSD || 133.16).toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* 22K Gold Card */}
              <div className="bg-white/90 dark:bg-slate-800/90 p-3.5 rounded-xl border border-amber-200/80 dark:border-slate-700 shadow-xs space-y-1.5">
                <div className="flex justify-between items-center border-b border-amber-100 dark:border-slate-700/60 pb-1.5">
                  <span className="font-extrabold text-amber-800 dark:text-amber-300">22K Gold (Jewelry Rate)</span>
                  <button
                    type="button"
                    onClick={() => {
                      const g = currency === 'PKR' ? (ratesData.metals.gold22kGramPKR || 34344) : Number(((ratesData.metals.goldPerGramUSD || 133.16) * (22 / 24)).toFixed(2));
                      currency === 'PKR' ? setGoldPricePKR(g) : setGoldPriceUSD(g);
                    }}
                    className="text-[10px] font-bold text-amber-800 dark:text-amber-400 hover:text-amber-950 underline cursor-pointer"
                  >
                    Apply 22K
                  </button>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Per Tola:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {currency === 'PKR' ? `Rs ${(ratesData.metals.gold22kTolaPKR || 400580).toLocaleString()}` : `$ ${((ratesData.metals.goldOzUSD || 4141.80) * (22 / 24)).toFixed(0)}/oz`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Per 10 Grams:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {currency === 'PKR' ? `Rs ${(ratesData.metals.gold22k10gPKR || 343440).toLocaleString()}` : `$ ${((ratesData.metals.goldPerGramUSD || 133.16) * (22 / 24) * 10).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-800 dark:text-emerald-400 font-semibold pt-1 border-t border-slate-100 dark:border-slate-700/40">
                  <span>Per Gram:</span>
                  <span className="font-mono font-bold">
                    {currency === 'PKR' ? `Rs ${(ratesData.metals.gold22kGramPKR || 34344).toLocaleString()}` : `$ ${((ratesData.metals.goldPerGramUSD || 133.16) * (22 / 24)).toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* 24K Silver (Chandi) Card */}
              <div className="bg-white/90 dark:bg-slate-800/90 p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs space-y-1.5">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700/60 pb-1.5">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">24K Silver (Chandi 999)</span>
                  <button
                    type="button"
                    onClick={() => {
                      const s = currency === 'PKR' ? (ratesData.metals.silver24kGramPKR || 589.8) : (ratesData.metals.silverPerGramUSD || 1.95);
                      currency === 'PKR' ? setSilverPricePKR(s) : setSilverPriceUSD(s);
                    }}
                    className="text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 underline cursor-pointer"
                  >
                    Apply Silver
                  </button>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Per Tola:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {currency === 'PKR' ? `Rs ${(ratesData.metals.silver24kTolaPKR || 6881).toLocaleString()}` : `$ ${(ratesData.metals.silverOzUSD || 60.52).toLocaleString()}/oz`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Per 10 Grams:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {currency === 'PKR' ? `Rs ${(ratesData.metals.silver24k10gPKR || 5898).toLocaleString()}` : `$ ${((ratesData.metals.silverPerGramUSD || 1.95) * 10).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-800 dark:text-emerald-400 font-semibold pt-1 border-t border-slate-100 dark:border-slate-700/40">
                  <span>Per Gram:</span>
                  <span className="font-mono font-bold">
                    {currency === 'PKR' ? `Rs ${(ratesData.metals.silver24kGramPKR || 589.8).toFixed(2)}` : `$ ${(ratesData.metals.silverPerGramUSD || 1.95).toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Custom Manual Price Adjustment Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/80 dark:bg-slate-800 p-3 rounded-xl border border-emerald-200/50 dark:border-slate-700">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Active Gold Price in Calculation:</span>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-mono font-bold bg-emerald-100/60 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                    1 Tola = {currency} {Math.round((currency === 'PKR' ? goldPricePKR : goldPriceUSD) * TOLA_GRAMS).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">Per gram ({currency}):</span>
                  <input
                    type="number"
                    value={currency === 'PKR' ? goldPricePKR : goldPriceUSD}
                    onChange={(e) =>
                      currency === 'PKR'
                        ? setGoldPricePKR(Number(e.target.value))
                        : setGoldPriceUSD(Number(e.target.value))
                    }
                    className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800 p-3 rounded-xl border border-emerald-200/50 dark:border-slate-700">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Active Silver Price in Calculation:</span>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-mono font-bold bg-emerald-100/60 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                    1 Tola = {currency} {Math.round((currency === 'PKR' ? silverPricePKR : silverPriceUSD) * TOLA_GRAMS).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">Per gram ({currency}):</span>
                  <input
                    type="number"
                    value={currency === 'PKR' ? silverPricePKR : silverPriceUSD}
                    onChange={(e) =>
                      currency === 'PKR'
                        ? setSilverPricePKR(Number(e.target.value))
                        : setSilverPriceUSD(Number(e.target.value))
                    }
                    className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: Zakatable Assets */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              1. Zakatable Assets
            </h3>

            <div>
              <label htmlFor="zakat-cash" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cash in Hand & Bank Accounts ({currency})
              </label>
              <input
                id="zakat-cash"
                type="number"
                min="0"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-mono font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="zakat-gold-amount" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Gold in Possession
                </label>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setGoldUnit('tola')}
                    className={`px-2 py-0.5 rounded font-bold ${goldUnit === 'tola' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800' : 'text-slate-500'}`}
                  >
                    Tola
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoldUnit('grams')}
                    className={`px-2 py-0.5 rounded font-bold ${goldUnit === 'grams' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800' : 'text-slate-500'}`}
                  >
                    Grams
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  id="zakat-gold-amount"
                  type="number"
                  min="0"
                  step="any"
                  value={goldAmount}
                  onChange={(e) => setGoldAmount(e.target.value)}
                  placeholder={`e.g. 5 ${goldUnit}`}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-mono font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
                {goldValue > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                    ≈ {currency} {Math.round(goldValue).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="zakat-silver-amount" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Silver in Possession
                </label>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSilverUnit('tola')}
                    className={`px-2 py-0.5 rounded font-bold ${silverUnit === 'tola' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' : 'text-slate-500'}`}
                  >
                    Tola
                  </button>
                  <button
                    type="button"
                    onClick={() => setSilverUnit('grams')}
                    className={`px-2 py-0.5 rounded font-bold ${silverUnit === 'grams' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' : 'text-slate-500'}`}
                  >
                    Grams
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  id="zakat-silver-amount"
                  type="number"
                  min="0"
                  step="any"
                  value={silverAmount}
                  onChange={(e) => setSilverAmount(e.target.value)}
                  placeholder={`e.g. 25 ${silverUnit}`}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-mono font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
                {silverValue > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    ≈ {currency} {Math.round(silverValue).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="zakat-investments" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shares, Mutual Funds & Liquid Investments ({currency})
              </label>
              <input
                id="zakat-investments"
                type="number"
                min="0"
                value={investments}
                onChange={(e) => setInvestments(e.target.value)}
                placeholder="Market value of tradable stocks"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-mono font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="zakat-inventory" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Business Inventory & Merchandise for Sale ({currency})
              </label>
              <input
                id="zakat-inventory"
                type="number"
                min="0"
                value={businessInventory}
                onChange={(e) => setBusinessInventory(e.target.value)}
                placeholder="Wholesale/Retail value of trade goods"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-mono font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="zakat-receivables" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Money Lent / Good Receivables ({currency})
              </label>
              <input
                id="zakat-receivables"
                type="number"
                min="0"
                value={receivables}
                onChange={(e) => setReceivables(e.target.value)}
                placeholder="Debts owed to you that will be collected"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-mono font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Section 2: Deductible Liabilities & Summary */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                2. Deductible Liabilities
              </h3>

              <div>
                <label htmlFor="zakat-debts" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Debts Immediately Due to Creditors ({currency})
                </label>
                <input
                  id="zakat-debts"
                  type="number"
                  min="0"
                  value={debtsDue}
                  onChange={(e) => setDebtsDue(e.target.value)}
                  placeholder="Immediate loans/credit card bills due"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-mono font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="zakat-bills" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pending Unpaid Bills, Salaries & Rent ({currency})
                </label>
                <input
                  id="zakat-bills"
                  type="number"
                  min="0"
                  value={pendingBills}
                  onChange={(e) => setPendingBills(e.target.value)}
                  placeholder="Utility bills, employee wages due"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-mono font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Results Hero Card */}
            <div className={`p-6 rounded-3xl border transition-all ${
              isEligible
                ? 'bg-linear-to-br from-emerald-600 to-teal-800 text-white border-emerald-600 shadow-md'
                : 'bg-slate-900 text-white border-slate-800 shadow-md'
            }`}>
              <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Zakat Obligation
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isEligible ? 'bg-emerald-400/20 border border-emerald-300/40 text-emerald-100' : 'bg-amber-400/20 text-amber-200'
                }`}>
                  {isEligible ? 'FARDH (Obligatory)' : 'Below Nisab Limit'}
                </span>
              </div>
              <div>
                <p className="text-xs text-emerald-100 font-medium">Total Zakat Due (2.5%):</p>
                <p className="text-3xl sm:text-4xl font-black font-mono tracking-tight mt-1 text-white">
                  {currency} {Math.round(zakatDue).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1.5 pt-4 mt-4 border-t border-white/20 text-xs font-mono text-emerald-50">
                <div className="flex justify-between">
                  <span>Gross Zakatable Assets:</span>
                  <span className="font-bold text-white">{currency} {Math.round(totalAssets).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-200">
                  <span>Deductible Liabilities:</span>
                  <span className="font-bold">- {currency} {Math.round(totalLiabilities).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-white/10 pt-1.5 text-white">
                  <span>Net Zakatable Wealth:</span>
                  <span>{currency} {Math.round(netZakatableWealth).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action buttons: Copy, PDF Report & Share */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                id="copy-zakat-btn"
                onClick={copyResult}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-300 font-bold border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
              <DownloadPdfButton
                buttonLabel="Zakat Statement PDF"
                variant="secondary"
                className="flex-1"
                size="md"
                getReportOptions={() => ({
                  title: 'Islamic Zakat Valuation & Calculation Statement',
                  subtitle: `Prepared in Accordance with Islamic Jurisprudence (Fiqh) - ${nisabStandard === 'silver' ? 'Silver Standard (52.5 Tola)' : 'Gold Standard (7.5 Tola)'}`,
                  category: 'zakat',
                  filename: `QuickTools_Zakat_Valuation_${currency}_${Math.round(zakatDue)}.pdf`,
                  summaryCards: [
                    {
                      title: 'Total Zakat Obligation',
                      value: `${currency} ${Math.round(zakatDue).toLocaleString()}`,
                      subtitle: isEligible ? 'FARDH (Obligatory 2.5%)' : 'Below Nisab Limit (Exempt)',
                      type: 'primary',
                    },
                    {
                      title: 'Net Zakatable Wealth',
                      value: `${currency} ${Math.round(netZakatableWealth).toLocaleString()}`,
                      subtitle: 'Total Assets less Liabilities',
                      type: 'secondary',
                    },
                    {
                      title: 'Nisab Threshold',
                      value: `${currency} ${Math.round(selectedNisabThreshold).toLocaleString()}`,
                      subtitle: `${nisabStandard === 'silver' ? 'Silver (52.5 Tola = 612.36g)' : 'Gold (7.5 Tola = 87.48g)'}`,
                      type: 'neutral',
                    },
                    {
                      title: 'Gross Assets Evaluated',
                      value: `${currency} ${Math.round(totalAssets).toLocaleString()}`,
                      subtitle: `Liabilities: ${currency} ${Math.round(totalLiabilities).toLocaleString()}`,
                      type: 'neutral',
                    },
                  ],
                  inputParameters: [
                    { label: 'Nisab Benchmark', value: nisabStandard === 'silver' ? 'Silver Standard (52.5 Tola / 612.36g)' : 'Gold Standard (7.5 Tola / 87.48g)' },
                    { label: 'Currency', value: currency },
                    { label: 'Gold Price per Gram', value: `${currency} ${currentGoldPrice.toLocaleString()} (PKR ${Math.round(goldPricePKR * TOLA_GRAMS).toLocaleString()}/tola)` },
                    { label: 'Silver Price per Gram', value: `${currency} ${currentSilverPrice.toLocaleString()} (PKR ${Math.round(silverPricePKR * TOLA_GRAMS).toLocaleString()}/tola)` },
                    { label: 'Prescribed Zakat Rate', value: '2.5% (1/40th) of Net Surplus Wealth' },
                    { label: 'Obligation Assessment', value: isEligible ? 'FARDH (Payable immediately)' : 'NOT OBLIGATORY (Below Nisab)' },
                  ],
                  detailedTables: [
                    {
                      title: 'Itemized Zakatable Assets & Liabilities Inventory',
                      head: ['Asset / Liability Classification', 'Declared Possession', 'Net Value Assessed'],
                      body: [
                        ['Liquid Cash & Bank Reserves', 'Cash in hand, savings, term deposits', `${currency} ${totalCash.toLocaleString()}`],
                        ['Gold Bullion & Jewelry', `${goldAmount || 0} ${goldUnit} declared`, `${currency} ${Math.round(goldValue).toLocaleString()}`],
                        ['Silver Bullion & Utensils', `${silverAmount || 0} ${silverUnit} declared`, `${currency} ${Math.round(silverValue).toLocaleString()}`],
                        ['Investments & Marketable Securities', 'Equities, mutual funds, Sukuk, crypto', `${currency} ${totalInvestments.toLocaleString()}`],
                        ['Business Trading Inventory', 'Finished goods at current wholesale value', `${currency} ${totalInventory.toLocaleString()}`],
                        ['Receivables & Debts Owed to You', 'Good debts expected to be collected', `${currency} ${totalReceivables.toLocaleString()}`],
                        ['Immediate Debts & Liabilities Due', 'Overdue debt payments', `-${currency} ${parseFloat(debtsDue || '0').toLocaleString()}`],
                        ['Household & Operational Bills Due', 'Unpaid rent, utilities, pending expenses', `-${currency} ${parseFloat(pendingBills || '0').toLocaleString()}`],
                        ['NET QUALIFYING ZAKAT WEALTH', 'Total Assets minus Deductible Liabilities', `${currency} ${Math.round(netZakatableWealth).toLocaleString()}`],
                      ],
                    },
                  ],
                  notesAndDisclaimers: [
                    'Zakat is the third pillar of Islam, obligatory on every adult Muslim possessing wealth exceeding Nisab for one full lunar year (Hawl).',
                    'The Silver Nisab standard is favored by Islamic scholars as it benefits a broader circle of impoverished beneficiaries (Mustahiqeen).',
                    'Personal use items (primary residence, daily vehicles, household furniture, clothing) are exempt from Zakat.',
                    'Beneficiaries must strictly fall under one of the 8 Quranic categories outlined in Surah At-Tawbah (9:60).',
                  ],
                })}
              />
              <ShareResultButton
                title={`Islamic Zakat Calculation (${currency} ${Math.round(zakatDue).toLocaleString()} Due) - QuickTools`}
                outcomeText={`Net Zakatable Wealth: ${currency} ${Math.round(netZakatableWealth).toLocaleString()}\nStatus: ${isEligible ? 'FARDH (Obligatory)' : 'Below Nisab Threshold'}\nTotal Zakat Due (2.5%): ${currency} ${Math.round(zakatDue).toLocaleString()}\nNisab Benchmark: ${nisabStandard === 'silver' ? 'Silver (52.5 Tola)' : 'Gold (7.5 Tola)'} (${currency} ${Math.round(selectedNisabThreshold).toLocaleString()})`}
                toolName="Zakat Calculator"
                buttonLabel="Share"
                className="flex-1 py-3"
                size="md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
