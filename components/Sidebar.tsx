'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

type Role = 'business-owner' | 'risk-manager' | 'admin';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  role: Role;
  activePage: string;
}

const navConfig: Record<Role, NavSection[]> = {
  'business-owner': [
    {
      title: 'MY WORK',
      items: [
        { icon: '🏠', label: 'My Dashboard', href: '/business-owner/dashboard' },
        { icon: '✅', label: 'My Tasks', href: '/business-owner/tasks', badge: 6 },
        { icon: '💬', label: 'Report New Risk', href: '/business-owner/report-risk' },
      ],
    },
    {
      title: 'HELP',
      items: [
        { icon: '❓', label: 'Risk Guidelines', href: '/business-owner/guidelines' },
        { icon: '💬', label: 'Ask AI Assistant', href: '/business-owner/assistant' },
      ],
    },
  ],
  'risk-manager': [
    {
      title: 'OVERVIEW',
      items: [
        { icon: '🏠', label: 'Dashboard', href: '/risk-manager/dashboard' },
        { icon: '📋', label: 'Risk Registry', href: '/risk-manager/registry', badge: 8 },
        { icon: '🔍', label: 'Pending Review', href: '/risk-manager/review', badge: 5 },
      ],
    },
    {
      title: 'ACTIONS',
      items: [
        { icon: '✅', label: 'Validate & Assign', href: '/risk-manager/validate/RSK-052' },
        { icon: '🤖', label: 'AI Risk Review', href: '/risk-manager/review' },
      ],
    },
    {
      title: 'ADMIN',
      items: [
        { icon: '👥', label: 'User Management', href: '/admin/users' },
      ],
    },
  ],
  'admin': [
    {
      title: 'ADMIN',
      items: [
        { icon: '👥', label: 'User Management', href: '/admin/users' },
        { icon: '📊', label: 'All Risks', href: '/risk-manager/registry' },
        { icon: '🏠', label: 'Overview', href: '/risk-manager/dashboard' },
      ],
    },
  ],
};

const deptLabel: Record<Role, string> = {
  'business-owner': 'Finance Dept',
  'risk-manager': 'Risk Management',
  'admin': 'Administration',
};

const userInfo: Record<Role, { initials: string; name: string; role: string }> = {
  'business-owner': { initials: 'SL', name: 'Sarah Lee', role: 'Finance Lead' },
  'risk-manager': { initials: 'MR', name: 'Mohammed Al-Rashid', role: 'Senior Risk Manager' },
  'admin': { initials: 'AD', name: 'Admin User', role: 'System Administrator' },
};

export default function Sidebar({ role, activePage }: SidebarProps) {
  const sections = navConfig[role];
  const dept = deptLabel[role];
  const user = userInfo[role];

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        height: '100vh',
        overflowY: 'auto',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '24px 20px 16px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4ab0de 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Shield size={20} color="#fff" />
          </div>
          <div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              <span className="gradient-text">RiskAI</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
              Platform
            </div>
          </div>
        </div>
      </div>

      {/* Dept Badge */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(74,176,222,0.06)',
            border: '1px solid transparent',
            backgroundImage:
              'linear-gradient(var(--bg-secondary), var(--bg-secondary)), linear-gradient(135deg, #4ab0de 0%, #8b5cf6 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
            Department
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {dept}
          </div>
        </div>
      </div>

      {/* Nav Sections */}
      <nav style={{ flex: 1, padding: '12px 12px' }}>
        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                padding: '4px 8px 8px',
              }}
            >
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = activePage === item.label.toLowerCase().replace(/\s+/g, '-') ||
                activePage === item.href.split('/').pop();

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className={isActive ? 'nav-active' : ''}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 8px 9px 10px',
                      borderRadius: '8px',
                      marginBottom: '2px',
                      cursor: 'pointer',
                      color: isActive ? undefined : 'var(--text-secondary)',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 600 : 400,
                      transition: 'background 0.2s, color 0.2s',
                      borderLeft: isActive ? undefined : '3px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLDivElement).style.background = 'rgba(74,176,222,0.07)';
                        (e.currentTarget as HTMLDivElement).style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                        (e.currentTarget as HTMLDivElement).style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <span style={{ fontSize: '15px', lineHeight: 1 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        style={{
                          background: 'var(--danger)',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '10px',
                          lineHeight: 1.4,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4ab0de 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {user.initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.role}</div>
        </div>
      </div>
    </aside>
  );
}
