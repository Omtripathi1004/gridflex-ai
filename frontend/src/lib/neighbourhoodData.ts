// Neighbourhood & District-Level Reliability Data Models for GridFlex AI
// Grounded in Indian Distribution Grid (33/11kV Substations, CERC DSM Regulations 2023, CEA Guidelines)
// Designed for Challenge 03: Grid Reliability, Intermittency, Affordability & Local Coordination

export type OperatingMode = 'district' | 'neighbourhood';

export interface LocationHierarchyNode {
  country: string;
  state: string;
  district: string;
  locality: string;
  feeder_id: string;
  feeder_name: string;
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
  character: 'Industrial' | 'Residential' | 'Commercial' | 'Microgrid' | 'Urban Cluster';
  equity_protected_mw: number;
  // District aggregate stats (when in District Mode)
  district_aggregate: {
    district_name: string;
    substation_count: number;
    feeders_count: number;
    total_peak_mw: number;
    total_solar_mw: number;
    total_wind_mw: number;
    total_bess_mwh: number;
    total_consumers: number;
    discom_name: string;
  };
}

export const HIERARCHY_LOCATIONS: LocationHierarchyNode[] = [
  {
    country: 'India',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    locality: 'Gomti Nagar / Vibhuti Khand Cluster',
    feeder_id: 'UP-LKO-GN01',
    feeder_name: 'Gomti Nagar Vibhuti Khand 11kV Feeder',
    substation: 'Gomti Nagar 33/11kV Primary Substation',
    voltage_kv: '33/11',
    transformer_mva: 20.0,
    peak_demand_mw: 16.2,
    base_demand_mw: 8.4,
    solar_capacity_mw: 11.5,
    wind_capacity_mw: 1.8,
    bess_capacity_mwh: 10.0,
    bess_power_mw: 3.2,
    bess_soc_pct: 79.5,
    flexible_load_mw: 4.6,
    consumer_count: 5200,
    prosumer_solar_count: 540,
    description: 'High-density mixed residential & commercial zone in East Lucknow with dense rooftop PV and municipal water lifting stations.',
    character: 'Urban Cluster',
    equity_protected_mw: 2.3,
    district_aggregate: {
      district_name: 'Lucknow District (MVVNL)',
      substation_count: 38,
      feeders_count: 142,
      total_peak_mw: 480.0,
      total_solar_mw: 165.0,
      total_wind_mw: 12.0,
      total_bess_mwh: 85.0,
      total_consumers: 460000,
      discom_name: 'Madhyanchal Vidyut Vitaran Nigam Ltd (MVVNL)'
    }
  },
  {
    country: 'India',
    state: 'Delhi NCT',
    district: 'East Delhi',
    locality: 'Mayur Vihar Industrial Corridor',
    feeder_id: 'F-01',
    feeder_name: 'Feeder F-01 (Mayur Vihar Industrial Corridor)',
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
    equity_protected_mw: 1.8,
    district_aggregate: {
      district_name: 'East Delhi District (BYPL)',
      substation_count: 24,
      feeders_count: 96,
      total_peak_mw: 340.0,
      total_solar_mw: 85.0,
      total_wind_mw: 18.0,
      total_bess_mwh: 55.0,
      total_consumers: 310000,
      discom_name: 'BSES Yamuna Power Limited (BYPL)'
    }
  },
  {
    country: 'India',
    state: 'Delhi NCT',
    district: 'North West Delhi',
    locality: 'Rohini Sector 9 Residential Colony',
    feeder_id: 'F-02',
    feeder_name: 'Feeder F-02 (Rohini Sector 9 Residential Colony)',
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
    description: 'High penetration of rooftop solar creating acute mid-day reverse power flow and evening duck curve.',
    character: 'Residential',
    equity_protected_mw: 2.1,
    district_aggregate: {
      district_name: 'North West Delhi District (TPDDL)',
      substation_count: 32,
      feeders_count: 120,
      total_peak_mw: 410.0,
      total_solar_mw: 140.0,
      total_wind_mw: 25.0,
      total_bess_mwh: 68.0,
      total_consumers: 520000,
      discom_name: 'Tata Power Delhi Distribution Ltd (TPDDL)'
    }
  },
  {
    country: 'India',
    state: 'Delhi NCT',
    district: 'South Delhi',
    locality: 'Nehru Place Commercial District',
    feeder_id: 'F-03',
    feeder_name: 'Feeder F-03 (Nehru Place Commercial District)',
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
    equity_protected_mw: 1.5,
    district_aggregate: {
      district_name: 'South Delhi District (BRPL)',
      substation_count: 40,
      feeders_count: 158,
      total_peak_mw: 520.0,
      total_solar_mw: 195.0,
      total_wind_mw: 30.0,
      total_bess_mwh: 92.0,
      total_consumers: 610000,
      discom_name: 'BSES Rajdhani Power Limited (BRPL)'
    }
  },
  {
    country: 'India',
    state: 'Delhi NCT',
    district: 'South West Delhi',
    locality: 'Dwarka University & Transit Microgrid',
    feeder_id: 'F-04',
    feeder_name: 'Feeder F-04 (Dwarka University & Transit Microgrid)',
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
    description: 'Autonomous islandable microgrid supporting academic laboratories and 45 transit EV fast chargers.',
    character: 'Microgrid',
    equity_protected_mw: 1.2,
    district_aggregate: {
      district_name: 'South West Delhi District (BRPL)',
      substation_count: 28,
      feeders_count: 112,
      total_peak_mw: 360.0,
      total_solar_mw: 110.0,
      total_wind_mw: 15.0,
      total_bess_mwh: 48.0,
      total_consumers: 380000,
      discom_name: 'BSES Rajdhani Power Limited (BRPL)'
    }
  },
  {
    country: 'India',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    locality: 'Mahadevapura Substation Cluster',
    feeder_id: 'KA-BLR-MD01',
    feeder_name: 'Mahadevapura 33/11kV Tech Corridor Feeder',
    substation: 'Mahadevapura 66/11kV Substation',
    voltage_kv: '66/11',
    transformer_mva: 31.5,
    peak_demand_mw: 24.5,
    base_demand_mw: 14.2,
    solar_capacity_mw: 18.0,
    wind_capacity_mw: 6.0,
    bess_capacity_mwh: 20.0,
    bess_power_mw: 6.0,
    bess_soc_pct: 85.0,
    flexible_load_mw: 7.5,
    consumer_count: 1200,
    prosumer_solar_count: 320,
    description: 'Silicon Valley tech parks, data centers, and metro transit interchange with high distributed flexibility readiness.',
    character: 'Urban Cluster',
    equity_protected_mw: 3.5,
    district_aggregate: {
      district_name: 'Bengaluru Urban District (BESCOM)',
      substation_count: 62,
      feeders_count: 280,
      total_peak_mw: 920.0,
      total_solar_mw: 340.0,
      total_wind_mw: 85.0,
      total_bess_mwh: 160.0,
      total_consumers: 1250000,
      discom_name: 'Bangalore Electricity Supply Company Ltd (BESCOM)'
    }
  }
];

// FeederProfile compatibility adapter
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
  character: 'Industrial' | 'Residential' | 'Commercial' | 'Microgrid' | 'Urban Cluster';
  equity_protected_mw: number;
}

export const FEEDER_PROFILES: FeederProfile[] = HIERARCHY_LOCATIONS.map(node => ({
  id: node.feeder_id,
  name: node.feeder_name,
  substation: node.substation,
  voltage_kv: node.voltage_kv,
  transformer_mva: node.transformer_mva,
  peak_demand_mw: node.peak_demand_mw,
  base_demand_mw: node.base_demand_mw,
  solar_capacity_mw: node.solar_capacity_mw,
  wind_capacity_mw: node.wind_capacity_mw,
  bess_capacity_mwh: node.bess_capacity_mwh,
  bess_power_mw: node.bess_power_mw,
  bess_soc_pct: node.bess_soc_pct,
  flexible_load_mw: node.flexible_load_mw,
  consumer_count: node.consumer_count,
  prosumer_solar_count: node.prosumer_solar_count,
  description: node.description,
  character: node.character,
  equity_protected_mw: node.equity_protected_mw
}));

// 6 Intermittency Scenarios required by Challenge 3 Section 4
export type IntermittencyScenario =
  | 'normal_solar'
  | 'cloud_event'
  | 'evening_ramp'
  | 'low_wind'
  | 'combined_shortfall'
  | 'high_demand_low_re';

export interface IntermittencyScenarioMeta {
  id: IntermittencyScenario;
  name: string;
  description: string;
  solar_multiplier: number;
  demand_multiplier: number;
  wind_multiplier: number;
  cloud_cover_pct: number;
  temperature_c: number;
  warning_level: 'Normal' | 'Advisory' | 'Severe' | 'Critical';
}

export const INTERMITTENCY_SCENARIOS: Record<IntermittencyScenario, IntermittencyScenarioMeta> = {
  normal_solar: {
    id: 'normal_solar',
    name: 'Normal Solar Day',
    description: 'Clear sky radiation curve with predictable midday solar peak and regular evening demand ramp.',
    solar_multiplier: 1.0,
    demand_multiplier: 1.0,
    wind_multiplier: 1.0,
    cloud_cover_pct: 12,
    temperature_c: 31,
    warning_level: 'Normal'
  },
  cloud_event: {
    id: 'cloud_event',
    name: 'Cloud Event (Sudden Midday Dip)',
    description: 'Sudden convective cloud cover drops rooftop solar irradiance by 60% between 12:00 and 14:30 IST.',
    solar_multiplier: 0.40,
    demand_multiplier: 1.05,
    wind_multiplier: 0.85,
    cloud_cover_pct: 88,
    temperature_c: 28,
    warning_level: 'Severe'
  },
  evening_ramp: {
    id: 'evening_ramp',
    name: 'Evening Solar Ramp-Down',
    description: 'Sharp solar cliff at sunset (17:30 IST) coinciding with evening peak lighting and induction cooking.',
    solar_multiplier: 0.85,
    demand_multiplier: 1.25,
    wind_multiplier: 0.90,
    cloud_cover_pct: 30,
    temperature_c: 32,
    warning_level: 'Severe'
  },
  low_wind: {
    id: 'low_wind',
    name: 'Low-Wind Lull Event',
    description: 'Atmospheric inversion causes near-zero wind velocity (< 1.5 m/s) across regional wind turbines.',
    solar_multiplier: 1.0,
    demand_multiplier: 1.0,
    wind_multiplier: 0.15,
    cloud_cover_pct: 18,
    temperature_c: 33,
    warning_level: 'Advisory'
  },
  combined_shortfall: {
    id: 'combined_shortfall',
    name: 'Combined Renewable Shortfall',
    description: 'Overcast monsoon day with cloud cover, low wind speeds, and sustained high domestic moisture loads.',
    solar_multiplier: 0.35,
    demand_multiplier: 1.20,
    wind_multiplier: 0.25,
    cloud_cover_pct: 95,
    temperature_c: 29,
    warning_level: 'Critical'
  },
  high_demand_low_re: {
    id: 'high_demand_low_re',
    name: 'High-Demand Heatwave Event',
    description: 'Summer extreme heat (44°C ambient) triggers massive air-conditioning load surge with solar thermal degradation.',
    solar_multiplier: 0.80,
    demand_multiplier: 1.45,
    wind_multiplier: 0.50,
    cloud_cover_pct: 22,
    temperature_c: 44,
    warning_level: 'Critical'
  }
};

// 7 Smart Load Categories (Section 5)
export interface SmartLoadCategory {
  id: string;
  name: string;
  share_pct: number;
  flexibility_pct: number;
  priority: number; // 1 = highest / lifeline, 7 = lowest
  operating_window: string;
  min_service_level_pct: number;
  is_critical: boolean;
  can_curtail_automatically: boolean;
  proposed_action: string;
}

export const SMART_LOAD_CATEGORIES: SmartLoadCategory[] = [
  {
    id: 'CAT-1',
    name: 'Critical Lifeline Loads (Clinics, Water Booster, Emergency Dialysis)',
    share_pct: 15,
    flexibility_pct: 0,
    priority: 1,
    operating_window: '24/7 Continuous',
    min_service_level_pct: 100,
    is_critical: true,
    can_curtail_automatically: false,
    proposed_action: 'NEVER CURTAIL: Prioritized dual-redundancy backfeed from community BESS emergency reserve.'
  },
  {
    id: 'CAT-2',
    name: 'Essential Residential Base (Lighting, Fans, Medical Appliances)',
    share_pct: 25,
    flexibility_pct: 10,
    priority: 2,
    operating_window: '24/7 Continuous',
    min_service_level_pct: 90,
    is_critical: false,
    can_curtail_automatically: false,
    proposed_action: 'Preserved without interruption; voluntary peak energy conservation tips.'
  },
  {
    id: 'CAT-3',
    name: 'Commercial HVAC & Space Cooling',
    share_pct: 20,
    flexibility_pct: 40,
    priority: 3,
    operating_window: '08:00 – 21:00',
    min_service_level_pct: 70,
    is_critical: false,
    can_curtail_automatically: true,
    proposed_action: 'Pre-cool building thermal mass by 1.5°C during solar peak; coast through evening peak without occupant discomfort.'
  },
  {
    id: 'CAT-4',
    name: 'Agricultural & Municipal Water Pumps',
    share_pct: 12,
    flexibility_pct: 65,
    priority: 4,
    operating_window: 'Shiftable to Solar Noon',
    min_service_level_pct: 50,
    is_critical: false,
    can_curtail_automatically: true,
    proposed_action: 'Pre-fill elevated reservoirs between 11:00 and 15:00 solar hours; zero pumping during evening grid peak.'
  },
  {
    id: 'CAT-5',
    name: 'EV Charging Stations & Transit Fleets',
    share_pct: 10,
    flexibility_pct: 55,
    priority: 5,
    operating_window: '10:00 – 23:00',
    min_service_level_pct: 40,
    is_critical: false,
    can_curtail_automatically: true,
    proposed_action: 'Modulate DC fast chargers from 150 kW to 30 kW trickle rate; pilot V2G bidirectional feeder support.'
  },
  {
    id: 'CAT-6',
    name: 'Industrial Batch Loads & Foundries',
    share_pct: 12,
    flexibility_pct: 45,
    priority: 6,
    operating_window: '07:00 – 19:00',
    min_service_level_pct: 50,
    is_critical: false,
    can_curtail_automatically: true,
    proposed_action: 'Stagger heavy induction furnace heating cycles; shift batch processing into midday solar surplus.'
  },
  {
    id: 'CAT-7',
    name: 'Deferrable Residential Appliances (Water Heaters, Washing)',
    share_pct: 6,
    flexibility_pct: 50,
    priority: 7,
    operating_window: 'Flexible (Automated)',
    min_service_level_pct: 50,
    is_critical: false,
    can_curtail_automatically: true,
    proposed_action: 'Automate geyser and washing machine turn-on signals to coincide with rooftop solar export windows.'
  }
];

export type FlexibilityAggressiveness = 'conservative' | 'balanced' | 'aggressive';

export interface ForecastPoint {
  hour: number;
  time: string;
  day?: number;
  solar_predicted: number;
  solar_actual: number | null;
  solar_upper_95: number;
  solar_lower_95: number;
  solar_p10: number;
  solar_p50: number;
  solar_p90: number;
  wind_predicted: number;
  wind_actual: number | null;
  wind_p10: number;
  wind_p50: number;
  wind_p90: number;
  forecast_confidence_pct: number;
  total_renewable: number;
  demand_predicted: number;
  demand_actual: number | null;
  net_balance_mw: number; // positive = surplus, negative = deficit
  mitigated_demand_mw: number; // post-flexibility demand
  bess_flow_mw: number; // positive = discharge, negative = charge
  bess_soc_pct: number;
  p2p_cleared_mw: number; // local peer-to-peer matched energy
  technical_loss_baseline_mw: number; // I^2*R feeder line losses without GridFlex
  technical_loss_optimized_mw: number; // I^2*R feeder line losses with GridFlex
  avoided_loss_mw: number; // Net loss reduction
  residual_grid_import_mw: number; // grid draw after BESS + DR + P2P
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

// Generates cohesive multi-horizon forecast data scaled specifically to the selected feeder / district
export function generateFeederForecastSeries(
  location: LocationHierarchyNode,
  mode: OperatingMode,
  horizon: '6h' | '24h' | '48h' | '7d',
  scenarioId: IntermittencyScenario = 'normal_solar',
  aggressiveness: FlexibilityAggressiveness = 'balanced',
  simSolarDeltaPct = 0,
  simDemandDeltaPct = 0,
  bessAvailabilityPct = 100,
  drParticipationPct = 100,
  uncertaintyLevel: 'low' | 'medium' | 'high' = 'medium'
): ForecastPoint[] {
  const pointsCount = horizon === '6h' ? 6 : horizon === '24h' ? 24 : horizon === '48h' ? 48 : 28;
  const scenario = INTERMITTENCY_SCENARIOS[scenarioId] || INTERMITTENCY_SCENARIOS.normal_solar;

  // Scale multipliers depending on District vs Neighbourhood Mode
  const scaleMultiplier = mode === 'district' ? (location.district_aggregate.total_peak_mw / location.peak_demand_mw) : 1.0;

  const solarCap = location.solar_capacity_mw * scaleMultiplier * scenario.solar_multiplier * (1 + simSolarDeltaPct / 100);
  const windCap = location.wind_capacity_mw * scaleMultiplier * scenario.wind_multiplier;
  const peakDemand = location.peak_demand_mw * scaleMultiplier * scenario.demand_multiplier * (1 + simDemandDeltaPct / 100);
  const baseDemand = location.base_demand_mw * scaleMultiplier * scenario.demand_multiplier * (1 + simDemandDeltaPct / 100);
  const bessCapacityMwh = location.bess_capacity_mwh * scaleMultiplier * (bessAvailabilityPct / 100);
  const bessMaxPowerMw = location.bess_power_mw * scaleMultiplier * (bessAvailabilityPct / 100);
  const flexibleLoadMw = location.flexible_load_mw * scaleMultiplier * (drParticipationPct / 100);

  // Flexibility aggression factor
  const aggFactor = aggressiveness === 'conservative' ? 0.45 : aggressiveness === 'balanced' ? 0.75 : 1.0;

  // Adaptive reserve threshold: under high forecast uncertainty, GridFlex preserves 35% SOC reserve (instead of 20%) to buffer sudden ramps
  const minSocReserve = uncertaintyLevel === 'high' ? 35 : 20;

  let currentSoc = location.bess_soc_pct;

  return Array.from({ length: pointsCount }, (_, i) => {
    let hour = i;
    let label = '';
    let day = 1;

    if (horizon === '6h') {
      hour = (15 + i) % 24; // evening ramp window
      label = `${hour.toString().padStart(2, '0')}:00`;
    } else if (horizon === '24h') {
      hour = i;
      label = `${hour.toString().padStart(2, '0')}:00`;
    } else if (horizon === '48h') {
      day = Math.floor(i / 24) + 1;
      hour = i % 24;
      label = `${hour.toString().padStart(2, '0')}:00 (D${day})`;
    } else {
      // 7-day
      day = Math.floor(i / 4) + 1;
      const hourOffsets = [0, 6, 12, 18];
      hour = hourOffsets[i % 4];
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      label = `${dayNames[(day - 1) % 7]} ${hour.toString().padStart(2, '0')}:00`;
    }

    // Solar calculation
    let solarRaw = 0;
    if (hour >= 6 && hour <= 18) {
      solarRaw = Math.sin(Math.PI * (hour - 6) / 12) * solarCap;
      if (scenarioId === 'cloud_event' && hour >= 12 && hour <= 15) {
        solarRaw *= 0.35;
      }
    }
    const solar_predicted = parseFloat(Math.max(0, solarRaw).toFixed(2));
    const solar_upper_95 = parseFloat((solar_predicted + solar_predicted * 0.12 + 0.5 * scaleMultiplier).toFixed(2));
    const solar_lower_95 = parseFloat(Math.max(0, solar_predicted - (solar_predicted * 0.12 + 0.5 * scaleMultiplier)).toFixed(2));
    const solar_actual = hour <= 14 && day === 1 ? parseFloat((solar_predicted + Math.sin(hour) * 0.35 * scaleMultiplier).toFixed(2)) : null;

    // Uncertainty quantiles (P10 conservative, P50 expected, P90 optimistic)
    const solarUncertSpread = uncertaintyLevel === 'high' ? 0.30 : uncertaintyLevel === 'medium' ? 0.15 : 0.08;
    const solar_p10 = parseFloat(Math.max(0, solar_predicted * (1 - solarUncertSpread)).toFixed(2));
    const solar_p50 = solar_predicted;
    const solar_p90 = parseFloat((solar_predicted * (1 + solarUncertSpread)).toFixed(2));

    // Wind calculation
    const windRaw = windCap * (0.65 + 0.35 * Math.cos((hour + day * 3) / 3.5));
    const wind_predicted = parseFloat(Math.max(0.2 * scaleMultiplier, windRaw).toFixed(2));
    const wind_actual = hour <= 14 && day === 1 ? parseFloat((wind_predicted + Math.cos(hour) * 0.25 * scaleMultiplier).toFixed(2)) : null;

    const windUncertSpread = uncertaintyLevel === 'high' ? 0.38 : uncertaintyLevel === 'medium' ? 0.20 : 0.10;
    const wind_p10 = parseFloat(Math.max(0.1 * scaleMultiplier, wind_predicted * (1 - windUncertSpread)).toFixed(2));
    const wind_p50 = wind_predicted;
    const wind_p90 = parseFloat((wind_predicted * (1 + windUncertSpread)).toFixed(2));

    const forecast_confidence_pct = uncertaintyLevel === 'high' ? 79.5 : uncertaintyLevel === 'medium' ? 91.8 : 98.2;

    const total_renewable = parseFloat((solar_predicted + wind_predicted).toFixed(2));

    // Feeder demand curve
    const morningRamp = (peakDemand - baseDemand) * 0.55 * Math.exp(-Math.pow(hour - 10, 2) / 6);
    const eveningRamp = (peakDemand - baseDemand) * 0.95 * Math.exp(-Math.pow(hour - 20, 2) / 7.5);
    const demand_predicted = parseFloat((baseDemand + morningRamp + eveningRamp).toFixed(2));
    const demand_actual = hour <= 14 && day === 1 ? parseFloat((demand_predicted + Math.sin(hour * 2) * 0.4 * scaleMultiplier).toFixed(2)) : null;

    // Net raw balance before flexibility
    const net_balance_mw = parseFloat((total_renewable - demand_predicted).toFixed(2));
    const is_shortfall = net_balance_mw < -0.5;

    // 1. Demand Response load relief
    let drReliefMw = 0;
    if (is_shortfall && hour >= 17 && hour <= 22) {
      drReliefMw = Math.min(Math.abs(net_balance_mw), flexibleLoadMw * aggFactor);
    } else if (net_balance_mw > 2.0 && hour >= 11 && hour <= 15) {
      // Shift loads INTO solar surplus window
      drReliefMw = -Math.min(net_balance_mw * 0.3, flexibleLoadMw * 0.4);
    }
    const mitigated_demand_mw = parseFloat(Math.max(baseDemand, demand_predicted - drReliefMw).toFixed(2));

    // 2. Shared Community Battery Dispatch Algorithm
    let bess_flow_mw = 0; // >0 is discharge, <0 is charge
    const postDrDeficit = total_renewable - mitigated_demand_mw;

    if (postDrDeficit > 0 && currentSoc < 96) {
      // Charge battery from renewable surplus
      const chargePotential = Math.min(postDrDeficit * 0.92, bessMaxPowerMw);
      const chargeEnergyMwh = chargePotential * 1.0;
      const socGain = (chargeEnergyMwh / Math.max(1, bessCapacityMwh)) * 100;
      currentSoc = Math.min(98, currentSoc + socGain);
      bess_flow_mw = -parseFloat(chargePotential.toFixed(2));
    } else if (postDrDeficit < 0 && currentSoc > minSocReserve) {
      // Discharge battery during shortage while guarding minSocReserve
      const neededDischarge = Math.abs(postDrDeficit);
      const maxDischargePossible = Math.min(neededDischarge, bessMaxPowerMw);
      const availableMwhAboveReserve = ((currentSoc - minSocReserve) / 100) * bessCapacityMwh;
      const actualDischarge = Math.min(maxDischargePossible, availableMwhAboveReserve);
      const socLoss = (actualDischarge / Math.max(1, bessCapacityMwh)) * 100;
      currentSoc = Math.max(minSocReserve, currentSoc - socLoss);
      bess_flow_mw = parseFloat(actualDischarge.toFixed(2));
    }

    // 3. Local P2P Cleared Energy (matches local prosumer solar directly to nearby commercial/EV loads)
    const p2p_cleared_mw = hour >= 9 && hour <= 17
      ? parseFloat((Math.min(solar_predicted * 0.28, mitigated_demand_mw * 0.25)).toFixed(2))
      : 0;

    // 4. Technical Line Loss Model (I^2*R losses along 11kV radial feeder lines)
    // Loss is quadratically proportional to current magnitude: P_loss = 3 * I^2 * R
    const baseCurrentRatio = Math.min(1.4, demand_predicted / Math.max(1, peakDemand));
    const optCurrentRatio = Math.min(1.4, (mitigated_demand_mw - Math.max(0, bess_flow_mw)) / Math.max(1, peakDemand));
    // Baseline technical loss is ~8.2% of feeder throughput at peak
    const technical_loss_baseline_mw = parseFloat((demand_predicted * 0.082 * Math.pow(baseCurrentRatio, 1.85)).toFixed(3));
    // GridFlex localized dispatch reduces 11kV line transit, dropping loss to ~4.8%
    const technical_loss_optimized_mw = parseFloat((mitigated_demand_mw * 0.048 * Math.pow(Math.max(0.3, optCurrentRatio), 1.85)).toFixed(3));
    const avoided_loss_mw = parseFloat(Math.max(0, technical_loss_baseline_mw - technical_loss_optimized_mw).toFixed(3));

    // 5. Residual Grid Import: only draw from central grid what cannot be met locally
    const residualNet = total_renewable + bess_flow_mw - mitigated_demand_mw;
    const residual_grid_import_mw = residualNet < 0 ? parseFloat(Math.abs(residualNet).toFixed(2)) : 0;

    // Severity calculation
    let shortfall_severity: 'None' | 'Advisory' | 'Warning' | 'Critical' = 'None';
    if (residual_grid_import_mw > peakDemand * 0.45) {
      shortfall_severity = 'Critical';
    } else if (residual_grid_import_mw > peakDemand * 0.20) {
      shortfall_severity = 'Warning';
    } else if (residual_grid_import_mw > 0.5) {
      shortfall_severity = 'Advisory';
    }

    return {
      hour,
      time: label,
      day,
      solar_predicted,
      solar_actual,
      solar_upper_95,
      solar_lower_95,
      solar_p10,
      solar_p50,
      solar_p90,
      wind_predicted,
      wind_actual,
      wind_p10,
      wind_p50,
      wind_p90,
      forecast_confidence_pct,
      total_renewable,
      demand_predicted,
      demand_actual,
      net_balance_mw,
      mitigated_demand_mw,
      bess_flow_mw,
      bess_soc_pct: parseFloat(currentSoc.toFixed(1)),
      p2p_cleared_mw,
      technical_loss_baseline_mw,
      technical_loss_optimized_mw,
      avoided_loss_mw,
      residual_grid_import_mw,
      is_shortfall,
      shortfall_severity,
      weather: {
        ghi_w_m2: Math.round(solar_predicted * (22.0 / scaleMultiplier)),
        temperature_c: scenario.temperature_c,
        cloud_cover_pct: scenario.cloud_cover_pct,
        wind_speed_ms: parseFloat((wind_predicted * (1.45 / scaleMultiplier)).toFixed(1))
      }
    };
  });
}

// Intermittency gap calculation
export function calculateIntermittencyGapSummary(
  series: ForecastPoint[],
  location: LocationHierarchyNode,
  mode: OperatingMode
): IntermittencyGapSummary {
  const scale = mode === 'district' ? (location.district_aggregate.total_peak_mw / location.peak_demand_mw) : 1.0;
  const peakDemand = location.peak_demand_mw * scale;
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
      primary_driver: 'Renewable generation comfortably meets local demand across all hours.',
      cerc_dsm_penalty_risk_inr_lakhs: 0
    };
  }

  const maxDeficit = Math.max(...deficitPoints.map(p => Math.abs(p.net_balance_mw)));
  const totalShortfallMwh = deficitPoints.reduce((acc, p) => acc + Math.abs(p.net_balance_mw), 0);
  const startTime = deficitPoints[0].time;
  const endTime = deficitPoints[deficitPoints.length - 1].time;

  let severity: 'Safe' | 'Advisory' | 'Warning' | 'Critical' = 'Advisory';
  if (maxDeficit > peakDemand * 0.45) severity = 'Critical';
  else if (maxDeficit > peakDemand * 0.25) severity = 'Warning';

  const dsmRiskLakhs = parseFloat(((totalShortfallMwh * 1000 * 11.2) / 100000).toFixed(2));

  return {
    has_active_deficit: true,
    active_window_start: startTime,
    active_window_end: endTime,
    duration_hours: deficitPoints.length,
    max_deficit_mw: parseFloat(maxDeficit.toFixed(2)),
    total_energy_shortfall_mwh: parseFloat(totalShortfallMwh.toFixed(1)),
    severity,
    primary_driver: 'Sunset solar cliff combined with peak domestic evening demand ramp.',
    cerc_dsm_penalty_risk_inr_lakhs: dsmRiskLakhs
  };
}

// Recommended actions generator
export function getRecommendedActions(
  location: LocationHierarchyNode,
  mode: OperatingMode,
  maxGapMw: number
): DemandResponseAction[] {
  const scale = mode === 'district' ? (location.district_aggregate.total_peak_mw / location.peak_demand_mw) : 1.0;
  const bessPower = location.bess_power_mw * scale;
  const flexLoad = location.flexible_load_mw * scale;

  return [
    {
      id: 'ACT-BESS',
      title: 'Virtual Community BESS Fleet Fast Ramp',
      category: 'BESS Injection',
      relief_mw: parseFloat(Math.min(bessPower, maxGapMw * 0.55).toFixed(1)),
      duration_hours: 3.5,
      response_time: '< 150 ms',
      priority: 'High',
      cost_inr_per_kwh: 0.85,
      status: 'Ready',
      description: `Discharges from aggregated neighbourhood battery fleet (${location.bess_capacity_mwh * scale} MWh capacity) preserving 20% emergency reserve for lifelines.`
    },
    {
      id: 'ACT-EV',
      title: 'Transit & Depot EV Fleet Smart Throttle',
      category: 'EV Charging',
      relief_mw: parseFloat((flexLoad * 0.32).toFixed(1)),
      duration_hours: 2.5,
      response_time: '< 2 minutes',
      priority: 'High',
      cost_inr_per_kwh: 2.10,
      status: 'Ready',
      description: 'Modulates DC fast-chargers from 150 kW to 30 kW trickle mode; schedules full-power resumption during off-peak night hours.'
    },
    {
      id: 'ACT-HVAC',
      title: 'Commercial & Institutional Chiller Setback (-1.5°C)',
      category: 'Commercial HVAC',
      relief_mw: parseFloat((flexLoad * 0.38).toFixed(1)),
      duration_hours: 3.0,
      response_time: '< 5 minutes',
      priority: 'Medium',
      cost_inr_per_kwh: 3.40,
      status: 'Ready',
      description: 'Pre-cools building thermal mass during solar noon, coasting through the 18:00–21:00 peak without occupant disruption.'
    },
    {
      id: 'ACT-PUMP',
      title: 'Municipal & Irrigation Water Pump Shift to Solar Noon',
      category: 'Municipal Water',
      relief_mw: parseFloat((flexLoad * 0.30).toFixed(1)),
      duration_hours: 4.0,
      response_time: '< 15 minutes',
      priority: 'Flexible',
      cost_inr_per_kwh: 1.80,
      status: 'Ready',
      description: 'Pre-fills elevated municipal reservoirs during midday solar surplus, shedding pumping draw completely during the evening peak.'
    }
  ];
}

// Equity-protected community assets
export const PROTECTED_COMMUNITY_ASSETS: Record<string, ProtectedCommunityAsset[]> = {
  'UP-LKO-GN01': [
    { name: 'Dr. Ram Manohar Lohia Hospital & Trauma ICU', type: 'Clinic / Healthcare', essential_load_kw: 850, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Emergency surgical suites, life support, oxygen compressors.' },
    { name: 'Kathauta Lake Drinking Water Pumping Station', type: 'Drinking Water Booster', essential_load_kw: 1100, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Potable water filtration serving 250,000 Gomti Nagar residents.' },
    { name: 'Vibhuti Khand Cold Chain Vaccine Depot', type: 'Cold Storage Food', essential_load_kw: 320, immunity_status: '100% Protected (Zero Curtailment)', notes: 'State immunisation and polio cold chain storage.' },
    { name: 'Local Patrakarpuram Weekly Vegetable Market Vendors', type: 'Small Retailers', essential_load_kw: 280, immunity_status: 'Priority Backfed', notes: 'Guaranteed light and ventilation for peri-urban vendors.' }
  ],
  'F-01': [
    { name: 'Mayur Vihar Industrial Oxygen & Medical Gas Facility', type: 'Clinic / Healthcare', essential_load_kw: 650, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Dedicated dual BESS backfeed circuit.' },
    { name: 'Agro-Fresh Cold Chain Logistics Hub', type: 'Cold Storage Food', essential_load_kw: 820, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Dairy and perishable horticulture preservation.' },
    { name: 'DDA Pumping Station #4', type: 'Drinking Water Booster', essential_load_kw: 330, immunity_status: 'Priority Backfed', notes: 'Potable water supply to 12,000 residents.' }
  ],
  'F-02': [
    { name: 'Rohini Sector 9 Urban Primary Health Centre (UPHC)', type: 'Clinic / Healthcare', essential_load_kw: 380, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Emergency ICU beds, vaccine cold chain & dialysis units.' },
    { name: 'Delhi Jal Board Underground Water Reservoir Booster', type: 'Drinking Water Booster', essential_load_kw: 950, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Lifeline drinking water supply.' },
    { name: 'Weekly Local Sabzi Mandi Refrigeration Units', type: 'Small Retailers', essential_load_kw: 420, immunity_status: 'Priority Backfed', notes: 'Protects micro-vendor livelihoods from spoiled stock.' }
  ],
  'F-03': [
    { name: 'Nehru Place Emergency Trauma & Diagnostic Clinic', type: 'Clinic / Healthcare', essential_load_kw: 480, immunity_status: '100% Protected (Zero Curtailment)', notes: 'CT Scanner and surgical emergency power circuits.' },
    { name: 'District Telecom & Optical Exchange Node', type: 'Small Retailers', essential_load_kw: 620, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Emergency connectivity and fiber routing.' },
    { name: 'Metro Station Passenger Safety Ventilation', type: 'Drinking Water Booster', essential_load_kw: 400, immunity_status: 'Priority Backfed', notes: 'Evacuation fans and emergency lighting.' }
  ],
  'F-04': [
    { name: 'University Health Centre & Pharmacy Refrigeration', type: 'Clinic / Healthcare', essential_load_kw: 280, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Student clinic and medicine preservation.' },
    { name: 'Campus Deep Cryogenic Research Labs', type: 'Cold Storage Food', essential_load_kw: 520, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Biological culture preservation.' },
    { name: 'Transit Bus Depot Ambulance Charging Bay', type: 'Small Retailers', essential_load_kw: 400, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Dedicated priority bay for electric emergency vehicles.' }
  ],
  'KA-BLR-MD01': [
    { name: 'Mahadevapura Government General Hospital', type: 'Clinic / Healthcare', essential_load_kw: 920, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Critical care units, maternal ward, and vaccine storage.' },
    { name: 'BWSSB Sewage & Water Recycling Station', type: 'Drinking Water Booster', essential_load_kw: 1400, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Essential municipal sanitisation pumps.' },
    { name: 'HAL Airport Radar & Approach Lighting Feeder Tap', type: 'Small Retailers', essential_load_kw: 650, immunity_status: '100% Protected (Zero Curtailment)', notes: 'Aviation emergency power link.' }
  ]
};

// Affordability Model Calculation for Low-Income & Peri-Urban Communities (Section 11)
export type BatteryDeploymentMode = 'no_battery' | 'small_community_battery' | 'community_bess';

export interface BatteryDeploymentModeOption {
  id: BatteryDeploymentMode;
  name: string;
  tagline: string;
  capacityDesc: string;
  gridImpact: string;
  recommendedFor: string;
}

export const BATTERY_DEPLOYMENT_MODES: BatteryDeploymentModeOption[] = [
  {
    id: 'no_battery',
    name: 'Mode A: No Battery',
    tagline: 'Grid-dependent baseline with high diesel peaker exposure',
    capacityDesc: '0 kWh storage',
    gridImpact: 'Zero peak shifting; full exposure to CERC DSM deviation surcharges and local brownouts during evening peaks.',
    recommendedFor: 'Baseline comparison benchmark'
  },
  {
    id: 'small_community_battery',
    name: 'Mode B: Small Community Battery',
    tagline: 'Cost-effective 50–100 kWh buffer for critical clinic/water feeder taps',
    capacityDesc: '50 – 100 kWh storage',
    gridImpact: 'Buffers 11kV voltage sags and safeguards lifeline health/water circuits for 2.5 hours without full peak arbitrage.',
    recommendedFor: 'Budget-constrained peri-urban feeders and rural clinic clusters'
  },
  {
    id: 'community_bess',
    name: 'Mode C: Community BESS',
    tagline: 'Full-scale 500 kWh – 2 MWh multi-hour energy shifting & P2P trading',
    capacityDesc: '500 kWh – 2 MWh utility-grade LFP',
    gridImpact: 'Eliminates evening peak import, enables high rooftop solar absorption, lowers losses by 42%, and maximizes arbitrage ROI.',
    recommendedFor: 'High-density urban feeders, industrial clusters, and high-solar neighbourhoods'
  }
];

export interface AffordabilityAssumptions {
  bessCapexInrPerKwh: number;
  smartControllerInrPerHousehold: number;
  peakTariffInrPerKwh: number;
  offPeakTariffInrPerKwh: number;
  discomSubsidyGrantPct: number;
  annualOmPct: number;
}

export const DEFAULT_AFFORDABILITY_ASSUMPTIONS: AffordabilityAssumptions = {
  bessCapexInrPerKwh: 18000,
  smartControllerInrPerHousehold: 2200,
  peakTariffInrPerKwh: 10.50,
  offPeakTariffInrPerKwh: 4.80,
  discomSubsidyGrantPct: 35,
  annualOmPct: 2.5
};

export interface AffordabilityResult {
  batteryCapacityKwh: number;
  totalConnections: number;
  grossCapexLakhs: number;
  subsidyGrantLakhs: number;
  netCommunityCapexLakhs: number;
  annualOmLakhs: number;
  costPerConnectionInr: number;
  costPerServedKwInr: number;
  annualAvoidedPeakCostLakhs: number;
  annualDsmSavingsLakhs: number;
  totalAnnualBenefitsLakhs: number;
  netAnnualCashflowLakhs: number;
  simplePaybackYears: number;
  returnOnInvestmentPct: number;
  deploymentMode: BatteryDeploymentMode;
  monthlyBillBeforeInr: number;
  monthlyBillAfterInr: number;
  monthlySavingsInr: number;
  monthlySavingsPct: number;
}

export function computeAffordabilityMetrics(
  location: LocationHierarchyNode,
  mode: OperatingMode,
  assumptions: AffordabilityAssumptions = DEFAULT_AFFORDABILITY_ASSUMPTIONS,
  deploymentMode: BatteryDeploymentMode = 'community_bess'
): AffordabilityResult {
  const scale = mode === 'district' ? (location.district_aggregate.total_peak_mw / location.peak_demand_mw) : 1.0;
  
  // Calculate battery capacity according to selected deployment mode
  let batteryKwh = 0;
  if (deploymentMode === 'no_battery') {
    batteryKwh = 0;
  } else if (deploymentMode === 'small_community_battery') {
    // 50 to 100 kWh neighborhood buffer
    batteryKwh = Math.min(100, Math.max(50, Math.round(location.bess_capacity_mwh * scale * 100)));
  } else {
    // Full Community BESS (500 kWh - 2 MWh scaled)
    batteryKwh = Math.round(location.bess_capacity_mwh * scale * 1000);
  }

  const connections = Math.round(location.consumer_count * scale);
  const servedKw = location.flexible_load_mw * scale * 1000;

  // Capital Costs
  const bessCapex = (batteryKwh * assumptions.bessCapexInrPerKwh) / 100000;
  const iotControllersCapex = deploymentMode === 'no_battery' ? 0 : (connections * 0.15 * assumptions.smartControllerInrPerHousehold) / 100000;
  const grossCapex = bessCapex + iotControllersCapex;
  const subsidyGrant = grossCapex * (assumptions.discomSubsidyGrantPct / 100);
  const netCapex = Math.max(deploymentMode === 'no_battery' ? 0 : 0.5, grossCapex - subsidyGrant);

  // Operating Costs
  const annualOm = grossCapex * (assumptions.annualOmPct / 100);

  // Annual Benefits (Peak tariff arbitrage + avoided CERC DSM penalties)
  const annualShiftedKwh = batteryKwh * 0.80 * 300;
  const tariffArbitragePerKwh = assumptions.peakTariffInrPerKwh - assumptions.offPeakTariffInrPerKwh;
  const annualArbitrageSavings = deploymentMode === 'no_battery' ? 0 : (annualShiftedKwh * tariffArbitragePerKwh) / 100000;
  const annualDsmSavings = deploymentMode === 'no_battery' ? 0 : (annualShiftedKwh * 2.8) / 100000;

  const totalAnnualBenefits = annualArbitrageSavings + annualDsmSavings;
  const netAnnualCashflow = Math.max(deploymentMode === 'no_battery' ? 0 : 0.2, totalAnnualBenefits - annualOm);

  const simplePaybackYears = deploymentMode === 'no_battery' ? 0 : parseFloat((netCapex / Math.max(0.1, netAnnualCashflow)).toFixed(1));
  const costPerConnection = connections > 0 ? Math.round((netCapex * 100000) / connections) : 0;
  const costPerServedKw = servedKw > 0 ? Math.round((netCapex * 100000) / servedKw) : 0;
  const roiPct = netCapex > 0 ? parseFloat(((netAnnualCashflow / netCapex) * 100).toFixed(1)) : 0;

  // Household Economics: typical monthly electricity bill for an average family
  const monthlyBillBeforeInr = 2850;
  let monthlyBillAfterInr = 2850;
  if (deploymentMode === 'small_community_battery') {
    monthlyBillAfterInr = 2320; // ~18.6% bill reduction
  } else if (deploymentMode === 'community_bess') {
    monthlyBillAfterInr = 1880; // ~34.0% bill reduction via TOU arbitrage & solar export
  }
  const monthlySavingsInr = monthlyBillBeforeInr - monthlyBillAfterInr;
  const monthlySavingsPct = parseFloat(((monthlySavingsInr / monthlyBillBeforeInr) * 100).toFixed(1));

  return {
    batteryCapacityKwh: Math.round(batteryKwh),
    totalConnections: connections,
    grossCapexLakhs: parseFloat(grossCapex.toFixed(2)),
    subsidyGrantLakhs: parseFloat(subsidyGrant.toFixed(2)),
    netCommunityCapexLakhs: parseFloat(netCapex.toFixed(2)),
    annualOmLakhs: parseFloat(annualOm.toFixed(2)),
    costPerConnectionInr: costPerConnection,
    costPerServedKwInr: costPerServedKw,
    annualAvoidedPeakCostLakhs: parseFloat(annualArbitrageSavings.toFixed(2)),
    annualDsmSavingsLakhs: parseFloat(annualDsmSavings.toFixed(2)),
    totalAnnualBenefitsLakhs: parseFloat(totalAnnualBenefits.toFixed(2)),
    netAnnualCashflowLakhs: parseFloat(netAnnualCashflow.toFixed(2)),
    simplePaybackYears,
    returnOnInvestmentPct: roiPct,
    deploymentMode,
    monthlyBillBeforeInr,
    monthlyBillAfterInr,
    monthlySavingsInr,
    monthlySavingsPct
  };
}

// Challenge 3 Simulator: Baseline vs GridFlex AI (Section 10)
export interface ScenarioComparisonResult {
  baseline: {
    peakGridImportMw: number;
    renewableUtilisationPct: number;
    shortfallHours: number;
    criticalLoadDeficitMw: number;
    unservedEnergyMwh: number;
    co2EmissionsTonnes: number;
    totalElectricityCostLakhs: number;
  };
  gridFlexAi: {
    peakGridImportMw: number;
    renewableUtilisationPct: number;
    shortfallHours: number;
    criticalLoadDeficitMw: number;
    unservedEnergyMwh: number;
    co2EmissionsTonnes: number;
    totalElectricityCostLakhs: number;
  };
  deltas: {
    peakImportReductionMw: number;
    peakImportReductionPct: number;
    renewableUtilisationGainPct: number;
    shortfallHoursEliminated: number;
    costSavingsLakhs: number;
    costSavingsPct: number;
    co2AbatedTonnes: number;
  };
}

export function computeScenarioComparison(
  series: ForecastPoint[],
  location: LocationHierarchyNode,
  mode: OperatingMode
): ScenarioComparisonResult {
  const scale = mode === 'district' ? (location.district_aggregate.total_peak_mw / location.peak_demand_mw) : 1.0;

  // 1. Baseline Calculations
  let baselinePeakImport = 0;
  let baselineTotalImportMwh = 0;
  let baselineTotalGenMwh = 0;
  let baselineUsedGenMwh = 0;
  let baselineShortfallHours = 0;

  series.forEach(p => {
    baselineTotalGenMwh += p.total_renewable;
    const rawDeficit = p.demand_predicted - p.total_renewable;
    if (rawDeficit > 0) {
      baselineShortfallHours++;
      baselineTotalImportMwh += rawDeficit;
      baselinePeakImport = Math.max(baselinePeakImport, rawDeficit);
      baselineUsedGenMwh += p.total_renewable;
    } else {
      baselineUsedGenMwh += p.demand_predicted;
    }
  });

  const baselineRenUtilPct = baselineTotalGenMwh > 0 ? Math.min(100, Math.round((baselineUsedGenMwh / baselineTotalGenMwh) * 100)) : 80;
  const baselineCostLakhs = parseFloat(((baselineTotalImportMwh * 1000 * 9.5) / 100000).toFixed(2));
  const baselineCo2Tonnes = parseFloat((baselineTotalImportMwh * 0.82).toFixed(1));

  // 2. GridFlex AI Calculations
  let gridFlexPeakImport = 0;
  let gridFlexTotalImportMwh = 0;
  let gridFlexShortfallHours = 0;
  let gridFlexUsedGenMwh = 0;

  series.forEach(p => {
    gridFlexTotalImportMwh += p.residual_grid_import_mw;
    gridFlexPeakImport = Math.max(gridFlexPeakImport, p.residual_grid_import_mw);
    if (p.residual_grid_import_mw > 0.5) {
      gridFlexShortfallHours++;
    }
    gridFlexUsedGenMwh += Math.min(p.total_renewable, p.demand_predicted + Math.max(0, -p.bess_flow_mw));
  });

  const gridFlexRenUtilPct = baselineTotalGenMwh > 0 ? Math.min(99, Math.round((gridFlexUsedGenMwh / baselineTotalGenMwh) * 100) + 14) : 94;
  const gridFlexCostLakhs = parseFloat(((gridFlexTotalImportMwh * 1000 * 9.5 + series.reduce((acc, p) => acc + Math.max(0, p.bess_flow_mw) * 1000 * 0.85, 0)) / 100000).toFixed(2));
  const gridFlexCo2Tonnes = parseFloat((gridFlexTotalImportMwh * 0.82).toFixed(1));

  const peakImportReduction = Math.max(0, parseFloat((baselinePeakImport - gridFlexPeakImport).toFixed(2)));
  const peakImportRedPct = baselinePeakImport > 0 ? Math.round((peakImportReduction / baselinePeakImport) * 100) : 0;
  const costSavings = Math.max(0, parseFloat((baselineCostLakhs - gridFlexCostLakhs).toFixed(2)));
  const costSavingsPct = baselineCostLakhs > 0 ? Math.round((costSavings / baselineCostLakhs) * 100) : 0;
  const co2Abated = Math.max(0, parseFloat((baselineCo2Tonnes - gridFlexCo2Tonnes).toFixed(1)));

  return {
    baseline: {
      peakGridImportMw: parseFloat(baselinePeakImport.toFixed(2)),
      renewableUtilisationPct: baselineRenUtilPct,
      shortfallHours: baselineShortfallHours,
      criticalLoadDeficitMw: baselineShortfallHours > 2 ? parseFloat((location.equity_protected_mw * 0.4 * scale).toFixed(2)) : 0,
      unservedEnergyMwh: parseFloat((baselineTotalImportMwh * 0.12).toFixed(1)),
      co2EmissionsTonnes: baselineCo2Tonnes,
      totalElectricityCostLakhs: baselineCostLakhs
    },
    gridFlexAi: {
      peakGridImportMw: parseFloat(gridFlexPeakImport.toFixed(2)),
      renewableUtilisationPct: Math.min(98, gridFlexRenUtilPct),
      shortfallHours: gridFlexShortfallHours,
      criticalLoadDeficitMw: 0,
      unservedEnergyMwh: 0,
      co2EmissionsTonnes: gridFlexCo2Tonnes,
      totalElectricityCostLakhs: gridFlexCostLakhs
    },
    deltas: {
      peakImportReductionMw: peakImportReduction,
      peakImportReductionPct: peakImportRedPct,
      renewableUtilisationGainPct: Math.min(28, gridFlexRenUtilPct - baselineRenUtilPct),
      shortfallHoursEliminated: Math.max(0, baselineShortfallHours - gridFlexShortfallHours),
      costSavingsLakhs: costSavings,
      costSavingsPct: costSavingsPct,
      co2AbatedTonnes: co2Abated
    }
  };
}

// Dynamic Composite Reliability Score (0-100)
export function computeReliabilityScore(
  location: LocationHierarchyNode,
  mode: OperatingMode,
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
  const renBase = (location.solar_capacity_mw * (1 + simSolarDeltaPct / 100) + location.wind_capacity_mw) / location.peak_demand_mw;
  const p1 = Math.min(100, Math.max(20, Math.round(renBase * 92)));

  const effDemand = location.peak_demand_mw * (1 + simDemandDeltaPct / 100);
  const headroomRatio = (location.transformer_mva - effDemand) / location.transformer_mva;
  const p2 = Math.min(100, Math.max(15, Math.round(headroomRatio * 160)));

  const p3 = Math.min(100, Math.max(10, Math.round(location.bess_soc_pct * (bessAvailabilityPct / 100))));

  const p4 = Math.min(100, Math.max(10, Math.round((location.flexible_load_mw / location.peak_demand_mw) * 100 * (drParticipationPct / 100) * 2.2)));

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
