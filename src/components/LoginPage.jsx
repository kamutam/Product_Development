import React, { useState, useEffect } from 'react';
import { 
  Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, Box, Lightbulb, Edit3, Code2, ClipboardCheck, Rocket, TrendingUp, Play, Pause, X, ExternalLink, ShieldCheck, Cpu, CheckCircle2
} from 'lucide-react';
import BrihaspathiLogo from './BrihaspathiLogo';

// 6 Product Development Lifecycle Domains
const DOMAIN_NODES = [
  {
    id: 'idea',
    label: 'IDEA & RESEARCH',
    icon: Lightbulb,
    color: '#00f2fe',
    badge: 'PRD & TENDER PARSING',
    desc: 'Market research, PRD requirements, MoRTH AIS-140 tender spec analysis, and patent filing.'
  },
  {
    id: 'design',
    label: 'DESIGN & PLANNING',
    icon: Edit3,
    color: '#818cf8',
    badge: 'CAD & PCB ARCHITECTURE',
    desc: 'Hardware 3D CAD modeling, circuit schematic design, BOM sourcing, and thermal analysis.'
  },
  {
    id: 'development',
    label: 'DEVELOPMENT',
    icon: Code2,
    color: '#c084fc',
    badge: 'FIRMWARE & AI ANALYTICS',
    desc: 'PCB assembly, SMT manufacturing, C++ embedded firmware, and STQC AI video analytics.'
  },
  {
    id: 'testing',
    label: 'TESTING & QUALITY',
    icon: ClipboardCheck,
    color: '#34d399',
    badge: 'STQC & ARAI HOMOLOGATION',
    desc: 'STQC 4K camera lab certification, ARAI AIS-140 homologation, and IP67 stress QA testing.'
  },
  {
    id: 'deployment',
    label: 'DEPLOYMENT',
    icon: Rocket,
    color: '#38bdf8',
    badge: 'COMMAND CENTER & OEM',
    desc: 'Command & control center setup, B2B procurement mail dispatch, and field commissioning.'
  },
  {
    id: 'maintenance',
    label: 'MAINTENANCE & SLA',
    icon: TrendingUp,
    color: '#facc15',
    badge: 'IOT TELEMETRY & OTA',
    desc: '24/7 Remote IoT sensor monitoring, OTA firmware upgrades, and SLA maintenance.'
  }
];

export default function LoginPage({ onLogin }) {
  // Credentials strictly requested by user (venu / 123)
  const [username, setUsername] = useState('venu');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Continuous 360° Clockwise Orbit Rotation State
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isOrbiting, setIsOrbiting] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState(null);

  // 60 FPS Smooth Clockwise Orbital Revolution Animation Loop
  useEffect(() => {
    if (!isOrbiting) return;

    let animFrameId;
    const stepAnimation = () => {
      setRotationAngle(prev => (prev + 0.22) % 360);
      animFrameId = requestAnimationFrame(stepAnimation);
    };

    animFrameId = requestAnimationFrame(stepAnimation);
    return () => cancelAnimationFrame(animFrameId);
  }, [isOrbiting]);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Prevent duplicate form submissions when Enter is pressed multiple times rapidly
    if (isSubmitting) return;

    // Form input validation
    if (!username || !username.trim() || !password) {
      setErrorMsg('Please enter both username/email and password.');
      return;
    }

    setIsSubmitting(true);
    
    // Strict authentication check (accepts username 'venu' or email 'venu.m@brihaspathi.com' with password '123')
    const normUser = username.trim().toLowerCase();
    if ((normUser === 'venu' || normUser === 'venu.m@brihaspathi.com') && password === '123') {
      setErrorMsg('');
      onLogin({
        email: 'venu.m@brihaspathi.com',
        role: 'Product Development Team Lead',
        name: 'KAMUTAM VENU MADHAV'
      });
    } else {
      setErrorMsg('Invalid Username or Password. Enter valid credentials (venu / 123).');
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleDomainClick = (domain) => {
    setSelectedDomain(domain);
    setIsOrbiting(false); // Pause orbit animation so user can inspect clicked domain
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080c16',
      backgroundImage: `
        radial-gradient(at 15% 15%, rgba(99, 102, 241, 0.35) 0px, transparent 50%),
        radial-gradient(at 85% 85%, rgba(168, 85, 247, 0.35) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(14, 165, 233, 0.18) 0px, transparent 50%)
      `,
      padding: '2rem 1.5rem',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* Top Left Pinned Brand Logo */}
      <div style={{ position: 'absolute', top: '2rem', left: '2.5rem', zIndex: 30 }}>
        <BrihaspathiLogo height={52} showTagline={false} darkText={false} />
      </div>

      <div style={{
        maxWidth: '1320px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '3rem',
        zIndex: 10,
        marginTop: '2rem',
        flexWrap: 'wrap-reverse'
      }}>
        
        {/* LEFT COLUMN: REAL CONTINUOUS 360° CLOCKWISE REVOLVING PRODUCT DEVELOPMENT MINDMAP */}
        <div style={{ flex: 1.4, minWidth: '360px', color: '#ffffff' }}>

          {/* DYNAMIC REVOLVING 520x520 CANVAS */}
          <div style={{ height: '520px', maxWidth: '640px', position: 'relative', margin: '0 auto' }}>
            
            {/* Central Core: Floating 3D Box Icon & PRODUCT DEVELOPMENT Text */}
            <div 
              style={{ 
                position: 'absolute', 
                left: '50%', 
                top: '50%', 
                transform: 'translate(-50%, -50%)', 
                width: '150px', 
                height: '150px', 
                background: 'radial-gradient(circle at 30% 30%, #0284c7 0%, #0369a1 60%, #0f172a 100%)', 
                border: '3.5px solid #00f2fe', 
                boxShadow: '0 0 50px rgba(0, 242, 254, 0.9), inset 0 0 30px rgba(255, 255, 255, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                borderRadius: '12px',
                animation: 'floatCore 4s ease-in-out infinite'
              }}
            >
              {/* Expanding Core Pulse Wave */}
              <div style={{
                position: 'absolute',
                width: '150px',
                height: '150px',
                borderRadius: '12px',
                border: '2px solid #00f2fe',
                animation: 'corePulseWave 2.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite'
              }} />

              {/* Outer Rotating Orbit Ring (Clockwise) */}
              <div style={{
                position: 'absolute',
                width: '205px',
                height: '205px',
                borderRadius: '50%',
                border: '1.5px dashed rgba(0, 242, 254, 0.75)',
                animation: 'coreOrbitRotate 12s linear infinite'
              }} />

              {/* Inner Rotating Orbit Ring (Clockwise) */}
              <div style={{
                position: 'absolute',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                border: '1px dashed rgba(168, 85, 247, 0.6)',
                animation: 'coreOrbitRotate 18s linear infinite'
              }} />

              {/* Clockwise Radar Laser Sweeper Beam */}
              <div style={{
                position: 'absolute',
                width: '260px',
                height: '260px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, rgba(0, 242, 254, 0.35) 0deg, transparent 60deg, transparent 360deg)',
                animation: 'radarScanClockwise 6s linear infinite',
                pointerEvents: 'none'
              }} />

              <Box size={38} color="#00f2fe" style={{ filter: 'drop-shadow(0 0 14px #00f2fe)', marginBottom: '0.25rem', animation: 'boxGlowPulse 2.5s ease-in-out infinite' }} />
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', lineHeight: '1.15', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
                PRODUCT<br />DEVELOPMENT
              </span>
            </div>

            {/* 6 DYNAMICALLY REVOLVING CLOCKWISE DOMAIN NODES */}
            {DOMAIN_NODES.map((domain, index) => {
              const DomainIcon = domain.icon;
              const isSelected = selectedDomain?.id === domain.id;

              // Calculate 360° Revolving Orbit Position (Radius R = 195px around Center 260px)
              const baseAngleDeg = index * 60 - 90; // 12, 2, 4, 6, 8, 10 o'clock
              const currentAngleRad = ((baseAngleDeg + rotationAngle) * Math.PI) / 180;
              
              const leftPct = ((260 + 195 * Math.cos(currentAngleRad)) / 520) * 100;
              const topPct = ((260 + 195 * Math.sin(currentAngleRad)) / 520) * 100;

              return (
                <div 
                  key={domain.id} 
                  title={`Click to inspect ${domain.label}`}
                  onClick={() => handleDomainClick(domain)}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: isSelected ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'rgba(15, 23, 42, 0.94)',
                    border: `2.5px solid ${isSelected ? '#ffffff' : domain.color}`,
                    borderRadius: '30px',
                    padding: '0.6rem 1.25rem',
                    color: '#ffffff',
                    cursor: 'pointer',
                    zIndex: isSelected ? 35 : 25,
                    boxShadow: isSelected ? `0 0 35px ${domain.color}, 0 0 20px #ffffff` : `0 0 22px ${domain.color}55, 0 8px 25px rgba(0,0,0,0.7)`,
                    transition: 'border 0.2s, box-shadow 0.2s'
                  }}
                >
                  <div style={{ 
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isSelected ? domain.color : 'rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? '#0f172a' : domain.color,
                    boxShadow: isSelected ? `0 0 12px ${domain.color}` : undefined
                  }}>
                    <DomainIcon size={17} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.04em', color: '#ffffff', whiteSpace: 'nowrap' }}>
                    {domain.label}
                  </span>
                </div>
              );
            })}

            {/* REAL-TIME AUTO-TRACKING SVG LASER CONNECTIONS */}
            <svg viewBox="0 0 520 520" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
              <defs>
                <radialGradient id="laserGradRevol" cx="260" cy="260" r="240" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.95" />
                  <stop offset="55%" stopColor="#3a86ff" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.5" />
                </radialGradient>

                <marker id="arrowRevol" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 7 5 L 0 8.5 L 2 5 z" fill="#00f2fe" />
                </marker>
              </defs>

              {DOMAIN_NODES.map((domain, index) => {
                const isSelected = selectedDomain?.id === domain.id;
                
                const baseAngleDeg = index * 60 - 90;
                const currentAngleRad = ((baseAngleDeg + rotationAngle) * Math.PI) / 180;
                
                const x1 = 260 + 72 * Math.cos(currentAngleRad);
                const y1 = 260 + 72 * Math.sin(currentAngleRad);
                
                const x2 = 260 + 145 * Math.cos(currentAngleRad);
                const y2 = 260 + 145 * Math.sin(currentAngleRad);

                return (
                  <g key={`line-revol-${domain.id}`}>
                    <line 
                      x1={x1} y1={y1} 
                      x2={x2} y2={y2} 
                      markerEnd="url(#arrowRevol)" 
                      style={{ stroke: isSelected ? domain.color : 'rgba(56, 189, 248, 0.35)', strokeWidth: isSelected ? 4 : 2 }}
                    />
                    
                    {/* Flowing Laser Line */}
                    <line 
                      x1={x1} y1={y1} 
                      x2={x2} y2={y2} 
                      stroke={isSelected ? domain.color : "url(#laserGradRevol)"}
                      style={{ 
                        strokeWidth: isSelected ? 6 : 4,
                        strokeDasharray: '12 12',
                        animation: 'laserDashFlow 1.8s linear infinite',
                        filter: isSelected ? `drop-shadow(0 0 12px ${domain.color})` : 'drop-shadow(0 0 6px #00f2fe)',
                        opacity: isSelected ? 1 : 0.65
                      }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* CLICKED DOMAIN INSPECTOR CARD */}
          {selectedDomain && (
            <div style={{
              marginTop: '1rem',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.96) 100%)',
              border: `2px solid ${selectedDomain.color}`,
              boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${selectedDomain.color}44`,
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              maxWidth: '640px',
              margin: '1rem auto 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  background: `${selectedDomain.color}25`,
                  border: `1.5px solid ${selectedDomain.color}`,
                  padding: '0.75rem',
                  borderRadius: '50%',
                  color: selectedDomain.color
                }}>
                  {React.createElement(selectedDomain.icon, { size: 24 })}
                </div>

                <div>
                  <div style={{ fontSize: '10px', color: selectedDomain.color, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    ★ {selectedDomain.badge}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#ffffff' }}>
                    {selectedDomain.label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '0.15rem' }}>
                    {selectedDomain.desc}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedDomain(null);
                  setIsOrbiting(true); // Resume 360° orbit rotation
                }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Close Inspector & Resume Orbit"
              >
                <X size={16} />
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: CLEAN WHITE LOGIN CARD (MATCHING USER REFERENCE SCREENSHOT) */}
        <div style={{
          maxWidth: '430px',
          width: '100%',
          padding: '2.5rem 2.2rem',
          background: '#f8fafc',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.3)',
          borderRadius: '24px',
          border: '1px solid #cbd5e1'
        }}>
          
          {/* Welcome Text Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '13px', color: '#475569', fontWeight: 700 }}>
              Welcome Back To Product Development!
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e293b', marginTop: '0.2rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              KAMUTAM VENU MADHAV
            </h2>
          </div>

          {/* Profile Photo Avatar (Matching Screenshot) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '3px solid #ffffff',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              background: '#e2e8f0'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
                alt="KAMUTAM VENU MADHAV" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80";
                }}
              />
            </div>
          </div>

          {errorMsg && (
            <div style={{
              padding: '0.65rem', background: '#fee2e2', border: '1px solid #fca5a5',
              borderRadius: '10px', color: '#b91c1c', fontSize: '12px', marginBottom: '1.25rem', textAlign: 'center', fontWeight: 700
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Clean Username Input Field (Without BT- Prefix) */}
            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  color: '#64748b', 
                  display: 'flex',
                  alignItems: 'center',
                  zIndex: 2
                }}>
                  <Mail size={18} />
                </div>

                <input
                  type="text"
                  className="form-input"
                  placeholder="venu"
                  style={{ 
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem', 
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    fontSize: '13.5px', 
                    fontWeight: 700,
                    background: '#ffffff', 
                    color: '#0f172a', 
                    borderColor: '#cbd5e1',
                    borderRadius: '10px',
                    letterSpacing: '0.02em',
                    width: '100%'
                  }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                />
              </div>
            </div>

            {/* Password Input with Eye Icon (Matching Screenshot) */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    color: '#64748b', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 2
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="123"
                  style={{ 
                    paddingLeft: '2.5rem', 
                    fontSize: '13.5px', 
                    fontWeight: 700,
                    background: '#e0f2fe', 
                    color: '#0f172a', 
                    borderColor: '#93c5fd',
                    borderRadius: '10px',
                    letterSpacing: showPassword ? 'normal' : '0.15em'
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                />
              </div>
            </div>

            {/* LOGIN Action Button (Matching Screenshot Purple Gradient) */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ 
                width: '100%', 
                padding: '0.85rem', 
                fontSize: '15px', 
                fontWeight: 900,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.45)',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              LOGIN
            </button>
          </form>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'center', fontSize: '12px' }}>
            <span 
              style={{ color: '#6366f1', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => alert('Default credentials: Username = venu, Password = 123')}
            >
              Forgot Password?
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
