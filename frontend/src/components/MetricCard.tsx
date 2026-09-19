'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  meta?: string;
  icon?: LucideIcon;
  variant?: 'cyan' | 'amber' | 'green' | 'red' | 'default';
  badgeText?: string;
  badgeType?: 'live' | 'sim' | 'forecast' | 'risk';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  meta,
  icon: Icon,
  variant = 'default',
  badgeText,
  badgeType = 'sim',
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'cyan': return 'var(--border-medium)';
      case 'amber': return 'var(--border-amber)';
      case 'green': return 'rgba(16, 185, 129, 0.35)';
      case 'red': return 'rgba(239, 68, 68, 0.35)';
      default: return 'var(--border-subtle)';
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case 'cyan': return 'var(--cyan-primary)';
      case 'amber': return 'var(--amber-flow)';
      case 'green': return 'var(--green-renew)';
      case 'red': return 'var(--red-risk)';
      default: return 'var(--text-primary)';
    }
  };

  return (
    <div 
      className="metric-card"
      style={{ borderColor: getBorderColor() }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="metric-label">
          {Icon && <Icon size={16} style={{ color: getValueColor() }} />}
          {label}
        </span>
        {badgeText && (
          <span className={`badge badge-${badgeType}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="metric-val-row">
        <span className="metric-value" style={{ color: getValueColor() }}>
          {value}
        </span>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>

      {meta && <span className="metric-meta">{meta}</span>}
    </div>
  );
};
