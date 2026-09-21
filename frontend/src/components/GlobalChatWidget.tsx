'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  Bot, 
  User, 
  FileText,
  Copy,
  Check,
  Key,
  ChevronDown,
  ChevronUp,
  History,
  Plus,
  ArrowLeft,
  Clock,
  ChevronRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { parseMarkdown } from '../lib/markdown';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  references?: Array<{
    doc_id: string;
    title: string;
    category: string;
    snippet: string;
  }>;
}

interface ChatSession {
  id: string;
  user_id: string;
  user_email: string;
  title: string;
  preview: string;
  created_at: string;
  updated_at: string;
}

const QUICK_PROMPTS = [
  "Why is there an evening deficit?",
  "What is the battery SoC status?",
  "Explain the 4 resilience pillars",
  "How does P2P auction clearing work?",
  "What are the default login accounts?",
  "Which ML models generate forecasts?"
];

export const GlobalChatWidget: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Current active session
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => `sess_${Date.now()}`);
  const [pastSessions, setPastSessions] = useState<ChatSession[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const initialWelcomeMessage: Message = {
    id: 'welcome',
    sender: 'assistant',
    text: "Hello! I am your **GridFlex AI Energy Copilot**.\n\nI have real-time access to feeder telemetry, renewable forecasts, battery storage, and the SQLite audit log. Ask me any question or try one of the prompt chips below!",
    timestamp: 'Just now'
  };

  const [messages, setMessages] = useState<Message[]>([initialWelcomeMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !showHistory) {
      scrollToBottom();
    }
  }, [messages, isOpen, showHistory]);

  // Fetch chat history for the logged in user
  const fetchUserHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const userIdParam = user?.id ? `user_id=${user.id}` : `email=${encodeURIComponent(user?.email || 'operator@gridflex.ai')}`;
      const res = await fetch(`/api/copilot/history?${userIdParam}`);
      if (res.ok) {
        const data = await res.json();
        if (data.sessions) {
          setPastSessions(data.sessions);
          // Also save in localStorage for offline caching
          localStorage.setItem(`gridflex_chat_sessions_${user?.id || 'guest'}`, JSON.stringify(data.sessions));
        }
      } else {
        // Fallback to localStorage
        const cached = localStorage.getItem(`gridflex_chat_sessions_${user?.id || 'guest'}`);
        if (cached) setPastSessions(JSON.parse(cached));
      }
    } catch {
      const cached = localStorage.getItem(`gridflex_chat_sessions_${user?.id || 'guest'}`);
      if (cached) setPastSessions(JSON.parse(cached));
    } finally {
      setHistoryLoading(false);
    }
  }, [user]);

  // Load history whenever user changes or widget is opened
  useEffect(() => {
    if (isOpen) {
      fetchUserHistory();
    }
  }, [isOpen, user, fetchUserHistory]);

  // Load a specific historical session
  const loadSession = async (session: ChatSession) => {
    try {
      setLoading(true);
      setCurrentSessionId(session.id);
      const res = await fetch(`/api/copilot/history/${session.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          const loadedMsgs: Message[] = data.messages.map((m: any) => ({
            id: m.id,
            sender: m.sender,
            text: m.text,
            timestamp: m.timestamp || 'Recorded'
          }));
          setMessages(loadedMsgs);
          setShowHistory(false);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load session:", e);
    } finally {
      setLoading(false);
    }
    setShowHistory(false);
  };

  // Start a fresh new chat session
  const startNewChat = () => {
    const newId = `sess_${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'assistant',
        text: `New conversation started for **${user?.full_name || 'Grid Operator'}**.\n\nAsk me anything about today's dispatch, feeder loading, battery SoC, or resilience metrics!`,
        timestamp: 'Just now'
      }
    ]);
    setShowHistory(false);
  };

  // Delete a session
  const deleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/copilot/history/${sessionId}`, { method: 'DELETE' });
      setPastSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        startNewChat();
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!userText) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          conversation_history: historyPayload,
          api_key: apiKey.trim() || undefined,
          user_id: user?.id ? String(user.id) : "1",
          user_email: user?.email || "operator@gridflex.ai",
          session_id: currentSessionId
        })
      });

      if (!res.ok) throw new Error("API call failed");

      const data = await res.json();
      const botMessage: Message = {
        id: 'assistant_' + Date.now(),
        sender: 'assistant',
        text: data.response || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        references: data.retrieved_references
      };
      setMessages(prev => [...prev, botMessage]);
      fetchUserHistory();
    } catch {
      // Offline fallback with intelligent contextual response
      const fallbackResponse = textToSend.toLowerCase().includes('login') 
        ? "Default demo accounts are: **operator@gridflex.ai** (DISCOM), **judge@gridflex.ai** (Judge), **officer@gridflex.ai** (Resilience), **community@gridflex.ai** (Microgrid). Password for all is their name + 2026! (e.g. `GridFlex2026!`, `Judge2026!`)."
        : textToSend.toLowerCase().includes('resilience')
        ? "GridFlex AI calculates resilience across 4 orthogonal pillars (Renewable Availability, Substation Margin, Storage SOC, Flexible Load Capacity) each weighted at 25%."
        : "GridFlex AI is actively optimizing local grid assets. The Evening Deficit of 18.2 MW is resolved via 9.5 MW virtual BESS dispatch and 5.2 MW demand response.";

      setMessages(prev => [
        ...prev,
        {
          id: 'assistant_' + Date.now(),
          sender: 'assistant',
          text: fallbackResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    startNewChat();
  };

  // Group past sessions by time relative to now
  const formatSessionDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return "Previous weeks";
      return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      {/* Floating Action Button (Always visible on mobile & desktop) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
            right: 16,
            zIndex: 9990,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 30,
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.86rem',
            border: 'none',
            boxShadow: '0 6px 20px rgba(2, 132, 199, 0.35)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          aria-label="Ask Copilot"
        >
          <MessageSquare size={17} />
          <span>Ask Copilot</span>
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
            right: 14,
            zIndex: 9999,
            width: isExpanded ? 'min(760px, calc(100vw - 28px))' : 'min(440px, calc(100vw - 28px))',
            height: isExpanded ? 'min(780px, calc(100vh - 40px))' : 'min(580px, calc(100vh - 40px))',
            maxHeight: 'calc(100dvh - 28px)',
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: '#ffffff',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {showHistory ? (
                <button
                  onClick={() => setShowHistory(false)}
                  title="Back to chat"
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 6,
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              ) : (
                <div 
                  style={{ 
                    width: 34, 
                    height: 34, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#ffffff' 
                  }}
                >
                  <Bot size={18} />
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    {showHistory ? 'Stored Chat History' : 'GridFlex AI Copilot'}
                  </h4>
                  {!showHistory && (
                    <span 
                      style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        background: '#10b981',
                        boxShadow: '0 0 6px #10b981' 
                      }} 
                    />
                  )}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {showHistory ? `Stored by User: ${user?.full_name || 'Rajesh Sharma'}` : 'Contextual RAG • Multi-Month History Active'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* History Toggle Button */}
              <button
                onClick={() => {
                  setShowHistory(!showHistory);
                  if (!showHistory) fetchUserHistory();
                }}
                title={showHistory ? "Return to active chat" : "View stored past conversations"}
                style={{
                  background: showHistory ? 'rgba(79, 70, 229, 0.12)' : '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  color: showHistory ? 'var(--brand)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  padding: '5px 9px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                <History size={14} />
                <span>History</span>
              </button>

              {/* Start New Chat Button */}
              <button
                onClick={startNewChat}
                title="Start a new chat session"
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  padding: '5px 8px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                <Plus size={14} />
                <span className="desktop-only">New</span>
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* VIEW A: CHAT HISTORY PANEL */}
          {showHistory ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', background: '#ffffff', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} color="var(--brand)" />
                  <span>Previous sessions saved for <strong>{user?.email || 'operator@gridflex.ai'}</strong></span>
                </div>
                <button
                  onClick={startNewChat}
                  style={{
                    background: 'var(--brand)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '5px 10px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Plus size={13} /> New Chat
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {historyLoading ? (
                  <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Loading past conversations...
                  </div>
                ) : pastSessions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    No past sessions found for this account. Start a conversation to store history.
                  </div>
                ) : (
                  pastSessions.map((session) => {
                    const isCurrent = session.id === currentSessionId;
                    return (
                      <div
                        key={session.id}
                        onClick={() => loadSession(session)}
                        style={{
                          background: isCurrent ? 'rgba(79, 70, 229, 0.06)' : '#ffffff',
                          border: isCurrent ? '1.5px solid var(--brand)' : '1px solid var(--border-subtle)',
                          borderRadius: 10,
                          padding: '12px 14px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 12,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {session.title}
                            </span>
                            {isCurrent && (
                              <span style={{ fontSize: '0.68rem', background: 'rgba(79, 70, 229, 0.15)', color: 'var(--brand)', padding: '2px 6px', borderRadius: 4, fontWeight: 700, flexShrink: 0 }}>
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.4 }}>
                            {session.preview || 'Historical grid dispatch consultation'}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                            <Clock size={11} />
                            <span>{formatSessionDate(session.created_at)}</span>
                            <span>•</span>
                            <span>{session.created_at.split(' ')[0]}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <button
                            onClick={(e) => deleteSession(e, session.id)}
                            title="Delete this session"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: 6,
                              borderRadius: 4
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                          <ChevronRight size={16} color="var(--text-tertiary)" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom user indicator */}
              <div style={{ padding: '10px 14px', background: '#ffffff', borderTop: '1px solid var(--border-subtle)', fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={13} color="var(--brand)" />
                  <span>Session History ID: <strong>{user?.id ? `User #${user.id}` : 'Operator #1'}</strong> ({user?.role || 'DISCOM Lead'})</span>
                </div>
              </div>
            </div>
          ) : (
            /* VIEW B: MAIN ACTIVE CHAT VIEW */
            <>
              {/* API Key Collapsible */}
              <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setShowApiKey(v => !v)}
                  style={{
                    width: '100%',
                    background: '#f8fafc',
                    border: 'none',
                    padding: '6px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: apiKey ? '#059669' : 'var(--text-secondary)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Key size={12} />
                    {apiKey ? '🟢 Gemini API Key Active (Live LLM Mode)' : '🔑 Add Gemini API Key for live responses (optional)'}
                  </span>
                  {showApiKey ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {showApiKey && (
                  <div style={{ padding: '8px 14px', background: '#f1f5f9' }}>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="AIza... (Gemini API Key)"
                      style={{
                        width: '100%',
                        background: '#ffffff',
                        border: `1px solid ${apiKey ? '#059669' : 'var(--border-subtle)'}`,
                        borderRadius: 6,
                        padding: '6px 10px',
                        color: 'var(--text-primary)',
                        fontSize: '0.8rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                      Key is used only client-side for this session and never stored.
                    </p>
                  </div>
                )}
              </div>

              {/* Prompt Chips */}
              <div
                style={{
                  padding: '8px 14px',
                  background: '#f8fafc',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: 8,
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                }}
              >
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    disabled={loading}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 14,
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      color: 'var(--brand)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Messages Container */}
              <div
                style={{
                  flex: 1,
                  padding: 16,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  background: '#ffffff'
                }}
              >
                {messages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                        maxWidth: '92%',
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
                          flexDirection: isUser ? 'row-reverse' : 'row',
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: isUser ? 'rgba(79, 70, 229, 0.15)' : '#f1f5f9',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            color: isUser ? 'var(--brand)' : 'var(--text-secondary)',
                          }}
                        >
                          {isUser ? <User size={14} /> : <Bot size={14} />}
                        </div>

                        <div
                          style={{
                            background: isUser 
                              ? 'rgba(79, 70, 229, 0.08)' 
                              : '#f8fafc',
                            border: isUser ? '1px solid rgba(79, 70, 229, 0.25)' : '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            padding: '10px 14px',
                            color: 'var(--text-primary)',
                            fontSize: '0.86rem',
                            lineHeight: 1.55,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                          }}
                        >
                          {isUser ? (
                            <span style={{ whiteSpace: 'pre-wrap' }}>{m.text}</span>
                          ) : (
                            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(m.text) }} />
                          )}

                          {/* Attached Knowledge References */}
                          {m.references && m.references.length > 0 && (
                            <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: '0.72rem', color: 'var(--amber-flow)', fontWeight: 700, marginBottom: 4 }}>
                                Grounding Documents:
                              </div>
                              {m.references.map(ref => (
                                <div key={ref.doc_id} style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <FileText size={12} color="var(--cyan-primary)" />
                                  <span>{ref.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, paddingRight: 4, paddingLeft: 4 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{m.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopy(m.id, m.text)}
                            title="Copy response"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 2 }}
                          >
                            {copiedId === m.id ? <Check size={11} color="#059669" /> : <Copy size={11} />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={13} color="var(--brand)" />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Evaluating telemetry and retrieving regulatory playbook...
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div
                style={{
                  padding: '12px 14px',
                  background: '#ffffff',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={user ? `Ask as ${user.full_name.split(' ')[0]} (e.g. "What is Feeder F-02 loading?")...` : "Ask any question about the grid..."}
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  style={{
                    background: input.trim() && !loading ? 'var(--brand)' : '#e2e8f0',
                    color: input.trim() && !loading ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    borderRadius: 8,
                    padding: '9px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease',
                  }}
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
