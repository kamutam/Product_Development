import React from 'react';
import { 
  LayoutDashboard, CheckSquare, FolderGit2, Layers, Columns3, PlusCircle, ShieldCheck, Award, Video, LogOut, UserCheck, SearchCheck, Building2
} from 'lucide-react';
import BrihaspathiLogo from './BrihaspathiLogo';

export default function Sidebar({ activeTab, setActiveTab, projects, selectedProjectId, setSelectedProjectId, user, onLogout }) {
  const activeProject = projects.find(p => p.id === selectedProjectId);

  return (
    <aside className="sidebar">
      {/* Pinned Sticky Header - Company Logo stays 100% in the exact same place while scrolling */}
      <div className="sidebar-header-sticky">
        <div className="sidebar-brand" onClick={() => setActiveTab('dashboard')}>
          <BrihaspathiLogo height={44} showTagline={true} darkText={false} />
        </div>
      </div>

      {/* Scrollable Inner Body for Navigation and Controls */}
      <div className="sidebar-body-scrollable">
        {/* Active Project Quick Switcher Box */}
        <div className="sidebar-project-box">
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} color="#38bdf8" /> Active Project:
          </div>
          <select
            className="form-select"
            style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem 0.65rem', background: '#1e293b', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.15)' }}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {activeProject && (
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.4rem', lineHeight: 1.35 }}>
              PO/Tender: <strong style={{ color: '#ffffff' }}>{activeProject.poNumber || activeProject.code || 'N/A'}</strong>
              <div style={{ marginTop: '0.3rem' }}>
                {activeProject.status === 'COMPLETED' ? (
                  <span className="badge badge-accept" style={{ fontSize: '10px' }}>
                    CLOSED AS COMPLETE
                  </span>
                ) : (
                  <span className="badge badge-conditional" style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
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

          {/* 2. Product Development */}
          <button
            className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Layers size={18} color={activeTab === 'products' ? '#ffffff' : '#38bdf8'} />
            <span>Product Development</span>
          </button>

          {/* 3. OEM Companies (NPD Directory) */}
          <button
            className={`sidebar-link ${activeTab === 'oem-directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('oem-directory')}
          >
            <Building2 size={18} color={activeTab === 'oem-directory' ? '#ffffff' : '#818cf8'} />
            <span>OEM Companies (NPD Directory)</span>
          </button>

          {/* 4. Compliance Evaluator */}
          <button
            className={`sidebar-link ${activeTab === 'evaluator' ? 'active' : ''}`}
            onClick={() => setActiveTab('evaluator')}
          >
            <CheckSquare size={18} color={activeTab === 'evaluator' ? '#ffffff' : '#34d399'} />
            <span>Compliance Evaluator</span>
          </button>

          {/* 5. Certifications Vault */}
          <button
            className={`sidebar-link ${activeTab === 'certifications-vault' ? 'active' : ''}`}
            onClick={() => setActiveTab('certifications-vault')}
          >
            <Award size={18} color={activeTab === 'certifications-vault' ? '#ffffff' : '#fbbf24'} />
            <span>Certifications Vault (STQC / ARAI / CMMI)</span>
          </button>

          {/* 6. Compare Matrix */}
          <button
            className={`sidebar-link ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            <Columns3 size={18} />
            <span>Compare Matrix</span>
          </button>

          {/* BOTTOM ITEMS: Projects, Meeting Room & Inspection Summary */}
          <div className="sidebar-section-label" style={{ marginTop: '1.1rem' }}>PROJECTS & AUDIT TRAIL</div>

          {/* 7. Projects & Specs */}
          <button
            className={`sidebar-link ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FolderGit2 size={18} color={activeTab === 'projects' ? '#ffffff' : '#f472b6'} />
            <span>Projects & Specs</span>
          </button>

          {/* 8. Meeting Room & Updates */}
          <button
            className={`sidebar-link ${activeTab === 'meeting-room' ? 'active' : ''}`}
            onClick={() => setActiveTab('meeting-room')}
          >
            <Video size={18} color={activeTab === 'meeting-room' ? '#ffffff' : '#818cf8'} />
            <span>Meeting Room & Updates</span>
          </button>

          {/* 9. Inspection Summary */}
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
            Brihaspathi ProcureSpec AI &bull; v2.4
          </div>
        </div>
      </div>
    </aside>
  );
}
