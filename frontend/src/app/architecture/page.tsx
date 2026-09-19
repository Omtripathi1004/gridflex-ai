'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Layers, 
  Database, 
  Server, 
  Cpu, 
  Layout, 
  ShieldCheck, 
  CheckCircle2, 
  FileCode2,
  GitBranch
} from 'lucide-react';

export default function ArchitecturePage() {
  const { t } = useLanguage();

  const matrix = [
    {
      component: "Weather Telemetry (GHI, Temp, Wind)",
      type: "Real Public Data / NWP",
      source: "Open-Meteo High-Resolution NWP / ERA5 Reanalysis",
      purpose: "Provide meteorological features for generation models."
    },
    {
      component: "Renewable Generation Forecast",
      type: "ML Forecast",
      source: "LightGBM Regression v2.4 + TreeSHAP Explanation",
      purpose: "Day-ahead 24h/48h solar and wind prediction with 95% CI."
    },
    {
      component: "Hourly Grid Demand Forecast",
      type: "ML Forecast",
      source: "XGBoost Temporal Model v3.1",
      purpose: "Detect evening peak windows and substation transformer stress."
    },
    {
      component: "Flexibility Dispatch & Optimization",
      type: "Algorithmic Solver",
      source: "Mixed-Integer Linear Programming (MILP Dispatcher)",
      purpose: "Calculates optimal BESS discharge and EV load shift schedules."
    },
    {
      component: "Virtual Community Storage (BESS)",
      type: "Digital Twin Simulation",
      source: "State-Space Battery Electrochemical Model",
      purpose: "Models 4 distributed battery nodes (40 MWh capacity) without physical hardware."
    },
    {
      component: "P2P Energy Coordination",
      type: "Market Simulation",
      source: "Continuous Double Auction (DLMP Sandbox)",
      purpose: "Demonstrates local prosumer energy matching and ledger settlement."
    },
    {
      component: "Grid Resilience Indicator (0–100)",
      type: "Formula Computed",
      source: "Transparent 4-Pillar Formulation (25% equal weighting)",
      purpose: "Auditable resilience evaluation strictly aligned with IEEE 1547."
    },
    {
      component: "AI Energy Copilot",
      type: "RAG Assistant + Fallback",
      source: "Ingested IEEE 1547 Standards + Deterministic Domain Engine",
      purpose: "Answers operator inquiries with zero external API key requirements."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h1>{t('arch.title')}</h1>
          <span className="badge badge-live">ISO 50001 & IEEE Compliant</span>
        </div>
        <p>{t('arch.subtitle')}</p>
      </div>

      {/* End-to-End Pipeline Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <GitBranch size={20} style={{ color: 'var(--cyan-primary)' }} />
            {t('arch.flow_title')}
          </h3>
          <span className="badge badge-forecast">Next.js 14 + FastAPI Architecture</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginTop: 10
        }}>
          <div className="metric-card" style={{ borderColor: 'var(--border-medium)' }}>
            <span className="metric-label"><Layout size={16} style={{ color: 'var(--cyan-primary)' }} /> {t('arch.layer_frontend')}</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: 4 }}>{t('arch.layer_nextjs')}</div>
            <span className="metric-meta">{t('arch.layer_frontend_desc')}</span>
          </div>

          <div className="metric-card" style={{ borderColor: 'var(--border-amber)' }}>
            <span className="metric-label"><Server size={16} style={{ color: 'var(--amber-flow)' }} /> {t('arch.layer_backend')}</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: 4 }}>{t('arch.layer_fastapi')}</div>
            <span className="metric-meta">{t('arch.layer_backend_desc')}</span>
          </div>

          <div className="metric-card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
            <span className="metric-label"><Cpu size={16} style={{ color: 'var(--green-renew)' }} /> {t('arch.layer_ml')}</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: 4 }}>{t('arch.layer_ml_tech')}</div>
            <span className="metric-meta">{t('arch.layer_ml_desc')}</span>
          </div>

          <div className="metric-card" style={{ borderColor: 'rgba(168, 85, 247, 0.4)' }}>
            <span className="metric-label"><Database size={16} style={{ color: '#a855f7' }} /> {t('arch.layer_knowledge')}</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: 4 }}>{t('arch.layer_rag_tech')}</div>
            <span className="metric-meta">{t('arch.layer_knowledge_desc')}</span>
          </div>
        </div>
      </div>

      {/* Data & Demo Integrity Matrix Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <ShieldCheck size={20} style={{ color: 'var(--green-renew)' }} />
            {t('arch.integrity_title')}
          </h3>
          <span className="badge badge-sim">{t('arch.disclosure_title')}</span>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t('arch.col_component')}</th>
                <th>{t('arch.col_type')}</th>
                <th>{t('arch.col_source')}</th>
                <th>{t('arch.col_purpose')}</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, idx) => {
                let badgeClass = 'badge-live';
                if (row.type.includes('Simulation')) badgeClass = 'badge-sim';
                else if (row.type.includes('Forecast')) badgeClass = 'badge-forecast';
                else if (row.type.includes('Formula')) badgeClass = 'badge-amber';

                return (
                  <tr key={idx}>
                    <td><strong>{row.component}</strong></td>
                    <td>
                      <span className={`badge ${badgeClass}`} style={{ fontSize: '0.74rem' }}>
                        {row.type}
                      </span>
                    </td>
                    <td><code style={{ color: '#38bdf8' }}>{row.source}</code></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{row.purpose}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
