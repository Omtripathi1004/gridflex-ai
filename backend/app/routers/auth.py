from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
import secrets
from app.database import get_db_connection, hash_password

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "Grid Engineer"
    organization: Optional[str] = "Regional Energy Agency"

@router.get("/default-accounts")
def get_default_accounts():
    """
    Returns preset default demo accounts for instant 1-click login.
    """
    return [
        {
            "role": "DISCOM Operations Lead",
            "email": "operator@gridflex.ai",
            "password": "GridFlex2026!",
            "name": "Rajesh Sharma",
            "organization": "State Distribution Co. (DISCOM)",
            "icon": "building"
        },
        {
            "role": "Hackathon Evaluator & Judge",
            "email": "judge@gridflex.ai",
            "password": "Judge2026!",
            "name": "Dr. Priya Sundaram",
            "organization": "Smart Grid Innovation Jury",
            "icon": "award"
        },
        {
            "role": "Grid Resilience Officer",
            "email": "officer@gridflex.ai",
            "password": "Resilience2026!",
            "name": "Vikram Patel",
            "organization": "National Load Dispatch Center",
            "icon": "shield"
        },
        {
            "role": "Microgrid Coordinator",
            "email": "community@gridflex.ai",
            "password": "Flex2026!",
            "name": "Ananya Sen",
            "organization": "Green Valley Solar Cooperative",
            "icon": "users"
        }
    ]

@router.post("/login")
def login(req: LoginRequest, request: Request):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check user credentials
    cursor.execute(
        "SELECT id, email, password_hash, full_name, role, organization FROM users WHERE email = ?",
        (req.email.lower().strip(),)
    )
    user = cursor.fetchone()
    
    client_ip = request.client.host if request.client else "127.0.0.1"
    
    if not user or user["password_hash"] != hash_password(req.password):
        # Record failed login attempt
        cursor.execute(
            "INSERT INTO login_records (user_id, email, full_name, role, ip_address, status, session_token) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user["id"] if user else None, req.email, user["full_name"] if user else "Unknown", user["role"] if user else "Guest", client_ip, "FAILED", None)
        )
        conn.commit()
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    # Generate session token
    session_token = f"gfx_{secrets.token_hex(16)}"
    
    # Save successful login record to database
    cursor.execute(
        "INSERT INTO login_records (user_id, email, full_name, role, ip_address, status, session_token) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (user["id"], user["email"], user["full_name"], user["role"], client_ip, "SUCCESS", session_token)
    )
    conn.commit()
    conn.close()
    
    return {
        "status": "success",
        "message": "Login successful. Record saved to SQLite database.",
        "session_token": session_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "organization": user["organization"]
        }
    }

@router.post("/register")
def register(req: RegisterRequest, request: Request):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (req.email.lower().strip(),))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Account with this email already exists.")
        
    client_ip = request.client.host if request.client else "127.0.0.1"
    session_token = f"gfx_{secrets.token_hex(16)}"
    
    cursor.execute(
        "INSERT INTO users (email, password_hash, full_name, role, organization) VALUES (?, ?, ?, ?, ?)",
        (req.email.lower().strip(), hash_password(req.password), req.full_name, req.role, req.organization)
    )
    user_id = cursor.lastrowid
    
    cursor.execute(
        "INSERT INTO login_records (user_id, email, full_name, role, ip_address, status, session_token) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (user_id, req.email, req.full_name, req.role, client_ip, "SUCCESS (NEW REGISTER)", session_token)
    )
    conn.commit()
    conn.close()
    
    return {
        "status": "success",
        "message": "Registration successful and login record created.",
        "session_token": session_token,
        "user": {
            "id": user_id,
            "email": req.email,
            "full_name": req.full_name,
            "role": req.role,
            "organization": req.organization
        }
    }

@router.get("/records")
def get_login_records(limit: int = 20):
    """
    Returns verified audit history of logins recorded in the database.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, user_id, email, full_name, role, login_time, ip_address, status FROM login_records ORDER BY id DESC LIMIT ?",
        (limit,)
    )
    records = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {
        "status": "success",
        "total_records": len(records),
        "records": records
    }
