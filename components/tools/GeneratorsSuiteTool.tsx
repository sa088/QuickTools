import React, { useState, useEffect, useRef } from 'react';
import { 
  KeyRound, 
  QrCode, 
  Fingerprint, 
  Dices, 
  Copy, 
  Check, 
  RefreshCw, 
  Download, 
  Sliders, 
  Sparkles,
  Wifi,
  Mail,
  Link as LinkIcon
} from 'lucide-react';
import QRCode from 'qrcode';

type GenMode = 'password' | 'qrcode' | 'uuid' | 'random';

export function GeneratorsSuiteTool({ defaultMode = 'password' }: { defaultMode?: GenMode }) {
  const [activeTab, setActiveTab] = useState<GenMode>(defaultMode);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- PASSWORD GENERATOR STATE ---
  const [pwLength, setPwLength] = useState<number>(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(true);
  const [batchCount, setBatchCount] = useState<number>(1);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generatePasswords = () => {
    let chars = '';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const num = '0123456789';
    const sym = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (useUpper) chars += avoidAmbiguous ? upper.replace(/[IO]/g, '') : upper;
    if (useLower) chars += avoidAmbiguous ? lower.replace(/[lo]/g, '') : lower;
    if (useNumbers) chars += avoidAmbiguous ? num.replace(/[01]/g, '') : num;
    if (useSymbols) chars += sym;

    if (!chars) chars = lower;

    const list: string[] = [];
    const count = Math.min(Math.max(1, batchCount), 20);
    const cryptoObj = window.crypto || (window as unknown as { msCrypto: Crypto }).msCrypto;

    for (let b = 0; b < count; b++) {
      let pwd = '';
      const array = new Uint32Array(pwLength);
      cryptoObj.getRandomValues(array);
      for (let i = 0; i < pwLength; i++) {
        pwd += chars[array[i] % chars.length];
      }
      list.push(pwd);
    }
    setPasswords(list);
  };

  useEffect(() => {
    generatePasswords();
  }, [pwLength, useUpper, useLower, useNumbers, useSymbols, avoidAmbiguous, batchCount]);

  // Password strength calculation
  const pwStrength = (() => {
    let poolSize = 0;
    if (useUpper) poolSize += 26;
    if (useLower) poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += 25;
    if (poolSize === 0) poolSize = 26;

    const entropy = Math.round(pwLength * Math.log2(poolSize));
    let label = 'Weak';
    let color = 'bg-rose-500';
    let percent = 25;

    if (entropy >= 80) {
      label = 'Very Strong';
      color = 'bg-emerald-500';
      percent = 100;
    } else if (entropy >= 60) {
      label = 'Strong';
      color = 'bg-teal-500';
      percent = 75;
    } else if (entropy >= 40) {
      label = 'Moderate';
      color = 'bg-amber-500';
      percent = 50;
    }

    return { entropy, label, color, percent };
  })();

  // --- QR CODE GENERATOR STATE ---
  const [qrType, setQrType] = useState<'url' | 'text' | 'wifi' | 'email'>('url');
  const [qrContent, setQrContent] = useState('https://quicktoolsonline.vercel.app');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [qrFgColor, setQrFgColor] = useState('#0f172a');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');

  const buildQrString = () => {
    if (qrType === 'wifi') {
      return `WIFI:S:${wifiSsid};T:${wifiAuth};P:${wifiPass};;`;
    }
    if (qrType === 'email') {
      return `mailto:${qrContent}`;
    }
    return qrContent || 'https://quicktoolsonline.vercel.app';
  };

  useEffect(() => {
    const raw = buildQrString();
    QRCode.toDataURL(raw, {
      width: 320,
      margin: 2,
      color: {
        dark: qrFgColor,
        light: qrBgColor
      }
    }).then(setQrDataUrl).catch(console.error);

    QRCode.toString(raw, {
      type: 'svg',
      margin: 2,
      color: {
        dark: qrFgColor,
        light: qrBgColor
      }
    }).then(setQrSvgString).catch(console.error);
  }, [qrType, qrContent, wifiSsid, wifiPass, wifiAuth, qrFgColor, qrBgColor]);

  const downloadQrCode = (type: 'png' | 'svg') => {
    if (type === 'png' && qrDataUrl) {
      const a = document.createElement('a');
      a.href = qrDataUrl;
      a.download = `QuickTools_QRCode_${Date.now()}.png`;
      a.click();
    } else if (type === 'svg' && qrSvgString) {
      const blob = new Blob([qrSvgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QuickTools_QRCode_${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // --- UUID / HASH GENERATOR STATE ---
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidHyphens, setUuidHyphens] = useState<boolean>(true);
  const [uuidUpper, setUuidUpper] = useState<boolean>(false);
  const [uuidList, setUuidList] = useState<string[]>([]);

  const generateUuids = () => {
    const list: string[] = [];
    const count = Math.min(Math.max(1, uuidCount), 50);
    for (let i = 0; i < count; i++) {
      let u: string = crypto.randomUUID();
      if (!uuidHyphens) u = u.replace(/-/g, '');
      if (uuidUpper) u = u.toUpperCase();
      list.push(u);
    }
    setUuidList(list);
  };

  useEffect(() => {
    generateUuids();
  }, [uuidCount, uuidHyphens, uuidUpper]);

  // --- RANDOM NUMBER & PIN GENERATOR STATE ---
  const [minNum, setMinNum] = useState<number>(1);
  const [maxNum, setMaxNum] = useState<number>(100);
  const [randomCount, setRandomCount] = useState<number>(5);
  const [uniqueRandom, setUniqueRandom] = useState<boolean>(true);
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const [generatedPin, setGeneratedPin] = useState<string>('');
  const [coinResult, setCoinResult] = useState<'Heads' | 'Tails' | null>(null);
  const [diceResult, setDiceResult] = useState<number | null>(null);

  const generateRandomNumbers = () => {
    const min = Math.min(minNum, maxNum);
    const max = Math.max(minNum, maxNum);
    const count = Math.min(Math.max(1, randomCount), 100);

    const range = max - min + 1;
    const results: number[] = [];

    if (uniqueRandom && count <= range) {
      const pool = Array.from({ length: range }, (_, i) => min + i);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        results.push(pool[idx]);
        pool.splice(idx, 1);
      }
    } else {
      for (let i = 0; i < count; i++) {
        results.push(Math.floor(Math.random() * range) + min);
      }
    }
    setRandomNumbers(results);
  };

  const generatePin = (digits = 4) => {
    let pin = '';
    for (let i = 0; i < digits; i++) {
      pin += Math.floor(Math.random() * 10).toString();
    }
    setGeneratedPin(pin);
  };

  const flipCoin = () => {
    setCoinResult(Math.random() < 0.5 ? 'Heads' : 'Tails');
  };

  const rollDice = () => {
    setDiceResult(Math.floor(Math.random() * 6) + 1);
  };

  useEffect(() => {
    generateRandomNumbers();
    generatePin(4);
  }, []);

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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cryptographic Generators Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Password, QR Code &amp; Security Generators
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              High-entropy password generation, customizable vector QR codes, UUID v4 hashes, and random sequence tools.
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="mt-6 flex flex-wrap gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'password'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Password Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('qrcode')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'qrcode'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('uuid')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'uuid'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>UUID &amp; GUID</span>
          </button>

          <button
            onClick={() => setActiveTab('random')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'random'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Random Numbers &amp; PIN</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PASSWORD GENERATOR */}
      {activeTab === 'password' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          {/* Main output */}
          <div className="relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="font-mono text-base sm:text-xl font-bold text-slate-900 dark:text-white select-all break-all pr-4">
              {passwords[0] || 'Generating...'}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={generatePasswords}
                className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-600 shadow-2xs transition-colors cursor-pointer"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleCopy(passwords[0], 'main-pwd')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === 'main-pwd' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === 'main-pwd' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Strength Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500">Security Strength: <strong className="text-slate-900 dark:text-white">{pwStrength.label}</strong></span>
              <span className="text-slate-400 font-mono">{pwStrength.entropy} bits of entropy</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className={`h-full ${pwStrength.color} transition-all duration-300`} style={{ width: `${pwStrength.percent}%` }} />
            </div>
          </div>

          {/* Customization Sliders & Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Password Length:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">{pwLength} characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={pwLength}
                  onChange={(e) => setPwLength(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Batch Quantity to Generate:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">{batchCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={batchCount}
                  onChange={(e) => setBatchCount(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { id: 'upper', label: 'Uppercase (A-Z)', val: useUpper, set: setUseUpper },
                { id: 'lower', label: 'Lowercase (a-z)', val: useLower, set: setUseLower },
                { id: 'num', label: 'Numbers (0-9)', val: useNumbers, set: setUseNumbers },
                { id: 'sym', label: 'Symbols (!@#$%)', val: useSymbols, set: setUseSymbols },
                { id: 'ambig', label: 'Avoid Lookalikes (l, 1, O, 0)', val: avoidAmbiguous, set: setAvoidAmbiguous },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <input
                    type="checkbox"
                    checked={opt.val}
                    onChange={(e) => opt.set(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Batch list */}
          {passwords.length > 1 && (
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Generated Batch:</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {passwords.slice(1).map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 font-mono text-xs">
                    <span className="truncate pr-2">{p}</span>
                    <button
                      onClick={() => handleCopy(p, `batch-${idx}`)}
                      className="text-slate-500 hover:text-emerald-600 p-1 cursor-pointer shrink-0"
                    >
                      {copiedId === `batch-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QR CODE GENERATOR */}
      {activeTab === 'qrcode' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Input controls (2 cols) */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex gap-2">
                {[
                  { id: 'url', label: 'Website URL', icon: LinkIcon },
                  { id: 'text', label: 'Plain Text', icon: QrCode },
                  { id: 'wifi', label: 'WiFi Network', icon: Wifi },
                  { id: 'email', label: 'Email', icon: Mail },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setQrType(t.id as 'url' | 'text' | 'wifi' | 'email')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      qrType === t.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {qrType === 'wifi' ? (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Network Name (SSID):</label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="e.g. Home_5G_Network"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Password:</label>
                    <input
                      type="text"
                      value={wifiPass}
                      onChange={(e) => setWifiPass(e.target.value)}
                      placeholder="WiFi Password"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Encryption:</label>
                    <select
                      value={wifiAuth}
                      onChange={(e) => setWifiAuth(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {qrType === 'url' ? 'Destination Website URL:' : qrType === 'email' ? 'Recipient Email Address:' : 'Text Content:'}
                  </label>
                  <textarea
                    rows={4}
                    value={qrContent}
                    onChange={(e) => setQrContent(e.target.value)}
                    placeholder="Enter URL or text to encode into QR code..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-sans"
                  />
                </div>
              )}

              {/* Colors */}
              <div className="flex gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Foreground:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700"
                    />
                    <span className="font-mono text-xs">{qrFgColor}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Background:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700"
                    />
                    <span className="font-mono text-xs">{qrBgColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              {qrDataUrl && (
                <img 
                  src={qrDataUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 bg-white p-2" 
                />
              )}
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => downloadQrCode('png')}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PNG</span>
                </button>
                <button
                  onClick={() => downloadQrCode('svg')}
                  className="flex-1 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>SVG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: UUID & GUID */}
      {activeTab === 'uuid' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={uuidHyphens}
                  onChange={(e) => setUuidHyphens(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Include Hyphens</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={uuidUpper}
                  onChange={(e) => setUuidUpper(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Uppercase</span>
              </label>

              <div className="flex items-center gap-2">
                <span>Quantity:</span>
                <select
                  value={uuidCount}
                  onChange={(e) => setUuidCount(Number(e.target.value))}
                  className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value={1}>1</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateUuids}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate UUIDs</span>
            </button>
          </div>

          <div className="space-y-2">
            {uuidList.map((id, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 font-mono text-xs">
                <span className="truncate pr-3 select-all">{id}</span>
                <button
                  onClick={() => handleCopy(id, `uuid-${idx}`)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:text-emerald-600 text-[11px] font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedId === `uuid-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === `uuid-${idx}` ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RANDOM NUMBERS & PIN */}
      {activeTab === 'random' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Random Numbers in Range */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Random Number Generator</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block mb-1 font-semibold text-slate-500">Min:</label>
                  <input
                    type="number"
                    value={minNum}
                    onChange={(e) => setMinNum(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-slate-500">Max:</label>
                  <input
                    type="number"
                    value={maxNum}
                    onChange={(e) => setMaxNum(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-slate-500">Count:</label>
                  <input
                    type="number"
                    value={randomCount}
                    onChange={(e) => setRandomCount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uniqueRandom}
                    onChange={(e) => setUniqueRandom(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>No duplicates</span>
                </label>
                <button
                  onClick={generateRandomNumbers}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer hover:bg-emerald-700"
                >
                  Roll Numbers
                </button>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
                {randomNumbers.map((n, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-sm">
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Secure PIN & Coin/Dice */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Secure Security PIN</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-black text-slate-900 dark:text-white tracking-widest">
                    {generatedPin || '••••'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => generatePin(4)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold cursor-pointer"
                    >
                      4-Digit
                    </button>
                    <button
                      onClick={() => generatePin(6)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold cursor-pointer"
                    >
                      6-Digit
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-500">Coin Toss</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{coinResult || '-'}</p>
                  <button
                    onClick={flipCoin}
                    className="w-full py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Flip Coin
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-500">Dice Roll</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{diceResult ? `⚄ ${diceResult}` : '-'}</p>
                  <button
                    onClick={rollDice}
                    className="w-full py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Roll 1d6
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
