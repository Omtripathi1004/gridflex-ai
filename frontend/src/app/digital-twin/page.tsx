'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { runDigitalTwinSimulation } from '../../lib/api';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export default function DigitalTwinPage() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();

  // Initialize slider states from URL parameters if present
  const initSolar = searchParams.get('solar') ? parseFloat(searchParams.get('solar')!) / 100 : 1.0;
  const initWind = searchParams.get('wind') ? parseFloat(searchParams.get('wind')!) / 100 : 1.0;
  const initDemand = searchParams.get('demand') ? parseFloat(searchParams.get('demand')!) / 100 : 1.0;
  const initBess = searchParams.get('bess') ? parseFloat(searchParams.get('bess')!) : 100.0;
  const initFlex = searchParams.get('flex') ? parseFloat(searchParams.get('flex')!) : 100.0;
  const initWx = searchParams.get('wx') || 'NORMAL';

  const [solarMult, setSolarMult] = useState<number>(initSolar);
  const [windMult, setWindMult] = useState<number>(initWind);
  const [demandMult, setDemandMult] = useState<number>(initDemand);
  const [batteryPct, setBatteryPct] = useState<number>(initBess);
  const [flexPct, setFlexPct] = useState<number>(initFlex);
  const [weather, setWeather] = useState<string>(initWx);
  const [activePreset, setActivePreset] = useState<
    | 'solar_minus_30'
    | 'solar_minus_40'
    | 'wind_minus_50'
    | 'demand_plus_20'
    | 'evening_peak'
    | 'bess_zero'
    | 'feeder_outage'
    | 'uncertainty_spike'
    | 'combined_shortfall'
    | null
  >('evening_peak');

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

  const applyPreset = (preset: 
    | 'solar_minus_30'
    | 'solar_minus_40'
    | 'wind_minus_50'
    | 'demand_plus_20'
    | 'evening_peak'
    | 'bess_zero'
    | 'feeder_outage'
    | 'uncertainty_spike'
    | 'combined_shortfall'
  ) => {
    setActivePreset(preset);
    if (preset === 'solar_minus_30') {
      setSolarMult(0.70);
      setWindMult(1.0);
      setDemandMult(1.0);
      setBatteryPct(100);
      setFlexPct(100);
      setWeather('NORMAL');
    } else if (preset === 'solar_minus_40') {
      setSolarMult(0.60);
      setWindMult(0.95);
      setDemandMult(1.05);
      setBatteryPct(100);
      setFlexPct(100);
      setWeather('NORMAL');
    } else if (preset === 'wind_minus_50') {
      setSolarMult(1.0);
      setWindMult(0.50);
      setDemandMult(1.0);
      setBatteryPct(95);
      setFlexPct(90);
      setWeather('NORMAL');
    } else if (preset === 'demand_plus_20') {
      setSolarMult(1.0);
      setWindMult(1.0);
      setDemandMult(1.20);
      setBatteryPct(100);
      setFlexPct(95);
      setWeather('HEATWAVE');
    } else if (preset === 'evening_peak') {
      setSolarMult(0.65);
      setWindMult(0.85);
      setDemandMult(1.25);
      setBatteryPct(90);
      setFlexPct(85);
      setWeather('NORMAL');
    } else if (preset === 'bess_zero') {
      setSolarMult(0.80);
      setWindMult(0.80);
      setDemandMult(1.15);
      setBatteryPct(0);
      setFlexPct(100);
      setWeather('NORMAL');
    } else if (preset === 'feeder_outage') {
      setSolarMult(0.55);
      setWindMult(0.70);
      setDemandMult(1.30);
      setBatteryPct(85);
      setFlexPct(80);
      setWeather('STORM_FRONT');
    } else if (preset === 'uncertainty_spike') {
      setSolarMult(0.75);
      setWindMult(0.65);
      setDemandMult(1.15);
      setBatteryPct(90);
      setFlexPct(85);
      setWeather('NORMAL');
    } else if (preset === 'combined_shortfall') {
      setSolarMult(0.40);
      setWindMult(0.35);
      setDemandMult(1.25);
      setBatteryPct(60);
      setFlexPct(70);
      setWeather('STORM_FRONT');
    }
  };

  const resetSliders = () => {
    setActivePreset(null);
    setSolarMult(1.0);
    setWindMult(1.0);
    setDemandMult(1.0);
    setBatteryPct(100);
    setFlexPct(100);
    setWeather('NORMAL');
  };

  // Unified 24-hour simulation calculation (guarantees identical results online, offline, mobile, laptop)
  const clientSim = React.useMemo(() => {
    let weatherDemandFactor = 1.0;
    let weatherSolarFactor = 1.0;
    let weatherWindFactor = 1.0;

    if (weather === 'HEATWAVE') {
      weatherDemandFactor = 1.25;
      weatherSolarFactor = 1.05;
    } else if (weather === 'STORM_FRONT') {
      weatherDemandFactor = 1.05;
      weatherSolarFactor = 0.25;
      weatherWindFactor = 1.35;
    }

    let totalGen = 0.0;
    let totalDem = 0.0;
    let maxDeficit = 0.0;
    let shortageHoursUnmit = 0;
    let shortageHoursMit = 0;

    const curveData = Array.from({ length: 24 }, (_, h) => {
      const baseSolar = (h >= 6 && h <= 18) ? Math.max(0, Math.sin(Math.PI * (h - 6) / 12)) * 48.0 : 0.0;
      const baseWind = 18.0 + 4.5 * Math.cos(h / 3.2);

      const simSolar = baseSolar * solarMult * weatherSolarFactor;
      const simWind = baseWind * windMult * weatherWindFactor;
      const simGen = simSolar + simWind;

      const baseDemand = (46.0 + 16.0 * Math.exp(-Math.pow(h - 10, 2) / 6) + 26.0 * Math.exp(-Math.pow(h - 20, 2) / 8));
      const simDemand = baseDemand * demandMult * weatherDemandFactor;

      const netBalance = simGen - simDemand;
      totalGen += simGen;
      totalDem += simDemand;

      const bessDischarge = (h >= 17 && h <= 22) ? Math.min(Math.max(0, -netBalance), 9.5 * (batteryPct / 100)) : 0;
      const loadShift = (h >= 18 && h <= 21) ? 4.5 * (flexPct / 100) : ((h >= 11 && h <= 14) ? -3.0 * (flexPct / 100) : 0);
      const mitigatedBalance = simGen + bessDischarge - (simDemand - loadShift);

      if (netBalance < 0) {
        shortageHoursUnmit += 1;
        if (Math.abs(netBalance) > maxDeficit) {
          maxDeficit = Math.abs(netBalance);
        }
      }
      if (mitigatedBalance < 0) {
        shortageHoursMit += 1;
      }

      const sigma = 2.5 + Math.abs(simSolar * 0.12);
      return {
        hour: `${h.toString().padStart(2, '0')}:00`,
        unmitigated_balance: Number(netBalance.toFixed(2)),
        mitigated_balance: Number(mitigatedBalance.toFixed(2)),
        p10_lower: Number((mitigatedBalance - 1.645 * sigma).toFixed(2)),
        p90_upper: Number((mitigatedBalance + 1.645 * sigma).toFixed(2))
      };
    });

    const hoursEliminated = Math.max(0, shortageHoursUnmit - shortageHoursMit);

    const renewableAvail = Math.min(100.0, (totalGen / Math.max(1.0, totalDem)) * 100.0);
    const demandStress = Math.max(0.0, 100.0 - (maxDeficit / 30.0 * 100.0));
    const storageReadiness = batteryPct;
    const flexReadiness = flexPct;

    const compositeResilience = Number((
      (renewableAvail * 0.25) +
      (demandStress * 0.25) +
      (storageReadiness * 0.25) +
      (flexReadiness * 0.25)
    ).toFixed(1));

    let riskLevel = 'Stable operating envelope';
    let riskLevelHi = 'स्थिर परिचालन';
    let recommendedAction = 'System balanced. Optimize storage arbitrage and maximize local P2P prosumer trading.';
    let recommendedActionHi = 'प्रणाली संतुलित है। स्टोरेज आर्बिट्राज को अनुकूलित करें और स्थानीय P2P व्यापार को अधिकतम करें।';

    if (maxDeficit > 22.0 || compositeResilience < 45.0) {
      riskLevel = 'Critical Grid Stress';
      riskLevelHi = 'गंभीर ग्रिड तनाव';
      recommendedAction = 'Trigger Stage 3 Demand Response, dispatch 100% BESS emergency reserves, and prepare spinning thermal backup.';
      recommendedActionHi = 'स्टेज 3 मांग प्रतिक्रिया शुरू करें, 100% BESS आपातकालीन भंडार भेजें, और बैकअप तैयार रखें।';
    } else if (maxDeficit > 10.0 || compositeResilience < 70.0) {
      riskLevel = 'Elevated deficit risk';
      riskLevelHi = 'उच्च घाटा जोखिम';
      recommendedAction = `Schedule evening BESS discharge of ${(batteryPct * 0.1).toFixed(1)} MW and shift ${(flexPct * 0.045).toFixed(1)} MW of commercial cooling load to the midday solar peak.`;
      recommendedActionHi = `शाम को ${(batteryPct * 0.1).toFixed(1)} MW BESS डिस्चार्ज शेड्यूल करें और ${(flexPct * 0.045).toFixed(1)} MW भार को दोपहर में स्थानांतरित करें।`;
    }

    return {
      curveData,
      summary: {
        total_daily_generation_mwh: Number(totalGen.toFixed(1)),
        total_daily_demand_mwh: Number(totalDem.toFixed(1)),
        net_daily_balance_mwh: Number((totalGen - totalDem).toFixed(1)),
        peak_deficit_mw: Number(maxDeficit.toFixed(2)),
        shortage_hours_unmitigated: shortageHoursUnmit,
        shortage_hours_mitigated: shortageHoursMit,
        shortage_hours_eliminated: hoursEliminated,
        risk_classification: riskLevel,
        risk_classification_hi: riskLevelHi,
        composite_resilience_score: compositeResilience,
        recommended_operational_action: recommendedAction,
        recommended_operational_action_hi: recommendedActionHi
      }
    };
  }, [solarMult, windMult, demandMult, batteryPct, flexPct, weather]);

  // Merge simResult when backend responds, otherwise use client simulation
  const summary = simResult?.summary ? {
    ...clientSim.summary,
    ...simResult.summary,
    shortage_hours_eliminated: (
      typeof simResult.summary.shortage_hours_eliminated === 'number' && !isNaN(simResult.summary.shortage_hours_eliminated)
        ? simResult.summary.shortage_hours_eliminated
        : (typeof simResult.summary.shortage_hours_unmitigated === 'number' && typeof simResult.summary.shortage_hours_mitigated === 'number'
            ? Math.max(0, simResult.summary.shortage_hours_unmitigated - simResult.summary.shortage_hours_mitigated)
            : clientSim.summary.shortage_hours_eliminated)
    ),
    risk_classification: language === 'hi'
      ? (clientSim.summary.risk_classification_hi || simResult.summary.risk_classification)
      : simResult.summary.risk_classification,
    recommended_operational_action: language === 'hi'
      ? (clientSim.summary.recommended_operational_action_hi || simResult.summary.recommended_operational_action)
      : simResult.summary.recommended_operational_action
  } : {
    ...clientSim.summary,
    risk_classification: language === 'hi' ? clientSim.summary.risk_classification_hi : clientSim.summary.risk_classification,
    recommended_operational_action: language === 'hi' ? clientSim.summary.recommended_operational_action_hi : clientSim.summary.recommended_operational_action
  };

  const rawEliminated = Number(summary.shortage_hours_eliminated);
  const shortageHoursEliminated = isNaN(rawEliminated) ? clientSim.summary.shortage_hours_eliminated : rawEliminated;

  // 24-hour simulation curve from simulation
  const curve = clientSim.curveData;

  return (
    <div style={{
      maxWidth: 1100,
      margin: '0 auto',
      padding: '24px 16px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      color: 'var(--text-primary)'
    }}>
      {/* 1. Header */}
      <div>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '0 0 6px 0',
          letterSpacing: '-0.01em'
        }}>
          {language === 'hi' ? 'डिजिटल ट्विन: व्हाट-इफ ग्रिड सिम्युलेटर' : 'Digital Twin: What-If Grid Simulator'}
        </h1>
        <p style={{
          fontSize: '0.92rem',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.5
        }}>
          {language === 'hi'
            ? '24 घंटों में ग्रिड कैसे व्यवहार करता है, यह देखने के लिए स्लाइडर्स बदलें।'
            : 'Change the sliders to see how the grid behaves over 24 hours.'}
        </p>
      </div>

      {/* 2. GridFlex Stress Test Pipeline Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 33, 53, 0.9), rgba(10, 27, 45, 0.8))',
        border: '1px solid rgba(34, 211, 238, 0.25)',
        borderRadius: 12,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--cyan-primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              ⚡ GridFlex Stress Test Pipeline
            </span>
            <span style={{ fontSize: '0.72rem', background: 'rgba(34, 211, 238, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              CLOSED-LOOP CONTINGENCY VERIFICATION
            </span>
          </div>
          <button
            type="button"
            onClick={resetSliders}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {language === 'hi' ? 'रीसेट' : 'Reset Sliders'}
          </button>
        </div>

        {/* Dynamic Pipeline Progression Steps */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          fontSize: '0.78rem'
        }}>
          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
            1. Disturbance: {activePreset ? activePreset.replace(/_/g, ' ').toUpperCase() : 'MANUAL SLIDERS'}
          </span>
          <span style={{ color: '#64748b' }}>➔</span>
          <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
            2. Energy Gap: {summary.peak_deficit_mw} MW
          </span>
          <span style={{ color: '#64748b' }}>➔</span>
          <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
            3. MILP Optimization
          </span>
          <span style={{ color: '#64748b' }}>➔</span>
          <span style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', border: '1px solid rgba(34, 211, 238, 0.3)', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
            4. BESS & DR Dispatch
          </span>
          <span style={{ color: '#64748b' }}>➔</span>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
            5. Deficit Neutralized: {shortageHoursEliminated}h saved
          </span>
          <span style={{ color: '#64748b' }}>➔</span>
          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
            6. Resilience: {summary.composite_resilience_score}/100
          </span>
        </div>
      </div>

      {/* 2b. 9 Stress Test Contingency Scenarios */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Select Stress Test Scenario (9 Controlled Contingencies):
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: 6
        }}>
          {[
            { id: 'solar_minus_30' as const, label: 'Solar -30%', badge: 'RE DIP' },
            { id: 'solar_minus_40' as const, label: 'Solar -40%', badge: 'STORM' },
            { id: 'wind_minus_50' as const, label: 'Wind -50%', badge: 'WIND LULL' },
            { id: 'demand_plus_20' as const, label: 'Demand +20%', badge: 'HEATWAVE' },
            { id: 'evening_peak' as const, label: 'Evening Peak', badge: 'DUCK CURVE' },
            { id: 'bess_zero' as const, label: 'BESS 0%', badge: 'NO BATTERY' },
            { id: 'feeder_outage' as const, label: 'Feeder Outage', badge: 'F-02 TRIP' },
            { id: 'uncertainty_spike' as const, label: 'Uncertainty', badge: '35% RESERVE' },
            { id: 'combined_shortfall' as const, label: 'Combined', badge: 'CRITICAL' }
          ].map(scen => {
            const isSelected = activePreset === scen.id;
            return (
              <button
                key={scen.id}
                type="button"
                onClick={() => applyPreset(scen.id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: isSelected ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(34, 211, 238, 0.15)' : 'var(--bg-secondary)',
                  color: isSelected ? 'var(--cyan-primary)' : 'var(--text-primary)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '0.65rem', color: isSelected ? '#38bdf8' : '#64748b', fontWeight: 700 }}>
                  {scen.badge}
                </span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {scen.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Area: twin-layout-wrapper (2-col grid on laptop, custom order on mobile) */}
      <div className="twin-layout-wrapper">
        {/* Inputs Card */}
        <div className="twin-order-inputs" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}>
          <h2 style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            margin: 0,
            paddingBottom: 8,
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            {language === 'hi' ? 'इनपुट्स' : 'Inputs'}
          </h2>

          {/* Slider 1: Solar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'सौर उत्पादन गुणक' : 'Solar generation multiplier'}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {(solarMult * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={solarMult}
              onChange={(e) => {
                setSolarMult(parseFloat(e.target.value));
                setActivePreset(null);
              }}
              aria-label="Solar generation multiplier"
              style={{ width: '100%', accentColor: 'var(--cyan-primary)', cursor: 'pointer', height: 28 }}
            />
          </div>

          {/* Slider 2: Wind */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'पवन उत्पादन गुणक' : 'Wind generation multiplier'}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {(windMult * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={windMult}
              onChange={(e) => {
                setWindMult(parseFloat(e.target.value));
                setActivePreset(null);
              }}
              aria-label="Wind generation multiplier"
              style={{ width: '100%', accentColor: 'var(--cyan-primary)', cursor: 'pointer', height: 28 }}
            />
          </div>

          {/* Slider 3: Demand Load */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'पीक मांग भार' : 'Peak demand load'}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {(demandMult * 64.8).toFixed(1)} MW ({(demandMult * 100).toFixed(0)}%)
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={demandMult}
              onChange={(e) => {
                setDemandMult(parseFloat(e.target.value));
                setActivePreset(null);
              }}
              aria-label="Peak demand load"
              style={{ width: '100%', accentColor: 'var(--cyan-primary)', cursor: 'pointer', height: 28 }}
            />
          </div>

          {/* Slider 4: Battery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'बैटरी उपलब्धता (40 MWh)' : 'Battery availability (40 MWh)'}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {batteryPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={batteryPct}
              onChange={(e) => {
                setBatteryPct(parseFloat(e.target.value));
                setActivePreset(null);
              }}
              aria-label="Battery availability"
              style={{ width: '100%', accentColor: 'var(--cyan-primary)', cursor: 'pointer', height: 28 }}
            />
          </div>

          {/* Slider 5: Flexible Demand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'लचीली मांग भागीदारी' : 'Flexible load participation'}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {flexPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={flexPct}
              onChange={(e) => {
                setFlexPct(parseFloat(e.target.value));
                setActivePreset(null);
              }}
              aria-label="Flexible load participation"
              style={{ width: '100%', accentColor: 'var(--cyan-primary)', cursor: 'pointer', height: 28 }}
            />
          </div>

          {/* Weather Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              {language === 'hi' ? 'मौसम मोड' : 'Weather mode'}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8
            }}>
              {[
                { key: 'NORMAL', label: language === 'hi' ? 'सामान्य' : 'Normal' },
                { key: 'HEATWAVE', label: language === 'hi' ? 'हीटवेव' : 'Heatwave' },
                { key: 'STORM_FRONT', label: language === 'hi' ? 'मानसून तूफान' : 'Monsoon Storm' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setWeather(opt.key);
                    setActivePreset(null);
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: `1px solid ${weather === opt.key ? 'var(--cyan-primary)' : 'var(--border-subtle)'}`,
                    background: weather === opt.key ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                    color: weather === opt.key ? 'var(--cyan-primary)' : 'var(--text-secondary)',
                    fontWeight: weather === opt.key ? 600 : 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="twin-order-results" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          {/* Results Heading with Risk Badge */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            paddingBottom: 8,
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
              {language === 'hi' ? 'परिणाम' : 'Results'}
            </h2>
            <span style={{
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: '0.76rem',
              fontWeight: 600,
              background: summary.peak_deficit_mw > 20 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: summary.peak_deficit_mw > 20 ? '#ef4444' : '#10b981',
              border: `1px solid ${summary.peak_deficit_mw > 20 ? '#ef4444' : '#10b981'}`
            }}>
              {summary.risk_classification}
            </span>
          </div>

          {/* 2x2 Metric Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12
          }}>
            {/* Card 1: Peak Deficit */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              padding: '12px 14px'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                {language === 'hi' ? 'पीक घाटा' : 'Peak deficit'}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                color: summary.peak_deficit_mw > 0 ? '#ef4444' : '#10b981'
              }}>
                {summary.peak_deficit_mw > 0 ? `-${summary.peak_deficit_mw}` : '0.0'}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>MW</span>
              </div>
            </div>

            {/* Card 2: Net Energy Balance */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              padding: '12px 14px'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                {language === 'hi' ? 'शुद्ध ऊर्जा संतुलन' : 'Net energy balance'}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                color: summary.net_daily_balance_mwh < 0 ? '#f59e0b' : '#10b981'
              }}>
                {summary.net_daily_balance_mwh > 0 ? `+${summary.net_daily_balance_mwh}` : summary.net_daily_balance_mwh}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>MWh</span>
              </div>
            </div>

            {/* Card 3: Resilience Score */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              padding: '12px 14px'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                {language === 'hi' ? 'लचीलापन स्कोर' : 'Resilience score'}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                color: summary.composite_resilience_score >= 80 ? '#10b981' : '#f59e0b'
              }}>
                {summary.composite_resilience_score}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ 100</span>
              </div>
            </div>

            {/* Card 4: Shortage Hours Eliminated */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              padding: '12px 14px'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                {language === 'hi' ? 'कमी के घंटे समाप्त' : 'Shortage hours eliminated'}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                color: '#10b981'
              }}>
                {isNaN(Number(shortageHoursEliminated)) ? 0 : shortageHoursEliminated}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  {language === 'hi' ? 'घंटे' : 'hours'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Action Box */}
        <div className="twin-order-recommendation" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 16
        }}>
          <h3 style={{
            fontSize: '0.88rem',
            fontWeight: 600,
            margin: '0 0 6px 0',
            color: 'var(--cyan-primary)'
          }}>
            {language === 'hi' ? 'अनुशंसित कार्रवाई' : 'Recommended action'}
          </h3>
          <p style={{
            fontSize: '0.88rem',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {summary.recommended_operational_action}
          </p>
        </div>

        {/* 4. Chart: Full width below */}
        <div className="twin-order-chart" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 20
        }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              margin: '0 0 4px 0'
            }}>
              {language === 'hi' ? '24 घंटे का ऊर्जा संतुलन' : '24-hour energy balance'}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', margin: 0 }}>
              {language === 'hi'
                ? 'अशमित घाटे (लाल रेखा) बनाम ग्रिडफ्लेक्स अनुकूलन (हरी रेखा) का तुलनात्मक विश्लेषण।'
                : 'Comparison of unmitigated shortfall (red dashed) against GridFlex optimization (green solid).'}
            </p>
          </div>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={curve} margin={{ top: 10, right: 15, left: -10, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
                  unit=" MW" 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: '6px', 
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: 8 }} />
                <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.2)" strokeWidth={1} />
                
                <Line 
                  type="monotone" 
                  dataKey="unmitigated_balance" 
                  name={language === 'hi' ? 'अशमित संतुलन (घाटा)' : 'Unmitigated shortfall'} 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                  dot={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="mitigated_balance" 
                  name={language === 'hi' ? 'ग्रिडफ्लेक्स के साथ' : 'GridFlex optimized'} 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="p90_upper" 
                  name={language === 'hi' ? 'P90 ऊपरी बैंड' : 'P90 optimistic band'} 
                  stroke="#06b6d4" 
                  strokeWidth={1} 
                  strokeDasharray="2 2" 
                  dot={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="p10_lower" 
                  name={language === 'hi' ? 'P10 निचला बैंड' : 'P10 stress band'} 
                  stroke="#f59e0b" 
                  strokeWidth={1} 
                  strokeDasharray="2 2" 
                  dot={false} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
