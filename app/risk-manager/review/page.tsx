'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

const REVIEW_STEPS = [
  { label: 'Submitted', done: true },
  { label: 'AI Analysis', done: true },
  { label: 'Manager Review', done: true },
  { label: 'Evidence Review', active: true },
  { label: 'Closed', done: false },
];

const EVIDENCE_ROWS = [
  {
    id: 'TSK-001',
    task: 'Upload Q1 Evidence',
    control: 'MFA Control',
    files: 2,
    status: 'sufficient' as const,
    statusLabel: '✅ Sufficient',
  },
  {
    id: 'TSK-002',
    task: 'Daily Reconciliation',
    control: 'Reconciliation Control',
    files: 1,
    status: 'incomplete' as const,
    statusLabel: '⚠️ Incomplete',
  },
  {
    id: 'TSK-006',
    task: 'Invoice Matching',
    control: 'Invoice Control',
    files: 3,
    status: 'sufficient' as const,
    statusLabel: '✅ Sufficient',
  },
];

const VALIDATION_ITEMS = [
  { label: 'AI evidence analysis complete', type: 'success' },
  { label: 'TSK-002 evidence incomplete', type: 'warning' },
  { label: 'Risk scores validated', type: 'success' },
  { label: 'Controls appropriately assigned', type: 'success' },
];

const FRAUD_TAGS = ['External Fraud', 'Payment Fraud', 'Vendor Manipulation'];

export default function ReviewPage() {
  const [likelihood, setLikelihood] = useState(4);
  const [impact, setImpact] = useState(4);
  const [riskName, setRiskName] = useState('Vendor Payment Fraud Risk');
  const [riskDesc, setRiskDesc] = useState(
    'Unauthorized parties may manipulate vendor payment processes, leading to fraudulent disbursements and financial losses for the organization.'
  );
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [changesNote, setChangesNote] = useState('');

  const showToastMsg = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastType(type);
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const scoreColor = (val: number) => {
    if (val <= 2) return '#10b981';
    if (val === 3) return '#f59e0b';
    return '#ef4444';
  };

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
            width: '34px',
            height: '34px',
            borderRadius: '7px',
            border: `2px solid ${value === n ? scoreColor(n) : 'var(--border-color)'}`,
            background: value === n ? `${scoreColor(n)}22` : 'transparent',
            color: value === n ? scoreColor(n) : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '13px',
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
      <Sidebar role="risk-manager" activePage="review" />

      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
        {/* Toast */}
        {toast && (
          <div
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 2000,
              background:
                toastType === 'success'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff',
              padding: '14px 22px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: `0 8px 32px ${toastType === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
              animation: 'fadeUp 0.3s ease',
            }}
          >
            {toastType === 'success' ? '✅' : '❌'} {toast}
          </div>
        )}

        {/* Request Changes Modal */}
        {showChangesModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '28px',
                width: '440px',
                maxWidth: '90vw',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: '17px' }}>Request Changes</h3>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Describe changes needed
              </label>
              <textarea
                value={changesNote}
                onChange={(e) => setChangesNote(e.target.value)}
                rows={4}
                placeholder="Explain what needs to be revised..."
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
                  marginBottom: '16px',
                }}
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowChangesModal(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowChangesModal(false);
                    showToastMsg('Changes requested. Submitter notified.');
                  }}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--warning)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: '100%' }}>
          {/* LEFT */}
          <div style={{ padding: '32px', borderRight: '1px solid var(--border-color)' }}>
            {/* Back + header */}
            <a
              href="/risk-manager/registry"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-muted)',
                fontSize: '13px',
                textDecoration: 'none',
                marginBottom: '20px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-cyan)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')
              }
            >
              ← Back
            </a>

            <div className="animate-fade-up" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>
                  <span className="gradient-text">AI Risk Review</span>
                </h1>
                <span
                  style={{
                    background: 'rgba(74,176,222,0.1)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid rgba(74,176,222,0.2)',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  AI Generated
                </span>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                RSK-046 — Vendor Payment Fraud
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Reviewed by AI</div>
            </div>

            {/* 5-step progress */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '24px',
                overflow: 'hidden',
              }}
            >
              {REVIEW_STEPS.map((step, i) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: step.done
                          ? 'rgba(16,185,129,0.2)'
                          : step.active
                          ? 'linear-gradient(135deg, #4ab0de, #8b5cf6)'
                          : 'var(--bg-secondary)',
                        border: step.done
                          ? '2px solid #10b981'
                          : step.active
                          ? 'none'
                          : '2px solid var(--border-color)',
                        color: step.done ? '#10b981' : step.active ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      {step.done ? '✓' : i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        color: step.active ? 'var(--accent-cyan)' : step.done ? '#10b981' : 'var(--text-muted)',
                        fontWeight: step.active ? 700 : 400,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < REVIEW_STEPS.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: '2px',
                        background: step.done ? '#10b981' : 'var(--border-color)',
                        marginTop: '-16px',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* AI Summary Banner */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid transparent',
                backgroundImage:
                  'linear-gradient(var(--bg-card), var(--bg-card)), linear-gradient(135deg, #4ab0de 0%, #8b5cf6 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '24px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4ab0de, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  flexShrink: 0,
                }}
              >
                🤖
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>AI Analysis Summary</div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0', lineHeight: '1.6' }}>
                  AI has analysed <strong>3 evidence files</strong> submitted by Sarah Lee. Overall confidence:{' '}
                  <strong style={{ color: '#10b981' }}>92%</strong>. Evidence is largely satisfactory but Task{' '}
                  <strong style={{ color: '#f59e0b' }}>TSK-002</strong> requires additional documentation.
                </p>
              </div>
              {/* Confidence ring */}
              <div style={{ flexShrink: 0, position: 'relative', width: '64px', height: '64px' }}>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border-color)" strokeWidth="5" />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="url(#confGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26 * 0.92} ${2 * Math.PI * 26 * 0.08}`}
                    strokeDashoffset={2 * Math.PI * 26 * 0.25}
                    transform="rotate(-90 32 32)"
                  />
                  <defs>
                    <linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ab0de" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                  }}
                >
                  92%
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '24px',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700 }}>Basic Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Risk Name
                    <span style={{ background: 'rgba(74,176,222,0.1)', color: 'var(--accent-cyan)', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', fontWeight: 700, textTransform: 'none', letterSpacing: 0 }}>AI</span>
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
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Category
                    <span style={{ background: 'rgba(74,176,222,0.1)', color: 'var(--accent-cyan)', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', fontWeight: 700, textTransform: 'none', letterSpacing: 0 }}>AI</span>
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
                        {i < arr.length - 1 && <span style={{ color: 'var(--text-muted)' }}>›</span>}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Description
                    <span style={{ background: 'rgba(74,176,222,0.1)', color: 'var(--accent-cyan)', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', fontWeight: 700, textTransform: 'none', letterSpacing: 0 }}>AI</span>
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
              </div>
            </div>

            {/* Risk Assessment */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '24px',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700 }}>Risk Assessment</h3>
              {/* Score cards */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Inherent', value: '20', color: '#ef4444' },
                  { label: 'Gross', value: '16', color: '#f59e0b' },
                  { label: 'Residual', value: '12', color: '#f59e0b' },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: `${s.color}10`,
                      border: `1px solid ${s.color}30`,
                      borderRadius: '10px',
                      padding: '12px 20px',
                      textAlign: 'center',
                      flex: 1,
                      minWidth: '80px',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {/* Selectors */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Likelihood
                  </label>
                  <ScoreSelector value={likelihood} onChange={setLikelihood} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Impact
                  </label>
                  <ScoreSelector value={impact} onChange={setImpact} />
                </div>
              </div>
              {/* Fraud tags */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  Fraud Classification
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {FRAUD_TAGS.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Evidence Review table */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '20px',
                overflowX: 'auto',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700 }}>Evidence Review</h3>
              <table className="risk-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Control</th>
                    <th>Evidence Files</th>
                    <th>AI Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {EVIDENCE_ROWS.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{row.id}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{row.task}</div>
                      </td>
                      <td style={{ fontSize: '13px' }}>{row.control}</td>
                      <td>
                        <span
                          style={{
                            background: 'rgba(74,176,222,0.1)',
                            color: 'var(--accent-cyan)',
                            border: '1px solid rgba(74,176,222,0.2)',
                            borderRadius: '6px',
                            padding: '2px 10px',
                            fontSize: '12px',
                            fontWeight: 700,
                          }}
                        >
                          {row.files} file{row.files !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            background: row.status === 'sufficient' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                            color: row.status === 'sufficient' ? '#10b981' : '#f59e0b',
                            border: `1px solid ${row.status === 'sufficient' ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                            borderRadius: '6px',
                            padding: '3px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          {row.statusLabel}
                        </span>
                      </td>
                      <td>
                        <button
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            border: `1px solid ${row.status === 'incomplete' ? 'rgba(245,158,11,0.4)' : 'var(--border-color)'}`,
                            background: row.status === 'incomplete' ? 'rgba(245,158,11,0.08)' : 'var(--bg-secondary)',
                            color: row.status === 'incomplete' ? '#f59e0b' : 'var(--text-secondary)',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            fontWeight: row.status === 'incomplete' ? 600 : 400,
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.opacity = '0.8';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                          }}
                        >
                          {row.status === 'incomplete' ? 'Request More' : 'View Files'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT sidebar */}
          <div style={{ padding: '32px 20px', background: 'var(--bg-secondary)', overflowY: 'auto' }}>
            {/* Validation Panel */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '18px',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Validation Panel
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {VALIDATION_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: item.type === 'success' ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)',
                      border: `1px solid ${item.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}`,
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{item.type === 'success' ? '✅' : '⚠️'}</span>
                    <span
                      style={{
                        fontSize: '12.5px',
                        color: item.type === 'success' ? '#10b981' : '#f59e0b',
                        fontWeight: 500,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Risks */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '18px',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Similar Risks
              </h4>
              {[
                { id: 'RSK-031', match: 78 },
                { id: 'RSK-019', match: 65 },
              ].map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <span style={{ fontSize: '13px', color: 'var(--accent-purple)', fontWeight: 600 }}>{r.id}</span>
                  <span
                    style={{
                      background: 'rgba(74,176,222,0.1)',
                      color: 'var(--accent-cyan)',
                      borderRadius: '20px',
                      padding: '2px 10px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {r.match}% match
                  </span>
                </div>
              ))}
            </div>

            {/* Changes Summary */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '18px',
              }}
            >
              <h4 style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Changes Summary
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { icon: '📊', text: 'Likelihood changed: 5 → 4 by AI' },
                  { icon: '🔄', text: 'Residual score recalculated' },
                  { icon: '➕', text: '1 control added by AI' },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'var(--bg-secondary)',
                      fontSize: '12.5px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom action bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '260px',
          right: 0,
          zIndex: 100,
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={() => showToastMsg('Risk rejected.', 'error')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(239,68,68,0.4)',
            background: 'rgba(239,68,68,0.08)',
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.18)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)')}
        >
          Reject Risk
        </button>
        <button
          onClick={() => setShowChangesModal(true)}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(245,158,11,0.4)',
            background: 'rgba(245,158,11,0.08)',
            color: '#f59e0b',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.18)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.08)')}
        >
          Request Changes
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => showToastMsg('Risk approved and closed successfully!')}
          style={{
            padding: '10px 28px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        >
          ✅ Approve &amp; Close
        </button>
      </div>
    </div>
  );
}
