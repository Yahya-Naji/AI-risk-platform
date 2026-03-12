'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Shield, Brain, BarChart3, Users, ChevronRight, ChevronLeft,
  TrendingUp, Zap, Eye, Lock, ArrowRight, Play
} from 'lucide-react'

const slides = [
  {
    title: 'AI-Powered Risk Intelligence',
    subtitle: 'Identify, Assess & Mitigate Risks',
    description: 'Let AI do the heavy lifting. Describe a concern in plain language — our copilot generates structured risk entries, proposes controls, and assigns tasks automatically.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
    tag: 'AI Copilot',
  },
  {
    title: 'Complete Risk Hierarchy',
    subtitle: 'Risk → Controls → Tasks → Evidence',
    description: 'Structure every risk with directive, preventive, detective, and corrective controls. Assign tasks to control owners and track evidence submissions end-to-end.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80',
    tag: 'Risk Framework',
  },
  {
    title: '3-Line Defence Workflow',
    subtitle: 'Business Owner → Risk Manager → Audit',
    description: 'Built on the Three Lines model. Business Owners report risks, Risk Managers validate and assign, Audit enforces remediation — all in one seamless platform.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80',
    tag: 'Governance',
  },
  {
    title: 'Real-Time Risk Heat Maps',
    subtitle: 'Visualise Exposure Across Your Organisation',
    description: 'Interactive heat maps, org-level filters, and trend charts give Risk Managers instant visibility across 5 levels: Group → Company → Sub-Company → Department.',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1920&q=80',
    tag: 'Analytics',
  },
]

const features = [
  { icon: Brain, title: 'AI Risk Copilot', desc: 'Natural language risk entry. AI generates structured risks with controls and source attributions (SEC, ISO, Risk Library).', href: '/business-owner/report-risk', a: '#06b6d4', b: '#3b82f6' },
  { icon: BarChart3, title: 'Risk Manager Dashboard', desc: 'Heat maps, pending validations, org filters, and AI-proposed control assignments.', href: '/risk-manager/dashboard', a: '#8b5cf6', b: '#a855f7' },
  { icon: Shield, title: 'Evidence & Review', desc: 'Business owners upload evidence. Managers approve, reject, or request changes. Full audit trail.', href: '/risk-manager/review', a: '#10b981', b: '#14b8a6' },
  { icon: Users, title: 'Admin & User Management', desc: 'Manage users, roles, and permissions across your entire organisation hierarchy.', href: '/admin/users', a: '#f97316', b: '#f59e0b' },
]

const stats = [
  { value: '94%', label: 'Faster Risk Identification', icon: Zap },
  { value: '3-Line', label: 'Defence Model Built-In', icon: Shield },
  { value: 'Real-Time', label: 'AI-Powered Insights', icon: Brain },
  { value: '5-Level', label: 'Org Filter Hierarchy', icon: TrendingUp },
]

const steps = [
  { num: '01', title: 'Business Owner', subtitle: 'Identifies Risk', desc: 'Uses AI copilot to describe a concern. AI structures it into a formal risk entry with controls.', color: '#4ab0de', href: '/business-owner/dashboard' },
  { num: '02', title: 'Risk Manager', subtitle: 'Validates & Assigns', desc: 'Reviews AI-generated risk, validates details, assigns control owners, creates tasks.', color: '#8b5cf6', href: '/risk-manager/dashboard' },
  { num: '03', title: 'Audit / 3rd Line', subtitle: 'Enforces & Closes', desc: 'Reviews evidence, approves completion, enforces remediation, and closes the risk loop.', color: '#10b981', href: '/risk-manager/review' },
]

export default function LandingPage() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = (idx: number) => {
    if (fading) return
    setFading(true)
    setTimeout(() => { setCurrent(idx); setFading(false) }, 400)
  }

  const next = () => goTo((current + 1) % slides.length)
  const prev = () => goTo((current - 1 + slides.length) % slides.length)

  useEffect(() => {
    timerRef.current = setInterval(next, 6000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  const slide = slides[current]

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(10,10,26,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#4ab0de,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700 }} className="gradient-text">RiskAI</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 2 }}>Platform</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/business-owner/dashboard" style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>Business Owner</Link>
          <Link href="/risk-manager/dashboard" style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>Risk Manager</Link>
          <Link href="/admin/users" style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg,#4ab0de,#8b5cf6)' }}>Admin</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transition: 'opacity 0.6s ease', opacity: fading ? 0 : 1,
          transform: 'scale(1.03)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,26,0.75) 0%, rgba(10,10,26,0.55) 40%, rgba(10,10,26,0.80) 100%)' }} />

        <div style={{
          position: 'relative', zIndex: 10, height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 40px', paddingTop: 64,
        }}>
          <div style={{ maxWidth: 780 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
              borderRadius: 20, marginBottom: 24, background: 'rgba(74,176,222,0.15)',
              border: '1px solid rgba(74,176,222,0.3)', fontSize: 12, fontWeight: 600,
              color: '#4ab0de', opacity: fading ? 0 : 1, transition: 'opacity 0.4s',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ab0de' }} className="pulse-dot" />
              {slide.tag}
            </div>
            <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, opacity: fading ? 0 : 1, transition: 'opacity 0.4s 0.1s' }} className="gradient-text-hero">
              {slide.title}
            </h1>
            <h2 style={{ fontSize: 22, fontWeight: 400, color: 'var(--text-secondary)', marginBottom: 20, opacity: fading ? 0 : 1, transition: 'opacity 0.4s 0.15s' }}>
              {slide.subtitle}
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40, maxWidth: 620, margin: '0 auto 40px', opacity: fading ? 0 : 1, transition: 'opacity 0.4s 0.2s' }}>
              {slide.description}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', opacity: fading ? 0 : 1, transition: 'opacity 0.4s 0.25s' }}>
              <Link href="/business-owner/dashboard" className="btn-primary" style={{ textDecoration: 'none', fontSize: 15, padding: '12px 28px' }}>
                <Play size={16} /> Enter Platform <ArrowRight size={16} />
              </Link>
              <Link href="/risk-manager/dashboard" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 15, padding: '12px 28px' }}>
                Risk Manager View
              </Link>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === current ? 32 : 8, height: 8, borderRadius: 4,
              border: 'none', cursor: 'pointer',
              background: i === current ? 'linear-gradient(135deg,#4ab0de,#8b5cf6)' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>

        {/* Arrows */}
        {[{ fn: prev, icon: ChevronLeft, side: 'left' }, { fn: next, icon: ChevronRight, side: 'right' }].map(({ fn, icon: Icon, side }) => (
          <button key={side} onClick={fn} style={{
            position: 'absolute', [side]: 24, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(26,26,58,0.7)', border: '1px solid var(--border-color)',
            width: 44, height: 44, borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', zIndex: 10,
          }}>
            <Icon size={18} />
          </button>
        ))}
      </section>

      {/* STATS */}
      <section style={{
        background: 'linear-gradient(135deg,rgba(74,176,222,0.06),rgba(139,92,246,0.06))',
        borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)',
        padding: '28px 80px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '0 32px',
            borderRight: i < 3 ? '1px solid var(--border-color)' : 'none',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,rgba(74,176,222,0.15),rgba(139,92,246,0.15))', border: '1px solid rgba(74,176,222,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={22} color="#4ab0de" />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }} className="gradient-text">{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, marginBottom: 16, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', fontSize: 12, fontWeight: 600, color: '#8b5cf6' }}>
            Platform Overview
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12 }}>
            <span className="gradient-text">Three Roles.</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>One Platform.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto' }}>
            Business Owners report risks with AI assistance. Risk Managers validate and assign. Audit enforces and validates.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, maxWidth: 960, margin: '0 auto' }}>
          {features.map((f, i) => (
            <Link key={i} href={f.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '24px', transition: 'all 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#4ab0de'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(74,176,222,0.12)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-color)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg,${f.a},${f.b})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <f.icon size={22} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{f.title}</h3>
                      <ChevronRight size={15} color="var(--text-muted)" />
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 80px', background: 'linear-gradient(135deg,rgba(74,176,222,0.04),rgba(139,92,246,0.04))', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, marginBottom: 8 }}><span className="gradient-text">How It Works</span></h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Three lines of defence, fully digitised</p>
        </div>
        <div style={{ display: 'flex', gap: 0, maxWidth: 840, margin: '0 auto', alignItems: 'stretch' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Link href={step.href} style={{ textDecoration: 'none', flex: 1 }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '24px 20px', textAlign: 'center', transition: 'all 0.3s', height: '100%' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = step.color; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-color)'; (e.currentTarget as HTMLDivElement).style.transform = 'none' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 14px', background: `${step.color}20`, border: `2px solid ${step.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: step.color }}>{step.num}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: step.color, marginBottom: 10 }}>{step.subtitle}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </Link>
              {i < steps.length - 1 && <div style={{ padding: '0 12px', color: 'var(--text-muted)', flexShrink: 0 }}><ChevronRight size={20} /></div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 80px', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 14 }}>Ready to <span className="gradient-text">Manage Risk Smarter</span>?</h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 36 }}>Explore the full demo — no sign-up required.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/business-owner/dashboard" className="btn-primary" style={{ textDecoration: 'none', fontSize: 14 }}><Eye size={15} /> Business Owner View</Link>
          <Link href="/risk-manager/dashboard" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 14 }}><BarChart3 size={15} /> Risk Manager View</Link>
          <Link href="/admin/users" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 14 }}><Lock size={15} /> Admin Panel</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '20px 80px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={13} color="#4ab0de" />
          <span className="gradient-text" style={{ fontWeight: 700 }}>RiskAI Platform</span>
          <span>— Interactive Demo</span>
        </div>
        <span>Powered by ChatGPT · {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
