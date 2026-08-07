import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Printer, X, Sparkles, ArrowRight, Award, Calendar } from 'lucide-react';
import { findSimilarProducts } from '../utils/evaluator';
import BrihaspathiLogo from './BrihaspathiLogo';

export default function AuditModal({ data, activeProject, activeCategory, allProducts, onSelectProductForAudit, onScheduleOEMMeeting, onClose }) {
  if (!data) return null;
  const { product, res } = data;

  // Find similar alternative products for customer satisfaction
  const similarProducts = findSimilarProducts(product, activeProject, activeCategory, allProducts);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <BrihaspathiLogo height={34} showTagline={true} />
            <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.5rem' }}>
              PRODUCT COMPLIANCE AUDIT REPORT
            </div>
            <h2 style={{ fontSize: '1.5rem', marginTop: '0.1rem' }}>{product.name}</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Vendor: <strong>{product.vendor}</strong> | SKU: <strong>{product.sku || 'N/A'}</strong> | Project: <strong>{activeProject?.name}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {res.status === 'ACCEPTED' && (
              <button 
                className="btn btn-primary btn-sm"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                onClick={() => {
                  onClose();
                  onScheduleOEMMeeting(product, activeProject);
                }}
              >
                <Calendar size={14} /> Schedule OEM Meeting
              </button>
            )}

            {product.testingStatus && (
              <span className="badge badge-conditional" style={{ textTransform: 'none' }}>
                <Award size={12} /> {product.testingStatus}
              </span>
            )}
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
              <Printer size={15} /> Print Audit
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Overall Status Banner */}
        <div style={{ 
          padding: '1.25rem', borderRadius: 'var(--radius-md)', 
          background: res.status === 'ACCEPTED' ? 'var(--success-bg)' : (res.status === 'REJECTED' ? 'var(--danger-bg)' : 'var(--warning-bg)'),
          border: res.status === 'ACCEPTED' ? '1px solid var(--success-border)' : (res.status === 'REJECTED' ? '1px solid var(--danger-border)' : '1px solid var(--warning-border)'),
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {res.status === 'ACCEPTED' && <CheckCircle2 size={36} color="var(--success)" />}
            {res.status === 'REJECTED' && <XCircle size={36} color="var(--danger)" />}
            {res.status === 'CONDITIONAL' && <AlertTriangle size={36} color="var(--warning)" />}
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: res.status === 'ACCEPTED' ? '#34d399' : (res.status === 'REJECTED' ? '#fb7185' : '#fbbf24') }}>
                EVALUATION DECISION: {res.status}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.1rem' }}>
                Passed <strong>{res.passedCount}</strong> out of <strong>{res.totalCount}</strong> evaluated specification rules ({res.score}% compliance score)
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{res.score}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Specification Match Score</div>
          </div>
        </div>

        {/* Rejection Rationale Summary Box */}
        {res.rejectionSummary.length > 0 && (
          <div style={{ 
            marginBottom: '1.5rem', padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', 
            borderRadius: 'var(--radius-md)', border: '1px solid var(--danger-border)' 
          }}>
            <h4 style={{ color: '#fb7185', fontSize: '0.92rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <XCircle size={16} /> Rejection Breakdown ({res.failedCount} Non-Compliant Specification Criteria):
            </h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#fecdd3' }}>
              {res.rejectionSummary.map((reason, idx) => (
                <li key={idx} style={{ marginBottom: '0.2rem' }}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Customer Satisfaction: Recommended Compliant Alternatives */}
        {res.status !== 'ACCEPTED' && similarProducts.length > 0 && (
          <div style={{ 
            marginBottom: '1.5rem', padding: '1.25rem', 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)', 
            borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.3)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles color="#818cf8" size={20} />
              <div>
                <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>
                  Recommended Compliant Alternatives (Customer Satisfaction Boost)
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Since {product.name} is rejected, recommend these tested alternatives to your client:
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {similarProducts.slice(0, 2).map(({ product: altProd, res: altRes, matchIndex, recommendationReason }) => (
                <div key={altProd.id} style={{ 
                  padding: '0.75rem 1rem', background: 'rgba(11, 15, 25, 0.7)', 
                  borderRadius: '8px', border: '1px solid var(--border-color)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{altProd.name}</span>
                      <span className="badge badge-accept">ACCEPTED</span>
                      {altProd.testingStatus && (
                        <span className="badge badge-conditional" style={{ textTransform: 'none', fontSize: '0.72rem' }}>
                          {altProd.testingStatus}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '0.2rem' }}>
                      ✓ {recommendationReason}
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => onSelectProductForAudit(altProd, altRes)}
                  >
                    Switch & Audit <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parameter Audit Table */}
        <h4 style={{ fontSize: '1rem', color: '#818cf8', marginBottom: '0.75rem' }}>
          Detailed Parameter Compliance Audit
        </h4>

        <div className="table-container">
          <table className="spec-table">
            <thead>
              <tr>
                <th>Specification Field</th>
                <th>Project Required Threshold</th>
                <th>Product Provided Value</th>
                <th>Compliance Status</th>
                <th>Audit Notes</th>
              </tr>
            </thead>
            <tbody>
              {res.paramAudit.map(audit => (
                <tr key={audit.key} style={{ 
                  background: audit.passed ? 'transparent' : 'rgba(244, 63, 94, 0.05)' 
                }}>
                  <td style={{ fontWeight: 600 }}>{audit.label}</td>
                  <td style={{ color: '#818cf8', fontWeight: 600 }}>
                    {String(audit.required)}{audit.unit ? ' ' + audit.unit : ''}
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {String(audit.provided)}{audit.unit ? ' ' + audit.unit : ''}
                  </td>
                  <td>
                    {audit.passed ? (
                      <span className="badge badge-accept"><CheckCircle2 size={12} /> PASS</span>
                    ) : (
                      <span className="badge badge-reject"><XCircle size={12} /> FAIL</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: audit.passed ? 'var(--text-muted)' : 'var(--danger)' }}>
                    {audit.passed ? 'Meets project specification' : audit.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes & Actions Footer */}
        <div style={{ 
          marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Notes: {product.notes || 'No extra notes provided.'}
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Audit Window
          </button>
        </div>
      </div>
    </div>
  );
}
