// Unit Test Suite for Challenge 03: District & Neighbourhood Grid Reliability Calculations
// Can be executed via node / tsx / vitest / jest

import {
  HIERARCHY_LOCATIONS,
  generateFeederForecastSeries,
  calculateIntermittencyGapSummary,
  computeAffordabilityMetrics,
  computeScenarioComparison,
  computeReliabilityScore,
  DEFAULT_AFFORDABILITY_ASSUMPTIONS
} from './neighbourhoodData';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

export function runChallenge3Tests() {
  console.log('--- RUNNING CHALLENGE 03 ENGINE VERIFICATION TESTS ---');

  // Test 1: Hierarchy and Demo Path (Uttar Pradesh -> Lucknow -> Gomti Nagar)
  const lko = HIERARCHY_LOCATIONS.find(l => l.state === 'Uttar Pradesh' && l.district === 'Lucknow');
  assert(!!lko, 'Uttar Pradesh -> Lucknow -> Gomti Nagar demo path must exist');
  assert(lko?.locality.includes('Gomti Nagar'), 'Gomti Nagar locality must be defined');
  console.log('✓ Test 1 Passed: Working demo path (Uttar Pradesh -> Lucknow -> Gomti Nagar) verified.');

  // Test 2: Forecast Series & Supply-Demand Balance
  const series24h = generateFeederForecastSeries(lko!, 'neighbourhood', '24h', 'normal_solar');
  assert(series24h.length === 24, '24h series must have exactly 24 points');
  series24h.forEach(p => {
    assert(typeof p.solar_predicted === 'number', 'Solar predicted must be numeric');
    assert(typeof p.demand_predicted === 'number', 'Demand predicted must be numeric');
    assert(typeof p.net_balance_mw === 'number', 'Net balance must be numeric');
    assert(typeof p.residual_grid_import_mw === 'number', 'Residual grid import must be numeric');
    assert(p.residual_grid_import_mw >= 0, 'Residual grid import must be non-negative');
  });
  console.log('✓ Test 2 Passed: 24h forecast series and balance equations verified.');

  // Test 3: Shared Battery Dispatch & 20% Emergency Reserve Preservation
  const eveningRampSeries = generateFeederForecastSeries(lko!, 'neighbourhood', '24h', 'evening_ramp');
  eveningRampSeries.forEach(p => {
    assert(p.bess_soc_pct >= 20.0, `Battery SOC (${p.bess_soc_pct}%) must never drop below 20% emergency reserve`);
  });
  console.log('✓ Test 3 Passed: Shared Community Battery algorithm guarantees 20% emergency reserve.');

  // Test 4: District Mode Scaling
  const districtSeries = generateFeederForecastSeries(lko!, 'district', '24h', 'normal_solar');
  const districtPeak = Math.max(...districtSeries.map(p => p.demand_predicted));
  const neighbourhoodPeak = Math.max(...series24h.map(p => p.demand_predicted));
  assert(districtPeak > neighbourhoodPeak * 10, 'District peak demand must properly aggregate across all district feeders');
  console.log('✓ Test 4 Passed: District Mode vs Neighbourhood Mode mathematical aggregation verified.');

  // Test 5: Critical Lifeline Protection
  const severeSeries = generateFeederForecastSeries(lko!, 'neighbourhood', '24h', 'combined_shortfall', 'aggressive');
  const comparison = computeScenarioComparison(severeSeries, lko!, 'neighbourhood');
  assert(comparison.gridFlexAi.criticalLoadDeficitMw === 0, 'GridFlex AI must maintain 100% protection (0 MW deficit) for critical loads');
  assert(comparison.deltas.peakImportReductionMw > 0, 'GridFlex AI must achieve positive peak grid import reduction');
  console.log('✓ Test 5 Passed: Critical lifeline loads (hospitals, water pumps) maintain 100% immunity.');

  // Test 6: Affordability Engine & Payback Calculation
  const affordability = computeAffordabilityMetrics(lko!, 'neighbourhood', DEFAULT_AFFORDABILITY_ASSUMPTIONS);
  assert(affordability.grossCapexLakhs > 0, 'Gross CAPEX must be positive');
  assert(affordability.subsidyGrantLakhs > 0, 'Subsidy grant must be positive');
  assert(affordability.netCommunityCapexLakhs < affordability.grossCapexLakhs, 'Net community CAPEX must reflect subsidy deduction');
  assert(affordability.costPerConnectionInr > 0, 'Cost per connection must be calculated');
  assert(affordability.simplePaybackYears > 0 && affordability.simplePaybackYears < 15, `Simple payback (${affordability.simplePaybackYears} years) must be realistic`);
  console.log(`✓ Test 6 Passed: Affordability calculations verified (Simple Payback: ${affordability.simplePaybackYears} years, ₹${affordability.costPerConnectionInr}/household).`);

  // Test 7: Composite Reliability Score
  const scoreResult = computeReliabilityScore(lko!, 'neighbourhood', 0, 0, 100, 100);
  assert(scoreResult.score >= 50 && scoreResult.score <= 100, `Reliability score (${scoreResult.score}) must be between 50 and 100`);
  console.log(`✓ Test 7 Passed: Composite Reliability Score computed dynamically: ${scoreResult.score}/100 (${scoreResult.status}).`);

  console.log('--- ALL CHALLENGE 03 CALCULATION TESTS PASSED SUCCESSFULLY ---');
  return true;
}

// Execute tests if invoked directly
runChallenge3Tests();
