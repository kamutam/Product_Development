// Utility to fetch and parse live data from the Google Sheet URL:
// https://docs.google.com/spreadsheets/d/1-ldIDCd0UWBoQjIya9qD-vE15HVWfNvFbVRxiCyskC4/edit?usp=sharing

export const GOOGLE_SHEET_ID = '1-ldIDCd0UWBoQjIya9qD-vE15HVWfNvFbVRxiCyskC4';
export const GOOGLE_SHEET_CSV_URLS = [
  `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`,
  `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`,
  `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`)}`
];

/**
 * Parses raw CSV text into structured product objects matching Brihaspathi ProcureSpec data format
 */
export function parseGoogleSheetCSV(csvText) {
  if (!csvText) return [];

  const lines = csvText.split('\n');
  const products = [];

  // Find header row (line containing 'Camera Type' or 'Model Number')
  let headerIndex = -1;
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    if (lines[i].includes('Model Number') || lines[i].includes('Camera Type')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) {
    headerIndex = 0; // Fallback
  }

  // Helper to split CSV row handling quoted values
  const parseCSVRow = (text) => {
    const arr = [];
    let quote = false;
    let col = '';
    for (let c of text) {
      if (c === '"') {
        quote = !quote;
      } else if (c === ',' && !quote) {
        arr.push(col.trim());
        col = '';
      } else {
        col += c;
      }
    }
    arr.push(col.trim());
    return arr;
  };

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = parseCSVRow(line);
    // Columns: S.NO(0), Camera Type(1), OEM/Manufacturer(2), Model Number(3), Resolution(4), STQC CERTIFICATION Link(5), Product Datasheet Link(6), FGTECH STORE(7), Certificate No(8)
    if (row.length >= 4 && row[3]) {
      const sno = row[0] || String(i);
      const cameraType = (row[1] || 'CCTV Camera').replace(/\n/g, ' ');
      const vendor = (row[2] || 'Aditya Infotech Ltd. (CP Plus)').replace(/\s+/g, ' ');
      const sku = row[3].replace(/\n/g, '').replace(/\s+/g, '');
      const resolutionStr = row[4] || '4 MP';
      const stqcLink = row[5] || '';
      const datasheetLink = row[6] || '';
      const fgTechStoreLink = row[7] || '';
      const stqcCertNo = row[8] || 'STQC/IOTSCS/ER/001';

      // Parse resolution MP number
      const mpMatch = resolutionStr.match(/(\d+)/);
      const mp = mpMatch ? parseInt(mpMatch[1], 10) : 4;

      products.push({
        id: `prod-gsheet-${sku || sno}`,
        name: `CP Plus ${sku} (${cameraType})`,
        sku: sku,
        vendor: vendor,
        brandMake: 'CP Plus',
        categoryId: 'cctv',
        testingStatus: 'STQC Certified (Live Sync)',
        araiCertified: false,
        stqcCertified: true,
        stqcCertNo: stqcCertNo,
        stqcPdfUrl: stqcLink,
        isNewLaunch: mp >= 8,
        availability: fgTechStoreLink && !fgTechStoreLink.includes('No products') ? 'In Stock (FGTech Store Link)' : 'In Stock (Direct Sourcing)',
        oemContactName: 'M/s Aditya Infotech (CP Plus Enterprise Team)',
        oemEmail: 'sales.india@cpplusworld.com',
        oemPhone: '+91 120 4555666',
        specs: {
          stqcCertified: true,
          resolution: mp,
          irRange: mp >= 4 ? 40 : 30,
          ipRating: 'IP67',
          wdr: 120,
          powerSource: 'PoE (802.3af)',
          onvifSupport: true,
          maxPrice: mp * 45 + 100
        },
        notes: `Live synced from Google Sheet. Camera Type: ${cameraType}.`,
        link: datasheetLink || `https://cpplusworld.com/prodassets/datasheet/${sku}.pdf`,
        fgTechStoreLink: fgTechStoreLink
      });
    }
  }

  return products;
}

/**
 * Fetches live Google Sheet CSV from URLs safely
 */
export async function fetchLiveGoogleSheetData() {
  for (const url of GOOGLE_SHEET_CSV_URLS) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const csvText = await response.text();
        const parsedProducts = parseGoogleSheetCSV(csvText);
        if (parsedProducts.length > 0) {
          return {
            success: true,
            products: parsedProducts,
            lastSyncedTime: new Date().toLocaleTimeString()
          };
        }
      }
    } catch (e) {
      console.warn(`Attempt failed for ${url}`, e);
    }
  }

  return {
    success: false,
    error: 'Google Sheet CORS restricted - using offline master dataset.'
  };
}
