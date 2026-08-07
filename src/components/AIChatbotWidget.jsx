import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, ShieldAlert, FileText, HelpCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

const SYSTEM_KNOWLEDGE = {
  'eval': 'To evaluate products, go to "Compliance Evaluator" in the left sidebar. Select your active project (PO / Tender ID). The AI engine automatically compares candidate products against required specs and outputs ACCEPTED, REJECTED, or CONDITIONAL status with pass/fail breakdown.',
  'stqc': 'Official STQC certified camera models and download links are available under "Certifications Vault (STQC / ARAI / CMMI)" on the left sidebar. You can filter models by 2MP, 4MP, 8MP 4K resolution and download master STQC PDF certificates with 1 click.',
  'tc': 'Terms & Conditions (T&C):\n1. Technical Compliance: All products evaluated must conform to RDSO, MSRTC, or client PO specifications.\n2. Specification Waiver: Manual waivers require recorded client sign-off notes.\n3. Mandatory Certifications: Transport hardware must hold ARAI (AIS-140) TAC. Biometrics must hold STQC UIDAI certification.\n4. OEM Warranty: Minimum 36 months direct OEM warranty required for government tenders.',
  'oem': 'You can schedule video calls and generate email/WhatsApp invites under "Meeting Room & Updates" on the left sidebar, or click "Schedule OEM Meeting" on any accepted product card.',
  'po': 'To add or edit a PO / Tender ID, go to "Projects & Specs" on the left sidebar and click "+ Create New Project". You can also paste tender descriptions for auto-extraction.'
};

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'tc'
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Hello! I am Brihaspathi Assistant. How can I help you navigate the software or review Terms & Conditions (T&C)?'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (userQuery) => {
    const textToSend = userQuery || inputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userQuery) setInputText('');

    // Process AI response
    setTimeout(() => {
      let botResponse = "I can help with product spec compliance, STQC/ARAI certificate downloads, OEM meeting scheduling, or Terms & Conditions. Try clicking one of the quick topics below!";
      const q = textToSend.toLowerCase();

      if (q.includes('evaluat') || q.includes('compliance') || q.includes('compare')) {
        botResponse = SYSTEM_KNOWLEDGE.eval;
      } else if (q.includes('stqc') || q.includes('arai') || q.includes('certificat') || q.includes('download')) {
        botResponse = SYSTEM_KNOWLEDGE.stqc;
      } else if (q.includes('t&c') || q.includes('terms') || q.includes('condition') || q.includes('policy')) {
        botResponse = SYSTEM_KNOWLEDGE.tc;
      } else if (q.includes('oem') || q.includes('meet') || q.includes('schedule') || q.includes('contact')) {
        botResponse = SYSTEM_KNOWLEDGE.oem;
      } else if (q.includes('po') || q.includes('tender') || q.includes('project')) {
        botResponse = SYSTEM_KNOWLEDGE.po;
      }

      const botMsg = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse
      };

      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          className="btn btn-primary"
          style={{
            borderRadius: '9999px',
            padding: '0.75rem 1.25rem',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '13px'
          }}
          onClick={() => setIsOpen(true)}
        >
          <Bot size={20} color="#ffffff" />
          <span style={{ fontWeight: 700 }}>AI Help & T&C</span>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '10px' }}>24/7</span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div style={{
          width: '380px',
          height: '520px',
          background: '#121826',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            padding: '0.85rem 1rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ padding: '0.4rem', background: '#6366f1', borderRadius: '8px', display: 'flex' }}>
                <Bot size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>Brihaspathi AI Assistant</div>
                <div style={{ fontSize: '11px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} /> Online & ready to help
                </div>
              </div>
            </div>

            <button 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs (Chat vs T&C) */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'rgba(11, 15, 25, 0.6)' }}>
            <button
              style={{
                flex: 1, padding: '0.55rem', fontSize: '12px', fontWeight: 700, border: 'none', background: 'transparent',
                color: activeTab === 'chat' ? '#818cf8' : 'var(--text-muted)',
                borderBottom: activeTab === 'chat' ? '2px solid #818cf8' : '2px solid transparent',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('chat')}
            >
              💬 AI Assistant Chat
            </button>
            <button
              style={{
                flex: 1, padding: '0.55rem', fontSize: '12px', fontWeight: 700, border: 'none', background: 'transparent',
                color: activeTab === 'tc' ? '#818cf8' : 'var(--text-muted)',
                borderBottom: activeTab === 'tc' ? '2px solid #818cf8' : '2px solid transparent',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('tc')}
            >
              📜 Terms & Conditions (T&C)
            </button>
          </div>

          {/* Tab Content 1: AI Chat */}
          {activeTab === 'chat' && (
            <>
              {/* Message Feed */}
              <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: msg.sender === 'user' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(255, 255, 255, 0.06)',
                      color: '#ffffff',
                      padding: '0.65rem 0.85rem',
                      borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      fontSize: '12px',
                      lineHeight: 1.45,
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Quick Action Chips */}
              <div style={{ padding: '0.4rem 0.75rem', background: 'rgba(11, 15, 25, 0.8)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '10.5px', padding: '0.2rem 0.45rem', whiteSpace: 'nowrap' }}
                  onClick={() => handleSend('How do I evaluate product compliance?')}
                >
                  ❓ Product Evaluation
                </button>

                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '10.5px', padding: '0.2rem 0.45rem', whiteSpace: 'nowrap' }}
                  onClick={() => handleSend('Where are STQC & ARAI certificate downloads?')}
                >
                  📜 STQC Certificates
                </button>

                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '10.5px', padding: '0.2rem 0.45rem', whiteSpace: 'nowrap' }}
                  onClick={() => handleSend('What are the company Terms & Conditions (T&C)?')}
                >
                  📋 Terms & Conditions
                </button>
              </div>

              {/* Input Bar */}
              <div style={{ padding: '0.65rem 0.85rem', borderTop: '1px solid var(--border-color)', background: 'rgba(11, 15, 25, 0.95)', display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ask any question about software or T&C..."
                  style={{ fontSize: '12px', padding: '0.45rem 0.65rem' }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleSend()}
                >
                  <Send size={13} />
                </button>
              </div>
            </>
          )}

          {/* Tab Content 2: Official Terms & Conditions (T&C) */}
          {activeTab === 'tc' && (
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', fontSize: '12px', lineHeight: 1.5, color: 'var(--text-main)' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileText size={15} /> Official Procurement Terms & Conditions (T&C)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: '#ffffff' }}>1. Product Specification Compliance Audit Policy</strong>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '11.5px' }}>
                    All candidate products registered under Brihaspathi ProcureSpec AI are evaluated strictly against target specifications derived from official RDSO, MSRTC, or tender criteria.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: '#ffffff' }}>2. Technical Specification Waiver & Deviation Policy</strong>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '11.5px' }}>
                    Manual specification waivers may be granted for similar equivalent models only when supported by recorded client technical approval notes.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: '#ffffff' }}>3. Mandatory STQC & ARAI Security Certifications</strong>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '11.5px' }}>
                    Transit CCTV hardware must possess valid ARAI (AIS-140 Automotive) TAC certificates. Biometric terminals must hold official MeiTY STQC UIDAI certification.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: '#ffffff' }}>4. OEM Warranty & Commercial Agreement</strong>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '11.5px' }}>
                    OEM suppliers must provide a minimum 36 months direct warranty for Indian Railways and transport depot deployments.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '1rem', padding: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', color: '#34d399', fontSize: '11px' }}>
                ✓ Verified & Compliant with Brihaspathi Technologies Corporate Governance (2026)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
