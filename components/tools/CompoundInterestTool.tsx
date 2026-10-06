import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Copy, Check, Table } from 'lucide-react';
import { ShareResultButton } from './ShareResultButton';
import { DownloadPdfButton } from './DownloadPdfButton';

export function CompoundInterestTool() {
  const [principal, setPrincipal] = useState<number | string>(100000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number | string>(5000);
  const [rate, setRate] = useState<number | string>(10);
  const [years, setYears] = useState<number | string>(10);
  const [frequency, setFrequency] = useState<number>(12);
  const [copied, setCopied] = useState(false);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const p = sp.get('principal');
      if (p) setPrincipal(Number(p) || 100000);
      const m = sp.get('monthly');
      if (m !== null && m !== undefined) setMonthlyDeposit(Number(m) || 0);
      const r = sp.get('rate');
      if (r) setRate(Number(r) || 10);
      const y = sp.get('years');
      if (y) setYears(Number(y) || 10);
      const f = sp.get('frequency');
      if (f) setFrequency(Number(f) || 12);
    } catch {}
  }, []);

  const P = Number(principal) || 0;
  const PMT = Number(monthlyDeposit) || 0;
  const r = (Number(rate) || 0) / 100;
  const t = Number(years) || 0;
  const n = frequency;

  const { futureValue, totalDeposited, totalInterest, yearlyBreakdown } = useMemo(() => {
    if (t <= 0) {
      return { futureValue: P, totalDeposited: P, totalInterest: 0, yearlyBreakdown: [] };
    }

    const breakdown = [];
    let currentBalance = P;
    let accumulatedDeposits = P;

    for (let yr = 1; yr <= t; yr++) {
      for (let m = 1; m <= 12; m++) {
        currentBalance += PMT;
        accumulatedDeposits += PMT;
        currentBalance *= (1 + r / 12);
      }
      breakdown.push({
        year: yr,
        deposits: accumulatedDeposits,
        interest: Math.max(0, currentBalance - accumulatedDeposits),
        balance: currentBalance,
      });
    }

    const totDeposited = P + PMT * 12 * t;
    const fVal = currentBalance;
    const totInt = Math.max(0, fVal - totDeposited);

    return {
      futureValue: fVal,
      totalDeposited: totDeposited,
      totalInterest: totInt,
      yearlyBreakdown: breakdown,
    };
  }, [P, PMT, r, t, n]);

  const copyResult = () => {
    const text = `Compound Interest Projection:
- Initial Principal: ${P.toLocaleString()}
- Monthly Contribution: ${PMT.toLocaleString()}
- Annual Rate: ${(r * 100).toFixed(1)}% for ${t} Years
- Total Deposited: ${totalDeposited.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Total Interest Earned: ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
- Future Wealth Value: ${futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Wealth & Investment Growth
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-2">
            Compound Interest Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Forecast the exponential growth of your investments and savings with recurring monthly deposits.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label htmlFor="comp-principal" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Initial Principal
            </label>
            <input
              id="comp-principal"
              type="number"
              min="0"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 font-mono font-bold text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="comp-deposit" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Deposit
            </label>
            <input
              id="comp-deposit"
              type="number"
              min="0"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 font-mono font-bold text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="comp-rate" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Annual Return Rate (%)
            </label>
            <input
              id="comp-rate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={rate}
              onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 font-mono font-bold text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="comp-years" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Years to Grow
            </label>
            <input
              id="comp-years"
              type="number"
              min="1"
              max="60"
              value={years}
              onChange={(e) => setYears(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 font-mono font-bold text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Results Banner */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/40 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-indigo-100 dark:border-slate-700 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Projected Future Balance in {years} Years:</p>
              <div className="text-4xl md:text-5xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                {futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="copy-compound-btn"
                onClick={copyResult}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <DownloadPdfButton
                buttonLabel="Investment PDF"
                variant="secondary"
                size="md"
                getReportOptions={() => ({
                  title: 'Compound Interest & Wealth Growth Projection Report',
                  subtitle: `Future Wealth Accumulation Over ${t} Years at ${(r * 100).toFixed(1)}% Annual Growth`,
                  category: 'investment',
                  filename: `QuickTools_Compound_Growth_${t}Y_${Math.round(futureValue)}.pdf`,
                  summaryCards: [
                    {
                      title: 'Projected Future Balance',
                      value: futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 }),
                      subtitle: `After ${t} Years Growth`,
                      type: 'primary',
                    },
                    {
                      title: 'Total Compound Interest',
                      value: `+${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                      subtitle: `${((totalInterest / (futureValue || 1)) * 100).toFixed(1)}% of Final Value`,
                      type: 'secondary',
                    },
                    {
                      title: 'Total Capital Invested',
                      value: totalDeposited.toLocaleString(undefined, { maximumFractionDigits: 0 }),
                      subtitle: 'Initial Principal + Monthly Deposits',
                      type: 'neutral',
                    },
                    {
                      title: 'Annual Rate of Return',
                      value: `${(r * 100).toFixed(1)}%`,
                      subtitle: n === 12 ? 'Compounded Monthly' : 'Compounded Annually',
                      type: 'neutral',
                    },
                  ],
                  inputParameters: [
                    { label: 'Initial Starting Capital', value: P.toLocaleString() },
                    { label: 'Monthly Recurring Deposit', value: `${PMT.toLocaleString()} / month` },
                    { label: 'Nominal Annual Interest Rate', value: `${(r * 100).toFixed(1)}% p.a.` },
                    { label: 'Investment Time Horizon', value: `${t} Years (${t * 12} Months)` },
                    { label: 'Compounding Frequency', value: n === 12 ? 'Monthly (12 times per year)' : `${n} times per year` },
                    { label: 'Total Contributions', value: totalDeposited.toLocaleString(undefined, { maximumFractionDigits: 0 }) },
                  ],
                  detailedTables: [
                    {
                      title: 'Year-by-Year Capital Progression & Growth Schedule',
                      head: ['Year', 'Total Deposits', 'Compound Interest Earned', 'Ending Portfolio Balance'],
                      body: yearlyBreakdown.map((row) => [
                        `Year ${row.year}`,
                        row.deposits.toLocaleString(undefined, { maximumFractionDigits: 0 }),
                        `+${row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                        row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 }),
                      ]),
                      notes: `Assumes regular compounding at constant rate of ${(r * 100).toFixed(1)}%.`,
                    },
                  ],
                  notesAndDisclaimers: [
                    'Projections are calculated using the compound interest formula with regular compounding intervals.',
                    'Actual investment returns on equities, mutual funds, or real estate fluctuate with market conditions.',
                    'Inflation and capital gains tax liabilities will reduce real post-tax purchasing power.',
                  ],
                })}
              />
              <ShareResultButton
                title="Compound Interest & Investment Wealth Projection - QuickTools"
                outcomeText={`Future Investment Value: ${futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nInitial Deposit: ${P.toLocaleString()} with ${PMT.toLocaleString()}/mo\nAnnual Rate: ${(r * 100).toFixed(1)}% for ${t} Years\nTotal Deposits: ${totalDeposited.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nTotal Interest Earned: ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                toolName="Compound Interest Calculator"
                params={{
                  principal: P,
                  monthly: PMT,
                  rate: Number(rate) || 10,
                  years: t,
                  frequency: n,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-400 block font-sans">Total Principal & Deposits Made:</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {totalDeposited.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-400 block font-sans">Total Compound Interest Earned:</span>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                +{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowTable(!showTable)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1.5"
          >
            <Table className="w-4 h-4" />
            {showTable ? 'Hide Annual Growth Table' : 'Show Year-by-Year Growth Table'}
          </button>
        </div>

        {/* Growth Table */}
        {showTable && (
          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2.5">Year</th>
                    <th className="p-2.5">Total Deposits</th>
                    <th className="p-2.5">Interest Earned</th>
                    <th className="p-2.5">Year-End Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  {yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">Year {row.year}</td>
                      <td className="p-2.5">{row.deposits.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="p-2.5 text-emerald-700 dark:text-emerald-400 font-bold">+{row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">{row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
