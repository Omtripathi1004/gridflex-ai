'use client';

import React from 'react';
import { Sun, Wind, BatteryCharging, Factory, Car, Zap, Activity, Droplets } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EnergyFlowProps {
  solarMw: number;
  windMw: number;
  demandMw: number;
  bessSoc: number;
  netBalanceMw: number;
  bessDischarging?: boolean;
}

export const EnergyFlowDiagram: React.FC<EnergyFlowProps> = ({
  solarMw,
  windMw,
  demandMw,
  bessSoc,
  netBalanceMw,
  bessDischarging = false,
}) => {
  const { t } = useLanguage();
  const isSurplus = netBalanceMw >= 0;

  return (
    <div className="card" style={{ padding: '24px 20px', overflow: 'hidden' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Activity size={20} style={{ color: 'var(--cyan-primary)' }} />
            {t('cc.flow_title')}
          </h3>
          <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
            Real-time energy balance through 66/11kV substation bus (Reconciled Load: 28.4 + 30.2 + 6.2 = 64.8 MW)
          </p>
        </div>
        <span className={`badge ${isSurplus ? 'badge-live' : 'badge-risk-critical'}`}>
          {isSurplus ? t('cc.surplus') : t('cc.deficit')}
        </span>
      </div>

      <div style={{ position: 'relative', width: '100%', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg 
          viewBox="0 0 840 340" 
          style={{ width: '100%', height: 'auto', maxHeight: 360 }}
        >
          <defs>
            <linearGradient id="solarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="windGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#0080ff" />
            </linearGradient>
            <linearGradient id="busGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Flow Lines to Central Substation Bus */}
          {/* Solar -> Bus */}
          <path
            d="M 160 80 L 400 170"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3.5"
            className="energy-line"
            filter="url(#glowAmber)"
          />
          {/* Wind -> Bus */}
          <path
            d="M 160 260 L 400 170"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="3.5"
            className="energy-line"
            filter="url(#glowCyan)"
          />
          {/* Bus -> BESS (Bidirectional) */}
          <path
            d="M 400 170 L 400 50"
            fill="none"
            stroke={bessDischarging ? "#34d399" : "#fbbf24"}
            strokeWidth="3.5"
            className="energy-line"
            style={{ animationDirection: bessDischarging ? 'reverse' : 'normal' }}
          />
          {/* Bus -> Commercial/HVAC */}
          <path
            d="M 400 170 L 680 70"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            className="energy-line"
          />
          {/* Bus -> EV Fleet / Industrial */}
          <path
            d="M 400 170 L 680 170"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3.5"
            className="energy-line"
          />
          {/* C6: Bus -> Municipal Water & Lighting (6.2 MW) */}
          <path
            d="M 400 170 L 680 270"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            className="energy-line"
          />

          {/* Central 66/11kV Substation Bus Node */}
          <rect
            x="350"
            y="140"
            width="100"
            height="60"
            rx="12"
            fill="#10182b"
            stroke="url(#busGrad)"
            strokeWidth="2.5"
            filter="url(#glowCyan)"
          />
          <text x="400" y="166" textAnchor="middle" fill="#00f0ff" fontSize="13" fontWeight="bold">66/11kV</text>
          <text x="400" y="184" textAnchor="middle" fill="#94a3b8" fontSize="10">Substation Bus</text>

          {/* Left Node: Solar Farm Array */}
          <circle cx="120" cy="80" r="38" fill="#141c2e" stroke="#fbbf24" strokeWidth="2" filter="url(#glowAmber)" />
          <text x="120" y="74" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">{t('flow.solar_farm')}</text>
          <text x="120" y="92" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">+{solarMw} MW</text>

          {/* Left Node: Wind Farm */}
          <circle cx="120" cy="260" r="38" fill="#141c2e" stroke="#00f0ff" strokeWidth="2" filter="url(#glowCyan)" />
          <text x="120" y="254" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">{t('flow.wind_array')}</text>
          <text x="120" y="272" textAnchor="middle" fill="#00f0ff" fontSize="12" fontWeight="bold">+{windMw} MW</text>

          {/* Top Node: Virtual Community BESS */}
          <rect
            x="320"
            y="15"
            width="160"
            height="50"
            rx="10"
            fill="#141c2e"
            stroke="#10b981"
            strokeWidth="2"
          />
          <text x="400" y="36" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">
            BESS Fleet ({bessSoc}%)
          </text>
          <text x="400" y="52" textAnchor="middle" fill="#94a3b8" fontSize="10">
            {bessDischarging ? t('flow.bess_discharging') : t('flow.bess_charging')}
          </text>

          {/* Right Node 1: Commercial HVAC */}
          <circle cx="720" cy="70" r="36" fill="#141c2e" stroke="#38bdf8" strokeWidth="2" />
          <text x="720" y="65" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">Commercial HVAC</text>
          <text x="720" y="82" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">-28.4 MW</text>

          {/* Right Node 2: EV Fleet & Industrial */}
          <circle cx="720" cy="170" r="36" fill="#141c2e" stroke="#f59e0b" strokeWidth="2" />
          <text x="720" y="165" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">EV & Industrial</text>
          <text x="720" y="182" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">-30.2 MW</text>

          {/* C6: Right Node 3: Municipal Water & Lighting */}
          <circle cx="720" cy="270" r="36" fill="#141c2e" stroke="#8b5cf6" strokeWidth="2" />
          <text x="720" y="265" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">Municipal & Lighting</text>
          <text x="720" y="282" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="bold">-6.2 MW</text>
        </svg>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: 14,
        marginTop: 10,
        fontSize: '0.84rem',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber-flow)' }}></span>
          <span>{t('cc.solar_gen')}: <strong>{solarMw} MW</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--cyan-primary)' }}></span>
          <span>{t('cc.wind_gen')}: <strong>{windMw} MW</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#38bdf8' }}></span>
          <span>Total Demand: <strong>{demandMw} MW</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: isSurplus ? 'var(--green-renew)' : 'var(--red-risk)' }}></span>
          <span>{t('cc.net_balance')}: <strong style={{ color: isSurplus ? 'var(--green-renew)' : 'var(--red-risk)' }}>{netBalanceMw > 0 ? `+${netBalanceMw}` : netBalanceMw} MW</strong></span>
        </div>
      </div>
    </div>
  );
};
