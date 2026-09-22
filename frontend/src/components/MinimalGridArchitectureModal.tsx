import React from 'react';
import { 
  X, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Radio, 
  ArrowRight, 
  Server, 
  Database, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MinimalGridArchitectureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'linear-gradient(135deg, #070b14, #0f172a)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(0, 240, 255, 0.15)',
                color: '#00f0ff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                CHALLENGE 03 CORE PRINCIPLE
              </span>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#f8fafc' }}>
                Minimal Grid-Level Intervention Architecture
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Most reliability decisions happen autonomously at neighbourhood level; the upstream grid provides only residual backup.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* The 5-Stage Local Flow Diagram */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginBottom: '28px'
        }}>
          {/* Step 1 */}
          <div style={{
            background: 'rgba(2, 6, 23, 0.7)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            position: 'relative'
          }}>
            <div style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 700, marginBottom: '6px' }}>
              STAGE 1
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc', marginBottom: '6px' }}>
              Local Telemetry
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
              Smart meters, solar inverter API feeds, community BESS battery BMS, weather sensors.
            </div>
          </div>

          {/* Step 2 */}
          <div style={{
            background: 'rgba(2, 6, 23, 0.7)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>
              STAGE 2
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc', marginBottom: '6px' }}>
              Local Forecast
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
              LightGBM & XGBoost edge models compute multi-horizon solar/wind generation and load curves.
            </div>
          </div>

          {/* Step 3 */}
          <div style={{
            background: 'rgba(2, 6, 23, 0.7)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 700, marginBottom: '6px' }}>
              STAGE 3
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc', marginBottom: '6px' }}>
              Local Optimizer
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
              MILP solver matches surplus/deficits within feeder boundaries and schedules DR shifts.
            </div>
          </div>

          {/* Step 4 */}
          <div style={{
            background: 'rgba(2, 6, 23, 0.7)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, marginBottom: '6px' }}>
              STAGE 4
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc', marginBottom: '6px' }}>
              Local Action
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
              BESS battery charging/discharging and EV/chiller throttle commands dispatched locally.
            </div>
          </div>

          {/* Step 5 */}
          <div style={{
            background: 'rgba(2, 6, 23, 0.7)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, marginBottom: '6px' }}>
              STAGE 5
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc', marginBottom: '6px' }}>
              Residual Grid Draw
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
              Only unmitigated residual energy deficit is drawn from the 66/33kV central transmission grid.
            </div>
          </div>
        </div>

        {/* Boundary Comparison: Decided Locally vs Sent to DISCOM */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Decided Locally */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '14px',
            padding: '18px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#34d399', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> Decided Locally at Feeder / Neighbourhood Level
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1', lineHeight: 1.7 }}>
              <li><strong>Solar Surplus Absorption</strong>: Directly steers surplus rooftop export into community BESS.</li>
              <li><strong>Pre-Cooling & Chiller Coasting</strong>: Triggers thermal mass cooling at 14:00 solar peak.</li>
              <li><strong>Municipal Water Reservoir Buffering</strong>: Shifts bulk lift pumping into sunny noon hours.</li>
              <li><strong>EV Fleet Charger Throttling</strong>: Modulates depot charging from 150 kW to 30 kW trickle.</li>
              <li><strong>Critical Lifeline Immunity</strong>: Hard-locks 100% continuous power to clinics & water boosters.</li>
            </ul>
          </div>

          {/* Sent to DISCOM Central SLDC */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '14px',
            padding: '18px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#38bdf8', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={16} /> Telemetered to Central DISCOM SLDC (Minimal Signal)
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1', lineHeight: 1.7 }}>
              <li><strong>Net Feeder Draw Forecast</strong>: 24h profile of expected net residual MW draw.</li>
              <li><strong>CERC DSM Schedule Revision</strong>: Notifies SLDC if unavoidable deviation exceeds ±12%.</li>
              <li><strong>Aggregated Flexibility Headroom</strong>: Reports available reserve MW for emergency grid support.</li>
              <li><strong>Feeder Thermal Loading Alert</strong>: Early-warning if transformer MVA capacity nears 85%.</li>
              <li><strong>Zero PII Exposure</strong>: Individual consumer IDs and meter data stay 100% private locally.</li>
            </ul>
          </div>
        </div>

        {/* Engineering Disclaimer */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '10px',
          padding: '14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          fontSize: '12px',
          color: '#e2e8f0'
        }}>
          <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#f59e0b' }}>Operational Safety & Demonstration Disclosure:</strong> GridFlex AI provides high-fidelity decision-support, predictive optimization, and dispatch simulations. In accordance with CEA Technical Standards and utility grid codes, physical breaker opening/closing requires authorized DISCOM substation operator verification (Human-in-the-Loop).
          </div>
        </div>
      </div>
    </div>
  );
};
