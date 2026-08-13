import React, { useState } from 'react';
import { Mail, Search, Copy, Check, Eye, Trash2, Calendar, Building2, CheckCircle2, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export default function EmailHistoryPage({ emailHistory = [], setEmailHistory }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    if (!setEmailHistory) return;
    const updated = emailHistory.map(e => e.id === id ? { ...e, status: newStatus } : e);
    setEmailHistory(updated);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this email from communication history?')) {
      if (setEmailHistory) {
        setEmailHistory(emailHistory.filter(e => e.id !== id));
      }
    }
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredHistory = emailHistory.filter(e => {
    const matchesSearch = 
      (e.oemName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.requirementTitle || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sent':
        return <span className="badge badge-accept"><CheckCircle2 size={12} /> SENT</span>;
      case 'Response Received':
        return <span className="badge badge-accept" style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd' }}><MessageSquare size={12} /> RESPONSE RECEIVED</span>;
      case 'Follow-up Required':
        return <span className="badge badge-conditional"><Clock size={12} /> FOLLOW-UP REQUIRED</span>;
      case 'Closed':
        return <span className="badge" style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1' }}>CLOSED</span>;
      default:
        return <span className="badge badge-conditional"><Clock size={12} /> DRAFT / GENERATED</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            BRIHASPATHI TECHNOLOGIES &bull; OEM B2B COMMUNICATION LOG
          </div>
          <h2 style={{ fontSize: '1.25rem', marginTop: '0.15rem' }}>OEM Email & Procurement History</h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Track generated B2B inquiries, OEM vendor dispatches, quotation follow-ups, and negotiation history.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="badge badge-accept" style={{ fontSize: '11.5px' }}>
            {emailHistory.length} Recorded Communications
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '0.85rem 1.15rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1, minWidth: '280px' }}>
          <div className="search-input-wrapper" style={{ flex: 1 }}>
            <Search size={15} className="search-icon" />
            <input 
              type="text"
              className="form-control"
              placeholder="Search by OEM Name, Requirement, or Subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Status Filter:</span>
          <select 
            className="form-select"
            style={{ width: '190px', padding: '0.4rem 0.65rem', fontSize: '12px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Generated">Draft / Generated</option>
            <option value="Sent">Sent</option>
            <option value="Response Received">Response Received</option>
            <option value="Follow-up Required">Follow-up Required</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Communications Table */}
      <div className="card">
        <div className="table-container">
          <table className="spec-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>OEM Vendor</th>
                <th>Requirement / Title</th>
                <th>Email Subject</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    {searchQuery ? `No email logs found matching "${searchQuery}".` : 'No OEM communications recorded yet. Click "Send Requirement" on any OEM in the Directory to generate B2B inquiry emails!'}
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700, color: '#475569', whiteSpace: 'nowrap' }}>
                      <Calendar size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      {item.date}
                    </td>
                    <td style={{ fontWeight: 800, color: '#0f172a' }}>
                      <Building2 size={13} style={{ verticalAlign: 'middle', marginRight: '4px', color: '#0284c7' }} />
                      {item.oemName}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0284c7' }}>
                      {item.requirementTitle || 'Product Requirement Inquiry'}
                    </td>
                    <td style={{ color: '#475569', fontSize: '11.5px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.subject}
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        style={{ padding: '0.25rem 0.45rem', fontSize: '11px', fontWeight: 700, width: '160px' }}
                        value={item.status || 'Generated'}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      >
                        <option value="Generated">Draft / Generated</option>
                        <option value="Sent">Sent to OEM</option>
                        <option value="Response Received">Response Received</option>
                        <option value="Follow-up Required">Follow-up Required</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '11px' }}
                          onClick={() => setSelectedEmail(item)}
                          title="View Full Generated Email Content"
                        >
                          <Eye size={13} /> View
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '11px' }}
                          onClick={() => handleCopyText(`Subject: ${item.subject}\n\n${item.body}`, item.id)}
                          title="Copy Full Email Text"
                        >
                          {copiedId === item.id ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '11px' }}
                          onClick={() => handleDelete(item.id)}
                          title="Delete Communication Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW EMAIL MODAL */}
      {selectedEmail && (
        <div className="modal-overlay" onClick={() => setSelectedEmail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800 }}>COMMUNICATION DETAIL &bull; {selectedEmail.date}</span>
                <h3 style={{ fontSize: '1.2rem', marginTop: '0.1rem' }}>B2B Inquiry to {selectedEmail.oemName}</h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedEmail(null)}>
                Close
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1rem' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Subject:</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>{selectedEmail.subject}</div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '0.35rem' }}>Email Message Body:</div>
              <textarea 
                className="form-textarea"
                rows="14"
                readOnly
                value={selectedEmail.body}
                style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.5, background: '#ffffff', color: '#0f172a' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button 
                className="btn btn-primary"
                onClick={() => handleCopyText(`Subject: ${selectedEmail.subject}\n\n${selectedEmail.body}`, 'modal')}
              >
                <Copy size={15} /> Copy Full Email Text
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
