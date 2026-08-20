import React, { useState } from 'react';
import { 
  Shield, Cpu, Fingerprint, Video, Sun, Bot, Zap, ArrowRight, X, Copy, CheckCircle2, Sparkles, Wand2, Loader2, Play
} from 'lucide-react';
import { generateClientPitch } from '../utils/aiService';

const SOLUTIONS = [
  {
    id: 'surveillance',
    title: 'Advanced Surveillance & Security',
    icon: Video,
    color: '#3b82f6', // blue-500
    description: 'End-to-end surveillance ecosystems for cities, enterprises, and critical infrastructure. Real-time situational awareness.',
    features: ['Smart Monitoring', 'Thermal Detection', 'Access Control', 'Secure Architecture']
  },
  {
    id: 'ai-analytics',
    title: 'AI Video Analytics',
    icon: Cpu,
    color: '#8b5cf6', // violet-500
    description: 'Transform raw video feeds into actionable intelligence with Face Recognition, ANPR, and intrusion detection.',
    features: ['Face Recognition', 'ANPR', 'Intrusion Alert', 'Crowd Analytics']
  },
  {
    id: 'biometrics',
    title: 'Biometric & Identity Systems',
    icon: Fingerprint,
    color: '#10b981', // emerald-500
    description: 'Secure, scalable biometric platforms integrated with Aadhaar for contactless attendance and access control.',
    features: ['Facial Recognition', 'Fingerprint', 'Aadhaar Auth', 'Smart Gates']
  },
  {
    id: 'smart-pole',
    title: 'Smart Pole & Urban IoT',
    icon: Zap,
    color: '#f59e0b', // amber-500
    description: 'Integrated urban infrastructure with AI-CCTV, AQI sensors, Wi-Fi APs, and EV Chargers for smart cities.',
    features: ['AQI Sensors', 'EV Chargers', 'Public Wi-Fi', 'SOS Audio/Video']
  },
  {
    id: 'solar',
    title: 'Renewable Solar Energy',
    icon: Sun,
    color: '#eab308', // yellow-500
    description: 'Commercial rooftop solar PV systems, high-efficiency modules, and net-metering grid integrations.',
    features: ['Bifacial N-Type', 'String Inverters', 'Net Metering', 'BIS Certified']
  },
  {
    id: 'robotics',
    title: 'Robotics & Autonomous Service',
    icon: Bot,
    color: '#ec4899', // pink-500
    description: 'Autonomous cleaning, delivery, and disinfection robots powered by AI and LiDAR SLAM navigation.',
    features: ['LiDAR SLAM', 'Auto-Recharge', 'Disinfection', 'Industrial Sweeping']
  }
];

export default function SolutionsShowcase() {
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [clientName, setClientName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [copied, setCopied] = useState(false);

  const handleOpenPitchGenerator = (solution) => {
    setSelectedSolution(solution);
    setClientName('');
    setGeneratedPitch('');
    setPitchModalOpen(true);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    
    setIsGenerating(true);
    try {
      const pitch = await generateClientPitch(selectedSolution, clientName);
      setGeneratedPitch(pitch);
    } catch (err) {
      console.error(err);
      setGeneratedPitch("Failed to generate pitch. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Hero Header mimicking Website */}
      <div className="card" style={{ 
        textAlign: 'center', 
        padding: '3rem 2rem', 
        background: 'linear-gradient(135deg, rgba(7, 81, 138, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(7, 81, 138, 0.3)',
        boxShadow: '0 15px 50px rgba(0,0,0,0.2)'
      }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '0.4rem 1rem', 
          background: 'rgba(56, 189, 248, 0.1)', 
          color: '#38bdf8', 
          borderRadius: '50px',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          Client Presentation Mode
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ffffff' }}>
          Technology That Protects, Powers & Transforms<span style={{ color: '#38bdf8' }}>.</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          We build and manage large-scale surveillance networks, renewable energy infrastructure, and enterprise platforms for governments, defence forces, banks, and Fortune-500 enterprises across India.
        </p>
      </div>

      {/* Solutions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {SOLUTIONS.map(solution => (
          <div key={solution.id} className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              background: 'var(--bg-card)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              borderTop: `3px solid ${solution.color}`,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = `0 20px 50px ${solution.color}30, 0 0 15px ${solution.color}15`;
              e.currentTarget.style.borderColor = solution.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.borderTop = `3px solid ${solution.color}`;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ 
                padding: '0.8rem', 
                background: `linear-gradient(135deg, ${solution.color}25 0%, transparent 100%)`, 
                borderRadius: '12px',
                color: solution.color,
                border: `1px solid ${solution.color}40`
              }}>
                <solution.icon size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{solution.title}</h3>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5, flex: 1 }}>
              {solution.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              {solution.features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '11px', color: '#cbd5e1' }}>
                  <CheckCircle2 size={12} color={solution.color} /> {feature}
                </div>
              ))}
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', background: `linear-gradient(135deg, ${solution.color}dd, ${solution.color})`, border: 'none', boxShadow: `0 5px 15px ${solution.color}40` }}
              onClick={(e) => { e.stopPropagation(); handleOpenPitchGenerator(solution); }}
            >
              <Wand2 size={15} color="#fff" /> <span style={{ color: '#fff', fontWeight: 800 }}>Generate AI Pitch</span>
            </button>
          </div>
        ))}
      </div>

      {/* AI Pitch Generator Modal */}
      {pitchModalOpen && selectedSolution && (
        <div className="modal-overlay" onClick={() => setPitchModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', padding: '2rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={22} color={selectedSolution.color} />
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>AI Pitch Generator</h2>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ padding: '0.4rem' }} onClick={() => setPitchModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Generate a highly persuasive, customized sales proposal for <strong>{selectedSolution.title}</strong> to present to your client.
            </p>

            {!generatedPitch ? (
              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label>Target Client / Organization Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., State Transport Corporation, Acme Corp..."
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    style={{ fontSize: '14px', padding: '0.75rem' }}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={isGenerating || !clientName}
                  style={{ padding: '0.75rem', fontSize: '14px', marginTop: '0.5rem', background: selectedSolution.color }}
                >
                  {isGenerating ? (
                    <><Loader2 size={16} className="animate-spin" /> Generating Proposal...</>
                  ) : (
                    <><Wand2 size={16} /> Create Custom Pitch</>
                  )}
                </button>
              </form>
            ) : (
              <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                <div style={{ 
                  background: 'rgba(15, 23, 42, 0.5)', 
                  padding: '1.5rem', 
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {generatedPitch}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button className="btn btn-secondary" onClick={() => setGeneratedPitch('')}>
                    Start Over
                  </button>
                  <button className="btn btn-primary" onClick={copyToClipboard} style={{ background: selectedSolution.color }}>
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />} 
                    {copied ? 'Copied to Clipboard' : 'Copy Pitch'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
