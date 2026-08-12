/**
 * Generates a professional, personalized B2B email on behalf of Brihaspathi Technologies Limited.
 * Dynamically maps the OEM's domain to Brihaspathi's relevant service pillars.
 */

const getRelevantBrihaspathiServices = (domain, products) => {
  const d = (domain || '').toLowerCase();
  const p = (products || '').toLowerCase();
  const combined = d + ' ' + p;

  if (combined.includes('cctv') || combined.includes('camera') || combined.includes('surveillance') || combined.includes('stqc')) {
    return 'CCTV Surveillance Solutions, IP Camera Solutions, Video Management Systems, and AI-based Video Analytics';
  }
  if (combined.includes('solar') || combined.includes('energy')) {
    return 'Rooftop Solar Solutions, Solar Pump Solutions, and comprehensive Solar EPC Project Implementation';
  }
  if (combined.includes('iot') || combined.includes('sensor')) {
    return 'IoT Devices & Sensors, Smart Monitoring Solutions, GPS Tracking, and Integrated IoT Dashboards';
  }
  if (combined.includes('software') || combined.includes('display') || combined.includes('digital')) {
    return 'Custom Software Development, System Integration, Digital Transformation, and Cloud-based Solutions';
  }
  if (combined.includes('biometric') || combined.includes('access') || combined.includes('face')) {
    return 'Biometric Attendance Systems, Access Control Systems, and Workforce Monitoring Solutions';
  }
  if (combined.includes('smart') || combined.includes('infrastructure')) {
    return 'Smart City Solutions, Integrated Command & Control Centres, and Public Safety Solutions';
  }
  
  // Default fallback
  return 'System Integration, Customized Technology Solutions, and Smart Infrastructure Projects';
};

const getCollaborationFocus = (domain, products) => {
  const d = (domain || '').toLowerCase();
  const p = (products || '').toLowerCase();
  const combined = d + ' ' + p;

  if (combined.includes('software') || combined.includes('platform')) {
    return 'technology partnerships, API integrations, and incorporating your platforms into our digital solutions';
  }
  if (combined.includes('cctv') || combined.includes('solar') || combined.includes('hardware')) {
    return 'OEM collaboration, long-term product sourcing, and potential dealer/distributor opportunities for our upcoming projects';
  }

  return 'technology partnerships, project-based procurement, and system integration opportunities';
};

const getSubjectLine = (oemName, domain) => {
  const subjects = [
    `Business Collaboration & Product Requirement – Brihaspathi Technologies Limited`,
    `OEM Partnership & Product Requirement Discussion – Brihaspathi Technologies Limited`,
    `Requirement for ${domain || 'Technology'} Solutions – Brihaspathi Technologies Limited`,
    `Business Opportunity & Technology Collaboration – Brihaspathi Technologies Limited`
  ];
  return subjects[Math.floor(Math.random() * subjects.length)];
};

export const generateProfessionalEmail = (oem, requirement) => {
  const companyName = oem?.name || 'OEM Team';
  const contactPerson = oem?.contactPerson && oem.contactPerson !== 'N/A' ? oem.contactPerson : '';
  const domain = oem?.domain || 'Technology Products';
  const products = oem?.products || '';

  const greeting = contactPerson ? `Dear ${contactPerson},` : `Dear ${companyName} Team,`;
  const subject = getSubjectLine(companyName, domain);

  const brihaspathiServices = getRelevantBrihaspathiServices(domain, products);
  const collaborationFocus = getCollaborationFocus(domain, products);

  // Fallback requirement if user leaves it blank
  const actualRequirement = requirement?.trim() 
    ? requirement.trim() 
    : `products from your portfolio, specifically within the ${domain} category`;

  const body = `${greeting}

We are writing to you from Brihaspathi Technologies Limited, a premier technology and systems integration company. We specialize in providing comprehensive solutions across multiple domains, with a strong focus on ${brihaspathiServices}.

We are currently evaluating reliable OEMs and manufacturers for our upcoming requirements. Based on your company's product portfolio and expertise in ${domain}, we believe there is a strong opportunity for a mutually beneficial collaboration.

Current Requirement:
We have an immediate requirement regarding:
${actualRequirement}

To help us evaluate this requirement and explore a long-term business association, we kindly request you to share the following information at your earliest convenience:
• Technical datasheets and product specifications for the relevant models
• Commercial quotation / pricing details
• Product certifications, compliance documents, and warranty terms
• Lead time and MOQ requirements
• Terms for OEM authorization or dealer/distributor partnerships

We are highly interested in exploring ${collaborationFocus} with ${companyName}. 

We would appreciate it if you could share the relevant details for our evaluation. We look forward to discussing this requirement further and exploring a long-term business association.

Looking forward to your prompt response.

Regards,

Procurement & Vendor Relations
Brihaspathi Technologies Limited
Technology Solutions | System Integration | Smart Infrastructure
Web: www.brihaspathi.com`;

  return { subject, body };
};
