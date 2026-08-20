import React, { useState } from 'react';
import { Columns3, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { evaluateProductAgainstProject } from '../utils/evaluator';

export default function ComparisonMatrix({ projects, products, categories, activeProjectId }) {
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeCategory = categories.find(c => c.id === activeProject?.categoryId);

  const categoryProducts = products.filter(p => p.categoryId === activeProject?.categoryId);

  // Selected products for side-by-side comparison (default first 3)
  const [selectedProductIds, setSelectedProductIds] = useState(
    categoryProducts.slice(0, 3).map(p => p.id)
  );

  const toggleProductSelection = (id) => {
    if (selectedProductIds.includes(id)) {
      if (selectedProductIds.length > 1) {
        setSelectedProductIds(selectedProductIds.filter(item => item !== id));
      }
    } else {
      if (selectedProductIds.length < 4) {
        setSelectedProductIds([...selectedProductIds, id]);
      } else {
        alert('You can compare up to 4 products side-by-side.');
      }
    }
  };

  const selectedProducts = categoryProducts.filter(p => selectedProductIds.includes(p.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Side-by-Side Specification Comparison Matrix</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Compare candidate products side-by-side against project requirements for <strong>{activeProject?.name}</strong>
            </p>
          </div>
        </div>

        {/* Product Selection Pickers */}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
            SELECT PRODUCTS TO COMPARE (UP TO 4):
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categoryProducts.map(prod => {
              const isSelected = selectedProductIds.includes(prod.id);
              return (
                <button
                  key={prod.id}
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => toggleProductSelection(prod.id)}
                >
                  {isSelected ? '✓ ' : '+ '}{prod.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="card">
        <div className="table-container">
          <table className="spec-table">
            <thead>
              <tr style={{ background: 'var(--bg-card-hover)', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ width: '220px', background: 'var(--bg-card-hover)', color: 'var(--text-heading)', fontWeight: 800 }}>Specification Parameter</th>
                <th style={{ background: '#e0e7ff', color: '#4338ca', width: '200px', fontWeight: 800 }}>
                  Project Required Threshold
                </th>
                {selectedProducts.map(prod => {
                  const evalRes = evaluateProductAgainstProject(prod, activeProject, activeCategory);
                  return (
                    <th key={prod.id} style={{ minWidth: '220px', textAlign: 'center', background: 'var(--bg-card)', borderBottom: '2px solid #cbd5e1' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-heading)' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{prod.vendor}</div>
                      <div style={{ marginTop: '0.4rem' }}>
                        {evalRes.status === 'ACCEPTED' && <span className="badge badge-accept">ACCEPTED</span>}
                        {evalRes.status === 'REJECTED' && <span className="badge badge-reject">REJECTED</span>}
                        {evalRes.status === 'CONDITIONAL' && <span className="badge badge-conditional">CONDITIONAL</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {activeCategory?.fields.map(field => {
                const reqVal = activeProject?.requirements?.[field.key];

                return (
                  <tr key={field.key}>
                    <td style={{ fontWeight: 600 }}>
                      {field.label}
                    </td>
                    <td style={{ background: 'rgba(99, 102, 241, 0.05)', fontWeight: 700, color: '#818cf8' }}>
                      {reqVal !== undefined && reqVal !== null && reqVal !== '' 
                        ? `${String(reqVal)}${field.unit ? ' ' + field.unit : ''}` 
                        : 'Any'}
                    </td>
                    {selectedProducts.map(prod => {
                      const evalRes = evaluateProductAgainstProject(prod, activeProject, activeCategory);
                      const audit = evalRes.paramAudit.find(a => a.key === field.key);

                      if (!audit) {
                        return <td key={prod.id} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>N/A</td>;
                      }

                      return (
                        <td key={prod.id} style={{ 
                          textAlign: 'center',
                          background: audit.passed ? 'rgba(16, 185, 129, 0.03)' : 'rgba(244, 63, 94, 0.03)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            {audit.passed ? (
                              <CheckCircle2 size={16} color="var(--success)" />
                            ) : (
                              <XCircle size={16} color="var(--danger)" />
                            )}
                            <span style={{ fontWeight: 700 }}>
                              {String(audit.provided)}{audit.unit ? ' ' + audit.unit : ''}
                            </span>
                          </div>
                          {!audit.passed && audit.reason && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--danger)', marginTop: '0.15rem' }}>
                              {audit.reason}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
