import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mode: 'Hybrid: Server-side Gemini AI + Offline Fallback',
    time: new Date().toISOString()
  });
});

// Download production site bundle with streaming pipe
const sendSiteZip = (req: express.Request, res: express.Response) => {
  const candidateFiles = [
    path.resolve(process.cwd(), 'archives', 'cashewtrace-site.zip'),
    path.resolve(process.cwd(), 'public', 'cashewtrace-site.zip'),
    path.resolve(process.cwd(), 'dist', 'cashewtrace-site.zip'),
  ];

  let targetFile = candidateFiles[0];
  for (const f of candidateFiles) {
    if (fs.existsSync(f)) {
      targetFile = f;
      break;
    }
  }

  if (!fs.existsSync(targetFile)) {
    return res.status(404).send('Archive file not found');
  }

  const stat = fs.statSync(targetFile);

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="cashewtrace-site.zip"');
  res.setHeader('Content-Length', stat.size.toString());
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const stream = fs.createReadStream(targetFile);
  stream.on('error', (err) => {
    console.error('Error streaming zip file:', err);
    if (!res.headersSent) {
      res.status(500).send('Error streaming file');
    }
  });
  stream.pipe(res);
};

// Intercept ANY zip file request or download query before Vite SPA fallback
app.use((req, res, next) => {
  const urlPath = decodeURIComponent(req.path || '').toLowerCase();
  if (
    urlPath.includes('.zip') ||
    urlPath.includes('/download-site') ||
    urlPath.includes('/download-bundle') ||
    urlPath === '/download' ||
    urlPath === '/zip'
  ) {
    return sendSiteZip(req, res);
  }
  next();
});

app.get('/api/download-site', sendSiteZip);
app.get('/api/download-bundle', sendSiteZip);

// Lazy-initialized Gemini AI client
let genAiClient: GoogleGenAI | null = null;
function getGenAiClient(): GoogleGenAI | null {
  if (!genAiClient && process.env.GEMINI_API_KEY) {
    try {
      genAiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI:', e);
    }
  }
  return genAiClient;
}

// General Q&A Assistant Endpoint (like ChatGPT - answers ANY question in Khmer or English)
app.post('/api/ask', async (req, res) => {
  try {
    const { query, lang = 'km', appContext = 'general', details = {} } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Query string is required' });
    }

    const trimmedQuery = query.trim();
    const isKhmer = lang === 'km';
    const client = getGenAiClient();

    if (client) {
      const systemInstruction = `You are an expert, warm, and highly practical agricultural and supply chain AI assistant integrated into a voice-first application designed for Cambodian cashew farm owners, agricultural cooperatives, food processors, traders, and exporters.
Language preference: ${isKhmer ? 'Khmer (ភាសាខ្មែរ) with polite, clear, natural spoken phrasing suitable for farmers and orchard owners' : 'English with clear, accessible vocabulary'}.
Current application context: ${appContext} (focusing on Cashew Supply Chain, Chey Sambo Processing Facility in Kampong Speu, EUDR & 30ha Farm Mapping, Mango GAP, Pepper GI, or Digital Packaging Label CS 001).

Your core guidelines:
1. Answer ANY question the user asks in full, giving complete, actionable agricultural, technical, and market advice without cutting off.
2. For Cashew Farming & Processing:
   - Provide concrete advice on Chey Sambo Processing Facility (Kampong Speu): purchasing requirements, dry moisture levels (8% to 10%), high KOR outturn, and direct farm-gate pricing without middlemen.
   - For agronomy: explain compost/NPK fertilizer timing, pruning right after harvest, natural pest management (shoot borer, tea mosquito bug, neem oil), and proper sun-drying on tarps (never bare dirt).
   - For EUDR compliance: explain GPS polygon mapping, zero deforestation post Dec 31, 2020, and legal ownership documentation.
3. For general knowledge, science, or business questions: give a helpful, complete, well-structured answer.
4. Keep the phrasing natural and engaging so it sounds wonderful when read aloud over text-to-speech. Never output complex markdown tables; use clean short bullet points and fluent sentences.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `${systemInstruction}\n\nUser Question: ${trimmedQuery}`,
      });

      const rawText = response.text ? response.text.trim() : '';
      if (rawText) {
        return res.json({
          answer: rawText,
          spokenText: rawText.replace(/[*_#`]/g, ''),
          source: 'gemini-3.6-flash'
        });
      }
    }

    // Fallback response if Gemini is unavailable
    const fallbackAnswer = isKhmer 
      ? `ខ្ញុំបានស្តាប់ឮ៖ "${trimmedQuery}"។ សម្រាប់សំណួរនេះ ប្រព័ន្ធកំពុងដំណើរការឆ្លើយតប។ ប្រសិនបើទាក់ទងនឹងការវេចខ្ចប់ សូមប្រាកដថាស្លាកសញ្ញាមានឈ្មោះជាភាសាខ្មែរធំជាងគេ កាលបរិច្ឆេទផលិត និងផុតកំណត់ច្បាស់លាស់។`
      : `I heard your question: "${trimmedQuery}". For packaging questions, ensure your CS 001 label displays the product name prominently, with clear expiry dates and metric net weight.`;

    return res.json({
      answer: fallbackAnswer,
      spokenText: fallbackAnswer,
      source: 'offline-fallback'
    });
  } catch (error: any) {
    console.error('Error in /api/ask:', error);
    const isKhmer = req.body?.lang === 'km';
    const errorMsg = isKhmer
      ? 'សូមអភ័យទោស ប្រព័ន្ធកំពុងមមាញឹកបន្តិច។ សូមសាកល្បងនិយាយម្តងទៀត!'
      : 'Sorry, the assistant encountered an error. Please try speaking again!';
    res.json({
      answer: errorMsg,
      spokenText: errorMsg,
      source: 'error-fallback'
    });
  }
});

// Vite middleware setup (serves the SPA frontend)
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MyDailyPA Zero-Cost Offline Server running on http://localhost:${PORT}`);
  });
}

start();
