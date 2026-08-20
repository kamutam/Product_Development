import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderGit2, Layers, Columns3, PlusCircle, RefreshCw } from 'lucide-react';
import BrihaspathiLogo from './BrihaspathiLogo';

export default function Navbar({ 
  activeTab, projects, selectedProjectId, setSelectedProjectId, syncStatus, onSyncGoogleSheet 
}) {
  const navigate = useNavigate();
  return (
    <header className="navbar">
      <div onClick={() => navigate('/dashboard')}>
        <BrihaspathiLogo height={40} showTagline={true} />
      </div>

      <nav className="nav-links">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <LayoutDashboard size={17} />
          Dashboard
        </button>

        <button
          className={`nav-btn ${activeTab === 'evaluator' ? 'active' : ''}`}
          onClick={() => navigate('/evaluator')}
        >
          <CheckSquare size={17} />
          Compliance Evaluator
        </button>

        <button
          className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => navigate('/projects')}
        >
          <FolderGit2 size={17} />
          Projects & Specs
        </button>

        <button
          className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => navigate('/products')}
        >
          <Layers size={17} />
          Products Catalog
        </button>

        <button
          className={`nav-btn ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => navigate('/comparison')}
        >
          <Columns3 size={17} />
          Compare Matrix
        </button>

        <button
          className={`nav-btn ${activeTab === 'category-builder' ? 'active' : ''}`}
          onClick={() => navigate('/category-builder')}
        >
          <PlusCircle size={17} />
          Add Category
        </button>
      </nav>

      {/* Project Selector & Deep Sync Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {onSyncGoogleSheet && (
          <button 
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '11.5px', padding: '0.35rem 0.65rem', borderColor: 'rgba(99, 102, 241, 0.4)', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}
            onClick={onSyncGoogleSheet}
            disabled={syncStatus?.loading}
            title="Perform deep audit & sync against Google Sheet and Master Database"
          >
            <RefreshCw size={13} className={syncStatus?.loading ? 'animate-spin' : ''} />
            {syncStatus?.loading ? 'Syncing...' : '🔄 Deep Sync DB'}
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Project:</span>
          <select
            className="form-select"
            style={{ width: '200px', padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
