import React from 'react';
import { 
  MapPin, 
  Layers, 
  Building, 
  Compass, 
  CheckCircle2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  LocationHierarchyNode, 
  HIERARCHY_LOCATIONS, 
  OperatingMode 
} from '../lib/neighbourhoodData';

interface Props {
  selectedLocation: LocationHierarchyNode;
  onSelectLocation: (loc: LocationHierarchyNode) => void;
  operatingMode: OperatingMode;
  onToggleMode: (mode: OperatingMode) => void;
}

export const LocationHierarchySelector: React.FC<Props> = ({
  selectedLocation,
  onSelectLocation,
  operatingMode,
  onToggleMode
}) => {
  // Extract distinct States and Districts
  const states = Array.from(new Set(HIERARCHY_LOCATIONS.map(l => l.state)));
  const availableDistricts = Array.from(
    new Set(HIERARCHY_LOCATIONS.filter(l => l.state === selectedLocation.state).map(l => l.district))
  );
  const availableLocalities = HIERARCHY_LOCATIONS.filter(
    l => l.state === selectedLocation.state && l.district === selectedLocation.district
  );

  const handleStateChange = (stateName: string) => {
    const firstMatch = HIERARCHY_LOCATIONS.find(l => l.state === stateName);
    if (firstMatch) onSelectLocation(firstMatch);
  };

  const handleDistrictChange = (districtName: string) => {
    const firstMatch = HIERARCHY_LOCATIONS.find(
      l => l.state === selectedLocation.state && l.district === districtName
    );
    if (firstMatch) onSelectLocation(firstMatch);
  };

  const handleLocalityChange = (feederId: string) => {
    const match = HIERARCHY_LOCATIONS.find(l => l.feeder_id === feederId);
    if (match) onSelectLocation(match);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
      border: '1px solid rgba(0, 240, 255, 0.25)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(12px)',
      marginBottom: '24px'
    }}>
      {/* Top Bar: Breadcrumb + Mode Switcher */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '16px',
        marginBottom: '16px'
      }}>
        {/* Breadcrumb path */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '13px' }}>
          <span style={{ color: '#00f0ff', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
            <Compass size={15} /> India
          </span>
          <ChevronRight size={14} color="#64748b" />
          <span style={{ color: '#94a3b8' }}>{selectedLocation.state}</span>
          <ChevronRight size={14} color="#64748b" />
          <span style={{ color: '#94a3b8' }}>{selectedLocation.district}</span>
          <ChevronRight size={14} color="#64748b" />
          <span style={{ color: '#38bdf8', fontWeight: 600, background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
            {selectedLocation.locality}
          </span>
        </div>

        {/* District vs Neighbourhood Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(2, 6, 23, 0.6)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={() => onToggleMode('neighbourhood')}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: operatingMode === 'neighbourhood' ? 'linear-gradient(135deg, #00f0ff, #0284c7)' : 'transparent',
              color: operatingMode === 'neighbourhood' ? '#070b14' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <MapPin size={13} />
            Neighbourhood Mode
          </button>
          <button
            onClick={() => onToggleMode('district')}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: operatingMode === 'district' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'transparent',
              color: operatingMode === 'district' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            <Layers size={13} />
            District Mode (Aggregate)
          </button>
        </div>
      </div>

      {/* Cascading Selection Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '16px'
      }}>
        {/* State Select */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '6px', fontWeight: 700 }}>
            1. State / Region
          </label>
          <select
            value={selectedLocation.state}
            onChange={(e) => handleStateChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#070b14',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* District Select */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '6px', fontWeight: 700 }}>
            2. District
          </label>
          <select
            value={selectedLocation.district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#070b14',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {availableDistricts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Locality / Feeder Cluster Select */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '6px', fontWeight: 700 }}>
            3. Locality / Feeder Cluster
          </label>
          <select
            value={selectedLocation.feeder_id}
            onChange={(e) => handleLocalityChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#070b14',
              color: '#e2e8f0',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {availableLocalities.map(l => (
              <option key={l.feeder_id} value={l.feeder_id}>
                {l.locality} ({l.feeder_id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Presets (Including Prompt-Mandated UP -> Lucknow -> Gomti Nagar Demo Path) */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
          <Sparkles size={12} color="#f59e0b" /> Quick Demo Paths:
        </span>
        {HIERARCHY_LOCATIONS.map(loc => {
          const isSelected = loc.feeder_id === selectedLocation.feeder_id;
          const isPromptMandated = loc.state === 'Uttar Pradesh';
          return (
            <button
              key={loc.feeder_id}
              onClick={() => onSelectLocation(loc)}
              style={{
                padding: '5px 11px',
                borderRadius: '6px',
                border: isSelected ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.12)',
                background: isSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#00f0ff' : '#cbd5e1',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: isSelected ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {isSelected && <CheckCircle2 size={11} color="#00f0ff" />}
              {isPromptMandated ? '⭐ ' : ''}{loc.state} → {loc.district}: {loc.locality.split('/')[0].trim()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
