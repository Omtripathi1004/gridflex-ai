'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchResilienceBreakdown } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { 
  ShieldCheck, 
  HelpCircle, 
  Sun, 
  Zap, 
  BatteryCharging, 
  Sliders, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  Info
} from 'lucide-react';

export default function ResiliencePage() {
  const { t } = useLanguage();
  const [resData, setResData] = useState<any>(null);
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);

  useEffect(() => {
    fetchResilienceBreakdown().then(data => {
      if (data) setResData(data);
    });
  }, []);

  const compositeScore = resData?.composite_score || 74.8;
  const components = resData?.components || [
    {
      key: "renewable_availability",
      name: "Renewable Generation Availability",
      weight: 0.25,
      score: 80.1,
      raw_value: "51.4 MW / 64.2 MW demand",
      description: "Portion of active demand supplied directly by local zero-carbon generation."
    },
    {
      key: "demand_stress_margin",
      name: "Substation Demand Headroom Margin",
      weight: 0.25,
      score: 85.0,
      raw_value: "20.8 MW Headroom (24.5%)",
      description: "Thermal buffer remaining on primary 33kV substation power transformers."
    },
    {
      key: "storage_readiness",
      name: "Community Storage Readiness",
      weight: 0.25,
      score: 72.5,
      raw_value: "72.5% Fleet SOC (29.0 MWh stored)",
      description: "Available fast-response battery energy ready to mitigate instant ramps."
    },
    {
      key: "flexibility_readiness",
      name: "Flexible Load Demand Response Capacity",
      weight: 0.25,
      score: 85.3,
      raw_value: "12.8 MW ready (85.3% enrolled)",
      description: "Controllable flexible demand (EV charging, cold storage, HVAC) ready for dispatch."
    }
  ];

  const recentChanges = resData?.recent_factor_changes || [
    { timestamp: "10 minutes ago", factor: "Renewable Availability", delta: "+4.2 pts", cause: "Solar irradiance peaked at 890 W/m² as midday cloud cover cleared." },
    { timestamp: "35 minutes ago", factor: "Demand Stress Margin", delta: "-3.1 pts", cause: "Commercial HVAC chillers ramped up due to ambient temperature reaching 31.5°C." },
    { timestamp: "1 hour ago", factor: "Storage Readiness", delta: "+5.8 pts", cause: "Substation BESS-01 completed scheduled 5 MW bulk solar charge cycle." }
  ];

  const prescriptiveActions = resData?.prescriptive_actions || [
    { rank: 1, action: "Pre-cool commercial real estate towers by 1.5°C between 13:00-15:00", potential_gain: "+6.4 pts Resilience", feasibility: "High" },
    { rank: 2, action: "Shift 2.5 MW municipal water pumping cycle to 13:30 solar crest", potential_gain: "+4.8 pts Resilience", feasibility: "Immediate" },
    { rank: 3, action: "Hold BESS-02 discharge reserve threshold at minimum 65% until 18:00", potential_gain: "+3.5 pts Resilience", feasibility: "High" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('res.title')}</h1>
            <span className="badge badge-amber" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
              {t('res.formula_badge')}
            </span>
          </div>
          <p>{t('res.subtitle')}</p>
        </div>

        <button 
          onClick={() => setShowFormulaModal(!showFormulaModal)}
          className="btn btn-secondary btn-sm"
        >
          <Info size={15} /> {t('res.formula_detail_btn')}
        </button>
      </div>

      {/* Formula Modal / Banner */}
      {showFormulaModal && (
        <div className="card" style={{ background: 'rgba(0, 240, 255, 0.08)', borderColor: 'var(--border-medium)' }}>
          <h4 style={{ color: 'var(--cyan-primary)', marginBottom: 6 }}>{t('res.formula_title')}</h4>
          <code style={{ fontSize: '0.9rem', color: '#f8fafc', display: 'block', padding: '10px 14px', background: 'rgba(7, 11, 20, 0.8)', borderRadius: 8 }}>
            Composite = (0.25 × Renewable_Availability) + (0.25 × Substation_Margin) + (0.25 × Storage_SOC) + (0.25 × Flexible_Capacity)
          </code>
          <p style={{ fontSize: '0.8rem', marginTop: 8 }}>
            {t('res.formula_explanation')}
          </p>
        </div>
      )}

      {/* Composite Score Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(20, 31, 54, 0.9) 0%, rgba(13, 20, 36, 0.9) 100%)',
        border: '1px solid var(--border-medium)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        padding: '28px 32px'
      }}>
        <div>
          <span className="badge badge-live" style={{ marginBottom: 8 }}>{t('res.computed_badge')}</span>
          <h2 style={{ fontSize: '2.4rem', color: 'var(--cyan-primary)' }}>
            {compositeScore} <span style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>/ 100</span>
          </h2>
          <p style={{ marginTop: 6, fontSize: '0.95rem' }}>
            {t('res.current_status')}: <strong style={{ color: 'var(--green-renew)' }}>{t('res.status_healthy')}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', padding: '12px 18px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{t('res.target_benchmark')}</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>&gt; 75.0</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 18px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 10 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{t('res.blackout_margin')}</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--green-renew)' }}>+14.8 MW</div>
          </div>
        </div>
      </div>

      {/* The 4 Non-Opaque Mathematical Pillars */}
      <div>
        <h3 style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={20} style={{ color: 'var(--cyan-primary)' }} />
          {t('res.4pillars_title')}
        </h3>

        <div className="grid-4">
          {components.map((c: any) => (
            <div key={c.key} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="badge badge-sim">{t('res.pillar_weight')}</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan-primary)' }}>
                  {c.score}
                </span>
              </div>
              <h4 style={{ fontSize: '0.95rem', minHeight: 44 }}>{c.name}</h4>
              <div style={{ width: '100%', height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, margin: '10px 0', overflow: 'hidden' }}>
                <div style={{ width: `${c.score}%`, height: '100%', background: 'linear-gradient(90deg, #00f0ff, #10b981)' }} />
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                {c.raw_value}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Did The Score Change? (Recent Deltas) */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Clock size={20} style={{ color: 'var(--amber-flow)' }} />
            {t('res.why_title')}
          </h3>
          <span className="badge badge-live">{t('res.audit_badge')}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recentChanges.map((item: any, idx: number) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: 10
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', minWidth: 100 }}>{item.timestamp}</span>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>{item.factor}: </strong>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>{item.cause}</span>
                </div>
              </div>

              <span style={{
                fontWeight: 700,
                color: item.delta.startsWith('+') ? 'var(--green-renew)' : 'var(--red-risk)',
                fontSize: '0.92rem'
              }}>
                {item.delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Prescriptive Actions to Restore >90 Resilience */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={20} style={{ color: 'var(--green-renew)' }} />
            {t('res.prescriptive_title')}
          </h3>
          <span className="badge badge-forecast">{t('res.prescriptive_badge')}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {prescriptiveActions.map((act: any) => (
            <div
              key={act.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'rgba(20, 31, 54, 0.4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="badge badge-sim">{t('res.rank')}{act.rank}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{act.action}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="badge badge-live">{act.potential_gain}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{t('res.feasibility')}: {act.feasibility}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
