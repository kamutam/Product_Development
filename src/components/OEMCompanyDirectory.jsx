import React, { useState } from 'react';
import { 
  Building2, Globe, Phone, Mail, FileCheck, ShieldCheck, CheckCircle2, Clock, Search, Filter, MapPin, Compass, ExternalLink, MessageSquare, Send, X, AlertCircle, Layers, ArrowDown
} from 'lucide-react';
import { NPD_MASTER_OEM_COMPANIES } from '../data/fullDatabase';
import DirectMailComposer from './DirectMailComposer';

// Brand company logo badge generator for OEM Directory
const getCompanyLogoBadge = (company) => {
  const name = company.name || 'OEM Company';
  const domain = company.domain || '';
  
  let logoText = name.substring(0, 2).toUpperCase();
  let bgGradient = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
  let textColor = '#ffffff';
  let borderColor = '#38bdf8';
  let shadowGlow = 'rgba(56, 189, 248, 0.4)';

  if (name.includes('Reeman')) {
    logoText = 'RM';
    bgGradient = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
    borderColor = '#34d399';
    shadowGlow = 'rgba(52, 211, 153, 0.5)';
  } else if (name.includes('LionsBot')) {
    logoText = 'LB';
    bgGradient = 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
    borderColor = '#fbbf24';
    shadowGlow = 'rgba(251, 191, 36, 0.5)';
  } else if (name.includes('Pudu')) {
    logoText = 'PD';
    bgGradient = 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)';
    borderColor = '#fb923c';
    shadowGlow = 'rgba(251, 146, 60, 0.5)';
  } else if (name.includes('Tennant')) {
    logoText = 'TN';
    bgGradient = 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)';
    borderColor = '#60a5fa';
    shadowGlow = 'rgba(96, 165, 250, 0.5)';
  } else if (name.includes('Nilfisk')) {
    logoText = 'NF';
    bgGradient = 'linear-gradient(135deg, #0284c7 0%, #075985 100%)';
    borderColor = '#38bdf8';
    shadowGlow = 'rgba(56, 189, 248, 0.5)';
  } else if (name.includes('Kärcher') || name.includes('Karcher')) {
    logoText = 'KÄ';
    bgGradient = 'linear-gradient(135deg, #ca8a04 0%, #854d0e 100%)';
    borderColor = '#facc15';
    shadowGlow = 'rgba(250, 204, 21, 0.5)';
  } else if (name.includes('Avidbots')) {
    logoText = 'AV';
    bgGradient = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
    borderColor = '#38bdf8';
    shadowGlow = 'rgba(56, 189, 248, 0.5)';
  } else if (name.includes('Peppermint')) {
    logoText = 'PM';
    bgGradient = 'linear-gradient(135deg, #10b981 0%, #047857 100%)';
    borderColor = '#6ee7b7';
    shadowGlow = 'rgba(110, 231, 183, 0.5)';
  } else if (name.includes('Rohde') || name.includes('Schwarz')) {
    logoText = 'R&S';
    bgGradient = 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)';
    borderColor = '#818cf8';
    shadowGlow = 'rgba(129, 140, 248, 0.5)';
  } else if (name.includes('Ghost')) {
    logoText = 'GR';
    bgGradient = 'linear-gradient(135deg, #374151 0%, #1f2937 100%)';
    borderColor = '#9ca3af';
    shadowGlow = 'rgba(156, 163, 175, 0.5)';
  } else if (name.includes('CP Plus') || name.includes('Aditya')) {
    logoText = 'CP';
    bgGradient = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
    borderColor = '#38bdf8';
    shadowGlow = 'rgba(56, 189, 248, 0.5)';
  } else if (name.includes('Banovision') || name.includes('Brihaspathi')) {
    logoText = 'BV';
    bgGradient = 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)';
    borderColor = '#a5b4fc';
    shadowGlow = 'rgba(165, 180, 252, 0.5)';
  } else if (name.includes('Streamax')) {
    logoText = 'SX';
    bgGradient = 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)';
    borderColor = '#2dd4bf';
    shadowGlow = 'rgba(45, 212, 191, 0.5)';
  } else if (name.includes('ALKHOLOCKS')) {
    logoText = 'AK';
    bgGradient = 'linear-gradient(135deg, #be185d 0%, #831843 100%)';
    borderColor = '#f472b6';
    shadowGlow = 'rgba(244, 114, 182, 0.5)';
  } else if (name.includes('Jinko')) {
    logoText = 'JK';
    bgGradient = 'linear-gradient(135deg, #eab308 0%, #854d0e 100%)';
    borderColor = '#fde047';
    shadowGlow = 'rgba(253, 224, 71, 0.5)';
  } else if (name.includes('ZKTeco') || name.includes('Zk')) {
    logoText = 'ZK';
    bgGradient = 'linear-gradient(135deg, #0891b2 0%, #155e75 100%)';
    borderColor = '#67e8f9';
    shadowGlow = 'rgba(103, 232, 249, 0.5)';
  } else if (name.includes('Horion')) {
    logoText = 'HR';
    bgGradient = 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)';
    borderColor = '#c084fc';
    shadowGlow = 'rgba(192, 132, 252, 0.5)';
  } else if (domain.includes('Robotics')) {
    bgGradient = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
    borderColor = '#34d399';
    shadowGlow = 'rgba(52, 211, 153, 0.4)';
  } else if (domain.includes('Drone')) {
    bgGradient = 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)';
    borderColor = '#818cf8';
    shadowGlow = 'rgba(129, 140, 248, 0.4)';
  }

  return (
    <div style={{
      width: '32px',
      height: '32px',
      minWidth: '32px',
      borderRadius: '7px',
      background: bgGradient,
      border: `1.5px solid ${borderColor}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 900,
      fontSize: '12px',
      color: textColor,
      letterSpacing: '-0.02em',
      boxShadow: `0 3px 10px ${shadowGlow}`,
      marginRight: '0.45rem',
      flexShrink: 0
    }}>
      {logoText}
    </div>
  );
};

export const INITIAL_OEM_COMPANIES = NPD_MASTER_OEM_COMPANIES;

export default function OEMCompanyDirectory() {
  const [companies, setCompanies] = useState(INITIAL_OEM_COMPANIES || []);
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedStateCity, setSelectedStateCity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showSolutionDropdown, setShowSolutionDropdown] = useState(false);
  const [solutionSearchQuery, setSolutionSearchQuery] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState('');

  const [activeContactModal, setActiveContactModal] = useState(null); // Active OEM contact execution modal
  const [activeMailComposer, setActiveMailComposer] = useState(null); // Active OEM direct mail composer

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
          <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
            New Product Development (NPD) Vendor Directory
          </div>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>OEM Companies & Vendor Partners</h2>
          <p style={{ fontSize: '12.5px', color: '#475569', marginTop: '0.15rem' }}>
            Verified OEM suppliers with 1-click contact execution, interactive dialer, and clean N/A missing data indicators.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <span className="badge badge-accept" style={{ fontSize: '11px', padding: '0.35rem 0.75rem', background: '#e0f2fe', borderColor: '#bae6fd', color: '#0369a1', fontWeight: 800 }}>
            🏢 {companies.length} Registered OEM Partners
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', position: 'relative', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Solutions / Product Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>
            <Layers size={14} /> Solutions:
          </div>

          {/* CUSTOM SEARCHABLE SOLUTIONS & CATEGORIES DROPDOWN (CAPPED AT 4 VISIBLE ITEMS MAX) */}
          <div style={{ position: 'relative', width: '250px', zIndex: 99999 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                width: '100%',
                justify: 'space-between',
                fontSize: '12px',
                fontWeight: 800,
                background: '#ffffff',
                color: '#0f172a',
                borderColor: '#cbd5e1',
                padding: '0.4rem 0.65rem'
              }}
              onClick={() => setShowSolutionDropdown(!showSolutionDropdown)}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                {selectedDomain === 'ALL'
                  ? `All Solutions & Categories (${companies.length})`
                  : `${selectedDomain} (${companies.filter(c => c.domain === selectedDomain).length})`}
              </span>
              <span style={{ fontSize: '10px', marginLeft: '4px', color: '#0284c7' }}>
                {showSolutionDropdown ? '▲' : '▼'}
              </span>
            </button>

            {/* Dropdown Menu Popup (Capped at 4 items height + Search Input) */}
            {showSolutionDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  width: '280px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
                  zIndex: 999999,
                  padding: '0.45rem',
                  animation: 'fadeInUp 0.15s ease-out'
                }}
              >
                {/* Real-time Search Input Field */}
                <div style={{ position: 'relative', marginBottom: '0.4rem' }}>
                  <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#0284c7' }} />
                  <input
                    type="text"
                    placeholder="Search solution or category..."
                    value={solutionSearchQuery}
                    onChange={(e) => setSolutionSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '0.35rem 0.5rem 0.35rem 1.75rem',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                  {solutionSearchQuery && (
                    <X
                      size={12}
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b' }}
                      onClick={() => setSolutionSearchQuery('')}
                    />
                  )}
                </div>

                {/* Scrollable Solutions List capped at 4 items max height (~140px) */}
                <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', scrollbarWidth: 'thin' }}>
                  <div
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '5px',
                      fontSize: '11.5px',
                      fontWeight: selectedDomain === 'ALL' ? 800 : 600,
                      background: selectedDomain === 'ALL' ? '#e0f2fe' : 'transparent',
                      color: selectedDomain === 'ALL' ? '#0369a1' : '#0f172a',
                      cursor: 'pointer',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center'
                    }}
                    onClick={() => {
                      setSelectedDomain('ALL');
                      setShowSolutionDropdown(false);
                      setSolutionSearchQuery('');
                    }}
                  >
                    <span>All Solutions & Categories</span>
                    <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 800 }}>({companies.length})</span>
                  </div>

                  {domains
                    .filter(d => d.toLowerCase().includes(solutionSearchQuery.toLowerCase()))
                    .map(d => {
                      const count = companies.filter(c => c.domain === d).length;
                      const isSelected = selectedDomain === d;
                      const icon = d.includes('Robotics') ? '🤖 ' : d.includes('Drone') ? '🛩️ ' : d.includes('CCTV') || d.includes('STQC') ? '📷 ' : d.includes('Elephant') || d.includes('PIDS') ? '🐘 ' : d.includes('Biometric') ? '👆 ' : d.includes('Interlock') ? '🔒 ' : d.includes('Display') || d.includes('IDP') ? '🖥️ ' : d.includes('GPS') ? '📍 ' : d.includes('Wi-Fi') ? '📶 ' : d.includes('X-Ray') ? '🔍 ' : d.includes('EV') ? '⚡ ' : '📦 ';
                      return (
                        <div
                          key={d}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '5px',
                            fontSize: '11.5px',
                            fontWeight: isSelected ? 800 : 600,
                            background: isSelected ? '#e0f2fe' : 'transparent',
                            color: isSelected ? '#0369a1' : '#0f172a',
                            cursor: 'pointer',
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center'
                          }}
                          onClick={() => {
                            setSelectedDomain(d);
                            setShowSolutionDropdown(false);
                            setSolutionSearchQuery('');
                          }}
                        >
                          <span>{icon}{d}</span>
                          <span style={{ fontSize: '10.5px', color: isSelected ? '#0369a1' : '#64748b', fontWeight: 800 }}>({count})</span>
                        </div>
                      );
                    })}

                  {domains.filter(d => d.toLowerCase().includes(solutionSearchQuery.toLowerCase())).length === 0 && (
                    <div style={{ padding: '0.5rem', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
                      No matching category found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* MASTER COUNTRY FILTER (Custom Select) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 700, color: '#0369a1' }}>
            <Globe size={14} /> Country:
          </div>
          <div style={{ position: 'relative', width: '200px', zIndex: 99998 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1', padding: '0.4rem 0.65rem' }}
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                {selectedCountry === 'ALL' ? `All Countries (${countries.length})` : selectedCountry}
              </span>
              <ArrowDown size={14} style={{ color: '#64748b' }} />
            </button>
            {showCountryDropdown && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: '240px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 20px 45px rgba(0,0,0,0.25)', zIndex: 999999, padding: '0.45rem', animation: 'fadeInUp 0.15s ease-out' }}>
                <div style={{ position: 'relative', marginBottom: '0.4rem' }}>
                  <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#0284c7' }} />
                  <input type="text" placeholder="Search country..." value={countrySearchQuery} onChange={(e) => setCountrySearchQuery(e.target.value)} autoFocus style={{ width: '100%', padding: '0.35rem 0.5rem 0.35rem 1.75rem', fontSize: '11.5px', fontWeight: 700, borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', outline: 'none' }} />
                  {countrySearchQuery && <X size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b' }} onClick={() => setCountrySearchQuery('')} />}
                </div>
                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', scrollbarWidth: 'thin' }}>
                  <div style={{ padding: '0.35rem 0.65rem', borderRadius: '5px', fontSize: '11.5px', fontWeight: selectedCountry === 'ALL' ? 800 : 600, background: selectedCountry === 'ALL' ? '#e0f2fe' : 'transparent', color: selectedCountry === 'ALL' ? '#0369a1' : '#0f172a', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => { setSelectedCountry('ALL'); setSelectedStateCity('ALL'); setShowCountryDropdown(false); setCountrySearchQuery(''); }}>
                    <span>All Countries</span><span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 800 }}>({countries.length})</span>
                  </div>
                  {countries.filter(c => c.toLowerCase().includes(countrySearchQuery.toLowerCase())).map(c => {
                    const count = companies.filter(co => co.country === c).length;
                    const isSelected = selectedCountry === c;
                    return (
                      <div key={c} style={{ padding: '0.35rem 0.65rem', borderRadius: '5px', fontSize: '11.5px', fontWeight: isSelected ? 800 : 600, background: isSelected ? '#e0f2fe' : 'transparent', color: isSelected ? '#0369a1' : '#0f172a', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => { setSelectedCountry(c); setSelectedStateCity('ALL'); setShowCountryDropdown(false); setCountrySearchQuery(''); }}>
                        <span>{c}</span><span style={{ fontSize: '10.5px', color: isSelected ? '#0369a1' : '#64748b', fontWeight: 800 }}>({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* STATE & CITY SUB-FILTER (Custom Select) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 700, color: '#059669' }}>
            <MapPin size={14} /> State & City:
          </div>
          <div style={{ position: 'relative', width: '220px', zIndex: 99997 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1', padding: '0.4rem 0.65rem' }}
              onClick={() => setShowStateDropdown(!showStateDropdown)}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                {selectedStateCity === 'ALL' ? `All States/Cities (${stateCityList.length})` : selectedStateCity}
              </span>
              <ArrowDown size={14} style={{ color: '#64748b' }} />
            </button>
            {showStateDropdown && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, width: '260px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 20px 45px rgba(0,0,0,0.25)', zIndex: 999999, padding: '0.45rem', animation: 'fadeInUp 0.15s ease-out' }}>
                <div style={{ position: 'relative', marginBottom: '0.4rem' }}>
                  <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
                  <input type="text" placeholder="Search state or city..." value={stateSearchQuery} onChange={(e) => setStateSearchQuery(e.target.value)} autoFocus style={{ width: '100%', padding: '0.35rem 0.5rem 0.35rem 1.75rem', fontSize: '11.5px', fontWeight: 700, borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', outline: 'none' }} />
                  {stateSearchQuery && <X size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b' }} onClick={() => setStateSearchQuery('')} />}
                </div>
                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', scrollbarWidth: 'thin' }}>
                  <div style={{ padding: '0.35rem 0.65rem', borderRadius: '5px', fontSize: '11.5px', fontWeight: selectedStateCity === 'ALL' ? 800 : 600, background: selectedStateCity === 'ALL' ? '#dcfce7' : 'transparent', color: selectedStateCity === 'ALL' ? '#059669' : '#0f172a', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => { setSelectedStateCity('ALL'); setShowStateDropdown(false); setStateSearchQuery(''); }}>
                    <span>All States/Cities</span><span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 800 }}>({stateCityList.length})</span>
                  </div>
                  {stateCityList.filter(sc => sc.toLowerCase().includes(stateSearchQuery.toLowerCase())).map(sc => {
                    const count = companies.filter(co => `${co.city} (${co.state})` === sc).length;
                    const isSelected = selectedStateCity === sc;
                    return (
                      <div key={sc} style={{ padding: '0.35rem 0.65rem', borderRadius: '5px', fontSize: '11.5px', fontWeight: isSelected ? 800 : 600, background: isSelected ? '#dcfce7' : 'transparent', color: isSelected ? '#059669' : '#0f172a', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => { setSelectedStateCity(sc); setShowStateDropdown(false); setStateSearchQuery(''); }}>
                        <span>{sc}</span><span style={{ fontSize: '10.5px', color: isSelected ? '#059669' : '#64748b', fontWeight: 800 }}>({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', color: '#64748b' }} />
          <input 
            type="text" 
            className="form-input"
            placeholder="Search company, product, or city..."
            style={{ paddingLeft: '2.1rem', padding: '0.35rem 0.65rem', fontSize: '12px', borderColor: '#cbd5e1', background: '#ffffff', color: '#0f172a' }}
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
                    <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      S.NO {idx + 1} &bull; OEM MANUFACTURER
                    </div>
                    {/* High-Contrast Bold Company Name - Dark Slate Navy for 100% Readability */}
                    <h3 style={{ fontSize: '1.25rem', marginTop: '0.15rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      {getCompanyLogoBadge(comp)} {comp.name}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-accept" style={{ fontSize: '11px', background: '#f1f5f9', borderColor: '#cbd5e1', color: '#0f172a', fontWeight: 700 }}>
                      {comp.flag} {comp.country}
                    </span>
                  </div>
                </div>

                {/* GEOGRAPHIC LOCATION HIERARCHY */}
                <div style={{ 
                  fontSize: '11.5px', color: '#047857', background: '#ecfdf5', 
                  border: '1px solid #a7f3d0', padding: '0.35rem 0.65rem', 
                  borderRadius: '6px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600
                }}>
                  <Compass size={13} color="#047857" />
                  <span>Location Hierarchy: <strong style={{ color: '#065f46' }}>{comp.country}</strong> &bull; {comp.state || 'N/A'} &bull; <strong style={{ color: '#065f46' }}>{comp.city || 'N/A'}</strong></span>
                </div>

                {/* Products Provided */}
                <div style={{ 
                  background: '#f8fafc', padding: '0.65rem 0.8rem', 
                  borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', marginBottom: '0.65rem' 
                }}>
                  <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    PRODUCTS & SOLUTIONS PROVIDED:
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '12.5px', color: '#0284c7', marginTop: '0.2rem' }}>
                    {comp.products || 'N/A'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '0.25rem' }}>
                    Domain: <strong style={{ color: '#0f172a' }}>{comp.domain || 'N/A'}</strong>
                  </div>
                </div>

                {/* Agreement Status & Contact Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileCheck size={14} color="#059669" />
                    <span style={{ color: '#475569' }}>Agreement Status:</span>
                    <span className="badge badge-accept" style={{ fontSize: '10px', padding: '0.1rem 0.4rem', background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                      {comp.agreementStatus || 'N/A'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} color="#d97706" />
                    <span style={{ color: '#475569' }}>Contact Person:</span>
                    <strong style={{ color: '#0f172a' }}>
                      {comp.contactPerson || 'N/A'} {comp.contactDetails ? `(${comp.contactDetails})` : '(N/A)'}
                    </strong>
                  </div>

                  {comp.remarks ? (
                    <div style={{ fontSize: '11.5px', color: '#9f1239', background: '#ffe4e6', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #fecdd3', marginTop: '0.2rem' }}>
                      💡 <strong>Remarks:</strong> {comp.remarks}
                    </div>
                  ) : (
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '0.2rem' }}>
                      💡 <strong>Remarks:</strong> N/A
                    </div>
                  )}
                </div>
              </div>

              {/* 1-CLICK EXECUTION ACTION BAR */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.65rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '11px', padding: '0.35rem 0.75rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff', fontWeight: 800, border: 'none', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.35)' }}
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
                    style={{ fontSize: '11px', padding: '0.3rem 0.65rem', color: '#0284c7', background: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 700 }}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>
                  1-CLICK OEM EXECUTION LAUNCHER
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginTop: '0.1rem', fontWeight: 800 }}>
                  {activeContactModal.name}
                </h3>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a' }} onClick={() => setActiveContactModal(null)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Contact Summary Box */}
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}>
                <div style={{ color: '#475569', marginBottom: '0.2rem' }}>
                  Primary Contact: <strong style={{ color: '#0f172a' }}>{activeContactModal.contactPerson || 'N/A'}</strong>
                </div>
                <div style={{ color: '#0284c7', fontWeight: 800 }}>
                  Phone/Details: {activeContactModal.contactDetails || 'N/A'}
                </div>
              </div>

              {/* Action 1: Direct Phone Call */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ecfdf5', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#047857', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={15} /> Execute Voice Call Dialing
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '0.15rem' }}>
                    {activeContactModal.contactDetails && !activeContactModal.contactDetails.includes('@') && !activeContactModal.contactDetails.includes('http') ? `Dial ${activeContactModal.contactDetails}` : 'Phone dialer execution ready'}
                  </div>
                </div>

                {activeContactModal.contactDetails && !activeContactModal.contactDetails.includes('@') && !activeContactModal.contactDetails.includes('http') ? (
                  <a 
                    href={`tel:${activeContactModal.contactDetails}`}
                    className="btn btn-primary btn-sm"
                    style={{ background: '#059669', borderColor: '#047857', fontSize: '11.5px', color: '#ffffff', fontWeight: 800 }}
                  >
                    📞 Call Now
                  </a>
                ) : (
                  <span className="badge badge-conditional" style={{ fontSize: '10px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                    Phone: N/A
                  </span>
                )}
              </div>

              {/* Action 2: Send Official Email Inquiry */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0f9ff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={15} /> Send Procurement Email Inquiry
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '0.15rem' }}>
                    {activeContactModal.contactDetails && activeContactModal.contactDetails.includes('@') ? activeContactModal.contactDetails : 'Draft procurement inquiry email'}
                  </div>
                </div>

                {activeContactModal.contactDetails && activeContactModal.contactDetails.includes('@') ? (
                  <button 
                    onClick={() => {
                      setActiveMailComposer(activeContactModal);
                      setActiveContactModal(null);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ background: '#0284c7', borderColor: '#0369a1', fontSize: '11.5px', color: '#ffffff', fontWeight: 800 }}
                  >
                    ✉️ Generate Smart Email
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setActiveMailComposer(activeContactModal);
                      setActiveContactModal(null);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11.5px', color: '#0284c7', background: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 700 }}
                  >
                    ✉️ Generate Smart Email
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT MAIL COMPOSER MODAL */}
      <DirectMailComposer 
        oem={activeMailComposer} 
        onClose={() => setActiveMailComposer(null)} 
      />
    </div>
  );
}
