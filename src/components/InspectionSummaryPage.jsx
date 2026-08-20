import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertTriangle, Printer, Search, ArrowRight, ShieldCheck, Filter, Award, Calendar, FileText
} from 'lucide-react';
import { evaluateProductAgainstProject } from '../utils/evaluator';

export default function InspectionSummaryPage({ 
  projects, products, categories, activeProjectId, setSelectedProjectId, onSelectProductForAudit, onScheduleOEMMeeting 
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeCategory = categories.find(c => c.id === activeProject?.categoryId);

  // Evaluate all products in category against selected project
  const currentCategoryProducts = products.filter(p => p.categoryId === activeProject?.categoryId);
  const evaluations = currentCategoryProducts.map(p => ({
    product: p,
    res: evaluateProductAgainstProject(p, activeProject, activeCategory)
  }));

  // Filtered list
  const filteredList = evaluations.filter(({ product, res }) => {
    const matchesStatus = statusFilter === 'ALL' || res.status === statusFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const acceptedCount = evaluations.filter(e => e.res.status === 'ACCEPTED').length;
  const rejectedCount = evaluations.filter(e => e.res.status === 'REJECTED').length;
  const conditionalCount = evaluations.filter(e => e.res.status === 'CONDITIONAL').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner & Project Selector */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
            Real-Time Accept / Reject Decision Audit
          </div>
          <h2 style={{ fontSize: '1.25rem' }}>
            Automated Inspection Summary for {activeProject?.name}
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            PO / Tender ID: <strong>{activeProject?.poNumber || activeProject?.code || 'N/A'}</strong> &bull; Client: <strong>{activeProject?.client}</strong> &bull; Category: <span className="badge badge-conditional">{activeCategory?.name}</span>
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
                justifyContent: 'space-between',
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
            <Printer size={15} /> Print Inspection Summary
          </button>
        </div>
      </div>

      {/* Status Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button 
            className={`btn ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Models ({evaluations.length})
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
          <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search model SKU or vendor..."
            style={{ paddingLeft: '2.1rem', padding: '0.35rem 0.65rem', fontSize: '12px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Inspection Summary Master Table */}
      <div className="card">
        <div className="table-container">
          <table className="spec-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>S.No</th>
                <th style={{ width: '260px' }}>Product Name & Model SKU</th>
                <th>OEM Vendor</th>
                <th>Category</th>
                <th style={{ width: '130px' }}>Compliance Score</th>
                <th>Passed / Failed</th>
                <th>Decision Status</th>
                <th style={{ width: '150px' }}>Inspection Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                    No products found matching active search/filter for this project.
                  </td>
                </tr>
              ) : (
                filteredList.map(({ product, res }, idx) => (
                  <tr key={product.id}>
                    {/* S.No */}
                    <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                      {idx + 1}.
                    </td>

                    {/* Product Name */}
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-heading)' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '0.1rem' }}>
                        SKU: {product.sku || 'N/A'}
                      </div>
                    </td>

                    {/* Vendor */}
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-muted)' }}>
                        {product.vendor}
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="badge badge-conditional" style={{ fontSize: '10px' }}>
                        {activeCategory?.name}
                      </span>
                    </td>

                    {/* Compliance Score Bar */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${res.score}%`, height: '100%', 
                            background: res.score === 100 ? '#34d399' : (res.score >= 75 ? '#fbbf24' : '#fb7185') 
                          }} />
                        </div>
                        <strong style={{ fontSize: '12px', color: res.score === 100 ? 'var(--success)' : 'var(--text-heading)' }}>{res.score}%</strong>
                      </div>
                    </td>

                    {/* Passed / Failed */}
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 700 }}>
                        <span style={{ color: '#34d399' }}>{res.passedCount} Pass</span> / <span style={{ color: '#fb7185' }}>{res.failedCount} Fail</span>
                      </div>
                    </td>

                    {/* Decision Status */}
                    <td>
                      {res.status === 'ACCEPTED' && <span className="badge badge-accept"><CheckCircle2 size={11} /> ACCEPTED</span>}
                      {res.status === 'REJECTED' && <span className="badge badge-reject"><XCircle size={11} /> REJECTED</span>}
                      {res.status === 'CONDITIONAL' && <span className="badge badge-conditional"><AlertTriangle size={11} /> CONDITIONAL</span>}
                    </td>

                    {/* Inspection Actions */}
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '11px', padding: '0.25rem 0.5rem' }}
                          onClick={() => onSelectProductForAudit(product, res)}
                        >
                          Audit Details
                        </button>

                        {res.status === 'ACCEPTED' && (
                          <button 
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '11px', padding: '0.25rem 0.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                            onClick={() => onScheduleOEMMeeting(product, activeProject)}
                          >
                            <Calendar size={12} /> OEM
                          </button>
                        )}
                      </div>
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
