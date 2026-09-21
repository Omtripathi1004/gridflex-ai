'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, 
  Database, 
  Layers, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  FileText, 
  Cpu, 
  Radio, 
  Server, 
  Activity, 
  Eye, 
  Zap, 
  Scale, 
  HelpCircle,
  Clock,
  Key
} from 'lucide-react';
import { SCENARIO } from '../../lib/scenario';
import { 
  CACHED_GRID_INDIA_PSP, 
  CACHED_VIDYUT_PRAVAH, 
  CACHED_NASA_POWER, 
  CACHED_CEA_DATA 
} from '../../lib/governmentData';
import { DataTrustCenterModal } from '../../components/DataTrustCenterModal';

export default function DataAuditPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'sources' | 'contributions' | 'security' | 'raw_data'>('contributions');
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'gov' | 'satellite' | 'scada'>('all');

  const downloadScenarioJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SCENARIO, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gridflex_audit_scenario_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Layer 1: Authorized Data Sources (Where from & Authorization)
  const AUTHORIZED_SOURCES = [
    {
      id: "grid-india",
      name: "Grid Controller of India (NLDC)",
      dataset: "National Power System Profile (PSP) Daily Reports",
      type: "gov",
      authority: "Statutory National Grid Operator (Ministry of Power, GoI)",
      registryUrl: "https://report.grid-india.in/psp_report.php",
      frequency: "Updated daily at 06:00 IST",
      classification: "Scaled Real (Statutory)",
      contribution: "Provides all-India 24-hour demand shape scaled mathematically to our 64.8 MW Mahadevapura 33/11kV virtual substation load profile (Section 6.4).",
      securityProof: "Official public energy registry; verified checksum and time-series normalization."
    },
    {
      id: "vidyut-pravah",
      name: "Ministry of Power — Vidyut PRAVAH",
      dataset: "Real-Time Day-Ahead Market (IEX DAM) Clearing Prices",
      type: "gov",
      authority: "National Electricity Market Portal (Govt. of India)",
      registryUrl: "https://vidyutpravah.in",
      frequency: "15-minute time-block dispatch updates",
      classification: "Real Market Data",
      contribution: "Official electricity market price benchmark (₹6.80/kWh baseline, ₹16.20/kWh peak dynamic tariff), feeder congestion multiplier signals, and P2P prosumer bilateral settlement tariffs.",
      securityProof: "Official national spot-market exchange signals with statutory open-access limits."
    },
    {
      id: "nasa-power",
      name: "NASA POWER Atmospheric Science & MOSDAC / ISRO",
      dataset: "Hourly Solar Irradiance (GHI) & 50m Wind Climatology",
      type: "satellite",
      authority: "NASA Langley Research Center & ISRO Earth Observation",
      registryUrl: "https://power.larc.nasa.gov/api/temporal/hourly/point",
      frequency: "Hourly point-climatology & live reanalysis API",
      classification: "Real Physical Climatology",
      contribution: "Hourly Global Horizontal Irradiance (GHI W/m²), 50m wind speed (m/s), and 2m ambient temperature for physics-informed PV derating, heatwave stress curves, and wind turbine generation factors.",
      securityProof: "Open meteorological reanalysis with automated Open-Meteo fallback ladder."
    },
    {
      id: "cea-baseline",
      name: "Central Electricity Authority (CEA)",
      dataset: "National Installed Capacity Database & Standard CO₂ Baseline v19",
      type: "gov",
      authority: "Ministry of Power Technical Authority (data.gov.in / NDSAP)",
      registryUrl: "https://data.gov.in/resource/installed-generating-capacity-india",
      frequency: "Monthly statutory gazette",
      classification: "Official Registry Baseline",
      contribution: "44.6% non-fossil capacity mix and official statutory baseline grid emission factor (0.71 kg CO₂/kWh avoided) to calculate verified environmental savings.",
      securityProof: "National Data Sharing and Accessibility Policy (NDSAP) sovereign registry."
    },
    {
      id: "scada-telemetry",
      name: "33/11kV Substation SCADA Sensor Bus",
      dataset: "Virtual Substation High-Frequency Feeder Telemetry",
      type: "scada",
      authority: "IEEE 1547 / IEC 61850 Substation Protection Layer",
      registryUrl: "Local SCADA Interlock Bridge",
      frequency: "Sub-150ms WebSocket polling",
      classification: "Deterministic High-Frequency Telemetry",
      contribution: "Feeder active/reactive power (MW/MVAR), bus voltage (0.95–1.05 p.u.), frequency (49.80–50.20 Hz), and breaker status (CB-01 to CB-08) for FLISR and droop dispatch.",
      securityProof: "Human-in-the-loop protection interlock; breaker trips require operator authorization."
    }
  ];

  // Layer 2: Website Component & Page Contribution Matrix
  // "from where I get which data on my website"
  const WEBSITE_CONTRIBUTION_MATRIX = [
    {
      page: "Spatial Digital Twin",
      route: "/spatial-twin",
      sources: "Grid-India PSP + 33/11kV SCADA Telemetry",
      whatDataDescribes: "Real-time topology of 8 distribution feeders, 4 BESS nodes, 33/11kV transformers, and live active/reactive load flow.",
      modelOrEngine: "Topological Kirchhoff Network Solver + GIS Feeder Model",
      contribution: "Visualizes spatial grid congestion, thermal transformer stress, and real-time voltage profiles across the entire substation boundary.",
      badge: "Real-Time Telemetry"
    },
    {
      page: "Command Center Console",
      route: "/command-center",
      sources: "SCADA Telemetry + CERC Grid Frequency Monitor",
      whatDataDescribes: "Instantaneous grid frequency (50.0 Hz), feeder circuit breaker states (CB-01 to CB-08), and automated FLISR alerts.",
      modelOrEngine: "Threshold State Machine + Sub-150ms Telemetry Interlock",
      contribution: "Provides DISCOM grid operators with a single-pane-of-glass emergency command center for rapid response.",
      badge: "Operator Console"
    },
    {
      page: "SkyVision Cloud Radar",
      route: "/sky-vision",
      sources: "Satellite / Ground Optical Cloud Imagery Vectors",
      whatDataDescribes: "Dense cloud vector motion (-14.2 m/s eastward), cloud optical thickness, and nowcast solar ramp attenuation.",
      modelOrEngine: "Farneback Dense Optical Flow Computer Vision",
      contribution: "Predicts catastrophic irradiance collapse 15 minutes before physical ground SCADA irradiance sensors detect the cliff.",
      badge: "Computer Vision"
    },
    {
      page: "Renewable Generation Forecast",
      route: "/renewable-forecast",
      sources: "NASA POWER Solar GHI, Ambient Temp & 50m Wind Speed",
      whatDataDescribes: "Global Horizontal Irradiance (W/m²), ambient heat derating, and wind velocity profiles over 24h & 48h horizons.",
      modelOrEngine: "Hybrid LightGBM Regression + PyTorch LSTM (95% CI)",
      contribution: "Generates multi-horizon solar PV and wind generation forecasts with calibrated 90% and 10% uncertainty confidence bands.",
      badge: "ML Forecast"
    },
    {
      page: "Hourly Demand Forecast",
      route: "/demand-forecast",
      sources: "National PSP Load Shapes scaled to 64.8 MW Substation",
      whatDataDescribes: "Diurnal consumer electricity usage: residential cooling, commercial IT park baseload, EV transit charging, and agriculture pumping.",
      modelOrEngine: "XGBoost Temporal Regressor v3.1",
      contribution: "Pinpoints evening peak shortfall hours (18:00–22:00 IST) where demand surges to 64.8 MW while solar generation plunges.",
      badge: "ML Forecast"
    },
    {
      page: "Digital Twin: What-If Simulator",
      route: "/digital-twin",
      sources: "Physics 24h Demand + Solar/Wind + Weather Severity Factors",
      whatDataDescribes: "Dynamic adjustments for Solar (0–150%), Wind (0–150%), Demand (70–150%), BESS (0–100%), and Weather (Normal, Heatwave, Storm).",
      modelOrEngine: "Deterministic 24-hour Physical Power Balance Engine",
      contribution: "Empowers grid operators to simulate worst-case monsoon storms or heatwaves, calculating net MWh balance and shortage hours eliminated.",
      badge: "Physical Twin"
    },
    {
      page: "Flexibility & BESS Dispatch",
      route: "/flexibility",
      sources: "40 MWh Community BESS Telemetry + Commercial DR Contracts",
      whatDataDescribes: "Battery State-of-Charge (20%–90% safe envelope), continuous cell temperature (≤42°C), and 4.5 MW flexible HVAC load shift potential.",
      modelOrEngine: "Mixed-Integer Linear Programming (MILP Solver)",
      contribution: "Coordinates 4-hour evening BESS discharge with automated commercial load shaving to flatten the duck curve without load shedding.",
      badge: "Optimization"
    },
    {
      page: "Dynamic Tariffs & P2P Marketplace",
      route: "/tariff-engine",
      sources: "Vidyut PRAVAH Real Exchange DAM Clearing Prices",
      whatDataDescribes: "IEX Day-Ahead clearing price benchmarks (₹6.80/kWh), feeder congestion multipliers (1.48x), and prosumer bid-ask order books.",
      modelOrEngine: "Continuous Double Auction (DLMP Sandbox)",
      contribution: "Enables 42 local rooftop prosumers to clear 3.5 MW of bilateral solar power locally, saving ₹15.25 lakh and bypassing upstream transmission bottlenecks.",
      badge: "Market Sandbox"
    },
    {
      page: "Explainable AI (XAI) Engine",
      route: "/explainable-ai",
      sources: "Real-Time Telemetry Features + AI Dispatch Outputs",
      whatDataDescribes: "Mathematical attribution of every MW dispatched: GHI drop (-9.8 MW), evening peak demand (+16.8 MW), and HVAC load shift (-7.2 MW).",
      modelOrEngine: "TreeSHAP Mathematical Additivity (Σφᵢ = Output Proof)",
      contribution: "Removes black-box uncertainty by giving grid engineers exact, auditable waterfall proof of why the AI recommended each action.",
      badge: "Explainable AI"
    },
    {
      page: "Self-Healing Grid (FLISR)",
      route: "/self-healing",
      sources: "Zero-Sequence Overcurrent Protection Relays & Breaker SCADA",
      whatDataDescribes: "Fault detection timestamps (28ms), breaker isolation status (CB-12), and loop tie switch actuation (TS-04 closed in 112ms).",
      modelOrEngine: "IEEE 1547.4 Autonomous Fault Isolation & Islanding Interlock",
      contribution: "Simulates instantaneous fault isolation following treefall, automatically restoring electricity to 8,400 of 9,100 customers in <140ms.",
      badge: "Automation"
    },
    {
      page: "Voice Incident Co-pilot",
      route: "/incident-copilot",
      sources: "CERC DSM Regulations 2023 + CEA BESS Standards + IEEE Codes",
      whatDataDescribes: "Statutory grid code penalty rules, primary frequency response codes, and transformer emergency thermal overload thresholds (>85%).",
      modelOrEngine: "Bilingual Semantic RAG + Deterministic Dispatch Protocols",
      contribution: "Hands-free voice assistant allowing operators to query emergency protocols and dispatch remedial commands in English or Hindi.",
      badge: "Voice Co-pilot"
    },
    {
      page: "Grid Resilience Indicator",
      route: "/resilience",
      sources: "4-Pillar Composite Metrics (Renewable, Demand, Storage, Flex)",
      whatDataDescribes: "Equal-weighted resilience formulation (25% per pillar), statutory CO₂ baseline (0.71 kg/kWh), and emergency peaker diesel costs.",
      modelOrEngine: "IEEE 1547 Audit Formulation (0–100 Scale)",
      contribution: "Provides DISCOM executives and regulators with verifiable audit proof: 0 blackout hours, ₹15.25 lakh saved, and 14.2 tons of CO₂ avoided.",
      badge: "Audit Matrix"
    }
  ];

  // Layer 3: Security, Guardrails & Compliance Details
  const SECURITY_PILLARS = [
    {
      title: "Human-in-the-Loop Interlock",
      icon: Lock,
      color: "#ef4444",
      summary: "AI dispatch is strictly advisory; physical breaker trip commands require DISCOM operator authorization before SCADA actuation.",
      items: [
        "Zero autonomous breaker tripping on critical 33kV distribution buses",
        "Two-factor confirmation required for feeder islanding or microgrid black-start",
        "Override timeout: Operator can reject automated recommendations within 60 seconds"
      ]
    },
    {
      title: "Data Integrity & Non-Hallucination",
      icon: ShieldCheck,
      color: "#10b981",
      summary: "The system enforces transparent 'Honest Unavailable States' rather than fabricating missing telemetry.",
      items: [
        "If satellite or radar indices are offline, UI clearly badges 'Unavailable'",
        "No synthetic data is masked as live SCADA observation",
        "All hackathon demo inputs are explicitly tagged in Demo/Seeded Mode"
      ]
    },
    {
      title: "Statutory Compliance & Standards",
      icon: Scale,
      color: "#f59e0b",
      summary: "All optimization algorithms are strictly aligned with Indian electricity regulatory frameworks.",
      items: [
        "CERC DSM Regulations 2023 §5.3: Automated frequency protection (<49.90 Hz)",
        "IEEE 1547-2018: Standard for Interconnection of Distributed Energy Resources",
        "CEA BESS Guidelines 2023: Maximum 0.5C continuous discharge, cell temp ≤42°C",
        "Survey of India sovereign boundaries: 100% compliant boundary maps without disputed cuts"
      ]
    },
    {
      title: "Cryptographic Audit Trail",
      icon: Key,
      color: "#00f0ff",
      summary: "Every simulated action generates an immutable audit record with timestamps and input vectors.",
      items: [
        "SHA-256 hash generated for each flexibility dispatch directive",
        "Immutable ISO 8601 UTC timestamp logging in local SQLite database",
        "One-click audit export for state electricity regulatory commissions (SERCs)"
      ]
    }
  ];

  const filteredSources = selectedFilter === 'all' 
    ? AUTHORIZED_SOURCES 
    : AUTHORIZED_SOURCES.filter(s => s.type === selectedFilter);

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '24px 16px 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      color: 'var(--text-primary)'
    }}>
      {/* 1. Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 16,
        paddingBottom: 20,
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <ShieldCheck size={14} />
              {language === 'hi' ? 'डेटा सुरक्षा एवं ऑडिट केंद्र' : 'Data Security & Audit Evidence'}
            </span>
            <span className="badge badge-live">CERC &amp; IEEE 1547 Compliant</span>
            <span className="badge badge-sim">Substation Lineage Matrix</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, margin: '4px 0 8px 0' }}>
            Data Security, Provenance <span className="text-gradient-cyan">&amp; Component Lineage</span>
          </h1>

          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: 880, lineHeight: 1.6 }}>
            {language === 'hi'
              ? 'ग्रिडफ्लेक्स एआई के सभी डेटा स्रोतों, आधिकारिक सरकारी संदर्भों, सुरक्षा नियंत्रणों और प्रत्येक वेबसाइट मॉड्यूल के डेटा योगदान का पारदर्शी प्रकटीकरण।'
              : 'Transparent technical disclosure of all official Indian government data sources, satellite feeds, component-by-component data mappings, and security guardrails powering GridFlex AI.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setIsTrustModalOpen(true)}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #4f46e5 0%, #00f0ff 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              padding: '10px 18px',
              borderRadius: 8,
              boxShadow: '0 4px 15px rgba(0, 240, 255, 0.25)'
            }}
          >
            <ShieldCheck size={16} />
            <span>Interactive Trust Modal</span>
          </button>

          <button
            onClick={downloadScenarioJSON}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            title="Download full substation scenario JSON file"
          >
            <Download size={16} />
            <span>Export Scenario JSON</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: 6,
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: 2,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        {[
          { id: 'contributions', label: language === 'hi' ? 'वेबसाइट डेटा योगदान' : 'Website Data Mapping', icon: Layers },
          { id: 'sources', label: language === 'hi' ? 'अधिकृत डेटा स्रोत' : 'Authorized Data Sources', icon: Database },
          { id: 'security', label: language === 'hi' ? 'सुरक्षा एवं ऑडिट नियंत्रण' : 'Security & Audit Guardrails', icon: Lock },
          { id: 'raw_data', label: language === 'hi' ? 'प्रमाणित स्नैपशॉट डेटा' : 'Certified Government Data', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--cyan-primary)' : '2px solid transparent',
                background: isActive ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                color: isActive ? 'var(--cyan-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WEBSITE COMPONENT CONTRIBUTION MATRIX ("From where I get which data") */}
      {/* ========================================================================= */}
      {activeTab === 'contributions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10,
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                Website Feature &amp; Component Data Lineage
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Every page and module on GridFlex AI mapped directly to its origin dataset, calculation engine, and operational contribution.
              </p>
            </div>
            <span className="badge badge-cyan" style={{ fontSize: '0.78rem' }}>
              12 Integrated System Modules
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: 16
          }}>
            {WEBSITE_CONTRIBUTION_MATRIX.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '0 0 2px 0' }}>
                      {item.page}
                    </h3>
                    <code style={{ fontSize: '0.75rem', color: 'var(--cyan-primary)' }}>
                      {item.route}
                    </code>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.72rem', flexShrink: 0 }}>
                    {item.badge}
                  </span>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  fontSize: '0.8rem'
                }}>
                  <div>
                    <strong style={{ color: 'var(--amber-flow)' }}>Ingested Origin: </strong>
                    <span style={{ color: 'var(--text-primary)' }}>{item.sources}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#38bdf8' }}>Calculation / Model: </strong>
                    <span style={{ color: 'var(--text-primary)' }}>{item.modelOrEngine}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>What the Data Describes: </strong>
                    {item.whatDataDescribes}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Platform Contribution: </strong>
                    {item.contribution}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                  <Link
                    to={item.route}
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.76rem',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <span>Launch {item.page}</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AUTHORIZED DATA SOURCES ("Where from / Authorize the data sources") */}
      {/* ========================================================================= */}
      {activeTab === 'sources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Filter by Source Category:
            </span>
            {(['all', 'gov', 'satellite', 'scada'] as const).map(f => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`btn btn-sm ${selectedFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.78rem', textTransform: 'capitalize' }}
              >
                {f === 'all' ? 'All Sources (5)' : f === 'gov' ? 'Indian Government (3)' : f === 'satellite' ? 'Satellite / Climatology (1)' : 'Substation SCADA (1)'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredSources.map((source) => (
              <div
                key={source.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: 'rgba(0, 240, 255, 0.12)',
                      color: 'var(--cyan-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Database size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 2px 0' }}>
                        {source.name}
                      </h3>
                      <div style={{ fontSize: '0.84rem', color: 'var(--cyan-primary)', fontWeight: 600 }}>
                        {source.dataset}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
                      {source.classification}
                    </span>
                    <span className="badge badge-sim" style={{ fontSize: '0.74rem' }}>
                      {source.frequency}
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 14,
                  fontSize: '0.84rem',
                  lineHeight: 1.55
                }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 14, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                      Statutory Authority &amp; Ownership
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {source.authority}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <a
                        href={source.registryUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--cyan-primary)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                      >
                        <span>Official Portal / Registry</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 14, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                      Role &amp; Contribution in GridFlex AI
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      {source.contribution}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '0.78rem',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.08)',
                  padding: '8px 12px',
                  borderRadius: 6
                }}>
                  <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                  <span><strong>Data Verification Proof:</strong> {source.securityProof}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DATA SECURITY & AUDIT EVIDENCE */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: 16
          }}>
            {SECURITY_PILLARS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 12,
                    padding: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: `rgba(255, 255, 255, 0.05)`,
                      color: p.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={18} />
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                      {p.title}
                    </h3>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {p.summary}
                  </p>

                  <ul style={{
                    margin: '6px 0 0',
                    paddingLeft: 18,
                    fontSize: '0.8rem',
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}>
                    {p.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Audit Verification Statement */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(0, 240, 255, 0.08) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: 12,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              Statutory Indian Grid Code &amp; Ethical AI Attestation
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              GridFlex AI is designed from the ground up for Indian DISCOM operations and regulatory evaluation. 
              The software strictly adheres to CERC Demand Side Management (DSM) Regulations 2023, Central Electricity 
              Authority (CEA) Technical Standards for Connectivity of the Distributed Generation Resources, and IEEE 1547.4 
              guidelines for microgrid design and islanding. No synthetic data is passed as unverified live telemetry, and all 
              optimization recommendations remain advisory-first with complete operator override authority.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              <span>• Independent Build for Yuva Yodha Challenge 3</span>
              <span>• Reference Repository: Omtripathi1004/gridflex-ai</span>
              <span>• Sovereign 100% Survey of India Boundaries</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CERTIFIED RAW GOVERNMENT DATA & EXPORT */}
      {/* ========================================================================= */}
      {activeTab === 'raw_data' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
            gap: 18
          }}>
            {/* Box 1: Grid-India PSP 24h Profile */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: 18
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong style={{ fontSize: '0.94rem' }}>1. Grid Controller of India PSP Curve</strong>
                <span className="badge badge-live">National Scaled Real</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                National Peak: {CACHED_GRID_INDIA_PSP.value.national_peak_mw.toLocaleString()} MW | Substation Scaled Peak: {CACHED_GRID_INDIA_PSP.value.substation_scaled_peak_mw} MW
              </p>
              <pre style={{
                background: '#070b14',
                padding: 12,
                borderRadius: 6,
                fontSize: '0.74rem',
                color: '#38bdf8',
                maxHeight: 220,
                overflowY: 'auto'
              }}>
                {JSON.stringify(CACHED_GRID_INDIA_PSP.value.curve.slice(0, 10), null, 2)}
                {'\n// ... 24 hours full profile'}
              </pre>
            </div>

            {/* Box 2: Vidyut PRAVAH DAM Prices */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: 18
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong style={{ fontSize: '0.94rem' }}>2. Vidyut PRAVAH Market Price Clearing</strong>
                <span className="badge badge-gold">Real Tariff Signal</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                Day-Ahead Market (DAM) Clearing: ₹{CACHED_VIDYUT_PRAVAH.value.dam_clearing_price_inr}/kWh | RTM: ₹{CACHED_VIDYUT_PRAVAH.value.rtm_clearing_price_inr}/kWh
              </p>
              <pre style={{
                background: '#070b14',
                padding: 12,
                borderRadius: 6,
                fontSize: '0.74rem',
                color: '#fbbf24',
                maxHeight: 220,
                overflowY: 'auto'
              }}>
                {JSON.stringify(CACHED_VIDYUT_PRAVAH, null, 2)}
              </pre>
            </div>

            {/* Box 3: NASA POWER Solar & Wind */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: 18
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong style={{ fontSize: '0.94rem' }}>3. NASA POWER Solar Irradiance &amp; Wind Speed</strong>
                <span className="badge badge-cyan">Physical Reanalysis</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                Coordinates: 12.9716° N, 77.5946° E (Bengaluru Substation Envelope)
              </p>
              <pre style={{
                background: '#070b14',
                padding: 12,
                borderRadius: 6,
                fontSize: '0.74rem',
                color: '#34d399',
                maxHeight: 220,
                overflowY: 'auto'
              }}>
                {JSON.stringify({
                  metric: CACHED_NASA_POWER.metric,
                  peak_ghi_w_m2: CACHED_NASA_POWER.value.peak_ghi_w_m2,
                  mean_wind_speed_ms: CACHED_NASA_POWER.value.mean_wind_speed_ms,
                  hourly_ghi: CACHED_NASA_POWER.value.hourly_ghi.slice(6, 18),
                  hourly_wind_50m: CACHED_NASA_POWER.value.hourly_wind_50m.slice(0, 8)
                }, null, 2)}
              </pre>
            </div>

            {/* Box 4: Central Electricity Authority (CEA) Mix */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: 18
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong style={{ fontSize: '0.94rem' }}>4. CEA National Capacity Baseline &amp; CO₂ Factor</strong>
                <span className="badge badge-emerald">Official Gazette</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                CO₂ Emission Baseline: {CACHED_CEA_DATA.value.co2_grid_emission_factor_kg_kwh} kg/kWh | Non-fossil: {CACHED_CEA_DATA.value.non_fossil_share_pct}%
              </p>
              <pre style={{
                background: '#070b14',
                padding: 12,
                borderRadius: 6,
                fontSize: '0.74rem',
                color: '#a78bfa',
                maxHeight: 220,
                overflowY: 'auto'
              }}>
                {JSON.stringify(CACHED_CEA_DATA, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Data Trust Center Modal Trigger */}
      <DataTrustCenterModal
        isOpen={isTrustModalOpen}
        onClose={() => setIsTrustModalOpen(false)}
      />
    </div>
  );
}
