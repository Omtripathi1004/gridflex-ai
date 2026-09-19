'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { fetchEveningGapScenario } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Zap, 
  ShieldAlert, 
  Sun, 
  Clock, 
  TrendingDown,
  DollarSign,
  Activity
} from 'lucide-react';

export default function JudgeModePage() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [actionDispatched, setActionDispatched] = useState<boolean>(false);
  const [scenario, setScenario] = useState<any>(null);

  useEffect(() => {
    fetchEveningGapScenario().then(data => {
      if (data) setScenario(data);
    });
  }, []);

  const steps = scenario?.steps || [
    {
      step_number: 1,
      title: "Problem Identification",
      headline: "The Solar Ramp-Down Cliff (Duck Curve)",
      details: "At 17:00, solar generation plunges from 48.5 MW to zero within 90 minutes, exactly as residential consumers turn on HVAC, cooking, and EV chargers.",
      telemetry_snippet: { solar_drop_mw: -48.5, demand_ramp_mw: +26.4, risk_window: "18:00 - 21:30" }
    },
    {
      step_number: 2,
      title: "Predictive Forecast",
      headline: "XGBoost & LightGBM Multi-Hour Horizon Detection",
      details: "The model anticipates an impending 18.2 MW net shortage at 19:30 with 94.2% confidence, triggering automated resilience warnings.",
      telemetry_snippet: { forecast_mae_mw: 1.42, projected_deficit_mw: 18.2, confidence_band: "95% CI: [16.8 - 19.6] MW" }
    },
    {
      step_number: 3,
      title: "Risk Detection",
      headline: "Substation Congestion & Unserved Energy Window",
      details: "Without flexibility intervention, Feeder F-02 loading will breach 96% thermal rating, threatening mandatory rolling blackouts.",
      telemetry_snippet: { unserved_energy_mwh: 48.6, transformer_headroom: "Critical (3.8%)", penalty_usd: 18400 }
    },
    {
      step_number: 4,
      title: "AI Flexibility Recommendation",
      headline: "Optimized Coordinated Dispatch Plan",
      details: "MILP solver recommends: 1) Discharge 9.5 MW across community BESS units, 2) Shift 5.2 MW non-essential EV charging and thermal loads, 3) Match 3.5 MW local P2P prosumer reserves.",
      telemetry_snippet: { bess_discharge_mw: 9.5, load_shift_mw: 5.2, p2p_cleared_mw: 3.5 }
    },
    {
      step_number: 5,
      title: "Simulated Action Execution",
      headline: "Autonomous Dispatch Dispatched to Virtual Fleet",
      details: "Digital dispatch signals transmitted to Substation BESS-01/02 and commercial aggregators. Response confirmed in 120ms.",
      telemetry_snippet: { dispatch_latency_ms: 120, bess_status: "Active Discharge", feeder_relief_mw: 14.7 }
    },
    {
      step_number: 6,
      title: "Measurable Impact",
      headline: "100% Reliability Maintained & Zero Blackout Hours",
      details: "Net grid deficit eliminated. Shortage hours reduced from 4.0 hours to 0 hours. Feeder loading safely capped at 78.4%. $18,400 in emergency peaker plant costs avoided.",
      telemetry_snippet: { shortage_hours_eliminated: 4.0, peak_shaved_mw: 14.7, cost_saved_usd: 18400, co2_avoided_kg: 6760 }
    }
  ];

  const currentStep = steps[activeStep - 1];

  const handleSimulateDispatch = () => {
    setActionDispatched(true);
    setTimeout(() => {
      setActiveStep(6);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('judge.title')}</h1>
            <span className="badge badge-amber" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
              Seed Scenario: Evening Renewable Gap
            </span>
          </div>
          <p>{t('judge.subtitle')}</p>
        </div>

        <button 
          onClick={() => { setActiveStep(1); setActionDispatched(false); }}
          className="btn btn-secondary btn-sm"
        >
          <RotateCcw size={14} /> {t('judge.btn_reset')}
        </button>
      </div>

      {/* 6-Stage Stepper Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 8,
          alignItems: 'center'
        }}>
          {steps.map((st: any) => {
            const isCompleted = st.step_number < activeStep;
            const isCurrent = st.step_number === activeStep;
            return (
              <button
                key={st.step_number}
                onClick={() => setActiveStep(st.step_number)}
                style={{
                  background: isCurrent ? 'rgba(0, 240, 255, 0.18)' : (isCompleted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)'),
                  border: isCurrent ? '1.5px solid var(--cyan-primary)' : (isCompleted ? '1px solid var(--green-renew)' : '1px solid var(--border-subtle)'),
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: isCurrent ? 'var(--cyan-primary)' : (isCompleted ? 'var(--green-renew)' : 'var(--bg-tertiary)'),
                  color: isCurrent || isCompleted ? '#070b14' : 'var(--text-tertiary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isCompleted ? '✓' : st.step_number}
                </span>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? 'var(--cyan-primary)' : (isCompleted ? 'var(--green-renew)' : 'var(--text-secondary)')
                }}>
                  {st.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Content Spotlight Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(20, 31, 54, 0.95) 0%, rgba(13, 20, 36, 0.95) 100%)',
        border: '1.5px solid var(--border-medium)',
        padding: '32px 36px',
        boxShadow: 'var(--shadow-cyan)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span className="badge badge-forecast">Step 0{activeStep} of 06</span>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-tertiary)' }}>Traceable Decision Chain</span>
        </div>

        <h2 style={{ fontSize: '1.8rem', color: 'var(--cyan-primary)', marginBottom: 12 }}>
          {currentStep.headline}
        </h2>

        <p style={{ fontSize: '1.05rem', color: '#f8fafc', lineHeight: 1.6, maxWidth: 840, marginBottom: 24 }}>
          {currentStep.details}
        </p>

        {/* Telemetry Detail Callout Box */}
        <div style={{
          background: 'rgba(7, 11, 20, 0.8)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: 24
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--cyan-primary)', fontWeight: 600, display: 'block', marginBottom: 8 }}>
            📊 Telemetry & Optimization Signals:
          </span>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {Object.entries(currentStep.telemetry_snippet).map(([key, val]: [string, any]) => (
              <div key={key}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                  {key.replace(/_/g, ' ')}
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {val.toString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Trigger Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {activeStep > 1 && (
              <button 
                onClick={() => setActiveStep(activeStep - 1)}
                className="btn btn-secondary"
              >
                <ArrowLeft size={16} /> {t('judge.btn_prev')}
              </button>
            )}
            {activeStep < 6 && (
              <button 
                onClick={() => setActiveStep(activeStep + 1)}
                className="btn btn-primary"
              >
                {t('judge.btn_next')} <ArrowRight size={16} />
              </button>
            )}
          </div>

          {activeStep === 4 && (
            <button
              onClick={handleSimulateDispatch}
              className="btn btn-amber"
              style={{ padding: '12px 24px' }}
            >
              <Zap size={18} />
              {t('judge.btn_execute')}
            </button>
          )}

          {activeStep === 6 && (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/command-center" className="btn btn-primary">
                Return to Live Command Center
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
