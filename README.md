# QuickTools — Fast Online Tools, Images and Document Studio & Daily Utilities

[![Live Website](https://img.shields.io/badge/Live_Website-quicktoolsonline.vercel.app-000000?logo=vercel&logoColor=white)](https://quicktoolsonline.vercel.app/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_In--Browser-brightgreen)](#-security--privacy-architecture)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel_Ready-black?logo=vercel)](https://vercel.com/)

> 🌐 **Live Website**: **[https://quicktoolsonline.vercel.app/](https://quicktoolsonline.vercel.app/)**

**QuickTools** is a high-performance, modern web application featuring an all-in-one suite of 30+ instant browser-based tools. From client-side PDF and Office conversions to AI-powered background removal, real-time Pakistan bullion market rates, FBR income tax calculations, and developer utilities—every single tool runs **100% client-side inside the user's browser sandbox** for zero latency, zero cloud upload costs, and complete privacy.

---

## 🚀 Key Features & Highlights

- **🔒 100% Private & In-Browser**: Files, documents, images, and financial details never leave your computer. Processing occurs entirely in local browser memory via Web Workers, HTML5 Canvas, and WebAssembly.
- **⚡ Blazing Fast**: Built on Vite 8 and React 19 for instant sub-second hot-reloads and rapid production builds.
- **📊 Real-Time Live Bullion & Forex Feeds**: Features live market integration for 24K and 22K Gold and Silver (Chandi) adhering to the **All Pakistan Sarafa Gems & Jewellers Association (APJA)** standards, alongside 150+ live global currency exchange rates.
- **📱 Responsive & Accessible**: Clean, modern interface designed with Tailwind CSS v4, supporting dynamic dark/light themes, keyboard navigation, and mobile-friendly touch gestures.
- **🔍 SEO & Google Ranking Ready**: Pre-configured with OpenGraph metadata, Twitter cards, Schema.org JSON-LD structured data, sitemap generation, and robots.txt.

---

## 🛠️ Complete Tool Catalog

### 1. Financial & Tax Calculators

Accurate financial planning calibrated to official standards and real-time feeds:

- **Authentic Islamic Zakat Calculator (`/zakat-calculator`)**:
  - Classical Fiqh compliant with 2.5% lunar wealth obligation.
  - Dual Nisab benchmarks: **Silver Standard (52.5 Tola / 612.36g)** and **Gold Standard (7.5 Tola / 87.48g)**.
  - **Live Bullion Market Integration**: Real-time Pakistan Sarafa Market rates for **24K Gold, 22K Gold, and 24K Silver (Chandi)** across Tola, 10 Grams, and 1 Gram.
  - One-click buttons to apply 24K bullion or 22K jewelry rates directly to your calculation.
  - Professional **PDF Statement Generation** (`jspdf`) with itemized asset/liability inventory and Quranic citations.
- **FBR Income Tax Calculator (`/income-tax-calculator`)**:
  - Official Pakistan Federal Board of Revenue progressive tax calculation for salaried individuals.
  - Supports current **FY 2025-26 & FY 2026-27** Finance Act slabs (0% up to Rs. 600,000, progressive brackets up to 35%).
  - Monthly vs. Annual tax breakdowns with take-home salary projections.
- **Live Currency Converter (`/currency-converter`)**: Real-time multi-currency exchange calculator supporting 150+ world currencies with bank fee estimation.
- **Loan & Mortgage EMI Calculator (`/loan-emi-calculator`)**: Compute monthly installments, total interest, and interactive amortization schedules.
- **Compound Interest Calculator (`/compound-interest`)**: Calculate compound growth across multiple compounding frequencies and contributions.
- **Inflation & Purchasing Power Calculator**: Visualize historic and future asset values based on inflation rates.

### 2. Image Studio & Visual Utilities

Professional client-side image editing powered by HTML5 Canvas and advanced color algorithms:

- **Smart Background Remover (`/background-remover`)**: Auto-detects background colors using dominant perimeter clustering and applies high-precision chroma cutout with adjustable tolerance and feathering.
- **Universal Image Converter (`/image-converter`)**: Convert between PNG, JPG, WebP, AVIF, SVG, BMP, and ICO formats instantly.
- **Image Compressor (`/image-compressor`)**: Fine-tune compression quality and target exact file size limits (KB/MB).
- **Image Resizer & Cropper (`/image-resizer`)**: Scale by dimensions, percentage, or aspect ratio presets with pixel-perfect output.
- **Filter Studio & Enhancer**: Adjust brightness, contrast, saturation, grayscale, and sharpness.
- **Base64 Image Tool**: Convert images to data URI Base64 strings for direct CSS/HTML embedding.

### 3. Document & PDF Studio

Execute client-side conversions and edits without file size limits or server upload queues:

- **Word to PDF (`/word-to-pdf`)**: Convert `.docx` documents into crisp, printable PDF files directly in your browser.
- **Excel to PDF (`/excel-to-pdf`)**: Transform `.xlsx` and `.xls` spreadsheets into clean paginated PDF tables.
- **JPG / PNG to PDF (`/jpg-to-pdf`)**: Combine multiple images into a multi-page, formatted PDF document with customizable margins and orientations.
- **PDF to Word (`/pdf-to-word`)**: Extract editable document text and formatting into a standard Word `.docx` file.
- **PDF to Excel (`/pdf-to-excel`)**: Parse structured tabular data from PDF files into an `.xlsx` workbook.
- **PDF to JPG (`/pdf-to-jpg`)**: High-resolution page-by-page rendering of PDF pages into JPEG or PNG image assets.
- **Merge PDF (`/merge-pdf`)**: Reorder and combine multiple PDF files into a single unified document.
- **Split PDF (`/split-pdf`)**: Extract specific page ranges or burst all pages into individual PDF files.
- **Compress PDF (`/compress-pdf`)**: Optimize and reduce document size without losing legibility.
- **Watermark & Protect**: Add custom watermarks or protect PDF documents with passwords.

### 4. Daily Math, Health & Everyday Tools

- **Percentage Calculator (`/percentage-calculator`)**: Fast percentage increases, decreases, differences, and fractional conversions.
- **Unit Converter (`/unit-converter`)**: Length, weight, area, volume, temperature, and digital storage converter.
- **Discount & Sale Calculator (`/discount-calculator`)**: Determine final sale prices, savings, and compound discounts.
- **BMI & Health Calculator (`/bmi-calculator`)**: Body Mass Index, ideal weight range, and calorie requirements according to WHO guidelines.
- **Age & Date Difference Calculator (`/age-calculator`)**: Precise age calculation in years, months, days, hours, and countdown to upcoming milestones.

### 5. Developer & Text Utilities

- **JSON Formatter & Validator (`/json-formatter`)**: Beautify, minify, inspect, and validate JSON data structures with syntax highlighting.
- **Base64 Encoder / Decoder (`/base64-converter`)**: Convert raw text, Unicode strings, and binary data to/from Base64.
- **Markdown Live Previewer (`/markdown-previewer`)**: Real-time Markdown editor with instant HTML rendering, table formatting, and code block styling.
- **Password Generator (`/password-generator`)**: Cryptographically secure password generator using `window.crypto.getRandomValues`.
- **QR Code Studio (`/qr-code-generator`)**: Generate downloadable high-resolution QR codes for URLs, WiFi credentials, vCards, and plain text.
- **Word & Character Counter (`/word-counter`)**: Real-time count of words, characters, sentences, reading time, and speaking time.
- **Case Converter (`/case-converter`)**: Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.
- **UUID & Hash Generator (`/uuid-generator`)**: Generate RFC-compliant UUID v4 keys and cryptographic SHA-256 hashes.

---

## 🏗️ Tech Stack & Architecture

| Layer                   | Technology                                  | Purpose                                                                 |
| :---------------------- | :------------------------------------------ | :---------------------------------------------------------------------- |
| **Framework**           | [React 19](https://react.dev/)              | Component architecture, hooks, and responsive state                     |
| **Build Tool**          | [Vite 8](https://vitejs.dev/)               | Lightning-fast HMR and optimized production bundling                    |
| **Styling**             | [Tailwind CSS v4](https://tailwindcss.com/) | Modern CSS engine with `@import "tailwindcss";`                         |
| **Icons**               | [Lucide React](https://lucide.dev/)         | Clean, accessible SVG iconography                                       |
| **PDF Processing**      | `pdfjs-dist`, `jspdf`, `pdf-lib`            | In-browser parsing, rendering, merging, and PDF generation              |
| **Document Processing** | `docx`, `xlsx`, `jszip`                     | In-browser Word and Excel parsing/export                                |
| **Real-time Rates**     | Stale-While-Revalidate Engine               | Multi-tier live feeds (`gold-api.com`, `open.er-api.com`, `/api/rates`) |
| **Hosting & Edge**      | [Vercel](https://vercel.com/)               | Global edge CDN, zero-config SPA routing via `vercel.json`              |

---

## 📈 Real-Time Live Bullion & Forex Architecture

To ensure live market rates never go stale:

1. **Stale-While-Revalidate on Mount**: Whenever a user visits or reloads any page, baseline rates render with 0ms latency, while an asynchronous fetch queries live APIs in the background.
2. **Auto-Refresh Every 60 Seconds**: If the tab is left open, background intervals pull fresh market quotes automatically.
3. **Tab Focus Revalidation**: Listens to browser `visibilitychange`—when a user tabs back into QuickTools, rates update immediately.
4. **Pakistan Sarafa Bullion Calibration**: Converts spot bullion ($/oz) to Pakistani Rupees using the official APJA duty and assay multiplier:
   $$\text{Gold 24K Tola} = \left(\frac{\text{Gold Spot USD}}{\text{28.3495 or 31.1035}}\right) \times \text{USD/PKR} \times 11.6638 \times 1.016345$$
   yielding exact local bullion rates for 24K & 22K Gold and Silver.

---

## 🛡️ Security & Privacy Architecture

- **Zero Data Collection**: QuickTools does not log, store, or transmit uploaded documents, images, or financial figures.
- **Client-Side Sandbox**: Calculations and file processing operate inside browser memory. Once a tab is closed, all allocated memory is automatically reclaimed by the browser.
- **No Third-Party Cookies or Trackers**: Pure performance with zero tracking scripts or telemetric bloat.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software for personal or commercial projects.
