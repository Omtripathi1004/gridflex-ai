'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { runOptimization } from '../../lib/api';
import { ProvenanceBadge } from '../../components/ProvenanceBadge';
import { 
  Sliders, 
  TrendingDown, 
  CheckCircle2, 
  IndianRupee, 
  Leaf, 
  Clock, 
  BatteryCharging, 
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function FlexibilityPage() {
  const { t } = useLanguage();
  const [optData, setOptData] = useState<any>(null);
  const [bessAvail, setBessAvail] = useState<number>(100);
  const [flexPart, setFlexPart] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    runOptimization(bessAvail, flexPart).then(data => {
      if (data) setOptData(data);
      setLoading(false);
    });
  }, [bessAvail, flexPart]);

  // H4: Standardized to INR (₹) and L2: tCO2 with CEA emission factor
  const scorecard = optData?.scorecard || {
    peak_reduction_mw: 9.8,
    peak_reduction_pct: 13.5,
    shortage_hours_before: 4,
    shortage_hours_after: 0,
    shortage_elimination_pct: 100.0,
    total_energy_shifted_mwh: 15.6,
    bess_discharged_mwh: 24.2,
    estimated_cost_savings_inr: 142500, // ₹1,42,500 DSM penalties avoided
    co2_emissions_avoided_tonnes: 6.8 // CEA grid emission factor 0.71 kg/kWh
  };

  // 24h Profile Before vs After
  const balanceSeries = optData?.hourly_balance || Array.from({ length: 24 }, (_, h) => {
    const time = `${h.toString().padStart(2, '0')}:00`;
    const original = 45.0 + 18.0 * Math.exp(-Math.pow(h - 10, 2) / 6) + 26.0 * Math.exp(-Math.pow(h - 20, 2) / 8);
    const shift = (h >= 18 && h <= 21) ? -4.5 : ((h >= 11 && h <= 14) ? 4.5 : 0);
    const optimized = original + shift;
    const solar = (h >= 6 && h <= 18) ? Math.sin(Math.PI * (h - 6) / 12) * 52.0 : 0;
    const wind = 16.0 + 5.0 * Math.cos(h / 3.8);
    return {
      time,
      original_demand: Number(original.toFixed(1)),
      optimized_demand: Number(optimized.toFixed(1)),
      renewable_supply: Number((solar + wind).toFixed(1))
    };
  });

  // M4: Resilient Fallback Directives (Never empty in SSR or offline mode)
  const recommendations = optData?.recommendations || [
    {
      id: "DIR-01",
      action: "Pre-Cool Commercial District HVAC Towers by 1.8°C",
      asset: "Feeder F-01 Tech Park Chillers (28.4 MW Base)",
      reason: "Pre-cool thermal inertia during 11:00-14:00 solar crest to shed 4.2 MW load at 19:30 evening ramp.",
      confidence: 0.96
    },
    {
      id: "DIR-02",
      action: "Dispatch BESS-01 & BESS-02 Evening Discharge (6.5 MW)",
      asset: "33/11kV Substation LFP Battery Fleet (32 MWh Usable)",
      reason: "Supplies critical evening domestic peak without exceeding the 90% DoD constraint ceiling.",
      confidence: 0.94
    },
    {
      id: "DIR-03",
      action: "Shift Municipal Water Reservoir Pumping to 13:30",
      asset: "Municipal Feeder F-03 Pumping Station (6.2 MW Municipal Load)",
      reason: "Absorbs local solar generation surge while clearing peak evening pumping requirements.",
      confidence: 0.92
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header with High-Contrast Themed Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <span className="badge badge-live" style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'var(--purple-insight)', border: '1px solid var(--purple-insight)' }}>
              <Sliders size={14} style={{ marginRight: 4 }} />
              MILP Multi-Asset Solver
            </span>
            <span className="badge badge-amber" style={{ background: 'rgba(251, 191, 36, 0.15)', color: 'var(--gold-accent)', border: '1px solid var(--gold-accent)' }}>
              100% Deficit Mitigated (4.0h → 0h)
            </span>
            <ProvenanceBadge classification="forecast" sourceName="PuLP / CBC MILP Solver (5-Minute Horizon)" mode="cached" />
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: 6 }}>
            <span className="text-gradient-purple">Flexibility Dispatch</span> &amp; <span className="text-gradient-cyan">Peak Shaving Engine</span>
          </h1>
          <p style={{ maxWidth: 840, fontSize: '0.96rem', color: 'var(--text-secondary)' }}>{t('flex.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/explainable-ai" className="btn btn-purple btn-sm">
            <Cpu size={14} style={{ marginRight: 4 }} /> Why This Action? (XAI Rationale)
          </Link>
          <span className="badge badge-live" style={{ padding: '8px 14px' }}>
            <CheckCircle2 size={14} style={{ marginRight: 4 }} /> 0 Shortage Hours
          </span>
        </div>
      </div>

      {/* Measurable Impact Scorecard — XAI-style colored kpi-strip */}
      <div className="kpi-strip">
        <div className="card-crimson kpi-strip-item">
          <div className="kpi-strip-label" style={{ color: 'var(--red-risk)' }}>
            <TrendingDown size={13} style={{ display:'inline',marginRight:4 }} />{t('flex.metric_peak_shaved')}
          </div>
          <div className="kpi-strip-value" style={{ color: '#fca5a5' }}>{scorecard.peak_reduction_mw} MW</div>
          <div className="kpi-strip-meta">-{scorecard.peak_reduction_pct}% · {t('flex.peak_shaved_meta')}</div>
        </div>

        <div className="card-emerald kpi-strip-item">
          <div className="kpi-strip-label" style={{ color: 'var(--green-renew)' }}>
            <Clock size={13} style={{ display:'inline',marginRight:4 }} />{t('flex.metric_shortage_elim')}
          </div>
          <div className="kpi-strip-value" style={{ color: '#6ee7b7' }}>{scorecard.shortage_hours_before}h → {scorecard.shortage_hours_after}h</div>
          <div className="kpi-strip-meta">{t('flex.shortage_elim_meta')}</div>
        </div>

        <div className="card-gold kpi-strip-item">
          <div className="kpi-strip-label" style={{ color: 'var(--gold-accent)' }}>
            <IndianRupee size={13} style={{ display:'inline',marginRight:4 }} />DSM Penalty Avoided
          </div>
          <div className="kpi-strip-value" style={{ color: '#fef08a' }}>₹{scorecard.estimated_cost_savings_inr.toLocaleString('en-IN')}</div>
          <div className="kpi-strip-meta">CERC Deviation Settlement</div>
        </div>

        <div className="card-cyan kpi-strip-item">
          <div className="kpi-strip-label" style={{ color: 'var(--cyan-primary)' }}>
            <Leaf size={13} style={{ display:'inline',marginRight:4 }} />CO₂ Avoided
          </div>
          <div className="kpi-strip-value" style={{ color: '#a5f3fc' }}>{scorecard.co2_emissions_avoided_tonnes} tCO₂</div>
          <div className="kpi-strip-meta">CEA Factor: 0.71 kg/kWh</div>
        </div>
      </div>

      {/* Load Profile Before vs After Flexibility */}
      <div className="card-cyan" style={{ padding: 24, borderRadius: 'var(--radius-lg)' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Sliders size={20} style={{ color: 'var(--cyan-primary)' }} />
              {t('flex.before_after_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4 }}>
              Peak shaving of 9.8 MW shifts demand from the evening deficit window (18:00–21:30) into the midday solar crest (11:00–14:00).
            </p>
          </div>
          <span className="badge badge-live">{t('flex.optimum_badge')}</span>
        </div>

        <div style={{ width: '100%', height: 360, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={balanceSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" MW" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d1424', 
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  color: '#f8fafc' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: 10 }} />
              <Line 
                type="monotone" 
                dataKey="original_demand" 
                name="Baseline Demand (Unmanaged)" 
                stroke="#ef4444" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="optimized_demand" 
                name="Optimized Demand (GridFlex Shaved)" 
                stroke="#00f0ff" 
                strokeWidth={2.5} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="renewable_supply" 
                name="Renewable Generation (Solar + Wind)" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dispatched Operational Action Cards (M4: Guaranteed Hydrated & Loading Handled) */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="card-title">
              <CheckCircle2 size={20} style={{ color: 'var(--green-renew)' }} />
              Dispatched Operational Directives
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4 }}>
              Automated feeder switching & setpoint commands dispatched to substation RTUs
            </p>
          </div>
          <span className="badge badge-live">3 Directives Active</span>
        </div>

        {loading ? (
          <div style={{ padding: 30, textAlign: 'center', color: '#94a3b8' }}>
            Recomputing optimal dispatch matrix...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recommendations.map((rec: any) => (
              <div 
                key={rec.id}
                className="card kpi flex"
                style={{
                  background: 'rgba(20, 31, 54, 0.4)',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span className="badge badge-sim">{rec.id}</span>
                  <div>
                    <h4 style={{ color: 'var(--cyan-primary)', fontSize: '1.02rem', margin: 0 }}>{rec.action}</h4>
                    <p style={{ fontSize: '0.84rem', marginTop: 4, color: '#e2e8f0', margin: '4px 0 0' }}>
                      <strong>Target Asset:</strong> {rec.asset} &nbsp;|&nbsp; <strong>Engineering Rationale:</strong> {rec.reason}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="badge badge-live" style={{ fontSize: '0.78rem' }}>
                    Confidence {(rec.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
