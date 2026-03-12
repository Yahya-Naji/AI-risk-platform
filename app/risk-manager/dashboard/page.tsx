'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const heatmapData: Record<string, number> = {
  'L1-I1': 0, 'L1-I2': 1, 'L1-I3': 0, 'L1-I4': 0, 'L1-I5': 0,
  'L2-I1': 1, 'L2-I2': 3, 'L2-I3': 2, 'L2-I4': 1, 'L2-I5': 0,
  'L3-I1': 0, 'L3-I2': 2, 'L3-I3': 5, 'L3-I4': 3, 'L3-I5': 1,
  'L4-I1': 0, 'L4-I2': 1, 'L4-I3': 3, 'L4-I4': 6, 'L4-I5': 4,
  'L5-I1': 0, 'L5-I2': 0, 'L5-I3': 1, 'L5-I4': 4, 'L5-I5': 9,
};

function getHeatClass(count: number): string {
  if (count === 0) return '';
  if (count <= 2) return 'heat-very-low';
  if (count <= 5) return 'heat-low';
  if (count <= 9) return 'heat-medium';
  return 'heat-critical';
}

const pendingValidations = [
  { id: 'RSK-052', title: 'Payment Authorization Bypass', submittedBy: 'Sarah Lee', dept: 'Finance', time: '2 days ago' },
  { id: 'RSK-053', title: 'Data Breach via Phishing', submittedBy: 'Mark Wilson', dept: 'IT', time: '1 day ago' },
  { id: 'RSK-054', title: 'Regulatory Reporting Delay', submittedBy: 'Lisa Park', dept: 'Compliance', time: '3 hours ago' },
  { id: 'RSK-055', title: 'Third-Party Vendor Risk', submittedBy: 'James Brown', dept: 'Operations', time: '5 hours ago' },
  { id: 'RSK-056', title: 'Budget Overrun Risk', submittedBy: 'Sarah Lee', dept: 'Finance', time: 'just now' },
];

const overdueControls = [
  { id: 'CTR-011', risk: 'RSK-046', title: 'Vendor Payment Reconciliation', overdueDays: 7, dept: 'Finance' },
  { id: 'CTR-008', risk: 'RSK-042', title: 'Budget Variance Review', overdueDays: 4, dept: 'Finance' },
  { id: 'CTR-019', risk: 'RSK-048', title: 'Access Rights Audit Log', overdueDays: 2, dept: 'IT' },
];

const categories = [
  { name: 'Financial', count: 18, pct: 38 },
  { name: 'Operational', count: 12, pct: 26 },
  { name: 'Technology', count: 9, pct: 19 },
  { name: 'Compliance', count: 8, pct: 17 },
];

const orgLevels = ['Group: All', 'Company', 'Sub-Company', 'Department', 'Team'];

export default function RiskManagerDashboard() {
  const router = useRouter();
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [activeOrgLevel, setActiveOrgLevel] = useState(0);
  const [hoveredValidation, setHoveredValidation] = useState<string | null>(null);

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
      <Sidebar role="risk-manager" activePage="dashboard" />

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
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>
              Risk Manager Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              DDA Group • All Companies
            </p>
            {/* Org Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {orgLevels.map((level, idx) => (
                <button
                  key={level}
                  onClick={() => setActiveOrgLevel(idx)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: `1px solid ${activeOrgLevel === idx ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                    background: activeOrgLevel === idx ? 'rgba(74,176,222,0.15)' : 'var(--bg-card)',
                    color: activeOrgLevel === idx ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4ab0de 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              MR
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Mohammed Al-Rashid</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Senior Risk Manager</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-up-1"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}
        >
          {[
            { label: 'Total Risks', value: 47, icon: '📊', color: 'var(--accent-cyan)', bg: 'rgba(74,176,222,0.1)' },
            { label: 'High / Critical', value: 12, icon: '🔴', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
            { label: 'Pending Review', value: 8, icon: '⏳', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { label: 'Overdue Controls', value: 15, icon: '🚨', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
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
          className="animate-fade-up-2"
          style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px', alignItems: 'start' }}
        >
          {/* LEFT: Heat Map + Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Risk Heat Map */}
            <div className="risk-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 6px' }}>Risk Heat Map</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 20px' }}>
                Click a cell to filter risks by likelihood × impact
              </p>

              {/* Grid */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                {/* Y-axis label */}
                <div
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    alignSelf: 'center',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    paddingBottom: '20px',
                  }}
                >
                  Likelihood ↑
                </div>

                <div style={{ flex: 1 }}>
                  {/* X-axis labels */}
                  <div style={{ display: 'grid', gridTemplateColumns: '32px repeat(5, 1fr)', marginBottom: '4px' }}>
                    <div />
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', paddingBottom: '4px' }}
                      >
                        {i}
                      </div>
                    ))}
                  </div>

                  {/* Rows (L5 at top → L1 at bottom) */}
                  {[5, 4, 3, 2, 1].map((l) => (
                    <div
                      key={l}
                      style={{ display: 'grid', gridTemplateColumns: '32px repeat(5, 1fr)', gap: '4px', marginBottom: '4px' }}
                    >
                      {/* Row label */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        {l}
                      </div>
                      {[1, 2, 3, 4, 5].map((imp) => {
                        const key = `L${l}-I${imp}`;
                        const count = heatmapData[key] ?? 0;
                        const heatClass = getHeatClass(count);
                        const isSelected = selectedCell === key;

                        return (
                          <div
                            key={key}
                            className={heatClass}
                            onClick={() => setSelectedCell(isSelected ? null : key)}
                            style={{
                              height: '52px',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: count > 0 ? 'pointer' : 'default',
                              fontWeight: 700,
                              fontSize: '15px',
                              border: isSelected
                                ? '2px solid var(--accent-cyan)'
                                : count === 0
                                ? '1px solid var(--border-color)'
                                : '1px solid transparent',
                              background: count === 0 ? 'rgba(42,42,90,0.3)' : undefined,
                              color: count === 0 ? 'var(--text-muted)' : undefined,
                              transition: 'transform 0.15s, box-shadow 0.15s',
                              boxShadow: isSelected ? '0 0 0 3px rgba(74,176,222,0.25)' : undefined,
                              transform: isSelected ? 'scale(1.06)' : undefined,
                            }}
                          >
                            {count > 0 ? count : ''}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* X axis label */}
                  <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Impact →
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '18px', flexWrap: 'wrap' }}>
                {[
                  { cls: 'heat-very-low', label: 'Very Low (1-2)' },
                  { cls: 'heat-low', label: 'Low (3-5)' },
                  { cls: 'heat-medium', label: 'Medium (6-9)' },
                  { cls: 'heat-critical', label: 'Critical (10+)' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      className={item.cls}
                      style={{ width: '14px', height: '14px', borderRadius: '3px' }}
                    />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {selectedCell && (
                <div
                  style={{
                    marginTop: '14px',
                    padding: '10px 14px',
                    background: 'rgba(74,176,222,0.08)',
                    border: '1px solid rgba(74,176,222,0.25)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: 'var(--accent-cyan)',
                  }}
                >
                  🔍 Filtered: {heatmapData[selectedCell]} risk(s) at {selectedCell.replace('L', 'Likelihood ').replace('-I', ' / Impact ')}
                </div>
              )}
            </div>

            {/* Risk by Category */}
            <div className="risk-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 18px' }}>
                Risk by Category
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {categories.map((cat) => (
                  <div key={cat.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{cat.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {cat.count} risks
                        <span style={{ marginLeft: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
                          ({cat.pct}%)
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        height: '8px',
                        borderRadius: '4px',
                        background: 'var(--bg-primary)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${cat.pct}%`,
                          borderRadius: '4px',
                          background: 'linear-gradient(135deg, #4ab0de 0%, #8b5cf6 100%)',
                          transition: 'width 0.8s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Pending Validations */}
            <div className="risk-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Pending Validations</h2>
                <span
                  style={{
                    background: 'rgba(245,158,11,0.15)',
                    color: '#f59e0b',
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontWeight: 600,
                  }}
                >
                  {pendingValidations.length} pending
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pendingValidations.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px',
                      background: hoveredValidation === item.id ? 'var(--bg-card-hover)' : 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={() => setHoveredValidation(item.id)}
                    onMouseLeave={() => setHoveredValidation(null)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                          {item.id}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {item.title}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {item.submittedBy} ({item.dept}) • {item.time}
                      </div>
                      <button
                        className="btn-primary"
                        style={{ padding: '5px 12px', fontSize: '11px' }}
                        onClick={() => router.push(`/risk-manager/validate/${item.id}`)}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overdue Controls */}
            <div className="risk-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Overdue Controls</h2>
                <span
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    color: '#ef4444',
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontWeight: 600,
                  }}
                >
                  15 overdue
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {overdueControls.map((ctrl) => (
                  <div
                    key={ctrl.id}
                    style={{
                      padding: '12px',
                      background: 'rgba(239,68,68,0.04)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div
                      className="pulse-dot"
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {ctrl.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {ctrl.id} • {ctrl.risk} • {ctrl.dept} •{' '}
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>{ctrl.overdueDays}d overdue</span>
                      </div>
                    </div>
                    <button
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        color: '#ef4444',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Remind
                    </button>
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
