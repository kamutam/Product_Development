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
  // Authentication State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('brihaspathi_user');
    return savedUser ? JSON.parse(savedUser) : null;
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
  const [auditModalData, setAuditModalData] = useState(null);
  const [oemMeetingData, setOemMeetingData] = useState(null);

  // Google Sheet Live Sync Status
  const [syncStatus, setSyncStatus] = useState({
    loading: false,
    lastSynced: '',
    count: 0,
    error: ''
  });

  // Function to sync with live Google Sheet
  const handleSyncGoogleSheet = async () => {
    setSyncStatus(prev => ({ ...prev, loading: true, error: '' }));
    const res = await fetchLiveGoogleSheetData();
    if (res.success && res.products.length > 0) {
      // Merge live Google Sheet products with existing non-sheet products (e.g. Streamax, ZKTeco, Solar)
      const nonSheetProducts = products.filter(p => !p.id.startsWith('prod-gsheet-') && !p.id.startsWith('prod-cpplus-stqc-'));
      const updatedProductsList = [...res.products, ...nonSheetProducts];
      
      setProducts(updatedProductsList);
      setSyncStatus({
        loading: false,
        lastSynced: res.lastSyncedTime,
        count: res.products.length,
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
    <div className="app-container">
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

      {/* Main Content Workspace */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            projects={projects}
            products={products}
            categories={categories}
            activeProjectId={selectedProjectId}
            setActiveTab={setActiveTab}
            setSelectedProjectId={setSelectedProjectId}
            onSelectProductForAudit={(prod, res) => setAuditModalData({ product: prod, res })}
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
