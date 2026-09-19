'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchP2POverview } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { 
  Share2, 
  ArrowRightLeft, 
  DollarSign, 
  ShieldAlert, 
  Users, 
  Hash, 
  CheckCircle2 
} from 'lucide-react';

export default function P2PPage() {
  const { t } = useLanguage();
  const [p2pData, setP2PData] = useState<any>(null);

  useEffect(() => {
    fetchP2POverview().then(data => {
      if (data) setP2PData(data);
    });
  }, []);

  const summary = p2pData?.summary || {
    active_prosumers: 3,
    active_consumers: 3,
    total_local_surplus_kw: 900,
    total_local_deficit_kw: 810,
    matched_energy_kw: 810,
    average_clearing_price_usd: 0.087,
    grid_wheeling_fee_usd_kwh: 0.012
  };

  const participants = p2pData?.participants || [
    { id: "PRO-01", name: "Apex Commercial Solar Array", type: "Surplus Prosumer", generation_kw: 450, demand_kw: 120, surplus_kw: 330, offering_price_kwh: 0.082 },
    { id: "PRO-02", name: "Hilltop Residential Micro-Solar", type: "Surplus Prosumer", generation_kw: 85, demand_kw: 25, surplus_kw: 60, offering_price_kwh: 0.085 },
    { id: "PRO-03", name: "South Agro-Voltaic Farm", type: "Surplus Prosumer", generation_kw: 600, demand_kw: 90, surplus_kw: 510, offering_price_kwh: 0.079 },
    { id: "CON-01", name: "Cold Storage Logistics Hub", type: "Deficit Consumer", generation_kw: 0, demand_kw: 380, deficit_kw: 380, bid_price_kwh: 0.092 },
    { id: "CON-02", name: "Rapid EV Charging Hub East", type: "Deficit Consumer", generation_kw: 0, demand_kw: 250, deficit_kw: 250, bid_price_kwh: 0.095 },
    { id: "CON-03", name: "District General Hospital", type: "Critical Consumer", generation_kw: 40, demand_kw: 220, deficit_kw: 180, bid_price_kwh: 0.100 },
  ];

  const transactions = p2pData?.matched_events || [
    { tx_hash: "a4f89d3c1782e5b0", timestamp: "14:15:22", seller_id: "South Agro-Voltaic", buyer_id: "Cold Storage Logistics", matched_volume_kwh: 380, clearing_price_usd_kwh: 0.085, status: "Settled (Simulated)" },
    { tx_hash: "b9e1204d88fc4192", timestamp: "14:18:04", seller_id: "Apex Commercial Solar", buyer_id: "Rapid EV Charging", matched_volume_kwh: 250, clearing_price_usd_kwh: 0.088, status: "Settled (Simulated)" },
    { tx_hash: "c287a19ff4e09811", timestamp: "14:21:40", seller_id: "Apex Commercial Solar", buyer_id: "District General Hospital", matched_volume_kwh: 80, clearing_price_usd_kwh: 0.089, status: "Settled (Simulated)" },
    { tx_hash: "d41076bca9552109", timestamp: "14:24:11", seller_id: "Hilltop Micro-Solar", buyer_id: "District General Hospital", matched_volume_kwh: 60, clearing_price_usd_kwh: 0.087, status: "Settled (Simulated)" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('p2p.title')}</h1>
            <span className="badge badge-sim">{t('badge.simulation')}</span>
          </div>
          <p>{t('p2p.subtitle')}</p>
        </div>

        <span className="badge badge-sim">
          <ShieldAlert size={14} /> {t('p2p.disclaimer_badge')}
        </span>
      </div>

      {/* Market Overview KPIs */}
      <div className="grid-4">
        <MetricCard
          label={t('p2p.matched_volume')}
          value={`${summary.matched_energy_kw}`}
          unit="kW"
          meta={t('p2p.matched_vol_meta')}
          icon={ArrowRightLeft}
          variant="cyan"
        />

        <MetricCard
          label={t('p2p.clearing_price')}
          value={`$${summary.average_clearing_price_usd}`}
          unit="/kWh"
          meta={t('p2p.clearing_price_meta')}
          icon={DollarSign}
          variant="green"
        />

        <MetricCard
          label={t('p2p.wheeling_fee')}
          value={`$${summary.grid_wheeling_fee_usd_kwh}`}
          unit="/kWh"
          meta={t('p2p.wheeling_meta')}
          icon={DollarSign}
          variant="amber"
        />

        <MetricCard
          label={t('p2p.active_participants')}
          value={`${summary.active_prosumers + summary.active_consumers}`}
          meta={t('p2p.participants_meta')}
          icon={Users}
          variant="default"
        />
      </div>

      {/* Participants Order Book Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Users size={20} style={{ color: 'var(--cyan-primary)' }} />
            {t('p2p.order_book')}
          </h3>
          <span className="badge badge-sim">{t('badge.simulation')}</span>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t('p2p.order_entity')}</th>
                <th>{t('p2p.order_type')}</th>
                <th>{t('p2p.order_qty')}</th>
                <th>{t('p2p.order_qty')}</th>
                <th>{t('cc.net_balance')}</th>
                <th>{t('p2p.order_price')}</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p: any) => {
                const isProsumer = p.type.includes('Prosumer');
                return (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{p.id}</div>
                    </td>
                    <td>
                      <span className={`badge ${isProsumer ? 'badge-live' : 'badge-sim'}`}>
                        {p.type}
                      </span>
                    </td>
                    <td>{p.generation_kw} kW</td>
                    <td>{p.demand_kw} kW</td>
                    <td>
                      <strong style={{ color: isProsumer ? 'var(--green-renew)' : 'var(--red-risk)' }}>
                        {isProsumer ? `+${p.surplus_kw} kW (Surplus)` : `-${p.deficit_kw} kW (Deficit)`}
                      </strong>
                    </td>
                    <td>
                      <strong>${(p.offering_price_kwh || p.bid_price_kwh).toFixed(3)}/kWh</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Transaction Ledger */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Hash size={20} style={{ color: 'var(--amber-flow)' }} />
            {t('p2p.ledger_title')}
          </h3>
          <span className="badge badge-sim">{t('badge.simulation')}</span>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t('p2p.col_hash')}</th>
                <th>{t('p2p.col_time')}</th>
                <th>{t('p2p.seller')}</th>
                <th>{t('p2p.buyer')}</th>
                <th>{t('p2p.volume')}</th>
                <th>{t('p2p.col_price')}</th>
                <th>{t('p2p.col_status')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: any, idx: number) => (
                <tr key={idx}>
                  <td>
                    <code style={{ color: 'var(--cyan-primary)', fontSize: '0.8rem' }}>
                      {tx.tx_hash}
                    </code>
                  </td>
                  <td>{tx.timestamp}</td>
                  <td><span style={{ color: 'var(--amber-flow)' }}>{tx.seller_id}</span></td>
                  <td><span style={{ color: '#38bdf8' }}>{tx.buyer_id}</span></td>
                  <td><strong>{tx.matched_volume_kwh} kWh</strong></td>
                  <td>${tx.clearing_price_usd_kwh}/kWh</td>
                  <td>
                    <span className="badge badge-live" style={{ fontSize: '0.72rem' }}>
                      <CheckCircle2 size={11} /> {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
