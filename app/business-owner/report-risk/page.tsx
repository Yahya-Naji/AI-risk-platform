'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

interface Message {
  role: 'ai' | 'user';
  content: string;
}

const SUGGESTION_CHIPS = [
  'Vendor payment fraud',
  'Unauthorized system access',
  'Data quality issues',
  'Budget overrun risk',
];

const CONTROLS = [
  { id: 1, label: 'Data Classification Policy', type: 'Directive', checked: true },
  { id: 2, label: 'Vendor Verification Workflow', type: 'Preventive', checked: true },
  { id: 3, label: 'Dual-Approval Payment Process', type: 'Preventive', checked: true },
  { id: 4, label: 'Monthly Transaction Reconciliation', type: 'Detective', checked: true },
  { id: 5, label: 'Incident Response Plan', type: 'Corrective', checked: false },
];

const INITIAL_MESSAGE: Message = {
  role: 'ai',
  content:
    "Hi Sarah! I'm your AI Risk Copilot. I can help you identify and document risks. Just describe any concern you have about your department or processes, and I'll help structure it properly. What risk would you like to report today?",
};

export default function ReportRiskPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDraft, setShowDraft] = useState(false);
  const [likelihood, setLikelihood] = useState(4);
  const [impact, setImpact] = useState(4);
  const [controls, setControls] = useState(CONTROLS);
  const [toast, setToast] = useState<string | null>(null);
  const [riskName, setRiskName] = useState('Vendor Payment Fraud Risk');
  const [riskDesc, setRiskDesc] = useState(
    'Unauthorized parties may manipulate vendor payment processes, leading to fraudulent disbursements and financial losses for the organization.'
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const firstResponse = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? inputValue).trim();
    if (!msg || isLoading) return;
    setInputValue('');
    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = newMessages.slice(0, -1).map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content,
      }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, role: 'risk-copilot', history }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', content: data.response }]);
      if (!firstResponse.current) {
        firstResponse.current = true;
        setShowDraft(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: "I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  const toggleControl = (id: number) => {
    setControls((prev) => prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const scoreColor = (val: number) => {
    if (val <= 2) return '#10b981';
    if (val === 3) return '#f59e0b';
    return '#ef4444';
  };

  const inherentScore = likelihood * impact;

  const ScoreSelector = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div style={{ display: 'flex', gap: '6px' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: `2px solid ${value === n ? scoreColor(n) : 'var(--border-color)'}`,
            background: value === n ? `${scoreColor(n)}22` : 'transparent',
            color: value === n ? scoreColor(n) : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar role="business-owner" activePage="report-risk" />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toast */}
        {toast && (
          <div
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 2000,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              padding: '14px 22px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(16,185,129,0.4)',
              animation: 'fadeUp 0.3s ease',
            }}
          >
            ✅ {toast}
          </div>
        )}

        {/* Page header */}
        <div
          style={{
            padding: '24px 32px 20px',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
          }}
        >
          <h1 className="animate-fade-up" style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>
            <span className="gradient-text">Report New Risk</span>
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Describe your concern and let AI help you structure it
          </p>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: showDraft ? '1fr 380px' : '1fr',
            gap: '0',
            overflow: 'hidden',
            height: 'calc(100vh - 97px)',
          }}
        >
          {/* LEFT — AI Chat Panel */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRight: showDraft ? '1px solid var(--border-color)' : 'none',
              overflow: 'hidden',
            }}
          >
            {/* Chat header */}
            <div
              style={{
                padding: '16px 24px',
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4ab0de 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                }}
              >
                🤖
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>AI Risk Copilot</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Powered by ChatGPT</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  className="pulse-dot"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>Online</span>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {messages.map((msg, i) => (
                <div key={i}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      gap: '10px',
                      alignItems: 'flex-start',
                    }}
                  >
                    {msg.role === 'ai' && (
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #4ab0de, #8b5cf6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        🤖
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '12px 16px',
                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background:
                          msg.role === 'user'
                            ? 'linear-gradient(135deg, #4ab0de, #8b5cf6)'
                            : 'var(--bg-card)',
                        border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '13.5px',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>

                  {/* Suggestion chips after first AI message */}
                  {msg.role === 'ai' && i === 0 && (
                    <div
                      style={{
                        marginTop: '10px',
                        marginLeft: '40px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      {SUGGESTION_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => handleSend(chip)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: '1px solid var(--accent-cyan)',
                            background: 'rgba(74,176,222,0.08)',
                            color: 'var(--accent-cyan)',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            fontWeight: 500,
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background =
                              'rgba(74,176,222,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background =
                              'rgba(74,176,222,0.08)';
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #4ab0de, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    🤖
                  </div>
                  <div
                    style={{
                      padding: '14px 18px',
                      borderRadius: '16px 16px 16px 4px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      gap: '5px',
                      alignItems: 'center',
                    }}
                  >
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="typing-dot"
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: 'var(--accent-cyan)',
                          display: 'inline-block',
                          animationDelay: `${d * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-end',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '10px 14px',
                }}
              >
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '18px',
                    lineHeight: 1,
                    padding: '4px',
                    flexShrink: 0,
                    transition: 'color 0.15s',
                  }}
                  title="Attach file"
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-cyan)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')
                  }
                >
                  📎
                </button>
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe a risk or concern..."
                  rows={1}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    resize: 'none',
                    lineHeight: '1.5',
                    fontFamily: 'inherit',
                    maxHeight: '120px',
                    overflow: 'auto',
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    border: 'none',
                    background:
                      inputValue.trim() && !isLoading
                        ? 'linear-gradient(135deg, #4ab0de, #8b5cf6)'
                        : 'var(--border-color)',
                    color: '#fff',
                    cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}
                >
                  ➤
                </button>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>

          {/* RIGHT — Risk Draft Panel */}
          {showDraft && (
            <div
              className="animate-fade-up"
              style={{
                overflowY: 'auto',
                padding: '24px',
                background: 'var(--bg-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
              }}
            >
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                {/* Draft header */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--border-color)',
                    background: 'rgba(139,92,246,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>📋 AI-Generated Risk Draft</span>
                    <span
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        color: '#10b981',
                        border: '1px solid rgba(16,185,129,0.3)',
                        borderRadius: '20px',
                        padding: '3px 10px',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      92% confidence
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['SEC Filing', 'Risk Library', 'ISO 27001'].map((src) => (
                      <span
                        key={src}
                        style={{
                          background: 'rgba(74,176,222,0.1)',
                          color: 'var(--accent-cyan)',
                          border: '1px solid rgba(74,176,222,0.2)',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Draft form */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Risk Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Risk Name
                    </label>
                    <input
                      value={riskName}
                      onChange={(e) => setRiskName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '9px 12px',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Category
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                      {['Financial', 'Fraud', 'External Fraud'].map((c, i, arr) => (
                        <span key={c} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              background: 'rgba(139,92,246,0.12)',
                              color: 'var(--accent-purple)',
                              border: '1px solid rgba(139,92,246,0.25)',
                              borderRadius: '5px',
                              padding: '3px 8px',
                              fontWeight: 600,
                            }}
                          >
                            {c}
                          </span>
                          {i < arr.length - 1 && (
                            <span style={{ color: 'var(--text-muted)' }}>›</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Risk Description
                    </label>
                    <textarea
                      value={riskDesc}
                      onChange={(e) => setRiskDesc(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '9px 12px',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        lineHeight: '1.5',
                      }}
                    />
                  </div>

                  {/* Likelihood */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Likelihood
                    </label>
                    <ScoreSelector value={likelihood} onChange={setLikelihood} />
                  </div>

                  {/* Impact */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Impact
                    </label>
                    <ScoreSelector value={impact} onChange={setImpact} />
                  </div>

                  {/* Inherent Score */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Inherent Score (L × I)
                    </span>
                    <span
                      style={{
                        background: inherentScore >= 15 ? 'rgba(239,68,68,0.15)' : inherentScore >= 9 ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                        color: inherentScore >= 15 ? '#ef4444' : inherentScore >= 9 ? '#f59e0b' : '#10b981',
                        border: `1px solid ${inherentScore >= 15 ? 'rgba(239,68,68,0.3)' : inherentScore >= 9 ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                        borderRadius: '8px',
                        padding: '4px 14px',
                        fontWeight: 800,
                        fontSize: '18px',
                      }}
                    >
                      {inherentScore}
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid var(--border-color)' }} />

                  {/* Controls */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                      Controls
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {controls.map((ctrl) => (
                        <label
                          key={ctrl.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: ctrl.checked ? 'rgba(74,176,222,0.05)' : 'transparent',
                            border: `1px solid ${ctrl.checked ? 'rgba(74,176,222,0.15)' : 'transparent'}`,
                            transition: 'all 0.15s',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={ctrl.checked}
                            onChange={() => toggleControl(ctrl.id)}
                            style={{ accentColor: 'var(--accent-cyan)', width: '15px', height: '15px', cursor: 'pointer' }}
                          />
                          <span style={{ flex: 1, fontSize: '13px', color: 'var(--text-primary)' }}>
                            {ctrl.label}
                          </span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background:
                                ctrl.type === 'Preventive'
                                  ? 'rgba(74,176,222,0.12)'
                                  : ctrl.type === 'Detective'
                                  ? 'rgba(139,92,246,0.12)'
                                  : ctrl.type === 'Directive'
                                  ? 'rgba(16,185,129,0.12)'
                                  : 'rgba(245,158,11,0.12)',
                              color:
                                ctrl.type === 'Preventive'
                                  ? 'var(--accent-cyan)'
                                  : ctrl.type === 'Detective'
                                  ? 'var(--accent-purple)'
                                  : ctrl.type === 'Directive'
                                  ? '#10b981'
                                  : '#f59e0b',
                            }}
                          >
                            {ctrl.type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                    <button
                      onClick={() => showToast('Draft saved successfully!')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-cyan)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-cyan)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-color)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                      }}
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={() => showToast('Risk submitted for review!')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #4ab0de, #8b5cf6)',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.opacity = '1')
                      }
                    >
                      Submit for Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
