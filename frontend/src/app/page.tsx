'use client';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchLiveTelemetry } from '../lib/api';
import { 
  Zap, 
  ArrowRight, 
  ShieldAlert, 
  Flame, 
  Cpu, 
  BatteryCharging, 
  Sun, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle,
  Activity,
  Award,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();
  const [telemetry, setTelemetry] = useState<any>(null);

  useEffect(() => {
    fetchLiveTelemetry().then(data => setTelemetry(data));
  }, []);

  const chainSteps = [
    { title: t('chain.step1'), desc: 'Weather & Substation APIs', icon: Activity, color: '#38bdf8' },
    { title: t('chain.step2'), desc: 'XGBoost & LightGBM Multi-Horizon', icon: Sun, color: '#fbbf24' },
    { title: t('chain.step3'), desc: 'Shortage & Overload Detection', icon: ShieldAlert, color: '#ef4444' },
    { title: t('chain.step4'), desc: 'MILP Multi-Asset Solver', icon: Cpu, color: '#00f0ff' },
    { title: t('chain.step5'), desc: 'Automated Feeder Directives', icon: Zap, color: '#f59e0b' },
    { title: t('chain.step6'), desc: 'Real-Time Dynamic Dispatch', icon: BatteryCharging, color: '#10b981' },
    { title: t('chain.step7'), desc: 'Zero Blackouts & Tariff Savings', icon: Award, color: '#34d399' },
    { title: t('chain.step8'), desc: 'TreeSHAP Factor Attributions', icon: CheckCircle2, color: '#a855f7' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48, paddingBottom: 40 }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '50px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="badge badge-live" style={{ background: 'rgba(0, 240, 255, 0.15)', color: 'var(--cyan-primary)', border: '1px solid var(--cyan-primary)' }}>
            <Zap size={13} style={{ marginRight: 4 }} />
            {t('landing.badge')}
          </span>
          <span className="badge badge-amber" style={{ background: 'rgba(251, 191, 36, 0.15)', color: 'var(--gold-accent)', border: '1px solid var(--gold-accent)' }}>
            <Sparkles size={13} style={{ marginRight: 4 }} />
            {t('landing.stat_languages')}
          </span>
        </div>

        <h1 style={{ maxWidth: 920, margin: '0 auto', fontSize: '2.85rem', lineHeight: 1.2, fontWeight: 800 }}>
          <span className="text-gradient-cyan">Autonomous Energy Grid</span> Optimization &amp; <span className="text-gradient-gold">Resilience Platform</span>
        </h1>

        <p style={{ maxWidth: 820, margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {t('landing.hero_subtitle')}
        </p>

        {/* Live Telemetry Flash Banner */}
        {telemetry && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            background: 'linear-gradient(135deg, rgba(20, 31, 54, 0.85) 0%, rgba(13, 20, 36, 0.95) 100%)',
            padding: '12px 26px',
            borderRadius: 'var(--radius-full)',
            border: '1.5px solid var(--cyan-primary)',
            boxShadow: '0 0 24px rgba(0, 240, 255, 0.2)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontSize: '0.92rem'
          }}>
            <span className="badge badge-live">{t('badge.live')}</span>
            <span>{t('landing.solar_lbl')} <strong style={{ color: 'var(--amber-flow)', fontSize: '1.05rem' }}>{telemetry.metrics?.solar_generation_mw} MW</strong></span>
            <span>{t('landing.wind_lbl')} <strong style={{ color: 'var(--cyan-primary)', fontSize: '1.05rem' }}>{telemetry.metrics?.wind_generation_mw} MW</strong></span>
            <span>{t('landing.demand_lbl')} <strong style={{ fontSize: '1.05rem' }}>{telemetry.metrics?.grid_demand_mw} MW</strong></span>
            <span>{t('landing.resilience_lbl')} <strong style={{ color: 'var(--green-renew)', fontSize: '1.05rem' }}>{telemetry.metrics?.composite_resilience_score}/100</strong></span>
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
          <Link to="/command-center" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.02rem' }}>
            <Zap size={20} />
            {t('landing.btn_command_center')}
          </Link>
          <Link to="/judge-mode" className="btn btn-amber" style={{ padding: '14px 28px', fontSize: '1.02rem' }}>
            <Award size={20} />
            {t('landing.btn_judge_tour')}
          </Link>
          <Link to="/explainable-ai" className="btn btn-purple" style={{ padding: '14px 24px', fontSize: '1.02rem' }}>
            <Cpu size={20} />
            <span>Explore XAI Rationale</span>
          </Link>
        </div>

        {/* Highlight Stats Row (Nova Varchasva Contrast Themed Cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 16,
          width: '100%',
          maxWidth: 1040,
          marginTop: 20
        }}>
          <div className="card-cyan" style={{ padding: 18, textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#a5f3fc' }}>0.942 R²</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>Solar Forecast (MAE: 1.42 MW)</div>
          </div>
          <div className="card-emerald" style={{ padding: 18, textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#6ee7b7' }}>0 Hours</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>Deficit Hours (100% Mitigated)</div>
          </div>
          <div className="card-gold" style={{ padding: 18, textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fef08a' }}>&lt; 150 ms</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>Sub-Cycle Dispatch Latency</div>
          </div>
          <div className="card-purple" style={{ padding: 18, textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#e9d5ff' }}>EN &amp; HI</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>Bilingual Support</div>
          </div>
        </div>
      </section>

      {/* The Problem: Duck Curve & Reliability Gaps */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <span className="badge badge-risk-critical" style={{ marginBottom: 8 }}>{t('landing.problem_badge')}</span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{t('landing.problem_title')}</h2>
          <p style={{ marginTop: 6, maxWidth: 840, fontSize: '0.98rem' }}>
            {t('landing.problem_desc')}
          </p>
        </div>

        <div className="grid-3">
          <div className="card-gold" style={{ borderRadius: 'var(--radius-md)', padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Sun size={24} style={{ color: 'var(--gold-accent)' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fef08a' }}>{t('landing.problem_card1_title')}</h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {t('landing.problem_card1_desc')}
            </p>
          </div>

          <div className="card-crimson" style={{ borderRadius: 'var(--radius-md)', padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Flame size={24} style={{ color: 'var(--red-risk)' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fca5a5' }}>{t('landing.problem_card2_title')}</h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {t('landing.problem_card2_desc')}
            </p>
          </div>

          <div className="card-orange" style={{ borderRadius: 'var(--radius-md)', padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <ShieldAlert size={24} style={{ color: 'var(--orange-vivid)' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fdba74' }}>{t('landing.problem_card3_title')}</h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {t('landing.problem_card3_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* The 8-Step Solution Decision Chain */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <span className="badge badge-forecast" style={{ marginBottom: 8 }}>{t('landing.arch_badge')}</span>
          <h2>{t('landing.chain_title')}</h2>
          <p style={{ marginTop: 6 }}>
            {t('landing.chain_subtitle')}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16
        }}>
          {chainSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="card" 
                style={{
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  borderTop: `3px solid ${step.color}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Icon size={20} style={{ color: step.color }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>0{idx + 1}</span>
                </div>
                <h4 style={{ fontSize: '0.98rem' }}>{step.title}</h4>
                <p style={{ fontSize: '0.82rem' }}>{step.desc}</p>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <Link to="/command-center" className="btn btn-secondary">
            <span>Explore Telemetry & Visualizations</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* About & Platform Directory Section */}
      <section id="about-section" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        background: 'linear-gradient(180deg, rgba(13, 20, 36, 0.7) 0%, rgba(16, 25, 45, 0.9) 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 28px',
        marginTop: 10
      }}>
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="badge badge-live">
                <Sparkles size={12} style={{ marginRight: 4 }} />
                About GridFlex AI
              </span>
              <span className="badge badge-sim">System Guide & Directory</span>
            </div>
            <h2 style={{ fontSize: '2rem', margin: '4px 0 8px 0', color: 'var(--text-primary)' }}>
              Complete Platform Overview &amp; Page Navigator
            </h2>
            <p style={{ maxWidth: 820, margin: 0, fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              GridFlex AI is an autonomous, hardware-free national energy grid optimizer designed for Indian power grids. Below is a concise breakdown of the tech stack, data provenance types (live, cached, demo), and quick links to help you navigate directly to the right page.
            </p>
          </div>
          <Link to="/about" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            <span>Full 20-Page Catalog &amp; Specs</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Data Provenance Symbolism Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16
        }}>
          {/* Live Data */}
          <div style={{
            background: 'rgba(7, 11, 20, 0.7)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 18px',
            borderLeft: '4px solid #10b981',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <strong style={{ color: '#10b981', fontSize: '1rem' }}>Live Data</strong>
              </div>
              <span className="badge badge-live" style={{ fontSize: '0.72rem' }}>REST API &amp; Web Speech</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
              Dynamic API fetches from Open-Meteo NWP and NASA POWER, with bilingual English and Hindi interface support.
            </p>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
              Pages: <strong>/command-center</strong>, <strong>/renewable-forecast</strong>, <strong>/sky-vision</strong>, <strong>/incident-copilot</strong>
            </div>
          </div>

          {/* Cached Data */}
          <div style={{
            background: 'rgba(7, 11, 20, 0.7)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 18px',
            borderLeft: '4px solid var(--cyan-primary)',
            border: '1px solid rgba(0, 240, 255, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ color: 'var(--cyan-primary)', fontSize: '1rem' }}>Cached National Data</strong>
              </div>
              <span className="badge badge-forecast" style={{ fontSize: '0.72rem' }}>Govt Baselines</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
              Real Indian utility profiles (Grid-India NLDC Daily PSP 64.8 MW, Vidyut PRAVAH IEX DAM ₹6.80/kWh, CEA v19) cached for fast response &amp; offline reliability.
            </p>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
              Pages: <strong>/demand-forecast</strong>, <strong>/spatial-twin</strong>, <strong>/tariff-engine</strong>, <strong>/explainable-ai</strong>
            </div>
          </div>

          {/* Demo / Synthetic Data */}
          <div style={{
            background: 'rgba(7, 11, 20, 0.7)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 18px',
            borderLeft: '4px solid var(--amber-flow)',
            border: '1px solid rgba(251, 191, 36, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ color: 'var(--amber-flow)', fontSize: '1rem' }}>Demo / Synthetic Data</strong>
              </div>
              <span className="badge badge-sim" style={{ fontSize: '0.72rem' }}>Physics Twin</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
              Mathematical models and MILP optimization algorithms simulating 40 MWh community BESS, fault injections, and microgrid P2P auctions.
            </p>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
              Pages: <strong>/digital-twin</strong>, <strong>/self-healing</strong>, <strong>/storage</strong>, <strong>/flexibility</strong>, <strong>/p2p</strong>
            </div>
          </div>
        </div>

        {/* Tech Stack Pills Strip */}
        <div style={{
          background: 'rgba(7, 11, 20, 0.5)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--cyan-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cpu size={16} />
            <span>Architecture &amp; Math Stack</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}>React 18 + Vite SPA</span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}>TypeScript</span>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}>Vanilla CSS</span>
            <span className="badge" style={{ background: 'rgba(0, 240, 255, 0.15)', color: 'var(--cyan-primary)' }}>LightGBM Regressor (95% CI)</span>
            <span className="badge" style={{ background: 'rgba(0, 240, 255, 0.15)', color: 'var(--cyan-primary)' }}>XGBoost Temporal Regressor</span>
            <span className="badge" style={{ background: 'rgba(251, 191, 36, 0.15)', color: 'var(--amber-flow)' }}>MILP PuLP Flexibility Solver</span>
            <span className="badge" style={{ background: 'rgba(251, 191, 36, 0.15)', color: 'var(--amber-flow)' }}>Optical Flow Cloud Tracking</span>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green-renew)' }}>Causal Inference DAG</span>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green-renew)' }}>TreeSHAP Feature Attributions</span>
            <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>English &amp; Hindi Bilingual</span>
          </div>
        </div>

        {/* Quick Page Navigator Cards */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Page Directory
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Click any card to view</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 14
          }}>
            <Link to="/command-center" className="card" style={{ padding: 16, textDecoration: 'none', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: 'var(--cyan-primary)', fontSize: '0.95rem' }}>Command Center</span>
                <span className="badge badge-live" style={{ fontSize: '0.68rem' }}>Live</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Telemetry dashboard, grid frequency (50 Hz), generation vs demand, and dispatch directives.
              </p>
            </Link>

            <Link to="/sky-vision" className="card" style={{ padding: 16, textDecoration: 'none', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: 'var(--amber-flow)', fontSize: '0.95rem' }}>SkyVision Radar</span>
                <span className="badge badge-live" style={{ fontSize: '0.68rem' }}>Flow</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Cloud vector tracking to forecast sudden solar changes 15–30 minutes ahead.
              </p>
            </Link>

            <Link to="/self-healing" className="card" style={{ padding: 16, textDecoration: 'none', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: 'var(--green-renew)', fontSize: '0.95rem' }}>Self-Healing Grid</span>
                <span className="badge badge-sim" style={{ fontSize: '0.68rem' }}>Causal AI</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Causal DAG inference isolating faulty feeders and triggering automated bids during feeder trips.
              </p>
            </Link>

            <Link to="/spatial-twin" className="card" style={{ padding: 16, textDecoration: 'none', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.95rem' }}>Spatial Twin (3D)</span>
                <span className="badge badge-forecast" style={{ fontSize: '0.68rem' }}>Topology</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Corridor view of inter-regional transmission lines, loading percentages, and bottlenecks.
              </p>
            </Link>

            <Link to="/tariff-engine" className="card" style={{ padding: 16, textDecoration: 'none', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.95rem' }}>Tariff Engine</span>
                <span className="badge badge-forecast" style={{ fontSize: '0.68rem' }}>DSM</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Deviation penalty calculation, Time-of-Use tariff structure, and battery arbitrage.
              </p>
            </Link>

            <Link to="/incident-copilot" className="card" style={{ padding: 16, textDecoration: 'none', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: '#c084fc', fontSize: '0.95rem' }}>Incident Copilot</span>
                <span className="badge badge-live" style={{ fontSize: '0.68rem' }}>Copilot</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Grid assistant supporting queries and advisory in English and Hindi.
              </p>
            </Link>

            <Link to="/digital-twin" className="card" style={{ padding: 16, textDecoration: 'none', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: 'var(--amber-flow)', fontSize: '0.95rem' }}>Digital Twin Sandbox</span>
                <span className="badge badge-sim" style={{ fontSize: '0.68rem' }}>Simulator</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                What-if grid simulator testing generation, demand, battery, and weather variations over 24 hours.
              </p>
            </Link>

            <Link to="/judge-mode" className="card" style={{ padding: 16, textDecoration: 'none', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: 'var(--green-renew)', fontSize: '0.95rem' }}>Judge Mode &amp; Audit</span>
                <span className="badge badge-live" style={{ fontSize: '0.68rem' }}>Evaluation</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Evaluation walkthrough highlighting key challenge criteria, model metrics, and architecture.
              </p>
            </Link>
          </div>
        </div>

        {/* Action Link to Full About Page */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <Link to="/about" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
            <span>Explore All 20 Pages in the Complete About &amp; System Directory</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
