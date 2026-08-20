import React, { useState } from 'react';
import { 
  LayoutDashboard, CheckSquare, FolderGit2, Layers, Columns3, PlusCircle, ShieldCheck, Award, Video, LogOut, UserCheck, SearchCheck, Building2, Sparkles, FileText, Mail, Search, Bell, LineChart, Calculator, Bot, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import BrihaspathiLogo from './BrihaspathiLogo';

export default function Sidebar({ 
  projects, selectedProjectId, setSelectedProjectId, user, onLogout, 
  requirementsCount = 0, emailCount = 0, onOpenGlobalSearch
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/')[1] || 'analytics';

  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <aside className="sidebar">
      {/* Pinned Sticky Header */}
      <div className="sidebar-header-sticky">
        <div className="sidebar-brand" onClick={() => navigate('/analytics')}>
          <BrihaspathiLogo height={42} showTagline={false} darkText={false} />
        </div>
      </div>

      {/* Scrollable Inner Body */}
      <div className="sidebar-body-scrollable">

        {/* Active Project Quick Switcher Box */}
        <div className="sidebar-project-box" style={{ position: 'relative' }}>
          <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="#38bdf8" /> Active Project
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{
              width: '100%',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 700,
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#ffffff',
              borderColor: 'rgba(148, 163, 184, 0.25)',
              padding: '0.5rem 0.65rem'
            }}
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
              📁 {activeProject?.name || 'Select Project'}
            </span>
            <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center' }}>
              {showProjectDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>

          {showProjectDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '100%',
                background: 'rgba(15, 23, 42, 0.96)',
                backdropFilter: 'blur(28px)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '10px',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85)',
                zIndex: 999999,
                padding: '0.5rem',
                animation: 'fadeInUp 0.15s ease-out'
              }}
            >
              <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                <input
                  type="text"
                  placeholder="Search project..."
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.5rem 0.4rem 1.85rem',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px', scrollbarWidth: 'thin' }}>
                {projects
                  .filter(p => p.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) || (p.client && p.client.toLowerCase().includes(projectSearchQuery.toLowerCase())))
                  .map(p => {
                    const isSelected = p.id === (activeProject?.id);
                    return (
                      <div
                        key={p.id}
                        style={{
                          padding: '0.45rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: isSelected ? 800 : 600,
                          background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                          color: isSelected ? '#38bdf8' : '#e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setShowProjectDropdown(false);
                          setProjectSearchQuery('');
                        }}
                      >
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📁 {p.name}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>Client: {p.client || 'Enterprise'}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {activeProject && (
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.45rem', lineHeight: 1.35 }}>
              PO/Tender: <strong style={{ color: '#ffffff' }}>{activeProject.poNumber || activeProject.code || 'PO-2026-ACTIVE'}</strong>
              <div style={{ marginTop: '0.35rem' }}>
                {activeProject.status === 'COMPLETED' ? (
                  <span className="badge badge-accept" style={{ fontSize: '9.5px', padding: '0.15rem 0.5rem' }}>
                    COMPLETED
                  </span>
                ) : (
                  <span className="badge badge-conditional" style={{ fontSize: '9.5px', padding: '0.15rem 0.5rem' }}>
                    IN PROGRESS
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Left Vertical Navigation Links */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">INTELLIGENCE & AI</div>

          <button
            className={`sidebar-link ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => navigate('/analytics')}
          >
            <LineChart size={18} color={activeTab === 'analytics' ? '#ffffff' : '#38bdf8'} />
            <span>Analytics Dashboard</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'solutions-showcase' ? 'active' : ''}`}
            onClick={() => navigate('/solutions-showcase')}
          >
            <Sparkles size={18} color={activeTab === 'solutions-showcase' ? '#ffffff' : '#a78bfa'} />
            <span>Solutions Showcase</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'tender-agent' ? 'active' : ''}`}
            onClick={() => navigate('/tender-agent')}
          >
            <Bot size={18} color={activeTab === 'tender-agent' ? '#ffffff' : '#00f2fe'} />
            <span>Tender Scope & Specs</span>
          </button>

          <div className="sidebar-section-label">CATALOG & PROCUREMENT</div>

          <button
            className={`sidebar-link ${activeTab === 'bom' ? 'active' : ''}`}
            onClick={() => navigate('/bom')}
          >
            <Calculator size={18} color={activeTab === 'bom' ? '#ffffff' : '#38bdf8'} />
            <span>BOM Estimator</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => navigate('/products')}
          >
            <Layers size={18} color={activeTab === 'products' ? '#ffffff' : '#38bdf8'} />
            <span style={{ flex: 1 }}>Product Catalog</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboard size={18} color={activeTab === 'dashboard' ? '#ffffff' : '#94a3b8'} />
            <span>Product Master DB</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'oem-directory' ? 'active' : ''}`}
            onClick={() => navigate('/oem-directory')}
          >
            <Building2 size={18} color={activeTab === 'oem-directory' ? '#ffffff' : '#818cf8'} />
            <span>OEM Partners Directory</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => navigate('/notifications')}
          >
            <Bell size={18} color={activeTab === 'notifications' ? '#ffffff' : '#f59e0b'} />
            <span style={{ flex: 1 }}>OEM Notifications</span>
            <span className="badge badge-conditional" style={{ fontSize: '9px', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>
              LIVE
            </span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'requirements' ? 'active' : ''}`}
            onClick={() => navigate('/requirements')}
          >
            <FileText size={18} color={activeTab === 'requirements' ? '#ffffff' : '#fbbf24'} />
            <span style={{ flex: 1 }}>Requirements Pipeline</span>
            {requirementsCount > 0 && (
              <span className="badge badge-conditional" style={{ fontSize: '9px', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>
                {requirementsCount}
              </span>
            )}
          </button>

          <div className="sidebar-section-label">COMPLIANCE & SPECS</div>

          <button
            className={`sidebar-link ${activeTab === 'evaluator' ? 'active' : ''}`}
            onClick={() => navigate('/evaluator')}
          >
            <CheckSquare size={18} color={activeTab === 'evaluator' ? '#ffffff' : '#34d399'} />
            <span>Compliance Evaluator</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'certifications-vault' ? 'active' : ''}`}
            onClick={() => navigate('/certifications-vault')}
          >
            <Award size={18} color={activeTab === 'certifications-vault' ? '#ffffff' : '#fde047'} />
            <span>Certifications Vault</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => navigate('/comparison')}
          >
            <Columns3 size={18} color={activeTab === 'comparison' ? '#ffffff' : '#94a3b8'} />
            <span>Compare Matrix</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'email-history' ? 'active' : ''}`}
            onClick={() => navigate('/email-history')}
          >
            <Mail size={18} color={activeTab === 'email-history' ? '#ffffff' : '#f472b6'} />
            <span style={{ flex: 1 }}>OEM Email History</span>
            {emailCount > 0 && (
              <span className="badge badge-accept" style={{ fontSize: '9px', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>
                {emailCount}
              </span>
            )}
          </button>

          <div className="sidebar-section-label">PROJECTS & AUDIT</div>

          <button
            className={`sidebar-link ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => navigate('/projects')}
          >
            <FolderGit2 size={18} color={activeTab === 'projects' ? '#ffffff' : '#f472b6'} />
            <span>Projects & Specs</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'meeting-room' ? 'active' : ''}`}
            onClick={() => navigate('/meeting-room')}
          >
            <Video size={18} color={activeTab === 'meeting-room' ? '#ffffff' : '#818cf8'} />
            <span>Meeting Room & Updates</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'inspection-summary' ? 'active' : ''}`}
            onClick={() => navigate('/inspection-summary')}
          >
            <SearchCheck size={18} color={activeTab === 'inspection-summary' ? '#ffffff' : '#34d399'} />
            <span>Inspection Summary</span>
          </button>

          <div className="sidebar-section-label">CONFIGURATION</div>

          <button
            className={`sidebar-link ${activeTab === 'category-builder' ? 'active' : ''}`}
            onClick={() => navigate('/category-builder')}
          >
            <PlusCircle size={18} color={activeTab === 'category-builder' ? '#ffffff' : '#94a3b8'} />
            <span>Add Custom Category</span>
          </button>
        </nav>

        {/* User Profile & Sign Out Button */}
        <div className="sidebar-footer">
          {user && (
            <div style={{
              background: 'rgba(30, 41, 59, 0.7)',
              padding: '0.6rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              marginBottom: '0.75rem'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={14} color="#34d399" /> {user.name || 'Brihaspathi Lead'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#38bdf8', marginTop: '0.15rem', fontWeight: 600 }}>
                Role: {user.role || 'Product Development Team Lead'}
              </div>
            </div>
          )}

          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', fontSize: '11.5px', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.35)', background: 'rgba(244, 63, 94, 0.12)' }}
            onClick={onLogout}
          >
            <LogOut size={13} /> Sign Out Portal
          </button>

          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.65rem', textAlign: 'center', fontWeight: 600 }}>
            Brihaspathi ProcureSpec AI &bull; v3.0 NextGen
          </div>
        </div>
      </div>
    </aside>
  );
}
