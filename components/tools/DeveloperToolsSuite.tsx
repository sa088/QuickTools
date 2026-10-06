import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  Terminal, 
  Braces, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  AlertCircle, 
  CheckCircle2,
  FileCode,
  Link2
} from 'lucide-react';

type DevMode = 'json' | 'url' | 'base64' | 'regex';

export function DeveloperToolsSuite({ defaultMode = 'json' }: { defaultMode?: DevMode }) {
  const [activeTab, setActiveTab] = useState<DevMode>(defaultMode);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- JSON FORMATTER STATE ---
  const [jsonInput, setJsonInput] = useState<string>(
`{"app":"QuickTools","features":["Calculators","Converters","PDF Studio"],"active":true,"version":2.5,"stats":{"users":125000,"rating":4.9}}`
  );
  const [jsonIndent, setJsonIndent] = useState<number>(2);

  const jsonResult = useMemo(() => {
    if (!jsonInput.trim()) return { formatted: '', error: null, keysCount: 0, byteSize: 0 };
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, jsonIndent);
      const keysCount = typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1;
      const byteSize = new Blob([formatted]).size;
      return { formatted, error: null, keysCount, byteSize };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON format';
      return { formatted: '', error: msg, keysCount: 0, byteSize: 0 };
    }
  }, [jsonInput, jsonIndent]);

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
    } catch {
      // ignore
    }
  };

  const beautifyJson = () => {
    if (jsonResult.formatted) {
      setJsonInput(jsonResult.formatted);
    }
  };

  // --- URL ENCODER / DECODER STATE ---
  const [urlInput, setUrlInput] = useState<string>('https://quicktools.app/search?query=zakat calculator&currency=PKR&tax_year=2026');
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');

  const processedUrl = useMemo(() => {
    try {
      if (urlMode === 'encode') {
        return encodeURIComponent(urlInput);
      } else {
        return decodeURIComponent(urlInput);
      }
    } catch {
      return 'Error processing URL string';
    }
  }, [urlInput, urlMode]);

  // Query param parser
  const parsedQueryParams = useMemo(() => {
    try {
      const url = new URL(urlInput);
      const params: { key: string; value: string }[] = [];
      url.searchParams.forEach((val, key) => {
        params.push({ key, value: val });
      });
      return { origin: url.origin, pathname: url.pathname, params };
    } catch {
      return null;
    }
  }, [urlInput]);

  // --- BASE64 ENCODER / DECODER STATE ---
  const [b64Input, setB64Input] = useState<string>('Hello from QuickTools High-Precision Suite!');
  const [b64Mode, setB64Mode] = useState<'encode' | 'decode'>('encode');

  const processedBase64 = useMemo(() => {
    try {
      if (b64Mode === 'encode') {
        return btoa(unescape(encodeURIComponent(b64Input)));
      } else {
        return decodeURIComponent(escape(atob(b64Input)));
      }
    } catch {
      return 'Error: Invalid Base64 input string';
    }
  }, [b64Input, b64Mode]);

  // --- REGEX TESTER STATE ---
  const [regexPattern, setRegexPattern] = useState<string>('[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}');
  const [regexFlags, setRegexFlags] = useState<string>('gi');
  const [regexTestText, setRegexTestText] = useState<string>(
`Contact our developer support team at dev@quicktools.app or admin@example.org.
You can also reach feedback@domain.co.uk anytime.`
  );

  const regexMatches = useMemo(() => {
    if (!regexPattern) return [];
    try {
      const reg = new RegExp(regexPattern, regexFlags);
      const matches: { text: string; index: number }[] = [];
      let match;
      if (regexFlags.includes('g')) {
        while ((match = reg.exec(regexTestText)) !== null) {
          matches.push({ text: match[0], index: match.index });
          if (match.index === reg.lastIndex) reg.lastIndex++;
        }
      } else {
        const single = reg.exec(regexTestText);
        if (single) matches.push({ text: single[0], index: single.index });
      }
      return matches;
    } catch {
      return [];
    }
  }, [regexPattern, regexFlags, regexTestText]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>In-Browser Developer Tools</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              JSON Formatter, URL Tools &amp; Regex Tester
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Beautify and validate JSON schemas, parse URL parameters, encode Base64 strings, and test regular expressions instantly.
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="mt-6 flex flex-wrap gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'json'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Braces className="w-4 h-4" />
            <span>JSON Formatter &amp; Validator</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>URL Encoder &amp; Parser</span>
          </button>

          <button
            onClick={() => setActiveTab('base64')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'base64'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Base64 Encoder / Decoder</span>
          </button>

          <button
            onClick={() => setActiveTab('regex')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'regex'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Regex Tester</span>
          </button>
        </div>
      </div>

      {/* TAB 1: JSON FORMATTER */}
      {activeTab === 'json' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Indentation:</span>
              <select
                value={jsonIndent}
                onChange={(e) => setJsonIndent(Number(e.target.value))}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={beautifyJson}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Beautify
              </button>
              <button
                onClick={minifyJson}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Minify
              </button>
              <button
                onClick={() => setJsonInput('')}
                className="px-3 py-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Input JSON String:</label>
              <textarea
                rows={14}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste raw JSON here..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Formatted &amp; Validated JSON:</label>
                {jsonResult.formatted && (
                  <button
                    onClick={() => handleCopy(jsonResult.formatted, 'json-out')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'json-out' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'json-out' ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
              <textarea
                readOnly
                rows={14}
                value={jsonResult.error ? `Error: ${jsonResult.error}` : jsonResult.formatted}
                className={`w-full p-3.5 rounded-2xl border font-mono text-xs select-all ${
                  jsonResult.error
                    ? 'border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white'
                }`}
              />
            </div>
          </div>

          {/* Validation Status Indicator */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 text-xs">
            {jsonResult.error ? (
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Invalid JSON: {jsonResult.error}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Valid JSON Syntax ({jsonResult.keysCount} keys, {jsonResult.byteSize} bytes)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: URL ENCODER & PARSER */}
      {activeTab === 'url' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => setUrlMode('encode')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                urlMode === 'encode'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Encode URL Component
            </button>
            <button
              onClick={() => setUrlMode('decode')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                urlMode === 'decode'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Decode URL String
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Input URL / Query String:</label>
              <textarea
                rows={3}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {urlMode === 'encode' ? 'Encoded URL String:' : 'Decoded URL String:'}
                </label>
                <button
                  onClick={() => handleCopy(processedUrl, 'url-out')}
                  className="text-xs text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'url-out' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'url-out' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={3}
                value={processedUrl}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs select-all text-blue-700 dark:text-blue-300"
              />
            </div>

            {/* Parsed Query Parameters Table */}
            {parsedQueryParams && parsedQueryParams.params.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Parsed Query Parameters ({parsedQueryParams.params.length}):
                </span>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                      <tr>
                        <th className="p-2.5 text-left">Parameter Key</th>
                        <th className="p-2.5 text-left">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {parsedQueryParams.params.map((p, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-blue-600 dark:text-blue-400">{p.key}</td>
                          <td className="p-2.5 text-slate-800 dark:text-slate-200">{p.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BASE64 */}
      {activeTab === 'base64' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => setB64Mode('encode')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                b64Mode === 'encode'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Encode (Text → Base64)
            </button>
            <button
              onClick={() => setB64Mode('decode')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                b64Mode === 'decode'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Decode (Base64 → Text)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Input String:</label>
              <textarea
                rows={8}
                value={b64Input}
                onChange={(e) => setB64Input(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {b64Mode === 'encode' ? 'Base64 Encoded Output:' : 'Plain Text Decoded Output:'}
                </label>
                <button
                  onClick={() => handleCopy(processedBase64, 'b64-out')}
                  className="text-xs text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'b64-out' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'b64-out' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={processedBase64}
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs select-all text-blue-700 dark:text-blue-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REGEX TESTER */}
      {activeTab === 'regex' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Regular Expression Pattern:
                </label>
                <input
                  type="text"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  placeholder="e.g. \b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs text-blue-600 dark:text-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Flags:</label>
                <input
                  type="text"
                  value={regexFlags}
                  onChange={(e) => setRegexFlags(e.target.value)}
                  placeholder="g, i, m, s"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Test Text:</label>
              <textarea
                rows={6}
                value={regexTestText}
                onChange={(e) => setRegexTestText(e.target.value)}
                placeholder="Enter string to evaluate against regex..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
              />
            </div>

            {/* Matches list */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">
                  Matches Found: <strong className="text-blue-600 dark:text-blue-400">{regexMatches.length}</strong>
                </span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {regexMatches.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No matches found with this pattern.</p>
                ) : (
                  regexMatches.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 font-mono text-xs">
                      <span className="text-blue-800 dark:text-blue-300 font-bold truncate pr-2">
                        #{idx + 1}: &ldquo;{m.text}&rdquo;
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">index {m.index}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
