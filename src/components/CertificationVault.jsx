import React, { useState } from 'react';
import { Award, Download, ExternalLink, Plus, Search, Filter, ShieldCheck, FileText, ShoppingCart, Trash2, Camera, Layers, CheckCircle2, Sliders } from 'lucide-react';

// Master Individual STQC Certified Models Directory parsed from Official STQC Certificate PDFs & Annexure-A
const INDIVIDUAL_STQC_MODELS = [
  // Certificate #018 (Cp Plus Certificate-018.pdf)
  {
    id: 'stqc-ind-1',
    sku: 'CP-UNC-TE81ZL6C-VMDS-Q',
    name: 'CP Plus 4K Network Bullet Camera 8MP',
    cameraType: '4K Network Bullet Camera',
    resolution: '8 MP (4K Ultra HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #018',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/Cp%20Plus%20Certificate-018.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TE81ZL6C-VMDS-Q.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-te81zl6c-vmds-q/'
  },

  // Certificate #21 signed (CPP Plus Certificate signed-21.pdf) - Annexure A
  {
    id: 'stqc-ind-2',
    sku: 'CP-UNC-VC21L5C-VMD-LQ',
    name: 'CP Plus Vandal Dome Camera 2MP',
    cameraType: 'Vandal Dome Camera',
    resolution: '2 MP (Full HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #21 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-21.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-VC21L5C-VMD-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-vc21l5c-vmd-lq/'
  },
  {
    id: 'stqc-ind-3',
    sku: 'CP-UNC-TC41L5C-VMD-LQ',
    name: 'CP Plus Bullet Camera 4MP',
    cameraType: 'Bullet Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #21 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-21.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TC41L5C-VMD-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-tc41l5c-vmd-lq/'
  },
  {
    id: 'stqc-ind-4',
    sku: 'CP-UNC-VC41L5C-VMD-LQ',
    name: 'CP Plus Dome Camera 4MP',
    cameraType: 'Dome Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #21 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-21.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-VC41L5C-VMD-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-vc41l5c-vmd-lq/'
  },
  {
    id: 'stqc-ind-5',
    sku: 'CP-UNC-TC41ZL6C-VMD-LQ',
    name: 'CP Plus Motorized Zoom Bullet 4MP',
    cameraType: 'Bullet Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #21 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-21.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TC41ZL6C-VMD-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-tc41zl6c-vmd-lq/'
  },
  {
    id: 'stqc-ind-6',
    sku: 'CP-UNC-TC21L5C-VMD-LQ',
    name: 'CP Plus IR Bullet Camera 2MP',
    cameraType: 'Bullet Camera',
    resolution: '2 MP (Full HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #21 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-21.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TC21L5C-VMD-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-tc21l5c-vmd-lq/'
  },
  {
    id: 'stqc-ind-7',
    sku: 'CP-UNC-TA41L3C-D-LQ',
    name: 'CP Plus Compact Bullet 4MP',
    cameraType: 'Bullet Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #21 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-21.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TA41L3C-D-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-ta41l3c-d-lq/'
  },
  {
    id: 'stqc-ind-8',
    sku: 'CP-UNC-TA41L6C-D-Q',
    name: 'CP Plus Long Range Bullet 4MP',
    cameraType: 'Bullet Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #21 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-21.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TA41L6C-D-Q.pdf',
    storeLink: ''
  },
  {
    id: 'stqc-ind-9',
    sku: 'CP-UNC-TA21L3C-LQ',
    name: 'CP Plus Bullet Camera 2MP',
    cameraType: 'Bullet Camera',
    resolution: '2 MP (Full HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #21 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-21.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TA21L3C-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-ta21l3c-lq/'
  },
  {
    id: 'stqc-ind-10',
    sku: 'CP-UNC-DA41L3C-D-LQ',
    name: 'CP Plus Dome Camera 4MP',
    cameraType: 'Dome Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #21 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-21.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-DA41L3C-D-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-da41l3c-d-lq/'
  },

  // Certificate #22 signed (CPP Plus Certificate signed-22.pdf)
  {
    id: 'stqc-ind-11',
    sku: 'CP-UNC-TA21L3B-LQ',
    name: 'CP Plus Bullet Camera 2MP B-Series',
    cameraType: 'Bullet Camera',
    resolution: '2 MP (Full HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #22 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-22.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TA21L3B-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-ta21l3b-lq/'
  },
  {
    id: 'stqc-ind-12',
    sku: 'CP-UNC-DA21L3B-LQ',
    name: 'CP Plus Dome Camera 2MP B-Series',
    cameraType: 'Dome Camera',
    resolution: '2 MP (Full HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #22 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-22.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-DA21L3B-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-da21l3b-lq/'
  },
  {
    id: 'stqc-ind-13',
    sku: 'CP-UNC-DA41L3B-D-LQ',
    name: 'CP Plus Dome Camera 4MP B-Series',
    cameraType: 'Dome Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #22 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-22.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-DA41L3B-D-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-da41l3b-d-lq/'
  },
  {
    id: 'stqc-ind-14',
    sku: 'CP-UNC-TA41L3B-D-LQ',
    name: 'CP Plus Bullet Camera 4MP B-Series',
    cameraType: 'Bullet Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #22 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-22.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TA41L3B-D-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-ta41l3b-d-lq/'
  },
  {
    id: 'stqc-ind-15',
    sku: 'CP-UNC-DA21L3C-Q',
    name: 'CP Plus IR Dome Camera 2MP',
    cameraType: 'Dome Camera',
    resolution: '2 MP (Full HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #22 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-22.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-DA21L3C-Q.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-da21l3c-q-3-6mm/'
  },
  {
    id: 'stqc-ind-16',
    sku: 'CP-UNC-TA21L3C-Q',
    name: 'CP Plus IR Bullet Camera 2MP',
    cameraType: 'Bullet Camera',
    resolution: '2 MP (Full HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #22 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-22.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TA21L3C-Q.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-plus-cp-unc-ta21l3c-q/'
  },
  {
    id: 'stqc-ind-17',
    sku: 'CP-UNC-DA41L3C-D-Q',
    name: 'CP Plus IR Dome Camera 4MP',
    cameraType: 'Dome Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #22 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-22.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-DA41L3C-D-Q.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-plus-cp-unc-da41l3c-d-q/'
  },
  {
    id: 'stqc-ind-18',
    sku: 'CP-UNC-WC41L3C-VMD-LQ',
    name: 'CP Plus Dual Light Wedge Camera 4MP',
    cameraType: 'Dual Light Wedge Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #22 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-22.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-WC41L3C-VMD-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-wc41l3c-vmd-lq/'
  },

  // Certificate #23 signed (CPP Plus Certificate signed-23.pdf)
  {
    id: 'stqc-ind-19',
    sku: 'CP-UNC-TA21L6C-Q',
    name: 'CP Plus Bullet Camera 2MP 60m IR',
    cameraType: 'Bullet Camera',
    resolution: '2 MP (Full HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #23 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-23.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TA21L6C-Q.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-plus-cp-unc-ta21l6c-q/'
  },
  {
    id: 'stqc-ind-20',
    sku: 'CP-UNC-TC81L5CVMD-LQ',
    name: 'CP Plus 8MP Ultra HD Bullet Camera',
    cameraType: 'Bullet Camera',
    resolution: '8 MP (4K Ultra HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #23 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-23.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TC81L5C-VMD-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-tc81l5c-vmd-lq/'
  },
  {
    id: 'stqc-ind-21',
    sku: 'CP-UNC-ME41L3-MDJQ',
    name: 'CP Plus AI Traffic Enforcement Camera 4MP',
    cameraType: 'AI Enforcement Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #23 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-23.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-ME41L3-MDJ-Q.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-vc81l5c-vmd-lq/'
  },
  {
    id: 'stqc-ind-22',
    sku: 'CP-UNC-VC81L5CVMD-LQ',
    name: 'CP Plus Mobile Transit CCTV Camera 8MP',
    cameraType: 'Mobile CCTV Camera',
    resolution: '8 MP (4K Ultra HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #23 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-23.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-VC81L5C-VMD-LQ.pdf',
    storeLink: 'https://fgtechstore.com/product/cp-unc-vc81l5c-vmd-lq/'
  },
  {
    id: 'stqc-ind-23',
    sku: 'CP-UNP-F4521L30-DPQ',
    name: 'CP Plus PTZ Network Speed Dome Camera 2MP',
    cameraType: 'PTZ Speed Dome Camera',
    resolution: '2 MP (Full HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #23 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-23.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNP-F4521L30-DPQ.pdf',
    storeLink: ''
  },
  {
    id: 'stqc-ind-24',
    sku: 'CP-UNC-TT41L3-VMD-Q',
    name: 'CP Plus ANPR Automatic License Plate Camera 4MP',
    cameraType: 'ANPR Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #23 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-23.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-TT41L3-VMD-Q.pdf',
    storeLink: ''
  },
  {
    id: 'stqc-ind-25',
    sku: 'CP-UNC-EE61L2C-VMD-Q',
    name: 'CP Plus 360 Fisheye Panoramic Camera 6MP',
    cameraType: 'Network Fisheye Camera',
    resolution: '6 MP (Super HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #23 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: 'https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-23.pdf',
    datasheetLink: 'https://cpplusworld.com/prodassets/datasheet/CP-UNC-EE61L2C-VMD-Q.pdf',
    storeLink: ''
  },

  // ARAI Certified Products
  {
    id: 'arai-ind-1',
    sku: 'STREAMAX-X3-8CH',
    name: 'Streamax X3-H0801 AI Mobile NVR (MSRTC Grade)',
    cameraType: 'Mobile DVR / NVR',
    resolution: '1080p FHD',
    brandMake: 'Streamax Technology',
    certType: 'ARAI',
    certName: 'ARAI AIS-140 TAC',
    certRef: 'ARAI/AIS-140/TAC/2025-88',
    certLink: 'https://araiindia.com/certificates/AIS140_Streamax_X3.pdf',
    datasheetLink: 'https://streamax.com/datasheet/Streamax_X3_8CH.pdf',
    storeLink: 'https://streamax.com/products/x3-h0801'
  },
  {
    id: 'arai-ind-2',
    sku: 'HOWEN-ME40-8CH',
    name: 'Howen Hero-ME40-08 8CH AI Mobile NVR',
    cameraType: 'Mobile DVR / NVR',
    resolution: '1080p FHD',
    brandMake: 'Howen Technologies',
    certType: 'ARAI',
    certName: 'ARAI AIS-140 TAC',
    certRef: 'ARAI/AIS-140/TAC/2025-92',
    certLink: 'https://araiindia.com/certificates/AIS140_Howen_ME40.pdf',
    datasheetLink: 'https://howentech.com/datasheet/Hero_ME40.pdf',
    storeLink: 'https://howentech.com/products/me40-08'
  },

  // CMMI Certified Products
  {
    id: 'cmmi-ind-1',
    sku: 'BRIH-TELEMATICS-V3',
    name: 'Brihaspathi Smart Transit Telematics & Surveillance Platform',
    cameraType: 'Software / VMS',
    resolution: 'Enterprise System',
    brandMake: 'Brihaspathi Technologies',
    certType: 'CMMI / ISO',
    certName: 'CMMI DEV Level 5',
    certRef: 'CMMI DEV Level 5 / ISO 27001',
    certLink: 'https://brihaspathi.com/certificates/CMMI_Level5_Certificate.pdf',
    datasheetLink: 'https://brihaspathi.com/products/transit-telematics.pdf',
    storeLink: 'https://brihaspathi.com'
  }
];

export default function CertificationVault() {
  const [activeCertTab, setActiveCertTab] = useState('STQC');
  const [certItems, setCertItems] = useState(INDIVIDUAL_STQC_MODELS);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering states
  const [activeTypeFilter, setActiveTypeFilter] = useState('ALL');
  const [activeResolutionFilter, setActiveResolutionFilter] = useState('ALL');
  const [activeCertFileFilter, setActiveCertFileFilter] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    cameraType: 'Bullet Camera',
    resolution: '4 MP (Quad HD)',
    brandMake: 'Aditya Infotech (CP Plus)',
    certType: 'STQC',
    certName: 'Certificate #21 (signed)',
    certRef: 'STQC/IOTSCS/ER/001',
    certLink: '',
    datasheetLink: '',
    storeLink: ''
  });

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.sku) {
      alert('Please fill Product Name and Model SKU.');
      return;
    }

    const created = {
      ...newItem,
      id: `cert-${Date.now()}`
    };

    setCertItems([created, ...certItems]);
    setShowAddModal(false);
    alert(`Successfully added ${newItem.certType} certified model: "${newItem.sku}"!`);
  };

  const handleDeleteItem = (id) => {
    if (confirm('Delete this model entry from repository?')) {
      setCertItems(certItems.filter(item => item.id !== id));
    }
  };

  // Extract unique filter options
  const availableCameraTypes = Array.from(new Set(certItems.filter(i => i.certType === activeCertTab).map(i => i.cameraType))).filter(Boolean);
  const availableResolutions = Array.from(new Set(certItems.filter(i => i.certType === activeCertTab).map(i => i.resolution))).filter(Boolean);
  const availableCertFiles = Array.from(new Set(certItems.filter(i => i.certType === activeCertTab).map(i => i.certName))).filter(Boolean);

  // Filtered list
  const filteredList = certItems.filter(item => {
    const matchesCertType = item.certType === activeCertTab;
    const matchesCameraType = activeTypeFilter === 'ALL' || item.cameraType === activeTypeFilter;
    const matchesResolution = activeResolutionFilter === 'ALL' || (item.resolution && item.resolution.includes(activeResolutionFilter));
    const matchesCertFile = activeCertFileFilter === 'ALL' || item.certName === activeCertFileFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.cameraType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.resolution && item.resolution.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCertType && matchesCameraType && matchesResolution && matchesCertFile && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <Award size={22} color="#38bdf8" />
            <h2 style={{ fontSize: '1.25rem' }}>Individual STQC / ARAI Certified Models & Resolution Breakdown</h2>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Search models by <strong>Camera Type (Bullet, Dome, Vandal Dome, PTZ)</strong> and <strong>Resolution (2MP, 4MP, 6MP, 8MP 4K)</strong> with direct PDF download links.
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={15} /> Add Individual Certified Model Link
        </button>
      </div>

      {/* Certification Type Navigation Tabs (STQC, ARAI, CMMI) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${activeCertTab === 'STQC' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={activeCertTab === 'STQC' ? { background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' } : {}}
            onClick={() => {
              setActiveCertTab('STQC');
              setActiveTypeFilter('ALL');
              setActiveResolutionFilter('ALL');
              setActiveCertFileFilter('ALL');
            }}
          >
            📜 STQC Certified Models ({certItems.filter(i => i.certType === 'STQC').length})
          </button>

          <button 
            className={`btn ${activeCertTab === 'ARAI' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={activeCertTab === 'ARAI' ? { background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' } : {}}
            onClick={() => {
              setActiveCertTab('ARAI');
              setActiveTypeFilter('ALL');
              setActiveResolutionFilter('ALL');
              setActiveCertFileFilter('ALL');
            }}
          >
            🚗 ARAI Certified Models ({certItems.filter(i => i.certType === 'ARAI').length})
          </button>

          <button 
            className={`btn ${activeCertTab === 'CMMI / ISO' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={activeCertTab === 'CMMI / ISO' ? { background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' } : {}}
            onClick={() => {
              setActiveCertTab('CMMI / ISO');
              setActiveTypeFilter('ALL');
              setActiveResolutionFilter('ALL');
              setActiveCertFileFilter('ALL');
            }}
          >
            🏆 CMMI / ISO Repository ({certItems.filter(i => i.certType === 'CMMI / ISO').length})
          </button>
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '250px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search SKU or 2MP / 4MP / 8MP..."
            style={{ paddingLeft: '2.1rem', padding: '0.35rem 0.65rem', fontSize: '12px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* THREE-TIER FILTERING: Camera Type, Resolution (2MP/4MP/8MP), Master STQC Certificate PDF */}
      <div className="card" style={{ padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', background: 'rgba(99, 102, 241, 0.06)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Resolution Filter (2MP, 4MP, 6MP, 8MP) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>
            <Sliders size={14} /> Resolution:
          </div>
          <select 
            className="form-select" 
            style={{ width: '160px', padding: '0.35rem 0.65rem', fontSize: '12px', fontWeight: 700, borderColor: 'rgba(56, 189, 248, 0.4)' }}
            value={activeResolutionFilter}
            onChange={(e) => setActiveResolutionFilter(e.target.value)}
          >
            <option value="ALL">All Resolutions</option>
            <option value="2 MP">2 MP (Full HD)</option>
            <option value="4 MP">4 MP (Quad HD)</option>
            <option value="6 MP">6 MP (Super HD)</option>
            <option value="8 MP">8 MP (4K Ultra HD)</option>
          </select>

          {/* Camera Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            <Camera size={14} /> Camera Type:
          </div>
          <select 
            className="form-select" 
            style={{ width: '180px', padding: '0.35rem 0.65rem', fontSize: '12px' }}
            value={activeTypeFilter}
            onChange={(e) => setActiveTypeFilter(e.target.value)}
          >
            <option value="ALL">All Camera Types ({certItems.filter(i => i.certType === activeCertTab).length})</option>
            {availableCameraTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Master Certificate Document Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            <FileText size={14} /> STQC Master Certificate PDF:
          </div>
          <select 
            className="form-select" 
            style={{ width: '190px', padding: '0.35rem 0.65rem', fontSize: '12px' }}
            value={activeCertFileFilter}
            onChange={(e) => setActiveCertFileFilter(e.target.value)}
          >
            <option value="ALL">All Master Certificates</option>
            {availableCertFiles.map(cf => (
              <option key={cf} value={cf}>{cf}</option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredList.length}</strong> camera models
        </div>
      </div>

      {/* Certified Individual Models Master Table (Matching STQC Annexure-A format) */}
      <div className="card">
        <div className="table-container">
          <table className="spec-table">
            <thead>
              <tr>
                <th style={{ width: '45px' }}>Sr. No</th>
                <th style={{ width: '230px' }}>Model Name / SKU</th>
                <th style={{ width: '150px' }}>Camera Type</th>
                <th style={{ width: '140px' }}>Resolution (2MP / 4MP / 8MP)</th>
                <th style={{ width: '190px' }}>ONVIF Protocol Profile Type</th>
                <th style={{ width: '130px' }}>OEM Make</th>
                <th style={{ width: '180px' }}>STQC Certificate PDF Document</th>
                <th style={{ width: '180px' }}>Direct 1-Click PDF & Product Links</th>
                <th style={{ width: '50px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                    No camera models found matching resolution/type filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => {
                  let resBadgeStyle = { background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)', color: '#60a5fa' };
                  if (item.resolution?.includes('8 MP')) {
                    resBadgeStyle = { background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.5)', color: '#34d399' };
                  } else if (item.resolution?.includes('4 MP')) {
                    resBadgeStyle = { background: 'rgba(99, 102, 241, 0.2)', borderColor: 'rgba(99, 102, 241, 0.5)', color: '#818cf8' };
                  } else if (item.resolution?.includes('6 MP')) {
                    resBadgeStyle = { background: 'rgba(139, 92, 246, 0.2)', borderColor: 'rgba(139, 92, 246, 0.5)', color: '#a78bfa' };
                  }

                  const isRareProfileM = item.sku?.includes('TT41L3') || item.sku?.includes('ME41L3') || item.name?.toLowerCase().includes('anpr') || item.name?.toLowerCase().includes('deepinview');

                  return (
                    <tr key={item.id}>
                      {/* Sr. No */}
                      <td style={{ fontWeight: 700, color: '#64748b' }}>
                        {idx + 1}.
                      </td>

                      {/* Model Name / SKU */}
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '13px', color: '#0284c7' }}>
                          {item.sku}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '0.1rem' }}>
                          {item.name}
                        </div>
                      </td>

                      {/* Camera Type */}
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0f172a' }}>
                          {item.cameraType}
                        </div>
                      </td>

                      {/* Resolution (2MP / 4MP / 8MP) */}
                      <td>
                        <span className="badge" style={{ ...resBadgeStyle, fontSize: '11px', padding: '0.25rem 0.6rem', fontWeight: 800 }}>
                          {item.resolution}
                        </span>
                      </td>

                      {/* ONVIF Protocol Profile Type (EXACT DATASHEET SPECIFICATION) */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span className="badge badge-accept" style={{ 
                            background: 'rgba(56, 189, 248, 0.15)', 
                            borderColor: 'rgba(56, 189, 248, 0.35)', 
                            color: '#38bdf8', 
                            fontSize: '10.5px', 
                            padding: '0.2rem 0.55rem', 
                            fontWeight: 700,
                            width: 'fit-content' 
                          }}>
                            🌐 ONVIF (Profile S, Profile G, Profile T)
                          </span>
                          <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                            TLS v1.2/v1.3 • InstaOn • SFTP • RTSP
                          </span>
                        </div>
                      </td>

                      {/* OEM Make */}
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '12px', color: '#0f172a' }}>
                          {item.brandMake}
                        </div>
                      </td>

                      {/* STQC Certificate PDF Document */}
                      <td>
                        <div style={{ fontWeight: 800, fontSize: '11.5px', color: '#059669' }}>
                          {item.certName || 'Master Certificate'}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                          Ref: {item.certRef}
                        </div>
                      </td>

                      {/* Direct Download Links */}
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {item.certLink && (
                            <a 
                              href={item.certLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '11px', padding: '0.25rem 0.55rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                            >
                              <Download size={12} /> Download STQC PDF ({item.certName})
                            </a>
                          )}

                          {item.datasheetLink && (
                            <a 
                              href={item.datasheetLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '11px', padding: '0.25rem 0.55rem' }}
                            >
                              <FileText size={12} /> Datasheet PDF
                            </a>
                          )}

                          {item.storeLink && (
                            <a 
                              href={item.storeLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '11px', padding: '0.25rem 0.55rem', color: '#38bdf8' }}
                            >
                              <ShoppingCart size={12} /> FGTech Store
                            </a>
                          )}
                        </div>
                      </td>

                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Individual Certified Model Link Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Add Individual Certified Model Link</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Register a specific camera model with Camera Type and Resolution (2MP / 4MP / 8MP).
            </p>

            <form onSubmit={handleSaveItem}>
              <div className="form-row">
                <div className="form-group">
                  <label>Model SKU Number *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. CP-UNC-TE81ZL6C-VMDS-Q"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. CP Plus 4K Network Bullet Camera"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Camera Type *</label>
                  <select 
                    className="form-select"
                    value={newItem.cameraType}
                    onChange={(e) => setNewItem({ ...newItem, cameraType: e.target.value })}
                  >
                    <option value="Bullet Camera">Bullet Camera</option>
                    <option value="Dome Camera">Dome Camera</option>
                    <option value="Vandal Dome Camera">Vandal Dome Camera</option>
                    <option value="AI Enforcement Camera">AI Enforcement Camera</option>
                    <option value="ANPR Camera">ANPR License Plate Camera</option>
                    <option value="Mobile CCTV Camera">Mobile CCTV Camera</option>
                    <option value="PTZ Speed Dome Camera">PTZ Speed Dome Camera</option>
                    <option value="Network Fisheye Camera">Network Fisheye Camera</option>
                    <option value="Dual Light Wedge Camera">Dual Light Wedge Camera</option>
                    <option value="Mobile DVR / NVR">Mobile DVR / NVR</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Resolution (2MP / 4MP / 8MP) *</label>
                  <select 
                    className="form-select"
                    value={newItem.resolution}
                    onChange={(e) => setNewItem({ ...newItem, resolution: e.target.value })}
                  >
                    <option value="8 MP (4K Ultra HD)">8 MP (4K Ultra HD)</option>
                    <option value="6 MP (Super HD)">6 MP (Super HD)</option>
                    <option value="4 MP (Quad HD)">4 MP (Quad HD)</option>
                    <option value="2 MP (Full HD)">2 MP (Full HD)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Master Certificate Name / File Ref</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Certificate #21 (signed)"
                    value={newItem.certName}
                    onChange={(e) => setNewItem({ ...newItem, certName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Certification Type *</label>
                  <select 
                    className="form-select"
                    value={newItem.certType}
                    onChange={(e) => setNewItem({ ...newItem, certType: e.target.value })}
                  >
                    <option value="STQC">STQC Certified (Govt MeiTY)</option>
                    <option value="ARAI">ARAI Certified (AIS-140 Automotive)</option>
                    <option value="CMMI / ISO">CMMI / ISO Certification</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>OEM Brand / Make *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Aditya Infotech (CP Plus)"
                  value={newItem.brandMake}
                  onChange={(e) => setNewItem({ ...newItem, brandMake: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Official STQC Certificate PDF URL Link *</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="e.g. https://www.stqc.gov.in/sites/default/files/2025-06/CPP%20Plus%20Certificate%20signed-21.pdf"
                  value={newItem.certLink}
                  onChange={(e) => setNewItem({ ...newItem, certLink: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Product Datasheet PDF Link</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://cpplusworld.com/...pdf"
                    value={newItem.datasheetLink}
                    onChange={(e) => setNewItem({ ...newItem, datasheetLink: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Store Link</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://fgtechstore.com/..."
                    value={newItem.storeLink}
                    onChange={(e) => setNewItem({ ...newItem, storeLink: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Individual Certified Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
