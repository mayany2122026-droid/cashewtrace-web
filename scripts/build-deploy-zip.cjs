const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const rootDir = process.cwd();
const archivesDir = path.join(rootDir, 'archives');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(archivesDir)) {
  fs.mkdirSync(archivesDir, { recursive: true });
}

// 1. Clean up any leftover giant zips in public and dist
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
    try {
      fs.unlinkSync(f);
      console.log('Cleaned old zip:', f);
    } catch (e) {}
  }
});

const outZipPath = path.join(archivesDir, 'cashewtrace-site.zip');
const output = fs.createWriteStream(outZipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  const sizeMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
  console.log(`[ZIP BUILD] Complete! Total bytes: ${archive.pointer()} (${sizeMB} MB)`);
  
  // Copy to public/ and dist/
  fs.copyFileSync(outZipPath, path.join(publicDir, 'cashewtrace-site.zip'));
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(outZipPath, path.join(distDir, 'cashewtrace-site.zip'));
  }
  console.log('[ZIP BUILD] Copied to public/ and dist/');
});

archive.on('error', (err) => {
  console.error('Archive error:', err);
  process.exit(1);
});

archive.pipe(output);

// Files to include from dist/ or root:
const rootStaticFiles = [
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
  'mayany_official_logo.jpg',
  'mayany_official_logo_hires.jpg',
  'mayany_ke_application_product_collage.jpg',
  'mayany_cashew_house_mockup.jpg',
  'mayany_cashew_bar_kiosk_franchise.jpg',
  'mayany_100_pure_cashew_flour_qr.png',
  'mayany_100_pure_cashew_flour_qr.svg',
  'standardization_letter_mayany.html',
  'CashewTrace_Pitch_Deck_2026.html',
  'TRAINING_GUIDE.html',
  'CashewTrace_30_Day_Facebook_Schedule.csv',
  'CashewTrace_30_Day_Facebook_Captions.txt'
];

// Add index.html from dist
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  archive.file(path.join(distDir, 'index.html'), { name: 'index.html' });
} else if (fs.existsSync(path.join(rootDir, 'index.html'))) {
  archive.file(path.join(rootDir, 'index.html'), { name: 'index.html' });
}

// Add root static files
rootStaticFiles.forEach(file => {
  const distPath = path.join(distDir, file);
  const pubPath = path.join(publicDir, file);
  if (fs.existsSync(distPath)) {
    archive.file(distPath, { name: file });
  } else if (fs.existsSync(pubPath)) {
    archive.file(pubPath, { name: file });
  }
});

// Add dist/assets (compiled JS/CSS and hashed images) - excluding aistudio subfolder
if (fs.existsSync(path.join(distDir, 'assets'))) {
  const assets = fs.readdirSync(path.join(distDir, 'assets'));
  assets.forEach(asset => {
    if (asset !== 'aistudio' && !asset.endsWith('.zip')) {
      const fullPath = path.join(distDir, 'assets', asset);
      const stat = fs.statSync(fullPath);
      if (stat.isFile()) {
        archive.file(fullPath, { name: `assets/${asset}` });
      }
    }
  });
}

// Add dist/images or public/images
const imagesDir = fs.existsSync(path.join(distDir, 'images'))
  ? path.join(distDir, 'images')
  : path.join(publicDir, 'images');

if (fs.existsSync(imagesDir)) {
  archive.directory(imagesDir, 'images');
}

// Add ONLY the 12 actual product photos used by the app inside assets/aistudio/
const usedInSrc = [
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

usedInSrc.forEach(f => {
  const srcP = path.join(publicDir, 'assets', 'aistudio', f);
  if (fs.existsSync(srcP)) {
    archive.file(srcP, { name: `assets/aistudio/${f}` });
  }
});

// Finalize
archive.finalize();
