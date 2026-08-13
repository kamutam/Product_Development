import React, { useState } from 'react';
import { 
  LayoutDashboard, CheckSquare, FolderGit2, Layers, Columns3, PlusCircle, ShieldCheck, Award, Video, LogOut, UserCheck, SearchCheck, Building2, Sparkles, FileText, Mail, Search
} from 'lucide-react';
import BrihaspathiLogo from './BrihaspathiLogo';

export default function Sidebar({ 
  activeTab, setActiveTab, projects, selectedProjectId, setSelectedProjectId, user, onLogout, 
  requirementsCount = 0, emailCount = 0, onOpenGlobalSearch
}) {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const activeProject = projects.find(p => p.id === selectedProjectId);

  return (
    <aside className="sidebar">
      {/* Pinned Sticky Header */}
      <div className="sidebar-header-sticky">
        <div className="sidebar-brand" onClick={() => setActiveTab('dashboard')}>
          <BrihaspathiLogo height={44} showTagline={false} darkText={false} />
        </div>
      </div>

      {/* Scrollable Inner Body */}
      <div className="sidebar-body-scrollable">
        {/* Global Search Quick Launch Button */}
        {onOpenGlobalSearch && (
          <button 
            className="btn btn-secondary btn-sm"
            style={{ 
              width: '100%', 
              marginBottom: '0.85rem', 
              justifyContent: 'flex-start', 
              fontSize: '11.5px', 
              fontWeight: 700, 
              background: 'rgba(255,255,255,0.06)', 
              color: '#38bdf8', 
              borderColor: 'rgba(56, 189, 248, 0.3)' 
            }}
            onClick={onOpenGlobalSearch}
          >
            <Search size={14} /> Quick Search (Ctrl+K)...
          </button>
        )}

        {/* Active Project Quick Switcher Box */}
        <div className="sidebar-project-box" style={{ position: 'relative' }}>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} color="#38bdf8" /> Active Project:
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{
              width: '100%',
              justify: 'space-between',
              fontSize: '11.5px',
              fontWeight: 800,
              background: '#1e293b',
              color: '#ffffff',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              padding: '0.45rem 0.5rem'
            }}
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
              📁 {activeProject?.name || 'Select Project'}
            </span>
            <span style={{ fontSize: '10px', marginLeft: '4px', color: '#38bdf8' }}>
              {showProjectDropdown ? '▲' : '▼'}
            </span>
          </button>

          {showProjectDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                width: '100%',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                boxShadow: '0 20px 45px rgba(0,0,0,0.5)',
                zIndex: 999999,
                padding: '0.45rem',
                animation: 'fadeInUp 0.15s ease-out'
              }}
            >
              <div style={{ position: 'relative', marginBottom: '0.4rem' }}>
                <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                <input
                  type="text"
                  placeholder="Search project..."
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.35rem 0.5rem 0.35rem 1.75rem',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    background: '#1e293b',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', scrollbarWidth: 'thin' }}>
                {projects
                  .filter(p => p.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) || p.client.toLowerCase().includes(projectSearchQuery.toLowerCase()))
                  .map(p => {
                    const isSelected = p.id === selectedProjectId;
                    return (
                      <div
                        key={p.id}
                        style={{
                          padding: '0.4rem 0.5rem',
                          borderRadius: '5px',
                          fontSize: '11px',
                          fontWeight: isSelected ? 800 : 600,
                          background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                          color: isSelected ? '#38bdf8' : '#ffffff',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setShowProjectDropdown(false);
                          setProjectSearchQuery('');
                        }}
                      >
                        <div>📁 {p.name}</div>
                        <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>Client: {p.client}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {activeProject && (
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.4rem', lineHeight: 1.35 }}>
              PO/Tender: <strong style={{ color: '#ffffff' }}>{activeProject.poNumber || activeProject.code || 'N/A'}</strong>
              <div style={{ marginTop: '0.3rem' }}>
                {activeProject.status === 'COMPLETED' ? (
                  <span className="badge badge-accept" style={{ fontSize: '10px' }}>
                    CLOSED AS COMPLETE
                  </span>
                ) : (
                  <span className="badge badge-conditional" style={{ fontSize: '10px', background: 'rgba(217, 119, 6, 0.35)', color: '#fef08a', border: '1px solid rgba(245, 158, 11, 0.6)', fontWeight: 800 }}>
                    IN PROGRESS
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Left Vertical Navigation Links */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">MAIN NAVIGATION</div>

          {/* 1. Dashboard */}
          <button
            className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          {/* 2. Requirements Pipeline */}
          <button
            className={`sidebar-link ${activeTab === 'requirements' ? 'active' : ''}`}
            onClick={() => setActiveTab('requirements')}
          >
            <FileText size={18} color={activeTab === 'requirements' ? '#ffffff' : '#fbbf24'} />
            <span style={{ flex: 1 }}>Requirements Pipeline</span>
            {requirementsCount > 0 && (
              <span className="badge badge-conditional" style={{ fontSize: '9.5px', padding: '0.05rem 0.35rem', borderRadius: '10px' }}>
                {requirementsCount}
              </span>
            )}
          </button>

          {/* 3. Product Catalog */}
          <button
            className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Layers size={18} color={activeTab === 'products' ? '#ffffff' : '#38bdf8'} />
            <span>Product Catalog</span>
          </button>

          {/* 4. OEM Companies (NPD Directory) */}
          <button
            className={`sidebar-link ${activeTab === 'oem-directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('oem-directory')}
          >
            <Building2 size={18} color={activeTab === 'oem-directory' ? '#ffffff' : '#818cf8'} />
            <span>OEM Partners Directory</span>
          </button>

          {/* 5. Compliance Evaluator */}
          <button
            className={`sidebar-link ${activeTab === 'evaluator' ? 'active' : ''}`}
            onClick={() => setActiveTab('evaluator')}
          >
            <CheckSquare size={18} color={activeTab === 'evaluator' ? '#ffffff' : '#34d399'} />
            <span>Compliance Evaluator</span>
          </button>

          {/* 6. Certifications Vault */}
          <button
            className={`sidebar-link ${activeTab === 'certifications-vault' ? 'active' : ''}`}
            onClick={() => setActiveTab('certifications-vault')}
          >
            <Award size={18} color={activeTab === 'certifications-vault' ? '#ffffff' : '#fde047'} />
            <span>Certifications Vault (STQC/ARAI)</span>
          </button>

          {/* 7. Compare Matrix */}
          <button
            className={`sidebar-link ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            <Columns3 size={18} />
            <span>Compare Matrix</span>
          </button>

          {/* 8. OEM Email History */}
          <button
            className={`sidebar-link ${activeTab === 'email-history' ? 'active' : ''}`}
            onClick={() => setActiveTab('email-history')}
          >
            <Mail size={18} color={activeTab === 'email-history' ? '#ffffff' : '#f472b6'} />
            <span style={{ flex: 1 }}>OEM Email History</span>
            {emailCount > 0 && (
              <span className="badge badge-accept" style={{ fontSize: '9.5px', padding: '0.05rem 0.35rem', borderRadius: '10px' }}>
                {emailCount}
              </span>
            )}
          </button>

          {/* BOTTOM ITEMS: Projects, Meeting Room & Inspection Summary */}
          <div className="sidebar-section-label" style={{ marginTop: '1.1rem' }}>PROJECTS & AUDIT TRAIL</div>

          {/* 9. Projects & Specs */}
          <button
            className={`sidebar-link ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FolderGit2 size={18} color={activeTab === 'projects' ? '#ffffff' : '#f472b6'} />
            <span>Projects & Specs</span>
          </button>

          {/* 10. Meeting Room & Updates */}
          <button
            className={`sidebar-link ${activeTab === 'meeting-room' ? 'active' : ''}`}
            onClick={() => setActiveTab('meeting-room')}
          >
            <Video size={18} color={activeTab === 'meeting-room' ? '#ffffff' : '#818cf8'} />
            <span>Meeting Room & Updates</span>
          </button>

          {/* 11. Inspection Summary */}
          <button
            className={`sidebar-link ${activeTab === 'inspection-summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('inspection-summary')}
          >
            <SearchCheck size={18} color={activeTab === 'inspection-summary' ? '#ffffff' : '#34d399'} />
            <span>Inspection Summary</span>
          </button>

          <div className="sidebar-section-label" style={{ marginTop: '1.1rem' }}>CONFIGURATION</div>

          <button
            className={`sidebar-link ${activeTab === 'category-builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('category-builder')}
          >
            <PlusCircle size={18} />
            <span>Add Custom Category</span>
          </button>
        </nav>

        {/* User Profile & Sign Out Button */}
        <div className="sidebar-footer">
          {user && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.6rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '0.75rem'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <UserCheck size={13} color="#34d399" /> {user.name || 'Brihaspathi Lead'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#38bdf8', marginTop: '0.1rem', fontWeight: 600 }}>
                Role: {user.role || 'Product Development Team Lead'}
              </div>
            </div>
          )}

          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', fontSize: '11.5px', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.1)' }}
            onClick={onLogout}
          >
            <LogOut size={13} /> Sign Out Portal
          </button>

          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.65rem', textAlign: 'center', fontWeight: 600 }}>
            Brihaspathi ProcureSpec AI &bull; v2.5
          </div>
        </div>
      </div>
    </aside>
  );
}
