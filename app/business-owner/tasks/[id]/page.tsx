'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

interface FileItem {
  name: string;
  size: string;
  status: 'uploaded' | 'pending';
}

const existingFiles: FileItem[] = [
  { name: 'Q1_MFA_Report.pdf', size: '2.3 MB', status: 'uploaded' },
  { name: 'Access_Log_March.xlsx', size: '156 KB', status: 'pending' },
];

const comments = [
  {
    author: 'Alex Chen',
    role: 'Risk Manager',
    initials: 'AC',
    text: 'Please upload updated reports - the previous submission was incomplete.',
    time: '2 days ago',
    color: '#8b5cf6',
  },
  {
    author: 'Sarah Lee',
    role: 'Finance Lead',
    initials: 'SL',
    text: 'Working on it, will upload by EOD.',
    time: '1 day ago',
    color: '#4ab0de',
  },
];

const checklist = [
  { label: 'Assessment description completed', done: true },
  { label: 'Testing methodology provided', done: true },
  { label: 'All evidence files uploaded', done: false },
  { label: 'Remediation notes added', done: false },
];

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = (params?.id as string) ?? 'TSK-001';

  const [assessmentDesc, setAssessmentDesc] = useState('');
  const [testingMethod, setTestingMethod] = useState('');
  const [remediationNotes, setRemediationNotes] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [linkedRiskOpen, setLinkedRiskOpen] = useState(true);

  const handleSaveDraft = () => {
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 3000);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      router.push('/business-owner/dashboard');
    }, 2000);
  };

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
      <Sidebar role="business-owner" activePage="tasks" />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '80px',
        }}
      >
        {/* Content area */}
        <div style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Breadcrumb */}
            <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <Link href="/business-owner/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                My Tasks
              </Link>
              <span>›</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{taskId}</span>
              <span>›</span>
              <span style={{ color: 'var(--text-secondary)' }}>Upload Q1 Control Testing Evidence</span>
            </div>

            {/* Task Header */}
            <div className="animate-fade-up-1">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(74,176,222,0.15)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid rgba(74,176,222,0.3)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {taskId}
                </span>
                <span
                  style={{
                    background: 'rgba(139,92,246,0.15)',
                    color: 'var(--accent-purple)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                >
                  Preventive
                </span>
                <span
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.3)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  Overdue
                </span>
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.3 }}>
                Upload Q1 Control Testing Evidence
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>📅 Due: <span style={{ color: '#ef4444', fontWeight: 600 }}>Mar 5, 2025</span></span>
                <span>👤 Assigned by: <span style={{ color: 'var(--text-primary)' }}>Alex Chen (Risk Manager)</span></span>
                <span>🗓 Created: Feb 20, 2025</span>
              </div>
            </div>

            {/* Manager Feedback Banner */}
            <div
              className="animate-fade-up-1"
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.35)',
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '18px', lineHeight: 1 }}>↻</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#f59e0b', fontSize: '14px', marginBottom: '4px' }}>
                    Evidence Needs Update
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>
                    Please upload the updated Q1 control testing reports. The previous files were incomplete.
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    — Alex Chen, Risk Manager • 2 days ago
                  </div>
                </div>
              </div>
            </div>

            {/* Linked Risk Card */}
            <div
              className="risk-card animate-fade-up-2"
              style={{ overflow: 'hidden' }}
            >
              <button
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'var(--text-primary)',
                }}
                onClick={() => setLinkedRiskOpen(!linkedRiskOpen)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px' }}>
                  🔗 Linked Risk: RSK-046 — Vendor Payment Fraud
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
                  {linkedRiskOpen ? '▾' : '▸'}
                </span>
              </button>

              {linkedRiskOpen && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ paddingTop: '16px' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                        marginBottom: '16px',
                      }}
                    >
                      {[
                        { label: 'Inherent Score', value: '20', color: '#ef4444' },
                        { label: 'Gross Score', value: '16', color: '#f59e0b' },
                        { label: 'Residual Score', value: '12', color: '#f59e0b' },
                      ].map((s) => (
                        <div
                          key={s.label}
                          style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '12px',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                      <span>Likelihood: <strong style={{ color: 'var(--text-primary)' }}>4/5</strong></span>
                      <span>Impact: <strong style={{ color: 'var(--text-primary)' }}>4/5</strong></span>
                      <span>Category: <strong style={{ color: 'var(--text-primary)' }}>Financial › Fraud › External Fraud</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Control Assignment */}
            <div
              className="animate-fade-up-2"
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'rgba(74,176,222,0.04)',
                border: '1px solid transparent',
                backgroundImage: 'linear-gradient(var(--bg-card), var(--bg-card)), linear-gradient(135deg, #4ab0de 0%, #8b5cf6 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--accent-cyan)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                🎯 YOUR TASK
              </div>
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>
                Preventive Control 2 — Multi-Factor Authentication (MFA)
              </div>
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Ensure all financial system accounts have MFA enabled with monthly compliance reports.
              </p>
              <span
                style={{
                  background: 'rgba(139,92,246,0.15)',
                  color: 'var(--accent-purple)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                Preventive
              </span>
            </div>

            {/* Assessment Input */}
            <div className="risk-card animate-fade-up-3" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 18px' }}>
                Assessment Input
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  {
                    label: 'Assessment Description',
                    hint: 'What did you do to address this control?',
                    value: assessmentDesc,
                    setter: setAssessmentDesc,
                  },
                  {
                    label: 'Testing Methodology',
                    hint: 'How did you test/verify this control?',
                    value: testingMethod,
                    setter: setTestingMethod,
                  },
                  {
                    label: 'Remediation Notes',
                    hint: 'Any issues found and how were they remediated?',
                    value: remediationNotes,
                    setter: setRemediationNotes,
                  },
                ].map((field) => (
                  <div key={field.label}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        marginBottom: '8px',
                      }}
                    >
                      {field.label}
                    </label>
                    <textarea
                      placeholder={field.hint}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      rows={4}
                      style={{
                        width: '100%',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                        resize: 'vertical',
                        outline: 'none',
                        fontFamily: 'inherit',
                        lineHeight: 1.6,
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent-cyan)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Upload */}
            <div className="risk-card animate-fade-up-4" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px' }}>
                Evidence Upload
              </h3>

              {/* Drag Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
                style={{
                  border: `2px dashed ${isDragOver ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  borderRadius: '10px',
                  padding: '28px',
                  textAlign: 'center',
                  background: isDragOver ? 'rgba(74,176,222,0.06)' : 'var(--bg-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📂</div>
                <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>
                  Drop files here or click to browse
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Supported formats: PDF, XLSX, DOCX, PNG, JPG (max 50MB)
                </div>
              </div>

              {/* Existing Files */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {existingFiles.map((file) => (
                  <div
                    key={file.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>
                        {file.name.endsWith('.pdf') ? '📄' : '📊'}
                      </span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{file.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{file.size}</div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '5px',
                        fontWeight: 500,
                        background: file.status === 'uploaded'
                          ? 'rgba(16,185,129,0.15)'
                          : 'rgba(245,158,11,0.15)',
                        color: file.status === 'uploaded' ? '#10b981' : '#f59e0b',
                      }}
                    >
                      {file.status === 'uploaded' ? '✓ Uploaded' : '⏳ Pending'}
                    </span>
                  </div>
                ))}
              </div>

              <button className="btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>
                + Upload New File
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Task Summary */}
            <div className="risk-card animate-fade-up" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 600, margin: '0 0 14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Task Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Task ID', value: taskId },
                  { label: 'Due Date', value: 'Mar 5, 2025', danger: true },
                  { label: 'Days Overdue', value: '7 days', danger: true },
                  { label: 'Linked Risk', value: 'RSK-046' },
                  { label: 'Control Type', value: 'Preventive' },
                  { label: 'Assigned By', value: 'Alex Chen' },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                    <span style={{ color: row.danger ? '#ef4444' : 'var(--text-primary)', fontWeight: 500 }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Checklist */}
            <div className="risk-card animate-fade-up-1" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 600, margin: '0 0 14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Submission Checklist
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {checklist.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{item.done ? '✅' : '❌'}</span>
                    <span style={{ color: item.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: '14px',
                  padding: '10px',
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}
              >
                {checklist.filter((c) => c.done).length} / {checklist.length} complete
              </div>
            </div>

            {/* Comments */}
            <div className="risk-card animate-fade-up-2" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 600, margin: '0 0 14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Comments
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                {comments.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: `${c.color}33`,
                        border: `1px solid ${c.color}66`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: c.color,
                        flexShrink: 0,
                      }}
                    >
                      {c.initials}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{c.author}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  marginBottom: '8px',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent-cyan)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
              />
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '8px' }}
              >
                Send Comment
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '260px',
          right: 0,
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span
            className="pulse-dot"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: savedIndicator ? '#10b981' : 'var(--text-muted)',
              display: 'inline-block',
            }}
          />
          {savedIndicator ? (
            <span style={{ color: '#10b981' }}>Draft saved</span>
          ) : (
            <span>Auto-saving draft...</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={handleSaveDraft}>
            💾 Save Draft
          </button>
          {submitted ? (
            <button
              className="btn-primary"
              style={{ background: '#10b981', cursor: 'default' }}
            >
              ✓ Submitted!
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit}>
              Submit for Review →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
