'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface RiskRow {
  id: string;
  title: string;
  category: string;
  department: string;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  score: number;
  controls: number;
  tasks: number;
  status: string;
}

const riskData: RiskRow[] = [
  { id: 'RSK-046', title: 'Vendor Payment Fraud', category: 'Financial / Fraud', department: 'Finance', level: 'CRITICAL', score: 20, controls: 4, tasks: 6, status: 'Active' },
  { id: 'RSK-042', title: 'Budget Forecasting Accuracy', category: 'Financial / Reporting', department: 'Finance', level: 'HIGH', score: 16, controls: 3, tasks: 4, status: 'Active' },
  { id: 'RSK-052', title: 'Payment Authorization Bypass', category: 'Financial / Internal', department: 'Finance', level: 'HIGH', score: 15, controls: 3, tasks: 5, status: 'Pending Validation' },
  { id: 'RSK-048', title: 'Unauthorized System Access', category: 'Technology / Security', department: 'IT', level: 'HIGH', score: 14, controls: 5, tasks: 8, status: 'Active' },
  { id: 'RSK-053', title: 'Data Breach via Phishing', category: 'Technology / Security', department: 'IT', level: 'HIGH', score: 12, controls: 4, tasks: 6, status: 'Pending Validation' },
  { id: 'RSK-031', title: 'Supply Chain Disruption', category: 'Operational', department: 'Operations', level: 'MEDIUM', score: 9, controls: 2, tasks: 3, status: 'Active' },
  { id: 'RSK-044', title: 'Invoice Processing Errors', category: 'Financial / Operational', department: 'Finance', level: 'MEDIUM', score: 8, controls: 2, tasks: 4, status: 'Active' },
  { id: 'RSK-019', title: 'Regulatory Reporting Delay', category: 'Compliance', department: 'Legal', level: 'MEDIUM', score: 6, controls: 3, tasks: 5, status: 'Active' },
];

const aiSuggestions = ['Show critical risks', 'Filter by Finance dept', 'Risks overdue for review', 'Top 10 by score'];

function levelBadgeStyle(level: RiskRow['level']): React.CSSProperties {
  switch (level) {
    case 'CRITICAL':
      return { background: 'rgba(239,68,68,0.18)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.35)' };
    case 'HIGH':
      return { background: 'rgba(245,158,11,0.18)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.35)' };
    case 'MEDIUM':
      return { background: 'rgba(74,176,222,0.18)', color: '#4ab0de', border: '1px solid rgba(74,176,222,0.35)' };
    case 'LOW':
      return { background: 'rgba(16,185,129,0.18)', color: '#10b981', border: '1px solid rgba(16,185,129,0.35)' };
  }
}

function statusStyle(status: string): React.CSSProperties {
  if (status === 'Pending Validation') return { color: '#f59e0b' };
  if (status === 'Active') return { color: '#10b981' };
  return { color: 'var(--text-muted)' };
}

export default function RiskRegistry() {
  const router = useRouter();
  const [aiQuery, setAiQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const filteredRisks = riskData.filter((r) => {
    const matchesSearch = !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || r.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesLevel = levelFilter === 'All' || r.level === levelFilter;
    return matchesSearch && matchesDept && matchesStatus && matchesLevel;
  });

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
      <Sidebar role="risk-manager" activePage="registry" />

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Header */}
        <div
          className="animate-fade-up"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>Risk Registry</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              47 total risks across all departments
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary">
              📤 Export
            </button>
            <button className="btn-primary">
              + Add Risk
            </button>
          </div>
        </div>

        {/* AI Search Bar */}
        <div
          className="animate-fade-up-1"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #4ab0de 0%, #8b5cf6 100%)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '6px',
                letterSpacing: '0.5px',
              }}
            >
              AI
            </span>
            <input
              type="text"
              placeholder="Ask AI: Show me all high-risk financial items..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '9px 14px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent-cyan)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
            />
            <button className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              🔍 Analyze
            </button>
          </div>
          {/* Suggestion Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {aiSuggestions.map((chip) => (
              <button
                key={chip}
                onClick={() => setAiQuery(chip)}
                style={{
                  background: 'rgba(74,176,222,0.08)',
                  border: '1px solid rgba(74,176,222,0.25)',
                  color: 'var(--accent-cyan)',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(74,176,222,0.16)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(74,176,222,0.08)'; }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar + Summary Stats */}
        <div
          className="animate-fade-up-2"
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search risks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'inherit',
                width: '220px',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent-cyan)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
            />
            {[
              {
                label: 'Department',
                value: deptFilter,
                setter: setDeptFilter,
                options: ['All', 'Finance', 'IT', 'Operations', 'Legal'],
              },
              {
                label: 'Status',
                value: statusFilter,
                setter: setStatusFilter,
                options: ['All', 'Active', 'Pending Validation', 'Closed'],
              },
              {
                label: 'Risk Level',
                value: levelFilter,
                setter: setLevelFilter,
                options: ['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
              },
            ].map((filter) => (
              <select
                key={filter.label}
                value={filter.value}
                onChange={(e) => filter.setter(e.target.value)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {filter.options.map((opt) => (
                  <option key={opt} value={opt} style={{ background: 'var(--bg-card)' }}>
                    {opt === 'All' ? `${filter.label}: All` : opt}
                  </option>
                ))}
              </select>
            ))}
          </div>

          {/* Summary Stats */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Critical', count: 5, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
              { label: 'High', count: 7, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
              { label: 'Medium', count: 18, color: '#4ab0de', bg: 'rgba(74,176,222,0.12)' },
              { label: 'Low', count: 17, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: s.bg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                }}
              >
                <span style={{ fontWeight: 700, color: s.color, fontSize: '16px' }}>{s.count}</span>
                <span style={{ color: s.color, fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Table */}
        <div
          className="risk-card animate-fade-up-3"
          style={{ overflow: 'hidden' }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table className="risk-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Risk ID</th>
                  <th>Risk Title</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th>Level</th>
                  <th>Score</th>
                  <th>Controls</th>
                  <th>Tasks</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRisks.map((risk, idx) => (
                  <tr
                    key={risk.id}
                    style={{
                      background: hoveredRow === risk.id ? 'rgba(74,176,222,0.05)' : 'transparent',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setHoveredRow(risk.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => router.push(`/risk-manager/validate/${risk.id}`)}
                  >
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{idx + 1}</td>
                    <td>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '12px' }}>
                        {risk.id}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {risk.title}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px' }}>{risk.category}</td>
                    <td style={{ fontSize: '12px' }}>{risk.department}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '3px 9px',
                          borderRadius: '5px',
                          fontWeight: 700,
                          ...levelBadgeStyle(risk.level),
                        }}
                      >
                        {risk.level}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color:
                            risk.score >= 16
                              ? '#ef4444'
                              : risk.score >= 10
                              ? '#f59e0b'
                              : risk.score >= 6
                              ? '#4ab0de'
                              : '#10b981',
                        }}
                      >
                        {risk.score}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      🔒 {risk.controls}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      ✅ {risk.tasks}
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 500, ...statusStyle(risk.status) }}>
                        {risk.status}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn-primary"
                        style={{ padding: '5px 14px', fontSize: '12px' }}
                        onMouseEnter={() => setHoveredBtn(risk.id)}
                        onMouseLeave={() => setHoveredBtn(null)}
                        onClick={() => router.push(`/risk-manager/validate/${risk.id}`)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing 1–{filteredRisks.length} of 47 risks
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-secondary"
                style={{ padding: '6px 16px', fontSize: '12px', opacity: 0.5, cursor: 'not-allowed' }}
                disabled
              >
                ← Previous
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '6px 16px', fontSize: '12px' }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
