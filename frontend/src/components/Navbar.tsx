'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { checkBackendHealth } from '../lib/api';
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
  MessageSquare, 
  Building2,
  User as UserIcon,
  KeyRound
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, t, supportedLanguages, currentLanguageMeta } = useLanguage();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendHealth().then(status => setBackendOnline(status));
    const interval = setInterval(() => {
      checkBackendHealth().then(status => setBackendOnline(status));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { href: '/', label: t('nav.landing'), icon: Activity },
    { href: '/command-center', label: t('nav.command_center'), icon: Zap },
    { href: '/renewable-forecast', label: t('nav.renewable_forecast'), icon: Sun },
    { href: '/demand-forecast', label: t('nav.demand_forecast'), icon: TrendingUp },
    { href: '/flexibility', label: t('nav.flexibility'), icon: Sliders },
    { href: '/storage', label: t('nav.storage'), icon: BatteryCharging },
    { href: '/p2p', label: t('nav.p2p'), icon: Share2 },
    { href: '/digital-twin', label: t('nav.digital_twin'), icon: Sliders },
    { href: '/resilience', label: t('nav.resilience'), icon: ShieldCheck },
    { href: '/explainable-ai', label: t('nav.explainable_ai'), icon: Cpu },
    { href: '/discom', label: t('nav.discom'), icon: Building2 },
    { href: '/judge-mode', label: t('nav.judge_mode'), icon: HelpCircle },
    { href: '/copilot', label: t('nav.copilot'), icon: MessageSquare },
    { href: '/architecture', label: t('nav.architecture'), icon: Layers },
    { href: '/login', label: t('nav.login', 'Sign In / Portal'), icon: KeyRound },
  ];

  return (
    <header className="navbar">
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

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          {navItems.slice(0, 7).map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}

          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Link
              href="/digital-twin"
              className={`nav-item ${pathname === '/digital-twin' ? 'active' : ''}`}
              style={{ color: 'var(--amber-flow)', fontWeight: 600 }}
            >
              ⚡ {t('nav.digital_twin')}
            </Link>
          </div>

          <Link
            href="/judge-mode"
            className={`btn btn-sm ${pathname === '/judge-mode' ? 'btn-amber' : 'btn-secondary'}`}
            style={{ marginLeft: 6, fontSize: '0.8rem' }}
          >
            🎯 {t('nav.judge_mode')}
          </Link>
        </nav>

        {/* Right Section: API Status & 15-Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Backend Status Badge */}
          <div 
            className={`badge ${backendOnline ? 'badge-live' : 'badge-sim'} desktop-only`}
            title={backendOnline ? "Connected to FastAPI Backend (127.0.0.1:8008)" : "Operating on seeded realistic ML baseline data"}
          >
            {backendOnline ? t('badge.api_connected') : t('badge.api_offline')}
          </div>

          {/* User Auth Profile Pill / Login */}
          {user ? (
            <Link
              href="/login"
              className="desktop-only"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 20,
                background: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid var(--border-medium)',
                color: 'var(--cyan-primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
              title={`Signed in as ${user.full_name} (${user.role})`}
            >
              <UserIcon size={14} />
              <span>{user.full_name.split(' ')[0]}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                ({user.role.includes('Judge') ? 'Judge' : user.role.includes('Operator') ? 'Operator' : 'User'})
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="desktop-only btn btn-sm btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.8rem',
                padding: '5px 12px'
              }}
            >
              <KeyRound size={14} color="var(--amber-flow)" />
              <span>{t('nav.login', 'Sign In')}</span>
            </Link>
          )}

          {/* 15-Language Selector */}
          <div className="lang-selector-wrapper">
            <Globe size={16} style={{ position: 'absolute', left: 10, pointerEvents: 'none', color: 'var(--cyan-primary)' }} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="lang-select"
              style={{ paddingLeft: 32 }}
              aria-label={t('nav.lang_label')}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.nativeName} ({lang.name})
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
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
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
            padding: '24px 20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`badge ${backendOnline ? 'badge-live' : 'badge-sim'}`}>
              {backendOnline ? t('badge.api_connected') : t('badge.api_offline')}
            </span>
          </div>

          {navItems.map((item) => {
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
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? 'var(--cyan-primary)' : 'var(--text-primary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '1rem',
                  border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
