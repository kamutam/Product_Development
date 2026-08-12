import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, Edit3, Code2, ClipboardCheck, Rocket, TrendingUp, Box,
  Play, Pause, Sparkles, ArrowRight, ShieldCheck, Activity,
  Bot, Search, X
} from 'lucide-react';

const EXACT_FLOW_NODES = [
  {
    id: 'attendance',
    className: 'attendance',
    label: 'Idea & Research',
    tab: 'category-builder',
    icon: Lightbulb,
    color: '#38bdf8',
    lineStart: { x: 260, y: 197 },
    lineEnd: { x: 260, y: 89 },
    desc: 'Market research, PRD specifications, and tender requirement parsing.'
  },
  {
    id: 'payroll',
    className: 'payroll',
    label: 'Design & Planning',
    tab: 'projects',
    icon: Edit3,
    color: '#818cf8',
    lineStart: { x: 314.5, y: 228.5 },
    lineEnd: { x: 408.1, y: 174.5 },
    desc: 'Hardware CAD architecture, circuit design, and BOM sourcing.'
  },
  {
    id: 'leaves',
    className: 'leaves',
    label: 'Development & AI',
    tab: 'products',
    icon: Code2,
    color: '#a78bfa',
    lineStart: { x: 314.5, y: 291.5 },
    lineEnd: { x: 408.1, y: 345.5 },
    desc: 'PCB assembly, firmware programming, AI video analytics, and web platforms.'
  },
  {
    id: 'vms',
    className: 'vms',
    label: 'Testing & QA Audits',
    tab: 'certifications-vault',
    icon: ClipboardCheck,
    color: '#34d399',
    lineStart: { x: 260, y: 323 },
    lineEnd: { x: 260, y: 431 },
    desc: 'STQC 4K camera certification, ARAI AIS-140 homologation, and stress QA.'
  },
  {
    id: 'payslip',
    className: 'payslip',
    label: 'Field Deployment',
    tab: 'oem-directory',
    icon: Rocket,
    color: '#38bdf8',
    lineStart: { x: 205.5, y: 291.5 },
    lineEnd: { x: 111.9, y: 345.5 },
    desc: 'Command center installation, OEM sourcing, and direct B2B mail execution.'
  },
  {
    id: 'onboarding',
    className: 'onboarding',
    label: 'Maintenance & SLA',
    tab: 'evaluator',
    icon: TrendingUp,
    color: '#fbbf24',
    lineStart: { x: 205.5, y: 228.5 },
    lineEnd: { x: 111.9, y: 174.5 },
    desc: 'Remote IoT telemetry monitoring, OTA updates, and 24/7 SLA maintenance.'
  }
];

export default function ProductDevFlow({ setActiveTab }) {
  const [activeNodeId, setActiveNodeId] = useState('attendance');
  const [autoPlay, setAutoPlay] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Auto-cycle through nodes every 3.2 seconds
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveNodeId(current => {
        const idx = EXACT_FLOW_NODES.findIndex(n => n.id === current);
        const nextIdx = (idx + 1) % EXACT_FLOW_NODES.length;
        return EXACT_FLOW_NODES[nextIdx].id;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const activeNode = EXACT_FLOW_NODES.find(n => n.id === activeNodeId) || EXACT_FLOW_NODES[0];
  const ActiveIcon = activeNode.icon;

  return (
    <div className="page-fade-in" style={{ padding: '1rem 0' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)', backdropFilter: 'blur(12px)' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} color="#38bdf8" /> Brihaspathi Technologies Limited
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', marginTop: '0.2rem' }}>
            Product Development Dynamic Flow & Ecosystem
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '0.2rem' }}>
            Interactive 6-node circular SVG laser animation network.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setIsAiModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px', padding: '0.5rem 0.95rem', background: 'linear-gradient(135deg, #00f2fe 0%, #3a86ff 100%)', color: '#ffffff', border: 'none', fontWeight: 800 }}
          >
            <Bot size={16} /> ChatGPT Intelligence Hub
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setAutoPlay(!autoPlay)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px', padding: '0.5rem 0.85rem', background: autoPlay ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: autoPlay ? '#38bdf8' : '#ffffff', borderColor: 'rgba(56, 189, 248, 0.4)', fontWeight: 700 }}
          >
            {autoPlay ? <Pause size={14} /> : <Play size={14} />}
            {autoPlay ? 'Auto Tour: Active' : 'Start Auto Tour'}
          </button>
        </div>
      </div>

      {/* EXACT ANIMATED FLOW SECTION FROM USER HTML MARKUP & SVG COORDINATES */}
      <div className="hrms-flow-section">
        {/* Central Pulsing Core */}
        <div className="flow-center-core" onClick={() => setIsAiModalOpen(true)}>
          <div className="core-pulse-wave" />
          <div className="core-orbit" />
          <div className="core-orbit-inner" />
          <Box size={30} color="#00f2fe" style={{ marginBottom: '0.25rem', filter: 'drop-shadow(0 0 8px #00f2fe)' }} />
          <span className="core-text">PRODUCT DEVELOPMENT</span>
        </div>
        
        {/* Connected Flow Nodes (Exact HTML structure provided by user) */}
        {EXACT_FLOW_NODES.map((node) => {
          const NodeIcon = node.icon;
          const isActive = node.id === activeNodeId;

          return (
            <div 
              key={node.id} 
              className={`flow-node ${node.className} ${isActive ? 'active' : ''}`}
              title={node.label}
              onClick={() => {
                setActiveNodeId(node.id);
                setAutoPlay(false);
              }}
            >
              <div className="node-icon">
                <NodeIcon size={16} color={isActive ? '#0f172a' : node.color} />
              </div>
              <span className="node-label">{node.label}</span>
            </div>
          );
        })}

        {/* Flow lines connections overlay (Exact SVG markup provided by user) */}
        <svg className="flow-connections-svg" viewBox="0 0 520 520">
          <defs>
            <radialGradient id="laserGrad" cx="260" cy="260" r="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#3a86ff" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#667eea" stopOpacity="0.5" />
            </radialGradient>

            <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
              <path d="M 0 1.5 L 7 5 L 0 8.5 L 2 5 z" fill="rgba(0, 242, 254, 0.85)" />
            </marker>
          </defs>

          {/* Background Static Lines with Glowing Arrowheads (All 6 Lines) */}
          {EXACT_FLOW_NODES.map((node) => {
            const isActive = node.id === activeNodeId;
            return (
              <g key={`lines-${node.id}`}>
                <line 
                  x1={node.lineStart.x} y1={node.lineStart.y} 
                  x2={node.lineEnd.x} y2={node.lineEnd.y} 
                  className="flow-line-bg" 
                  markerEnd="url(#arrow)" 
                  style={{ stroke: isActive ? node.color : undefined, strokeWidth: isActive ? 3 : 2.5 }}
                />
                
                {/* Animated Flowing Blue Laser Pulses (All 6 Lines) */}
                <line 
                  x1={node.lineStart.x} y1={node.lineStart.y} 
                  x2={node.lineEnd.x} y2={node.lineEnd.y} 
                  className="flow-line-active" 
                  stroke={isActive ? node.color : "url(#laserGrad)"}
                  style={{ opacity: isActive ? 1 : 0.45, strokeWidth: isActive ? 4.5 : 3.5 }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ACTIVE LIFECYCLE NODE DETAILS CARD */}
      <div 
        className="card" 
        style={{ 
          marginTop: '1.5rem', 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)', 
          borderColor: activeNode.color,
          boxShadow: `0 12px 35px rgba(0, 0, 0, 0.4), 0 0 20px ${activeNode.color}33`,
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
          <div style={{ background: `${activeNode.color}20`, border: `1.5px solid ${activeNode.color}`, padding: '0.85rem', borderRadius: '50%', color: activeNode.color }}>
            <ActiveIcon size={28} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge" style={{ background: `${activeNode.color}20`, borderColor: activeNode.color, color: activeNode.color, fontWeight: 800, fontSize: '11px' }}>
                Product Pillar
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Active Node</span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', marginTop: '0.2rem' }}>
              {activeNode.label}
            </h3>

            <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '0.25rem', lineHeight: '1.5' }}>
              {activeNode.desc}
            </p>
          </div>
        </div>

        {/* 1-Click Navigation CTA Button */}
        <button 
          className="btn btn-primary"
          onClick={() => setActiveTab(activeNode.tab)}
          style={{ 
            background: `linear-gradient(135deg, ${activeNode.color} 0%, #0284c7 100%)`, 
            color: '#ffffff', 
            fontWeight: 800, 
            fontSize: '13px',
            padding: '0.7rem 1.35rem',
            border: 'none',
            boxShadow: `0 8px 25px ${activeNode.color}55`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          Explore {activeNode.label} <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
