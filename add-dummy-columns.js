import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const INPUT = './output/merged_mexico_2026-03-05.csv';
const OUTPUT = './output/merged_mexico_2026-03-05_sample.csv';

const inputPath = path.resolve(INPUT);
const outputPath = path.resolve(OUTPUT);

const csvText = fs.readFileSync(inputPath, 'utf8');
const { data: rows, meta } = Papa.parse(csvText, { header: true, skipEmptyLines: true });

// Add dummy data: purchases (5–5000), average order in MXN (50–5000)
const rnd = (min, max) => min + Math.random() * (max - min);
const rndInt = (min, max) => Math.floor(rnd(min, max + 1));

rows.forEach((row) => {
  row.purchases = String(rndInt(5, 5000));
  row['average order'] = rnd(50, 5000).toFixed(2);
});

// Ensure column order: existing fields + purchases + average order
const existingFields = (meta.fields || Object.keys(rows[0] || {})).filter(
  (k) => k !== 'purchases' && k !== 'average order'
);
const allFields = [...existingFields, 'purchases', 'average order'];

const out = Papa.unparse(rows, { columns: allFields });
fs.writeFileSync(outputPath, out, 'utf8');

console.log(`Created ${OUTPUT} with ${rows.length} rows (added "purchases" and "average order" columns)`);
