from fastapi import APIRouter

router = APIRouter()

FEEDERS = [
    {
        "id": "F-01",
        "name": "North Residential Feeder (11kV)",
        "substation": "North 33/11kV Substation",
        "load_mw": 14.8,
        "capacity_mw": 18.0,
        "loading_pct": 82.2,
        "voltage_pu": 0.982,
        "solar_pv_connected_mw": 6.2,
        "risk_level": "Moderate",
        "available_flexibility_mw": 2.4,
        "recommended_intervention": "Stagger EV charging windows post 20:00"
    },
    {
        "id": "F-02",
        "name": "High-Tech Industrial Park (11kV)",
        "substation": "North 33/11kV Substation",
        "load_mw": 22.4,
        "capacity_mw": 25.0,
        "loading_pct": 89.6,
        "voltage_pu": 0.974,
        "solar_pv_connected_mw": 12.5,
        "risk_level": "High Congestion",
        "available_flexibility_mw": 4.8,
        "recommended_intervention": "Execute BESS-02 2.8 MW discharge at 18:30"
    },
    {
        "id": "F-03",
        "name": "Green Valley Agricultural Microgrid (11kV)",
        "substation": "West Primary Substation",
        "load_mw": 9.2,
        "capacity_mw": 15.0,
        "loading_pct": 61.3,
        "voltage_pu": 1.012,
        "solar_pv_connected_mw": 14.0,
        "risk_level": "Surplus Reverse Flow",
        "available_flexibility_mw": 3.2,
        "recommended_intervention": "Activate water pump solar capture schedule"
    },
    {
        "id": "F-04",
        "name": "Metro Transit & Commercial Core (11kV)",
        "substation": "Central Grid Substation",
        "load_mw": 17.8,
        "capacity_mw": 22.0,
        "loading_pct": 80.9,
        "voltage_pu": 0.988,
        "solar_pv_connected_mw": 4.5,
        "risk_level": "Stable",
        "available_flexibility_mw": 2.4,
        "recommended_intervention": "Maintain standby spinning reserve"
    }
]

@router.get("/overview")
def get_discom_overview():
    total_load = sum(f["load_mw"] for f in FEEDERS)
    total_capacity = sum(f["capacity_mw"] for f in FEEDERS)
    avg_loading = round((total_load / total_capacity) * 100, 1)
    total_flex = sum(f["available_flexibility_mw"] for f in FEEDERS)
    
    return {
        "status": "success",
        "grid_operator": "State Distribution Company (DISCOM) Regional Operations",
        "total_active_feeders": len(FEEDERS),
        "total_load_mw": round(total_load, 1),
        "total_capacity_mw": round(total_capacity, 1),
        "network_average_loading_pct": avg_loading,
        "total_available_flexibility_mw": round(total_flex, 1),
        "feeders": FEEDERS
    }
