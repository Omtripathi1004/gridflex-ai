import scenarioData from '../data/scenario.json';

export interface ProvenanceRecord {
  metric: string;
  value: number | string;
  unit: string;
  fetched_at: string;
  source_name: string;
  source_url: string;
  license: string;
  mode: 'live' | 'cached' | 'seeded';
  classification: 'real' | 'scaled_real' | 'forecast' | 'simulated';
}

/**
 * Appendix A1: SHAP Additivity Verification (Lundberg et al.)
 * Validates baseline + sum(contributions) == prediction within numeric tolerance.
 */
export function checkAdditivity(baseline: number, contribs: number[], prediction: number, tol = 0.05) {
  const sum = contribs.reduce((a, b) => a + b, 0);
  const gap = baseline + sum - prediction;
  return { 
    ok: Math.abs(gap) <= tol, 
    gap: Number(gap.toFixed(2)), 
    sum: Number(sum.toFixed(2)) 
  };
}

/**
 * Appendix A2: Resilience Score derived from 4 weighted pillars
 */
export function calculateResilienceScore(pillars: Array<{ weight: number; value: number }>) {
  const score = pillars.reduce((s, p) => s + p.weight * p.value, 0);
  const rounded = Number(score.toFixed(1));
  const status = rounded >= 90 ? 'Excellent' : rounded >= 75 ? 'Healthy & Resilient' : rounded >= 60 ? 'Watch' : 'At risk';
  return { score: rounded, status };
}

/**
 * Appendix A3: Battery Schedule Feasibility Check
 * Tracks physical State of Charge (SoC) across hourly blocks respecting efficiency and usable window (10%-90%)
 */
export interface ScheduleBlock {
  time: string;
  hours: number;
  mw: number; // mw > 0 discharge, mw < 0 charge
  mode: string;
  reason: string;
}

export function checkBatterySchedule(
  soc0Mwh = 29.0,
  capacityMwh = 40.0,
  blocks: ScheduleBlock[],
  eta_c = 0.94,
  eta_d = 0.94,
  lo = 0.10,
  hi = 0.90
) {
  let soc = soc0Mwh;
  const minMwh = lo * capacityMwh; // 4.0 MWh
  const maxMwh = hi * capacityMwh; // 36.0 MWh

  const trajectory = blocks.map(block => {
    const delta = block.mw < 0 
      ? (-block.mw * block.hours * eta_c) // charging adds energy scaled by efficiency
      : (-block.mw * block.hours / eta_d); // discharging draws energy scaled by efficiency
    
    soc = Math.max(0, Math.min(capacityMwh, soc + delta));
    const socPct = Number(((soc / capacityMwh) * 100).toFixed(1));
    const isFeasible = soc >= minMwh - 0.1 && soc <= maxMwh + 0.1;

    return {
      ...block,
      soc_mwh: Number(soc.toFixed(2)),
      soc_pct: socPct,
      is_feasible: isFeasible,
      binding_constraint: soc > maxMwh ? 'SoC High Limit (90%)' : (soc < minMwh ? 'SoC Low Limit (10%)' : 'None')
    };
  });

  return {
    initial_soc_mwh: soc0Mwh,
    final_soc_mwh: Number(soc.toFixed(2)),
    min_allowed_mwh: minMwh,
    max_allowed_mwh: maxMwh,
    trajectory
  };
}

// Export default baseline scenario
export const SCENARIO = scenarioData;
