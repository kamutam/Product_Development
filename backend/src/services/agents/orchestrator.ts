import { ProductAgent } from './productAgent';
import { TenderAgent } from './tenderAgent';
import { CompetitorAgent, VendorAgent, DocumentAgent, ReportAgent } from './additionalAgents';
import { aiService } from '../ai/aiService';
import { logger } from '../../config/logger';

export class AIOrchestrator {
  static async processUserQuery(query: string, contextPayload: any = {}) {
    logger.info(`AI Orchestrator routing query: "${query.substring(0, 50)}..."`);
    const q = query.toLowerCase();

    if (q.includes('tender') || q.includes('gem') || q.includes('rfp') || q.includes('atc')) {
      if (contextPayload.pageMap) {
        return TenderAgent.searchTenderPackage(query, contextPayload.pageMap);
      }
      const responseText = await aiService.generateText(`Answer this tender inquiry for Brihaspathi Technologies: ${query}`);
      return { agent: 'TenderAgent', answer: responseText };
    }

    if (q.includes('compliance') || q.includes('spec') || q.includes('evaluate') || q.includes('stqc')) {
      return ProductAgent.evaluateCompliance(contextPayload.candidateSpecs || {}, contextPayload.tenderSpecs || {});
    }

    if (q.includes('competitor') || q.includes('swot') || q.includes('rival')) {
      return CompetitorAgent.analyzeCompetitor(contextPayload.competitorName || 'Market Competitors', [], []);
    }

    if (q.includes('oem') || q.includes('vendor') || q.includes('rfq') || q.includes('supplier')) {
      return VendorAgent.generateOEMDispatchEmail(
        contextPayload.oemName || 'OEM Partner',
        contextPayload.requirementTitle || 'Hardware Component',
        contextPayload.techSpecs || 'Standard Specs',
        contextPayload.quantity || '100 Units'
      );
    }

    // Default conversational AI
    const fallbackAnswer = await aiService.generateText(`You are the Brihaspathi Technologies Product Development & Intelligence AI Assistant. Respond helpfully to: "${query}"`);
    return {
      agent: 'ConversationalAgent',
      answer: fallbackAnswer
    };
  }
}
