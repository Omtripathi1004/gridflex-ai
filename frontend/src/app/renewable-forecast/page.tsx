'use client';

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MetricCard } from '../../components/MetricCard';
import { NeighbourhoodReportModal } from '../../components/NeighbourhoodReportModal';
import {
  FEEDER_PROFILES,
  FeederProfile,
  generateFeederForecastSeries,
  calculateIntermittencyGapSummary,
  getRecommendedActions,
  PROTECTED_COMMUNITY_ASSETS,
  computeReliabilityScore,
  DemandResponseAction
} from '../../lib/neighbourhoodData';
import { 
  Sun, 
  Wind, 
  CloudRain, 
  Thermometer, 
  Gauge, 
  LineChart, 
  Info,
  Calendar,
  Cpu,
  AlertTriangle,
  Zap,
  BatteryCharging,
  Sliders,
  ShieldCheck,
  Building2,
  Share2,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Clock,
  HeartHandshake,
  CheckCircle2,
  FileText,
  Radio,
  Layers,
  Sparkles,
  DollarSign
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

export default function RenewableForecastPage() {
  const { t } = useLanguage();

  // 1. Feeder / Neighbourhood selection
  const [selectedFeederId, setSelectedFeederId] = useState<string>('F-02'); // Default to high-solar residential
  const selectedFeeder = useMemo(() => {
    return FEEDER_PROFILES.find(f => f.id === selectedFeederId) || FEEDER_PROFILES[0];
  }, [selectedFeederId]);

  // 2. Horizon selection: 6h nowcast, 24h day-ahead, 48h multi-day, 7d weekly
  const [horizon, setHorizon] = useState<'6h' | '24h' | '48h' | '7d'>('24h');

  // 3. Interactive Scenario Simulation Sliders
  const [simSolarDelta, setSimSolarDelta] = useState<number>(0); // -50% to +50%
  const [simDemandDelta, setSimDemandDelta] = useState<number>(0); // -30% to +30%
  const [simBessAvail, setSimBessAvail] = useState<number>(100); // 0 to 100%
  const [simDrParticipation, setSimDrParticipation] = useState<number>(100); // 0 to 100%

  // 4. Modal state
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // 5. Dynamic data generation based on selected feeder, horizon, and simulation inputs
  const series = useMemo(() => {
    return generateFeederForecastSeries(selectedFeeder, horizon, simSolarDelta, simDemandDelta);
  }, [selectedFeeder, horizon, simSolarDelta, simDemandDelta]);

  // 6. Intermittency Gap Calculations
  const gapSummary = useMemo(() => {
    return calculateIntermittencyGapSummary(series, selectedFeeder);
  }, [series, selectedFeeder]);

  // 7. Composite Reliability Score
  const reliability = useMemo(() => {
    return computeReliabilityScore(
      selectedFeeder,
      simSolarDelta,
      simDemandDelta,
      simBessAvail,
      simDrParticipation
    );
  }, [selectedFeeder, simSolarDelta, simDemandDelta, simBessAvail, simDrParticipation]);

  // 8. Recommended Actions
  const recommendedActions = useMemo(() => {
    return getRecommendedActions(selectedFeeder, gapSummary.max_deficit_mw);
  }, [selectedFeeder, gapSummary.max_deficit_mw]);

  // 9. Protected Community Assets
  const protectedAssets = useMemo(() => {
    return PROTECTED_COMMUNITY_ASSETS[selectedFeeder.id] || [];
  }, [selectedFeeder.id]);

  // Quick contingency presets
  const applyPreset = (type: 'cliff' | 'cloud' | 'heatwave' | 'optimal') => {
    if (type === 'cliff') {
      setSimSolarDelta(-40);
      setSimDemandDelta(15);
      setSimBessAvail(100);
      setSimDrParticipation(100);
    } else if (type === 'cloud') {
      setSimSolarDelta(-65);
      setSimDemandDelta(5);
      setSimBessAvail(85);
      setSimDrParticipation(90);
    } else if (type === 'heatwave') {
      setSimSolarDelta(10);
      setSimDemandDelta(25);
      setSimBessAvail(100);
      setSimDrParticipation(100);
    } else {
      setSimSolarDelta(20);
      setSimDemandDelta(-5);
      setSimBessAvail(100);
      setSimDrParticipation(100);
    }
  };

  const resetSimulation = () => {
    setSimSolarDelta(0);
    setSimDemandDelta(0);
    setSimBessAvail(100);
    setSimDrParticipation(100);
  };

  const isSimulated = simSolarDelta !== 0 || simDemandDelta !== 0 || simBessAvail !== 100 || simDrParticipation !== 100;

  // Weather telemetry from midday point
  const middayPoint = series[Math.min(12, series.length - 1)]?.weather || {
    ghi_w_m2: 840,
    temperature_c: 29.5,
    cloud_cover_pct: 18,
    wind_speed_ms: 6.8
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
      {/* ─── Top Header & Controls ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <span className="badge badge-live" style={{ background: 'rgba(251, 191, 36, 0.15)', color: 'var(--gold-accent)', border: '1px solid var(--gold-accent)' }}>
              <Sun size={14} style={{ marginRight: 4 }} />
              Open-Meteo NWP + NASA POWER Telemetry
            </span>
            <span className="badge badge-forecast" style={{ background: 'rgba(0, 240, 255, 0.15)', color: 'var(--cyan-primary)', border: '1px solid var(--cyan-primary)' }}>
              LightGBM v2.4 (0.942 R²)
            </span>
            <span className="badge badge-sim" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid #c084fc' }}>
              <Radio size={13} style={{ marginRight: 4 }} />
              Feeder Intermittency Interlock
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', fontWeight: 800, margin: '4px 0 6px', lineHeight: 1.25 }}>
            Neighbourhood Energy Reliability <span className="text-gradient-cyan">&amp; Flexibility Command Center</span>
          </h1>
          <p style={{ maxWidth: 880, fontSize: '0.94rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Operational decision-support platform bridging renewable intermittency across 33/11kV distribution feeders through forecasting, demand response, community storage, and local coordination.
          </p>
        </div>

        {/* Global Feeder & Horizon Selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Feeder Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                value={selectedFeederId}
                onChange={(e) => setSelectedFeederId(e.target.value)}
                style={{
                  background: 'var(--surface-elevated, #111832)',
                  border: '1px solid var(--cyan-primary)',
                  color: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0, 240, 255, 0.15)'
                }}
              >
                {FEEDER_PROFILES.map(f => (
                  <option key={f.id} value={f.id} style={{ background: '#0d1527', color: '#f8fafc' }}>
                    {f.name} ({f.character})
                  </option>
                ))}
              </select>
            </div>

            {/* Time Horizon Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-tertiary)', padding: 3, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              {(['6h', '24h', '48h', '7d'] as const).map(h => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`btn btn-sm ${horizon === h ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '5px 9px', minHeight: 28 }}
                >
                  {h === '6h' ? 'Now (6h)' : h === '24h' ? '24h' : h === '48h' ? '48h' : '7 Days'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/explainable-ai" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
              <Cpu size={14} color="#a855f7" />
              <span>TreeSHAP Proof</span>
            </Link>

            <button
              onClick={() => setShowReportModal(true)}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', background: '#0284c7' }}
            >
              <FileText size={14} />
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 5-Step Operational Flow Indicator ───────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 8,
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: '10px 14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.80rem' }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem' }}>1</span>
          <div>
            <strong style={{ color: '#f8fafc', display: 'block' }}>Forecast</strong>
            <span style={{ color: '#94a3b8', fontSize: '0.70rem' }}>LightGBM Solar &amp; Wind</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.80rem' }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: gapSummary.has_active_deficit ? 'rgba(249, 115, 22, 0.2)' : 'rgba(34, 197, 94, 0.2)', color: gapSummary.has_active_deficit ? '#f97316' : '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem' }}>2</span>
          <div>
            <strong style={{ color: '#f8fafc', display: 'block' }}>Detect</strong>
            <span style={{ color: '#94a3b8', fontSize: '0.70rem' }}>Intermittency Gap Engine</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.80rem' }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem' }}>3</span>
          <div>
            <strong style={{ color: '#f8fafc', display: 'block' }}>Respond</strong>
            <span style={{ color: '#94a3b8', fontSize: '0.70rem' }}>BESS &amp; Demand Response</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.80rem' }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem' }}>4</span>
          <div>
            <strong style={{ color: '#f8fafc', display: 'block' }}>Coordinate</strong>
            <span style={{ color: '#94a3b8', fontSize: '0.70rem' }}>Equity Lifeline Shield</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.80rem' }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem' }}>5</span>
          <div>
            <strong style={{ color: '#f8fafc', display: 'block' }}>Measure</strong>
            <span style={{ color: '#94a3b8', fontSize: '0.70rem' }}>DISCOM Financial Savings</span>
          </div>
        </div>
      </div>

      {/* ─── Module 1: Headline Reliability Score & Feeder Status ───────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12
      }}>
        {/* Composite Reliability Score Card */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 50, 0.95) 0%, rgba(9, 15, 28, 0.95) 100%)',
          border: '1px solid var(--cyan-primary)',
          padding: '18px 20px',
          borderRadius: 14,
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Feeder Reliability Score</span>
            <span className={`badge ${reliability.score >= 75 ? 'badge-live' : 'badge-alert'}`} style={{ fontSize: '0.70rem' }}>
              {reliability.status}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: reliability.score >= 75 ? 'var(--cyan-primary)' : '#f97316' }}>
              {reliability.score}
            </span>
            <span style={{ fontSize: '1rem', color: '#64748b' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
            Benchmark: &gt;75.0 • ISO 50001 &amp; IEEE 1547
          </div>
        </div>

        {/* Renewable Availability */}
        <div className="card" style={{ padding: '18px 20px', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Clean Availability</span>
            <Sun size={15} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fbbf24' }}>
            {selectedFeeder.solar_capacity_mw + selectedFeeder.wind_capacity_mw} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>MW</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
            Solar: {selectedFeeder.solar_capacity_mw} MW • Wind: {selectedFeeder.wind_capacity_mw} MW
          </div>
        </div>

        {/* Expected Demand */}
        <div className="card" style={{ padding: '18px 20px', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Feeder Demand Ceiling</span>
            <Zap size={15} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>
            {selectedFeeder.peak_demand_mw} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>MW Peak</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
            Base: {selectedFeeder.base_demand_mw} MW • Loading: {((selectedFeeder.peak_demand_mw / selectedFeeder.transformer_mva) * 100).toFixed(0)}%
          </div>
        </div>

        {/* Community Storage Reserve */}
        <div className="card" style={{ padding: '18px 20px', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Community BESS Reserve</span>
            <BatteryCharging size={15} color="#22c55e" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#22c55e' }}>
            {selectedFeeder.bess_soc_pct}% <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>SOC</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
            Capacity: {selectedFeeder.bess_capacity_mwh} MWh • Power: {selectedFeeder.bess_power_mw} MW
          </div>
        </div>

        {/* Enrolled Demand Response */}
        <div className="card" style={{ padding: '18px 20px', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>Flexible DR Capacity</span>
            <Sliders size={15} color="#a855f7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#c084fc' }}>
            {selectedFeeder.flexible_load_mw} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>MW</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
            {((selectedFeeder.flexible_load_mw / selectedFeeder.peak_demand_mw) * 100).toFixed(0)}% of Feeder Peak Load
          </div>
        </div>
      </div>

      {/* ─── Module 2: Intermittency Gap Early-Warning Engine ────────────── */}
      <div style={{
        background: gapSummary.has_active_deficit 
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(18, 28, 50, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(34, 197, 94, 0.10) 0%, rgba(18, 28, 50, 0.9) 100%)',
        border: `1px solid ${gapSummary.has_active_deficit ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.35)'}`,
        borderRadius: 14,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            padding: 10,
            borderRadius: 10,
            background: gapSummary.has_active_deficit ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
            color: gapSummary.has_active_deficit ? '#ef4444' : '#22c55e',
            marginTop: 2
          }}>
            <AlertTriangle size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <strong style={{ fontSize: '1.05rem', color: '#f8fafc' }}>
                {gapSummary.has_active_deficit 
                  ? `Active Intermittency Deficit Detected: -${gapSummary.max_deficit_mw} MW Shortfall Window`
                  : 'Zero Intermittency Deficit: Renewable Generation Meets Feeder Demand'}
              </strong>
              <span className={`badge ${gapSummary.severity === 'Critical' ? 'badge-risk-critical' : gapSummary.severity === 'Warning' ? 'badge-amber' : 'badge-live'}`}>
                {gapSummary.severity.toUpperCase()} RISK
              </span>
            </div>

            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#cbd5e1', maxWidth: 780 }}>
              {gapSummary.has_active_deficit ? (
                <>
                  Projected deficit from <strong>{gapSummary.active_window_start}</strong> to <strong>{gapSummary.active_window_end}</strong> ({gapSummary.duration_hours}h duration). 
                  Total energy deficit: <strong>{gapSummary.total_energy_shortfall_mwh} MWh</strong>. 
                  Potential CERC DSM statutory penalty avoided: <strong style={{ color: '#fbbf24' }}>₹{gapSummary.cerc_dsm_penalty_risk_inr_lakhs} Lakhs</strong>.
                </>
              ) : (
                'All industrial and residential demands on this feeder are 100% covered by combined solar, wind, and battery headroom.'
              )}
            </p>
          </div>
        </div>

        {gapSummary.has_active_deficit && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Immediate Protocol:</span>
            <span className="badge badge-sim" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              Auto-Dispatch BESS + Tier-1 DR Armed
            </span>
          </div>
        )}
      </div>

      {/* ─── Module 3: Integrated Forecasting Chart with Intermittency Gap Overlay ── */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Sun size={20} style={{ color: 'var(--amber-flow)' }} />
              <span>Integrated Feeder Generation, Demand &amp; Intermittency Gap Horizon</span>
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: 4, color: 'var(--text-secondary)' }}>
              LightGBM Solar &amp; Wind forecast vs. XGBoost Nodal Feeder Demand. Shaded gold band shows 95% Confidence Interval. Red/Orange highlights the evening shortfall gap.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-forecast">{selectedFeeder.id} • {selectedFeeder.character}</span>
            <span className="badge badge-sim">Sub-150ms Telemetry</span>
          </div>
        </div>

        <div style={{ width: '100%', minHeight: 400, minWidth: 0, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
                interval={horizon === '48h' ? 3 : horizon === '7d' ? 3 : 1}
              />
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

              {/* 95% Confidence Interval Shading */}
              <Area
                type="monotone"
                dataKey="solar_upper_95"
                name="Solar 95% Upper CI"
                stroke="transparent"
                fill="rgba(251, 191, 36, 0.12)"
              />
              <Area
                type="monotone"
                dataKey="solar_lower_95"
                name="Solar 95% Lower CI"
                stroke="transparent"
                fill="transparent"
              />

              {/* Solar Prediction Line */}
              <Line
                type="monotone"
                dataKey="solar_predicted"
                name="Predicted Solar (MW)"
                stroke="#fbbf24"
                strokeWidth={2.5}
                dot={false}
              />

              {/* Wind Prediction Line */}
              <Line
                type="monotone"
                dataKey="wind_predicted"
                name="Predicted Wind (MW)"
                stroke="#00f0ff"
                strokeWidth={2}
                dot={false}
              />

              {/* Total Renewable Generation Line */}
              <Line
                type="monotone"
                dataKey="total_renewable"
                name="Total Clean Supply (MW)"
                stroke="#22c55e"
                strokeWidth={2.2}
                strokeDasharray="3 3"
                dot={false}
              />

              {/* Feeder Demand Prediction Line */}
              <Line
                type="monotone"
                dataKey="demand_predicted"
                name="Feeder Demand (MW)"
                stroke="#f43f5e"
                strokeWidth={2.8}
                dot={false}
              />

              {/* Mitigated Demand Post-Flexibility */}
              <Line
                type="monotone"
                dataKey="mitigated_demand_mw"
                name="Demand Post-DR Mitigation (MW)"
                stroke="#a855f7"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Atmospheric Meteorological Drivers Strip */}
        <div style={{
          marginTop: 18,
          padding: '14px 16px',
          background: 'rgba(7, 11, 20, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sun size={18} color="#fbbf24" />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Solar Irradiance (GHI)</span>
              <strong style={{ fontSize: '0.98rem', color: '#fbbf24' }}>{middayPoint.ghi_w_m2} W/m²</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Thermometer size={18} color="#38bdf8" />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Ambient Temp &amp; Derating</span>
              <strong style={{ fontSize: '0.98rem', color: '#38bdf8' }}>{middayPoint.temperature_c} °C (-2.1%)</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CloudRain size={18} color="#94a3b8" />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Cloud Cover Scatter</span>
              <strong style={{ fontSize: '0.98rem', color: '#f8fafc' }}>{middayPoint.cloud_cover_pct} %</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wind size={18} color="#00f0ff" />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Wind Speed (Hub Height)</span>
              <strong style={{ fontSize: '0.98rem', color: '#00f0ff' }}>{middayPoint.wind_speed_ms} m/s</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Module 4: Concrete Demand Response & Community Storage Actions ── */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Sliders size={20} style={{ color: '#c084fc' }} />
              <span>Concrete Demand-Response &amp; Community Storage Action Plan</span>
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: 4, color: 'var(--text-secondary)' }}>
              Targeted flexibility recommendations with estimated MW relief, latency, and priority to eliminate the {gapSummary.max_deficit_mw} MW deficit without diesel generators.
            </p>
          </div>
          <span className="badge badge-sim">Automatic Dispatch Ready</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12,
          marginTop: 10
        }}>
          {recommendedActions.map((act) => (
            <div
              key={act.id}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 12,
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="badge badge-forecast" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    {act.category}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>
                    Latency: {act.response_time}
                  </span>
                </div>

                <h4 style={{ margin: '0 0 6px', fontSize: '0.96rem', color: '#f8fafc', fontWeight: 700 }}>
                  {act.title}
                </h4>

                <p style={{ margin: 0, fontSize: '0.80rem', color: '#94a3b8', lineHeight: 1.45 }}>
                  {act.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: 10
              }}>
                <div>
                  <span style={{ fontSize: '0.70rem', color: '#64748b', display: 'block' }}>Relief Impact</span>
                  <strong style={{ fontSize: '1.15rem', color: '#38bdf8' }}>+{act.relief_mw} MW</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.70rem', color: '#64748b', display: 'block' }}>Duration</span>
                  <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>{act.duration_hours} Hours</span>
                </div>

                <button
                  onClick={() => alert(`[DISPATCH ORDER TRANSMITTED]\n\nDirective: ${act.title}\nFeeder: ${selectedFeeder.name}\nRelief Capacity: +${act.relief_mw} MW\nLatency: ${act.response_time}\nStatus: Commanded via SCADA Droop Bus`)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                >
                  Dispatch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Module 5: Equity-Aware Local Coordination Matrix ───────────── */}
      <div className="card card-purple">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <HeartHandshake size={20} style={{ color: '#a855f7' }} />
              <span>Equity-Aware Neighbourhood Coordination &amp; Lifeline Protection</span>
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: 4, color: 'var(--text-secondary)' }}>
              Prioritises essential community assets over deferrable loads. Protects healthcare, drinking water, and cold storage with a strict zero-curtailment guarantee.
            </p>
          </div>
          <span className="badge badge-live">100% Lifeline Protected</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginTop: 10 }}>
          {protectedAssets.map((asset, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(13, 20, 36, 0.85)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: 12,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-sim" style={{ fontSize: '0.68rem', color: '#c084fc', border: '1px solid #c084fc' }}>
                  {asset.type}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 700 }}>
                  {asset.essential_load_kw} kW Essential
                </span>
              </div>

              <h4 style={{ margin: 0, fontSize: '0.90rem', color: '#f8fafc', fontWeight: 600 }}>
                {asset.name}
              </h4>

              <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                {asset.notes}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: '#22c55e', marginTop: 4 }}>
                <CheckCircle2 size={13} />
                <span>{asset.immunity_status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Module 6: Interactive What-If Scenario Simulator ────────────── */}
      <div className="card" style={{
        background: 'linear-gradient(180deg, rgba(17, 24, 45, 0.95) 0%, rgba(10, 16, 32, 0.95) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Sparkles size={20} style={{ color: '#38bdf8' }} />
              <span>Interactive What-If Reliability Simulator</span>
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: 4, color: 'var(--text-secondary)' }}>
              Simulate extreme weather drops, heatwave demand surges, or battery outages and see real-time recalculation of the reliability score and deficit gap.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isSimulated && (
              <button
                onClick={resetSimulation}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}
              >
                <RotateCcw size={13} />
                <span>Reset to Baseline</span>
              </button>
            )}
            <span className={`badge ${isSimulated ? 'badge-amber' : 'badge-live'}`}>
              {isSimulated ? 'Custom Simulation Active' : 'Live Feeder Baseline'}
            </span>
          </div>
        </div>

        {/* 4 Quick Contingency Presets */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <button
            onClick={() => applyPreset('cliff')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.76rem', background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
          >
            ⚡ Sunset Cliff (-40% Solar, +15% Demand)
          </button>
          <button
            onClick={() => applyPreset('cloud')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.76rem', background: 'rgba(249, 115, 22, 0.15)', borderColor: 'rgba(249, 115, 22, 0.4)', color: '#fdba74' }}
          >
            ☁️ Monsoon Cloud Burst (-65% Solar)
          </button>
          <button
            onClick={() => applyPreset('heatwave')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.76rem', background: 'rgba(234, 179, 8, 0.15)', borderColor: 'rgba(234, 179, 8, 0.4)', color: '#fde047' }}
          >
            🌡️ Heatwave Surge (+25% AC Load)
          </button>
          <button
            onClick={() => applyPreset('optimal')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.76rem', background: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)', color: '#86efac' }}
          >
            ☀️ Solar Crest Peak (+20% Surplus)
          </button>
        </div>

        {/* 4 Interactive Sliders */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          background: 'rgba(7, 11, 20, 0.65)',
          padding: '16px 18px',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>Solar Generation Delta:</span>
              <strong style={{ color: simSolarDelta >= 0 ? '#22c55e' : '#f97316' }}>{simSolarDelta > 0 ? `+${simSolarDelta}%` : `${simSolarDelta}%`}</strong>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={simSolarDelta}
              onChange={(e) => setSimSolarDelta(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#fbbf24' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
              <span style={{ color: '#f43f5e', fontWeight: 600 }}>Feeder Demand Surge:</span>
              <strong style={{ color: simDemandDelta > 0 ? '#f43f5e' : '#22c55e' }}>{simDemandDelta > 0 ? `+${simDemandDelta}%` : `${simDemandDelta}%`}</strong>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              value={simDemandDelta}
              onChange={(e) => setSimDemandDelta(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#f43f5e' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>BESS Fleet Availability:</span>
              <strong>{simBessAvail}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simBessAvail}
              onChange={(e) => setSimBessAvail(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#22c55e' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
              <span style={{ color: '#c084fc', fontWeight: 600 }}>DR Participation Rate:</span>
              <strong>{simDrParticipation}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simDrParticipation}
              onChange={(e) => setSimDrParticipation(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#c084fc' }}
            />
          </div>
        </div>

        {/* Live Simulation Outcomes Bar */}
        <div style={{
          marginTop: 14,
          padding: '12px 16px',
          background: 'rgba(2, 132, 199, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Simulated Reliability Score</span>
            <strong style={{ fontSize: '1.4rem', color: reliability.score >= 75 ? '#38bdf8' : '#f97316' }}>
              {reliability.score} / 100
            </strong>
            <span style={{ fontSize: '0.74rem', color: '#cbd5e1', marginLeft: 8 }}>({reliability.status})</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Intermittency Gap Status</span>
            <strong style={{ fontSize: '1.1rem', color: gapSummary.has_active_deficit ? '#f97316' : '#22c55e' }}>
              {gapSummary.has_active_deficit ? `-${gapSummary.max_deficit_mw} MW Shortfall` : '100% Balanced'}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Flexibility Response Action</span>
            <span className="badge badge-sim" style={{ fontSize: '0.74rem' }}>
              {gapSummary.has_active_deficit ? 'Tier-1 Auto DR Triggered' : 'Normal Grid Standby'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Module 7: DISCOM Operational & Financial Impact ────────────── */}
      <div className="card card-emerald">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <DollarSign size={20} style={{ color: '#22c55e' }} />
              <span>DISCOM Operational &amp; Financial Impact Scorecard</span>
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: 4, color: 'var(--text-secondary)' }}>
              Measurable cost avoidance under CERC Deviation Settlement Mechanism (DSM 2023) regulations and avoided diesel peaker generation.
            </p>
          </div>
          <span className="badge badge-live">₹ Denominated Audit</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginTop: 10
        }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '14px 16px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Avoided Peak Demand</span>
            <strong style={{ fontSize: '1.4rem', color: '#38bdf8' }}>
              {(selectedFeeder.flexible_load_mw + selectedFeeder.bess_power_mw * 0.6).toFixed(1)} MW
            </strong>
            <span style={{ fontSize: '0.70rem', color: '#22c55e', display: 'block', marginTop: 2 }}>Substation Transformer Shaving</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '14px 16px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>CERC DSM Penalty Avoidance</span>
            <strong style={{ fontSize: '1.4rem', color: '#fbbf24' }}>
              ₹{gapSummary.cerc_dsm_penalty_risk_inr_lakhs} Lakhs
            </strong>
            <span style={{ fontSize: '0.70rem', color: '#cbd5e1', display: 'block', marginTop: 2 }}>IEGC §5.3 Frequency Band</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '14px 16px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Avoided Peaker Energy Cost</span>
            <strong style={{ fontSize: '1.4rem', color: '#22c55e' }}>
              ₹{(gapSummary.total_energy_shortfall_mwh * 0.85).toFixed(2)} Lakhs
            </strong>
            <span style={{ fontSize: '0.70rem', color: '#22c55e', display: 'block', marginTop: 2 }}>Nightly Peak Power Purchase</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '14px 16px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Carbon Abatement</span>
            <strong style={{ fontSize: '1.4rem', color: '#c084fc' }}>
              {(gapSummary.total_energy_shortfall_mwh * 0.78).toFixed(1)} tCO2
            </strong>
            <span style={{ fontSize: '0.70rem', color: '#22c55e', display: 'block', marginTop: 2 }}>Avoided Peaker Diesel Burn</span>
          </div>
        </div>
      </div>

      {/* ─── Modal: Audit Report Export ───────────────────────────────────── */}
      <NeighbourhoodReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        feeder={selectedFeeder}
        gapSummary={gapSummary}
        reliabilityScore={reliability.score}
        reliabilityStatus={reliability.status}
        horizon={horizon}
        protectedAssets={protectedAssets}
      />
    </div>
  );
}
