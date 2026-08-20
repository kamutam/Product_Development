/**
 * Universal Multi-Document Tender Package Engine & Section-Aware Semantic Indexer
 * Brihaspathi Technologies Limited - Tender Intelligence Engine
 * 
 * Ingests, categorizes, and indexes complete multi-document tender packages
 * (GeM Bids, 300+ page ATCs, BoQ schedules, Corrigenda, Technical Specs)
 * with strict page-level and section-level provenance.
 */

/**
 * Section Categorization Taxonomy
 */
export const TENDER_SECTION_TYPES = {
  IFB: 'Invitation for Bids (IFB) / Tender Notice',
  BEC: 'Bid Evaluation Criteria (BEC) / Pre-Qualification (PQ) & Technical Qualification (TQ)',
  COMMERCIAL: 'General & Special Conditions of Contract (GCC/SCC) / Payment & Financial Terms',
  SPECIFICATIONS: 'Technical Specifications & Homologation Schedule',
  SOW: 'Scope of Work (SOW) / Services & Implementation Schedule',
  SLA: 'Service Level Agreement (SLA) & Maintenance / CAMC / FMS Terms',
  BOQ: 'Bill of Quantities (BoQ) / Schedule of Rates (SOR) & Price Schedule',
  CRITICAL: 'Statutory Mandates, Make in India (MII), STQC, PBG & Integrity Pact',
  CORRIGENDUM: 'Corrigendum / Addendum / Amendments & Pre-Bid Clarifications'
};

/**
 * Parses raw extracted PDF text (with `[PAGE X OF N]` markers) into an indexed page map.
 * @param {string} fullText
 * @param {string} documentName
 * @returns {Array<{ pageNumber: number, text: string, documentName: string, lines: string[] }>}
 */
export function buildDocumentPageMap(fullText, documentName = 'Tender Document') {
  if (!fullText) return [];

  const pageRegex = /\[PAGE\s+(\d+)\s+OF\s+(\d+)\]/gi;
  const pages = [];
  let match;
  let lastIndex = 0;
  let currentPageNumber = 1;

  const matches = [];
  while ((match = pageRegex.exec(fullText)) !== null) {
    matches.push({
      pageNumber: parseInt(match[1], 10),
      totalPages: parseInt(match[2], 10),
      startIndex: match.index,
      length: match[0].length
    });
  }

  if (matches.length === 0) {
    // If no page markers, treat entire text as single page 1
    return [{
      pageNumber: 1,
      documentName,
      text: fullText.trim(),
      lines: fullText.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    }];
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const textStart = current.startIndex + current.length;
    const textEnd = (i + 1 < matches.length) ? matches[i + 1].startIndex : fullText.length;
    const pageContent = fullText.substring(textStart, textEnd).trim();

    pages.push({
      pageNumber: current.pageNumber,
      documentName,
      text: pageContent,
      lines: pageContent.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    });
  }

  return pages;
}

/**
 * Categorizes each page into semantic section types using domain patterns.
 * @param {Array<{ pageNumber: number, text: string, documentName: string }>} pageMap
 * @returns {Array<object>} Page map enriched with detected section tags
 */
export function enrichPagesWithSections(pageMap) {
  return pageMap.map(page => {
    const lower = page.text.toLowerCase();
    const detectedSections = [];

    // IFB / Tender Details
    if (
      lower.includes('invitation for bid') ||
      lower.includes('notice inviting tender') ||
      lower.includes('tender notice') ||
      lower.includes('bid details') ||
      lower.includes('tender no.') ||
      lower.includes('gem bid no') ||
      lower.includes('earnest money deposit') ||
      lower.includes('pre-bid meeting')
    ) {
      detectedSections.push(TENDER_SECTION_TYPES.IFB);
    }

    // BEC / PQ / TQ
    if (
      lower.includes('bid evaluation criteria') ||
      lower.includes('evaluation criteria') ||
      lower.includes('qualification criteria') ||
      lower.includes('pre-qualification') ||
      lower.includes('technical qualification') ||
      lower.includes('annual turnover') ||
      lower.includes('similar work') ||
      lower.includes('past experience') ||
      lower.includes('financial capability') ||
      lower.includes('solvency') ||
      lower.includes('maf') ||
      lower.includes('manufacturer authorization')
    ) {
      detectedSections.push(TENDER_SECTION_TYPES.BEC);
    }

    // GCC / SCC / Payment / Commercial
    if (
      lower.includes('terms of payment') ||
      lower.includes('payment terms') ||
      lower.includes('billing schedule') ||
      lower.includes('milestone') ||
      lower.includes('performance bank guarantee') ||
      lower.includes('pbg') ||
      lower.includes('security deposit') ||
      lower.includes('liquidated damages') ||
      lower.includes('special conditions of contract') ||
      lower.includes('general conditions of contract')
    ) {
      detectedSections.push(TENDER_SECTION_TYPES.COMMERCIAL);
    }

    // Specifications & SOW
    if (
      lower.includes('technical specifications') ||
      lower.includes('scope of work') ||
      lower.includes('technical parameters') ||
      lower.includes('cctv camera') ||
      lower.includes('nvr') ||
      lower.includes('vms') ||
      lower.includes('optical fiber') ||
      lower.includes('poe switch') ||
      lower.includes('ups') ||
      lower.includes('server') ||
      lower.includes('storage') ||
      lower.includes('sitc')
    ) {
      detectedSections.push(TENDER_SECTION_TYPES.SPECIFICATIONS);
      detectedSections.push(TENDER_SECTION_TYPES.SOW);
    }

    // SLA & Maintenance
    if (
      lower.includes('service level agreement') ||
      lower.includes('sla') ||
      lower.includes('uptime') ||
      lower.includes('mttr') ||
      lower.includes('mean time to repair') ||
      lower.includes('maintenance') ||
      lower.includes('camc') ||
      lower.includes('amc') ||
      lower.includes('fms') ||
      lower.includes('warranty period') ||
      lower.includes('penalty for delay')
    ) {
      detectedSections.push(TENDER_SECTION_TYPES.SLA);
    }

    // BoQ / SOR
    if (
      lower.includes('bill of quantities') ||
      lower.includes('boq') ||
      lower.includes('schedule of rates') ||
      lower.includes('sor') ||
      lower.includes('price bid') ||
      lower.includes('schedule of items') ||
      lower.includes('financial bid')
    ) {
      detectedSections.push(TENDER_SECTION_TYPES.BOQ);
    }

    // Critical Mandates
    if (
      lower.includes('make in india') ||
      lower.includes('local content') ||
      lower.includes('stqc') ||
      lower.includes('meity') ||
      lower.includes('cybersecurity') ||
      lower.includes('land border') ||
      lower.includes('restriction on procurement') ||
      lower.includes('class-i local supplier') ||
      lower.includes('bis crs')
    ) {
      detectedSections.push(TENDER_SECTION_TYPES.CRITICAL);
    }

    // Corrigendum
    if (
      lower.includes('corrigendum') ||
      lower.includes('addendum') ||
      lower.includes('amendment') ||
      lower.includes('pre-bid clarification') ||
      lower.includes('revised schedule') ||
      lower.includes('extension of bid')
    ) {
      detectedSections.push(TENDER_SECTION_TYPES.CORRIGENDUM);
    }

    return {
      ...page,
      sections: detectedSections.length > 0 ? detectedSections : [TENDER_SECTION_TYPES.IFB]
    };
  });
}

/**
 * Searches the page map for relevant pages matching specific keywords or section types.
 * @param {Array<object>} enrichedPageMap
 * @param {string[]} keywords
 * @param {string[]} [targetSections]
 * @param {number} [maxPages=8]
 * @returns {Array<{ pageNumber: number, documentName: string, snippet: string, matchCount: number }>}
 */
export function retrieveRelevantPages(enrichedPageMap, keywords = [], targetSections = [], maxPages = 8) {
  if (!enrichedPageMap || enrichedPageMap.length === 0) return [];

  const scoredPages = enrichedPageMap.map(page => {
    let score = 0;
    const lower = page.text.toLowerCase();
    const matchedKeywords = [];

    keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (lower.includes(kwLower)) {
        score += 3;
        matchedKeywords.push(kw);
      }
    });

    if (targetSections && targetSections.length > 0) {
      targetSections.forEach(sec => {
        if (page.sections && page.sections.includes(sec)) {
          score += 5;
        }
      });
    }

    // Extract best representative snippet around the first matching keyword
    let snippet = '';
    if (matchedKeywords.length > 0) {
      const firstIndex = lower.indexOf(matchedKeywords[0].toLowerCase());
      const start = Math.max(0, firstIndex - 120);
      const end = Math.min(page.text.length, firstIndex + 380);
      snippet = (start > 0 ? '...' : '') + page.text.substring(start, end).replace(/\s+/g, ' ').trim() + (end < page.text.length ? '...' : '');
    } else {
      snippet = page.text.substring(0, 350).replace(/\s+/g, ' ').trim() + '...';
    }

    return {
      pageNumber: page.pageNumber,
      documentName: page.documentName,
      score,
      matchedKeywords,
      snippet,
      text: page.text
    };
  });

  return scoredPages
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPages);
}

/**
 * Finds exact supporting snippet and clause provenance for a key phrase in the page map.
 * @param {Array<object>} enrichedPageMap
 * @param {RegExp|string} query
 * @returns {{ documentName: string, pageNumber: number, section: string, clauseNo: string, snippet: string }|null}
 */
export function findSourceEvidence(enrichedPageMap, query) {
  if (!enrichedPageMap || enrichedPageMap.length === 0) return null;

  for (const page of enrichedPageMap) {
    let matchIndex = -1;
    let matchLen = 0;

    if (typeof query === 'string') {
      matchIndex = page.text.toLowerCase().indexOf(query.toLowerCase());
      matchLen = query.length;
    } else if (query instanceof RegExp) {
      const m = page.text.match(query);
      if (m) {
        matchIndex = m.index;
        matchLen = m[0].length;
      }
    }

    if (matchIndex !== -1) {
      // Find surrounding paragraph / clause
      const start = Math.max(0, matchIndex - 100);
      const end = Math.min(page.text.length, matchIndex + matchLen + 200);
      const snippet = page.text.substring(start, end).replace(/\s+/g, ' ').trim();

      // Detect clause number nearby (e.g. Clause 2.1, Section B, Item 4.0)
      const surroundingText = page.text.substring(Math.max(0, matchIndex - 250), matchIndex + 50);
      const clauseMatch = surroundingText.match(/(?:Clause|Section|Item|Para|Art\.?)\s*[:\-\–]?\s*([0-9]+(?:\.[0-9]+)*|[A-Z](?:\.[0-9]+)*)/i);
      const clauseNo = clauseMatch ? clauseMatch[0].trim() : 'General Terms';

      const section = (page.sections && page.sections[0]) ? page.sections[0] : TENDER_SECTION_TYPES.IFB;

      return {
        documentName: page.documentName,
        pageNumber: page.pageNumber,
        section,
        clauseNo,
        snippet: (start > 0 ? '...' : '') + snippet + (end < page.text.length ? '...' : '')
      };
    }
  }

  return null;
}

/**
 * Interactive Q&A Search inside the Tender Package
 * Returns grounded answers with source page references and supporting snippets.
 * @param {string} userQuery
 * @param {Array<object>} enrichedPageMap
 * @returns {{ answer: string, sources: Array<{ pageNumber: number, documentName: string, section: string, snippet: string }> }}
 */
export function searchTenderPackage(userQuery, enrichedPageMap) {
  if (!userQuery || !userQuery.trim() || !enrichedPageMap || enrichedPageMap.length === 0) {
    return {
      answer: 'Please enter a search query to search within the tender document package.',
      sources: []
    };
  }

  const queryTerms = userQuery
    .toLowerCase()
    .replace(/[?.,!]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2 && !['what', 'when', 'where', 'show', 'tell', 'which', 'give', 'the', 'for', 'and', 'are'].includes(t));

  const matchingPages = retrieveRelevantPages(enrichedPageMap, queryTerms, [], 4);

  if (matchingPages.length === 0) {
    return {
      answer: `No explicit clauses matching "${userQuery}" were found in the uploaded tender documents. (Strict Zero-Hallucination Policy)`,
      sources: []
    };
  }

  const sources = matchingPages.map(p => {
    const pageObj = enrichedPageMap.find(ep => ep.pageNumber === p.pageNumber);
    return {
      pageNumber: p.pageNumber,
      documentName: p.documentName,
      section: (pageObj && pageObj.sections) ? pageObj.sections[0] : 'Tender Clause',
      snippet: p.snippet
    };
  });

  return {
    answer: `Found ${matchingPages.length} relevant sections in the tender package regarding "${userQuery}". Review the verified source citations below.`,
    sources
  };
}
