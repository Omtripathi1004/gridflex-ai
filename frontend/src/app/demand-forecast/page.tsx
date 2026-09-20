'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { fetchDemandForecast } from '../../lib/api';
import { 
  TrendingUp, 
  AlertTriangle, 
  Home, 
  Building, 
  Factory, 
  Car, 
  Clock, 
  Zap,
  Info,
  Cpu 
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function DemandForecastPage() {
  const { t } = useLanguage();
  const [demandData, setDemandData] = useState<any>(null);

  useEffect(() => {
    fetchDemandForecast().then(data => setDemandData(data));
  }, []);

  const series = demandData?.forecast_series || [];
  const metrics = demandData?.metrics || {
    load_mae_mw: 1.84,
    load_rmse_mw: 2.45,
    load_r2_score: 0.963,
    peak_demand_mw: 72.4,
    peak_window_hours: "18:00 - 22:00",
    curtailment_avoidance_potential_mw: 14.8
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header with High-Contrast Themed Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <span className="badge badge-live" style={{ background: 'rgba(0, 240, 255, 0.15)', color: 'var(--cyan-primary)', border: '1px solid var(--cyan-primary)' }}>
              <TrendingUp size={14} style={{ marginRight: 4 }} />
              Grid-India Scaled PSP Baseline
            </span>
            <span className="badge badge-amber" style={{ background: 'rgba(251, 191, 36, 0.15)', color: 'var(--gold-accent)', border: '1px solid var(--gold-accent)' }}>
              <Clock size={14} style={{ marginRight: 4 }} />
              Peak Window: 18:00 - 22:00 IST
            </span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: 6 }}>
            <span className="text-gradient-cyan">Grid Demand</span> &amp; <span className="text-gradient-pink">Peak Deficit Forecast</span>
          </h1>
          <p style={{ maxWidth: 840, fontSize: '0.96rem', color: 'var(--text-secondary)' }}>{t('df.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/explainable-ai" className="btn btn-purple btn-sm">
            <Cpu size={14} style={{ marginRight: 4 }} /> TreeSHAP Deficit Attribution
          </Link>
          <span className="badge badge-risk-critical" style={{ padding: '8px 14px' }}>
            <AlertTriangle size={14} style={{ marginRight: 4 }} /> Peak Risk: 18:00 - 22:00
          </span>
        </div>
      </div>

      {/* Demand KPIs — XAI-style colored strip */}
      <div className="kpi-strip">
        <div className="card-gold kpi-strip-item">
          <div className="kpi-strip-label" style={{ color: 'var(--gold-accent)' }}>
            <Clock size={13} style={{ display:'inline',marginRight:4 }} />{t('df.peak_window')}
          </div>
          <div className="kpi-strip-value" style={{ color: '#fef08a' }}>{metrics.peak_window_hours}</div>
          <div className="kpi-strip-meta">{t('df.peak_meta')}</div>
        </div>

        <div className="card-crimson kpi-strip-item">
          <div className="kpi-strip-label" style={{ color: 'var(--red-risk)' }}>
            <AlertTriangle size={13} style={{ display:'inline',marginRight:4 }} />Peak Demand
          </div>
          <div className="kpi-strip-value" style={{ color: '#fca5a5' }}>{metrics.peak_demand_mw} MW</div>
          <div className="kpi-strip-meta">Predicted Maximum Load</div>
        </div>

        <div className="card-emerald kpi-strip-item">
          <div className="kpi-strip-label" style={{ color: 'var(--green-renew)' }}>
            <Zap size={13} style={{ display:'inline',marginRight:4 }} />{t('df.peak_reduction')}
          </div>
          <div className="kpi-strip-value" style={{ color: '#6ee7b7' }}>{metrics.curtailment_avoidance_potential_mw} MW</div>
          <div className="kpi-strip-meta">{t('df.reduction_meta')}</div>
        </div>

        <div className="card-cyan kpi-strip-item">
          <div className="kpi-strip-label" style={{ color: 'var(--cyan-primary)' }}>
            <TrendingUp size={13} style={{ display:'inline',marginRight:4 }} />{t('df.r2_label')}
          </div>
          <div className="kpi-strip-value" style={{ color: '#a5f3fc' }}>R² {metrics.load_r2_score}</div>
          <div className="kpi-strip-meta">MAE: {metrics.load_mae_mw} MW</div>
        </div>
      </div>

      {/* Demand Forecast Chart */}
      <div className="card-cyan" style={{ padding: 24, borderRadius: 'var(--radius-lg)' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <TrendingUp size={20} style={{ color: 'var(--cyan-primary)' }} />
              {t('df.chart_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
              {t('df.chart_desc')}
            </p>
          </div>
          <span className="badge badge-forecast">{t('df.model_badge')}</span>
        </div>

        <div style={{ width: '100%', height: 380, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" MW" domain={[30, 80]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d1424', 
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  color: '#f8fafc' 
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Area
                type="monotone"
                dataKey="demand_predicted"
                name={t('df.chart_forecast')}
                stroke="#00f0ff"
                strokeWidth={2.5}
                fill="rgba(0, 240, 255, 0.09)"
              />
              <Line
                type="monotone"
                dataKey="demand_actual"
                name={t('df.chart_actual')}
                stroke="#10b981"
                strokeWidth={2.2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#10b981' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consumption Segment Breakdown */}
      <div className="card-purple" style={{ padding: 24, borderRadius: 'var(--radius-lg)' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Building size={20} style={{ color: 'var(--purple-insight)' }} />
            <span className="text-gradient-purple">{t('df.segments_title')}</span>
          </h3>
          <span className="badge badge-sim">{t('badge.simulation')}</span>
        </div>

        <div className="grid-4">
          <div className="card-crimson" style={{ padding: '16px 18px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:6 }}><Home size={15} color="var(--red-risk)" /><span style={{ fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',color:'var(--red-risk)' }}>{t('df.seg_residential')}</span></div>
            <div style={{ fontSize:'1.8rem',fontWeight:800,color:'#fca5a5' }}>42%</div>
            <div style={{ fontSize:'0.74rem',color:'var(--text-secondary)',marginTop:3 }}>{t('df.segment_residential_meta')}</div>
          </div>

          <div className="card-cyan" style={{ padding: '16px 18px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:6 }}><Building size={15} color="var(--cyan-primary)" /><span style={{ fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',color:'var(--cyan-primary)' }}>{t('df.seg_commercial')}</span></div>
            <div style={{ fontSize:'1.8rem',fontWeight:800,color:'#a5f3fc' }}>26%</div>
            <div style={{ fontSize:'0.74rem',color:'var(--text-secondary)',marginTop:3 }}>{t('df.segment_commercial_meta')}</div>
          </div>

          <div className="card-gold" style={{ padding: '16px 18px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:6 }}><Factory size={15} color="var(--gold-accent)" /><span style={{ fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',color:'var(--gold-accent)' }}>{t('df.seg_industrial')}</span></div>
            <div style={{ fontSize:'1.8rem',fontWeight:800,color:'#fef08a' }}>20%</div>
            <div style={{ fontSize:'0.74rem',color:'var(--text-secondary)',marginTop:3 }}>{t('df.segment_industrial_meta')}</div>
          </div>

          <div className="card-emerald" style={{ padding: '16px 18px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:6 }}><Car size={15} color="var(--green-renew)" /><span style={{ fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',color:'var(--green-renew)' }}>{t('df.seg_ev')}</span></div>
            <div style={{ fontSize:'1.8rem',fontWeight:800,color:'#6ee7b7' }}>12%</div>
            <div style={{ fontSize:'0.74rem',color:'var(--text-secondary)',marginTop:3 }}>{t('df.segment_ev_meta')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

