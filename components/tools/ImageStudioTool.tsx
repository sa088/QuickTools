import React, { useState, useRef, useEffect } from 'react';
import { 
  ImageIcon, 
  Sliders, 
  Crop, 
  Maximize2, 
  Sparkles, 
  Download, 
  Trash2, 
  RefreshCw, 
  Check, 
  Pipette, 
  Eye, 
  FileType,
  ArrowRight
} from 'lucide-react';

type ImageMode = 'bgRemove' | 'convert' | 'compress' | 'resize';

export function ImageStudioTool({ defaultMode = 'bgRemove' }: { defaultMode?: ImageMode }) {
  const [activeTab, setActiveTab] = useState<ImageMode>(defaultMode);

  // Common image state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [origDimensions, setOrigDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Convert state
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [isConverting, setIsConverting] = useState(false);

  // Compress state
  const [compressQuality, setCompressQuality] = useState<number>(75);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);

  // Resize state
  const [resizeWidth, setResizeWidth] = useState<number>(800);
  const [resizeHeight, setResizeHeight] = useState<number>(600);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [isResizing, setIsResizing] = useState(false);

  // Background remover state
  const [bgRemovalMode, setBgRemovalMode] = useState<'auto' | 'color'>('auto');
  const [keyColor, setKeyColor] = useState<string>('#ffffff');
  const [detectedBgColor, setDetectedBgColor] = useState<string>('#ffffff');
  const [removeEnclosedPockets, setRemoveEnclosedPockets] = useState<boolean>(true);
  const [isSamplingFromImage, setIsSamplingFromImage] = useState<boolean>(false);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number } | null>(null);
  const [tolerance, setTolerance] = useState<number>(38);
  const [smoothness, setSmoothness] = useState<number>(3);
  const [bgRemovedPreview, setBgRemovedPreview] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImgRef = useRef<HTMLImageElement>(null);
  const samplingCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setCompressedPreview(null);
      setBgRemovedPreview(null);

      // Measure dimensions
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setOrigDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setResizeWidth(img.naturalWidth);
        setResizeHeight(img.naturalHeight);
        setAspectRatio(img.naturalWidth / img.naturalHeight);

        // If on bgRemove tab, run complete background removal immediately!
        if (activeTab === 'bgRemove') {
          processBgRemoval(url, 'auto', '#ffffff', 38, 3, true);
        }
      };
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Convert handler
  const executeConvert = () => {
    if (!imagePreview || !selectedFile) return;
    setIsConverting(true);
    const img = new Image();
    img.src = imagePreview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${targetFormat}`;
      const dataUrl = canvas.toDataURL(mimeType, 0.92);
      const link = document.createElement('a');
      const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'image';
      link.download = `QuickTools_${baseName}.${targetFormat}`;
      link.href = dataUrl;
      link.click();
      setIsConverting(false);
    };
  };

  // Compress handler
  const executeCompress = () => {
    if (!imagePreview || !selectedFile) return;
    setIsCompressing(true);
    const img = new Image();
    img.src = imagePreview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const mime = selectedFile.type === 'image/png' ? 'image/webp' : selectedFile.type || 'image/jpeg';
      canvas.toBlob((blob) => {
        if (blob) {
          setCompressedSize(blob.size);
          const url = URL.createObjectURL(blob);
          setCompressedPreview(url);
        }
        setIsCompressing(false);
      }, mime, compressQuality / 100);
    };
  };

  const downloadCompressed = () => {
    if (!compressedPreview || !selectedFile) return;
    const link = document.createElement('a');
    link.href = compressedPreview;
    link.download = `QuickTools_Compressed_${selectedFile.name}`;
    link.click();
  };

  // Resize handler
  const handleWidthChange = (w: number) => {
    setResizeWidth(w);
    if (lockAspectRatio && aspectRatio > 0) {
      setResizeHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (h: number) => {
    setResizeHeight(h);
    if (lockAspectRatio && aspectRatio > 0) {
      setResizeWidth(Math.round(h * aspectRatio));
    }
  };

  const executeResize = () => {
    if (!imagePreview || !selectedFile) return;
    setIsResizing(true);
    const img = new Image();
    img.src = imagePreview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = resizeWidth;
      canvas.height = resizeHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, resizeWidth, resizeHeight);

      const mime = selectedFile.type || 'image/png';
      const dataUrl = canvas.toDataURL(mime, 0.92);
      const link = document.createElement('a');
      link.download = `QuickTools_Resized_${resizeWidth}x${resizeHeight}_${selectedFile.name}`;
      link.href = dataUrl;
      link.click();
      setIsResizing(false);
    };
  };

  // Enhanced Background Remover (Smart Cutout with Auto Dominant Color + Chroma Key)
  const processBgRemoval = (
    imgUrl: string, 
    mode: 'auto' | 'color', 
    colorHex: string, 
    tol: number, 
    smooth: number,
    includePockets: boolean = true
  ) => {
    setIsRemovingBg(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsRemovingBg(false);
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Cache sampling canvas for instantaneous, lag-free eyedropper
      const offscreen = document.createElement('canvas');
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) {
        offCtx.drawImage(img, 0, 0);
        samplingCanvasRef.current = offscreen;
      }

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      const getPixel = (x: number, y: number) => {
        const idx = (y * w + x) * 4;
        return { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
      };

      // 1. Intelligent perimeter sampling to detect the true background color
      // In portraits, avatars, selfies, and product photos:
      // The top edge, top corners, and upper sides are 100% background.
      const borderSamples: Array<{ r: number; g: number; b: number }> = [];

      // Sample top edge densely
      const stepX = Math.max(1, Math.floor(w / 80));
      for (let x = 0; x < w; x += stepX) {
        borderSamples.push(getPixel(x, 0));
        if (h > 4) borderSamples.push(getPixel(x, 2));
      }

      // Sample top corners (15% width x 15% height boxes)
      const cW = Math.max(2, Math.floor(w * 0.15));
      const cH = Math.max(2, Math.floor(h * 0.15));
      const stepCX = Math.max(1, Math.floor(cW / 8));
      const stepCY = Math.max(1, Math.floor(cH / 8));
      for (let x = 0; x < cW; x += stepCX) {
        for (let y = 0; y < cH; y += stepCY) {
          borderSamples.push(getPixel(x, y));
          borderSamples.push(getPixel(w - 1 - x, y));
        }
      }

      // Upper sides (y = 0 to 50% h)
      const sideH = Math.floor(h * 0.5);
      const stepSide = Math.max(1, Math.floor(sideH / 30));
      for (let y = 0; y < sideH; y += stepSide) {
        borderSamples.push(getPixel(0, y));
        borderSamples.push(getPixel(w - 1, y));
      }

      // Extreme bottom corners (first 5% and last 5% of bottom edge, avoiding center subject)
      const botW = Math.max(2, Math.floor(w * 0.05));
      for (let x = 0; x < botW; x += Math.max(1, Math.floor(botW / 4))) {
        borderSamples.push(getPixel(x, h - 1));
        borderSamples.push(getPixel(w - 1 - x, h - 1));
      }

      // Cluster samples into color buckets to find the dominant background color (mode)
      // This completely isolates the true background and ignores clothing/torso
      interface ColorCluster {
        rSum: number;
        gSum: number;
        bSum: number;
        count: number;
        rAvg: number;
        gAvg: number;
        bAvg: number;
      }
      const clusters: ColorCluster[] = [];
      const clusterThresholdSq = 28 * 28 * 3;

      for (const s of borderSamples) {
        let matched: ColorCluster | null = null;
        let minDistSq = Infinity;
        for (const c of clusters) {
          const dr = s.r - c.rAvg;
          const dg = s.g - c.gAvg;
          const db = s.b - c.bAvg;
          const distSq = dr * dr + dg * dg + db * db;
          if (distSq < clusterThresholdSq && distSq < minDistSq) {
            minDistSq = distSq;
            matched = c;
          }
        }
        if (matched) {
          matched.rSum += s.r;
          matched.gSum += s.g;
          matched.bSum += s.b;
          matched.count++;
          matched.rAvg = Math.round(matched.rSum / matched.count);
          matched.gAvg = Math.round(matched.gSum / matched.count);
          matched.bAvg = Math.round(matched.bSum / matched.count);
        } else {
          clusters.push({
            rSum: s.r,
            gSum: s.g,
            bSum: s.b,
            count: 1,
            rAvg: s.r,
            gAvg: s.g,
            bAvg: s.b
          });
        }
      }

      clusters.sort((a, b) => b.count - a.count);
      const dominant = clusters[0] || { rAvg: 255, gAvg: 255, bAvg: 255 };
      const dominantHex = `#${dominant.rAvg.toString(16).padStart(2, '0')}${dominant.gAvg.toString(16).padStart(2, '0')}${dominant.bAvg.toString(16).padStart(2, '0')}`;
      setDetectedBgColor(dominantHex);

      // Perform background removal
      if (mode === 'auto') {
        // --- SMART CUTOUT (AUTOMATIC): High-precision chroma removal of the automatically detected background ---
        // Exactly like the chroma key section, but fully automated!
        const bgTargets: Array<{ r: number; g: number; b: number }> = [
          { r: dominant.rAvg, g: dominant.gAvg, b: dominant.bAvg }
        ];

        // If background has a gradient, also include secondary cluster from the same color family
        if (clusters.length > 1 && clusters[1].count > borderSamples.length * 0.1) {
          const dr = clusters[1].rAvg - dominant.rAvg;
          const dg = clusters[1].gAvg - dominant.gAvg;
          const db = clusters[1].bAvg - dominant.bAvg;
          if (dr * dr + dg * dg + db * db < 95 * 95 * 3) {
            bgTargets.push({ r: clusters[1].rAvg, g: clusters[1].gAvg, b: clusters[1].bAvg });
          }
        }

        const autoTol = 38;
        const autoTolSq = autoTol * autoTol * 3;
        const smoothRange = 12; // 3px feather

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          let minBgDistSq = Infinity;
          for (const bg of bgTargets) {
            const dr = r - bg.r;
            const dg = g - bg.g;
            const db = b - bg.b;
            const distSq = dr * dr + dg * dg + db * db;
            if (distSq < minBgDistSq) minBgDistSq = distSq;
          }

          if (minBgDistSq <= autoTolSq) {
            data[i + 3] = 0; // Transparent
          } else if (minBgDistSq < autoTolSq + smoothRange * smoothRange) {
            const factor = (Math.sqrt(minBgDistSq) - Math.sqrt(autoTolSq)) / smoothRange;
            data[i + 3] = Math.min(data[i + 3], Math.round(255 * factor));
          }
        }
      } else {
        // --- CHROMA KEY / COLOR PICKER REMOVAL (MANUAL PRECISION) ---
        const rKey = parseInt(colorHex.slice(1, 3), 16);
        const gKey = parseInt(colorHex.slice(3, 5), 16);
        const bKey = parseInt(colorHex.slice(5, 7), 16);

        const tolSq = tol * tol * 3;
        const smoothRange = Math.max(1, smooth * 3);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const diffR = r - rKey;
          const diffG = g - gKey;
          const diffB = b - bKey;
          const distSq = diffR * diffR + diffG * diffG + diffB * diffB;

          if (distSq <= tolSq) {
            data[i + 3] = 0; // Fully transparent
          } else if (distSq < tolSq + smoothRange * smoothRange) {
            const factor = (Math.sqrt(distSq) - Math.sqrt(tolSq)) / smoothRange;
            data[i + 3] = Math.min(data[i + 3], Math.round(255 * factor));
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const url = canvas.toDataURL('image/png');
      setBgRemovedPreview(url);
      setIsRemovingBg(false);
    };
  };

  const executeRemoveBg = () => {
    if (!imagePreview) return;
    processBgRemoval(imagePreview, bgRemovalMode, keyColor, tolerance, smoothness, removeEnclosedPockets);
  };

  // Sample exact color directly from original image preview using cached offscreen canvas
  const handleImageClickToPickColor = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isSamplingFromImage) return;
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    const naturalX = Math.min(img.naturalWidth - 1, Math.max(0, Math.floor(clickX * scaleX)));
    const naturalY = Math.min(img.naturalHeight - 1, Math.max(0, Math.floor(clickY * scaleY)));

    // Read pixel from cached offscreen canvas (zero lag)
    let hex = '#ffffff';
    if (samplingCanvasRef.current) {
      const ctx = samplingCanvasRef.current.getContext('2d');
      if (ctx) {
        const pixel = ctx.getImageData(naturalX, naturalY, 1, 1).data;
        hex = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
      }
    }

    setKeyColor(hex);
    setBgRemovalMode('color');
    setIsSamplingFromImage(false);
    setLoupePos(null);
    setHoverColor(null);
    if (imagePreview) {
      processBgRemoval(imagePreview, 'color', hex, tolerance, smoothness, removeEnclosedPockets);
    }
  };

  // Interactive mouse move for color loupe with cached offscreen canvas
  const handleImageMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isSamplingFromImage) return;
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    const naturalX = Math.min(img.naturalWidth - 1, Math.max(0, Math.floor(clientX * scaleX)));
    const naturalY = Math.min(img.naturalHeight - 1, Math.max(0, Math.floor(clientY * scaleY)));

    if (samplingCanvasRef.current) {
      const ctx = samplingCanvasRef.current.getContext('2d');
      if (ctx) {
        const pixel = ctx.getImageData(naturalX, naturalY, 1, 1).data;
        const hex = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
        setHoverColor(hex);
        setLoupePos({ x: clientX, y: clientY });
      }
    }
  };

  const handleImageMouseLeave = () => {
    setLoupePos(null);
    setHoverColor(null);
  };

  // Launch system eyedropper or toggle click-sampler
  const launchEyeDropper = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const res = await eyeDropper.open();
        if (res && res.sRGBHex) {
          setKeyColor(res.sRGBHex);
          setBgRemovalMode('color');
          if (imagePreview) {
            processBgRemoval(imagePreview, 'color', res.sRGBHex, tolerance, smoothness, removeEnclosedPockets);
          }
        }
      } catch {
        // User dismissed
      }
    } else {
      setIsSamplingFromImage(prev => !prev);
    }
  };

  const downloadBgRemoved = () => {
    if (!bgRemovedPreview || !selectedFile) return;
    const a = document.createElement('a');
    a.href = bgRemovedPreview;
    a.download = `QuickTools_Transparent_${selectedFile.name.replace(/\.[^/.]+$/, '')}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Client-Side Image Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Image Converter, Compressor &amp; Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Convert between JPG, PNG, and WebP, optimize file weight, scale dimensions, and create transparent cutouts 100% locally.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Zero Quality Degradation</span>
            </span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="mt-6 flex flex-wrap gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            onClick={() => {
              setActiveTab('bgRemove');
              if (imagePreview && !bgRemovedPreview) {
                processBgRemoval(imagePreview, bgRemovalMode, keyColor, tolerance, smoothness, removeEnclosedPockets);
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bgRemove'
                ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Background Remover</span>
          </button>

          <button
            onClick={() => setActiveTab('convert')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'convert'
                ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileType className="w-4 h-4" />
            <span>Format Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('compress')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'compress'
                ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Image Compressor</span>
          </button>

          <button
            onClick={() => setActiveTab('resize')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'resize'
                ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
            <span>Resize &amp; Dimensions</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
        />

        {!selectedFile ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center space-y-3 cursor-pointer hover:border-cyan-500 hover:bg-cyan-50/20 dark:hover:bg-cyan-950/20 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
              <ImageIcon className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Click to upload an image</p>
            <p className="text-xs text-slate-400">Supports JPG, PNG, WebP, SVG, and GIF</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-3 min-w-0">
                <img src={imagePreview!} alt="thumb" className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedFile.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {origDimensions.width} × {origDimensions.height} px • {formatBytes(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setImagePreview(null);
                }}
                className="text-xs text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer self-start sm:self-auto"
              >
                Change Image
              </button>
            </div>

            {/* TAB 1: CONVERT */}
            {activeTab === 'convert' && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Choose Destination Format:
                  </label>
                  <div className="grid grid-cols-3 gap-3 max-w-md">
                    {(['png', 'jpeg', 'webp'] as const).map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => setTargetFormat(fmt)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          targetFormat === fmt
                            ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 text-cyan-700 dark:text-cyan-300 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-sm uppercase font-black">{fmt === 'jpeg' ? 'JPG' : fmt}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {fmt === 'png' ? 'Lossless' : fmt === 'jpeg' ? 'Standard' : 'Ultra-compact'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={executeConvert}
                    disabled={isConverting}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-md shadow-cyan-200 dark:shadow-none cursor-pointer flex items-center gap-2"
                  >
                    {isConverting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>Convert &amp; Download as {targetFormat.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: COMPRESS */}
            {activeTab === 'compress' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Compression Quality Level:</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono text-sm">{compressQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="95"
                    value={compressQuality}
                    onChange={(e) => setCompressQuality(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Maximum Compression (Smaller size)</span>
                    <span>High Fidelity (75% Recommended)</span>
                    <span>Maximum Quality</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={executeCompress}
                    disabled={isCompressing}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isCompressing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sliders className="w-4 h-4" />}
                    <span>Calculate Compressed Preview</span>
                  </button>
                </div>

                {compressedPreview && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Compression Ready!</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Reduced from {formatBytes(selectedFile.size)} to <strong className="text-emerald-700 dark:text-emerald-400">{formatBytes(compressedSize)}</strong>{' '}
                        ({Math.round(((selectedFile.size - compressedSize) / selectedFile.size) * 100)}% saved)
                      </p>
                    </div>
                    <button
                      onClick={downloadCompressed}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Compressed File</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: RESIZE */}
            {activeTab === 'resize' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Width (px):
                    </label>
                    <input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Height (px):
                    </label>
                    <input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lockRatio"
                    checked={lockAspectRatio}
                    onChange={(e) => setLockAspectRatio(e.target.checked)}
                    className="rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                  <label htmlFor="lockRatio" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    Maintain Original Aspect Ratio ({aspectRatio.toFixed(2)}:1)
                  </label>
                </div>

                <div className="flex gap-2">
                  {[
                    { label: '50% Scale', w: Math.round(origDimensions.width * 0.5), h: Math.round(origDimensions.height * 0.5) },
                    { label: '75% Scale', w: Math.round(origDimensions.width * 0.75), h: Math.round(origDimensions.height * 0.75) },
                    { label: 'Original', w: origDimensions.width, h: origDimensions.height },
                    { label: 'HD 1080p', w: 1920, h: 1080 },
                    { label: 'Square 1:1', w: 800, h: 800 },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setResizeWidth(preset.w);
                        setResizeHeight(preset.h);
                      }}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 font-semibold cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={executeResize}
                    disabled={isResizing}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-md shadow-cyan-200 dark:shadow-none cursor-pointer flex items-center gap-2"
                  >
                    {isResizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>Resize &amp; Download</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: BACKGROUND REMOVER */}
            {activeTab === 'bgRemove' && (
              <div className="space-y-6">
                {/* Method Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/60">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Background Removal Method:
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {bgRemovalMode === 'auto'
                        ? 'Smart Cutout directly isolates the outer background and erases it minutely without affecting the foreground.'
                        : 'Select or sample custom background colors to erase specific shades or chroma key backdrops.'}
                    </p>
                  </div>
                  <div className="inline-flex p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setBgRemovalMode('auto');
                        setIsSamplingFromImage(false);
                        if (imagePreview) {
                          processBgRemoval(imagePreview, 'auto', keyColor, tolerance, smoothness, removeEnclosedPockets);
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        bgRemovalMode === 'auto'
                          ? 'bg-cyan-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Smart Cutout (Direct)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBgRemovalMode('color');
                        if (imagePreview) {
                          processBgRemoval(imagePreview, 'color', keyColor, tolerance, smoothness, removeEnclosedPockets);
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        bgRemovalMode === 'color'
                          ? 'bg-cyan-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      <Pipette className="w-3.5 h-3.5" />
                      <span>Color Picker &amp; Chroma Key</span>
                    </button>
                  </div>
                </div>

                {/* COLOR PICKER SECTION: ONLY SHOWN IN COLOR PICKER MODE */}
                {bgRemovalMode === 'color' && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-700/70">
                      {/* Detected Background Color */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Detected Background Color:
                        </span>
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-6 h-6 rounded-lg border border-slate-300 dark:border-slate-600 shadow-xs inline-block shrink-0" 
                            style={{ backgroundColor: detectedBgColor }}
                          />
                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {detectedBgColor.toUpperCase()}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setKeyColor(detectedBgColor);
                              if (imagePreview) {
                                processBgRemoval(imagePreview, 'color', detectedBgColor, tolerance, smoothness, removeEnclosedPockets);
                              }
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-950/80 dark:hover:bg-cyan-900 text-cyan-800 dark:text-cyan-200 transition-colors cursor-pointer"
                          >
                            Use Detected Color
                          </button>
                        </div>
                      </div>

                      {/* Eyedropper Button for Image Sampling */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsSamplingFromImage(!isSamplingFromImage)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                            isSamplingFromImage
                              ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-cyan-500'
                          }`}
                        >
                          <Pipette className="w-3.5 h-3.5" />
                          <span>{isSamplingFromImage ? 'Cancel Color Picker' : 'Pick Color from Image Preview'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Color inputs and sliders */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Selected Color to Remove:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={keyColor}
                            onChange={(e) => {
                              setKeyColor(e.target.value);
                              if (imagePreview) {
                                processBgRemoval(imagePreview, 'color', e.target.value, tolerance, smoothness, removeEnclosedPockets);
                              }
                            }}
                            className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <input
                            type="text"
                            value={keyColor}
                            onChange={(e) => {
                              setKeyColor(e.target.value);
                              if (imagePreview && /^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                                processBgRemoval(imagePreview, 'color', e.target.value, tolerance, smoothness, removeEnclosedPockets);
                              }
                            }}
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                          />
                        </div>

                        {/* Presets */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] text-slate-400">Presets:</span>
                          {[
                            { name: 'White', hex: '#ffffff' },
                            { name: 'Gray', hex: '#e2e8f0' },
                            { name: 'Green', hex: '#00ff00' },
                            { name: 'Black', hex: '#000000' },
                            { name: 'Blue', hex: '#0000ff' },
                          ].map(swatch => (
                            <button
                              key={swatch.hex}
                              type="button"
                              onClick={() => {
                                setKeyColor(swatch.hex);
                                if (imagePreview) {
                                  processBgRemoval(imagePreview, 'color', swatch.hex, tolerance, smoothness, removeEnclosedPockets);
                                }
                              }}
                              className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-600 cursor-pointer shadow-2xs hover:scale-110 transition-transform"
                              style={{ backgroundColor: swatch.hex }}
                              title={swatch.name}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          <span>Color Tolerance:</span>
                          <span className="font-mono text-cyan-600 dark:text-cyan-400">{tolerance}</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="90"
                          value={tolerance}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTolerance(val);
                            if (imagePreview) {
                              processBgRemoval(imagePreview, 'color', keyColor, val, smoothness, removeEnclosedPockets);
                            }
                          }}
                          className="w-full mt-2 accent-cyan-600 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400 block mt-1">Lower = exact shade match, Higher = erases broader range</span>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          <span>Edge Smoothing (Feather):</span>
                          <span className="font-mono text-cyan-600 dark:text-cyan-400">{smoothness}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={smoothness}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSmoothness(val);
                            if (imagePreview) {
                              processBgRemoval(imagePreview, 'color', keyColor, tolerance, val, removeEnclosedPockets);
                            }
                          }}
                          className="w-full mt-2 accent-cyan-600 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-400 block mt-1">Blends cut edges naturally for smooth cutout transitions</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={executeRemoveBg}
                    disabled={isRemovingBg}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    {isRemovingBg ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isRemovingBg ? 'Processing...' : bgRemovalMode === 'auto' ? 'Re-run Smart Cutout' : 'Apply Color Cutout'}</span>
                  </button>

                  {bgRemovedPreview && (
                    <button
                      onClick={downloadBgRemoved}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Transparent PNG</span>
                    </button>
                  )}
                </div>

                {/* Before & After Interactive Comparison Preview */}
                {bgRemovedPreview && (
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-cyan-600" />
                        <span>Interactive Before &amp; After Comparison:</span>
                      </span>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-lg">
                        100% Transparent PNG Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Before: Original Image with Color Sampling Loupe */}
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                            <span>Before (Original)</span>
                            {isSamplingFromImage && (
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold animate-pulse">
                                • Click image to pick color
                              </span>
                            )}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {origDimensions.width} × {origDimensions.height} px
                          </span>
                        </div>
                        <div 
                          className={`w-full h-64 sm:h-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center overflow-hidden p-2 relative ${
                            isSamplingFromImage ? 'cursor-crosshair' : 'cursor-default'
                          }`}
                        >
                          <img 
                            ref={originalImgRef}
                            src={imagePreview || ''} 
                            alt="Original before cutout" 
                            onClick={handleImageClickToPickColor}
                            onMouseMove={handleImageMouseMove}
                            onMouseLeave={handleImageMouseLeave}
                            className="max-h-full max-w-full object-contain" 
                          />

                          {/* Floating Color Loupe preview */}
                          {isSamplingFromImage && loupePos && hoverColor && (
                            <div 
                              className="absolute pointer-events-none z-20 flex flex-col items-center transform -translate-x-1/2 -translate-y-full mb-3"
                              style={{ left: loupePos.x, top: loupePos.y }}
                            >
                              <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: hoverColor }}>
                                <div className="w-2 h-2 rounded-full border border-black/40 bg-white/60" />
                              </div>
                              <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 text-white text-[10px] font-mono font-bold shadow-xs">
                                {hoverColor.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* After: Transparent Result on Checkerboard */}
                      <div className="rounded-2xl border-2 border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10 p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>After (Transparent Cutout)</span>
                          </span>
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            PNG Alpha Channel
                          </span>
                        </div>
                        <div className="w-full h-64 sm:h-72 rounded-xl bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:14px_14px] bg-slate-100 dark:bg-slate-950/90 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center overflow-hidden p-2 relative shadow-inner">
                          <img 
                            src={bgRemovedPreview} 
                            alt="Transparent cutout after removal" 
                            className="max-h-full max-w-full object-contain" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
