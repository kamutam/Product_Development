import React from 'react';

export default function BrihaspathiLogo({ height = 44, showTagline = true, darkText = true, className = '' }) {
  const logoUrl = "https://hrms.brihaspathi.in/images/btlwhitelogo.png";

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }} className={className}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <img 
          src={logoUrl} 
          alt="Brihaspathi Technologies" 
          style={{ 
            height: `${height}px`, 
            width: 'auto', 
            maxHeight: '70px',
            objectFit: 'contain',
            filter: darkText ? 'invert(1) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15))' : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {showTagline && (
          <span style={{ 
            fontSize: '0.64rem', 
            fontWeight: 700, 
            color: darkText ? '#334155' : '#94a3b8', 
            letterSpacing: '0.01em', 
            marginTop: '2px' 
          }}>
            ...The Guru of Tomorrow&rsquo;s Technology
          </span>
        )}
      </div>

      <div style={{ 
        padding: '0.25rem 0.6rem', 
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', 
        border: '1px solid #38bdf8', 
        borderRadius: '6px', 
        fontSize: '11.5px', 
        fontWeight: 800, 
        color: '#ffffff', 
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        boxShadow: '0 2px 10px rgba(2, 132, 199, 0.35)',
        whiteSpace: 'nowrap'
      }}>
        🚀 Product Development
      </div>
    </div>
  );
}
