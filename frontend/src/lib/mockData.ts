// Seeded datasets directly matching FastAPI backend structure for 100% offline and standalone integrity

export const SEEDED_TELEMETRY = {
  status: "success",
  data_source_label: "Simulation (Live Synthetic Telemetry Feed)",
  timestamp: Date.now(),
  metrics: {
    solar_generation_mw: 44.8,
    wind_generation_mw: 19.4,
    renewable_total_mw: 64.2,
    grid_demand_mw: 58.6,
    net_balance_mw: 5.6,
    is_shortage: false,
    battery_fleet_soc_pct: 74.2,
    battery_capacity_total_mwh: 40.0,
    battery_power_limit_mw: 12.0,
    flexible_load_available_mw: 12.8,
    forecast_risk_level: "Moderate",
    composite_resilience_score: 78.4,
    grid_frequency_hz: 50.02,
    co2_intensity_g_kwh: 185.0
  },
  active_recommendation: {
    action_id: "REC-704",
    action_type: "BESS Storage Buffer & Pre-cooling Schedule",
    reason: "Projected net balance is +5.6 MW. Grid risk level is Moderate.",
    target_power_mw: 5.6,
    expected_impact: "Absorbs midday solar surplus and secures 14.5 MWh for the evening ramp window.",
    confidence: 0.94
  }
};

export const SEEDED_RENEWABLE_SERIES = Array.from({ length: 24 }, (_, h) => {
  const solar_pred = (h >= 6 && h <= 18) ? Math.sin(Math.PI * (h - 6) / 12) * 52.0 : 0.0;
  const wind_pred = 16.0 + 5.0 * Math.cos(h / 3.8);
  return {
    hour: h,
    time: `${h.toString().padStart(2, '0')}:00`,
    solar_predicted: parseFloat(solar_pred.toFixed(2)),
    solar_actual: h <= 14 ? parseFloat((solar_pred + (Math.sin(h) * 1.5)).toFixed(2)) : null,
    solar_upper_95: parseFloat((solar_pred + solar_pred * 0.12 + 1.5).toFixed(2)),
    solar_lower_95: parseFloat(Math.max(0, solar_pred - (solar_pred * 0.12 + 1.5)).toFixed(2)),
    wind_predicted: parseFloat(wind_pred.toFixed(2)),
    wind_actual: h <= 14 ? parseFloat((wind_pred + Math.cos(h) * 1.2).toFixed(2)) : null,
    total_renewable: parseFloat((solar_pred + wind_pred).toFixed(2)),
    weather: {
      ghi_w_m2: Math.round(solar_pred * 18.5),
      temperature_c: parseFloat((22.0 + 8.0 * Math.sin(Math.PI * (h - 7) / 14)).toFixed(1)),
      cloud_cover_pct: Math.round(Math.max(5, Math.min(85, 30 + 20 * Math.sin(h / 2)))),
      wind_speed_ms: parseFloat((wind_pred * 0.42).toFixed(1))
    }
  };
});

export const SEEDED_RENEWABLE_SERIES_48 = Array.from({ length: 48 }, (_, h) => {
  const day = Math.floor(h / 24) + 1;
  const h_day = h % 24;
  const solar_peak = day === 1 ? 52.0 : 43.5;
  const solar_pred = (h_day >= 6 && h_day <= 18) ? Math.sin(Math.PI * (h_day - 6) / 12) * solar_peak : 0.0;
  const wind_base = day === 1 ? 16.0 : 19.5;
  const wind_pred = wind_base + 5.0 * Math.cos(h / 3.8) + 2.0 * Math.sin(h / 5.2);
  const uncertainty = day === 1 ? 1.0 : 1.45;
  return {
    hour: h,
    time: `${h_day.toString().padStart(2, '0')}:00 (D${day})`,
    day,
    solar_predicted: parseFloat(solar_pred.toFixed(2)),
    solar_actual: h <= 14 ? parseFloat((solar_pred + (Math.sin(h) * 1.5)).toFixed(2)) : null,
    solar_upper_95: parseFloat((solar_pred + (solar_pred * 0.12 + 1.5) * uncertainty).toFixed(2)),
    solar_lower_95: parseFloat(Math.max(0, solar_pred - (solar_pred * 0.12 + 1.5) * uncertainty).toFixed(2)),
    wind_predicted: parseFloat(wind_pred.toFixed(2)),
    wind_actual: h <= 14 ? parseFloat((wind_pred + Math.cos(h) * 1.2).toFixed(2)) : null,
    total_renewable: parseFloat((solar_pred + wind_pred).toFixed(2)),
    weather: {
      ghi_w_m2: Math.round(solar_pred * 18.5),
      temperature_c: parseFloat((22.0 + 8.0 * Math.sin(Math.PI * (h_day - 7) / 14)).toFixed(1)),
      cloud_cover_pct: Math.round(Math.max(5, Math.min(85, (day === 1 ? 25 : 42) + 20 * Math.sin(h / 2)))),
      wind_speed_ms: parseFloat((wind_pred * 0.42).toFixed(1))
    }
  };
});

export const SEEDED_DEMAND_SERIES = Array.from({ length: 24 }, (_, h) => {
  const base = 45.0;
  const morning_peak = 18.0 * Math.exp(-Math.pow(h - 10, 2) / 6);
  const evening_peak = 26.0 * Math.exp(-Math.pow(h - 20, 2) / 8);
  const pred = parseFloat((base + morning_peak + evening_peak).toFixed(2));
  const is_peak = h >= 18 && h <= 22;
  return {
    hour: h,
    time: `${h.toString().padStart(2, '0')}:00`,
    demand_predicted: pred,
    demand_actual: h <= 14 ? parseFloat((pred + (Math.sin(h * 2) * 1.8)).toFixed(2)) : null,
    is_peak_window: is_peak,
    risk_status: is_peak ? "High Peak" : (h >= 9 && h <= 12 ? "Moderate" : "Normal"),
    segments: {
      residential: parseFloat((pred * (h >= 18 ? 0.42 : 0.28)).toFixed(2)),
      commercial_hvac: parseFloat((pred * (h >= 9 && h <= 17 ? 0.38 : 0.18)).toFixed(2)),
      industrial: parseFloat((pred * 0.22).toFixed(2)),
      ev_charging: parseFloat((pred * 0.12).toFixed(2))
    }
  };
});
