'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const STEPS = [
  { label: 'Submitted', done: true },
  { label: 'Under Review', done: true },
  { label: 'Validation', active: true },
  { label: 'Assigned', done: false },
];

interface Control {
  id: number;
  name: string;
  type: string;
  typeColor: string;
  assignee: string;
  assigneeRole: string;
  rationale: string;
  dueDate: string;
  dueDays: string;
}

const INITIAL_CONTROLS: Control[] = [
  {
    id: 1,
    name: 'Role-Based Access Control (RBAC)',
    type: 'Preventive',
    typeColor: '#4ab0de',
    assignee: 'James Wong',
    assigneeRole: 'IT Security',
    rationale: 'Manages IAM systems',
    dueDate: '',
    dueDays: '60 days',
  },
  {
    id: 2,
    name: 'Dual-Approval Workflow',
    type: 'Preventive',
    typeColor: '#4ab0de',
    assignee: 'Sarah Lee',
    assigneeRole: 'Finance Lead',
    rationale: 'Finance process owner',
    dueDate: '',
    dueDays: '45 days',
  },
  {
    id: 3,
    name: 'Transaction Monitoring',
    type: 'Detective',
    typeColor: '#8b5cf6',
    assignee: 'Omar Hassan',
    assigneeRole: 'Risk Analyst',
    rationale: 'Handles monitoring',
    dueDate: '',
    dueDays: '30 days',
  },
];

const CHECKLIST_ITEMS = [
  { id: 1, label: 'Risk description is clear and specific', checked: true },
  { id: 2, label: 'Category correctly classified', checked: true },
  { id: 3, label: 'Risk scores are appropriate', checked: true },
  { id: 4, label: 'Controls are relevant', checked: true },
  { id: 5, label: 'All assignees confirmed', checked: false },
  { id: 6, label: 'Due dates are realistic', checked: false },
];

const TASKS = [
  { id: 'TSK-NEW-01', desc: 'Configure RBAC for financial systems', assignee: 'James Wong' },
  { id: 'TSK-NEW-02', desc: 'Implement dual-approval workflow', assignee: 'Sarah Lee' },
  { id: 'TSK-NEW-03', desc: 'Set up transaction monitoring alerts', assignee: 'Omar Hassan' },
];

export default function ValidatePage() {
  useParams();
  const router = useRouter();

  const [controls, setControls] = useState<Control[]>(INITIAL_CONTROLS);
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);
  const [toast, setToast] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [changesNote, setChangesNote] = useState('');

  const completedCount = checklist.filter((c) => c.checked).length;

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleValidate = () => {
    showToastMsg('Risk validated! Tasks created successfully.');
    setTimeout(() => router.push('/risk-manager/registry'), 2000);
  };

  const updateDueDate = (id: number, val: string) => {
    setControls((prev) => prev.map((c) => (c.id === id ? { ...c, dueDate: val } : c)));
  };

  const toggleChecklist = (id: number) => {
    setChecklist((prev) => prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar role="risk-manager" activePage="validate" />

      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
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

        {/* Reject Modal */}
        {showRejectModal && (
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
              <h3 style={{ margin: '0 0 16px', fontSize: '17px' }}>Reject Risk</h3>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Reason for rejection
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  marginBottom: '16px',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Select reason...</option>
                <option>Duplicate risk entry</option>
                <option>Insufficient description</option>
                <option>Incorrect categorization</option>
                <option>Out of scope</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowRejectModal(false)}
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
                    setShowRejectModal(false);
                    showToastMsg('Risk rejected.');
                  }}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--danger)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  Confirm Reject
                </button>
              </div>
            </div>
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
                Describe the changes needed
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '0', minHeight: '100%' }}>
          {/* LEFT */}
          <div style={{ padding: '32px', borderRight: '1px solid var(--border-color)' }}>
            {/* Back link */}
            <a
              href="/risk-manager/registry"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-muted)',
                fontSize: '13px',
                textDecoration: 'none',
                marginBottom: '24px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-cyan)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')
              }
            >
              ← Risk Registry
            </a>

            {/* Risk header */}
            <div className="animate-fade-up" style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(139,92,246,0.15)',
                    color: 'var(--accent-purple)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  RSK-052
                </span>
                <span
                  style={{
                    background: 'rgba(245,158,11,0.12)',
                    color: '#f59e0b',
                    border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  🔄 Pending Validation
                </span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>
                Payment Authorization Bypass
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                Submitted by Sarah Lee • Finance Dept • 2 days ago
              </p>
            </div>

            {/* 4-step progress */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0',
                marginBottom: '28px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px 20px',
              }}
            >
              {STEPS.map((step, i) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
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
                        fontSize: '11px',
                        color: step.active ? 'var(--accent-cyan)' : step.done ? '#10b981' : 'var(--text-muted)',
                        fontWeight: step.active ? 700 : 400,
                        textAlign: 'center',
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
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

            {/* Risk Summary */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '24px',
              }}
            >
              <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700 }}>Risk Summary</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 16px' }}>
                Risk that payment authorization controls could be bypassed, allowing unauthorized payments to be processed without proper approval workflows.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: '16px' }}>
                {[
                  ['Category', 'Financial > Internal Controls > Authorization'],
                  ['Department', 'Finance'],
                  ['Fraud Type', 'Internal Fraud'],
                  ['Strategic Objective', 'Financial Integrity'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{k}</span>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Score cards */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Inherent', value: '20', color: '#ef4444' },
                  { label: 'Gross', value: '15', color: '#f59e0b' },
                  { label: 'Residual', value: '12', color: '#f59e0b' },
                  { label: 'Likelihood', value: '4/5', color: '#4ab0de' },
                  { label: 'Impact', value: '5/5', color: '#8b5cf6' },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: `${s.color}10`,
                      border: `1px solid ${s.color}30`,
                      borderRadius: '10px',
                      padding: '10px 16px',
                      textAlign: 'center',
                      minWidth: '80px',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI-Proposed Control Assignments */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '24px',
                overflowX: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>AI-Proposed Control Assignments</h3>
                <span
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
                  🤖 AI Suggested
                </span>
              </div>
              <table className="risk-table" style={{ minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th>Control</th>
                    <th>Type</th>
                    <th>AI Suggested Assignee</th>
                    <th>Due Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {controls.map((ctrl) => (
                    <tr key={ctrl.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{ctrl.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {ctrl.rationale}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            background: `${ctrl.typeColor}15`,
                            color: ctrl.typeColor,
                            border: `1px solid ${ctrl.typeColor}30`,
                            borderRadius: '5px',
                            padding: '2px 8px',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          {ctrl.type}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{ctrl.assignee}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ctrl.assigneeRole}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input
                            type="date"
                            value={ctrl.dueDate}
                            onChange={(e) => updateDueDate(ctrl.id, e.target.value)}
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              color: 'var(--text-primary)',
                              fontSize: '12px',
                              outline: 'none',
                              fontFamily: 'inherit',
                            }}
                          />
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Default: {ctrl.dueDays}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
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
                          Change
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tasks Preview */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '20px',
              }}
            >
              <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700 }}>
                Tasks Preview{' '}
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>
                  (will be created on validation)
                </span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {TASKS.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <span
                      style={{
                        background: 'rgba(74,176,222,0.1)',
                        color: 'var(--accent-cyan)',
                        borderRadius: '5px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {task.id}
                    </span>
                    <span style={{ flex: 1, fontSize: '13px', color: 'var(--text-primary)' }}>{task.desc}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>→ {task.assignee}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT sidebar */}
          <div style={{ padding: '32px 24px', background: 'var(--bg-secondary)', overflowY: 'auto' }}>
            {/* Submitter Info */}
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
                Submitter Info
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4ab0de, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  SL
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Sarah Lee</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Finance Lead</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Submitted 2 days ago</div>
              <div style={{ fontSize: '12px', color: 'var(--accent-cyan)', marginTop: '4px' }}>5 previous submissions</div>
            </div>

            {/* Validation Checklist */}
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
                Validation Checklist
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: item.checked ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecklist(item.id)}
                      style={{ accentColor: '#10b981', width: '14px', height: '14px', cursor: 'pointer' }}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Progress</span>
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>{completedCount}/6 complete</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(completedCount / 6) * 100}%`,
                      background: 'linear-gradient(90deg, #10b981, #059669)',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '18px',
              }}
            >
              <h4 style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                AI Insights
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    background: 'rgba(74,176,222,0.06)',
                    border: '1px solid rgba(74,176,222,0.15)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '12.5px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                  }}
                >
                  🔍 Similar risks found:<br />
                  <strong>RSK-031</strong> (87% match), <strong>RSK-019</strong> (72% match)
                </div>
                <div
                  style={{
                    background: 'rgba(16,185,129,0.06)',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '12.5px',
                    color: '#10b981',
                  }}
                >
                  ✅ No duplicate risk detected
                </div>
                <div
                  style={{
                    background: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '12.5px',
                    color: '#ef4444',
                    fontWeight: 600,
                  }}
                >
                  ⚡ Recommended Priority: HIGH
                </div>
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
          onClick={() => setShowRejectModal(true)}
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
          Reject
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
          onClick={handleValidate}
          style={{
            padding: '10px 28px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #4ab0de, #8b5cf6)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        >
          ✅ Validate &amp; Create Tasks
        </button>
      </div>
    </div>
  );
}
