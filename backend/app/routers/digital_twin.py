from fastapi import APIRouter
from pydantic import BaseModel
import math

router = APIRouter()

class SimulationParams(BaseModel):
    solar_multiplier: float = 1.0       # 0.0 to 1.5
    wind_multiplier: float = 1.0        # 0.0 to 1.5
    demand_multiplier: float = 1.0      # 0.7 to 1.5
    battery_capacity_pct: float = 100.0 # 0.0 to 100.0
    flexible_load_pct: float = 100.0    # 0.0 to 100.0
    weather_severity: str = "NORMAL"    # "NORMAL", "HEATWAVE", "STORM_FRONT"

@router.post("/simulate")
def run_digital_twin_simulation(params: SimulationParams):
    """
    Instantly recalculates grid power balance, deficit windows,
    resilience indicator, and operational recommendations based on what-if parameters.
    """
    # Weather severity adjustments
    weather_demand_factor = 1.0
    weather_solar_factor = 1.0
    weather_wind_factor = 1.0
    
    if params.weather_severity == "HEATWAVE":
        weather_demand_factor = 1.25  # HVAC surge
        weather_solar_factor = 1.05   # Clear skies but solar PV heat derating
    elif params.weather_severity == "STORM_FRONT":
        weather_demand_factor = 1.05
        weather_solar_factor = 0.25   # Severe cloud blockage
        weather_wind_factor = 1.35    # High turbulent wind
        
    hours = range(0, 24)
    profile = []
    
    total_generation = 0.0
    total_demand = 0.0
    max_deficit = 0.0
    shortage_hours = 0
    
    for h in hours:
        # Base generation
        base_solar = max(0.0, math.sin(math.pi * (h - 6) / 12)) * 48.0 if 6 <= h <= 18 else 0.0
        base_wind = 18.0 + 4.5 * math.cos(h / 3.2)
        
        sim_solar = base_solar * params.solar_multiplier * weather_solar_factor
        sim_wind = base_wind * params.wind_multiplier * weather_wind_factor
        sim_gen = sim_solar + sim_wind
        
        # Base demand
        base_demand = (46.0 + 16.0 * math.exp(-((h - 10) ** 2) / 6) + 26.0 * math.exp(-((h - 20) ** 2) / 8))
        sim_demand = base_demand * params.demand_multiplier * weather_demand_factor
        
        net_balance = sim_gen - sim_demand
        
        total_generation += sim_gen
        total_demand += sim_demand
        
        if net_balance < 0:
            shortage_hours += 1
            if abs(net_balance) > max_deficit:
                max_deficit = abs(net_balance)
                
        profile.append({
            "hour": h,
            "time": f"{h:02d}:00",
            "solar_mw": round(sim_solar, 2),
            "wind_mw": round(sim_wind, 2),
            "total_gen_mw": round(sim_gen, 2),
            "demand_mw": round(sim_demand, 2),
            "net_balance_mw": round(net_balance, 2),
            "is_deficit": net_balance < 0
        })
        
    # Recalculate Risk & Resilience
    avg_gen = total_generation / 24.0
    avg_dem = total_demand / 24.0
    
    renewable_avail_score = min(100.0, (total_generation / max(1.0, total_demand)) * 100.0)
    demand_stress_score = max(0.0, 100.0 - (max_deficit / 30.0 * 100.0))
    storage_readiness = params.battery_capacity_pct
    flex_readiness = params.flexible_load_pct
    
    composite_resilience = round(
        (renewable_avail_score * 0.25) +
        (demand_stress_score * 0.25) +
        (storage_readiness * 0.25) +
        (flex_readiness * 0.25),
        1
    )
    
    if max_deficit > 22.0 or composite_resilience < 45.0:
        risk_level = "Critical Grid Stress"
        recommended_action = "Trigger Stage 3 Demand Response, dispatch 100% BESS emergency reserves, and prepare spinning thermal backup."
    elif max_deficit > 10.0 or composite_resilience < 70.0:
        risk_level = "Elevated Deficit Risk"
        recommended_action = "Schedule evening BESS discharge (8-10 MW) and shift 4.5 MW commercial HVAC/EV loads into midday."
    else:
        risk_level = "Stable & Resilient"
        recommended_action = "System balanced. Optimize storage arbitrage and maximize local P2P prosumer trading."
        
    return {
        "status": "success",
        "inputs": params.dict(),
        "summary": {
            "total_daily_generation_mwh": round(total_generation, 1),
            "total_daily_demand_mwh": round(total_demand, 1),
            "net_daily_balance_mwh": round(total_generation - total_demand, 1),
            "peak_deficit_mw": round(max_deficit, 2),
            "shortage_hours_count": shortage_hours,
            "risk_classification": risk_level,
            "composite_resilience_score": composite_resilience,
            "recommended_operational_action": recommended_action
        },
        "resilience_breakdown": {
            "renewable_availability": round(renewable_avail_score, 1),
            "demand_stress_margin": round(demand_stress_score, 1),
            "storage_readiness": round(storage_readiness, 1),
            "flexibility_availability": round(flex_readiness, 1)
        },
        "simulated_24h_curve": profile
    }
