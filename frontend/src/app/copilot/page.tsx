'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { queryCopilot } from '../../lib/api';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle,
  Bot
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  references?: Array<{ doc_id: string; title: string; category: string; snippet: string }>;
}

export default function CopilotPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'copilot',
      text: "Hello! I am your AI Energy Copilot for GridFlex AI. I can answer questions regarding our multi-horizon ML forecasting, BESS dispatch algorithms, IEEE 1547 interconnection standards, and the 4-pillar resilience formula. How can I assist your grid operations?",
      references: [
        {
          doc_id: "DOC-GRID-01",
          title: "GridFlex AI Dispatch Architecture Specification",
          category: "Architecture",
          snippet: "Hierarchical day-ahead LightGBM forecasts detect surplus/deficit windows, followed by real-time MILP optimization allocating BESS ramp rates and dynamic demand response."
        }
      ]
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const res = await queryCopilot(q);
    setLoading(false);

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'copilot',
      text: res.response,
      references: res.retrieved_references
    };
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h1>{t('copilot.title')}</h1>
          <span className="badge badge-forecast">{t('copilot.rag_arch')}</span>
        </div>
        <p>{t('copilot.subtitle')}</p>
      </div>

      {/* Suggested Quick Questions */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={() => handleSend(t('copilot.quick_q1'))}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.82rem' }}
        >
          💡 {t('copilot.quick_q1')}
        </button>
        <button
          onClick={() => handleSend(t('copilot.quick_q2'))}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.82rem' }}
        >
          🛡 {t('copilot.quick_q2')}
        </button>
        <button
          onClick={() => handleSend(t('copilot.quick_q3'))}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.82rem' }}
        >
          ⚡ {t('copilot.quick_q3')}
        </button>
      </div>

      {/* Chat Messages Conversation Stream */}
      <div className="card" style={{
        minHeight: 460,
        maxHeight: 560,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        padding: '24px 20px'
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
            <div style={{
              maxWidth: '85%',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: m.sender === 'user' ? 'linear-gradient(135deg, #00f0ff 0%, #0070f3 100%)' : 'rgba(20, 31, 54, 0.85)',
              color: m.sender === 'user' ? '#070b14' : '#f8fafc',
              border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
              lineHeight: 1.5,
              fontSize: '0.94rem'
            }}>
              {m.sender === 'copilot' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: 'var(--cyan-primary)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <Bot size={15} />
                  <span>{t('copilot.assistant_title')}</span>
                  <span className="badge badge-sim" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>{t('copilot.rag_badge')}</span>
                </div>
              )}
              {m.text}
            </div>

            {/* Document Citations Drawer */}
            {m.references && m.references.length > 0 && (
              <div style={{
                marginTop: 8,
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <BookOpen size={12} /> {t('copilot.references')}:
                </span>
                {m.references.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(7, 11, 20, 0.7)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--cyan-primary)', marginBottom: 2 }}>
                      [{doc.doc_id}] {doc.title}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      "{doc.snippet}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)', fontSize: '0.86rem' }}>
            <Sparkles size={16} className="energy-line" />
            <span>Retrieving authoritative grid standards & generating answer...</span>
          </div>
        )}
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
          placeholder={t('copilot.input_placeholder')}
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
          style={{ padding: '0 24px' }}
        >
          <Send size={18} />
          {t('copilot.btn_send')}
        </button>
      </form>
    </div>
  );
}
