# GridFlex AI — Smart Energy Management & Local Grid Resilience Platform
> **Yuva Yodha — Challenge 3: Renewable Energy Integration & Local Grid Resilience**  
> *Target DISCOM Archetype*: **BESCOM** (Bangalore Electricity Supply Company Ltd) — Mahadevapura 33/11kV Distribution Substation

🌐 **Live Web Application**: [https://frontend-xi-khaki-78.vercel.app](https://frontend-xi-khaki-78.vercel.app)  
📜 **License**: [MIT License](file:///LICENSE)

---

## ⚡ Executive Summary

**GridFlex AI** is a software-defined smart energy management and local distribution resilience platform built for Indian DISCOM control desks, substation engineers, and clean energy coordinators.

As high-penetration rooftop solar and distributed energy resources (DERs) surge across Indian distribution networks, substations face severe evening duck-curve ramps (17:30–20:30 IST), reverse power flow, voltage violations, and transformer thermal stress. GridFlex AI resolves this through:
1. **Multi-Horizon Forecasting**: Solar irradiance, wind velocity, and feeder demand curves with 95% prediction intervals (P10/P50/P90).
2. **Physics-Constrained Digital Twin**: Interactive virtual 33/11kV substation with N-1 contingency trip drills and real-time balance recomputation.
3. **Automated Flexibility Dispatch**: Coordinated 40 MWh community BESS fleet and 15 MW commercial/industrial flexible demand response (MILP-based peak shaving).
4. **Peer-to-Peer (P2P) Micro-Market**: Reconciled double-auction local clearing in Indian Rupees (₹/kWh) with DISCOM wheeling charges.
5. **Audited 4-Pillar Resilience Index**: 100% transparent, non-black-box composite score derived from verifiable operational metrics.
6. **Explainable AI (TreeSHAP)**: Additive Shapley feature attributions revealing the exact meteorological and physical drivers behind dispatch decisions.

---

## 🌟 Standout Capabilities

### 1. Digital Twin Substation Simulator (`/digital-twin`)
- Physics-based what-if scenario engine calibrated against real 64.8 MW Mahadevapura feeder load profiles.
- Interactive parameter sliders for solar generation, wind velocity, baseline demand, BESS fleet readiness, and flexible load enrollment.
- Real-day analog presets: *Evening Ramp Deficit*, *Midday Solar Surge (+40%)*, *Summer Heatwave (May 15)*, and *Monsoon Cloudburst (July 22)*.
- **N-1 Contingency Drills**: One-click tripping of Substation BESS-01, North 15 MW Solar Collector, or Feeder F-02 with sub-cycle emergency response.

### 2. Transparent 4-Pillar Resilience Index (`/resilience`)
Eliminates opaque black-box indices through an explicit, verified formula:
$$\text{Resilience} = (0.25 \times \text{Renewable Availability}) + (0.25 \times \text{Substation Headroom}) + (0.25 \times \text{Storage SOC}) + (0.25 \times \text{Flexibility Readiness})$$
- Unit-tested arithmetic with dynamic formula breakdown and ranked prescriptive improvement actions.

### 3. P2P Energy Settlement Ledger (`/p2p`)
- Reconciled double-auction order book clearing local solar surplus to nearby commercial and critical loads.
- Strictly denominated in Indian Rupees (₹/kWh) with Vidyut PRAVAH Day-Ahead Market anchor pricing and CERC open access wheeling fees.
- Critical hospital priority safeguard guaranteeing 100% uncurtailed healthcare power.

### 4. Explainable AI with TreeSHAP (`/explainable-ai`)
- Quantitative SHAP feature attribution waterfall charts verifying additivity ($\text{Baseline} + \sum \phi_i = \text{Prediction}$).
- Natural-language operational rationale explaining *why* specific dispatch actions were selected over alternatives.

### 5. Bilingual Indian Localization (`en` & `hi`)
- Comprehensive English and Hindi (`हिन्दी`) operator interface with native electrical terminology and instant locale switching.

### 6. Judge Mode Guided Storyboard (`/judge-mode`)
- 60-second guided tour demonstrating the **Evening Renewable Gap** resolution across all 7 operational engines.

---

## 🏛 System Architecture

GridFlex AI employs a modern, decoupled architecture designed for high availability and zero-configuration demonstration:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite)                      │
│   • Client SPA with pure Vanilla CSS (zero Tailwind dependency)       │
│   • Recharts telemetry visualization & Lucide icons                   │
│   • Sticky mobile bottom navigation & touch-optimized drawer           │
│   • Dual-mode runtime: Live FastAPI proxy + Seeded fallback snapshot  │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ HTTP / REST (/api/*)
┌───────────────────────────────────┴────────────────────────────────────┐
│                         BACKEND (FastAPI / Python)                     │
│   • Modular Routers: Telemetry, Forecast, Storage, Resilience, P2P    │
│   • TreeSHAP attribution & MILP peak-shaving dispatch solver          │
│   • RAG-assisted Copilot with grid standards reference corpus         │
│   • SQLite / in-memory state persistence                              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data & Demo Integrity Disclosures

In adherence to the highest standards of hackathon and technical integrity, GridFlex AI explicitly classifies every data point:

| Component | Classification | Source / Methodology |
|:---|:---|:---|
| **Weather Telemetry** | Real Public Data | Open-Meteo High-Resolution NWP & ERA5 Reanalysis |
| **Grid Benchmark Curve** | Scaled Real Data | Grid-India (NLDC) Power Supply Position scaled to 64.8 MW feeder |
| **Solar & Demand Forecasts** | ML Forecast | LightGBM & XGBoost multi-horizon models with TreeSHAP attributions |
| **Community BESS Fleet** | Simulated Physics | State-space electrochemical battery model (40 MWh nameplate, 94% round-trip efficiency) |
| **Flexibility Dispatch** | Algorithmic Solver | Mixed-Integer Linear Programming (MILP) load shifting |
| **P2P Energy Trading** | Market Simulation | Continuous double-auction matching engine with CERC wheeling fee |
| **Resilience Index** | Formula Computed | Transparent 4-pillar arithmetic (25% equal weighting, fully unit tested) |
| **AI Grid Copilot** | Domain RAG Prototype | Reference knowledge base from CEA & IEEE 1547 concepts (zero external API keys needed) |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.10 or higher
- **Package Managers**: npm and pip

### Option A: Local Full-Stack Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Omtripathi1004/gridflex-ai.git
   cd gridflex-ai
   ```

2. **Run the FastAPI Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8008 --reload
   ```
   - Health check: `http://127.0.0.1:8008/health`
   - OpenAPI Swagger Docs: `http://127.0.0.1:8008/docs`

3. **Run the Vite Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser.
   - The frontend automatically connects to the backend and displays `[FastAPI Backend: Connected]`.

### Option B: Frontend Standalone Mode
If running without the Python backend, the frontend seamlessly engages its seeded benchmark engine with full interactive functionality, simulated physics, and complete honesty disclosures.

### Option C: Running Test Suites
```bash
# Backend resilience and arithmetic tests
cd backend
python -m pytest tests

# Frontend production build verification
cd ../frontend
npm run build
```

---

## 📱 Mobile & Responsive Support

GridFlex AI is fully optimized across viewports:
- **Desktop (>= 1024px)**: Multi-column operator control consoles, detailed Recharts graphs, and hierarchical navigation dropdowns.
- **Tablet (768px - 1023px)**: Responsive 2-column grid reflow and collapsed quick-action headers.
- **Mobile (<= 768px)**: Dedicated slide-out drawer navigation, sticky bottom navigation bar (Home, Operate, Twin, Resilience, Judges), and fluid touch sliders.

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](file:///LICENSE) file for details.
