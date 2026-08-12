import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertTriangle, ShieldAlert, FileText, ArrowRight, Camera, Sun, Fingerprint, Plane, Code, Cpu, Plus, DollarSign, Layers, Search, X, ExternalLink, ShieldCheck, Building2
} from 'lucide-react';
import { evaluateProductAgainstProject } from '../utils/evaluator';
import GovtEmblemLogo from './GovtEmblemLogo';

const ICON_MAP = {
  Camera: Camera,
  Sun: Sun,
  Fingerprint: Fingerprint,
  Plane: Plane,
  Code: Code,
  Cpu: Cpu
};

export default function Dashboard({ 
  projects, products, categories, activeProjectId, setActiveTab, setSelectedProjectId, onSelectProductForAudit,
  evaluatorStatusFilter, setEvaluatorStatusFilter 
}) {
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [valuationSearch, setValuationSearch] = useState('');
  const [showProjectBreakdown, setShowProjectBreakdown] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeCategory = categories.find(c => c.id === activeProject?.categoryId);

  // Evaluate all products against active project
  const currentCategoryProducts = products.filter(p => p.categoryId === activeProject?.categoryId);
  const evaluations = currentCategoryProducts.map(p => ({
    product: p,
    res: evaluateProductAgainstProject(p, activeProject, activeCategory)
  }));

  const acceptedCount = evaluations.filter(e => e.res.status === 'ACCEPTED').length;
  const rejectedCount = evaluations.filter(e => e.res.status === 'REJECTED').length;
  const conditionalCount = evaluations.filter(e => e.res.status === 'CONDITIONAL').length;
  const totalScreened = evaluations.length;
  const acceptRate = totalScreened > 0 ? Math.round((acceptedCount / totalScreened) * 100) : 0;

  // Valuation calculations
  const totalValuationUSD = currentCategoryProducts.reduce((sum, p) => sum + (Number(p.specs?.maxPrice || p.price) || 0), 0);
  const acceptedValuationUSD = evaluations.filter(e => e.res.status === 'ACCEPTED').reduce((sum, e) => sum + (Number(e.product.specs?.maxPrice || e.product.price) || 0), 0);
  const avgUnitPriceUSD = currentCategoryProducts.length > 0 ? Math.round(totalValuationUSD / currentCategoryProducts.length) : 0;

  // Formatters
  const formatUSD = (val) => `$${Number(val).toLocaleString('en-US')}`;
  const formatINR = (val) => `₹${Math.round(Number(val) * 85).toLocaleString('en-IN')}`;

  const handleCardClick = (statusVal) => {
    if (setEvaluatorStatusFilter) {
      setEvaluatorStatusFilter(statusVal);
    }
    setActiveTab('evaluator');
  };

  // Filter products for valuation modal
  const filteredValuationProducts = evaluations.filter(({ product }) => {
    const q = valuationSearch.toLowerCase();
    return product.name.toLowerCase().includes(q) ||
           (product.vendor || '').toLowerCase().includes(q) ||
           (product.sku || '').toLowerCase().includes(q) ||
           (product.brandMake || '').toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Banner / Active Project Greeting with 1-Click Project Switcher & Product Details Hub */}
      <div className="card" style={{ 
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PRODUCT DEVELOPMENT &bull; ACTIVE PROJECT INSPECTION
            </span>
            <span className="badge badge-accept" style={{ fontSize: '10.5px', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>
              {projects.length} Total Projects
            </span>
          </div>

          {/* Clickable Project Title */}
          <h2 
            style={{ fontSize: '1.4rem', marginTop: '0.15rem', color: '#0f172a', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}
            onClick={() => setActiveTab('evaluator')}
            title="Click to view full product spec evaluation details for this project"
          >
            <GovtEmblemLogo type={activeProject?.client || activeProject?.name} size={26} />
            <span>📁 {activeProject?.name}</span>
            <ArrowRight size={18} color="#0284c7" />
          </h2>

          <p style={{ color: '#475569', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            PO / Tender ID: <strong style={{ color: '#0f172a' }}>{activeProject?.poNumber || activeProject?.code || 'N/A'}</strong> &bull; Client: <strong style={{ color: '#0f172a' }}>{activeProject?.client}</strong> &bull; Category: <span className="badge badge-conditional" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>{activeCategory?.name}</span>
          </p>

          {/* REAL-TIME PRODUCTS COUNT & PRODUCT VALUATION STRIP */}
          <div style={{ 
            marginTop: '0.65rem', 
            padding: '0.45rem 0.85rem', 
            background: '#f8fafc', 
            borderRadius: '8px', 
            border: '1px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ fontSize: '12.5px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>📦 Candidate Products: </span>
              <strong style={{ color: '#0284c7', fontWeight: 800 }}>{currentCategoryProducts.length} Models</strong>
            </div>

            <div style={{ fontSize: '12.5px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>💰 Total Spec Valuation: </span>
              <strong style={{ color: '#059669', fontWeight: 800 }}>{formatUSD(totalValuationUSD)} ({formatINR(totalValuationUSD)})</strong>
            </div>

            <div style={{ fontSize: '12.5px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>✅ Compliant Accepted Value: </span>
              <strong style={{ color: '#4f46e5', fontWeight: 800 }}>{formatUSD(acceptedValuationUSD)} ({formatINR(acceptedValuationUSD)})</strong>
            </div>
          </div>
        </div>

        {/* 1-Click Project Switcher & Product Inspection Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Direct Project Switcher Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800 }}>⚡ 1-Click Switch Project:</span>
            <select 
              className="form-select" 
              style={{ width: '280px', padding: '0.45rem 0.65rem', fontSize: '12px', borderColor: '#cbd5e1', background: '#ffffff', color: '#0f172a', fontWeight: 800 }}
              value={activeProjectId} 
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  📁 {p.name} ({p.client.slice(0, 20)}...)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff', fontWeight: 800, border: 'none', padding: '0.45rem 0.85rem', boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)' }} onClick={() => setShowValuationModal(true)} title="Check all candidate products and product unit/total values">
              💰 Check Products & Product Values ({currentCategoryProducts.length})
            </button>
            <button className="btn btn-secondary btn-sm" style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', fontWeight: 700, padding: '0.45rem 0.85rem' }} onClick={() => setActiveTab('evaluator')} title="Inspect candidate products for selected project">
              Run Spec Inspection <ArrowRight size={15} color="#0284c7" />
            </button>
            <button className="btn btn-secondary btn-sm" style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', fontWeight: 700, padding: '0.45rem 0.85rem' }} onClick={() => setActiveTab('inspection-summary')} title="View decision summary table for all projects">
              📋 All Projects Details
            </button>
          </div>
        </div>
      </div>

      {/* COLLAPSIBLE AP-CRDA TENDER SPECIFICATION & QUANTITIES TABLE */}
      {activeProject?.itemsQuantity && (
        <div className="card" style={{ 
          background: '#ffffff', 
          border: '1px solid #cbd5e1',
          borderRadius: '12px',
          padding: '0.85rem 1.15rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          {/* COLLAPSED / EXPANDED HEADER BAR */}
          <div 
            style={{ 
              display: 'flex', 
              justify: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              userSelect: 'none'
            }} 
            onClick={() => setShowProjectBreakdown(!showProjectBreakdown)}
            title="Click to toggle project spec and quantity details"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🏛️</span>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1rem', fontWeight: 800 }}>
                  AP-CRDA Amaravati Smart City Smart Pole Project - Indicative Specs & Quantity Breakdown
                </h3>
                <p style={{ margin: '0.15rem 0 0 0', fontSize: '11.5px', color: '#475569' }}>
                  Tender PO No: <strong style={{ color: '#0f172a' }}>{activeProject.poNumber}</strong> | Client: <strong style={{ color: '#0f172a' }}>{activeProject.client}</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                📊 11 Subsystems
              </span>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ fontSize: '11.5px', color: '#0284c7', borderColor: '#cbd5e1', fontWeight: 800, padding: '0.35rem 0.75rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProjectBreakdown(!showProjectBreakdown);
                }}
              >
                {showProjectBreakdown ? '▲ Collapse Specs Table' : '▼ View Indicative Specs & Quantities (11 Subsystems)'}
              </button>
            </div>
          </div>

          {/* EXPANDABLE BODY CONTENT */}
          {showProjectBreakdown && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', animation: 'fadeInUp 0.25s ease-out' }}>
              <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #0284c7', color: '#0284c7' }}>
                      <th style={{ padding: '0.65rem', textAlign: 'center', width: '50px' }}>S.No.</th>
                      <th style={{ padding: '0.65rem', textAlign: 'left', minWidth: '170px' }}>Smart Pole Feature</th>
                      <th style={{ padding: '0.65rem', textAlign: 'left' }}>Indicative Specification</th>
                      <th style={{ padding: '0.65rem', textAlign: 'center', width: '160px', background: '#dcfce7', color: '#15803d', fontWeight: 800 }}>Indicative Units (Qty)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeProject.itemsQuantity.map((item) => (
                      <tr key={item.sNo} style={{ borderBottom: '1px solid #e2e8f0', background: item.sNo % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                        <td style={{ padding: '0.65rem', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>{item.sNo}</td>
                        <td style={{ padding: '0.65rem', fontWeight: 700, color: '#0f172a' }}>
                          <div style={{ color: '#0284c7', fontSize: '12px', fontWeight: 800 }}>{item.feature}</div>
                          <span style={{ fontSize: '10px', color: '#475569', background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>{item.category}</span>
                        </td>
                        <td style={{ padding: '0.65rem', color: '#334155', lineHeight: '1.45', fontSize: '11.5px' }}>{item.spec}</td>
                        <td style={{ padding: '0.65rem', textAlign: 'center', fontWeight: 800, color: '#059669', background: '#f0fdf4', fontSize: '12.5px' }}>
                          {item.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Smart Pole Customisation Mandatory Condition Box */}
              <div style={{
                marginTop: '1rem',
                padding: '0.85rem 1.1rem',
                background: '#fef3c7',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                color: '#92400e'
              }}>
                <div style={{ fontWeight: 800, fontSize: '12px', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#b45309' }}>
                  ⚠️ Smart Pole Customisation (Mandatory Tender Condition)
                </div>
                <p style={{ margin: '0 0 0.35rem 0', fontSize: '11.5px', color: '#451a03', lineHeight: '1.45' }}>
                  All Smart Pole components, subsystems, accessories, civil works, electrical works, networking components, IoT devices, display systems, AI-enabled modules and associated infrastructure shall be supplied and implemented strictly on the basis of stakeholder-specific requirements, site conditions, engineering feasibility, regulatory approvals and final approved implementation designs.
                </p>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#78350f', fontWeight: 700 }}>
                  The entire Smart Pole component shall be delivered as per the stakeholder-customised needs and site-feasibility conditions. The selected vendor shall accommodate such customisation without altering the overall project objectives and performance requirements, and without any additional cost over the accepted unit rates.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Metrics Cards with 1-Click Interactive Status Filter */}
      <div className="grid-cols-4">
        {/* CARD 1: ACCEPTANCE RATE */}
        <div 
          className="card" 
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease', 
            background: '#ffffff',
            border: evaluatorStatusFilter === 'ALL' ? '2px solid #0284c7' : '1px solid #cbd5e1',
            boxShadow: evaluatorStatusFilter === 'ALL' ? '0 0 15px rgba(2, 132, 199, 0.2)' : '0 2px 8px rgba(0,0,0,0.04)'
          }}
          onClick={() => handleCardClick('ALL')}
          title="Click to view all screened candidate products"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 800 }}>Acceptance Rate</span>
            <CheckCircle2 color="#059669" size={20} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: '#059669' }}>
            {acceptRate}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 600 }}>
            {acceptedCount} of {totalScreened} candidate products compliant
          </div>
          <div style={{ fontSize: '10.5px', color: '#0284c7', fontWeight: 800, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            👉 1-Click: View All ({totalScreened})
          </div>
        </div>

        {/* CARD 2: ACCEPTED PRODUCTS */}
        <div 
          className="card" 
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease',
            background: '#ffffff',
            border: evaluatorStatusFilter === 'ACCEPTED' ? '2.5px solid #059669' : '1px solid #86efac',
            boxShadow: evaluatorStatusFilter === 'ACCEPTED' ? '0 0 15px rgba(5, 150, 105, 0.25)' : '0 2px 8px rgba(0,0,0,0.04)'
          }}
          onClick={() => handleCardClick('ACCEPTED')}
          title="Click to view only Accepted products"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 800 }}>Accepted Products</span>
            <CheckCircle2 color="#059669" size={20} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: '#059669' }}>
            {acceptedCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 600 }}>
            Ready for procurement approval
          </div>
          <div style={{ fontSize: '10.5px', color: '#15803d', fontWeight: 800, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            👉 1-Click: View Accepted ({acceptedCount})
          </div>
        </div>

        {/* CARD 3: REJECTED PRODUCTS */}
        <div 
          className="card" 
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease',
            background: '#ffffff',
            border: evaluatorStatusFilter === 'REJECTED' ? '2.5px solid #e11d48' : '1px solid #fecdd3',
            boxShadow: evaluatorStatusFilter === 'REJECTED' ? '0 0 15px rgba(225, 29, 72, 0.25)' : '0 2px 8px rgba(0,0,0,0.04)'
          }}
          onClick={() => handleCardClick('REJECTED')}
          title="Click to view only Rejected products"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 800 }}>Rejected Products</span>
            <XCircle color="#e11d48" size={20} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: '#e11d48' }}>
            {rejectedCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 600 }}>
            Failed mandatory project specs
          </div>
          <div style={{ fontSize: '10.5px', color: '#b91c1c', fontWeight: 800, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            👉 1-Click: View Rejected ({rejectedCount})
          </div>
        </div>

        {/* CARD 4: CONDITIONAL / REVIEW */}
        <div 
          className="card" 
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease',
            background: '#ffffff',
            border: evaluatorStatusFilter === 'CONDITIONAL' ? '2.5px solid #d97706' : '1px solid #fde68a',
            boxShadow: evaluatorStatusFilter === 'CONDITIONAL' ? '0 0 15px rgba(217, 119, 6, 0.25)' : '0 2px 8px rgba(0,0,0,0.04)'
          }}
          onClick={() => handleCardClick('CONDITIONAL')}
          title="Click to view only Conditional products"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 800 }}>Conditional / Review</span>
            <AlertTriangle color="#d97706" size={20} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: '#d97706' }}>
            {conditionalCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 600 }}>
            Minor spec warnings
          </div>
          <div style={{ fontSize: '10.5px', color: '#b45309', fontWeight: 800, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            👉 1-Click: View Conditional ({conditionalCount})
          </div>
        </div>
      </div>

      {/* Category Specification Coverage Cards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Product Specification Domains</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pre-built compliance rule templates & product lists</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('category-builder')}>
            <Plus size={15} /> Add Custom Category
          </button>
        </div>

        <div className="grid-cols-3">
          {categories.map(cat => {
            const IconComp = ICON_MAP[cat.icon] || Cpu;
            const catProductsCount = products.filter(p => p.categoryId === cat.id).length;
            const catProjectsCount = projects.filter(p => p.categoryId === cat.id).length;

            return (
              <div key={cat.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '10px', 
                      background: 'rgba(99, 102, 241, 0.15)', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', color: '#818cf8' 
                    }}>
                      <IconComp size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem' }}>{cat.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.fields.length} Spec Rules</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {cat.description}
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem' 
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Products: <strong>{catProductsCount}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Projects: <strong>{catProjectsCount}</strong></span>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => {
                      const proj = projects.find(p => p.categoryId === cat.id);
                      if (proj) setSelectedProjectId(proj.id);
                      setActiveTab('evaluator');
                    }}
                  >
                    View Specs &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Screened Products Compliance Preview Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Automated Inspection Summary for {activeProject?.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time Accept / Reject decision audit</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('evaluator')}>
            View Full Evaluation &rarr;
          </button>
        </div>

        <div className="table-container">
          <table className="spec-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Compliance Score</th>
                <th>Passed / Failed</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No candidate products uploaded yet for this category.
                  </td>
                </tr>
              ) : (
                evaluations.map(({ product, res }) => (
                  <tr key={product.id}>
                    <td style={{ fontWeight: 600 }}>{product.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{product.vendor}</td>
                    <td><span className="badge badge-conditional" style={{ textTransform: 'capitalize' }}>{activeCategory?.name}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '60px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' 
                        }}>
                          <div style={{ 
                            width: `${res.score}%`, height: '100%', 
                            background: res.status === 'ACCEPTED' ? 'var(--success)' : (res.status === 'CONDITIONAL' ? 'var(--warning)' : 'var(--danger)') 
                          }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{res.score}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--success)', fontWeight: 600 }}>{res.passedCount} Pass</span> / <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{res.failedCount} Fail</span>
                    </td>
                    <td>
                      {res.status === 'ACCEPTED' && <span className="badge badge-accept"><CheckCircle2 size={12} /> ACCEPTED</span>}
                      {res.status === 'REJECTED' && <span className="badge badge-reject"><XCircle size={12} /> REJECTED</span>}
                      {res.status === 'CONDITIONAL' && <span className="badge badge-conditional"><AlertTriangle size={12} /> CONDITIONAL</span>}
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectProductForAudit(product, res)}
                      >
                        Audit Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1-CLICK ALL PRODUCTS & PRODUCT VALUES INSPECTION MODAL */}
      {showValuationModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(5, 8, 15, 0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <div className="card" style={{
            width: '100%', maxWidth: '1100px', maxHeight: '90vh', overflowY: 'auto',
            background: '#0b0f19', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '16px',
            padding: '1.5rem', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Portfolio Valuation & Spec Inspection Hub
                </div>
                <h2 style={{ fontSize: '1.35rem', color: '#ffffff', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  💰 All Products & Product Values Matrix ({currentCategoryProducts.length} Models)
                </h2>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Project: <strong>{activeProject?.name}</strong> &bull; Client: <strong>{activeProject?.client}</strong>
                </p>
              </div>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowValuationModal(false)}
                style={{ padding: '0.35rem 0.65rem' }}
              >
                <X size={16} /> Close
              </button>
            </div>

            {/* Valuation KPI Summary Cards */}
            <div className="grid-cols-4" style={{ gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 700 }}>Total Candidate Models</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '0.15rem' }}>
                  {currentCategoryProducts.length} Products
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Active category portfolio</div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 700 }}>Total Spec Valuation</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginTop: '0.15rem' }}>
                  {formatUSD(totalValuationUSD)}
                </div>
                <div style={{ fontSize: '11px', color: '#34d399', marginTop: '0.1rem' }}>{formatINR(totalValuationUSD)} Total</div>
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>Accepted Compliant Value</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.15rem' }}>
                  {formatUSD(acceptedValuationUSD)}
                </div>
                <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '0.1rem' }}>{formatINR(acceptedValuationUSD)} Compliant</div>
              </div>

              <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>Average Unit Spec Price</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.15rem' }}>
                  {formatUSD(avgUnitPriceUSD)}
                </div>
                <div style={{ fontSize: '11px', color: '#fbbf24', marginTop: '0.1rem' }}>{formatINR(avgUnitPriceUSD)} / Unit</div>
              </div>
            </div>

            {/* Valuation Search Bar */}
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div className="search-input-wrapper" style={{ flex: 1 }}>
                <Search size={15} className="search-icon" />
                <input 
                  type="text"
                  className="form-control"
                  placeholder="Filter products by Model Name, SKU, OEM Vendor, or Brand..."
                  value={valuationSearch}
                  onChange={(e) => setValuationSearch(e.target.value)}
                />
              </div>
              <span className="badge badge-accept" style={{ fontSize: '11px' }}>
                Showing {filteredValuationProducts.length} of {currentCategoryProducts.length} Items
              </span>
            </div>

            {/* Products & Valuation Table */}
            <div className="table-container">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Product Model Name</th>
                    <th>SKU / Model ID</th>
                    <th>OEM Vendor / Manufacturer</th>
                    <th>Unit Max Price (USD $)</th>
                    <th>Est. Unit Value (INR ₹)</th>
                    <th>Spec Compliance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredValuationProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        No product models match search "{valuationSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredValuationProducts.map(({ product, res }) => {
                      const unitPriceUSD = Number(product.specs?.maxPrice || product.price) || 0;
                      return (
                        <tr key={product.id}>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{product.name}</td>
                          <td style={{ color: '#818cf8', fontWeight: 600, fontFamily: 'monospace' }}>{product.sku || 'N/A'}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{product.vendor || product.brandMake}</td>
                          <td style={{ color: '#34d399', fontWeight: 800, fontSize: '13px' }}>
                            {formatUSD(unitPriceUSD)}
                          </td>
                          <td style={{ color: '#38bdf8', fontWeight: 700, fontSize: '12.5px' }}>
                            {formatINR(unitPriceUSD)}
                          </td>
                          <td>
                            <span style={{ color: 'var(--success)', fontWeight: 600 }}>{res.passedCount} Pass</span> / <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{res.failedCount} Fail</span>
                          </td>
                          <td>
                            {res.status === 'ACCEPTED' && <span className="badge badge-accept"><CheckCircle2 size={12} /> ACCEPTED</span>}
                            {res.status === 'REJECTED' && <span className="badge badge-reject"><XCircle size={12} /> REJECTED</span>}
                            {res.status === 'CONDITIONAL' && <span className="badge badge-conditional"><AlertTriangle size={12} /> CONDITIONAL</span>}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
