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

import { CATEGORIES, INITIAL_PROJECTS, INITIAL_PRODUCTS } from './data/initialData';
import { fetchLiveGoogleSheetData } from './utils/googleSheetSync';

export default function App() {
  // Authentication State (Auto-authenticates for Brihaspathi Team Lead)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('brihaspathi_user');
    return savedUser ? JSON.parse(savedUser) : {
      email: 'venu.m@brihaspathi.com',
      role: 'Product Development Team Lead',
      name: 'Venu M (Product Development)'
    };
  });

  // State Management with LocalStorage persistence fallback
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('spec_categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('spec_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('spec_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [evaluatorStatusFilter, setEvaluatorStatusFilter] = useState('ALL');
  const [auditModalData, setAuditModalData] = useState(null);
  const [oemMeetingData, setOemMeetingData] = useState(null);

  // Google Sheet Live Sync Status
  const [syncStatus, setSyncStatus] = useState({
    loading: false,
    lastSynced: '',
    count: 0,
    error: ''
  });

  // Function to sync with live Google Sheet and perform deep database audit
  const handleSyncGoogleSheet = async () => {
    setSyncStatus(prev => ({ ...prev, loading: true, error: '' }));
    const res = await fetchLiveGoogleSheetData();
    if (res.success && res.products.length > 0) {
      // Smart SKU-based merging & deep database deduplication
      const skuProductMap = new Map();

      // 1. Seed master catalog to guarantee full 9-domain coverage
      INITIAL_PRODUCTS.forEach(p => {
        const normKey = (p.sku || p.id).toUpperCase().replace(/[^A-Z0-9]/g, '');
        skuProductMap.set(normKey, p);
      });

      // 2. Merge existing custom/saved products
      products.forEach(p => {
        const normKey = (p.sku || p.id).toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!skuProductMap.has(normKey)) {
          skuProductMap.set(normKey, p);
        }
      });

      // 3. Enrich and update with live Google Sheet verified STQC cert links and FGTech URLs
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

  // Auto-sync Google Sheet on mount
  useEffect(() => {
    handleSyncGoogleSheet();
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('spec_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('spec_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('spec_products', JSON.stringify(products));
  }, [products]);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem('brihaspathi_user', JSON.stringify(userInfo));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('brihaspathi_user');
  };

  // If user is not authenticated, render Login Page!
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      {/* Dynamic Animated Ambient Background Orbs & Cyber Grid */}
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
      />

      {/* Main Content Workspace with 1-Click Page Entrance Animation */}
      <main className="main-content page-fade-in" key={activeTab}>
        {activeTab === 'dashboard' && (
          <Dashboard 
            projects={projects}
            products={products}
            categories={categories}
            activeProjectId={selectedProjectId}
            setActiveTab={setActiveTab}
            setSelectedProjectId={setSelectedProjectId}
            onSelectProductForAudit={(prod, res) => setAuditModalData({ product: prod, res })}
            evaluatorStatusFilter={evaluatorStatusFilter}
            setEvaluatorStatusFilter={setEvaluatorStatusFilter}
          />
        )}

        {activeTab === 'oem-directory' && (
          <OEMCompanyDirectory />
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

      {/* Floating AI Chatbot & T&C Widget at Bottom-Right Corner */}
      <AIChatbotWidget />
    </div>
  );
}
