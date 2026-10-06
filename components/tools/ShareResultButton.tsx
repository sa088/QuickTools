import React, { useState, useEffect, useRef } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  X, 
  MessageCircle, 
  Send, 
  Globe, 
  Mail, 
  Smartphone, 
  Link as LinkIcon, 
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ShareResultButtonProps {
  title: string;
  outcomeText: string;
  toolName: string;
  url?: string;
  params?: Record<string, string | number | undefined | null>;
  buttonLabel?: string;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'default' | 'outline' | 'subtle';
}

export function ShareResultButton({
  title,
  outcomeText,
  toolName,
  url,
  params,
  buttonLabel = 'Share',
  className = '',
  size = 'sm',
  variant = 'default',
}: ShareResultButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCopiedText, setHasCopiedText] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = url || `${window.location.origin}${window.location.pathname}`;
      if (params) {
        const sp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            sp.set(k, String(v));
          }
        });
        const qs = sp.toString();
        setShareUrl(qs ? `${baseUrl}?${qs}` : baseUrl);
      } else {
        setShareUrl(baseUrl);
      }
      setSupportsNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
    }
  }, [url, params]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: outcomeText,
          url: shareUrl || window.location.href,
        });
        setIsOpen(false);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.warn('Native share was cancelled or failed:', err);
        }
      }
    }
  };

  const copyOutcomeAndLink = async () => {
    const fullShareContent = `${title}\n\n${outcomeText}\n\nCalculate yours here: ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(fullShareContent);
      setHasCopiedText(true);
      setTimeout(() => setHasCopiedText(false), 2200);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = fullShareContent;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setHasCopiedText(true);
      setTimeout(() => setHasCopiedText(false), 2200);
    }
  };

  const copyLinkOnly = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setHasCopiedLink(true);
      setTimeout(() => setHasCopiedLink(false), 2200);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setHasCopiedLink(true);
      setTimeout(() => setHasCopiedLink(false), 2200);
    }
  };

  const encodedText = encodeURIComponent(`${outcomeText}\n\nCheck it out on QuickTools:`);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = [
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n\n${outcomeText}\n\n${shareUrl}`)}`,
      icon: MessageCircle,
      bg: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/50',
      badge: 'Chat',
    },
    {
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      icon: Send,
      bg: 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
      badge: 'Post',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Globe,
      bg: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/50',
      badge: 'Feed',
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`${title}\n${outcomeText}`)}`,
      icon: Send,
      bg: 'bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-400 dark:hover:bg-sky-900/50',
      badge: 'Message',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Globe,
      bg: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/50',
      badge: 'Network',
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${title}\n\n${outcomeText}\n\nCalculated using QuickTools:\n${shareUrl}`)}`,
      icon: Mail,
      bg: 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50',
      badge: 'Direct',
    },
  ];

  const baseButtonClasses =
    size === 'sm'
      ? 'px-3.5 py-1.5 text-xs rounded-xl font-semibold gap-1.5'
      : 'px-4 py-2 text-sm rounded-xl font-bold gap-2';

  let variantClasses =
    'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs';

  if (variant === 'default') {
    variantClasses =
      'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 shadow-xs hover:shadow-sm';
  } else if (variant === 'subtle') {
    variantClasses =
      'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60';
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center justify-center transition-all cursor-pointer ${baseButtonClasses} ${variantClasses} ${className}`}
        title={`Share ${toolName} Outcome`}
        aria-label={`Share ${toolName} Outcome`}
      >
        <Share2 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span>{buttonLabel}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            />

            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
              role="dialog"
              aria-modal="true"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Share Calculation Result
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {toolName} • QuickTools
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-left">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Calculated Outcome
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Includes web link
                    </span>
                  </div>
                  <pre className="text-xs font-mono text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words leading-relaxed select-all">
                    {outcomeText}
                  </pre>
                </div>

                {supportsNativeShare && (
                  <div>
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Share via Device (WhatsApp, AirDrop, Apps...)</span>
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-1.5">
                      Uses native Web Share API to send to any installed application
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Share directly to social platforms
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {socialLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between p-3 rounded-2xl transition-all border border-slate-200/60 dark:border-slate-700/60 ${item.bg}`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="text-xs font-bold leading-none">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-[10px] opacity-75 font-medium">
                            {item.badge}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={copyOutcomeAndLink}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
                    >
                      {hasCopiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                          <span>Copied Result & Link!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Outcome & Link</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={copyLinkOnly}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
                    >
                      {hasCopiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy URL Only</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="w-full px-3.5 py-2 pr-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 select-all focus:outline-none"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
