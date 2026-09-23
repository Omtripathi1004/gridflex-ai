'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchDiscomOverview } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { 
  Building2, 
  Activity, 
  ShieldAlert, 
  Sliders, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Battery,
  FileText,
  Check,
  X,
  Edit3,
  HelpCircle,
  TrendingDown,
  Layers,
  Clock,
  Radio
} from 'lucide-react';

export default function DiscomPage() {
  const { t } = useLanguage();
  const [discomData, setDiscomData] = useState<any>(null);

  // Human Approval Workflow State
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'modified' | 'rejected'>('pending');
  const [showModifyModal, setShowModifyModal] = useState<boolean>(false);
  const [modifiedBessMw, setModifiedBessMw] = useState<number>(2.8);
  const [modifiedDrMw, setModifiedDrMw] = useState<number>(1.5);
  const [operatorNotes, setOperatorNotes] = useState<string>('Approved under CEA 2023 grid code. Priority protection enabled for local hospitals.');

  useEffect(() => {
    fetchDiscomOverview().then(data => {
      if (data) setDiscomData(data);
    });
  }, []);

  const feeders = discomData?.feeders || [
    {
      id: "UP-LKO-GN01",
      name: "Gomti Nagar Vibhuti Khand (11kV)",
      substation: "Gomti Nagar 33/11kV Substation",
      load_mw: 14.8,
      capacity_mw: 20.0,
      loading_pct: 74.0,
      voltage_pu: 0.992,
      bess_soc_pct: 79.5,
      solar_pv_connected_mw: 11.5,
      risk_level: "Optimal Envelope",
      available_flexibility_mw: 4.6,
      loss_baseline_pct: 7.8,
      loss_optimized_pct: 4.6,
      recommended_intervention: "Discharge BESS 3.2 MW at 18:00; shift 1.8 MW municipal water pumps to solar noon"
    },
    {
      id: "F-01",
      name: "Mayur Vihar Industrial Feeder (11kV)",
      substation: "Mayur Vihar 33/11kV Substation",
      load_mw: 15.2,
      capacity_mw: 18.0,
      loading_pct: 84.4,
      voltage_pu: 0.982,
      bess_soc_pct: 78.0,
      solar_pv_connected_mw: 8.2,
      risk_level: "Moderate Stress",
      available_flexibility_mw: 4.8,
      loss_baseline_pct: 8.2,
      loss_optimized_pct: 4.9,
      recommended_intervention: "Stagger industrial batch induction furnace heating post 20:00"
    },
    {
      id: "F-02",
      name: "Rohini Sector 9 Feeder (11kV)",
      substation: "Rohini 33/11kV Substation",
      load_mw: 10.4,
      capacity_mw: 12.0,
      loading_pct: 86.6,
      voltage_pu: 0.974,
      bess_soc_pct: 71.5,
      solar_pv_connected_mw: 14.5,
      risk_level: "Evening Peak Deficit",
      available_flexibility_mw: 3.2,
      loss_baseline_pct: 9.1,
      loss_optimized_pct: 5.1,
      recommended_intervention: "Execute BESS-02 2.5 MW discharge; throttle DC fast chargers to 30 kW trickle"
    },
    {
      id: "F-03",
      name: "Nehru Place Commercial Core (11kV)",
      substation: "Nehru Place 33/11kV Substation",
      load_mw: 16.5,
      capacity_mw: 20.0,
      loading_pct: 82.5,
      voltage_pu: 0.985,
      bess_soc_pct: 82.0,
      solar_pv_connected_mw: 9.8,
      risk_level: "Congestion Advisory",
      available_flexibility_mw: 4.2,
      loss_baseline_pct: 8.6,
      loss_optimized_pct: 4.8,
      recommended_intervention: "Enforce 1.5°C chiller thermostat setback on commercial HVAC networks"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
      {/* 1. Header with Live SCADA Status */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 33, 53, 0.95), rgba(10, 27, 45, 0.85))',
        border: '1px solid rgba(34, 211, 238, 0.25)',
        borderRadius: '16px',
        padding: '24px 28px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(34, 211, 238, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22d3ee'
            }}>
              <Radio size={18} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
              DISCOM Control Room & Technical Loss Optimizer
            </h1>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              SCADA ONLINE (DNP3 / IEC 61850)
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#94a3b8', maxWidth: '750px', lineHeight: 1.5 }}>
            Substation-level telemetry, automated I²R line loss reduction, and human-in-the-loop operator approval workflows for distribution grid dispatch.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: '11px',
            background: 'rgba(56, 189, 248, 0.12)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: 700
          }}>
            CEA & CERC 2023 COMPLIANT
          </span>
        </div>
      </div>

      {/* 2. Network Telemetry KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        <MetricCard
          label="Active Feeders"
          value="4 Monitored"
          meta="11kV Radial Distribution Network"
          icon={Building2}
          variant="cyan"
        />

        <MetricCard
          label="Substation Loading"
          value="76.8%"
          meta="Within safe transformer thermal rating (< 85%)"
          icon={Activity}
          variant="amber"
        />

        <MetricCard
          label="Aggregated BESS Storage"
          value="34.0 MWh"
          meta="Average SOC: 77.8% (20% reserve locked)"
          icon={Battery}
          variant="green"
        />

        <MetricCard
          label="Dispatchable Flexibility"
          value="16.8 MW"
          meta="BESS + HVAC Setback + EV Modulation"
          icon={Sliders}
          variant="cyan"
        />
      </div>

      {/* 3. Technical Loss Optimization Monitor (I^2 * R Physics-Informed) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 33, 53, 0.9), rgba(10, 27, 45, 0.8))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <TrendingDown size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                Technical Loss Optimization Engine (I²R Line Losses)
                <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px' }}>
                  41.7% LOSS REDUCTION
                </span>
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Localized DER dispatch eliminates long-distance feeder transit currents, quadratically lowering copper losses.
              </p>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '11px',
            color: '#64748b',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '5px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(148, 163, 184, 0.12)'
          }}>
            <HelpCircle size={13} color="#38bdf8" />
            <span>Engineering approximation: 11kV ACSR Dog conductor (0.2792 Ω/km), P_loss = 3 · I² · R</span>
          </div>
        </div>

        {/* 4 Loss Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 16,
          marginBottom: 16
        }}>
          {/* Baseline Loss */}
          <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
              Baseline Technical Loss
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#f87171' }}>
              8.4% <span style={{ fontSize: '14px', color: '#94a3b8' }}>of throughput</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: 4 }}>
              Uncoordinated central grid drawing at peak
            </div>
          </div>

          {/* Optimized Loss */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
              Optimized Feeder Loss
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#34d399' }}>
              4.9% <span style={{ fontSize: '14px', color: '#94a3b8' }}>of throughput</span>
            </div>
            <div style={{ fontSize: '12px', color: '#34d399', marginTop: 4 }}>
              Net reduction of 3.5 percentage points
            </div>
          </div>

          {/* Avoided Energy Loss */}
          <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
              Avoided Energy Loss
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8' }}>
              1.85 <span style={{ fontSize: '14px', color: '#94a3b8' }}>MWh / day</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: 4 }}>
              Conserves 675.2 MWh of clean electricity annually
            </div>
          </div>

          {/* Annualized Cost Savings */}
          <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
              Annualized Loss Savings
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#c084fc' }}>
              ₹46.2 <span style={{ fontSize: '14px', color: '#94a3b8' }}>Lakhs / yr</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: 4 }}>
              Based on DISCOM average power purchase cost ₹6.85/kWh
            </div>
          </div>
        </div>
      </div>

      {/* 4. Human Approval Workflow Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 33, 53, 0.9), rgba(10, 27, 45, 0.85))',
        border: `1px solid ${approvalStatus === 'approved' ? 'rgba(16, 185, 129, 0.4)' : approvalStatus === 'modified' ? 'rgba(56, 189, 248, 0.4)' : approvalStatus === 'rejected' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 16,
          marginBottom: 18
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={20} color={approvalStatus === 'approved' ? '#10b981' : '#f59e0b'} />
              Human-in-the-Loop Operator Review & Dispatch Authority
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Distribution engineers retain executive authority to approve, adjust setpoints, or reject automated MILP recommendations.
            </p>
          </div>

          {/* Current Approval Status Badge */}
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            padding: '5px 14px',
            borderRadius: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            background: approvalStatus === 'approved' ? 'rgba(16, 185, 129, 0.2)' : approvalStatus === 'modified' ? 'rgba(56, 189, 248, 0.2)' : approvalStatus === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: approvalStatus === 'approved' ? '#34d399' : approvalStatus === 'modified' ? '#38bdf8' : approvalStatus === 'rejected' ? '#f87171' : '#fbbf24',
            border: `1px solid ${approvalStatus === 'approved' ? '#10b981' : approvalStatus === 'modified' ? '#38bdf8' : approvalStatus === 'rejected' ? '#ef4444' : '#f59e0b'}`
          }}>
            {approvalStatus === 'approved' && '✓ DISPATCH APPROVED & ARMED'}
            {approvalStatus === 'modified' && '✎ DISPATCH ARMED WITH MODIFIED SETPOINTS'}
            {approvalStatus === 'rejected' && '✕ DISPATCH REJECTED — MANUAL CONTROL ACTIVE'}
            {approvalStatus === 'pending' && '⏳ PENDING OPERATOR SIGN-OFF'}
          </span>
        </div>

        {/* AI Proposed Recommendation Box */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 18
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cpu size={14} /> AI Recommendation for Feeder UP-LKO-GN01 (18:00 – 21:30 Evening Peak):
          </div>
          <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.6 }}>
            Arm <strong>{approvalStatus === 'modified' ? modifiedBessMw : 3.2} MW</strong> BESS discharge from Gomti Nagar substation battery.
            Signal <strong>{approvalStatus === 'modified' ? modifiedDrMw : 1.8} MW</strong> demand reduction across 4 municipal pump stations and commercial chillers (-1.5°C setback).
            Safeguard 100% lifeline power to <strong>Dr. Ram Manohar Lohia Hospital ICU</strong>.
          </div>
        </div>

        {/* Action Buttons: Approve, Modify, Reject */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => setApprovalStatus('approved')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: approvalStatus === 'approved' ? '#10b981' : 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Check size={16} /> Approve Dispatch Plan
          </button>

          <button
            type="button"
            onClick={() => setShowModifyModal(!showModifyModal)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              border: '1px solid rgba(56, 189, 248, 0.35)',
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Edit3 size={16} /> {showModifyModal ? 'Close Setpoint Editor' : 'Modify Setpoints'}
          </button>

          <button
            type="button"
            onClick={() => setApprovalStatus('rejected')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              border: '1px solid rgba(239, 68, 68, 0.35)',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <X size={16} /> Reject & Override
          </button>
        </div>

        {/* Setpoints Drawer when modifying */}
        {showModifyModal && (
          <div style={{
            marginTop: 16,
            background: 'rgba(2, 6, 23, 0.7)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 12,
            padding: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 14
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: 4 }}>
                BESS Injection Setpoint (MW):
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="4.0"
                value={modifiedBessMw}
                onChange={(e) => {
                  setModifiedBessMw(parseFloat(e.target.value) || 0);
                  setApprovalStatus('modified');
                }}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: 4 }}>
                Demand Response Shed Target (MW):
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="3.0"
                value={modifiedDrMw}
                onChange={(e) => {
                  setModifiedDrMw(parseFloat(e.target.value) || 0);
                  setApprovalStatus('modified');
                }}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: 4 }}>
                Operator Log Note:
              </label>
              <input
                type="text"
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. Without GridFlex vs With GridFlex Side-by-Side Comparison */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 33, 53, 0.9), rgba(10, 27, 45, 0.8))',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
            Operational Comparison: Without GridFlex vs. With GridFlex
          </h3>
          <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
            Rigorous side-by-side engineering evaluation under 2023 CERC DSM regulations and CEA distribution performance criteria.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: '#94a3b8', fontWeight: 700 }}>Operational Dimension</th>
                <th style={{ padding: '12px 14px', color: '#f87171', fontWeight: 700 }}>Without GridFlex (Baseline)</th>
                <th style={{ padding: '12px 14px', color: '#34d399', fontWeight: 700 }}>With GridFlex AI Dispatch</th>
                <th style={{ padding: '12px 14px', color: '#38bdf8', fontWeight: 700 }}>Operational Delta / Gain</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '12px 14px', color: '#f8fafc', fontWeight: 600 }}>Peak Feeder Loading</td>
                <td style={{ padding: '12px 14px', color: '#f87171' }}>92.4% (Overload Warning)</td>
                <td style={{ padding: '12px 14px', color: '#34d399', fontWeight: 700 }}>68.2% (Safe Operating Zone)</td>
                <td style={{ padding: '12px 14px', color: '#38bdf8' }}>-24.2% Headroom Restored</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '12px 14px', color: '#f8fafc', fontWeight: 600 }}>11kV Technical Line Losses (I²R)</td>
                <td style={{ padding: '12px 14px', color: '#f87171' }}>8.4% of feeder throughput</td>
                <td style={{ padding: '12px 14px', color: '#34d399', fontWeight: 700 }}>4.9% of feeder throughput</td>
                <td style={{ padding: '12px 14px', color: '#38bdf8' }}>3.5% Loss Saved (₹46.2L/yr)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '12px 14px', color: '#f8fafc', fontWeight: 600 }}>CERC DSM Penalty Exposure</td>
                <td style={{ padding: '12px 14px', color: '#f87171' }}>₹14.80 Lakhs / month</td>
                <td style={{ padding: '12px 14px', color: '#34d399', fontWeight: 700 }}>₹0.00 Lakhs (Fully Mitigated)</td>
                <td style={{ padding: '12px 14px', color: '#38bdf8' }}>100% Deviation Risk Avoided</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '12px 14px', color: '#f8fafc', fontWeight: 600 }}>Unserved Energy to Lifeline Loads</td>
                <td style={{ padding: '12px 14px', color: '#f87171' }}>2.3 MWh / day during peaks</td>
                <td style={{ padding: '12px 14px', color: '#34d399', fontWeight: 700 }}>0.0 MWh (100% Protected)</td>
                <td style={{ padding: '12px 14px', color: '#38bdf8' }}>Zero Clinical/Water Outages</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 14px', color: '#f8fafc', fontWeight: 600 }}>Diesel Peaker Generator Dispatch</td>
                <td style={{ padding: '12px 14px', color: '#f87171' }}>4.2 MWh / day (₹24.5/kWh)</td>
                <td style={{ padding: '12px 14px', color: '#34d399', fontWeight: 700 }}>0.0 MWh (Clean BESS + DR)</td>
                <td style={{ padding: '12px 14px', color: '#38bdf8' }}>3.4 Tonnes CO2 abated daily</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Feeders SCADA Telemetry Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Zap size={20} style={{ color: 'var(--cyan-primary)' }} />
            11kV Feeder Live Telemetry & Control Register
          </h3>
          <span className="badge badge-live">REAL-TIME DATA STREAM</span>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Feeder & Substation</th>
                <th>Load / Capacity</th>
                <th>Loading %</th>
                <th>Voltage</th>
                <th>BESS SOC</th>
                <th>Solar PV</th>
                <th>Loss (Base ➔ Opt)</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {feeders.map((f: any) => {
                const isHighRisk = f.loading_pct > 85;
                return (
                  <tr key={f.id}>
                    <td>
                      <strong>{f.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{f.substation}</div>
                    </td>
                    <td>{f.load_mw} MW / {f.capacity_mw} MW</td>
                    <td>
                      <strong style={{ color: isHighRisk ? 'var(--red-risk)' : 'var(--text-primary)' }}>
                        {f.loading_pct}%
                      </strong>
                    </td>
                    <td>
                      <code style={{ color: f.voltage_pu < 0.98 ? 'var(--amber-flow)' : 'var(--green-renew)' }}>
                        {f.voltage_pu} p.u.
                      </code>
                    </td>
                    <td>
                      <strong style={{ color: '#10b981' }}>{f.bess_soc_pct || 75.0}%</strong>
                    </td>
                    <td>{f.solar_pv_connected_mw} MW</td>
                    <td>
                      <span style={{ color: '#f87171' }}>{f.loss_baseline_pct}%</span> ➔ <strong style={{ color: '#34d399' }}>{f.loss_optimized_pct}%</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--cyan-primary)', fontWeight: 500 }}>
                        {f.recommended_intervention}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
