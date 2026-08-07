import React from 'react';
import { 
  LayoutDashboard, CheckSquare, FolderGit2, Layers, Columns3, PlusCircle, ShieldCheck, Award, Video, LogOut, UserCheck, SearchCheck, Building2
} from 'lucide-react';
import BrihaspathiLogo from './BrihaspathiLogo';

export default function Sidebar({ activeTab, setActiveTab, projects, selectedProjectId, setSelectedProjectId, user, onLogout }) {
  const activeProject = projects.find(p => p.id === selectedProjectId);

  return (
    <aside className="sidebar">
      {/* Top Company Brand Header */}
      <div className="sidebar-brand" onClick={() => setActiveTab('dashboard')}>
        <BrihaspathiLogo height={44} showTagline={true} />
      </div>

      {/* Active Project Quick Switcher Box */}
      <div className="sidebar-project-box">
        <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <ShieldCheck size={13} /> Active Project:
        </div>
        <select
          className="form-select"
          style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem 0.65rem' }}
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {activeProject && (
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.35 }}>
            PO/Tender: <strong>{activeProject.poNumber || activeProject.code || 'N/A'}</strong>
            <div style={{ marginTop: '0.3rem' }}>
              {activeProject.status === 'COMPLETED' ? (
                <span className="badge badge-accept" style={{ fontSize: '10px' }}>
                  CLOSED AS COMPLETE
                </span>
              ) : (
                <span className="badge badge-conditional" style={{ fontSize: '10px' }}>
                  IN PROGRESS
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Left Vertical Navigation Links - Custom Ordered */}
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
          <Layers size={18} color="#38bdf8" />
          <span>Product Development</span>
        </button>

        {/* 3. OEM Companies (NPD Directory) */}
        <button
          className={`sidebar-link ${activeTab === 'oem-directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('oem-directory')}
        >
          <Building2 size={18} color="#818cf8" />
          <span>OEM Companies (NPD Directory)</span>
        </button>

        {/* 4. Compliance Evaluator */}
        <button
          className={`sidebar-link ${activeTab === 'evaluator' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluator')}
        >
          <CheckSquare size={18} color="#10b981" />
          <span>Compliance Evaluator</span>
        </button>

        {/* 5. Certifications Vault */}
        <button
          className={`sidebar-link ${activeTab === 'certifications-vault' ? 'active' : ''}`}
          onClick={() => setActiveTab('certifications-vault')}
        >
          <Award size={18} color="#fbbf24" />
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
          <FolderGit2 size={18} color="#f472b6" />
          <span>Projects & Specs</span>
        </button>

        {/* 8. Meeting Room & Updates */}
        <button
          className={`sidebar-link ${activeTab === 'meeting-room' ? 'active' : ''}`}
          onClick={() => setActiveTab('meeting-room')}
        >
          <Video size={18} color="#818cf8" />
          <span>Meeting Room & Updates</span>
        </button>

        {/* 9. Inspection Summary (At the very bottom!) */}
        <button
          className={`sidebar-link ${activeTab === 'inspection-summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('inspection-summary')}
        >
          <SearchCheck size={18} color="#34d399" />
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
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '0.6rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '0.75rem'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <UserCheck size={13} color="#34d399" /> {user.name || 'Brihaspathi Lead'}
            </div>
            <div style={{ fontSize: '10.5px', color: '#818cf8', marginTop: '0.1rem' }}>
              Role: {user.role || 'Product Development Team Lead'}
            </div>
          </div>
        )}

        <button
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', fontSize: '11.5px', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}
          onClick={onLogout}
        >
          <LogOut size={13} /> Sign Out Portal
        </button>

        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.65rem', textAlign: 'center' }}>
          Brihaspathi ProcureSpec AI &bull; v2.4
        </div>
      </div>
    </aside>
  );
}
