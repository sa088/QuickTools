import React, { useEffect } from 'react';
import { SEO_DATA_MAP, getToolSchema } from '@/data/seoData';
import { JsonLd } from '@/components/seo/JsonLd';
import { ToolSeoSection } from '@/components/seo/ToolSeoSection';

import { ZakatCalculatorTool } from '@/components/tools/ZakatCalculatorTool';
import { IncomeTaxCalculatorTool } from '@/components/tools/IncomeTaxCalculatorTool';
import { LoanEmiCalculatorTool } from '@/components/tools/LoanEmiCalculatorTool';
import { CurrencyConverterTool } from '@/components/tools/CurrencyConverterTool';
import { BmiCalculatorTool } from '@/components/tools/BmiCalculatorTool';
import { DiscountCalculatorTool } from '@/components/tools/DiscountCalculatorTool';
import { PercentageCalculatorTool } from '@/components/tools/PercentageCalculatorTool';
import { UnitConverterTool } from '@/components/tools/UnitConverterTool';
import { AgeCalculatorTool } from '@/components/tools/AgeCalculatorTool';
import { CompoundInterestTool } from '@/components/tools/CompoundInterestTool';

// New Tool Suites
import { PdfSuiteTool } from '@/components/tools/PdfSuiteTool';
import { ImageStudioTool } from '@/components/tools/ImageStudioTool';
import { TextToolsSuite } from '@/components/tools/TextToolsSuite';
import { GeneratorsSuiteTool } from '@/components/tools/GeneratorsSuiteTool';
import { DeveloperToolsSuite } from '@/components/tools/DeveloperToolsSuite';
import { DesignToolsSuite } from '@/components/tools/DesignToolsSuite';

interface ToolPageWrapperProps {
  toolId: string;
  onNavigate?: (href: string) => void;
}

export function ToolPageWrapper({ toolId, onNavigate }: ToolPageWrapperProps) {
  const seo = SEO_DATA_MAP[toolId];
  const schema = getToolSchema(toolId);

  // Dynamically update document title, meta tags, and structured data for SPA & Search Crawlers
  useEffect(() => {
    if (!seo) return;

    // 1. Title
    document.title = seo.title;

    // Helper to set or create meta tags
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Search Metadata
    setMetaTag('name', 'description', seo.description);
    if (seo.keywords && seo.keywords.length > 0) {
      setMetaTag('name', 'keywords', seo.keywords.join(', '));
    }

    // 3. OpenGraph Social Cards
    setMetaTag('property', 'og:title', seo.title);
    setMetaTag('property', 'og:description', seo.description);
    setMetaTag('property', 'og:url', seo.canonical || window.location.href);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'QuickTools');

    // 4. Twitter / X Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', seo.title);
    setMetaTag('name', 'twitter:description', seo.description);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seo.canonical || window.location.href);

    // 6. Inject Schema.org JSON-LD directly into <head> for search engines
    if (schema) {
      let script = document.getElementById('route-schema-jsonld') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'route-schema-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }

    // Scroll to top upon navigation to tool
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [seo, schema]);

  if (!seo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Tool Not Found</h2>
        <p className="text-slate-500 mt-2">The requested calculator could not be found.</p>
        <button
          onClick={() => onNavigate && onNavigate('/')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  const renderToolComponent = () => {
    switch (toolId) {
      // Financial
      case 'zakat-calculator':
        return <ZakatCalculatorTool />;
      case 'income-tax-calculator':
        return <IncomeTaxCalculatorTool />;
      case 'loan-emi-calculator':
        return <LoanEmiCalculatorTool />;
      case 'currency-converter':
        return <CurrencyConverterTool />;
      case 'compound-interest':
        return <CompoundInterestTool />;

      // Everyday & Math
      case 'percentage-calculator':
        return <PercentageCalculatorTool />;
      case 'discount-calculator':
        return <DiscountCalculatorTool />;

      // Health
      case 'bmi-calculator':
        return <BmiCalculatorTool />;
      case 'age-calculator':
        return <AgeCalculatorTool />;

      // Converters
      case 'unit-converter':
        return <UnitConverterTool />;

      // PDF Tools
      case 'word-to-pdf':
        return <PdfSuiteTool defaultMode="wordToPdf" />;
      case 'pdf-to-word':
        return <PdfSuiteTool defaultMode="pdfToWord" />;
      case 'excel-to-pdf':
        return <PdfSuiteTool defaultMode="excelToPdf" />;
      case 'pdf-to-excel':
        return <PdfSuiteTool defaultMode="pdfToExcel" />;
      case 'pdf-to-jpg':
        return <PdfSuiteTool defaultMode="pdfToJpg" />;
      case 'pdf-tools':
        return <PdfSuiteTool defaultMode="merge" />;
      case 'jpg-to-pdf':
        return <PdfSuiteTool defaultMode="imgToPdf" />;

      // Image Tools
      case 'image-converter':
        return <ImageStudioTool defaultMode="convert" />;
      case 'image-compressor':
        return <ImageStudioTool defaultMode="compress" />;
      case 'background-remover':
        return <ImageStudioTool defaultMode="bgRemove" />;

      // Text Tools
      case 'word-counter':
        return <TextToolsSuite defaultMode="counter" />;
      case 'case-converter':
        return <TextToolsSuite defaultMode="case" />;

      // Generators
      case 'password-generator':
        return <GeneratorsSuiteTool defaultMode="password" />;
      case 'qr-code-generator':
        return <GeneratorsSuiteTool defaultMode="qrcode" />;
      case 'uuid-generator':
        return <GeneratorsSuiteTool defaultMode="uuid" />;

      // Developer Tools
      case 'json-formatter':
        return <DeveloperToolsSuite defaultMode="json" />;
      case 'url-encoder':
        return <DeveloperToolsSuite defaultMode="url" />;
      case 'regex-tester':
        return <DeveloperToolsSuite defaultMode="regex" />;

      // Design Tools
      case 'color-picker':
        return <DesignToolsSuite defaultMode="picker" />;
      case 'gradient-generator':
        return <DesignToolsSuite defaultMode="gradient" />;

      default:
        return null;
    }
  };

  const getCategoryLabel = () => {
    if (seo.applicationCategory === 'FinanceApplication') return 'Financial';
    if (seo.applicationCategory === 'HealthApplication') return 'Health';
    if (seo.applicationCategory === 'SecurityApplication') return 'Generators';
    if (seo.applicationCategory === 'DeveloperApplication') return 'Developer';
    if (seo.applicationCategory === 'DesignApplication') return 'Design';
    return 'Utilities';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {schema && <JsonLd data={schema} />}
      
      {/* Tool Interactive Engine */}
      {renderToolComponent()}

      {/* Comprehensive SEO Content Section */}
      <ToolSeoSection
        toolId={toolId}
        toolName={seo.title.split(' - ')[0]}
        category={getCategoryLabel()}
        guideTitle={seo.guideTitle}
        overviewText={seo.overviewText}
        formula={seo.formula}
        steps={seo.steps}
        example={seo.example}
        faqs={seo.faqs}
        complianceNotes={seo.complianceNotes}
        relatedToolIds={seo.relatedToolIds}
        onNavigate={onNavigate}
      />
    </div>
  );
}
