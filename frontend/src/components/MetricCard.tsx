'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ProvenanceBadge } from './ProvenanceBadge';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  meta?: string;
  icon?: LucideIcon;
  variant?: 'cyan' | 'amber' | 'green' | 'red' | 'default';
  domain?: 'solar' | 'wind' | 'load' | 'storage' | 'flex' | 'market' | 'brand';
  badgeText?: string;
  badgeType?: 'live' | 'sim' | 'forecast' | 'risk';
  provenance?: {
    classification: 'real' | 'scaled_real' | 'forecast' | 'simulated';
    sourceName?: string;
    sourceUrl?: string;
    timestamp?: string;
    mode?: 'live' | 'cached' | 'seeded';
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  meta,
  icon: Icon,
  variant = 'default',
  domain,
  badgeText,
  badgeType = 'sim',
  provenance
}) => {
  const getValueColor = () => {
    if (domain) {
      switch (domain) {
        case 'solar': return 'var(--solar, #f59e0b)';
        case 'wind': return 'var(--wind, #06b6d4)';
        case 'load': return 'var(--load, #f43f5e)';
        case 'storage': return 'var(--storage, #10b981)';
        case 'flex': return 'var(--flex, #8b5cf6)';
        case 'market': return 'var(--market, #d946ef)';
        case 'brand': return 'var(--brand, #4f46e5)';
      }
    }
    switch (variant) {
      case 'cyan': return 'var(--cyan-primary)';
      case 'amber': return 'var(--amber-flow)';
      case 'green': return 'var(--green-renew)';
      case 'red': return 'var(--red-risk)';
      default: return 'var(--text-primary)';
    }
  };

  const domainClass = domain ? `kpi ${domain}` : 'metric-card';

  return (
    <div 
      className={domainClass}
      style={{ padding: '18px 20px', borderRadius: 12 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 6 }}>
        <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {Icon && <Icon size={16} style={{ color: getValueColor() }} />}
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {provenance ? (
            <ProvenanceBadge
              classification={provenance.classification}
              sourceName={provenance.sourceName}
              sourceUrl={provenance.sourceUrl}
              timestamp={provenance.timestamp}
              mode={provenance.mode}
              compact
            />
          ) : (
            badgeText && (
              <span className={`badge badge-${badgeType}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                {badgeText}
              </span>
            )
          )}
        </div>
      </div>

      <div className="metric-val-row" style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="metric-value" style={{ color: getValueColor(), fontSize: '1.75rem', fontWeight: 800 }}>
          {value}
        </span>
        {unit && <span className="metric-unit" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{unit}</span>}
      </div>

      {meta && <span className="metric-meta" style={{ display: 'block', marginTop: 6, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{meta}</span>}
    </div>
  );
};
