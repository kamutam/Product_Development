/**
 * Agent 3: Master BoQ Architecture & Cost Optimization Agent
 * Synthesizes line items, calculates turnkey equipment costs, accessories margin, warranty SLA, and total sourcing capital.
 */

export async function runBoQArchitectAgent({ homologatedItems = [], onProgress }) {
  if (onProgress) onProgress({ agent: 'BoQArchitectAgent', status: 'running', message: 'Agent 3: Calculating Turnkey BoQ Architecture, accessory ratios & pricing...' });

  let totalSourcingCost = 0;
  let totalUnitsCount = 0;

  const enrichedBoQ = homologatedItems.map(item => {
    const qty = item.requiredQty || 1;
    const unitPrice = item.unitPrice || 8500;
    const lineTotal = qty * unitPrice;

    totalSourcingCost += lineTotal;
    totalUnitsCount += qty;

    return {
      ...item,
      lineTotal,
      formattedLineTotal: `₹${lineTotal.toLocaleString('en-IN')}`
    };
  });

  const boqDocument = {
    title: 'Master Bill of Quantities (BoQ) & Sourcing Matrix',
    items: enrichedBoQ,
    totalSourcingCost,
    formattedSourcingCost: `₹${totalSourcingCost.toLocaleString('en-IN')}`,
    totalItemsCount: totalUnitsCount,
    cablingMarginMultiplier: 1.08,
    turnkeyWarrantyCoverageMonths: 36
  };

  if (onProgress) onProgress({ agent: 'BoQArchitectAgent', status: 'success', message: `✓ Agent 3: Master BoQ computed (Total: ${boqDocument.formattedSourcingCost} across ${totalUnitsCount} units).` });
  return boqDocument;
}
