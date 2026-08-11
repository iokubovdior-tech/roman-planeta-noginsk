/**
 * Converts _legacy/deals.js (window.DEALS = [...]) into src/data/deals.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "_legacy", "deals.js");
const outDir = path.join(root, "src", "data");
const outFile = path.join(outDir, "deals.json");

const raw = fs.readFileSync(src, "utf8");
const match = raw.match(/window\.DEALS\s*=\s*(\[[\s\S]*\])\s*;?\s*$/m);
if (!match) {
  console.error("Could not find window.DEALS array in", src);
  process.exit(1);
}

const deals = Function(`"use strict"; return (${match[1]});`)();
const cleaned = deals.map((d) => ({
  id: d.id,
  date: d.date,
  dateLabel: d.dateLabel || "Сделка",
  title: String(d.title || "").replace(/\s+/g, " ").trim(),
  type: d.type || "Сделка",
  summary: String(d.summary || "").replace(/\s+/g, " ").trim(),
  description: String(d.description || "").replace(/\s+/g, " ").trim(),
  source: d.source || "",
  image: String(d.image || "").replace(/^photos\//, "/photos/"),
}));

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(cleaned, null, 2), "utf8");
console.log(`Wrote ${cleaned.length} deals -> ${outFile}`);
