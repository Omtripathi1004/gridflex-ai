'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Zap, ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '40px 28px 30px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="brand-icon" style={{ width: 30, height: 30 }}>
              <Zap size={18} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t('brand.name')}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>| {t('brand.tagline')}</span>
          </div>

          <div style={{ display: 'flex', gap: 18, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            <Link to="/architecture" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Code2 size={15} /> {t('nav.architecture')}
            </Link>
            <Link to="/resilience" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={15} /> {t('nav.resilience')}
            </Link>
            <Link to="/explainable-ai" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Cpu size={15} /> {t('nav.explainable_ai')}
            </Link>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: '0.8rem',
          color: 'var(--text-tertiary)'
        }}>
          <p>{t('footer.copyright')}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="badge badge-sim">{t('badge.simulation')}</span>
            <span className="badge badge-forecast">{t('badge.forecast')}</span>
            <span className="badge badge-live">{t('badge.real_data')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
