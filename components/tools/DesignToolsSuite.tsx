import React, { useState, useMemo } from 'react';
import { 
  Palette, 
  Pipette, 
  Paintbrush, 
  Copy, 
  Check, 
  RefreshCw, 
  Contrast, 
  Plus, 
  Trash2,
  Lock,
  Unlock,
  Sliders,
  Sparkles
} from 'lucide-react';

type DesignMode = 'picker' | 'gradient' | 'palette';

export function DesignToolsSuite({ defaultMode = 'picker' }: { defaultMode?: DesignMode }) {
  const [activeTab, setActiveTab] = useState<DesignMode>(defaultMode);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- COLOR PICKER STATE ---
  const [hexColor, setHexColor] = useState<string>('#6366f1');

  // Convert HEX to RGB
  const rgbValues = useMemo(() => {
    let clean = hexColor.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
    const num = parseInt(clean, 16);
    if (isNaN(num)) return { r: 99, g: 102, b: 241 };
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }, [hexColor]);

  // Convert RGB to HSL
  const hslValues = useMemo(() => {
    const r = rgbValues.r / 255;
    const g = rgbValues.g / 255;
    const b = rgbValues.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }, [rgbValues]);

  // Contrast ratio
  const contrastRatio = useMemo(() => {
    // Relative luminance
    const sRGB = [rgbValues.r, rgbValues.g, rgbValues.b].map(v => {
      const val = v / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    const lum = 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];

    const contrastWhite = (1 + 0.05) / (lum + 0.05);
    const contrastBlack = (lum + 0.05) / (0 + 0.05);
    return {
      white: parseFloat(contrastWhite.toFixed(2)),
      black: parseFloat(contrastBlack.toFixed(2)),
      passesWhiteAA: contrastWhite >= 4.5,
      passesBlackAA: contrastBlack >= 4.5,
    };
  }, [rgbValues]);

  // Tints & Shades
  const tintsAndShades = useMemo(() => {
    const list: string[] = [];
    for (let factor = -0.6; factor <= 0.6; factor += 0.2) {
      let r = rgbValues.r;
      let g = rgbValues.g;
      let b = rgbValues.b;
      if (factor < 0) {
        // Shade (darken)
        r = Math.round(r * (1 + factor));
        g = Math.round(g * (1 + factor));
        b = Math.round(b * (1 + factor));
      } else {
        // Tint (lighten)
        r = Math.round(r + (255 - r) * factor);
        g = Math.round(g + (255 - g) * factor);
        b = Math.round(b + (255 - b) * factor);
      }
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      list.push(hex);
    }
    return list;
  }, [rgbValues]);

  // --- GRADIENT GENERATOR STATE ---
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientAngle, setGradientAngle] = useState<number>(135);
  const [colorStops, setColorStops] = useState<{ id: string; color: string; pos: number }[]>([
    { id: '1', color: '#4f46e5', pos: 0 },
    { id: '2', color: '#7c3aed', pos: 50 },
    { id: '3', color: '#ec4899', pos: 100 }
  ]);

  const cssGradientString = useMemo(() => {
    const sorted = [...colorStops].sort((a, b) => a.pos - b.pos);
    const stopsStr = sorted.map(s => `${s.color} ${s.pos}%`).join(', ');
    if (gradientType === 'linear') {
      return `linear-gradient(${gradientAngle}deg, ${stopsStr})`;
    }
    return `radial-gradient(circle, ${stopsStr})`;
  }, [gradientType, gradientAngle, colorStops]);

  const addColorStop = () => {
    if (colorStops.length >= 6) return;
    setColorStops(prev => [
      ...prev,
      { id: Date.now().toString(), color: '#06b6d4', pos: 75 }
    ]);
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length <= 2) return;
    setColorStops(prev => prev.filter(s => s.id !== id));
  };

  // --- COLOR PALETTE STATE ---
  const [paletteColors, setPaletteColors] = useState<{ hex: string; locked: boolean }[]>([
    { hex: '#4F46E5', locked: false },
    { hex: '#06B6D4', locked: false },
    { hex: '#10B981', locked: false },
    { hex: '#F59E0B', locked: false },
    { hex: '#EC4899', locked: false },
  ]);

  const generateNewPalette = () => {
    setPaletteColors(prev => prev.map(c => {
      if (c.locked) return c;
      const randomHex = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      return { ...c, hex: randomHex.toUpperCase() };
    }));
  };

  const toggleLock = (index: number) => {
    setPaletteColors(prev => prev.map((c, i) => i === index ? { ...c, locked: !c.locked } : c));
  };

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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/60 text-pink-700 dark:text-pink-300 text-xs font-bold">
              <Palette className="w-3.5 h-3.5" />
              <span>Creative Design &amp; CSS Tools</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Color Picker, CSS Gradients &amp; Palette Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Inspect HEX, RGB, and HSL formats, evaluate WCAG contrast compliance, generate CSS gradients, and compose harmonious palettes.
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="mt-6 flex flex-wrap gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab('picker')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'picker'
                ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Pipette className="w-4 h-4" />
            <span>Color Picker &amp; Formats</span>
          </button>

          <button
            onClick={() => setActiveTab('gradient')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'gradient'
                ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Paintbrush className="w-4 h-4" />
            <span>CSS Gradient Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('palette')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'palette'
                ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Palette Generator</span>
          </button>
        </div>
      </div>

      {/* TAB 1: COLOR PICKER */}
      {activeTab === 'picker' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Color preview & inputs */}
            <div className="space-y-4">
              <div 
                className="w-full h-44 rounded-3xl shadow-inner border border-slate-200 dark:border-slate-700 flex items-end p-4 transition-colors"
                style={{ backgroundColor: hexColor }}
              >
                <span className="font-mono text-xl font-black bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-xl shadow-xs text-slate-900 dark:text-white">
                  {hexColor.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={hexColor}
                  onChange={(e) => setHexColor(e.target.value)}
                  className="w-12 h-12 rounded-2xl cursor-pointer border border-slate-200 dark:border-slate-700"
                />
                <input
                  type="text"
                  value={hexColor}
                  onChange={(e) => setHexColor(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm font-bold uppercase"
                />
              </div>

              {/* Tints & Shades strip */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-slate-500">Tints &amp; Shades:</span>
                <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-9">
                  {tintsAndShades.map((hex, idx) => (
                    <div
                      key={idx}
                      onClick={() => setHexColor(hex)}
                      className="flex-1 cursor-pointer transition-transform hover:scale-105"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Color Conversion Codes & Accessibility */}
            <div className="space-y-4">
              <div className="space-y-2">
                {[
                  { label: 'HEX', val: hexColor.toUpperCase() },
                  { label: 'RGB', val: `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})` },
                  { label: 'HSL', val: `hsl(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%)` },
                ].map((fmt) => (
                  <div key={fmt.label} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">{fmt.label}</span>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{fmt.val}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(fmt.val, fmt.label)}
                      className="text-slate-500 hover:text-pink-600 p-1.5 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {copiedId === fmt.label ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>

              {/* WCAG Contrast check */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5" />
                  <span>WCAG Contrast Compliance:</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[11px]">On White (#FFF)</span>
                    <strong className="text-sm font-mono">{contrastRatio.white}:1</strong>
                    <span className={`block text-[10px] font-bold ${contrastRatio.passesWhiteAA ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {contrastRatio.passesWhiteAA ? '✓ Passes AA' : '✗ Fails AA'}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[11px]">On Black (#000)</span>
                    <strong className="text-sm font-mono">{contrastRatio.black}:1</strong>
                    <span className={`block text-[10px] font-bold ${contrastRatio.passesBlackAA ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {contrastRatio.passesBlackAA ? '✓ Passes AA' : '✗ Fails AA'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRADIENT GENERATOR */}
      {activeTab === 'gradient' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          {/* Gradient Canvas Preview */}
          <div 
            className="w-full h-48 rounded-3xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center p-4 transition-all"
            style={{ background: cssGradientString }}
          />

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setGradientType('linear')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    gradientType === 'linear'
                      ? 'bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  Linear Gradient
                </button>
                <button
                  onClick={() => setGradientType('radial')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    gradientType === 'radial'
                      ? 'bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  Radial Gradient
                </button>
              </div>

              {gradientType === 'linear' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Angle:</span>
                    <span className="font-mono text-pink-600">{gradientAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={gradientAngle}
                    onChange={(e) => setGradientAngle(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {/* Color stops list */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Color Stops ({colorStops.length}):</span>
                  {colorStops.length < 6 && (
                    <button
                      onClick={addColorStop}
                      className="text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Color</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {colorStops.map((stop) => (
                    <div key={stop.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => {
                          const val = e.target.value;
                          setColorStops(prev => prev.map(s => s.id === stop.id ? { ...s, color: val } : s));
                        }}
                        className="w-7 h-7 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.pos}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setColorStops(prev => prev.map(s => s.id === stop.id ? { ...s, pos: val } : s));
                        }}
                        className="flex-1"
                      />
                      <span className="font-mono text-xs w-9 text-right text-slate-500">{stop.pos}%</span>
                      {colorStops.length > 2 && (
                        <button
                          onClick={() => removeColorStop(stop.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated CSS Code Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Generated CSS Code:</label>
                <button
                  onClick={() => handleCopy(`background: ${cssGradientString};`, 'css-grad')}
                  className="px-3 py-1 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedId === 'css-grad' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'css-grad' ? 'Copied CSS' : 'Copy CSS'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={5}
                value={`background: ${cssGradientString};`}
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs select-all text-pink-700 dark:text-pink-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PALETTE GENERATOR */}
      {activeTab === 'palette' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Color Harmony Palette Generator</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Lock colors you love and generate complementary combinations with one click.</p>
            </div>
            <button
              onClick={generateNewPalette}
              className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Randomize Palette</span>
            </button>
          </div>

          {/* Palette display */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {paletteColors.map((col, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 flex flex-col"
              >
                <div 
                  className="h-32 w-full transition-colors cursor-pointer"
                  style={{ backgroundColor: col.hex }}
                  onClick={() => handleCopy(col.hex, `pal-${idx}`)}
                />
                <div className="p-3 flex items-center justify-between bg-white dark:bg-slate-900">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {col.hex}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleLock(idx)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                      title={col.locked ? 'Unlock Color' : 'Lock Color'}
                    >
                      {col.locked ? <Lock className="w-3.5 h-3.5 text-pink-600" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(col.hex, `pal-${idx}`)}
                      className="p-1 rounded-md text-slate-400 hover:text-pink-600 cursor-pointer"
                      title="Copy HEX"
                    >
                      {copiedId === `pal-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleCopy(paletteColors.map(c => c.hex).join(', '), 'all-pal')}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedId === 'all-pal' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy All Hex Codes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
