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

export default function Dashboard({ projects, products, categories, activeProjectId, setActiveTab, setSelectedProjectId, onSelectProductForAudit }) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner / Active Project Greeting */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Product Development
          </div>
          <h2 style={{ fontSize: '1.6rem', marginTop: '0.2rem' }}>{activeProject?.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            PO / Tender ID: <strong>{activeProject?.poNumber || activeProject?.code || 'N/A'}</strong> &bull; Client: <strong>{activeProject?.client}</strong> &bull; Category: <span className="badge badge-conditional">{activeCategory?.name}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('evaluator')}>
            Run Spec Inspection <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid-cols-4">
        <div className="card">
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
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Accepted Products</span>
            <CheckCircle2 color="var(--success)" size={20} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {acceptedCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Ready for procurement approval
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Rejected Products</span>
            <XCircle color="var(--danger)" size={20} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--danger)' }}>
            {rejectedCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Failed mandatory project specs
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Conditional / Review</span>
            <AlertTriangle color="var(--warning)" size={20} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--warning)' }}>
            {conditionalCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Minor spec warnings
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
