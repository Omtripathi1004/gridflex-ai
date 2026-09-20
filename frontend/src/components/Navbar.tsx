import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Zap, 
  Menu, 
  X, 
  ChevronDown,
  User,
  Sliders,
  Sun,
  TrendingUp,
  BatteryCharging,
  Share2,
  Activity
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const forecastItems = [
    { href: '/renewable-forecast', label: language === 'hi' ? 'नवीकरणीय पूर्वानुमान' : 'Renewable Forecast', icon: Sun },
    { href: '/demand-forecast', label: language === 'hi' ? 'मांग पूर्वानुमान' : 'Demand Forecast', icon: TrendingUp },
  ];

  const gridToolItems = [
    { href: '/flexibility', label: language === 'hi' ? 'लचीलापन प्रेषण' : 'Flexibility Engine', icon: Sliders },
    { href: '/storage', label: language === 'hi' ? 'वर्चुअल बैटरी स्टोरेज' : 'Virtual Storage', icon: BatteryCharging },
    { href: '/p2p', label: language === 'hi' ? 'पी2पी ऊर्जा व्यापार' : 'P2P Coordination', icon: Share2 },
  ];

  const isForecastActive = forecastItems.some(item => item.href === pathname);
  const isGridToolsActive = gridToolItems.some(item => item.href === pathname);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      height: 64,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: 1200,
        width: '100%',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        {/* Left: Brand */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
          color: 'var(--text-primary)',
          fontWeight: 700,
          fontSize: '1.05rem'
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: 'var(--cyan-primary)',
            color: '#070b14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={18} />
          </div>
          <span>GridFlex AI</span>
        </Link>

        {/* Centre: Desktop Navigation (At most 5 items) */}
        <nav className="desktop-only" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <Link
            to="/"
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: '0.88rem',
              color: pathname === '/' ? 'var(--cyan-primary)' : 'var(--text-secondary)',
              background: pathname === '/' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              fontWeight: pathname === '/' ? 600 : 500
            }}
          >
            {language === 'hi' ? 'अवलोकन' : 'Overview'}
          </Link>

          <Link
            to="/command-center"
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: '0.88rem',
              color: pathname === '/command-center' ? 'var(--cyan-primary)' : 'var(--text-secondary)',
              background: pathname === '/command-center' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              fontWeight: pathname === '/command-center' ? 600 : 500
            }}
          >
            {language === 'hi' ? 'कमांड सेंटर' : 'Command Center'}
          </Link>

          {/* Forecasts Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setOpenDropdown('forecasts')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: 'none',
                background: isForecastActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                color: isForecastActive ? 'var(--cyan-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: isForecastActive ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>{language === 'hi' ? 'पूर्वानुमान' : 'Forecasts'}</span>
              <ChevronDown size={14} />
            </button>

            {openDropdown === 'forecasts' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                minWidth: 190,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 6,
                padding: 6,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                {forecastItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 4,
                        textDecoration: 'none',
                        fontSize: '0.84rem',
                        color: isActive ? 'var(--cyan-primary)' : 'var(--text-secondary)',
                        background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Grid Tools Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setOpenDropdown('gridtools')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: 'none',
                background: isGridToolsActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                color: isGridToolsActive ? 'var(--cyan-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: isGridToolsActive ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>{language === 'hi' ? 'ग्रिड टूल्स' : 'Grid Tools'}</span>
              <ChevronDown size={14} />
            </button>

            {openDropdown === 'gridtools' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                minWidth: 190,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 6,
                padding: 6,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                {gridToolItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 4,
                        textDecoration: 'none',
                        fontSize: '0.84rem',
                        color: isActive ? 'var(--cyan-primary)' : 'var(--text-secondary)',
                        background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            to="/digital-twin"
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: '0.88rem',
              color: pathname === '/digital-twin' ? 'var(--cyan-primary)' : 'var(--text-secondary)',
              background: pathname === '/digital-twin' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              fontWeight: pathname === '/digital-twin' ? 600 : 500
            }}
          >
            {language === 'hi' ? 'डिजिटल ट्विन' : 'Digital Twin'}
          </Link>
        </nav>

        {/* Right Section: EN | HI toggle, Judge Mode, Sign In */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Simple EN | HI toggle */}
          <div style={{
            display: 'inline-flex',
            borderRadius: 6,
            border: '1px solid var(--border-subtle)',
            background: 'rgba(0, 0, 0, 0.2)',
            overflow: 'hidden'
          }}>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              style={{
                padding: '4px 8px',
                border: 'none',
                background: language === 'en' ? 'var(--cyan-primary)' : 'transparent',
                color: language === 'en' ? '#070b14' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              style={{
                padding: '4px 8px',
                border: 'none',
                background: language === 'hi' ? 'var(--cyan-primary)' : 'transparent',
                color: language === 'hi' ? '#070b14' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              HI
            </button>
          </div>

          {/* Normal outlined Judge Mode button */}
          <Link
            to="/judge-mode"
            className="desktop-only"
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              color: pathname === '/judge-mode' ? 'var(--cyan-primary)' : 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 500,
              background: pathname === '/judge-mode' ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
            }}
          >
            {language === 'hi' ? 'जज मोड' : 'Judge Mode'}
          </Link>

          {/* Sign In Button */}
          <Link
            to="/login"
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid var(--cyan-primary)',
              background: pathname === '/login' ? 'var(--cyan-primary)' : 'transparent',
              color: pathname === '/login' ? '#070b14' : 'var(--cyan-primary)',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <User size={14} />
            <span>{user ? user.full_name : (language === 'hi' ? 'लॉग इन' : 'Sign In')}</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: 8,
              minWidth: 44,
              minHeight: 44,
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Tap targets >= 44px) */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(7, 11, 20, 0.98)',
          zIndex: 999,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          overflowY: 'auto'
        }}>
          <Link
            to="/"
            style={{
              padding: '12px 14px',
              minHeight: 44,
              borderRadius: 6,
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              background: pathname === '/' ? 'rgba(255, 255, 255, 0.06)' : 'transparent'
            }}
          >
            {language === 'hi' ? 'अवलोकन' : 'Overview'}
          </Link>

          <Link
            to="/command-center"
            style={{
              padding: '12px 14px',
              minHeight: 44,
              borderRadius: 6,
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              background: pathname === '/command-center' ? 'rgba(255, 255, 255, 0.06)' : 'transparent'
            }}
          >
            {language === 'hi' ? 'कमांड सेंटर' : 'Command Center'}
          </Link>

          <div style={{
            fontSize: '0.76rem',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginTop: 8,
            paddingLeft: 14
          }}>
            {language === 'hi' ? 'पूर्वानुमान' : 'Forecasts'}
          </div>
          {forecastItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              style={{
                padding: '10px 14px',
                minHeight: 44,
                borderRadius: 6,
                textDecoration: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: pathname === item.href ? 'rgba(255, 255, 255, 0.06)' : 'transparent'
              }}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </Link>
          ))}

          <div style={{
            fontSize: '0.76rem',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginTop: 8,
            paddingLeft: 14
          }}>
            {language === 'hi' ? 'ग्रिड टूल्स' : 'Grid Tools'}
          </div>
          {gridToolItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              style={{
                padding: '10px 14px',
                minHeight: 44,
                borderRadius: 6,
                textDecoration: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: pathname === item.href ? 'rgba(255, 255, 255, 0.06)' : 'transparent'
              }}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </Link>
          ))}

          <Link
            to="/digital-twin"
            style={{
              padding: '12px 14px',
              minHeight: 44,
              borderRadius: 6,
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              marginTop: 6,
              background: pathname === '/digital-twin' ? 'rgba(255, 255, 255, 0.06)' : 'transparent'
            }}
          >
            {language === 'hi' ? 'डिजिटल ट्विन' : 'Digital Twin'}
          </Link>

          <Link
            to="/judge-mode"
            style={{
              padding: '12px 14px',
              minHeight: 44,
              borderRadius: 6,
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border-subtle)',
              marginTop: 12
            }}
          >
            {language === 'hi' ? 'जज मोड' : 'Judge Mode'}
          </Link>
        </div>
      )}
    </header>
  );
};
