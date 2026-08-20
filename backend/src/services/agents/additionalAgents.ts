import { aiService } from '../ai/aiService';

export class CompetitorAgent {
  static async analyzeCompetitor(competitorName: string, ourProducts: any[], competitorProducts: any[]) {
    const prompt = `Perform SWOT and Technical Comparison between Brihaspathi Technologies and ${competitorName}:
Our Products: ${JSON.stringify(ourProducts)}
Competitor Products: ${JSON.stringify(competitorProducts)}

Provide SWOT analysis, pricing comparison, technical advantages, and market positioning strategy.`;
    return aiService.structuredExtraction(prompt);
  }
}

export class VendorAgent {
  static async generateOEMDispatchEmail(oemName: string, requirementTitle: string, techSpecs: string, quantity: string) {
    const prompt = `Compose a formal B2B Procurement Request for Quotation (RFQ) letter:
To OEM: ${oemName}
Product Requirement: ${requirementTitle}
Technical Specs: ${techSpecs}
Required Quantity: ${quantity}
Company: Brihaspathi Technologies Limited

Provide subject and structured email body.`;
    return aiService.structuredExtraction(prompt, '{ subject: string, body: string }');
  }
}

export class DocumentAgent {
  static async summarizeDocument(docText: string, docType: string) {
    const prompt = `Analyze and summarize this ${docType} document for technical product development and tender compliance:
${docText.substring(0, 15000)}

Extract key technical parameters, mandatory certifications, commercial pricing terms, and execution conditions.`;
    return aiService.structuredExtraction(prompt);
  }
}

export class ReportAgent {
  static async compileManagementReport(reportType: string, dataContext: any) {
    const prompt = `Generate an Executive Intelligence Management Report for ${reportType}:
Context: ${JSON.stringify(dataContext)}

Provide Executive Summary, Key Findings, Risk Assessment, and Strategic Recommendations.`;
    return aiService.structuredExtraction(prompt);
  }
}
