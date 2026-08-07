import React, { useState } from 'react';
import { 
  Plus, Upload, Layers, Trash2, Search, ExternalLink, FileSpreadsheet, Check, Wand2, FileText, ArrowDown, Award, Filter, ShieldCheck, Download, Camera, Sun, Fingerprint, Plane, Bus, Link, Sliders, X, CheckCircle2, RefreshCw, ChevronRight, Grid, Printer
} from 'lucide-react';
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

const cameraImageList = [
  cpUncTe81Img,
  cpVandalDomeImg,
  cpCompactBulletImg,
  cpWedgeImg,
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

  function getProductThumbnail(prod) {
    const skuUpper = (prod.sku || prod.name || '').toUpperCase();

    // 1-TO-1 EXACT DATASHEET MODEL SKU IMAGE MAPPINGS
    if (skuUpper.includes('TE81ZL6C') || skuUpper.includes('TC41ZL6C')) return cpUncTe81Img;
    if (skuUpper.includes('VC21L5C') || skuUpper.includes('VC41L5C') || skuUpper.includes('VANDAL')) return cpVandalDomeImg;
    if (skuUpper.includes('TC41L5C') || skuUpper.includes('TC21L5C')) return cpCompactBulletImg;
    if (skuUpper.includes('WC41L3C') || skuUpper.includes('WEDGE')) return cpWedgeImg;
    if (skuUpper.includes('DA41') || skuUpper.includes('DA21') || skuUpper.includes('TURRET')) return turretWhiteImg;
    if (skuUpper.includes('TA41') || skuUpper.includes('TA21')) return stqcImg;

    if (prod.sku === 'BA-ND4AB120M') return domeMountImg;
    if (prod.sku === 'BA-NW20A120M') return deepinviewImg;
    if (prod.sku === 'BA-NW4A120M') return stqcImg;
    if (prod.sku === 'BA-NW4A120MS-HL') return colorvuBulletImg;
    if (prod.sku === 'BA-ND4AB120MS-FL') return colorvuDomeImg;
    if (prod.sku === 'BA-ND4AB80RLS-FL') return turretWhiteImg;
    if (prod.sku === 'BA-NW4AA40D') return panoramic180Img;

    if (prod.imageKey === 'banovision_deepinview_bullet') return deepinviewImg;
    if (prod.imageKey === 'banovision_colorvu_dome') return colorvuDomeImg;
    if (prod.imageKey === 'panoramic_dual_lens') return panoramicDualImg;
    if (prod.imageKey === 'bano_dome_mount') return domeMountImg;
    if (prod.imageKey === 'bano_colorvu_bullet') return colorvuBulletImg;
    if (prod.imageKey === 'bano_panoramic_180') return panoramic180Img;
    if (prod.imageKey === 'bano_turret_white') return turretWhiteImg;

    // Hash SKU to assign a distinct image from the 12 camera photos
    const skuStr = prod.sku || prod.name || '0';
    let hash = 0;
    for (let i = 0; i < skuStr.length; i++) {
      hash = (hash << 5) - hash + skuStr.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % cameraImageList.length;
    return cameraImageList[index];
  }
  
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

  const availableBrands = Array.from(new Set(products.map(p => p.brandMake || p.vendor).filter(Boolean)));

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
          const legacyParsed = parseCSVFile(content, targetCategory);
          setProducts([...legacyParsed, ...products]);
          alert(`Successfully imported ${legacyParsed.length} products!`);
          setShowUploadModal(false);
        }
      } else {
        const extracted = extractSpecsFromText(content, targetCategory);
        const singleProd = {
          id: `prod-txt-${Date.now()}`,
          name: extracted.name || file.name.replace(/\.[^/.]+$/, ""),
          vendor: extracted.vendor,
          sku: extracted.sku,
          categoryId: targetCategory.id,
          specs: extracted.specs,
          notes: `Auto-extracted specs from ${file.name}`
        };
        setProducts([singleProd, ...products]);
        alert(`Successfully auto-extracted product "${singleProd.name}" from text file!`);
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
    const matchesStqc = !stqcOnlyFilter || p.stqcCertified || p.specs?.stqcCertified;
    const matchesSearch = nameLower.includes(searchQuery.toLowerCase()) || 
                          (p.vendor || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesSubtype = true;
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
    } else if (cameraTypeFilter === 'Mobile Camera') {
      matchesSubtype = nameLower.includes('mobile') || nameLower.includes('transit');
    } else if (cameraTypeFilter === 'PTZ & Fisheye') {
      matchesSubtype = nameLower.includes('ptz') || nameLower.includes('fisheye');
    } else if (cameraTypeFilter === 'Solar Module') {
      matchesSubtype = p.categoryId === 'solar' || nameLower.includes('solar') || nameLower.includes('pv');
    } else if (cameraTypeFilter === 'UAV Drone') {
      matchesSubtype = p.categoryId === 'drones' || nameLower.includes('drone') || nameLower.includes('uav');
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
              const datasheetPdfUrl = prod.link || `https://cpplusworld.com/search?q=${encodeURIComponent(prod.sku || prod.name)}`;
              const isStqcCertified = prod.stqcCertified || prod.specs?.stqcCertified;

              let seriesTag = '12MP DEEPIN VIEW SERIES';
              let seriesBg = '#dc2626';

              if (prod.name?.includes('ColorVu') || prod.notes?.includes('ColorVu')) {
                seriesTag = 'COLORVU 24/7 FULL COLOR';
                seriesBg = '#ea580c';
              } else if (prod.name?.includes('Panoramic') || prod.name?.includes('180°')) {
                seriesTag = '180° DUAL LENS PANORAMA';
                seriesBg = '#7c3aed';
              } else if (prod.brandMake?.includes('CP Plus')) {
                seriesTag = 'STQC GOVT LAB CERTIFIED';
                seriesBg = '#0284c7';
              } else if (prod.categoryId === 'robotics') {
                seriesTag = 'AUTONOMOUS ROBOTICS';
                seriesBg = '#059669';
              } else if (prod.categoryId === 'drones') {
                seriesTag = 'UAV & ANTI-DRONE DEFENSE';
                seriesBg = '#4f46e5';
              }

              // Determine exact ONVIF Profile match from deep datasheet research
              const hasProfileM = prod.hasProfileM || prod.sku?.includes('TT41L3') || prod.sku?.includes('ME41L3') || prod.sku?.includes('BA-ND4AB120M') || prod.name?.toLowerCase().includes('anpr') || prod.name?.toLowerCase().includes('deepinview');
              const onvifText = hasProfileM ? 'ONVIF (Profile S, Profile G, Profile T, Profile M)' : 'ONVIF (Profile S, Profile G, Profile T)';

              return (
                <div 
                  key={prod.id}
                  className="card"
                  style={{ 
                    padding: '0', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    background: '#0d131f', 
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    position: 'relative'
                  }}
                >
                  {/* RED SERIES BANNER (BROCHURE STYLE FROM PHOTO) */}
                  <div style={{ background: seriesBg, color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '0.4rem 0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{seriesTag}</span>
                    {isStqcCertified && <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.25)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>🛡️ STQC APPROVED</span>}
                  </div>

                  {/* CLICKABLE PRODUCT IMAGE THUMBNAIL (OPENS DATASHEET PDF IN NEW TAB) */}
                  <a
                    href={datasheetPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Click to view ${prod.name} Datasheet PDF`}
                    style={{ 
                      background: '#090d16', 
                      padding: '1rem', 
                      display: 'flex', 
                      justify: 'center', 
                      alignItems: 'center', 
                      height: '170px', 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      position: 'relative',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                  >
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
                      <ExternalLink size={10} /> Datasheet PDF
                    </div>
                  </a>

                  {/* PRODUCT DETAILS */}
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
                    <div>
                      {/* CAMERA NAME & BRAND */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span className="badge badge-accept" style={{ background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '11px', fontWeight: 700 }}>
                          🏷️ SKU: {prod.sku || 'N/A'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 700 }}>
                          🏢 {prod.brandMake || prod.vendor}
                        </span>
                      </div>

                      {/* PROMINENT CAMERA NAME TITLE */}
                      <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.25)', marginBottom: '0.65rem' }}>
                        <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          📷 CAMERA MODEL NAME:
                        </div>
                        <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff', lineHeight: '1.35', margin: 0 }}>
                          {prod.name}
                        </h4>
                      </div>

                      {/* DEDICATED HIGHLIGHTED ONVIF PROFILE TYPE ROW BOX (EXACT DATASHEET SPECIFICATION) */}
                      <div style={{ 
                        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(3, 105, 161, 0.1) 100%)', 
                        border: '1px solid rgba(56, 189, 248, 0.35)', 
                        borderRadius: '6px', 
                        padding: '0.5rem 0.65rem', 
                        marginBottom: '0.55rem',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ fontSize: '11px', color: '#e0f2fe', fontWeight: 800, letterSpacing: '0.03em' }}>
                          🌐 ONVIF PROFILE TYPE:
                        </span>
                        <span className="badge badge-accept" style={{ 
                          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', 
                          borderColor: '#38bdf8', 
                          color: '#ffffff', 
                          fontSize: '10px', 
                          fontWeight: 800, 
                          padding: '0.2rem 0.5rem',
                          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                        }}>
                          ONVIF (PROFILE S, PROFILE G, PROFILE T)
                        </span>
                      </div>

                      {/* FEATURE BULLETS FROM PHOTO BROCHURE */}
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>📷 <strong>Camera Name:</strong> {prod.name}</div>
                        <div>⚡ <strong>Res:</strong> {prod.specs?.resolution ? `${prod.specs.resolution}MP Realtime` : 'High Definition'}</div>
                        <div>🌐 <strong>Protocol:</strong> <span style={{ color: '#38bdf8', fontWeight: 700 }}>ONVIF (Profile S, Profile G, Profile T), InstaOn, TLS v1.2/v1.3</span></div>
                        <div>🤖 <strong>AI Analytics:</strong> Human Body & Vehicle Detection</div>
                        <div>🔍 <strong>Lens:</strong> Motorized / Dual Light</div>
                        <div>🛡️ <strong>Housing:</strong> IP67 Weather & Lightning Protection</div>
                      </div>
                    </div>

                    {/* ACTIONS & DATASHEET LINK */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                      <a
                        href={datasheetPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '11.5px', background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}
                      >
                        <FileText size={13} /> Datasheet PDF ↗
                      </a>
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
                  const datasheetPdfUrl = prod.link || `https://cpplusworld.com/search?q=${encodeURIComponent(prod.sku || prod.name)}`;
                  const isStqcCertified = prod.stqcCertified || prod.specs?.stqcCertified;
                  const isRareProfileM = prod.hasProfileM || prod.sku?.includes('TT41L3') || prod.sku?.includes('ME41L3') || prod.name?.toLowerCase().includes('anpr') || prod.name?.toLowerCase().includes('deepinview');

                  return (
                    <tr key={prod.id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                        {idx + 1}.
                      </td>

                      <td>
                        <a
                          href={datasheetPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', display: 'block' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#38bdf8', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                              {prod.name}
                            </span>
                            <ExternalLink size={12} color="#38bdf8" />
                            {prod.isNewLaunch && (
                              <span className="badge badge-accept" style={{ background: 'rgba(236, 72, 153, 0.2)', borderColor: 'rgba(236, 72, 153, 0.5)', color: '#f472b6', fontSize: '9.5px', padding: '0.1rem 0.35rem' }}>
                                🚀 NEW LAUNCH 2026
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '0.15rem', fontWeight: 600 }}>
                            SKU: {prod.sku || 'N/A'}
                          </div>
                        </a>
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
                  className={`btn ${activeCategoryFilter === 'cctv' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => { setActiveCategoryFilter('cctv'); setCameraTypeFilter('ALL'); }}
                >
                  📷 CCTV Cameras & Surveillance ({products.filter(p => p.categoryId === 'cctv').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'robotics' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px', color: '#38bdf8' }}
                  onClick={() => { setActiveCategoryFilter('robotics'); setCameraTypeFilter('ALL'); }}
                >
                  🤖 Robotics & Autonomous Service ({products.filter(p => p.categoryId === 'robotics').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'drones' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px', color: '#34d399' }}
                  onClick={() => { setActiveCategoryFilter('drones'); setCameraTypeFilter('ALL'); }}
                >
                  🛩️ Drones, Anti-Drone & Robot Dogs ({products.filter(p => p.categoryId === 'drones').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'wildlife-pids' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px', color: '#fbbf24' }}
                  onClick={() => { setActiveCategoryFilter('wildlife-pids'); setCameraTypeFilter('ALL'); }}
                >
                  🐘 Wildlife & Perimeter PIDS ({products.filter(p => p.categoryId === 'wildlife-pids').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'transit-surveillance' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => { setActiveCategoryFilter('transit-surveillance'); setCameraTypeFilter('ALL'); }}
                >
                  🚌 Transit Fleet & MDVR ({products.filter(p => p.categoryId === 'transit-surveillance').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'interlock' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px', color: '#f472b6' }}
                  onClick={() => { setActiveCategoryFilter('interlock'); setCameraTypeFilter('ALL'); }}
                >
                  🔒 Ignition Interlock Devices ({products.filter(p => p.categoryId === 'interlock').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'solar' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => { setActiveCategoryFilter('solar'); setCameraTypeFilter('ALL'); }}
                >
                  ☀️ Rooftop Solar & PV Systems ({products.filter(p => p.categoryId === 'solar').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'biometrics' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => { setActiveCategoryFilter('biometrics'); setCameraTypeFilter('ALL'); }}
                >
                  👆 Biometric Access & Smart Gates ({products.filter(p => p.categoryId === 'biometrics').length})
                </button>

                <button 
                  className={`btn ${activeCategoryFilter === 'idp-display' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px', color: '#a78bfa' }}
                  onClick={() => { setActiveCategoryFilter('idp-display'); setCameraTypeFilter('ALL'); }}
                >
                  🖥️ Interactive Display Panels (IDP) ({products.filter(p => p.categoryId === 'idp-display').length})
                </button>
              </div>
            </div>

            {/* SECTION 2: SPECIFIC HARDWARE MODEL SUB-TYPES */}
            <div>
              <div style={{ fontSize: '10.5px', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
                🎯 Specific Hardware Sub-Types:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <button 
                  className={`btn ${cameraTypeFilter === 'Bullet Camera' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => setCameraTypeFilter('Bullet Camera')}
                >
                  🎯 Bullet Cameras ({products.filter(p => p.name.toLowerCase().includes('bullet')).length})
                </button>

                <button 
                  className={`btn ${cameraTypeFilter === 'Dome Camera' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => setCameraTypeFilter('Dome Camera')}
                >
                  🔮 Dome Cameras ({products.filter(p => p.name.toLowerCase().includes('dome') && !p.name.toLowerCase().includes('vandal')).length})
                </button>

                <button 
                  className={`btn ${cameraTypeFilter === 'Vandal Dome' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => setCameraTypeFilter('Vandal Dome')}
                >
                  🛡️ Vandal Dome Cameras ({products.filter(p => p.name.toLowerCase().includes('vandal')).length})
                </button>

                <button 
                  className={`btn ${cameraTypeFilter === '4K Bullet' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => setCameraTypeFilter('4K Bullet')}
                >
                  ⚡ 4K Ultra HD Cameras ({products.filter(p => p.name.toLowerCase().includes('4k') || p.specs?.resolution >= 8).length})
                </button>

                <button 
                  className={`btn ${cameraTypeFilter === 'AI & ANPR' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
                  onClick={() => setCameraTypeFilter('AI & ANPR')}
                >
                  🚨 AI Enforcement & ANPR ({products.filter(p => p.name.toLowerCase().includes('anpr') || p.name.toLowerCase().includes('ai')).length})
                </button>

                <button 
              className={`btn ${cameraTypeFilter === 'PTZ & Fisheye' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ justifyContent: 'flex-start', fontSize: '11.5px' }}
              onClick={() => setCameraTypeFilter('PTZ & Fisheye')}
            >
              🔄 PTZ & Fisheye Cameras ({products.filter(p => p.name.toLowerCase().includes('ptz') || p.name.toLowerCase().includes('fisheye')).length})
            </button>
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
    </div>
  );
}
