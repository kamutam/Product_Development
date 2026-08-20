import { aiService } from '../ai/aiService';

export class ProductAgent {
  static async evaluateCompliance(productSpecs: any, requiredSpecs: any) {
    const prompt = `You are the Lead Product Homologation Engineer at Brihaspathi Technologies.
Compare Candidate Product Specs against Mandatory Project Specifications:

CANDIDATE PRODUCT:
${JSON.stringify(productSpecs, null, 2)}

MANDATORY TENDER / PO SPECIFICATIONS:
${JSON.stringify(requiredSpecs, null, 2)}

Provide compliance status (ACCEPTED, CONDITIONAL, REJECTED), compliance score (0-100), passed features, and gap analysis.`;

    return aiService.structuredExtraction(prompt, '{ complianceStatus: string, complianceScore: number, passedClauses: string[], gaps: string[] }');
  }

  static async generateProductIdeaRoadmap(ideaTitle: string, marketCategory: string) {
    const prompt = `Create an engineering roadmap and feature specification for a new hardware product:
Title: ${ideaTitle}
Category: ${marketCategory}

Provide MVP features, STQC/ARAI regulatory requirements, estimated BoQ BOM cost, and 4 phase delivery milestones.`;

    return aiService.structuredExtraction(prompt);
  }
}
