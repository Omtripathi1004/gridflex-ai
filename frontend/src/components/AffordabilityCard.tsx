import React, { useState } from 'react';
import { 
  Coins, 
  TrendingUp, 
  HelpCircle, 
  Settings2, 
  Users, 
  Zap, 
  CheckCircle2, 
  RotateCcw,
  Battery,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  LocationHierarchyNode, 
  OperatingMode, 
  AffordabilityAssumptions, 
  DEFAULT_AFFORDABILITY_ASSUMPTIONS, 
  computeAffordabilityMetrics,
  BatteryDeploymentMode,
  BATTERY_DEPLOYMENT_MODES
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
  const [deploymentMode, setDeploymentMode] = useState<BatteryDeploymentMode>('community_bess');

  const metrics = computeAffordabilityMetrics(selectedLocation, operatingMode, assumptions, deploymentMode);

  const handleReset = () => {
    setAssumptions(DEFAULT_AFFORDABILITY_ASSUMPTIONS);
  };

  return (
    <div style={{
      background: 'rgba(13, 33, 53, 0.75)',
      border: '1px solid rgba(148, 163, 184, 0.15)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(16px)',
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

      {/* 2. Visual Operational Hierarchy Path */}
      <div style={{
        background: 'rgba(2, 6, 23, 0.45)',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        borderRadius: '10px',
        padding: '10px 14px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        fontSize: '11px',
        color: '#94a3b8'
      }}>
        <span style={{ fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Layers size={13} /> Hierarchy:
        </span>
        <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{selectedLocation.district_aggregate.district_name}</span>
        <span>➔</span>
        <span style={{ color: '#38bdf8' }}>{selectedLocation.district_aggregate.discom_name.split(' ')[0]}</span>
        <span>➔</span>
        <span style={{ color: '#e2e8f0' }}>{selectedLocation.substation.split(' ')[0]}</span>
        <span>➔</span>
        <span style={{ color: '#22d3ee', fontWeight: 700 }}>{selectedLocation.feeder_id}</span>
        <span>➔</span>
        <span style={{ color: '#f8fafc' }}>{selectedLocation.locality.split('/')[0]}</span>
        <span>➔</span>
        <span style={{ color: '#34d399', fontWeight: 700 }}>{metrics.totalConnections.toLocaleString()} Homes & Prosumers</span>
      </div>

      {/* 3. Three Battery Deployment Modes Selector */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Battery size={14} color="#10b981" />
          Storage Architecture Mode:
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px'
        }}>
          {BATTERY_DEPLOYMENT_MODES.map(mode => {
            const isSelected = deploymentMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setDeploymentMode(mode.id)}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isSelected ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.12)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 6, 23, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#34d399' : '#f8fafc' }}>
                    {mode.name}
                  </span>
                  <span style={{ fontSize: '10px', background: isSelected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)', color: isSelected ? '#34d399' : '#94a3b8', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    {mode.capacityDesc}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
                  {mode.tagline}
                </div>
              </button>
            );
          })}
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

      {/* Household Monthly Bill Impact Box */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(2, 6, 23, 0.6))',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
            Household Economics (Typical 3-Room Peri-Urban Consumer)
          </div>
          <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
            Monthly electricity bill: <span style={{ textDecoration: 'line-through', color: '#f87171' }}>₹{metrics.monthlyBillBeforeInr}</span> ➔ <strong style={{ color: '#34d399', fontSize: '16px' }}>₹{metrics.monthlyBillAfterInr}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Monthly Savings</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#34d399' }}>
              ₹{metrics.monthlySavingsInr} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>({metrics.monthlySavingsPct}%)</span>
            </div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Effective Payback</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>
              {deploymentMode === 'no_battery' ? 'N/A' : `${metrics.simplePaybackYears} Yrs`}
            </div>
          </div>
        </div>
      </div>

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
            {deploymentMode === 'no_battery' ? 'N/A' : `${metrics.simplePaybackYears}`} <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: 500 }}>{deploymentMode === 'no_battery' ? '' : 'Years'}</span>
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
