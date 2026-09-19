from fastapi import APIRouter
import time
import math
import random

router = APIRouter()

@router.get("/live")
def get_live_telemetry():
    """
    Returns simulated live grid telemetry with timestamps and dynamic oscillation.
    Strictly labeled as Simulation per guidelines.
    """
    now = time.time()
    hour = (now / 3600) % 24
    
    # Solar profile (peaks around midday)
    solar_base = max(0.0, math.sin(math.pi * (hour - 6) / 12)) * 48.5 if 6 <= hour <= 18 else 0.0
    solar = round(solar_base + random.uniform(-0.8, 0.8), 2)
    solar = max(0.0, solar)
    
    # Wind profile (steady with gust variance)
    wind = round(18.2 + math.cos(hour / 3.0) * 4.5 + random.uniform(-1.2, 1.2), 2)
    
    renewable_total = round(solar + wind, 2)
    
    # Demand profile (peaks at 10-12 and 18-22)
    demand_base = 52.0 + 15.0 * math.sin(math.pi * (hour - 5) / 14) + (18.0 if 18 <= hour <= 22 else 0.0)
    demand = round(demand_base + random.uniform(-1.5, 1.5), 2)
    
    net_balance = round(renewable_total - demand, 2)
    
    # Battery Fleet SOC
    soc = round(68.5 + 4.0 * math.sin(hour / 4.0) + random.uniform(-0.5, 0.5), 1)
    soc = max(15.0, min(95.0, soc))
    
    # Flexible load ready
    flexible_load = round(12.4 + random.uniform(-0.4, 0.6), 2)
    
    # Forecast risk calculation
    if net_balance < -15:
        risk_level = "Critical"
    elif net_balance < -5:
        risk_level = "High"
    elif net_balance < 5:
        risk_level = "Moderate"
    else:
        risk_level = "Low"
        
    # Resilience score calculation (4 pillars)
    renewable_score = min(100.0, (renewable_total / max(1.0, demand)) * 100)
    demand_margin = max(0.0, 100.0 - (demand / 85.0 * 100.0))
    storage_readiness = soc
    flex_score = (flexible_load / 15.0) * 100.0
    composite_resilience = round((renewable_score * 0.25) + (demand_margin * 0.25) + (storage_readiness * 0.25) + (flex_score * 0.25), 1)
    
    return {
        "status": "success",
        "data_source_label": "Simulation (Live Synthetic Telemetry Feed)",
        "timestamp": int(now),
        "iso_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(now)),
        "metrics": {
            "solar_generation_mw": solar,
            "wind_generation_mw": wind,
            "renewable_total_mw": renewable_total,
            "grid_demand_mw": demand,
            "net_balance_mw": net_balance,
            "is_shortage": net_balance < 0,
            "battery_fleet_soc_pct": soc,
            "battery_capacity_total_mwh": 40.0,
            "battery_power_limit_mw": 12.0,
            "flexible_load_available_mw": flexible_load,
            "forecast_risk_level": risk_level,
            "composite_resilience_score": composite_resilience,
            "grid_frequency_hz": round(50.0 + random.uniform(-0.04, 0.04), 3),
            "co2_intensity_g_kwh": round(max(120.0, 480.0 - (renewable_total / demand * 360.0)), 1)
        },
        "active_recommendation": {
            "action_id": "REC-704",
            "action_type": "BESS Discharge & Flexible EV Shifting" if net_balance < 0 else "BESS Charging & Thermal Pre-cooling",
            "reason": f"Projected net balance is {net_balance} MW. Grid risk level is {risk_level}.",
            "target_power_mw": abs(min(net_balance, 0.0)) if net_balance < 0 else round(min(net_balance, 8.0), 2),
            "expected_impact": "Prevents feeder overload and eliminates ₹1,42,500 DSM peak deviation penalty.",
            "confidence": 0.94
        }
    }
