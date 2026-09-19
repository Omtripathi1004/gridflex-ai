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
  AlertTriangle 
} from 'lucide-react';

export default function DiscomPage() {
  const { t } = useLanguage();
  const [discomData, setDiscomData] = useState<any>(null);

  useEffect(() => {
    fetchDiscomOverview().then(data => {
      if (data) setDiscomData(data);
    });
  }, []);

  const feeders = discomData?.feeders || [
    {
      id: "F-01",
      name: "North Residential Feeder (11kV)",
      substation: "North 33/11kV Substation",
      load_mw: 14.8,
      capacity_mw: 18.0,
      loading_pct: 82.2,
      voltage_pu: 0.982,
      solar_pv_connected_mw: 6.2,
      risk_level: "Moderate",
      available_flexibility_mw: 2.4,
      recommended_intervention: "Stagger EV charging windows post 20:00"
    },
    {
      id: "F-02",
      name: "High-Tech Industrial Park (11kV)",
      substation: "North 33/11kV Substation",
      load_mw: 22.4,
      capacity_mw: 25.0,
      loading_pct: 89.6,
      voltage_pu: 0.974,
      solar_pv_connected_mw: 12.5,
      risk_level: "High Congestion",
      available_flexibility_mw: 4.8,
      recommended_intervention: "Execute BESS-02 2.8 MW discharge at 18:30"
    },
    {
      id: "F-03",
      name: "Green Valley Agricultural Microgrid (11kV)",
      substation: "West Primary Substation",
      load_mw: 9.2,
      capacity_mw: 15.0,
      loading_pct: 61.3,
      voltage_pu: 1.012,
      solar_pv_connected_mw: 14.0,
      risk_level: "Surplus Reverse Flow",
      available_flexibility_mw: 3.2,
      recommended_intervention: "Activate water pump solar capture schedule"
    },
    {
      id: "F-04",
      name: "Metro Transit & Commercial Core (11kV)",
      substation: "Central Grid Substation",
      load_mw: 17.8,
      capacity_mw: 22.0,
      loading_pct: 80.9,
      voltage_pu: 0.988,
      solar_pv_connected_mw: 4.5,
      risk_level: "Stable",
      available_flexibility_mw: 2.4,
      recommended_intervention: "Maintain standby spinning reserve"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('discom.title')}</h1>
            <span className="badge badge-live">{t('discom.feeder_badge')}</span>
          </div>
          <p>{t('discom.subtitle')}</p>
        </div>

        <span className="badge badge-sim">
          {t('arch.subtitle')}
        </span>
      </div>

      {/* Network KPIs */}
      <div className="grid-3">
        <MetricCard
          label={t('discom.feeders_count')}
          value="4 Feeders"
          meta={t('discom.feeders_meta')}
          icon={Building2}
          variant="cyan"
        />

        <MetricCard
          label={t('discom.avg_loading')}
          value="78.5%"
          meta={t('discom.loading_meta')}
          icon={Activity}
          variant="amber"
        />

        <MetricCard
          label={t('discom.available_flex')}
          value="12.8 MW"
          meta={t('discom.flex_meta')}
          icon={Sliders}
          variant="green"
        />
      </div>

      {/* Feeders Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Zap size={20} style={{ color: 'var(--cyan-primary)' }} />
            {t('discom.table_title')}
          </h3>
          <span className="badge badge-live">{t('badge.live')}</span>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t('discom.feeder_name')}</th>
                <th>{t('discom.col_rating')}</th>
                <th>{t('discom.loading')}</th>
                <th>{t('discom.voltage')}</th>
                <th>{t('discom.solar_pv')}</th>
                <th>{t('discom.risk')}</th>
                <th>{t('discom.action')}</th>
              </tr>
            </thead>
            <tbody>
              {feeders.map((f: any) => {
                const isHighRisk = f.loading_pct > 88;
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
                    <td>{f.solar_pv_connected_mw} MW</td>
                    <td>
                      <span className={`badge ${isHighRisk ? 'badge-risk-critical' : (f.risk_level.includes('Surplus') ? 'badge-sim' : 'badge-live')}`}>
                        {f.risk_level}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.84rem', color: 'var(--cyan-primary)', fontWeight: 500 }}>
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
