import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Check, Copy, Gift } from 'lucide-react';
import { ShareResultButton } from './ShareResultButton';

export function AgeCalculatorTool() {
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [targetDate, setTargetDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const b = sp.get('birthDate') || sp.get('dob');
      if (b) setBirthDate(b);
      const t = sp.get('targetDate');
      if (t) setTargetDate(t);
    } catch {}
  }, []);

  const {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    nextBirthdayDays,
    bornDayOfWeek,
    zodiacSign,
  } = useMemo(() => {
    if (!birthDate || !targetDate) {
      return {
        years: 0,
        months: 0,
        days: 0,
        totalMonths: 0,
        totalWeeks: 0,
        totalDays: 0,
        totalHours: 0,
        nextBirthdayDays: 0,
        bornDayOfWeek: '',
        zodiacSign: '',
      };
    }
    const birth = new Date(birthDate + 'T00:00:00');
    const target = new Date(targetDate + 'T00:00:00');

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || target < birth) {
      return {
        years: 0,
        months: 0,
        days: 0,
        totalMonths: 0,
        totalWeeks: 0,
        totalDays: 0,
        totalHours: 0,
        nextBirthdayDays: 0,
        bornDayOfWeek: '',
        zodiacSign: '',
      };
    }

    let y = target.getFullYear() - birth.getFullYear();
    let m = target.getMonth() - birth.getMonth();
    let d = target.getDate() - birth.getDate();

    if (d < 0) {
      m -= 1;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      d += prevMonthLastDay;
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totWeeks = Math.floor(totDays / 7);
    const totMonths = y * 12 + m;
    const totHours = totDays * 24;

    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const nextBdayMs = nextBday.getTime() - target.getTime();
    const nextBdayDays = Math.ceil(nextBdayMs / (1000 * 60 * 60 * 24));

    const daysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDay = daysArr[birth.getDay()];

    const bMonth = birth.getMonth() + 1;
    const bDay = birth.getDate();
    let zodiac = 'Capricorn';
    if ((bMonth === 1 && bDay >= 20) || (bMonth === 2 && bDay <= 18)) zodiac = 'Aquarius';
    else if ((bMonth === 2 && bDay >= 19) || (bMonth === 3 && bDay <= 20)) zodiac = 'Pisces';
    else if ((bMonth === 3 && bDay >= 21) || (bMonth === 4 && bDay <= 19)) zodiac = 'Aries';
    else if ((bMonth === 4 && bDay >= 20) || (bMonth === 5 && bDay <= 20)) zodiac = 'Taurus';
    else if ((bMonth === 5 && bDay >= 21) || (bMonth === 6 && bDay <= 20)) zodiac = 'Gemini';
    else if ((bMonth === 6 && bDay >= 21) || (bMonth === 7 && bDay <= 22)) zodiac = 'Cancer';
    else if ((bMonth === 7 && bDay >= 23) || (bMonth === 8 && bDay <= 22)) zodiac = 'Leo';
    else if ((bMonth === 8 && bDay >= 23) || (bMonth === 9 && bDay <= 22)) zodiac = 'Virgo';
    else if ((bMonth === 9 && bDay >= 23) || (bMonth === 10 && bDay <= 22)) zodiac = 'Libra';
    else if ((bMonth === 10 && bDay >= 23) || (bMonth === 11 && bDay <= 21)) zodiac = 'Scorpio';
    else if ((bMonth === 11 && bDay >= 22) || (bMonth === 12 && bDay <= 21)) zodiac = 'Sagittarius';

    return {
      years: y,
      months: m,
      days: d,
      totalMonths: totMonths,
      totalWeeks: totWeeks,
      totalDays: totDays,
      totalHours: totHours,
      nextBirthdayDays: nextBdayDays,
      bornDayOfWeek: bornDay,
      zodiacSign: zodiac,
    };
  }, [birthDate, targetDate]);

  const copyResult = () => {
    const text = `Age Calculation:
- Exact Age: ${years} Years, ${months} Months, ${days} Days
- Born on: ${bornDayOfWeek} (${zodiacSign})
- Total Days Lived: ${totalDays.toLocaleString()} Days
- Next Birthday In: ${nextBirthdayDays} Days`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Exact Chronological Age
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-2">
            Exact Age & Birthday Countdown Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate your precise age in years, months, days, total weeks, hours lived, and countdown to your next birthday.
          </p>
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="birth-date-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Date of Birth
            </label>
            <input
              id="birth-date-input"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium text-sm focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="target-date-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Age at Date (Default: Today)
            </label>
            <input
              id="target-date-input"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium text-sm focus:bg-white dark:focus:bg-slate-850 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Result Highlight */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-indigo-100 dark:border-slate-700 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your Current Exact Age:</p>
              <div className="flex flex-wrap items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono text-indigo-900 dark:text-indigo-300">
                  {years} <span className="text-lg font-bold text-slate-600 dark:text-slate-400">Years</span>
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-800 dark:text-indigo-400">
                  {months} <span className="text-base font-bold text-slate-500 dark:text-slate-400">Months</span>
                </span>
                <span className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-700 dark:text-indigo-400">
                  {days} <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Days</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="copy-age-btn"
                onClick={copyResult}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
              <ShareResultButton
                title="Exact Age & Birthday Countdown - QuickTools"
                outcomeText={`Exact Age: ${years} Years, ${months} Months, ${days} Days\nBorn on: ${bornDayOfWeek} (${zodiacSign})\nTotal Days Lived: ${totalDays.toLocaleString()} Days\nNext Birthday In: ${nextBirthdayDays} Days`}
                toolName="Age Calculator"
                params={{
                  birthDate,
                  targetDate,
                }}
              />
            </div>
          </div>

          {/* Birthday Countdown Banner */}
          <div className="p-4 rounded-xl bg-indigo-600 text-white flex items-center justify-between flex-wrap gap-3 shadow-md shadow-indigo-200 dark:shadow-none">
            <div className="flex items-center gap-2.5">
              <Gift className="w-5 h-5 text-indigo-200 animate-bounce" />
              <div>
                <p className="text-xs font-bold text-indigo-100 uppercase tracking-wide">Next Birthday Countdown</p>
                <p className="text-sm font-semibold">
                  {nextBirthdayDays === 0 ? '🎉 Happy Birthday Today!' : `Your next birthday is in ${nextBirthdayDays} days`}
                </p>
              </div>
            </div>
            <div className="text-xs font-medium bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
              Born on a {bornDayOfWeek} • {zodiacSign}
            </div>
          </div>

          {/* Breakdown Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">Total Months:</span>
              <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">{totalMonths.toLocaleString()}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">Total Weeks:</span>
              <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">{totalWeeks.toLocaleString()}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">Total Days:</span>
              <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">{totalDays.toLocaleString()}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 block font-medium">Total Hours:</span>
              <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">{totalHours.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
