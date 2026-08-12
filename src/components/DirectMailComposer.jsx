import React, { useState, useEffect } from 'react';
import { Mail, Send, Edit, Copy, X, Wand2, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { generateProfessionalEmail } from '../utils/emailGenerator';

export default function DirectMailComposer({ oem, onClose }) {
  const [step, setStep] = useState(1); // 1 = Input Requirement, 2 = Preview & Edit
  const [requirement, setRequirement] = useState('');
  
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Attempt to extract email if it exists in contactDetails or email field
    if (oem) {
      if (oem.email) {
        setEmailTo(oem.email);
      } else if (oem.contactDetails && oem.contactDetails.includes('@')) {
        setEmailTo(oem.contactDetails);
      }
    }
  }, [oem]);

  const handleGenerate = () => {
    const { subject, body } = generateProfessionalEmail(oem, requirement);
    setEmailSubject(subject);
    setEmailBody(body);
    setStep(2);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTo)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailUrl, '_blank');
  };

  if (!oem) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '750px', background: '#ffffff', borderRadius: '12px', padding: '0', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '8px' }}>
              <Building2 size={20} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                B2B Procurement Communication
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.1rem' }}>
                Direct Mail: {oem.name}
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {step === 1 ? (
            /* STEP 1: REQUIREMENT INPUT */
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  What is your current requirement? (Optional)
                </label>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  Provide specific details such as product models, quantities, technical specifications, or project context. 
                  The AI generator will use this to personalize the email. If left blank, a professional general inquiry will be generated.
                </p>
                <textarea
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="e.g., We require 250 units of 4MP Vandal Dome IP Cameras for an upcoming Smart City project. Must be STQC certified."
                  style={{
                    width: '100%', minHeight: '120px', padding: '0.85rem', fontSize: '13px', 
                    borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none',
                    resize: 'vertical', fontFamily: 'inherit', color: '#0f172a', background: '#f8fafc'
                  }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={onClose}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleGenerate}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', fontWeight: 800 }}
                >
                  <Wand2 size={16} /> Generate Professional Email
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: PREVIEW & EDIT */
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {/* To Field */}
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  <label style={{ width: '80px', fontSize: '12.5px', fontWeight: 700, color: '#64748b' }}>To:</label>
                  <input 
                    type="text" 
                    value={emailTo} 
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="recipient@example.com"
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', fontWeight: 600, color: '#0f172a' }} 
                  />
                </div>

                {/* Subject Field */}
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  <label style={{ width: '80px', fontSize: '12.5px', fontWeight: 700, color: '#64748b' }}>Subject:</label>
                  <input 
                    type="text" 
                    value={emailSubject} 
                    onChange={(e) => setEmailSubject(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', fontWeight: 700, color: '#0f172a' }} 
                  />
                </div>
              </div>

              {/* Email Body */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', right: '12px', background: '#f8fafc', padding: '0 5px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                  <Edit size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} /> 
                  Fully Editable
                </div>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  style={{
                    width: '100%', minHeight: '350px', padding: '1rem', fontSize: '13px', 
                    borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none',
                    resize: 'vertical', fontFamily: 'inherit', color: '#0f172a', lineHeight: '1.6', background: '#ffffff'
                  }}
                />
              </div>

              {/* Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setStep(1)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', fontWeight: 700 }}
                >
                  <ArrowLeft size={14} /> Back to Requirements
                </button>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={handleCopy}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#ffffff', color: copied ? '#059669' : '#0f172a', border: `1px solid ${copied ? '#34d399' : '#cbd5e1'}`, fontWeight: 700, transition: 'all 0.2s' }}
                  >
                    {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={handleSendMail}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: '#ffffff', fontWeight: 800, border: 'none' }}
                  >
                    <Send size={14} /> Open in Gmail
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
