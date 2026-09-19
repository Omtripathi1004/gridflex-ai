'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchDemandForecast } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { 
  TrendingUp, 
  AlertTriangle, 
  Home, 
  Building, 
  Factory, 
  Car, 
  Clock, 
  Zap,
  Info 
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
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('df.title')}</h1>
            <span className="badge badge-forecast">{t('badge.forecast')}</span>
          </div>
          <p>{t('df.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge badge-risk-critical">
            <AlertTriangle size={14} /> Peak: 18:00 - 22:00
          </span>
        </div>
      </div>

      {/* Demand KPIs */}
      <div className="grid-3">
        <MetricCard
          label={t('df.peak_window')}
          value={metrics.peak_window_hours}
          meta={t('df.peak_meta')}
          icon={Clock}
          variant="red"
          badgeText={t('df.peak_badge')}
          badgeType="risk"
        />

        <MetricCard
          label={t('df.peak_reduction')}
          value={metrics.curtailment_avoidance_potential_mw}
          unit="MW"
          meta={t('df.reduction_meta')}
          icon={Zap}
          variant="green"
          badgeText={t('df.high_value')}
          badgeType="live"
        />

        <MetricCard
          label={t('df.r2_label')}
          value={`R² ${metrics.load_r2_score}`}
          meta={`MAE: ${metrics.load_mae_mw} MW (${t('df.model_badge')})`}
          icon={TrendingUp}
          variant="cyan"
        />
      </div>

      {/* Demand Forecast Chart with Peak Windows */}
      <div className="card">
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

              {/* Peak Shaded Window */}
              <Area
                type="monotone"
                dataKey="demand_predicted"
                name={t('df.chart_forecast')}
                stroke="#00f0ff"
                strokeWidth={2.5}
                fill="rgba(0, 240, 255, 0.09)"
              />

              {/* Recorded Actual */}
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
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Building size={20} style={{ color: 'var(--amber-flow)' }} />
            {t('df.segments_title')}
          </h3>
          <span className="badge badge-sim">{t('badge.simulation')}</span>
        </div>

        <div className="grid-4">
          <div className="metric-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <span className="metric-label"><Home size={16} style={{ color: 'var(--red-risk)' }} /> {t('df.seg_residential')}</span>
            <div className="metric-val-row">
              <span className="metric-value" style={{ color: 'var(--red-risk)' }}>42%</span>
            </div>
             <span className="metric-meta">{t('df.segment_residential_meta')}</span>
          </div>

          <div className="metric-card" style={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}>
            <span className="metric-label"><Building size={16} style={{ color: '#38bdf8' }} /> {t('df.seg_commercial')}</span>
            <div className="metric-val-row">
              <span className="metric-value" style={{ color: '#38bdf8' }}>26%</span>
            </div>
             <span className="metric-meta">{t('df.segment_commercial_meta')}</span>
          </div>

          <div className="metric-card" style={{ borderColor: 'rgba(251, 191, 36, 0.3)' }}>
            <span className="metric-label"><Factory size={16} style={{ color: 'var(--amber-flow)' }} /> {t('df.seg_industrial')}</span>
            <div className="metric-val-row">
              <span className="metric-value" style={{ color: 'var(--amber-flow)' }}>20%</span>
            </div>
             <span className="metric-meta">{t('df.segment_industrial_meta')}</span>
          </div>

          <div className="metric-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <span className="metric-label"><Car size={16} style={{ color: 'var(--green-renew)' }} /> {t('df.seg_ev')}</span>
            <div className="metric-val-row">
              <span className="metric-value" style={{ color: 'var(--green-renew)' }}>12%</span>
            </div>
             <span className="metric-meta">{t('df.segment_ev_meta')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
