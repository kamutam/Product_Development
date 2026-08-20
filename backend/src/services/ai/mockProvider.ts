import { AIProvider, AIServiceOptions } from './aiProvider';

export class MockDevProvider implements AIProvider {
  name = 'Development Fallback AI Provider';

  async generateText(prompt: string, options?: AIServiceOptions): Promise<string> {
    return `[Mock AI Response for Product Development Platform]: Analysis for prompt "${prompt.substring(0, 60)}..." completed. All STQC, ARAI, and BoQ requirements evaluated successfully.`;
  }

  async generateStructuredJSON<T = any>(prompt: string, schemaDescription?: string): Promise<T> {
    if (prompt.includes('14-point') || prompt.includes('Tender')) {
      return {
        point1_tenderNumber: 'GAIL/NDA26028VK/C&P/SECURITY',
        point2_name: 'Turnkey CCTV & Security Surveillance System Implementation',
        point3_orgName: 'GAIL (India) Limited',
        point4_emdModeAndValue: '₹4,95,000 / BG / RTGS (MSME Exempted)',
        point5_processingFee: 'N/A (Free Download on GeM Portal)',
        point6_preBidMeeting: '19.08.2026 at 15:00 hrs',
        point7_transactionFee: 'N/A (As per GeM Portal Slabs)',
        point8_address: 'GAIL (India) Limited, Project Site, Noida',
        point9_eligibility: 'Turnover min ₹126 Lakhs + STQC MeiTY TAC Mandate',
        point10_warranty: '36 Months Comprehensive On-site OEM Warranty',
        point11_paymentTerms: '60% Supply, 20% Install, 20% Final SAT; Bill paid in 15 days',
        point12_workCompletionTime: '90 Calendar Days from LoA',
        point13_slaTerms: '99.5% Uptime SLA; Max 4-Hour MTTR; ₹500/day penalty',
        point14_scopeOfWork: 'Turnkey Supply, Installation, Testing & Commissioning'
      } as unknown as T;
    }

    return {
      status: 'SUCCESS',
      summary: 'Automated hardware homologation and specification analysis completed.',
      complianceScore: 98.5
    } as unknown as T;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return new Array(768).fill(0).map(() => Math.random());
  }
}
