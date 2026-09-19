from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class CopilotQuery(BaseModel):
    query: str
    conversation_history: Optional[List[dict]] = []

KNOWLEDGE_DOCUMENTS = [
    {
        "doc_id": "DOC-GRID-01",
        "title": "GridFlex AI Dispatch Architecture Specification",
        "category": "Architecture",
        "snippet": "GridFlex AI executes a hierarchical control loop: Day-ahead LightGBM forecasts detect surplus/deficit windows, followed by real-time MILP optimization allocating BESS ramp rates and dynamic demand response across feeders F-01 to F-04.",
        "relevance_keywords": ["dispatch", "architecture", "algorithm", "milp", "lightgbm", "workflow", "model"]
    },
    {
        "doc_id": "DOC-GRID-02",
        "title": "IEEE 1547-2018 Interconnection Standards & Feeder Limits",
        "category": "Grid Standards",
        "snippet": "Substation transformers must maintain thermal loading below 90% continuous rating. Reverse power flow from high-penetration rooftop solar must be mitigated through local BESS charging or coordinated P2P matching before back-feeding upstream.",
        "relevance_keywords": ["ieee", "standard", "feeder", "transformer", "thermal", "reverse power", "voltage"]
    },
    {
        "doc_id": "DOC-GRID-03",
        "title": "Evening Renewable Gap Operational Playbook",
        "category": "Operational Procedure",
        "snippet": "Between 17:30 and 21:00, when solar output collapses while domestic demand surges, operators must initiate Stage 1 flexibility: dispatch BESS fleet up to 10.5 MW and trigger automated load curtailment on enrolled EV depot chargers.",
        "relevance_keywords": ["evening", "gap", "duck curve", "deficit", "shortage", "solar cliff", "playbook"]
    },
    {
        "doc_id": "DOC-GRID-04",
        "title": "Explainable Resilience Metric Formulation (ISO 50001 Alignment)",
        "category": "Resilience",
        "snippet": "Composite Resilience is strictly decomposed into 4 orthogonal pillars with 25% equal weighting: Renewable Generation Availability, Substation Headroom Margin, Community Storage SOC, and Enrolled Flexible Response Capacity.",
        "relevance_keywords": ["resilience", "score", "formula", "breakdown", "weights", "storage", "margin"]
    }
]

@router.post("/chat")
def query_copilot(req: CopilotQuery):
    query_lower = req.query.lower()
    
    # 1. RAG Retrieval Step
    matched_docs = []
    for doc in KNOWLEDGE_DOCUMENTS:
        match_count = sum(1 for kw in doc["relevance_keywords"] if kw in query_lower)
        if match_count > 0:
            matched_docs.append({"doc": doc, "score": match_count})
            
    matched_docs.sort(key=lambda x: x["score"], reverse=True)
    retrieved = [m["doc"] for m in matched_docs[:2]] if matched_docs else [KNOWLEDGE_DOCUMENTS[0]]
    
    # 2. Deterministic Knowledge Generation (Ensures 100% functionality without external API keys)
    response_text = ""
    if any(w in query_lower for w in ["evening", "gap", "shortage", "cliff", "duck"]):
        response_text = (
            "The **Evening Renewable Gap** occurs as solar generation plunges from 48 MW to 0 MW around 18:00, "
            "coinciding with residential peak demand ramp to 72 MW. GridFlex AI resolves this through a synchronized 2-step dispatch: "
            "1) Discharging 9.5 MW from the community BESS fleet, and 2) Shifting 5.2 MW of non-urgent commercial HVAC and EV charging into the midday solar surplus window."
        )
    elif any(w in query_lower for w in ["resilience", "formula", "score", "calculate"]):
        response_text = (
            "GridFlex AI's **Resilience Indicator** is fully transparent and non-opaque. It is calculated as: "
            "`Composite = 0.25 * Renewable_Availability + 0.25 * Demand_Stress_Margin + 0.25 * Storage_Readiness + 0.25 * Flexible_Load`. "
            "Currently, the system scores **74.8 / 100**, driven by high solar generation (+4.2 pts) and solid battery readiness (74% SOC)."
        )
    elif any(w in query_lower for w in ["p2p", "trade", "market", "peer"]):
        response_text = (
            "The **P2P Energy Coordination engine** operates a simulated Continuous Double Auction. "
            "Rooftop solar prosumers with active surplus (e.g. Apex Commercial Solar, 330 kW surplus) are matched directly to nearby deficit consumers "
            "(such as Cold Storage Logistics, 380 kW deficit) at a cleared price of ~$0.087/kWh, eliminating upstream transmission loss."
        )
    elif any(w in query_lower for w in ["model", "ml", "forecast", "shap", "xgboost"]):
        response_text = (
            "GridFlex AI utilizes a hybrid ML stack: LightGBM and XGBoost for tabular day-ahead load forecasting (R² = 0.963, MAE = 1.84 MW) "
            "alongside numerical weather prediction inputs (GHI, wind velocity, cloud delta). Every prediction is explained via TreeSHAP feature attributions, "
            "revealing the exact quantitative MW contribution of each meteorological and temporal feature."
        )
    else:
        response_text = (
            f"Based on GridFlex AI operational telemetry and knowledge base [{retrieved[0]['title']}]: "
            "The grid is currently operating under stable conditions with 51.4 MW renewable generation against 64.2 MW demand. "
            "Active flexibility reserves (12.8 MW) and virtual community battery reserves (74% SOC) provide robust buffer against sudden solar ramp-downs."
        )
        
    return {
        "status": "success",
        "query": req.query,
        "response": response_text,
        "mode": "Deterministic RAG Fallback Engine (Zero API Key Requirement)",
        "retrieved_references": [
            {
                "doc_id": d["doc_id"],
                "title": d["title"],
                "category": d["category"],
                "snippet": d["snippet"]
            }
            for d in retrieved
        ]
    }
