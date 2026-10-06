import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

// Renders a high-quality icon buffer for QuickTools
function generateIconPNG(size) {
  const png = new PNG({ width: size, height: size });

  // Rounded squircle radius
  const r = size * 0.27;
  const padding = size * 0.04;
  const w = size - padding * 2;
  const h = size - padding * 2;

  // Background gradient: Rich royal indigo (#4F46E5) to cosmic violet (#7C3AED) to deep purple (#9333EA)
  const c1 = [79, 70, 229];  // #4F46E5
  const c2 = [124, 58, 237]; // #7C3AED
  const c3 = [147, 51, 234]; // #9333EA

  const boltBright = [254, 240, 138]; // #FEF08A
  const boltGold = [250, 204, 21];   // #FACC15
  const boltOrange = [234, 88, 12];  // #EA580C
  const cyanColor = [56, 189, 248];  // #38BDF8

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Check distance for rounded squircle
      const nx = x - padding;
      const ny = y - padding;

      let inSquircle = false;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        let dx = 0;
        let dy = 0;
        if (nx < r) dx = r - nx;
        else if (nx > w - r) dx = nx - (w - r);
        if (ny < r) dy = r - ny;
        else if (ny > h - r) dy = ny - (h - r);

        if (dx * dx + dy * dy <= r * r) {
          inSquircle = true;
        }
      }

      if (!inSquircle) {
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0; // Transparent
        continue;
      }

      // Linear 3-stop diagonal gradient from top-left to bottom-right
      const t = (x + y) / (size * 2);
      let bgR, bgG, bgB;
      if (t < 0.5) {
        const factor = t * 2;
        bgR = Math.round(c1[0] * (1 - factor) + c2[0] * factor);
        bgG = Math.round(c1[1] * (1 - factor) + c2[1] * factor);
        bgB = Math.round(c1[2] * (1 - factor) + c2[2] * factor);
      } else {
        const factor = (t - 0.5) * 2;
        bgR = Math.round(c2[0] * (1 - factor) + c3[0] * factor);
        bgG = Math.round(c2[1] * (1 - factor) + c3[1] * factor);
        bgB = Math.round(c2[2] * (1 - factor) + c3[2] * factor);
      }

      let pR = bgR;
      let pG = bgG;
      let pB = bgB;
      let pA = 255;

      // Normalized coordinates [0, 1] relative to squircle inner
      const u = nx / w;
      const v = ny / h;

      // Upper glass reflection sheen (arc curve at upper third)
      if (v < 0.35 && (u * 0.5 + v * 0.9) < 0.38) {
        pR = Math.min(255, pR + 45);
        pG = Math.min(255, pG + 45);
        pB = Math.min(255, pB + 60);
      }

      // 1. Digital HUD Header Bar (u: 0.18 to 0.82, v: 0.15 to 0.28)
      if (u >= 0.18 && u <= 0.82 && v >= 0.15 && v <= 0.28) {
        pR = 9;
        pG = 13;
        pB = 26;
        pA = 245;

        // Screen readout dots / bars
        if (u >= 0.22 && u <= 0.36 && v >= 0.18 && v <= 0.25) {
          pR = cyanColor[0];
          pG = cyanColor[1];
          pB = cyanColor[2];
        } else if (u >= 0.42 && u <= 0.48 && v >= 0.18 && v <= 0.25) {
          pR = 52;
          pG = 211;
          pB = 153; // Emerald
        } else if (u >= 0.54 && u <= 0.78 && v >= 0.18 && v <= 0.25) {
          pR = 248;
          pG = 250;
          pB = 252; // White
        }
      }

      // 2. Bold Plus sign (+) (u: 0.20 to 0.40, v: 0.36 to 0.56)
      const plusCx = 0.30;
      const plusCy = 0.45;
      const strokeW = 0.045;
      const plusLen = 0.11;
      const isPlusH = Math.abs(v - plusCy) <= strokeW && Math.abs(u - plusCx) <= plusLen;
      const isPlusV = Math.abs(u - plusCx) <= strokeW && Math.abs(v - plusCy) <= plusLen;
      if (isPlusH || isPlusV) {
        pR = 255;
        pG = 255;
        pB = 255;
        pA = 255;
      }

      // 3. Bold Equals sign (=) in Neon Cyan (u: 0.20 to 0.42, v: 0.70 to 0.86)
      const eqBar1 = v >= 0.70 && v <= 0.76 && u >= 0.20 && u <= 0.42;
      const eqBar2 = v >= 0.81 && v <= 0.87 && u >= 0.20 && u <= 0.42;
      if (eqBar1 || eqBar2) {
        pR = cyanColor[0];
        pG = cyanColor[1];
        pB = cyanColor[2];
        pA = 255;
      }

      // 4. Percentage symbol dots (u: 0.56 to 0.80, v: 0.34 to 0.54)
      const d1 = (u - 0.60) * (u - 0.60) + (v - 0.38) * (v - 0.38);
      const d2 = (u - 0.74) * (u - 0.74) + (v - 0.52) * (v - 0.52);
      if (d1 <= 0.0025 || d2 <= 0.0025) {
        pR = 255;
        pG = 255;
        pB = 255;
        pA = 255;
      }
      // Slash
      const slashDist = Math.abs((u - 0.56) + (v - 0.52) - 0.12);
      if (slashDist < 0.035 && u >= 0.58 && u <= 0.76 && v >= 0.36 && v <= 0.54) {
        pR = 240;
        pG = 244;
        pB = 255;
        pA = 255;
      }

      // 5. Electric Radiant Speed Bolt (Gold-to-Orange) (u: 0.50 to 0.85, v: 0.52 to 0.92)
      // Check if point falls inside lightning polygon:
      // (0.70, 0.40) -> (0.50, 0.65) -> (0.64, 0.65) -> (0.58, 0.90) -> (0.84, 0.58) -> (0.69, 0.58) -> Z
      const inBoltUpper = (u >= 0.50 && u <= 0.72 && v >= 0.40 && v <= 0.66 && (u - 0.50) * 1.25 > (v - 0.40) - 0.15);
      const inBoltLower = (u >= 0.56 && u <= 0.84 && v >= 0.58 && v <= 0.90 && (0.84 - u) * 1.15 > (v - 0.58) - 0.1);
      const inBoltCore = (u >= 0.58 && u <= 0.70 && v >= 0.58 && v <= 0.80);

      if (inBoltUpper || inBoltLower || inBoltCore) {
        const boltT = (v - 0.40) / 0.50;
        if (boltT < 0.4) {
          const f = boltT / 0.4;
          pR = Math.round(boltBright[0] * (1 - f) + boltGold[0] * f);
          pG = Math.round(boltBright[1] * (1 - f) + boltGold[1] * f);
          pB = Math.round(boltBright[2] * (1 - f) + boltGold[2] * f);
        } else {
          const f = (boltT - 0.4) / 0.6;
          pR = Math.round(boltGold[0] * (1 - f) + boltOrange[0] * f);
          pG = Math.round(boltGold[1] * (1 - f) + boltOrange[1] * f);
          pB = Math.round(boltGold[2] * (1 - f) + boltOrange[2] * f);
        }
        pA = 255;

        // White core highlight inside upper bolt
        if (u >= 0.64 && u <= 0.68 && v >= 0.44 && v <= 0.58) {
          pR = 255;
          pG = 255;
          pB = 255;
        }
      }

      png.data[idx] = pR;
      png.data[idx + 1] = pG;
      png.data[idx + 2] = pB;
      png.data[idx + 3] = pA;
    }
  }

  return PNG.sync.write(png);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Google Search requirement: 48x48
fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), generateIconPNG(48));

// 2. Standard favicon.png: 32x32
fs.writeFileSync(path.join(publicDir, 'favicon.png'), generateIconPNG(32));

// 3. Apple Touch Icon: 180x180
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateIconPNG(180));

// 4. PWA Web App Icons: 192x192 & 512x512
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), generateIconPNG(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), generateIconPNG(512));

// 5. Favicon.ico copy
fs.copyFileSync(path.join(publicDir, 'favicon.png'), path.join(publicDir, 'favicon.ico'));

console.log('Successfully generated all Google-compliant and Chrome-optimized favicon assets!');
