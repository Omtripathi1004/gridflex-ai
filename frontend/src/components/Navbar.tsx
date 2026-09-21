import React, { useState, useEffect, useRef } from 'react';
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
  Activity,
  Eye,
  Map,
  DollarSign,
  Building2,
  Radio,
  Cpu,
  MessageSquare,
  ShieldCheck,
  Layers,
  Award
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<any>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open to prevent scrolling the home page behind it
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }, [mobileMenuOpen]);

  const handleDropdownEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(menu);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  // Forecast & Radar items
  const forecastItems = [
    { 
      href: '/renewable-forecast', 
      label: language === 'hi' ? 'नवीकरणीय पूर्वानुमान' : 'Renewable Forecast', 
      desc: language === 'hi' ? 'सौर एवं पवन उत्पादन' : 'Solar & Wind Generation',
      icon: Sun 
    },
    { 
      href: '/demand-forecast', 
      label: language === 'hi' ? 'मांग पूर्वानुमान' : 'Demand Forecast', 
      desc: language === 'hi' ? 'सबस्टेशन लोड मॉडलिंग' : 'Substation Load Modeling',
      icon: TrendingUp 
    },
    { 
      href: '/sky-vision', 
      label: language === 'hi' ? 'स्काईविज़न रडार' : 'SkyVision Cloud Radar', 
      desc: language === 'hi' ? 'ऑप्टिकल फ्लो नाउकास्ट' : 'Optical Flow Nowcast',
      icon: Eye 
    },
    { 
      href: '/spatial-twin', 
      label: language === 'hi' ? 'स्थानिक डिजिटल ट्विन' : 'Spatial 3D Twin', 
      desc: language === 'hi' ? '33/11kV सबस्टेशन टोपोलॉजी' : 'Feeder & Node Topology',
      icon: Map 
    },
  ];

  // Grid Dispatch & Storage items
  const gridToolItems = [
    { 
      href: '/flexibility', 
      label: language === 'hi' ? 'लचीलापन प्रेषण' : 'Flexibility Dispatch', 
      desc: language === 'hi' ? 'पीक शेविंग व डीआर' : 'Autonomous Peak Shaving',
      icon: Sliders 
    },
    { 
      href: '/storage', 
      label: language === 'hi' ? 'वर्चुअल बैटरी स्टोरेज' : 'Virtual Storage', 
      desc: language === 'hi' ? 'बीईएसएस व डिग्रेडेशन' : 'BESS Asset Management',
      icon: BatteryCharging 
    },
    { 
      href: '/p2p', 
      label: language === 'hi' ? 'पी2पी ऊर्जा व्यापार' : 'P2P Coordination', 
      desc: language === 'hi' ? 'स्मार्ट अनुबंध बाजार' : 'Prosumer Market Clearing',
      icon: Share2 
    },
    { 
      href: '/tariff-engine', 
      label: language === 'hi' ? 'टैरिफ इंजन' : 'Tariff Engine', 
      desc: language === 'hi' ? 'एलएमपी व टीओडी बिलिंग' : 'Dynamic LMP & DSM Multipliers',
      icon: DollarSign 
    },
    { 
      href: '/discom', 
      label: language === 'hi' ? 'डिस्कॉम ऑपरेशंस' : 'DISCOM Operations', 
      desc: language === 'hi' ? 'राजस्व व बिलिंग मैट्रिक्स' : 'Utility Health & Revenue',
      icon: Building2 
    },
  ];

  // AI & Resilience items
  const aiResilienceItems = [
    { 
      href: '/digital-twin', 
      label: language === 'hi' ? 'डिजिटल ट्विन' : 'Digital Twin', 
      desc: language === 'hi' ? 'रियल-टाइम पावर फ्लो' : 'Real-Time Power Flow',
      icon: Activity 
    },
    { 
      href: '/self-healing', 
      label: language === 'hi' ? 'सेल्फ-हीलिंग FLISR' : 'Self-Healing FLISR', 
      desc: language === 'hi' ? 'स्वायत्त फॉल्ट आइसोलेशन' : 'Sub-Second Fault Recovery',
      icon: Radio 
    },
    { 
      href: '/explainable-ai', 
      label: language === 'hi' ? 'व्याख्यात्मक AI (XAI)' : 'Explainable AI (XAI)', 
      desc: language === 'hi' ? 'ट्रीSHAP विशेषता प्रमाण' : 'TreeSHAP Mathematical Proofs',
      icon: Cpu 
    },
    { 
      href: '/incident-copilot', 
      label: language === 'hi' ? 'इंसीडेंट को-पायलट' : 'Incident Voice Copilot', 
      desc: language === 'hi' ? 'द्विभाषी वॉइस AI (EN & HI)' : 'Bilingual AI Assistant',
      icon: MessageSquare 
    },
    { 
      href: '/resilience', 
      label: language === 'hi' ? 'ग्रिड विश्वसनीयता' : 'Grid Resilience Matrix', 
      desc: language === 'hi' ? 'सीईए व आईईईई 1547 अनुपालन' : 'IEEE 1547 & CEA Audit',
      icon: ShieldCheck 
    },
    { 
      href: '/architecture', 
      label: language === 'hi' ? 'सिस्टम आर्किटेक्चर' : 'System Architecture', 
      desc: language === 'hi' ? 'पूर्ण तकनीकी स्टैक' : 'Full-Stack Topology',
      icon: Layers 
    },
  ];

  const isForecastActive = forecastItems.some(item => item.href === pathname);
  const isGridToolsActive = gridToolItems.some(item => item.href === pathname);
  const isAIActive = aiResilienceItems.some(item => item.href === pathname);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      height: 64,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: 1380,
        width: '100%',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        {/* Left: Brand */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
          color: 'var(--text-primary)',
          fontWeight: 700,
          fontSize: '1.05rem',
          flexShrink: 0
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: 'var(--cyan-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={18} />
          </div>
          <span>GridFlex AI</span>
        </Link>

        {/* Centre: Desktop Navigation */}
        <nav className="desktop-only" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}>
          {/* 1. About */}
          <Link
            to="/about"
            style={{
              padding: '7px 11px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: '0.86rem',
              color: (pathname === '/about' || pathname === '/') ? 'var(--brand)' : 'var(--text-secondary)',
              background: (pathname === '/about' || pathname === '/') ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
              fontWeight: (pathname === '/about' || pathname === '/') ? 600 : 500
            }}
          >
            {language === 'hi' ? 'परिचय' : 'About'}
          </Link>

          {/* 2. Command Center */}
          <Link
            to="/command-center"
            style={{
              padding: '7px 11px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: '0.86rem',
              color: pathname === '/command-center' ? 'var(--brand)' : 'var(--text-secondary)',
              background: pathname === '/command-center' ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
              fontWeight: pathname === '/command-center' ? 600 : 500
            }}
          >
            {language === 'hi' ? 'कमांड सेंटर' : 'Command Center'}
          </Link>

          {/* 3. Forecasts Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleDropdownEnter('forecasts')}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              style={{
                padding: '7px 11px',
                borderRadius: 6,
                border: 'none',
                background: isForecastActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                color: isForecastActive ? 'var(--brand)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: isForecastActive ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>{language === 'hi' ? 'पूर्वानुमान' : 'Forecasts'}</span>
              <ChevronDown size={14} style={{ transform: openDropdown === 'forecasts' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
            </button>

            {openDropdown === 'forecasts' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                minWidth: 260,
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: 6,
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.09)',
                zIndex: 1100,
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
                      onClick={() => setOpenDropdown(null)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 6,
                        textDecoration: 'none',
                        color: isActive ? 'var(--brand)' : 'var(--text-primary)',
                        background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10
                      }}
                    >
                      <Icon size={16} style={{ color: isActive ? 'var(--brand)' : 'var(--text-secondary)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Grid Tools Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleDropdownEnter('gridtools')}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              style={{
                padding: '7px 11px',
                borderRadius: 6,
                border: 'none',
                background: isGridToolsActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                color: isGridToolsActive ? 'var(--brand)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: isGridToolsActive ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>{language === 'hi' ? 'ग्रिड टूल्स' : 'Grid Tools'}</span>
              <ChevronDown size={14} style={{ transform: openDropdown === 'gridtools' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
            </button>

            {openDropdown === 'gridtools' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                minWidth: 260,
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: 6,
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.09)',
                zIndex: 1100,
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
                      onClick={() => setOpenDropdown(null)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 6,
                        textDecoration: 'none',
                        color: isActive ? 'var(--brand)' : 'var(--text-primary)',
                        background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10
                      }}
                    >
                      <Icon size={16} style={{ color: isActive ? 'var(--brand)' : 'var(--text-secondary)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. AI & Resilience Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleDropdownEnter('airesilience')}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              style={{
                padding: '7px 11px',
                borderRadius: 6,
                border: 'none',
                background: isAIActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                color: isAIActive ? 'var(--brand)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: isAIActive ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>{language === 'hi' ? 'AI व विश्वसनीयता' : 'AI & Resilience'}</span>
              <ChevronDown size={14} style={{ transform: openDropdown === 'airesilience' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
            </button>

            {openDropdown === 'airesilience' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: -20,
                minWidth: 280,
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: 6,
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.09)',
                zIndex: 1100,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                {aiResilienceItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpenDropdown(null)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 6,
                        textDecoration: 'none',
                        color: isActive ? 'var(--brand)' : 'var(--text-primary)',
                        background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10
                      }}
                    >
                      <Icon size={16} style={{ color: isActive ? 'var(--brand)' : 'var(--text-secondary)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: EN | HI toggle, Judge Mode, Sign In, Mobile Menu Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Simple EN | HI toggle */}
          <div style={{
            display: 'inline-flex',
            borderRadius: 6,
            border: '1px solid var(--border-subtle)',
            background: '#f1f5f9',
            overflow: 'hidden'
          }}>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              style={{
                padding: '4px 9px',
                border: 'none',
                background: language === 'en' ? 'var(--brand)' : 'transparent',
                color: language === 'en' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.76rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              style={{
                padding: '4px 9px',
                border: 'none',
                background: language === 'hi' ? 'var(--brand)' : 'transparent',
                color: language === 'hi' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.76rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              HI
            </button>
          </div>

          {/* Judge Mode button */}
          <Link
            to="/judge-mode"
            className="desktop-only"
            style={{
              padding: '6px 11px',
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              color: pathname === '/judge-mode' ? 'var(--brand)' : 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.80rem',
              fontWeight: 600,
              background: pathname === '/judge-mode' ? 'rgba(79, 70, 229, 0.08)' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <Award size={14} style={{ color: 'var(--brand)' }} />
            <span>{language === 'hi' ? 'जज मोड' : 'Judge Mode'}</span>
          </Link>

          {/* Sign In Button */}
          <Link
            to="/login"
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid var(--brand)',
              background: pathname === '/login' ? 'var(--brand)' : '#ffffff',
              color: pathname === '/login' ? '#ffffff' : 'var(--brand)',
              textDecoration: 'none',
              fontSize: '0.80rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <User size={13} />
            <span>{user ? user.full_name : (language === 'hi' ? 'लॉग इन' : 'Sign In')}</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: 8,
              minWidth: 40,
              minHeight: 40,
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              background: '#f8fafc',
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

      {/* Mobile Drawer (Guaranteed Scrollable Container with Body Scroll Lock & Over-scroll Containment) */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            height: 'calc(100vh - 64px)',
            maxHeight: 'calc(100dvh - 64px)',
            background: '#ffffff',
            borderTop: '1px solid var(--border-subtle)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            zIndex: 9999,
            padding: '16px 20px 120px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
        >
          {/* Main Core Links */}
          <div style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '6px 12px 2px'
          }}>
            {language === 'hi' ? 'मुख्य ऑपरेशंस' : 'Core Operations'}
          </div>

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '10px 12px',
              minHeight: 44,
              borderRadius: 8,
              textDecoration: 'none',
              color: (pathname === '/about' || pathname === '/') ? 'var(--brand)' : 'var(--text-primary)',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: (pathname === '/about' || pathname === '/') ? 600 : 500,
              background: (pathname === '/about' || pathname === '/') ? 'rgba(79, 70, 229, 0.08)' : 'transparent'
            }}
          >
            <Zap size={18} style={{ color: 'var(--brand)' }} />
            <span>{language === 'hi' ? 'परिचय (About)' : 'About GridFlex AI'}</span>
          </Link>

          <Link
            to="/command-center"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '10px 12px',
              minHeight: 44,
              borderRadius: 8,
              textDecoration: 'none',
              color: pathname === '/command-center' ? 'var(--brand)' : 'var(--text-primary)',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: pathname === '/command-center' ? 600 : 500,
              background: pathname === '/command-center' ? 'rgba(79, 70, 229, 0.08)' : 'transparent'
            }}
          >
            <Activity size={18} style={{ color: 'var(--brand)' }} />
            <span>{language === 'hi' ? 'कमांड सेंटर' : 'Live Command Center'}</span>
          </Link>

          {/* Section: Forecasts */}
          <div style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginTop: 10,
            padding: '6px 12px 2px'
          }}>
            {language === 'hi' ? 'पूर्वानुमान व रडार' : 'Forecasts & Radar'}
          </div>
          {forecastItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '9px 12px',
                  minHeight: 44,
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive ? 'var(--brand)' : 'var(--text-primary)',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent'
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--brand)' : 'var(--text-secondary)' }} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Section: Grid Tools */}
          <div style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginTop: 10,
            padding: '6px 12px 2px'
          }}>
            {language === 'hi' ? 'ग्रिड प्रेषण व बाजार' : 'Grid Dispatch & Market'}
          </div>
          {gridToolItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '9px 12px',
                  minHeight: 44,
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive ? 'var(--brand)' : 'var(--text-primary)',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent'
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--brand)' : 'var(--text-secondary)' }} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Section: AI Automation & Resilience */}
          <div style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginTop: 10,
            padding: '6px 12px 2px'
          }}>
            {language === 'hi' ? 'AI स्वचालन व विश्वसनीयता' : 'AI Automation & Resilience'}
          </div>
          {aiResilienceItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '9px 12px',
                  minHeight: 44,
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive ? 'var(--brand)' : 'var(--text-primary)',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent'
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--brand)' : 'var(--text-secondary)' }} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Highlight: Judge Mode */}
          <div style={{ marginTop: 14 }}>
            <Link
              to="/judge-mode"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '12px 14px',
                minHeight: 48,
                borderRadius: 8,
                textDecoration: 'none',
                color: '#ffffff',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
              }}
            >
              <Award size={18} />
              <span>{language === 'hi' ? 'जज मोड गाइडेड टूर' : 'Judge Mode Guided Tour'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
