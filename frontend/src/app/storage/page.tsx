'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchStorageFleet } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { 
  BatteryCharging, 
  Zap, 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  Sliders, 
  Info,
  CheckCircle2
} from 'lucide-react';

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
      cycle_life_remaining_pct: 96.2,
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
      cycle_life_remaining_pct: 94.8,
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
      cycle_life_remaining_pct: 98.1,
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
      cycle_life_remaining_pct: 92.5,
      status: "Charging Mode"
    }
  ];

  const schedule = fleetData?.schedule || [
    { time: "00:00 - 05:00", mode: "Off-Peak Slow Charge", power_mw: -2.0, reason: "Baseload wind capture" },
    { time: "06:00 - 10:00", mode: "Standby / Frequency Support", power_mw: 0.0, reason: "Morning grid reserve" },
    { time: "11:00 - 14:30", mode: "Solar Crest Bulk Absorption", power_mw: -9.5, reason: "Absorbing rooftop solar surplus" },
    { time: "15:00 - 17:30", mode: "Standby Preparation", power_mw: 0.0, reason: "Holding full charge for evening ramp" },
    { time: "18:00 - 21:30", mode: "Critical Peak Discharge", power_mw: 10.5, reason: "Supporting peak evening deficit" },
    { time: "22:00 - 23:59", mode: "Grid Stabilization", power_mw: 1.5, reason: "Feeder balancing" }
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
            <span className="badge badge-sim">{t('badge.simulation')}</span>
          </div>
          <p>{t('bess.subtitle')}</p>
        </div>

        <span className="badge badge-live">
          <ShieldCheck size={14} /> Software Digital Model — No Hardware Reqd
        </span>
      </div>

      {overrideMsg && (
        <div style={{
          padding: '12px 18px',
          background: 'rgba(0, 240, 255, 0.12)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--cyan-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <CheckCircle2 size={18} />
          <span>{overrideMsg}</span>
        </div>
      )}

      {/* Fleet Totals */}
      <div className="grid-4">
        <MetricCard
          label={t('bess.fleet_capacity')}
          value="40.0"
          unit="MWh"
          meta="4 Distributed Nodes"
          icon={BatteryCharging}
          variant="cyan"
        />

        <MetricCard
          label={t('bess.fleet_power')}
          value="12.0"
          unit="MW"
          meta="C-rate 0.3C - 0.5C"
          icon={Zap}
          variant="amber"
        />

        <MetricCard
          label={t('bess.weighted_soc')}
          value="72.5%"
          meta="29.0 MWh Energy in Reserve"
          icon={BatteryCharging}
          variant="green"
        />

        <MetricCard
          label={t('bess.response_latency')}
          value="120ms"
          meta="Inverter Sub-Cycle Trigger"
          icon={Clock}
          variant="cyan"
        />
      </div>

      {/* Modeled Battery Fleet Units */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <BatteryCharging size={20} style={{ color: 'var(--green-renew)' }} />
            Active Community Storage Units
          </h3>
          <span className="badge badge-live">4 Distributed BESS Units Online</span>
        </div>

        <div className="grid-2">
          {batteries.map((b: any) => (
            <div 
              key={b.id} 
              className="card"
              style={{ background: 'rgba(20, 31, 54, 0.4)', padding: '18px 20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span className="badge badge-forecast" style={{ fontSize: '0.72rem' }}>{b.id}</span>
                  <h4 style={{ marginTop: 4, fontSize: '1.05rem' }}>{b.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{b.location}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green-renew)' }}>
                    {b.current_soc_pct}%
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>State of Charge</span>
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
                  <span style={{ color: 'var(--text-tertiary)' }}>Capacity:</span> <strong>{b.capacity_mwh} MWh</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-tertiary)' }}>Max Power:</span> <strong>{b.max_power_mw} MW</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-tertiary)' }}>Chemistry:</span> <span>{b.chemistry}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-tertiary)' }}>Cycle Life:</span> <strong>{b.cycle_life_remaining_pct}%</strong>
                </div>
              </div>

              {/* Manual Override Buttons */}
              <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                <button
                  onClick={() => handleManualOverride(b.id, 'DISCHARGE')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  ⚡ Discharge
                </button>
                <button
                  onClick={() => handleManualOverride(b.id, 'CHARGE')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  📥 Charge
                </button>
                <button
                  onClick={() => handleManualOverride(b.id, 'STANDBY')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  ⏸ Standby
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24-Hour Optimization Schedule Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Clock size={20} style={{ color: 'var(--amber-flow)' }} />
            {t('bess.schedule_title')}
          </h3>
          <span className="badge badge-sim">Dynamic MILP Dispatch</span>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Time Window</th>
                <th>Mode</th>
                <th>Target Fleet Power</th>
                <th>Operational Rationale</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((slot: any, idx: number) => (
                <tr key={idx}>
                  <td><strong>{slot.time}</strong></td>
                  <td>
                    <span className={`badge ${slot.power_mw > 0 ? 'badge-live' : (slot.power_mw < 0 ? 'badge-sim' : 'badge-forecast')}`}>
                      {slot.mode}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: slot.power_mw > 0 ? 'var(--green-renew)' : (slot.power_mw < 0 ? 'var(--amber-flow)' : 'var(--text-secondary)') }}>
                      {slot.power_mw > 0 ? `+${slot.power_mw} MW (Discharge)` : (slot.power_mw < 0 ? `${slot.power_mw} MW (Charge)` : '0.0 MW (Reserve)')}
                    </strong>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{slot.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
