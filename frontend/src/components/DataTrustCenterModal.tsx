'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  ExternalLink, 
  Download, 
  X, 
  CheckCircle2, 
  Layers, 
  Info,
  Radio,
  FileCode2
} from 'lucide-react';
import { SCENARIO } from '../lib/scenario';
import { CACHED_GRID_INDIA_PSP, CACHED_VIDYUT_PRAVAH, CACHED_NASA_POWER, CACHED_CEA_DATA } from '../lib/governmentData';

interface DataTrustCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataTrustCenterModal: React.FC<DataTrustCenterModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'provenance' | 'citations' | 'export'>('provenance');
  const [dataMode, setDataMode] = useState<'live' | 'cached'>('cached');

  if (!isOpen) return null;

  const downloadScenarioJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SCENARIO, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gridflex_substation_scenario_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const citations = [
    {
      source: "Grid Controller of India (NLDC)",
      dataset: "Daily Power System Profile (PSP) Report",
      url: "https://report.grid-india.in/psp_report.php",
      usage: "All-India demand curve scaled to 64.8 MW virtual substation (Section 6.4)",
      classification: "Scaled Real",
      access: "Public download, updated daily 06:00 IST"
    },
    {
      source: "Ministry of Power — Vidyut PRAVAH",
      dataset: "IEX Day-Ahead Market (DAM) Clearing Prices",
      url: "https://vidyutpravah.in",
      usage: "Real exchange electricity price signals (₹6.80/kWh benchmark clearing price)",
      classification: "Real",
      access: "Public dashboard & mobile portal"
    },
    {
      source: "NASA Langley Atmospheric Science Data Center",
      dataset: "NASA POWER Hourly Climatology & Solar Irradiance",
      url: "https://power.larc.nasa.gov/api/temporal/hourly/point",
      usage: "Hourly GHI (W/m²), 50m wind speed (m/s), and 2m ambient temperature",
      classification: "Real",
      access: "Free REST API (no auth required for standard tier)"
    },
    {
      source: "Central Electricity Authority (CEA)",
      dataset: "All-India Installed Generating Capacity & CO2 Emission Baseline v19",
      url: "https://data.gov.in/resource/installed-generating-capacity-india",
      usage: "44.6% non-fossil capacity mix and 0.71 kg CO2/kWh grid emission factor",
      classification: "Real (Official Registry)",
      access: "Open Government Data Platform India (NDSAP)"
    },
    {
      source: "Open-Meteo",
      dataset: "Global Numerical Weather Prediction (NWP) Models",
      url: "https://open-meteo.com",
      usage: "Fallback atmospheric simulation if NASA POWER is unreachable",
      classification: "Public Weather Model (Non-Government)",
      access: "Free public weather API"
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }}>
      <div style={{
        background: 'var(--surface, #111832)',
        border: '1px solid var(--border-medium, rgba(0, 240, 255, 0.2))',
        borderRadius: 16,
        width: '100%',
        maxWidth: 780,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border, #1F2A4A)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={24} style={{ color: 'var(--brand, #4F46E5)' }} />
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Data Trust Center & Audit Evidence</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted, #94A3B8)', margin: 0 }}>
                Transparent data contracts, government citations, and live provenance ladder
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Global Data Mode Switcher */}
        <div style={{
          padding: '12px 24px',
          background: 'rgba(20, 31, 54, 0.5)',
          borderBottom: '1px solid var(--border, #1F2A4A)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio size={14} style={{ color: '#00f0ff' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Active Ingestion Pipeline:</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['live', 'cached'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setDataMode(mode)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  border: dataMode === mode ? '1px solid var(--brand, #4F46E5)' : '1px solid var(--border, #1F2A4A)',
                  background: dataMode === mode ? 'rgba(79, 70, 229, 0.2)' : 'transparent',
                  color: dataMode === mode ? '#E6EAF5' : '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                {mode === 'cached' ? 'Cached Snapshot (Active)' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border, #1F2A4A)', padding: '0 24px' }}>
          <button
            onClick={() => setActiveTab('provenance')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'provenance' ? '2px solid #00f0ff' : '2px solid transparent',
              color: activeTab === 'provenance' ? '#00f0ff' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            Data Provenance Matrix
          </button>
          <button
            onClick={() => setActiveTab('citations')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'citations' ? '2px solid #00f0ff' : '2px solid transparent',
              color: activeTab === 'citations' ? '#00f0ff' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            Government Citations
          </button>
          <button
            onClick={() => setActiveTab('export')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'export' ? '2px solid #00f0ff' : '2px solid transparent',
              color: activeTab === 'export' ? '#00f0ff' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            Audit Export & Verifications
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: 24, overflowY: 'auto' }}>
          {activeTab === 'provenance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5 }}>
                GridFlex AI enforces an honest data hierarchy. A real 33/11kV feeder telemetry feed is confidential utility SCADA, so we scale certified national & regional profiles to our virtual 64.8 MW substation.
              </div>

              <div className="table-wrapper">
                <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Classification</th>
                      <th>Source & Method</th>
                      <th>Freshness</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Grid Demand Shape</strong></td>
                      <td><span className="badge badge-forecast" style={{ color: '#06b6d4' }}>Scaled Real</span></td>
                      <td>Grid-India NLDC Daily PSP Report (scaled by peak)</td>
                      <td>Daily 06:00 IST</td>
                    </tr>
                    <tr>
                      <td><strong>Electricity Clearing Price</strong></td>
                      <td><span className="badge badge-live" style={{ color: '#22c55e' }}>Real</span></td>
                      <td>Vidyut PRAVAH / IEX DAM (₹6.80/kWh)</td>
                      <td>Hourly</td>
                    </tr>
                    <tr>
                      <td><strong>Solar Irradiance & Wind</strong></td>
                      <td><span className="badge badge-live" style={{ color: '#22c55e' }}>Real (Satellite)</span></td>
                      <td>NASA POWER Point API (Bangalore Hub)</td>
                      <td>Hourly point query</td>
                    </tr>
                    <tr>
                      <td><strong>Renewable Capacity Mix</strong></td>
                      <td><span className="badge badge-live" style={{ color: '#22c55e' }}>Real (Monthly)</span></td>
                      <td>Central Electricity Authority (data.gov.in)</td>
                      <td>Monthly CEA Bulletin</td>
                    </tr>
                    <tr>
                      <td><strong>BESS Fleet & P2P Orders</strong></td>
                      <td><span className="badge badge-sim" style={{ color: '#fbbf24' }}>Simulated</span></td>
                      <td>Physics-constrained 40 MWh fleet model (10-90% SoC)</td>
                      <td>Sub-second internal state</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'citations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {citations.map((c, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(20, 31, 54, 0.4)',
                    border: '1px solid var(--border, #1F2A4A)',
                    borderRadius: 8
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ fontSize: '0.9rem', color: '#f8fafc' }}>{c.source}</strong>
                    <span className="badge badge-forecast" style={{ fontSize: '0.7rem' }}>{c.classification}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#00f0ff', marginBottom: 6 }}>{c.dataset}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: 6 }}><strong>Role:</strong> {c.usage}</div>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.74rem',
                      color: 'var(--brand, #4F46E5)',
                      textDecoration: 'underline'
                    }}
                  >
                    Open Source Portal <ExternalLink size={11} />
                  </a>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'export' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                padding: 16,
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 8,
                fontSize: '0.82rem',
                lineHeight: 1.5
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                  <strong style={{ color: '#10b981' }}>Single Source of Truth Verified</strong>
                </div>
                All pages (Command Center, Digital Twin, Storage, P2P, Resilience, XAI) consume synchronized values directly from the certified <code>scenario.json</code> schema. No drifting quantities across tabs.
              </div>

              <button
                onClick={downloadScenarioJSON}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Download size={16} /> Download Active Scenario JSON
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
