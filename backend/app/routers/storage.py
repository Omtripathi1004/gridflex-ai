from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Digitally modeled battery fleet
BESS_FLEET = [
    {
        "id": "BESS-01",
        "name": "Substation 33kV Main Battery",
        "location": "North Substation Zone",
        "chemistry": "Lithium Iron Phosphate (LFP)",
        "capacity_mwh": 18.0,
        "max_power_mw": 5.0,
        "current_soc_pct": 74.0,
        "efficiency_roundtrip_pct": 91.5,
        "cycle_life_remaining_pct": 96.2,
        "status": "Ready / Automated Dispatch",
        "charge_limit_mw": 5.0,
        "discharge_limit_mw": 5.0,
        "target_evening_discharge_mw": 4.5
    },
    {
        "id": "BESS-02",
        "name": "Tech Park Distributed BESS",
        "location": "Commercial Feeder F-02",
        "chemistry": "LFP Rack Scalable",
        "capacity_mwh": 10.0,
        "max_power_mw": 3.0,
        "current_soc_pct": 68.0,
        "efficiency_roundtrip_pct": 90.0,
        "cycle_life_remaining_pct": 94.8,
        "status": "Ready / Automated Dispatch",
        "charge_limit_mw": 3.0,
        "discharge_limit_mw": 3.0,
        "target_evening_discharge_mw": 2.8
    },
    {
        "id": "BESS-03",
        "name": "EcoDistrict Microgrid Storage",
        "location": "Residential Cluster B",
        "chemistry": "Sodium-Ion Advanced Pilot",
        "capacity_mwh": 8.0,
        "max_power_mw": 2.5,
        "current_soc_pct": 82.0,
        "efficiency_roundtrip_pct": 88.0,
        "cycle_life_remaining_pct": 98.1,
        "status": "Ready / Automated Dispatch",
        "charge_limit_mw": 2.5,
        "discharge_limit_mw": 2.5,
        "target_evening_discharge_mw": 2.0
    },
    {
        "id": "BESS-04",
        "name": "Metro Transit Depot Buffer",
        "location": "EV Bus Hub East",
        "chemistry": "Lithium Nickel Manganese (NMC)",
        "capacity_mwh": 4.0,
        "max_power_mw": 1.5,
        "current_soc_pct": 59.0,
        "efficiency_roundtrip_pct": 93.0,
        "cycle_life_remaining_pct": 92.5,
        "status": "Charging Mode",
        "charge_limit_mw": 1.5,
        "discharge_limit_mw": 1.5,
        "target_evening_discharge_mw": 1.2
    }
]

class DispatchOverrideRequest(BaseModel):
    bess_id: str
    target_mode: str  # "CHARGE", "DISCHARGE", "STANDBY"
    target_power_mw: float

@router.get("/fleet")
def get_bess_fleet():
    total_capacity = sum(b["capacity_mwh"] for b in BESS_FLEET)
    total_power = sum(b["max_power_mw"] for b in BESS_FLEET)
    weighted_soc = sum(b["current_soc_pct"] * b["capacity_mwh"] for b in BESS_FLEET) / total_capacity
    
    # 24-hour dispatch schedule
    schedule = [
        {"time": "00:00 - 05:00", "mode": "Off-Peak Slow Charge", "power_mw": -2.0, "reason": "Baseload wind capture"},
        {"time": "06:00 - 10:00", "mode": "Standby / Frequency Support", "power_mw": 0.0, "reason": "Morning grid reserve"},
        {"time": "11:00 - 14:30", "mode": "Solar Crest Bulk Absorption", "power_mw": -9.5, "reason": "Absorbing rooftop solar surplus"},
        {"time": "15:00 - 17:30", "mode": "Standby Preparation", "power_mw": 0.0, "reason": "Holding full charge for evening ramp"},
        {"time": "18:00 - 21:30", "mode": "Critical Peak Discharge", "power_mw": 10.5, "reason": "Supporting peak evening deficit"},
        {"time": "22:00 - 23:59", "mode": "Grid Stabilization", "power_mw": 1.5, "reason": "Feeder balancing"}
    ]
    
    return {
        "status": "success",
        "modeling_type": "Digital Twin Software-Modeled BESS Fleet (No physical hardware connected)",
        "aggregate_capacity_mwh": total_capacity,
        "aggregate_max_power_mw": total_power,
        "fleet_soc_weighted_pct": round(weighted_soc, 1),
        "total_energy_stored_mwh": round(weighted_soc / 100.0 * total_capacity, 2),
        "dispatch_response_latency_ms": 120,
        "batteries": BESS_FLEET,
        "schedule": schedule
    }

@router.post("/override")
def override_dispatch(req: DispatchOverrideRequest):
    for b in BESS_FLEET:
        if b["id"] == req.bess_id:
            b["status"] = f"Manual Override: {req.target_mode} ({req.target_power_mw} MW)"
            return {"status": "success", "message": f"Dispatched {req.bess_id} to {req.target_mode}", "battery": b}
    return {"status": "error", "message": "BESS ID not found"}
