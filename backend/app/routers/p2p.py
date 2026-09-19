from fastapi import APIRouter
import time
import hashlib

router = APIRouter()

PARTICIPANTS = [
    {"id": "PRO-01", "name": "Apex Commercial Solar Array", "type": "Surplus Prosumer", "generation_kw": 450, "demand_kw": 120, "surplus_kw": 330, "offering_price_kwh": 6.40},
    {"id": "PRO-02", "name": "Hilltop Residential Micro-Solar", "type": "Surplus Prosumer", "generation_kw": 85, "demand_kw": 25, "surplus_kw": 60, "offering_price_kwh": 6.60},
    {"id": "PRO-03", "name": "South Agro-Voltaic Farm", "type": "Surplus Prosumer", "generation_kw": 600, "demand_kw": 90, "surplus_kw": 510, "offering_price_kwh": 6.20},
    {"id": "CON-01", "name": "Cold Storage Logistics Hub", "type": "Deficit Consumer", "generation_kw": 0, "demand_kw": 380, "deficit_kw": 380, "bid_price_kwh": 7.20},
    {"id": "CON-02", "name": "Rapid EV Charging Hub East", "type": "Deficit Consumer", "generation_kw": 0, "demand_kw": 250, "deficit_kw": 250, "bid_price_kwh": 7.40},
    {"id": "CON-03", "name": "District General Hospital", "type": "Critical Consumer", "generation_kw": 40, "demand_kw": 220, "deficit_kw": 180, "bid_price_kwh": 7.80},
]

@router.get("/overview")
def get_p2p_overview():
    total_surplus = sum(p.get("surplus_kw", 0) for p in PARTICIPANTS)  # 900 kW
    total_deficit = sum(p.get("deficit_kw", 0) for p in PARTICIPANTS)  # 810 kW
    
    # C5: Matched events sum strictly to 770 kWh
    matched_events = [
        {
            "tx_hash": hashlib.sha256(b"TX-7821-SOLAR").hexdigest()[:16],
            "timestamp": "14:15:22",
            "seller_id": "PRO-03 (South Agro-Voltaic)",
            "buyer_id": "CON-01 (Cold Storage)",
            "matched_volume_kwh": 380,
            "clearing_price_inr_kwh": 6.65,
            "total_inr": 2527.00,
            "loss_compensation_pct": 1.8,
            "status": "Settled (Simulated)"
        },
        {
            "tx_hash": hashlib.sha256(b"TX-7822-EV").hexdigest()[:16],
            "timestamp": "14:18:04",
            "seller_id": "PRO-01 (Apex Commercial Solar)",
            "buyer_id": "CON-02 (Rapid EV Charging)",
            "matched_volume_kwh": 250,
            "clearing_price_inr_kwh": 6.85,
            "total_inr": 1712.50,
            "loss_compensation_pct": 1.5,
            "status": "Settled (Simulated)"
        },
        {
            "tx_hash": hashlib.sha256(b"TX-7823-HOSPITAL").hexdigest()[:16],
            "timestamp": "14:21:40",
            "seller_id": "PRO-01 (Apex Commercial Solar)",
            "buyer_id": "CON-03 (District Hospital)",
            "matched_volume_kwh": 80,
            "clearing_price_inr_kwh": 6.95,
            "total_inr": 556.00,
            "loss_compensation_pct": 0.9,
            "status": "Settled (Simulated)"
        },
        {
            "tx_hash": hashlib.sha256(b"TX-7824-RESIDENTIAL").hexdigest()[:16],
            "timestamp": "14:24:11",
            "seller_id": "PRO-02 (Hilltop Residential)",
            "buyer_id": "CON-03 (District Hospital)",
            "matched_volume_kwh": 60,
            "clearing_price_inr_kwh": 6.75,
            "total_inr": 405.00,
            "loss_compensation_pct": 1.2,
            "status": "Settled (Simulated)"
        }
    ]
    
    matched_kwh = sum(tx["matched_volume_kwh"] for tx in matched_events)  # 770 kWh
    total_val = sum(tx["total_inr"] for tx in matched_events)
    avg_price = round(total_val / matched_kwh, 2)
    
    return {
        "status": "success",
        "label": "Software Simulation (Peer-to-Peer Energy Matching Sandbox)",
        "matching_mechanism": "Continuous Double Auction with Local Distribution Locational Marginal Pricing (DLMP)",
        "summary": {
            "active_prosumers": 3,
            "active_consumers": 3,
            "total_local_surplus_kw": total_surplus,
            "total_local_deficit_kw": total_deficit,
            "matched_energy_kwh": matched_kwh,
            "local_absorption_pct": round((matched_kwh / total_surplus) * 100, 1),
            "unmet_critical_hospital_deficit_kw": 40,
            "currency": "INR",
            "average_clearing_price_inr": avg_price,
            "grid_wheeling_fee_inr_kwh": 0.85
        },
        "participants": PARTICIPANTS,
        "matched_events": matched_events
    }
