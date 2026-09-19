'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  organization: string;
}

export interface DefaultAccount {
  role: string;
  email: string;
  password: string;
  name: string;
  organization: string;
  icon: string;
}

export interface LoginRecord {
  id: number;
  user_id: number | null;
  email: string;
  full_name: string;
  role: string;
  login_time: string;
  ip_address: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  isLoading: boolean;
  loginRecords: LoginRecord[];
  defaultAccounts: DefaultAccount[];
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  fetchRecords: () => Promise<void>;
  quickLogin: (account: DefaultAccount) => Promise<boolean>;
}

const FALLBACK_DEFAULT_ACCOUNTS: DefaultAccount[] = [
  {
    role: "DISCOM Operations Lead",
    email: "operator@gridflex.ai",
    password: "GridFlex2026!",
    name: "Rajesh Sharma",
    organization: "State Distribution Co. (DISCOM)",
    icon: "building"
  },
  {
    role: "Hackathon Evaluator & Judge",
    email: "judge@gridflex.ai",
    password: "Judge2026!",
    name: "Dr. Priya Sundaram",
    organization: "Smart Grid Innovation Jury",
    icon: "award"
  },
  {
    role: "Grid Resilience Officer",
    email: "officer@gridflex.ai",
    password: "Resilience2026!",
    name: "Vikram Patel",
    organization: "National Load Dispatch Center",
    icon: "shield"
  },
  {
    role: "Microgrid Coordinator",
    email: "community@gridflex.ai",
    password: "Flex2026!",
    name: "Ananya Sen",
    organization: "Green Valley Solar Cooperative",
    icon: "users"
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>([]);
  const [defaultAccounts, setDefaultAccounts] = useState<DefaultAccount[]>(FALLBACK_DEFAULT_ACCOUNTS);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/records?limit=25');
      if (res.ok) {
        const data = await res.json();
        if (data.records) {
          setLoginRecords(data.records);
        }
      }
    } catch {
      // Local fallback or offline mode
    }
  }, []);

  const fetchDefaultAccounts = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/default-accounts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDefaultAccounts(data);
        }
      }
    } catch {
      // Fallback accounts used
    }
  }, []);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const savedUser = localStorage.getItem('gridflex_user');
      const savedToken = localStorage.getItem('gridflex_token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setSessionToken(savedToken);
      }
    } catch (e) {
      console.error("Failed to parse saved user", e);
    }
    setIsLoading(false);
    fetchRecords();
    fetchDefaultAccounts();
  }, [fetchRecords, fetchDefaultAccounts]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
        return { success: false, message: err.detail || 'Invalid email or password' };
      }

      const data = await res.json();
      setUser(data.user);
      setSessionToken(data.session_token);
      localStorage.setItem('gridflex_user', JSON.stringify(data.user));
      localStorage.setItem('gridflex_token', data.session_token);

      // Refresh records to show this login in audit log
      await fetchRecords();
      return { success: true };
    } catch {
      // Offline fallback: check against default accounts
      const matched = defaultAccounts.find(
        a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );
      if (matched) {
        const mockUser: User = {
          id: 999,
          email: matched.email,
          full_name: matched.name,
          role: matched.role,
          organization: matched.organization
        };
        const token = "gfx_offline_" + Math.random().toString(36).substring(2);
        setUser(mockUser);
        setSessionToken(token);
        localStorage.setItem('gridflex_user', JSON.stringify(mockUser));
        localStorage.setItem('gridflex_token', token);
        return { success: true };
      }
      return { success: false, message: 'Network error or backend unreachable' };
    }
  };

  const quickLogin = async (account: DefaultAccount): Promise<boolean> => {
    const result = await login(account.email, account.password);
    return result.success;
  };

  const logout = () => {
    setUser(null);
    setSessionToken(null);
    localStorage.removeItem('gridflex_user');
    localStorage.removeItem('gridflex_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionToken,
        isLoading,
        loginRecords,
        defaultAccounts,
        login,
        logout,
        fetchRecords,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
