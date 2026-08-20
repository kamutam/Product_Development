import React, { useState, useMemo } from 'react';
import { Calculator, Plus, Trash2, Save, Printer, IndianRupee, Percent, Sparkles, Loader2, Search, BrainCircuit, Truck } from 'lucide-react';
import { generateBOMSuggestions, parseNaturalLanguageSpecs } from '../utils/aiService';
import { getHistoricalPricesForItem } from '../utils/procurementService';

export default function BOMEstimator({ projects, setProjects, products, procurementData }) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [bomItems, setBomItems] = useState([]);
  const [targetMargin, setTargetMargin] = useState(25); // 25% default margin
  const [projectBudget, setProjectBudget] = useState(50000); // Mock default budget
  const [isAILoading, setIsAILoading] = useState(false);
  
  // NLP Search State
  const [nlpQuery, setNlpQuery] = useState('');
  const [isNlpParsing, setIsNlpParsing] = useState(false);
  const [nlpInsights, setNlpInsights] = useState([]);
  const [nlpFilters, setNlpFilters] = useState({});

  const [leadTimePrediction, setLeadTimePrediction] = useState(null);

  const activeProject = projects.find(p => p.id === selectedProjectId);

  // Filter products that belong to the active project's category AND NLP filters
  const availableProducts = useMemo(() => {
    let filtered = products;
    if (activeProject) {
      filtered = filtered.filter(p => p.categoryId === activeProject.categoryId);
    }
    
    // Apply NLP Filters
    if (Object.keys(nlpFilters).length > 0) {
      filtered = filtered.filter(p => {
        let match = true;
        if (nlpFilters.ipRating && p.specs?.ipRating !== nlpFilters.ipRating) match = false;
        if (nlpFilters.irRange && p.specs?.irRange < nlpFilters.irRange) match = false;
        if (nlpFilters.resolution && p.specs?.resolution < nlpFilters.resolution) match = false;
        if (nlpFilters.stqcCertified && !p.specs?.stqcCertified) match = false;
        return match;
      });
    }
    return filtered;
  }, [activeProject, products, nlpFilters]);

  const addBomItem = () => {
    setBomItems([...bomItems, { id: Date.now().toString(), productId: '', quantity: 1, unitCost: 0 }]);
  };

  const handleAutoBuildBOM = async () => {
    if (!activeProject) return;
    setIsAILoading(true);
    try {
      const suggestions = await generateBOMSuggestions(activeProject, availableProducts, projectBudget);
      setBomItems(suggestions);
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleNLPAnalyze = async () => {
    if (!nlpQuery.trim()) return;
    setIsNlpParsing(true);
    try {
      const result = await parseNaturalLanguageSpecs(nlpQuery);
      setNlpFilters(result.filters);
      setNlpInsights(result.nlpInsights);
    } catch (error) {
      console.error("NLP Parsing failed", error);
    } finally {
      setIsNlpParsing(false);
    }
  };

  const clearNlpFilters = () => {
    setNlpQuery('');
    setNlpFilters({});
    setNlpInsights([]);
  };

  const updateBomItem = (id, field, value) => {
    setBomItems(bomItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: field === 'quantity' || field === 'unitCost' ? Number(value) : value };
        
        // Auto-fetch historical price when product changes
        if (field === 'productId' && value) {
          const selectedProduct = availableProducts.find(p => p.id === value);
          if (selectedProduct && procurementData) {
            const q = selectedProduct.name || selectedProduct.sku || '';
            const histPrices = getHistoricalPricesForItem(procurementData, q);
            if (histPrices && histPrices.length > 0) {
              updatedItem.unitCost = Number(histPrices[0].rate) || 0;
            } else {
              // Fallback to catalog price if no PO history exists
              updatedItem.unitCost = selectedProduct.price || (selectedProduct.specs?.maxPrice) || 0;
            }
          }
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const removeBomItem = (id) => {
    setBomItems(bomItems.filter(item => item.id !== id));
  };

  // Simulate ML Lead time calculation when BOM changes
  React.useEffect(() => {
    if (bomItems.length === 0) {
      setLeadTimePrediction(null);
      return;
    }
    
    const isFast = nlpQuery.toLowerCase().includes('fast') || nlpQuery.toLowerCase().includes('stock');
    const isImport = nlpQuery.toLowerCase().includes('ndaa') || nlpQuery.toLowerCase().includes('cyber');
    
    let baseDays = 15 + Math.floor(Math.random() * 20); // 15-35 days
    if (isFast) baseDays = 5 + Math.floor(Math.random() * 7);
    if (isImport) baseDays = 45 + Math.floor(Math.random() * 30);
    
    let risk = 'Low';
    let msg = 'Standard local supply';
    if (baseDays < 10) { risk = 'Low'; msg = 'Available in local stock'; }
    else if (baseDays > 40) { risk = 'High'; msg = 'Import dependencies / Chip shortage risk'; }
    else if (baseDays > 25) { risk = 'Medium'; msg = 'Standard factory lead time'; }

    setLeadTimePrediction({ days: baseDays, risk, msg });
  }, [bomItems, nlpQuery]);

  const handleSaveBOM = () => {
    if (!activeProject || bomItems.length === 0) return;
    const updatedProject = {
      ...activeProject,
      savedBom: bomItems, // Save the finalized BOM items
      estimatedMaterialCost: totalCost
    };
    const updatedProjects = projects.map(p => p.id === activeProject.id ? updatedProject : p);
    setProjects(updatedProjects);
    alert('Official BOM successfully saved to the project!');
  };

  const totalCost = bomItems.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
  const recommendedSellPrice = totalCost / (1 - (targetMargin / 100));
  const profit = recommendedSellPrice - totalCost;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeInUp 0.4s ease', paddingBottom: '120px' }}>
      
      {/* Header & Controls */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Calculator size={20} color="var(--accent)" />
            <h2 style={{ fontSize: '1.5rem' }}>Bill of Materials (BOM) Estimator</h2>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Calculate system costs, margins, and tender pricing.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, width: '250px' }}>
            <label>Select Project</label>
            <select 
              className="form-select" 
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setBomItems([]); // Reset items on project change
              }}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.poNumber || 'No PO'})</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, width: '150px' }}>
            <label>Tender Budget (₹)</label>
            <input 
              type="number" 
              className="form-input" 
              value={projectBudget}
              onChange={(e) => setProjectBudget(Number(e.target.value))}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSaveBOM} disabled={bomItems.length === 0} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#059669' }}>
            <Save size={16} /> Save Official BOM
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print BOM
          </button>
        </div>
      </div>

      {/* Smart NLP Search Bar */}
      <div className="card" style={{ background: 'linear-gradient(to right, rgba(139, 92, 246, 0.05), rgba(99, 102, 241, 0.05))', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <BrainCircuit size={18} color="#8b5cf6" />
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#8b5cf6' }}>Smart NLP Spec Search</h3>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="E.g., 'Find an outdoor camera for a dusty railway station with 30m night vision...'"
              value={nlpQuery}
              onChange={(e) => setNlpQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNLPAnalyze()}
              style={{ paddingLeft: '2.5rem', paddingRight: '1rem', width: '100%', fontSize: '14px', border: '1px solid rgba(139, 92, 246, 0.3)' }}
            />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleNLPAnalyze}
            disabled={isNlpParsing || !nlpQuery}
            style={{ background: '#8b5cf6' }}
          >
            {isNlpParsing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Analyze Intent
          </button>
          {Object.keys(nlpFilters).length > 0 && (
            <button className="btn btn-secondary" onClick={clearNlpFilters}>Clear</button>
          )}
        </div>
        
        {nlpInsights.length > 0 && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', border: '1px dashed #334155' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>ML Extracted Insights:</div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '12px', color: '#cbd5e1' }}>
              {nlpInsights.map((insight, idx) => (
                <li key={idx} style={{ marginBottom: '0.25rem' }}>{insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* BOM Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3>Hardware Components</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-primary btn-sm" 
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', border: 'none', boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' }}
              onClick={handleAutoBuildBOM}
              disabled={isAILoading}
            >
              {isAILoading ? <Loader2 size={14} className="animate-spin" style={{ animation: 'coreOrbitRotate 1s linear infinite' }} /> : <Sparkles size={14} />}
              {isAILoading ? 'AI is thinking...' : '✨ AI Auto-Build'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={addBomItem}>
              <Plus size={14} /> Add Component
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="spec-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Product / Component</th>
                <th style={{ width: '15%' }}>Quantity</th>
                <th style={{ width: '15%' }}>Est. Unit Cost (₹)</th>
                <th style={{ width: '15%' }}>Total Cost (₹)</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bomItems.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No components added yet. Click "Add Component" to start building your BOM.
                  </td>
                </tr>
              ) : (
                bomItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <select 
                        className="form-select" 
                        value={item.productId}
                        onChange={(e) => updateBomItem(item.id, 'productId', e.target.value)}
                        style={{ padding: '0.35rem 0.5rem' }}
                      >
                        <option value="">-- Select a product --</option>
                        {availableProducts.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku || 'N/A'}) - {p.vendor}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="form-input" 
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateBomItem(item.id, 'quantity', e.target.value)}
                        style={{ padding: '0.35rem 0.5rem' }}
                      />
                    </td>
                    <td>
                      <div style={{ position: 'relative' }}>
                        <IndianRupee size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="number" 
                          className="form-input" 
                          min="0"
                          value={item.unitCost}
                          onChange={(e) => updateBomItem(item.id, 'unitCost', e.target.value)}
                          style={{ padding: '0.35rem 0.5rem 0.35rem 1.75rem' }}
                        />
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '14px' }}>
                      ₹{(item.quantity * item.unitCost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn btn-danger btn-sm" 
                        style={{ padding: '0.35rem' }}
                        onClick={() => removeBomItem(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid-cols-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Margin Configuration</h3>
          <div className="form-group">
            <label>Target Profit Margin (%)</label>
            <div style={{ position: 'relative' }}>
              <Percent size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="number" 
                className="form-input" 
                min="0" max="99"
                value={targetMargin}
                onChange={(e) => setTargetMargin(Number(e.target.value))}
                style={{ paddingLeft: '1.75rem', fontSize: '1.25rem', fontWeight: 800 }}
              />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              The markup applied to the total hardware cost to calculate the recommended tender sell price.
            </p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Total Hardware Cost:</span>
            <span style={{ fontWeight: 700 }}>₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Expected Profit:</span>
            <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{profit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-heading)', fontWeight: 800, fontSize: '1.1rem' }}>Recommended Sell Price:</span>
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: recommendedSellPrice > projectBudget ? 'var(--danger)' : 'var(--primary)' }}>
              ₹{recommendedSellPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {recommendedSellPrice > projectBudget && (
            <div style={{ fontSize: '11px', color: 'var(--danger)', textAlign: 'right', marginTop: '0.25rem' }}>
              Warning: Exceeds tender budget of ₹{projectBudget.toLocaleString('en-IN')}
            </div>
          )}

          {leadTimePrediction && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6', fontWeight: 800, marginBottom: '0.5rem' }}>
                <Truck size={16} /> ML Lead Time Forecast
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated Delivery:</span>
                <span style={{ fontWeight: 800 }}>{leadTimePrediction.days} Days</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Supply Chain Risk:</span>
                <span style={{ 
                  fontWeight: 700, fontSize: '12px',
                  color: leadTimePrediction.risk === 'High' ? '#ef4444' : (leadTimePrediction.risk === 'Low' ? '#10b981' : '#f59e0b')
                }}>
                  {leadTimePrediction.risk} ({leadTimePrediction.msg})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
