'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { checkBackendHealth } from '../lib/api';
import { DataTrustCenterModal } from './DataTrustCenterModal';
import { 
  Zap, 
  Globe, 
  Menu, 
  X, 
  Activity, 
  Sun, 
  TrendingUp, 
  Sliders, 
  BatteryCharging, 
  Share2, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  HelpCircle, 
  KeyRound,
  User as UserIcon,
  ChevronDown,
  Eye,
  Map,
  Scale,
  MessageSquare,
  Radio
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [trustCenterOpen, setTrustCenterOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    checkBackendHealth().then(status => setBackendOnline(status));
    const interval = setInterval(() => {
      checkBackendHealth().then(status => setBackendOnline(status));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const navGroups = [
    {
      key: 'operate',
      label: 'Operate',
      items: [
        { href: '/command-center', label: t('nav.command_center'), icon: Zap },
        { href: '/digital-twin', label: t('nav.digital_twin'), icon: Sliders }
      ]
    },
    {
      key: 'forecast',
      label: 'Forecast',
      items: [
        { href: '/renewable-forecast', label: t('nav.renewable_forecast'), icon: Sun },
        { href: '/demand-forecast', label: t('nav.demand_forecast'), icon: TrendingUp }
      ]
    },
    {
      key: 'optimize',
      label: 'Optimize',
      items: [
        { href: '/flexibility', label: t('nav.flexibility'), icon: Sliders },
        { href: '/storage', label: t('nav.storage'), icon: BatteryCharging },
        { href: '/p2p', label: t('nav.p2p'), icon: Share2 }
      ]
    },
    {
      key: 'trust',
      label: 'Trust & Audits',
      items: [
        { href: '/resilience', label: t('nav.resilience'), icon: ShieldCheck },
        { href: '/explainable-ai', label: t('nav.explainable_ai'), icon: Cpu },
        { href: '/architecture', label: t('nav.architecture'), icon: Layers },
        { href: '/about', label: 'About & Directory', icon: HelpCircle }
      ]
    },
    {
      key: 'engines',
      label: 'AI Engines',
      items: [
        { href: '/sky-vision', label: 'SkyVision Radar', icon: Eye },
        { href: '/self-healing', label: 'Self-Healing Grid', icon: Radio },
        { href: '/spatial-twin', label: 'Spatial Twin', icon: Map },
        { href: '/tariff-engine', label: 'Tariff Engine', icon: Scale },
        { href: '/incident-copilot', label: 'Incident Co-pilot', icon: MessageSquare }
      ]
    }
  ];

  return (
    <>
      <header className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="navbar-inner">
          {/* Brand */}
          <Link href="/" className="nav-brand">
            <div className="brand-icon">
              <Zap size={22} />
            </div>
            <div>
              <span>{t('brand.name')}</span>
            </div>
          </Link>

          {/* Grouped Desktop Navigation */}
          <nav className="nav-links">
            <Link 
              href="/" 
              className={`nav-item ${pathname === '/' ? 'active' : ''}`}
            >
              Overview
            </Link>

            <Link 
              href="/about" 
              className={`nav-item ${pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>

            {navGroups.map(group => {
              const hasActiveItem = group.items.some(it => it.href === pathname);
              return (
                <div 
                  key={group.key}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setOpenDropdown(group.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    className={`nav-item ${hasActiveItem ? 'active' : ''}`}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      fontSize: '0.88rem'
                    }}
                  >
                    <span>{group.label}</span>
                    <ChevronDown size={12} style={{ opacity: 0.7 }} />
                  </button>

                  {openDropdown === group.key && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        background: 'var(--surface, #111832)',
                        border: '1px solid var(--border, #1F2A4A)',
                        borderRadius: 10,
                        padding: '8px 6px',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                        minWidth: 200,
                        zIndex: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                      }}
                    >
                      {group.items.map(item => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setOpenDropdown(null)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '8px 12px',
                              borderRadius: 6,
                              fontSize: '0.84rem'
                            }}
                          >
                            <Icon size={14} style={{ color: isActive ? 'var(--cyan-primary)' : 'var(--text-secondary)' }} />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Direct Link to Digital Twin */}
            <Link
              href="/digital-twin"
              className={`nav-item ${pathname === '/digital-twin' ? 'active' : ''}`}
              style={{ color: 'var(--amber-flow)', fontWeight: 600 }}
            >
              ⚡ {t('nav.digital_twin')}
            </Link>

            {/* Data Trust Center Modal Trigger */}
            <button
              type="button"
              onClick={() => setTrustCenterOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}
              title="Open Data Trust Center & Provenance Matrix"
            >
              <ShieldCheck size={14} style={{ color: '#10b981' }} />
              <span>Trust Center</span>
            </button>

            {/* Judge Mode Highlight Button */}
            <Link
              href="/judge-mode"
              className={`btn btn-sm ${pathname === '/judge-mode' ? 'btn-amber' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem' }}
            >
              🎯 {t('nav.judge_mode')}
            </Link>
          </nav>

          {/* Right Section: API Status, Login, Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div 
              className={`badge ${backendOnline ? 'badge-live' : 'badge-sim'} desktop-only`}
              title={backendOnline ? "Connected to FastAPI Backend (127.0.0.1:8008)" : "Operating on seeded realistic ML baseline data"}
              style={{ fontSize: '0.72rem' }}
            >
              {backendOnline ? t('badge.api_connected') : t('badge.api_offline')}
            </div>

            {user ? (
              <Link
                href="/login"
                className="desktop-only"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: 'rgba(0, 240, 255, 0.12)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--cyan-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <UserIcon size={13} />
                <span>{user.full_name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="desktop-only btn btn-sm btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: '0.76rem',
                  padding: '4px 10px'
                }}
              >
                <KeyRound size={13} color="var(--amber-flow)" />
                <span>Sign In</span>
              </Link>
            )}

            {/* 15-Language Selector */}
            <div className="lang-selector-wrapper">
              <Globe size={15} style={{ position: 'absolute', left: 8, pointerEvents: 'none', color: 'var(--cyan-primary)' }} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="lang-select"
                style={{ paddingLeft: 28, fontSize: '0.76rem' }}
                aria-label={t('nav.lang_label')}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Dedicated Sidewise 3-Dot Quick Navigator Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: mobileMenuOpen ? '1px solid var(--cyan-primary)' : '1px solid var(--border-medium)',
                background: mobileMenuOpen ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title="All Pages & Modules Navigator"
              aria-label={t('nav.toggle_menu', 'Toggle Navigation Drawer')}
            >
              <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--cyan-primary)' }} />
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--amber-flow)' }} />
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--pink-accent)' }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Side Navigation Drawer (Mounted outside header to bypass backdrop-filter bug) */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(3, 7, 18, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: 'min(440px, 94vw)',
              height: '100%',
              background: 'linear-gradient(180deg, #0d1424 0%, #070b14 100%)',
              borderLeft: '1px solid rgba(0, 240, 255, 0.25)',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ 
              padding: '20px 24px', 
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 240, 255, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#070b14'
                }}>
                  <Zap size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>GridFlex AI</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Master Platform Directory</span>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Action Shortcuts */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Link
                href="/judge-mode"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-amber btn-sm"
                style={{ justifyContent: 'center', fontSize: '0.8rem' }}
              >
                🎯 Judge Tour
              </Link>
              <button
                type="button"
                onClick={() => { setTrustCenterOpen(true); setMobileMenuOpen(false); }}
                className="btn btn-emerald btn-sm"
                style={{ justifyContent: 'center', fontSize: '0.8rem' }}
              >
                🛡️ Trust Center
              </button>
            </div>

            {/* Scrollable Nav Groups */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Primary Direct Links */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: pathname === '/' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: pathname === '/' ? 'var(--cyan-primary)' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    border: pathname === '/' ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)'
                  }}
                >
                  <Zap size={15} color="var(--cyan-primary)" />
                  <span>Overview</span>
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: pathname === '/about' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: pathname === '/about' ? '#c084fc' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    border: pathname === '/about' ? '1px solid #a855f7' : '1px solid var(--border-subtle)'
                  }}
                >
                  <HelpCircle size={15} color="#c084fc" />
                  <span>About & Guide</span>
                </Link>
              </div>

              {/* Categorized Modules */}
              {navGroups.map((group) => (
                <div key={group.key}>
                  <div style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.08em',
                    color: 'var(--text-tertiary)',
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{group.label}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.6 }}>{group.items.length} Modules</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-md)',
                            background: isActive ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)' : 'rgba(255, 255, 255, 0.03)',
                            color: isActive ? 'var(--cyan-primary)' : 'var(--text-primary)',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.88rem',
                            border: isActive ? '1px solid var(--cyan-primary)' : '1px solid transparent',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icon size={16} style={{ color: isActive ? 'var(--cyan-primary)' : 'var(--text-secondary)' }} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <span style={{ fontSize: '0.7rem', color: 'var(--cyan-primary)' }}>● Active</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Login / Portal Link in Drawer */}
              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(251, 191, 36, 0.12)',
                    border: '1px solid var(--border-amber)',
                    color: 'var(--amber-flow)',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}
                >
                  <KeyRound size={16} />
                  <span>{user ? `Logged in: ${user.full_name}` : 'Operator Portal & Instant Demo Login'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Trust Center Modal */}
      <DataTrustCenterModal
        isOpen={trustCenterOpen}
        onClose={() => setTrustCenterOpen(false)}
      />
    </>
  );
};
