'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { runOptimization } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { 
  Sliders, 
  TrendingDown, 
  CheckCircle2, 
  DollarSign, 
  Leaf, 
  Clock, 
  BatteryCharging, 
  ArrowRight,
  ShieldCheck
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

  useEffect(() => {
    runOptimization(bessAvail, flexPart).then(data => setOptData(data));
  }, [bessAvail, flexPart]);

  const scorecard = optData?.scorecard || {
    peak_reduction_mw: 9.8,
    peak_reduction_pct: 13.5,
    shortage_hours_before: 4,
    shortage_hours_after: 0,
    shortage_elimination_pct: 100.0,
    total_energy_shifted_mwh: 15.6,
    bess_discharged_mwh: 28.5,
    estimated_cost_savings_usd: 18400,
    co2_emissions_avoided_kg: 6760
  };

  const balanceSeries = optData?.hourly_balance || [];
  const recommendations = optData?.recommendations || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('flex.title')}</h1>
            <span className="badge badge-forecast">{t('flex.solver_badge')}</span>
          </div>
          <p>{t('flex.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-live">
            <CheckCircle2 size={13} /> {t('flex.deficit_mitigated')}
          </span>
        </div>
      </div>

      {/* Measurable Impact Scorecard */}
      <div className="grid-4">
        <MetricCard
          label={t('flex.metric_peak_shaved')}
          value={`${scorecard.peak_reduction_mw} MW`}
          unit={`(-${scorecard.peak_reduction_pct}%)`}
          meta={t('flex.peak_shaved_meta')}
          icon={TrendingDown}
          variant="cyan"
          badgeText={t('flex.optimized_badge')}
          badgeType="live"
        />

        <MetricCard
          label={t('flex.metric_shortage_elim')}
          value={`${scorecard.shortage_hours_before}h → ${scorecard.shortage_hours_after}h`}
          meta={t('flex.shortage_elim_meta')}
          icon={Clock}
          variant="green"
          badgeText={t('flex.zero_deficit_badge')}
          badgeType="live"
        />

        <MetricCard
          label={t('flex.metric_cost_saved')}
          value={`$${scorecard.estimated_cost_savings_usd.toLocaleString()}`}
          meta={t('flex.cost_saved_meta')}
          icon={DollarSign}
          variant="amber"
        />

        <MetricCard
          label={t('flex.metric_co2')}
          value={`${(scorecard.co2_emissions_avoided_kg / 1000).toFixed(1)} MT`}
          meta={t('flex.co2_meta')}
          icon={Leaf}
          variant="green"
        />
      </div>

      {/* Load Profile Before vs After Flexibility */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Sliders size={20} style={{ color: 'var(--cyan-primary)' }} />
              {t('flex.before_after_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
              {t('flex.chart_desc')}
            </p>
          </div>
          <span className="badge badge-live">{t('flex.optimum_badge')}</span>
        </div>

        <div style={{ width: '100%', height: 380, marginTop: 10 }}>
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
              <Legend wrapperStyle={{ paddingTop: 10 }} />

              {/* Renewable Generation */}
              <Line
                type="monotone"
                dataKey="generation_mw"
                name={t('flex.chart_renewable')}
                stroke="#fbbf24"
                strokeWidth={2.5}
                dot={false}
              />

              {/* Demand Before Flexibility */}
              <Line
                type="monotone"
                dataKey="demand_before_mw"
                name={t('flex.chart_base')}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />

              {/* Demand After Flexibility */}
              <Line
                type="monotone"
                dataKey="demand_after_mw"
                name={t('flex.chart_post')}
                stroke="#00f0ff"
                strokeWidth={2.8}
                dot={false}
              />

              {/* Net Balance After */}
              <Line
                type="monotone"
                dataKey="net_balance_after_mw"
                name={t('flex.chart_balance')}
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dispatched Operational Action Cards */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <CheckCircle2 size={20} style={{ color: 'var(--green-renew)' }} />
            {t('flex.actions_title')}
          </h3>
          <span className="badge badge-live">{t('flex.dispatched_badge')}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {recommendations.map((rec: any) => (
            <div 
              key={rec.id}
              className="card"
              style={{
                background: 'rgba(20, 31, 54, 0.4)',
                border: '1px solid var(--border-subtle)',
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
                  <h4 style={{ color: 'var(--cyan-primary)', fontSize: '1.02rem' }}>{rec.action}</h4>
                  <p style={{ fontSize: '0.84rem', marginTop: 4 }}>
                    <strong>{t('flex.asset')}:</strong> {rec.asset} &nbsp;|&nbsp; <strong>{t('flex.reason')}:</strong> {rec.reason}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="badge badge-live" style={{ fontSize: '0.78rem' }}>
                  {t('flex.confidence')} {(rec.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
