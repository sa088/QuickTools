import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { fetchLiveRates, getDefaultRates, DEFAULT_RATES, LiveRatesData } from '@/lib/liveRates';

export function TickerBar({ onNavigate }: { onNavigate?: (href: string) => void }) {
  const [rates, setRates] = useState<LiveRatesData>(getDefaultRates());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (force = false) => {
    setIsRefreshing(true);
    try {
      const data = await fetchLiveRates(force);
      if (data) {
        setRates(data);
      }
    } catch (err) {
      console.warn('Failed to load live rates for ticker', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // ALWAYS fetch fresh real-time rates on every page load, reload, or refresh!
    loadData(true);

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setRates(e.detail);
      }
    };
    window.addEventListener('quicktools_rates_updated', handleUpdate);

    // Auto-refresh every 60 seconds while the page stays open
    const interval = setInterval(() => {
      loadData(true);
    }, 60000);

    // Re-verify and fetch latest rates when user returns to this browser tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadData(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('quicktools_rates_updated', handleUpdate);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const pkrRate = rates?.currencies?.PKR ? rates.currencies.PKR : DEFAULT_RATES.currencies.PKR;
  const eurPkr = rates?.currencies?.EUR ? (pkrRate / rates.currencies.EUR).toFixed(2) : (pkrRate / DEFAULT_RATES.currencies.EUR).toFixed(2);
  const gbpPkr = rates?.currencies?.GBP ? (pkrRate / rates.currencies.GBP).toFixed(2) : (pkrRate / DEFAULT_RATES.currencies.GBP).toFixed(2);
  const aedPkr = rates?.currencies?.AED ? (pkrRate / rates.currencies.AED).toFixed(2) : (pkrRate / DEFAULT_RATES.currencies.AED).toFixed(2);
  const sarPkr = rates?.currencies?.SAR ? (pkrRate / rates.currencies.SAR).toFixed(2) : (pkrRate / DEFAULT_RATES.currencies.SAR).toFixed(2);

  const goldTola = (rates?.metals?.goldPerTolaPKR || DEFAULT_RATES.metals.goldPerTolaPKR).toLocaleString();
  const goldGram = (rates?.metals?.goldPerGramPKR || DEFAULT_RATES.metals.goldPerGramPKR).toLocaleString();
  const gold22kTola = (rates?.metals?.gold22kTolaPKR || DEFAULT_RATES.metals.gold22kTolaPKR).toLocaleString();
  const silverTola = (rates?.metals?.silverPerTolaPKR || DEFAULT_RATES.metals.silverPerTolaPKR).toLocaleString();
  const silverGram = (rates?.metals?.silverPerGramPKR || DEFAULT_RATES.metals.silverPerGramPKR).toLocaleString();
  const silverNisab = (rates?.nisab?.silverPKR || DEFAULT_RATES.nisab.silverPKR).toLocaleString();

  const tickerItems = [
    { label: "Today's 24K Gold (Pakistan)", value: `Rs ${goldTola} / Tola (Rs ${goldGram}/g)`, link: '/zakat-calculator', tag: "Sarafa Market" },
    { label: "Today's 22K Gold (Pakistan)", value: `Rs ${gold22kTola} / Tola`, link: '/zakat-calculator', tag: "Jewelry Standard" },
    { label: 'USD/PKR', value: `Rs ${pkrRate.toFixed(2)}`, link: '/currency-converter', tag: 'Live Forex' },
    { label: "Today's Silver (Chandi)", value: `Rs ${silverTola} / Tola (Rs ${silverGram}/g)`, link: '/zakat-calculator', tag: 'Bullion' },
    { label: 'Zakat Silver Nisab (52.5 Tola)', value: `Rs ${silverNisab}`, link: '/zakat-calculator', tag: 'Islamic Standard' },
    { label: 'AED/PKR', value: `Rs ${aedPkr}`, link: '/currency-converter', tag: 'Live Rate' },
    { label: 'SAR/PKR', value: `Rs ${sarPkr}`, link: '/currency-converter', tag: 'Live Rate' },
    { label: 'EUR/PKR', value: `Rs ${eurPkr}`, link: '/currency-converter', tag: 'Live Rate' },
    { label: 'GBP/PKR', value: `Rs ${gbpPkr}`, link: '/currency-converter', tag: 'Live Rate' },
    { label: 'FBR Tax FY 2025-26 & 2026-27', value: 'Salaried Slabs (0% up to Rs 600,000)', link: '/income-tax-calculator', tag: 'Official Slabs' },
    { label: 'Private & Secure', value: '100% In-Browser • Zero Tracking', link: '/about', tag: 'Verified' },
  ];

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <div id="top-scrolling-ticker" className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 overflow-hidden relative select-none">
      <div className="flex items-center h-8">
        <div className="z-10 bg-slate-900/95 backdrop-blur-xs px-2 sm:px-3 h-full flex items-center gap-1.5 border-r border-slate-800 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold tracking-wider text-[10px] text-emerald-400 uppercase">
            <span className="hidden sm:inline">Live Market Ticker</span>
            <span className="sm:hidden">Live Ticker</span>
          </span>
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            title={`Status: ${rates?.lastUpdated || 'Live'}. Click to refresh live rates now.`}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

        <div className="overflow-hidden flex-1 relative flex items-center h-full">
          <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
            {tickerItems.concat(tickerItems).map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={(e) => handleItemClick(e, item.link)}
                className="inline-flex items-center gap-2 hover:text-white transition-colors group cursor-pointer text-[11px]"
              >
                <span className="font-semibold text-slate-300 group-hover:text-indigo-300">
                  {item.label}:
                </span>
                <span className="font-mono font-bold text-amber-300 group-hover:text-amber-200">
                  {item.value}
                </span>
                {item.tag && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-sans group-hover:bg-indigo-900 group-hover:text-indigo-200">
                    {item.tag}
                  </span>
                )}
                <span className="text-slate-600 ml-3">•</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Refresh Button on the right */}
        <div className="z-10 bg-slate-900/95 px-2.5 h-full flex items-center border-l border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
            title="Refresh latest market bullion & exchange rates"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden md:inline">{isRefreshing ? 'Updating...' : 'Refresh Rates'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
