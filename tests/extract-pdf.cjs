// Use the same PDF.js version and text-line ordering as the browser app.
// node tests/extract-pdf.cjs <pdf-path> <pdfjs-directory> <output-text-path>
// The directory must contain PDF.js 3.11.174 pdf.min.js and pdf.worker.min.js.
const fs = require('node:fs');
const path = require('node:path');
const [pdfPath, libraryDirectory, outputPath] = process.argv.slice(2);
if (!pdfPath || !libraryDirectory || !outputPath) {
  console.error('Usage: node tests/extract-pdf.cjs <pdf-path> <pdfjs-directory> <output-text-path>');
  process.exit(1);
}
const pdfjs = require(path.resolve(libraryDirectory, 'pdf.min.js'));
pdfjs.GlobalWorkerOptions.workerSrc = path.resolve(libraryDirectory, 'pdf.worker.min.js');
function reconstructPdfPageText(items) {
  const validItems = (items || []).filter(item => item && typeof item.str === 'string' && item.str.length &&
    Array.isArray(item.transform) && Number.isFinite(item.transform[4]) && Number.isFinite(item.transform[5]));
  const charWidths = validItems.map(item => Number(item.width) / item.str.length)
    .filter(width => Number.isFinite(width) && width > 0).sort((a,b) => a-b);
  const charWidth = charWidths.length ? charWidths[Math.floor(charWidths.length / 2)] : 6;
  const lines = new Map();
  for (const item of validItems) {
    const y = Math.round(item.transform[5]);
    if (!lines.has(y)) lines.set(y, []);
    lines.get(y).push({x:item.transform[4], text:item.str});
  }
  return [...lines.keys()].sort((a,b) => b-a).map(y => {
    let line = '', cursor = 0;
    for (const item of lines.get(y).sort((a,b) => a.x-b.x)) {
      const column = Math.max(0, Math.round(item.x / charWidth));
      if (column > cursor) line += ' '.repeat(column-cursor);
      line += item.text;
      cursor = Math.max(cursor, column + item.text.length);
    }
    return line;
  }).join('\n');
}
(async () => {
  const pdf = await pdfjs.getDocument({data:new Uint8Array(fs.readFileSync(pdfPath))}).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += reconstructPdfPageText(content.items) + '\n';
    text += '\n';
  }
  fs.writeFileSync(outputPath, text.replace(/\r\n/g,'\n'));
  console.log(`Extracted ${pdf.numPages} pages using PDF.js ${pdfjs.version}`);
})().catch(error => { console.error(error); process.exitCode = 1; });
