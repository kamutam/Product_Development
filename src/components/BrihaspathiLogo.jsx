import React from 'react';

export default function BrihaspathiLogo({ height = 44, showTagline = true, className = '' }) {
  const logoUrl = "https://hrms.brihaspathi.in/images/btlwhitelogo.png";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer' }} className={className}>
      <img 
        src={logoUrl} 
        alt="Brihaspathi Technologies" 
        style={{ 
          height: `${height}px`, 
          width: 'auto', 
          maxHeight: '70px',
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))'
        }}
        onError={(e) => {
          // Fallback if image fails to load
          e.target.style.display = 'none';
        }}
      />
      {showTagline && (
        <span style={{ 
          fontSize: '0.66rem', 
          fontWeight: 600, 
          color: '#94a3b8', 
          letterSpacing: '0.01em', 
          marginTop: '4px' 
        }}>
          ...The Guru of Tomorrow&rsquo;s Technology
        </span>
      )}
    </div>
  );
}
