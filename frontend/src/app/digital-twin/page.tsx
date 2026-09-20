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
  const [activePreset, setActivePreset] = useState<'evening_gap' | 'solar_surge' | 'heatwave' | null>(null);

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

  const applyPreset = (preset: 'evening_gap' | 'solar_surge' | 'heatwave') => {
    setActivePreset(preset);
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
      setSolarMult(1.1);
      setWindMult(0.6);
      setDemandMult(1.35);
      setBatteryPct(70);
      setFlexPct(75);
      setWeather('HEATWAVE');
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

  // Base Summary calculations
  const baseDeficit = Number((18.2 * demandMult - (solarMult * 8.0 + windMult * 4.0)).toFixed(1));
  const peakDeficit = Math.max(0, baseDeficit);

  const summary = simResult?.summary || {
    total_daily_generation_mwh: Number((1240.5 * (solarMult * 0.7 + windMult * 0.3)).toFixed(1)),
    total_daily_demand_mwh: Number((1350.2 * demandMult).toFixed(1)),
    net_daily_balance_mwh: Number((1240.5 * (solarMult * 0.7 + windMult * 0.3) - 1350.2 * demandMult).toFixed(1)),
    peak_deficit_mw: peakDeficit,
    shortage_hours_unmitigated: 4,
    shortage_hours_mitigated: peakDeficit > 22 ? 1 : 0,
    risk_classification: peakDeficit > 20 ? (language === 'hi' ? 'उच्च घाटा जोखिम' : 'Elevated deficit risk') : (language === 'hi' ? 'स्थिर परिचालन' : 'Stable operating envelope'),
    composite_resilience_score: Math.max(45, Math.min(98, Math.round(80.7 - (demandMult - 1.0) * 20 + (solarMult - 1.0) * 10 - (100 - batteryPct) * 0.15))),
    recommended_operational_action: language === 'hi'
      ? `शाम के समय बैटरी से ${(batteryPct * 0.1).toFixed(1)} MW बिजली की आपूर्ति करें और सौर उत्पादन चरम पर होने के दौरान ${(flexPct * 0.045).toFixed(1)} MW व्यावसायिक एसी लोड को स्थानांतरित करें।`
      : `Schedule BESS evening discharge of ${(batteryPct * 0.1).toFixed(1)} MW and shift ${(flexPct * 0.045).toFixed(1)} MW of commercial cooling load to the midday solar peak.`
  };

  const shortageHoursEliminated = Math.max(0, summary.shortage_hours_unmitigated - summary.shortage_hours_mitigated);

  // 24-hour simulation curve
  const curve = Array.from({ length: 24 }, (_, h) => {
    const solar = (h >= 6 && h <= 18) ? Math.sin(Math.PI * (h - 6) / 12) * 52.0 * solarMult : 0;
    const wind = (16.0 + 5.0 * Math.cos(h / 3.8)) * windMult;
    const demand = (45.0 + 18.0 * Math.exp(-Math.pow(h - 10, 2) / 6) + 26.0 * Math.exp(-Math.pow(h - 20, 2) / 8)) * demandMult;
    const unmitigatedBalance = Number((solar + wind - demand).toFixed(2));
    
    const bessDischarge = (h >= 18 && h <= 21) ? Math.min(demand - solar - wind, 6.5 * (batteryPct / 100)) : 0;
    const loadShift = (h >= 18 && h <= 21) ? 3.5 * (flexPct / 100) : ((h >= 11 && h <= 14) ? -3.5 * (flexPct / 100) : 0);
    const mitigatedBalance = Number((solar + wind + bessDischarge - (demand - loadShift)).toFixed(2));

    const sigma = 2.5 + Math.abs(solar * 0.12);
    const p10 = Number((mitigatedBalance - 1.645 * sigma).toFixed(2));
    const p90 = Number((mitigatedBalance + 1.645 * sigma).toFixed(2));

    return {
      hour: `${h.toString().padStart(2, '0')}:00`,
      unmitigated_balance: unmitigatedBalance,
      mitigated_balance: mitigatedBalance,
      p10_lower: p10,
      p90_upper: p90
    };
  });

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

      {/* 2. Scenario Presets */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        {/* Segmented Control */}
        <div style={{
          display: 'inline-flex',
          borderRadius: 6,
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
          padding: 2,
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => applyPreset('evening_gap')}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: 'none',
              background: activePreset === 'evening_gap' ? 'var(--cyan-primary)' : 'transparent',
              color: activePreset === 'evening_gap' ? '#070b14' : 'var(--text-secondary)',
              fontWeight: activePreset === 'evening_gap' ? 600 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            {language === 'hi' ? 'शाम का नवीकरणीय अंतर' : 'Evening Renewable Gap'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('solar_surge')}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: 'none',
              background: activePreset === 'solar_surge' ? 'var(--cyan-primary)' : 'transparent',
              color: activePreset === 'solar_surge' ? '#070b14' : 'var(--text-secondary)',
              fontWeight: activePreset === 'solar_surge' ? 600 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            {language === 'hi' ? 'दोपहर का सौर उछाल' : 'Midday Solar Surge'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('heatwave')}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: 'none',
              background: activePreset === 'heatwave' ? 'var(--cyan-primary)' : 'transparent',
              color: activePreset === 'heatwave' ? '#070b14' : 'var(--text-secondary)',
              fontWeight: activePreset === 'heatwave' ? 600 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            {language === 'hi' ? 'हीटवेव और ग्रिड तनाव' : 'Heatwave and Grid Stress'}
          </button>
        </div>

        {/* Reset text button */}
        <button
          type="button"
          onClick={resetSliders}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            cursor: 'pointer',
            padding: '6px 10px',
            textDecoration: 'underline'
          }}
        >
          {language === 'hi' ? 'रीसेट' : 'Reset'}
        </button>
      </div>

      {/* 3. Main Area: Two columns on laptop (Inputs vs Results + Recommendation) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
        gap: 24,
        alignItems: 'start'
      }}>
        {/* Left Column: Inputs Card */}
        <div style={{
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
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.84rem' }}>
              <label htmlFor="solar-slider" style={{ color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'सौर उत्पादन गुणक' : 'Solar generation multiplier'}
              </label>
              <span style={{ fontWeight: 600, minWidth: 60, textAlign: 'right', fontFamily: 'monospace' }}>
                {(solarMult * 100).toFixed(0)}%
              </span>
            </div>
            <input
              id="solar-slider"
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={solarMult}
              onChange={(e) => {
                setSolarMult(parseFloat(e.target.value));
                setActivePreset(null);
              }}
              style={{ width: '100%', accentColor: 'var(--cyan-primary)', cursor: 'pointer', height: 28 }}
            />
          </div>

          {/* Slider 2: Wind */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.84rem' }}>
              <label htmlFor="wind-slider" style={{ color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'पवन उत्पादन गुणक' : 'Wind generation multiplier'}
              </label>
              <span style={{ fontWeight: 600, minWidth: 60, textAlign: 'right', fontFamily: 'monospace' }}>
                {(windMult * 100).toFixed(0)}%
              </span>
            </div>
            <input
              id="wind-slider"
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={windMult}
              onChange={(e) => {
                setWindMult(parseFloat(e.target.value));
                setActivePreset(null);
              }}
              style={{ width: '100%', accentColor: 'var(--cyan-primary)', cursor: 'pointer', height: 28 }}
            />
          </div>

          {/* Slider 3: Demand */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.84rem' }}>
              <label htmlFor="demand-slider" style={{ color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'पीक मांग लोड' : 'Peak demand load'}
              </label>
              <span style={{ fontWeight: 600, minWidth: 120, textAlign: 'right', fontFamily: 'monospace' }}>
                {(demandMult * 64.8).toFixed(1)} MW ({(demandMult * 100).toFixed(0)}%)
              </span>
            </div>
            <input
              id="demand-slider"
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={demandMult}
              onChange={(e) => {
                setDemandMult(parseFloat(e.target.value));
                setActivePreset(null);
              }}
              style={{ width: '100%', accentColor: 'var(--cyan-primary)', cursor: 'pointer', height: 28 }}
            />
          </div>

          {/* Slider 4: Battery */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.84rem' }}>
              <label htmlFor="battery-slider" style={{ color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'बैटरी उपलब्धता (40 MWh)' : 'Battery availability (40 MWh)'}
              </label>
              <span style={{ fontWeight: 600, minWidth: 60, textAlign: 'right', fontFamily: 'monospace' }}>
                {batteryPct}%
              </span>
            </div>
            <input
              id="battery-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={batteryPct}
              onChange={(e) => {
                setBatteryPct(parseFloat(e.target.value));
                setActivePreset(null);
              }}
              style={{ width: '100%', accentColor: 'var(--cyan-primary)', cursor: 'pointer', height: 28 }}
            />
          </div>

          {/* Slider 5: Flexible Load */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.84rem' }}>
              <label htmlFor="flex-slider" style={{ color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'लचीली मांग भागीदारी' : 'Flexible load participation'}
              </label>
              <span style={{ fontWeight: 600, minWidth: 60, textAlign: 'right', fontFamily: 'monospace' }}>
                {flexPct}%
              </span>
            </div>
            <input
              id="flex-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={flexPct}
              onChange={(e) => {
                setFlexPct(parseFloat(e.target.value));
                setActivePreset(null);
              }}
              style={{ width: '100%', accentColor: 'var(--cyan-primary)', cursor: 'pointer', height: 28 }}
            />
          </div>

          {/* Weather Selector (No emoji) */}
          <div style={{ paddingTop: 6 }}>
            <span style={{ display: 'block', marginBottom: 8, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              {language === 'hi' ? 'मौसम मोड' : 'Weather mode'}
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 6
            }}>
              {[
                { key: 'NORMAL', label: language === 'hi' ? 'सामान्य' : 'Normal' },
                { key: 'HEATWAVE', label: language === 'hi' ? 'हीटवेव' : 'Heatwave' },
                { key: 'STORM_FRONT', label: language === 'hi' ? 'मानसून तूफान' : 'Monsoon Storm' },
              ].map(opt => (
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

        {/* Right Column: Results + Recommendation Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{
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
                  {shortageHoursEliminated}{' '}
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    {language === 'hi' ? 'घंटे' : 'hours'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Action Box */}
          <div style={{
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
        </div>
      </div>

      {/* 4. Chart: Full width below */}
      <div style={{
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
                name={language === 'hi' ? 'अशमित संतुलन (घाटा)' : 'Unmitigated balance'} 
                stroke="#ef4444" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="mitigated_balance" 
                name={language === 'hi' ? 'ग्रिडफ्लेक्स के साथ' : 'With GridFlex (BESS + DR)'} 
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
  );
}
