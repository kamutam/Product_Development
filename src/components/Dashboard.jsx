import React from 'react';
import { 
  CheckCircle2, XCircle, AlertTriangle, ShieldAlert, FileText, ArrowRight, Camera, Sun, Fingerprint, Plane, Code, Cpu, Plus
} from 'lucide-react';
import { evaluateProductAgainstProject } from '../utils/evaluator';

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

  const handleCardClick = (statusVal) => {
    if (setEvaluatorStatusFilter) {
      setEvaluatorStatusFilter(statusVal);
    }
    setActiveTab('evaluator');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner / Active Project Greeting with 1-Click Project Switcher & Product Details Hub */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.18) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PRODUCT DEVELOPMENT &bull; ACTIVE PROJECT INSPECTION
            </span>
            <span className="badge badge-accept" style={{ fontSize: '10.5px' }}>
              {projects.length} Total Projects
            </span>
          </div>

          {/* Clickable Project Title */}
          <h2 
            style={{ fontSize: '1.5rem', marginTop: '0.15rem', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            onClick={() => setActiveTab('evaluator')}
            title="Click to view full product spec evaluation details for this project"
          >
            📁 {activeProject?.name} <ArrowRight size={18} color="#818cf8" />
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            PO / Tender ID: <strong>{activeProject?.poNumber || activeProject?.code || 'N/A'}</strong> &bull; Client: <strong>{activeProject?.client}</strong> &bull; Category: <span className="badge badge-conditional">{activeCategory?.name}</span>
          </p>
        </div>

        {/* 1-Click Project Switcher & Product Inspection Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Direct Project Switcher Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: 700 }}>⚡ 1-Click Switch Project:</span>
            <select 
              className="form-select" 
              style={{ width: '280px', padding: '0.4rem 0.65rem', fontSize: '12px', borderColor: 'rgba(99, 102, 241, 0.5)', background: 'rgba(11, 15, 25, 0.8)', color: '#ffffff', fontWeight: 700 }}
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

          <div style={{ display: 'flex', gap: '0.45rem', marginTop: '1rem' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('evaluator')} title="Inspect candidate products for selected project">
              Run Spec Inspection <ArrowRight size={15} />
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('inspection-summary')} title="View decision summary table for all projects">
              📋 All Projects Product Details
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards with 1-Click Interactive Status Filter */}
      <div className="grid-cols-4">
        {/* CARD 1: ACCEPTANCE RATE */}
        <div 
          className="card" 
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease', 
            border: evaluatorStatusFilter === 'ALL' ? '1.5px solid #10b981' : '1px solid var(--border-color)',
            boxShadow: evaluatorStatusFilter === 'ALL' ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
          }}
          onClick={() => handleCardClick('ALL')}
          title="Click to view all screened candidate products"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Acceptance Rate</span>
            <CheckCircle2 color="var(--success)" size={20} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--success)' }}>
            {acceptRate}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {acceptedCount} of {totalScreened} candidate products compliant
          </div>
          <div style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 700, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            👉 1-Click: View All ({totalScreened})
          </div>
        </div>

        {/* CARD 2: ACCEPTED PRODUCTS */}
        <div 
          className="card" 
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease',
            border: evaluatorStatusFilter === 'ACCEPTED' ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: evaluatorStatusFilter === 'ACCEPTED' ? '0 0 15px rgba(16, 185, 129, 0.35)' : 'none',
            background: 'rgba(16, 185, 129, 0.05)'
          }}
          onClick={() => handleCardClick('ACCEPTED')}
          title="Click to view only Accepted products"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700 }}>Accepted Products</span>
            <CheckCircle2 color="var(--success)" size={20} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: '#34d399' }}>
            {acceptedCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Ready for procurement approval
          </div>
          <div style={{ fontSize: '10.5px', color: '#34d399', fontWeight: 700, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            👉 1-Click: View Accepted ({acceptedCount})
          </div>
        </div>

        {/* CARD 3: REJECTED PRODUCTS */}
        <div 
          className="card" 
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease',
            border: evaluatorStatusFilter === 'REJECTED' ? '2px solid #fb7185' : '1px solid rgba(244, 63, 94, 0.3)',
            boxShadow: evaluatorStatusFilter === 'REJECTED' ? '0 0 15px rgba(244, 63, 94, 0.35)' : 'none',
            background: 'rgba(244, 63, 94, 0.05)'
          }}
          onClick={() => handleCardClick('REJECTED')}
          title="Click to view only Rejected products"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#fb7185', fontWeight: 700 }}>Rejected Products</span>
            <XCircle color="var(--danger)" size={20} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--danger)' }}>
            {rejectedCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Failed mandatory project specs
          </div>
          <div style={{ fontSize: '10.5px', color: '#fb7185', fontWeight: 700, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            👉 1-Click: View Rejected ({rejectedCount})
          </div>
        </div>

        {/* CARD 4: CONDITIONAL / REVIEW PRODUCTS */}
        <div 
          className="card" 
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease',
            border: evaluatorStatusFilter === 'CONDITIONAL' ? '2px solid #fbbf24' : '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: evaluatorStatusFilter === 'CONDITIONAL' ? '0 0 15px rgba(245, 158, 11, 0.35)' : 'none',
            background: 'rgba(245, 158, 11, 0.05)'
          }}
          onClick={() => handleCardClick('CONDITIONAL')}
          title="Click to view only Conditional / Review products"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700 }}>Conditional / Review</span>
            <AlertTriangle color="var(--warning)" size={20} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--warning)' }}>
            {conditionalCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Minor spec warnings
          </div>
          <div style={{ fontSize: '10.5px', color: '#fbbf24', fontWeight: 700, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
    </div>
  );
}
