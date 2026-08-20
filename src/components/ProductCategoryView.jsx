import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wand2, X, Printer, ExternalLink } from 'lucide-react';

export default function ProductCategoryView({ products, categories }) {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [selectedDatasheetProduct, setSelectedDatasheetProduct] = useState(null);

  const decodedCategoryName = decodeURIComponent(categoryId);

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
    const c = categories.find(c => c.id === catId);
    return c ? c.name : 'Uncategorized';
  };

  const prods = useMemo(() => {
    return products.filter(p => {
      const catName = getCategoryName(p.categoryId);
      return catName === decodedCategoryName;
    });
  }, [products, categories, decodedCategoryName]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeInUp 0.4s ease' }}>
      
      {/* Back Navigation */}
      <div>
        <button 
          onClick={() => navigate('/products')}
          className="btn btn-secondary"
          style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569', color: '#e2e8f0', fontSize: '14px', padding: '0.5rem 1rem' }}
        >
          ← Back to Global Nexus
        </button>
      </div>

      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '1rem 0', position: 'relative' 
      }}>
        {/* Root Node: Selected Category */}
        <div style={{ zIndex: 10, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '1.5rem 4rem', borderRadius: '12px', border: '1px solid #38bdf8', boxShadow: '0 0 50px rgba(56, 189, 248, 0.3)', textAlign: 'center', color: '#fff', position: 'relative' }}>
          <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 800, letterSpacing: '3px', marginBottom: '0.4rem', textTransform: 'uppercase' }}>CATEGORY DOMAIN</div>
          <div style={{ fontSize: '2rem', fontWeight: 900 }}>{decodedCategoryName}</div>
        </div>

        <div style={{ width: '2px', height: '60px', background: 'linear-gradient(to bottom, #38bdf8, #475569)', zIndex: 5 }}></div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem', width: '100%', maxWidth: '1400px', zIndex: 10 }}>
          {prods.map((prod) => (
            <div key={prod.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '2px', height: '30px', background: '#475569' }}></div>
              <div 
                onClick={() => setSelectedDatasheetProduct(prod)}
                style={{ 
                  background: '#1e293b', border: '1px solid #475569', borderRadius: '12px', padding: '1.5rem', width: '100%', cursor: 'pointer',
                  transition: 'all 0.2s ease', position: 'relative'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.boxShadow = '0 0 30px rgba(129, 140, 248, 0.4)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#475569'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Wand2 size={12} /> AGENTIC MATCH
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', lineHeight: '1.4', marginBottom: '0.5rem' }}>{prod.name}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>SKU: <span style={{ color: '#cbd5e1' }}>{prod.sku || 'N/A'}</span></div>
                {prod.specs?.maxPrice && (
                  <div style={{ fontSize: '14px', color: '#10b981', fontWeight: 900, marginTop: '1rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 0.75rem', borderRadius: '6px', display: 'inline-block' }}>
                    ₹{prod.specs.maxPrice.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded Interactive Datasheet Modal */}
      {selectedDatasheetProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', animation: 'fadeInUp 0.3s ease' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-conditional" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
                    {decodedCategoryName}
                  </span>
                  <span className="badge badge-conditional" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    OEM Confirmed
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-heading)', margin: 0 }}>{selectedDatasheetProduct.name}</h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '0.2rem' }}>SKU: {selectedDatasheetProduct.sku || 'N/A'} | ID: {selectedDatasheetProduct.id}</div>
              </div>
              <button onClick={() => setSelectedDatasheetProduct(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.75rem' }}>
              <div className="grid-cols-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                  <h4 style={{ fontSize: '12px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.85rem', letterSpacing: '0.05em' }}>Technical Specifications</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {Object.entries(selectedDatasheetProduct.specs || {}).filter(([k]) => !k.toLowerCase().includes('price')).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(148, 163, 184, 0.2)', paddingBottom: '0.35rem' }}>
                        <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '13px' }}>{k}</span>
                        <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px' }}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <h4 style={{ fontSize: '12px', color: '#34d399', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Estimated Unit Pricing</h4>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34d399' }}>
                      ₹{selectedDatasheetProduct.specs?.maxPrice ? selectedDatasheetProduct.specs.maxPrice.toLocaleString('en-IN') : 'Contact OEM'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#a7f3d0', marginTop: '0.35rem' }}>*Rate aggregated from historical purchase orders & catalog specs</div>
                  </div>

                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                    <h4 style={{ fontSize: '12px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.65rem', letterSpacing: '0.05em' }}>Compliance & Sourcing</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8', fontWeight: 600 }}>Preferred Vendor:</span>
                        <span style={{ color: '#ffffff', fontWeight: 800 }}>{selectedDatasheetProduct.vendor || selectedDatasheetProduct.brandMake || 'Brihaspathi OEM'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8', fontWeight: 600 }}>Testing / Certification:</span>
                        <span style={{ color: '#34d399', fontWeight: 800 }}>{selectedDatasheetProduct.testingStatus || (selectedDatasheetProduct.stqcCertified ? 'STQC Certified' : 'Verified')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8', fontWeight: 600 }}>Availability:</span>
                        <span style={{ color: '#38bdf8', fontWeight: 800 }}>{selectedDatasheetProduct.availability || 'In Stock'}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
