'use client';

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Zap, 
  Layers, 
  Cpu, 
  Activity, 
  Sun, 
  TrendingUp, 
  Sliders, 
  BatteryCharging, 
  Share2, 
  ShieldCheck, 
  Eye, 
  Radio, 
  Map, 
  Scale, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  Clock, 
  Database, 
  Search, 
  ArrowRight, 
  Sparkles,
  ShieldAlert,
  Flame,
  Globe2,
  Maximize2
} from 'lucide-react';

interface PlatformModule {
  id: string;
  title: string;
  path: string;
  category: 'Operations' | 'Forecasting' | 'Optimization' | 'AI Engines';
  icon: any;
  dataProvenance: 'Live API' | 'Cached Baseline' | 'Physics Sim';
  algorithm: string;
  summary: string;
  metric: string;
  color: string;
}

const MODULES: PlatformModule[] = [
  {
    id: 'command-center',
    title: 'Command Center',
    path: '/command-center',
    category: 'Operations',
    icon: Zap,
    dataProvenance: 'Live API',
    algorithm: 'SCADA Telemetry & 50 Hz Grid Droop Monitor',
    summary: 'Central dispatch dashboard streaming live substation metrics, automated feeder alerts, and 1-click optimization directives.',
    metric: '< 150 ms dispatch latency',
    color: '#4f46e5'
  },
  {
    id: 'digital-twin',
    title: 'Digital Twin Sandbox',
    path: '/digital-twin',
    category: 'Operations',
    icon: Sliders,
    dataProvenance: 'Physics Sim',
    algorithm: 'State-space physical model with 5 fault contingency injectors',
    summary: 'Hardware-free simulator for a 64.8 MW virtual substation. Test solar dips, heatwave peaks, and battery dispatch over 24 hours.',
    metric: '64.8 MW substation model',
    color: '#0284c7'
  },
  {
    id: 'renewable-forecast',
    title: 'Renewable Forecast',
    path: '/renewable-forecast',
    category: 'Forecasting',
    icon: Sun,
    dataProvenance: 'Live API',
    algorithm: 'LightGBM Regressor v2.4 + 95% Quantile Loss',
    summary: '24h/48h solar and wind predictions utilizing high-resolution Open-Meteo NWP weather telemetry and NASA POWER datasets.',
    metric: '0.942 R² accuracy',
    color: '#d97706'
  },
  {
    id: 'demand-forecast',
    title: 'Demand Forecast',
    path: '/demand-forecast',
    category: 'Forecasting',
    icon: TrendingUp,
    dataProvenance: 'Cached Baseline',
    algorithm: 'XGBoost Temporal Regressor v3.1 + Anomaly Detector',
    summary: 'Hourly demand forecasting identifying the critical 18:00–22:00 evening peak and transformer thermal stress windows.',
    metric: '1.42 MW MAE peak error',
    color: '#dc2626'
  },
  {
    id: 'sky-vision',
    title: 'SkyVision Optical Radar',
    path: '/sky-vision',
    category: 'AI Engines',
    icon: Eye,
    dataProvenance: 'Live API',
    algorithm: 'HTML5 Farneback Dense Optical-Flow Vector Tracker',
    summary: 'Cloud motion velocity tracking simulating satellite & sky-cam radar to alert BESS fleet 15–30 minutes before sudden solar dips.',
    metric: '15–30 min advance ramp alert',
    color: '#7c3aed'
  },
  {
    id: 'self-healing',
    title: 'Self-Healing FLISR',
    path: '/self-healing',
    category: 'AI Engines',
    icon: Radio,
    dataProvenance: 'Physics Sim',
    algorithm: 'Causal Inference DAG & Automated Tie-Switch Logic',
    summary: 'Automated Fault Location, Isolation, and Service Restoration restoring power to healthy feeder loops within 140 ms.',
    metric: '140 ms restoration cycle',
    color: '#059669'
  },
  {
    id: 'flexibility',
    title: 'Flexibility Engine',
    path: '/flexibility',
    category: 'Optimization',
    icon: BatteryCharging,
    dataProvenance: 'Physics Sim',
    algorithm: 'PuLP Mixed-Integer Linear Programming (MILP) Solver',
    summary: 'Multi-asset dispatch optimizer coordinating 40 MWh community BESS and dynamic EV charger curtailment to eliminate shortages.',
    metric: '0 MWh deficit post-flex',
    color: '#0284c7'
  },
  {
    id: 'tariff-engine',
    title: 'Dynamic Tariff & P2P Engine',
    path: '/tariff-engine',
    category: 'Optimization',
    icon: Scale,
    dataProvenance: 'Cached Baseline',
    algorithm: 'Locational Marginal Pricing (LMP) & Continuous Double Auction',
    summary: 'Dynamic congestion multipliers linked to CERC DSM deviation settlement and prosumer bilateral peer-to-peer energy trades.',
    metric: '₹15.25 Lakh saved/month',
    color: '#c026d3'
  },
  {
    id: 'incident-copilot',
    title: 'Incident Copilot',
    path: '/incident-copilot',
    category: 'AI Engines',
    icon: MessageSquare,
    dataProvenance: 'Live API',
    algorithm: 'Bilingual Natural Language & Speech Protocol Parser',
    summary: 'Conversational emergency assistant supporting natural English and Hindi queries for regulatory CEA/CERC operational SOPs.',
    metric: 'Bilingual EN & HI support',
    color: '#4f46e5'
  }
];

export default function AboutPage() {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter modules
  const filteredModules = useMemo(() => {
    return MODULES.filter(m => {
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.algorithm.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const chainSteps = [
    { title: t('chain.step1', 'Weather & Telemetry'), desc: 'Open-Meteo & NASA POWER APIs', icon: Activity, color: '#0284c7' },
    { title: t('chain.step2', 'Forecast Models'), desc: 'LightGBM & XGBoost Multi-Horizon', icon: Sun, color: '#d97706' },
    { title: t('chain.step3', 'Risk Detection'), desc: 'Shortage & Overload Detection', icon: ShieldAlert, color: '#dc2626' },
    { title: t('chain.step4', 'MILP Solver'), desc: 'PuLP Multi-Asset Constraint Solver', icon: Cpu, color: '#4f46e5' },
    { title: t('chain.step5', 'Feeder Directives'), desc: 'Automated SCADA Dispatch Orders', icon: Zap, color: '#ea580c' },
    { title: t('chain.step6', 'Dynamic BESS Response'), desc: 'Sub-150ms Battery & EV Dispatch', icon: BatteryCharging, color: '#059669' },
    { title: t('chain.step7', 'Zero Blackouts'), desc: 'Avoided CERC DSM Penalties', icon: Award, color: '#16a34a' },
    { title: t('chain.step8', 'TreeSHAP Attributions'), desc: '100% Additive Math Transparency', icon: CheckCircle2, color: '#7c3aed' },
  ];

  return (
    <div className="synaptix-container">
      {/* ── Synaptix Top Status Bar & Search ── */}
      <div className="synaptix-top-bar">
        <div className="synaptix-search-input-wrap">
          <Search size={16} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            className="synaptix-search-input"
            placeholder={language === 'hi' ? 'ग्रिड मॉडल, एल्गोरिदम या डेटा खोजें...' : 'Search grid tools, models, or telemetry...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="synaptix-badge-active">
            <span className="synaptix-active-dot" />
            <span>{language === 'hi' ? 'ग्रिड एआई सक्रिय' : 'Grid AI Active'}</span>
          </div>
          <span className="badge badge-live">
            {language === 'hi' ? 'सब-150ms टेलीमेट्री' : '< 150ms Telemetry'}
          </span>
          <span className="badge badge-sim">
            {language === 'hi' ? 'अंग्रेजी और हिन्दी' : 'English & Hindi (2 Languages)'}
          </span>
        </div>
      </div>

      {/* ── Welcome Greeting ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            {language === 'hi' ? 'ग्रिडफ्लेक्स एआई में आपका स्वागत है' : 'Welcome to GridFlex AI'}
          </h1>
          <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            {language === 'hi' 
              ? 'भारतीय विद्युत ग्रिड के लिए स्वायत्त ऊर्जा ग्रिड अनुकूलन और लचीलापन मंच' 
              : "Here's what's happening with your autonomous grid optimization and resilience today"}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/command-center" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            <Zap size={16} />
            <span>{language === 'hi' ? 'कमांड सेंटर खोलें' : 'Open Command Center'}</span>
          </Link>
          <Link to="/digital-twin" className="btn btn-secondary" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
            <Sliders size={16} />
            <span>{language === 'hi' ? 'डिजिटल ट्विन' : 'Digital Twin'}</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Synaptix Metric Cards with Miniature Sparklines ── */}
      <div className="synaptix-metric-grid">
        {/* Card 1: Grid Demand */}
        <div className="synaptix-metric-card">
          <div className="synaptix-metric-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="synaptix-icon-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
                <TrendingUp size={18} />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'ग्रिड मांग' : 'Grid Demand'}
              </span>
            </div>
            <span className="synaptix-delta-tag synaptix-delta-positive">
              +12.5% {language === 'hi' ? 'शाम पीक' : 'peak'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
            <div>
              <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#F59E0B', fontVariantNumeric: 'tabular-nums', textShadow: '0 0 16px rgba(245, 158, 11, 0.25)' }}>
                64.8 <span style={{ fontSize: '1rem', fontWeight: 600, color: '#22D3EE' }}>MW</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {language === 'hi' ? '33/11kV सबस्टेशन थ्रूपुट' : '33/11kV Substation Throughput'}
              </div>
            </div>
            {/* Sparkline SVG */}
            <svg width="90" height="34" viewBox="0 0 90 34" fill="none">
              <path d="M2 24 C 15 22, 25 28, 40 16 C 55 4, 70 8, 88 12" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Renewable Generation */}
        <div className="synaptix-metric-card">
          <div className="synaptix-metric-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="synaptix-icon-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                <Sun size={18} />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'नवीकरणीय उत्पादन' : 'Renewable Output'}
              </span>
            </div>
            <span className="synaptix-delta-tag synaptix-delta-positive">
              93.7% {language === 'hi' ? 'स्वच्छ हिस्सा' : 'share'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
            <div>
              <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#10B981', fontVariantNumeric: 'tabular-nums', textShadow: '0 0 16px rgba(16, 185, 129, 0.25)' }}>
                60.7 <span style={{ fontSize: '1rem', fontWeight: 600, color: '#22D3EE' }}>MW</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {language === 'hi' ? '42.5 सौर + 18.2 पवन' : '42.5 MW Solar + 18.2 MW Wind'}
              </div>
            </div>
            {/* Sparkline SVG */}
            <svg width="90" height="34" viewBox="0 0 90 34" fill="none">
              <path d="M2 18 C 18 10, 32 2, 45 6 C 58 10, 72 26, 88 20" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Forecast Precision */}
        <div className="synaptix-metric-card">
          <div className="synaptix-metric-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="synaptix-icon-badge" style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#22D3EE' }}>
                <Cpu size={18} />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'पूर्वानुमान सटीकता' : 'Forecast Precision'}
              </span>
            </div>
            <span className="synaptix-delta-tag synaptix-delta-positive">
              +2.1% {language === 'hi' ? 'इस माह' : 'accuracy'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
            <div>
              <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#22D3EE', fontVariantNumeric: 'tabular-nums', textShadow: '0 0 16px rgba(34, 211, 238, 0.3)' }}>
                98.5%
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {language === 'hi' ? '0.942 R² LightGBM + XGBoost' : '0.942 R² LightGBM + XGBoost'}
              </div>
            </div>
            {/* Sparkline SVG */}
            <svg width="90" height="34" viewBox="0 0 90 34" fill="none">
              <path d="M2 16 C 14 20, 26 8, 42 12 C 58 16, 70 6, 88 8" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Resilience Score */}
        <div className="synaptix-metric-card">
          <div className="synaptix-metric-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="synaptix-icon-badge" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34D399' }}>
                <ShieldCheck size={18} />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'लचीलापन स्कोर' : 'Resilience Score'}
              </span>
            </div>
            <span className="synaptix-delta-tag synaptix-delta-positive">
              {language === 'hi' ? 'अनुकूल' : 'Optimal'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
            <div>
              <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#34D399', fontVariantNumeric: 'tabular-nums', textShadow: '0 0 16px rgba(52, 211, 153, 0.25)' }}>
                80.7 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-tertiary)' }}>/ 100</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {language === 'hi' ? '0 घाटा घंटे (पोस्ट-फ्लेक्स)' : '0 Deficit Hours (Post-Flex)'}
              </div>
            </div>
            {/* Sparkline SVG */}
            <svg width="90" height="34" viewBox="0 0 90 34" fill="none">
              <path d="M2 28 C 16 26, 30 18, 46 14 C 62 10, 74 6, 88 4" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Synaptix Two-Column Analytics Row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
        gap: 20
      }} className="synaptix-analytics-grid">
        {/* Left Column: Grid Performance Index Line Chart Card */}
        <div className="synaptix-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                  {language === 'hi' ? 'ग्रिड प्रदर्शन सूचकांक' : 'Grid Performance Index'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  {language === 'hi' ? 'मासिक पीक शेविंग और परिहार्य DSM विचलन बचत' : 'Autonomous peak-shaving dispatch and avoided DSM deviation penalties'}
                </p>
              </div>
              <Link 
                to="/command-center" 
                style={{ 
                  color: 'var(--text-secondary)', 
                  padding: 6, 
                  borderRadius: 6, 
                  display: 'flex', 
                  alignItems: 'center', 
                  border: '1px solid var(--border-subtle)' 
                }} 
                title="View Full Telemetry"
              >
                <Maximize2 size={15} />
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F59E0B', fontVariantNumeric: 'tabular-nums', textShadow: '0 0 16px rgba(245, 158, 11, 0.25)' }}>
                ₹15.25 Lakh
              </div>
              <span className="synaptix-delta-tag synaptix-delta-positive" style={{ fontSize: '0.8rem' }}>
                +14.3% {language === 'hi' ? 'बचत' : 'monthly savings'}
              </span>
            </div>
          </div>

          {/* Elegant SVG Line Chart with Highlight Bar (Bounded inside card with zero clipping) */}
          <div style={{ marginTop: 20, position: 'relative', width: '100%', overflow: 'hidden' }}>
            <svg width="100%" height="165" viewBox="0 0 500 165" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', overflow: 'hidden' }}>
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="barHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              <line x1="20" y1="30" x2="480" y2="30" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1" />
              <line x1="20" y1="70" x2="480" y2="70" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1" />
              <line x1="20" y1="110" x2="480" y2="110" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1" />

              {/* Highlight Bar for Peak Window (July / 18:00–20:00) */}
              <rect x="270" y="20" width="50" height="115" rx="8" fill="url(#barHighlight)" />

              {/* Area fill */}
              <path 
                d="M 35 105 C 75 105, 105 92, 145 92 C 185 92, 215 102, 245 102 C 270 102, 275 42, 295 42 C 315 42, 350 82, 390 82 C 425 82, 440 68, 470 68 L 470 135 L 35 135 Z" 
                fill="url(#chartGradient)" 
              />

              {/* Smooth Forward Progression Curve */}
              <path 
                d="M 35 105 C 75 105, 105 92, 145 92 C 185 92, 215 102, 245 102 C 270 102, 275 42, 295 42 C 315 42, 350 82, 390 82 C 425 82, 440 68, 470 68" 
                fill="none" 
                stroke="#22d3ee" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />

              {/* Data Nodes */}
              <circle cx="35" cy="105" r="4" fill="#0a1b2d" stroke="#22d3ee" strokeWidth="2.5" />
              <circle cx="145" cy="92" r="4" fill="#0a1b2d" stroke="#22d3ee" strokeWidth="2.5" />
              <circle cx="245" cy="102" r="4" fill="#0a1b2d" stroke="#22d3ee" strokeWidth="2.5" />
              <circle cx="295" cy="42" r="6" fill="#0a1b2d" stroke="#38bdf8" strokeWidth="3" />
              <circle cx="390" cy="82" r="4" fill="#0a1b2d" stroke="#22d3ee" strokeWidth="2.5" />
              <circle cx="470" cy="68" r="4" fill="#0a1b2d" stroke="#22d3ee" strokeWidth="2.5" />

              {/* SVG-Anchored Month Labels */}
              <text x="35" y="152" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">Jan</text>
              <text x="145" y="152" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">Apr</text>
              <text x="295" y="152" textAnchor="middle" fontSize="11" fill="#22d3ee" fontWeight="700">July (Peak Flex)</text>
              <text x="390" y="152" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">Oct</text>
              <text x="470" y="152" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">Dec</text>
            </svg>
          </div>
        </div>

        {/* Right Column: Grid Resilience Index Radial Gauge Card */}
        <div className="synaptix-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {language === 'hi' ? 'ग्रिड विश्वसनीयता सूचकांक' : 'Grid Resilience Index'}
              </h3>
              <span className="badge badge-live" style={{ fontSize: '0.72rem' }}>
                IEEE 1547
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              {language === 'hi' ? 'चार पारदर्शी स्तंभों का समग्र स्कोर' : 'Composite health score across four transparent pillars'}
            </p>
          </div>

          {/* Semi-Circular Radial Gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '14px 0' }}>
            <svg width="200" height="110" viewBox="0 0 200 110">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="80%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              {/* Background track */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="rgba(148, 163, 184, 0.15)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Filled progress arc (80.7%) */}
              <path
                d="M 20 100 A 80 80 0 0 1 155 45"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="14"
                strokeLinecap="round"
              />
            </svg>
            <div style={{ marginTop: -40, textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34D399', lineHeight: 1, textShadow: '0 0 16px rgba(52, 211, 153, 0.25)' }}>
                80.7
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399', marginTop: 4 }}>
                {language === 'hi' ? 'विश्वसनीय सुरक्षा स्तर' : 'Optimal Operating Envelope'}
              </div>
            </div>
          </div>

          {/* Breakdown Legend Chips */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            paddingTop: 12,
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.78rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706' }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>24%</div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>Thermal Margin</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>48%</div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>Renewable Use</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5' }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>28%</div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>Storage Flex</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 8-Step Autonomous Resilience & Optimization Chain ── */}
      <div className="synaptix-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span className="badge badge-live" style={{ fontSize: '0.74rem' }}>
                <Sparkles size={12} />
                Autonomous System Pipeline
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {language === 'hi' ? '8-चरणीय स्वायत्त अनुकूलन श्रृंखला' : '8-Step Autonomous Optimization & Resilience Pipeline'}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {language === 'hi' 
                ? 'मौसम पूर्वानुमान से लेकर MILP सॉल्वर और 150ms BESS नियंत्रण तक' 
                : 'Deterministic multi-horizon forecasting, mathematical MILP solving, and TreeSHAP explainability.'}
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 12
        }}>
          {chainSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                style={{
                  background: 'rgba(10, 27, 45, 0.65)',
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `${step.color}15`,
                  color: step.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2
                }}>
                  <Icon size={16} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: step.color }}>Step {idx + 1}</span>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{step.title}</strong>
                  </div>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Core Problems & Structural Challenges (Concise) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16
      }}>
        {/* Problem 1 */}
        <div className="synaptix-card" style={{ borderTop: '3px solid #d97706' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Structural Challenge 1</span>
              <h4 style={{ margin: 0, fontSize: '1.02rem', color: 'var(--text-primary)' }}>
                {language === 'hi' ? 'डक कर्व और शाम का अचानक रैंप-डाउन' : 'Evening Duck Curve Ramp-Down'}
              </h4>
            </div>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            At 17:00 IST, solar generation plunges from 48.5 MW to zero within 90 minutes across Indian distribution networks, right as domestic cooling, cooking, and commuter EV loads surge, creating a severe 18.2 MW deficit window.
          </p>
        </div>

        {/* Problem 2 */}
        <div className="synaptix-card" style={{ borderTop: '3px solid #dc2626' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>Regulatory Challenge 2</span>
              <h4 style={{ margin: 0, fontSize: '1.02rem', color: 'var(--text-primary)' }}>
                {language === 'hi' ? 'CERC DSM वैधानिक दंड जोखिम' : 'CERC DSM Statutory Penalties'}
              </h4>
            </div>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Under Indian CERC Deviation Settlement Mechanism (DSM) 2023 regulations, overdrawing from the grid when national frequency falls below 49.90 Hz attracts punitive tariffs up to ₹14.60/kWh, incurring lakhs in avoidable utility penalties.
          </p>
        </div>

        {/* Problem 3 */}
        <div className="synaptix-card" style={{ borderTop: '3px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase' }}>Operational Challenge 3</span>
              <h4 style={{ margin: 0, fontSize: '1.02rem', color: 'var(--text-primary)' }}>
                {language === 'hi' ? 'ट्रांसफॉर्मर थर्मल ओवरलोड जोखिम' : 'Transformer Thermal Bottlenecks'}
              </h4>
            </div>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Without localized BESS dispatch and dynamic flexibility scheduling, distribution feeder sections exceed 90% thermal continuous rating, triggering rolling emergency load shedding and transformer degradation.
          </p>
        </div>
      </div>

      {/* ── Filterable Platform Module Directory ── */}
      <div className="synaptix-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              {language === 'hi' ? 'प्लेटफ़ॉर्म मॉड्यूल निर्देशिका' : 'Platform Modules & Operational Engines'}
            </h2>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              {language === 'hi' 
                ? 'सभी मुख्य मॉड्यूल का संक्षिप्त अवलोकन। किसी भी कार्ड पर क्लिक करके सीधे उस पृष्ठ पर जाएं।' 
                : 'Click any module below to inspect live telemetry, physics simulations, and dispatch controls.'}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['All', 'Operations', 'Forecasting', 'Optimization', 'AI Engines'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: selectedCategory === cat ? '1px solid #22d3ee' : '1px solid rgba(148, 163, 184, 0.2)',
                  background: selectedCategory === cat ? 'linear-gradient(135deg, #0284c7, #06b6d4)' : 'rgba(10, 27, 45, 0.8)',
                  color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 14
        }}>
          {filteredModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                to={mod.path}
                style={{
                  background: 'rgba(10, 27, 45, 0.65)',
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                  borderRadius: 14,
                  padding: '16px 18px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 10,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease'
                }}
                className="synaptix-module-item"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${mod.color}15`, color: mod.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={16} />
                      </div>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>{mod.title}</strong>
                    </div>
                    <span 
                      className={`badge ${mod.dataProvenance === 'Live API' ? 'badge-live' : mod.dataProvenance === 'Physics Sim' ? 'badge-sim' : 'badge-forecast'}`}
                      style={{ fontSize: '0.68rem', padding: '2px 8px' }}
                    >
                      {mod.dataProvenance}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {mod.summary}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 8,
                  borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                  fontSize: '0.74rem'
                }}>
                  <span style={{ fontWeight: 600, color: mod.color }}>
                    {mod.metric}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--text-tertiary)' }}>
                    Open <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Data Provenance & Integrity Statement (Concise) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16
      }}>
        <div className="synaptix-card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
            <strong style={{ color: '#059669', fontSize: '0.95rem' }}>Live REST APIs</strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
            Dynamic real-time telemetry from Open-Meteo High-Resolution NWP and NASA POWER atmospheric APIs, with sub-150ms SCADA dispatch cycle.
          </p>
        </div>

        <div className="synaptix-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <strong style={{ color: '#0284c7', fontSize: '0.95rem' }}>Cached National Data</strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
            Real Indian utility profiles (Grid-India NLDC Daily PSP 64.8 MW, Vidyut PRAVAH IEX DAM ₹6.80/kWh benchmark, CEA v19 CO₂ baseline).
          </p>
        </div>

        <div className="synaptix-card" style={{ borderLeft: '4px solid #d97706' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <strong style={{ color: '#d97706', fontSize: '0.95rem' }}>Physics Twin Simulation</strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
            State-space mathematical models and PuLP MILP solver simulating 40 MWh community BESS, fault contingency injections, and prosumer P2P double auctions.
          </p>
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 33, 53, 0.95) 0%, rgba(10, 27, 45, 0.95) 100%)',
        border: '1px solid rgba(34, 211, 238, 0.3)',
        borderRadius: 16,
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: '0 8px 32px rgba(6, 17, 31, 0.5), inset 0 1px 0 rgba(34, 211, 238, 0.2)'
      }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
            {language === 'hi' ? 'लाइव ग्रिड संचालन का अन्वेषण करें' : 'Ready to inspect the live energy grid?'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {language === 'hi' 
              ? 'कमांड सेंटर पर जाएं या डिजिटल ट्विन में कस्टम परिदृश्य चलाएं।' 
              : 'Switch to the Command Center for real-time dispatch or run custom what-if scenarios in the Digital Twin.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/command-center" className="btn btn-primary" style={{ padding: '10px 22px' }}>
            <Zap size={16} />
            <span>Open Command Center</span>
          </Link>
          <Link to="/digital-twin" className="btn btn-secondary" style={{ padding: '10px 20px' }}>
            <span>Explore Digital Twin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
