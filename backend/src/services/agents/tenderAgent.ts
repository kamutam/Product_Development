import { aiService } from '../ai/aiService';

export interface GroundedEvidence {
  documentName: string;
  pageNumber: number;
  section: string;
  clauseNo?: string;
  snippet: string;
}

export interface StatutoryPointResult {
  value: string;
  sourceEvidence: GroundedEvidence;
  confidence: number;
}

export class TenderAgent {
  static async extract14PointsFromPages(pageMap: Array<{ pageNumber: number; text: string; section?: string }>) {
    // Select most relevant pages for statutory fields
    const contextSnippet = pageMap
      .filter((p) => p.pageNumber <= 30 || p.section?.includes('Commercial') || p.section?.includes('IFB'))
      .map((p) => `[PAGE ${p.pageNumber} (${p.section || 'General'})]: ${p.text.substring(0, 1500)}`)
      .join('\n\n');

    const prompt = `You are the Principal Tender Intelligence Agent for Brihaspathi Technologies.
Read the statutory tender package text below and extract the 14 mandatory fields with EXACT evidence citations.

TENDER TEXT:
${contextSnippet.substring(0, 40000)}

Extract:
1. Tender Number & GeM Bid ID
2. Project Title / Name
3. Organization Name / Procuring Entity
4. EMD Mode & Value (if unmentioned, return "N/A – MSME Exempted")
5. Processing Fee
6. Pre-Bid Meeting Date & Time
7. Transaction Fee
8. Consignee & Delivery Address
9. Eligibility (Pre-Qualification PQ Turnover & Technical Qualification TQ STQC/MAF)
10. Warranty Terms (Duration & CAMC)
11. Payment Terms & Milestones
12. Work Completion Timeline
13. SLA Terms & Penalty
14. Scope of Work (SOW)`;

    return aiService.structuredExtraction(prompt);
  }

  static async searchTenderPackage(query: string, pageMap: Array<{ pageNumber: number; text: string; section?: string }>) {
    const qLower = query.toLowerCase();
    const matches = pageMap
      .filter(p => p.text.toLowerCase().includes(qLower))
      .slice(0, 5)
      .map(p => ({
        documentName: 'Tender Package Document',
        pageNumber: p.pageNumber,
        section: p.section || 'Tender Clause',
        snippet: p.text.substring(0, 300)
      }));

    return {
      query,
      answer: `Found ${matches.length} grounded citations matching "${query}" in the tender document package.`,
      sources: matches
    };
  }
}
