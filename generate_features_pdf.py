import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 750, "GridFlex AI — Complete Website Pages & Features Directory")
            self.drawRightString(558, 750, "Yuva Yodha • Challenge 3")
            self.setStrokeColor(colors.HexColor("#1e293b"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer
        self.setStrokeColor(colors.HexColor("#1e293b"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "Confidential & Proprietary • BESCOM Mahadevapura 33/11kV Substation Archetype")
        self.drawRightString(558, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def create_features_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#0284c7"),
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#334155"),
        spaceAfter=14
    )
    
    meta_box_style = ParagraphStyle(
        'MetaBox',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0f172a")
    )
    
    category_header_style = ParagraphStyle(
        'CategoryHeader',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=12,
        spaceAfter=8,
        keepWithNext=True
    )
    
    page_title_style = ParagraphStyle(
        'PageTitle',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#0369a1"),
        keepWithNext=True
    )
    
    page_route_style = ParagraphStyle(
        'PageRoute',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#64748b")
    )
    
    feature_item_style = ParagraphStyle(
        'FeatureItem',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1e293b")
    )
    
    table_cell_bold = ParagraphStyle(
        'CellBold',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    # Title & Header
    story.append(Paragraph("GridFlex AI", title_style))
    story.append(Paragraph("Complete Website Pages &amp; Features Directory", subtitle_style))
    
    # Metadata Box
    meta_data = [
        [
            Paragraph("<b>Initiative:</b> Yuva Yodha — Challenge 3<br/><b>Target Domain:</b> Renewable Integration &amp; Local Grid Resilience", meta_box_style),
            Paragraph("<b>Target DISCOM:</b> BESCOM (Mahadevapura 33/11kV Substation)<br/><b>Architecture:</b> React 18 + Vite SPA &amp; Python FastAPI", meta_box_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # Pages & Features Data
    catalog = [
        {
            "category": "1. Overview & Evaluation Portals",
            "color": "#0284c7",
            "pages": [
                {
                    "name": "Landing Page & National Energy Cockpit",
                    "route": "/",
                    "features": [
                        "Executive overview of software-defined grid resilience platform.",
                        "Live national energy telemetry metrics (Solar MW, Wind MW, Grid Demand, Net Balance).",
                        "Direct access persona quick-jump navigators (DISCOM Operator, System Evaluator, Microgrid Coordinator).",
                        "Quick links to all 20 specialized operational modules and technical specifications.",
                        "Bilingual interface toggle (English & Hindi) with instant instant reactivity."
                    ]
                },
                {
                    "name": "Master About & 20-Page System Directory",
                    "route": "/about",
                    "features": [
                        "Comprehensive catalog of all 20+ specialized application modules.",
                        "Data Provenance Guide: Verifiable classification between Real Data, ML Forecasts, and Simulation.",
                        "End-to-End Technology Stack Matrix: Frontend (React 18 + Vite), Backend (FastAPI), Models (LightGBM, XGBoost, TreeSHAP).",
                        "Role-based persona workflows for grid engineers, regulators, and innovation judges.",
                        "Complete ISO 50001 & IEEE 1547 compliance mapping reference."
                    ]
                },
                {
                    "name": "Judge Mode & Guided Storyboard",
                    "route": "/judge-mode",
                    "features": [
                        "7-stage interactive evaluation tour demonstrating the complete Evening Deficit resolution.",
                        "Guided walkthrough across NWP Weather -> ML Forecast -> Physics Twin -> MILP Solver -> P2P Clearing -> FLISR Healing.",
                        "Automated step progression with timing controls and rubrics scorecard.",
                        "Live verifiable telemetry audit snapshots and cost savings proof points (₹15.25 Lakh saved).",
                        "Built-in evaluator feedback and rubric criterion alignment."
                    ]
                },
                {
                    "name": "Operator & Evaluator Authentication",
                    "route": "/login",
                    "features": [
                        "Instant 1-click login for 4 pre-configured demo roles (DISCOM Lead, Judge, Resilience Officer, Microgrid Lead).",
                        "SQLite-backed authentication records audit ledger (/api/auth/records).",
                        "Session token hydration with zero login friction for evaluators.",
                        "Audit trial log showing timestamp, client IP, user ID, role, and authentication status.",
                        "Public fallback access ensuring judges never get blocked during evaluation."
                    ]
                }
            ]
        },
        {
            "category": "2. Real-Time Operations & Digital Twin",
            "color": "#059669",
            "pages": [
                {
                    "name": "Live Autonomous Command & Dispatch Center",
                    "route": "/command-center",
                    "features": [
                        "Real-time SCADA telemetry display (64.8 MW Mahadevapura feeder load).",
                        "Dynamic Energy Flow Sankey Diagram illustrating generation to load paths.",
                        "Sub-cycle 120ms telemetry update tracking and non-disruptive gentle background polling.",
                        "Manual 'Refresh Telemetry' control allowing on-demand updates without scroll reset.",
                        "One-click 'Execute Dispatch Plan' button triggering automated setpoints to substation RTUs.",
                        "Direct provenance badges marking real NWP weather and scaled NLDC load profiles."
                    ]
                },
                {
                    "name": "Physics-Constrained Digital Twin Substation Simulator",
                    "route": "/digital-twin",
                    "features": [
                        "Interactive parameter sliders: Solar generation, wind speed, base demand, BESS readiness, flexible load enrollment.",
                        "4 Real-Day Analog Presets: Evening Ramp Deficit, Midday Solar Surge (+40%), Summer Heatwave, Monsoon Cloudburst.",
                        "N-1 Contingency Drills: 1-click tripping of Substation BESS-01, North Solar Collector, or Feeder F-02.",
                        "Real-time physics recomputation: Voltage profile (0.95-1.05 p.u.), transformer thermal loading (%), and net MW balance.",
                        "Sub-cycle emergency mitigation response recommendations."
                    ]
                },
                {
                    "name": "DISCOM Distribution Control Desk & Feeder Matrix",
                    "route": "/discom",
                    "features": [
                        "Substation-level monitoring for Mahadevapura 33/11kV primary distribution hub.",
                        "Multi-feeder loading matrix (Feeder F-01 Tech Park, F-02 Residential, F-03 Industrial, F-04 Commercial).",
                        "Feeder thermal stress alarms and phase unbalance monitoring.",
                        "Automated tap-changer (OLTC) status and reactive power compensation tracking.",
                        "Peak load curtailment and emergency reserve margin indicators."
                    ]
                },
                {
                    "name": "Self-Healing Grid & Causal FLISR Engine",
                    "route": "/self-healing",
                    "features": [
                        "Fault Location, Isolation, and Service Restoration (FLISR) simulation.",
                        "Pearl's Causal-Do Calculus engine evaluating counterfactual isolation actions.",
                        "Interactive fault induction drill on distribution feeders.",
                        "Automated sub-second tie-switch re-routing restoring power to healthy de-energized sections.",
                        "Demand Response (DR) agent auction prioritizing critical hospital feeders."
                    ]
                }
            ]
        },
        {
            "category": "3. Multi-Horizon Forecasting & Meteorology",
            "color": "#d97706",
            "pages": [
                {
                    "name": "Multi-Horizon Renewable Generation Forecast",
                    "route": "/renewable-forecast",
                    "features": [
                        "Multi-horizon day-ahead solar and wind generation forecast (24h/48h).",
                        "P10, P50, and P90 confidence intervals generated with LightGBM quantile regression.",
                        "Live meteorological telemetry: Global Horizontal Irradiance (GHI), DNI, ambient temperature, wind velocity.",
                        "Curtailment risk probability assessment and weather alert banners.",
                        "Exportable forecast dataset for dispatch scheduling."
                    ]
                },
                {
                    "name": "Hourly Feeder Demand Forecast & Transformer Stress",
                    "route": "/demand-forecast",
                    "features": [
                        "XGBoost temporal regression model predicting 24h feeder demand curves.",
                        "Evening duck-curve peak ramp detection (17:30 - 21:30 IST).",
                        "Transformer thermal stress indicators and headroom utilization metrics.",
                        "Historical vs forecast demand variance visualization.",
                        "Predictive risk score for feeder overloading under extreme temperature."
                    ]
                },
                {
                    "name": "SkyVision NWP Cloud Radar & Solar Irradiance Tracker",
                    "route": "/sky-vision",
                    "features": [
                        "High-resolution cloud vector radar tracking solar ramp events.",
                        "Nowcasting solar drop prediction (0 - 120 minutes lead time).",
                        "Real-time Global Horizontal Irradiance (GHI) heatmap over distribution feeders.",
                        "Proactive BESS pre-charge triggers prior to cloud cover occlusion.",
                        "Radar playback animation with speed and opacity controls."
                    ]
                }
            ]
        },
        {
            "category": "4. Optimization, Flexibility & Micro-Markets",
            "color": "#7c3aed",
            "pages": [
                {
                    "name": "Flexibility Dispatch & Peak Shaving Solver",
                    "route": "/flexibility",
                    "features": [
                        "Mixed-Integer Linear Programming (MILP) algorithmic load shifting engine.",
                        "Recharts Before vs After Demand Curve with glowing renewable supply area gradient.",
                        "Coordinated Dispatch Schedule Chart: Hourly BESS charge/discharge & flexible load shift (MW).",
                        "Scorecard: 9.8 MW peak reduction, 100% shortage elimination, ₹1,42,500 DSM penalty avoidance.",
                        "Automated operational directives dispatched to RTUs (commercial chiller pre-cooling, battery discharge).",
                        "Interactive parameter sliders for BESS fleet readiness and flexible participation."
                    ]
                },
                {
                    "name": "Peer-to-Peer (P2P) Micro-Market & Double Auction Ledger",
                    "route": "/p2p",
                    "features": [
                        "Continuous double-auction clearing engine matching local prosumer solar with consumer deficit.",
                        "Recharts Market Clearing Dynamics Graph: Prosumer supply (kW), consumer bids (kW), cleared volume (kWh), and dynamic clearing rate (₹/kWh).",
                        "Standardized in Indian Rupees (₹/kWh) anchored to Vidyut PRAVAH Day-Ahead Market pricing.",
                        "CERC open access wheeling fee reconciliation (₹0.85/kWh DISCOM fee).",
                        "Cryptographic hash settlement ledger with audit timestamps and participant registry.",
                        "Critical Load Protection Guarantee: 100% automated backup import for District General Hospital."
                    ]
                },
                {
                    "name": "Virtual Community Storage (BESS) Fleet Manager",
                    "route": "/storage",
                    "features": [
                        "Multi-node 40 MWh distributed Battery Energy Storage System (BESS) fleet.",
                        "Real-time State of Charge (SOC %), State of Health (SOH %), and temperature monitoring.",
                        "State-space electrochemical degradation physics model (94% round-trip efficiency).",
                        "Automated charge during solar peak (11:00-14:00) and discharge during evening peak (18:00-21:30).",
                        "Individual node telemetry across Tech Park, Substation, Logistics, and Hospital battery units."
                    ]
                },
                {
                    "name": "Dynamic Tariff & CERC DSM Arbitrage Engine",
                    "route": "/tariff-engine",
                    "features": [
                        "Time-of-Use (ToU) and Deviation Settlement Mechanism (DSM) price calculator.",
                        "Zone-2 Western/Southern regional grid pricing blocks based on CERC DSM Regulations 2023.",
                        "Automated battery arbitrage optimizer calculating profit margins (Buy low, Sell high).",
                        "DSM over-drawal and under-injection penalty exposure model.",
                        "Interactive arbitrage matrix ranking commercial profitability across time windows."
                    ]
                },
                {
                    "name": "3D Topological Feeder Spatial Digital Twin",
                    "route": "/spatial-twin",
                    "features": [
                        "Geospatial visualization of 33kV and 11kV distribution network topology.",
                        "Interactive transmission line congestion highlighting and power flow direction vectors.",
                        "Substation node status indicators (Healthy, Warning, Critical) with voltage and loading metrics.",
                        "Congestion, Voltage, and Flow view mode filters.",
                        "Gentle background telemetry update (300s) preventing user scroll disruption."
                    ]
                }
            ]
        },
        {
            "category": "5. Explainable AI, Copilot & Resilience Auditing",
            "color": "#be185d",
            "pages": [
                {
                    "name": "TreeSHAP Explainable AI Attribution Studio",
                    "route": "/explainable-ai",
                    "features": [
                        "Additive Shapley feature attribution waterfall charts verifying mathematical additivity.",
                        "Quantitative decomposition of dispatch decisions into solar irradiance, load ramp, temperature, and SOC features.",
                        "Natural-language operational rationale explaining exactly WHY specific setpoints were chosen over alternatives.",
                        "Reflects ISO 50001 energy auditing standards and transparent non-black-box governance.",
                        "Interactive feature toggle comparing unconstrained vs physics-constrained model outcomes."
                    ]
                },
                {
                    "name": "Incident Co-Pilot & 15-Language RAG Voice Assistant",
                    "route": "/incident-copilot",
                    "features": [
                        "Domain-specific Retrieval-Augmented Generation (RAG) assistant for substation operators.",
                        "Ingested knowledge base from CEA grid standards, IEEE 1547, and CERC operating codes.",
                        "Multilingual voice speech-to-text input across 15 Indian & global languages.",
                        "Emergency contingency guidance with zero external paid API key requirement.",
                        "One-click voice recording with instant speech synthesis and transcript dispatch."
                    ]
                },
                {
                    "name": "Autonomous AI Grid Copilot",
                    "route": "/copilot",
                    "features": [
                        "Full-page interactive conversational assistant for grid engineering and optimization.",
                        "Pre-seeded prompt chips: 'Grid status summary', 'BESS dispatch now', 'Active fault report', 'P2P trade overview'.",
                        "Grounded response generation with citations to indexed regulatory documents.",
                        "Quick copy and export capabilities for operator shift logbooks."
                    ]
                },
                {
                    "name": "Transparent 4-Pillar Resilience Index",
                    "route": "/resilience",
                    "features": [
                        "100% transparent composite score (0 - 100) eliminating opaque black-box indices.",
                        "Verified mathematical formula: Resilience = 0.25*(Renewable) + 0.25*(Headroom) + 0.25*(BESS SOC) + 0.25*(Flexibility).",
                        "Unit-tested arithmetic with dynamic score contribution breakdown bar.",
                        "Ranked prescriptive improvement directives with projected score uplift.",
                        "Audit export functionality for regulatory compliance submissions."
                    ]
                },
                {
                    "name": "System Architecture & Data Integrity Matrix",
                    "route": "/architecture",
                    "features": [
                        "End-to-end technical pipeline visualization from sensory inputs to RTU actuation.",
                        "Full Data & Demo Integrity Disclosure Matrix classifying all telemetry sources.",
                        "Documentation of zero-hardware software architecture for low-cost DISCOM deployment.",
                        "Mathematical formulation references for MILP solver, TreeSHAP, and double auction."
                    ]
                }
            ]
        }
    ]

    for cat_idx, cat in enumerate(catalog):
        story.append(Paragraph(cat["category"], category_header_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor(cat["color"]), spaceBefore=2, spaceAfter=8))

        for page in cat["pages"]:
            page_elements = []
            
            # Page Title & Route Header
            header_table_data = [
                [
                    Paragraph(f"<b>{page['name']}</b>", page_title_style),
                    Paragraph(f"Route: <font color='{cat['color']}'><b>{page['route']}</b></font>", page_route_style)
                ]
            ]
            header_table = Table(header_table_data, colWidths=[360, 144])
            header_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                ('TOPPADDING', (0, 0), (-1, -1), 0),
            ]))
            page_elements.append(header_table)
            
            # Features bullet list
            feature_rows = []
            for feat in page["features"]:
                bullet = Paragraph("•", table_cell_bold)
                text = Paragraph(feat, feature_item_style)
                feature_rows.append([bullet, text])
            
            features_table = Table(feature_rows, colWidths=[14, 490])
            features_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 1.5),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ]))
            page_elements.append(features_table)
            page_elements.append(Spacer(1, 8))
            
            story.append(KeepTogether(page_elements))

        if cat_idx < len(catalog) - 1:
            story.append(Spacer(1, 6))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at: {output_path}")

if __name__ == '__main__':
    target = os.path.join(os.getcwd(), "GridFlex_AI_Pages_and_Features.pdf")
    create_features_pdf(target)
