import sqlite3
import os
import time
import hashlib
import json

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "gridflex.db")

def get_db_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL,
        organization TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Login records table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS login_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        email TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        status TEXT NOT NULL,
        session_token TEXT
    )
    """)

    # Chat sessions table (associated with user_id and email)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_email TEXT NOT NULL,
        title TEXT NOT NULL,
        preview TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Chat messages table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
    )
    """)
    
    # Seed default user accounts if not present
    default_users = [
        ("operator@gridflex.ai", "GridFlex2026!", "Rajesh Sharma", "DISCOM Operations Lead", "State Distribution Co. (DISCOM)"),
        ("judge@gridflex.ai", "Judge2026!", "Dr. Priya Sundaram", "Hackathon Evaluator & Judge", "Smart Grid Innovation Jury"),
        ("officer@gridflex.ai", "Resilience2026!", "Vikram Patel", "Grid Resilience Officer", "National Load Dispatch Center"),
        ("community@gridflex.ai", "Flex2026!", "Ananya Sen", "Microgrid Coordinator", "Green Valley Solar Cooperative")
    ]
    
    for email, pwd, name, role, org in default_users:
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO users (email, password_hash, full_name, role, organization) VALUES (?, ?, ?, ?, ?)",
                (email, hash_password(pwd), name, role, org)
            )

    # Seed initial multi-day and multi-month chat history for operator and judge
    cursor.execute("SELECT COUNT(*) as cnt FROM chat_sessions")
    session_count = cursor.fetchone()["cnt"]
    if session_count == 0:
        seed_chat_history(cursor)
            
    conn.commit()
    conn.close()

def seed_chat_history(cursor):
    """Seed realistic past conversations spanning previous days and months."""
    historical_sessions = [
        {
            "id": "sess-op-01",
            "user_id": "1",
            "user_email": "operator@gridflex.ai",
            "title": "Evening Deficit & BESS Dispatch",
            "preview": "Mitigating the 18.2 MW duck curve gap using Substation BESS-01 and BESS-02",
            "created_at": "2026-09-21 17:45:00",
            "updated_at": "2026-09-21 17:50:00",
            "messages": [
                {
                    "id": "msg-01-1",
                    "sender": "user",
                    "text": "How do we mitigate the 18.2 MW evening renewable gap tonight?",
                    "timestamp": "17:45"
                },
                {
                    "id": "msg-01-2",
                    "sender": "assistant",
                    "text": "The 18.2 MW deficit between 17:30 and 21:00 is counterbalanced through a synchronized Two-Stage Flexibility Dispatch:\n\n1. **9.5 MW Virtual BESS Injection**: Dispatches BESS-01 and BESS-02 at 0.8C rate to stabilize frequency.\n2. **5.2 MW Automated Demand Response**: Throttles 45 fleet EV depot chargers and triggers commercial HVAC precooling offsets.\n3. **3.5 MW P2P Prosumer Clearing**: Clears local rooftop surplus to avoid transmission congestion.",
                    "timestamp": "17:46"
                }
            ]
        },
        {
            "id": "sess-op-02",
            "user_id": "1",
            "user_email": "operator@gridflex.ai",
            "title": "TreeSHAP Interpretability Audit",
            "preview": "Verifying mathematical additivity (Σφ = -14.2 MW) for Feeder F-02",
            "created_at": "2026-09-20 14:10:00",
            "updated_at": "2026-09-20 14:15:00",
            "messages": [
                {
                    "id": "msg-02-1",
                    "sender": "user",
                    "text": "Can you explain the TreeSHAP attribution for the evening peak drop?",
                    "timestamp": "14:10"
                },
                {
                    "id": "msg-02-2",
                    "sender": "assistant",
                    "text": "TreeSHAP mathematically decomposes the -18.2 MW net shortage from the -4.0 MW baseline (Δ = -14.2 MW):\n\n• **Sunset Cliff**: -9.8 MW (solar plunges to zero)\n• **Residential HVAC & Cooking**: -7.2 MW\n• **EV Fast Charging**: -3.4 MW\n• **Coastal Wind Breeze Influx**: +4.1 MW\n• **Commercial Lighting Auto-Dim**: +2.1 MW\n\nAdditivity is 100% exact (Sum of SHAP values = -14.2 MW).",
                    "timestamp": "14:11"
                }
            ]
        },
        {
            "id": "sess-op-03",
            "user_id": "1",
            "user_email": "operator@gridflex.ai",
            "title": "Autonomous FLISR Fault Isolation",
            "preview": "Feeder Section F2-B breaker CB-12 trip and TS-04 loop closure in 112ms",
            "created_at": "2026-09-14 09:30:00",
            "updated_at": "2026-09-14 09:35:00",
            "messages": [
                {
                    "id": "msg-03-1",
                    "sender": "user",
                    "text": "What happened during the simulated treefall fault on Feeder F2-B?",
                    "timestamp": "09:30"
                },
                {
                    "id": "msg-03-2",
                    "sender": "assistant",
                    "text": "Autonomous FLISR detected a zero-sequence overcurrent in 28ms, tripped Breaker CB-12, and closed Tie Switch TS-04 in 112ms. Power was restored to 8,400 customers automatically in 0.14 seconds without manual human dispatch.",
                    "timestamp": "09:31"
                }
            ]
        },
        {
            "id": "sess-op-04",
            "user_id": "1",
            "user_email": "operator@gridflex.ai",
            "title": "August 2026 Monthly DSM Penalty Review",
            "preview": "Total avoided CERC frequency deviation penalties: ₹15.25 Lakh",
            "created_at": "2026-08-28 11:00:00",
            "updated_at": "2026-08-28 11:10:00",
            "messages": [
                {
                    "id": "msg-04-1",
                    "sender": "user",
                    "text": "How much did GridFlex AI save the DISCOM in DSM penalties during August?",
                    "timestamp": "11:00"
                },
                {
                    "id": "msg-04-2",
                    "sender": "assistant",
                    "text": "For the month of August 2026, GridFlex AI saved **₹15.25 Lakh** by eliminating CERC frequency deviation penalties below 49.90 Hz and reducing emergency gas peaker calls by 100%.",
                    "timestamp": "11:02"
                }
            ]
        },
        {
            "id": "sess-jd-01",
            "user_id": "2",
            "user_email": "judge@gridflex.ai",
            "title": "Judge Evaluation: 4 Resilience Pillars",
            "preview": "Reviewing composite score 74.8/100 across IEEE 1547 and ISO 50001 metrics",
            "created_at": "2026-09-21 16:20:00",
            "updated_at": "2026-09-21 16:25:00",
            "messages": [
                {
                    "id": "msg-jd-01",
                    "sender": "user",
                    "text": "Explain the 4 resilience pillars and how the composite score is calculated.",
                    "timestamp": "16:20"
                },
                {
                    "id": "msg-jd-02",
                    "sender": "assistant",
                    "text": "The Composite Resilience Index uses 4 orthogonal pillars (25% equal weighting):\n\n1. **Renewable Generation Availability (80.1/100)**: Clean generation vs. total load.\n2. **Substation Headroom Margin (85.0/100)**: Thermal buffer preventing transformer overload.\n3. **Community Storage Readiness (72.5/100)**: Fleet SoC across 4 distributed BESS units.\n4. **Flexible Demand Response Capacity (85.3/100)**: Real-time contracted demand response reserve.\n\n**Composite Score**: 0.25 × (80.1 + 85.0 + 72.5 + 85.3) = **74.8 / 100 (Optimal Band)**.",
                    "timestamp": "16:21"
                }
            ]
        },
        {
            "id": "sess-jd-02",
            "user_id": "2",
            "user_email": "judge@gridflex.ai",
            "title": "P2P Auction Clearing & Wheeling Tariff Audit",
            "preview": "Continuous double auction clearing 3.5 MW with ₹0.85/kWh DISCOM fee",
            "created_at": "2026-08-15 15:00:00",
            "updated_at": "2026-08-15 15:08:00",
            "messages": [
                {
                    "id": "msg-jd-03",
                    "sender": "user",
                    "text": "How does prosumer P2P clearing protect the utility's business model?",
                    "timestamp": "15:00"
                },
                {
                    "id": "msg-jd-04",
                    "sender": "assistant",
                    "text": "Every P2P prosumer trade incurs an automated **₹0.85/kWh distribution wheeling tariff** credited directly to the local DISCOM, generating ₹2.57 Crore annually while bypassing transmission corridor bottlenecks.",
                    "timestamp": "15:02"
                }
            ]
        }
    ]

    for s in historical_sessions:
        cursor.execute(
            "INSERT INTO chat_sessions (id, user_id, user_email, title, preview, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (s["id"], s["user_id"], s["user_email"], s["title"], s["preview"], s["created_at"], s["updated_at"])
        )
        for m in s["messages"]:
            cursor.execute(
                "INSERT INTO chat_messages (id, session_id, user_id, sender, text, timestamp, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (m["id"], s["id"], s["user_id"], m["sender"], m["text"], m["timestamp"], s["created_at"])
            )

# Initialize DB on module import
init_db()
