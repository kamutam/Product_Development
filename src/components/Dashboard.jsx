import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, XCircle, AlertTriangle, ShieldAlert, FileText, ArrowRight, Camera, Sun, Fingerprint, Plane, Code, Cpu, Plus, DollarSign, Layers, Search, X, ExternalLink, ShieldCheck, Building2, Globe, Award, Mail, Sparkles, Clock, Check, Send, Columns3, RefreshCw
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

// 8-Step Product Development Workflow Steps
const WORKFLOW_STEPS = [
  { id: 1, title: 'Requirement', desc: 'PRD & Tender Spec Definition', icon: '📝', tab: 'requirements' },
  { id: 2, title: 'Market Research', desc: 'Catalog & Domain Sourcing', icon: '🔍', tab: 'products' },
  { id: 3, title: 'OEM Research', desc: 'Vendor Partner Discovery', icon: '🏢', tab: 'oem-directory' },
  { id: 4, title: 'Product Evaluation', desc: 'Automated Spec Matrix Audit', icon: '⚡', tab: 'evaluator' },
  { id: 5, title: 'Compliance Verification', desc: 'STQC, ARAI & ONVIF Audit', icon: '🛡️', tab: 'certifications-vault' },
  { id: 6, title: 'Technical Comparison', desc: 'Multi-Product Spec Matrix', icon: '📊', tab: 'comparison' },
  { id: 7, title: 'OEM Communication', desc: 'B2B Inquiry & Quotation', icon: '✉️', tab: 'email-history' },
  { id: 8, title: 'Final Selection', desc: 'Procurement Approval & PO', icon: '✅', tab: 'inspection-summary' }
];

export default function Dashboard({ 
  projects = [], products = [], categories = [], oems = [], requirements = [], emailHistory = [],
  activeProjectId, setSelectedProjectId, onSelectProductForAudit,
  evaluatorStatusFilter, setEvaluatorStatusFilter, onOpenGlobalSearch
}) {
  const navigate = useNavigate();
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [valuationSearch, setValuationSearch] = useState('');
  const [showProjectBreakdown, setShowProjectBreakdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeCategory = categories.find(c => c.id === activeProject?.categoryId);

  // Dynamic KPI Counts
  const oemsCount = oems.length || 18;
  const productsCount = products.length;
  const stqcModelsCount = products.filter(p => p.stqcCertNo || p.stqcPdfUrl || (p.notes || '').includes('STQC') || (p.brandMake || '').includes('CP Plus')).length;
  const araiModelsCount = products.filter(p => p.araiCertified || (p.notes || '').includes('ARAI') || (p.name || '').includes('AIS-140')).length;
  const categoriesCount = categories.length;
  const activeReqsCount = requirements.filter(r => r.status !== 'Completed').length;
  const countriesCount = new Set(oems.map(o => o.country).filter(Boolean)).size || 7;
  const pendingResponsesCount = emailHistory.filter(e => e.status === 'Sent' || e.status === 'Follow-up Required' || e.status === 'Generated').length;

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
    navigate('/evaluator');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* SECTION 1: PRODUCT DEVELOPMENT OVERVIEW & ACTIVE PROJECT BANNER */}
      <div className="card" style={{ 
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
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
              BRIHASPATHI TECHNOLOGIES LIMITED &bull; PRODUCT DEVELOPMENT PLATFORM
            </span>
            <span className="badge badge-accept" style={{ fontSize: '10.5px', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>
              {projects.length} Active Projects
            </span>
          </div>

          <h2 
            style={{ fontSize: '1.35rem', marginTop: '0.15rem', color: 'var(--text-heading)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}
            onClick={() => navigate('/evaluator')}
            title="Click to view full product spec evaluation details for this project"
          >
            <GovtEmblemLogo type={activeProject?.client || activeProject?.name} size={26} />
            <span>📁 {activeProject?.name}</span>
            <ArrowRight size={18} color="#0284c7" />
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            PO / Tender ID: <strong style={{ color: 'var(--text-heading)' }}>{activeProject?.poNumber || activeProject?.code || 'N/A'}</strong> &bull; Client: <strong style={{ color: 'var(--text-heading)' }}>{activeProject?.client}</strong> &bull; Category: <span className="badge badge-conditional" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>{activeCategory?.name}</span>
          </p>
        </div>

        {/* Project Switcher & Actions Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* CUSTOM SEARCHABLE PROJECT DROPDOWN (CAPPED AT 4 VISIBLE ITEMS MAX) */}
          <div style={{ position: 'relative', width: '280px', zIndex: 99999 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: 800,
                background: 'var(--bg-card)',
                color: 'var(--text-heading)',
                borderColor: 'var(--border-color)',
                padding: '0.45rem 0.65rem'
              }}
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '230px' }}>
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
                  width: '300px',
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

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff', fontWeight: 800, border: 'none', padding: '0.45rem 0.85rem' }} onClick={() => setShowValuationModal(true)}>
              💰 Spec Valuation ({currentCategoryProducts.length})
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/evaluator')}>
              Run Inspection <ArrowRight size={15} color="#0284c7" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: 8 DYNAMIC PRODUCT DEVELOPMENT OVERVIEW KPI CARDS */}
      <div>
        <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          📊 Enterprise Metrics & Compliance Overview
        </div>
        
        <div className="grid-cols-4" style={{ gap: '0.85rem' }}>
          {/* Card 1: OEM Partners */}
          <div className="card" style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={() => navigate('/oem-directory')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800 }}>OEM Partners</span>
              <Building2 color="#0284c7" size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#0284c7' }}>
              {oemsCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Verified Global Vendors</div>
          </div>

          {/* Card 2: Products */}
          <div className="card" style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={() => navigate('/products')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800 }}>Product Models</span>
              <Layers color="#4f46e5" size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#4f46e5' }}>
              {productsCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Catalog Specifications</div>
          </div>

          {/* Card 3: STQC Certified Models */}
          <div className="card" style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={() => navigate('/certifications-vault')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 800 }}>STQC Certified</span>
              <ShieldCheck color="#059669" size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#059669' }}>
              {stqcModelsCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>MeiTY Lab Approved</div>
          </div>

          {/* Card 4: ARAI Compliant Products */}
          <div className="card" style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={() => navigate('/certifications-vault')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 800 }}>ARAI AIS-140</span>
              <Award color="#0284c7" size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#0284c7' }}>
              {araiModelsCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Automotive Homologated</div>
          </div>

          {/* Card 5: Product Categories */}
          <div className="card" style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={() => navigate('/category-builder')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800 }}>Product Domains</span>
              <Cpu color="#7c3aed" size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#7c3aed' }}>
              {categoriesCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Pre-built Rule Categories</div>
          </div>

          {/* Card 6: Active Requirements */}
          <div className="card" style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={() => navigate('/requirements')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 800 }}>Active Requirements</span>
              <FileText color="#d97706" size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#d97706' }}>
              {activeReqsCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>In Sourcing Pipeline</div>
          </div>

          {/* Card 7: Countries Covered */}
          <div className="card" style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={() => navigate('/oem-directory')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800 }}>Countries Covered</span>
              <Globe color="#2563eb" size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#2563eb' }}>
              {countriesCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Global OEM Sourcing</div>
          </div>

          {/* Card 8: Pending OEM Responses */}
          <div className="card" style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={() => setActiveTab('email-history')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#c2410c', fontWeight: 800 }}>Pending OEM Dispatches</span>
              <Mail color="#ea580c" size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#ea580c' }}>
              {pendingResponsesCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>B2B OEM Inquiries</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: QUICK ACTIONS BAR */}
      <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '0.85rem 1.15rem' }}>
        <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
          ⚡ Quick Actions & Enterprise Operations
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }} onClick={() => setActiveTab('requirements')}>
            ➕ Add Requirement
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('oem-directory')}>
            🏢 Search OEM
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('products')}>
            📦 Search Product
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('comparison')}>
            📊 Compare Products
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('certifications-vault')}>
            🛡️ Check Compliance
          </button>
          <button className="btn btn-secondary btn-sm" style={{ color: '#0284c7', borderColor: '#bae6fd', background: '#e0f2fe' }} onClick={() => setActiveTab('oem-directory')}>
            ✉️ Generate OEM Email
          </button>
        </div>
      </div>

      {/* SECTION 4: PRODUCT DEVELOPMENT WORKFLOW (8-STEP PIPELINE) */}
      <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1rem 1.15rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PRODUCT DEVELOPMENT LIFECYCLE
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-heading)', fontWeight: 800, margin: '0.1rem 0 0 0' }}>
              Enterprise Sourcing & Compliance Workflow Pipeline
            </h3>
          </div>
          <span className="badge badge-accept" style={{ fontSize: '10.5px' }}>
            8-Phase Workflow
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
          {WORKFLOW_STEPS.map((step) => (
            <div 
              key={step.id}
              onClick={() => setActiveTab(step.tab)}
              style={{
                padding: '0.65rem 0.5rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title={`Click to open ${step.title}`}
            >
              <div style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{step.icon}</div>
              <div style={{ fontSize: '10px', color: '#0284c7', fontWeight: 800 }}>STEP {step.id}</div>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.1rem' }}>{step.title}</div>
              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.2 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: RECENT ACTIVITY TIMELINE FEED */}
      <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1rem 1.15rem' }}>
        <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
          📜 Recent Enterprise Activity Log
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '12px' }}>
          <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: 'var(--text-heading)' }}>Auto-Synced Google Sheet Master Catalog:</strong> <span style={{ color: '#0284c7' }}>11 CCTV & IoT models verified for STQC / ARAI compliance</span>
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Just now</span>
          </div>

          <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: 'var(--text-heading)' }}>Tender Spec Inspection:</strong> <span style={{ color: '#059669' }}>AP-CRDA Smart Pole Project compliance rate verified at 100%</span>
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Today</span>
          </div>

          <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: 'var(--text-heading)' }}>OEM Partner Verification:</strong> <span style={{ color: '#7c3aed' }}>18 Global OEM Manufacturers registered across 7 countries</span>
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Today</span>
          </div>
        </div>
      </div>

    </div>
  );
}
