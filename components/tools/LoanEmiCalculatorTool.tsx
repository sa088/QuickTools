import React, { useState, useMemo, useEffect } from 'react';
import { Landmark, Calendar, Percent, Copy, Check, Table } from 'lucide-react';
import { ShareResultButton } from './ShareResultButton';
import { DownloadPdfButton } from './DownloadPdfButton';

export function LoanEmiCalculatorTool() {
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');
  const [loanAmount, setLoanAmount] = useState<number | string>(2000000);
  const [interestRate, setInterestRate] = useState<number | string>(14);
  const [tenureYears, setTenureYears] = useState<number | string>(5);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [copied, setCopied] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const curr = sp.get('currency');
      if (curr === 'PKR' || curr === 'USD') setCurrency(curr);
      const amt = sp.get('amount');
      if (amt) setLoanAmount(Number(amt) || 2000000);
      const r = sp.get('rate');
      if (r) setInterestRate(Number(r) || 14);
      const ten = sp.get('tenure');
      if (ten) setTenureYears(Number(ten) || 5);
      const tt = sp.get('tenureType');
      if (tt === 'years' || tt === 'months') setTenureType(tt);
    } catch {}
  }, []);

  const P = Number(loanAmount) || 0;
  const annualRate = Number(interestRate) || 0;
  const totalMonths = tenureType === 'years' ? (Number(tenureYears) || 0) * 12 : Number(tenureYears) || 0;

  const { monthlyEmi, totalInterest, totalPayment, principalPercent, interestPercent, schedule } = useMemo(() => {
    if (P <= 0 || totalMonths <= 0) {
      return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0, principalPercent: 100, interestPercent: 0, schedule: [] };
    }
    const r = annualRate / 12 / 100;
    let emi = 0;
    if (r === 0) {
      emi = P / totalMonths;
    } else {
      emi = (P * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
    }

    const totPayment = emi * totalMonths;
    const totInterest = Math.max(0, totPayment - P);

    const sched = [];
    let balance = P;
    for (let m = 1; m <= Math.min(totalMonths, 120); m++) {
      const interestForMonth = balance * r;
      const principalForMonth = emi - interestForMonth;
      balance = Math.max(0, balance - principalForMonth);
      sched.push({
        month: m,
        emi,
        principal: principalForMonth,
        interest: interestForMonth,
        balance,
      });
    }

    const pPct = totPayment > 0 ? (P / totPayment) * 100 : 100;
    const iPct = totPayment > 0 ? (totInterest / totPayment) * 100 : 0;

    return {
      monthlyEmi: emi,
      totalInterest: totInterest,
      totalPayment: totPayment,
      principalPercent: pPct,
      interestPercent: iPct,
      schedule: sched,
    };
  }, [P, annualRate, totalMonths]);

  const copyResult = () => {
    const text = `Loan EMI Calculation Summary (${currency}):
- Loan Amount: ${currency} ${P.toLocaleString()}
- Annual Interest: ${annualRate}%
- Tenure: ${totalMonths} months (${(totalMonths / 12).toFixed(1)} years)
- Monthly EMI: ${currency} ${monthlyEmi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Total Interest: ${currency} ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Total Repayment: ${currency} ${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
              Banking Standard
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Loan & Car EMI Calculator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Accurate monthly repayment schedule for home mortgages, car auto finance, and personal loans.
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 self-start">
            <button
              type="button"
              onClick={() => setCurrency('PKR')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currency === 'PKR' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              PKR (Rs)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currency === 'USD' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label htmlFor="loan-principal" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Loan Amount ({currency})
            </label>
            <input
              id="loan-principal"
              type="number"
              min="0"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono text-base font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-1.5 mt-2">
              {[500000, 1000000, 2500000, 5000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLoanAmount(val)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {(val / 100000).toFixed(0)} Lakh
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="loan-interest" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Annual Interest Rate (%)
            </label>
            <div className="relative">
              <input
                id="loan-interest"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono text-base font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                % p.a.
              </span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[10, 12, 14, 18, 22].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInterestRate(val)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="loan-tenure" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tenure
              </label>
              <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setTenureType('years')}
                  className={`px-2 py-0.5 rounded ${tenureType === 'years' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Years
                </button>
                <button
                  type="button"
                  onClick={() => setTenureType('months')}
                  className={`px-2 py-0.5 rounded ${tenureType === 'months' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Months
                </button>
              </div>
            </div>
            <input
              id="loan-tenure"
              type="number"
              min="1"
              max="360"
              value={tenureYears}
              onChange={(e) => setTenureYears(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono text-base font-bold focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-2 font-medium">
              Total Duration: {totalMonths} months ({ (totalMonths / 12).toFixed(1) } years)
            </p>
          </div>
        </div>

        {/* Results Overview */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-slate-50 to-white dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-indigo-100 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-indigo-100 dark:border-slate-700 pb-4 md:pb-0 md:pr-6">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Monthly EMI Payment:</p>
              <p className="text-3xl lg:text-4xl font-extrabold font-mono text-indigo-900 dark:text-indigo-300 mt-1">
                {currency} {monthlyEmi.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-1">Due every month for {totalMonths} months</p>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Total Interest Payable:</span>
                  <span className="text-base font-bold text-amber-700 dark:text-amber-400">
                    {currency} {totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Total Repayment Amount:</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {currency} {totalPayment.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  <span>Principal: {principalPercent.toFixed(1)}%</span>
                  <span>Interest: {interestPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-amber-400 overflow-hidden flex shadow-inner">
                  <div style={{ width: `${principalPercent}%` }} className="bg-indigo-600 h-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1.5"
                >
                  <Table className="w-4 h-4" />
                  {showAmortization ? 'Hide Repayment Schedule' : 'View Monthly Amortization Schedule'}
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    id="copy-loan-result-btn"
                    onClick={copyResult}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <DownloadPdfButton
                    buttonLabel="Loan PDF Report"
                    variant="secondary"
                    size="sm"
                    getReportOptions={() => ({
                      title: 'Loan Repayment & EMI Amortization Report',
                      subtitle: `Equated Monthly Installment Schedule - ${currency} ${P.toLocaleString()} @ ${annualRate}% for ${totalMonths} Months`,
                      category: 'loan',
                      filename: `QuickTools_Loan_EMI_${currency}_${P}.pdf`,
                      summaryCards: [
                        {
                          title: 'Monthly EMI',
                          value: `${currency} ${Math.round(monthlyEmi).toLocaleString()}`,
                          subtitle: `For ${totalMonths} Monthly Installments`,
                          type: 'primary',
                        },
                        {
                          title: 'Total Interest Payable',
                          value: `${currency} ${Math.round(totalInterest).toLocaleString()}`,
                          subtitle: `${interestPercent.toFixed(1)}% of Repayment`,
                          type: 'secondary',
                        },
                        {
                          title: 'Total Repayment',
                          value: `${currency} ${Math.round(totalPayment).toLocaleString()}`,
                          subtitle: 'Principal + Interest',
                          type: 'neutral',
                        },
                        {
                          title: 'Principal Loan Amount',
                          value: `${currency} ${P.toLocaleString()}`,
                          subtitle: `${principalPercent.toFixed(1)}% of Total`,
                          type: 'neutral',
                        },
                      ],
                      inputParameters: [
                        { label: 'Loan Principal Borrowed', value: `${currency} ${P.toLocaleString()}` },
                        { label: 'Annual Interest Rate', value: `${annualRate}% per annum` },
                        { label: 'Tenure Duration', value: `${totalMonths} Months (${(totalMonths / 12).toFixed(1)} Years)` },
                        { label: 'Repayment Type', value: 'Monthly Equal Installments (EMI)' },
                        { label: 'Interest Compounding', value: 'Monthly Reducing Balance' },
                        { label: 'Selected Currency', value: currency },
                      ],
                      detailedTables: [
                        {
                          title: `Repayment Amortization Schedule (First ${Math.min(schedule.length, 24)} Months)`,
                          head: ['Month', 'Monthly EMI', 'Principal Portion', 'Interest Portion', 'Remaining Principal'],
                          body: schedule.slice(0, 24).map((s) => [
                            `Month ${s.month}`,
                            `${currency} ${Math.round(s.emi).toLocaleString()}`,
                            `${currency} ${Math.round(s.principal).toLocaleString()}`,
                            `${currency} ${Math.round(s.interest).toLocaleString()}`,
                            `${currency} ${Math.round(s.balance).toLocaleString()}`,
                          ]),
                          notes: `Complete loan schedule spans ${totalMonths} monthly installments. Showing first ${Math.min(schedule.length, 24)} months.`,
                        },
                      ],
                      notesAndDisclaimers: [
                        'EMI calculations use the standard reducing balance actuarial formula: E = P * r * (1+r)^n / ((1+r)^n - 1).',
                        'Bank financing may include processing fees, mortgage insurance, and legal charges.',
                      ],
                    })}
                  />
                  <ShareResultButton
                    title={`Loan & EMI Repayment Summary (${currency} ${P.toLocaleString()}) - QuickTools`}
                    outcomeText={`Monthly EMI: ${currency} ${monthlyEmi.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}\nLoan Amount: ${currency} ${P.toLocaleString()} @ ${annualRate}% for ${totalMonths} months\nTotal Interest: ${currency} ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}\nTotal Repayment: ${currency} ${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                    toolName="Loan & EMI Calculator"
                    params={{
                      currency,
                      amount: P,
                      rate: annualRate,
                      tenure: tenureYears,
                      tenureType,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization Table */}
        {showAmortization && (
          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Repayment Schedule (First {schedule.length} Months)
            </h3>
            <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2.5">Month</th>
                    <th className="p-2.5">EMI ({currency})</th>
                    <th className="p-2.5">Principal</th>
                    <th className="p-2.5">Interest</th>
                    <th className="p-2.5">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  {schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">#{row.month}</td>
                      <td className="p-2.5">{row.emi.toFixed(0)}</td>
                      <td className="p-2.5 text-emerald-700 dark:text-emerald-400">{row.principal.toFixed(0)}</td>
                      <td className="p-2.5 text-amber-700 dark:text-amber-400">{row.interest.toFixed(0)}</td>
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">{row.balance.toFixed(0)}</td>
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
