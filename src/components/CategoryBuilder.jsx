import React, { useState } from 'react';
import { PlusCircle, Trash2, Cpu, Check, Layers } from 'lucide-react';

export default function CategoryBuilder({ categories, setCategories }) {
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [fields, setFields] = useState([
    { key: 'param_1', label: 'Specification Field 1', type: 'number', unit: 'units', ruleType: 'min', defaultReq: 10 },
    { key: 'param_2', label: 'Specification Field 2', type: 'select', options: ['Option A', 'Option B'], ruleType: 'exact', defaultReq: 'Option A' }
  ]);

  const addFieldRow = () => {
    const nextIdx = fields.length + 1;
    setFields([
      ...fields,
      { key: `param_${nextIdx}`, label: `Specification Parameter ${nextIdx}`, type: 'number', unit: '', ruleType: 'min', defaultReq: 0 }
    ]);
  };

  const removeFieldRow = (idx) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== idx));
    }
  };

  const updateFieldRow = (idx, key, val) => {
    const updated = [...fields];
    updated[idx][key] = val;

    // Auto update key name when label changes
    if (key === 'label') {
      updated[idx].key = val.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }

    setFields(updated);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!catName) {
      alert('Please provide a Category Name');
      return;
    }

    const newCat = {
      id: catName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: catName,
      icon: 'Cpu',
      description: catDescription || 'Custom domain product specification group.',
      fields: fields
    };

    setCategories([...categories, newCat]);
    setCatName('');
    setCatDescription('');
    alert(`Category "${catName}" added successfully with ${fields.length} spec parameters!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.4rem' }}>Custom Category & Specification Builder</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Create new product domains and define custom technical evaluation parameter schema.
        </p>
      </div>

      <div className="grid-cols-2">
        {/* Builder Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#818cf8' }}>Define New Domain Category</h3>

          <form onSubmit={handleSaveCategory}>
            <div className="form-group">
              <label>Category Domain Name *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Smart HVAC Units / Industrial Batteries / IoT Sensors"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Precision cooling units for data centers..."
                value={catDescription}
                onChange={(e) => setCatDescription(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Specification Parameters Schema ({fields.length} Fields)
                </label>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addFieldRow}>
                  <PlusCircle size={14} /> Add Field
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {fields.map((f, idx) => (
                  <div key={idx} style={{ 
                    padding: '0.75rem', background: 'rgba(11, 15, 25, 0.6)', 
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Field Label (e.g. Battery Capacity)"
                        value={f.label}
                        onChange={(e) => updateFieldRow(idx, 'label', e.target.value)}
                        style={{ flex: 2 }}
                        required
                      />

                      <select 
                        className="form-select" 
                        value={f.type}
                        onChange={(e) => updateFieldRow(idx, 'type', e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="number">Numeric</option>
                        <option value="select">Selection / Text</option>
                        <option value="boolean">Yes/No Boolean</option>
                      </select>

                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeFieldRow(idx)}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Unit (e.g. Ah, kW, dB)"
                        value={f.unit || ''}
                        onChange={(e) => updateFieldRow(idx, 'unit', e.target.value)}
                        style={{ flex: 1 }}
                      />

                      <select 
                        className="form-select"
                        value={f.ruleType}
                        onChange={(e) => updateFieldRow(idx, 'ruleType', e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="min">Rule: Min Required (&ge;)</option>
                        <option value="max">Rule: Max Allowed (&le;)</option>
                        <option value="exact">Rule: Exact Match (=)</option>
                        <option value="boolean">Rule: Feature Required</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Check size={18} /> Save & Activate Category
              </button>
            </div>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Active Product Categories ({categories.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categories.map(cat => (
              <div key={cat.id} style={{ 
                padding: '1rem', background: 'rgba(11, 15, 25, 0.6)', 
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1.05rem', color: '#ffffff' }}>{cat.name}</h4>
                  <span className="badge badge-conditional">{cat.fields.length} Spec Fields</span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.4rem 0' }}>
                  {cat.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                  {cat.fields.map(f => (
                    <span key={f.key} style={{ 
                      fontSize: '0.74rem', background: 'rgba(255,255,255,0.05)', 
                      padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid var(--border-color)' 
                    }}>
                      {f.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
