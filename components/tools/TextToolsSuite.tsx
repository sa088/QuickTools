import React, { useState, useMemo } from 'react';
import { 
  Type, 
  CaseSensitive, 
  AlignLeft, 
  Copy, 
  Check, 
  Trash2, 
  ArrowUpDown, 
  Clock, 
  Sparkles,
  Search,
  ListFilter
} from 'lucide-react';

type TextMode = 'counter' | 'case' | 'formatter';

export function TextToolsSuite({ defaultMode = 'counter' }: { defaultMode?: TextMode }) {
  const [activeTab, setActiveTab] = useState<TextMode>(defaultMode);
  const [inputText, setInputText] = useState<string>(
`QuickTools provides fast, privacy-focused online calculators and utilities for everyone.
Calculate taxes, loan EMI installments, currency conversions, and Zakat easily.
All computations run 100% inside your browser.`
  );

  const [copied, setCopied] = useState(false);
  const [findWord, setFindWord] = useState('');
  const [replaceWord, setReplaceWord] = useState('');

  // Stats computation
  const stats = useMemo(() => {
    const text = inputText;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;

    // Reading time: avg 200 wpm
    const readingMinutes = Math.ceil(words / 200);
    // Speaking time: avg 130 wpm
    const speakingMinutes = Math.ceil(words / 130);

    // Top keyword density
    const cleanTokens = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const freqMap: Record<string, number> = {};
    cleanTokens.forEach(t => { freqMap[t] = (freqMap[t] || 0) + 1; });
    const topKeywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percent: words > 0 ? Math.round((count / words) * 100) : 0
      }));

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingMinutes,
      speakingMinutes,
      topKeywords
    };
  }, [inputText]);

  // Case Conversion functions
  const transformCase = (type: string) => {
    let result = inputText;
    switch (type) {
      case 'upper':
        result = inputText.toUpperCase();
        break;
      case 'lower':
        result = inputText.toLowerCase();
        break;
      case 'title':
        result = inputText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
        break;
      case 'sentence':
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'camel':
        result = inputText
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase())
          .replace(/\s+/g, '');
        break;
      case 'pascal':
        result = inputText
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '');
        break;
      case 'snake':
        result = inputText
          .trim()
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
        break;
      case 'kebab':
        result = inputText
          .trim()
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        break;
      case 'constant':
        result = inputText
          .trim()
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
        break;
      default:
        break;
    }
    setInputText(result);
  };

  // Formatter functions
  const removeEmptyLines = () => {
    const lines = inputText.split('\n').filter(l => l.trim().length > 0);
    setInputText(lines.join('\n'));
  };

  const removeDuplicateLines = () => {
    const lines = inputText.split('\n');
    const unique = Array.from(new Set(lines));
    setInputText(unique.join('\n'));
  };

  const sortLines = (direction: 'asc' | 'desc') => {
    const lines = inputText.split('\n');
    lines.sort((a, b) => direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
    setInputText(lines.join('\n'));
  };

  const trimWhitespace = () => {
    const lines = inputText.split('\n').map(l => l.trim().replace(/\s+/g, ' '));
    setInputText(lines.join('\n').trim());
  };

  const addLineNumbers = () => {
    const lines = inputText.split('\n');
    const numbered = lines.map((l, i) => `${i + 1}. ${l}`);
    setInputText(numbered.join('\n'));
  };

  const executeFindReplace = () => {
    if (!findWord) return;
    const regex = new RegExp(findWord, 'gi');
    setInputText(inputText.replace(regex, replaceWord));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-bold">
              <Type className="w-3.5 h-3.5" />
              <span>Comprehensive Text Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Word Counter, Case Converter &amp; Text Cleaner
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Count words and characters in real time, convert between letter cases, calculate reading duration, and clean formatting.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Text' : 'Copy All'}</span>
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="mt-6 flex flex-wrap gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab('counter')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'counter'
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AlignLeft className="w-4 h-4" />
            <span>Word &amp; Character Counter</span>
          </button>

          <button
            onClick={() => setActiveTab('case')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'case'
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CaseSensitive className="w-4 h-4" />
            <span>Case Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('formatter')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'formatter'
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Text Cleaner &amp; Formatter</span>
          </button>
        </div>
      </div>

      {/* Main Text Area & Live Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Your Input Text:
              </span>
              <button
                onClick={() => setInputText('')}
                className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            <textarea
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or write your text here to see real-time statistics..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-violet-500 transition-all resize-y"
            />

            {/* Quick Case Transform Bar */}
            {activeTab === 'case' && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Click to Convert Case:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'upper', label: 'UPPERCASE' },
                    { id: 'lower', label: 'lowercase' },
                    { id: 'title', label: 'Title Case' },
                    { id: 'sentence', label: 'Sentence case' },
                    { id: 'camel', label: 'camelCase' },
                    { id: 'pascal', label: 'PascalCase' },
                    { id: 'snake', label: 'snake_case' },
                    { id: 'kebab', label: 'kebab-case' },
                    { id: 'constant', label: 'CONSTANT_CASE' },
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => transformCase(c.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/60 hover:text-violet-700 dark:hover:text-violet-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Formatter Operations */}
            {activeTab === 'formatter' && (
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Line &amp; Spacing Operations:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={removeEmptyLines}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-violet-50 hover:text-violet-600 cursor-pointer"
                    >
                      Remove Empty Lines
                    </button>
                    <button
                      onClick={removeDuplicateLines}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-violet-50 hover:text-violet-600 cursor-pointer"
                    >
                      Remove Duplicate Lines
                    </button>
                    <button
                      onClick={trimWhitespace}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-violet-50 hover:text-violet-600 cursor-pointer"
                    >
                      Trim Extra Spaces
                    </button>
                    <button
                      onClick={() => sortLines('asc')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-violet-50 hover:text-violet-600 cursor-pointer"
                    >
                      Sort A → Z
                    </button>
                    <button
                      onClick={() => sortLines('desc')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-violet-50 hover:text-violet-600 cursor-pointer"
                    >
                      Sort Z → A
                    </button>
                    <button
                      onClick={addLineNumbers}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-violet-50 hover:text-violet-600 cursor-pointer"
                    >
                      Add Line Numbers
                    </button>
                  </div>
                </div>

                {/* Find & Replace */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Find &amp; Replace:</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Find word..."
                      value={findWord}
                      onChange={(e) => setFindWord(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Replace with..."
                      value={replaceWord}
                      onChange={(e) => setReplaceWord(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <button
                      onClick={executeFindReplace}
                      className="px-4 py-1.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 cursor-pointer"
                    >
                      Replace All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Real-Time Metrics Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Live Word Statistics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] font-bold text-slate-400 block">Words</span>
                <span className="text-xl font-black text-violet-600 dark:text-violet-400 font-mono">
                  {stats.words.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] font-bold text-slate-400 block">Characters</span>
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  {stats.charsWithSpaces.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] font-bold text-slate-400 block">No Spaces</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {stats.charsNoSpaces.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] font-bold text-slate-400 block">Sentences</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {stats.sentences.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] font-bold text-slate-400 block">Paragraphs</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {stats.paragraphs.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] font-bold text-slate-400 block">Lines</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {stats.lines.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Reading / Speaking Duration */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Reading Time:</span>
                </span>
                <strong className="text-slate-800 dark:text-slate-200">~{stats.readingMinutes} min</strong>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Speaking Time:</span>
                </span>
                <strong className="text-slate-800 dark:text-slate-200">~{stats.speakingMinutes} min</strong>
              </div>
            </div>

            {/* Keyword Density */}
            {stats.topKeywords.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Top Keyword Density:
                </span>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {stats.topKeywords.map(k => (
                    <div key={k.word} className="flex items-center justify-between gap-2 text-xs min-w-0 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <span 
                        className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[130px] sm:max-w-[180px] break-all font-semibold"
                        title={k.word}
                      >
                        {k.word}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 font-mono bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                        {k.count}× ({k.percent}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
