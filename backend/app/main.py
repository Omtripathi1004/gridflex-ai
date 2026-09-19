import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    telemetry,
    forecast,
    flexibility,
    storage,
    p2p,
    digital_twin,
    resilience,
    explainability,
    copilot,
    discom,
    scenario,
)

app = FastAPI(
    title="GridFlex AI API",
    description="Backend API for Smart Energy Management & Local Grid Resilience Platform",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Modular Routers
app.include_router(telemetry.router, prefix="/api/telemetry", tags=["Telemetry"])
app.include_router(forecast.router, prefix="/api/forecast", tags=["Forecasts"])
app.include_router(flexibility.router, prefix="/api/flexibility", tags=["Flexibility"])
app.include_router(storage.router, prefix="/api/storage", tags=["Community Storage"])
app.include_router(p2p.router, prefix="/api/p2p", tags=["P2P Coordination"])
app.include_router(digital_twin.router, prefix="/api/digital-twin", tags=["Digital Twin"])
app.include_router(resilience.router, prefix="/api/resilience", tags=["Resilience"])
app.include_router(explainability.router, prefix="/api/explainability", tags=["Explainability"])
app.include_router(copilot.router, prefix="/api/copilot", tags=["AI Copilot"])
app.include_router(discom.router, prefix="/api/discom", tags=["DISCOM Control"])
app.include_router(scenario.router, prefix="/api/scenario", tags=["Scenarios"])

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "GridFlex AI Backend",
        "version": "1.0.0",
        "timestamp": time.time(),
        "mode": "Simulation & ML Ready",
    }

@app.get("/")
def root():
    return {
        "platform": "GridFlex AI",
        "message": "Production-ready Grid Resilience & Flexibility Management Engine",
        "documentation": "/docs",
    }
