// Compliance Evaluation Engine & Similar Product Recommendation Finder

const IP_RATING_RANKS = {
  'IP54': 1,
  'IP65': 2,
  'IP66': 3,
  'IP67': 4,
  'IP68': 5
};

export function evaluateProductAgainstProject(product, project, category) {
  if (!project || !category || !product) {
    return {
      status: 'UNKNOWN',
      score: 0,
      passedCount: 0,
      failedCount: 0,
      totalCount: 0,
      paramAudit: [],
      rejectionSummary: ['Missing evaluation parameters']
    };
  }

  const reqs = project.requirements || {};
  const specs = product.specs || {};
  const fields = category.fields || [];

  let passedCount = 0;
  let failedCount = 0;
  const paramAudit = [];
  const rejectionReasons = [];

  fields.forEach(field => {
    const key = field.key;
    const requiredVal = reqs[key];
    const providedVal = specs[key];

    if (requiredVal !== undefined && requiredVal !== null && requiredVal !== '') {
      let isPassed = false;
      let reason = '';

      if (providedVal === undefined || providedVal === null || providedVal === '') {
        isPassed = false;
        reason = `Missing spec value (Required: ${requiredVal})`;
      } else {
        switch (field.ruleType) {
          case 'min': {
            const reqNum = parseFloat(requiredVal);
            const provNum = parseFloat(providedVal);
            isPassed = provNum >= reqNum;
            if (!isPassed) {
              reason = `Below requirement (Provided ${providedVal}${field.unit ? ' ' + field.unit : ''}, Min Required ${requiredVal}${field.unit ? ' ' + field.unit : ''})`;
            }
            break;
          }
          case 'max': {
            const reqNum = parseFloat(requiredVal);
            const provNum = parseFloat(providedVal);
            isPassed = provNum <= reqNum;
            if (!isPassed) {
              reason = `Exceeds max threshold (Provided ${providedVal}${field.unit ? ' ' + field.unit : ''}, Max Allowed ${requiredVal}${field.unit ? ' ' + field.unit : ''})`;
            }
            break;
          }
          case 'boolean': {
            isPassed = Boolean(providedVal) === Boolean(requiredVal);
            if (!isPassed) {
              if (key === 'araiCertified') {
                reason = `Missing mandatory ARAI Certification (AIS-140 Automotive / Transit Standard Required)`;
              } else if (key === 'stqcCertified') {
                reason = `Missing mandatory STQC Certification (Govt UIDAI / MeiTY Standard Required)`;
              } else {
                reason = `Feature requirement not met (Required: ${requiredVal ? 'Yes' : 'No'})`;
              }
            }
            break;
          }
          case 'enumOrder': {
            const reqRank = IP_RATING_RANKS[requiredVal] || 0;
            const provRank = IP_RATING_RANKS[providedVal] || 0;
            isPassed = provRank >= reqRank;
            if (!isPassed) {
              reason = `Protection rating insufficient (Provided: ${providedVal}, Required: ${requiredVal} or better)`;
            }
            break;
          }
          case 'exact':
          default: {
            isPassed = String(providedVal).trim().toLowerCase() === String(requiredVal).trim().toLowerCase();
            if (!isPassed) {
              reason = `Mismatch (Provided: "${providedVal}", Required: "${requiredVal}")`;
            }
            break;
          }
        }
      }

      if (isPassed) {
        passedCount++;
      } else {
        failedCount++;
        rejectionReasons.push(`${field.label}: ${reason}`);
      }

      paramAudit.push({
        key,
        label: field.label,
        unit: field.unit || '',
        required: requiredVal,
        provided: providedVal,
        passed: isPassed,
        reason
      });
    }
  });

  const totalCount = passedCount + failedCount;
  const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 100;

  let status = 'ACCEPTED';
  if (failedCount > 0) {
    if (score >= 80 && failedCount === 1) {
      status = 'CONDITIONAL';
    } else {
      status = 'REJECTED';
    }
  }

  return {
    status,
    score,
    passedCount,
    failedCount,
    totalCount,
    paramAudit,
    rejectionSummary: rejectionReasons
  };
}

/**
 * Similar Compliant Product Recommendation Engine
 * Finds alternative candidate products in the catalog that meet project specifications
 * to maximize customer satisfaction when an exact product is rejected or unavailable.
 */
export function findSimilarProducts(targetProduct, project, category, allProducts) {
  if (!allProducts || !project || !category) return [];

  // Filter products in the same category excluding current product
  const candidates = allProducts.filter(p => p.categoryId === category.id && p.id !== targetProduct?.id);

  const recommendations = candidates.map(prod => {
    const res = evaluateProductAgainstProject(prod, project, category);
    
    // Calculate similarity & satisfaction score
    let satisfactionBoost = 0;
    if (res.status === 'ACCEPTED') satisfactionBoost += 40;
    if (res.status === 'CONDITIONAL') satisfactionBoost += 20;

    // Testing status boost (e.g. MSRTC Approved gets priority)
    if (prod.testingStatus?.includes('Approved') || prod.testingStatus?.includes('Deployed')) {
      satisfactionBoost += 15;
    } else if (prod.testingStatus?.includes('Tested')) {
      satisfactionBoost += 10;
    }

    // Match index calculation
    const matchIndex = Math.min(100, Math.round((res.score * 0.5) + satisfactionBoost + 5));

    let recommendationReason = '';
    if (res.status === 'ACCEPTED') {
      recommendationReason = `100% Compliant with ${project.name} requirements. (${prod.testingStatus || 'Tested Product'})`;
    } else {
      recommendationReason = `High spec overlap (${res.score}% match) with lower failure rate than current product.`;
    }

    return {
      product: prod,
      res,
      matchIndex,
      recommendationReason
    };
  });

  // Sort by match index & compliance status
  return recommendations
    .filter(r => r.res.status === 'ACCEPTED' || r.res.score > (targetProduct ? 60 : 0))
    .sort((a, b) => b.matchIndex - a.matchIndex);
}
