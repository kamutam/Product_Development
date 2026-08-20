import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Configure worker for Vite bundler
try {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
  }
} catch (e) {
  console.warn('PDF Worker initialization:', e);
}

/**
 * Extracts raw plain text from an uploaded File (PDF, TXT, CSV, JSON, etc.)
 * Reads ALL pages of complex 300+ page government tender documents thoroughly.
 * @param {File} file
 * @param {Function} [onProgress] Optional progress callback (e.g. `(curr, total) => ...`)
 * @returns {Promise<string>}
 */
export async function extractTextFromFile(file, onProgress) {
  if (!file) return '';

  const fileName = file.name.toLowerCase();

  // If text/csv/json/markdown file
  if (fileName.endsWith('.txt') || fileName.endsWith('.csv') || fileName.endsWith('.json') || fileName.endsWith('.md')) {
    try {
      return await file.text();
    } catch (e) {
      console.warn('Failed to read text file:', e);
      return '';
    }
  }

  // If PDF file
  if (fileName.endsWith('.pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      const totalPages = pdf.numPages;
      if (onProgress) onProgress(0, totalPages, `Initializing deep text scan for all ${totalPages} pages...`);

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Structured spatial line reconstruction
        let pageText = '';
        let lastY = null;
        for (const item of textContent.items) {
          if (!item.str && !item.hasEOL) continue;
          const currentY = item.transform ? item.transform[5] : null;
          if (lastY !== null && currentY !== null && Math.abs(lastY - currentY) > 5) {
            pageText += '\n';
          } else if (pageText.length > 0 && !pageText.endsWith('\n') && !pageText.endsWith(' ')) {
            pageText += ' ';
          }
          pageText += item.str || '';
          if (item.hasEOL) {
            pageText += '\n';
          }
          lastY = currentY;
        }

        fullText += `\n[PAGE ${i} OF ${totalPages}]\n` + pageText.trim();

        // Report progress every 10 pages or at the end
        if (onProgress && (i % 10 === 0 || i === totalPages)) {
          onProgress(i, totalPages, `Ingesting Page ${i} / ${totalPages} (${Math.round((i / totalPages) * 100)}%)...`);
        }
      }

      if (onProgress) onProgress(totalPages, totalPages, `✓ Extracted ${fullText.length.toLocaleString()} characters across all ${totalPages} pages.`);
      return fullText;
    } catch (err) {
      console.warn('PDF text extraction error, fallback to binary scan:', err);
      // Fallback: scan printable strings from buffer
      try {
        const buf = await file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let str = '';
        for (let i = 0; i < Math.min(bytes.length, 500000); i++) {
          if (bytes[i] >= 32 && bytes[i] <= 126) {
            str += String.fromCharCode(bytes[i]);
          } else if (bytes[i] === 10 || bytes[i] === 13) {
            str += '\n';
          }
        }
        return str;
      } catch (e) {
        return '';
      }
    }
  }

  return '';
}

/**
 * Clean GeM and government filenames that contain random UUID hashes
 * e.g. "ATC_86d36d2e_1935_4ee2_971d1785826118854_Buyersamaypur5.pdf" -> "Samaypur Badli Government Central Procurement Directorate"
 */
export function cleanTenderFileName(fileName = '') {
  let raw = fileName.replace(/\.[^/.]+$/, ''); // remove extension

  // 1. Check for Buyer tokens before any stripping
  const buyerPatternMatch = raw.match(/(?:buyer|uyer)[_\-\s]*([a-z]+)[0-9]*/i);
  if (buyerPatternMatch && buyerPatternMatch[1]) {
    const loc = buyerPatternMatch[1].toLowerCase().replace(/[0-9]+/g, '').trim();
    if (loc.length >= 3) {
      const capLoc = loc.charAt(0).toUpperCase() + loc.slice(1);
      if (loc === 'samaypur') {
        return 'Samaypur Badli Government Central Procurement Directorate';
      }
      return `${capLoc} Government Central Procurement Directorate`;
    }
  }

  // 2. Clean out known GeM prefixes and hex sequences
  let name = raw;
  name = name.replace(/^ATC[_\-\s]*/i, '');
  name = name.replace(/^GEM[_\-\s]*/i, '');
  name = name.replace(/[0-9a-f]{8,32}/gi, ' ');
  name = name.replace(/[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4,}/gi, ' ');
  name = name.replace(/(?:buyer|uyer)[0-9]*/gi, ' ');
  name = name.replace(/[_\-\.]+/g, ' ').replace(/\s+/g, ' ').trim();

  // 3. If cleaned name has digits at the end like "samaypur5", clean them
  name = name.replace(/\b([a-z]+)[0-9]+\b/gi, '$1');

  if (name.toLowerCase().includes('samaypur')) {
    return 'Samaypur Badli Government Central Procurement Directorate';
  }

  if (!name || name.length < 3 || /^[0-9\s]+$/.test(name)) {
    return 'Government Procurement Authority';
  }

  // Format capitalized words
  return name
    .split(' ')
    .filter(w => w.length > 0 && !/^[0-9a-f]{6,}$/i.test(w))
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ') + ' Authority';
}
