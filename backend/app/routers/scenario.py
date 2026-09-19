from fastapi import APIRouter

router = APIRouter()

@router.get("/evening-gap")
def get_evening_gap_scenario():
    """
    Returns the seeded Evening Renewable Gap scenario data:
    1. Problem: Solar cliff near evening while domestic load rises.
    2. Forecast: ML model forecasts 18.2 MW deficit window (18:00 - 21:30).
    3. Detected Risk: Substation transformer overload and rolling brownout risk.
    4. AI Recommendation: BESS dispatch (9.5 MW) + Dynamic load shift (5.2 MW).
    5. Simulated Action: Execution dispatch parameters.
    6. Measurable Impact: Post-action energy balance, 0 shortage hours, cost avoided.
    """
    return {
        "scenario_name": "Evening Renewable Gap",
        "description": "High solar generation during midday, dropping sharply at 17:30 as evening residential peak demand escalates.",
        "steps": [
            {
                "step_number": 1,
                "title": "Problem Identification",
                "headline": "The Solar Ramp-Down Cliff (Duck Curve)",
                "details": "At 17:00, solar generation plunges from 48.5 MW to zero within 90 minutes, exactly as residential consumers turn on HVAC, cooking, and EV chargers.",
                "telemetry_snippet": {"solar_drop_mw": -48.5, "demand_ramp_mw": +26.4, "risk_window": "18:00 - 21:30"}
            },
            {
                "step_number": 2,
                "title": "Predictive Forecast",
                "headline": "XGBoost & LightGBM Multi-Hour Horizon Detection",
                "details": "The model anticipates an impending 18.2 MW net shortage at 19:30 with 94.2% confidence, triggering automated resilience warnings.",
                "telemetry_snippet": {"forecast_mae_mw": 1.42, "projected_deficit_mw": 18.2, "confidence_band": "95% CI: [16.8 - 19.6] MW"}
            },
            {
                "step_number": 3,
                "title": "Risk Detection",
                "headline": "Substation Congestion & Unserved Energy Window",
                "details": "Without flexibility intervention, Feeder F-02 loading will breach 96% thermal rating, threatening mandatory rolling blackouts.",
                "telemetry_snippet": {"unserved_energy_mwh": 48.6, "transformer_headroom": "Critical (3.8%)", "penalty_usd": 18400}
            },
            {
                "step_number": 4,
                "title": "AI Flexibility Recommendation",
                "headline": "Optimized Coordinated Dispatch Plan",
                "details": "MILP solver recommends: 1) Discharge 9.5 MW across community BESS units, 2) Shift 5.2 MW non-essential EV charging and thermal loads, 3) Match 3.5 MW local P2P prosumer reserves.",
                "telemetry_snippet": {"bess_discharge_mw": 9.5, "load_shift_mw": 5.2, "p2p_cleared_mw": 3.5}
            },
            {
                "step_number": 5,
                "title": "Simulated Action Execution",
                "headline": "Autonomous Dispatch Dispatched to Virtual Fleet",
                "details": "Digital dispatch signals transmitted to Substation BESS-01/02 and commercial aggregators. Response confirmed in 120ms.",
                "telemetry_snippet": {"dispatch_latency_ms": 120, "bess_status": "Active Discharge", "feeder_relief_mw": 14.7}
            },
            {
                "step_number": 6,
                "title": "Measurable Impact",
                "headline": "100% Reliability Maintained & Zero Blackout Hours",
                "details": "Net grid deficit eliminated. Shortage hours reduced from 4.0 hours to 0 hours. Feeder loading safely capped at 78.4%. $18,400 in emergency peaker plant costs avoided.",
                "telemetry_snippet": {"shortage_hours_eliminated": 4.0, "peak_shaved_mw": 14.7, "cost_saved_usd": 18400, "co2_avoided_kg": 6760}
            }
        ]
    }
