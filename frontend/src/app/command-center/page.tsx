'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { fetchLiveTelemetry, runOptimization } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { EnergyFlowDiagram } from '../../components/EnergyFlowDiagram';
import { 
  Sun, 
  Wind, 
  Zap, 
  BatteryCharging, 
  Sliders, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Clock,
  Radio
} from 'lucide-react';

export default function CommandCenterPage() {
  const { t } = useLanguage();
  const [telemetry, setTelemetry] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [planExecuted, setPlanExecuted] = useState<boolean>(false);
  const [executing, setExecuting] = useState<boolean>(false);

  useEffect(() => {
    // Initial fetch
    fetchLiveTelemetry().then(data => {
      setTelemetry(data);
      setLastUpdated(new Date().toLocaleTimeString());
    });

    // Simulated live polling every 3.5 seconds
    const interval = setInterval(() => {
      fetchLiveTelemetry().then(data => {
        setTelemetry(data);
        setLastUpdated(new Date().toLocaleTimeString());
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleExecutePlan = async () => {
    setExecuting(true);
    await runOptimization(100, 100);
    setTimeout(() => {
      setExecuting(false);
      setPlanExecuted(true);
      setTimeout(() => setPlanExecuted(false), 6000);
    }, 600);
  };

  const metrics = telemetry?.metrics || {
    solar_generation_mw: 42.5,
    wind_generation_mw: 18.2,
    renewable_total_mw: 60.7,
    grid_demand_mw: 64.8,
    net_balance_mw: -4.1,
    battery_fleet_soc_pct: 72.0,
    flexible_load_available_mw: 12.4,
    forecast_risk_level: "Moderate",
    composite_resilience_score: 74.8,
    grid_frequency_hz: 50.01,
    co2_intensity_g_kwh: 195.0
  };

  const isShortage = metrics.net_balance_mw < 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('cc.title')}</h1>
            <span className="badge badge-live">
              <Radio size={12} /> {t('badge.live')}
            </span>
          </div>
          <p>{t('cc.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={15} />
            <span>{t('cc.updated')}: <strong>{lastUpdated || t('cc.connecting')}</strong></span>
          </div>
          <Link href="/judge-mode" className="btn btn-amber btn-sm">
            🎯 {t('nav.judge_mode')}
          </Link>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid-4">
        <MetricCard
          label={t('cc.solar_gen')}
          value={metrics.solar_generation_mw}
          unit="MW"
          meta={t('cc.solar_meta')}
          icon={Sun}
          variant="amber"
          badgeText={t('badge.live')}
          badgeType="live"
        />

        <MetricCard
          label={t('cc.wind_gen')}
          value={metrics.wind_generation_mw}
          unit="MW"
          meta={t('cc.wind_meta')}
          icon={Wind}
          variant="cyan"
          badgeText={t('badge.live')}
          badgeType="live"
        />

        <MetricCard
          label={t('cc.grid_demand')}
          value={metrics.grid_demand_mw}
          unit="MW"
          meta={t('cc.grid_demand_meta')}
          icon={Zap}
          variant="default"
          badgeText={t('badge.live')}
          badgeType="live"
        />

        <MetricCard
          label={t('cc.net_balance')}
          value={metrics.net_balance_mw > 0 ? `+${metrics.net_balance_mw}` : metrics.net_balance_mw}
          unit="MW"
          meta={isShortage ? t('cc.deficit_meta') : t('cc.surplus_meta')}
          icon={TrendingDown}
          variant={isShortage ? "red" : "green"}
          badgeText={isShortage ? t('cc.deficit') : t('cc.surplus')}
          badgeType={isShortage ? "risk" : "live"}
        />
      </div>

      {/* Secondary Telemetry Grid */}
      <div className="grid-4">
        <MetricCard
          label={t('cc.storage_soc')}
          value={metrics.battery_fleet_soc_pct}
          unit="%"
          meta={t('cc.storage_meta')}
          icon={BatteryCharging}
          variant="green"
        />

        <MetricCard
          label={t('cc.flex_load')}
          value={metrics.flexible_load_available_mw}
          unit="MW"
          meta={t('cc.flex_meta')}
          icon={Sliders}
          variant="cyan"
        />

        <MetricCard
          label={t('cc.risk_level')}
          value={metrics.forecast_risk_level}
          meta={t('cc.risk_meta')}
          icon={ShieldAlert}
          variant={metrics.forecast_risk_level === 'Critical' ? 'red' : 'amber'}
        />

        <MetricCard
          label={t('cc.resilience_score')}
          value={`${metrics.composite_resilience_score}/100`}
          meta={t('cc.resilience_meta')}
          icon={ShieldCheck}
          variant="cyan"
        />
      </div>

      {/* Active AI Recommendation Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(20, 31, 54, 0.95) 0%, rgba(13, 20, 36, 0.95) 100%)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-cyan)',
        padding: '20px 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(0, 240, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan-primary)',
              flexShrink: 0
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="badge badge-forecast">{t('cc.ai_badge')}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{t('cc.confidence_badge')}</span>
              </div>
              <h3 style={{ fontSize: '1.18rem', color: 'var(--cyan-primary)' }}>
                {telemetry?.active_recommendation?.action_type || t('cc.rec_action_default')}
              </h3>
              <p style={{ fontSize: '0.88rem', marginTop: 4, maxWidth: 720 }}>
                {telemetry?.active_recommendation?.expected_impact || t('cc.rec_impact_default')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleExecutePlan}
              disabled={executing}
              className="btn btn-primary"
              style={{ minWidth: 200 }}
            >
              <Zap size={18} />
              {executing ? t('cc.dispatching') : t('cc.btn_execute_plan')}
            </button>
            <Link href="/flexibility" className="btn btn-secondary">
              {t('cc.details')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {planExecuted && (
          <div style={{
            marginTop: 14,
            padding: '10px 16px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.88rem'
          }}>
            <CheckCircle2 size={18} />
            <span>{t('cc.plan_executed')}</span>
          </div>
        )}
      </div>

      {/* Dynamic Substation Energy Flow Centerpiece */}
      <EnergyFlowDiagram
        solarMw={metrics.solar_generation_mw}
        windMw={metrics.wind_generation_mw}
        demandMw={metrics.grid_demand_mw}
        bessSoc={metrics.battery_fleet_soc_pct}
        netBalanceMw={metrics.net_balance_mw}
        bessDischarging={isShortage}
      />

      {/* Bottom Quick Links to Deep Dive Modules */}
      <div className="grid-3">
        <Link href="/renewable-forecast" className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ color: 'var(--amber-flow)' }}>{t('nav.renewable_forecast')}</h4>
            <ArrowRight size={16} />
          </div>
          <p style={{ fontSize: '0.84rem' }}>
            {t('cc.quick_solar_desc')}
          </p>
        </Link>

        <Link href="/demand-forecast" className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ color: 'var(--cyan-primary)' }}>{t('nav.demand_forecast')}</h4>
            <ArrowRight size={16} />
          </div>
          <p style={{ fontSize: '0.84rem' }}>
            {t('cc.quick_demand_desc')}
          </p>
        </Link>

        <Link href="/digital-twin" className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ color: 'var(--green-renew)' }}>{t('nav.digital_twin')}</h4>
            <ArrowRight size={16} />
          </div>
          <p style={{ fontSize: '0.84rem' }}>
            {t('cc.quick_twin_desc')}
          </p>
        </Link>
      </div>
    </div>
  );
}
