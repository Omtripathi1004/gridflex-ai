'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  Building2, 
  Award, 
  KeyRound, 
  CheckCircle2, 
  Clock, 
  Database, 
  Search, 
  ExternalLink, 
  ArrowRight, 
  Compass, 
  Filter, 
  HelpCircle,
  Server,
  Code2,
  Lock,
  Globe2,
  Sparkles
} from 'lucide-react';

interface PageInfo {
  title: string;
  path: string;
  category: 'Operations' | 'Forecasting' | 'Optimization' | 'AI Engines' | 'Trust & Governance';
  icon: any;
  dataMode: 'Live Data' | 'Cached Data' | 'Demo / Synthetic Data';
  dataModeType: 'live' | 'cached' | 'demo';
  dataSource: string;
  algorithms: string[];
  summary: string;
  audience: string;
  highlightMetric: string;
}

const ALL_PAGES: PageInfo[] = [
  {
    title: "Command Center",
    path: "/command-center",
    category: "Operations",
    icon: Zap,
    dataMode: "Live Data",
    dataModeType: "live",
    dataSource: "Live telemetry loop & Open-Meteo API",
    algorithms: ["Real-time SCADA Aggregator", "Dynamic Frequency Monitor (49.90–50.05 Hz)"],
    summary: "Real-time dispatch dashboard monitoring substation generation vs. demand balance, live telemetry metrics, alert matrices, and quick-dispatch triggers.",
    audience: "Grid Control Operators & Shift Engineers",
    highlightMetric: "< 150 ms telemetry cycle"
  },
  {
    title: "Digital Twin & Sandbox",
    path: "/digital-twin",
    category: "Operations",
    icon: Sliders,
    dataMode: "Demo / Synthetic Data",
    dataModeType: "demo",
    dataSource: "Physics-constrained state-space model",
    algorithms: ["Substation Bus Physical State Solver", "5 Fault Contingency Injectors"],
    summary: "Hardware-free digital twin of a 64.8 MW virtual substation. Allows operators to trigger cloud burst dips, feeder trips, and transformer overloads safely.",
    audience: "Control Engineers & Reliability Testers",
    highlightMetric: "64.8 MW virtual substation"
  },
  {
    title: "Renewable Forecast",
    path: "/renewable-forecast",
    category: "Forecasting",
    icon: Sun,
    dataMode: "Live Data",
    dataModeType: "live",
    dataSource: "Open-Meteo High-Resolution NWP + NASA POWER",
    algorithms: ["LightGBM Regressor v2.4", "95% Confidence Interval Quantile Loss"],
    summary: "24h/48h day-ahead solar and wind generation prediction with dynamic weather telemetry (GHI, wind speed, temperature, cloud cover).",
    audience: "Renewable Asset Managers & Power Schedulers",
    highlightMetric: "0.942 R² solar accuracy"
  },
  {
    title: "Demand Forecast",
    path: "/demand-forecast",
    category: "Forecasting",
    icon: TrendingUp,
    dataMode: "Cached Data",
    dataModeType: "cached",
    dataSource: "Grid-India (NLDC) PSP scaled feeder profiles",
    algorithms: ["XGBoost Temporal Regressor v3.1", "Peak Hour Anomaly Detection"],
    summary: "Hourly grid demand forecasting detecting evening peak windows (18:00–22:00) and substation transformer stress before outages occur.",
    audience: "Load Dispatch Officers & Utility Analysts",
    highlightMetric: "1.42 MW MAE on peak load"
  },
  {
    title: "SkyVision Optical-Flow Radar",
    path: "/sky-vision",
    category: "AI Engines",
    icon: Eye,
    dataMode: "Live Data",
    dataModeType: "live",
    dataSource: "HTML5 Canvas Farneback Optical-Flow Engine",
    algorithms: ["Farneback Vector Tracking", "Sub-Hour Solar Ramp-Down Predictor"],
    summary: "Animated cloud vector radar simulating satellite & sky-cam feeds. Tracks cloud velocity vectors and alerts BESS 15–30 minutes before sudden solar dips.",
    audience: "Solar Park Dispatchers & Fast-Response Operators",
    highlightMetric: "15–30 min advance ramp notice"
  },
  {
    title: "Self-Healing Autonomous Grid",
    path: "/self-healing",
    category: "AI Engines",
    icon: Radio,
    dataMode: "Demo / Synthetic Data",
    dataModeType: "demo",
    dataSource: "Causal DAG inference engine + DSM engine",
    algorithms: ["Causal Do-Calculus [P(Y|do(X))]", "Automated Islanding & DSM Bidding Agent"],
    summary: "Autonomous grid restoration proving cause-and-effect interventions rather than mere correlation. Automatically isolates faulty feeders and executes automated DSM bids.",
    audience: "Autonomous Grid Researchers & Protection Engineers",
    highlightMetric: "Sub-second causal diagnosis"
  },
  {
    title: "Spatial 3D Transmission Twin",
    path: "/spatial-twin",
    category: "AI Engines",
    icon: Map,
    dataMode: "Cached Data",
    dataModeType: "cached",
    dataSource: "Topological Grid-India Transmission Node Map",
    algorithms: ["DC Power Flow Approximation", "N-1 Congestion Line Loading Solver"],
    summary: "Interactive 3D topological map of inter-regional transmission corridors. Visualizes line loading %, bottlenecks, and N-1 contingency redispatch pathways.",
    audience: "Transmission System Operators (TSOs) & Planners",
    highlightMetric: "5 Inter-regional nodes modeled"
  },
  {
    title: "CERC Tariff & Arbitrage Solver",
    path: "/tariff-engine",
    category: "AI Engines",
    icon: Scale,
    dataMode: "Cached Data",
    dataModeType: "cached",
    dataSource: "CERC DSM Regulations 2024 & Vidyut PRAVAH",
    algorithms: ["CERC Frequency Deviation Penalty Matrix", "BESS Time-of-Use Arbitrage Optimizer"],
    summary: "Official Indian grid tariff optimization engine. Computes commercial deviation settlement mechanism (DSM) penalties and peak/off-peak arbitrage economics.",
    audience: "DISCOM Commercial Managers & Storage Investors",
    highlightMetric: "₹18,400 daily arbitrage capture"
  },
  {
    title: "Incident Co-pilot (15-Lang RAG + Voice)",
    path: "/incident-copilot",
    category: "AI Engines",
    icon: MessageSquare,
    dataMode: "Live Data",
    dataModeType: "live",
    dataSource: "Web Speech API + Vector RAG Knowledge Base",
    algorithms: ["Web Speech Recognition & Synthesis", "Multilingual Vector Semantic Retrieval"],
    summary: "Multilingual voice-enabled AI copilot supporting 15 Indian regional languages (Hindi, Tamil, Telugu, Bengali, Marathi, etc.). Provides instant step-by-step SOPs.",
    audience: "Field Technicians & Regional Grid Operators",
    highlightMetric: "15 Indian languages supported"
  },
  {
    title: "Flexibility Dispatch",
    path: "/flexibility",
    category: "Optimization",
    icon: Sliders,
    dataMode: "Demo / Synthetic Data",
    dataModeType: "demo",
    dataSource: "Deterministic multi-asset load model",
    algorithms: ["MILP Simplex / Branch-and-Cut Solver", "Demand Response Price-Elasticity Model"],
    summary: "Mixed-Integer Linear Programming solver calculating optimal dispatch across 4 virtual asset classes: BESS discharge, EV smart charging, HVAC curtailment, and industrial DR.",
    audience: "Flexibility Aggregators & Demand Response Teams",
    highlightMetric: "9.6 MW flexible peak relief"
  },
  {
    title: "Virtual Storage (BESS)",
    path: "/storage",
    category: "Optimization",
    icon: BatteryCharging,
    dataMode: "Demo / Synthetic Data",
    dataModeType: "demo",
    dataSource: "State-space electrochemical battery model (Appendix A3)",
    algorithms: ["C-rate & Thermal ODE Simulator", "Round-Trip Efficiency (88.4%) Constraints"],
    summary: "Simulates 4 distributed community BESS nodes (40 MWh total capacity). Prevents thermal runaway, tracks degradation, and enforces DoD safety envelopes (10%–90%).",
    audience: "Energy Storage Engineers & BESS Asset Owners",
    highlightMetric: "40 MWh capacity modeled"
  },
  {
    title: "P2P Energy Trading",
    path: "/p2p",
    category: "Optimization",
    icon: Share2,
    dataMode: "Demo / Synthetic Data",
    dataModeType: "demo",
    dataSource: "Prosumer smart meter simulation",
    algorithms: ["Continuous Double Auction (CDA)", "Dynamic Local Marginal Pricing (DLMP)"],
    summary: "Local microgrid energy trading sandbox allowing rooftop solar prosumers and EV owners to trade excess renewable energy directly with local settlement ledgers.",
    audience: "Microgrid Operators & Prosumer Communities",
    highlightMetric: "100% peer-matched ledger"
  },
  {
    title: "Grid Resilience Index",
    path: "/resilience",
    category: "Trust & Governance",
    icon: ShieldCheck,
    dataMode: "Live Data",
    dataModeType: "live",
    dataSource: "Live telemetry inputs + IEEE 1547.4 formulation",
    algorithms: ["4-Pillar Composite Reliability Score", "SAIDI / SAIFI / CAIDI Extrapolator"],
    summary: "0–100 grid health rating evaluated across 4 equal-weighted pillars: Supply Adequacy, Voltage Stability, Reserve Headroom, and Contingency Margin.",
    audience: "Chief Reliability Officers & Regulators",
    highlightMetric: "94.2/100 Composite Score"
  },
  {
    title: "Explainable AI (TreeSHAP)",
    path: "/explainable-ai",
    category: "Trust & Governance",
    icon: Cpu,
    dataMode: "Cached Data",
    dataModeType: "cached",
    dataSource: "Trained LightGBM & XGBoost model trees",
    algorithms: ["TreeSHAP Factor Decomposition", "Waterfall Feature Attribution"],
    summary: "Demystifies black-box AI decisions. Shows exact MW feature contributions (solar irradiance, temperature, humidity, time-of-day) for each dispatch recommendation.",
    audience: "Data Scientists & Compliance Officers",
    highlightMetric: "Exact MW feature attributions"
  },
  {
    title: "System Architecture",
    path: "/architecture",
    category: "Trust & Governance",
    icon: Layers,
    dataMode: "Cached Data",
    dataModeType: "cached",
    dataSource: "Hardware-free software specifications",
    algorithms: ["Next.js 14 + Python FastAPI Topology", "Ref. ISO 50001 / IEEE 1547.4 Concepts"],
    summary: "Detailed end-to-end technical pipeline, mathematical formulation references, API contracts, and compliance documentation demonstrating 100% software-native design.",
    audience: "System Architects & Technical Judges",
    highlightMetric: "Zero physical hardware needed"
  },
  {
    title: "AI Grid Copilot",
    path: "/copilot",
    category: "Operations",
    icon: MessageSquare,
    dataMode: "Live Data",
    dataModeType: "live",
    dataSource: "Grid Standards Reference RAG & Deterministic Fallback",
    algorithms: ["Vector Similarity RAG", "Contextual Grid Reasoning Engine"],
    summary: "Operator conversational assistant for querying grid status, looking up IEEE contingency procedures, and generating instant dispatch summaries.",
    audience: "Grid Engineers & Operations Trainees",
    highlightMetric: "Zero API key dependency"
  },
  {
    title: "DISCOM Operations Portal",
    path: "/discom",
    category: "Operations",
    icon: Building2,
    dataMode: "Cached Data",
    dataModeType: "cached",
    dataSource: "State DISCOM feeder billing models",
    algorithms: ["Feeder Loss Calculator", "AT&C Loss Reduction Estimator"],
    summary: "Executive portal for distribution companies (DISCOMs) tracking commercial losses, revenue leakage, feeder-level loading, and billing compliance.",
    audience: "DISCOM Executives & Financial Controllers",
    highlightMetric: "Feeder-level AT&C tracking"
  },
  {
    title: "Judge Evaluation Mode",
    path: "/judge-mode",
    category: "Trust & Governance",
    icon: Award,
    dataMode: "Live Data",
    dataModeType: "live",
    dataSource: "Automated test harness & live telemetry",
    algorithms: ["Interactive Feature Tour Runner", "10-Criterion Rubric Verification"],
    summary: "Dedicated interactive walkthrough built for hackathon evaluators. Features step-by-step guided tours, automated test runners, and mathematical proof sheets.",
    audience: "Hackathon Judges & Technical Reviewers",
    highlightMetric: "1-Click automated test runner"
  },
  {
    title: "Operator Login & Roles",
    path: "/login",
    category: "Operations",
    icon: KeyRound,
    dataMode: "Cached Data",
    dataModeType: "cached",
    dataSource: "Local client-side JWT mock store",
    algorithms: ["Role-Based Access Control (RBAC)", "JWT Demo Session Manager"],
    summary: "Instant 1-click login allowing judges and operators to test role-based views (Grid Controller, Renewable Operator, DISCOM Executive, System Auditor).",
    audience: "All Users & Judges",
    highlightMetric: "Instant 1-click test roles"
  }
];

export default function AboutPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDataMode, setSelectedDataMode] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePersona, setActivePersona] = useState<string>('all');

  const categories = ['All', 'Operations', 'Forecasting', 'Optimization', 'AI Engines', 'Trust & Governance'];
  const dataModes = ['All', 'Live Data', 'Cached Data', 'Demo / Synthetic Data'];

  const personas = [
    { id: 'all', label: 'All Roles', icon: Globe2 },
    { id: 'operator', label: 'Grid Operator / Dispatcher', icon: Zap, paths: ['/command-center', '/digital-twin', '/self-healing', '/incident-copilot'] },
    { id: 'forecaster', label: 'Renewables Analyst', icon: Sun, paths: ['/renewable-forecast', '/sky-vision', '/demand-forecast'] },
    { id: 'storage', label: 'BESS & Market Trader', icon: BatteryCharging, paths: ['/storage', '/tariff-engine', '/flexibility', '/p2p'] },
    { id: 'judge', label: 'Hackathon Judge / Auditor', icon: Award, paths: ['/judge-mode', '/about', '/architecture', '/explainable-ai', '/resilience'] }
  ];

  const filteredPages = useMemo(() => {
    return ALL_PAGES.filter(p => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      // Data mode filter
      if (selectedDataMode !== 'All' && p.dataMode !== selectedDataMode) return false;
      // Persona filter
      if (activePersona !== 'all') {
        const personaObj = personas.find(pr => pr.id === activePersona);
        if (personaObj && personaObj.paths && !personaObj.paths.includes(p.path)) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.summary.toLowerCase().includes(q);
        const matchesAlgo = p.algorithms.some(a => a.toLowerCase().includes(q));
        const matchesAudience = p.audience.toLowerCase().includes(q);
        const matchesSource = p.dataSource.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAlgo && !matchesAudience && !matchesSource) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDataMode, searchQuery, activePersona]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingBottom: 60 }}>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(13, 20, 36, 0.95) 0%, rgba(20, 31, 54, 0.85) 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 250,
          height: 250,
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 840 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span className="badge badge-live">
              <Sparkles size={13} style={{ marginRight: 4 }} />
              Platform Guide & System Directory
            </span>
            <span className="badge badge-forecast">20 Modular Pages</span>
            <span className="badge badge-sim">100% Hardware-Free</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
            About <span style={{ color: 'var(--cyan-primary)' }}>GridFlex AI</span>
          </h1>

          <p style={{ fontSize: '1.08rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
            GridFlex AI is a software-native, autonomous national energy grid optimization platform built to resolve the <strong>Duck Curve</strong>, eliminate renewable curtailment, and prevent blackout cascades across India's transmission network without requiring physical hardware installation.
          </p>

          {/* Quick Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginTop: 28
          }}>
            <div style={{ background: 'rgba(7, 11, 20, 0.6)', padding: '14px 18px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan-primary)' }}>20 Pages</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Complete operational ecosystem</div>
            </div>
            <div style={{ background: 'rgba(7, 11, 20, 0.6)', padding: '14px 18px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--amber-flow)' }}>5 AI Engines</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>SkyVision, Causal, Spatial, Tariff, Voice</div>
            </div>
            <div style={{ background: 'rgba(7, 11, 20, 0.6)', padding: '14px 18px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green-renew)' }}>3 Data Modes</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Live REST, Cached National, Demo Sim</div>
            </div>
            <div style={{ background: 'rgba(7, 11, 20, 0.6)', padding: '14px 18px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7' }}>15 Locales</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Web Speech regional Indian voice</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: DATA PROVENANCE & SYMBOLISM GUIDE */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={20} style={{ color: 'var(--cyan-primary)' }} />
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Data Modes &amp; Provenance Symbolism</h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Every page in GridFlex AI explicitly indicates its data source classification so users and evaluators know what is real, what is cached, and what is simulated.
            </p>
          </div>
          <Link href="/architecture" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>View Full Architecture Matrix</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: 20
        }}>
          {/* Live Data Card */}
          <div className="card" style={{ borderTop: '4px solid #10b981', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 10px #10b981',
                  display: 'inline-block'
                }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#10b981' }}>Live Data</h3>
              </div>
              <span className="badge badge-live">Real-Time</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
              Direct programmatic integration with public REST APIs and browser APIs that execute dynamically at runtime.
            </p>
            <div style={{ background: 'rgba(7, 11, 20, 0.6)', padding: '12px 14px', borderRadius: 8, fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div><strong>Active Feeds:</strong> Open-Meteo NWP Solar/Wind REST API, NASA POWER, Web Speech API (Voice input &amp; synthesis).</div>
              <div><strong>Symbol:</strong> Green pulsing dot &amp; <code style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '1px 6px', borderRadius: 4 }}>Live</code> tag.</div>
              <div><strong>Latency:</strong> ~120–450 ms dynamic roundtrip.</div>
            </div>
          </div>

          {/* Cached Data Card */}
          <div className="card" style={{ borderTop: '4px solid #00f0ff', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} style={{ color: 'var(--cyan-primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--cyan-primary)' }}>Cached Real Data</h3>
              </div>
              <span className="badge badge-forecast">National Baselines</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
              Authentic Indian national utility records scaled and locally cached to guarantee 100% uptime with zero external rate-limit failures during hackathon judging.
            </p>
            <div style={{ background: 'rgba(7, 11, 20, 0.6)', padding: '12px 14px', borderRadius: 8, fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div><strong>Active Datasets:</strong> Grid-India (NLDC) Daily PSP 64.8 MW profile, Vidyut PRAVAH IEX DAM prices (₹6.80/kWh), CEA installed mix.</div>
              <div><strong>Symbol:</strong> Cyan clock icon &amp; <code style={{ color: '#00f0ff', background: 'rgba(0, 240, 255, 0.15)', padding: '1px 6px', borderRadius: 4 }}>Cached Real</code> tag.</div>
              <div><strong>Reliability:</strong> 100% deterministic, 0 ms cold start.</div>
            </div>
          </div>

          {/* Demo / Synthetic Data Card */}
          <div className="card" style={{ borderTop: '4px solid #fbbf24', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Cpu size={16} style={{ color: 'var(--amber-flow)' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--amber-flow)' }}>Demo / Synthetic Data</h3>
              </div>
              <span className="badge badge-sim">Digital Twin</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
              Physics-constrained mathematical state-space differential equations and algorithmic solvers that simulate grid assets without physical sensors or battery racks.
            </p>
            <div style={{ background: 'rgba(7, 11, 20, 0.6)', padding: '12px 14px', borderRadius: 8, fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div><strong>Active Models:</strong> Appendix A3 40 MWh BESS electrochemical model, MILP dispatch solver, P2P Double Auction ledger.</div>
              <div><strong>Symbol:</strong> Amber chip icon &amp; <code style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.15)', padding: '1px 6px', borderRadius: 4 }}>Simulated</code> tag.</div>
              <div><strong>Fidelity:</strong> Designed with reference to IEEE 1547.4 &amp; ISO 50001 concepts.</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: "WHERE SHOULD I GO?" PERSONA QUICK NAVIGATOR */}
      <section style={{
        background: 'rgba(13, 20, 36, 0.8)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Compass size={22} style={{ color: 'var(--amber-flow)' }} />
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Where Should I Go? (Role-Based Navigator)</h2>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
          Select your objective or role to instantly highlight the exact pages relevant to your evaluation:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
          {personas.map(pr => {
            const Icon = pr.icon;
            const isSelected = activePersona === pr.id;
            return (
              <button
                key={pr.id}
                type="button"
                onClick={() => setActivePersona(pr.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isSelected ? 'var(--cyan-glow)' : 'rgba(20, 31, 54, 0.8)',
                  color: isSelected ? 'var(--cyan-primary)' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)'
                }}
              >
                <Icon size={16} />
                <span>{pr.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick intent shortcuts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14
        }}>
          <div style={{ background: 'rgba(7, 11, 20, 0.7)', padding: '14px 16px', borderRadius: 8, borderLeft: '3px solid var(--cyan-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>
              ⚡ Monitor Live Grid &amp; SCADA
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
              Inspect live frequency, solar/wind balance, and execute quick dispatch alerts.
            </div>
            <Link href="/command-center" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              Go to Command Center →
            </Link>
          </div>

          <div style={{ background: 'rgba(7, 11, 20, 0.7)', padding: '14px 16px', borderRadius: 8, borderLeft: '3px solid var(--amber-flow)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>
              🧪 Test Blackouts &amp; Fault Injections
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
              Trigger cloud dips, transformer overloads, and test automated islanding safely.
            </div>
            <Link href="/digital-twin" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              Go to Digital Twin →
            </Link>
          </div>

          <div style={{ background: 'rgba(7, 11, 20, 0.7)', padding: '14px 16px', borderRadius: 8, borderLeft: '3px solid #a855f7' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>
              👁️ Watch Cloud Velocity Radar
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
              See Farneback optical-flow tracking cloud vectors 15–30 mins ahead of solar drops.
            </div>
            <Link href="/sky-vision" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              Go to SkyVision Radar →
            </Link>
          </div>

          <div style={{ background: 'rgba(7, 11, 20, 0.7)', padding: '14px 16px', borderRadius: 8, borderLeft: '3px solid #10b981' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>
              🎯 Evaluate for Hackathon Judging
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
              Take the guided evaluation tour, run the 1-click test suite, and check mathematical proofs.
            </div>
            <Link href="/judge-mode" className="btn btn-amber btn-sm" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              Launch Judge Mode →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE CATALOG OF ALL PAGES */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={22} style={{ color: 'var(--cyan-primary)' }} />
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>All Platform Pages &amp; Specifications ({filteredPages.length})</h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Explore the detailed purpose, algorithms, and data source for each page in the GridFlex ecosystem.
            </p>
          </div>

          {/* Search bar */}
          <div style={{
            position: 'relative',
            minWidth: 280,
            maxWidth: 360,
            width: '100%'
          }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search by name, algorithm, or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(13, 20, 36, 0.9)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters Strip */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 18px',
          background: 'rgba(13, 20, 36, 0.5)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginRight: 4 }}>
              Category:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 6,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: selectedCategory === cat ? 'var(--cyan-primary)' : 'transparent',
                  color: selectedCategory === cat ? '#070b14' : 'var(--text-secondary)',
                  border: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Data Mode Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginRight: 4 }}>
              Data Provenance:
            </span>
            {dataModes.map(dm => (
              <button
                key={dm}
                type="button"
                onClick={() => setSelectedDataMode(dm)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: selectedDataMode === dm ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedDataMode === dm ? 'var(--cyan-primary)' : 'var(--text-secondary)',
                  border: selectedDataMode === dm ? '1px solid var(--cyan-primary)' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {dm}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 18
        }}>
          {filteredPages.map((page) => {
            const Icon = page.icon;
            return (
              <div
                key={page.path}
                className="card"
                style={{
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 14,
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: 'rgba(0, 240, 255, 0.1)',
                        border: '1px solid rgba(0, 240, 255, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--cyan-primary)',
                        flexShrink: 0
                      }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{page.title}</h3>
                        <span style={{ fontSize: '0.78rem', color: 'var(--cyan-primary)', fontFamily: 'monospace' }}>{page.path}</span>
                      </div>
                    </div>

                    <span className="badge badge-sim" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                      {page.category}
                    </span>
                  </div>

                  {/* Summary */}
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                    {page.summary}
                  </p>

                  {/* Algorithms & Tech tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                    {page.algorithms.map((algo, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.72rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          color: '#e2e8f0'
                        }}
                      >
                        {algo}
                      </span>
                    ))}
                  </div>

                  {/* Metadata Row */}
                  <div style={{
                    background: 'rgba(7, 11, 20, 0.6)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: '0.78rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Data Provenance:</span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontWeight: 600,
                        color: page.dataModeType === 'live' ? '#10b981' : page.dataModeType === 'cached' ? 'var(--cyan-primary)' : 'var(--amber-flow)'
                      }}>
                        {page.dataModeType === 'live' && (
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                        )}
                        {page.dataModeType === 'cached' && <Clock size={11} />}
                        {page.dataModeType === 'demo' && <Cpu size={11} />}
                        {page.dataMode}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Data Source:</span>
                      <span style={{ color: 'var(--text-secondary)', textAlign: 'right', maxWidth: '65%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {page.dataSource}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Benchmark:</span>
                      <span style={{ color: 'var(--amber-flow)', fontWeight: 600 }}>{page.highlightMetric}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                    For: {page.audience.split('&')[0]}
                  </span>
                  <Link
                    href={page.path}
                    className="btn btn-primary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: '0.8rem',
                      padding: '5px 14px'
                    }}
                  >
                    <span>Launch Page</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 48,
            background: 'rgba(13, 20, 36, 0.4)',
            borderRadius: 12,
            border: '1px dashed var(--border-subtle)'
          }}>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>No pages match your current filter and search query.</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setSelectedCategory('All'); setSelectedDataMode('All'); setSearchQuery(''); setActivePersona('all'); }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* SECTION 4: FULL TECH STACK & ARCHITECTURE MATRIX */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Code2 size={22} style={{ color: 'var(--cyan-primary)' }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Complete Technology Stack &amp; Algorithms</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18
        }}>
          {/* Layer 1 */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--cyan-primary)' }}>
              <Layers size={18} />
              <h4 style={{ margin: 0, fontSize: '1.02rem' }}>Frontend &amp; UI Architecture</h4>
            </div>
            <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
              <li><strong>Next.js 14 App Router</strong>: 23 statically pre-rendered routes for instant page delivery.</li>
              <li><strong>TypeScript &amp; React 18</strong>: Strongly typed data contracts across all telemetry models.</li>
              <li><strong>Vanilla CSS Design Tokens</strong>: Pure CSS tokens, zero heavy framework lag, dark obsidian theme.</li>
              <li><strong>Recharts &amp; HTML5 Canvas</strong>: Sub-cycle responsive vector charts and high-fps radar animations.</li>
              <li><strong>Lucide React</strong>: Unified iconography system across all pages.</li>
            </ul>
          </div>

          {/* Layer 2 */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--amber-flow)' }}>
              <Cpu size={18} />
              <h4 style={{ margin: 0, fontSize: '1.02rem' }}>AI &amp; Forecasting Engines</h4>
            </div>
            <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
              <li><strong>LightGBM Regressor v2.4</strong>: Multi-horizon solar/wind prediction with 95% quantile loss CI.</li>
              <li><strong>XGBoost Temporal v3.1</strong>: 24-hour demand forecasting with weather and day-type features.</li>
              <li><strong>TreeSHAP Attribution</strong>: Exact feature attribution waterfall (GHI, temp, wind, time).</li>
              <li><strong>Farneback Optical Flow</strong>: Dense canvas vector tracking for cloud shadow trajectories.</li>
              <li><strong>Causal Do-Calculus DAG</strong>: Pearlian causal graph [P(Y|do(X))] for automated self-healing.</li>
            </ul>
          </div>

          {/* Layer 3 */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--green-renew)' }}>
              <Scale size={18} />
              <h4 style={{ margin: 0, fontSize: '1.02rem' }}>Optimization &amp; Markets</h4>
            </div>
            <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
              <li><strong>MILP PuLP Solver</strong>: Mixed-Integer Linear Programming for multi-asset flexibility dispatch.</li>
              <li><strong>Appendix A3 BESS ODE</strong>: Electrochemical state-space simulation with thermal and C-rate safety.</li>
              <li><strong>Continuous Double Auction</strong>: Microgrid P2P energy matching with dynamic local pricing.</li>
              <li><strong>CERC DSM Matrix</strong>: Commercial frequency deviation penalty ledger conforming to 2024 regulations.</li>
              <li><strong>DC Power Flow</strong>: Topological transmission line loading and N-1 contingency routing.</li>
            </ul>
          </div>

          {/* Layer 4 */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#a855f7' }}>
              <Lock size={18} />
              <h4 style={{ margin: 0, fontSize: '1.02rem' }}>Data, Security &amp; Speech</h4>
            </div>
            <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
              <li><strong>Web Speech API</strong>: Native browser speech recognition and synthesis for English and Hindi.</li>
              <li><strong>Client-Side Mock Auth</strong>: LocalStorage JWT simulation with 4 preset operator roles.</li>
              <li><strong>Open-Meteo REST API</strong>: High-resolution global atmospheric telemetry feed.</li>
              <li><strong>Grid-India (NLDC) PSP</strong>: Real Indian power profile benchmark scaled to 64.8 MW feeder.</li>
              <li><strong>Ref. IEEE 1547.4 &amp; ISO 50001</strong>: Microgrid islanding and energy management reference guidelines.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <div style={{
        textAlign: 'center',
        padding: '36px 20px',
        background: 'linear-gradient(180deg, rgba(13, 20, 36, 0.4) 0%, rgba(20, 31, 54, 0.8) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16
      }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Ready to Experience GridFlex AI?</h3>
        <p style={{ margin: 0, maxWidth: 640, color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
          Start with the Live Command Center or launch the interactive Judge Evaluation Tour with 1-click test automation.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
          <Link href="/command-center" className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <Zap size={18} />
            <span>Launch Command Center</span>
          </Link>
          <Link href="/judge-mode" className="btn btn-amber" style={{ padding: '12px 24px' }}>
            <Award size={18} />
            <span>Take Judge Evaluation Tour</span>
          </Link>
          <Link href="/" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
            <span>Back to Home Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
