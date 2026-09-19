from fastapi import APIRouter

router = APIRouter()

@router.get("/breakdown")
def get_resilience_breakdown():
    """
    Transparent mathematical calculation of the Grid Resilience Indicator.
    Never an opaque black box.
    Composite Resilience = w1*Renewable + w2*DemandStress + w3*Storage + w4*Flexibility
    """
    # Pillar 1: Renewable Availability (weight 25%)
    # Ratio of current renewable generation to total demand
    current_renewable_mw = 51.4
    current_demand_mw = 64.2
    ren_ratio = min(1.0, current_renewable_mw / current_demand_mw)
    ren_score = round(ren_ratio * 100.0, 1)
    
    # Pillar 2: Demand Stress Margin (weight 25%)
    # Substation transformer rating vs current load
    substation_capacity_mw = 85.0
    headroom_pct = max(0.0, (substation_capacity_mw - current_demand_mw) / substation_capacity_mw * 100.0)
    demand_stress_score = round(min(100.0, headroom_pct * 3.5), 1)  # 24% headroom maps to ~85/100
    
    # Pillar 3: Storage Readiness (weight 25%)
    # State of Charge weighted across active 40 MWh fleet
    bess_soc_pct = 72.5
    storage_score = bess_soc_pct
    
    # Pillar 4: Flexible Load Availability (weight 25%)
    # Available demand response MW vs 15 MW target
    flex_available_mw = 12.8
    flex_score = round(min(100.0, (flex_available_mw / 15.0) * 100.0), 1)
    
    # Formula & weights
    weights = {
        "renewable_availability": 0.25,
        "demand_stress_margin": 0.25,
        "storage_readiness": 0.25,
        "flexibility_readiness": 0.25
    }
    
    composite = round(
        (ren_score * weights["renewable_availability"]) +
        (demand_stress_score * weights["demand_stress_margin"]) +
        (storage_score * weights["storage_readiness"]) +
        (flex_score * weights["flexibility_readiness"]),
        1
    )
    
    # Timeline of recent factor changes (why the score changed)
    recent_changes = [
        {
            "timestamp": "10 minutes ago",
            "factor": "Renewable Availability",
            "delta": "+4.2 pts",
            "cause": "Solar irradiance peaked at 890 W/m² as midday cloud cover cleared."
        },
        {
            "timestamp": "35 minutes ago",
            "factor": "Demand Stress Margin",
            "delta": "-3.1 pts",
            "cause": "Commercial HVAC chillers ramped up due to ambient temperature reaching 31.5°C."
        },
        {
            "timestamp": "1 hour ago",
            "factor": "Storage Readiness",
            "delta": "+5.8 pts",
            "cause": "Substation BESS-01 completed scheduled 5 MW bulk solar charge cycle."
        }
    ]
    
    # Prescriptive improvements
    prescriptive_actions = [
        {
            "rank": 1,
            "action": "Pre-cool commercial real estate towers by 1.5°C between 13:00-15:00",
            "potential_gain": "+6.4 pts Resilience",
            "feasibility": "High"
        },
        {
            "rank": 2,
            "action": "Shift 2.5 MW municipal water pumping cycle to 13:30 solar crest",
            "potential_gain": "+4.8 pts Resilience",
            "feasibility": "Immediate"
        },
        {
            "rank": 3,
            "action": "Hold BESS-02 discharge reserve threshold at minimum 65% until 18:00",
            "potential_gain": "+3.5 pts Resilience",
            "feasibility": "High"
        }
    ]
    
    return {
        "status": "success",
        "composite_score": composite,
        "status_grade": "High Resilience" if composite >= 80 else ("Adequate" if composite >= 65 else "At Risk"),
        "formula": "Composite = (0.25 * Renewable) + (0.25 * DemandMargin) + (0.25 * StorageSOC) + (0.25 * FlexLoad)",
        "components": [
            {
                "key": "renewable_availability",
                "name": "Renewable Generation Availability",
                "weight": 0.25,
                "score": ren_score,
                "raw_value": f"{current_renewable_mw} MW / {current_demand_mw} MW demand",
                "description": "Portion of active demand supplied directly by local zero-carbon generation."
            },
            {
                "key": "demand_stress_margin",
                "name": "Substation Demand Headroom Margin",
                "weight": 0.25,
                "score": demand_stress_score,
                "raw_value": f"{round(substation_capacity_mw - current_demand_mw, 1)} MW Headroom ({round(headroom_pct, 1)}%)",
                "description": "Thermal buffer remaining on primary 33kV substation power transformers."
            },
            {
                "key": "storage_readiness",
                "name": "Community Storage Readiness",
                "weight": 0.25,
                "score": storage_score,
                "raw_value": f"{bess_soc_pct}% Fleet SOC (29.0 MWh stored)",
                "description": "Available fast-response battery energy ready to mitigate instant ramps."
            },
            {
                "key": "flexibility_readiness",
                "name": "Flexible Load Demand Response Capacity",
                "weight": 0.25,
                "score": flex_score,
                "raw_value": f"{flex_available_mw} MW ready ({round(flex_score, 1)}% enrolled)",
                "description": "Controllable flexible demand (EV charging, cold storage, HVAC) ready for dispatch."
            }
        ],
        "recent_factor_changes": recent_changes,
        "prescriptive_actions": prescriptive_actions
    }
