from fastapi import APIRouter
import time
import hashlib

router = APIRouter()

PARTICIPANTS = [
    {"id": "PRO-01", "name": "Apex Commercial Solar Array", "type": "Surplus Prosumer", "generation_kw": 450, "demand_kw": 120, "surplus_kw": 330, "offering_price_kwh": 0.082},
    {"id": "PRO-02", "name": "Hilltop Residential Micro-Solar", "type": "Surplus Prosumer", "generation_kw": 85, "demand_kw": 25, "surplus_kw": 60, "offering_price_kwh": 0.085},
    {"id": "PRO-03", "name": "South Agro-Voltaic Farm", "type": "Surplus Prosumer", "generation_kw": 600, "demand_kw": 90, "surplus_kw": 510, "offering_price_kwh": 0.079},
    {"id": "CON-01", "name": "Cold Storage Logistics Hub", "type": "Deficit Consumer", "generation_kw": 0, "demand_kw": 380, "deficit_kw": 380, "bid_price_kwh": 0.092},
    {"id": "CON-02", "name": "Rapid EV Charging Hub East", "type": "Deficit Consumer", "generation_kw": 0, "demand_kw": 250, "deficit_kw": 250, "bid_price_kwh": 0.095},
    {"id": "CON-03", "name": "District General Hospital", "type": "Critical Consumer", "generation_kw": 40, "demand_kw": 220, "deficit_kw": 180, "bid_price_kwh": 0.100},
]

@router.get("/overview")
def get_p2p_overview():
    total_surplus = sum(p.get("surplus_kw", 0) for p in PARTICIPANTS)
    total_deficit = sum(p.get("deficit_kw", 0) for p in PARTICIPANTS)
    matched_kw = min(total_surplus, total_deficit)
    
    # Generate matched simulated orders
    matched_events = [
        {
            "tx_hash": hashlib.sha256(b"TX-7821-SOLAR").hexdigest()[:16],
            "timestamp": "14:15:22",
            "seller_id": "PRO-03 (South Agro-Voltaic)",
            "buyer_id": "CON-01 (Cold Storage)",
            "matched_volume_kwh": 380,
            "clearing_price_usd_kwh": 0.085,
            "loss_compensation_pct": 1.8,
            "status": "Settled (Simulated)"
        },
        {
            "tx_hash": hashlib.sha256(b"TX-7822-EV").hexdigest()[:16],
            "timestamp": "14:18:04",
            "seller_id": "PRO-01 (Apex Commercial Solar)",
            "buyer_id": "CON-02 (Rapid EV Charging)",
            "matched_volume_kwh": 250,
            "clearing_price_usd_kwh": 0.088,
            "loss_compensation_pct": 1.5,
            "status": "Settled (Simulated)"
        },
        {
            "tx_hash": hashlib.sha256(b"TX-7823-HOSPITAL").hexdigest()[:16],
            "timestamp": "14:21:40",
            "seller_id": "PRO-01 (Apex Commercial Solar)",
            "buyer_id": "CON-03 (District Hospital)",
            "matched_volume_kwh": 80,
            "clearing_price_usd_kwh": 0.089,
            "loss_compensation_pct": 0.9,
            "status": "Settled (Simulated)"
        },
        {
            "tx_hash": hashlib.sha256(b"TX-7824-RESIDENTIAL").hexdigest()[:16],
            "timestamp": "14:24:11",
            "seller_id": "PRO-02 (Hilltop Residential)",
            "buyer_id": "CON-03 (District Hospital)",
            "matched_volume_kwh": 60,
            "clearing_price_usd_kwh": 0.087,
            "loss_compensation_pct": 1.2,
            "status": "Settled (Simulated)"
        }
    ]
    
    return {
        "status": "success",
        "label": "Software Simulation (Peer-to-Peer Energy Matching Sandbox)",
        "matching_mechanism": "Continuous Double Auction with Local Distribution Locational Marginal Pricing (DLMP)",
        "summary": {
            "active_prosumers": 3,
            "active_consumers": 3,
            "total_local_surplus_kw": total_surplus,
            "total_local_deficit_kw": total_deficit,
            "matched_energy_kw": matched_kw,
            "unmatched_imbalance_kw": abs(total_surplus - total_deficit),
            "average_clearing_price_usd": 0.087,
            "grid_wheeling_fee_usd_kwh": 0.012
        },
        "participants": PARTICIPANTS,
        "matched_events": matched_events
    }
