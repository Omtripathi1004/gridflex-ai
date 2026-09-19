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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                padding: 6,
              }}
              aria-label={t('nav.toggle_menu')}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: 'var(--header-height)',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(7, 11, 20, 0.98)',
              zIndex: 999,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={() => { setTrustCenterOpen(true); setMobileMenuOpen(false); }}
              className="btn btn-secondary"
              style={{ justifyContent: 'center', marginBottom: 8 }}
            >
              <ShieldCheck size={16} style={{ color: '#10b981' }} /> Data Trust Center
            </button>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: pathname === '/' ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                color: pathname === '/' ? 'var(--cyan-primary)' : 'var(--text-primary)',
                fontWeight: pathname === '/' ? 700 : 500,
                fontSize: '0.92rem',
                border: pathname === '/' ? '1px solid var(--border-medium)' : '1px solid transparent',
              }}
            >
              <Zap size={16} />
              <span>Overview</span>
            </Link>

            {navGroups.flatMap(g => g.items).map((item) => {
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
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? 'var(--cyan-primary)' : 'var(--text-primary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.92rem',
                    border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Data Trust Center Modal */}
      <DataTrustCenterModal
        isOpen={trustCenterOpen}
        onClose={() => setTrustCenterOpen(false)}
      />
    </>
  );
};
