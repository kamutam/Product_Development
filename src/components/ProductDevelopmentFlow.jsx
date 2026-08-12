import React, { useState } from 'react';
import { 
  Lightbulb, FileEdit, Code2, ShieldCheck, Rocket, TrendingUp, Cpu, Layers, CheckCircle2, ArrowRight, Play, RefreshCw, Activity, Sparkles, Award, Box, Clock
} from 'lucide-react';
import GovtEmblemLogo from './GovtEmblemLogo';

export default function ProductDevelopmentFlow({ projects, products, categories, activeProjectId, setSelectedProjectId, setActiveTab }) {
  const [selectedPhase, setSelectedPhase] = useState('idea');
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(true);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // 6 Lifecycle Stages Definition matching the diagram
  const phases = {
    idea: {
      id: 'idea',
      title: 'IDEA & RESEARCH',
      icon: Lightbulb,
      color: '#00f2fe',
      bgGradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
      badgeColor: '#0284c7',
      progress: 100,
      status: 'Completed',
      summary: 'Market feasibility study, competitor benchmark, client requirements gathering, and OEM component sourcing.',
      deliverables: [
        'Stakeholder Tender & PO Requirements Analysis',
        'OEM Supplier Datasheet & STQC Audit Sourcing',
        'Technical & Financial Viability Assessment',
        'Regulatory Compliance Checklist (STQC, BIS, CE, FCC)'
      ],
      leadTeam: 'Product Development & Market Research Team',
      metrics: {
        'Reqs Formulated': '100%',
        'OEM Brands Audited': '14 Companies',
        'Feasibility Score': '98.5%'
      }
    },
    design: {
      id: 'design',
      title: 'DESIGN & PLANNING',
      icon: FileEdit,
      color: '#3a86ff',
      bgGradient: 'linear-gradient(135deg, #3a86ff 0%, #00d2ff 100%)',
      badgeColor: '#2563eb',
      progress: 95,
      status: 'In Progress',
      summary: 'System architecture design, 3D CAD modeling, BOM cost optimization, and tender specification threshold mapping.',
      deliverables: [
        'Hardware CAD & Civil Foundation Engineering Schematics',
        'Electrical & Industrial Networking Topology',
        'Bill of Materials (BOM) & Unit Rate Cost Matrix',
        'STQC & ONVIF Profile M Metadata Spec Mapping'
      ],
      leadTeam: 'System Architecture & Solutions Engineering',
      metrics: {
        'BOM Items Mapped': '11 Subsystems',
        'CAD Approvals': '4/4 Signed',
        'Target Valuation': '$32,520'
      }
    },
    development: {
      id: 'development',
      title: 'DEVELOPMENT',
      icon: Code2,
      color: '#8338ec',
      bgGradient: 'linear-gradient(135deg, #8338ec 0%, #c77dff 100%)',
      badgeColor: '#7c3aed',
      progress: 88,
      status: 'In Progress',
      summary: 'Hardware integration, AI ANPR video analytics firmware compilation, IoT sensor bus setup, and cloud dashboard APIs.',
      deliverables: [
        'Smart Pole Controller & Modular Payload Assembly',
        'AI ANPR & Vehicle Speed Detection Model Training',
        'VMS/NVR Video Stream Pipeline & ONVIF Drivers',
        'Cloud Telemetry API & Local Edge Processing Node'
      ],
      leadTeam: 'Hardware R&D & Embedded Systems Team',
      metrics: {
        'Firmware Build': 'v4.2.8-STQC',
        'AI Model Precision': '99.4%',
        'Sensors Integrated': '11 Units'
      }
    },
    testing: {
      id: 'testing',
      title: 'TESTING & QUALITY',
      icon: ShieldCheck,
      color: '#ff007f',
      bgGradient: 'linear-gradient(135deg, #ff007f 0%, #ff5400 100%)',
      badgeColor: '#db2777',
      progress: 82,
      status: 'Testing',
      summary: 'STQC security lab certification validation, IP67 ingress protection, thermal stress testing, and QA sign-off.',
      deliverables: [
        'Official STQC Cybersecurity & Data Encryption Certification',
        'IK10 Vandal-Proof Impact & Surge Protection Test',
        'Continuous 72-Hour Environmental Thermal Burn-In',
        'Automated Spec Evaluator Acceptance Audit'
      ],
      leadTeam: 'QA & STQC Compliance Testing Division',
      metrics: {
        'STQC Pass Rate': '100%',
        'Thermal Burn-in': '72 Hrs Passed',
        'IP Rating': 'IP67 Certified'
      }
    },
    deployment: {
      id: 'deployment',
      title: 'DEPLOYMENT',
      icon: Rocket,
      color: '#ffb703',
      bgGradient: 'linear-gradient(135deg, #ffb703 0%, #fb8500 100%)',
      badgeColor: '#d97706',
      progress: 75,
      status: 'Scheduled',
      summary: 'On-site civil pole erection, fiber network splicing, ICCC command center integration, and final PO commissioning.',
      deliverables: [
        'On-Site Smart Pole Structural Erection & Power Cabling',
        'Optical Fiber Network Integration to ICCC Center',
        'Client Stakeholder Acceptance Sign-off & Inspection',
        'Field Commissioning & User Training Handover'
      ],
      leadTeam: 'Field Deployment & Commissioning Division',
      metrics: {
        'Sites Ready': '11 Locations',
        'PO Cutoff Date': activeProject.purchaseDeadline || '2026-08-20',
        'Deployment Target': activeProject.implementationDeadline || '2026-09-15'
      }
    },
    maintenance: {
      id: 'maintenance',
      title: 'MAINTENANCE & IMPROVEMENT',
      icon: TrendingUp,
      color: '#06d6a0',
      bgGradient: 'linear-gradient(135deg, #06d6a0 0%, #11998e 100%)',
      badgeColor: '#059669',
      progress: 60,
      status: 'Active Lifecycle',
      summary: 'Automated telemetry health monitoring, OTA firmware updates, predictive maintenance, and product iteration.',
      deliverables: [
        '24/7 AI System Telemetry & Fault Detection Dashboard',
        'Over-The-Air (OTA) Security Firmware Distribution',
        'SLA Maintenance & Spare Parts Inventory Pool',
        'Continuous Product Improvement & V2 Spec Planning'
      ],
      leadTeam: 'SLA Support & Telemetry Operations Center',
      metrics: {
        'Uptime SLA': '99.99%',
        'OTA Channel': 'Encrypted AWS',
        'Iteration Cycle': 'Quarterly'
      }
    }
  };

  const currentPhaseData = phases[selectedPhase] || phases.idea;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Dynamic Keyframe CSS Animations */}
      <style>{`
        @keyframes pulseGlowWave {
          0% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 20px rgba(0, 242, 254, 0.4); }
          50% { transform: scale(1.15); opacity: 0.3; box-shadow: 0 0 45px rgba(58, 134, 255, 0.8); }
          100% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 20px rgba(0, 242, 254, 0.4); }
        }

        @keyframes orbitRotateClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbitRotateCounter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes laserDashPulse {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes floatNode {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        .npd-flow-container {
          position: relative;
          width: 100%;
          max-width: 680px;
          height: 540px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }

        /* Center Core Node */
        .flow-center-core {
          position: absolute;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #0369a1 0%, #0f172a 70%, #020617 100%);
          border: 3px solid #00f2fe;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 20;
          box-shadow: 0 0 35px rgba(0, 242, 254, 0.5), inset 0 0 25px rgba(58, 134, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .flow-center-core:hover {
          transform: scale(1.05);
          box-shadow: 0 0 50px rgba(0, 242, 254, 0.8), inset 0 0 35px rgba(58, 134, 255, 0.8);
        }

        .core-pulse-wave {
          position: absolute;
          width: 190px;
          height: 190px;
          border-radius: 50%;
          border: 2px dashed rgba(0, 242, 254, 0.6);
          animation: pulseGlowWave 3s infinite ease-in-out;
          pointer-events: none;
        }

        .core-orbit {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          border: 1px dotted rgba(58, 134, 255, 0.5);
          animation: orbitRotateClockwise 20s linear infinite;
          pointer-events: none;
        }

        .core-orbit-inner {
          position: absolute;
          width: 145px;
          height: 145px;
          border-radius: 50%;
          border: 1.5px dashed rgba(102, 126, 234, 0.4);
          animation: orbitRotateCounter 14s linear infinite;
          pointer-events: none;
        }

        .core-title {
          color: #ffffff;
          font-weight: 900;
          font-size: 13px;
          text-align: center;
          letter-spacing: 0.06em;
          text-shadow: 0 2px 8px rgba(0, 242, 254, 0.8);
          line-height: 1.25;
          margin-top: 4px;
        }

        /* 6 Orbiting Connected Nodes */
        .flow-node-item {
          position: absolute;
          width: 115px;
          height: 115px;
          border-radius: 50%;
          background: #ffffff;
          border: 2.5px solid #cbd5e1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 25;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          animation: floatNode 4s ease-in-out infinite;
        }

        .flow-node-item:hover {
          transform: scale(1.12) translateY(-4px) !important;
          box-shadow: 0 15px 35px rgba(0, 242, 254, 0.4);
        }

        .flow-node-item.active {
          border-width: 3px;
          box-shadow: 0 0 30px rgba(0, 242, 254, 0.6);
          transform: scale(1.1) !important;
        }

        .node-icon-wrapper {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 3px;
          transition: all 0.3s ease;
        }

        .node-label-text {
          font-size: 10px;
          font-weight: 800;
          color: #0f172a;
          text-align: center;
          line-height: 1.15;
          max-width: 95px;
          letter-spacing: 0.02em;
        }

        /* Positions for 6 Nodes in Circle (Radius = ~210px) */
        .node-idea        { top: 20px;  left: 282.5px; transform: translateX(-50%); animation-delay: 0s; }
        .node-design      { top: 110px; right: 45px; animation-delay: 0.6s; }
        .node-development { bottom: 110px; right: 45px; animation-delay: 1.2s; }
        .node-testing     { bottom: 20px; left: 282.5px; transform: translateX(-50%); animation-delay: 1.8s; }
        .node-deployment  { bottom: 110px; left: 45px; animation-delay: 2.4s; }
        .node-maintenance { top: 110px; left: 45px; animation-delay: 3s; }

        /* SVG Connections */
        .flow-svg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
          pointer-events: none;
        }

        .flow-line-static {
          stroke: #cbd5e1;
          stroke-width: 2.5;
          stroke-dasharray: 4 4;
        }

        .flow-line-laser {
          stroke-width: 3.5;
          stroke-linecap: round;
          stroke-dasharray: 15 85;
          animation: laserDashPulse 2.2s linear infinite;
        }
      `}</style>

      {/* HEADER BANNER */}
      <div className="card" style={{ 
        background: '#ffffff', 
        border: '1px solid #cbd5e1', 
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              BRIHASPATHI® PRODUCT DEVELOPMENT ENGINE &bull; LIFECYCLE FLOW
            </span>
            <span className="badge badge-accept" style={{ fontSize: '10.5px', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>
              6 Active Phases
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={22} color="#0284c7" /> Product Development Interactive Flow Diagram
          </h2>
          <p style={{ fontSize: '12.5px', color: '#475569', marginTop: '0.2rem' }}>
            Interactive 6-Stage Hardware & Software Innovation Pipeline with Real-Time Laser Telemetry & Phase Auditing.
          </p>
        </div>

        {/* 1-Click Switch Project Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800 }}>⚡ Active Project Lifecycle:</span>
            <select 
              className="form-select" 
              style={{ width: '270px', padding: '0.45rem 0.65rem', fontSize: '12px', borderColor: '#cbd5e1', background: '#ffffff', color: '#0f172a', fontWeight: 800 }}
              value={activeProjectId} 
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  📁 {p.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '1.1rem', fontWeight: 800, color: '#0284c7', borderColor: '#cbd5e1' }}
            onClick={() => setIsPlayingAnimation(!isPlayingAnimation)}
          >
            <RefreshCw size={14} className={isPlayingAnimation ? 'spin' : ''} />
            {isPlayingAnimation ? 'Laser Animation Playing' : 'Play Animation'}
          </button>
        </div>
      </div>

      {/* 2-COLUMN MAIN CONTENT: ANIMATED 6-NODE FLOW CORE (LEFT) + INTERACTIVE PHASE INSPECTOR CARD (RIGHT) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.25rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: ANIMATED PRODUCT DEVELOPMENT 6-NODE CORE */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
          border: '1px solid #334155', 
          borderRadius: '16px', 
          padding: '1.5rem 1rem',
          boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}>
          {/* Top Status Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <GovtEmblemLogo type={activeProject?.client || activeProject?.name} size={22} />
              <span style={{ fontSize: '12px', color: '#00f2fe', fontWeight: 800 }}>
                {activeProject?.name}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
              Click any node to inspect stage deliverables &rarr;
            </span>
          </div>

          {/* ANIMATED DIAGRAM CONTAINER */}
          <div className="npd-flow-container">
            {/* SVG CONNECTION LINES OVERLAY (565x540 Viewport Geometry) */}
            <svg className="flow-svg-overlay" viewBox="0 0 565 540">
              <defs>
                <radialGradient id="laserGrad" cx="282.5" cy="270" r="240" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#3a86ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8338ec" stopOpacity="0.6" />
                </radialGradient>

                <marker id="arrowHead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
                  <path d="M 0 1.5 L 7 5 L 0 8.5 L 2 5 z" fill="#00f2fe" />
                </marker>
              </defs>

              {/* 6 Static Lines with Arrowheads connecting center (282.5, 270) to 6 nodes */}
              {/* 1. Idea (Top: 282.5, 80) */}
              <line x1="282.5" y1="185" x2="282.5" y2="85" className="flow-line-static" markerEnd="url(#arrowHead)" />
              {/* 2. Design (Top Right: 460, 160) */}
              <line x1="345" y1="230" x2="455" y2="165" className="flow-line-static" markerEnd="url(#arrowHead)" />
              {/* 3. Development (Bottom Right: 460, 380) */}
              <line x1="345" y1="310" x2="455" y2="375" className="flow-line-static" markerEnd="url(#arrowHead)" />
              {/* 4. Testing (Bottom: 282.5, 460) */}
              <line x1="282.5" y1="355" x2="282.5" y2="455" className="flow-line-static" markerEnd="url(#arrowHead)" />
              {/* 5. Deployment (Bottom Left: 105, 380) */}
              <line x1="220" y1="310" x2="110" y2="375" className="flow-line-static" markerEnd="url(#arrowHead)" />
              {/* 6. Maintenance (Top Left: 105, 160) */}
              <line x1="220" y1="230" x2="110" y2="165" className="flow-line-static" markerEnd="url(#arrowHead)" />

              {/* 6 Animated Flowing Laser Pulses */}
              {isPlayingAnimation && (
                <>
                  <line x1="282.5" y1="185" x2="282.5" y2="85" className="flow-line-laser" stroke="url(#laserGrad)" />
                  <line x1="345" y1="230" x2="455" y2="165" className="flow-line-laser" stroke="url(#laserGrad)" style={{ animationDelay: '0.4s' }} />
                  <line x1="345" y1="310" x2="455" y2="375" className="flow-line-laser" stroke="url(#laserGrad)" style={{ animationDelay: '0.8s' }} />
                  <line x1="282.5" y1="355" x2="282.5" y2="455" className="flow-line-laser" stroke="url(#laserGrad)" style={{ animationDelay: '1.2s' }} />
                  <line x1="220" y1="310" x2="110" y2="375" className="flow-line-laser" stroke="url(#laserGrad)" style={{ animationDelay: '1.6s' }} />
                  <line x1="220" y1="230" x2="110" y2="165" className="flow-line-laser" stroke="url(#laserGrad)" style={{ animationDelay: '2.0s' }} />
                </>
              )}
            </svg>

            {/* CENTER CORE: PRODUCT DEVELOPMENT */}
            <div className="flow-center-core" onClick={() => setSelectedPhase('idea')}>
              <div className="core-pulse-wave" />
              <div className="core-orbit" />
              <div className="core-orbit-inner" />
              <Box size={38} color="#00f2fe" style={{ filter: 'drop-shadow(0 0 10px #00f2fe)' }} />
              <div className="core-title">
                PRODUCT<br />DEVELOPMENT
              </div>
            </div>

            {/* 6 ORBITING CONNECTED NODES */}
            {Object.values(phases).map((phase) => {
              const IconComp = phase.icon;
              const isSelected = selectedPhase === phase.id;

              return (
                <div
                  key={phase.id}
                  className={`flow-node-item node-${phase.id} ${isSelected ? 'active' : ''}`}
                  style={{
                    borderColor: isSelected ? phase.color : '#cbd5e1',
                    background: isSelected ? '#ffffff' : '#ffffff'
                  }}
                  onClick={() => setSelectedPhase(phase.id)}
                  title={`Click to inspect ${phase.title}`}
                >
                  <div 
                    className="node-icon-wrapper" 
                    style={{ 
                      background: isSelected ? phase.bgGradient : '#f1f5f9',
                      boxShadow: isSelected ? `0 0 15px ${phase.color}` : 'none'
                    }}
                  >
                    <IconComp size={22} color={isSelected ? '#ffffff' : phase.badgeColor} />
                  </div>
                  <span className="node-label-text" style={{ color: isSelected ? phase.badgeColor : '#0f172a' }}>
                    {phase.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE PHASE DEEP DIVE INSPECTOR CARD */}
        <div className="card" style={{ 
          background: '#ffffff', 
          border: '1px solid #cbd5e1', 
          borderRadius: '16px', 
          padding: '1.25rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Phase Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ 
                width: '44px', height: '44px', borderRadius: '12px', 
                background: currentPhaseData.bgGradient, display: 'flex', 
                alignItems: 'center', justifyContent: 'center', color: '#ffffff',
                boxShadow: `0 6px 16px ${currentPhaseData.color}40`
              }}>
                {React.createElement(currentPhaseData.icon, { size: 24 })}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
                  {currentPhaseData.title}
                </h3>
                <span style={{ fontSize: '11px', color: currentPhaseData.badgeColor, fontWeight: 800 }}>
                  Stage {Object.keys(phases).indexOf(selectedPhase) + 1} of 6 &bull; {currentPhaseData.status}
                </span>
              </div>
            </div>

            <span className="badge badge-accept" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd', fontSize: '11px', fontWeight: 800 }}>
              {currentPhaseData.progress}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#64748b', fontWeight: 700, marginBottom: '0.35rem' }}>
              <span>Phase Progress Meter</span>
              <span style={{ color: currentPhaseData.badgeColor, fontWeight: 800 }}>{currentPhaseData.progress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              <div style={{ 
                width: `${currentPhaseData.progress}%`, height: '100%', 
                background: currentPhaseData.bgGradient, borderRadius: '999px',
                transition: 'width 0.5s ease-in-out' 
              }} />
            </div>
          </div>

          {/* Phase Summary Description */}
          <div style={{ background: '#f8fafc', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#334155', lineHeight: '1.45' }}>
            {currentPhaseData.summary}
          </div>

          {/* Phase Specific Metrics Grid */}
          <div>
            <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '0.04em' }}>
              📊 Phase Telemetry & Metrics:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
              {Object.entries(currentPhaseData.metrics).map(([key, val]) => (
                <div key={key} style={{ background: '#ffffff', padding: '0.45rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{key}</div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Deliverables Checklist */}
          <div>
            <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '0.04em' }}>
              ✅ Engineering Deliverables Checklist:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {currentPhaseData.deliverables.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '11.5px', color: '#0f172a', background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontWeight: 600 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Team Indicator */}
          <div style={{ fontSize: '11.5px', color: '#475569', background: '#f1f5f9', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            👑 Assigned Engineering Team: <strong style={{ color: '#0f172a' }}>{currentPhaseData.leadTeam}</strong>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
            <button 
              className="btn btn-primary btn-sm" 
              style={{ flex: 1, fontWeight: 800, fontSize: '12px' }}
              onClick={() => setActiveTab('evaluator')}
            >
              Run Compliance Audit <ArrowRight size={14} />
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ fontWeight: 800, fontSize: '12px', color: '#0f172a', borderColor: '#cbd5e1' }}
              onClick={() => setActiveTab('projects')}
            >
              View Tender PO
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
