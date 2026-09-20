import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '24px 16px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          {/* Project Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              background: 'var(--cyan-primary)',
              color: '#070b14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={14} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
              GridFlex AI
            </span>
          </div>

          {/* Three Links */}
          <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem' }}>
            <Link 
              to="/architecture" 
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              {language === 'hi' ? 'सिस्टम वास्तुकला' : 'Architecture'}
            </Link>
            <Link 
              to="/resilience" 
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              {language === 'hi' ? 'ग्रिड लचीलापन' : 'Grid Resilience'}
            </Link>
            <Link 
              to="/explainable-ai" 
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              {language === 'hi' ? 'व्याख्यात्मक एआई' : 'Explainable AI'}
            </Link>
          </div>
        </div>

        {/* Attribution Line */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 12,
          fontSize: '0.78rem',
          color: 'var(--text-tertiary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8
        }}>
          <span>Made by Om Tripathi for Yuva Yodha Challenge 3</span>
          <span>Demo data for simulation & testing</span>
        </div>
      </div>
    </footer>
  );
};
