/**
 * Multi-Agent Orchestrator Pipeline
 * Coordinates the 5 specialized AI Agents:
 * - Agent 1: Multimodal Ingestion & Grounding Agent
 * - Agent 2: Neural Specification Homologation Agent
 * - Agent 3: Master BoQ Architecture & Cost Optimizer Agent
 * - Agent 4: ATC & Statutory Compliance Auditor Agent
 * - Agent 5: Automated OEM RFQ & MAF Dispatch Agent
 */

import { runIngestionAgent } from './ingestionAgent';
import { runHomologationAgent } from './homologationAgent';
import { runBoQArchitectAgent } from './boqArchitectAgent';
import { runATCAuditorAgent } from './atcAuditorAgent';
import { runOEMDispatchAgent } from './oemDispatchAgent';
import { runTenderIntelligenceExtraction } from './tenderIntelligenceEngine';

export async function runMultiAgentPipeline({
  apiKey,
  fileName,
  fileText,
  availableProducts = [],
  oemList = [],
  onProgress = () => {}
}) {
  onProgress({ agent: 'Orchestrator', status: 'running', message: '🚀 Multi-Agent Tender Intelligence Pipeline Initialized...' });

  // 1. Run Grounded Tender Intelligence Engine
  const intelligenceDossier = await runTenderIntelligenceExtraction({
    apiKey,
    fileName,
    fileText,
    availableProducts,
    onProgress
  });

  // 2. Run Agent 1: Ingestion & Document Decomposition
  const metadata = await runIngestionAgent({ apiKey, fileName, fileText, onProgress });
  await new Promise(r => setTimeout(r, 150));

  // 3. Run Agent 2: Neural Specification Homologation
  const homologatedItems = await runHomologationAgent({ fileText, availableProducts, onProgress });
  await new Promise(r => setTimeout(r, 150));

  // 4. Run Agent 3: BoQ Architecture & Sourcing Optimizer
  const boqDocument = await runBoQArchitectAgent({ homologatedItems, onProgress });
  await new Promise(r => setTimeout(r, 150));

  // 5. Run Agent 4: ATC & Statutory Compliance Auditor
  const atcDocument = await runATCAuditorAgent({ fileText, metadata, onProgress });
  await new Promise(r => setTimeout(r, 150));

  // 6. Run Agent 5: Automated OEM RFQ Dispatch Formulator
  const oemInquiries = await runOEMDispatchAgent({ tenderMetadata: metadata, boqDocument, oemList, onProgress });

  // Synthesize Master Dossier with Grounded Provenance
  const compiledDossier = {
    ...intelligenceDossier,
    dossierSummary: {
      ...intelligenceDossier.dossierSummary,
      organisationName: intelligenceDossier.statutory14Points.point3_orgName || metadata.organisationName,
      tenderName: intelligenceDossier.statutory14Points.point2_tenderName || metadata.tenderName,
      tenderRefNo: intelligenceDossier.statutory14Points.point1_tenderNumber || metadata.tenderRefNo,
      gemId: intelligenceDossier.statutory14Points.point1_gemBidNo || metadata.gemId,
      preBidMeetingDate: intelligenceDossier.statutory14Points.point6_preBidMeeting || metadata.preBidMeetingDate
    },
    gemDocument: {
      ...intelligenceDossier.gemDocument,
      gemId: intelligenceDossier.statutory14Points.point1_gemBidNo || metadata.gemId,
      tenderRefNo: intelligenceDossier.statutory14Points.point1_tenderNumber || metadata.tenderRefNo,
      organisationName: intelligenceDossier.statutory14Points.point3_orgName || metadata.organisationName,
      emdAmount: intelligenceDossier.statutory14Points.point4_emdModeAndValue || metadata.emdAmount,
      preBidMeetingDate: intelligenceDossier.statutory14Points.point6_preBidMeeting || metadata.preBidMeetingDate
    },
    specificationDocument: {
      title: 'Technical Specifications & Homologation Schedule',
      extractedSpecs: homologatedItems.map(h => ({
        id: h.requirementId,
        item: h.requirementName,
        specs: h.matchedClauses.map(c => `${c.clause}: ${c.matched}`).join('; '),
        qty: h.requiredQty
      })),
      technicalClauses: homologatedItems.flatMap(h => h.matchedClauses)
    },
    boqDocument,
    atcDocument,
    oemInquiries,
    bom: boqDocument.items,
    statutory14Points: intelligenceDossier.statutory14Points
  };

  onProgress({ agent: 'Orchestrator', status: 'success', message: '✓ Multi-Agent Pipeline Completed: Unified 100% Grounded Tender Dossier Compiled.' });

  return compiledDossier;
}
