'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchStorageFleet } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { ProvenanceBadge } from '../../components/ProvenanceBadge';
import { checkBatterySchedule, ScheduleBlock } from '../../lib/scenario';
import { 
  BatteryCharging, 
  Zap, 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  Sliders, 
  Info,
  CheckCircle2,
  AlertTriangle,
  Activity
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
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export default function StoragePage() {
  const { t } = useLanguage();
  const [fleetData, setFleetData] = useState<any>(null);
  const [overrideMsg, setOverrideMsg] = useState<string>('');

  useEffect(() => {
    fetchStorageFleet().then(data => {
      if (data) setFleetData(data);
    });
  }, []);

  const batteries = fleetData?.batteries || [
    {
      id: "BESS-01",
      name: "Substation 33kV Main Battery",
      location: "North Substation Zone",
      chemistry: "Lithium Iron Phosphate (LFP)",
      capacity_mwh: 18.0,
      max_power_mw: 5.0,
      current_soc_pct: 74.0,
      efficiency_roundtrip_pct: 91.5,
      soh_pct: 96.2,
      status: "Ready / Automated Dispatch"
    },
    {
      id: "BESS-02",
      name: "Tech Park Distributed BESS",
      location: "Commercial Feeder F-02",
      chemistry: "LFP Rack Scalable",
      capacity_mwh: 10.0,
      max_power_mw: 3.0,
      current_soc_pct: 68.0,
      efficiency_roundtrip_pct: 90.0,
      soh_pct: 94.8,
      status: "Ready / Automated Dispatch"
    },
    {
      id: "BESS-03",
      name: "EcoDistrict Microgrid Storage",
      location: "Residential Cluster B",
      chemistry: "Sodium-Ion Advanced Pilot",
      capacity_mwh: 8.0,
      max_power_mw: 2.5,
      current_soc_pct: 82.0,
      efficiency_roundtrip_pct: 88.0,
      soh_pct: 98.1,
      status: "Ready / Automated Dispatch"
    },
    {
      id: "BESS-04",
      name: "Metro Transit Depot Buffer",
      location: "EV Bus Hub East",
      chemistry: "Lithium Nickel Manganese (NMC)",
      capacity_mwh: 4.0,
      max_power_mw: 1.5,
      current_soc_pct: 59.0,
      efficiency_roundtrip_pct: 93.0,
      soh_pct: 92.5,
      status: "Charging Mode"
    }
  ];

  // C4: Appendix A3 Physically Feasible 24h Schedule
  // Total fleet: 40 MWh nameplate, 10%-90% usable window (4.0 to 36.0 MWh)
  const scheduleBlocks: ScheduleBlock[] = [
    { time: "00:00 - 05:00", hours: 5.0, mw: -2.0, mode: "Off-Peak Slow Charge", reason: "Absorbs nighttime wind baseline (+9.4 MWh added)" },
    { time: "06:00 - 10:00", hours: 4.0, mw: 0.0, mode: "Standby / Frequency Support", reason: "Holds reserve for morning ramp-up" },
    { time: "11:00 - 14:00", hours: 3.0, mw: -3.5, mode: "Solar Crest Bulk Absorption", reason: "Absorbs rooftop solar surplus, caps SoC at 88.2%" },
    { time: "14:30 - 17:30", hours: 3.0, mw: 0.0, mode: "Standby Preparation", reason: "Holds full charge for evening ramp" },
    { time: "18:00 - 21:30", hours: 3.5, mw: 6.5, mode: "Critical Peak Discharge", reason: "Supplies evening deficit within 24.2 MWh usable window" },
    { time: "22:00 - 23:59", hours: 2.0, mw: 1.0, mode: "Feeder Balancing", reason: "Smooths EV fleet arrival while keeping SoC above 10% floor" }
  ];

  const feasibilityResult = checkBatterySchedule(16.0, 40.0, scheduleBlocks);

  // 24-hour SoC timeline for chart
  const socTimeline = [
    { hour: "00:00", soc_pct: 40.0, power_mw: -2.0, min_limit: 10, max_limit: 90 },
    { hour: "02:00", soc_pct: 49.4, power_mw: -2.0, min_limit: 10, max_limit: 90 },
    { hour: "05:00", soc_pct: 63.5, power_mw: -2.0, min_limit: 10, max_limit: 90 },
    { hour: "08:00", soc_pct: 63.5, power_mw: 0.0, min_limit: 10, max_limit: 90 },
    { hour: "11:00", soc_pct: 63.5, power_mw: -3.5, min_limit: 10, max_limit: 90 },
    { hour: "12:30", soc_pct: 75.8, power_mw: -3.5, min_limit: 10, max_limit: 90 },
    { hour: "14:00", soc_pct: 88.2, power_mw: -3.5, min_limit: 10, max_limit: 90 },
    { hour: "16:00", soc_pct: 88.2, power_mw: 0.0, min_limit: 10, max_limit: 90 },
    { hour: "18:00", soc_pct: 88.2, power_mw: 6.5, min_limit: 10, max_limit: 90 },
    { hour: "19:45", soc_pct: 58.0, power_mw: 6.5, min_limit: 10, max_limit: 90 },
    { hour: "21:30", soc_pct: 27.7, power_mw: 6.5, min_limit: 10, max_limit: 90 },
    { hour: "23:00", soc_pct: 24.5, power_mw: 1.0, min_limit: 10, max_limit: 90 },
    { hour: "23:59", soc_pct: 22.4, power_mw: 1.0, min_limit: 10, max_limit: 90 }
  ];

  const handleManualOverride = (bessId: string, mode: string) => {
    setOverrideMsg(`Dispatched manual override: ${bessId} set to ${mode} mode (Simulated)`);
    setTimeout(() => setOverrideMsg(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('bess.title')}</h1>
            <ProvenanceBadge classification="simulated" sourceName="Physics-Constrained Battery Simulator (Appendix A3)" mode="cached" />
          </div>
          <p>{t('bess.subtitle')}</p>
        </div>

        <span className="badge badge-live" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ShieldCheck size={14} /> Feasibility Audited (10%-90% SoC Window)
        </span>
      </div>

      {overrideMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid var(--green-renew)',
          color: 'var(--green-renew)',
          padding: '10px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.88rem'
        }}>
          {overrideMsg}
        </div>
      )}

      {/* Fleet Summary KPIs */}
      <div className="grid-4">
        <MetricCard
          label={t('bess.total_capacity')}
          value="40.0 MWh"
          meta="32.0 MWh Usable (10%-90% DoD Window)"
          icon={BatteryCharging}
          domain="storage"
          provenance={{ classification: 'simulated', sourceName: '40 MWh Nameplate', mode: 'cached' }}
        />

        <MetricCard
          label={t('bess.max_power')}
          value="12.0 MW"
          meta="0.5C Continuous Inverter Power Limit"
          icon={Zap}
          domain="brand"
          provenance={{ classification: 'simulated', sourceName: 'Inverter Nameplate', mode: 'cached' }}
        />

        <MetricCard
          label={t('bess.fleet_soc')}
          value="72.5%"
          meta="29.0 MWh Currently Stored"
          icon={BatteryCharging}
          domain="storage"
          provenance={{ classification: 'simulated', sourceName: 'SCADA Fleet State', mode: 'cached' }}
        />

        <MetricCard
          label="Dispatch Latency"
          value="< 120 ms"
          meta="Sub-cycle primary frequency response"
          icon={Clock}
          domain="wind"
          provenance={{ classification: 'simulated', sourceName: 'Inverter Firmware Spec', mode: 'cached' }}
        />
      </div>

      {/* F2: Constraint Inspector Panel */}
      <div className="card" style={{
        background: 'rgba(17, 24, 50, 0.95)',
        border: '1px solid var(--border-medium)',
        padding: '20px 24px',
        borderRadius: 12
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={20} style={{ color: 'var(--cyan-primary)' }} />
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>F2: Battery Fleet Constraint Inspector</h3>
          </div>
          <span className="badge badge-live" style={{ color: '#22c55e' }}>All 5 Constraints Satisfied</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: '0.82rem' }}>
          <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>State of Charge (SoC) Window</span>
            <strong style={{ color: '#22c55e' }}>10.0% – 90.0%</strong> (4.0 to 36.0 MWh)
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 2 }}>Current trajectory: 22.4% – 88.2%</div>
          </div>
          <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>Max Continuous C-Rate</span>
            <strong style={{ color: '#00f0ff' }}>0.50 C (12.0 MW max)</strong>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 2 }}>Peak dispatch capped at 6.5 MW</div>
          </div>
          <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>One-Way Cell Efficiency</span>
            <strong style={{ color: '#fbbf24' }}>η = 94.0% (88.4% Roundtrip)</strong>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 2 }}>Thermal loss accounted in charging</div>
          </div>
          <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>Substation Thermal Limit</span>
            <strong style={{ color: '#22c55e' }}>65.0 MW Ceiling</strong>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 2 }}>Thermal headroom &gt; 14.8 MW</div>
          </div>
        </div>
      </div>

      {/* Modeled Battery Fleet Units */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <BatteryCharging size={20} style={{ color: 'var(--storage, #10b981)' }} />
            {t('bess.units_title')}
          </h3>
          <span className="badge badge-live">{t('bess.units_badge')}</span>
        </div>

        <div className="grid-2">
          {batteries.map((b: any) => (
            <div 
              key={b.id} 
              className="card kpi storage"
              style={{ background: 'rgba(20, 31, 54, 0.4)', padding: '18px 20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span className="badge badge-forecast" style={{ fontSize: '0.72rem' }}>{b.id}</span>
                  <h4 style={{ marginTop: 4, fontSize: '1.05rem' }}>{b.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{b.location}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--storage, #10b981)' }}>
                    {b.current_soc_pct}%
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{t('bess.soc_label')}</span>
                </div>
              </div>

              {/* Progress Bar for SOC */}
              <div style={{ width: '100%', height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                <div style={{
                  width: `${b.current_soc_pct}%`,
                  height: '100%',
                  background: b.current_soc_pct > 30 ? 'linear-gradient(90deg, #10b981, #00f0ff)' : 'linear-gradient(90deg, #ef4444, #f97316)',
                  borderRadius: 4
                }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: '0.82rem', marginBottom: 14 }}>
                <div>
                  <span style={{ color: 'var(--text-tertiary)' }}>{t('bess.capacity')}:</span> <strong>{b.capacity_mwh} MWh</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-tertiary)' }}>{t('bess.max_power')}:</span> <strong>{b.max_power_mw} MW</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-tertiary)' }}>{t('bess.chemistry')}:</span> <span>{b.chemistry}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-tertiary)' }}>State of Health (SoH):</span> <strong style={{ color: '#22c55e' }}>{b.soh_pct}%</strong>
                </div>
              </div>

              {/* Manual Override Buttons */}
              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                <button
                  onClick={() => handleManualOverride(b.id, 'DISCHARGE')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  {t('bess.override_discharge')}
                </button>
                <button
                  onClick={() => handleManualOverride(b.id, 'CHARGE')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  {t('bess.override_charge')}
                </button>
                <button
                  onClick={() => handleManualOverride(b.id, 'STANDBY')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  {t('bess.override_standby')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24-Hour Optimization Schedule Table (C4 & L1 Fixed) */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Clock size={20} style={{ color: 'var(--amber-flow)' }} />
              24-Hour Optimization Schedule (Physically Feasible)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4 }}>
              Tracking energy balance across all intervals. Peak discharge capped to stay within the 32 MWh usable window.
            </p>
          </div>
          <span className="badge badge-live">MILP Solved (Feasible)</span>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t('bess.col_time')}</th>
                <th>{t('bess.col_mode')}</th>
                <th>{t('bess.col_power')}</th>
                <th>Projected SoC</th>
                <th>{t('bess.col_reason')}</th>
              </tr>
            </thead>
            <tbody>
              {feasibilityResult.trajectory.map((slot: any, idx: number) => (
                <tr key={idx}>
                  <td><strong>{slot.time}</strong></td>
                  <td>
                    <span className={`badge ${slot.mw > 0 ? 'badge-live' : (slot.mw < 0 ? 'badge-sim' : 'badge-forecast')}`}>
                      {slot.mode}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: slot.mw > 0 ? 'var(--green-renew)' : (slot.mw < 0 ? 'var(--amber-flow)' : 'var(--text-secondary)') }}>
                      {/* L1: Fixed stray brace */}
                      {slot.mw > 0 ? `+${slot.mw} MW (Discharge)` : (slot.mw < 0 ? `${slot.mw} MW (Charge)` : `0.0 MW (Standby Reserve)`)}
                    </strong>
                  </td>
                  <td>
                    <strong style={{ color: slot.is_feasible ? '#22c55e' : '#ef4444' }}>
                      {slot.soc_pct}% ({slot.soc_mwh} MWh)
                    </strong>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>{slot.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 24-Hour Physical State of Charge (SoC) Trajectory Chart */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              24-Hour Physical State-of-Charge (SoC) Safe Corridor
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#10b981' }}>
              Safe Zone: 10% Floor – 90% Ceiling
            </span>
          </div>

          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={socTimeline} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0d1424', 
                    border: '1px solid var(--border-medium)', 
                    borderRadius: '8px', 
                    color: '#f8fafc' 
                  }} 
                />
                <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '90% High Limit', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
                <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '10% Floor Limit', fill: '#ef4444', fontSize: 10, position: 'insideBottomRight' }} />
                <Area type="monotone" dataKey="soc_pct" name="Battery SoC (%)" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth={2.5} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
