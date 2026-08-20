import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wand2 } from 'lucide-react';

export default function ProjectMaterialView({ projects, products, categories }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const selectedProjectForFlow = useMemo(() => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;

    let totalProjectCost = 0;
    const usedProducts = [];

    if (project.savedBom && Array.isArray(project.savedBom)) {
      project.savedBom.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (!prod) return;
        
        const cost = item.quantity * item.unitCost;
        totalProjectCost += cost;
        
        usedProducts.push({
          ...prod,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: cost,
          categoryName: categories.find(c => c.id === prod.categoryId)?.name || 'Uncategorized'
        });
      });
    }

    return {
      ...project,
      totalProjectCost,
      usedProducts: usedProducts.sort((a, b) => b.totalCost - a.totalCost)
    };
  }, [projects, products, categories, projectId]);

  if (!selectedProjectForFlow) {
    return (
      <div style={{ padding: '4rem', color: '#fff', textAlign: 'center' }}>
        <h2>Project not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/analytics')}>Back to Analytics</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeInUp 0.4s ease' }}>
      
      {/* Back Navigation */}
      <div>
        <button 
          onClick={() => navigate('/analytics')}
          className="btn btn-secondary"
          style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569', color: '#e2e8f0', fontSize: '14px', padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Analytics Dashboard
        </button>
      </div>

      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '1rem 0', position: 'relative' 
      }}>
        {/* Root Node: Selected Project */}
        <div style={{ zIndex: 10, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '1.5rem 4rem', borderRadius: '12px', border: '1px solid #10b981', boxShadow: '0 0 50px rgba(16, 185, 129, 0.3)', textAlign: 'center', color: '#fff', position: 'relative' }}>
          <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 800, letterSpacing: '3px', marginBottom: '0.2rem', textTransform: 'uppercase' }}>{selectedProjectForFlow.domain || 'Project'} NODE</div>
          <div style={{ fontSize: '2rem', fontWeight: 900 }}>{selectedProjectForFlow.name}</div>
          <div style={{ fontSize: '16px', color: '#a7f3d0', fontWeight: 800, marginTop: '1rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '6px', display: 'inline-block' }}>
            Material Cost: ₹{selectedProjectForFlow.totalProjectCost.toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
          <button 
            onClick={() => navigate('/bom')}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', fontSize: '14px' }}
          >
            <Wand2 size={16} /> Edit / Add Materials in BOM Estimator
          </button>
        </div>
      </div>

      {selectedProjectForFlow.usedProducts.length === 0 ? (
        <div style={{ 
          background: '#1e293b', 
          border: '1px dashed #475569', 
          borderRadius: '12px', 
          padding: '3rem', 
          textAlign: 'center', 
          color: '#94a3b8',
          maxWidth: '600px',
          margin: '2rem auto'
        }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>No Materials Added Yet</h3>
          <p style={{ marginBottom: '1.5rem', fontSize: '14px' }}>This project does not have any materials in its Bill of Materials (BOM).</p>
          <button 
            onClick={() => navigate('/bom')}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.5rem' }}
          >
            Open BOM Estimator to Add Items
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem', width: '100%', maxWidth: '1400px', zIndex: 10 }}>
          {selectedProjectForFlow.usedProducts.map((prod, idx) => (
            <div key={`${prod.id}-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '2px', height: '30px', background: '#475569' }}></div>
              <div 
                style={{ 
                  background: '#1e293b', border: '1px solid #475569', borderRadius: '12px', padding: '1.5rem', width: '100%',
                  transition: 'all 0.2s ease', position: 'relative'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.boxShadow = '0 0 30px rgba(129, 140, 248, 0.3)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#475569'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '12px', color: '#818cf8', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase' }}>
                  <Wand2 size={12} /> {prod.categoryName}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', lineHeight: '1.4', marginBottom: '0.5rem' }}>{prod.name}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '1rem' }}>SKU: <span style={{ color: '#cbd5e1' }}>{prod.sku || 'N/A'}</span></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '1rem', marginBottom: '0.6rem' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Unit Price</div>
                  <div style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 700 }}>₹{prod.unitCost.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Quantity</div>
                  <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 800 }}>x{prod.quantity}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                  <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 800 }}>TOTAL</div>
                  <div style={{ fontSize: '16px', color: '#10b981', fontWeight: 900 }}>₹{prod.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
