# GridFlex AI — Smart Energy Management & Local Grid Resilience Platform

🌐 **Live Vercel Deployment**: [https://frontend-xi-khaki-78.vercel.app](https://frontend-xi-khaki-78.vercel.app)

**GridFlex AI** is an advanced smart-energy management and local grid resilience web platform built for DISCOM operators, community microgrid coordinators, and hackathon judges. It bridges the renewable intermittency gap (the "Duck Curve") with practical, software-defined local flexibility: multi-horizon forecasting, shortage/surplus detection, virtual community storage (BESS) dispatch, peer-to-peer energy coordination, transparent resilience scoring, and explainable AI.

---

## 🌟 Key Highlights & Standout Features

1. **Digital Twin / What-If Simulator (Standout Feature A)**:
   - Interactive parameter sliders for solar, wind, grid demand, battery availability, flexible loads, and weather severity (Heatwave, Storm Front).
   - Instantly recomputes net energy balance, peak deficit windows, risk classification, and optimal operational directives in real-time.
2. **Explainable Grid Resilience Engine (Standout Feature B)**:
   - Eliminates mysterious black-box resilience scores.
   - Decomposes resilience into **4 orthogonal mathematical pillars** (25% equal weighting):
     - **Renewable Availability (25%)**
     - **Substation Demand Margin (25%)**
     - **Storage Readiness (25%)**
     - **Flexible Load Capacity (25%)**
   - Features a transparent formula modal, recent factor delta timeline, and ranked prescriptive recovery actions.
3. **Comprehensive 15-Language Internationalization (i18n)**:
   - Complete localized UI coverage across all 14 modules:
     - 🇺🇸 English (`en`)
     - 🇮🇳 Hindi (`hi`)
     - 🇪🇸 Spanish (`es`)
     - 🇫🇷 French (`fr`)
     - 🇩🇪 German (`de`)
     - 🇯🇵 Japanese (`ja`)
     - 🇨🇳 Chinese (`zh`)
     - 🇸🇦 Arabic (`ar` - with dynamic RTL layout)
     - 🇧🇷 Portuguese (`pt`)
     - 🇷🇺 Russian (`ru`)
     - 🇧🇩 Bengali (`bn`)
     - 🇮🇳 Telugu (`te`)
     - 🇮🇳 Tamil (`ta`)
     - 🇮🇳 Marathi (`mr`)
     - 🇮🇹 Italian (`it`)
4. **Explainable AI (TreeSHAP Feature Attributions)**:
   - Quantitative SHAP waterfall charts revealing the exact physical meteorological and temporal drivers for midday solar peaks and evening deficit windows.
5. **AI Energy Copilot (RAG + Deterministic Fallback)**:
   - Answers operator questions about IEEE 1547 standards and dispatch algorithms with citations. Operates 100% reliably with zero external API keys needed.
6. **Judge Mode (60-Second Guided Storyboard)**:
   - Step-by-step walkthrough of the **Evening Renewable Gap** scenario:
     `Problem → Forecast → Detected Risk → AI Recommendation → Simulated Action → Measurable Impact`.

---

## 🏗 Architecture & Technology Stack

- **Frontend**: Next.js 14+ (App Router), React 18, Recharts, Lucide-React.
- **Styling**: **Pure Vanilla CSS** design tokens and layout (no Tailwind). High-contrast energy-tech palette: obsidian foundation, electric cyan accents, amber energy flow lines, emerald health, and crimson risk indicators.
- **Backend**: Python 3.12 + FastAPI with modular routers:
  - `/api/telemetry/live`: Real-time simulated telemetry feed
  - `/api/forecast/renewable`: Solar and wind predictions with 95% confidence intervals
  - `/api/forecast/demand`: Hourly load curves and peak stress window detection
  - `/api/flexibility/optimize`: MILP solver and before vs after load curves
  - `/api/storage/fleet`: 4 modeled community BESS units
  - `/api/p2p/overview`: Continuous double auction simulation and transaction ledger
  - `/api/digital-twin/simulate`: What-if recalculation engine
  - `/api/resilience/breakdown`: 4-pillar resilience formula breakdown
  - `/api/explainability/shap`: TreeSHAP feature attributions
  - `/api/copilot/chat`: RAG assistant with domain references
  - `/api/discom/overview`: 11kV feeder telemetry and transformer headroom
  - `/api/scenario/evening-gap`: Seeded Evening Renewable Gap demo scenario

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 2. Running the FastAPI Backend
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8008
```
- Health endpoint: `http://127.0.0.1:8008/health`
- Interactive OpenAPI docs: `http://127.0.0.1:8008/docs`

### 3. Running the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.
- The frontend will automatically detect the backend and display the green `[FastAPI Backend: Connected]` badge.
- If running standalone without the backend, the frontend seamlessly operates on its built-in realistic seeded ML engine with clear data integrity disclosures.

---

## 📊 Data & Demo Integrity Disclosure

| Component | Classification | Source / Methodology |
|:---|:---|:---|
| Weather Telemetry | Real Public Data / NWP | Open-Meteo High-Resolution NWP / ERA5 Reanalysis |
| Renewable Forecast | ML Forecast | LightGBM Regression v2.4 + TreeSHAP |
| Demand Forecast | ML Forecast | XGBoost Temporal Model v3.1 |
| Flexibility Dispatch | Algorithmic Solver | Mixed-Integer Linear Programming (MILP) |
| Virtual BESS Fleet | Digital Twin Simulation | State-Space Electrochemical Battery Model |
| P2P Coordination | Market Simulation | Continuous Double Auction (DLMP Sandbox) |
| Grid Resilience | Formula Computed | Transparent 4-Pillar Formulation (25% weights) |
| AI Energy Copilot | RAG + Deterministic | Ingested IEEE 1547 Standards (Zero API keys required) |

---

## 📜 License
MIT License. Developed for advanced smart energy management, DISCOM operations, and hackathons.
