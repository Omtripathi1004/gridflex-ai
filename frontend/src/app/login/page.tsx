'use client';

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  LogOut,
  ArrowRight,
  Lock,
  Zap,
  Activity,
  Sun,
  BatteryCharging,
  Globe,
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login, logout, defaultAccounts, quickLogin } = useAuth();
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
      setSuccessMsg('Authentication verified. Redirecting…');
      setTimeout(() => navigate('/'), 900);
    } else {
      setErrorMsg(res.message || 'Invalid credentials. Use a preset demo account below.');
    }
  };

  const handleQuickSelect = async (account: DefaultAccount) => {
    setErrorMsg(null);
    setLoading(true);
    const ok = await quickLogin(account);
    setLoading(false);
    if (ok) {
      setSuccessMsg(`Logged in as ${account.name}. Redirecting…`);
      setTimeout(() => navigate('/'), 600);
    } else {
      setErrorMsg('Failed to log in with demo account.');
    }
  };

  // Role card visual config
  const roleConfig: Record<string, { cardClass: string; iconColor: string; gradientText: string }> = {
    award: { cardClass: 'card-gold', iconColor: 'var(--gold-accent)', gradientText: 'text-gradient-gold' },
    building: { cardClass: 'card-cyan', iconColor: 'var(--cyan-primary)', gradientText: 'text-gradient-cyan' },
    shield: { cardClass: 'card-purple', iconColor: 'var(--purple-insight)', gradientText: 'text-gradient-purple' },
    users: { cardClass: 'card-emerald', iconColor: 'var(--green-renew)', gradientText: '' },
  };

  const getRoleIcon = (icon: string, color: string) => {
    switch (icon) {
      case 'award': return <Award size={24} color={color} />;
      case 'shield': return <ShieldCheck size={24} color={color} />;
      case 'users': return <Users size={24} color={color} />;
      default: return <Building size={24} color={color} />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background glows */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 20% 30%, rgba(0,240,255,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 80% 70%, rgba(168,85,247,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 40% 30% at 50% 10%, rgba(251,191,36,0.05) 0%, transparent 70%)
        `
      }} />

      {/* Grid dot pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.35,
        backgroundImage: 'radial-gradient(rgba(0,240,255,0.18) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }} />

      {/* ─── LEFT PANEL: Branding ─── */}
      <div
        style={{
          flex: '0 0 42%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 52px',
          position: 'relative',
          zIndex: 1,
          borderRight: '1px solid var(--border-subtle)',
        }}
        className="login-left-panel"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #00f0ff 0%, #0050ff 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 28px rgba(0,240,255,0.45)',
          }}>
            <Zap size={28} color="#070b14" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              GridFlex AI
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Smart Energy Orchestration Platform
            </div>
          </div>
        </div>

        {/* Main heading */}
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.04em' }}>
          <span className="text-gradient-cyan">Power the Grid</span>
          <br />
          <span className="text-gradient-gold">with Intelligence</span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 400, marginBottom: 40 }}>
          ML-driven grid resilience platform — solar &amp; wind forecasting, BESS dispatch, 
          P2P energy trading, digital twin simulation, and explainable AI. Deployed for DISCOM operators across India.
        </p>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 40 }}>
          <div className="card-gold" style={{ padding: '16px 18px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Sun size={16} color="var(--gold-accent)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gold-accent)', letterSpacing: '0.05em' }}>Solar Forecast</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fef08a' }}>42.5 MW</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>0.942 R² Accuracy</div>
          </div>

          <div className="card-emerald" style={{ padding: '16px 18px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <BatteryCharging size={16} color="var(--green-renew)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--green-renew)', letterSpacing: '0.05em' }}>BESS Dispatch</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6ee7b7' }}>9.5 MW</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>120ms Sub-Cycle Response</div>
          </div>

          <div className="card-cyan" style={{ padding: '16px 18px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Activity size={16} color="var(--cyan-primary)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--cyan-primary)', letterSpacing: '0.05em' }}>Carbon Saved</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a5f3fc' }}>14.2 T</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>Zero-Emission Dispatch Stack</div>
          </div>

          <div className="card-purple" style={{ padding: '16px 18px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Globe size={16} color="var(--purple-insight)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--purple-insight)', letterSpacing: '0.05em' }}>Languages</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e9d5ff' }}>15</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>Full i18n Glossary</div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge badge-live">Live Demo</span>
          <span className="badge badge-sim">Hackathon 2026</span>
          <span className="badge badge-forecast">DISCOM Ready</span>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Login Form ─── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 52px',
          position: 'relative',
          zIndex: 1,
          overflowY: 'auto',
        }}
        className="login-right-panel"
      >
        {/* If already logged in */}
        {user && (
          <div
            className="card-cyan"
            style={{ padding: 22, borderRadius: 'var(--radius-lg)', marginBottom: 28 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%',
                  background: 'rgba(0,240,255,0.15)',
                  border: '2px solid var(--cyan-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={22} color="var(--cyan-primary)" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{user.full_name}</h3>
                    <span className="badge badge-live" style={{ fontSize: '0.7rem' }}>Active Session</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {user.role} · {user.organization}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to="/" className="btn btn-primary" style={{ fontSize: '0.85rem', gap: 6 }}>
                  Go to Dashboard <ArrowRight size={14} />
                </Link>
                <button onClick={logout} className="btn btn-secondary" style={{ color: 'var(--red-risk)', fontSize: '0.85rem', gap: 6 }}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="badge" style={{ background: 'rgba(0,240,255,0.12)', color: 'var(--cyan-primary)', border: '1px solid var(--cyan-primary)' }}>
              <Database size={12} style={{ marginRight: 4 }} /> Secure Portal
            </span>
            <span className="badge badge-sim">Multi-Role Auth</span>
          </div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em' }}>
            <span className="text-gradient-gold">Operator</span> &amp; <span className="text-gradient-cyan">Evaluator Login</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Select any preset demo account for 1-click instant access, or sign in with custom credentials.
          </p>
        </div>

        {/* ── Preset Demo Accounts ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <KeyRound size={14} color="var(--gold-accent)" />
            1-Click Demo Accounts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {defaultAccounts.map((acc, idx) => {
              const cfg = roleConfig[acc.icon] || roleConfig['building'];
              const isCurrent = user?.email.toLowerCase() === acc.email.toLowerCase();
              return (
                <div
                  key={idx}
                  className={cfg.cardClass}
                  onClick={() => handleQuickSelect(acc)}
                  style={{
                    padding: '16px 18px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                    outline: isCurrent ? `2px solid ${cfg.iconColor}` : 'none',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  {isCurrent && (
                    <span style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: cfg.iconColor, fontWeight: 700 }}>
                      <CheckCircle2 size={12} /> Active
                    </span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {getRoleIcon(acc.icon, cfg.iconColor)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>{acc.role}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{acc.organization}</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: 8, fontSize: '0.76rem', marginBottom: 10 }}>
                    <div style={{ color: 'var(--text-secondary)' }}>Email: <code style={{ color: cfg.iconColor }}>{acc.email}</code></div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>Pass: <code style={{ color: 'var(--amber-flow)' }}>{acc.password}</code></div>
                  </div>
                  <button
                    className="btn btn-sm"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${cfg.iconColor}40`, color: cfg.iconColor, fontWeight: 700, fontSize: '0.78rem' }}
                    onClick={e => { e.stopPropagation(); handleQuickSelect(acc); }}
                  >
                    ⚡ Quick Login
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Manual Login Form ── */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={16} color="var(--cyan-primary)" />
            Custom Credentials
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 18 }}>
            Sign in with your registered DISCOM operator or researcher account.
          </p>

          {errorMsg && (
            <div style={{ padding: '11px 14px', background: 'rgba(255,0,85,0.1)', border: '1px solid var(--red-risk)', borderRadius: 'var(--radius-md)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--red-risk)', fontSize: '0.84rem' }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: '11px 14px', background: 'rgba(0,255,157,0.1)', border: '1px solid var(--green-renew)', borderRadius: 'var(--radius-md)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green-renew)', fontSize: '0.84rem' }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 5, fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="operator@gridflex.ai"
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--cyan-primary)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 5, fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--cyan-primary)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 700, fontSize: '0.95rem' }}
            >
              {loading ? 'Authenticating…' : 'Sign In to GridFlex AI →'}
            </button>
          </form>
        </div>
      </div>

      {/* Responsive: hide left panel on small screens */}
      <style>{`
        @media (max-width: 900px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { padding: 40px 24px !important; }
        }
        @media (max-width: 480px) {
          .login-right-panel { padding: 24px 16px !important; }
        }
      `}</style>
    </div>
  );
}
