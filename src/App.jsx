import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OEMCompanyDirectory from './components/OEMCompanyDirectory';
import InspectionSummaryPage from './components/InspectionSummaryPage';
import ComplianceEvaluator from './components/ComplianceEvaluator';
import MeetingRoomHub from './components/MeetingRoomHub';
import CertificationVault from './components/CertificationVault';
import ProjectManager from './components/ProjectManager';
import ProductCatalog from './components/ProductCatalog';
import ComparisonMatrix from './components/ComparisonMatrix';
import CategoryBuilder from './components/CategoryBuilder';
import AuditModal from './components/AuditModal';
import OEMMeetingModal from './components/OEMMeetingModal';
import AIChatbotWidget from './components/AIChatbotWidget';
import LoginPage from './components/LoginPage';
import RequirementsManager from './components/RequirementsManager';
import EmailHistoryPage from './components/EmailHistoryPage';
import GlobalSearchModal from './components/GlobalSearchModal';
import NotificationsPanel from './components/NotificationsPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import BOMEstimator from './components/BOMEstimator';
import SolutionsShowcase from './components/SolutionsShowcase';
import TenderAgentTab from './components/TenderAgentTab';
import ProjectMaterialView from './components/ProjectMaterialView';
import ProductCategoryView from './components/ProductCategoryView';

import { CATEGORIES, INITIAL_PROJECTS, INITIAL_PRODUCTS } from './data/initialData';
import { NPD_MASTER_OEM_COMPANIES } from './data/fullDatabase';
import { fetchLiveGoogleSheetData } from './utils/googleSheetSync';
import { supabase } from './utils/supabaseClient';

const INITIAL_REQUIREMENTS = [
  {
    id: 'req-1',
    title: '4MP Motorized Varifocal Bullet Camera for Rail Station CCTV',
    category: 'CCTV & Surveillance',
    solution: 'IP Bullet Camera',
    techSpecs: '4MP, 1/2.8" CMOS, 2.7-13.5mm Lens, 50m IR, IP67, STQC Lab Certified, ONVIF Profile S/G/T',
    quantity: '250 Units',
    location: 'Northern Railway Loco Shed / Station',
    project: 'Northern Railway STQC Locomotive CCTV',
    priority: 'Critical',
    requiredCertifications: 'STQC Certified, ONVIF',
    timeline: '15 Days',
    status: 'Researching',
    createdDate: '2026-08-10'
  },
  {
    id: 'req-2',
    title: 'Smart Pole Multi-Sensor IoT Node & Environmental Sensor Hub',
    category: 'Smart City Infrastructure',
    solution: 'Smart Pole IoT Node',
    techSpecs: 'AQI Sensor, Temperature, Humidity, Noise Monitoring, RS485/Modbus, IP66 Enclosure',
    quantity: '100 Units',
    location: 'Amaravati Capital Region',
    project: 'AP-CRDA Amaravati Smart City Smart Pole Project',
    priority: 'High',
    requiredCertifications: 'CE, FCC, RoHS',
    timeline: '30 Days',
    status: 'OEM Contacted',
    createdDate: '2026-08-12'
  }
];

const INITIAL_EMAILS = [
  {
    id: 'email-1',
    date: '2026-08-12',
    oemName: 'Aditya Infotech Ltd (CP PLUS)',
    oemEmail: 'gov.sales@cpplusworld.com',
    requirementTitle: '4MP Motorized Varifocal Bullet Camera STQC Certified',
    subject: 'Business Requirement: 4MP Motorized Varifocal Bullet Camera STQC Certified – Brihaspathi Technologies Limited',
    body: `Dear CP PLUS Team,\n\nWe are writing to you from Brihaspathi Technologies Limited...`,
    status: 'Sent'
  }
];

export default function App() {
  // Authentication State
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Check for active Supabase session (e.g. returning from Google OAuth redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = {
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Engineer',
          username: session.user.email?.split('@')[0] || 'user',
          email: session.user.email,
          role: 'Product Engineering Specialist',
          avatar: session.user.user_metadata?.avatar_url || null,
          isGoogleAuth: true
        };
        setUser(u);
        localStorage.setItem('brihaspathi_user', JSON.stringify(u));
      } else {
        const stored = localStorage.getItem('brihaspathi_user');
        if (stored) {
          try { setUser(JSON.parse(stored)); } catch (e) {}
        }
      }
    });

    // 2. Listen to Supabase Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const u = {
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Engineer',
          username: session.user.email?.split('@')[0] || 'user',
          email: session.user.email,
          role: 'Product Engineering Specialist',
          avatar: session.user.user_metadata?.avatar_url || null,
          isGoogleAuth: true
        };
        setUser(u);
        localStorage.setItem('brihaspathi_user', JSON.stringify(u));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('brihaspathi_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // State Management with Supabase (Pre-seeded with rich Master Datasets as initial fallbacks)
  const [categories, setCategories] = useState(CATEGORIES);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [requirements, setRequirements] = useState(INITIAL_REQUIREMENTS);
  const [emailHistory, setEmailHistory] = useState(INITIAL_EMAILS);
  const [procurementData, setProcurementData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { fetchProcurementData } = await import('./utils/procurementService');
        const [catRes, projRes, prodRes, reqRes, emailRes, poData] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('projects').select('*'),
          supabase.from('products').select('*'),
          supabase.from('requirements').select('*'),
          supabase.from('email_history').select('*'),
          fetchProcurementData()
        ]);

        if (catRes?.data && catRes.data.length > 0) {
          setCategories(catRes.data.map(c => ({...c, fields: typeof c.fields === 'string' ? JSON.parse(c.fields) : c.fields})));
        } else {
          setCategories(CATEGORIES);
        }

        if (projRes?.data && projRes.data.length > 0) {
          setProjects(projRes.data.map(p => ({
            ...p,
            requirements: typeof p.requirements === 'string' ? JSON.parse(p.requirements) : p.requirements,
            itemsQuantity: typeof p.itemsQuantity === 'string' ? JSON.parse(p.itemsQuantity) : p.itemsQuantity,
            savedBom: typeof p.savedBom === 'string' ? JSON.parse(p.savedBom) : (p.savedBom || [])
          })));
        } else {
          setProjects(INITIAL_PROJECTS);
        }

        if (prodRes?.data && prodRes.data.length > 0) {
          setProducts(prodRes.data.map(p => ({...p, specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs})));
        } else {
          setProducts(INITIAL_PRODUCTS);
        }

        if (reqRes?.data && reqRes.data.length > 0) {
          setRequirements(reqRes.data);
        } else {
          setRequirements(INITIAL_REQUIREMENTS);
        }

        if (emailRes?.data && emailRes.data.length > 0) {
          setEmailHistory(emailRes.data);
        } else {
          setEmailHistory(INITIAL_EMAILS);
        }

        if (poData && poData.length > 0) setProcurementData(poData);
      } catch (err) {
        console.error("Failed to load Supabase data, using master dataset defaults:", err);
        setCategories(CATEGORIES);
        setProjects(INITIAL_PROJECTS);
        setProducts(INITIAL_PRODUCTS);
        setRequirements(INITIAL_REQUIREMENTS);
        setEmailHistory(INITIAL_EMAILS);
      } finally {
        setIsDataLoaded(true);
      }
    }
    loadSupabaseData();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract activeTab from pathname (e.g. "/dashboard" -> "dashboard")
  const activeTab = location.pathname.split('/')[1] || 'analytics';

  const [selectedProjectId, setSelectedProjectId] = useState('proj-apcrda-smartpole');
  const [evaluatorStatusFilter, setEvaluatorStatusFilter] = useState('ALL');
  const [auditModalData, setAuditModalData] = useState(null);
  const [oemMeetingData, setOemMeetingData] = useState(null);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  // Google Sheet Live Sync Status
  const [syncStatus, setSyncStatus] = useState({
    loading: false,
    lastSynced: '',
    count: 0,
    error: ''
  });

  // Keyboard shortcut for Global Search (Ctrl + K / Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowGlobalSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSyncGoogleSheet = async () => {
    setSyncStatus(prev => ({ ...prev, loading: true, error: '' }));
    const res = await fetchLiveGoogleSheetData();
    if (res.success && res.products.length > 0) {
      const skuProductMap = new Map();

      // 1. Seed with master catalog defaults
      INITIAL_PRODUCTS.forEach(p => {
        const normKey = (p.sku || p.id).toUpperCase().replace(/[^A-Z0-9]/g, '');
        skuProductMap.set(normKey, p);
      });

      // 2. Override with user edited and newly added products (user state takes precedence)
      products.forEach(p => {
        const normKey = (p.sku || p.id).toUpperCase().replace(/[^A-Z0-9]/g, '');
        skuProductMap.set(normKey, p);
      });

      res.products.forEach(p => {
        const normKey = (p.sku || p.id).toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (skuProductMap.has(normKey)) {
          const existing = skuProductMap.get(normKey);
          skuProductMap.set(normKey, {
            ...existing,
            stqcPdfUrl: p.stqcPdfUrl || existing.stqcPdfUrl,
            fgTechStoreLink: p.fgTechStoreLink || existing.fgTechStoreLink,
            link: p.link || existing.link,
            testingStatus: p.testingStatus || existing.testingStatus,
            stqcCertNo: p.stqcCertNo || existing.stqcCertNo
          });
        } else {
          skuProductMap.set(normKey, p);
        }
      });

      const updatedProductsList = Array.from(skuProductMap.values());
      setProducts(updatedProductsList);
      localStorage.setItem('spec_products', JSON.stringify(updatedProductsList));

      setSyncStatus({
        loading: false,
        lastSynced: res.lastSyncedTime,
        count: updatedProductsList.length,
        error: ''
      });
    } else {
      setSyncStatus(prev => ({
        ...prev,
        loading: false,
        error: res.error || 'Could not parse Google Sheet rows'
      }));
    }
  };

  useEffect(() => {
    handleSyncGoogleSheet();
  }, []);

  const saveToSupabase = async (table, data) => {
    if (!isDataLoaded || data.length === 0) return;
    try {
      let formattedData = data;
      if (table === 'projects') formattedData = data.map(p => ({...p, requirements: JSON.stringify(p.requirements), itemsQuantity: JSON.stringify(p.itemsQuantity)}));
      if (table === 'products') formattedData = data.map(p => ({...p, specs: JSON.stringify(p.specs)}));
      if (table === 'categories') formattedData = data.map(c => ({...c, fields: JSON.stringify(c.fields)}));
      
      await supabase.from(table).upsert(formattedData);
    } catch (err) {
      console.error(`Error saving ${table}:`, err);
    }
  };

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('spec_categories', JSON.stringify(categories));
      saveToSupabase('categories', categories);
    }
  }, [categories, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('spec_projects', JSON.stringify(projects));
      saveToSupabase('projects', projects);
    }
  }, [projects, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('spec_products', JSON.stringify(products));
      saveToSupabase('products', products);
    }
  }, [products, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('spec_requirements', JSON.stringify(requirements));
      saveToSupabase('requirements', requirements);
    }
  }, [requirements, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('spec_email_history', JSON.stringify(emailHistory));
      saveToSupabase('email_history', emailHistory);
    }
  }, [emailHistory, isDataLoaded]);

  const handleRecordEmail = (emailRecord) => {
    setEmailHistory(prev => [emailRecord, ...prev]);
  };

  const handleLogin = (userInfo) => {
    setUser(userInfo);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setUser(null);
    localStorage.removeItem('brihaspathi_user');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (!isDataLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#38bdf8' }}>
        <h2 className="spin">Loading Cloud Database...</h2>
        <style>{`
          .spin { animation: pulse 1.5s infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      {/* Background Ambience */}
      <div className="animated-bg-container">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <div className="cyber-grid-overlay" />
        <div className="beam-sweep" />
      </div>

      {/* Left Sidebar Navigation */}
      <Sidebar 
        projects={projects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        user={user}
        onLogout={handleLogout}
        requirementsCount={requirements.length}
        emailCount={emailHistory.length}
        onOpenGlobalSearch={() => setShowGlobalSearch(true)}
      />

      {/* Main Content Workspace */}
      <main className="main-content page-fade-in" key={activeTab}>
        <div className="glass-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', textShadow: '0 2px 10px rgba(0,242,254,0.3)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {activeTab === 'tender-agent' 
                ? 'Product Development: Tender Scope & Technical Homologation' 
                : (activeTab === 'dashboard' ? 'Platform Overview' : activeTab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}
            </h1>
            {activeTab === 'tender-agent' && (
              <span style={{ fontSize: '10.5px', background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.35)', color: '#38bdf8', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                Product Engineering View
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowGlobalSearch(true)} style={{ borderRadius: '20px', padding: '0.4rem 1rem' }}>
               🔍 Quick Search (Ctrl+K)
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {user.avatar ? (
                <img src={user.avatar} alt="User Avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #00f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '12px' }}>
                  {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span style={{ fontWeight: 700, fontSize: '12px', color: '#fff' }}>{user.name || user.username}</span>
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/analytics" replace />} />
          
          <Route path="/solutions-showcase" element={<SolutionsShowcase />} />
          
          <Route path="/tender-agent" element={<TenderAgentTab products={products} />} />
          
          <Route path="/analytics/project/:projectId" element={
            <ProjectMaterialView 
              projects={projects}
              products={products}
              categories={categories}
            />
          } />

          <Route path="/analytics" element={
            <AnalyticsDashboard 
              projects={projects}
              products={products}
              requirements={requirements}
              categories={categories}
              user={user}
              onLogout={handleLogout}
              emailHistory={emailHistory}
            />
          } />

          <Route path="/bom" element={
            <BOMEstimator 
              projects={projects}
              setProjects={setProjects}
              products={products}
              procurementData={procurementData}
            />
          } />

          <Route path="/dashboard" element={
            <Dashboard 
              projects={projects}
              products={products}
              categories={categories}
              oems={NPD_MASTER_OEM_COMPANIES}
              requirements={requirements}
              emailHistory={emailHistory}
              activeProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              onSelectProductForAudit={(prod, res) => setAuditModalData({ product: prod, res })}
              evaluatorStatusFilter={evaluatorStatusFilter}
              setEvaluatorStatusFilter={setEvaluatorStatusFilter}
              onOpenGlobalSearch={() => setShowGlobalSearch(true)}
            />
          } />

          <Route path="/requirements" element={
            <RequirementsManager 
              requirements={requirements}
              setRequirements={setRequirements}
              categories={categories}
              oems={NPD_MASTER_OEM_COMPANIES}
              products={products}
              onRecordEmail={handleRecordEmail}
            />
          } />

          <Route path="/oem-directory" element={
            <OEMCompanyDirectory 
              categories={categories}
              procurementData={procurementData}
              onRecordEmail={handleRecordEmail}
            />
          } />

          <Route path="/inspection-summary" element={
            <InspectionSummaryPage 
              projects={projects}
              products={products}
              categories={categories}
              activeProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              onSelectProductForAudit={(prod, res) => setAuditModalData({ product: prod, res })}
              onScheduleOEMMeeting={(prod, proj) => setOemMeetingData({ product: prod, project: proj })}
            />
          } />

          <Route path="/evaluator" element={
            <ComplianceEvaluator 
              projects={projects}
              products={products}
              categories={categories}
              activeProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              onSelectProductForAudit={(prod, res) => setAuditModalData({ product: prod, res })}
              onScheduleOEMMeeting={(prod, proj) => setOemMeetingData({ product: prod, project: proj })}
              statusFilter={evaluatorStatusFilter}
              setStatusFilter={setEvaluatorStatusFilter}
            />
          } />

          <Route path="/meeting-room" element={
            <MeetingRoomHub 
              projects={projects}
              products={products}
            />
          } />

          <Route path="/certifications-vault" element={
            <CertificationVault />
          } />

          <Route path="/email-history" element={
            <EmailHistoryPage 
              emailHistory={emailHistory}
              setEmailHistory={setEmailHistory}
            />
          } />

          <Route path="/notifications" element={
            <NotificationsPanel />
          } />

          <Route path="/projects" element={
            <ProjectManager 
              projects={projects}
              setProjects={setProjects}
              categories={categories}
              products={products}
              activeProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
            />
          } />

          <Route path="/products/:categoryId" element={
            <ProductCategoryView 
              products={products}
              categories={categories}
            />
          } />

          <Route path="/products" element={
            <ProductCatalog 
              products={products}
              setProducts={setProducts}
              categories={categories}
              procurementData={procurementData}
              syncStatus={syncStatus}
              onSyncGoogleSheet={handleSyncGoogleSheet}
            />
          } />

          <Route path="/comparison" element={
            <ComparisonMatrix 
              products={products}
              categories={categories}
              projects={projects}
              activeProjectId={selectedProjectId}
            />
          } />

          <Route path="/category-builder" element={
            <CategoryBuilder 
              categories={categories}
              setCategories={setCategories}
            />
          } />
          
          <Route path="*" element={<Navigate to="/analytics" replace />} />
        </Routes>
      </main>

      {/* Full Audit Checklist Modal */}
      {auditModalData && (
        <AuditModal 
          data={auditModalData}
          activeProject={projects.find(p => p.id === selectedProjectId)}
          activeCategory={categories.find(c => c.id === (projects.find(p => p.id === selectedProjectId)?.categoryId))}
          allProducts={products}
          onSelectProductForAudit={(prod, res) => setAuditModalData({ product: prod, res })}
          onScheduleOEMMeeting={(prod, proj) => {
            setAuditModalData(null);
            setOemMeetingData({ product: prod, project: proj });
          }}
          onClose={() => setAuditModalData(null)}
        />
      )}

      {/* OEM Instant Meeting Scheduler Modal */}
      {oemMeetingData && (
        <OEMMeetingModal 
          product={oemMeetingData.product}
          project={oemMeetingData.project}
          onClose={() => setOemMeetingData(null)}
        />
      )}

      {/* Global Search Overlay Modal */}
      {showGlobalSearch && (
        <GlobalSearchModal 
          products={products}
          oems={NPD_MASTER_OEM_COMPANIES}
          categories={categories}
          onClose={() => setShowGlobalSearch(false)}
          onSelectProductForAudit={(prod, res) => setAuditModalData({ product: prod, res })}
        />
      )}

      {/* Floating AI Chatbot Widget */}
      <AIChatbotWidget />
    </div>
  );
}
