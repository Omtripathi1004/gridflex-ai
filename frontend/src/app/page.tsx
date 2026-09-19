'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
  Award
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-live">
            {t('landing.badge')}
          </span>
          <span className="badge badge-sim">
            {t('landing.stat_languages')}
          </span>
        </div>

        <h1 style={{ maxWidth: 860, margin: '0 auto', fontSize: '2.75rem', lineHeight: 1.2 }}>
          {t('landing.hero_title')}
        </h1>

        <p style={{ maxWidth: 780, margin: '0 auto', fontSize: '1.12rem', color: 'var(--text-secondary)' }}>
          {t('landing.hero_subtitle')}
        </p>

        {/* Live Telemetry Flash Banner */}
        {telemetry && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            background: 'rgba(20, 31, 54, 0.7)',
            padding: '10px 22px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-medium)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontSize: '0.88rem'
          }}>
            <span className="badge badge-live">{t('badge.live')}</span>
            <span>{t('landing.solar_lbl')} <strong style={{ color: 'var(--amber-flow)' }}>{telemetry.metrics?.solar_generation_mw} MW</strong></span>
            <span>{t('landing.wind_lbl')} <strong style={{ color: 'var(--cyan-primary)' }}>{telemetry.metrics?.wind_generation_mw} MW</strong></span>
            <span>{t('landing.demand_lbl')} <strong>{telemetry.metrics?.grid_demand_mw} MW</strong></span>
            <span>{t('landing.resilience_lbl')} <strong style={{ color: 'var(--green-renew)' }}>{telemetry.metrics?.composite_resilience_score}/100</strong></span>
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
          <Link href="/command-center" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.02rem' }}>
            <Zap size={20} />
            {t('landing.btn_command_center')}
          </Link>
          <Link href="/judge-mode" className="btn btn-amber" style={{ padding: '14px 28px', fontSize: '1.02rem' }}>
            <Award size={20} />
            {t('landing.btn_judge_tour')}
          </Link>
        </div>

        {/* Highlight Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          width: '100%',
          maxWidth: 960,
          marginTop: 20
        }}>
          <div className="card" style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan-primary)' }}>96.3%</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t('landing.stat_accuracy')}</div>
          </div>
          <div className="card" style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--green-renew)' }}>0 Hours</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t('landing.stat_blackout')}</div>
          </div>
          <div className="card" style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--amber-flow)' }}>&lt;150ms</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t('landing.stat_response')}</div>
          </div>
          <div className="card" style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a855f7' }}>15 Locales</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t('landing.stat_languages')}</div>
          </div>
        </div>
      </section>

      {/* The Problem: Duck Curve & Reliability Gaps */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <span className="badge badge-risk-critical" style={{ marginBottom: 8 }}>{t('landing.problem_badge')}</span>
          <h2>{t('landing.problem_title')}</h2>
          <p style={{ marginTop: 6, maxWidth: 800 }}>
            {t('landing.problem_desc')}
          </p>
        </div>

        <div className="grid-3">
          <div className="card" style={{ borderLeft: '4px solid var(--amber-flow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Sun size={24} style={{ color: 'var(--amber-flow)' }} />
              <h4>{t('landing.problem_card1_title')}</h4>
            </div>
            <p style={{ fontSize: '0.9rem' }}>
              {t('landing.problem_card1_desc')}
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--red-risk)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Flame size={24} style={{ color: 'var(--red-risk)' }} />
              <h4>{t('landing.problem_card2_title')}</h4>
            </div>
            <p style={{ fontSize: '0.9rem' }}>
              {t('landing.problem_card2_desc')}
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--orange-warn)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <ShieldAlert size={24} style={{ color: 'var(--orange-warn)' }} />
              <h4>{t('landing.problem_card3_title')}</h4>
            </div>
            <p style={{ fontSize: '0.9rem' }}>
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
          <Link href="/command-center" className="btn btn-secondary">
            <span>Explore Telemetry & Visualizations</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
