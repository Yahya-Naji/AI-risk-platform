'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Administrator' | 'Risk Manager' | 'Dept Lead';
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
}

const USERS: User[] = [
  { id: 1, firstName: 'Mohammed', lastName: 'Al-Rashid', email: 'malrashid@company.com', role: 'Administrator', department: 'All Departments', status: 'Active', lastActive: '2 min ago' },
  { id: 2, firstName: 'Sarah', lastName: 'Lee', email: 'slee@company.com', role: 'Risk Manager', department: 'Finance', status: 'Active', lastActive: '15 min ago' },
  { id: 3, firstName: 'James', lastName: 'Wong', email: 'jwong@company.com', role: 'Risk Manager', department: 'IT', status: 'Active', lastActive: '1 hr ago' },
  { id: 4, firstName: 'Omar', lastName: 'Hassan', email: 'ohassan@company.com', role: 'Risk Manager', department: 'Operations', status: 'Active', lastActive: '3 hr ago' },
  { id: 5, firstName: 'Lisa', lastName: 'Park', email: 'lpark@company.com', role: 'Dept Lead', department: 'Legal', status: 'Active', lastActive: 'Yesterday' },
  { id: 6, firstName: 'Mark', lastName: 'Wilson', email: 'mwilson@company.com', role: 'Dept Lead', department: 'IT', status: 'Active', lastActive: 'Yesterday' },
  { id: 7, firstName: 'Ana', lastName: 'Costa', email: 'acosta@company.com', role: 'Dept Lead', department: 'HR', status: 'Inactive', lastActive: '5 days ago' },
  { id: 8, firstName: 'David', lastName: 'Kim', email: 'dkim@company.com', role: 'Dept Lead', department: 'Finance', status: 'Pending', lastActive: 'Never' },
];

const ROLE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Administrator: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.25)' },
  'Risk Manager': { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: 'rgba(139,92,246,0.25)' },
  'Dept Lead': { bg: 'rgba(74,176,222,0.12)', color: '#4ab0de', border: 'rgba(74,176,222,0.25)' },
};

const STATUS_DOTS: Record<string, string> = {
  Active: '#10b981',
  Inactive: '#6a6a8a',
  Pending: '#f59e0b',
};

const DEPARTMENTS = ['All Departments', 'Finance', 'IT', 'Legal', 'HR', 'Operations'];

type TabKey = 'all' | 'administrators' | 'risk-managers' | 'dept-leads' | 'pending';

const TABS: { key: TabKey; label: string; count: number }[] = [
  { key: 'all', label: 'All', count: 24 },
  { key: 'administrators', label: 'Administrators', count: 2 },
  { key: 'risk-managers', label: 'Risk Managers', count: 4 },
  { key: 'dept-leads', label: 'Dept Leads', count: 18 },
  { key: 'pending', label: 'Pending', count: 3 },
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Finance',
    role: 'Dept Lead' as User['role'],
  });

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredUsers = USERS.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) || u.email.includes(search.toLowerCase());
    const matchDept = deptFilter === 'All Departments' || u.department === deptFilter;
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'administrators' && u.role === 'Administrator') ||
      (activeTab === 'risk-managers' && u.role === 'Risk Manager') ||
      (activeTab === 'dept-leads' && u.role === 'Dept Lead') ||
      (activeTab === 'pending' && u.status === 'Pending');
    return matchSearch && matchDept && matchStatus && matchTab;
  });

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    if (selected.length === filteredUsers.length) setSelected([]);
    else setSelected(filteredUsers.map((u) => u.id));
  };

  const ROLE_DESCRIPTIONS: Record<User['role'], { desc: string; perms: string }> = {
    Administrator: {
      desc: 'Full system access including user management',
      perms: 'All permissions + Admin Panel',
    },
    'Risk Manager': {
      desc: 'Manage, validate and assign risks',
      perms: 'Risk Registry, Validate, Review',
    },
    'Dept Lead': {
      desc: 'Report risks for their department',
      perms: 'Report Risk, View Tasks',
    },
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar role="admin" activePage="users" />

      <main style={{ flex: 1, overflowY: 'auto' }}>
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

        {/* Add User Modal */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0,0,0,0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                padding: '32px',
                width: '520px',
                maxWidth: '95vw',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              className="animate-fade-up"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Add New User</h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '22px',
                    cursor: 'pointer',
                    lineHeight: 1,
                    padding: '4px',
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      First Name
                    </label>
                    <input
                      value={newUser.firstName}
                      onChange={(e) => setNewUser((p) => ({ ...p, firstName: e.target.value }))}
                      placeholder="John"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Last Name
                    </label>
                    <input
                      value={newUser.lastName}
                      onChange={(e) => setNewUser((p) => ({ ...p, lastName: e.target.value }))}
                      placeholder="Smith"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
                    placeholder="john.smith@company.com"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Department
                  </label>
                  <select
                    value={newUser.department}
                    onChange={(e) => setNewUser((p) => ({ ...p, department: e.target.value }))}
                    style={inputStyle}
                  >
                    {DEPARTMENTS.filter((d) => d !== 'All Departments').map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                    Role
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(['Administrator', 'Risk Manager', 'Dept Lead'] as User['role'][]).map((r) => (
                      <label
                        key={r}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '10px',
                          border: `1px solid ${newUser.role === r ? ROLE_COLORS[r].border : 'var(--border-color)'}`,
                          background: newUser.role === r ? ROLE_COLORS[r].bg : 'var(--bg-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          checked={newUser.role === r}
                          onChange={() => setNewUser((p) => ({ ...p, role: r }))}
                          style={{ marginTop: '3px', accentColor: ROLE_COLORS[r].color }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: newUser.role === r ? ROLE_COLORS[r].color : 'var(--text-primary)', marginBottom: '2px' }}>
                            {r}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            {ROLE_DESCRIPTIONS[r].desc}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>
                            Permissions: {ROLE_DESCRIPTIONS[r].perms}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    showToastMsg(`User ${newUser.firstName} ${newUser.lastName} created successfully!`);
                    setNewUser({ firstName: '', lastName: '', email: '', department: 'Finance', role: 'Dept Lead' });
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #4ab0de, #8b5cf6)',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: '32px' }}>
          {/* Header */}
          <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>
                <span className="gradient-text">User Management</span>
              </h1>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                24 users across all departments
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { label: '↓ Export', onClick: () => showToastMsg('Export started') },
                { label: '↑ Import', onClick: () => showToastMsg('Import dialog opened') },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.onClick}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
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
                  {btn.label}
                </button>
              ))}
              <button
                onClick={() => setShowModal(true)}
                style={{
                  padding: '9px 18px',
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
                + Add User
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
            {[
              { label: 'Total Users', value: 24, color: '#4ab0de' },
              { label: 'Administrators', value: 2, color: '#ef4444' },
              { label: 'Risk Managers', value: 4, color: '#8b5cf6' },
              { label: 'Dept Leads', value: 18, color: '#4ab0de' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${s.color}25`,
                  borderRadius: '14px',
                  padding: '18px 20px',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0' }}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: activeTab === tab.key ? 700 : 400,
                  color: activeTab === tab.key ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  borderBottom: `2px solid ${activeTab === tab.key ? 'var(--accent-cyan)' : 'transparent'}`,
                  marginBottom: '-1px',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {tab.label}
                <span
                  style={{
                    background: activeTab === tab.key ? 'rgba(74,176,222,0.15)' : 'var(--bg-card)',
                    color: activeTab === tab.key ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    borderRadius: '10px',
                    padding: '1px 7px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '14px' }}>
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                style={{
                  ...inputStyle,
                  paddingLeft: '36px',
                  width: '100%',
                }}
              />
            </div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ ...inputStyle, minWidth: '160px' }}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ ...inputStyle, minWidth: '140px' }}
            >
              {['All', 'Active', 'Inactive', 'Pending'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Bulk actions */}
          {selected.length > 0 && (
            <div
              className="animate-fade-up"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(74,176,222,0.06)',
                border: '1px solid rgba(74,176,222,0.2)',
                borderRadius: '10px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                {selected.length} user{selected.length > 1 ? 's' : ''} selected
              </span>
              {['Change Role', 'Change Dept', 'Deactivate'].map((action) => (
                <button
                  key={action}
                  onClick={() => showToastMsg(`${action} applied to ${selected.length} user(s)`)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '7px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
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
                  {action}
                </button>
              ))}
              <button
                onClick={() => setSelected([])}
                style={{
                  marginLeft: 'auto',
                  padding: '6px 12px',
                  borderRadius: '7px',
                  border: '1px solid var(--border-color)',
                  background: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Table */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              overflow: 'hidden',
              marginBottom: '20px',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table className="risk-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={selected.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={toggleAll}
                        style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                      />
                    </th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const roleStyle = ROLE_COLORS[user.role];
                    const isSelected = selected.includes(user.id);
                    return (
                      <tr
                        key={user.id}
                        style={{
                          background: isSelected ? 'rgba(74,176,222,0.04)' : 'transparent',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected)
                            (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected)
                            (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
                        }}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(user.id)}
                            style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${roleStyle.color}88, ${roleStyle.color}44)`,
                                border: `1px solid ${roleStyle.border}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 800,
                                color: roleStyle.color,
                                flexShrink: 0,
                              }}
                            >
                              {user.firstName[0]}{user.lastName[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                                {user.firstName} {user.lastName}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              background: roleStyle.bg,
                              color: roleStyle.color,
                              border: `1px solid ${roleStyle.border}`,
                              borderRadius: '6px',
                              padding: '3px 10px',
                              fontSize: '11px',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td style={{ fontSize: '13px' }}>{user.department}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: STATUS_DOTS[user.status],
                                display: 'inline-block',
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.status}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.lastActive}</td>
                        <td>
                          {user.status === 'Inactive' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => showToastMsg(`${user.firstName} reactivated`)}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(16,185,129,0.3)',
                                  background: 'rgba(16,185,129,0.08)',
                                  color: '#10b981',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                }}
                              >
                                Reactivate
                              </button>
                              <button
                                onClick={() => showToastMsg(`${user.firstName} deleted`)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(239,68,68,0.3)',
                                  background: 'rgba(239,68,68,0.08)',
                                  color: '#ef4444',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          ) : user.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => showToastMsg(`Invite resent to ${user.email}`)}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(245,158,11,0.3)',
                                  background: 'rgba(245,158,11,0.08)',
                                  color: '#f59e0b',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                }}
                              >
                                Resend
                              </button>
                              <button
                                onClick={() => showToastMsg(`${user.firstName} deleted`)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(239,68,68,0.3)',
                                  background: 'rgba(239,68,68,0.08)',
                                  color: '#ef4444',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {[
                                { icon: '✏️', title: 'Edit user', action: () => showToastMsg(`Editing ${user.firstName}`) },
                                { icon: '🔑', title: 'Reset password', action: () => showToastMsg(`Password reset sent to ${user.email}`) },
                                { icon: '📋', title: 'View activity', action: () => showToastMsg(`Viewing ${user.firstName}'s activity`) },
                              ].map((btn) => (
                                <button
                                  key={btn.icon}
                                  onClick={btn.action}
                                  title={btn.title}
                                  style={{
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    transition: 'all 0.15s',
                                  }}
                                  onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-cyan)';
                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(74,176,222,0.08)';
                                  }}
                                  onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-color)';
                                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-secondary)';
                                  }}
                                >
                                  {btn.icon}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing 1–{filteredUsers.length} of 24
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Previous
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: `1px solid ${p === 1 ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                    background: p === 1 ? 'rgba(74,176,222,0.12)' : 'var(--bg-card)',
                    color: p === 1 ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    fontSize: '13px',
                    fontWeight: p === 1 ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '9px 12px',
  color: 'var(--text-primary)',
  fontSize: '13px',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
};
