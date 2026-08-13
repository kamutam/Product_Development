import React, { useState, useEffect } from 'react';
import { Search, X, Building2, Layers, ShieldCheck, Award, FileText, Globe, MapPin, ArrowRight } from 'lucide-react';

export default function GlobalSearchModal({ 
  products = [], oems = [], categories = [], onClose, setActiveTab, onSelectProductForAudit, onSelectOEM 
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  // Instant Multi-Domain Search Matching
  const matchingProducts = q ? products.filter(p => 
    p.name?.toLowerCase().includes(q) ||
    p.sku?.toLowerCase().includes(q) ||
    p.vendor?.toLowerCase().includes(q) ||
    p.brandMake?.toLowerCase().includes(q) ||
    p.testingStatus?.toLowerCase().includes(q) ||
    p.stqcCertNo?.toLowerCase().includes(q) ||
    (p.specs?.resolution || '').toLowerCase().includes(q)
  ) : [];

  const matchingOEMs = q ? oems.filter(o => 
    o.name?.toLowerCase().includes(q) ||
    o.country?.toLowerCase().includes(q) ||
    o.city?.toLowerCase().includes(q) ||
    o.domain?.toLowerCase().includes(q) ||
    o.products?.toLowerCase().includes(q) ||
    (o.solutions || []).some(s => s.toLowerCase().includes(q))
  ) : [];

  const matchingCategories = q ? categories.filter(c => 
    c.name?.toLowerCase().includes(q) ||
    c.description?.toLowerCase().includes(q)
  ) : [];

  const totalResults = matchingProducts.length + matchingOEMs.length + matchingCategories.length;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', background: '#ffffff', color: '#0f172a', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '1.25rem' }}>
        
        {/* Search Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '2px solid #0284c7', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
          <Search size={22} color="#0284c7" />
          <input 
            type="text"
            className="form-control"
            autoFocus
            placeholder="Search across Products, Models, OEMs, Countries, STQC, ARAI, ONVIF..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ border: 'none', boxShadow: 'none', fontSize: '16px', fontWeight: 700, padding: 0 }}
          />
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} /> Esc
          </button>
        </div>

        {/* Search Suggestion Tags */}
        {!query && (
          <div style={{ padding: '1rem 0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
              Quick Search Suggestions:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['4MP Bullet', 'STQC', 'ARAI', 'CCTV', 'Japan', 'Robotics', 'ONVIF', 'Solar', 'Hikvision', 'Dahua'].map(tag => (
                <button 
                  key={tag}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11.5px', background: '#f1f5f9', borderColor: '#cbd5e1', color: '#0284c7', fontWeight: 700 }}
                  onClick={() => setQuery(tag)}
                >
                  🔍 {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        {query && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 700 }}>
              Found <strong style={{ color: '#0284c7' }}>{totalResults} results</strong> for "{query}"
            </div>

            {totalResults === 0 && (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                <Search size={36} color="#cbd5e1" style={{ marginBottom: '0.5rem' }} />
                <p style={{ margin: 0, fontWeight: 700 }}>No products, OEMs, or categories match "{query}".</p>
                <span style={{ fontSize: '11.5px' }}>Try searching by model number (e.g. CP-UNC-T41L2), OEM name, or cert (STQC).</span>
              </div>
            )}

            {/* 1. MATCHING PRODUCTS */}
            {matchingProducts.length > 0 && (
              <div>
                <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Layers size={14} /> Candidate Products ({matchingProducts.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {matchingProducts.slice(0, 5).map(prod => (
                    <div 
                      key={prod.id}
                      style={{ padding: '0.65rem 0.85rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => {
                        onClose();
                        if (onSelectProductForAudit) onSelectProductForAudit(prod, { score: 100, status: 'ACCEPTED' });
                        setActiveTab('evaluator');
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>{prod.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '0.1rem' }}>
                          Model SKU: <strong style={{ color: '#0284c7' }}>{prod.sku || 'N/A'}</strong> &bull; Vendor: <strong>{prod.vendor || prod.brandMake}</strong>
                        </div>
                      </div>
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', color: '#0284c7' }}>
                        Inspect <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. MATCHING OEM COMPANIES */}
            {matchingOEMs.length > 0 && (
              <div>
                <div style={{ fontSize: '12px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 size={14} /> OEM Partners & Manufacturers ({matchingOEMs.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {matchingOEMs.slice(0, 5).map(oem => (
                    <div 
                      key={oem.id}
                      style={{ padding: '0.65rem 0.85rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => {
                        onClose();
                        if (onSelectOEM) onSelectOEM(oem);
                        setActiveTab('oem-directory');
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Building2 size={14} color="#818cf8" /> {oem.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '0.1rem' }}>
                          <MapPin size={11} style={{ verticalAlign: 'middle', marginRight: '2px' }} />
                          {oem.city ? `${oem.city}, ` : ''}{oem.country} &bull; Domain: <strong style={{ color: '#0f172a' }}>{oem.domain}</strong>
                        </div>
                      </div>
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', color: '#818cf8' }}>
                        View Directory <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. MATCHING SPEC CATEGORIES */}
            {matchingCategories.length > 0 && (
              <div>
                <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={14} /> Specification Domains ({matchingCategories.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {matchingCategories.map(cat => (
                    <div 
                      key={cat.id}
                      style={{ padding: '0.65rem 0.85rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => {
                        onClose();
                        setActiveTab('evaluator');
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>{cat.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '0.1rem' }}>{cat.description}</div>
                      </div>
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', color: '#10b981' }}>
                        View Domain <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
