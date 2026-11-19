// Generates clearly-labelled placeholder artwork in /public/placeholders.
// Run: npm run placeholders   (output is committed, so this is only needed to regenerate)
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const out = path.join(process.cwd(), "public", "placeholders");
mkdirSync(out, { recursive: true });

const palettes = [
  ["#e9e3da", "#cfc4b5", "#b7a894"],
  ["#ece8e3", "#d6cdc3", "#a99a8a"],
  ["#e4e1dc", "#c9c2b8", "#8f857a"],
  ["#efe9e1", "#dccfbf", "#bfae98"],
  ["#e6e2dd", "#cbc3ba", "#9d9286"],
  ["#ebe5dc", "#d3c7b6", "#ad9c86"],
];
const mono = ["#dcdcdc", "#a8a8a8", "#5c5c5c"];

/** soft abstract "figure" – head + shoulders silhouette made of blurred shapes */
function figure(w, h, [a, b, c], { cx = 0.5, scale = 1 } = {}) {
  const x = w * cx;
  const r = Math.min(w, h) * 0.2 * scale;
  return `
  <g filter="url(#blur)">
    <ellipse cx="${x}" cy="${h * 0.42}" rx="${r * 0.82}" ry="${r}" fill="${c}" opacity=".55"/>
    <rect x="${x - r * 0.32}" y="${h * 0.42 + r * 0.7}" width="${r * 0.64}" height="${r * 0.9}" fill="${c}" opacity=".45"/>
    <ellipse cx="${x}" cy="${h * 0.42 + r * 2.6}" rx="${r * 2.1}" ry="${r * 1.2}" fill="${c}" opacity=".5"/>
    <circle cx="${w * 0.15}" cy="${h * 0.18}" r="${r * 1.4}" fill="${b}" opacity=".6"/>
  </g>`;
}

function interior(w, h, [a, b, c]) {
  return `
  <g filter="url(#blur)">
    <rect x="${w * 0.08}" y="${h * 0.15}" width="${w * 0.3}" height="${h * 0.75}" rx="${w * 0.15}" fill="${b}" opacity=".7"/>
    <rect x="${w * 0.45}" y="${h * 0.55}" width="${w * 0.45}" height="${h * 0.12}" rx="12" fill="${c}" opacity=".5"/>
    <circle cx="${w * 0.75}" cy="${h * 0.3}" r="${Math.min(w, h) * 0.12}" fill="#fff" opacity=".55"/>
  </g>`;
}

function svg({ w, h, label, colors, content }) {
  const [a, b] = colors;
  const fs = Math.round(Math.min(w, h) * 0.028);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.round(Math.min(w, h) * 0.035)}"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${content}
  <g font-family="Helvetica, Arial, sans-serif" fill="#000" opacity=".45">
    <text x="${w / 2}" y="${h * 0.5 - fs * 0.4}" text-anchor="middle" font-size="${fs}" letter-spacing="${fs * 0.3}">PLACEHOLDER</text>
    <text x="${w / 2}" y="${h * 0.5 + fs}" text-anchor="middle" font-size="${fs * 0.8}" letter-spacing="${fs * 0.08}">${label.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>
  </g>
</svg>`;
}

const items = [];
const P = (name, w, h, label, kind = "figure", colors, opts) => items.push({ name, w, h, label, kind, colors, opts });

P("hero", 1920, 1080, "Hero video poster – 1920×1080", "figure", palettes[0], { cx: 0.68, scale: 1.3 });
P("injector", 1200, 1500, "Injector portrait – 4:5", "figure", palettes[1]);
P("enquiry", 1200, 1500, "Black & white portrait – 4:5", "figure", mono);
P("concerns-model", 1200, 1500, "Model portrait for concerns map – 4:5", "figure", palettes[3], { scale: 1.25 });
P("og-default", 1200, 630, "Social share image – 1200×630", "figure", palettes[2], { cx: 0.7 });
[1, 2, 3, 4, 5].forEach((n) => P(`clinic-${n}`, n % 2 ? 1400 : 1000, n % 2 ? 1000 : 1300, `Clinic interior ${n}`, "interior", palettes[n % palettes.length]));
["anti-wrinkle", "dermal-fillers", "skin-boosters", "collagen-biostimulators", "micro-needling", "fat-dissolving"].forEach((s, i) => {
  P(`cat-${s}`, 1000, 1400, `Category card – ${s}`, "figure", palettes[i], { scale: 0.95 });
  P(`t-${s}`, 1920, 1100, `Treatment hero – ${s}`, "figure", palettes[(i + 2) % palettes.length], { cx: 0.62, scale: 1.2 });
});
[1, 2, 3].forEach((n) => {
  P(`ba-before-${n}`, 1000, 1000, `Before – example ${n}`, "figure", palettes[2], { scale: 1.1 });
  P(`ba-after-${n}`, 1000, 1000, `After – example ${n}`, "figure", palettes[3], { scale: 1.1 });
});

for (const it of items) {
  const content = it.kind === "interior" ? interior(it.w, it.h, it.colors) : figure(it.w, it.h, it.colors, it.opts);
  writeFileSync(path.join(out, `${it.name}.svg`), svg({ ...it, content }));
}
console.log(`Generated ${items.length} placeholders in public/placeholders`);
