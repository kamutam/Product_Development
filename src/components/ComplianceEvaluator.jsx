import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, AlertTriangle, Search, Printer, ShieldCheck, Info, Sparkles, ArrowRight, Award, Calendar, Layers, Clock, Activity, CheckSquare, ShieldAlert, Sliders, Check, Loader2, Bot, AlertOctagon
} from 'lucide-react';
import { generateComplianceInsights, detectSpecAnomalies } from '../utils/aiService';
import { evaluateProductAgainstProject, findSimilarProducts } from '../utils/evaluator';
import GovtEmblemLogo from './GovtEmblemLogo';

export default function ComplianceEvaluator({ 
  projects, products, categories, activeProjectId, setSelectedProjectId, onSelectProductForAudit, onScheduleOEMMeeting 
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [aiInsights, setAiInsights] = useState(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [productAnomalies, setProductAnomalies] = useState({});

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

  // Fetch AI Insights whenever project or evaluations change
  useEffect(() => {
    let isMounted = true;
    
    const fetchInsights = async () => {
      setIsInsightLoading(true);
      try {
        const insights = await generateComplianceInsights(activeProject, evaluatedProducts);
        if (isMounted) setAiInsights(insights);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setIsInsightLoading(false);
      }
    };

    fetchInsights();
    return () => { isMounted = false; };
  }, [activeProjectId, evaluatedProducts.length]);

  // Fetch ML Anomalies
  useEffect(() => {
    let isMounted = true;
    
    const fetchAnomalies = async () => {
      const anomaliesMap = {};
      for (const prod of categoryProducts) {
        if (!productAnomalies[prod.id]) {
          const res = await detectSpecAnomalies(prod.specs || prod);
          anomaliesMap[prod.id] = res;
        }
      }
      if (isMounted && Object.keys(anomaliesMap).length > 0) {
        setProductAnomalies(prev => ({ ...prev, ...anomaliesMap }));
      }
    };

    if (categoryProducts.length > 0) {
      fetchAnomalies();
    }
    
    return () => { isMounted = false; };
  }, [categoryProducts.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header & Project Selector Bar */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
            <GovtEmblemLogo type={activeProject?.client || activeProject?.name} size={24} />
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
          
          {/* CUSTOM SEARCHABLE PROJECT DROPDOWN (CAPPED AT 4 VISIBLE ITEMS MAX) */}
          <div style={{ position: 'relative', width: '260px', zIndex: 99999 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                width: '100%',
                justify: 'space-between',
                fontSize: '12px',
                fontWeight: 800,
                background: 'var(--bg-card)',
                color: 'var(--text-heading)',
                borderColor: 'var(--border-color)',
                padding: '0.4rem 0.65rem'
              }}
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '210px' }}>
                📁 {activeProject?.name || 'Select Project'}
              </span>
              <span style={{ fontSize: '10px', marginLeft: '4px', color: '#0284c7' }}>
                {showProjectDropdown ? '▲' : '▼'}
              </span>
            </button>

            {showProjectDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  width: '280px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
                  zIndex: 999999,
                  padding: '0.45rem',
                  animation: 'fadeInUp 0.15s ease-out'
                }}
              >
                <div style={{ position: 'relative', marginBottom: '0.4rem' }}>
                  <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#0284c7' }} />
                  <input
                    type="text"
                    placeholder="Search project..."
                    value={projectSearchQuery}
                    onChange={(e) => setProjectSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '0.35rem 0.5rem 0.35rem 1.75rem',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-heading)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', scrollbarWidth: 'thin' }}>
                  {projects
                    .filter(p => p.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) || p.client.toLowerCase().includes(projectSearchQuery.toLowerCase()))
                    .map(p => {
                      const isSelected = p.id === activeProjectId;
                      return (
                        <div
                          key={p.id}
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: '5px',
                            fontSize: '11.5px',
                            fontWeight: isSelected ? 800 : 600,
                            background: isSelected ? '#e0f2fe' : 'transparent',
                            color: isSelected ? '#0369a1' : '#ffffff',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            setShowProjectDropdown(false);
                            setProjectSearchQuery('');
                          }}
                        >
                          <div>📁 {p.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Client: {p.client}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
            <Printer size={15} /> Print Report
          </button>
        </div>
      </div>

      {/* AI INSIGHTS PANEL */}
      <div className="card" style={{
        background: 'linear-gradient(145deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.7) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)',
        padding: '1.2rem',
        animation: 'fadeInUp 0.4s ease-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem', color: '#c4b5fd' }}>
          <Bot size={18} />
          <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Compliance Insights</h3>
          {isInsightLoading && <Loader2 size={14} className="animate-spin" />}
        </div>
        
        {isInsightLoading || !aiInsights ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Analyzing project specifications and product data...</div>
        ) : (
          <div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '0.8rem' }}>
              {aiInsights.summary}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Risk Level:</span> 
                <strong style={{ 
                  color: aiInsights.riskLevel === 'High' ? '#f87171' : (aiInsights.riskLevel === 'Medium' ? '#fbbf24' : '#34d399'), 
                  marginLeft: '0.4rem' 
                }}>
                  {aiInsights.riskLevel}
                </strong>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px', flex: 1 }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>AI Recommendation:</span> 
                <span style={{ color: '#bae6fd', marginLeft: '0.4rem' }}>{aiInsights.recommendation}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PROJECT & PRODUCTS STATUS SUMMARY PANEL */}
      <div className="card" style={{ 
        background: 'var(--bg-card)', 
        borderColor: 'var(--border-color)', 
        padding: '1rem 1.25rem' 
      }}>
        <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Activity size={14} /> LIVE PROJECT & PRODUCTS COMPLIANCE STATUS DASHBOARD:
        </div>

        <div className="grid-cols-4" style={{ gap: '0.85rem' }}>
          {/* Project Status */}
          <div style={{ 
            background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '8px', 
            border: '1px solid var(--border-color)' 
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Project PO / Tender ID</div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-heading)', marginTop: '0.2rem' }}>
              {activeProject?.poNumber || activeProject?.code || 'N/A'}
            </div>
            <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '0.25rem', fontWeight: 700 }}>
              Client: {activeProject?.client}
            </div>
          </div>

          {/* Accepted Products Status - 1-CLICK INTERACTIVE FILTER */}
          <div 
            style={{ 
              background: 'var(--bg-card)', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: statusFilter === 'ACCEPTED' ? '2.5px solid #059669' : '1px solid #86efac',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: statusFilter === 'ACCEPTED' ? '0 0 12px rgba(5, 150, 105, 0.25)' : 'none'
            }}
            onClick={() => setStatusFilter(statusFilter === 'ACCEPTED' ? 'ALL' : 'ACCEPTED')}
            title="Click to view only Accepted compliant products"
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#166534', fontWeight: 800 }}>Accepted Compliant</span>
              <CheckCircle2 size={13} color="#059669" />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#059669', marginTop: '0.1rem' }}>
              {acceptedCount} Products
            </div>

          </div>

          {/* Rejected Products Status - 1-CLICK INTERACTIVE FILTER */}
          <div 
            style={{ 
              background: 'var(--bg-card)', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: statusFilter === 'REJECTED' ? '2.5px solid #e11d48' : '1px solid #fecdd3',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: statusFilter === 'REJECTED' ? '0 0 12px rgba(225, 29, 72, 0.25)' : 'none'
            }}
            onClick={() => setStatusFilter(statusFilter === 'REJECTED' ? 'ALL' : 'REJECTED')}
            title="Click to view only Rejected products"
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#991b1b', fontWeight: 800 }}>Rejected / Non-Compliant</span>
              <XCircle size={13} color="#e11d48" />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#e11d48', marginTop: '0.1rem' }}>
              {rejectedCount} Products
            </div>

          </div>

          {/* Total Evaluated & Domain Status - 1-CLICK SHOW ALL */}
          <div 
            style={{ 
              background: 'var(--bg-card)', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: statusFilter === 'ALL' ? '2.5px solid #0284c7' : '1px solid #cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setStatusFilter('ALL')}
            title="Click to view all candidate models"
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Product Domain Category</div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-heading)', marginTop: '0.2rem' }}>
              {activeCategory?.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Total Screened: <strong style={{ color: 'var(--text-heading)' }}>{categoryProducts.length} candidate models</strong>
            </div>

          </div>
        </div>
      </div>

      {/* AP-CRDA AMARAVATI SMART POLE TENDER SPECIFICATION & QUANTITIES TABLE */}
      {activeProject?.itemsQuantity && (
        <div className="card" style={{ 
          marginTop: '1.25rem',
          marginBottom: '1.25rem',
          background: '#0d131f', 
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.1rem', fontWeight: 800 }}>
                  AP-CRDA Amaravati Smart City Smart Pole Project - Indicative Specs & Quantity Breakdown
                </h3>
              </div>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Tender PO No: <strong>{activeProject.poNumber}</strong> | Client: <strong>{activeProject.client}</strong>
              </p>
            </div>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
              📊 11 Subsystems Registered
            </span>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#161f30', borderBottom: '2px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
                  <th style={{ padding: '0.65rem', textAlign: 'center', width: '50px' }}>S.No.</th>
                  <th style={{ padding: '0.65rem', textAlign: 'left', minWidth: '170px' }}>Smart Pole Feature</th>
                  <th style={{ padding: '0.65rem', textAlign: 'left' }}>Indicative Specification</th>
                  <th style={{ padding: '0.65rem', textAlign: 'center', width: '160px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800 }}>Indicative Units (Qty)</th>
                </tr>
              </thead>
              <tbody>
                {activeProject.itemsQuantity.map((item) => (
                  <tr key={item.sNo} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: item.sNo % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                    <td style={{ padding: '0.65rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>{item.sNo}</td>
                    <td style={{ padding: '0.65rem', fontWeight: 700, color: '#ffffff' }}>
                      <div style={{ color: '#38bdf8', fontSize: '12px' }}>{item.feature}</div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>{item.category}</span>
                    </td>
                    <td style={{ padding: '0.65rem', color: '#d1d5db', lineHeight: '1.45', fontSize: '11.5px' }}>{item.spec}</td>
                    <td style={{ padding: '0.65rem', textAlign: 'center', fontWeight: 800, color: '#34d399', background: 'rgba(16, 185, 129, 0.04)', fontSize: '12.5px' }}>
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
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '8px',
            color: '#fde047'
          }}>
            <div style={{ fontWeight: 800, fontSize: '12px', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ⚠️ Smart Pole Customisation (Mandatory Tender Condition)
            </div>
            <p style={{ margin: '0 0 0.35rem 0', fontSize: '11.5px', color: '#e5e7eb', lineHeight: '1.45' }}>
              All Smart Pole components, subsystems, accessories, civil works, electrical works, networking components, IoT devices, display systems, AI-enabled modules and associated infrastructure shall be supplied and implemented strictly on the basis of stakeholder-specific requirements, site conditions, engineering feasibility, regulatory approvals and final approved implementation designs.
            </p>
            <p style={{ margin: 0, fontSize: '11.5px', color: '#fef08a', fontWeight: 600 }}>
              The entire Smart Pole component shall be delivered as per the stakeholder-customised needs and site-feasibility conditions. The selected vendor shall accommodate such customisation without altering the overall project objectives and performance requirements, and without any additional cost over the accepted unit rates.
            </p>
          </div>
        </div>
      )}

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
            const anomalyData = productAnomalies[product.id];

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
                        <span className="badge badge-accept" style={{ background: 'rgba(217, 119, 6, 0.35)', borderColor: 'rgba(245, 158, 11, 0.6)', color: '#fef08a', fontWeight: 800 }}>
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
                      <div style={{ fontSize: '11px', color: '#fde047', marginTop: '0.2rem', fontWeight: 700 }}>
                        ★ Waiver Reason: {res.overrideReason} ({res.overrideNotes})
                      </div>
                    )}

                    {anomalyData?.hasAnomalies && (
                      <div style={{ marginTop: '0.6rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px' }}>
                        <div style={{ fontWeight: 800, color: '#ef4444', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <AlertOctagon size={13} /> ML Risk Anomalies Detected:
                        </div>
                        <ul style={{ paddingLeft: '1.2rem', margin: '0.3rem 0 0 0', fontSize: '11px', color: '#f87171' }}>
                          {anomalyData.anomalies.map((anom, idx) => (
                            <li key={idx}>{anom}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Product Procurement Status Selector & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Product Status:</span>
                      <select 
                        className="form-select" 
                        style={{ width: '180px', padding: '0.3rem 0.5rem', fontSize: '11px' }}
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
                    marginTop: '0.75rem', padding: '0.6rem 0.85rem', background: '#fef2f2', 
                    borderRadius: 'var(--radius-md)', border: '1px solid #fca5a5' 
                  }}>
                    <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '12px', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <XCircle size={13} color="#dc2626" /> Rejection Reasons ({res.failedCount} failed specs):
                    </div>
                    <ul style={{ paddingLeft: '1.1rem', fontSize: '12px', color: '#991b1b', fontWeight: 600 }}>
                      {res.rejectionSummary.map((reason, idx) => (
                        <li key={idx} style={{ color: '#991b1b' }}>{reason}</li>
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
                          padding: '0.45rem 0.65rem', background: 'var(--bg-card)', 
                          borderRadius: '6px', border: '1px solid var(--border-color)',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px'
                        }}>
                          <div>
                            <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{altP.name}</span>{' '}
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
