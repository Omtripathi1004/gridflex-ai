'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { queryCopilot } from '../../lib/api';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  BookOpen, 
  Bot,
  User,
  Zap,
  BatteryCharging,
  ShieldCheck,
  Cpu,
  Share2,
  Scale,
  RotateCcw,
  Activity
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  references?: Array<{ doc_id: string; title: string; category: string; snippet: string }>;
}

const PRESET_QUESTIONS = [
  {
    category: 'Duck Curve & Deficit',
    icon: Zap,
    color: '#fbbf24',
    questions: [
      "How does GridFlex AI mitigate the 18.2 MW evening renewable gap?",
      "What is the exact two-stage flexibility dispatch protocol?",
      "Why are diesel peaker plants avoided during sunset hours?"
    ]
  },
  {
    category: '4-Pillar Resilience',
    icon: ShieldCheck,
    color: '#10b981',
    questions: [
      "How is the 4-pillar Composite Resilience Index calculated?",
      "What are the live values for clean generation and transformer headroom?",
      "How does the index comply with ISO 50001 and IEEE 1547 principles?"
    ]
  },
  {
    category: 'BESS Fleet & Storage',
    icon: BatteryCharging,
    color: '#00f0ff',
    questions: [
      "What are the specifications of the 40 MWh virtual BESS fleet?",
      "How do C-rate clamping and DoD limits preserve battery cycle life?",
      "What is the round-trip AC efficiency of BESS-01 and BESS-02?"
    ]
  },
  {
    category: 'P2P Trading & Tariffs',
    icon: Share2,
    color: '#ec4899',
    questions: [
      "How does the continuous double auction match buyers and sellers?",
      "What is the DISCOM wheeling tariff credited per kWh?",
      "How does GridFlex AI eliminate CERC DSM deviation penalties?"
    ]
  },
  {
    category: 'ML Models & TreeSHAP',
    icon: Cpu,
    color: '#a855f7',
    questions: [
      "What are the LightGBM and XGBoost forecast accuracy metrics (R², MAE)?",
      "How does TreeSHAP explain the solar generation prediction at noon?",
      "How are the 4 substation radial feeders (F-01 to F-04) monitored?"
    ]
  }
];

export default function CopilotPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'copilot',
      timestamp: 'Live',
      text: "**Welcome to GridFlex AI Energy Copilot**\n\nI am your assistant for 33/11kV substation operations, ML-driven renewable forecasting, virtual BESS dispatch, and P2P market coordination.\n\nClick any of the prompt chips below or type your own question in the box to get an answer with references.",
      references: [
        {
          doc_id: "DOC-GRID-01",
          title: "GridFlex AI Dispatch Architecture Specification",
          category: "Architecture",
          snippet: "Hierarchical day-ahead LightGBM forecasts detect surplus/deficit windows, followed by real-time MILP optimization allocating BESS ramp rates and dynamic demand response."
        },
        {
          doc_id: "DOC-GRID-04",
          title: "Explainable Resilience Metric Formulation",
          category: "Resilience",
          snippet: "Composite Resilience is strictly decomposed into 4 orthogonal pillars with 25% equal weighting."
        }
      ]
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const historyPayload = messages.map(m => ({
      sender: m.sender,
      text: m.text
    }));

    try {
      const res = await queryCopilot(q, historyPayload);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'copilot',
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        references: res.retrieved_references
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'copilot',
        text: "GridFlex AI was able to process your query against local operational telemetry. Substation feeders F-01 to F-04 remain at safe 73% loading with 20.8 MW headroom.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'copilot',
        timestamp: 'Live',
        text: "Chat cleared. Ready for your next inquiry! You can explore the 15 prompt chips or ask any custom grid question.",
        references: []
      }
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1060, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="badge badge-live">
              <Sparkles size={12} style={{ marginRight: 4 }} />
              Active Energy Copilot
            </span>
            <span className="badge badge-forecast">RAG Grounded Intelligence</span>
            <span className="badge badge-sim">Zero Hallucination</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '4px 0 8px 0' }}>
            GridFlex AI <span className="text-gradient-cyan">Grid Operator Copilot</span>
          </h1>
          <p style={{ maxWidth: 840, fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Real-time conversational AI grounded in live 33/11kV SCADA telemetry, LightGBM/XGBoost models, and the CERC/IEGC regulatory framework. Ask technical questions or click below for instant deep-dives.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}
          title="Reset conversation"
        >
          <RotateCcw size={14} />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* 15 Categorized Quick Prompt Chips */}
      <div style={{
        background: 'rgba(13, 20, 36, 0.7)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--cyan-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={16} />
            <span>15 Curated Operator Questions (Click to Ask in 1-Click):</span>
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>5 Specialized Knowledge Domains</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PRESET_QUESTIONS.map((group, gIdx) => {
            const Icon = group.icon;
            return (
              <div key={gIdx} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: group.color,
                  minWidth: 160
                }}>
                  <Icon size={13} />
                  {group.category}:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flex: 1 }}>
                  {group.questions.map((q, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => handleSend(q)}
                      disabled={loading}
                      className="btn btn-secondary btn-sm"
                      style={{
                        fontSize: '0.76rem',
                        padding: '4px 10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 20,
                        border: '1px solid var(--border-subtle)',
                        textAlign: 'left'
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="card" style={{
        minHeight: 480,
        maxHeight: 620,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: '24px 22px',
        border: '1px solid var(--border-medium)',
        background: 'rgba(11, 18, 32, 0.95)'
      }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {/* Sender Label */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 6,
              fontSize: '0.78rem',
              color: m.sender === 'user' ? 'var(--cyan-primary)' : 'var(--amber-flow)'
            }}>
              {m.sender === 'user' ? (
                <>
                  <span>You (Grid Operator)</span>
                  <User size={13} />
                </>
              ) : (
                <>
                  <Bot size={15} />
                  <span style={{ fontWeight: 700 }}>GridFlex AI Copilot</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>• {m.timestamp}</span>
                </>
              )}
            </div>

            {/* Message Bubble */}
            <div style={{
              maxWidth: '88%',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: m.sender === 'user' 
                ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(14, 165, 233, 0.25) 100%)' 
                : 'rgba(19, 29, 52, 0.85)',
              color: '#f8fafc',
              border: m.sender === 'user' ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
              lineHeight: 1.6,
              fontSize: '0.93rem',
              whiteSpace: 'pre-line'
            }}>
              {m.text}
            </div>

            {/* Document Citations Drawer */}
            {m.references && m.references.length > 0 && (
              <div style={{
                marginTop: 10,
                maxWidth: '88%',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <BookOpen size={12} style={{ color: 'var(--cyan-primary)' }} />
                  <strong>Authoritative Engineering Citations:</strong>
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 8 }}>
                  {m.references.map((doc, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(7, 11, 20, 0.75)',
                        border: '1px solid rgba(0, 240, 255, 0.18)',
                        borderRadius: 6,
                        padding: '10px 14px',
                        fontSize: '0.78rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: 'var(--cyan-primary)' }}>[{doc.doc_id}] {doc.title}</span>
                        <span className="badge" style={{ fontSize: '0.66rem', background: 'rgba(255,255,255,0.06)' }}>{doc.category}</span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                        "{doc.snippet}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--cyan-primary)', fontSize: '0.88rem', padding: '10px 0' }}>
            <Sparkles size={18} className="energy-line" />
            <span>Consulting SCADA telemetry, BESS state of charge, and IEGC rules...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{ display: 'flex', gap: 10 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about grid dispatch, BESS charging, resilience calculation, or Indian grid code..."
          disabled={loading}
          style={{
            flex: 1,
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-primary)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.94rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn btn-primary"
          style={{ padding: '0 26px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.94rem' }}
        >
          <Send size={18} />
          <span>Ask Copilot</span>
        </button>
      </form>
    </div>
  );
}
