'use client';

import React, { useState } from 'react';
import { useAuth, DefaultAccount } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, 
  KeyRound, 
  User, 
  Building, 
  Award, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  RotateCw, 
  LogOut, 
  ArrowRight,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { 
    user, 
    login, 
    logout, 
    loginRecords, 
    defaultAccounts, 
    fetchRecords, 
    quickLogin 
  } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      setSuccessMsg('Authentication verified. Welcome to GridFlex AI.');
    } else {
      setErrorMsg(res.message || 'Invalid credentials. Please verify or use a preset demo account.');
    }
  };

  const handleQuickSelect = async (account: DefaultAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setErrorMsg(null);
    setLoading(true);
    const ok = await quickLogin(account);
    setLoading(false);
    if (ok) {
      setSuccessMsg(`Logged in as ${account.name} (${account.role})`);
    } else {
      setErrorMsg('Failed to log in with demo account.');
    }
  };

  const getRoleIcon = (icon: string) => {
    switch (icon) {
      case 'award':
        return <Award size={22} color="var(--amber-flow)" />;
      case 'shield':
        return <ShieldCheck size={22} color="var(--green-optimal)" />;
      case 'users':
        return <Users size={22} color="var(--purple-insight)" />;
      default:
        return <Building size={22} color="var(--cyan-primary)" />;
    }
  };

  return (
    <div className="container" style={{ padding: '36px 20px', maxWidth: 1200 }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span className="badge badge-live">
            <Database size={13} style={{ marginRight: 4 }} />
            {t('login.badge_auth')}
          </span>
          <span className="badge badge-sim">{t('login.audit_trail')}</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: 12 }}>
          {t('login.title', 'GridFlex Operator & Evaluator Portal')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 680, margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
          {t('login.subtitle', 'Access the smart energy orchestration suite with multi-role authorization. Select any preset demo account below for 1-click instant login or sign in with custom credentials. All access events are audited to the SQLite database.')}
        </p>
      </div>

      {/* Active User Session Card (if logged in) */}
      {user && (
        <div 
          className="card" 
          style={{ 
            marginBottom: 32, 
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(157, 0, 255, 0.08) 100%)',
            border: '1px solid var(--border-medium)',
            padding: 24
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div 
                style={{ 
                  width: 52, 
                  height: 52, 
                  borderRadius: '50%', 
                  background: 'rgba(0, 240, 255, 0.15)',
                  border: '2px solid var(--cyan-primary)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <User size={26} color="var(--cyan-primary)" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.full_name}</h3>
                  <span className="badge badge-live" style={{ fontSize: '0.75rem' }}>{t('login.active_session')}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  <strong>{t('login.role')}:</strong> {user.role} &nbsp;|&nbsp; <strong>{t('login.org')}:</strong> {user.organization} &nbsp;|&nbsp; <strong>{t('login.email')}:</strong> {user.email}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/command-center" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Open Command Center <ArrowRight size={16} />
              </Link>
              <button 
                onClick={logout} 
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--red-alert)' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preset Demo Accounts Section */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <KeyRound size={20} color="var(--amber-flow)" />
              {t('login.preset_title', 'Preset Demo Accounts (1-Click Instant Login)')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Click any profile card to automatically populate and authenticate instantly:
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {defaultAccounts.map((acc, idx) => {
            const isCurrent = user?.email.toLowerCase() === acc.email.toLowerCase();
            return (
              <div 
                key={idx}
                className="card"
                onClick={() => handleQuickSelect(acc)}
                style={{
                  padding: 20,
                  cursor: 'pointer',
                  border: isCurrent ? '2px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                  background: isCurrent ? 'rgba(0, 240, 255, 0.08)' : 'var(--bg-card)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {isCurrent && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      color: 'var(--cyan-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <CheckCircle2 size={14} /> Signed In
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div 
                    style={{ 
                      width: 42, 
                      height: 42, 
                      borderRadius: 'var(--radius-md)', 
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getRoleIcon(acc.icon)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{acc.role}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{acc.organization}</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: 12, fontSize: '0.82rem' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>{t('login.email')}: <code style={{ color: 'var(--cyan-primary)' }}>{acc.email}</code></div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{t('login.password')}: <code style={{ color: 'var(--amber-flow)' }}>{acc.password}</code></div>
                </div>

                <button 
                  className="btn btn-sm btn-secondary" 
                  style={{ width: '100%', fontSize: '0.8rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickSelect(acc);
                  }}
                >
                  ⚡ {t('login.btn_quick_login')}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Login Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 48 }}>
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={18} color="var(--cyan-primary)" />
            {t('login.custom_auth')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 20 }}>
            Sign in with your registered DISCOM operator or researcher account.
          </p>

          {errorMsg && (
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(255, 0, 85, 0.12)', 
              border: '1px solid var(--red-alert)', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: 'var(--red-alert)',
              fontSize: '0.88rem'
            }}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(0, 255, 157, 0.12)', 
              border: '1px solid var(--green-optimal)', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: 'var(--green-optimal)',
              fontSize: '0.88rem'
            }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.88rem', fontWeight: 600 }}>
                Email Address
              </label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.placeholder_email')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.88rem', fontWeight: 600 }}>
                {t('login.password')}
              </label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.placeholder_pass')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px 18px', fontWeight: 700 }}
            >
              {loading ? 'Authenticating...' : t('login.btn_signin', 'Sign In to GridFlex')}
            </button>
          </form>
        </div>

        {/* Database & Security Info Card */}
        <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Database size={22} color="var(--purple-insight)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t('login.sqlite_arch')}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 16 }}>
              {t('login.sqlite_desc')}
            </p>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: 'var(--amber-flow)' }}>
                {t('login.db_schema')}
              </div>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: 16, lineHeight: 1.6 }}>
                <li><code>users</code>: id, email, password_hash (SHA-256), full_name, role, organization, created_at</li>
                <li><code>login_records</code>: id, user_id, email, full_name, role, login_time, ip_address, status, session_token</li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/command-center" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem' }}>
              Command Center
            </Link>
            <Link href="/judge-mode" className="btn btn-amber" style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem' }}>
              Judge Mode
            </Link>
          </div>
        </div>
      </div>

      {/* Database Audit Log Section */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={18} color="var(--cyan-primary)" />
              {t('login.audit_title', 'Live SQLite Database Login Records')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Verifiable audit trail queried directly from <code style={{ color: 'var(--cyan-primary)' }}>login_records</code> table:
            </p>
          </div>
          <button 
            onClick={fetchRecords} 
            className="btn btn-sm btn-secondary" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <RotateCw size={14} /> Refresh Audit Log
          </button>
        </div>

        {loginRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-secondary)' }}>
            No login records found in database yet. Log in above to register the first audit record.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px 12px' }}>ID</th>
                  <th style={{ padding: '10px 12px' }}>Timestamp</th>
                  <th style={{ padding: '10px 12px' }}>User Name</th>
                  <th style={{ padding: '10px 12px' }}>Role</th>
                  <th style={{ padding: '10px 12px' }}>Email</th>
                  <th style={{ padding: '10px 12px' }}>IP Address</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loginRecords.map((rec) => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--cyan-primary)', fontWeight: 600 }}>#{rec.id}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{rec.login_time}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{rec.full_name || 'Guest User'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="badge badge-sim" style={{ fontSize: '0.72rem' }}>{rec.role}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{rec.email}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{rec.ip_address}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span 
                        style={{ 
                          color: rec.status.includes('SUCCESS') ? 'var(--green-optimal)' : 'var(--red-alert)',
                          fontWeight: 700,
                          fontSize: '0.78rem'
                        }}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
