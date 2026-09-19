'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { runDigitalTwinSimulation } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingDown, 
  Sun, 
  Wind, 
  Zap, 
  BatteryCharging,
  CloudLightning,
  Flame,
  CheckCircle2
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

export default function DigitalTwinPage() {
  const { t } = useLanguage();

  // Slider States
  const [solarMult, setSolarMult] = useState<number>(1.0);
  const [windMult, setWindMult] = useState<number>(1.0);
  const [demandMult, setDemandMult] = useState<number>(1.0);
  const [batteryPct, setBatteryPct] = useState<number>(100.0);
  const [flexPct, setFlexPct] = useState<number>(100.0);
  const [weather, setWeather] = useState<string>('NORMAL');

  // Simulation Results
  const [simResult, setSimResult] = useState<any>(null);

  const executeSimulation = async () => {
    const res = await runDigitalTwinSimulation({
      solar_multiplier: solarMult,
      wind_multiplier: windMult,
      demand_multiplier: demandMult,
      battery_capacity_pct: batteryPct,
      flexible_load_pct: flexPct,
      weather_severity: weather
    });
    if (res) {
      setSimResult(res);
    }
  };

  useEffect(() => {
    executeSimulation();
  }, [solarMult, windMult, demandMult, batteryPct, flexPct, weather]);

  // Presets
  const applyPreset = (preset: 'evening_gap' | 'solar_surge' | 'heatwave' | 'normal') => {
    if (preset === 'evening_gap') {
      setSolarMult(0.65);
      setWindMult(0.9);
      setDemandMult(1.2);
      setBatteryPct(90);
      setFlexPct(85);
      setWeather('NORMAL');
    } else if (preset === 'solar_surge') {
      setSolarMult(1.4);
      setWindMult(1.2);
      setDemandMult(0.9);
      setBatteryPct(100);
      setFlexPct(90);
      setWeather('NORMAL');
    } else if (preset === 'heatwave') {
      setSolarMult(1.0);
      setWindMult(0.6);
      setDemandMult(1.35);
      setBatteryPct(60);
      setFlexPct(70);
      setWeather('HEATWAVE');
    } else {
      setSolarMult(1.0);
      setWindMult(1.0);
      setDemandMult(1.0);
      setBatteryPct(100);
      setFlexPct(100);
      setWeather('NORMAL');
    }
  };

  const summary = simResult?.summary || {
    total_daily_generation_mwh: 1240.5,
    total_daily_demand_mwh: 1350.2,
    net_daily_balance_mwh: -109.7,
    peak_deficit_mw: 18.2,
    shortage_hours_count: 4,
    risk_classification: "Elevated Deficit Risk",
    composite_resilience_score: 72.4,
    recommended_operational_action: "Schedule evening BESS discharge (8-10 MW) and shift 4.5 MW commercial HVAC/EV loads into midday."
  };

  const curve = simResult?.simulated_24h_curve || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('dt.title')}</h1>
            <span className="badge badge-amber" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
              Standout Feature A
            </span>
          </div>
          <p>{t('dt.subtitle')}</p>
        </div>

        {/* Preset Selector */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => applyPreset('evening_gap')} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--amber-flow)', color: 'var(--amber-flow)' }}>
            🌅 {t('dt.preset_evening_gap')}
          </button>
          <button onClick={() => applyPreset('solar_surge')} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--cyan-primary)', color: 'var(--cyan-primary)' }}>
            ☀️ {t('dt.preset_solar_surge')}
          </button>
          <button onClick={() => applyPreset('heatwave')} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--red-risk)', color: 'var(--red-risk)' }}>
            🔥 {t('dt.preset_storm')}
          </button>
          <button onClick={() => applyPreset('normal')} className="btn btn-secondary btn-sm">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Main Grid: Left Control Console, Right Real-time Computed Response */}
      <div className="grid-2">
        {/* Left: Interactive Stress-Testing Controls */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Sliders size={20} style={{ color: 'var(--cyan-primary)' }} />
              Operational Parameter Sliders
            </h3>
            <span className="badge badge-sim">Real-Time Reactive</span>
          </div>

          {/* Solar Multiplier */}
          <div className="slider-container">
            <div className="slider-header">
              <span className="slider-label">
                <Sun size={15} style={{ verticalAlign: 'middle', marginRight: 4, color: 'var(--amber-flow)' }} />
                {t('dt.slider_solar')}
              </span>
              <span className="slider-value">{(solarMult * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={solarMult}
              onChange={(e) => setSolarMult(parseFloat(e.target.value))}
            />
          </div>

          {/* Wind Multiplier */}
          <div className="slider-container">
            <div className="slider-header">
              <span className="slider-label">
                <Wind size={15} style={{ verticalAlign: 'middle', marginRight: 4, color: 'var(--cyan-primary)' }} />
                {t('dt.slider_wind')}
              </span>
              <span className="slider-value">{(windMult * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={windMult}
              onChange={(e) => setWindMult(parseFloat(e.target.value))}
            />
          </div>

          {/* Demand Stress Multiplier */}
          <div className="slider-container">
            <div className="slider-header">
              <span className="slider-label">
                <Zap size={15} style={{ verticalAlign: 'middle', marginRight: 4, color: '#f87171' }} />
                {t('dt.slider_demand')}
              </span>
              <span className="slider-value" style={{ color: demandMult > 1.1 ? 'var(--red-risk)' : 'var(--cyan-primary)' }}>
                {(demandMult * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={demandMult}
              onChange={(e) => setDemandMult(parseFloat(e.target.value))}
            />
          </div>

          {/* Battery Fleet Availability */}
          <div className="slider-container">
            <div className="slider-header">
              <span className="slider-label">
                <BatteryCharging size={15} style={{ verticalAlign: 'middle', marginRight: 4, color: 'var(--green-renew)' }} />
                {t('dt.slider_battery')}
              </span>
              <span className="slider-value" style={{ color: 'var(--green-renew)' }}>{batteryPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={batteryPct}
              onChange={(e) => setBatteryPct(parseFloat(e.target.value))}
            />
          </div>

          {/* Flexible Load Participation */}
          <div className="slider-container">
            <div className="slider-header">
              <span className="slider-label">
                <Sliders size={15} style={{ verticalAlign: 'middle', marginRight: 4, color: '#38bdf8' }} />
                {t('dt.slider_flex')}
              </span>
              <span className="slider-value" style={{ color: '#38bdf8' }}>{flexPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={flexPct}
              onChange={(e) => setFlexPct(parseFloat(e.target.value))}
            />
          </div>

          {/* Weather Severity Selector */}
          <div style={{ marginTop: 14 }}>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
              {t('dt.weather_severity')}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setWeather('NORMAL')}
                className={`btn btn-sm ${weather === 'NORMAL' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                Normal Sky
              </button>
              <button
                onClick={() => setWeather('HEATWAVE')}
                className={`btn btn-sm ${weather === 'HEATWAVE' ? 'btn-amber' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                🔥 Heatwave (+25% AC)
              </button>
              <button
                onClick={() => setWeather('STORM_FRONT')}
                className={`btn btn-sm ${weather === 'STORM_FRONT' ? 'btn-secondary' : 'btn-secondary'}`}
                style={{ flex: 1, borderColor: weather === 'STORM_FRONT' ? 'var(--cyan-primary)' : 'var(--border-subtle)' }}
              >
                ⛈ Cloud Storm (-75% Solar)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Instant Recomputed Operational Directives */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{
            background: summary.peak_deficit_mw > 20 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(20, 31, 54, 0.8)',
            border: summary.peak_deficit_mw > 20 ? '1px solid var(--red-risk)' : '1px solid var(--border-medium)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="badge badge-forecast">{t('dt.recalculated_title')}</span>
              <span className={`badge ${summary.peak_deficit_mw > 20 ? 'badge-risk-critical' : 'badge-live'}`}>
                {summary.risk_classification}
              </span>
            </div>

            <div className="grid-2" style={{ gap: 12, marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Peak Deficit Window</span>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: summary.peak_deficit_mw > 0 ? 'var(--red-risk)' : 'var(--green-renew)' }}>
                  {summary.peak_deficit_mw > 0 ? `-${summary.peak_deficit_mw} MW` : '0.0 MW'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Resilience Index</span>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: summary.composite_resilience_score > 70 ? 'var(--green-renew)' : 'var(--amber-flow)' }}>
                  {summary.composite_resilience_score}/100
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Daily Net Balance</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  {summary.net_daily_balance_mwh > 0 ? `+${summary.net_daily_balance_mwh}` : summary.net_daily_balance_mwh} MWh
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Shortage Duration</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: summary.shortage_hours_count > 0 ? 'var(--orange-warn)' : 'var(--green-renew)' }}>
                  {summary.shortage_hours_count} Hours
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(7, 11, 20, 0.7)',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--cyan-primary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                ⚡ Recomputed Action Recommendation:
              </span>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {summary.recommended_operational_action}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recalculated 24-Hour Load & Generation Curve */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Sparkles size={20} style={{ color: 'var(--amber-flow)' }} />
              Simulated 24-Hour Energy Balance
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
              Graph instantly reflects adjustments made with the sliders above.
            </p>
          </div>
          <span className="badge badge-sim">Digital Twin Engine</span>
        </div>

        <div style={{ width: '100%', height: 360, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={curve} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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

              {/* Total Generation */}
              <Line
                type="monotone"
                dataKey="total_gen_mw"
                name="Simulated Generation (MW)"
                stroke="#fbbf24"
                strokeWidth={2.5}
                dot={false}
              />

              {/* Demand */}
              <Line
                type="monotone"
                dataKey="demand_mw"
                name="Simulated Demand (MW)"
                stroke="#ef4444"
                strokeWidth={2.2}
                dot={false}
              />

              {/* Net Balance */}
              <Line
                type="monotone"
                dataKey="net_balance_mw"
                name="Net Balance (+Surplus / -Deficit MW)"
                stroke="#00f0ff"
                strokeWidth={2.2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
