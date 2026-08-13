import React, { useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit3, Send, CheckCircle2, Clock, AlertTriangle, Building2, Layers, Calendar, MapPin, Sparkles } from 'lucide-react';
import SendRequirementModal from './SendRequirementModal';

export default function RequirementsManager({ 
  requirements = [], setRequirements, categories = [], oems = [], products = [], setActiveTab, onRecordEmail 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReqForOEM, setSelectedReqForOEM] = useState(null);
  const [selectedOEMForReq, setSelectedOEMForReq] = useState(null);

  const [newReq, setNewReq] = useState({
    title: '',
    category: categories[0]?.name || 'CCTV & Surveillance',
    solution: '',
    techSpecs: '',
    quantity: '100 Units',
    location: 'Hyderabad Site',
    project: 'Smart City Infrastructure',
    priority: 'High',
    requiredCertifications: 'STQC / ONVIF',
    timeline: '30 Days',
    status: 'Researching'
  });

  const handleCreateRequirement = (e) => {
    e.preventDefault();
    if (!newReq.title || !newReq.solution) {
      alert('Please fill in Requirement Title and Solution/Product Required.');
      return;
    }

    const created = {
      ...newReq,
      id: `req-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };

    if (setRequirements) {
      setRequirements([created, ...requirements]);
    }
    setShowAddModal(false);
    setNewReq({
      title: '',
      category: categories[0]?.name || 'CCTV & Surveillance',
      solution: '',
      techSpecs: '',
      quantity: '100 Units',
      location: 'Hyderabad Site',
      project: 'Smart City Infrastructure',
      priority: 'High',
      requiredCertifications: 'STQC / ONVIF',
      timeline: '30 Days',
      status: 'Researching'
    });
  };

  const handleDeleteRequirement = (id) => {
    if (confirm('Are you sure you want to delete this requirement record?')) {
      if (setRequirements) {
        setRequirements(requirements.filter(r => r.id !== id));
      }
    }
  };

  const handleStatusChange = (id, newStatus) => {
    if (setRequirements) {
      setRequirements(requirements.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
  };

  const filteredRequirements = requirements.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (r.title || '').toLowerCase().includes(q) ||
                          (r.solution || '').toLowerCase().includes(q) ||
                          (r.category || '').toLowerCase().includes(q) ||
                          (r.project || '').toLowerCase().includes(q);
    const matchesPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Critical':
        return <span className="badge badge-reject"><AlertTriangle size={11} /> CRITICAL PRIORITY</span>;
      case 'High':
        return <span className="badge badge-conditional" style={{ background: '#ffedd5', color: '#c2410c', border: '1px solid #fed7aa' }}>HIGH PRIORITY</span>;
      case 'Medium':
        return <span className="badge badge-conditional">MEDIUM PRIORITY</span>;
      default:
        return <span className="badge" style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1' }}>LOW PRIORITY</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            BRIHASPATHI TECHNOLOGIES &bull; CENTRAL REQUIREMENT PIPELINE
          </div>
          <h2 style={{ fontSize: '1.25rem', marginTop: '0.15rem' }}>Enterprise Requirement Management</h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Connect project requirements with <strong>OEM Research</strong>, <strong>Product Sourcing</strong>, <strong>Compliance Verification</strong>, and <strong>B2B Inquiry Dispatches</strong>.
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Create New Requirement
        </button>
      </div>

      {/* Filter & Toolbar */}
      <div className="card" style={{ padding: '0.85rem 1.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1, minWidth: '280px' }}>
          <div className="search-input-wrapper" style={{ flex: 1 }}>
            <Search size={15} className="search-icon" />
            <input 
              type="text"
              className="form-control"
              placeholder="Search requirements by Title, Solution, Category, or Project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Priority:</span>
            <select 
              className="form-select"
              style={{ width: '130px', padding: '0.4rem 0.5rem', fontSize: '12px' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Status:</span>
            <select 
              className="form-select"
              style={{ width: '160px', padding: '0.4rem 0.5rem', fontSize: '12px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Researching">Researching</option>
              <option value="OEM Contacted">OEM Contacted</option>
              <option value="Quotation Received">Quotation Received</option>
              <option value="Under Evaluation">Under Evaluation</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requirements Cards Grid */}
      <div className="grid-cols-2">
        {filteredRequirements.map(req => (
          <div key={req.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Card Top Strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <div>
                  <span style={{ fontSize: '10.5px', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>
                    REQ ID: {req.id} &bull; {req.category}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', marginTop: '0.15rem', color: '#0f172a', fontWeight: 800 }}>{req.title}</h3>
                </div>
                {getPriorityBadge(req.priority)}
              </div>

              {/* Specs & Project Context */}
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.65rem 0.85rem', marginBottom: '0.85rem', fontSize: '12px' }}>
                <div style={{ color: '#475569', marginBottom: '0.35rem' }}>
                  Product Required: <strong style={{ color: '#0284c7' }}>{req.solution}</strong> &bull; Qty: <strong style={{ color: '#059669' }}>{req.quantity}</strong>
                </div>
                {req.techSpecs && (
                  <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '11.5px', lineHeight: 1.4 }}>
                    Specs: {req.techSpecs}
                  </div>
                )}
              </div>

              {/* Metadata Badges */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem', fontSize: '11px' }}>
                <span className="badge badge-accept" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}>
                  📍 {req.location || 'Site Location'}
                </span>
                <span className="badge badge-conditional" style={{ fontSize: '10px' }}>
                  ⏳ Timeline: {req.timeline || '30 Days'}
                </span>
                <span className="badge badge-accept" style={{ fontSize: '10px' }}>
                  🛡️ {req.requiredCertifications || 'Compliance'}
                </span>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Status:</span>
                <select 
                  className="form-select"
                  style={{ width: '150px', padding: '0.25rem 0.45rem', fontSize: '11px', fontWeight: 800 }}
                  value={req.status || 'Researching'}
                  onChange={(e) => handleStatusChange(req.id, e.target.value)}
                >
                  <option value="Draft">Draft</option>
                  <option value="Researching">Researching</option>
                  <option value="OEM Contacted">OEM Contacted</option>
                  <option value="Quotation Received">Quotation Received</option>
                  <option value="Under Evaluation">Under Evaluation</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', color: '#0284c7' }}
                  onClick={() => {
                    const matchedOEM = oems[0];
                    setSelectedReqForOEM(req);
                    setSelectedOEMForReq(matchedOEM);
                  }}
                  title="Send this Requirement to OEM Partner"
                >
                  <Send size={12} /> Contact OEM
                </button>

                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteRequirement(req.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE REQUIREMENT MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>Create New Enterprise Requirement</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Define technical requirements, quantities, certifications, and procurement timelines.
            </p>

            <form onSubmit={handleCreateRequirement}>
              <div className="form-row">
                <div className="form-group">
                  <label>Requirement Title *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 4MP Motorized Varifocal Bullet Camera for Rail Station CCTV"
                    value={newReq.title}
                    onChange={(e) => setNewReq({ ...newReq, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product / Solution Required *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. IP Camera / Smart Pole / IoT Gateway"
                    value={newReq.solution}
                    onChange={(e) => setNewReq({ ...newReq, solution: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Product Category</label>
                  <select 
                    className="form-select"
                    value={newReq.category}
                    onChange={(e) => setNewReq({ ...newReq, category: e.target.value })}
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority Level</label>
                  <select 
                    className="form-select"
                    value={newReq.priority}
                    onChange={(e) => setNewReq({ ...newReq, priority: e.target.value })}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Technical Specifications & Key Thresholds</label>
                <textarea 
                  className="form-textarea"
                  rows="3"
                  placeholder="e.g. 4MP Resolution, 1/2.8'' CMOS sensor, H.265+, 50m IR distance, IP67 enclosure, ONVIF Profile S/G/T, STQC lab cert."
                  value={newReq.techSpecs}
                  onChange={(e) => setNewReq({ ...newReq, techSpecs: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity Required</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 250 Units"
                    value={newReq.quantity}
                    onChange={(e) => setNewReq({ ...newReq, quantity: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Required Certifications</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. STQC, ARAI AIS-140, ONVIF, CE/FCC"
                    value={newReq.requiredCertifications}
                    onChange={(e) => setNewReq({ ...newReq, requiredCertifications: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Delivery Location / Site</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Central Warehouse, Hyderabad"
                    value={newReq.location}
                    onChange={(e) => setNewReq({ ...newReq, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Project Name / Tender ID</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. AP-CRDA Smart City Smart Pole Project"
                    value={newReq.project}
                    onChange={(e) => setNewReq({ ...newReq, project: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEND REQUIREMENT TO OEM MODAL */}
      {selectedReqForOEM && (
        <SendRequirementModal 
          oem={selectedOEMForReq || oems[0]}
          initialRequirement={selectedReqForOEM}
          categories={categories}
          onClose={() => {
            setSelectedReqForOEM(null);
            setSelectedOEMForReq(null);
          }}
          onRecordEmail={onRecordEmail}
        />
      )}

    </div>
  );
}
