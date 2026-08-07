import React, { useState } from 'react';
import { 
  Building2, Globe, Phone, Mail, FileCheck, ShieldCheck, CheckCircle2, Clock, Search, Filter, MapPin, Compass, ExternalLink, MessageSquare, Send, X, AlertCircle, Layers
} from 'lucide-react';
import { NPD_MASTER_OEM_COMPANIES } from '../data/fullDatabase';

export const INITIAL_OEM_COMPANIES = NPD_MASTER_OEM_COMPANIES;

export default function OEMCompanyDirectory() {
  const [companies, setCompanies] = useState(INITIAL_OEM_COMPANIES);
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedStateCity, setSelectedStateCity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeContactModal, setActiveContactModal] = useState(null); // Active OEM contact execution modal

  const domains = Array.from(new Set(companies.map(c => c.domain))).filter(Boolean);
  const countries = Array.from(new Set(companies.map(c => c.country))).filter(Boolean);

  const stateCityList = Array.from(new Set(
    companies
      .filter(c => selectedCountry === 'ALL' || c.country === selectedCountry)
      .map(c => `${c.city} (${c.state})`)
  )).filter(Boolean);

  const filteredCompanies = companies.filter(c => {
    const matchesDomain = selectedDomain === 'ALL' || c.domain === selectedDomain;
    const matchesCountry = selectedCountry === 'ALL' || c.country === selectedCountry;
    const matchesStateCity = selectedStateCity === 'ALL' || `${c.city} (${c.state})` === selectedStateCity;
    const matchesSearch = (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.products || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.country || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.state || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesCountry && matchesStateCity && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
            New Product Development (NPD) Vendor Directory
          </div>
          <h2 style={{ fontSize: '1.25rem' }}>OEM Companies & Vendor Partners</h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Verified OEM suppliers with 1-click contact execution, interactive dialer, and clean N/A missing data indicators.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <span className="badge badge-accept" style={{ fontSize: '11px', padding: '0.35rem 0.75rem', background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#818cf8' }}>
            🏢 {companies.length} Registered OEM Partners
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Solutions / Product Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 600, color: '#818cf8' }}>
            <Layers size={14} /> Solutions:
          </div>

          <select 
            className="form-select"
            style={{ width: '230px', padding: '0.35rem 0.65rem', fontSize: '12px', borderColor: 'rgba(99, 102, 241, 0.4)', fontWeight: 600 }}
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            <option value="ALL">All Solutions & Categories ({companies.length})</option>
            {domains.map(d => (
              <option key={d} value={d}>
                {d.includes('Robotics') ? '🤖 ' : d.includes('Drone') ? '🛩️ ' : d.includes('CCTV') || d.includes('STQC') ? '📷 ' : d.includes('Elephant') || d.includes('PIDS') ? '🐘 ' : d.includes('Biometric') ? '👆 ' : d.includes('Interlock') ? '🔒 ' : d.includes('Display') || d.includes('IDP') ? '🖥️ ' : d.includes('GPS') ? '📍 ' : d.includes('Wi-Fi') ? '📶 ' : d.includes('X-Ray') ? '🔍 ' : d.includes('EV') ? '⚡ ' : '📦 '}
                {d} ({companies.filter(c => c.domain === d).length})
              </option>
            ))}
          </select>

          {/* MASTER COUNTRY FILTER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 600, color: '#38bdf8' }}>
            <Globe size={14} /> Country:
          </div>
          <select 
            className="form-select"
            style={{ width: '160px', padding: '0.35rem 0.6rem', fontSize: '12px', borderColor: 'rgba(56, 189, 248, 0.4)' }}
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedStateCity('ALL');
            }}
          >
            <option value="ALL">All Countries ({countries.length})</option>
            {countries.map(c => (
              <option key={c} value={c}>{c} ({companies.filter(co => co.country === c).length})</option>
            ))}
          </select>

          {/* STATE & CITY SUB-FILTER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 600, color: '#34d399' }}>
            <MapPin size={14} /> State & City:
          </div>
          <select 
            className="form-select"
            style={{ width: '190px', padding: '0.35rem 0.6rem', fontSize: '12px', borderColor: 'rgba(16, 185, 129, 0.4)' }}
            value={selectedStateCity}
            onChange={(e) => setSelectedStateCity(e.target.value)}
          >
            <option value="ALL">All States & Cities</option>
            {stateCityList.map(sc => (
              <option key={sc} value={sc}>{sc}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input"
            placeholder="Search company, product, or city..."
            style={{ paddingLeft: '2.1rem', padding: '0.35rem 0.65rem', fontSize: '12px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of OEM Company Cards with 1-Click Execution */}
      <div className="grid-cols-2">
        {filteredCompanies.map((comp, idx) => {
          const hasPhone = comp.phone || (comp.contactDetails && !comp.contactDetails.includes('@') && !comp.contactDetails.includes('http'));
          const hasEmail = comp.email || (comp.contactDetails && comp.contactDetails.includes('@'));
          const hasWebsite = comp.website || (comp.contactDetails && comp.contactDetails.includes('http'));

          return (
            <div key={comp.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      S.NO {idx + 1} &bull; OEM MANUFACTURER
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '0.15rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Building2 size={18} color="#38bdf8" /> {comp.name}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-accept" style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.06)', borderColor: 'var(--border-color)', color: '#ffffff' }}>
                      {comp.flag} {comp.country}
                    </span>
                  </div>
                </div>

                {/* GEOGRAPHIC LOCATION HIERARCHY */}
                <div style={{ 
                  fontSize: '11.5px', color: '#34d399', background: 'rgba(16, 185, 129, 0.08)', 
                  border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.35rem 0.65rem', 
                  borderRadius: '6px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' 
                }}>
                  <Compass size={13} color="#34d399" />
                  <span>Location Hierarchy: <strong>{comp.country}</strong> &bull; {comp.state || 'N/A'} &bull; <strong>{comp.city || 'N/A'}</strong></span>
                </div>

                {/* Products Provided */}
                <div style={{ 
                  background: 'rgba(11, 15, 25, 0.65)', padding: '0.65rem 0.8rem', 
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '0.65rem' 
                }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    PRODUCTS & SOLUTIONS PROVIDED:
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#38bdf8', marginTop: '0.2rem' }}>
                    {comp.products || 'N/A'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Domain: <strong>{comp.domain || 'N/A'}</strong>
                  </div>
                </div>

                {/* Agreement Status & Contact Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileCheck size={14} color="#34d399" />
                    <span style={{ color: 'var(--text-muted)' }}>Agreement Status:</span>
                    <span className="badge badge-accept" style={{ fontSize: '10px', padding: '0.1rem 0.4rem' }}>
                      {comp.agreementStatus || 'N/A'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} color="#fbbf24" />
                    <span style={{ color: 'var(--text-muted)' }}>Contact Person:</span>
                    <strong style={{ color: '#ffffff' }}>
                      {comp.contactPerson || 'N/A'} {comp.contactDetails ? `(${comp.contactDetails})` : '(N/A)'}
                    </strong>
                  </div>

                  {comp.remarks ? (
                    <div style={{ fontSize: '11.5px', color: '#fb7185', background: 'rgba(244, 63, 94, 0.08)', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(244, 63, 94, 0.2)', marginTop: '0.2rem' }}>
                      💡 <strong>Remarks:</strong> {comp.remarks}
                    </div>
                  ) : (
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      💡 <strong>Remarks:</strong> N/A
                    </div>
                  )}
                </div>
              </div>

              {/* 1-CLICK EXECUTION ACTION BAR */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '11px', padding: '0.3rem 0.65rem', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
                  onClick={() => setActiveContactModal(comp)}
                >
                  ⚡ Execute Contact Action
                </button>

                {hasWebsite && (
                  <a 
                    href={hasWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11px', padding: '0.25rem 0.55rem', color: '#38bdf8' }}
                  >
                    <ExternalLink size={12} /> Visit OEM Website
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* INTERACTIVE 1-CLICK OEM CONTACT EXECUTION LAUNCHER MODAL */}
      {activeContactModal && (
        <div className="modal-overlay" onClick={() => setActiveContactModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase' }}>
                  1-CLICK OEM EXECUTION LAUNCHER
                </div>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginTop: '0.1rem' }}>
                  {activeContactModal.name}
                </h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveContactModal(null)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Contact Summary Box */}
              <div style={{ background: 'rgba(18, 24, 38, 0.8)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12.5px' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  Primary Contact: <strong style={{ color: '#ffffff' }}>{activeContactModal.contactPerson || 'N/A'}</strong>
                </div>
                <div style={{ color: '#38bdf8', fontWeight: 700 }}>
                  Phone/Details: {activeContactModal.contactDetails || 'N/A'}
                </div>
              </div>

              {/* Action 1: Direct Phone Call */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={15} /> Execute Voice Call Dialing
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {activeContactModal.contactDetails && !activeContactModal.contactDetails.includes('@') && !activeContactModal.contactDetails.includes('http') ? `Dial ${activeContactModal.contactDetails}` : 'Phone dialer execution ready'}
                  </div>
                </div>

                {activeContactModal.contactDetails && !activeContactModal.contactDetails.includes('@') && !activeContactModal.contactDetails.includes('http') ? (
                  <a 
                    href={`tel:${activeContactModal.contactDetails}`}
                    className="btn btn-primary btn-sm"
                    style={{ background: '#10b981', borderColor: '#059669', fontSize: '11.5px' }}
                  >
                    📞 Call Now
                  </a>
                ) : (
                  <span className="badge badge-conditional" style={{ fontSize: '10px' }}>
                    Phone: N/A
                  </span>
                )}
              </div>

              {/* Action 2: Send Official Email Inquiry */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(99, 102, 241, 0.08)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={15} /> Send Procurement Email Inquiry
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {activeContactModal.contactDetails && activeContactModal.contactDetails.includes('@') ? activeContactModal.contactDetails : 'Draft procurement inquiry email'}
                  </div>
                </div>

                {activeContactModal.contactDetails && activeContactModal.contactDetails.includes('@') ? (
                  <a 
                    href={`mailto:${activeContactModal.contactDetails}?subject=Brihaspathi%20Procurement%20Inquiry%20-%20${encodeURIComponent(activeContactModal.products)}&body=Dear%20${encodeURIComponent(activeContactModal.contactPerson)},%0A%0AWe%20are%20reaching%20out%20from%20Brihaspathi%20Technologies%20regarding%20${encodeURIComponent(activeContactModal.products)}.`}
                    className="btn btn-primary btn-sm"
                    style={{ background: '#6366f1', borderColor: '#4f46e5', fontSize: '11.5px' }}
                  >
                    ✉️ Send Email
                  </a>
                ) : (
                  <a 
                    href={`mailto:venu.m@brihaspathi.com?subject=OEM%20Inquiry%20-%20${encodeURIComponent(activeContactModal.name)}&body=OEM%20Vendor:%20${encodeURIComponent(activeContactModal.name)}%0AProducts:%20${encodeURIComponent(activeContactModal.products)}`}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11.5px', color: '#818cf8' }}
                  >
                    ✉️ Draft Inquiry
                  </a>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-secondary" onClick={() => setActiveContactModal(null)}>
                Close Launcher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
