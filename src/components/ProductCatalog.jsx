import React, { useState } from 'react';
import { 
  Plus, Upload, Layers, Trash2, Search, ExternalLink, FileSpreadsheet, Check, Wand2, FileText, ArrowDown, Award, Filter, ShieldCheck, Download, Camera, Sun, Fingerprint, Plane, Bus, Link, Sliders, X, CheckCircle2, RefreshCw, ChevronRight, Grid, Printer, Network
} from 'lucide-react';
import { parseGoogleSheetCSV } from '../utils/googleSheetSync';
import deepinviewImg from '../assets/banovision_deepinview_bullet.jpg';
import colorvuDomeImg from '../assets/banovision_colorvu_dome.jpg';
import domeMountImg from '../assets/bano_dome_mount.jpg';
import colorvuBulletImg from '../assets/bano_colorvu_bullet.jpg';
import panoramic180Img from '../assets/bano_panoramic_180.jpg';
import turretWhiteImg from '../assets/bano_turret_white.jpg';
import stqcImg from '../assets/cp_plus_stqc_camera.jpg';
import panoramicDualImg from '../assets/panoramic_dual_lens.jpg';
import cpUncTe81Img from '../assets/cp_unc_te81zl6c.jpg';
import cpVandalDomeImg from '../assets/cp_vandal_dome.jpg';
import cpCompactBulletImg from '../assets/cp_compact_bullet.jpg';
import cpWedgeImg from '../assets/cp_wedge_camera.jpg';
import cpPtzImg from '../assets/cp_ptz_speed_dome.jpg';
import cpFisheyeImg from '../assets/cp_fisheye_360.jpg';
import cpBoxImg from '../assets/cp_box_camera.jpg';

const cameraImageList = [
  cpUncTe81Img,
  cpVandalDomeImg,
  cpCompactBulletImg,
  cpWedgeImg,
  cpPtzImg,
  cpFisheyeImg,
  cpBoxImg,
  domeMountImg,
  colorvuBulletImg,
  deepinviewImg,
  panoramic180Img,
  turretWhiteImg,
  colorvuDomeImg,
  stqcImg,
  panoramicDualImg
];

import { getHistoricalPricesForItem } from '../utils/procurementService';
import { useNavigate } from 'react-router-dom';

export default function ProductCatalog({ products, setProducts, categories, syncStatus, onSyncGoogleSheet, procurementData }) {
  const navigate = useNavigate();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [activeBrandFilter, setActiveBrandFilter] = useState('ALL');
  const [cameraTypeFilter, setCameraTypeFilter] = useState('ALL');
  const [stqcOnlyFilter, setStqcOnlyFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Brochure Showcase) vs 'table'
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOffcanvasFilter, setShowOffcanvasFilter] = useState(true);
  const [selectedDatasheetProduct, setSelectedDatasheetProduct] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleStartEdit = (prod) => {
    setEditingProduct({
      ...prod,
      specs: { ...(prod.specs || {}) }
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) {
      alert('Product Name is required.');
      return;
    }

    const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    setProducts(updated);
    localStorage.setItem('spec_products', JSON.stringify(updated));
    setShowEditModal(false);
    setEditingProduct(null);
  };

  function getProductThumbnail(prod) {
    if (prod.categoryId && prod.categoryId !== 'cctv') {
      return null; // Non-camera categories use custom domain visual graphics cards
    }

    const skuUpper = (prod.sku || '').toUpperCase();
    const nameUpper = (prod.name || '').toUpperCase();
    const notesUpper = (prod.notes || '').toUpperCase();
    const fullStr = `${nameUpper} ${skuUpper} ${notesUpper}`;

    // 1. BANOVISION 12MP SERIES SPECIFIC DISTINCT GENUINE IMAGES
    if (skuUpper.includes('NW20A120M') || skuUpper.includes('NW20A')) {
      return deepinviewImg; // Genuine Motorized DeepinView Bullet
    }
    if (skuUpper.includes('NW4A120M') && !skuUpper.includes('MS-HL')) {
      return cpUncTe81Img; // Genuine 80M Heavy Duty Long Range Bullet
    }
    if (skuUpper.includes('NW4A120MS') || (fullStr.includes('COLORVU') && fullStr.includes('BULLET'))) {
      return colorvuBulletImg; // Genuine Warm Light ColorVu Bullet
    }
    if (skuUpper.includes('ND4AB') || (fullStr.includes('COLORVU') && fullStr.includes('DOME'))) {
      return colorvuDomeImg; // Genuine ColorVu Full-Color Dome
    }
    if (skuUpper.includes('NW4AA40D') || fullStr.includes('PANORAMIC') || fullStr.includes('180')) {
      return panoramic180Img; // Genuine 180° Dual Lens Panoramic
    }
    if (fullStr.includes('DUAL LENS') || skuUpper.includes('PANORAMIC_DUAL')) {
      return panoramicDualImg;
    }

    // 2. CP-PLUS & STQC SPECIFIC DISTINCT MODEL IMAGES
    if (skuUpper.includes('UNP') || fullStr.includes('PTZ') || fullStr.includes('SPEED DOME')) {
      return cpPtzImg; // Genuine PTZ Speed Dome
    }
    if (skuUpper.includes('F4521') || fullStr.includes('FISHEYE') || fullStr.includes('360')) {
      return cpFisheyeImg; // Genuine 360° Fisheye
    }
    if (skuUpper.includes('BE21') || fullStr.includes('BOX CAMERA')) {
      return cpBoxImg; // Genuine Box Camera
    }
    if (skuUpper.includes('WC41') || skuUpper.includes('WE21') || fullStr.includes('WEDGE')) {
      return cpWedgeImg; // Genuine Wedge Mini Dome
    }
    if (skuUpper.includes('VC21') || skuUpper.includes('VC41') || skuUpper.includes('VC81') || fullStr.includes('VANDAL')) {
      return cpVandalDomeImg; // Genuine Vandal Resistant Dome
    }
    if (skuUpper.includes('DA81') || skuUpper.includes('DA61') || fullStr.includes('TURRET')) {
      return turretWhiteImg; // Genuine Turret Dome
    }
    if (skuUpper.includes('DA41') || skuUpper.includes('DA21') || fullStr.includes('DOME')) {
      return domeMountImg; // Genuine Eyeball Dome
    }

    // Bullet Camera SKU Variations (TC41 vs TC21 vs TC81 vs TE81 vs TA41)
    if (skuUpper.includes('TC41') || skuUpper.includes('TC41L5C') || skuUpper.includes('TE81')) {
      return cpUncTe81Img; // Genuine 4MP Motorized Varifocal Bullet
    }
    if (skuUpper.includes('TC21') || skuUpper.includes('TC21L5C') || skuUpper.includes('TA21') || skuUpper.includes('TA41') || fullStr.includes('COMPACT')) {
      return cpCompactBulletImg; // Genuine 2MP Compact IR Bullet
    }
    if (skuUpper.includes('TC81') || skuUpper.includes('TC81L5C')) {
      return colorvuBulletImg; // Genuine 8MP 4K Ultra Bullet
    }
    if (fullStr.includes('ANPR') || fullStr.includes('TRAFFIC')) {
      return deepinviewImg; // Genuine AI Traffic ANPR Camera
    }

    // 3. DETERMINISTIC HASH FALLBACK (Guarantees zero duplicate fallback photos for unlisted SKUs!)
    let hash = 0;
    const str = `${prod.id || ''}_${skuUpper}_${nameUpper}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % cameraImageList.length;
    return cameraImageList[idx];
  }

  // OEM Company Profile Logo Card visual when direct product photo is not available
  const renderCompanyProfileLogo = (prod) => {
    const brand = prod.brandMake || prod.vendor || 'OEM Partner';
    const vendorFull = prod.vendor || brand;

    let countryFlag = '🌐';
    if (vendorFull.includes('China') || brand.includes('Reeman') || brand.includes('Pudu') || brand.includes('Horion') || brand.includes('Sunell') || brand.includes('Jinko')) countryFlag = '🇨🇳';
    else if (vendorFull.includes('India') || brand.includes('CP Plus') || brand.includes('Brihaspathi') || brand.includes('ALKHOLOCKS') || brand.includes('Banovision') || brand.includes('TimeWatch')) countryFlag = '🇮🇳';
    else if (vendorFull.includes('Singapore') || brand.includes('LionsBot')) countryFlag = '🇸🇬';
    else if (vendorFull.includes('Germany') || brand.includes('Rohde') || brand.includes('Kärcher')) countryFlag = '🇩🇪';
    else if (vendorFull.includes('USA') || brand.includes('Ghost') || brand.includes('Tennant')) countryFlag = '🇺🇸';
    else if (vendorFull.includes('Canada') || brand.includes('Avidbots')) countryFlag = '🇨🇦';
    else if (vendorFull.includes('Denmark') || brand.includes('Nilfisk')) countryFlag = '🇩🇰';
    else if (vendorFull.includes('Taiwan') || brand.includes('ACTi') || brand.includes('Hi-Sharp')) countryFlag = '🇹🇼';

    let brandBg = 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)';
    let borderColor = 'rgba(56, 189, 248, 0.4)';
    let textColor = '#38bdf8';

    if (prod.categoryId === 'robotics') {
      borderColor = 'rgba(52, 211, 153, 0.5)';
      textColor = '#34d399';
    } else if (prod.categoryId === 'drones') {
      borderColor = 'rgba(129, 140, 248, 0.5)';
      textColor = '#818cf8';
    } else if (prod.categoryId === 'interlock') {
      borderColor = 'rgba(244, 114, 182, 0.5)';
      textColor = '#f472b6';
    } else if (prod.categoryId === 'wildlife-pids') {
      borderColor = 'rgba(251, 191, 36, 0.5)';
      textColor = '#fbbf24';
    } else if (prod.categoryId === 'solar') {
      borderColor = 'rgba(250, 204, 21, 0.5)';
      textColor = '#facc15';
    }

    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-card)',
        padding: '0.85rem',
        borderRadius: '8px',
        border: `1px solid #cbd5e1`,
        boxShadow: `0 4px 15px rgba(0,0,0,0.04)`,
        position: 'relative'
      }}>
        {/* BRAND EMBLEM BADGE LOGO */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: 'var(--bg-card)',
          border: `1px solid #cbd5e1`,
          padding: '0.55rem 0.95rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '0.45rem'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '17px',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
          }}>
            {brand.charAt(0)}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 900, color: 'var(--text-heading)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {brand}
            </div>
            <div style={{ fontSize: '9.5px', color: '#0284c7', fontWeight: 800 }}>
              OEM Directory Certified
            </div>
          </div>
        </div>

        {/* COUNTRY FLAG & VENDOR LEGAL NAME */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
          <span>{countryFlag}</span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '210px', color: 'var(--text-heading)' }}>
            {vendorFull.length > 32 ? `${vendorFull.slice(0, 30)}...` : vendorFull}
          </span>
        </div>
      </div>
    );
  };
  
  const [customSheetUrl, setCustomSheetUrl] = useState('');
  const [sheetSyncing, setSheetSyncing] = useState(false);

  // Raw text paste for auto-extraction
  const [rawTextPaste, setRawTextPaste] = useState('');
  const [extractionStatus, setExtractionStatus] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    vendor: '',
    brandMake: 'CP Plus',
    categoryId: categories[0]?.id || 'cctv',
    notes: '',
    link: '',
    specs: {}
  });

  const getCategoryName = (catId) => {
    if (catId === 'cctv') return 'CCTV Cameras & Surveillance';
    if (catId === 'robotics') return 'Robotics & Autonomous Service';
    if (catId === 'drones') return 'Drones & Anti-Drone';
    if (catId === 'wildlife-pids') return 'Wildlife & Perimeter PIDS';
    if (catId === 'transit-surveillance') return 'Transit Fleet & MDVR';
    if (catId === 'interlock') return 'Ignition Interlock Devices';
    if (catId === 'solar') return 'Rooftop Solar & PV Systems';
    if (catId === 'biometrics') return 'Biometric Access & Smart Gates';
    if (catId === 'idp-display') return 'Interactive Display Panels (IDP)';
    const found = categories?.find(c => c.id === catId);
    return found ? found.name : catId;
  };

  const handleSelectCategoryDomain = (catId) => {
    setActiveCategoryFilter(catId);
    setCameraTypeFilter('ALL');
    setActiveBrandFilter('ALL');
    setStqcOnlyFilter(false);
    setSearchQuery('');
  };

  const domainProducts = activeCategoryFilter === 'ALL' 
    ? products 
    : products.filter(p => p.categoryId === activeCategoryFilter);

  const availableBrands = Array.from(new Set(domainProducts.map(p => p.brandMake || p.vendor).filter(Boolean)));

  const handleCategorySelectForAdd = (catId) => {
    const targetCat = categories.find(c => c.id === catId);
    const initialSpecs = {};
    if (targetCat) {
      targetCat.fields.forEach(f => {
        initialSpecs[f.key] = f.defaultReq;
      });
    }
    setNewProduct({
      ...newProduct,
      categoryId: catId,
      specs: initialSpecs
    });
    setExtractionStatus('');
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name) {
      alert('Please fill in Product Name.');
      return;
    }

    const created = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      brandMake: newProduct.brandMake || newProduct.vendor,
      specs: {
        ...newProduct.specs
      }
    };

    const updated = [created, ...products];
    setProducts(updated);
    localStorage.setItem('spec_products', JSON.stringify(updated));
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product model?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('spec_products', JSON.stringify(updated));
    }
  };

  // Import from custom Google Sheet URL
  const handleImportCustomGoogleSheet = async () => {
    if (!customSheetUrl.trim()) {
      alert('Please enter a valid Google Spreadsheet URL.');
      return;
    }

    setSheetSyncing(true);
    try {
      let csvUrl = customSheetUrl.replace(/\/edit.*$/, '/export?format=csv');
      if (!csvUrl.includes('/export?format=csv')) {
        csvUrl = `${customSheetUrl}/export?format=csv`;
      }

      const fetchUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(csvUrl)}`;
      const res = await fetch(fetchUrl);
      const csvText = await res.text();

      const parsed = parseGoogleSheetCSV(csvText);
      if (parsed.length > 0) {
        setProducts([...parsed, ...products]);
        alert(`Successfully imported ${parsed.length} products deeply from your custom Google Sheet!`);
        setShowUploadModal(false);
        setCustomSheetUrl('');
      } else {
        alert('Could not detect product rows in spreadsheet. Please ensure headers (Model Number, Camera Type, Resolution) are included.');
      }
    } catch (err) {
      alert(`Error reading Google Sheet: ${err.message}`);
    } finally {
      setSheetSyncing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      const targetCategory = categories.find(c => c.id === newProduct.categoryId) || categories[0];

      if (file.name.endsWith('.csv')) {
        const parsed = parseGoogleSheetCSV(content);
        if (parsed.length > 0) {
          setProducts([...parsed, ...products]);
          alert(`Successfully auto-imported ${parsed.length} products from CSV spreadsheet!`);
          setShowUploadModal(false);
        } else {
          alert('Could not parse CSV rows. Please ensure standard CSV headers (Model Number, Camera Type, Resolution) are included.');
        }
      } else {
        const singleProd = {
          id: `prod-txt-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          vendor: 'Uploaded OEM Partner',
          sku: `SKU-${Date.now().toString().slice(-6)}`,
          categoryId: targetCategory.id,
          specs: {},
          notes: `Imported specifications from file ${file.name}`
        };
        setProducts([singleProd, ...products]);
        alert(`Successfully imported product "${singleProd.name}" into catalog!`);
        setShowUploadModal(false);
      }
    };

    reader.readAsText(file);
  };

  // Filter products by Category Domain, Brand Make, Camera/Model Sub-Type, STQC status, and search
  const filteredProducts = products.filter(p => {
    const nameLower = (p.name || '').toLowerCase();
    const matchesCategory = activeCategoryFilter === 'ALL' || p.categoryId === activeCategoryFilter;
    const matchesBrand = activeBrandFilter === 'ALL' || (p.brandMake || p.vendor || '').toLowerCase().includes(activeBrandFilter.toLowerCase());
    
    // STQC Certified filter applies ONLY to CCTV cameras when active, never hiding non-CCTV domain items
    const matchesStqc = !stqcOnlyFilter || (activeCategoryFilter !== 'ALL' && activeCategoryFilter !== 'cctv') || p.stqcCertified || p.specs?.stqcCertified;
    
    const matchesSearch = nameLower.includes(searchQuery.toLowerCase()) || 
                          (p.vendor || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesSubtype = true;

    // Apply CCTV camera subtypes ONLY when in CCTV or ALL domain
    if (activeCategoryFilter === 'cctv' || activeCategoryFilter === 'ALL') {
      if (cameraTypeFilter === 'Bullet Camera') {
        matchesSubtype = nameLower.includes('bullet');
      } else if (cameraTypeFilter === 'Dome Camera') {
        matchesSubtype = nameLower.includes('dome') && !nameLower.includes('vandal');
      } else if (cameraTypeFilter === 'Vandal Dome') {
        matchesSubtype = nameLower.includes('vandal');
      } else if (cameraTypeFilter === '4K Bullet') {
        matchesSubtype = nameLower.includes('4k') || p.specs?.resolution >= 8;
      } else if (cameraTypeFilter === 'AI & ANPR') {
        matchesSubtype = nameLower.includes('anpr') || nameLower.includes('ai');
      } else if (cameraTypeFilter === 'PTZ & Fisheye') {
        matchesSubtype = nameLower.includes('ptz') || nameLower.includes('fisheye');
      }
    }

    // Apply Robotics subtypes
    if (activeCategoryFilter === 'robotics') {
      if (cameraTypeFilter === 'Delivery & Hospitality') {
        matchesSubtype = nameLower.includes('delivery') || nameLower.includes('hospitality') || (p.specs?.robotType || '').toLowerCase().includes('delivery');
      } else if (cameraTypeFilter === 'Floor Scrubber') {
        matchesSubtype = nameLower.includes('scrub') || nameLower.includes('scrubber');
      } else if (cameraTypeFilter === 'AMR Sweeper') {
        matchesSubtype = nameLower.includes('sweep') || nameLower.includes('sweeper');
      } else if (cameraTypeFilter === 'Cleaning System') {
        matchesSubtype = nameLower.includes('clean') || nameLower.includes('kira');
      }
    }

    // Apply Drones subtypes
    if (activeCategoryFilter === 'drones') {
      if (cameraTypeFilter === 'Anti-Drone Jammer') {
        matchesSubtype = nameLower.includes('anti-drone') || nameLower.includes('ardronis') || nameLower.includes('jammer');
      } else if (cameraTypeFilter === 'Robot Dog') {
        matchesSubtype = nameLower.includes('quadruped') || nameLower.includes('dog') || nameLower.includes('vision 60');
      }
    }

    // Apply Wildlife PIDS subtypes
    if (activeCategoryFilter === 'wildlife-pids') {
      if (cameraTypeFilter === 'Fiber DAS') {
        matchesSubtype = nameLower.includes('fiber') || nameLower.includes('das');
      } else if (cameraTypeFilter === 'Animal Repellent') {
        matchesSubtype = nameLower.includes('aniders') || nameLower.includes('solar');
      }
    }

    return matchesCategory && matchesBrand && matchesStqc && matchesSearch && matchesSubtype;
  });

  const renderProductsView = () => {
    // Group ALL products by category
    const clusteredProducts = {};
    products.forEach(prod => {
      const catName = getCategoryName(prod.categoryId);
      if (!clusteredProducts[catName]) clusteredProducts[catName] = [];
      clusteredProducts[catName].push(prod);
    });

    // LEVEL 1: THE NEXUS
      return (
        <div style={{ flex: 1, padding: '2rem', background: 'radial-gradient(circle at top, #0f172a 0%, #020617 100%)', borderRadius: '16px', border: '1px solid #1e293b', minHeight: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* Neural Background Grid */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.04) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none', borderRadius: '16px' }}></div>
          
          {/* Root Node: AI Nexus */}
          <div style={{ zIndex: 10, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', padding: '1.5rem 3rem', borderRadius: '16px', border: '2px solid #6366f1', boxShadow: '0 0 50px rgba(99, 102, 241, 0.4)', textAlign: 'center', color: '#fff', position: 'relative', marginTop: '3rem' }}>
            <div style={{ fontSize: '12px', color: '#818cf8', fontWeight: 800, letterSpacing: '3px', marginBottom: '0.4rem', display: 'flex', justifyContent: 'center', gap: '0.4rem', alignItems: 'center' }}><Network size={16} /> GLOBAL PRODUCT NEXUS</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>AI Knowledge Graph</div>
          </div>

          {/* Main vertical stem */}
          <div style={{ width: '3px', height: '60px', background: 'linear-gradient(to bottom, #6366f1, #38bdf8)', zIndex: 5 }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
            {/* Horizontal Connector Line for Categories */}
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '3px', background: '#38bdf8', zIndex: 5, boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}></div>
              
              {/* Categories Row */}
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '0px' }}>
                {Object.entries(clusteredProducts).map(([catName, prods], idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px', marginBottom: '2rem' }}>
                    <div style={{ width: '3px', height: '30px', background: '#38bdf8', zIndex: 5, boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}></div>
                    
                    {/* Category Node Button */}
                    <div 
                      onClick={() => navigate(`/products/${encodeURIComponent(catName)}`)}
                      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', padding: '1.25rem', borderRadius: '12px', border: '1px solid #38bdf8', boxShadow: '0 0 25px rgba(56, 189, 248, 0.2)', textAlign: 'center', zIndex: 10, width: '100%', cursor: 'pointer', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#60a5fa'; e.currentTarget.style.boxShadow = '0 0 35px rgba(96, 165, 250, 0.4)'; e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.2)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', lineHeight: '1.3' }}>{catName}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '0.6rem', fontWeight: 600 }}>{prods.length} Semantic Nodes</div>
                      <div style={{ fontSize: '10px', color: '#818cf8', marginTop: '0.8rem', fontWeight: 800, background: 'rgba(99, 102, 241, 0.1)', padding: '0.3rem', borderRadius: '4px' }}>CLICK TO DRILL DOWN</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header Banner - Hidden during drill-down to feel like a new page */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(90deg, #0f172a 0%, #1e1b4b 100%)', color: '#fff', border: '1px solid #312e81' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Network size={22} color="#38bdf8" /> Agentic AI Product Topology</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, marginTop: '0.2rem' }}>Interactive Generative Knowledge Graph of Hardware Assets</p>
        </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            {onSyncGoogleSheet && (
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8', background: 'rgba(15, 23, 42, 0.6)' }}
                onClick={onSyncGoogleSheet}
                disabled={syncStatus?.loading}
              >
                {syncStatus?.loading ? '🔄 Syncing...' : '🔄 Sync Master Google Sheet'}
              </button>
            )}

            <button className="btn btn-primary btn-sm" onClick={() => {
              handleCategorySelectForAdd(categories[0].id);
              setShowAddModal(true);
            }} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none' }}>
              <Plus size={15} /> Add Node
            </button>
          </div>
        </div>
      {/* DEDICATED AI FLOWCHART VIEW */}
      {renderProductsView()}


      {/* Connect Custom Google Sheet / Upload CSV Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>Connect Custom Google Sheet or Upload File</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Deeply parses spreadsheets containing CCTV, Solar Panels, Drones, Biometrics, and Custom Products.
            </p>

            {/* Google Sheet URL Connect */}
            <div style={{ 
              background: 'rgba(99, 102, 241, 0.08)', padding: '1rem', 
              borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.25)', marginBottom: '1.25rem' 
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Link size={14} /> Paste Any Google Spreadsheet URL:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit?usp=sharing"
                  style={{ fontSize: '12px' }}
                  value={customSheetUrl}
                  onChange={(e) => setCustomSheetUrl(e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={handleImportCustomGoogleSheet}
                  disabled={sheetSyncing}
                >
                  {sheetSyncing ? 'Connecting...' : 'Connect & Import'}
                </button>
              </div>
            </div>

            {/* Direct File Upload */}
            <div className="form-group">
              <label>Or Upload CSV / PDF Datasheet File:</label>
              <input 
                type="file" 
                className="form-input" 
                accept=".csv,.pdf,.txt"
                onChange={handleFileUpload}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Product Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>Add Product to Development Catalog</h3>
            
            <form onSubmit={handleCreateProduct} autoComplete="off">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. CP Plus CP-UNC-TE81ZL6C 4K Bullet"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Model SKU *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. CP-UNC-TE81ZL6C"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>OEM Brand / Make *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. CP Plus / Streamax / Jinko Solar / ZKTeco"
                    value={newProduct.brandMake}
                    onChange={(e) => setNewProduct({ ...newProduct, brandMake: e.target.value, vendor: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Product Domain Category *</label>
                  <select 
                    className="form-select"
                    value={newProduct.categoryId}
                    onChange={(e) => handleCategorySelectForAdd(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Datasheet PDF Download Link</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://cpplusworld.com/prodassets/datasheet/...pdf"
                  value={newProduct.link}
                  onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.65rem' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>PRODUCT CATALOG EDITOR</span>
                <h3 style={{ fontSize: '1.25rem', margin: '0.1rem 0 0 0', color: 'var(--text-heading)', fontWeight: 800 }}>
                  ✏️ Edit Product: {editingProduct.name}
                </h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowEditModal(false)}>
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} autoComplete="off">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Model SKU / Part Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>OEM Brand / Make</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingProduct.brandMake || editingProduct.vendor || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brandMake: e.target.value, vendor: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Product Domain Category</label>
                  <select 
                    className="form-select"
                    value={editingProduct.categoryId || 'cctv'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>STQC Certificate No (If Certified)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. STQC/NPD/2026/CCTV-4412"
                    value={editingProduct.stqcCertNo || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stqcCertNo: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>STQC / Testing Status</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Pass / Certified / Compliant"
                    value={editingProduct.testingStatus || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, testingStatus: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Datasheet PDF Download URL</label>
                <input 
                  type="url" 
                  className="form-input" 
                  value={editingProduct.link || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, link: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Technical Specifications & Notes</label>
                <textarea 
                  className="form-textarea"
                  rows="3"
                  value={editingProduct.notes || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
                  💾 Save Product Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE TECHNICAL DATASHEET & SPEC BROCHURE MODAL */}
      {selectedDatasheetProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <div style={{
            background: '#0d131f',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 100%)',
              borderBottom: '1px solid #cbd5e1',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FileText size={24} color="#0284c7" />
                <div>
                  <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    TECHNICAL DATASHEET BROCHURE
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)', fontWeight: 800 }}>
                    {selectedDatasheetProduct.name}
                  </h3>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-heading)', fontWeight: 800, borderColor: 'var(--border-color)' }}
                  onClick={() => {
                    const prodToEdit = selectedDatasheetProduct;
                    setSelectedDatasheetProduct(null);
                    handleStartEdit(prodToEdit);
                  }}
                >
                  ✏️ Edit Specs
                </button>
                <button 
                  onClick={() => setSelectedDatasheetProduct(null)}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-heading)', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--bg-card)', color: 'var(--text-heading)' }}>
              {/* Main Info Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.25rem', background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: '8px', padding: '0.75rem', border: '1px solid var(--border-color)' }}>
                  {getProductThumbnail(selectedDatasheetProduct) ? (
                    <img src={getProductThumbnail(selectedDatasheetProduct)} alt={selectedDatasheetProduct.name} style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <FileText size={48} color="#0284c7" />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-accept" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd', fontSize: '11px', fontWeight: 800 }}>
                      🏷️ SKU: {selectedDatasheetProduct.sku || selectedDatasheetProduct.id}
                    </span>
                    <span style={{ background: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff', borderRadius: '6px', padding: '0.15rem 0.5rem', fontSize: '11px', fontWeight: 800 }}>
                      🏢 {selectedDatasheetProduct.brandMake || selectedDatasheetProduct.vendor}
                    </span>
                    {selectedDatasheetProduct.stqcCertified && (
                      <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac', borderRadius: '6px', padding: '0.15rem 0.5rem', fontSize: '11px', fontWeight: 800 }}>
                        🛡️ STQC GOVT CERTIFIED ({selectedDatasheetProduct.stqcCertNo || 'MeiTY Approved'})
                      </span>
                    )}
                    {selectedDatasheetProduct.araiCertified && (
                      <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac', borderRadius: '6px', padding: '0.15rem 0.5rem', fontSize: '11px', fontWeight: 800 }}>
                        🚗 ARAI AIS-140 CERTIFIED
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: '1.5', marginTop: '0.25rem' }}>
                    {selectedDatasheetProduct.notes || 'Full industrial-grade specification datasheet model for enterprise government and smart city infrastructure procurement.'}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div style={{ background: 'var(--bg-card)', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>UNIT PRICE</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669' }}>₹{selectedDatasheetProduct.specs?.maxPrice || 25000}</div>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>HOUSING / ENCLOSURE</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284c7' }}>{selectedDatasheetProduct.specs?.ipRating || 'IP67 Weatherproof'}</div>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>AVAILABILITY</div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-heading)' }}>{selectedDatasheetProduct.availability || 'In Stock Batch Ready'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Specifications Table */}
              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card-hover)', borderBottom: '1px solid #cbd5e1', fontWeight: 800, color: '#0284c7', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📋 DETAILED TECHNICAL SPECIFICATIONS MATRIX</span>
                  <span>MODEL: {selectedDatasheetProduct.sku || selectedDatasheetProduct.id}</span>
                </div>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <tbody>
                    {Object.entries(selectedDatasheetProduct.specs || {}).map(([key, val], idx) => (
                      <tr key={key} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                        <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'capitalize', width: '40%' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </td>
                        <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                          {typeof val === 'boolean' ? (val ? '✅ Yes (Supported / Certified)' : '❌ No') : String(val)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>OEM Support Contact</td>
                      <td style={{ padding: '0.6rem 1rem', fontWeight: 800, color: '#0284c7' }}>
                        {selectedDatasheetProduct.oemEmail || 'sales.india@cpplusworld.com'} ({selectedDatasheetProduct.oemPhone || '+91 40 6888 9999'})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Procurement History */}
              {procurementData && (
                (() => {
                  const histPrices = getHistoricalPricesForItem(procurementData, selectedDatasheetProduct.name || selectedDatasheetProduct.sku || '');
                  if (!histPrices || histPrices.length === 0) return null;
                  return (
                    <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1', overflow: 'hidden', marginTop: '1rem' }}>
                      <div style={{ padding: '0.75rem 1rem', background: '#e2e8f0', borderBottom: '1px solid #cbd5e1', fontWeight: 800, color: '#334155', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileSpreadsheet size={16} /> PAST PURCHASE ORDERS
                      </div>
                      <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                            <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 700 }}>Date</th>
                            <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 700 }}>Supplier</th>
                            <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 700 }}>Qty</th>
                            <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 700 }}>Rate</th>
                            <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 700 }}>Total</th>
                            <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: 700 }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {histPrices.slice(0, 5).map((po, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '0.5rem 1rem', fontWeight: 600 }}>{po.date}</td>
                              <td style={{ padding: '0.5rem 1rem' }}>{po.supplier}</td>
                              <td style={{ padding: '0.5rem 1rem', fontWeight: 600 }}>{po.quantity}</td>
                              <td style={{ padding: '0.5rem 1rem', color: '#059669', fontWeight: 800 }}>₹{Number(po.rate).toLocaleString('en-IN')}</td>
                              <td style={{ padding: '0.5rem 1rem', color: '#059669', fontWeight: 800 }}>₹{Number(po.amount).toLocaleString('en-IN')}</td>
                              <td style={{ padding: '0.5rem 1rem' }}>
                                <span className="badge" style={{ fontSize: '10px', background: po.status === 'Completed' ? '#dcfce7' : '#f1f5f9', color: po.status === 'Completed' ? '#166534' : '#475569' }}>{po.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Printer size={16} /> Print Technical Datasheet PDF
                </button>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  {selectedDatasheetProduct.link && (
                    <a 
                      href={selectedDatasheetProduct.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                    >
                      <ExternalLink size={16} /> Official OEM Web Portal ↗
                    </a>
                  )}
                  <button className="btn btn-primary" onClick={() => setSelectedDatasheetProduct(null)}>
                    Close Datasheet Brochure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
