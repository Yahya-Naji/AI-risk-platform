'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Shield, BarChart3,
  Zap, Eye, Lock, ArrowRight, Play,
  MessageSquare, GitBranch, CheckCircle2,
  AlertTriangle, Sparkles, Activity
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Hero Images ─── */

const heroImages = [
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1920&q=80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80',
]

const stats = [
  { value: '94%', label: 'Faster Risk ID' },
  { value: '3-Line', label: 'Defence Model' },
  { value: 'Real-Time', label: 'AI Insights' },
  { value: '5-Level', label: 'Org Hierarchy' },
]

/* ─── Feature Sections ─── */

const featureSections = [
  {
    tag: 'AI Copilot',
    tagColor: '#4ab0de',
    title: 'Describe a risk in plain language.',
    titleAccent: 'AI structures it instantly.',
    description: 'Your AI copilot turns natural language concerns into formal, structured risk entries — complete with controls, tasks, and source attributions from SEC, ISO 27001, and Risk Library.',
    bullets: [
      'Natural language risk identification',
      'Auto-generated controls & task assignments',
      'Source attribution (SEC, ISO, Risk Library)',
    ],
    href: '/business-owner/report-risk',
    mockup: 'copilot',
    bg: 'from-[rgba(74,176,222,0.04)] to-transparent',
  },
  {
    tag: 'Risk Framework',
    tagColor: '#8b5cf6',
    title: 'Full risk hierarchy.',
    titleAccent: 'Complete traceability.',
    description: 'Every risk is structured with directive, preventive, detective, and corrective controls. Each control breaks into tasks with assigned owners, deadlines, and evidence requirements.',
    bullets: [
      'Risk → Controls → Tasks → Evidence',
      'Directive, preventive, detective, corrective',
      'Progress tracking at every level',
    ],
    href: '/risk-manager/dashboard',
    mockup: 'hierarchy',
    bg: 'from-[rgba(139,92,246,0.04)] to-transparent',
  },
  {
    tag: 'Governance',
    tagColor: '#10b981',
    title: 'Three lines of defence.',
    titleAccent: 'One seamless workflow.',
    description: 'Built on the Three Lines model. Business Owners identify risks, Risk Managers validate and assign control owners, Audit enforces remediation and validates completion.',
    bullets: [
      'Business Owner → Risk Manager → Audit',
      'Role-based views and permissions',
      'Full audit trail on every action',
    ],
    href: '/risk-manager/review',
    mockup: 'workflow',
    bg: 'from-[rgba(16,185,129,0.04)] to-transparent',
  },
  {
    tag: 'Analytics',
    tagColor: '#f59e0b',
    title: 'See risk exposure.',
    titleAccent: 'Before it becomes a crisis.',
    description: 'Interactive heat maps, org-level filters, and trend charts give Risk Managers instant visibility. Filter across 5 levels: Group → Company → Sub-Company → Department → Team.',
    bullets: [
      'Interactive risk heat maps',
      '5-level organisation filter',
      'Real-time trend analysis',
    ],
    href: '/risk-manager/dashboard',
    mockup: 'heatmap',
    bg: 'from-[rgba(245,158,11,0.04)] to-transparent',
  },
]

/* ─── Mockup Components ─── */

function CopilotMockup() {
  return (
    <div className="glass-card p-6 md:p-8 w-full max-w-[500px] animate-float">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4ab0de] to-[#8b5cf6] flex items-center justify-center">
          <Sparkles size={18} color="#fff" />
        </div>
        <div>
          <span className="text-sm font-semibold text-white block">AI Risk Copilot</span>
          <span className="text-[11px] text-[#6a6a8a]">Natural Language Processing</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#10b981] pulse-dot" />
          <span className="text-[11px] text-[#10b981] font-medium">Live</span>
        </div>
      </div>
      <div className="space-y-3 mb-5">
        <div className="flex justify-end">
          <div className="bg-[#2a2a5a] rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[340px]">
            <p className="text-[13px] text-[#e0e0f0] leading-relaxed">&quot;We have concerns about unauthorised access to financial data&quot;</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-gradient-to-br from-[rgba(74,176,222,0.12)] to-[rgba(139,92,246,0.12)] border border-[rgba(74,176,222,0.2)] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[380px]">
            <p className="text-[13px] text-[#4ab0de] font-semibold mb-1.5">Risk Generated</p>
            <p className="text-[12px] text-[#a0a0c0] leading-relaxed mb-2.5">Unauthorised access to financial data — High risk with 3 proposed controls.</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[rgba(74,176,222,0.15)] text-[#4ab0de] font-medium">3 Controls</span>
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[rgba(139,92,246,0.15)] text-[#8b5cf6] font-medium">7 Tasks</span>
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[rgba(16,185,129,0.15)] text-[#10b981] font-medium">SEC, ISO</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[rgba(10,10,26,0.5)] border border-[#2a2a5a]">
        <span className="text-[13px] text-[#6a6a8a]">Describe your concern...</span>
        <ArrowRight size={14} className="ml-auto text-[#4ab0de]" />
      </div>
    </div>
  )
}

function HierarchyMockup() {
  return (
    <div className="glass-card p-6 md:p-8 w-full max-w-[500px] animate-float-slow">
      <div className="flex items-center gap-3 mb-5">
        <AlertTriangle size={18} className="text-[#f59e0b]" />
        <div>
          <span className="text-sm font-semibold text-white block">Unauthorised Data Access</span>
          <span className="text-[11px] text-[#6a6a8a]">RSK-2024-047</span>
        </div>
        <span className="ml-auto text-[11px] px-2.5 py-1 rounded-full bg-[rgba(239,68,68,0.15)] text-[#ef4444] font-semibold">High</span>
      </div>
      <div className="space-y-2.5 pl-2">
        {[
          { label: 'Role-Based Access Control', type: 'Preventive', progress: 90, color: '#4ab0de' },
          { label: 'Multi-Factor Authentication', type: 'Preventive', progress: 60, color: '#8b5cf6' },
          { label: 'Network Segmentation', type: 'Detective', progress: 30, color: '#10b981' },
          { label: 'Incident Response Plan', type: 'Corrective', progress: 0, color: '#f59e0b' },
        ].map((c, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="flex flex-col items-center mt-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
              {i < 3 && <div className="w-px h-7" style={{ background: `${c.color}40` }} />}
            </div>
            <div className="flex-1 bg-[rgba(10,10,26,0.4)] rounded-xl px-4 py-2.5 border border-[#2a2a5a]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-[#e0e0f0]">{c.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-lg" style={{ background: `${c.color}20`, color: c.color }}>{c.type}</span>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex-1 h-1.5 rounded-full bg-[#2a2a5a] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${c.progress}%`, background: c.color }} />
                </div>
                <span className="text-[11px] font-semibold" style={{ color: c.color }}>{c.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WorkflowMockup() {
  return (
    <div className="glass-card p-6 md:p-8 w-full max-w-[500px] animate-float">
      <div className="flex items-center gap-3 mb-5">
        <Activity size={18} className="text-[#4ab0de]" />
        <div>
          <span className="text-sm font-semibold text-white block">3-Line Defence Workflow</span>
          <span className="text-[11px] text-[#6a6a8a]">Active risk lifecycle</span>
        </div>
      </div>
      <div className="space-y-3.5">
        {[
          { role: 'Business Owner', status: 'Risk Submitted', statusColor: '#10b981', icon: MessageSquare, done: true, detail: 'AI-generated risk entry with 3 controls' },
          { role: 'Risk Manager', status: 'Validating Controls', statusColor: '#8b5cf6', icon: Eye, done: false, detail: 'Reviewing AI suggestions, assigning owners' },
          { role: 'Audit / 3rd Line', status: 'Pending Evidence', statusColor: '#6a6a8a', icon: CheckCircle2, done: false, detail: 'Awaiting remediation evidence' },
        ].map((w, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${w.done ? 'border-[#10b981] bg-[rgba(16,185,129,0.15)]' : 'border-[#2a2a5a] bg-[rgba(10,10,26,0.4)]'}`}>
                <w.icon size={16} color={w.done ? '#10b981' : '#6a6a8a'} />
              </div>
              {i < 2 && <div className="w-px h-4 mt-1" style={{ background: w.done ? '#10b981' : '#2a2a5a' }} />}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[13px] font-semibold text-white">{w.role}</span>
                {w.done && <CheckCircle2 size={14} className="text-[#10b981]" />}
              </div>
              <span className="text-[12px] font-medium block mb-0.5" style={{ color: w.statusColor }}>{w.status}</span>
              <span className="text-[11px] text-[#6a6a8a]">{w.detail}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-[#2a2a5a]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-[#a0a0c0]">Overall Progress</span>
          <span className="text-[12px] font-bold text-[#4ab0de]">33%</span>
        </div>
        <div className="h-2 rounded-full bg-[#2a2a5a] overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#4ab0de] to-[#8b5cf6]" style={{ width: '33%' }} />
        </div>
      </div>
    </div>
  )
}

function HeatmapMockup() {
  const cells = [
    [0.1, 0.2, 0.4, 0.6, 0.9],
    [0.1, 0.3, 0.5, 0.7, 0.5],
    [0.2, 0.4, 0.8, 0.6, 0.3],
    [0.3, 0.6, 0.5, 0.3, 0.2],
    [0.5, 0.7, 0.4, 0.2, 0.1],
  ]
  const getColor = (v: number) => {
    if (v >= 0.8) return '#ef4444'
    if (v >= 0.6) return '#f59e0b'
    if (v >= 0.4) return '#4ab0de'
    if (v >= 0.2) return '#10b981'
    return '#2a2a5a'
  }
  return (
    <div className="glass-card p-6 md:p-8 w-full max-w-[500px] animate-float-slow">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <BarChart3 size={18} className="text-[#8b5cf6]" />
          <div>
            <span className="text-sm font-semibold text-white block">Risk Heat Map</span>
            <span className="text-[11px] text-[#6a6a8a]">Organisation-wide</span>
          </div>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[rgba(139,92,246,0.15)] text-[#8b5cf6] font-medium">Live</span>
      </div>
      <div className="flex items-end gap-1.5 mb-1.5 pl-12">
        {['Rare', 'Unlikely', 'Possible', 'Likely', 'Certain'].map((l) => (
          <span key={l} className="flex-1 text-center text-[9px] text-[#6a6a8a] font-medium">{l}</span>
        ))}
      </div>
      <div className="space-y-1.5">
        {cells.map((row, ri) => (
          <div key={ri} className="flex items-center gap-1.5">
            <span className="w-10 text-[9px] text-[#6a6a8a] text-right pr-1.5 font-medium">
              {['Insig.', 'Minor', 'Mod.', 'Major', 'Catas.'][ri]}
            </span>
            {row.map((v, ci) => (
              <div
                key={ci}
                className="flex-1 aspect-square rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                style={{
                  background: `${getColor(v)}${v >= 0.6 ? '40' : '20'}`,
                  border: `1px solid ${getColor(v)}30`,
                }}
              >
                <span className="text-[12px] font-bold" style={{ color: getColor(v) }}>
                  {Math.round(v * 10)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-[#2a2a5a]">
        {[
          { label: 'Low', color: '#10b981' },
          { label: 'Medium', color: '#4ab0de' },
          { label: 'High', color: '#f59e0b' },
          { label: 'Critical', color: '#ef4444' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded" style={{ background: l.color }} />
            <span className="text-[11px] text-[#a0a0c0]">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const featureMockups: Record<string, React.FC> = {
  copilot: CopilotMockup,
  hierarchy: HierarchyMockup,
  workflow: WorkflowMockup,
  heatmap: HeatmapMockup,
}

/* ─── How It Works Steps ─── */

const steps = [
  { num: '01', title: 'Business Owner', subtitle: 'Identifies Risk', desc: 'Uses AI copilot to describe a concern. The platform structures it into a formal risk entry with proposed controls and tasks.', color: '#4ab0de', href: '/business-owner/dashboard', icon: MessageSquare },
  { num: '02', title: 'Risk Manager', subtitle: 'Validates & Assigns', desc: 'Reviews AI-generated risks, validates details, accepts or modifies controls, assigns owners, and creates remediation tasks.', color: '#8b5cf6', href: '/risk-manager/dashboard', icon: GitBranch },
  { num: '03', title: 'Audit / 3rd Line', subtitle: 'Enforces & Closes', desc: 'Reviews evidence, approves remediation, enforces follow-ups, and formally closes the risk loop.', color: '#10b981', href: '/risk-manager/review', icon: CheckCircle2 },
]

/* ─── Main Page ─── */

export default function LandingPage() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Nav — transparent over hero ── */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              RiskAI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/business-owner/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all no-underline">
              Business Owner
            </Link>
            <Link href="/risk-manager/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all no-underline">
              Risk Manager
            </Link>
            <Link href="/admin/users" className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-white/15 backdrop-blur-md hover:bg-white/25 border border-white/20 transition-all no-underline">
              Admin Panel
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ══════════════════════════════════════════════
            HERO — Full Screen with Image Slider
        ══════════════════════════════════════════════ */}
        <section className="relative h-screen min-h-[750px] overflow-hidden">
          {/* Rotating background images */}
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={heroImages[current]}
              alt="Platform background"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a1a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(74,176,222,0.1)] to-[rgba(139,92,246,0.08)]" />

          {/* Hero content — centered */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              {/* Tag */}
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-md">
                <Zap className="h-4 w-4" />
                AI-Powered Risk Management
              </div>

              {/* Title */}
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight text-white">
                Manage risk with
                <br />
                <span className="gradient-text-hero">intelligence.</span>
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-7 max-w-2xl text-lg md:text-xl leading-relaxed text-white/60">
                From AI-powered risk identification to automated control assignment
                and evidence tracking — one platform for your entire risk lifecycle.
              </p>

              {/* CTAs */}
              <div className="mt-12 flex items-center justify-center gap-4">
                <Link href="/business-owner/dashboard" className="btn-primary no-underline text-base md:text-lg px-8 py-4 shadow-lg shadow-[rgba(74,176,222,0.25)]">
                  <Play size={18} /> Enter Platform <ArrowRight size={18} />
                </Link>
                <Link href="/risk-manager/dashboard" className="px-8 py-4 rounded-lg text-base md:text-lg font-medium text-white bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all no-underline inline-flex items-center gap-2">
                  Risk Manager View
                </Link>
              </div>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-16 grid w-full max-w-3xl grid-cols-4 divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/10 p-6 md:p-8 backdrop-blur-lg"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-white font-display">{s.value}</div>
                  <div className="mt-1 text-xs md:text-sm text-white/50">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Slider dots */}
            <div className="mt-8 flex gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 border-none cursor-pointer ${
                    i === current ? 'w-10 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FEATURE SECTIONS — Continuous Flowing Scroll
        ══════════════════════════════════════════════ */}
        {featureSections.map((section, i) => {
          const Mockup = featureMockups[section.mockup]
          const isReversed = i % 2 === 1

          return (
            <section
              key={i}
              className={`relative py-24 md:py-32 px-6 md:px-12 overflow-hidden bg-gradient-to-b ${section.bg}`}
              style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-color)' }}
            >
              {/* Subtle side glow */}
              <div
                className="absolute top-0 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
                style={{
                  background: section.tagColor,
                  [isReversed ? 'left' : 'right']: '-200px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />

              <div className={`relative z-10 w-full max-w-[1300px] mx-auto flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>

                {/* Text */}
                <motion.div
                  className="flex-1 max-w-xl"
                  initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: `${section.tagColor}15`, border: `1px solid ${section.tagColor}30` }}>
                    <span className="text-sm font-semibold tracking-wide uppercase" style={{ color: section.tagColor }}>{section.tag}</span>
                  </div>

                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-5">
                    <span className="text-white">{section.title}</span>
                    <br />
                    <span className="gradient-text">{section.titleAccent}</span>
                  </h2>

                  <p className="text-base md:text-lg text-[#a0a0c0] leading-relaxed mb-8">
                    {section.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${section.tagColor}20` }}>
                          <CheckCircle2 size={12} color={section.tagColor} />
                        </div>
                        <span className="text-sm md:text-base text-[#a0a0c0]">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={section.href} className="btn-primary no-underline text-sm md:text-base px-6 py-3 inline-flex">
                    Explore {section.tag} <ArrowRight size={16} />
                  </Link>
                </motion.div>

                {/* Mockup */}
                <motion.div
                  className="flex-1 flex items-center justify-center"
                  initial={{ opacity: 0, x: isReversed ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <Mockup />
                </motion.div>
              </div>
            </section>
          )
        })}

        {/* ══════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════ */}
        <section className="relative py-28 md:py-36 px-6 md:px-12" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="w-full max-w-[1200px] mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
                <span className="gradient-text">How It Works</span>
              </h2>
              <p className="text-lg text-[#6a6a8a]">Three lines of defence, fully digitised</p>
            </motion.div>

            <div className="relative">
              {/* Connecting line */}
              <div className="hidden lg:block absolute top-[44px] left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px" style={{ background: 'linear-gradient(90deg, #4ab0de, #8b5cf6, #10b981)' }} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                  >
                    <Link href={step.href} className="no-underline group block text-center">
                      <div className="relative mx-auto mb-6 w-[64px] h-[64px]">
                        <div className="absolute inset-0 rounded-full animate-border-glow" style={{ border: `2px solid ${step.color}30`, background: `${step.color}08` }} />
                        <div className="absolute inset-0 rounded-full flex items-center justify-center">
                          <step.icon size={24} color={step.color} />
                        </div>
                      </div>
                      <span className="text-xs font-bold tracking-widest" style={{ color: step.color }}>{step.num}</span>
                      <h3 className="text-xl font-bold text-white mt-3 mb-2 font-display group-hover:text-[#4ab0de] transition-colors">{step.title}</h3>
                      <p className="text-sm font-semibold mb-4" style={{ color: step.color }}>{step.subtitle}</p>
                      <p className="text-sm text-[#6a6a8a] leading-relaxed max-w-[300px] mx-auto">{step.desc}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            CTA
        ══════════════════════════════════════════════ */}
        <section className="relative py-28 md:py-36 px-6 md:px-12 dot-grid" style={{ borderTop: '1px solid var(--border-color)' }}>
          <motion.div
            className="w-full max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Ready to <span className="gradient-text">manage risk</span>
              <br />smarter?
            </h2>
            <p className="text-lg text-[#6a6a8a] mb-14 max-w-lg mx-auto">
              Explore the full interactive demo — no sign-up required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/business-owner/dashboard" className="btn-primary no-underline text-base px-8 py-4">
                <Eye size={18} /> Business Owner View
              </Link>
              <Link href="/risk-manager/dashboard" className="btn-secondary no-underline text-base px-6 py-4">
                <BarChart3 size={18} /> Risk Manager View
              </Link>
              <Link href="/admin/users" className="btn-secondary no-underline text-base px-6 py-4">
                <Lock size={18} /> Admin Panel
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="px-6 md:px-12 py-6 flex items-center justify-between text-sm text-[#6a6a8a]" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-3">
          <Shield size={16} color="#4ab0de" />
          <span className="gradient-text font-bold text-base">RiskAI Platform</span>
          <span>— Interactive Demo</span>
        </div>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
