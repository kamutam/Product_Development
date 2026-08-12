import React, { useState } from 'react';
import { 
  Plus, Upload, Layers, Trash2, Search, ExternalLink, FileSpreadsheet, Check, Wand2, FileText, ArrowDown, Award, Filter, ShieldCheck, Download, Camera, Sun, Fingerprint, Plane, Bus, Link, Sliders, X, CheckCircle2, RefreshCw, ChevronRight, Grid, Printer
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

export default function ProductCatalog({ products, setProducts, categories, syncStatus, onSyncGoogleSheet }) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [activeBrandFilter, setActiveBrandFilter] = useState('ALL');
  const [cameraTypeFilter, setCameraTypeFilter] = useState('ALL');
  const [stqcOnlyFilter, setStqcOnlyFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Brochure Showcase) vs 'table'
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOffcanvasFilter, setShowOffcanvasFilter] = useState(true);
  const [selectedDatasheetProduct, setSelectedDatasheetProduct] = useState(null);

  function getProductThumbnail(prod) {
    if (prod.categoryId && prod.categoryId !== 'cctv') {
      return null; // Non-camera categories use custom domain visual graphics cards
    }

    const nameUpper = (prod.name || '').toUpperCase();
    const skuUpper = (prod.sku || '').toUpperCase();
    const typeUpper = (prod.type || prod.notes || '').toUpperCase();
    const fullStr = `${nameUpper} ${skuUpper} ${typeUpper}`;

    // 1. PTZ & SPEED DOME CAMERAS
    if (fullStr.includes('PTZ') || fullStr.includes('SPEED DOME') || skuUpper.includes('UNP') || skuUpper.includes('F4521')) {
      return cpPtzImg;
    }

    // 2. FISHEYE 360° CAMERAS
    if (fullStr.includes('FISHEYE') || fullStr.includes('EE61') || fullStr.includes('360')) {
      return cpFisheyeImg;
    }

    // 3. BOX & SPECIALTY CAMERAS
    if (fullStr.includes('BOX') || skuUpper.includes('BE21')) {
      return cpBoxImg;
    }

    // 4. PANORAMIC & DUAL-LENS 180° CAMERAS
    if (fullStr.includes('PANORAMIC') || fullStr.includes('180') || fullStr.includes('DUAL LENS') || skuUpper.includes('BA-NW4AA40D')) {
      return panoramic180Img;
    }
    if (fullStr.includes('DUAL') || skuUpper.includes('PANORAMIC_DUAL')) {
      return panoramicDualImg;
    }

    // 5. ANPR & AI ENFORCEMENT TRAFFIC CAMERAS
    if (fullStr.includes('ANPR') || fullStr.includes('TRAFFIC') || fullStr.includes('ENFORCEMENT') || skuUpper.includes('ME41L3') || skuUpper.includes('TT41L3')) {
      return deepinviewImg;
    }

    // 6. WEDGE & MINI DOME CAMERAS
    if (fullStr.includes('WEDGE') || skuUpper.includes('WC41') || skuUpper.includes('WE21')) {
      return cpWedgeImg;
    }

    // 7. VANDAL DOME CAMERAS
    if (fullStr.includes('VANDAL') || skuUpper.includes('VC21') || skuUpper.includes('VC41') || skuUpper.includes('VC81') || skuUpper.includes('VC61') || skuUpper.includes('VE21')) {
      return cpVandalDomeImg;
    }

    // 8. DOME & TURRET CAMERAS
    if (fullStr.includes('DOME') || skuUpper.includes('DA41') || skuUpper.includes('DA21') || skuUpper.includes('DA81') || skuUpper.includes('DA61') || skuUpper.includes('ND4AB')) {
      if (fullStr.includes('COLORVU') || fullStr.includes('FULL COLOR') || skuUpper.includes('Q')) return colorvuDomeImg;
      if (fullStr.includes('TURRET') || fullStr.includes('EYEBALL') || skuUpper.includes('B-LQ')) return turretWhiteImg;
      return domeMountImg;
    }

    // 9. BULLET CAMERAS (4K, Varifocal, Compact, STQC, ColorVu)
    if (fullStr.includes('BULLET') || skuUpper.includes('TE81') || skuUpper.includes('TC41') || skuUpper.includes('TA41') || skuUpper.includes('TA21') || skuUpper.includes('TC81') || skuUpper.includes('TC61') || skuUpper.includes('TC21') || skuUpper.includes('BA-NW')) {
      if (skuUpper.includes('TE81') || skuUpper.includes('TC81') || skuUpper.includes('TC41ZL') || skuUpper.includes('TC81ZL')) return cpUncTe81Img;
      if (fullStr.includes('COLORVU') || fullStr.includes('FULL COLOR') || skuUpper.includes('L3B')) return colorvuBulletImg;
      if (fullStr.includes('COMPACT') || skuUpper.includes('TA21') || skuUpper.includes('TA41') || skuUpper.includes('D-LQ')) return cpCompactBulletImg;
      return stqcImg;
    }

    return stqcImg;
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
        background: '#f8fafc',
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
          background: '#ffffff',
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
            <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {brand}
            </div>
            <div style={{ fontSize: '9.5px', color: '#0284c7', fontWeight: 800 }}>
              OEM Directory Certified
            </div>
          </div>
        </div>

        {/* COUNTRY FLAG & VENDOR LEGAL NAME */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '10.5px', color: '#475569', fontWeight: 700 }}>
          <span>{countryFlag}</span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '210px', color: '#0f172a' }}>
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

    setProducts([created, ...products]);
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product model?')) {
      setProducts(products.filter(p => p.id !== id));
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
    if (viewMode === 'grid') {
      return (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
          {filteredProducts.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
              No products found matching active filters.
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const thumbnail = getProductThumbnail(prod);
              const datasheetPdfUrl = prod.link ? prod.link : (
                (prod.brandMake || prod.vendor || '').includes('CP Plus')
                  ? `https://cpplusworld.com/prodassets/datasheet/${prod.sku}.pdf`
                  : `https://hrms.brihaspathi.in/datasheets/${prod.sku || prod.id}.pdf`
              );
              const isStqcCertified = prod.stqcCertified || prod.specs?.stqcCertified;

              // Domain-specific banner styling & headers
              let seriesTag = '12MP DEEPIN VIEW SERIES';
              let seriesBg = '#dc2626';
              let modelTitleHeader = '📷 CAMERA MODEL NAME:';
              let iconEmoji = '📷';

              if (prod.categoryId === 'robotics') {
                seriesTag = 'AUTONOMOUS SERVICE ROBOTICS';
                seriesBg = '#059669';
                modelTitleHeader = '🤖 ROBOT MODEL NAME:';
                iconEmoji = '🤖';
              } else if (prod.categoryId === 'drones') {
                seriesTag = 'UAV & ANTI-DRONE DEFENSE';
                seriesBg = '#4f46e5';
                modelTitleHeader = '🛩️ SYSTEM MODEL NAME:';
                iconEmoji = '🛩️';
              } else if (prod.categoryId === 'wildlife-pids') {
                seriesTag = 'WILDLIFE & PERIMETER PIDS';
                seriesBg = '#d97706';
                modelTitleHeader = '🐘 PIDS SENSOR MODEL NAME:';
                iconEmoji = '🐘';
              } else if (prod.categoryId === 'interlock') {
                seriesTag = 'IGNITION INTERLOCK & SAFETY';
                seriesBg = '#be185d';
                modelTitleHeader = '🔒 DEVICE MODEL NAME:';
                iconEmoji = '🔒';
              } else if (prod.categoryId === 'solar') {
                seriesTag = 'SOLAR PV & RENEWABLE ENERGY';
                seriesBg = '#ca8a04';
                modelTitleHeader = '☀️ SOLAR PANEL MODEL NAME:';
                iconEmoji = '☀️';
              } else if (prod.categoryId === 'biometrics') {
                seriesTag = 'BIOMETRIC ACCESS & SMART GATES';
                seriesBg = '#0d9488';
                modelTitleHeader = '👆 BIOMETRIC TERMINAL NAME:';
                iconEmoji = '👆';
              } else if (prod.categoryId === 'idp-display') {
                seriesTag = 'INTERACTIVE DISPLAY & LED BOARDS';
                seriesBg = '#7c3aed';
                modelTitleHeader = '🖥️ DISPLAY PANEL MODEL NAME:';
                iconEmoji = '🖥️';
              } else if (prod.name?.includes('ColorVu') || prod.notes?.includes('ColorVu')) {
                seriesTag = 'COLORVU 24/7 FULL COLOR';
                seriesBg = '#ea580c';
              } else if (prod.name?.includes('Panoramic') || prod.name?.includes('180°')) {
                seriesTag = '180° DUAL LENS PANORAMA';
                seriesBg = '#7c3aed';
              } else if (prod.brandMake?.includes('CP Plus')) {
                seriesTag = 'STQC GOVT LAB CERTIFIED';
                seriesBg = '#0284c7';
              }

              return (
                <div 
                  key={prod.id}
                  className="card"
                  style={{ 
                    padding: '0', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    background: '#ffffff', 
                    border: '1px solid #cbd5e1',
                    position: 'relative'
                  }}
                >
                  {/* CATEGORY SERIES BANNER */}
                  <div style={{ background: seriesBg, color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '0.4rem 0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{seriesTag}</span>
                    {isStqcCertified && <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.25)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>🛡️ STQC APPROVED</span>}
                    {prod.araiCertified && <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.25)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>🚗 ARAI CERTIFIED</span>}
                  </div>

                  {/* THUMBNAIL CONTAINER (CAMERA IMAGE FOR CCTV, DOMAIN VISUAL FOR NON-CCTV) */}
                  <div
                    onClick={() => setSelectedDatasheetProduct(prod)}
                    title={`Click to view ${prod.name} Technical Datasheet Brochure`}
                    style={{ 
                      background: '#f8fafc', 
                      padding: '1rem', 
                      display: 'flex', 
                      justify: 'center', 
                      alignItems: 'center', 
                      height: '170px', 
                      borderBottom: '1px solid #cbd5e1',
                      position: 'relative',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                  >
                    {/* MODEL SKU OVERLAY BADGE */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(11, 15, 25, 0.88)',
                      border: '1px solid rgba(56, 189, 248, 0.45)',
                      color: '#38bdf8',
                      fontSize: '9.5px',
                      fontWeight: 800,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '5px',
                      backdropFilter: 'blur(4px)',
                      zIndex: 2,
                      fontFamily: 'monospace',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
                    }}>
                      🏷️ {prod.sku || prod.name.split(' ')[2] || prod.id}
                    </div>

                    {/* LENS & SPEC OVERLAY BADGE */}
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      background: 'rgba(15, 23, 42, 0.88)',
                      border: '1px solid rgba(16, 185, 129, 0.45)',
                      color: '#34d399',
                      fontSize: '9px',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      backdropFilter: 'blur(4px)',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}>
                      ⚡ {prod.specs?.resolution ? `${prod.specs.resolution}MP` : 'HIGH-SPEC'} &bull; {prod.sku?.includes('ZL') ? 'VARIFOCAL MOTORIZED' : (prod.sku?.includes('VC') ? 'IK10 VANDAL DOME' : (prod.sku?.includes('TA') ? 'COMPACT BULLET' : (prod.sku?.includes('WC') ? 'DUAL LIGHT WEDGE' : 'SPEC CERTIFIED')))}
                    </div>

                    {thumbnail ? (
                      <img 
                        src={thumbnail} 
                        alt={prod.name} 
                        style={{ 
                          maxHeight: '145px', 
                          maxWidth: '100%', 
                          objectFit: 'contain', 
                          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.6))',
                          transition: 'transform 0.25s ease'
                        }} 
                      />
                    ) : (
                      renderCompanyProfileLogo(prod)
                    )}
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      backdropFilter: 'blur(4px)'
                    }}>
                      <ExternalLink size={10} /> View Datasheet
                    </div>
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
                    <div>
                      {/* SKU & BRAND */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span className="badge badge-accept" style={{ background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '11px', fontWeight: 700 }}>
                          🏷️ SKU: {prod.sku || 'N/A'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 700 }}>
                          🏢 {prod.brandMake || prod.vendor}
                        </span>
                      </div>

                      {/* MODEL NAME TITLE */}
                      <div style={{ background: '#f8fafc', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '0.65rem' }}>
                        <div style={{ fontSize: '10px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {modelTitleHeader}
                        </div>
                        <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', lineHeight: '1.35', margin: 0 }}>
                          {prod.name}
                        </h4>
                      </div>

                      {/* HIGHLIGHTED ROW BOX (DOMAIN SPECIFIC) */}
                      {prod.categoryId === 'interlock' ? (
                        <div style={{ background: 'linear-gradient(135deg, rgba(190, 24, 93, 0.2) 0%, rgba(157, 23, 77, 0.1) 100%)', border: '1px solid rgba(244, 114, 182, 0.4)', borderRadius: '6px', padding: '0.5rem 0.65rem', marginBottom: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '11px', color: '#fbcfe8', fontWeight: 800 }}>🔒 SENSOR TYPE:</span>
                          <span className="badge badge-accept" style={{ background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)', borderColor: '#f472b6', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                            FUEL CELL BREATHALYZER
                          </span>
                        </div>
                      ) : prod.categoryId === 'robotics' ? (
                        <div style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2) 0%, rgba(4, 120, 87, 0.1) 100%)', border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '6px', padding: '0.5rem 0.65rem', marginBottom: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '11px', color: '#d1fae5', fontWeight: 800 }}>🤖 NAVIGATION:</span>
                          <span className="badge badge-accept" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderColor: '#34d399', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                            LiDAR + 3D VISION SLAM
                          </span>
                        </div>
                      ) : prod.categoryId === 'drones' ? (
                        <div style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(67, 56, 202, 0.1) 100%)', border: '1px solid rgba(129, 140, 248, 0.4)', borderRadius: '6px', padding: '0.5rem 0.65rem', marginBottom: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '11px', color: '#e0e7ff', fontWeight: 800 }}>📡 DEFENSE RANGE:</span>
                          <span className="badge badge-accept" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)', borderColor: '#818cf8', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                            {prod.specs?.detectionRange || 5} KM RF RADIUS
                          </span>
                        </div>
                      ) : prod.categoryId === 'wildlife-pids' ? (
                        <div style={{ background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.2) 0%, rgba(180, 83, 9, 0.1) 100%)', border: '1px solid rgba(251, 191, 36, 0.4)', borderRadius: '6px', padding: '0.5rem 0.65rem', marginBottom: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '11px', color: '#fef3c7', fontWeight: 800 }}>🐘 SENSING TECH:</span>
                          <span className="badge badge-accept" style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', borderColor: '#fbbf24', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                            FIBER OPTIC ACOUSTIC DAS
                          </span>
                        </div>
                      ) : prod.categoryId === 'solar' ? (
                        <div style={{ background: 'linear-gradient(135deg, rgba(202, 138, 4, 0.2) 0%, rgba(161, 98, 7, 0.1) 100%)', border: '1px solid rgba(250, 204, 21, 0.4)', borderRadius: '6px', padding: '0.5rem 0.65rem', marginBottom: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '11px', color: '#fef9c3', fontWeight: 800 }}>☀️ CELL TECH:</span>
                          <span className="badge badge-accept" style={{ background: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)', borderColor: '#facc15', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                            N-TYPE TOPCON BIFACIAL
                          </span>
                        </div>
                      ) : prod.categoryId === 'biometrics' ? (
                        <div style={{ background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.2) 0%, rgba(15, 118, 110, 0.1) 100%)', border: '1px solid rgba(45, 212, 191, 0.4)', borderRadius: '6px', padding: '0.5rem 0.65rem', marginBottom: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '11px', color: '#ccfbf1', fontWeight: 800 }}>👆 COMPLIANCE:</span>
                          <span className="badge badge-accept" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', borderColor: '#2dd4bf', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                            UIDAI & BIS CERTIFIED
                          </span>
                        </div>
                      ) : prod.categoryId === 'idp-display' ? (
                        <div style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(109, 40, 217, 0.1) 100%)', border: '1px solid rgba(167, 139, 250, 0.4)', borderRadius: '6px', padding: '0.5rem 0.65rem', marginBottom: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '11px', color: '#ede9fe', fontWeight: 800 }}>🖥️ PANEL TYPE:</span>
                          <span className="badge badge-accept" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', borderColor: '#a78bfa', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                            4K ULTRA HD MULTI-TOUCH
                          </span>
                        </div>
                      ) : (
                        <div style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(3, 105, 161, 0.1) 100%)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '6px', padding: '0.5rem 0.65rem', marginBottom: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '11px', color: '#e0f2fe', fontWeight: 800, letterSpacing: '0.03em' }}>🌐 ONVIF PROFILE TYPE:</span>
                          <span className="badge badge-accept" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', borderColor: '#38bdf8', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                            ONVIF (PROFILE S, PROFILE G, PROFILE T)
                          </span>
                        </div>
                      )}

                      {/* FEATURE BULLETS (CATEGORY SPECIFIC) */}
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {prod.categoryId === 'interlock' ? (
                          <>
                            <div>🔒 <strong>Device Name:</strong> {prod.name}</div>
                            <div>🧪 <strong>Sensor Tech:</strong> Fuel Cell Alcohol Breathalyzer</div>
                            <div>⚡ <strong>Safety Feature:</strong> Engine Ignition Cutoff Interlock</div>
                            <div>🛡️ <strong>Anti-Tamper:</strong> Anti-Circumvention Vehicle Lock</div>
                          </>
                        ) : prod.categoryId === 'robotics' ? (
                          <>
                            <div>🤖 <strong>Robot Name:</strong> {prod.name}</div>
                            <div>🔋 <strong>Battery Life:</strong> {prod.specs?.batteryLife || 6} Hours Continuous</div>
                            <div>🧭 <strong>Navigation:</strong> LiDAR + 3D Vision SLAM</div>
                            <div>⚡ <strong>Charging:</strong> Autonomous Auto-Recharge Dock</div>
                          </>
                        ) : prod.categoryId === 'drones' ? (
                          <>
                            <div>🛩️ <strong>System Name:</strong> {prod.name}</div>
                            <div>📡 <strong>Detection Range:</strong> {prod.specs?.detectionRange || 5} Km Radius</div>
                            <div>🔋 <strong>Operational Time:</strong> {prod.specs?.flightTime || 180} Mins</div>
                            <div>🛡️ <strong>Housing:</strong> IP67 Tactical All-Weather Sealed</div>
                          </>
                        ) : prod.categoryId === 'wildlife-pids' ? (
                          <>
                            <div>🐘 <strong>Sensor System:</strong> {prod.name}</div>
                            <div>📏 <strong>Detection Range:</strong> {prod.specs?.detectionRangeKm || 25} Km Fiber Cable</div>
                            <div>🤖 <strong>AI Recognition:</strong> Real-Time Animal Pattern AI</div>
                          </>
                        ) : prod.categoryId === 'solar' ? (
                          <>
                            <div>☀️ <strong>Solar Module:</strong> {prod.name}</div>
                            <div>⚡ <strong>Wattage:</strong> {prod.specs?.wattage || 565} Wp</div>
                            <div>📊 <strong>Efficiency:</strong> {prod.specs?.efficiency || 21.9}% TOPCon</div>
                            <div>🛡️ <strong>Warranty:</strong> 30-Year Linear Warranty</div>
                          </>
                        ) : prod.categoryId === 'biometrics' ? (
                          <>
                            <div>👆 <strong>Terminal Name:</strong> {prod.name}</div>
                            <div>👥 <strong>User Capacity:</strong> {prod.specs?.userCapacity || 10000} Users</div>
                            <div>⚡ <strong>Matching Speed:</strong> {prod.specs?.verificationSpeed || 0.3}s Face</div>
                            <div>📡 <strong>Connectivity:</strong> 4G LTE Live GPS & Wi-Fi</div>
                          </>
                        ) : prod.categoryId === 'idp-display' ? (
                          <>
                            <div>🖥️ <strong>Display Panel:</strong> {prod.name}</div>
                            <div>📐 <strong>Screen Size:</strong> {prod.specs?.screenSize || 75}" Diagonal</div>
                            <div>👆 <strong>Touch Points:</strong> 20-Point Multi-Touch Glass</div>
                            <div>💻 <strong>OS:</strong> Dual Android & Windows OPS</div>
                          </>
                        ) : (
                          <>
                            <div>📷 <strong>Camera Name:</strong> {prod.name}</div>
                            <div>⚡ <strong>Res:</strong> {prod.specs?.resolution ? `${prod.specs.resolution}MP Realtime` : 'High Definition'}</div>
                            <div>🌐 <strong>Protocol:</strong> <span style={{ color: '#38bdf8', fontWeight: 700 }}>ONVIF (Profile S, Profile G, Profile T), InstaOn</span></div>
                            <div>🤖 <strong>AI Analytics:</strong> Human Body & Vehicle Detection</div>
                            <div>🔍 <strong>Lens:</strong> Motorized / Dual Light</div>
                            <div>🛡️ <strong>Housing:</strong> IP67 Weather & Lightning Protection</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS & DATASHEET LINK */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                      <button
                        onClick={() => setSelectedDatasheetProduct(prod)}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '11.5px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                      >
                        <FileText size={13} /> View Datasheet Brochure
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.25rem 0.45rem' }}
                        onClick={() => handleDeleteProduct(prod.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      );
    }

    return (
      <div className="card" style={{ flex: 1, width: '100%', overflowX: 'auto' }}>
        <div className="table-container">
          <table className="spec-table">
            <thead>
              <tr>
                <th style={{ width: '45px' }}>S.No</th>
                <th style={{ width: '260px' }}>Models</th>
                <th style={{ width: '160px' }}>OEM Brand / Make</th>
                <th style={{ width: '130px' }}>Megapixel (MP) / Spec</th>
                <th style={{ width: '180px' }}>ONVIF Profile M (AI Metadata)</th>
                <th style={{ width: '210px' }}>STQC Certification Datasheet</th>
                <th style={{ width: '120px' }}>Store Link</th>
                <th style={{ width: '60px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                    No products found matching active filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod, idx) => {
                  const datasheetPdfUrl = prod.link ? prod.link : (
                    (prod.brandMake || prod.vendor || '').includes('CP Plus')
                      ? `https://cpplusworld.com/prodassets/datasheet/${prod.sku}.pdf`
                      : `https://hrms.brihaspathi.in/datasheets/${prod.sku || prod.id}.pdf`
                  );
                  const isStqcCertified = prod.stqcCertified || prod.specs?.stqcCertified;
                  const isRareProfileM = prod.hasProfileM || prod.sku?.includes('TT41L3') || prod.sku?.includes('ME41L3') || prod.name?.toLowerCase().includes('anpr') || prod.name?.toLowerCase().includes('deepinview');

                  return (
                    <tr key={prod.id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                        {idx + 1}.
                      </td>

                      <td>
                        <div
                          onClick={() => setSelectedDatasheetProduct(prod)}
                          title="Click to view full technical specification datasheet brochure"
                          style={{ cursor: 'pointer', display: 'block' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#38bdf8', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                              {prod.name}
                            </span>
                            <FileText size={13} color="#38bdf8" />
                            {prod.isNewLaunch && (
                              <span className="badge badge-accept" style={{ background: 'rgba(236, 72, 153, 0.2)', borderColor: 'rgba(236, 72, 153, 0.5)', color: '#f472b6', fontSize: '9.5px', padding: '0.1rem 0.35rem' }}>
                                🚀 NEW LAUNCH 2026
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '0.15rem', fontWeight: 600 }}>
                            SKU: {prod.sku || 'N/A'}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#ffffff' }}>
                          {prod.brandMake || prod.vendor}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#34d399', marginTop: '0.1rem', fontWeight: 600 }}>
                          📦 {prod.availability || 'In Stock'}
                        </div>
                      </td>

                      <td>
                        {prod.specs?.resolution ? (
                          <span className="badge badge-accept" style={{ 
                            fontSize: '11px', padding: '0.25rem 0.6rem',
                            background: prod.specs.resolution >= 8 ? 'rgba(16, 185, 129, 0.2)' : (prod.specs.resolution >= 4 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(245, 158, 11, 0.2)'),
                            borderColor: prod.specs.resolution >= 8 ? '#10b981' : (prod.specs.resolution >= 4 ? '#38bdf8' : '#f59e0b'),
                            color: prod.specs.resolution >= 8 ? '#34d399' : (prod.specs.resolution >= 4 ? '#38bdf8' : '#fbbf24')
                          }}>
                            ⚡ {prod.specs.resolution} MP
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Spec: N/A</span>
                        )}
                      </td>

                      {/* SEPARATE COLUMN: ONVIF PROTOCOL PROFILE TYPE (EXACT DATASHEET SPEC) */}
                      <td>
                        {isRareProfileM ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span className="badge badge-accept" style={{ 
                              background: 'rgba(168, 85, 247, 0.18)', 
                              borderColor: 'rgba(168, 85, 247, 0.45)', 
                              color: '#c084fc', 
                              fontSize: '10.5px', 
                              padding: '0.2rem 0.5rem',
                              fontWeight: 700,
                              width: 'fit-content' 
                            }}>
                              🤖 ONVIF (Profile S, G, T, M)
                            </span>
                            <span style={{ fontSize: '9.5px', color: '#a78bfa' }}>
                              Rare AI Analytics Event Stream
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span className="badge badge-accept" style={{ 
                              background: 'rgba(56, 189, 248, 0.15)', 
                              borderColor: 'rgba(56, 189, 248, 0.35)', 
                              color: '#38bdf8', 
                              fontSize: '10.5px', 
                              padding: '0.2rem 0.5rem',
                              fontWeight: 700,
                              width: 'fit-content' 
                            }}>
                              🌐 ONVIF (Profile S, Profile G, Profile T)
                            </span>
                            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                              Exact Datasheet Standard Specification
                            </span>
                          </div>
                        )}
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          {isStqcCertified && (
                            <span className="badge badge-accept" style={{ fontSize: '10px', padding: '0.15rem 0.4rem', background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)', color: '#60a5fa', width: 'fit-content' }}>
                              🛡️ STQC CERTIFIED LAB APPROVED
                            </span>
                          )}

                          {prod.stqcPdfUrl ? (
                            <a 
                              href={prod.stqcPdfUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '10.5px', padding: '0.2rem 0.5rem', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)', width: 'fit-content' }}
                            >
                              📜 STQC Cert Datasheet PDF ↗
                            </a>
                          ) : isStqcCertified ? (
                            <a 
                              href="https://stqc.gov.in/"
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ fontSize: '10.5px', color: '#34d399', textDecoration: 'none' }}
                            >
                              🛡️ STQC Govt Portal Datasheet ↗
                            </a>
                          ) : (
                            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>STQC Datasheet: <strong>N/A</strong></span>
                          )}
                        </div>
                      </td>

                      <td>
                        {prod.fgTechStoreLink && !prod.fgTechStoreLink.includes('No products') ? (
                          <a 
                            href={prod.fgTechStoreLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '10.5px', padding: '0.2rem 0.45rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                          >
                            🛒 Buy Store Link ↗
                          </a>
                        ) : (
                          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Store Link: <strong>N/A</strong></span>
                        )}
                      </td>

                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.25rem 0.5rem' }}
                          onClick={() => handleDeleteProduct(prod.id)}
                        >
                          <Trash2 size={12} />
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
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Product Development Team</h2>
          {syncStatus && (
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="badge badge-accept" style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
                🟢 GOOGLE SHEET LIVE SYNCED
              </span>
              <span>
                {syncStatus.lastSynced ? `Last Synced: ${syncStatus.lastSynced} (${syncStatus.count} Products Loaded)` : 'Auto-Sync Active'}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          {onSyncGoogleSheet && (
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
              onClick={onSyncGoogleSheet}
              disabled={syncStatus?.loading}
            >
              {syncStatus?.loading ? '🔄 Syncing...' : '🔄 Sync Master Google Sheet'}
            </button>
          )}

          <button className="btn btn-secondary btn-sm" onClick={() => setShowUploadModal(true)}>
            <Upload size={15} /> 🔗 Connect New Sheet / Upload CSV
          </button>

          <button className="btn btn-primary btn-sm" onClick={() => {
            handleCategorySelectForAdd(categories[0].id);
            setShowAddModal(true);
          }}>
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* TOOLBAR WITH TOGGLE SIDE PANEL BUTTON */}
      <div className="card" style={{ padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* OFFCANVAS SIDE PANEL TOGGLE BUTTON */}
          <button 
            className={`btn ${showOffcanvasFilter ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={showOffcanvasFilter ? { background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' } : {}}
            onClick={() => setShowOffcanvasFilter(!showOffcanvasFilter)}
          >
            <Sliders size={15} /> {showOffcanvasFilter ? '👈 Hide Side Filter Panel' : '👉 Show Side Filter Panel'}
          </button>

          {/* ACTIVE DOMAIN & SUBTYPE BADGES */}
          {activeCategoryFilter !== 'ALL' && (
            <span className="badge badge-accept" style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Domain: <strong>{getCategoryName(activeCategoryFilter)}</strong>
              <X size={12} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setActiveCategoryFilter('ALL')} />
            </span>
          )}

          {cameraTypeFilter !== 'ALL' && (
            <span className="badge badge-accept" style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Type: <strong>{cameraTypeFilter}</strong>
              <X size={12} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => setCameraTypeFilter('ALL')} />
            </span>
          )}

          {/* OEM BRAND SELECTOR */}
          <select 
            className="form-select" 
            style={{ width: '180px', padding: '0.35rem 0.6rem', fontSize: '12px' }}
            value={activeBrandFilter}
            onChange={(e) => setActiveBrandFilter(e.target.value)}
          >
            <option value="ALL">All OEM Brands ({products.length})</option>
            {availableBrands.map(b => (
              <option key={b} value={b}>{b} ({products.filter(p => (p.brandMake || p.vendor).includes(b)).length})</option>
            ))}
          </select>

          <button 
            className={`btn ${stqcOnlyFilter ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={stqcOnlyFilter ? { background: 'rgba(59, 130, 246, 0.9)' } : { fontSize: '12px' }}
            onClick={() => setStqcOnlyFilter(!stqcOnlyFilter)}
          >
            <Award size={13} /> STQC Certified Only ({products.filter(p => p.stqcCertified || p.specs?.stqcCertified).length})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* VIEW MODE TOGGLE BUTTONS (VISUAL CATALOG SHOWCASE vs DATA TABLE) */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '0.2rem', border: '1px solid var(--border-color)' }}>
            <button 
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.3rem 0.65rem', fontSize: '11.5px', borderRadius: '6px' }}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={13} /> Visual Catalog Showcase
            </button>
            <button 
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.3rem 0.65rem', fontSize: '11.5px', borderRadius: '6px' }}
              onClick={() => setViewMode('table')}
            >
              <FileSpreadsheet size={13} /> Data Table View
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '210px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search SKU or camera..."
              style={{ paddingLeft: '2.1rem', padding: '0.35rem 0.65rem', fontSize: '12px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SPLIT 2-COLUMN VIEW: LEFT OFFCANVAS FILTER PANEL + RIGHT LIVE PRODUCTS TABLE */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        {/* LEFT HAND SIDE OFFCANVAS FILTER PANEL */}
        {showOffcanvasFilter && (
          <div 
            className="card"
            style={{
              width: '320px',
              minWidth: '320px',
              background: '#121826',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.1rem',
              gap: '1.15rem',
              position: 'sticky',
              top: '1.5rem'
            }}
          >
            {/* Panel Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sliders size={16} color="#818cf8" /> Filter Domains & Types
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Click to filter live table &rarr;
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.4rem' }} onClick={() => setShowOffcanvasFilter(false)}>
                <X size={14} />
              </button>
            </div>

            {/* Reset Option */}
            <button 
              className={`btn ${activeCategoryFilter === 'ALL' && cameraTypeFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ width: '100%', justifyContent: 'flex-start' }}
              onClick={() => {
                setActiveCategoryFilter('ALL');
                setCameraTypeFilter('ALL');
              }}
            >
              <RefreshCw size={14} /> Reset All Filters ({products.length})
            </button>

            {/* SECTION 1: MASTER PRODUCT CATEGORY DOMAINS */}
            <div>
              <div style={{ fontSize: '10.5px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
                📦 Product Category Domains:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <button 
                  className={`btn ${activeCategoryFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ 
                    justify: 'flex-start', 
                    fontSize: '11.5px', 
                    fontWeight: 800, 
                    background: activeCategoryFilter === 'ALL' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(255,255,255,0.04)',
                    borderColor: activeCategoryFilter === 'ALL' ? '#818cf8' : 'rgba(255,255,255,0.1)'
                  }}
                  onClick={() => handleSelectCategoryDomain('ALL')}
                >
                  🌐 All Product Category Domains ({products.length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'cctv' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => handleSelectCategoryDomain('cctv')}
                >
                  📷 CCTV Cameras & Surveillance ({products.filter(p => p.categoryId === 'cctv').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'robotics' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px', color: '#38bdf8' }}
                  onClick={() => handleSelectCategoryDomain('robotics')}
                >
                  🤖 Robotics & Autonomous Service ({products.filter(p => p.categoryId === 'robotics').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'drones' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px', color: '#34d399' }}
                  onClick={() => handleSelectCategoryDomain('drones')}
                >
                  🛩️ Drones, Anti-Drone & Robot Dogs ({products.filter(p => p.categoryId === 'drones').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'wildlife-pids' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px', color: '#fbbf24' }}
                  onClick={() => handleSelectCategoryDomain('wildlife-pids')}
                >
                  🐘 Wildlife & Perimeter PIDS ({products.filter(p => p.categoryId === 'wildlife-pids').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'transit-surveillance' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => handleSelectCategoryDomain('transit-surveillance')}
                >
                  🚌 Transit Fleet & MDVR ({products.filter(p => p.categoryId === 'transit-surveillance').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'interlock' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px', color: '#f472b6' }}
                  onClick={() => handleSelectCategoryDomain('interlock')}
                >
                  🔒 Ignition Interlock Devices ({products.filter(p => p.categoryId === 'interlock').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'solar' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => handleSelectCategoryDomain('solar')}
                >
                  ☀️ Rooftop Solar & PV Systems ({products.filter(p => p.categoryId === 'solar').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'biometrics' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => handleSelectCategoryDomain('biometrics')}
                >
                  👆 Biometric Access & Smart Gates ({products.filter(p => p.categoryId === 'biometrics').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'idp-display' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px', color: '#a78bfa' }}
                  onClick={() => handleSelectCategoryDomain('idp-display')}
                >
                  🖥️ Interactive Display Panels (IDP) ({products.filter(p => p.categoryId === 'idp-display').length})
                </button>
              </div>
            </div>

            {/* SECTION 2: SPECIFIC HARDWARE MODEL SUB-TYPES (CONTEXTUAL TO ACTIVE DOMAIN) */}
            <div>
              <div style={{ fontSize: '10.5px', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
                🎯 Hardware Sub-Types:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {activeCategoryFilter === 'robotics' ? (
                  <>
                    <button 
                      className={`btn ${cameraTypeFilter === 'Delivery & Hospitality' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('Delivery & Hospitality')}
                    >
                      🍱 Delivery & Hospitality ({domainProducts.filter(p => p.name.toLowerCase().includes('delivery') || p.name.toLowerCase().includes('hospitality')).length})
                    </button>
                    <button 
                      className={`btn ${cameraTypeFilter === 'Floor Scrubber' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('Floor Scrubber')}
                    >
                      🧽 Commercial Floor Scrubbers ({domainProducts.filter(p => p.name.toLowerCase().includes('scrub')).length})
                    </button>
                    <button 
                      className={`btn ${cameraTypeFilter === 'AMR Sweeper' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('AMR Sweeper')}
                    >
                      🧹 Industrial AMR Sweepers ({domainProducts.filter(p => p.name.toLowerCase().includes('sweep')).length})
                    </button>
                    <button 
                      className={`btn ${cameraTypeFilter === 'Cleaning System' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('Cleaning System')}
                    >
                      ✨ Autonomous Cleaning Systems ({domainProducts.filter(p => p.name.toLowerCase().includes('clean') || p.name.toLowerCase().includes('kira')).length})
                    </button>
                  </>
                ) : activeCategoryFilter === 'drones' ? (
                  <>
                    <button 
                      className={`btn ${cameraTypeFilter === 'Anti-Drone Jammer' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('Anti-Drone Jammer')}
                    >
                      📡 Anti-Drone RF Jammers ({domainProducts.filter(p => p.name.toLowerCase().includes('anti-drone') || p.name.toLowerCase().includes('ardronis')).length})
                    </button>
                    <button 
                      className={`btn ${cameraTypeFilter === 'Robot Dog' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('Robot Dog')}
                    >
                      🐕 Quadruped Security Dogs ({domainProducts.filter(p => p.name.toLowerCase().includes('quadruped') || p.name.toLowerCase().includes('dog')).length})
                    </button>
                  </>
                ) : activeCategoryFilter === 'wildlife-pids' ? (
                  <>
                    <button 
                      className={`btn ${cameraTypeFilter === 'Fiber DAS' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('Fiber DAS')}
                    >
                      🌐 Fiber Optic Acoustic DAS ({domainProducts.filter(p => p.name.toLowerCase().includes('fiber') || p.name.toLowerCase().includes('das')).length})
                    </button>
                    <button 
                      className={`btn ${cameraTypeFilter === 'Animal Repellent' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('Animal Repellent')}
                    >
                      ☀️ Solar Animal Repellents ({domainProducts.filter(p => p.name.toLowerCase().includes('aniders') || p.name.toLowerCase().includes('solar')).length})
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className={`btn ${cameraTypeFilter === 'Bullet Camera' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('Bullet Camera')}
                    >
                      🎯 Bullet Cameras ({domainProducts.filter(p => p.name.toLowerCase().includes('bullet')).length})
                    </button>
                    <button 
                      className={`btn ${cameraTypeFilter === 'Dome Camera' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('Dome Camera')}
                    >
                      🔮 Dome Cameras ({domainProducts.filter(p => p.name.toLowerCase().includes('dome') && !p.name.toLowerCase().includes('vandal')).length})
                    </button>
                    <button 
                      className={`btn ${cameraTypeFilter === 'Vandal Dome' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('Vandal Dome')}
                    >
                      🛡️ Vandal Dome Cameras ({domainProducts.filter(p => p.name.toLowerCase().includes('vandal')).length})
                    </button>
                    <button 
                      className={`btn ${cameraTypeFilter === '4K Bullet' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('4K Bullet')}
                    >
                      ⚡ 4K Ultra HD Cameras ({domainProducts.filter(p => p.name.toLowerCase().includes('4k') || p.specs?.resolution >= 8).length})
                    </button>
                    <button 
                      className={`btn ${cameraTypeFilter === 'AI & ANPR' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('AI & ANPR')}
                    >
                      🚨 AI Enforcement & ANPR ({domainProducts.filter(p => p.name.toLowerCase().includes('anpr') || p.name.toLowerCase().includes('ai')).length})
                    </button>
                    <button 
                      className={`btn ${cameraTypeFilter === 'PTZ & Fisheye' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                      onClick={() => setCameraTypeFilter('PTZ & Fisheye')}
                    >
                      🔄 PTZ & Fisheye Cameras ({domainProducts.filter(p => p.name.toLowerCase().includes('ptz') || p.name.toLowerCase().includes('fisheye')).length})
                    </button>
                  </>
                )}
              </div>
            </div>
      </div>
      )}

      {/* RIGHT HAND SIDE LIVE MAIN PRODUCTS VIEW (VISUAL GRID SHOWCASE vs DATA TABLE) */}
      {renderProductsView()}
      </div>

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
            
            <form onSubmit={handleCreateProduct}>
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
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
                    {selectedDatasheetProduct.name}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDatasheetProduct(null)}
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#ffffff', color: '#0f172a' }}>
              {/* Main Info Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.25rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', borderRadius: '8px', padding: '0.75rem', border: '1px solid #e2e8f0' }}>
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
                    <div style={{ background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>UNIT PRICE</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669' }}>${selectedDatasheetProduct.specs?.maxPrice || 350} USD</div>
                    </div>
                    <div style={{ background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>HOUSING / ENCLOSURE</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284c7' }}>{selectedDatasheetProduct.specs?.ipRating || 'IP67 Weatherproof'}</div>
                    </div>
                    <div style={{ background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>AVAILABILITY</div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{selectedDatasheetProduct.availability || 'In Stock Batch Ready'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Specifications Table */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1rem', background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', fontWeight: 800, color: '#0284c7', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📋 DETAILED TECHNICAL SPECIFICATIONS MATRIX</span>
                  <span>MODEL: {selectedDatasheetProduct.sku || selectedDatasheetProduct.id}</span>
                </div>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <tbody>
                    {Object.entries(selectedDatasheetProduct.specs || {}).map(([key, val], idx) => (
                      <tr key={key} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                        <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: '#64748b', textTransform: 'capitalize', width: '40%' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </td>
                        <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                          {typeof val === 'boolean' ? (val ? '✅ Yes (Supported / Certified)' : '❌ No') : String(val)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: '#64748b' }}>OEM Support Contact</td>
                      <td style={{ padding: '0.6rem 1rem', fontWeight: 800, color: '#0284c7' }}>
                        {selectedDatasheetProduct.oemEmail || 'sales.india@cpplusworld.com'} ({selectedDatasheetProduct.oemPhone || '+91 40 6888 9999'})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

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
