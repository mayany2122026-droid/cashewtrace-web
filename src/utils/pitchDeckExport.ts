/**
 * Pitch Deck Export Helper
 * Generates standalone, print-ready, high-resolution HTML & PDF documents
 * that work in any browser without iframe blank-page issues.
 */

export interface PitchSlideData {
  id: number;
  title: string;
  subtitle: string;
  notes: string;
  htmlContent: string;
}

export function generatePitchDeckHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mayany Enterprise - AsiaBerlin Summit 2026 Pitch Deck</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Kantumruy+Pro:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: landscape;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background-color: #090d16;
      color: #ffffff;
      font-family: 'Plus Jakarta Sans', 'Kantumruy Pro', system-ui, sans-serif;
      line-height: 1.4;
      -webkit-font-smoothing: antialiased;
    }
    .screen-wrapper {
      padding-top: 56px;
    }
    .slide-page {
      width: 100vw;
      height: 100vh;
      max-height: 100vh;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 32px 40px;
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-after: always;
      break-after: page;
      background: radial-gradient(circle at top right, #064e3b 0%, #090d16 60%, #020617 100%);
      border-bottom: 2px solid #1e293b;
      position: relative;
      overflow: hidden;
    }
    .header-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 14px;
      border-radius: 9999px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fcd34d;
      font-size: 12px;
      font-weight: 700;
    }
    .badge-green {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #6ee7b7;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .slide-title {
      font-size: 30px;
      font-weight: 900;
      line-height: 1.15;
      color: #ffffff;
      margin-top: 8px;
      margin-bottom: 4px;
    }
    .slide-subtitle {
      font-size: 15px;
      color: #94a3b8;
      font-weight: 400;
      margin-bottom: 16px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: auto 0;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
      margin: auto 0;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin: auto 0;
    }
    .card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-highlight {
      border-color: rgba(16, 185, 129, 0.5);
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 78, 59, 0.2) 100%);
    }
    .stat-number {
      font-size: 36px;
      font-weight: 900;
      line-height: 1;
      margin-bottom: 6px;
    }
    .text-emerald { color: #34d399; }
    .text-amber { color: #fbbf24; }
    .text-red { color: #f87171; }
    .text-blue { color: #60a5fa; }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .card-desc {
      font-size: 13px;
      color: #cbd5e1;
      line-height: 1.45;
    }
    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      font-size: 12px;
      color: #94a3b8;
    }
    .no-print-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #0f172a;
      border-bottom: 2px solid #10b981;
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 9999;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
    }
    .btn {
      background: #10b981;
      color: #022c22;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn:hover {
      background: #34d399;
    }
    @media print {
      .no-print-bar { display: none !important; }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background-color: #090d16 !important;
        width: 100% !important;
        height: auto !important;
        min-height: 100% !important;
        overflow: visible !important;
      }
      .screen-wrapper {
        padding-top: 0 !important;
        margin: 0 !important;
        height: auto !important;
        overflow: visible !important;
      }
      .slide-page {
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100vh !important;
        min-height: 100vh !important;
        padding: 24px 32px !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-after: always !important;
        break-after: page !important;
        overflow: hidden !important;
        border-bottom: none !important;
      }
      .slide-page:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }
  </style>
</head>
<body>

  <!-- Sticky Print Bar for User Convenience -->
  <div class="no-print-bar">
    <div style="display: flex; align-items: center; gap: 12px;">
      <svg viewBox="0 0 100 100" style="width: 24px; height: 24px;" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="navCashewNutGrad" x1="15" y1="20" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#f59e0b" />
            <stop offset="40%" stop-color="#ea580c" />
            <stop offset="85%" stop-color="#c2410c" />
            <stop offset="100%" stop-color="#9a3412" />
          </linearGradient>
        </defs>
        <path d="M 20 54 C 15 32, 34 14, 58 14 C 82 14, 94 32, 90 58 C 86 78, 66 88, 44 86 C 24 84, 23 70, 20 54 Z" fill="url(#navCashewNutGrad)" stroke="#ffffff" stroke-width="2.5" />
        <ellipse cx="68" cy="36" rx="8" ry="14" transform="rotate(32 68 36)" fill="#ffffff" opacity="0.85" />
        <path d="M 27 46 C 25 38, 33 27, 46 22" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.9" />
      </svg>
      <span style="font-weight: 800; font-size: 15px; color: #fff;">Mayany Enterprise <span style="color: #34d399; font-weight: 500;">powered by CashewTrace</span> — AsiaBerlin 2026</span>
      <span style="background: rgba(16,185,129,0.2); color: #34d399; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">9 Slides Full Color</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <button class="btn" onclick="window.print()">🖨️ Click to Save as PDF (Print Dialog)</button>
    </div>
  </div>

  <div class="screen-wrapper">

  <!-- SLIDE 1: COVER -->
  <div class="slide-page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="background: #ffffff; padding: 6px 16px; border-radius: 10px; font-weight: 900; color: #064e3b; font-size: 16px; display: flex; align-items: center; gap: 8px;">
        <svg viewBox="0 0 100 100" style="width: 20px; height: 20px;" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="coverCashewNutGrad" x1="15" y1="20" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#f59e0b" />
              <stop offset="40%" stop-color="#ea580c" />
              <stop offset="85%" stop-color="#c2410c" />
              <stop offset="100%" stop-color="#9a3412" />
            </linearGradient>
          </defs>
          <path d="M 20 54 C 15 32, 34 14, 58 14 C 82 14, 94 32, 90 58 C 86 78, 66 88, 44 86 C 24 84, 23 70, 20 54 Z" fill="url(#coverCashewNutGrad)" stroke="#ffffff" stroke-width="2.5" />
          <ellipse cx="68" cy="36" rx="8" ry="14" transform="rotate(32 68 36)" fill="#ffffff" opacity="0.85" />
          <path d="M 27 46 C 25 38, 33 27, 46 22" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.9" />
        </svg>
        CashewTrace &bull; Mayany Enterprise
      </div>
      <div class="header-tag">🇰🇭🇩🇪 AsiaBerlin Summit 2026 Delegation Candidate</div>
    </div>
    <div style="margin: auto 0; max-width: 900px;">
      <div class="badge-green">HACCP Agro-Processing &bull; Smart QR Packaging &bull; EUDR Compliance</div>
      <h1 class="slide-title" style="font-size: 40px; line-height: 1.15; margin-top: 10px; margin-bottom: 8px;">
        Mayany Enterprise<br>
        <span style="color: #34d399;">Traceable Value-Added Cashew Innovation</span>
      </h1>
      <p style="font-size: 17px; color: #cbd5e1; font-weight: 300; margin-top: 12px; line-height: 1.45;">
        Transforming Cambodian cashews into premium export-ready products—from signature <strong>GI Organic Kampot Pepper Coated Cashews</strong>, <strong>Cashew Nibs</strong>, and <strong>Cashew Biscuits</strong> to verifiable farm-to-shelf digital QR passports.
      </p>
    </div>
    <div class="footer-bar">
      <div>
        <strong style="color: #fff; font-size: 14px;">Mayany Enterprise <span style="color: #34d399; font-weight: 400;">powered by CashewTrace</span></strong><br>
        <span style="color: #cbd5e1; font-size: 11px;">Founder & CEO: Mayany SAM • Supported by FTC / MISTI & Khmer Enterprise</span>
      </div>
      <div style="text-align: right;">
        <strong style="color: #fcd34d;">mayanyenterprise.com &bull; cashewtrace.com</strong><br>
        <span style="font-size: 11px; color: #cbd5e1;">Production Facility in Phnom Penh & Suppliers from Kampong Thom province</span>
      </div>
    </div>
  </div>

  <!-- SLIDE 2: THE PROBLEM -->
  <div class="slide-page">
    <div>
      <div class="badge-green" style="color: #fbbf24; border-color: rgba(251,191,36,0.4); background: rgba(251,191,36,0.15);">The Market Challenge</div>
      <h2 class="slide-title">Why Cambodian Cashew Farmers & MSMEs Miss $1B+ in Value</h2>
      <p class="slide-subtitle">Addressing systemic export bottlenecks, packaging non-compliance, and deforestation regulations.</p>
    </div>
    <div class="grid-3">
      <div class="card">
        <div>
          <div class="stat-number text-red">85%+</div>
          <div class="card-title">Exported Raw Unprocessed</div>
          <div class="card-desc">Cambodia harvests 1,100,000 MT of raw cashews, but lack of domestic value addition forces farmers to sell raw crop at low commodity prices.</div>
        </div>
        <div style="color: #f87171; font-size: 12px; font-weight: 700; margin-top: 12px;">✗ Lost Domestic Margin</div>
      </div>
      <div class="card">
        <div>
          <div class="stat-number text-amber">80%</div>
          <div class="card-title">Retail Packaging Rejection</div>
          <div class="card-desc">Local food producers struggle with complex National Standard CS 001 packaging, barcode costs, and bilingual nutrition labels.</div>
        </div>
        <div style="color: #fbbf24; font-size: 12px; font-weight: 700; margin-top: 12px;">✗ Blocked from Supermarket Shelves</div>
      </div>
      <div class="card">
        <div>
          <div class="stat-number text-emerald">EUDR</div>
          <div class="card-title">Strict EU Traceability</div>
          <div class="card-desc">EU Deforestation Regulations require verifiable GPS polygon farm plots and digital batch tracking that manual paper notebooks cannot meet.</div>
        </div>
        <div style="color: #34d399; font-size: 12px; font-weight: 700; margin-top: 12px;">✗ European Import Threat</div>
      </div>
    </div>
    <div class="footer-bar">
      <span><strong style="color: #fbbf24;">Opportunity:</strong> HACCP Facility + Light AI Traceability</span>
      <span style="color: #cbd5e1;">Mayany Enterprise <strong style="color: #34d399;">powered by CashewTrace</strong></span>
    </div>
  </div>

  <!-- SLIDE 3: THE SOLUTION -->
  <div class="slide-page">
    <div>
      <div class="badge-green">Integrated Solution</div>
      <h2 class="slide-title">HACCP Food Processing + Smart Digital Packaging</h2>
      <p class="slide-subtitle">Combining physical agro-processing excellence with transparent digital verification.</p>
    </div>
    <div class="grid-3">
      <div class="card card-highlight">
        <div>
          <div style="margin-bottom: 8px;">
            <svg viewBox="0 0 100 100" style="width: 32px; height: 32px;" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="s3CashewNutGrad" x1="15" y1="20" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#f59e0b" />
                  <stop offset="40%" stop-color="#ea580c" />
                  <stop offset="85%" stop-color="#c2410c" />
                  <stop offset="100%" stop-color="#9a3412" />
                </linearGradient>
              </defs>
              <path d="M 20 54 C 15 32, 34 14, 58 14 C 82 14, 94 32, 90 58 C 86 78, 66 88, 44 86 C 24 84, 23 70, 20 54 Z" fill="url(#s3CashewNutGrad)" stroke="#ffffff" stroke-width="2.5" />
              <ellipse cx="68" cy="36" rx="8" ry="14" transform="rotate(32 68 36)" fill="#ffffff" opacity="0.85" />
              <path d="M 27 46 C 25 38, 33 27, 46 22" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.9" />
            </svg>
          </div>
          <div class="card-title">1. Value-Added Products</div>
          <div class="card-desc">Signature <strong>GI Organic Kampot Pepper Coated Cashews</strong>, <strong>Cashew Nibs</strong>, and <strong>Cashew Biscuits</strong> for zero-waste circular food production.</div>
        </div>
        <div style="color: #fbbf24; font-size: 12px; font-weight: 700; margin-top: 12px;">✓ Premium Taste & Zero Waste</div>
      </div>
      <div class="card card-highlight">
        <div>
          <div style="font-size: 30px; margin-bottom: 8px;">🛡️</div>
          <div class="card-title">2. HACCP Standard Facility</div>
          <div class="card-desc">Modern agro-processing plant upgraded with direct technical consultation from <strong>FTC / MISTI</strong> and <strong>Khmer Enterprise (KE)</strong>.</div>
        </div>
        <div style="color: #34d399; font-size: 12px; font-weight: 700; margin-top: 12px;">✓ International Food Safety</div>
      </div>
      <div class="card card-highlight">
        <div>
          <div style="font-size: 30px; margin-bottom: 8px;">📱</div>
          <div class="card-title">3. Digital QR Passport</div>
          <div class="card-desc">Interactive on-pack QR code linking European buyers and consumers directly to verified GPS farm origins, harvest dates, and food safety lab tests.</div>
        </div>
        <div style="color: #60a5fa; font-size: 12px; font-weight: 700; margin-top: 12px;">✓ EUDR Deforestation-Free Proof</div>
      </div>
    </div>
    <div class="footer-bar">
      <span><strong style="color: #34d399;">Operational Base:</strong> Production Facility in Phnom Penh & Suppliers from Kampong Thom province</span>
      <span style="color: #cbd5e1;">Mayany Enterprise <strong style="color: #34d399;">powered by CashewTrace</strong></span>
    </div>
  </div>

  <!-- SLIDE 4: TECHNOLOGY -->
  <div class="slide-page">
    <div>
      <div class="badge-green" style="color: #60a5fa; border-color: rgba(96,165,250,0.4); background: rgba(96,165,250,0.15);">Technology Architecture</div>
      <h2 class="slide-title">AI Built Specifically for Cambodian Agricultural Realities</h2>
      <p class="slide-subtitle">Generative AI + Computer Vision Quality Assessment.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="background: rgba(16,185,129,0.2); color: #34d399; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 6px;">Phase 1 (Live Now)</span>
          <span style="color: #94a3b8; font-size: 11px; font-family: monospace;">Gemini AI / LLM Engine</span>
        </div>
        <div class="card-title" style="font-size: 17px;">Local and multilingual Packaging & Standard Assistant</div>
        <ul style="list-style: none; color: #cbd5e1; font-size: 13px; margin-top: 8px; line-height: 1.6;">
          <li>✓ Translates technical ingredients into certified Khmer/English food terminology.</li>
          <li>✓ Calculates nutritional values and formats CS 001 / FDA compliant nutrition tables.</li>
          <li>✓ Generates compelling single-origin farmer stories for European conscious consumers.</li>
        </ul>
      </div>
      <div class="card">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="background: rgba(96,165,250,0.2); color: #60a5fa; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 6px;">Phase 2 (Roadmap)</span>
          <span style="color: #94a3b8; font-size: 11px; font-family: monospace;">Computer Vision / Edge AI</span>
        </div>
        <div class="card-title" style="font-size: 17px;">Automated Defect & Quality Grading</div>
        <ul style="list-style: none; color: #cbd5e1; font-size: 13px; margin-top: 8px; line-height: 1.6;">
          <li>✓ Analyzes smartphone photos of raw cashews to detect spotted kernels, mold, and insect defects.</li>
          <li>✓ Predicts Kernel Outturn Ratio (KOR) automatically to ensure fair farm-gate pricing.</li>
          <li>✓ Opportunity to collaborate with German/European AI and agri-sensor innovators.</li>
        </ul>
      </div>
    </div>
    <div class="footer-bar">
      <span><strong>Inclusive Design:</strong> Audio-supported, mobile-first interface empowering rural workers.</span>
      <span style="color: #cbd5e1;">Mayany Enterprise <strong style="color: #34d399;">powered by CashewTrace</strong></span>
    </div>
  </div>

  <!-- SLIDE 5: SIGNATURE PRODUCTS -->
  <div class="slide-page">
    <div>
      <div class="badge-green">Product Portfolio & Traction</div>
      <h2 class="slide-title">Premium Value-Added Cambodian Cashew Products</h2>
      <p class="slide-subtitle">Supported by FTC / MISTI & Khmer Enterprise (KE).</p>
    </div>
    <div class="grid-4">
      <div class="card" style="text-align: center; border-color: rgba(245,158,11,0.4);">
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 4px;">
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 5 C24 11, 22 16, 21 22 C20 28, 23 34, 25 41" stroke="#78350f" stroke-width="2.5" stroke-linecap="round" />
            <path d="M23 14 C26 13, 30 12, 33 10" stroke="#78350f" stroke-width="2" stroke-linecap="round" />
            <path d="M21 25 C17 24, 13 24, 11 22" stroke="#78350f" stroke-width="2" stroke-linecap="round" />
            <circle cx="34" cy="11" r="7" fill="#451a03" stroke="#f59e0b" stroke-width="1.8" />
            <circle cx="32" cy="9" r="1.5" fill="#fef3c7" opacity="0.8" />
            <circle cx="36" cy="12" r="1" fill="#d97706" />
            <circle cx="14" cy="18" r="7.5" fill="#292524" stroke="#fbbf24" stroke-width="1.8" />
            <circle cx="12" cy="16" r="1.6" fill="#fef3c7" opacity="0.8" />
            <circle cx="16" cy="19" r="1.1" fill="#d97706" />
            <circle cx="25" cy="24" r="8.5" fill="#1c1917" stroke="#f59e0b" stroke-width="2" />
            <circle cx="22.5" cy="21.5" r="1.8" fill="#ffffff" opacity="0.85" />
            <circle cx="27" cy="26" r="1.2" fill="#f59e0b" />
            <circle cx="34" cy="32" r="7" fill="#451a03" stroke="#fbbf24" stroke-width="1.8" />
            <circle cx="32.5" cy="30" r="1.4" fill="#fef3c7" opacity="0.75" />
            <circle cx="19" cy="35" r="7" fill="#292524" stroke="#f59e0b" stroke-width="1.8" />
            <circle cx="17.5" cy="33" r="1.4" fill="#ffffff" opacity="0.8" />
          </svg>
        </div>
        <div class="card-title" style="margin-top: 6px; font-size: 15px;">GI Organic Kampot Pepper</div>
        <div style="color: #fbbf24; font-weight: 700; font-size: 12px; margin-bottom: 6px;">Coated Roasted Cashews</div>
        <div class="card-desc">Combining Cambodia's world-famous GI Kampot pepper with premium roasted cashews.</div>
      </div>
      <div class="card" style="text-align: center; border-color: rgba(16,185,129,0.4);">
        <div style="font-size: 30px;">🌾</div>
        <div class="card-title" style="margin-top: 6px; font-size: 15px;">Cashew Nibs & Biscuits</div>
        <div style="color: #34d399; font-weight: 700; font-size: 12px; margin-bottom: 6px;">Zero-Waste Ingredients</div>
        <div class="card-desc">Upcycling kernels into baking nibs and artisanal cashew biscuits for European markets.</div>
      </div>
      <div class="card" style="text-align: center; border-color: rgba(96,165,250,0.4);">
        <div style="font-size: 30px;">🏛️</div>
        <div class="card-title" style="margin-top: 6px; font-size: 15px;">FTC / MISTI & Khmer Enterprise</div>
        <div style="color: #60a5fa; font-weight: 700; font-size: 12px; margin-bottom: 6px;">Technical Upgrading</div>
        <div class="card-desc">Active partnership with FTC / MISTI and Khmer Enterprise for HACCP food safety standards.</div>
      </div>
      <div class="card" style="text-align: center; border-color: rgba(168,85,247,0.4);">
        <div style="font-size: 30px;">📜</div>
        <div class="card-title" style="margin-top: 6px; font-size: 15px;">CAC & CS 001 Certified</div>
        <div style="color: #c084fc; font-weight: 700; font-size: 12px; margin-bottom: 6px;">National Quality Standards</div>
        <div class="card-desc">Strict grading compliance with Cashew Nut Association of Cambodia & Ministry standards.</div>
      </div>
    </div>
    <div class="footer-bar">
      <span><strong>Live Commercial Demo:</strong> Smart QR digital packaging labels active & verifiable.</span>
      <span style="color: #cbd5e1;">Mayany Enterprise <strong style="color: #34d399;">powered by CashewTrace</strong></span>
    </div>
  </div>

  <!-- SLIDE 6: BUSINESS MODEL -->
  <div class="slide-page">
    <div>
      <div class="badge-green" style="color: #fbbf24; border-color: rgba(251,191,36,0.4); background: rgba(251,191,36,0.15);">Business Model & Revenue</div>
      <h2 class="slide-title">Multi-Stream Value Capture Across the Supply Chain</h2>
      <p class="slide-subtitle">High-Margin Retail Snacks + B2B Ingredients + Traceability Licensing.</p>
    </div>
    <div class="grid-3">
      <div class="card">
        <div>
          <span style="color: #34d399; font-size: 11px; font-weight: 800; font-family: monospace;">STREAM 1</span>
          <div class="card-title" style="margin-top: 4px;">Premium Retail Snacks</div>
          <div class="card-desc">Direct sale of branded GI Kampot pepper coated cashews, roasted kernels, and cashew nut butter to supermarkets and duty-free retail.</div>
        </div>
        <div style="color: #34d399; font-size: 11px; font-weight: 700; margin-top: 12px;">High Margin B2C / Retail</div>
      </div>
      <div class="card" style="border-color: rgba(251,191,36,0.4);">
        <div>
          <span style="color: #fbbf24; font-size: 11px; font-weight: 800; font-family: monospace;">STREAM 2</span>
          <div class="card-title" style="margin-top: 4px;">B2B Circular Ingredients</div>
          <div class="card-desc">Bulk supply of cashew nibs and protein powder to European bakeries, confectionery makers, and plant-based dairy manufacturers.</div>
        </div>
        <div style="color: #fbbf24; font-size: 11px; font-weight: 700; margin-top: 12px;">Recurring B2B Export Contracts</div>
      </div>
      <div class="card" style="border-color: rgba(96,165,250,0.4);">
        <div>
          <span style="color: #60a5fa; font-size: 11px; font-weight: 800; font-family: monospace;">STREAM 3</span>
          <div class="card-title" style="margin-top: 4px;">Traceability Licensing</div>
          <div class="card-desc">Volume-based QR passport issuance and print partner referral fees for partner farmer co-ops and export aggregators.</div>
        </div>
        <div style="color: #60a5fa; font-size: 11px; font-weight: 700; margin-top: 12px;">Scalable Software Revenue</div>
      </div>
    </div>
    <div class="footer-bar">
      <span><strong>Harvest Base:</strong> 1.1M MT Cambodian Crop • <strong>Target:</strong> 4,500+ Producers</span>
      <span style="color: #cbd5e1;">Mayany Enterprise <strong style="color: #34d399;">powered by CashewTrace</strong></span>
    </div>
  </div>

  <!-- SLIDE 7: ASIA-BERLIN SYNERGY -->
  <div class="slide-page">
    <div>
      <div class="badge-green" style="color: #60a5fa; border-color: rgba(96,165,250,0.4); background: rgba(96,165,250,0.15);">International Collaboration</div>
      <h2 class="slide-title">Why AsiaBerlin Summit 2026 is Our Strategic Destination</h2>
      <p class="slide-subtitle">Connecting Cambodian Sustainable Agriculture with Berlin & European Ecosystems.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <div style="color: #34d399; font-weight: 800; font-size: 16px; margin-bottom: 8px;">🌐 Germany & EU: Leading Ethical Food Markets</div>
        <p class="card-desc">Germany is Europe's largest importer of tree nuts and a global pioneer in organic, Fairtrade, and deforestation-free standards. With national food standards and export readiness in place, Mayany Enterprise is primed for German and EU market integration.</p>
        <ul style="color: #94a3b8; font-size: 13px; margin-top: 8px; line-height: 1.6; list-style: none;">
          <li>• Direct distributor connections for GI Kampot pepper coated cashews.</li>
          <li>• B2B supply agreements for organic cashew nibs & powder with European bakeries.</li>
        </ul>
      </div>
      <div class="card">
        <div style="color: #fbbf24; font-weight: 800; font-size: 16px; margin-bottom: 8px;">🎯 Objectives for AsiaBerlin Summit 2026</div>
        <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.6; list-style: none;">
          <li>✓ <strong>Import & Distribution Partners:</strong> Meet specialty nut importers, organic retailers, and food brokers across Germany and the EU.</li>
          <li>✓ <strong>Sustainable Packaging Innovation:</strong> Connect with Berlin eco-packaging startups to explore biodegradable packaging solutions.</li>
          <li>✓ <strong>Impact & Climate Capital:</strong> Engage European impact investors supporting women-led agribusinesses and smallholder livelihoods.</li>
        </ul>
      </div>
    </div>
    <div class="footer-bar">
      <span><strong>Vision:</strong> Direct sustainable trade between Cambodian smallholders and European conscious consumers.</span>
      <span style="color: #cbd5e1;">Mayany Enterprise <strong style="color: #34d399;">powered by CashewTrace</strong></span>
    </div>
  </div>

  <!-- SLIDE 8: FOUNDER & LEADERSHIP -->
  <div class="slide-page">
    <div>
      <div class="badge-green">Leadership & Ecosystem</div>
      <h2 class="slide-title">Deep Agricultural Wisdom Meets Modern Enterprise</h2>
      <p class="slide-subtitle">30 Years of Agricultural Authority & Women-Led Innovation.</p>
    </div>
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 18px; margin: auto 0;">
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div>
            <div style="font-size: 22px; font-weight: 900; color: #fff;">Mayany SAM</div>
            <div style="color: #34d399; font-weight: 700; font-size: 13px;">Founder & CEO, Mayany Enterprise</div>
          </div>
          <span style="background: rgba(16,185,129,0.2); color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 800;">Female Agri-Entrepreneur</span>
        </div>
        <p class="card-desc" style="font-size: 13px; margin-bottom: 12px;">
          With over <strong>30 years of hands-on leadership</strong> in Cambodian agriculture, agro-processing, food standardization, and rural enterprise development, Mayany SAM has built trusted relationships with smallholder farming communities across Kampong Thom, Kratie, and Kampot provinces.
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: #020617; padding: 10px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="color: #fbbf24; font-weight: 800; font-size: 12px;">Domain Authority</div>
            <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">Understands exact regulatory hurdles (HACCP, CS 001, EUDR) required for export.</div>
          </div>
          <div style="background: #020617; padding: 10px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="color: #34d399; font-weight: 800; font-size: 12px;">Women Empowerment</div>
            <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">Championing female factory employment and digital agritech adoption.</div>
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
        <div class="card" style="padding: 12px;">
          <strong style="color: #fff; font-size: 13px;">🏛️ FTC / MISTI</strong>
          <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">Food Technology Transfer & Technical Standards</div>
        </div>
        <div class="card" style="padding: 12px;">
          <strong style="color: #fff; font-size: 13px;">🇰🇭 Khmer Enterprise (KE)</strong>
          <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">National Business Incubation & Scale Support</div>
        </div>
        <div class="card" style="padding: 12px;">
          <strong style="color: #fff; font-size: 13px;">🌾 Cambodian Cashew Association</strong>
          <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">Smallholder Supply & Harvest Coordination</div>
        </div>
      </div>
    </div>
    <div class="footer-bar">
      <span><strong>Mission:</strong> Bridging senior agro-industry wisdom with modern digital traceability.</span>
      <span style="color: #cbd5e1;">Mayany Enterprise <strong style="color: #34d399;">powered by CashewTrace</strong></span>
    </div>
  </div>

  <!-- SLIDE 9: ROADMAP & ASK -->
  <div class="slide-page">
    <div>
      <div class="badge-green">Roadmap & Berlin Objectives</div>
      <h2 class="slide-title">Strategic Roadmap (2026 - 2027)</h2>
      <p class="slide-subtitle">Milestones & Target Outcomes from Berlin Delegation.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <span style="color: #34d399; font-size: 11px; font-weight: 800; font-family: monospace;">KEY MILESTONES</span>
        <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
          <div><strong style="color: #34d399; font-family: monospace;">Q4 2026:</strong> Participate in AsiaBerlin Summit 2026; learn from German specialty food distribution.</div>
          <div><strong style="color: #fbbf24; font-family: monospace;">Q2 2027:</strong> Complete HACCP certification & final packaging validation with FTC / MISTI & KE support.</div>
          <div><strong style="color: #60a5fa; font-family: monospace;">Q3 2027:</strong> Deploy GPS farm-origin traceability across 150+ smallholders during next harvest; possible dispatch first export shipment.</div>
        </div>
      </div>
      <div class="card">
        <span style="color: #fbbf24; font-size: 11px; font-weight: 800; font-family: monospace;">TARGET OUTCOMES FROM BERLIN</span>
        <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
          <div style="border-bottom: 1px solid #1e293b; padding-bottom: 6px;">✓ <strong>1. Trade:</strong> Connect with at least 5 European specialty food distributors for possible product testing.</div>
          <div style="border-bottom: 1px solid #1e293b; padding-bottom: 6px;">✓ <strong>2. B2B Ingredient Contracts:</strong> Establish relationships for cashew nibs with European food manufacturers.</div>
          <div>✓ <strong>3. Country Representation:</strong> Showcase Cambodia's value-added agritech innovation at the Cambodia Pavilion.</div>
        </div>
      </div>
    </div>
    <div class="footer-bar">
      <div>
        <strong style="color: #fff; font-size: 14px;">MAYANY Enterprise <span style="color: #34d399; font-weight: 400;">powered by CashewTrace</span></strong><br>
        <span style="color: #cbd5e1; font-size: 11px;">Contact: mayany@mayanyenterprise.com • +855 88 771 2862 | mayanyenterprise.com • cashewtrace.com</span>
      </div>
      <div style="color: #34d399; font-weight: 800; font-size: 15px;">cashewtrace.com</div>
    </div>
  </div>

  </div>

</body>
</html>
`;
}

export function downloadPitchDeckHtmlFile(): void {
  const htmlContent = generatePitchDeckHtml();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Mayany_Enterprise_AsiaBerlin2026_Pitch_Deck.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openCleanPrintDeckWindow(): void {
  const htmlContent = generatePitchDeckHtml();
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 600);
  } else {
    // If popup blocker intervened, fallback to downloading the HTML presentation directly
    downloadPitchDeckHtmlFile();
  }
}
