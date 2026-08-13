/**
 * Generates a professional, personalized B2B email on behalf of Brihaspathi Technologies Limited.
 * Dynamically maps the OEM's domain & requirement category to Brihaspathi's relevant service pillars.
 */

const getRelevantBrihaspathiServices = (domain, products, reqCategory) => {
  const combined = `${domain || ''} ${products || ''} ${reqCategory || ''}`.toLowerCase();

  if (combined.includes('cctv') || combined.includes('camera') || combined.includes('surveillance') || combined.includes('stqc') || combined.includes('onvif')) {
    return 'CCTV Surveillance Solutions, IP Camera Systems, Video Management Systems, and AI Video Analytics';
  }
  if (combined.includes('solar') || combined.includes('energy') || combined.includes('power')) {
    return 'Rooftop Solar Solutions, Solar Pump Systems, and Comprehensive Solar EPC Project Implementation';
  }
  if (combined.includes('iot') || combined.includes('sensor') || combined.includes('rf') || combined.includes('pole')) {
    return 'IoT Devices & Sensors, Smart Monitoring Solutions, GPS Tracking, and Integrated IoT Dashboards';
  }
  if (combined.includes('software') || combined.includes('display') || combined.includes('digital') || combined.includes('cloud')) {
    return 'Custom Software Development, System Integration, Digital Transformation, and Cloud-based Platforms';
  }
  if (combined.includes('biometric') || combined.includes('access') || combined.includes('attendance')) {
    return 'Biometric Attendance Systems, Access Control Systems, and Enterprise Security Management';
  }
  if (combined.includes('smart') || combined.includes('infrastructure') || combined.includes('city')) {
    return 'Smart City Infrastructure, Integrated Command & Control Centres (ICCC), and Public Safety Solutions';
  }
  
  return 'System Integration, Customized Technology Solutions, and Enterprise Infrastructure Projects';
};

const getCollaborationFocus = (domain, products, reqCategory) => {
  const combined = `${domain || ''} ${products || ''} ${reqCategory || ''}`.toLowerCase();

  if (combined.includes('software') || combined.includes('platform')) {
    return 'technology partnerships, API integrations, and incorporating your software platforms into our enterprise solutions';
  }
  if (combined.includes('cctv') || combined.includes('solar') || combined.includes('hardware') || combined.includes('pole')) {
    return 'OEM collaboration, long-term product sourcing, and potential dealer/distributor opportunities for our upcoming projects';
  }

  return 'technology partnerships, project-based procurement, and system integration opportunities';
};

export const generateProfessionalEmail = (oem, reqData) => {
  const companyName = oem?.name || 'OEM Team';
  const contactPerson = oem?.contactPerson && oem.contactPerson !== 'N/A' ? oem.contactPerson : '';
  const domain = oem?.domain || 'Technology Products';
  const products = oem?.products || '';

  // Support both plain text string requirement or structured requirement object
  const isStructured = typeof reqData === 'object' && reqData !== null;
  
  const title = isStructured ? (reqData.title || reqData.requirementTitle || '') : (typeof reqData === 'string' ? reqData : '');
  const solution = isStructured ? (reqData.solution || reqData.productRequired || '') : '';
  const category = isStructured ? (reqData.category || reqData.productCategory || '') : '';
  const techSpecs = isStructured ? (reqData.techSpecs || reqData.technicalRequirements || '') : '';
  const quantity = isStructured ? (reqData.quantity || reqData.qty || '') : '';
  const application = isStructured ? (reqData.application || reqData.project || '') : '';
  const certs = isStructured ? (reqData.requiredCertifications || reqData.certifications || '') : '';
  const location = isStructured ? (reqData.deliveryLocation || reqData.location || '') : '';
  const timeline = isStructured ? (reqData.timeline || reqData.expectedTimeline || '') : '';
  const additional = isStructured ? (reqData.additionalRequirements || reqData.notes || '') : '';

  const subject = title 
    ? `Business Requirement: ${title} – Brihaspathi Technologies Limited`
    : `Business Requirement & OEM Partnership Enquiry – Brihaspathi Technologies Limited`;

  const greeting = contactPerson ? `Dear ${contactPerson},` : `Dear ${companyName} Team,`;
  const brihaspathiServices = getRelevantBrihaspathiServices(domain, products, category || title);
  const collaborationFocus = getCollaborationFocus(domain, products, category || title);

  let reqSection = '';
  if (isStructured && (title || solution || techSpecs || quantity || application || certs || location || timeline)) {
    const lines = [];
    if (title) lines.push(`• Requirement Title: ${title}`);
    if (solution) lines.push(`• Product / Solution Required: ${solution}`);
    if (category) lines.push(`• Product Category: ${category}`);
    if (techSpecs) lines.push(`• Technical Specifications: ${techSpecs}`);
    if (quantity) lines.push(`• Quantity Required: ${quantity}`);
    if (application) lines.push(`• Application / Project: ${application}`);
    if (certs) lines.push(`• Required Certifications / Compliance: ${certs}`);
    if (location) lines.push(`• Delivery Location: ${location}`);
    if (timeline) lines.push(`• Expected Timeline: ${timeline}`);
    if (additional) lines.push(`• Additional Requirements: ${additional}`);
    reqSection = lines.join('\n');
  } else if (title) {
    reqSection = `• Requirement Details: ${title}`;
  } else {
    reqSection = `• Requirement Details: High-performance products from your portfolio within the ${domain} category.`;
  }

  const body = `${greeting}

We are writing to you from Brihaspathi Technologies Limited, a premier technology and systems integration enterprise. We specialize in providing end-to-end technology solutions across multiple domains, with a primary focus on ${brihaspathiServices}.

We are currently evaluating reliable OEMs and manufacturing partners for an upcoming project requirement. Based on your company's product portfolio and established expertise in ${domain}, we believe there is a strong opportunity for a mutually beneficial collaboration.

PROJECT REQUIREMENT DETAILS:
${reqSection}

INFORMATION REQUESTED:
To help us evaluate this requirement and proceed with technical onboarding, we kindly request you to share the following at your earliest convenience:
1. Comprehensive technical datasheets and product specification brochures
2. Product compliance certificates (e.g. STQC, ARAI, ONVIF, CE/FCC where applicable)
3. Commercial quotation / unit pricing details
4. Minimum Order Quantity (MOQ) and standard delivery lead times
5. Standard warranty terms and post-sales technical support details
6. Customization options for project-specific needs (if applicable)

We are highly interested in exploring ${collaborationFocus} with ${companyName}.

We would appreciate it if you could share the relevant documentation and commercial proposal at your earliest convenience. Our procurement team is available to schedule a technical discussion call if required.

Looking forward to your prompt response.

Best regards,

Procurement & OEM Relations Division
Brihaspathi Technologies Limited
Enterprise Technology Solutions | System Integration | Smart Infrastructure
Web: www.brihaspathi.com
Email: procurement@brihaspathi.com`;

  return { subject, body };
};
