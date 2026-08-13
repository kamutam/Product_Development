import React, { useState } from 'react';
import { 
  Building2, Globe, Phone, Mail, FileCheck, ShieldCheck, CheckCircle2, Clock, Search, Filter, MapPin, Compass, ExternalLink, MessageSquare, Send, X, AlertCircle, Layers, Sparkles, Grid, FileSpreadsheet
} from 'lucide-react';
import { NPD_MASTER_OEM_COMPANIES } from '../data/fullDatabase';
import SendRequirementModal from './SendRequirementModal';

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

export default function OEMCompanyDirectory({ categories = [], onRecordEmail }) {
  const [companies, setCompanies] = useState(INITIAL_OEM_COMPANIES || []);
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedStateCity, setSelectedStateCity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' vs 'table'
  
  // Custom Capped Searchable Dropdowns (Capped at 4 visible items max)
  const [showSolutionDropdown, setShowSolutionDropdown] = useState(false);
  const [solutionSearchQuery, setSolutionSearchQuery] = useState('');

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');

  const [showStateCityDropdown, setShowStateCityDropdown] = useState(false);
  const [stateCitySearchQuery, setStateCitySearchQuery] = useState('');

  const [activeContactModal, setActiveContactModal] = useState(null);
  const [sendReqOEMModal, setSendReqOEMModal] = useState(null);

  const domains = Array.from(new Set(companies.map(c => c.domain))).filter(Boolean);
  const countries = Array.from(new Set(companies.map(c => c.country))).filter(Boolean);

  const stateCityList = Array.from(new Set(
    companies
      .filter(c => selectedCountry === 'ALL' || c.country === selectedCountry)
      .map(c => `${c.city} (${c.state})`)
  )).filter(Boolean);

  const clearFilters = () => {
    setSelectedDomain('ALL');
    setSelectedCountry('ALL');
    setSelectedStateCity('ALL');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedDomain !== 'ALL' || selectedCountry !== 'ALL' || selectedStateCity !== 'ALL' || searchQuery !== '';

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
            Brihaspathi Technologies &bull; OEM Intelligence Platform
          </div>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>OEM Partners & Manufacturing Directory</h2>
          <p style={{ fontSize: '12.5px', color: '#475569', marginTop: '0.15rem' }}>
            Verified OEM suppliers with 1-click B2B requirement dispatches, direct contact execution, and datasheet access.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* GRID VS TABLE VIEW SWITCHER TOGGLE */}
          <div style={{ display: 'flex', gap: '0.35rem', background: '#f1f5f9', padding: '0.2rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <button 
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ fontSize: '11.5px', padding: '0.3rem 0.65rem', fontWeight: 800 }}
              onClick={() => setViewMode('grid')}
              title="Show OEM Cards in 2-Column Grid Layout"
            >
              <Grid size={14} /> Grid Cards ({filteredCompanies.length})
            </button>
            <button 
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ fontSize: '11.5px', padding: '0.3rem 0.65rem', fontWeight: 800 }}
              onClick={() => setViewMode('table')}
              title="Show OEM Partners in Master Data Table Layout"
            >
              <FileSpreadsheet size={14} /> Master Table ({filteredCompanies.length})
            </button>
          </div>

          <span className="badge badge-accept" style={{ fontSize: '11px', padding: '0.35rem 0.75rem', background: '#e0f2fe', borderColor: '#bae6fd', color: '#0369a1', fontWeight: 800 }}>
            🏢 {companies.length} Registered OEM Partners
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '0.85rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            
            {/* 1. CUSTOM SEARCHABLE SOLUTIONS DROPDOWN (CAPPED AT 4 VISIBLE ITEMS MAX) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>
              <Layers size={14} /> Solutions:
            </div>

            <div style={{ position: 'relative', width: '220px', zIndex: 99999 }}>
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
                onClick={() => {
                  setShowSolutionDropdown(!showSolutionDropdown);
                  setShowCountryDropdown(false);
                  setShowStateCityDropdown(false);
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                  {selectedDomain === 'ALL'
                    ? `All Solutions (${companies.length})`
                    : `${selectedDomain} (${companies.filter(c => c.domain === selectedDomain).length})`}
                </span>
                <span style={{ fontSize: '10px', marginLeft: '4px', color: '#0284c7' }}>
                  {showSolutionDropdown ? '▲' : '▼'}
                </span>
              </button>

              {showSolutionDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    width: '260px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
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
                      placeholder="Search solution..."
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
                            <span>{d}</span>
                            <span style={{ fontSize: '10.5px', color: isSelected ? '#0369a1' : '#64748b', fontWeight: 800 }}>({count})</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. CUSTOM SEARCHABLE COUNTRY DROPDOWN (CAPPED AT 4 VISIBLE ITEMS MAX) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 700, color: '#0369a1' }}>
              <Globe size={14} /> Country:
            </div>

            <div style={{ position: 'relative', width: '180px', zIndex: 99999 }}>
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
                onClick={() => {
                  setShowCountryDropdown(!showCountryDropdown);
                  setShowSolutionDropdown(false);
                  setShowStateCityDropdown(false);
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>
                  {selectedCountry === 'ALL'
                    ? `All Countries (${countries.length})`
                    : `${selectedCountry} (${companies.filter(c => c.country === selectedCountry).length})`}
                </span>
                <span style={{ fontSize: '10px', marginLeft: '4px', color: '#0369a1' }}>
                  {showCountryDropdown ? '▲' : '▼'}
                </span>
              </button>

              {showCountryDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    width: '230px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
                    zIndex: 999999,
                    padding: '0.45rem',
                    animation: 'fadeInUp 0.15s ease-out'
                  }}
                >
                  <div style={{ position: 'relative', marginBottom: '0.4rem' }}>
                    <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#0369a1' }} />
                    <input
                      type="text"
                      placeholder="Search country..."
                      value={countrySearchQuery}
                      onChange={(e) => setCountrySearchQuery(e.target.value)}
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
                    {countrySearchQuery && (
                      <X
                        size={12}
                        style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b' }}
                        onClick={() => setCountrySearchQuery('')}
                      />
                    )}
                  </div>

                  <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', scrollbarWidth: 'thin' }}>
                    <div
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '5px',
                        fontSize: '11.5px',
                        fontWeight: selectedCountry === 'ALL' ? 800 : 600,
                        background: selectedCountry === 'ALL' ? '#e0f2fe' : 'transparent',
                        color: selectedCountry === 'ALL' ? '#0369a1' : '#0f172a',
                        cursor: 'pointer',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center'
                      }}
                      onClick={() => {
                        setSelectedCountry('ALL');
                        setSelectedStateCity('ALL');
                        setShowCountryDropdown(false);
                        setCountrySearchQuery('');
                      }}
                    >
                      <span>All Countries</span>
                      <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 800 }}>({countries.length})</span>
                    </div>

                    {countries
                      .filter(c => c.toLowerCase().includes(countrySearchQuery.toLowerCase()))
                      .map(c => {
                        const count = companies.filter(co => co.country === c).length;
                        const isSelected = selectedCountry === c;
                        return (
                          <div
                            key={c}
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
                              setSelectedCountry(c);
                              setSelectedStateCity('ALL');
                              setShowCountryDropdown(false);
                              setCountrySearchQuery('');
                            }}
                          >
                            <span>{c}</span>
                            <span style={{ fontSize: '10.5px', color: isSelected ? '#0369a1' : '#64748b', fontWeight: 800 }}>({count})</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. CUSTOM SEARCHABLE STATE & CITY DROPDOWN (CAPPED AT 4 VISIBLE ITEMS MAX) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontWeight: 700, color: '#059669' }}>
              <MapPin size={14} /> State & City:
            </div>

            <div style={{ position: 'relative', width: '200px', zIndex: 99999 }}>
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
                onClick={() => {
                  setShowStateCityDropdown(!showStateCityDropdown);
                  setShowSolutionDropdown(false);
                  setShowCountryDropdown(false);
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                  {selectedStateCity === 'ALL'
                    ? `All States & Cities (${stateCityList.length})`
                    : selectedStateCity}
                </span>
                <span style={{ fontSize: '10px', marginLeft: '4px', color: '#059669' }}>
                  {showStateCityDropdown ? '▲' : '▼'}
                </span>
              </button>

              {showStateCityDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    width: '240px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
                    zIndex: 999999,
                    padding: '0.45rem',
                    animation: 'fadeInUp 0.15s ease-out'
                  }}
                >
                  <div style={{ position: 'relative', marginBottom: '0.4rem' }}>
                    <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
                    <input
                      type="text"
                      placeholder="Search city or state..."
                      value={stateCitySearchQuery}
                      onChange={(e) => setStateCitySearchQuery(e.target.value)}
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
                    {stateCitySearchQuery && (
                      <X
                        size={12}
                        style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b' }}
                        onClick={() => setStateCitySearchQuery('')}
                      />
                    )}
                  </div>

                  <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', scrollbarWidth: 'thin' }}>
                    <div
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '5px',
                        fontSize: '11.5px',
                        fontWeight: selectedStateCity === 'ALL' ? 800 : 600,
                        background: selectedStateCity === 'ALL' ? '#dcfce7' : 'transparent',
                        color: selectedStateCity === 'ALL' ? '#15803d' : '#0f172a',
                        cursor: 'pointer',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center'
                      }}
                      onClick={() => {
                        setSelectedStateCity('ALL');
                        setShowStateCityDropdown(false);
                        setStateCitySearchQuery('');
                      }}
                    >
                      <span>All States & Cities</span>
                      <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 800 }}>({stateCityList.length})</span>
                    </div>

                    {stateCityList
                      .filter(sc => sc.toLowerCase().includes(stateCitySearchQuery.toLowerCase()))
                      .map(sc => {
                        const isSelected = selectedStateCity === sc;
                        return (
                          <div
                            key={sc}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '5px',
                              fontSize: '11.5px',
                              fontWeight: isSelected ? 800 : 600,
                              background: isSelected ? '#dcfce7' : 'transparent',
                              color: isSelected ? '#15803d' : '#0f172a',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              setSelectedStateCity(sc);
                              setShowStateCityDropdown(false);
                              setStateCitySearchQuery('');
                            }}
                          >
                            <span>{sc}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: '#64748b' }} />
            <input 
              type="text" 
              className="form-input"
              placeholder="Search company, product..."
              style={{ paddingLeft: '2.1rem', padding: '0.35rem 0.65rem', fontSize: '12px', borderColor: '#cbd5e1', background: '#ffffff', color: '#0f172a' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS & CLEAR BUTTON */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Active Filters:</span>
            
            {selectedDomain !== 'ALL' && (
              <span className="badge badge-accept" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', fontSize: '11px' }}>
                Solution: {selectedDomain} <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedDomain('ALL')} />
              </span>
            )}
            
            {selectedCountry !== 'ALL' && (
              <span className="badge badge-accept" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', fontSize: '11px' }}>
                Country: {selectedCountry} <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => { setSelectedCountry('ALL'); setSelectedStateCity('ALL'); }} />
              </span>
            )}

            {selectedStateCity !== 'ALL' && (
              <span className="badge badge-accept" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontSize: '11px' }}>
                City: {selectedStateCity} <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedStateCity('ALL')} />
              </span>
            )}

            {searchQuery && (
              <span className="badge badge-accept" style={{ background: '#f3e8ff', color: '#7e22ce', border: '1px solid #e9d5ff', fontSize: '11px' }}>
                Query: "{searchQuery}" <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSearchQuery('')} />
              </span>
            )}

            <button 
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', padding: '0.2rem 0.5rem', color: '#e11d48', borderColor: '#fecdd3' }}
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: GRID LAYOUT CARDS */}
      {viewMode === 'grid' ? (
        <div className="grid-cols-2">
          {filteredCompanies.length === 0 ? (
            <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <Building2 size={36} color="#cbd5e1" style={{ marginBottom: '0.5rem' }} />
              <p style={{ margin: 0, fontWeight: 700 }}>No OEM companies match the selected filters.</p>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.85rem' }} onClick={clearFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            filteredCompanies.map((comp, idx) => {
              const hasWebsite = comp.website || (comp.contactDetails && comp.contactDetails.includes('http') ? comp.contactDetails : null);
              const contactPersonVal = comp.contactPerson && comp.contactPerson !== 'N/A' ? comp.contactPerson : null;
              const remarksVal = comp.remarks && comp.remarks !== 'N/A' ? comp.remarks : null;
              const cityVal = comp.city && comp.city !== 'N/A' ? comp.city : null;
              const stateVal = comp.state && comp.state !== 'N/A' ? comp.state : null;

              return (
                <div key={comp.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          S.NO {idx + 1} &bull; OEM MANUFACTURER
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginTop: '0.15rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          {getCompanyLogoBadge(comp)} {comp.name}
                        </h3>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-accept" style={{ fontSize: '11px', background: '#f1f5f9', borderColor: '#cbd5e1', color: '#0f172a', fontWeight: 700 }}>
                          {comp.flag || '🌐'} {comp.country}
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
                      <span>
                        Location Hierarchy: <strong style={{ color: '#065f46' }}>{comp.country}</strong>
                        {stateVal && <> &bull; {stateVal}</>}
                        {cityVal && <> &bull; <strong style={{ color: '#065f46' }}>{cityVal}</strong></>}
                      </span>
                    </div>

                    {/* Products Provided */}
                    {comp.products && (
                      <div style={{ 
                        background: '#f8fafc', padding: '0.65rem 0.8rem', 
                        borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', marginBottom: '0.65rem' 
                      }}>
                        <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                          PRODUCTS & SOLUTIONS PROVIDED:
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '12.5px', color: '#0284c7', marginTop: '0.2rem' }}>
                          {comp.products}
                        </div>
                        {comp.domain && (
                          <div style={{ fontSize: '11px', color: '#475569', marginTop: '0.25rem' }}>
                            Domain: <strong style={{ color: '#0f172a' }}>{comp.domain}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Agreement Status & Contact Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '12px' }}>
                      {comp.agreementStatus && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <FileCheck size={14} color="#059669" />
                          <span style={{ color: '#475569' }}>Agreement Status:</span>
                          <span className="badge badge-accept" style={{ fontSize: '10px', padding: '0.1rem 0.4rem', background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                            {comp.agreementStatus}
                          </span>
                        </div>
                      )}

                      {(contactPersonVal || comp.contactDetails) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={14} color="#d97706" />
                          <span style={{ color: '#475569' }}>Contact Person:</span>
                          <strong style={{ color: '#0f172a' }}>
                            {contactPersonVal || ''} {comp.contactDetails ? `(${comp.contactDetails})` : ''}
                          </strong>
                        </div>
                      )}

                      {remarksVal && (
                        <div style={{ fontSize: '11.5px', color: '#9f1239', background: '#ffe4e6', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #fecdd3', marginTop: '0.2rem' }}>
                          💡 <strong>Remarks:</strong> {remarksVal}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTION TOOLBAR */}
                  <div style={{ display: 'flex', gap: '0.45rem', paddingTop: '0.65rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '11px', padding: '0.35rem 0.65rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', fontWeight: 800, border: 'none' }}
                      onClick={() => setSendReqOEMModal(comp)}
                    >
                      <Send size={12} /> Send Requirement
                    </button>

                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11px', padding: '0.35rem 0.65rem', color: '#0f172a', fontWeight: 700 }}
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
                        style={{ fontSize: '11px', padding: '0.3rem 0.6rem', color: '#0284c7', background: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 700 }}
                      >
                        <ExternalLink size={12} /> OEM Site
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* VIEW MODE 2: MASTER TABLE LAYOUT */
        <div className="card" style={{ flex: 1, width: '100%', overflowX: 'auto', padding: '0' }}>
          <div className="table-container">
            <table className="spec-table">
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ width: '45px', color: '#0f172a', fontWeight: 800 }}>S.No</th>
                  <th style={{ width: '220px', color: '#0f172a', fontWeight: 800 }}>OEM Manufacturer</th>
                  <th style={{ width: '150px', color: '#0f172a', fontWeight: 800 }}>Country & Location</th>
                  <th style={{ width: '160px', color: '#0f172a', fontWeight: 800 }}>Domain / Solution</th>
                  <th style={{ width: '240px', color: '#0f172a', fontWeight: 800 }}>Products Provided</th>
                  <th style={{ width: '130px', color: '#0f172a', fontWeight: 800 }}>Agreement</th>
                  <th style={{ width: '180px', color: '#0f172a', fontWeight: 800 }}>Contact Person</th>
                  <th style={{ width: '220px', color: '#0f172a', fontWeight: 800 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: '#64748b', padding: '2.5rem' }}>
                      No OEM companies found matching active filters.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((comp, idx) => {
                    const hasWebsite = comp.website || (comp.contactDetails && comp.contactDetails.includes('http') ? comp.contactDetails : null);
                    const contactPersonVal = comp.contactPerson && comp.contactPerson !== 'N/A' ? comp.contactPerson : null;
                    const cityVal = comp.city && comp.city !== 'N/A' ? comp.city : null;

                    return (
                      <tr key={comp.id}>
                        <td style={{ fontWeight: 800, color: '#64748b' }}>{idx + 1}.</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>
                            {getCompanyLogoBadge(comp)}
                            <span>{comp.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-accept" style={{ fontSize: '11px', background: '#f1f5f9', borderColor: '#cbd5e1', color: '#0f172a', fontWeight: 700 }}>
                            {comp.flag || '🌐'} {comp.country} {cityVal ? `(${cityVal})` : ''}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: '#0284c7', fontSize: '12px' }}>
                          {comp.domain || 'N/A'}
                        </td>
                        <td style={{ fontSize: '12px', color: '#334155', fontWeight: 600, maxWidth: '240px' }}>
                          {comp.products || 'N/A'}
                        </td>
                        <td>
                          {comp.agreementStatus ? (
                            <span className="badge badge-accept" style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                              {comp.agreementStatus}
                            </span>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#64748b' }}>N/A</span>
                          )}
                        </td>
                        <td style={{ fontSize: '11.5px', color: '#0f172a', fontWeight: 700 }}>
                          {contactPersonVal || 'Sales Dept'} {comp.contactDetails ? `(${comp.contactDetails})` : ''}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <button 
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '10.5px', padding: '0.25rem 0.5rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                              onClick={() => setSendReqOEMModal(comp)}
                            >
                              <Send size={11} /> Send Req
                            </button>
                            <button 
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '10.5px', padding: '0.25rem 0.5rem', color: '#0f172a', fontWeight: 700 }}
                              onClick={() => setActiveContactModal(comp)}
                            >
                              ⚡ Contact
                            </button>
                            {hasWebsite && (
                              <a 
                                href={hasWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '10.5px', padding: '0.25rem 0.45rem', color: '#0284c7' }}
                              >
                                <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEND REQUIREMENT TO OEM MODAL */}
      {sendReqOEMModal && (
        <SendRequirementModal 
          oem={sendReqOEMModal}
          categories={categories}
          onClose={() => setSendReqOEMModal(null)}
          onRecordEmail={onRecordEmail}
        />
      )}

      {/* CONTACT EXECUTION MODAL */}
      {activeContactModal && (
        <div className="modal-overlay" onClick={() => setActiveContactModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                {getCompanyLogoBadge(activeContactModal)}
                <div>
                  <div style={{ fontSize: '10px', color: '#0284c7', fontWeight: 800 }}>OEM CONTACT EXECUTION</div>
                  <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0 }}>{activeContactModal.name}</h3>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveContactModal(null)}>
                <X size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Domain / Solutions:</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0284c7', marginTop: '0.15rem' }}>{activeContactModal.domain}</div>
                <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '0.15rem' }}>Products: {activeContactModal.products}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Contact Information:</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                  {activeContactModal.contactPerson || 'Sales & Support Division'}
                </div>
                {activeContactModal.contactDetails && (
                  <div style={{ fontSize: '11.5px', color: '#0284c7', marginTop: '0.15rem' }}>{activeContactModal.contactDetails}</div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSendReqOEMModal(activeContactModal);
                  setActiveContactModal(null);
                }}
              >
                <Send size={15} /> Send Requirement Email
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
