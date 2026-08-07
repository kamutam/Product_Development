import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertTriangle, Search, Printer, ShieldCheck, Info, Sparkles, ArrowRight, Award, Calendar, Layers, Clock, Activity, CheckSquare, ShieldAlert, Sliders, Check
} from 'lucide-react';
import { evaluateProductAgainstProject, findSimilarProducts } from '../utils/evaluator';

export default function ComplianceEvaluator({ 
  projects, products, categories, activeProjectId, setSelectedProjectId, onSelectProductForAudit, onScheduleOEMMeeting 
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeCategory = categories.find(c => c.id === activeProject?.categoryId);

  // Filter category products
  const categoryProducts = products.filter(p => p.categoryId === activeProject?.categoryId);

  // Individual product procurement status state tracker
  const [productProcurementStatus, setProductProcurementStatus] = useState({});

  // Manual Overrides / Specification Waiver state tracker: { [prodId]: { overridden: true, reason: '...' } }
  const [manualOverrides, setManualOverrides] = useState({});
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [waiverProduct, setWaiverProduct] = useState(null);
  const [waiverReason, setWaiverReason] = useState('Client Technical Waiver Approved');
  const [waiverNotes, setWaiverNotes] = useState('');

  const handleProductStatusChange = (prodId, statusVal) => {
    setProductProcurementStatus(prev => ({
      ...prev,
      [prodId]: statusVal
    }));
  };

  const handleOpenWaiverModal = (product) => {
    setWaiverProduct(product);
    setWaiverReason('Client Technical Waiver Approved');
    setWaiverNotes('Product accepted as similar equivalent for project implementation.');
    setShowWaiverModal(true);
  };

  const handleSaveWaiver = (e) => {
    e.preventDefault();
    if (!waiverProduct) return;

    setManualOverrides(prev => ({
      ...prev,
      [waiverProduct.id]: {
        overridden: true,
        reason: waiverReason,
        notes: waiverNotes,
        date: new Date().toISOString().split('T')[0]
      }
    }));

    setProductProcurementStatus(prev => ({
      ...prev,
      [waiverProduct.id]: 'Selected for Procurement'
    }));

    setShowWaiverModal(false);
    alert(`Product "${waiverProduct.name}" manually ACCEPTED with Specification Waiver!`);
  };

  const handleRemoveWaiver = (prodId) => {
    if (confirm('Remove manual specification waiver for this product?')) {
      const updated = { ...manualOverrides };
      delete updated[prodId];
      setManualOverrides(updated);
    }
  };

  // Perform evaluation with manual waiver overrides
  const evaluatedProducts = categoryProducts.map(product => {
    const rawRes = evaluateProductAgainstProject(product, activeProject, activeCategory);
    const overrideInfo = manualOverrides[product.id];

    let finalRes = { ...rawRes };
    if (overrideInfo?.overridden) {
      finalRes.status = 'ACCEPTED_WAIVER';
      finalRes.overrideReason = overrideInfo.reason;
      finalRes.overrideNotes = overrideInfo.notes;
    }

    return { product, res: finalRes };
  });

  // Apply filters
  const filteredList = evaluatedProducts.filter(({ product, res }) => {
    const matchesStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'ACCEPTED' && (res.status === 'ACCEPTED' || res.status === 'ACCEPTED_WAIVER')) ||
                          res.status === statusFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const acceptedCount = evaluatedProducts.filter(e => e.res.status === 'ACCEPTED' || e.res.status === 'ACCEPTED_WAIVER').length;
  const rejectedCount = evaluatedProducts.filter(e => e.res.status === 'REJECTED').length;
  const conditionalCount = evaluatedProducts.filter(e => e.res.status === 'CONDITIONAL').length;

  // Project overall readiness status determination
  let projectStatusLabel = 'Technical Evaluation In-Progress';
  let projectStatusBadgeClass = 'badge-conditional';
  if (acceptedCount > 0) {
    projectStatusLabel = 'Ready for PO Execution & Procurement';
    projectStatusBadgeClass = 'badge-accept';
  } else if (categoryProducts.length === 0) {
    projectStatusLabel = 'Awaiting Product Datasheets';
    projectStatusBadgeClass = 'badge-conditional';
  } else if (acceptedCount === 0 && rejectedCount > 0) {
    projectStatusLabel = 'Requires Alternative Sourcing';
    projectStatusBadgeClass = 'badge-reject';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header & Project Selector Bar */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Automated Spec Compliance & Alternative Finder</h2>
            <span className={`badge ${projectStatusBadgeClass}`} style={{ textTransform: 'none', fontSize: '11px' }}>
              <Activity size={12} /> {projectStatusLabel}
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Comparing candidate products against specs for <strong>{activeProject?.name}</strong> ({activeProject?.client})
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Change Project:</span>
          <select 
            className="form-select" 
            style={{ width: '260px', padding: '0.4rem 0.65rem', fontSize: '12.5px' }}
            value={activeProjectId} 
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name} (PO: {p.poNumber || p.code || 'N/A'})</option>
            ))}
          </select>

          <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
            <Printer size={15} /> Print Report
          </button>
        </div>
      </div>

      {/* PROJECT & PRODUCTS STATUS SUMMARY PANEL */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)', 
        borderColor: 'rgba(99, 102, 241, 0.25)', padding: '1rem 1.25rem' 
      }}>
        <div style={{ fontSize: '12px', color: '#818cf8', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Activity size={14} /> LIVE PROJECT & PRODUCTS COMPLIANCE STATUS DASHBOARD:
        </div>

        <div className="grid-cols-4" style={{ gap: '0.85rem' }}>
          {/* Project Status */}
          <div style={{ 
            background: 'rgba(11, 15, 25, 0.7)', padding: '0.75rem', borderRadius: '8px', 
            border: '1px solid var(--border-color)' 
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Project PO / Tender ID</div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff', marginTop: '0.2rem' }}>
              {activeProject?.poNumber || activeProject?.code || 'N/A'}
            </div>
            <div style={{ fontSize: '11px', color: '#34d399', marginTop: '0.25rem' }}>
              Client: {activeProject?.client}
            </div>
          </div>

          {/* Accepted Products Status */}
          <div style={{ 
            background: 'rgba(11, 15, 25, 0.7)', padding: '0.75rem', borderRadius: '8px', 
            border: '1px solid var(--success-border)' 
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Accepted Compliant</span>
              <CheckCircle2 size={13} color="var(--success)" />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#34d399', marginTop: '0.1rem' }}>
              {acceptedCount} Products
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Meets project specs (or waived)
            </div>
          </div>

          {/* Rejected Products Status */}
          <div style={{ 
            background: 'rgba(11, 15, 25, 0.7)', padding: '0.75rem', borderRadius: '8px', 
            border: '1px solid var(--danger-border)' 
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Rejected / Non-Compliant</span>
              <XCircle size={13} color="var(--danger)" />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#fb7185', marginTop: '0.1rem' }}>
              {rejectedCount} Products
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Failed target specifications
            </div>
          </div>

          {/* Total Evaluated & Domain Status */}
          <div style={{ 
            background: 'rgba(11, 15, 25, 0.7)', padding: '0.75rem', borderRadius: '8px', 
            border: '1px solid var(--border-color)' 
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Product Domain Category</div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff', marginTop: '0.2rem' }}>
              {activeCategory?.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Total Screened: <strong>{categoryProducts.length} candidate models</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Target Project Requirements Quick Summary Strip (Formatted S.No Wise) */}
      <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)', padding: '0.9rem 1.1rem' }}>
        <h3 style={{ fontSize: '12.5px', color: '#818cf8', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={15} /> REQUIRED PROJECT SPECIFICATIONS THRESHOLDS (S.NO WISE):
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem', width: '40px' }}>S.No</th>
                <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>Specification Field</th>
                <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>Target Requirement Threshold</th>
              </tr>
            </thead>
            <tbody>
              {activeCategory?.fields.map((field, idx) => {
                const reqVal = activeProject?.requirements?.[field.key];
                if (reqVal === undefined || reqVal === null || reqVal === '') return null;

                return (
                  <tr key={field.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.35rem 0.5rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {idx + 1}.
                    </td>
                    <td style={{ padding: '0.35rem 0.5rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      {field.label}
                    </td>
                    <td style={{ padding: '0.35rem 0.5rem', fontWeight: 700, color: '#38bdf8' }}>
                      {typeof reqVal === 'boolean' ? (reqVal ? 'Yes (Required)' : 'No') : `${String(reqVal)}${field.unit ? ' ' + field.unit : ''}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filters & Status Toggles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button 
            className={`btn ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Products ({evaluatedProducts.length})
          </button>
          <button 
            className={`btn ${statusFilter === 'ACCEPTED' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={statusFilter === 'ACCEPTED' ? { background: 'var(--success)' } : {}}
            onClick={() => setStatusFilter('ACCEPTED')}
          >
            <CheckCircle2 size={13} /> Accepted ({acceptedCount})
          </button>
          <button 
            className={`btn ${statusFilter === 'REJECTED' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={statusFilter === 'REJECTED' ? { background: 'var(--danger)' } : {}}
            onClick={() => setStatusFilter('REJECTED')}
          >
            <XCircle size={13} /> Rejected ({rejectedCount})
          </button>
          <button 
            className={`btn ${statusFilter === 'CONDITIONAL' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={statusFilter === 'CONDITIONAL' ? { background: 'var(--warning)' } : {}}
            onClick={() => setStatusFilter('CONDITIONAL')}
          >
            <AlertTriangle size={13} /> Conditional ({conditionalCount})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '250px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search product name or vendor..."
            style={{ paddingLeft: '2.1rem', padding: '0.4rem 0.65rem', fontSize: '12px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Evaluation Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredList.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            <Info size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <h3>No products match current search/filter.</h3>
            <p style={{ fontSize: '12px', marginTop: '0.2rem' }}>Try switching filters or add a new candidate product in the Product Catalog.</p>
          </div>
        ) : (
          filteredList.map(({ product, res }) => {
            const similarProds = findSimilarProducts(product, activeProject, activeCategory, products);
            const currentProductStatus = productProcurementStatus[product.id] || (res.status.includes('ACCEPTED') ? 'Selected for Procurement' : 'Under Technical Evaluation');

            return (
              <div key={product.id} className="card" style={{ 
                borderLeft: res.status.includes('ACCEPTED') 
                  ? '4px solid var(--success)' 
                  : (res.status === 'REJECTED' ? '4px solid var(--danger)' : '4px solid var(--warning)'),
                padding: '1rem 1.2rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.1rem' }}>{product.name}</h3>
                      {res.status === 'ACCEPTED' && <span className="badge badge-accept"><CheckCircle2 size={11} /> ACCEPTED</span>}
                      {res.status === 'ACCEPTED_WAIVER' && (
                        <span className="badge badge-accept" style={{ background: 'rgba(245, 158, 11, 0.2)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}>
                          <CheckCircle2 size={11} /> ACCEPTED (OVERRIDE WAIVER)
                        </span>
                      )}
                      {res.status === 'REJECTED' && <span className="badge badge-reject"><XCircle size={11} /> REJECTED</span>}
                      {res.status === 'CONDITIONAL' && <span className="badge badge-conditional"><AlertTriangle size={11} /> CONDITIONAL MATCH</span>}

                      {(product.araiCertified || product.specs?.araiCertified) && (
                        <span className="badge badge-accept" style={{ fontSize: '10px' }}>
                          ARAI CERTIFIED
                        </span>
                      )}
                      {(product.stqcCertified || product.specs?.stqcCertified) && (
                        <span className="badge badge-conditional" style={{ fontSize: '10px', background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa' }}>
                          STQC CERTIFIED
                        </span>
                      )}
                      {product.testingStatus && (
                        <span className="badge badge-conditional" style={{ textTransform: 'none', background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#818cf8', fontSize: '10px' }}>
                          <Award size={11} /> {product.testingStatus}
                        </span>
                      )}
                    </div>
                    
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Vendor: <strong>{product.vendor}</strong> | SKU: <strong>{product.sku || 'N/A'}</strong> | Compliance Score: <strong style={{ color: res.status.includes('ACCEPTED') ? 'var(--success)' : 'var(--danger)' }}>{res.score}%</strong>
                    </p>

                    {res.status === 'ACCEPTED_WAIVER' && (
                      <div style={{ fontSize: '11px', color: '#fbbf24', marginTop: '0.2rem', fontWeight: 600 }}>
                        ★ Waiver Reason: {res.overrideReason} ({res.overrideNotes})
                      </div>
                    )}
                  </div>

                  {/* Product Procurement Status Selector & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Product Status:</span>
                      <select 
                        className="form-select" 
                        style={{ width: '180px', padding: '0.3rem 0.5rem', fontSize: '11px', background: 'rgba(11, 15, 25, 0.8)' }}
                        value={currentProductStatus}
                        onChange={(e) => handleProductStatusChange(product.id, e.target.value)}
                      >
                        <option value="Selected for Procurement">Selected for Procurement</option>
                        <option value="Under Technical Evaluation">Under Technical Evaluation</option>
                        <option value="Pending OEM Commercial Quote">Pending OEM Commercial Quote</option>
                        <option value="Sample Lab Testing Approved">Sample Lab Testing Approved</option>
                        <option value="Rejected - Non-Compliant">Rejected - Non-Compliant</option>
                      </select>
                    </div>

                    {res.status.includes('ACCEPTED') && (
                      <button 
                        className="btn btn-primary btn-sm"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                        onClick={() => onScheduleOEMMeeting(product, activeProject)}
                      >
                        <Calendar size={13} /> Schedule OEM Meeting
                      </button>
                    )}

                    {/* OVERRIDE WAIVER BUTTON FOR REJECTED / SIMILAR PRODUCTS */}
                    {res.status !== 'ACCEPTED' && res.status !== 'ACCEPTED_WAIVER' && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.1)' }}
                        onClick={() => handleOpenWaiverModal(product)}
                      >
                        <ShieldAlert size={13} /> Accept Similar Product (Waiver)
                      </button>
                    )}

                    {res.status === 'ACCEPTED_WAIVER' && (
                      <button 
                        className="btn btn-danger btn-sm"
                        style={{ fontSize: '11px' }}
                        onClick={() => handleRemoveWaiver(product.id)}
                      >
                        Remove Waiver
                      </button>
                    )}

                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectProductForAudit(product, res)}
                    >
                      View Audit Checklist
                    </button>
                  </div>
                </div>

                {/* Rejection Rationale Summary Box */}
                {res.status === 'REJECTED' && res.rejectionSummary.length > 0 && (
                  <div style={{ 
                    marginTop: '0.75rem', padding: '0.6rem 0.85rem', background: 'var(--danger-bg)', 
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--danger-border)' 
                  }}>
                    <div style={{ fontWeight: 700, color: '#fb7185', fontSize: '12px', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <XCircle size={13} /> Rejection Reasons ({res.failedCount} failed specs):
                    </div>
                    <ul style={{ paddingLeft: '1.1rem', fontSize: '12px', color: '#fecdd3' }}>
                      {res.rejectionSummary.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* SIMILAR PRODUCT RECOMMENDATIONS FOR REJECTED PRODUCTS */}
                {res.status === 'REJECTED' && similarProds.length > 0 && (
                  <div style={{ 
                    marginTop: '0.75rem', padding: '0.6rem 0.85rem', 
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)', 
                    borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.3)' 
                  }}>
                    <div style={{ fontWeight: 700, color: '#818cf8', fontSize: '12px', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Sparkles size={13} /> Customer Satisfaction Boost: Recommended Compliant Alternative Products
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {similarProds.slice(0, 2).map(({ product: altP, res: altR, recommendationReason }) => (
                        <div key={altP.id} style={{ 
                          padding: '0.45rem 0.65rem', background: 'rgba(11, 15, 25, 0.6)', 
                          borderRadius: '6px', border: '1px solid var(--border-color)',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px'
                        }}>
                          <div>
                            <span style={{ fontWeight: 700, color: '#ffffff' }}>{altP.name}</span>{' '}
                            <span className="badge badge-accept" style={{ fontSize: '10px', padding: '0.1rem 0.35rem' }}>ACCEPTED</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '0.4rem' }}>
                              ({altP.vendor} - {altP.testingStatus || 'Tested'})
                            </span>
                          </div>

                          <button 
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '0.2rem 0.45rem' }}
                            onClick={() => onSelectProductForAudit(altP, altR)}
                          >
                            Audit Alternative &rarr;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specification Grid Breakdown */}
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
                    SPECIFICATION PARAMETERS MATCH:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
                    {res.paramAudit.map(audit => (
                      <div key={audit.key} style={{ 
                        padding: '0.45rem 0.65rem', borderRadius: '6px', 
                        background: audit.passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                        border: audit.passed ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)',
                        fontSize: '12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{audit.label}</span>
                          {audit.passed 
                            ? <CheckCircle2 size={12} color="var(--success)" /> 
                            : <XCircle size={12} color="var(--danger)" />
                          }
                        </div>

                        <div style={{ fontWeight: 700, marginTop: '0.15rem' }}>
                          {typeof audit.provided === 'boolean' ? (audit.provided ? 'true' : 'false') : `${String(audit.provided)}${audit.unit ? ' ' + audit.unit : ''}`}
                        </div>

                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                          Req: {typeof audit.required === 'boolean' ? (audit.required ? 'true' : 'false') : `${String(audit.required)}${audit.unit ? ' ' + audit.unit : ''}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual Specification Waiver / Override Modal */}
      {showWaiverModal && waiverProduct && (
        <div className="modal-overlay" onClick={() => setShowWaiverModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={20} /> Grant Specification Waiver & Accept Similar Product
            </h3>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              You are granting a technical specification waiver to accept <strong>{waiverProduct.name}</strong> for project <strong>{activeProject?.name}</strong>.
            </p>

            <form onSubmit={handleSaveWaiver}>
              <div className="form-group">
                <label>Waiver Justification Reason *</label>
                <select 
                  className="form-select"
                  value={waiverReason}
                  onChange={(e) => setWaiverReason(e.target.value)}
                >
                  <option value="Client Technical Waiver Approved">Client Technical Waiver Approved</option>
                  <option value="Closest Equivalent Model Available on Market">Closest Equivalent Model Available on Market</option>
                  <option value="Superior Warranty / OEM Support Compensates Spec Gap">Superior Warranty / OEM Support Compensates Spec Gap</option>
                  <option value="Custom Engineering Deviation Approved">Custom Engineering Deviation Approved</option>
                </select>
              </div>

              <div className="form-group">
                <label>Approval & Audit Notes</label>
                <textarea 
                  className="form-textarea"
                  rows="3"
                  placeholder="Record client approval reference, email notes, or technical justification..."
                  value={waiverNotes}
                  onChange={(e) => setWaiverNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowWaiverModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <Check size={16} /> Confirm & Accept Similar Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
