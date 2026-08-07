// Smart Datasheet Text & Project Description Auto-Extraction Utility Engine

export function extractSpecsFromText(rawText, category) {
  if (!rawText || !category) return { name: '', vendor: '', sku: '', specs: {} };

  const text = rawText.trim();
  const lines = text.split('\n');

  let extractedName = lines[0] ? lines[0].substring(0, 70).trim() : '';
  let extractedVendor = '';
  let extractedSku = '';

  const knownVendors = ['HikVision', 'Dahua', 'Axis', 'Hanwha', 'Bosch', 'Uniview', 'Jinko', 'Trina', 'Canadian Solar', 'ZKTeco', 'Suprema', 'DJI', 'Autel', 'CP-PLUS', 'Streamax', 'Howen'];
  for (const v of knownVendors) {
    if (text.toLowerCase().includes(v.toLowerCase())) {
      extractedVendor = v;
      break;
    }
  }

  const skuMatch = text.match(/\b([A-Z0-9]{3,8}-[A-Z0-9-]{3,12})\b/i);
  if (skuMatch) {
    extractedSku = skuMatch[1];
  }

  const specs = {};

  category.fields.forEach(field => {
    const key = field.key;

    switch (key) {
      case 'araiCertified': {
        specs[key] = /ARAI|AIS-140|AIS140|Automotive Research/i.test(text);
        break;
      }
      case 'stqcCertified': {
        specs[key] = /STQC|UIDAI|MeiTY|Government Certified/i.test(text);
        break;
      }

      // CCTV & Transit
      case 'resolution': {
        const m = text.match(/(\d+)\s*(?:MP|Megapixel|4K|8K)/i);
        if (m) specs[key] = parseInt(m[1], 10);
        else if (/4K/i.test(text)) specs[key] = 8;
        break;
      }
      case 'irRange': {
        const m = text.match(/(\d+)\s*(?:m|meter|meters)?\s*(?:IR|Night Vision|Infrared)/i) || 
                  text.match(/(?:IR|Night Vision|Infrared)\s*:?\s*(\d+)\s*m/i);
        if (m) specs[key] = parseInt(m[1], 10);
        break;
      }
      case 'ipRating': {
        const m = text.match(/(IP54|IP65|IP66|IP67|IP68)/i);
        if (m) specs[key] = m[1].toUpperCase();
        break;
      }
      case 'wdr': {
        const m = text.match(/(\d+)\s*dB/i) || text.match(/WDR\s*:?\s*(\d+)/i);
        if (m) specs[key] = parseInt(m[1], 10);
        break;
      }
      case 'powerSource': {
        if (/PoE\+/i.test(text)) specs[key] = 'PoE+ (802.3at)';
        else if (/PoE/i.test(text)) specs[key] = 'PoE (802.3af)';
        else if (/12V/i.test(text)) specs[key] = '12V DC';
        else if (/Solar/i.test(text)) specs[key] = 'Solar Powered';
        break;
      }
      case 'onvifSupport': {
        specs[key] = /ONVIF/i.test(text);
        break;
      }
      case 'mdvrChannels': {
        const m = text.match(/(\d+)\s*(?:CH|Channel|Channels|Cam)/i);
        if (m) specs[key] = parseInt(m[1], 10);
        break;
      }

      // Solar
      case 'wattage': {
        const m = text.match(/(\d{3,4})\s*(?:W|Watt|Watts)/i);
        if (m) specs[key] = parseInt(m[1], 10);
        break;
      }
      case 'efficiency': {
        const m = text.match(/(\d{2}\.?\d?)\s*%/);
        if (m) specs[key] = parseFloat(m[1]);
        break;
      }
      case 'cellType': {
        if (/Bifacial/i.test(text)) specs[key] = 'Bifacial N-Type';
        else if (/TOPCon/i.test(text)) specs[key] = 'TOPCon';
        else if (/Monocrystalline|Mono PERC/i.test(text)) specs[key] = 'Monocrystalline PERC';
        else if (/Polycrystalline/i.test(text)) specs[key] = 'Polycrystalline';
        break;
      }
      case 'warrantyYears': {
        const m = text.match(/(\d{1,2})\s*(?:Year|Years|Yr|Yrs)\s*(?:Warranty|Performance)?/i);
        if (m) specs[key] = parseInt(m[1], 10);
        else {
          const mMonths = text.match(/(\d{1,2})\s*(?:month|months)\s*(?:warranty)?/i);
          if (mMonths) specs[key] = Math.round(parseInt(mMonths[1], 10) / 12);
        }
        break;
      }

      // Biometrics
      case 'userCapacity': {
        const m = text.match(/(\d{1,6})\s*(?:Users|Templates|User|Capacity)/i);
        if (m) specs[key] = parseInt(m[1], 10);
        break;
      }

      // Drones
      case 'flightTime': {
        const m = text.match(/(\d{2,3})\s*(?:min|mins|minutes|flight)/i);
        if (m) specs[key] = parseInt(m[1], 10);
        break;
      }

      // Price
      case 'maxPrice': {
        const m = text.match(/\$\s*(\d+\.?\d*)/) || text.match(/(\d+\.?\d*)\s*(?:USD|\$)/i);
        if (m) specs[key] = parseFloat(m[1]);
        break;
      }

      default: {
        if (field.type === 'number') {
          const regex = new RegExp(`${field.label.split(' ')[0]}\\s*:?\\s*(\\d+\\.?\\d*)`, 'i');
          const m = text.match(regex);
          if (m) specs[key] = parseFloat(m[1]);
        }
        break;
      }
    }
  });

  return {
    name: extractedName,
    vendor: extractedVendor || 'Vendor',
    sku: extractedSku || '',
    specs
  };
}

/**
 * Automatically extracts project category domain, material specifications,
 * tender requirements, standards (RDSO, ARAI, STQC), and warranty from description text.
 */
export function extractProjectReqsFromDescription(descriptionText, categories) {
  if (!descriptionText) return null;

  const text = descriptionText.trim();

  // 1. Detect Category Domain based on keywords
  let detectedCatId = 'cctv';
  if (/RDSO|MNVR|Locomotive|Mobile DVR|Transit|MSRTC|Bus|AIS-140|ARAI/i.test(text)) {
    detectedCatId = 'transit-surveillance';
  } else if (/Solar|PV|Rooftop|Watt|Inverter|kW|MW/i.test(text)) {
    detectedCatId = 'solar';
  } else if (/Biometric|STQC|UIDAI|Fingerprint|Face|Turnstile|Gate/i.test(text)) {
    detectedCatId = 'biometrics';
  } else if (/Drone|UAV|Flight|Thermal|LiDAR|Aerial/i.test(text)) {
    detectedCatId = 'drones';
  } else if (/Camera|CCTV|IP Camera|NVR|Dome|Bullet/i.test(text)) {
    detectedCatId = 'cctv';
  }

  const category = categories.find(c => c.id === detectedCatId) || categories[0];

  // 2. Detect Specific Standards & Brands (e.g. RDSO, CP-PLUS, MNVR, Warranty)
  let rdsoSpec = '';
  const rdsoMatch = text.match(/(RDSO\/[A-Z0-9\/]+(?:\/Version\s*\d+\.\d+)?)/i) || 
                    text.match(/RDSO Specification No\.?\s*([A-Z0-9\/_-]+)/i);
  if (rdsoMatch) {
    rdsoSpec = rdsoMatch[1];
  }

  let preferredMake = '';
  const makeMatch = text.match(/Make[-:\s]*([A-Z0-9\/\s-]+?)(?:\s+brand|\s+of|\s+\(|$|,)/i) ||
                    text.match(/Brand[-:\s]*([A-Z0-9\/\s-]+)/i);
  if (makeMatch) {
    preferredMake = makeMatch[1].trim();
  }

  let warrantyMonths = '';
  const warrantyMatch = text.match(/(\d{1,2})\s*months/i) || text.match(/(\d{1,2})\s*years?/i);
  if (warrantyMatch) {
    warrantyMonths = warrantyMatch[0];
  }

  // 3. Extract technical field requirements for the detected category
  const reqs = {};
  category.fields.forEach(field => {
    reqs[field.key] = field.defaultReq;
  });

  // Extract ARAI / STQC requirements
  if (/ARAI|AIS-140|AIS140|RDSO|Locomotive|Transit/i.test(text)) {
    reqs['araiCertified'] = true;
  }
  if (/STQC|UIDAI|MeiTY/i.test(text)) {
    reqs['stqcCertified'] = true;
  }

  // Channel extraction (e.g. 4CH / 8CH MNVR)
  const chMatch = text.match(/(\d+)\s*(?:CH|Channel|Cam)/i);
  if (chMatch && reqs['mdvrChannels'] !== undefined) {
    reqs['mdvrChannels'] = parseInt(chMatch[1], 10);
  }

  // Resolution extraction
  const resMatch = text.match(/(\d+)\s*(?:MP|Megapixel|4K)/i);
  if (resMatch && reqs['resolution'] !== undefined) {
    reqs['resolution'] = parseInt(resMatch[1], 10);
  }

  // Voltage extraction
  if (/9V|36V|Transit/i.test(text) && reqs['voltageRange'] !== undefined) {
    reqs['voltageRange'] = '9V - 36V Wide DC (Transit)';
  }

  return {
    detectedCategoryId: detectedCatId,
    categoryName: category.name,
    requirements: reqs,
    detectedMetadata: {
      rdsoSpec,
      preferredMake,
      warrantyMonths
    }
  };
}

export function parseCSVFile(csvContent, category) {
  const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const parsedProducts = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (row.length < 2) continue;

    const prod = {
      id: `prod-auto-${Date.now()}-${i}`,
      name: row[0] || `Imported Product ${i}`,
      vendor: row[1] || 'Supplier',
      sku: row[2] || '',
      categoryId: category.id,
      specs: {}
    };

    category.fields.forEach(field => {
      const fieldIdx = headers.findIndex(h => h.includes(field.key.toLowerCase()) || h.includes(field.label.toLowerCase().split(' ')[0]));
      if (fieldIdx !== -1 && row[fieldIdx] !== undefined) {
        let val = row[fieldIdx];
        if (field.type === 'number') val = parseFloat(val) || field.defaultReq;
        if (field.type === 'boolean') val = val.toLowerCase() === 'true' || val === '1';
        prod.specs[field.key] = val;
      } else {
        prod.specs[field.key] = field.defaultReq;
      }
    });

    parsedProducts.push(prod);
  }

  return parsedProducts;
}
