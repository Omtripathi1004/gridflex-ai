'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { fetchLiveTelemetry, runOptimization } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { EnergyFlowDiagram } from '../../components/EnergyFlowDiagram';
import { ProvenanceBadge } from '../../components/ProvenanceBadge';
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

    // Live update interval
    const interval = setInterval(() => {
      fetchLiveTelemetry().then(data => {
        setTelemetry(data);
        setLastUpdated(new Date().toLocaleTimeString());
      });
    }, 5000);

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

  // C6: Reconciled Single Source of Truth Metrics
  const metrics = telemetry?.metrics || {
    solar_generation_mw: 42.5,
    wind_generation_mw: 18.2,
    renewable_total_mw: 60.7,
    grid_demand_mw: 64.8,
    net_balance_mw: -4.1,
    battery_fleet_soc_pct: 72.5,
    flexible_load_available_mw: 12.8,
    forecast_risk_level: "Moderate",
    composite_resilience_score: 80.7,
    grid_frequency_hz: 50.02,
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
            <ProvenanceBadge classification="scaled_real" sourceName="Grid-India & NASA POWER Substation Feed" mode="cached" />
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

      {/* Primary Telemetry Grid with Appendix A7 Domain Colors & Provenance */}
      <div className="grid-4">
        <MetricCard
          label={t('cc.solar_gen')}
          value={metrics.solar_generation_mw}
          unit="MW"
          meta={t('cc.solar_meta')}
          icon={Sun}
          domain="solar"
          provenance={{ classification: 'real', sourceName: 'NASA POWER & Rooftop Solar', mode: 'cached' }}
        />

        <MetricCard
          label={t('cc.wind_gen')}
          value={metrics.wind_generation_mw}
          unit="MW"
          meta="100m Hub Anemometer (7.8 m/s)"
          icon={Wind}
          domain="wind"
          provenance={{ classification: 'real', sourceName: '100m Hub Telemetry', mode: 'cached' }}
        />

        <MetricCard
          label={t('cc.grid_demand')}
          value={metrics.grid_demand_mw}
          unit="MW"
          meta="HVAC 28.4 + EV 30.2 + Municipal 6.2 MW"
          icon={Zap}
          domain="load"
          provenance={{ classification: 'scaled_real', sourceName: 'Grid-India PSP Scaled (64.8 MW)', mode: 'cached' }}
        />

        <MetricCard
          label={t('cc.net_balance')}
          value={metrics.net_balance_mw > 0 ? `+${metrics.net_balance_mw}` : metrics.net_balance_mw}
          unit="MW"
          meta={isShortage ? t('cc.deficit_meta') : t('cc.surplus_meta')}
          icon={TrendingDown}
          domain="brand"
          provenance={{ classification: 'scaled_real', sourceName: 'Substation Bus Net Balance', mode: 'cached' }}
        />
      </div>

      {/* Secondary Telemetry Grid */}
      <div className="grid-4">
        <MetricCard
          label={t('cc.storage_soc')}
          value={`${metrics.battery_fleet_soc_pct}%`}
          meta="29.0 MWh Stored (40 MWh Nameplate)"
          icon={BatteryCharging}
          domain="storage"
          provenance={{ classification: 'simulated', sourceName: 'BESS SCADA Fleet', mode: 'cached' }}
        />

        <MetricCard
          label={t('cc.flex_load')}
          value={`${metrics.flexible_load_available_mw} MW`}
          meta="85.3% of 15.0 MW Pool Enrolled"
          icon={Sliders}
          domain="flex"
          provenance={{ classification: 'simulated', sourceName: 'Commercial & EV DR Pool', mode: 'cached' }}
        />

        <MetricCard
          label={t('cc.risk_level')}
          value={metrics.forecast_risk_level}
          meta="Sunset Solar Cliff Risk Window"
          icon={ShieldAlert}
          variant="amber"
          provenance={{ classification: 'forecast', sourceName: 'XGBoost Risk Classifier', mode: 'cached' }}
        />

        <MetricCard
          label={t('cc.resilience_score')}
          value={`${metrics.composite_resilience_score}/100`}
          meta="4-Pillar Index (Benchmark > 75)"
          icon={ShieldCheck}
          domain="brand"
          provenance={{ classification: 'forecast', sourceName: 'Verified Resilience Model', mode: 'cached' }}
        />
      </div>

      {/* Active AI Recommendation Banner */}
      <div className="card kpi flex" style={{
        background: 'linear-gradient(135deg, rgba(20, 31, 54, 0.95) 0%, rgba(13, 20, 36, 0.95) 100%)',
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
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>REC-704 (Confidence 94%)</span>
              </div>
              <h3 style={{ fontSize: '1.18rem', color: 'var(--cyan-primary)', margin: 0 }}>
                {telemetry?.active_recommendation?.action_type || "BESS Storage Buffer & Pre-cooling Schedule"}
              </h3>
              <p style={{ fontSize: '0.88rem', marginTop: 4, maxWidth: 720, color: '#e2e8f0' }}>
                {telemetry?.active_recommendation?.expected_impact || "Absorbs midday solar surplus and secures 14.5 MWh for the evening ramp window."}
              </p>
            </div>
          </div>

          <button 
            onClick={handleExecutePlan}
            disabled={executing || planExecuted}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '0.95rem',
              background: planExecuted ? 'var(--green-renew)' : undefined,
              borderColor: planExecuted ? 'var(--green-renew)' : undefined
            }}
          >
            {executing ? (
              <span>{t('cc.btn_optimizing')}</span>
            ) : planExecuted ? (
              <>
                <CheckCircle2 size={18} />
                <span>{t('cc.btn_executed')}</span>
              </>
            ) : (
              <>
                <span>{t('cc.btn_execute')}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Substation Energy Flow Diagram (C6: 28.4 + 30.2 + 6.2 = 64.8 MW) */}
      <EnergyFlowDiagram
        solarMw={metrics.solar_generation_mw}
        windMw={metrics.wind_generation_mw}
        demandMw={metrics.grid_demand_mw}
        bessSoc={metrics.battery_fleet_soc_pct}
        netBalanceMw={metrics.net_balance_mw}
        bessDischarging={planExecuted}
      />
    </div>
  );
}
