'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import {
  BarChart3,
  ShieldAlert,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  Zap,
  TrendingUp,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';

interface DashboardData {
  stats: { totalRisks: number; highResidual: number; inadequateControls: number; pendingReview: number; mitigated: number };
  fraudRisks: { total: number; byCategory: Record<string, number> };
  heatMap: number[][];
  controlAdequacy: { effective: number; partiallyEffective: number; ineffective: number; notAssessed: number; total: number };
  byDepartment: Record<string, { inherent: number; gross: number; residual: number; count: number }>;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  recentHighPriority: Array<{
    id: string; riskId: string; title: string; category: string; department: string;
    inherentScore: number; grossScore: number; residualScore: number; riskLevel: string;
    status: string; controlCount: number; controlAdequacy: string;
    reportedBy: { name: string; avatar: string } | null; strategicObjective: string | null;
  }>;
  byObjective: Record<string, { count: number; highSeverity: number; avgScore: number }>;
  taskStats: { total: number; overdue: number };
}

interface PendingRisk {
  id: string; riskId: string; title: string; category: string; department: string;
  riskLevel: string; inherentScore: number; createdAt: string;
  reportedBy: { name: string; avatar: string } | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  OPERATIONAL: 'Operational', COMPLIANCE: 'Compliance', FINANCIAL: 'Financial',
  STRATEGIC: 'Strategic', HR_TALENT: 'HR & Talent', IT_CYBER: 'IT/Cyber',
};
const CATEGORY_COLORS: Record<string, string> = {
  OPERATIONAL: '#4ab0de', COMPLIANCE: '#8b5cf6', FINANCIAL: '#f59e0b',
  STRATEGIC: '#ec4899', HR_TALENT: '#ef4444', IT_CYBER: '#10b981',
};
const LEVEL_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f59e0b', MEDIUM: '#4ab0de', LOW: '#10b981',
};
const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: 'New', IN_REVIEW: 'In Review', VALIDATED: 'Validated',
  ACCEPTED: 'Accepted', REJECTED: 'Rejected', MITIGATED: 'Mitigated',
};

function getHeatColor(l: number, i: number): string {
  const score = l * i;
  if (score >= 20) return '#ef4444';
  if (score >= 12) return '#f59e0b';
  if (score >= 6) return '#4ab0de';
  return '#10b981';
}

function getHeatBg(l: number, i: number): string {
  const score = l * i;
  if (score >= 20) return 'rgba(239,68,68,0.25)';
  if (score >= 12) return 'rgba(245,158,11,0.25)';
  if (score >= 6) return 'rgba(74,176,222,0.2)';
  return 'rgba(16,185,129,0.15)';
}

export default function RiskManagerDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [pending, setPending] = useState<PendingRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [dashRes, userRes, risksRes] = await Promise.all([
          fetch('/api/risk-manager/dashboard'),
          fetch('/api/users?email=ahmed.rashid@bloomholding.com'),
          fetch('/api/risks?status=SUBMITTED'),
        ]);
        const dashData = await dashRes.json();
        const userData = await userRes.json();
        const pendingData = await risksRes.json();
        setData(dashData);
        setUser(userData);
        setPending(Array.isArray(pendingData) ? pendingData : []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>
        <Sidebar role="risk-manager" />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading dashboard...</div>
        </main>
      </div>
    );
  }

  const { stats, heatMap, controlAdequacy, byDepartment, byCategory, recentHighPriority, byObjective } = data;

  // Compute chart maximums
  const deptEntries = Object.entries(byDepartment);
  const maxDeptScore = Math.max(...deptEntries.map(([, d]) => Math.max(d.inherent, d.gross, d.residual)), 1);
  const catEntries = Object.entries(byCategory);
  const maxCatCount = Math.max(...catEntries.map(([, c]) => c), 1);
  const objEntries = Object.entries(byObjective).sort((a, b) => b[1].avgScore - a[1].avgScore);

  // Control adequacy percentages
  const ctrlTotal = controlAdequacy.total || 1;
  const ctrlPcts = {
    effective: Math.round((controlAdequacy.effective / ctrlTotal) * 100),
    partial: Math.round((controlAdequacy.partiallyEffective / ctrlTotal) * 100),
    ineffective: Math.round((controlAdequacy.ineffective / ctrlTotal) * 100),
    notAssessed: Math.round((controlAdequacy.notAssessed / ctrlTotal) * 100),
  };

  const statCards: { label: string; value: number; Icon: LucideIcon; color: string; bg: string; badge?: string }[] = [
    { label: 'Total Risks', value: stats.totalRisks, Icon: BarChart3, color: '#4ab0de', bg: 'rgba(74,176,222,0.1)' },
    { label: 'High Residual', value: stats.highResidual, Icon: ShieldAlert, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Inadequate Controls', value: stats.inadequateControls, Icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Pending Review', value: stats.pendingReview, Icon: Clock, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Mitigated', value: stats.mitigated, Icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflow: 'hidden' }}>
      <Sidebar role="risk-manager" />

      <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Connected User Bar */}
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          Connected as <strong style={{ color: 'var(--text-primary)' }}>{user?.name || 'Risk Manager'}</strong> (Risk Manager) &middot; Enterprise Risk Management
        </div>

        {/* Header */}
        <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Risk Intelligence Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
              Enterprise risk overview &middot; Last updated: Today, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ fontSize: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => {
                if (data) {
                  import('@/lib/export-pdf').then(({ exportDashboardPDF }) => exportDashboardPDF(data));
                }
              }}>
              <BarChart3 size={14} /> Export Report
            </button>
            <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => router.push('/risk-manager/assistant')}>
              <Zap size={14} /> AI Risk Assistant
            </button>
          </div>
        </div>

        {/* Pending Review Banner */}
        {pending.length > 0 && (
          <div className="animate-fade-up-1" style={{
            padding: '16px 20px', borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(74,176,222,0.1))',
            border: '1px solid rgba(139,92,246,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{pending.length} New Risks Pending Your Review</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Business owners have submitted risks that need validation and control assignment</div>
              </div>
            </div>
            <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => router.push('/risk-manager/review')}>
              Review Now <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <div className="animate-fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {statCards.map((s) => {
            const Icon = s.Icon;
            return (
              <div key={s.label} className="risk-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Heat Map + Control Adequacy */}
        <div className="animate-fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Heat Map */}
          <div className="risk-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Risk Heat Map (Residual Risk)</h2>
              <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }}>View Details</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', alignSelf: 'center', letterSpacing: '0.5px', textTransform: 'uppercase', paddingBottom: '18px' }}>
                Likelihood
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '24px repeat(5, 1fr)', marginBottom: '3px' }}>
                  <div />
                  {['Minor', 'Moderate', 'Significant', 'Major', 'Severe'].map((label) => (
                    <div key={label} style={{ textAlign: 'center', fontSize: '9px', color: 'var(--text-muted)' }}>{label}</div>
                  ))}
                </div>
                {[5, 4, 3, 2, 1].map((l) => (
                  <div key={l} style={{ display: 'grid', gridTemplateColumns: '24px repeat(5, 1fr)', gap: '3px', marginBottom: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {l}
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => {
                      const count = heatMap[l - 1]?.[i - 1] || 0;
                      const key = `${l}-${i}`;
                      const isSelected = selectedCell === key;
                      return (
                        <div key={key}
                          onClick={() => setSelectedCell(isSelected ? null : key)}
                          style={{
                            height: '44px', borderRadius: '6px',
                            background: count > 0 ? getHeatBg(l, i) : 'rgba(42,42,90,0.3)',
                            border: isSelected ? '2px solid var(--accent-cyan)' : count > 0 ? `1px solid ${getHeatColor(l, i)}40` : '1px solid var(--border-color)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: count > 0 ? 'pointer' : 'default',
                            fontWeight: 700, fontSize: '14px',
                            color: count > 0 ? getHeatColor(l, i) : 'var(--text-muted)',
                            transition: 'transform 0.15s',
                            transform: isSelected ? 'scale(1.06)' : undefined,
                          }}
                        >
                          {count > 0 ? count : ''}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '24px repeat(5, 1fr)', marginTop: '2px' }}>
                  <div />
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{i}</div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Impact</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '14px', flexWrap: 'wrap' }}>
              {[
                { label: 'Low (1-4)', color: '#10b981' },
                { label: 'Medium (5-8)', color: '#4ab0de' },
                { label: 'High (10-16)', color: '#f59e0b' },
                { label: 'Critical (20-25)', color: '#ef4444' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color + '40', border: `1px solid ${item.color}` }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Control Adequacy Rating */}
          <div className="risk-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Control Adequacy Rating</h2>
              <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }}>Details</button>
            </div>

            {/* Donut-like visualization */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  {(() => {
                    const segments = [
                      { pct: ctrlPcts.effective, color: '#10b981' },
                      { pct: ctrlPcts.partial, color: '#f59e0b' },
                      { pct: ctrlPcts.ineffective, color: '#ef4444' },
                      { pct: ctrlPcts.notAssessed, color: '#6a6a8a' },
                    ];
                    let offset = 0;
                    return segments.map((seg, idx) => {
                      const circumference = 2 * Math.PI * 40;
                      const dashLen = (seg.pct / 100) * circumference;
                      const el = (
                        <circle key={idx} cx="50" cy="50" r="40" fill="none" stroke={seg.color}
                          strokeWidth="12" strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                          strokeDashoffset={-offset} strokeLinecap="round" style={{ opacity: 0.85 }} />
                      );
                      offset += dashLen;
                      return el;
                    });
                  })()}
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>{controlAdequacy.total}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Controls</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {[
                  { label: 'Effective', pct: ctrlPcts.effective, color: '#10b981' },
                  { label: 'Partially Effective', pct: ctrlPcts.partial, color: '#f59e0b' },
                  { label: 'Ineffective', pct: ctrlPcts.ineffective, color: '#ef4444' },
                  { label: 'Not Assessed', pct: ctrlPcts.notAssessed, color: '#6a6a8a' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: 1 }}>{item.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Department + Category Charts */}
        <div className="animate-fade-up-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Inherent vs Gross vs Residual by Department */}
          <div className="risk-card" style={{ padding: '22px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px' }}>Inherent vs Gross vs Residual Risk by Department</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {deptEntries.map(([dept, vals]) => (
                <div key={dept}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>{dept}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {[
                      { label: 'Inherent', value: vals.inherent, color: '#ef4444' },
                      { label: 'Gross', value: vals.gross, color: '#f59e0b' },
                      { label: 'Residual', value: vals.residual, color: '#4ab0de' },
                    ].map((bar) => (
                      <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '50px', fontSize: '10px', color: 'var(--text-muted)', textAlign: 'right' }}>{bar.label}</div>
                        <div style={{ flex: 1, height: '14px', borderRadius: '3px', background: 'var(--bg-primary)', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: '3px', background: bar.color,
                            width: `${(bar.value / maxDeptScore) * 100}%`, transition: 'width 0.8s ease',
                            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4px',
                          }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff' }}>{bar.value}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '14px', marginTop: '14px' }}>
              {[
                { label: 'Inherent Risk', color: '#ef4444' },
                { label: 'Gross Risk', color: '#f59e0b' },
                { label: 'Residual Risk', color: '#4ab0de' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Residual Risk by Category */}
          <div className="risk-card" style={{ padding: '22px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px' }}>Residual Risk by Category</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', paddingBottom: '24px' }}>
              {catEntries.map(([cat, count]) => {
                const color = CATEGORY_COLORS[cat] || '#4ab0de';
                const heightPct = (count / maxCatCount) * 100;
                return (
                  <div key={cat} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color }}>{count}</span>
                    <div style={{
                      width: '100%', maxWidth: '56px', borderRadius: '6px 6px 0 0',
                      background: `linear-gradient(to top, ${color}, ${color}aa)`,
                      height: `${Math.max(heightPct, 8)}%`,
                      transition: 'height 0.8s ease',
                    }} />
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
                      {CATEGORY_LABELS[cat] || cat}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Strategic Objectives + Smart Insights */}
        <div className="animate-fade-up-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Risk Exposure by Strategic Objective */}
          <div className="risk-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Risk Exposure by Strategic Objective</h2>
              <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {objEntries.slice(0, 5).map(([obj, vals]) => (
                <div key={obj} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={16} style={{ color: '#8b5cf6' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{obj}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{vals.count} risks &middot; {vals.highSeverity} high severity</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: vals.avgScore >= 15 ? '#ef4444' : vals.avgScore >= 8 ? '#f59e0b' : '#10b981' }}>{vals.avgScore}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Avg Score</div>
                  </div>
                </div>
              ))}
              {objEntries.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>No strategic objectives assigned yet</div>
              )}
            </div>
          </div>

          {/* Smart Insights */}
          <div className="risk-card" style={{ padding: '22px', background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(74,176,222,0.08))' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} style={{ color: '#f59e0b' }} /> Smart Insights
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.highResidual > 0 && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', marginTop: '5px', flexShrink: 0 }} />
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Critical:</strong> {stats.highResidual} risks have high/critical residual exposure. Review control effectiveness.
                  </div>
                </div>
              )}
              {stats.pendingReview > 0 && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', marginTop: '5px', flexShrink: 0 }} />
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Pending:</strong> {stats.pendingReview} risks awaiting validation. Business owners are waiting for your review.
                  </div>
                </div>
              )}
              {stats.inadequateControls > 0 && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', marginTop: '5px', flexShrink: 0 }} />
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Gap:</strong> {stats.inadequateControls} controls rated as inadequate or needs improvement. Consider strengthening.
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Lightbulb size={12} style={{ color: '#f59e0b', marginTop: '3px', flexShrink: 0 }} />
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Recommendation:</strong> Focus on the {Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ? CATEGORY_LABELS[Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0][0]] : 'top'} category which has the highest risk concentration.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent High-Priority Risks Table */}
        <div className="animate-fade-up-4">
          <div className="risk-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Recent High-Priority Risks</h2>
              <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => router.push('/risk-manager/registry')}>
                View All Risks <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="risk-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Risk ID</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Risk Name</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Inherent</th>
                    <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Residual</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Control</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentHighPriority.map((risk) => (
                    <tr key={risk.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{risk.riskId}</span>
                      </td>
                      <td style={{ padding: '10px 12px', maxWidth: '200px' }}>
                        <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{risk.title}</div>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                          background: (CATEGORY_COLORS[risk.category] || '#4ab0de') + '22',
                          color: CATEGORY_COLORS[risk.category] || '#4ab0de',
                        }}>
                          {CATEGORY_LABELS[risk.category] || risk.category}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{
                          fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                          background: (LEVEL_COLORS[risk.riskLevel] || '#4ab0de') + '22',
                          color: LEVEL_COLORS[risk.riskLevel] || '#4ab0de',
                        }}>
                          {risk.inherentScore}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{
                          fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                          background: 'rgba(74,176,222,0.15)', color: '#4ab0de',
                        }}>
                          {risk.residualScore}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                          background: risk.controlAdequacy === 'Effective' ? 'rgba(16,185,129,0.15)' : risk.controlAdequacy === 'Partial' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                          color: risk.controlAdequacy === 'Effective' ? '#10b981' : risk.controlAdequacy === 'Partial' ? '#f59e0b' : '#ef4444',
                        }}>
                          {risk.controlAdequacy}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                          background: risk.status === 'SUBMITTED' ? 'rgba(139,92,246,0.15)' : 'rgba(16,185,129,0.15)',
                          color: risk.status === 'SUBMITTED' ? '#8b5cf6' : '#10b981',
                        }}>
                          {STATUS_LABELS[risk.status] || risk.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <button className="btn-primary" style={{ fontSize: '10px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => router.push(`/risk-manager/review/${risk.riskId}`)}>
                          <Eye size={10} /> Review
                        </button>
                      </td>
                    </tr>
                  ))}
                  {recentHighPriority.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No high-priority risks found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
