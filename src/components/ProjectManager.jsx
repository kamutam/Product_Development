import React, { useState } from 'react';
import { Plus, Trash2, Sliders, CheckCircle2, Clock, Wand2, ShieldCheck, Check, Sparkles, AlertTriangle, Layers, Calendar, ShoppingCart, Wrench } from 'lucide-react';
import { extractProjectReqsFromDescription } from '../utils/parser';
import GovtEmblemLogo from './GovtEmblemLogo';

export default function ProjectManager({ 
  projects, setProjects, categories, activeProjectId, setSelectedProjectId, setActiveTab 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [extractStatus, setExtractStatus] = useState('');

  const [newProject, setNewProject] = useState({
    name: '',
    poNumber: '',
    client: '',
    categoryId: categories[0]?.id || 'cctv',
    description: '',
    status: 'IN_PROGRESS',
    purchaseDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    implementationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    requirements: {}
  });

  const handleCategorySelectForAdd = (catId) => {
    const selectedCat = categories.find(c => c.id === catId);
    const initialReqs = {};
    if (selectedCat) {
      selectedCat.fields.forEach(f => {
        initialReqs[f.key] = f.defaultReq;
      });
    }

    setNewProject({
      ...newProject,
      categoryId: catId,
      requirements: initialReqs
    });
    setExtractStatus('');
  };

  const handleReqChange = (key, value) => {
    setNewProject({
      ...newProject,
      requirements: {
        ...newProject.requirements,
        [key]: value
      }
    });
  };

  // Auto-extract material requirements from project description text
  const handleDescriptionChange = (text) => {
    const category = categories.find(c => c.id === newProject.categoryId);
    const extracted = extractProjectReqsFromDescription(text, category);

    setNewProject({
      ...newProject,
      description: text,
      requirements: {
        ...newProject.requirements,
        ...extracted.requirements
      }
    });

    if (Object.keys(extracted.requirements).length > 0) {
      setExtractStatus(`✓ Auto-detected ${Object.keys(extracted.requirements).length} material specs from project description!`);
    } else {
      setExtractStatus('');
    }
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.poNumber) {
      alert('Please fill in Project Name and PO/Tender ID.');
      return;
    }

    const created = {
      ...newProject,
      id: `proj-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setProjects([created, ...projects]);
    setSelectedProjectId(created.id);
    setShowAddModal(false);
  };

  const handleDeleteProject = (id) => {
    if (confirm('Are you sure you want to delete this project tender specification?')) {
      const remaining = projects.filter(p => p.id !== id);
      setProjects(remaining);
      if (selectedProjectId === id && remaining.length > 0) {
        setSelectedProjectId(remaining[0].id);
      }
    }
  };

  // Toggle Project Status (IN_PROGRESS <-> COMPLETED)
  const handleToggleProjectStatus = (projId) => {
    setProjects(projects.map(p => {
      if (p.id === projId) {
        const nextStatus = p.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  // Helper to calculate days remaining until purchase deadline
  const calculateDaysRemaining = (deadlineDate) => {
    if (!deadlineDate) return null;
    const target = new Date(deadlineDate);
    const now = new Date();
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Projects & Implementation Deadlines Manager</h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Track product <strong>Purchase Cutoff Dates</strong>, <strong>Solution Implementation Deadlines</strong>, and live <strong>Days Remaining Countdowns</strong>.
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => {
          handleCategorySelectForAdd(categories[0].id);
          setShowAddModal(true);
        }}>
          <Plus size={15} /> Create New Project
        </button>
      </div>

      {/* Projects List Grid */}
      <div className="grid-cols-2">
        {projects.map(project => {
          const category = categories.find(c => c.id === project.categoryId);
          const isActive = project.id === activeProjectId;
          const isCompleted = project.status === 'COMPLETED';

          const daysLeftPurchase = calculateDaysRemaining(project.purchaseDeadline);
          const daysLeftImpl = calculateDaysRemaining(project.implementationDeadline);

          return (
            <div 
              key={project.id} 
              className="card"
              style={{
                borderColor: isActive ? '#6366f1' : (isCompleted ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'),
                boxShadow: isActive ? '0 0 20px rgba(99, 102, 241, 0.25)' : 'none',
                position: 'relative'
              }}
            >
              {/* Header Strip with Status & Deadline Badges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                    <GovtEmblemLogo type={project.client || project.name} size={22} />
                    <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase' }}>
                      PO / TENDER ID: {project.poNumber || project.code || 'N/A'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginTop: '0.15rem' }}>{project.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                    Client: <strong>{project.client}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                  {/* PROJECT STATUS BADGE */}
                  {isCompleted ? (
                    <span className="badge badge-accept" style={{ fontSize: '10.5px' }}>
                      <CheckCircle2 size={12} /> CLOSED AS COMPLETE
                    </span>
                  ) : (
                    <span className="badge badge-conditional" style={{ fontSize: '10.5px' }}>
                      <Clock size={12} /> IN PROGRESS
                    </span>
                  )}

                  {/* DAYS REMAINING COUNTDOWN BADGE */}
                  {!isCompleted && daysLeftPurchase !== null && (
                    <span className={`badge ${daysLeftPurchase <= 5 ? 'badge-reject' : 'badge-conditional'}`} style={{ fontSize: '10px' }}>
                      <Calendar size={11} /> {daysLeftPurchase > 0 ? `${daysLeftPurchase} Days Left to Purchase` : 'Purchase Overdue!'}
                    </span>
                  )}

                  <span className="badge badge-conditional" style={{ textTransform: 'none', background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#818cf8', fontSize: '10px' }}>
                    {category?.name}
                  </span>
                </div>
              </div>

              {/* Description */}
              {project.description && (
                <p style={{ fontSize: '12px', color: 'var(--text-main)', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                  {project.description}
                </p>
              )}

              {/* PURCHASING & IMPLEMENTATION DEADLINE TIMELINE STRIP */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%)', 
                border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 'var(--radius-md)', 
                padding: '0.75rem 0.9rem', marginBottom: '1rem' 
              }}>
                <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={13} /> PROCUREMENT & IMPLEMENTATION DEADLINES:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
                  {/* Step 1: Product Purchase Deadline */}
                  <div style={{ background: 'rgba(217, 119, 6, 0.2)', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.5)' }}>
                    <div style={{ fontSize: '10.5px', color: '#fef08a', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
                      <ShoppingCart size={11} color="#fde047" /> Product Purchase Cutoff Date:
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '12.5px', color: '#fde047', marginTop: '0.15rem' }}>
                      {project.purchaseDeadline || '2026-08-20'}
                    </div>
                  </div>

                  {/* Step 2: Solution Implementation Deadline */}
                  <div style={{ background: 'rgba(11, 15, 25, 0.65)', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Wrench size={11} color="#34d399" /> Solution Deployment Deadline:
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#34d399', marginTop: '0.15rem' }}>
                      {project.implementationDeadline || '2026-09-15'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Specs Summary formatted in neat Serial Number (S.No) list */}
              <div style={{ 
                background: 'rgba(11, 15, 25, 0.6)', padding: '0.75rem 0.9rem', 
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sliders size={13} /> REQUIRED PROJECT SPECIFICATIONS (S.NO WISE):
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ textAlign: 'left', padding: '0.3rem 0.4rem', width: '35px' }}>S.No</th>
                      <th style={{ textAlign: 'left', padding: '0.3rem 0.4rem' }}>Specification Parameter</th>
                      <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem' }}>Required Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category?.fields.map((field, idx) => {
                      const val = project.requirements?.[field.key];
                      if (val === undefined || val === null || val === '') return null;

                      return (
                        <tr key={field.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '0.35rem 0.4rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                            {idx + 1}.
                          </td>
                          <td style={{ padding: '0.35rem 0.4rem', color: 'var(--text-main)' }}>
                            {field.label}
                          </td>
                          <td style={{ padding: '0.35rem 0.4rem', textAlign: 'right', fontWeight: 700, color: '#38bdf8' }}>
                            {typeof val === 'boolean' ? (val ? 'Yes (Required)' : 'No') : `${String(val)}${field.unit ? ' ' + field.unit : ''}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {/* Status Toggle Action Button */}
                  {isCompleted ? (
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11px', color: '#fbbf24' }}
                      onClick={() => handleToggleProjectStatus(project.id)}
                    >
                      <Clock size={12} /> Reopen In Progress
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '11px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                      onClick={() => handleToggleProjectStatus(project.id)}
                    >
                      <CheckCircle2 size={12} /> Close as Complete
                    </button>
                  )}

                  {!isActive && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      Set as Active Project
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setActiveTab('evaluator');
                    }}
                  >
                    Inspect Specs &rarr;
                  </button>

                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Project Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>Define New Project, PO & Implementation Deadlines</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Specify PO Number/Tender ID, product purchase cutoff date, and final deployment deadline.
            </p>

            <form onSubmit={handleCreateProject}>
              <div className="form-row">
                <div className="form-group">
                  <label>Project Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Northern Central Railway STQC Locomotive CCTV"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>PO Number / Tender ID *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. PO-2026-5398"
                    value={newProject.poNumber}
                    onChange={(e) => setNewProject({ ...newProject, poNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Client Organization Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Indian Railways / MSRTC / Smart City"
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product Domain Category *</label>
                  <select 
                    className="form-select"
                    value={newProject.categoryId}
                    onChange={(e) => handleCategorySelectForAdd(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DEADLINE DATES ROW */}
              <div className="form-row">
                <div className="form-group">
                  <label>Target Product Purchase Deadline *</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newProject.purchaseDeadline}
                    onChange={(e) => setNewProject({ ...newProject, purchaseDeadline: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>On-Site Solution Deployment Deadline *</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newProject.implementationDeadline}
                    onChange={(e) => setNewProject({ ...newProject, implementationDeadline: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Initial Project Status *</label>
                  <select 
                    className="form-select"
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  >
                    <option value="IN_PROGRESS">In Progress (Active Sourcing)</option>
                    <option value="COMPLETED">Closed as Complete (PO Execution Finished)</option>
                  </select>
                </div>
              </div>

              {/* Real-time Material Description Parser */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>Project Description / Tender Scope (Auto-Detects Specs)</label>
                  {extractStatus && (
                    <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>{extractStatus}</span>
                  )}
                </div>
                <textarea 
                  className="form-textarea"
                  rows="3"
                  placeholder="Paste tender scope text (e.g., 'CCTV surveillance as per RDSO specs. CP-PLUS brand, 36 months warranty, IP67 enclosure...')."
                  value={newProject.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                />
              </div>

              {/* Dynamic Target Threshold Inputs */}
              <div style={{ 
                marginTop: '0.85rem', padding: '0.85rem', background: 'rgba(11, 15, 25, 0.7)', 
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' 
              }}>
                <h4 style={{ fontSize: '12px', color: '#818cf8', marginBottom: '0.65rem' }}>
                  Set Target Specification Requirements
                </h4>

                <div className="form-row">
                  {categories.find(c => c.id === newProject.categoryId)?.fields.map(field => (
                    <div key={field.key} className="form-group">
                      <label>{field.label}</label>

                      {field.type === 'select' ? (
                        <select 
                          className="form-select"
                          value={newProject.requirements[field.key] || ''}
                          onChange={(e) => handleReqChange(field.key, e.target.value)}
                        >
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'boolean' ? (
                        <select 
                          className="form-select"
                          value={newProject.requirements[field.key] ? 'true' : 'false'}
                          onChange={(e) => handleReqChange(field.key, e.target.value === 'true')}
                        >
                          <option value="true">Yes (Required)</option>
                          <option value="false">No (Not Required)</option>
                        </select>
                      ) : (
                        <input 
                          type="number"
                          step="any"
                          className="form-input"
                          value={newProject.requirements[field.key] || ''}
                          onChange={(e) => handleReqChange(field.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project Specification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
