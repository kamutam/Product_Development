import React from 'react';
import { LayoutDashboard, CheckSquare, FolderGit2, Layers, Columns3, PlusCircle } from 'lucide-react';
import BrihaspathiLogo from './BrihaspathiLogo';

export default function Navbar({ activeTab, setActiveTab, projects, selectedProjectId, setSelectedProjectId }) {
  return (
    <header className="navbar">
      <div onClick={() => setActiveTab('dashboard')}>
        <BrihaspathiLogo height={40} showTagline={true} />
      </div>

      <nav className="nav-links">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={17} />
          Dashboard
        </button>

        <button
          className={`nav-btn ${activeTab === 'evaluator' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluator')}
        >
          <CheckSquare size={17} />
          Compliance Evaluator
        </button>

        <button
          className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <FolderGit2 size={17} />
          Projects & Specs
        </button>

        <button
          className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Layers size={17} />
          Products Catalog
        </button>

        <button
          className={`nav-btn ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          <Columns3 size={17} />
          Compare Matrix
        </button>

        <button
          className={`nav-btn ${activeTab === 'category-builder' ? 'active' : ''}`}
          onClick={() => setActiveTab('category-builder')}
        >
          <PlusCircle size={17} />
          Add Category
        </button>
      </nav>

      {/* Project Selector Quick Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Project:</span>
        <select
          className="form-select"
          style={{ width: '220px', padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
    </header>
  );
}
