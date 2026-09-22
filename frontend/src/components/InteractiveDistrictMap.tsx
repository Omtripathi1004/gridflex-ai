import React from 'react';
import { 
  MapPin, 
  Zap, 
  Battery, 
  Sun, 
  Radio, 
  ShieldCheck, 
  Info,
  Maximize2
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
}

export const InteractiveDistrictMap: React.FC<Props> = ({
  selectedLocation,
  onSelectLocation,
  operatingMode
}) => {
  return (
    <div style={{
      background: 'rgba(13, 33, 53, 0.75)',
      border: '1px solid rgba(148, 163, 184, 0.15)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(16px)',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(34, 211, 238, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={16} color="#22d3ee" />
          </div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
            {operatingMode === 'district' ? 'District Energy Topology & Feeder Map' : 'Neighbourhood Distributed Asset Map'}
          </h3>
          <span style={{
            fontSize: '11px',
            background: 'rgba(34, 211, 238, 0.12)',
            color: '#22d3ee',
            border: '1px solid rgba(34, 211, 238, 0.25)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 700
          }}>
            Representative GIS Demo
          </span>
        </div>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
          Click any locality pin to inspect local grid & balance telemetry
        </span>
      </div>

      {/* SVG Interactive Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.08) 0%, rgba(2, 6, 23, 0.95) 75%)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Grid background pattern */}
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
            {/* Glow filters */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="300" fill="url(#grid-pattern)" />

          {/* Substation Backbone Bus Lines */}
          <path d="M 80 150 Q 240 70 400 150 T 720 150" fill="none" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="2" strokeDasharray="6,4" />
          <path d="M 160 230 Q 300 190 440 220 T 680 200" fill="none" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="2" strokeDasharray="4,4" />

          {/* Locality Nodes */}
          {HIERARCHY_LOCATIONS.map((loc, idx) => {
            // Coordinate mapping for visual layout
            const coords = [
              { x: 130, y: 110 }, // Lucknow Gomti Nagar
              { x: 270, y: 190 }, // Mayur Vihar
              { x: 410, y: 90 },  // Rohini
              { x: 540, y: 210 }, // Nehru Place
              { x: 650, y: 110 }, // Dwarka
              { x: 720, y: 230 }  // Bengaluru Mahadevapura
            ][idx % 6];

            const isSelected = loc.feeder_id === selectedLocation.feeder_id;
            const nodeColor = isSelected ? '#00f0ff' : '#64748b';
            const pulseRadius = isSelected ? 22 : 14;

            return (
              <g 
                key={loc.feeder_id} 
                onClick={() => onSelectLocation(loc)}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              >
                {/* Selection pulse ring */}
                {isSelected && (
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r={pulseRadius} 
                    fill="none" 
                    stroke="#00f0ff" 
                    strokeWidth="2" 
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Outer halo */}
                <circle 
                  cx={coords.x} 
                  cy={coords.y} 
                  r={isSelected ? 16 : 10} 
                  fill={isSelected ? 'rgba(0, 240, 255, 0.25)' : 'rgba(100, 116, 139, 0.2)'} 
                  stroke={nodeColor} 
                  strokeWidth={isSelected ? 2 : 1}
                  filter={isSelected ? 'url(#glow-cyan)' : undefined}
                />

                {/* Inner Core */}
                <circle 
                  cx={coords.x} 
                  cy={coords.y} 
                  r={isSelected ? 7 : 5} 
                  fill={isSelected ? '#00f0ff' : '#94a3b8'} 
                />

                {/* Label text */}
                <text 
                  x={coords.x} 
                  y={coords.y - (isSelected ? 22 : 15)} 
                  textAnchor="middle" 
                  fill={isSelected ? '#ffffff' : '#94a3b8'} 
                  fontSize={isSelected ? '12px' : '10px'} 
                  fontWeight={isSelected ? '700' : '500'}
                >
                  {loc.state === 'Uttar Pradesh' ? '⭐ ' : ''}{loc.locality.split('/')[0].trim()}
                </text>

                {/* Capacity badge */}
                <text 
                  x={coords.x} 
                  y={coords.y + (isSelected ? 26 : 18)} 
                  textAnchor="middle" 
                  fill={isSelected ? '#38bdf8' : '#64748b'} 
                  fontSize="9px"
                  fontWeight="600"
                >
                  {loc.peak_demand_mw} MW | {loc.bess_capacity_mwh} MWh
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Overlay Info Bar */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(2, 6, 23, 0.85)',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ color: '#f8fafc', fontWeight: 700 }}>
              📍 Selected: <span style={{ color: '#00f0ff' }}>{selectedLocation.feeder_name}</span>
            </span>
            <span style={{ color: '#94a3b8' }}>
              Substation: <strong style={{ color: '#e2e8f0' }}>{selectedLocation.substation}</strong>
            </span>
            <span style={{ color: '#94a3b8' }}>
              Transformer: <strong style={{ color: '#e2e8f0' }}>{selectedLocation.transformer_mva} MVA</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
              <Sun size={12} /> {selectedLocation.solar_capacity_mw} MW Solar
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
              <Battery size={12} /> {selectedLocation.bess_capacity_mwh} MWh BESS
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a855f7' }}>
              <ShieldCheck size={12} /> {selectedLocation.equity_protected_mw} MW Protected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
