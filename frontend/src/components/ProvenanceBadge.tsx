'use client';

import React, { useState } from 'react';
import { ShieldCheck, Database, Radio, Clock, ExternalLink, Info } from 'lucide-react';

export interface ProvenanceBadgeProps {
  classification: 'real' | 'scaled_real' | 'forecast' | 'simulated';
  sourceName?: string;
  sourceUrl?: string;
  timestamp?: string;
  mode?: 'live' | 'cached' | 'seeded';
  compact?: boolean;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  classification,
  sourceName = 'GridFlex Calibration Engine',
  sourceUrl,
  timestamp = '2026-09-20T05:30:00+05:30',
  mode = 'cached',
  compact = false
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStyle = () => {
    switch (classification) {
      case 'real':
        return {
          bg: 'rgba(34, 197, 94, 0.14)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          color: '#22c55e',
          label: 'Real'
        };
      case 'scaled_real':
        return {
          bg: 'rgba(6, 182, 212, 0.14)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          color: '#06b6d4',
          label: 'Scaled Real'
        };
      case 'forecast':
        return {
          bg: 'rgba(139, 92, 246, 0.14)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          color: '#a78bfa',
          label: 'Forecast'
        };
      case 'simulated':
      default:
        return {
          bg: 'rgba(245, 158, 11, 0.14)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          color: '#fbbf24',
          label: 'Simulated'
        };
    }
  };

  const style = getStyle();

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: compact ? '2px 7px' : '3px 10px',
          borderRadius: 9999,
          fontSize: compact ? '0.70rem' : '0.74rem',
          fontWeight: 600,
          background: style.bg,
          border: style.border,
          color: style.color,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          outline: 'none',
          whiteSpace: 'nowrap'
        }}
        title={`Provenance: ${style.label} (${mode}) — Click for source verification`}
      >
        {mode === 'live' && (
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: style.color,
            boxShadow: `0 0 6px ${style.color}`,
            animation: 'pulse 1.5s infinite'
          }} />
        )}
        {mode === 'cached' && <Clock size={11} />}
        {mode === 'seeded' && <Database size={11} />}
        <span>{style.label}</span>
      </button>

      {showDetails && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 999,
            width: 260,
            background: 'var(--surface, #111832)',
            border: '1px solid var(--border, #1F2A4A)',
            borderRadius: 8,
            padding: 12,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            fontSize: '0.78rem',
            color: 'var(--text, #E6EAF5)',
            lineHeight: 1.4
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <strong style={{ color: style.color }}>Data Provenance</strong>
            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', opacity: 0.8 }}>{mode} mode</span>
          </div>
          <p style={{ margin: '4px 0', color: 'var(--muted, #94a3b8)' }}>
            <strong>Source:</strong> {sourceName}
          </p>
          <p style={{ margin: '4px 0', color: 'var(--muted, #94a3b8)' }}>
            <strong>Timestamp:</strong> {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 6,
                color: 'var(--brand, #4F46E5)',
                textDecoration: 'underline',
                fontSize: '0.74rem'
              }}
            >
              Verify Source <ExternalLink size={10} />
            </a>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowDetails(false); }}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 8,
              padding: '4px 0',
              fontSize: '0.72rem',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: 4,
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
