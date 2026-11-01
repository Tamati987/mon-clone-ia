// Génère les icônes PNG de l'app au moment de la mise en ligne (aucune dépendance)
const fs = require("fs"), zlib = require("zlib");
const T = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = b => { let c = -1; for (const x of b) c = T[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
const clamp = v => Math.max(0, Math.min(1, v));
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function png(size, pad) {
  const row = size * 4 + 1, raw = Buffer.alloc(row * size), c = size / 2;
  const R = size * 0.34 * (1 - pad), w = R * 0.30, core = R * 0.42, dot = core * 0.55;
  for (let y = 0; y < size; y++) {
    raw[y * row] = 0;
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - c, dy = y + 0.5 - c, d = Math.hypot(dx, dy);
      const g = clamp(1 - d / (R * 1.9)) ** 1.6;
      let col = [5 + 36 * g, 6 + 26 * g, 14 + 100 * g];
      const t = (Math.sin(Math.atan2(dy, dx)) + 1) / 2;
      col = mix(col, mix([94, 241, 255], [155, 107, 255], t), clamp(Math.min(d - (R - w), R - d) + 0.5));
      col = mix(col, [232, 236, 255], clamp(core - d + 0.5));
      col = mix(col, [94, 241, 255], clamp(dot - d + 0.5));
      const o = y * row + 1 + x * 4;
      raw[o] = col[0]; raw[o + 1] = col[1]; raw[o + 2] = col[2]; raw[o + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
fs.writeFileSync("icon-192.png", png(192, 0));
fs.writeFileSync("icon-512.png", png(512, 0));
fs.writeFileSync("icon-maskable-512.png", png(512, 0.22));
fs.writeFileSync("apple-touch-icon.png", png(180, 0.05));
console.log("Icônes générées");
