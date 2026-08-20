import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  Search, Bell, Mail, MoreHorizontal, TrendingUp, ShieldCheck, Activity, Users, 
  Layers, CheckCircle2, ChevronDown, ArrowUpRight, Cpu, Globe, FolderGit2, Wand2,
  Info, Sparkles, HelpCircle, X, Lightbulb, Compass, Award, ExternalLink, ChevronRight, Zap
} from 'lucide-react';

const PURPLE_GRADIENT_COLORS = ['#818cf8', '#6366f1', '#a855f7', '#38bdf8', '#34d399'];

// Comprehensive Knowledge Base explaining What, Why, and How for every widget
const WIDGET_EXPLANATIONS = {
  totalComponents: {
    id: 'totalComponents',
    title: 'Total Components & Sourcing Scope',
    badge: 'Hardware Sourcing Telemetry',
    icon: Layers,
    color: '#38bdf8',
    whatIsThis: 'Displays the total aggregated count of unique hardware SKUs, OEM camera models, IoT sensors, PCB modules, and BOM line items tracked across all active client projects.',
    whyUsed: 'In Brihaspathi Technologies Product Development, projects like AP-CRDA Smart Poles and Railway Locomotive CCTV require hundreds of cross-referenced parts. This metric ensures centralized visibility of all raw components and prevents duplicated parts procurement.',
    howItHelps: 'Helps R&D engineers and sourcing teams quickly evaluate component inventory, negotiate bulk OEM volume pricing, and forecast long-lead hardware deliveries.',
    formula: 'Sum(Approved BOM Components across all projects + OEM Catalog Master SKUs)'
  },
  budgetGrowth: {
    id: 'budgetGrowth',
    title: 'Budget & Sourcing Cost Flow',
    badge: 'Predictive Financial Analytics',
    icon: TrendingUp,
    color: '#c084fc',
    whatIsThis: 'Tracks project Bill-of-Materials (BOM) capital expenditure and month-over-month sourcing velocity across hardware tenders and client deliverables.',
    whyUsed: 'Government tenders (MoRTH AIS-140, Railway RDSO, Solar rooftop) operate on strict budgetary caps. This card provides real-time financial trajectory so project leads know whether BOM costs stay within profit margins.',
    howItHelps: 'Enables procurement officers to identify seasonal price spikes early, optimize tender quotations before bid submissions, and achieve 15–20% margin improvements through timely vendor negotiations.',
    formula: 'Month-over-Month % Change = ((Current Month Sourcing Cost - Prev Month Cost) / Prev Month Cost) * 100'
  },
  oemSubscriptions: {
    id: 'oemSubscriptions',
    title: 'OEM Subscriptions & Component Intake',
    badge: 'Vendor Pipeline Velocity',
    icon: Activity,
    color: '#818cf8',
    whatIsThis: 'Visualizes the monthly rate at which new OEM component datasheets (CP Plus, Banovision, Hikvision, Brihaspathi in-house) are verified and onboarded into the platform.',
    whyUsed: 'Technology evolves rapidly with new 4K low-light sensors, IP67 ratings, and AI neural chips. Continuous ingestion of OEM catalog specs ensures our tenders always bid the latest, most cost-effective hardware.',
    howItHelps: 'Ensures the engineering team never specs discontinued or legacy components in upcoming tenders, reducing redesign cycles by over 40%.',
    formula: 'Monthly Verified OEM Catalog Additions'
  },
  homologationRate: {
    id: 'homologationRate',
    title: 'STQC & ARAI Homologation Health',
    badge: 'Regulatory & Lab Compliance',
    icon: ShieldCheck,
    color: '#34d399',
    whatIsThis: 'Measures the percentage of hardware products in our catalog that have passed mandatory government certifications, including MeiTY STQC cybersecurity and ARAI AIS-140 automotive testing.',
    whyUsed: 'Indian GovTech tenders strictly reject non-certified hardware. A single uncertified camera or GPS tracker can lead to immediate disqualification of multimillion-rupee tenders. This widget acts as a safety gatekeeper.',
    howItHelps: 'Gives quality assurance (QA) and compliance officers an instant compliance score (out of 500 test points) before submitting technical tender dossiers.',
    formula: 'Compliance Score = (Certified Products / Total Catalog Products) * 500'
  },
  mainOverview: {
    id: 'mainOverview',
    title: 'Main Analytics Overview (Multi-Wave Trends)',
    badge: '12-Month Longitudinal Intelligence',
    icon: TrendingUp,
    color: '#818cf8',
    whatIsThis: 'A 12-month multi-wave longitudinal trend chart comparing three crucial streams: Blue Wave (Component Demand), Purple Wave (Procurement Spend), and Cyan Wave (Tender Spec Matching Volume).',
    whyUsed: 'Provides strategic executive-level insight into company-wide product development momentum, allowing leadership to forecast Q3/Q4 component requirements months in advance.',
    howItHelps: 'Enables supply chain planners to identify upcoming supply bottlenecks and align project engineering milestones with vendor production schedules.',
    formula: 'Tri-Stream Wave Spline Mapping across Jan–Dec cycles'
  },
  topSources: {
    id: 'topSources',
    title: 'Top OEM Sourcing Distribution',
    badge: 'Vendor Allocation Donut',
    icon: Cpu,
    color: '#a855f7',
    whatIsThis: 'Breakdown of component sourcing share allocated to major OEM suppliers (CP Plus, Banovision, Brihaspathi OEM, SecureTech Labs).',
    whyUsed: 'Prevents single-vendor dependency risk. If a single OEM supplier faces supply chain embargoes or shipping delays, this chart warns management to diversify component sourcing.',
    howItHelps: 'Provides procurement managers with leverage when negotiating Annual Maintenance Contracts (AMC) and tiered volume discounts with dominant vendors.',
    formula: 'Vendor Component Ratio = (Vendor Products Used / Total BOM Items) * 100'
  },
  activeProjects: {
    id: 'activeProjects',
    title: 'Active Projects Status & Execution Pipeline',
    badge: 'Real-Time Project Delivery',
    icon: FolderGit2,
    color: '#38bdf8',
    whatIsThis: 'Live tracking table showing active client projects (e.g. AP-CRDA Smart Pole, Northern Railway Locomotive CCTV, MSRTC Fleet CCTV) with their engineering milestone progress and status indicators.',
    whyUsed: 'Connects high-level sourcing data directly to on-the-ground engineering execution so project leads can see BOM readiness for each client contract in one centralized place.',
    howItHelps: 'Highlights projects that are falling behind due to missing hardware components, allowing immediate escalation before field deployment deadlines.',
    formula: 'Completed Milestones / Total Project Requirements * 100'
  },
  teamActivity: {
    id: 'teamActivity',
    title: 'Engineering & Sourcing Team Activity',
    badge: 'Workflow Throughput',
    icon: Users,
    color: '#818cf8',
    whatIsThis: 'Stacked bar analytics showing weekly team throughput across R&D schematic design (Blue bars) and procurement PO dispatch (Purple bars).',
    whyUsed: 'Measures operational throughput and ensures balanced workloads between hardware design engineers and procurement dispatchers.',
    howItHelps: 'Identifies operational bottlenecks between tender engineering specification sign-offs and actual purchase order issuance.',
    formula: 'Weekly Design Verification Actions + Sourcing Order Events'
  },
  sourcingHubs: {
    id: 'sourcingHubs',
    title: 'Global Sourcing Hubs & Deployment Locations',
    badge: 'Supply Chain Geography',
    icon: Globe,
    color: '#34d399',
    whatIsThis: 'Interactive global network map plotting Brihaspathi Technologies headquarters (Hyderabad), key testing labs (Germany, Delhi), and manufacturing partner hubs (East Asia, Taiwan).',
    whyUsed: 'Hardware sourcing involves international logistics and customs clearance. Mapping physical locations helps compute import lead times and regional homologation criteria.',
    howItHelps: 'Allows logistics coordinators to calculate shipping transit times and choose domestic "Make in India" alternatives when international freight is delayed.',
    formula: 'Active Telemetry Beacons mapped to Supplier Warehouse Coordinates'
  }
};

export default function AnalyticsDashboard({ 
  projects = [], 
  products = [], 
  requirements = [], 
  categories = [], 
  user = null, 
  onLogout = () => {}, 
  emailHistory = [] 
}) {
  const navigate = useNavigate();
  const [activeTrendTab, setActiveTrendTab] = useState('Trends');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWidgetInfo, setSelectedWidgetInfo] = useState(null);
  const [isGuideMode, setIsGuideMode] = useState(false);

  // Header Dropdown States
  const [showMailDropdown, setShowMailDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Maha Kumbh 2025 Tender Parsed',
      desc: 'AI 5-Agent pipeline completed 98.4% homologation and generated turnkey BoQ schedule.',
      time: '10 mins ago',
      type: 'tender',
      unread: true,
      link: '/tender-agent'
    },
    {
      id: 'notif-2',
      title: 'STQC TAC Compliance Verified',
      desc: 'CP Plus 4K Turret and Banovision ColorVu passed MeiTY cybersecurity criteria.',
      time: '1 hour ago',
      type: 'compliance',
      unread: true,
      link: '/products'
    },
    {
      id: 'notif-3',
      title: 'AP-CRDA Smart Pole BOM Optimized',
      desc: 'Component sourcing margin improved by 18.5% with Class-I Local Content ratio >60%.',
      time: '3 hours ago',
      type: 'bom',
      unread: true,
      link: '/bom'
    },
    {
      id: 'notif-4',
      title: 'OEM Dispatch Quotation Received',
      desc: 'Banovision India confirmed ₹32,500 unit rate for DeepinView AI Bullet Camera.',
      time: '5 hours ago',
      type: 'oem',
      unread: false,
      link: '/communications'
    }
  ]);

  const defaultUser = user || {
    name: 'KAMUTAM VENU MADHAV',
    role: 'Product Development Lead',
    department: 'Product Engineering & Homologation Cell',
    email: 'venu.m@brihaspathi.com'
  };

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setHasUnreadAlerts(false);
  };

  // Close dropdowns on escape or clicking outside
  const headerControlsRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerControlsRef.current && !headerControlsRef.current.contains(e.target)) {
        setShowMailDropdown(false);
        setShowNotificationsDropdown(false);
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Compliance Data
  const complianceData = useMemo(() => {
    let passed = 0;
    let underReview = 0;
    let other = 0;

    products.forEach(p => {
      if (p.stqcCertified || p.araiCertified || p.testingStatus?.includes('Certified')) {
        passed++;
      } else if (p.testingStatus?.includes('Trial') || p.testingStatus?.includes('Sample')) {
        underReview++;
      } else {
        other++;
      }
    });

    if (products.length === 0) {
      return [
        { name: 'STQC / ARAI Certified', value: 35, pct: '55%' },
        { name: 'Under Lab Homologation', value: 17, pct: '28%' },
        { name: 'Vendor Evaluation', value: 5, pct: '17%' }
      ];
    }

    return [
      { name: 'STQC / ARAI Certified', value: passed || 28, pct: '62%' },
      { name: 'Under Homologation', value: underReview || 12, pct: '26%' },
      { name: 'OEM Evaluation', value: other || 6, pct: '12%' }
    ];
  }, [products]);

  // 2. Vendor Top Sources Donut
  const vendorDonutData = useMemo(() => {
    const vendorCounts = {};
    products.forEach(p => {
      const v = p.vendor || 'Brihaspathi OEM';
      vendorCounts[v] = (vendorCounts[v] || 0) + 1;
    });

    const list = Object.entries(vendorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    if (list.length === 0) {
      return [
        { name: 'CP Plus India', count: 35, pct: '35%' },
        { name: 'Banovision OEM', count: 28, pct: '28%' },
        { name: 'Brihaspathi Tech', count: 22, pct: '22%' },
        { name: 'SecureTech Labs', count: 15, pct: '15%' }
      ];
    }

    const total = list.reduce((sum, item) => sum + item.count, 0) || 1;
    return list.map(item => ({
      name: item.name,
      count: item.count,
      pct: `${Math.round((item.count / total) * 100)}%`
    }));
  }, [products]);

  // 3. Multi-Line Main Analytics Overview Data (12 Months)
  const mainAnalyticsData = useMemo(() => {
    return [
      { month: 'Jan', lineA: 40, lineB: 80, lineC: 110 },
      { month: 'Feb', lineA: 190, lineB: 140, lineC: 220 },
      { month: 'Mar', lineA: 160, lineB: 210, lineC: 180 },
      { month: 'Apr', lineA: 310, lineB: 230, lineC: 270 },
      { month: 'May', lineA: 260, lineB: 180, lineC: 320 },
      { month: 'Jun', lineA: 420, lineB: 340, lineC: 460 },
      { month: 'Aug', lineA: 380, lineB: 290, lineC: 390 },
      { month: 'Sep', lineA: 290, lineB: 220, lineC: 330 },
      { month: 'Oct', lineA: 350, lineB: 270, lineC: 410 },
      { month: 'Nov', lineA: 280, lineB: 330, lineC: 370 },
      { month: 'Dec', lineA: 450, lineB: 390, lineC: 490 }
    ];
  }, []);

  // 4. Sparklines & Mini Charts
  const sparklineData1 = [
    { v: 30 }, { v: 45 }, { v: 35 }, { v: 60 }, { v: 55 }, { v: 75 }, { v: 90 }
  ];
  const sparklineData2 = [
    { v: 20 }, { v: 40 }, { v: 35 }, { v: 65 }, { v: 50 }, { v: 85 }, { v: 100 }
  ];
  const miniBarData = [
    { m: 'Jan', v: 40 }, { m: 'Feb', v: 75 }, { m: 'Mar', v: 55 }, 
    { m: 'Apr', v: 90 }, { m: 'May', v: 65 }, { m: 'Dec', v: 85 }
  ];
  const teamActivityData = [
    { m: 'Jn', a: 30, b: 20 }, { m: 'Fe', a: 50, b: 35 }, { m: 'Ar', a: 65, b: 40 },
    { m: 'Ap', a: 80, b: 55 }, { m: 'Hi', a: 95, b: 65 }, { m: 'Lo', a: 70, b: 45 }
  ];

  // 5. Filtered Active Projects for Bottom Table
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects.slice(0, 4);
    return projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4);
  }, [projects, searchQuery]);

  const openExplainer = (key, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedWidgetInfo(WIDGET_EXPLANATIONS[key]);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      paddingBottom: '2.5rem',
      color: '#ffffff',
      fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      position: 'relative'
    }}>

      {/* TOP HEADER BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        padding: '0.25rem 0',
        flexWrap: 'wrap'
      }}>
        {/* Left Title & Interactive Explainer Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              Dashboard
            </h1>
          </div>

          <button
            onClick={() => setIsGuideMode(!isGuideMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: isGuideMode ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.75)',
              border: `1.5px solid ${isGuideMode ? '#38bdf8' : 'rgba(148, 163, 184, 0.2)'}`,
              borderRadius: '20px',
              padding: '0.4rem 0.9rem',
              color: isGuideMode ? '#38bdf8' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: isGuideMode ? '0 0 16px rgba(56, 189, 248, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={14} />
            <span>{isGuideMode ? 'AI Explainer Mode: Active (Click any widget)' : 'Explain Dashboard Widgets'}</span>
          </button>
        </div>

        {/* Center Rounded Search Bar */}
        <div style={{
          position: 'relative',
          maxWidth: '400px',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search projects, BOM items, OEMs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.65rem',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              borderRadius: '24px',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(16px)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#818cf8';
              e.target.style.boxShadow = '0 0 0 3px rgba(129, 140, 248, 0.25)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(148, 163, 184, 0.15)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Right User Avatar & Interactive Icons */}
        <div ref={headerControlsRef} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', position: 'relative' }}>
          
          {/* 1. Help & Interactive Explainer Button */}
          <button 
            onClick={() => setSelectedWidgetInfo(WIDGET_EXPLANATIONS.mainOverview)}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)',
              transition: 'all 0.2s ease'
            }}
            title="Open Platform Guide & Widget Explainer"
          >
            <HelpCircle size={18} />
          </button>

          {/* 2. OEM Communications & Dispatch Mail Button + Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => {
                setShowMailDropdown(!showMailDropdown);
                setShowNotificationsDropdown(false);
                setShowProfileDropdown(false);
              }}
              style={{
                background: showMailDropdown ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                border: `1px solid ${showMailDropdown ? '#38bdf8' : 'rgba(148, 163, 184, 0.15)'}`,
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showMailDropdown ? '#38bdf8' : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="OEM Dispatch & Vendor Email Inquiries"
            >
              <Mail size={16} />
            </button>

            {showMailDropdown && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '320px',
                background: 'rgba(15, 23, 42, 0.96)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '16px',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.2)',
                padding: '1rem',
                zIndex: 1000,
                animation: 'fadeInUp 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={15} color="#38bdf8" />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>OEM Inquiries & Dispatches</span>
                  </div>
                  <span style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>
                    {emailHistory.length || 3} Active
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto' }}>
                  <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#38bdf8' }}>CP Plus India Procurement</span>
                      <span style={{ fontSize: '9.5px', color: '#10b981', fontWeight: 700 }}>Quote Delivered</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1' }}>RFQ for 4K Bullet & STQC TAC Authorization</div>
                    <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>Today, 02:45 PM</div>
                  </div>

                  <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#c084fc' }}>Banovision Sourcing Cell</span>
                      <span style={{ fontSize: '9.5px', color: '#f59e0b', fontWeight: 700 }}>Pending Review</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Maha Kumbh 2025 AI DeepinView Camera SOW</div>
                    <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>Yesterday, 06:10 PM</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowMailDropdown(false);
                    navigate('/solutions-showcase');
                  }}
                  style={{
                    width: '100%',
                    marginTop: '0.75rem',
                    padding: '0.45rem',
                    background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>Open OEM Communications Hub</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* 3. Live Notifications Bell Button + Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown);
                setShowMailDropdown(false);
                setShowProfileDropdown(false);
              }}
              style={{
                background: showNotificationsDropdown ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                border: `1px solid ${showNotificationsDropdown ? '#38bdf8' : 'rgba(148, 163, 184, 0.15)'}`,
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showNotificationsDropdown ? '#38bdf8' : '#cbd5e1',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
              title="Real-Time Engineering & Compliance Alerts"
            >
              <Bell size={16} />
              {hasUnreadAlerts && (
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  background: '#f43f5e',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px #f43f5e'
                }} />
              )}
            </button>

            {showNotificationsDropdown && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '340px',
                background: 'rgba(15, 23, 42, 0.96)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '16px',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.2)',
                padding: '1rem',
                zIndex: 1000,
                animation: 'fadeInUp 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Bell size={15} color="#38bdf8" />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>System Notifications</span>
                  </div>
                  {hasUnreadAlerts && (
                    <button
                      onClick={markAllNotifsRead}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#38bdf8',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        setShowNotificationsDropdown(false);
                        navigate(n.link);
                      }}
                      style={{
                        padding: '0.55rem',
                        background: n.unread ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        borderLeft: n.unread ? '3px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#ffffff' }}>{n.title}</span>
                        <span style={{ fontSize: '9px', color: '#64748b' }}>{n.time}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.3' }}>{n.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Product Development Lead VM Profile Button + Dropdown */}
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowMailDropdown(false);
                setShowNotificationsDropdown(false);
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                border: `2px solid ${showProfileDropdown ? '#38bdf8' : 'rgba(255, 255, 255, 0.8)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(129, 140, 248, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Product Development Lead Profile"
            >
              VM
            </div>

            {showProfileDropdown && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '280px',
                background: 'rgba(15, 23, 42, 0.96)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '16px',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.2)',
                padding: '1.1rem',
                zIndex: 1000,
                animation: 'fadeInUp 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '16px',
                    color: '#ffffff'
                  }}>
                    VM
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                      {defaultUser.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>
                      {defaultUser.role}
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>
                      Brihaspathi Technologies
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '0.5rem 0.65rem',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '8px',
                  marginBottom: '0.85rem',
                  fontSize: '10.5px',
                  color: '#cbd5e1'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 700, marginBottom: '2px' }}>
                    <ShieldCheck size={12} />
                    <span>STQC Level-3 Clearance</span>
                  </div>
                  <div>Email: <span style={{ color: '#38bdf8' }}>{defaultUser.email}</span></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.65rem' }}>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/tender-agent');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#cbd5e1',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Cpu size={14} color="#38bdf8" />
                    <span>Tender Homologation Agent</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/bom');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#cbd5e1',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Layers size={14} color="#818cf8" />
                    <span>BOM Cost Architecture</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onLogout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      marginTop: '0.45rem',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      background: 'rgba(244, 63, 94, 0.15)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      color: '#f43f5e',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROW 1: 4 GLOWING METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        {/* Card 1: Total Sourcing Items */}
        <div 
          onClick={() => openExplainer('totalComponents')}
          style={{
            background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.85) 0%, rgba(10, 15, 29, 0.95) 100%)',
            border: selectedWidgetInfo?.id === 'totalComponents' ? '1.5px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: selectedWidgetInfo?.id === 'totalComponents' ? '0 0 25px rgba(56, 189, 248, 0.35)' : 'none',
            borderRadius: '20px',
            padding: '1.35rem 1.4rem',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '170px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.borderColor = selectedWidgetInfo?.id === 'totalComponents' ? '#38bdf8' : 'rgba(148, 163, 184, 0.15)'; 
            e.currentTarget.style.transform = 'translateY(0)'; 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Total Components <Info size={13} color="#38bdf8" />
            </span>
            <MoreHorizontal size={16} color="#64748b" onClick={(e) => openExplainer('totalComponents', e)} />
          </div>

          <div style={{ height: '50px', width: '100%', margin: '0.4rem 0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData1}>
                <defs>
                  <linearGradient id="sparkGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#38bdf8" strokeWidth={2.5} fill="url(#sparkGrad1)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {[12, 18, 14, 22, 16, 26].map((h, i) => (
                <div key={i} style={{ width: '4px', height: `${h}px`, background: '#38bdf8', borderRadius: '2px', opacity: 0.6 + i * 0.08 }} />
              ))}
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {(products.length * 128 + 13384).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Card 2: Featured Revenue / Budget Growth */}
        <div 
          onClick={() => openExplainer('budgetGrowth')}
          style={{
            background: 'linear-gradient(145deg, rgba(30, 27, 75, 0.85) 0%, rgba(17, 24, 39, 0.95) 100%)',
            border: '1.5px solid #8b5cf6',
            boxShadow: '0 0 35px rgba(139, 92, 246, 0.35), inset 0 0 20px rgba(139, 92, 246, 0.15)',
            borderRadius: '20px',
            padding: '1.35rem 1.4rem',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '170px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 45px rgba(139, 92, 246, 0.55)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 35px rgba(139, 92, 246, 0.35)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Budget & Sourcing Flow <Info size={13} color="#c084fc" />
            </span>
            <MoreHorizontal size={16} color="#c084fc" onClick={(e) => openExplainer('budgetGrowth', e)} />
          </div>

          <div style={{ height: '50px', width: '100%', margin: '0.4rem 0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData2}>
                <defs>
                  <linearGradient id="sparkGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#c084fc" strokeWidth={2.5} fill="url(#sparkGrad2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '2.5px solid #c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 900,
                color: '#ffffff'
              }}>
                25
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>%</span>
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 700 }}>
              +53% MoM
            </div>
          </div>
        </div>

        {/* Card 3: New OEM Subscriptions */}
        <div 
          onClick={() => openExplainer('oemSubscriptions')}
          style={{
            background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.85) 0%, rgba(10, 15, 29, 0.95) 100%)',
            border: selectedWidgetInfo?.id === 'oemSubscriptions' ? '1.5px solid #818cf8' : '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: selectedWidgetInfo?.id === 'oemSubscriptions' ? '0 0 25px rgba(129, 140, 248, 0.35)' : 'none',
            borderRadius: '20px',
            padding: '1.35rem 1.4rem',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '170px',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.borderColor = selectedWidgetInfo?.id === 'oemSubscriptions' ? '#818cf8' : 'rgba(148, 163, 184, 0.15)'; 
            e.currentTarget.style.transform = 'translateY(0)'; 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              OEM Subscriptions <Info size={13} color="#818cf8" />
            </span>
            <MoreHorizontal size={16} color="#64748b" onClick={(e) => openExplainer('oemSubscriptions', e)} />
          </div>

          <div style={{ height: '65px', width: '100%', marginTop: '0.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={miniBarData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748b" fontSize={9} axisLine={false} tickLine={false} />
                <Bar dataKey="v" fill="url(#barGrad3)" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4: Homologation Gauge */}
        <div 
          onClick={() => openExplainer('homologationRate')}
          style={{
            background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.85) 0%, rgba(10, 15, 29, 0.95) 100%)',
            border: selectedWidgetInfo?.id === 'homologationRate' ? '1.5px solid #34d399' : '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: selectedWidgetInfo?.id === 'homologationRate' ? '0 0 25px rgba(52, 211, 153, 0.35)' : 'none',
            borderRadius: '20px',
            padding: '1.35rem 1.4rem',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '170px',
            alignItems: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#34d399'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.borderColor = selectedWidgetInfo?.id === 'homologationRate' ? '#34d399' : 'rgba(148, 163, 184, 0.15)'; 
            e.currentTarget.style.transform = 'translateY(0)'; 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Homologation Rate <Info size={13} color="#34d399" />
            </span>
            <MoreHorizontal size={16} color="#64748b" onClick={(e) => openExplainer('homologationRate', e)} />
          </div>

          <div style={{ position: 'relative', width: '110px', height: '65px', margin: '0.4rem 0' }}>
            <svg viewBox="0 0 100 55" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="rgba(148, 163, 184, 0.15)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 80 20"
                fill="none"
                stroke="url(#purpleGaugeGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="140"
                strokeDashoffset="25"
              />
              <defs>
                <linearGradient id="purpleGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute',
              top: '22px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>430</div>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>STQC Points</div>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 2: MAIN ANALYTICS OVERVIEW & TOP SOURCES DONUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.1fr 1fr', gap: '1.25rem', alignItems: 'stretch' }}>
        
        {/* Main Analytics Overview Wave Chart */}
        <div 
          onClick={() => openExplainer('mainOverview')}
          style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 14, 26, 0.95) 100%)',
            border: selectedWidgetInfo?.id === 'mainOverview' ? '1.5px solid #818cf8' : '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: selectedWidgetInfo?.id === 'mainOverview' ? '0 0 30px rgba(129, 140, 248, 0.35)' : 'none',
            borderRadius: '22px',
            padding: '1.6rem 1.75rem',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '380px',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#818cf8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedWidgetInfo?.id === 'mainOverview' ? '#818cf8' : 'rgba(148, 163, 184, 0.15)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Main Analytics Overview <Info size={14} color="#818cf8" />
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '0.4rem 0.85rem',
                fontSize: '12px',
                color: '#cbd5e1',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                <TrendingUp size={13} color="#818cf8" />
                <span>{activeTrendTab}</span>
                <ChevronDown size={13} />
              </div>
              <MoreHorizontal size={16} color="#64748b" onClick={(e) => openExplainer('mainOverview', e)} />
            </div>
          </div>

          <div style={{ flex: 1, minHeight: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mainAnalyticsData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWaveA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorWaveB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorWaveC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" vertical={true} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 500]} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(148, 163, 184, 0.25)', 
                    borderRadius: '12px', 
                    color: '#ffffff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }} 
                />
                <Area type="natural" dataKey="lineC" stroke="#38bdf8" strokeWidth={3} fill="url(#colorWaveC)" dot={{ r: 4, fill: '#38bdf8' }} activeDot={{ r: 7 }} />
                <Area type="natural" dataKey="lineB" stroke="#c084fc" strokeWidth={3} fill="url(#colorWaveB)" dot={{ r: 4, fill: '#c084fc' }} activeDot={{ r: 7 }} />
                <Area type="natural" dataKey="lineA" stroke="#818cf8" strokeWidth={3} fill="url(#colorWaveA)" dot={{ r: 4, fill: '#818cf8' }} activeDot={{ r: 7 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Sources Donut Chart Card */}
        <div 
          onClick={() => openExplainer('topSources')}
          style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 14, 26, 0.95) 100%)',
            border: selectedWidgetInfo?.id === 'topSources' ? '1.5px solid #a855f7' : '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: selectedWidgetInfo?.id === 'topSources' ? '0 0 30px rgba(168, 85, 247, 0.35)' : 'none',
            borderRadius: '22px',
            padding: '1.6rem 1.75rem',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a855f7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedWidgetInfo?.id === 'topSources' ? '#a855f7' : 'rgba(148, 163, 184, 0.15)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Top Sources <Info size={14} color="#a855f7" />
            </h3>
            <MoreHorizontal size={16} color="#64748b" onClick={(e) => openExplainer('topSources', e)} />
          </div>

          <div style={{ height: '170px', width: '100%', position: 'relative', margin: '0.75rem 0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vendorDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={78}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {vendorDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PURPLE_GRADIENT_COLORS[index % PURPLE_GRADIENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(148, 163, 184, 0.25)', 
                    borderRadius: '10px', 
                    color: '#ffffff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {vendorDonutData.map((item, idx) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '3px',
                    background: PURPLE_GRADIENT_COLORS[idx % PURPLE_GRADIENT_COLORS.length]
                  }} />
                  <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{item.name}</span>
                </div>
                <span style={{ color: '#ffffff', fontWeight: 800 }}>{item.pct}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ROW 3: 3 BOTTOM WIDGETS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr 1.15fr', gap: '1.25rem' }}>
        
        {/* Widget 1: Active Projects List */}
        <div 
          onClick={() => openExplainer('activeProjects')}
          style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 14, 26, 0.95) 100%)',
            border: selectedWidgetInfo?.id === 'activeProjects' ? '1.5px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: selectedWidgetInfo?.id === 'activeProjects' ? '0 0 25px rgba(56, 189, 248, 0.35)' : 'none',
            borderRadius: '22px',
            padding: '1.5rem 1.6rem',
            backdropFilter: 'blur(24px)',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedWidgetInfo?.id === 'activeProjects' ? '#38bdf8' : 'rgba(148, 163, 184, 0.15)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              Active Projects <Info size={13} color="#38bdf8" />
            </h3>
            <MoreHorizontal size={16} color="#64748b" onClick={(e) => openExplainer('activeProjects', e)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Project</span>
            <span>Progress</span>
            <span>Status</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredProjects.map((p, idx) => {
              const progressPct = [85, 65, 92, 48][idx % 4];
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '38%' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#818cf8'
                    }}>
                      <FolderGit2 size={14} />
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                  </div>

                  <div style={{ width: '35%' }}>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(148, 163, 184, 0.15)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${progressPct}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                        borderRadius: '10px'
                      }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px', width: '20%', justifyContent: 'flex-end' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8' }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c084fc' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 2: Team Activity Stacked Bars */}
        <div 
          onClick={() => openExplainer('teamActivity')}
          style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 14, 26, 0.95) 100%)',
            border: selectedWidgetInfo?.id === 'teamActivity' ? '1.5px solid #818cf8' : '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: selectedWidgetInfo?.id === 'teamActivity' ? '0 0 25px rgba(129, 140, 248, 0.35)' : 'none',
            borderRadius: '22px',
            padding: '1.5rem 1.6rem',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#818cf8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedWidgetInfo?.id === 'teamActivity' ? '#818cf8' : 'rgba(148, 163, 184, 0.15)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              Team Activity <Info size={13} color="#818cf8" />
            </h3>
            <MoreHorizontal size={16} color="#64748b" onClick={(e) => openExplainer('teamActivity', e)} />
          </div>

          <div style={{ flex: 1, minHeight: '140px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamActivityData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="barGradB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#0284c7" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Bar dataKey="a" fill="url(#barGradA)" stackId="stack" radius={[0, 0, 0, 0]} barSize={14} />
                <Bar dataKey="b" fill="url(#barGradB)" stackId="stack" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget 3: Sourcing Locations Map */}
        <div 
          onClick={() => openExplainer('sourcingHubs')}
          style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 14, 26, 0.95) 100%)',
            border: selectedWidgetInfo?.id === 'sourcingHubs' ? '1.5px solid #34d399' : '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: selectedWidgetInfo?.id === 'sourcingHubs' ? '0 0 25px rgba(52, 211, 153, 0.35)' : 'none',
            borderRadius: '22px',
            padding: '1.5rem 1.6rem',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#34d399'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = selectedWidgetInfo?.id === 'sourcingHubs' ? '#34d399' : 'rgba(148, 163, 184, 0.15)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              Sourcing Hubs & Locations <Info size={13} color="#34d399" />
            </h3>
            <MoreHorizontal size={16} color="#64748b" onClick={(e) => openExplainer('sourcingHubs', e)} />
          </div>

          <div style={{ position: 'relative', width: '100%', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 400 180" style={{ width: '100%', height: '100%', opacity: 0.35, filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.2))' }}>
              <path d="M 60,30 Q 90,20 120,40 Q 110,80 80,95 Q 50,70 60,30 Z" fill="#38bdf8" />
              <path d="M 100,105 Q 125,115 115,155 Q 95,165 90,125 Z" fill="#38bdf8" />
              <path d="M 180,30 Q 220,35 210,65 Q 185,75 175,45 Z" fill="#818cf8" />
              <path d="M 185,75 Q 225,85 215,140 Q 175,130 185,75 Z" fill="#818cf8" />
              <path d="M 230,25 Q 320,30 330,85 Q 275,100 240,65 Z" fill="#a855f7" />
              <path d="M 265,70 Q 285,75 280,105 Q 260,95 265,70 Z" fill="#34d399" />
              <path d="M 315,120 Q 355,125 345,155 Q 310,150 315,120 Z" fill="#38bdf8" />
            </svg>

            {/* Glowing Pulsing Radar Pins */}
            <div style={{ position: 'absolute', left: '68%', top: '48%', transform: 'translate(-50%, -50%)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 14px #34d399', animation: 'pulse 1.8s infinite' }} />
              <div style={{ position: 'absolute', top: '-18px', left: '-20px', fontSize: '9px', fontWeight: 800, color: '#34d399', whiteSpace: 'nowrap' }}>HYD HQ</div>
            </div>

            <div style={{ position: 'absolute', left: '50%', top: '28%', transform: 'translate(-50%, -50%)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 10px #818cf8', animation: 'pulse 2.2s infinite' }} />
            </div>

            <div style={{ position: 'absolute', left: '80%', top: '38%', transform: 'translate(-50%, -50%)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c084fc', boxShadow: '0 0 10px #c084fc', animation: 'pulse 2.5s infinite' }} />
            </div>
          </div>
        </div>

      </div>

      {/* QUICK BOM ESTIMATOR LINK */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '20px',
        padding: '1.25rem 1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)'
          }}>
            <Wand2 size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
              AI Automated Tender BOM Estimator & Sourcing Portal
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Cross-reference tender clauses, match STQC/ARAI OEM datasheets, and export project BOMs.
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/bom')}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.35rem',
            fontSize: '13.5px',
            fontWeight: 800,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
            boxShadow: '0 4px 20px rgba(56, 189, 248, 0.35)'
          }}
        >
          <span>Launch BOM Estimator</span>
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* RIGHT-CORNER SLIDE-OVER AI EXPLAINER DRAWER */}
      {selectedWidgetInfo && (
        <>
          {/* Dismissal Backdrop Scrim */}
          <div 
            onClick={() => setSelectedWidgetInfo(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(3, 7, 18, 0.45)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 9998,
              animation: 'fadeIn 0.2s ease-out'
            }}
          />

          {/* Right Corner Sliding Inspector Drawer */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '460px',
              maxWidth: '92vw',
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(8, 13, 26, 0.99) 100%)',
              borderLeft: `2.5px solid ${selectedWidgetInfo.color}`,
              boxShadow: `-20px 0 50px rgba(0, 0, 0, 0.85), 0 0 35px ${selectedWidgetInfo.color}35`,
              backdropFilter: 'blur(36px)',
              WebkitBackdropFilter: 'blur(36px)',
              zIndex: 9999,
              padding: '2.25rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto',
              animation: 'slideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div>
              {/* Drawer Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: `${selectedWidgetInfo.color}20`,
                    border: `1.5px solid ${selectedWidgetInfo.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: selectedWidgetInfo.color,
                    boxShadow: `0 0 15px ${selectedWidgetInfo.color}40`
                  }}>
                    {React.createElement(selectedWidgetInfo.icon, { size: 22 })}
                  </div>

                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: selectedWidgetInfo.color,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '0.2rem'
                    }}>
                      ★ {selectedWidgetInfo.badge}
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                      {selectedWidgetInfo.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedWidgetInfo(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                  title="Close Explainer Panel"
                >
                  <X size={17} />
                </button>
              </div>

              {/* 3 Core Explanation Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', marginBottom: '1.5rem' }}>
                
                {/* 1. What is this? */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.65)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '16px',
                  padding: '1.15rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '11.5px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                    <Compass size={14} /> 1. What is this widget?
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#e2e8f0', lineHeight: 1.55 }}>
                    {selectedWidgetInfo.whatIsThis}
                  </p>
                </div>

                {/* 2. Why is it used in the Application? */}
                <div style={{
                  background: 'rgba(139, 92, 246, 0.12)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '16px',
                  padding: '1.15rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '11.5px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                    <Lightbulb size={14} /> 2. Why is it used in NPD & Sourcing?
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#f1f5f9', lineHeight: 1.55 }}>
                    {selectedWidgetInfo.whyUsed}
                  </p>
                </div>

                {/* 3. Business Value & Engineering Impact */}
                <div style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '1.15rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '11.5px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                    <Award size={14} /> 3. Engineering & Sourcing Impact
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#f1f5f9', lineHeight: 1.55 }}>
                    {selectedWidgetInfo.howItHelps}
                  </p>
                </div>

                {/* Formula / Calculation Source */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px dashed rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  fontSize: '11.5px',
                  color: '#94a3b8'
                }}>
                  <span style={{ fontWeight: 800, color: '#cbd5e1' }}>Data Calculation Logic: </span>
                  <div style={{ color: '#38bdf8', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                    {selectedWidgetInfo.formula}
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons at Bottom of Drawer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.15)' }}>
              <button
                onClick={() => {
                  setSelectedWidgetInfo(null);
                  navigate('/bom');
                }}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '13px',
                  fontWeight: 800,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <Zap size={15} /> Launch Related Sourcing Tool
              </button>

              <button
                onClick={() => setSelectedWidgetInfo(null)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                Close Explainer Panel
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
