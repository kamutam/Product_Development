import React, { useState, useEffect } from 'react';
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

import { CATEGORIES, INITIAL_PROJECTS, INITIAL_PRODUCTS } from './data/initialData';
import { NPD_MASTER_OEM_COMPANIES } from './data/fullDatabase';
import { fetchLiveGoogleSheetData } from './utils/googleSheetSync';

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
    localStorage.removeItem('brihaspathi_user');
  }, []);

  // State Management with LocalStorage persistence
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('spec_categories');
    const parsed = saved ? JSON.parse(saved) : [];
    const categoryMap = new Map();
    CATEGORIES.forEach(c => categoryMap.set(c.id, c));
    parsed.forEach(c => categoryMap.set(c.id, c));
    return Array.from(categoryMap.values());
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('spec_projects');
    const parsed = saved ? JSON.parse(saved) : [];
    const projectMap = new Map();
    INITIAL_PROJECTS.forEach(p => projectMap.set(p.id, p));
    parsed.forEach(p => projectMap.set(p.id, p));
    return Array.from(projectMap.values());
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('spec_products');
    const parsed = saved ? JSON.parse(saved) : [];
    const productMap = new Map();
    INITIAL_PRODUCTS.forEach(p => productMap.set(p.id, p));
    parsed.forEach(p => {
      if (p.link && p.link.includes('hrms.brihaspathi.in')) {
        p.link = 'https://brihaspathi.com';
      }
      const initMatch = INITIAL_PRODUCTS.find(i => i.id === p.id);
      if (initMatch) {
        p.imageKey = initMatch.imageKey;
      }
      productMap.set(p.id, p);
    });
    return Array.from(productMap.values());
  });

  const [requirements, setRequirements] = useState(() => {
    const saved = localStorage.getItem('spec_requirements');
    return saved ? JSON.parse(saved) : INITIAL_REQUIREMENTS;
  });

  const [emailHistory, setEmailHistory] = useState(() => {
    const saved = localStorage.getItem('spec_email_history');
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
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

  useEffect(() => {
    localStorage.setItem('spec_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('spec_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('spec_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('spec_requirements', JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
    localStorage.setItem('spec_email_history', JSON.stringify(emailHistory));
  }, [emailHistory]);

  const handleRecordEmail = (emailRecord) => {
    setEmailHistory(prev => [emailRecord, ...prev]);
  };

  const handleLogin = (userInfo) => {
    setUser(userInfo);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('brihaspathi_user');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
        {activeTab === 'dashboard' && (
          <Dashboard 
            projects={projects}
            products={products}
            categories={categories}
            oems={NPD_MASTER_OEM_COMPANIES}
            requirements={requirements}
            emailHistory={emailHistory}
            activeProjectId={selectedProjectId}
            setActiveTab={setActiveTab}
            setSelectedProjectId={setSelectedProjectId}
            onSelectProductForAudit={(prod, res) => setAuditModalData({ product: prod, res })}
            evaluatorStatusFilter={evaluatorStatusFilter}
            setEvaluatorStatusFilter={setEvaluatorStatusFilter}
            onOpenGlobalSearch={() => setShowGlobalSearch(true)}
          />
        )}

        {activeTab === 'requirements' && (
          <RequirementsManager 
            requirements={requirements}
            setRequirements={setRequirements}
            categories={categories}
            oems={NPD_MASTER_OEM_COMPANIES}
            products={products}
            setActiveTab={setActiveTab}
            onRecordEmail={handleRecordEmail}
          />
        )}

        {activeTab === 'oem-directory' && (
          <OEMCompanyDirectory 
            categories={categories}
            onRecordEmail={handleRecordEmail}
          />
        )}

        {activeTab === 'inspection-summary' && (
          <InspectionSummaryPage 
            projects={projects}
            products={products}
            categories={categories}
            activeProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            onSelectProductForAudit={(prod, res) => setAuditModalData({ product: prod, res })}
            onScheduleOEMMeeting={(prod, proj) => setOemMeetingData({ product: prod, project: proj })}
          />
        )}

        {activeTab === 'evaluator' && (
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
        )}

        {activeTab === 'meeting-room' && (
          <MeetingRoomHub 
            projects={projects}
            products={products}
          />
        )}

        {activeTab === 'certifications-vault' && (
          <CertificationVault />
        )}

        {activeTab === 'email-history' && (
          <EmailHistoryPage 
            emailHistory={emailHistory}
            setEmailHistory={setEmailHistory}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectManager 
            projects={projects}
            setProjects={setProjects}
            categories={categories}
            activeProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'products' && (
          <ProductCatalog 
            products={products}
            setProducts={setProducts}
            categories={categories}
            syncStatus={syncStatus}
            onSyncGoogleSheet={handleSyncGoogleSheet}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonMatrix 
            products={products}
            categories={categories}
            projects={projects}
            activeProjectId={selectedProjectId}
          />
        )}

        {activeTab === 'category-builder' && (
          <CategoryBuilder 
            categories={categories}
            setCategories={setCategories}
            setActiveTab={setActiveTab}
          />
        )}
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
          setActiveTab={setActiveTab}
          onSelectProductForAudit={(prod, res) => setAuditModalData({ product: prod, res })}
        />
      )}

      {/* Floating AI Chatbot Widget */}
      <AIChatbotWidget />
    </div>
  );
}
