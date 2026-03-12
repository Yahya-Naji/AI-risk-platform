'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

type TabKey = 'all' | 'overdue' | 'changes' | 'inprogress' | 'completed';

interface Task {
  id: string;
  title: string;
  controlType: string;
  linkedRisk: string;
  linkedRiskId: string;
  status: string;
  statusKey: TabKey | 'submitted';
  dueDate: string;
  overdue: boolean;
  evidenceCount: number;
}

const allTasks: Task[] = [
  {
    id: 'TSK-001',
    title: 'Upload Q1 Control Testing Evidence',
    controlType: 'Preventive',
    linkedRisk: 'RSK-046 Vendor Payment Fraud',
    linkedRiskId: 'RSK-046',
    status: 'Overdue',
    statusKey: 'overdue',
    dueDate: 'Mar 5',
    overdue: true,
    evidenceCount: 2,
  },
  {
    id: 'TSK-003',
    title: 'Complete Budget Variance Control Assessment',
    controlType: 'Detective',
    linkedRisk: 'RSK-042 Budget Forecasting',
    linkedRiskId: 'RSK-042',
    status: 'Overdue',
    statusKey: 'overdue',
    dueDate: 'Mar 8',
    overdue: true,
    evidenceCount: 0,
  },
  {
    id: 'TSK-002',
    title: 'Daily Reconciliation Report Setup',
    controlType: 'Detective',
    linkedRisk: 'RSK-046 Vendor Payment Fraud',
    linkedRiskId: 'RSK-046',
    status: 'Changes Requested',
    statusKey: 'changes',
    dueDate: 'Mar 15',
    overdue: false,
    evidenceCount: 1,
  },
  {
    id: 'TSK-004',
    title: 'Implement Dual-Approval Workflow',
    controlType: 'Preventive',
    linkedRisk: 'RSK-052 Payment Auth Bypass',
    linkedRiskId: 'RSK-052',
    status: 'In Progress',
    statusKey: 'inprogress',
    dueDate: 'Apr 15',
    overdue: false,
    evidenceCount: 0,
  },
  {
    id: 'TSK-005',
    title: 'Access Rights Review Documentation',
    controlType: 'Detective',
    linkedRisk: 'RSK-048 Unauthorized System Access',
    linkedRiskId: 'RSK-048',
    status: 'Pending',
    statusKey: 'all',
    dueDate: 'Apr 20',
    overdue: false,
    evidenceCount: 0,
  },
  {
    id: 'TSK-006',
    title: 'Invoice Matching Control Test',
    controlType: 'Preventive',
    linkedRisk: 'RSK-044 Invoice Processing',
    linkedRiskId: 'RSK-044',
    status: 'Submitted',
    statusKey: 'completed',
    dueDate: 'Mar 20',
    overdue: false,
    evidenceCount: 3,
  },
];

const highPriorityRisks = [
  { id: 'RSK-046', title: 'Vendor Payment Fraud', score: 16, level: 'HIGH' },
  { id: 'RSK-042', title: 'Budget Forecasting Accuracy', score: 15, level: 'HIGH' },
  { id: 'RSK-052', title: 'Payment Authorization Bypass', score: 12, level: 'MEDIUM' },
];

function statusStyle(status: string): React.CSSProperties {
  if (status === 'Overdue') return { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' };
  if (status === 'Changes Requested') return { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' };
  if (status === 'In Progress') return { background: 'rgba(74,176,222,0.15)', color: '#4ab0de', border: '1px solid rgba(74,176,222,0.3)' };
  if (status === 'Submitted') return { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' };
  return { background: 'rgba(160,160,192,0.1)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' };
}

const tabs: { key: TabKey | 'all'; label: string; count: number }[] = [
  { key: 'all', label: 'All Tasks', count: 6 },
  { key: 'overdue', label: 'Overdue', count: 2 },
  { key: 'changes', label: 'Changes Requested', count: 1 },
  { key: 'inprogress', label: 'In Progress', count: 1 },
  { key: 'completed', label: 'Completed', count: 1 },
];

export default function BusinessOwnerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey | 'all'>('all');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const filteredTasks = activeTab === 'all'
    ? allTasks
    : allTasks.filter((t) => t.statusKey === activeTab);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}
    >
      <Sidebar role="business-owner" activePage="dashboard" />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Header */}
        <div
          className="animate-fade-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
              My Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Welcome back, Sarah • Finance Department
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/business-owner/report-risk" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">💬 Report New Risk</button>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ab0de 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                SL
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Sarah Lee</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Finance Lead</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div
          className="animate-fade-up-1"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.08) 100%)',
            border: '1px solid rgba(239,68,68,0.35)',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <span style={{ fontWeight: 600, color: '#ef4444', fontSize: '14px' }}>2 Tasks Overdue</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px', marginLeft: '8px' }}>
                Please complete these tasks immediately to avoid compliance issues.
              </span>
            </div>
          </div>
          <button
            style={{
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid rgba(239,68,68,0.4)',
              color: '#ef4444',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            onClick={() => setActiveTab('overdue')}
          >
            View Overdue Tasks
          </button>
        </div>

        {/* Stats Grid */}
        <div
          className="animate-fade-up-2"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
        >
          {[
            { label: 'Total Tasks', value: 6, icon: '✅', color: '#4ab0de', bg: 'rgba(74,176,222,0.1)' },
            { label: 'Overdue', value: 2, icon: '🚨', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
            { label: 'Changes Requested', value: 1, icon: '↻', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { label: 'Completed', value: 3, icon: '✓', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="risk-card"
              style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                }}
              >
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '26px', fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div
          className="animate-fade-up-3"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          {/* Left: Tasks Card */}
          <div className="risk-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 0' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px' }}>
                📋 My Pending Tasks
              </h2>
              {/* Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '0',
                  overflowX: 'auto',
                }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '8px 14px',
                      fontSize: '12.5px',
                      fontWeight: activeTab === tab.key ? 600 : 400,
                      color: activeTab === tab.key ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeTab === tab.key ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {tab.label}
                    <span
                      style={{
                        background: activeTab === tab.key ? 'rgba(74,176,222,0.2)' : 'rgba(160,160,192,0.1)',
                        color: activeTab === tab.key ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="risk-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Control Type</th>
                    <th>Linked Risk</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Evidence</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      style={{
                        background: hoveredRow === task.id ? 'rgba(74,176,222,0.05)' : 'transparent',
                      }}
                      onMouseEnter={() => setHoveredRow(task.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => router.push(`/business-owner/tasks/${task.id}`)}
                    >
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              color: 'var(--accent-cyan)',
                              fontWeight: 600,
                            }}
                          >
                            {task.id}
                          </span>
                          <span
                            style={{
                              color: 'var(--text-primary)',
                              fontWeight: 500,
                              fontSize: '13px',
                            }}
                          >
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: task.controlType === 'Preventive'
                              ? 'rgba(139,92,246,0.15)'
                              : 'rgba(74,176,222,0.15)',
                            color: task.controlType === 'Preventive'
                              ? 'var(--accent-purple)'
                              : 'var(--accent-cyan)',
                          }}
                        >
                          {task.controlType}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {task.linkedRisk}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 500,
                            ...statusStyle(task.status),
                          }}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '12px',
                            color: task.overdue ? '#ef4444' : 'var(--text-secondary)',
                            fontWeight: task.overdue ? 600 : 400,
                          }}
                        >
                          {task.dueDate} {task.overdue ? '⚠️' : ''}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        📎 {task.evidenceCount}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          className={task.status === 'Submitted' ? 'btn-secondary' : 'btn-primary'}
                          style={{ padding: '6px 14px', fontSize: '12px' }}
                          onClick={() => router.push(`/business-owner/tasks/${task.id}`)}
                        >
                          {task.status === 'Submitted' ? 'View' : 'Open'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick Actions */}
            <div className="risk-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 14px', color: 'var(--text-secondary)' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link href="/business-owner/report-risk" style={{ textDecoration: 'none' }}>
                  <button
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    📝 Report New Risk
                  </button>
                </Link>
                <Link href="/business-owner/report-risk" style={{ textDecoration: 'none' }}>
                  <button
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    🤖 Ask AI Assistant
                  </button>
                </Link>
              </div>
            </div>

            {/* High Priority Risks */}
            <div className="risk-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 14px', color: 'var(--text-secondary)' }}>
                High Priority Risks
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {highPriorityRisks.map((risk) => (
                  <div
                    key={risk.id}
                    style={{
                      padding: '12px',
                      background: 'var(--bg-primary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <div
                        style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '2px' }}
                      >
                        {risk.id}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {risk.title}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: risk.score >= 15 ? '#ef4444' : risk.score >= 10 ? '#f59e0b' : '#4ab0de',
                        }}
                      >
                        {risk.score}
                      </div>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 7px',
                          borderRadius: '5px',
                          fontWeight: 600,
                          background: risk.level === 'HIGH'
                            ? 'rgba(239,68,68,0.15)'
                            : 'rgba(245,158,11,0.15)',
                          color: risk.level === 'HIGH' ? '#ef4444' : '#f59e0b',
                        }}
                      >
                        {risk.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
