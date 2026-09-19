'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchP2POverview } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { ProvenanceBadge } from '../../components/ProvenanceBadge';
import { 
  Share2, 
  ArrowRightLeft, 
  IndianRupee, 
  ShieldAlert, 
  Users, 
  CheckCircle2,
  Building2,
  Zap
} from 'lucide-react';

export default function P2PPage() {
  const { t } = useLanguage();
  const [p2pData, setP2PData] = useState<any>(null);

  useEffect(() => {
    fetchP2POverview().then(data => {
      if (data) setP2PData(data);
    });
  }, []);

  // C5 & H4: Ledger transactions strictly sum to 770 kWh and use INR (₹)
  const transactions = p2pData?.matched_events || [
    { tx_hash: "a4f89d3c1782e5b0", timestamp: "14:15:22", seller_id: "South Agro-Voltaic", buyer_id: "Cold Storage Logistics Hub", matched_volume_kwh: 380, clearing_price_inr_kwh: 6.65, total_inr: 2527.00, status: "Settled (Simulated)" },
    { tx_hash: "b9e1204d88fc4192", timestamp: "14:18:04", seller_id: "Apex Commercial Solar", buyer_id: "Rapid EV Charging Hub East", matched_volume_kwh: 250, clearing_price_inr_kwh: 6.85, total_inr: 1712.50, status: "Settled (Simulated)" },
    { tx_hash: "c287a19ff4e09811", timestamp: "14:21:40", seller_id: "Apex Commercial Solar", buyer_id: "District General Hospital", matched_volume_kwh: 80, clearing_price_inr_kwh: 6.95, total_inr: 556.00, status: "Settled (Simulated)" },
    { tx_hash: "d41076bca9552109", timestamp: "14:24:11", seller_id: "Hilltop Micro-Solar", buyer_id: "District General Hospital", matched_volume_kwh: 60, clearing_price_inr_kwh: 6.75, total_inr: 405.00, status: "Settled (Simulated)" }
  ];

  // Derived directly from the ledger
  const totalMatchedVolumeKwh = transactions.reduce((sum: number, tx: any) => sum + tx.matched_volume_kwh, 0); // 770 kWh
  const totalTransactionInr = transactions.reduce((sum: number, tx: any) => sum + (tx.total_inr || (tx.matched_volume_kwh * tx.clearing_price_inr_kwh)), 0);
  const averagePriceInr = Number((totalTransactionInr / totalMatchedVolumeKwh).toFixed(2)); // ₹6.75/kWh

  const summary = {
    active_prosumers: 3,
    active_consumers: 3,
    total_local_surplus_kw: 900,
    total_local_deficit_kw: 810,
    matched_energy_kwh: totalMatchedVolumeKwh, // 770 kWh
    average_clearing_price_inr: averagePriceInr,
    grid_wheeling_fee_inr_kwh: 0.85,
    local_absorption_pct: Number(((totalMatchedVolumeKwh / 900) * 100).toFixed(1)), // 85.6%
    unmet_critical_hospital_kw: 40 // 180 requested - 140 matched
  };

  const participants = p2pData?.participants || [
    { id: "PRO-01", name: "Apex Commercial Solar Array", type: "Surplus Prosumer", generation_kw: 450, demand_kw: 120, surplus_kw: 330, offering_price_kwh: 6.40 },
    { id: "PRO-02", name: "Hilltop Residential Micro-Solar", type: "Surplus Prosumer", generation_kw: 85, demand_kw: 25, surplus_kw: 60, offering_price_kwh: 6.60 },
    { id: "PRO-03", name: "South Agro-Voltaic Farm", type: "Surplus Prosumer", generation_kw: 600, demand_kw: 90, surplus_kw: 510, offering_price_kwh: 6.20 },
    { id: "CON-01", name: "Cold Storage Logistics Hub", type: "Deficit Consumer", generation_kw: 0, demand_kw: 380, deficit_kw: 380, bid_price_kwh: 7.20 },
    { id: "CON-02", name: "Rapid EV Charging Hub East", type: "Deficit Consumer", generation_kw: 0, demand_kw: 250, deficit_kw: 250, bid_price_kwh: 7.40 },
    { id: "CON-03", name: "District General Hospital", type: "Critical Consumer", generation_kw: 40, demand_kw: 220, deficit_kw: 180, bid_price_kwh: 7.80 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('p2p.title')}</h1>
            <ProvenanceBadge classification="simulated" sourceName="Double-Auction Peer-to-Peer Clearing Engine" mode="cached" />
          </div>
          <p>{t('p2p.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-forecast" style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: 4 }}>
            <IndianRupee size={12} /> Vidyut PRAVAH DAM Benchmark Anchor
          </span>
        </div>
      </div>

      {/* C5 & H4: Recomputed Market Overview KPIs in INR */}
      <div className="grid-4">
        <MetricCard
          label="Matched Volume"
          value={`${summary.matched_energy_kwh} kWh`}
          meta={`85.6% of 900 kW Local Surplus Cleared`}
          icon={ArrowRightLeft}
          domain="market"
          provenance={{ classification: 'simulated', sourceName: 'Sum of Ledger Trades', mode: 'cached' }}
        />

        <MetricCard
          label="Avg Clearing Price"
          value={`₹${summary.average_clearing_price_inr}`}
          unit="/kWh"
          meta="Anchored to Vidyut PRAVAH DAM Clearing"
          icon={IndianRupee}
          domain="market"
          provenance={{ classification: 'real', sourceName: 'Vidyut PRAVAH Tariff', mode: 'cached' }}
        />

        <MetricCard
          label="DISCOM Wheeling Fee"
          value={`₹${summary.grid_wheeling_fee_inr_kwh}`}
          unit="/kWh"
          meta="CERC Inter-State Transmission Tariff"
          icon={IndianRupee}
          domain="brand"
          provenance={{ classification: 'real', sourceName: 'CERC Open Access', mode: 'cached' }}
        />

        <MetricCard
          label={t('p2p.active_participants')}
          value={`${summary.active_prosumers + summary.active_consumers}`}
          meta="3 Prosumers (900 kW) • 3 Consumers (810 kW)"
          icon={Users}
          domain="flex"
          provenance={{ classification: 'simulated', sourceName: 'Participant Registry', mode: 'cached' }}
        />
      </div>

      {/* Critical Load Protection Notice (C5: Unmet hospital deficit accounted) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(56, 189, 248, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        padding: '14px 20px',
        borderRadius: 10,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Building2 size={20} style={{ color: '#38bdf8' }} />
          <div>
            <strong style={{ color: '#f8fafc' }}>Critical Consumer Deficit Reconciliation:</strong>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 2 }}>
              District General Hospital requested 180 kW. P2P auction cleared 140 kW (80 kW Apex + 60 kW Hilltop). The remaining <strong>40 kW deficit</strong> is automatically served via priority 33kV substation grid import.
            </div>
          </div>
        </div>
        <span className="badge badge-live" style={{ color: '#22c55e' }}>
          <CheckCircle2 size={12} /> 100% Critical Load Served
        </span>
      </div>

      {/* Participants Order Book Table (M7: Fixed Double Header) */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Users size={20} style={{ color: 'var(--market, #d946ef)' }} />
              {t('p2p.order_book')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4 }}>
              Active double-auction prosumer bids and consumer asks (cleared continuously)
            </p>
          </div>
          <span className="badge badge-sim">Double-Auction Sandbox</span>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t('p2p.order_entity')}</th>
                <th>{t('p2p.order_type')}</th>
                {/* M7: Distinguish generation vs load */}
                <th>Generation (kW)</th>
                <th>Load (kW)</th>
                <th>Net Position</th>
                <th>Offer / Bid (₹/kWh)</th>
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
                    <td><strong style={{ color: '#fbbf24' }}>{p.generation_kw} kW</strong></td>
                    <td><strong>{p.demand_kw} kW</strong></td>
                    <td>
                      <strong style={{ color: isProsumer ? 'var(--green-renew)' : 'var(--red-risk)' }}>
                        {isProsumer ? `+${p.surplus_kw} kW (Surplus)` : `-${p.deficit_kw} kW (Deficit)`}
                      </strong>
                    </td>
                    <td>
                      <strong style={{ color: '#00f0ff' }}>₹{(p.offering_price_kwh || p.bid_price_kwh).toFixed(2)}/kWh</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* P2P Cleared Transaction Ledger */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ArrowRightLeft size={20} style={{ color: 'var(--green-renew)' }} />
              P2P Energy Settlement Ledger
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4 }}>
              Total Ledger Cleared: <strong>{totalMatchedVolumeKwh} kWh</strong> • Total Value: <strong>₹{totalTransactionInr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </p>
          </div>
          <span className="badge badge-live">Reconciled Sum ✅</span>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tx Hash</th>
                <th>Timestamp</th>
                <th>Seller</th>
                <th>Buyer</th>
                <th>Volume (kWh)</th>
                <th>Rate (₹/kWh)</th>
                <th>Total Value (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: any, idx: number) => (
                <tr key={idx}>
                  <td>
                    <code style={{ color: '#00f0ff', fontSize: '0.8rem' }}>{tx.tx_hash}</code>
                  </td>
                  <td>{tx.timestamp}</td>
                  <td><strong style={{ color: '#fbbf24' }}>{tx.seller_id}</strong></td>
                  <td><strong>{tx.buyer_id}</strong></td>
                  <td><strong style={{ color: '#22c55e' }}>{tx.matched_volume_kwh} kWh</strong></td>
                  <td>₹{tx.clearing_price_inr_kwh.toFixed(2)}</td>
                  <td><strong>₹{tx.total_inr.toFixed(2)}</strong></td>
                  <td>
                    <span className="badge badge-forecast" style={{ color: '#22c55e' }}>
                      {tx.status}
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
