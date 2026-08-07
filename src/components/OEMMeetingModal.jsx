import React, { useState } from 'react';
import { Calendar, Mail, Phone, MessageSquare, CheckCircle2, Building2, User, Clock, X, Send } from 'lucide-react';

export default function OEMMeetingModal({ product, project, onClose }) {
  if (!product) return null;

  const oemName = product.vendor || 'OEM Manufacturer';
  const oemContactName = product.oemContactName || `${product.vendor} Enterprise Sales Team`;
  const oemEmail = product.oemEmail || `sales@${product.vendor.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  const oemPhone = product.oemPhone || '+91 98765 43210';

  const [meetingDate, setMeetingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [meetingTime, setMeetingTime] = useState('11:00');
  const [meetingAgenda, setMeetingAgenda] = useState(
    `Discussion regarding procurement order for ${product.name} (SKU: ${product.sku || 'N/A'}) for Project: ${project?.name || 'Upcoming Project'} (PO/Tender: ${project?.poNumber || project?.code || 'N/A'}).`
  );
  const [meetingSent, setMeetingSent] = useState(false);

  // Mailto builder
  const mailSubject = encodeURIComponent(`Meeting Request: Procurement Discussion for ${project?.name || 'Project'} - ${product.name}`);
  const mailBody = encodeURIComponent(
    `Dear ${oemContactName},\n\nWe have reviewed and ACCEPTED your product specification for our project:\n\n` +
    `Project: ${project?.name || 'N/A'}\n` +
    `PO / Tender ID: ${project?.poNumber || project?.code || 'N/A'}\n` +
    `Accepted Product: ${product.name} (SKU: ${product.sku || 'N/A'})\n\n` +
    `We would like to schedule a technical & commercial alignment meeting.\n\n` +
    `Proposed Date & Time: ${meetingDate} at ${meetingTime}\n` +
    `Agenda: ${meetingAgenda}\n\n` +
    `Please confirm your availability.\n\n` +
    `Best regards,\nProduct Development & Procurement Team`
  );

  const mailtoUrl = `mailto:${oemEmail}?subject=${mailSubject}&body=${mailBody}`;
  const whatsappUrl = `https://wa.me/${oemPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${oemContactName}, regarding project ${project?.name || ''} - ${product.name}. We would like to schedule a meeting on ${meetingDate} at ${meetingTime}.`)}`;

  const handleConfirmSchedule = (e) => {
    e.preventDefault();
    setMeetingSent(true);
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '10px', 
              background: 'rgba(16, 185, 129, 0.15)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', color: '#34d399' 
            }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem' }}>Schedule OEM Meeting</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Direct contact & meeting scheduler for accepted product OEM
              </p>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Accepted Product Banner */}
        <div style={{ 
          padding: '1rem', background: 'var(--success-bg)', 
          border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <span className="badge badge-accept" style={{ marginBottom: '0.3rem' }}>
              <CheckCircle2 size={12} /> ACCEPTED PRODUCT
            </span>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>{product.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Target Project: <strong>{project?.name}</strong> (PO/Tender: {project?.poNumber || project?.code || 'N/A'})
            </div>
          </div>
        </div>

        {/* OEM Contact Information Card */}
        <div style={{ 
          padding: '1rem', background: 'rgba(11, 15, 25, 0.7)', 
          border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building2 size={15} /> OEM MANUFACTURER CONTACT DIRECTORY:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <User size={13} /> Representative Name:
              </div>
              <div style={{ fontWeight: 700, marginTop: '0.1rem' }}>{oemContactName}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Mail size={13} /> Official OEM Email:
              </div>
              <div style={{ fontWeight: 700, marginTop: '0.1rem', color: '#818cf8' }}>{oemEmail}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Phone size={13} /> Phone / WhatsApp:
              </div>
              <div style={{ fontWeight: 700, marginTop: '0.1rem' }}>{oemPhone}</div>
            </div>
          </div>
        </div>

        {/* Meeting Schedule Form */}
        <form onSubmit={handleConfirmSchedule}>
          <div className="form-row">
            <div className="form-group">
              <label>Proposed Meeting Date *</label>
              <input 
                type="date" 
                className="form-input" 
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Proposed Time *</label>
              <input 
                type="time" 
                className="form-input" 
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Meeting Agenda & Notes</label>
            <textarea 
              className="form-textarea" 
              rows="3"
              value={meetingAgenda}
              onChange={(e) => setMeetingAgenda(e.target.value)}
            />
          </div>

          {meetingSent && (
            <div style={{ 
              marginBottom: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', 
              border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#34d399', 
              fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' 
            }}>
              <CheckCircle2 size={16} /> Opening your email client to send meeting request to {oemEmail}...
            </div>
          )}

          {/* Direct Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-secondary btn-sm"
              style={{ background: 'rgba(37, 211, 102, 0.15)', borderColor: 'rgba(37, 211, 102, 0.3)', color: '#25D366' }}
            >
              <MessageSquare size={15} /> WhatsApp OEM Contact
            </a>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <a href={mailtoUrl} className="btn btn-primary" onClick={() => setMeetingSent(true)}>
                <Send size={16} /> Send Email & Meeting Invite
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
