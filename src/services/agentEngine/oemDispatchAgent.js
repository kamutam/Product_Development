/**
 * Agent 5: Automated OEM RFQ & MAF Procurement Agent
 * Generates tailored OEM Request for Quotation (RFQ) emails, drafts Manufacturer Authorization Forms (MAF),
 * and prepares dispatch packets.
 */

export async function runOEMDispatchAgent({ tenderMetadata, boqDocument, oemList = [], onProgress }) {
  if (onProgress) onProgress({ agent: 'OEMDispatchAgent', status: 'running', message: 'Agent 5: Formulating OEM RFQ inquiries & MAF Authorization packets...' });

  const generatedInquiries = [];

  const items = boqDocument?.items || [];
  for (const item of items) {
    const oem = oemList.find(o => o.category === item.category) || {
      name: item.matchedProduct?.vendor || 'Aditya Infotech Ltd (CP PLUS)',
      email: 'gov.sales@cpplusworld.com'
    };

    const subject = `Urgent RFQ & MAF Request: ${item.requirementName} — Tender Ref: ${tenderMetadata?.tenderRefNo || 'BTL-TENDER'}`;
    const body = `Dear ${oem.name} Enterprise Team,\n\nBrihaspathi Technologies Limited is preparing a turnkey technical proposal for "${tenderMetadata?.tenderName || 'Government Procurement Schedule'}".\n\nRequirement Details:\n- Item: ${item.requirementName}\n- Quantity: ${item.requiredQty} Units\n- Homologated SKU: ${item.matchedProduct?.sku || 'Standard'}\n- Mandatory: STQC Security TAC Certification & Make-in-India Class-I (>50% Local Content)\n\nPlease provide your best project transfer pricing and a sealed Manufacturer Authorization Form (MAF) addressed to ${tenderMetadata?.organisationName || 'Procuring Authority'}.\n\nWarm regards,\nProduct Development & Homologation Cell\nBrihaspathi Technologies Limited`;

    generatedInquiries.push({
      id: `inquiry-${Date.now()}-${item.requirementId}`,
      oemName: oem.name,
      oemEmail: oem.email,
      requirementName: item.requirementName,
      subject,
      body,
      status: 'Ready for Dispatch'
    });
  }

  if (onProgress) onProgress({ agent: 'OEMDispatchAgent', status: 'success', message: `✓ Agent 5: Formulated ${generatedInquiries.length} automated OEM RFQ & MAF packets.` });
  return generatedInquiries;
}
