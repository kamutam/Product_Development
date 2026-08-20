import React, { useState } from 'react';
import { X, Send, Copy, Mail, Check, Sparkles, Building2, FileText, CheckCircle2 } from 'lucide-react';
import { generateProfessionalEmail } from '../utils/emailGenerator';

export default function SendRequirementModal({ oem, initialRequirement = '', categories = [], onClose, onRecordEmail }) {
  const [formData, setFormData] = useState({
    title: typeof initialRequirement === 'string' ? initialRequirement : (initialRequirement?.title || ''),
    solution: initialRequirement?.solution || '',
    category: initialRequirement?.category || categories[0]?.name || 'CCTV & Surveillance',
    techSpecs: initialRequirement?.techSpecs || '',
    quantity: initialRequirement?.quantity || '100 Units',
    application: initialRequirement?.application || 'Smart City / Enterprise Infrastructure',
    requiredCertifications: initialRequirement?.requiredCertifications || 'STQC / ARAI / ONVIF',
    deliveryLocation: initialRequirement?.deliveryLocation || 'Hyderabad / Project Site',
    timeline: initialRequirement?.timeline || '30 Days',
    additionalRequirements: initialRequirement?.additionalRequirements || ''
  });

  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    const result = generateProfessionalEmail(oem, formData);
    setGeneratedEmail(result);

    // Record in local email history
    if (onRecordEmail) {
      onRecordEmail({
        id: `email-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        oemName: oem?.name || 'OEM Company',
        oemEmail: oem?.contactEmail || oem?.email || 'N/A',
        requirementTitle: formData.title || 'Product Requirement Inquiry',
        subject: result.subject,
        body: result.body,
        status: 'Generated'
      });
    }
  };

  const handleCopy = () => {
    if (!generatedEmail) return;
    const fullText = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenMailClient = () => {
    if (!generatedEmail) return;
    const recipient = oem?.contactEmail && oem.contactEmail !== 'N/A' ? oem.contactEmail : '';
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(generatedEmail.subject)}&body=${encodeURIComponent(generatedEmail.body)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              BRIHASPATHI TECHNOLOGIES &bull; OEM B2B INQUIRY ENGINE
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-heading)', margin: '0.15rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={22} color="#0284c7" /> Send Technical Requirement to {oem?.name || 'OEM Partner'}
            </h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {!generatedEmail ? (
          /* FORM VIEW */
          <form onSubmit={handleGenerate}>
            <div className="form-row">
              <div className="form-group">
                <label>1. Requirement Title *</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. 4MP Motorized Varifocal Bullet Camera STQC Certified"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>2. Product / Solution Required *</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. IP Camera / Smart Pole / IoT Gateway"
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>3. Product Category</label>
                <select 
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.length > 0 ? (
                    categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                  ) : (
                    <>
                      <option value="CCTV & Surveillance">CCTV & Surveillance</option>
                      <option value="Solar Solutions">Solar Solutions</option>
                      <option value="IoT & Sensors">IoT & Sensors</option>
                      <option value="Biometrics & Access Control">Biometrics & Access Control</option>
                      <option value="Smart City Infrastructure">Smart City Infrastructure</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>5. Quantity Required *</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. 250 Units / Batch 1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>4. Key Technical Specifications *</label>
              <textarea 
                className="form-textarea"
                rows="2"
                placeholder="e.g. 4MP Resolution, 1/2.8'' CMOS, 2.7-13.5mm Lens, H.265+, 50m IR, IP67, ONVIF Profile S/G/T"
                value={formData.techSpecs}
                onChange={(e) => setFormData({ ...formData, techSpecs: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>6. Application / Project Context</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. AP-CRDA Smart City / Railway CCTV"
                  value={formData.application}
                  onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>7. Required Certifications</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. STQC, ARAI AIS-140, ONVIF, CE, FCC"
                  value={formData.requiredCertifications}
                  onChange={(e) => setFormData({ ...formData, requiredCertifications: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>8. Delivery Location</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. Central Warehouse, Hyderabad"
                  value={formData.deliveryLocation}
                  onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>9. Expected Procurement Timeline</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. 15-30 Days"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>10. Additional Customization / Support Requirements</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. OEM Branding, custom firmware API integration, extended 36-month warranty"
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Sparkles size={16} /> Generate Professional Email &rarr;
              </button>
            </div>
          </form>
        ) : (
          /* GENERATED EMAIL PREVIEW VIEW */
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Subject Line:
              </div>
              <div style={{ fontSize: '13.5px', color: 'var(--text-heading)', fontWeight: 800, background: 'var(--bg-card)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                {generatedEmail.subject}
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.85rem', marginBottom: '0.35rem' }}>
                Generated Business Email Body:
              </div>
              <textarea 
                className="form-textarea"
                rows="14"
                readOnly
                value={generatedEmail.body}
                style={{ background: 'var(--bg-card)', color: 'var(--text-heading)', fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.5, borderColor: 'var(--border-color)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
              <button className="btn btn-secondary" onClick={() => setGeneratedEmail(null)}>
                &larr; Back to Requirements Form
              </button>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button className="btn btn-secondary" onClick={handleCopy}>
                  {copied ? <Check size={16} color="#059669" /> : <Copy size={16} />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Email'}
                </button>
                <button className="btn btn-primary" onClick={handleOpenMailClient}>
                  <Mail size={16} /> Open Email Client
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
