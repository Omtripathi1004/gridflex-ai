import React, { useState } from 'react';
import { 
  Coins, 
  TrendingUp, 
  HelpCircle, 
  Settings2, 
  Users, 
  Zap, 
  CheckCircle2, 
  RotateCcw 
} from 'lucide-react';
import { 
  LocationHierarchyNode, 
  OperatingMode, 
  AffordabilityAssumptions, 
  DEFAULT_AFFORDABILITY_ASSUMPTIONS, 
  computeAffordabilityMetrics 
} from '../lib/neighbourhoodData';

interface Props {
  selectedLocation: LocationHierarchyNode;
  operatingMode: OperatingMode;
}

export const AffordabilityCard: React.FC<Props> = ({
  selectedLocation,
  operatingMode
}) => {
  const [assumptions, setAssumptions] = useState<AffordabilityAssumptions>(DEFAULT_AFFORDABILITY_ASSUMPTIONS);
  const [showEditor, setShowEditor] = useState(false);

  const metrics = computeAffordabilityMetrics(selectedLocation, operatingMode, assumptions);

  const handleReset = () => {
    setAssumptions(DEFAULT_AFFORDABILITY_ASSUMPTIONS);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '16px',
      padding: '22px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      marginBottom: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            padding: '8px',
            borderRadius: '10px'
          }}>
            <Coins size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Affordability & Community Economics
              <span style={{
                fontSize: '11px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 600
              }}>
                Peri-Urban & Low-Income Focus
              </span>
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Shared community storage & software-driven flexibility economics with editable capital & tariff assumptions.
            </p>
          </div>
        </div>

        {/* Toggle Editor Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setShowEditor(!showEditor)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: showEditor ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: showEditor ? '#34d399' : '#cbd5e1',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Settings2 size={14} />
            {showEditor ? 'Hide Assumptions' : 'Edit Assumptions'}
          </button>
          {showEditor && (
            <button
              onClick={handleReset}
              title="Reset to defaults"
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#94a3b8',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Editable Assumptions Drawer */}
      {showEditor && (
        <div style={{
          background: 'rgba(2, 6, 23, 0.7)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
              BESS Unit CAPEX (₹/kWh)
            </label>
            <input
              type="number"
              value={assumptions.bessCapexInrPerKwh}
              onChange={(e) => setAssumptions({ ...assumptions, bessCapexInrPerKwh: parseFloat(e.target.value) || 0 })}
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
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
              Peak Grid Tariff (₹/kWh)
            </label>
            <input
              type="number"
              step="0.5"
              value={assumptions.peakTariffInrPerKwh}
              onChange={(e) => setAssumptions({ ...assumptions, peakTariffInrPerKwh: parseFloat(e.target.value) || 0 })}
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
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
              State Subsidy Grant (%)
            </label>
            <input
              type="number"
              min="0"
              max="90"
              value={assumptions.discomSubsidyGrantPct}
              onChange={(e) => setAssumptions({ ...assumptions, discomSubsidyGrantPct: parseFloat(e.target.value) || 0 })}
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
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
              IoT Relay / Household (₹)
            </label>
            <input
              type="number"
              value={assumptions.smartControllerInrPerHousehold}
              onChange={(e) => setAssumptions({ ...assumptions, smartControllerInrPerHousehold: parseFloat(e.target.value) || 0 })}
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

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Simple Payback */}
        <div style={{
          background: 'rgba(2, 6, 23, 0.5)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '6px' }}>
            Simple Payback Period
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#10b981' }}>
            {metrics.simplePaybackYears} <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: 500 }}>Years</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Annual ROI: <strong style={{ color: '#34d399' }}>{metrics.returnOnInvestmentPct}%</strong>
          </div>
        </div>

        {/* Cost per Connection */}
        <div style={{
          background: 'rgba(2, 6, 23, 0.5)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '6px' }}>
            Cost per Household
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8' }}>
            ₹{metrics.costPerConnectionInr.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Serving {metrics.totalConnections.toLocaleString()} participating connections
          </div>
        </div>

        {/* Cost per Served kW */}
        <div style={{
          background: 'rgba(2, 6, 23, 0.5)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '6px' }}>
            Cost per Flexible kW
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#a855f7' }}>
            ₹{metrics.costPerServedKwInr.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            91% lower than traditional diesel generator backup
          </div>
        </div>

        {/* Annual Community Benefit */}
        <div style={{
          background: 'rgba(2, 6, 23, 0.5)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '6px' }}>
            Total Annual Savings
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f59e0b' }}>
            ₹{metrics.totalAnnualBenefitsLakhs} <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>Lakhs/yr</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Peak tariff arbitrage + CERC DSM penalties avoided
          </div>
        </div>
      </div>

      {/* Transparent Capital Breakdown Table */}
      <div style={{
        background: 'rgba(2, 6, 23, 0.4)',
        borderRadius: '10px',
        padding: '14px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '10px' }}>
          Transparent Financial Assumptions Breakdown:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '12px' }}>
          <div style={{ color: '#94a3b8' }}>
            Gross System CAPEX: <strong style={{ color: '#f8fafc' }}>₹{metrics.grossCapexLakhs} Lakhs</strong>
          </div>
          <div style={{ color: '#94a3b8' }}>
            State Flexibility Grant ({assumptions.discomSubsidyGrantPct}%): <strong style={{ color: '#10b981' }}>- ₹{metrics.subsidyGrantLakhs} Lakhs</strong>
          </div>
          <div style={{ color: '#94a3b8' }}>
            Net Community Outlay: <strong style={{ color: '#00f0ff' }}>₹{metrics.netCommunityCapexLakhs} Lakhs</strong>
          </div>
          <div style={{ color: '#94a3b8' }}>
            Annual O&M Provision (2.5%): <strong style={{ color: '#f87171' }}>₹{metrics.annualOmLakhs} Lakhs/yr</strong>
          </div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HelpCircle size={13} />
          *All figures are illustrative demo calculations based on standard CEA/CERC benchmark costs and assumed 300 cycles/yr at 80% DOD.
        </div>
      </div>
    </div>
  );
};
