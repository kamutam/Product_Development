import React from 'react';

// Official High-Resolution Vector Emblems for Indian Govt Agencies & Certifications
export default function GovtEmblemLogo({ type, size = 28, style = {} }) {
  const t = (type || '').toUpperCase();

  // 1. AP-CRDA (Andhra Pradesh Capital Region Development Authority / Govt of AP)
  if (t.includes('APCRDA') || t.includes('AP-CRDA') || t.includes('AMARAVATI') || t.includes('ANDHRA')) {
    return (
      <div 
        title="Andhra Pradesh Capital Region Development Authority (AP-CRDA)"
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px', 
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.18) 0%, rgba(16, 185, 129, 0.18) 100%)', 
          border: '1px solid rgba(234, 179, 8, 0.45)', 
          padding: '3px 8px', 
          borderRadius: '6px',
          color: '#fef08a',
          fontWeight: 800,
          fontSize: '11px',
          ...style 
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#eab308" strokeWidth="4"/>
          <path d="M50 12 L56 30 L75 30 L60 42 L66 60 L50 48 L34 60 L40 42 L25 30 L44 30 Z" fill="#eab308"/>
          <circle cx="50" cy="50" r="18" fill="#10b981"/>
          <text x="50" y="55" fontSize="14" fontWeight="900" fill="#ffffff" textAnchor="middle">AP</text>
        </svg>
        <span>🏛️ AP-CRDA GOVT</span>
      </div>
    );
  }

  // 2. INDIAN RAILWAYS (Northern Central Railway / RDSO Govt of India)
  if (t.includes('RAILWAY') || t.includes('RDSO') || t.includes('IR') || t.includes('NORTHERN')) {
    return (
      <div 
        title="Indian Railways / Northern Central Railway (Govt of India)"
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px', 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(30, 58, 138, 0.3) 100%)', 
          border: '1px solid rgba(239, 68, 68, 0.5)', 
          padding: '3px 8px', 
          borderRadius: '6px',
          color: '#fca5a5',
          fontWeight: 800,
          fontSize: '11px',
          ...style 
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#ef4444" strokeWidth="4"/>
          <path d="M30 65 L50 25 L70 65 H30 Z" fill="#3b82f6"/>
          <rect x="42" y="45" width="16" height="25" fill="#ef4444" rx="2"/>
          <circle cx="50" cy="35" r="5" fill="#fef08a"/>
          <text x="50" y="86" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle">INDIAN RLY</text>
        </svg>
        <span>🚆 INDIAN RAILWAYS</span>
      </div>
    );
  }

  // 3. MSRTC (Maharashtra State Road Transport Corporation / Maharashtra Shasan)
  if (t.includes('MSRTC') || t.includes('MAHARASHTRA') || t.includes('BUS DEPOT')) {
    return (
      <div 
        title="Maharashtra State Road Transport Corporation (MSRTC)"
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px', 
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.22) 0%, rgba(13, 148, 136, 0.22) 100%)', 
          border: '1px solid rgba(249, 115, 22, 0.5)', 
          padding: '3px 8px', 
          borderRadius: '6px',
          color: '#fdba74',
          fontWeight: 800,
          fontSize: '11px',
          ...style 
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="15" width="84" height="70" rx="12" fill="#0f766e" stroke="#f97316" strokeWidth="4"/>
          <rect x="18" y="25" width="64" height="24" rx="4" fill="#38bdf8"/>
          <circle cx="30" cy="70" r="10" fill="#f97316"/>
          <circle cx="70" cy="70" r="10" fill="#f97316"/>
          <text x="50" y="42" fontSize="11" fontWeight="900" fill="#0f172a" textAnchor="middle">MSRTC</text>
        </svg>
        <span>🚌 MSRTC GOVT</span>
      </div>
    );
  }

  // 4. MeiTY STQC (Standardisation Testing and Quality Certification Directorate, Govt of India)
  if (t.includes('STQC') || t.includes('MEITY') || t.includes('GOVT MeiTY')) {
    return (
      <div 
        title="MeiTY STQC Certified (Ministry of Electronics & IT, Govt of India)"
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px', 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(99, 102, 241, 0.22) 100%)', 
          border: '1px solid rgba(56, 189, 248, 0.55)', 
          padding: '3px 8px', 
          borderRadius: '6px',
          color: '#38bdf8',
          fontWeight: 800,
          fontSize: '11px',
          ...style 
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5 L88 22 V50 C88 72 70 90 50 96 C30 90 12 72 12 50 V22 L50 5 Z" fill="#0369a1" stroke="#38bdf8" strokeWidth="4"/>
          <path d="M35 50 L45 62 L68 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>🛡️ MeiTY STQC GOVT</span>
      </div>
    );
  }

  // 5. ARAI (Automotive Research Association of India, Ministry of Heavy Industries)
  if (t.includes('ARAI') || t.includes('AIS-140') || t.includes('AUTOMOTIVE')) {
    return (
      <div 
        title="ARAI Certified AIS-140 (Ministry of Heavy Industries, Govt of India)"
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px', 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.22) 100%)', 
          border: '1px solid rgba(16, 185, 129, 0.55)', 
          padding: '3px 8px', 
          borderRadius: '6px',
          color: '#34d399',
          fontWeight: 800,
          fontSize: '11px',
          ...style 
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="#065f46" stroke="#34d399" strokeWidth="4"/>
          <text x="50" y="45" fontSize="16" fontWeight="900" fill="#ffffff" textAnchor="middle">ARAI</text>
          <text x="50" y="65" fontSize="10" fontWeight="800" fill="#a7f3d0" textAnchor="middle">AIS-140</text>
        </svg>
        <span>🚗 ARAI CERTIFIED</span>
      </div>
    );
  }

  // 6. BIS / ISI (Bureau of Indian Standards)
  if (t.includes('BIS') || t.includes('ISI')) {
    return (
      <div 
        title="BIS Certified (Bureau of Indian Standards)"
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px', 
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(126, 34, 206, 0.22) 100%)', 
          border: '1px solid rgba(168, 85, 247, 0.55)', 
          padding: '3px 8px', 
          borderRadius: '6px',
          color: '#c084fc',
          fontWeight: 800,
          fontSize: '11px',
          ...style 
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" rx="8" fill="#581c87" stroke="#c084fc" strokeWidth="4"/>
          <text x="50" y="55" fontSize="22" fontWeight="900" fill="#ffffff" textAnchor="middle">BIS</text>
        </svg>
        <span>🇮🇳 BIS CERTIFIED</span>
      </div>
    );
  }

  // Default General Govt Emblem Badge
  return (
    <div 
      title="Government Project"
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '6px', 
        background: 'rgba(99, 102, 241, 0.18)', 
        border: '1px solid rgba(99, 102, 241, 0.45)', 
        padding: '3px 8px', 
        borderRadius: '6px',
        color: '#818cf8',
        fontWeight: 800,
        fontSize: '11px',
        ...style 
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="44" fill="#312e81" stroke="#818cf8" strokeWidth="4"/>
        <text x="50" y="58" fontSize="20" fontWeight="900" fill="#ffffff" textAnchor="middle">GOVT</text>
      </svg>
      <span>🏛️ GOVT APPROVED</span>
    </div>
  );
}
