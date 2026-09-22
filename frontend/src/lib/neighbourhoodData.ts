// Neighbourhood & Feeder-Level Reliability Data Models for GridFlex AI
// Grounded in Indian Distribution Grid (33/11kV Substations, CERC DSM Regulations 2023, CEA Guidelines)

export interface FeederProfile {
  id: string;
  name: string;
  substation: string;
  voltage_kv: string;
  transformer_mva: number;
  peak_demand_mw: number;
  base_demand_mw: number;
  solar_capacity_mw: number;
  wind_capacity_mw: number;
  bess_capacity_mwh: number;
  bess_power_mw: number;
  bess_soc_pct: number;
  flexible_load_mw: number;
  consumer_count: number;
  prosumer_solar_count: number;
  description: string;
  character: 'Industrial' | 'Residential' | 'Commercial' | 'Microgrid';
  equity_protected_mw: number; // Critical lifelines: Hospitals, water pumping, cold storage
}

export const FEEDER_PROFILES: FeederProfile[] = [
  {
    id: 'F-01',
    name: 'Feeder F-01 (Mayur Vihar Industrial Corridor)',
    substation: 'Mayur Vihar 33/11kV Substation',
    voltage_kv: '33/11',
    transformer_mva: 25.0,
    peak_demand_mw: 18.4,
    base_demand_mw: 11.5,
    solar_capacity_mw: 8.2,
    wind_capacity_mw: 4.5,
    bess_capacity_mwh: 12.0,
    bess_power_mw: 4.0,
    bess_soc_pct: 78.0,
    flexible_load_mw: 4.8,
    consumer_count: 340,
    prosumer_solar_count: 65,
    description: 'Continuous 3-phase industrial induction motor loads with high power factor sensitivity and rooftop solar arrays.',
    character: 'Industrial',
    equity_protected_mw: 1.8 // Critical medical gas plant and cold logistics
  },
  {
    id: 'F-02',
    name: 'Feeder F-02 (Rohini Sector 9 Residential Colony)',
    substation: 'Rohini 33/11kV Substation',
    voltage_kv: '33/11',
    transformer_mva: 15.0,
    peak_demand_mw: 11.2,
    base_demand_mw: 5.8,
    solar_capacity_mw: 14.5,
    wind_capacity_mw: 2.0,
    bess_capacity_mwh: 8.0,
    bess_power_mw: 2.5,
    bess_soc_pct: 71.5,
    flexible_load_mw: 3.2,
    consumer_count: 4200,
    prosumer_solar_count: 420,
    description: 'High penetration of rooftop solar (420+ prosumers) creating acute mid-day reverse power flow and evening duck curve.',
    character: 'Residential',
    equity_protected_mw: 2.1 // Primary health clinic, municipal drinking water booster, dialysis patients
  },
  {
    id: 'F-03',
    name: 'Feeder F-03 (Nehru Place Commercial District)',
    substation: 'Nehru Place 33/11kV Substation',
    voltage_kv: '33/11',
    transformer_mva: 20.0,
    peak_demand_mw: 14.8,
    base_demand_mw: 7.2,
    solar_capacity_mw: 9.8,
    wind_capacity_mw: 3.2,
    bess_capacity_mwh: 12.0,
    bess_power_mw: 3.5,
    bess_soc_pct: 76.0,
    flexible_load_mw: 5.4,
    consumer_count: 780,
    prosumer_solar_count: 110,
    description: 'IT business parks, commercial towers, and retail hubs with automated centralized chiller and HVAC setback capability.',
    character: 'Commercial',
    equity_protected_mw: 1.5 // Data center emergency circuits & emergency lighting
  },
  {
    id: 'F-04',
    name: 'Feeder F-04 (Dwarka University & Transit Microgrid)',
    substation: 'Dwarka 33/11kV Substation',
    voltage_kv: '33/11',
    transformer_mva: 10.0,
    peak_demand_mw: 6.8,
    base_demand_mw: 3.4,
    solar_capacity_mw: 6.5,
    wind_capacity_mw: 1.5,
    bess_capacity_mwh: 8.0,
    bess_power_mw: 2.0,
    bess_soc_pct: 82.0,
    flexible_load_mw: 2.6,
    consumer_count: 520,
    prosumer_solar_count: 45,
    description: 'Autonomous islandable microgrid supporting academic laboratories and 45 high-capacity transit EV fast chargers.',
    character: 'Microgrid',
    equity_protected_mw: 1.2 // Research cryogenic cold rooms & campus dispensary
  }
];

export interface ForecastPoint {
  hour: number;
  time: string;
  day?: number;
  solar_predicted: number;
  solar_actual: number | null;
  solar_upper_95: number;
  solar_lower_95: number;
  wind_predicted: number;
  wind_actual: number | null;
  total_renewable: number;
  demand_predicted: number;
  demand_actual: number | null;
  net_balance_mw: number; // positive = surplus, negative = deficit
  mitigated_demand_mw: number; // post-flexibility demand
  is_shortfall: boolean;
  shortfall_severity: 'None' | 'Advisory' | 'Warning' | 'Critical';
  weather: {
    ghi_w_m2: number;
    temperature_c: number;
    cloud_cover_pct: number;
    wind_speed_ms: number;
  };
}

export interface IntermittencyGapSummary {
  has_active_deficit: boolean;
  active_window_start: string;
  active_window_end: string;
  duration_hours: number;
  max_deficit_mw: number;
  total_energy_shortfall_mwh: number;
  severity: 'Safe' | 'Advisory' | 'Warning' | 'Critical';
  primary_driver: string;
  cerc_dsm_penalty_risk_inr_lakhs: number;
}

export interface DemandResponseAction {
  id: string;
  title: string;
  category: 'EV Charging' | 'Commercial HVAC' | 'Industrial Shift' | 'Municipal Water' | 'BESS Injection';
  relief_mw: number;
  duration_hours: number;
  response_time: string;
  priority: 'High' | 'Medium' | 'Flexible';
  cost_inr_per_kwh: number;
  status: 'Ready' | 'Active' | 'Dispatched';
  description: string;
}

export interface ProtectedCommunityAsset {
  name: string;
  type: 'Clinic / Healthcare' | 'Drinking Water Booster' | 'Cold Storage Food' | 'Small Retailers';
  essential_load_kw: number;
  immunity_status: '100% Protected (Zero Curtailment)' | 'Priority Backfed';
  notes: string;
}

// Generates cohesive multi-horizon forecast data scaled specifically to the selected feeder
export function generateFeederForecastSeries(
  feeder: FeederProfile,
  horizon: '6h' | '24h' | '48h' | '7d',
  simSolarDeltaPct = 0,
  simDemandDeltaPct = 0
): ForecastPoint[] {
  const pointsCount = horizon === '6h' ? 6 : horizon === '24h' ? 24 : horizon === '48h' ? 48 : 28; // 28 intervals for 7d (every 6h)
  const is7d = horizon === '7d';
  const solarScale = feeder.solar_capacity_mw * (1 + simSolarDeltaPct / 100);
  const demandScale = feeder.peak_demand_mw * (1 + simDemandDeltaPct / 100);
  const windScale = feeder.wind_capacity_mw;

  return Array.from({ length: pointsCount }, (_, i) => {
    let hour = i;
    let label = '';
    let day = 1;

    if (horizon === '6h') {
      hour = (14 + i) % 24; // starting from midday peak
      label = `${hour.toString().padStart(2, '0')}:00`;
    } else if (horizon === '24h') {
      hour = i;
      label = `${hour.toString().padStart(2, '0')}:00`;
    } else if (horizon === '48h') {
      day = Math.floor(i / 24) + 1;
      hour = i % 24;
      label = `${hour.toString().padStart(2, '0')}:00 (D${day})`;
    } else {
      // 7-day (4 points per day)
      day = Math.floor(i / 4) + 1;
      const hourOffsets = [0, 6, 12, 18];
      hour = hourOffsets[i % 4];
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      label = `${dayNames[(day - 1) % 7]} ${hour.toString().padStart(2, '0')}:00`;
    }

    // Solar calculation with realistic bell curve
    let solarRaw = 0;
    if (hour >= 6 && hour <= 18) {
      solarRaw = Math.sin(Math.PI * (hour - 6) / 12) * solarScale;
      // Day 2 or later slight weather attenuation
      if (day > 1 && hour >= 13 && hour <= 16) {
        solarRaw *= (1 - 0.15 * (day % 2));
      }
    }
    const solar_predicted = parseFloat(Math.max(0, solarRaw).toFixed(2));
    const solar_upper_95 = parseFloat((solar_predicted + solar_predicted * 0.12 + 0.4).toFixed(2));
    const solar_lower_95 = parseFloat(Math.max(0, solar_predicted - (solar_predicted * 0.12 + 0.4)).toFixed(2));
    const solar_actual = hour <= 14 && day === 1 ? parseFloat((solar_predicted + Math.sin(hour) * 0.35).toFixed(2)) : null;

    // Wind calculation
    const windRaw = windScale * (0.65 + 0.35 * Math.cos((hour + day * 3) / 3.5));
    const wind_predicted = parseFloat(Math.max(0.2, windRaw).toFixed(2));
    const wind_actual = hour <= 14 && day === 1 ? parseFloat((wind_predicted + Math.cos(hour) * 0.25).toFixed(2)) : null;

    const total_renewable = parseFloat((solar_predicted + wind_predicted).toFixed(2));

    // Feeder demand curve (morning peak + heavy evening domestic/commercial peak)
    const baseDemand = feeder.base_demand_mw * (1 + simDemandDeltaPct / 100);
    const morningRamp = (demandScale - baseDemand) * 0.55 * Math.exp(-Math.pow(hour - 10, 2) / 6);
    const eveningRamp = (demandScale - baseDemand) * 0.95 * Math.exp(-Math.pow(hour - 20, 2) / 7.5);
    const demand_predicted = parseFloat((baseDemand + morningRamp + eveningRamp).toFixed(2));
    const demand_actual = hour <= 14 && day === 1 ? parseFloat((demand_predicted + Math.sin(hour * 2) * 0.4).toFixed(2)) : null;

    // Supply-demand balance
    const net_balance_mw = parseFloat((total_renewable - demand_predicted).toFixed(2));
    const is_shortfall = net_balance_mw < -0.5;

    // Severity
    let shortfall_severity: 'None' | 'Advisory' | 'Warning' | 'Critical' = 'None';
    if (is_shortfall) {
      if (Math.abs(net_balance_mw) > feeder.peak_demand_mw * 0.45) {
        shortfall_severity = 'Critical';
      } else if (Math.abs(net_balance_mw) > feeder.peak_demand_mw * 0.25) {
        shortfall_severity = 'Warning';
      } else {
        shortfall_severity = 'Advisory';
      }
    }

    // Mitigated demand (if flexibility is applied during evening peak)
    let mitigated = demand_predicted;
    if (hour >= 18 && hour <= 21) {
      mitigated = parseFloat(Math.max(baseDemand, demand_predicted - feeder.flexible_load_mw * 0.75).toFixed(2));
    }

    return {
      hour,
      time: label,
      day,
      solar_predicted,
      solar_actual,
      solar_upper_95,
      solar_lower_95,
      wind_predicted,
      wind_actual,
      total_renewable,
      demand_predicted,
      demand_actual,
      net_balance_mw,
      mitigated_demand_mw: mitigated,
      is_shortfall,
      shortfall_severity,
      weather: {
        ghi_w_m2: Math.round(solar_predicted * 22.0),
        temperature_c: parseFloat((23.0 + 8.5 * Math.sin(Math.PI * (hour - 7) / 14)).toFixed(1)),
        cloud_cover_pct: Math.round(Math.max(8, Math.min(80, 25 + 20 * Math.sin(hour / 2.5)))),
        wind_speed_ms: parseFloat((wind_predicted * 1.45).toFixed(1))
      }
    };
  });
}

// Calculate the summary of the intermittency gap
export function calculateIntermittencyGapSummary(
  series: ForecastPoint[],
  feeder: FeederProfile
): IntermittencyGapSummary {
  const deficitPoints = series.filter(p => p.is_shortfall);

  if (deficitPoints.length === 0) {
    return {
      has_active_deficit: false,
      active_window_start: 'None',
      active_window_end: 'None',
      duration_hours: 0,
      max_deficit_mw: 0,
      total_energy_shortfall_mwh: 0,
      severity: 'Safe',
      primary_driver: 'Renewable supply exceeds feeder demand across the horizon.',
      cerc_dsm_penalty_risk_inr_lakhs: 0
    };
  }

  const maxDeficit = Math.max(...deficitPoints.map(p => Math.abs(p.net_balance_mw)));
  const totalShortfallMwh = deficitPoints.reduce((acc, p) => acc + Math.abs(p.net_balance_mw), 0);
  const startTime = deficitPoints[0].time;
  const endTime = deficitPoints[deficitPoints.length - 1].time;

  let severity: 'Safe' | 'Advisory' | 'Warning' | 'Critical' = 'Advisory';
  if (maxDeficit > feeder.peak_demand_mw * 0.45) severity = 'Critical';
  else if (maxDeficit > feeder.peak_demand_mw * 0.25) severity = 'Warning';

  // CERC DSM penalty estimation (Indian grid deviation tariffs: ₹8-14.6/kWh for unmitigated under-frequency drawal)
  const dsmRiskLakhs = parseFloat(((totalShortfallMwh * 1000 * 11.2) / 100000).toFixed(2));

  return {
    has_active_deficit: true,
    active_window_start: startTime,
    active_window_end: endTime,
    duration_hours: deficitPoints.length,
    max_deficit_mw: parseFloat(maxDeficit.toFixed(2)),
    total_energy_shortfall_mwh: parseFloat(totalShortfallMwh.toFixed(1)),
    severity,
    primary_driver: 'Sunset solar cliff combined with domestic residential & commercial lighting ramp.',
    cerc_dsm_penalty_risk_inr_lakhs: dsmRiskLakhs
  };
}

// Recommended demand-response and storage dispatch catalog
export function getRecommendedActions(
  feeder: FeederProfile,
  maxGapMw: number
): DemandResponseAction[] {
  return [
    {
      id: 'ACT-BESS',
      title: 'Virtual Community BESS Fleet Fast Ramp',
      category: 'BESS Injection',
      relief_mw: parseFloat(Math.min(feeder.bess_power_mw, maxGapMw * 0.55).toFixed(1)),
      duration_hours: 3.5,
      response_time: '< 150 ms',
      priority: 'High',
      cost_inr_per_kwh: 0.85,
      status: 'Ready',
      description: `Discharges from 40 MWh aggregated neighbourhood battery units (currently ${feeder.bess_soc_pct}% SOC) without burning diesel.`
    },
    {
      id: 'ACT-EV',
      title: 'Transit EV Bus Depot Trickle Throttle',
      category: 'EV Charging',
      relief_mw: parseFloat((feeder.flexible_load_mw * 0.32).toFixed(1)),
      duration_hours: 2.5,
      response_time: '< 2 minutes',
      priority: 'High',
      cost_inr_per_kwh: 2.10,
      status: 'Ready',
      description: 'Modulates 45 DC fast-chargers from 150 kW to 30 kW trickle mode; resumes fast charging after 21:00 off-peak.'
    },
    {
      id: 'ACT-HVAC',
      title: 'Commercial Tower HVAC Chiller Setback (-1.5°C)',
      category: 'Commercial HVAC',
      relief_mw: parseFloat((feeder.flexible_load_mw * 0.38).toFixed(1)),
      duration_hours: 3.0,
      response_time: '< 5 minutes',
      priority: 'Medium',
      cost_inr_per_kwh: 3.40,
      status: 'Ready',
      description: 'Pre-cools corporate buildings at 14:00 solar peak, coasting through the 18:00–21:00 peak without occupant disruption.'
    },
    {
      id: 'ACT-PUMP',
      title: 'Municipal Water Pumping Shift to Solar Noon',
      category: 'Municipal Water',
      relief_mw: parseFloat((feeder.flexible_load_mw * 0.30).toFixed(1)),
      duration_hours: 4.0,
      response_time: '< 15 minutes',
      priority: 'Flexible',
      cost_inr_per_kwh: 1.80,
      status: 'Ready',
      description: 'Pre-fills elevated municipal reservoirs during midday solar surplus, shedding pumping draw during the evening deficit.'
    }
  ];
}

// Equity-protected community assets that must NEVER be curtailed
export const PROTECTED_COMMUNITY_ASSETS: Record<string, ProtectedCommunityAsset[]> = {
  'F-01': [
    { name: 'Mayur Vihar Industrial Oxygen & Medical Gas Facility', type: 'Clinic / Healthcare', essential_load_kw: 650, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Uninterrupted power backed by dedicated BESS node.' },
    { name: 'Agro-Fresh Cold Chain Logistics Hub', type: 'Cold Storage Food', essential_load_kw: 820, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Preserves dairy and perishable horticulture.' },
    { name: 'DDA Pumping Station #4', type: 'Drinking Water Booster', essential_load_kw: 330, immunity_status: 'Priority Backfed', notes: 'Potable water supply to 12,000 residents.' }
  ],
  'F-02': [
    { name: 'Rohini Sector 9 Urban Primary Health Centre (UPHC)', type: 'Clinic / Healthcare', essential_load_kw: 380, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Emergency ICU beds, vaccines cold chain & dialysis units.' },
    { name: 'Delhi Jal Board Underground Water Reservoir Booster', type: 'Drinking Water Booster', essential_load_kw: 950, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Lifeline potable water supply.' },
    { name: 'Weekly Local Sabzi Mandi Refrigeration Units', type: 'Small Retailers', essential_load_kw: 420, immunity_status: 'Priority Backfed', notes: 'Guarantees small vendor livelihoods without diesel fumes.' }
  ],
  'F-03': [
    { name: 'Nehru Place Emergency Trauma & Diagnostic Clinic', type: 'Clinic / Healthcare', essential_load_kw: 480, immunity_status: '100% Protected (Zero Curtailment)', notes: 'CT Scanner and surgical emergency power circuits.' },
    { name: 'District Telecom & Optical Exchange Node', type: 'Small Retailers', essential_load_kw: 620, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Fiber broadband and mobile emergency connectivity.' },
    { name: 'Metro Station Passenger Safety Ventilation', type: 'Drinking Water Booster', essential_load_kw: 400, immunity_status: 'Priority Backfed', notes: 'Evacuation fans and station lighting.' }
  ],
  'F-04': [
    { name: 'University Health Centre & Pharmacy Refrigeration', type: 'Clinic / Healthcare', essential_load_kw: 280, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Student clinic and vaccine storage.' },
    { name: 'Campus Deep Cryogenic Research Labs', type: 'Cold Storage Food', essential_load_kw: 520, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Preserves ongoing biomedical cell cultures.' },
    { name: 'Transit Bus Depot Critical Charging Bay (Ambulances)', type: 'Small Retailers', essential_load_kw: 400, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Dedicated priority bay for electric emergency ambulances.' }
  ]
};

// Computes Composite Reliability Index (0–100) dynamically based on simulation adjustments
export function computeReliabilityScore(
  feeder: FeederProfile,
  simSolarDeltaPct: number,
  simDemandDeltaPct: number,
  bessAvailabilityPct: number,
  drParticipationPct: number
): {
  score: number;
  status: 'Excellent' | 'Healthy & Resilient' | 'Watch' | 'Critical Shortfall';
  pillarScores: {
    renewable_availability: number;
    substation_headroom: number;
    bess_readiness: number;
    flexible_capacity: number;
  };
} {
  // 1. Renewable availability pillar (ratio of generation to demand)
  const renBase = (feeder.solar_capacity_mw * (1 + simSolarDeltaPct / 100) + feeder.wind_capacity_mw) / feeder.peak_demand_mw;
  const p1 = Math.min(100, Math.max(20, Math.round(renBase * 92)));

  // 2. Substation thermal headroom (remaining buffer on transformer)
  const effDemand = feeder.peak_demand_mw * (1 + simDemandDeltaPct / 100);
  const headroomRatio = (feeder.transformer_mva - effDemand) / feeder.transformer_mva;
  const p2 = Math.min(100, Math.max(15, Math.round(headroomRatio * 160)));

  // 3. Storage readiness (fleet SOC and availability)
  const p3 = Math.min(100, Math.max(10, Math.round(feeder.bess_soc_pct * (bessAvailabilityPct / 100))));

  // 4. Flexible DR capacity (participation % and available MW)
  const p4 = Math.min(100, Math.max(10, Math.round((feeder.flexible_load_mw / feeder.peak_demand_mw) * 100 * (drParticipationPct / 100) * 2.2)));

  // Equal 25% weights per IEEE 1547 / ISO 50001
  const rawScore = Math.round(0.25 * p1 + 0.25 * p2 + 0.25 * p3 + 0.25 * p4);
  const score = Math.max(12, Math.min(98, rawScore));

  let status: 'Excellent' | 'Healthy & Resilient' | 'Watch' | 'Critical Shortfall' = 'Healthy & Resilient';
  if (score >= 90) status = 'Excellent';
  else if (score >= 74) status = 'Healthy & Resilient';
  else if (score >= 55) status = 'Watch';
  else status = 'Critical Shortfall';

  return {
    score,
    status,
    pillarScores: {
      renewable_availability: p1,
      substation_headroom: p2,
      bess_readiness: p3,
      flexible_capacity: p4
    }
  };
}
