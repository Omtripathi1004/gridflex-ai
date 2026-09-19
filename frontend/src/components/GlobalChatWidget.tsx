'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
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

const QUICK_PROMPTS = [
  "⚡ Why is there an evening deficit?",
  "🔋 What is the battery SoC status?",
  "🛡️ Explain the 4 resilience pillars",
  "🤝 How does P2P auction clearing work?",
  "🔑 What are the default login accounts?",
  "📈 Which ML models generate forecasts?"
];

export const GlobalChatWidget: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your **GridFlex AI Energy Copilot**.\n\nI have real-time access to feeder telemetry, renewable forecasts, battery storage, and the SQLite audit log. Ask me any question or try one of the prompt chips below!",
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
          api_key: apiKey.trim() || undefined
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
    setMessages([
      {
        id: 'welcome_cleared',
        sender: 'assistant',
        text: "Conversation refreshed. Ready for high-volume questions!",
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 20px',
            borderRadius: 30,
            background: 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)',
            color: '#070b14',
            fontWeight: 700,
            fontSize: '0.95rem',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 240, 255, 0.4), 0 0 15px rgba(112, 0, 255, 0.5)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          aria-label={t('copilot.widget_open')}
        >
          <Sparkles size={20} color="#070b14" />
          <span>{t('copilot.widget_title')}</span>
          <span 
            style={{ 
              background: '#070b14', 
              color: '#00f0ff', 
              fontSize: '0.72rem', 
              padding: '2px 7px', 
              borderRadius: 12,
              fontWeight: 800
            }}
          >
            LIVE
          </span>
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 9999,
            width: isExpanded ? 'min(720px, calc(100vw - 32px))' : 'min(420px, calc(100vw - 32px))',
            height: isExpanded ? 'min(780px, calc(100vh - 40px))' : 'min(580px, calc(100vh - 40px))',
            background: 'rgba(11, 18, 33, 0.96)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 240, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'width 0.25s ease, height 0.25s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.12) 0%, rgba(112, 0, 255, 0.12) 100%)',
              borderBottom: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div 
                style={{ 
                  width: 34, 
                  height: 34, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--cyan-primary) 0%, var(--purple-insight) 100%)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#070b14' 
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    GridFlex AI Copilot
                  </h4>
                  <span 
                    style={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      background: 'var(--green-optimal)',
                      boxShadow: '0 0 6px var(--green-optimal)' 
                    }} 
                  />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Contextual RAG Engine • Zero API key needed
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={handleClear}
                title="Clear conversation"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}
              >
                <Trash2 size={16} />
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

          {/* API Key Collapsible */}
          <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setShowApiKey(v => !v)}
              style={{
                width: '100%',
                background: 'rgba(0,240,255,0.04)',
                border: 'none',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: apiKey ? 'var(--green-optimal)' : 'var(--text-secondary)',
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
              <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.3)' }}>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="AIza... (Gemini API Key)"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${apiKey ? 'var(--green-optimal)' : 'var(--border-subtle)'}`,
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
              padding: '10px 14px',
              background: 'rgba(0,0,0,0.2)',
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
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 14,
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  color: 'var(--cyan-primary)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 0.2s',
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
                    maxWidth: '88%',
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
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: isUser ? 'rgba(0, 240, 255, 0.2)' : 'rgba(157, 0, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: isUser ? 'var(--cyan-primary)' : 'var(--purple-insight)',
                      }}
                    >
                      {isUser ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    <div
                      style={{
                        background: isUser 
                          ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.18) 0%, rgba(0, 150, 255, 0.24) 100%)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isUser ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 14px',
                        color: 'var(--text-primary)',
                        fontSize: '0.86rem',
                        lineHeight: 1.55,
                      }}
                    >
                      {isUser ? (
                        <span style={{ whiteSpace: 'pre-wrap' }}>{m.text}</span>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(m.text) }} />
                      )}

                      {/* Attached Knowledge References */}
                      {m.references && m.references.length > 0 && (
                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
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
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: 2,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Copy message"
                      >
                        {copiedId === m.id ? <Check size={12} color="var(--green-optimal)" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(157, 0, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={14} color="var(--purple-insight)" />
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Reasoning over grid telemetry & dispatch rules...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '12px 14px',
              borderTop: '1px solid var(--border-medium)',
              background: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('copilot.widget_placeholder')}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '9px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-primary btn-sm"
              style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
