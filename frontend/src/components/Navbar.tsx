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
  Award,
  Database
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
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 300);
  };

  // Forecast & Radar items
  const forecastItems = [
    { 
      href: '/renewable-forecast', 
      label: language === 'hi' ? 'विश्वसनीयता कमांड सेंटर' : 'Reliability Command Center', 
      desc: language === 'hi' ? 'फीडर विश्वसनीयता, गैप व पूर्वानुमान' : 'Feeder Reliability, Gaps & Forecast',
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
    { 
      href: '/data-audit', 
      label: language === 'hi' ? 'डेटा सुरक्षा एवं ऑडिट' : 'Data Security & Audit', 
      desc: language === 'hi' ? 'सरकारी डेटा लाइनिएज एवं मैपिंग' : 'Government Lineage & Matrix',
      icon: Database 
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
      background: 'rgba(6, 17, 31, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
      height: 64,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: 1400,
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
          gap: 10,
          textDecoration: 'none',
          color: '#F8FAFC',
          fontWeight: 800,
          fontSize: '1.1rem',
          letterSpacing: '-0.02em',
          flexShrink: 0
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #22D3EE, #3B82F6)',
            color: '#06111F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px rgba(34, 211, 238, 0.35)'
          }}>
            <Zap size={18} />
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            GridFlex AI
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px #10B981'
            }} />
          </span>
        </Link>

        {/* Centre: Desktop Navigation */}
        <nav className="desktop-only" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          {/* 1. About */}
          <Link
            to="/about"
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.86rem',
              color: (pathname === '/about' || pathname === '/') ? '#22D3EE' : '#94A3B8',
              background: (pathname === '/about' || pathname === '/') ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
              border: (pathname === '/about' || pathname === '/') ? '1px solid rgba(34, 211, 238, 0.25)' : '1px solid transparent',
              fontWeight: (pathname === '/about' || pathname === '/') ? 600 : 500,
              transition: 'all 0.15s ease'
            }}
          >
            {language === 'hi' ? 'परिचय' : 'About'}
          </Link>

          {/* 2. Command Center */}
          <Link
            to="/command-center"
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.86rem',
              color: pathname === '/command-center' ? '#22D3EE' : '#94A3B8',
              background: pathname === '/command-center' ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
              border: pathname === '/command-center' ? '1px solid rgba(34, 211, 238, 0.25)' : '1px solid transparent',
              fontWeight: pathname === '/command-center' ? 600 : 500,
              transition: 'all 0.15s ease'
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
              onClick={() => {
                if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                setOpenDropdown(prev => prev === 'forecasts' ? null : 'forecasts');
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: isForecastActive ? '1px solid rgba(34, 211, 238, 0.25)' : '1px solid transparent',
                background: isForecastActive ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
                color: isForecastActive ? '#22D3EE' : '#94A3B8',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: isForecastActive ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.15s ease'
              }}
            >
              <span>{language === 'hi' ? 'पूर्वानुमान' : 'Forecasts'}</span>
              <ChevronDown size={14} style={{ transform: openDropdown === 'forecasts' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
            </button>

            {openDropdown === 'forecasts' && (
              <div 
                onMouseEnter={() => {
                  if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                }}
                onMouseLeave={handleDropdownLeave}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  minWidth: 280,
                  background: 'rgba(10, 27, 45, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(34, 211, 238, 0.25)',
                  borderRadius: 12,
                  padding: 8,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(34, 211, 238, 0.1)',
                  zIndex: 1100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                }}
              >
                {forecastItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => {
                        setOpenDropdown(null);
                        window.scrollTo(0, 0);
                      }}
                      style={{
                        padding: '9px 12px',
                        borderRadius: 8,
                        textDecoration: 'none',
                        color: isActive ? '#22D3EE' : '#F8FAFC',
                        background: isActive ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <Icon size={16} style={{ color: isActive ? '#22D3EE' : '#38BDF8', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</div>
                        <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{item.desc}</div>
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
              onClick={() => {
                if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                setOpenDropdown(prev => prev === 'gridtools' ? null : 'gridtools');
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: isGridToolsActive ? '1px solid rgba(34, 211, 238, 0.25)' : '1px solid transparent',
                background: isGridToolsActive ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
                color: isGridToolsActive ? '#22D3EE' : '#94A3B8',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: isGridToolsActive ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.15s ease'
              }}
            >
              <span>{language === 'hi' ? 'ग्रिड टूल्स' : 'Grid Tools'}</span>
              <ChevronDown size={14} style={{ transform: openDropdown === 'gridtools' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
            </button>

            {openDropdown === 'gridtools' && (
              <div 
                onMouseEnter={() => {
                  if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                }}
                onMouseLeave={handleDropdownLeave}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  minWidth: 280,
                  background: 'rgba(10, 27, 45, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(34, 211, 238, 0.25)',
                  borderRadius: 12,
                  padding: 8,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(34, 211, 238, 0.1)',
                  zIndex: 1100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                }}
              >
                {gridToolItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => {
                        setOpenDropdown(null);
                        window.scrollTo(0, 0);
                      }}
                      style={{
                        padding: '9px 12px',
                        borderRadius: 8,
                        textDecoration: 'none',
                        color: isActive ? '#22D3EE' : '#F8FAFC',
                        background: isActive ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <Icon size={16} style={{ color: isActive ? '#22D3EE' : '#38BDF8', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</div>
                        <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{item.desc}</div>
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
              onClick={() => {
                if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                setOpenDropdown(prev => prev === 'airesilience' ? null : 'airesilience');
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: isAIActive ? '1px solid rgba(34, 211, 238, 0.25)' : '1px solid transparent',
                background: isAIActive ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
                color: isAIActive ? '#22D3EE' : '#94A3B8',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: isAIActive ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.15s ease'
              }}
            >
              <span>{language === 'hi' ? 'AI व विश्वसनीयता' : 'AI & Resilience'}</span>
              <ChevronDown size={14} style={{ transform: openDropdown === 'airesilience' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
            </button>

            {openDropdown === 'airesilience' && (
              <div 
                onMouseEnter={() => {
                  if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                }}
                onMouseLeave={handleDropdownLeave}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: -20,
                  minWidth: 290,
                  background: 'rgba(10, 27, 45, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(34, 211, 238, 0.25)',
                  borderRadius: 12,
                  padding: 8,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(34, 211, 238, 0.1)',
                  zIndex: 1100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                }}
              >
                {aiResilienceItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => {
                        setOpenDropdown(null);
                        window.scrollTo(0, 0);
                      }}
                      style={{
                        padding: '9px 12px',
                        borderRadius: 8,
                        textDecoration: 'none',
                        color: isActive ? '#22D3EE' : '#F8FAFC',
                        background: isActive ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <Icon size={16} style={{ color: isActive ? '#22D3EE' : '#38BDF8', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</div>
                        <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{item.desc}</div>
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
            borderRadius: 8,
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: 'rgba(13, 33, 53, 0.75)',
            overflow: 'hidden'
          }}>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              style={{
                padding: '5px 10px',
                border: 'none',
                background: language === 'en' ? '#22D3EE' : 'transparent',
                color: language === 'en' ? '#06111F' : '#94A3B8',
                fontWeight: 700,
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
                padding: '5px 10px',
                border: 'none',
                background: language === 'hi' ? '#22D3EE' : 'transparent',
                color: language === 'hi' ? '#06111F' : '#94A3B8',
                fontWeight: 700,
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
              padding: '6px 12px',
              borderRadius: 8,
              border: pathname === '/judge-mode' ? '1px solid #F59E0B' : '1px solid rgba(245, 158, 11, 0.35)',
              color: '#FBBF24',
              textDecoration: 'none',
              fontSize: '0.80rem',
              fontWeight: 700,
              background: pathname === '/judge-mode' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <Award size={14} style={{ color: '#F59E0B' }} />
            <span>{language === 'hi' ? 'जज मोड' : 'Judge Mode'}</span>
          </Link>

          {/* Data Security & Audit button */}
          <Link
            to="/data-audit"
            className="desktop-only"
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: pathname === '/data-audit' ? '1px solid #10B981' : '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34D399',
              textDecoration: 'none',
              fontSize: '0.80rem',
              fontWeight: 700,
              background: pathname === '/data-audit' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <ShieldCheck size={14} style={{ color: '#10B981' }} />
            <span>{language === 'hi' ? 'डेटा ऑडिट' : 'Data Audit'}</span>
          </Link>

          {/* Sign In Button */}
          <Link
            to="/login"
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid rgba(34, 211, 238, 0.4)',
              background: pathname === '/login' ? 'linear-gradient(135deg, #22D3EE, #3B82F6)' : 'rgba(13, 33, 53, 0.75)',
              color: pathname === '/login' ? '#06111F' : '#F8FAFC',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
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
              borderRadius: 8,
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(13, 33, 53, 0.75)',
              color: '#F8FAFC',
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

      {/* Mobile Drawer */}
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
            background: 'rgba(6, 17, 31, 0.96)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
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
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
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

            <Link
              to="/data-audit"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                marginTop: 8,
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
                background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
              }}
            >
              <ShieldCheck size={18} />
              <span>{language === 'hi' ? 'डेटा सुरक्षा एवं ऑडिट' : 'Data Security & Audit Evidence'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
