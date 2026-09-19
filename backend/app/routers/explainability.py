from fastapi import APIRouter

router = APIRouter()

@router.get("/shap")
def get_shap_explanations():
    """
    Returns SHAP-style feature attributions for both Renewable Generation Forecast
    and Evening Deficit Peak Forecast.
    """
    # 1. Solar Generation Forecast Attribution (Current hour forecast = 42.5 MW)
    solar_base_expected_value = 22.0  # MW base average
    solar_shap_features = [
        {"feature": "Global Horizontal Irradiance (GHI 840 W/m²)", "contribution_mw": +16.8, "direction": "positive", "category": "Weather"},
        {"feature": "Solar Zenith Angle (Hour 13:00 Sun Position)", "contribution_mw": +8.4, "direction": "positive", "category": "Temporal"},
        {"feature": "Low Cloud Cover (18% coverage)", "contribution_mw": +3.2, "direction": "positive", "category": "Atmospheric"},
        {"feature": "Ambient PV Cell Temperature (42°C Derating)", "contribution_mw": -3.6, "direction": "negative", "category": "Thermal"},
        {"feature": "Aerosol Optical Depth / Dust Deposition", "contribution_mw": -1.3, "direction": "negative", "category": "Atmospheric"},
        {"feature": "Historical 7-Day Clear-Sky Index", "contribution_mw": -3.0, "direction": "negative", "category": "Baseline"}
    ]
    # Sum: 22.0 + 16.8 + 8.4 + 3.2 - 3.6 - 1.3 - 3.0 = 42.5 MW
    
    # 2. Evening Deficit Risk Attribution (19:30 Critical Deficit = -18.2 MW)
    deficit_base_expected = -4.0  # MW
    deficit_shap_features = [
        {"feature": "Sunset Ramp-Down (Solar Output drops to 0 MW)", "contribution_mw": -9.8, "direction": "negative", "category": "Generation"},
        {"feature": "Peak Evening Residential HVAC & Cooking Load", "contribution_mw": -7.2, "direction": "negative", "category": "Demand"},
        {"feature": "Feeder F-02 EV Fleet Commuter Arrival Surge", "contribution_mw": -3.4, "direction": "negative", "category": "Demand"},
        {"feature": "Evening Coastal Breeze (Wind increases to 22 MW)", "contribution_mw": +4.1, "direction": "positive", "category": "Renewable Buffer"},
        {"feature": "Commercial Lighting Auto-Dimming Factor", "contribution_mw": +2.1, "direction": "positive", "category": "Efficiency"}
    ]
    # Sum: -4.0 - 9.8 - 7.2 - 3.4 + 4.1 + 2.1 = -18.2 MW
    
    return {
        "status": "success",
        "methodology": "TreeSHAP (Lundberg et al.) with KernelSHAP deep baseline validation",
        "solar_forecast_shap": {
            "target": "Solar Output at 13:00",
            "base_value_mw": solar_base_expected_value,
            "predicted_value_mw": 42.5,
            "features": solar_shap_features,
            "plain_english_summary": "The +20.5 MW boost above baseline is predominantly driven by peak GHI irradiance (+16.8 MW) and optimal sun azimuth (+8.4 MW), slightly penalized by high cell temperature (-3.6 MW)."
        },
        "evening_deficit_shap": {
            "target": "Net Energy Balance at 19:30",
            "base_value_mw": deficit_base_expected,
            "predicted_value_mw": -18.2,
            "features": deficit_shap_features,
            "plain_english_summary": "The critical -18.2 MW deficit is created by the coincidence of solar generation collapsing to zero (-9.8 MW) precisely as residential domestic loads spike (-7.2 MW) and commuter EVs connect (-3.4 MW)."
        },
        "action_recommendation_why": {
            "recommendation": "Discharge 9.5 MW from Substation BESS-01 & Shift 5.2 MW Commercial Loads",
            "primary_driver": "BESS-01 state of charge is currently optimal at 74% with zero cycle degradation penalty during early discharge.",
            "secondary_driver": "Feeder F-02 industrial water pumping has high thermal storage inertia and can shift 3 hours without operational risk."
        }
    }
