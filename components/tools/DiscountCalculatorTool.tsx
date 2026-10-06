import React, { useState, useMemo, useEffect } from 'react';
import { Tag, Check, Copy, Sparkles } from 'lucide-react';
import { saveRecentCalculation } from '@/lib/recentCalculations';
import { ShareResultButton } from './ShareResultButton';
import { DownloadPdfButton } from './DownloadPdfButton';

export function DiscountCalculatorTool() {
  const [originalPrice, setOriginalPrice] = useState<number | string>(5000);
  const [discountPercent, setDiscountPercent] = useState<number | string>(25);
  const [extraCoupon, setExtraCoupon] = useState<number | string>(10);
  const [taxPercent, setTaxPercent] = useState<number | string>(0);
  const [currencySymbol, setCurrencySymbol] = useState<'PKR' | 'USD'>('PKR');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const pr = sp.get('price');
      if (pr) setOriginalPrice(Number(pr) || 5000);
      const d = sp.get('discount');
      if (d) setDiscountPercent(Number(d) || 25);
      const c = sp.get('coupon');
      if (c) setExtraCoupon(Number(c) || 0);
      const t = sp.get('tax');
      if (t) setTaxPercent(Number(t) || 0);
      const cur = sp.get('currency');
      if (cur === 'PKR' || cur === 'USD') setCurrencySymbol(cur);
    } catch {}
  }, []);

  const price = Number(originalPrice) || 0;
  const d1 = Number(discountPercent) || 0;
  const d2 = Number(extraCoupon) || 0;
  const tax = Number(taxPercent) || 0;

  const { finalPrice, totalSaved, effectiveDiscountRate, taxAmount, firstDiscountAmount, couponSavingsAmount } = useMemo(() => {
    const d1Amount = price * (d1 / 100);
    const afterFirstDiscount = price - d1Amount;
    const d2Amount = afterFirstDiscount * (d2 / 100);
    const afterCoupon = afterFirstDiscount - d2Amount;
    const tAmount = afterCoupon * (tax / 100);
    const finalVal = Math.max(0, afterCoupon + tAmount);
    const saved = Math.max(0, price - finalVal);
    const rate = price > 0 ? (saved / price) * 100 : 0;

    return {
      finalPrice: finalVal,
      totalSaved: saved,
      effectiveDiscountRate: rate,
      taxAmount: tAmount,
      firstDiscountAmount: d1Amount,
      couponSavingsAmount: d2Amount,
    };
  }, [price, d1, d2, tax]);

  useEffect(() => {
    if (price > 0) {
      const sym = currencySymbol === 'PKR' ? 'Rs ' : '$';
      saveRecentCalculation({
        id: 'discount-calculator',
        name: 'Discount & Sale Calculator',
        href: '/discount-calculator',
        iconName: 'Tag',
        category: 'Math & Everyday',
        summary: `Was ${sym}${price.toLocaleString()} → Now ${sym}${finalPrice.toFixed(0)} (${effectiveDiscountRate.toFixed(0)}% Off)`,
        tag: `${d1}% + ${d2}% Promo`,
        gradient: 'from-amber-500 to-orange-600',
      });
    }
  }, [price, finalPrice, effectiveDiscountRate, d1, d2, currencySymbol]);

  const copyResult = () => {
    const sym = currencySymbol === 'PKR' ? 'Rs ' : '$';
    const text = `Discount Summary:
- Original Price: ${sym}${price.toLocaleString()}
- Primary Discount: ${d1}% (-${sym}${firstDiscountAmount.toLocaleString()})
- Extra Coupon: ${d2}% (-${sym}${couponSavingsAmount.toLocaleString()})
- Tax / GST: ${tax}% (+${sym}${taxAmount.toLocaleString()})
- Total Savings: ${sym}${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${effectiveDiscountRate.toFixed(1)}% off)
- Net Final Payable: ${sym}${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currPrefix = currencySymbol === 'PKR' ? 'Rs ' : '$';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
              <Tag className="w-3.5 h-3.5" />
              Smart Retail & Sale Savings
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
              Discount, Coupon & Tax Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Calculate exact savings with stacked seasonal sales discounts, promo coupons, and GST/VAT sales tax.
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 self-start">
            <button
              type="button"
              onClick={() => setCurrencySymbol('PKR')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currencySymbol === 'PKR' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              PKR (Rs)
            </button>
            <button
              type="button"
              onClick={() => setCurrencySymbol('USD')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currencySymbol === 'USD' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="space-y-1.5">
            <label htmlFor="orig-price" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Original Sticker Price
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {currPrefix}
              </span>
              <input
                id="orig-price"
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="5000"
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-base text-slate-900 dark:text-white focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="disc-pct" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Sale Discount (%)
            </label>
            <div className="relative">
              <input
                id="disc-pct"
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="25"
                className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-base text-slate-900 dark:text-white focus:border-amber-500 focus:outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="coupon-pct" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Extra Coupon Code (%)
            </label>
            <div className="relative">
              <input
                id="coupon-pct"
                type="number"
                min="0"
                max="100"
                value={extraCoupon}
                onChange={(e) => setExtraCoupon(e.target.value)}
                placeholder="10"
                className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-base text-slate-900 dark:text-white focus:border-amber-500 focus:outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="tax-pct" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Sales Tax / GST (%)
            </label>
            <div className="relative">
              <input
                id="tax-pct"
                type="number"
                min="0"
                max="100"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-base text-slate-900 dark:text-white focus:border-amber-500 focus:outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
            </div>
          </div>
        </div>

        {/* Quick Discount presets */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold mr-1">Quick Sale Presets:</span>
          {[10, 15, 20, 25, 30, 40, 50, 70].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setDiscountPercent(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                Number(discountPercent) === p
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs scale-105'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {p}% OFF
            </button>
          ))}
        </div>

        {/* Results Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-linear-to-br from-amber-50/70 via-emerald-50/30 to-white dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-2 border-amber-300/80 dark:border-amber-700 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                Final Net Payable Price
              </span>
            </div>
            
            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-black font-mono text-slate-900 dark:text-white">
                {currPrefix}{finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-base line-through text-slate-400 font-mono">
                Was {currPrefix}{price.toLocaleString()}
              </span>
            </div>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              You Save {currPrefix}{totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({effectiveDiscountRate.toFixed(1)}% total savings)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="copy-discount-btn"
              onClick={copyResult}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 shadow-xs transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <DownloadPdfButton
              buttonLabel="Receipt PDF"
              variant="secondary"
              size="md"
              getReportOptions={() => ({
                title: 'Retail Discount & Sales Tax Calculation Statement',
                subtitle: `Itemized Price Breakdown, Savings & Applicable Taxes - ${currencySymbol}`,
                category: 'discount',
                filename: `QuickTools_Discount_Receipt_${currencySymbol}_${Math.round(finalPrice)}.pdf`,
                summaryCards: [
                  {
                    title: 'Final Payable Price',
                    value: `${currPrefix}${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    subtitle: 'Net Total After Tax & Discounts',
                    type: 'primary',
                  },
                  {
                    title: 'Total Amount Saved',
                    value: `${currPrefix}${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    subtitle: `${effectiveDiscountRate.toFixed(1)}% Effective Discount`,
                    type: 'secondary',
                  },
                  {
                    title: 'Original Sticker Price',
                    value: `${currPrefix}${price.toLocaleString()}`,
                    subtitle: 'Full Retail Price',
                    type: 'neutral',
                  },
                  {
                    title: 'Sales Tax / GST Amount',
                    value: `+${currPrefix}${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    subtitle: `${tax}% Tax Rate`,
                    type: 'neutral',
                  },
                ],
                inputParameters: [
                  { label: 'Sticker Retail Price', value: `${currPrefix}${price.toLocaleString()}` },
                  { label: 'Primary Sale Discount', value: `${d1}%` },
                  { label: 'Extra Coupon / Voucher', value: `${d2}%` },
                  { label: 'Sales Tax / VAT Rate', value: `${tax}%` },
                  { label: 'Selected Currency', value: currencySymbol },
                  { label: 'Net Effective Discount Rate', value: `${effectiveDiscountRate.toFixed(1)}%` },
                ],
                detailedTables: [
                  {
                    title: 'Itemized Retail Bill & Price Deduction Audit',
                    head: ['Line Item', 'Calculation Formula', 'Amount'],
                    body: [
                      ['Original Retail Price', 'Base Sticker Price', `${currPrefix}${price.toFixed(2)}`],
                      ['Primary Store Discount', `-${d1}% of Original Price`, `-${currPrefix}${firstDiscountAmount.toFixed(2)}`],
                      ['Price After Store Discount', 'Subtotal 1', `${currPrefix}${(price - firstDiscountAmount).toFixed(2)}`],
                      ['Promotional Coupon Code', `-${d2}% of Subtotal 1`, `-${currPrefix}${couponSavingsAmount.toFixed(2)}`],
                      ['Taxable Subtotal', 'Price After All Discounts', `${currPrefix}${(price - firstDiscountAmount - couponSavingsAmount).toFixed(2)}`],
                      ['Sales Tax / VAT', `+${tax}% of Taxable Subtotal`, `+${currPrefix}${taxAmount.toFixed(2)}`],
                      ['FINAL NET PAYABLE', 'Total Out-of-Pocket Expense', `${currPrefix}${finalPrice.toFixed(2)}`],
                    ],
                  },
                ],
                notesAndDisclaimers: [
                  'Discounts are applied compounding sequentially: primary discount is deducted first, then coupon discount.',
                  'Sales tax (GST/VAT) is calculated on the discounted taxable subtotal.',
                ],
              })}
            />
            <ShareResultButton
              title={`Sale Discount & Savings Deal (${currPrefix}${finalPrice.toLocaleString()}) - QuickTools`}
              outcomeText={`Final Price: ${currPrefix}${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nOriginal Price: ${currPrefix}${price.toLocaleString()}\nTotal Savings: ${currPrefix}${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${effectiveDiscountRate.toFixed(1)}% off)`}
              toolName="Discount Calculator"
              params={{
                price,
                discount: d1,
                coupon: d2,
                tax,
                currency: currencySymbol,
              }}
            />
          </div>
        </div>

        {/* Detailed Breakdown Pill Box */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sticker Price</span>
            <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{currPrefix}{price.toLocaleString()}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">Sale Cut (-{d1}%)</span>
            <span className="text-sm font-mono font-bold text-emerald-800 dark:text-emerald-200">-{currPrefix}{firstDiscountAmount.toFixed(2)}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">Coupon Cut (-{d2}%)</span>
            <span className="text-sm font-mono font-bold text-amber-800 dark:text-amber-200">-{currPrefix}{couponSavingsAmount.toFixed(2)}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">Tax / GST (+{tax}%)</span>
            <span className="text-sm font-mono font-bold text-indigo-800 dark:text-indigo-200">+{currPrefix}{taxAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
