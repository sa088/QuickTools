import React from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Info 
} from 'lucide-react';
import { TOOLS_LIST, ToolItem } from '@/data/toolsData';

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoStepItem {
  title: string;
  description: string;
}

export interface SeoExampleItem {
  title: string;
  scenario: string;
  inputs: { label: string; value: string }[];
  result: { label: string; value: string };
  explanation?: string;
}

export interface ToolSeoSectionProps {
  toolId: string;
  toolName: string;
  category: string;
  badge?: string;
  guideTitle: string;
  overviewText: string;
  formula?: {
    expression: string;
    description: string;
    variables: { symbol: string; label: string }[];
  };
  stepsTitle?: string;
  steps: SeoStepItem[];
  example?: SeoExampleItem;
  faqs: SeoFaqItem[];
  complianceNotes?: string[];
  relatedToolIds?: string[];
  onNavigate?: (href: string) => void;
}

export function ToolSeoSection({
  toolId,
  toolName,
  category,
  badge,
  guideTitle,
  overviewText,
  formula,
  stepsTitle = `How to Use the ${toolName}`,
  steps,
  example,
  faqs,
  complianceNotes,
  relatedToolIds = [],
  onNavigate,
}: ToolSeoSectionProps) {
  // Find related tools for internal linking
  const relatedTools: ToolItem[] = relatedToolIds
    .map((id) => TOOLS_LIST.find((t) => t.id === id))
    .filter(Boolean) as ToolItem[];

  // Fallback related tools from same category if none specified
  const displayRelated = relatedTools.length > 0 
    ? relatedTools 
    : TOOLS_LIST.filter((t) => t.id !== toolId && t.category === category).slice(0, 3);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <section className="mt-16 sm:mt-20 pt-12 border-t border-slate-200 dark:border-slate-800 space-y-12 text-slate-800 dark:text-slate-200 max-w-4xl mx-auto">
      
      {/* 1. Header & Educational Guide */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40 inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Complete Guide & Standards
          </span>
          {badge && (
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {badge}
            </span>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {guideTitle}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {overviewText}
        </p>
      </div>

      {/* 2. Mathematical Formula Box (if applicable) */}
      {formula && (
        <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" />
              Standard Calculation Formula
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Mathematical Model</span>
          </div>
          <div className="py-2.5 px-4 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-base sm:text-lg text-emerald-400 font-bold overflow-x-auto">
            {formula.expression}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {formula.description}
          </p>
          {formula.variables && formula.variables.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {formula.variables.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-300 w-12 shrink-0">{v.symbol}</span>
                  <span className="text-slate-400">=</span>
                  <span className="text-slate-300 truncate">{v.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Step-by-Step Instructions */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          {stepsTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5"
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/60 font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                  {idx + 1}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-8">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Concrete Worked Example */}
      {example && (
        <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {example.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {example.scenario}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100/80 dark:border-indigo-900/60 text-xs space-y-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] block">Inputs Entered</span>
              {example.inputs.map((inp, idx) => (
                <div key={idx} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span>{inp.label}:</span>
                  <span className="font-mono font-bold">{inp.value}</span>
                </div>
              ))}
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-600 text-white flex flex-col justify-center text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">
                {example.result.label}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono mt-0.5">
                {example.result.value}
              </span>
            </div>
          </div>
          {example.explanation && (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1">
              Note: {example.explanation}
            </p>
          )}
        </div>
      )}

      {/* 5. Authoritative FAQs (Crawled by Search Engines for Rich Snippets) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Frequently Asked Questions
          </h3>
          <span className="text-xs text-slate-400">Verified Answers</span>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs open:border-indigo-300 dark:open:border-indigo-800 transition-all cursor-pointer"
            >
              <summary className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-3 list-none">
                <span>{faq.question}</span>
                <span className="text-indigo-600 dark:text-indigo-400 transition-transform group-open:rotate-180 shrink-0">
                  ▾
                </span>
              </summary>
              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed cursor-auto">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* 6. Regulatory Standards & Authenticity Notes */}
      {complianceNotes && complianceNotes.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">
              Standards & Regulatory Authenticity
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
              {complianceNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 7. Internal Link Building: Related Tools Grid */}
      {displayRelated.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Related Calculators & Tools
            </h4>
            <a 
              href="/" 
              onClick={(e) => handleLinkClick(e, '/')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              All 10 Tools <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {displayRelated.map((tool) => (
              <a
                key={tool.id}
                href={tool.href}
                onClick={(e) => handleLinkClick(e, tool.href)}
                className="group p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {tool.category}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                      Free
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {tool.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
