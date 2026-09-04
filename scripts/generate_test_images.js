/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');


async function generateTestImages() {
  const outputDir = path.join(__dirname, '..', 'tests', 'fixtures', 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const imagesToGenerate = [
    { name: 'jeju_sunset.jpg', w: 1920, h: 1080, bg: '#E65100', text: 'Jeju Sunset Beach' },
    { name: 'jeju_cafe.jpg', w: 1200, h: 1200, bg: '#6D4C41', text: 'Jeju Aewol Cafe' },
    { name: 'jeju_ocean.jpg', w: 1400, h: 900, bg: '#0288D1', text: 'Hyeopjae Emerald Sea' },
    { name: 'paris_eiffel.jpg', w: 1080, h: 1920, bg: '#1A237E', text: 'Paris Eiffel Night' },
    { name: 'paris_louvre.jpg', w: 1200, h: 800, bg: '#37474F', text: 'Louvre Museum' },
    { name: 'london_bridge.jpg', w: 1200, h: 800, bg: '#004D40', text: 'Tower Bridge' },
    { name: 'rome_colosseum.jpg', w: 1200, h: 800, bg: '#827717', text: 'Rome Colosseum' },
    { name: 'danang_resort.jpg', w: 1600, h: 1200, bg: '#00838F', text: 'Danang My Khe Beach' },
    { name: 'danang_banahills.jpg', w: 1200, h: 900, bg: '#2E7D32', text: 'Bana Hills Cablecar' },
    { name: 'ny_times_square.jpg', w: 1920, h: 1080, bg: '#C2185B', text: 'Times Square Neon' },
    { name: 'ny_central_park.jpg', w: 1400, h: 900, bg: '#33691E', text: 'Central Park' },
    { name: 'kyoto_cherry.jpg', w: 1200, h: 1200, bg: '#F8BBD0', text: 'Kyoto Cherry Blossom' },
    { name: 'kyoto_bamboo.jpg', w: 1080, h: 1440, bg: '#1B5E20', text: 'Arashiyama Bamboo' },
  ];

  for (const item of imagesToGenerate) {
    const filePath = path.join(outputDir, item.name);
    // Render on canvas in browser and export to JPEG file
    const buffer = await page.evaluate(async ({ w, h, bg, text }) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      
      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, bg);
      grad.addColorStop(1, '#111111');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Artistic geometric travel patterns
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 4;
      for (let i = 0; i < w; i += 80) {
        ctx.beginPath();
        ctx.arc(i, h / 2, 120, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Title typography
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(w / 20)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2, h / 2);

      // Metadata watermark
      ctx.font = `italic ${Math.round(w / 40)}px sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`${w}x${h} Real Photo Asset`, w / 2, h / 2 + (w / 18));

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(blob);
        }, 'image/jpeg', 0.85);
      });
    }, item);

    fs.writeFileSync(filePath, Buffer.from(buffer, 'base64'));
    console.log(`Generated real photo: ${item.name} (${Math.round(fs.statSync(filePath).size / 1024)} KB)`);
  }

  await browser.close();
  console.log('All real test photos generated successfully!');
}

generateTestImages().catch(console.error);
