import sqlite3
import os
import time
import hashlib

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
            
    conn.commit()
    conn.close()

# Initialize DB on module import
init_db()
