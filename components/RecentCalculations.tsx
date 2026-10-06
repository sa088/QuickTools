import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Trash2, 
  ArrowRight, 
  Calculator, 
  Coins, 
  Receipt, 
  Percent, 
  Ruler, 
  Tag, 
  HeartPulse, 
  ArrowLeftRight, 
  Landmark, 
  Calendar, 
  TrendingUp, 
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { getRecentCalculations, clearRecentCalculations, RecentCalculation } from '@/lib/recentCalculations';

const ICONS_MAP: Record<string, React.ReactNode> = {
  Coins: <Coins className="w-3.5 h-3.5" />,
  Receipt: <Receipt className="w-3.5 h-3.5" />,
  Percent: <Percent className="w-3.5 h-3.5" />,
  Ruler: <Ruler className="w-3.5 h-3.5" />,
  Tag: <Tag className="w-3.5 h-3.5" />,
  HeartPulse: <HeartPulse className="w-3.5 h-3.5" />,
  ArrowLeftRight: <ArrowLeftRight className="w-3.5 h-3.5" />,
  Landmark: <Landmark className="w-3.5 h-3.5" />,
  Calendar: <Calendar className="w-3.5 h-3.5" />,
  TrendingUp: <TrendingUp className="w-3.5 h-3.5" />,
};

function formatRelativeTime(ts: number): string {
  const diffSec = Math.floor((Date.now() - ts) / 1000);
  if (diffSec < 45) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

interface RecentCalculationsProps {
  onNavigate?: (href: string) => void;
  variant?: 'compact' | 'full';
}

export function RecentCalculations({ onNavigate, variant = 'compact' }: RecentCalculationsProps) {
  const [recentList, setRecentList] = useState<RecentCalculation[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadRecent = () => {
    setRecentList(getRecentCalculations());
  };

  useEffect(() => {
    setMounted(true);
    loadRecent();

    const handleUpdate = () => {
      loadRecent();
    };

    window.addEventListener('quicktools_recent_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('quicktools_recent_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  // If no calculations exist yet, do not render anything so top tools are 100% visible at first glance
  if (!mounted || recentList.length === 0) {
    return null;
  }

  // Compact resume bar: Takes minimal vertical space (~36px) so tools header and top tools remain visible!
  if (variant === 'compact' && !isExpanded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center justify-between gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 dark:bg-slate-900 border border-slate-700/80 text-white shadow-xs backdrop-blur-xs">
          <div className="flex items-center gap-2 min-w-0 overflow-x-auto no-scrollbar py-0.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 shrink-0">
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Recent:</span>
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              {recentList.slice(0, 3).map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleItemClick(e, item.href)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-medium text-slate-200 hover:text-white transition-colors border border-white/10 shrink-0 group cursor-pointer"
                  title={`${item.name}: ${item.summary}`}
                >
                  <span className="text-indigo-300 group-hover:text-indigo-200">
                    {ICONS_MAP[item.iconName] || <Calculator className="w-3 h-3" />}
                  </span>
                  <span className="font-semibold text-slate-100">{item.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-indigo-300 font-mono hidden md:inline truncate max-w-[130px]">
                    • {item.summary}
                  </span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-indigo-300 hover:text-indigo-100 font-semibold cursor-pointer hover:bg-white/10 transition-colors"
            >
              <span>All ({recentList.length})</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={clearRecentCalculations}
              className="text-slate-400 hover:text-rose-300 p-1 rounded transition-colors cursor-pointer"
              title="Clear calculation history"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Expanded View or Full Variant
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 animate-in fade-in duration-200">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-slate-800 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Your Recent Calculations
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Saved on your device • 100% Private
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 hidden sm:block">
                Quickly resume your calculations with your previous numbers intact.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {variant === 'compact' && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-colors border border-white/10 cursor-pointer"
              >
                <span>Collapse</span>
                <ChevronUp className="w-3 h-3" />
              </button>
            )}

            <button
              type="button"
              onClick={clearRecentCalculations}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-medium transition-colors border border-white/10 cursor-pointer"
              title="Clear saved history from your device"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Recent Items Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {recentList.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleItemClick(e, item.href)}
              className="group flex flex-col justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 transition-all duration-150 cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${item.gradient || 'from-indigo-500 to-indigo-700'} text-white flex items-center justify-center shadow-xs shrink-0`}>
                      {ICONS_MAP[item.iconName] || <Calculator className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium truncate block">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0 bg-white/5 px-1.5 py-0.5 rounded">
                    <Clock className="w-2.5 h-2.5" />
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-950/70 border border-white/5 font-mono text-[11px] text-indigo-200 break-words line-clamp-2 leading-relaxed">
                  {item.summary}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px]">
                {item.tag ? (
                  <span className="text-emerald-400 font-medium truncate max-w-[170px]">
                    • {item.tag}
                  </span>
                ) : (
                  <span></span>
                )}
                <span className="font-bold text-indigo-300 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform ml-auto text-xs">
                  Resume <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
