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
      background: 'rgba(13, 33, 53, 0.75)',
      border: '1px solid rgba(148, 163, 184, 0.15)',
      borderRadius: '16px',
      padding: '22px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(16px)',
      marginBottom: '24px'
    }}>
      {/* Top Bar: Breadcrumb + Mode Switcher */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
        paddingBottom: '16px',
        marginBottom: '16px'
      }}>
        {/* Breadcrumb path */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '13px' }}>
          <span style={{ color: '#22d3ee', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700 }}>
            <Compass size={15} /> India
          </span>
          <ChevronRight size={14} color="#64748b" />
          <span style={{ color: '#94a3b8' }}>{selectedLocation.state}</span>
          <ChevronRight size={14} color="#64748b" />
          <span style={{ color: '#94a3b8' }}>{selectedLocation.district}</span>
          <ChevronRight size={14} color="#64748b" />
          <span style={{ color: '#22d3ee', fontWeight: 700, background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.25)', padding: '2px 8px', borderRadius: '4px' }}>
            {selectedLocation.locality}
          </span>
        </div>

        {/* District vs Neighbourhood Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(10, 27, 45, 0.85)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
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
              background: operatingMode === 'neighbourhood' ? 'linear-gradient(135deg, #22d3ee, #3b82f6)' : 'transparent',
              color: operatingMode === 'neighbourhood' ? '#06111f' : '#94a3b8',
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
              background: operatingMode === 'district' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
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
          <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>
            1. State / Region
          </label>
          <select
            value={selectedLocation.state}
            onChange={(e) => handleStateChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#0A1B2D',
              color: '#f8fafc',
              border: '1px solid rgba(148, 163, 184, 0.2)',
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
          <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>
            2. District
          </label>
          <select
            value={selectedLocation.district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#0A1B2D',
              color: '#f8fafc',
              border: '1px solid rgba(148, 163, 184, 0.2)',
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
          <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>
            3. Locality / Feeder Cluster
          </label>
          <select
            value={selectedLocation.feeder_id}
            onChange={(e) => handleLocalityChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#0A1B2D',
              color: '#f8fafc',
              border: '1px solid rgba(34, 211, 238, 0.4)',
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
        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
          <Sparkles size={12} color="#22d3ee" /> Quick Demo Paths:
        </span>
        {HIERARCHY_LOCATIONS.map(loc => {
          const isSelected = loc.feeder_id === selectedLocation.feeder_id;
          const isPromptMandated = loc.state === 'Uttar Pradesh';
          return (
            <button
              key={loc.feeder_id}
              onClick={() => onSelectLocation(loc)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: isSelected ? '1px solid #22d3ee' : '1px solid rgba(148, 163, 184, 0.15)',
                background: isSelected ? 'rgba(34, 211, 238, 0.15)' : 'rgba(10, 27, 45, 0.6)',
                color: isSelected ? '#22d3ee' : '#cbd5e1',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: isSelected ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 0 12px rgba(34, 211, 238, 0.2)' : 'none'
              }}
            >
              {isSelected && <CheckCircle2 size={11} color="#22d3ee" />}
              {isPromptMandated ? '⭐ ' : ''}{loc.state} → {loc.district}: {loc.locality.split('/')[0].trim()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
