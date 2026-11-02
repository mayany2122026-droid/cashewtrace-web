const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function buildZip() {
  const zip = new JSZip();
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  const distDir = path.join(rootDir, 'dist');
  const archivesDir = path.join(rootDir, 'archives');
  const optimDir = path.join(rootDir, 'cloudflare-optimized-assets');

  if (!fs.existsSync(archivesDir)) {
    fs.mkdirSync(archivesDir, { recursive: true });
  }

  // 1. Remove old massive zip files
  const oldZips = [
    path.join(publicDir, 'cashewtrace-site.zip'),
    path.join(publicDir, 'cashewtrace-site-v2.zip'),
    path.join(publicDir, 'cashewtrace.zip'),
    path.join(distDir, 'cashewtrace-site.zip'),
    path.join(distDir, 'cashewtrace-site-v2.zip'),
    path.join(distDir, 'cashewtrace.zip'),
    path.join(archivesDir, 'cashewtrace-site.zip'),
    path.join(archivesDir, 'cashewtrace-site-v2.zip'),
    path.join(archivesDir, 'cashewtrace-production-site.zip'),
  ];
  oldZips.forEach(f => {
    if (fs.existsSync(f)) {
      try { fs.unlinkSync(f); } catch (e) {}
    }
  });

  // 2. Add index.html
  const indexPath = fs.existsSync(path.join(distDir, 'index.html'))
    ? path.join(distDir, 'index.html')
    : path.join(rootDir, 'index.html');
  zip.file('index.html', fs.readFileSync(indexPath));

  // 3. Add static root files needed by PWA and Cloudflare Pages
  const rootFiles = [
    '_redirects',
    'manifest.json',
    'manifest.webmanifest',
    'robots.txt',
    'sitemap.xml',
    'sw.js',
    'icon.svg',
    'icon-144.png',
    'icon-192.png',
    'icon-512.png',
    'apple-touch-icon.png',
    'mayany_100_pure_cashew_flour_qr.png',
    'mayany_100_pure_cashew_flour_qr.svg',
    'standardization_letter_mayany.html',
    'CashewTrace_Pitch_Deck_2026.html',
    'TRAINING_GUIDE.html',
    'CashewTrace_30_Day_Facebook_Schedule.csv',
    'CashewTrace_30_Day_Facebook_Captions.txt'
  ];

  for (const f of rootFiles) {
    const dPath = path.join(distDir, f);
    const pPath = path.join(publicDir, f);
    if (fs.existsSync(dPath)) {
      zip.file(f, fs.readFileSync(dPath));
    } else if (fs.existsSync(pPath)) {
      zip.file(f, fs.readFileSync(pPath));
    }
  }

  // 4. Add compiled assets in dist/assets
  if (fs.existsSync(path.join(distDir, 'assets'))) {
    const assetsFolder = zip.folder('assets');
    const files = fs.readdirSync(path.join(distDir, 'assets'));
    for (const f of files) {
      if (f !== 'aistudio' && !f.endsWith('.zip')) {
        const full = path.join(distDir, 'assets', f);
        if (fs.statSync(full).isFile()) {
          assetsFolder.file(f, fs.readFileSync(full));
        }
      }
    }
  }

  // 5. Add images
  const imagesDir = fs.existsSync(path.join(distDir, 'images'))
    ? path.join(distDir, 'images')
    : path.join(publicDir, 'images');

  if (fs.existsSync(imagesDir)) {
    const imagesFolder = zip.folder('images');
    const imgs = fs.readdirSync(imagesDir);
    for (const im of imgs) {
      const full = path.join(imagesDir, im);
      if (fs.statSync(full).isFile()) {
        imagesFolder.file(im, fs.readFileSync(full));
      }
    }
  }

  // 6. Add ONLY the 12 actual product photos used in src/ (from optimized directory)
  const usedProductPhotos = [
    'Mayany_Enterprise_Logo_August_26_2026_4cdf6a3d.jpg',
    'image_138a53de.png',
    'image_1a98f3af.png',
    'image_259fd0cb.png',
    'image_2a5d8995.png',
    'image_347e37e2.png',
    'image_445ae7ce.png',
    'image_5a79710c.png',
    'image_62ff0b40.png',
    'image_8ab133e5.png',
    'image_8eface38.png',
    'image_9ff1e192.png'
  ];

  const aistudioFolder = zip.folder('assets/aistudio');
  for (const pf of usedProductPhotos) {
    const optP = path.join(optimDir, pf);
    const pubP = path.join(publicDir, 'assets', 'aistudio', pf);
    if (fs.existsSync(optP)) {
      aistudioFolder.file(pf, fs.readFileSync(optP));
    } else if (fs.existsSync(pubP)) {
      aistudioFolder.file(pf, fs.readFileSync(pubP));
    }
  }

  console.log('[ZIP BUILD] Generating compressed zip archive...');
  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const zipTarget = path.join(archivesDir, 'cashewtrace-site.zip');
  fs.writeFileSync(zipTarget, buffer);
  fs.writeFileSync(path.join(publicDir, 'cashewtrace-site.zip'), buffer);
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'cashewtrace-site.zip'), buffer);
  }

  const sizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
  console.log(`[ZIP BUILD] SUCCESS! cashewtrace-site.zip size: ${sizeMB} MB (${buffer.length} bytes)`);
}

buildZip().catch(err => {
  console.error('Build zip failed:', err);
  process.exit(1);
});
