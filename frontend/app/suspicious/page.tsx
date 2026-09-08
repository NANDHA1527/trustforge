'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  FileWarning,
  ShieldAlert,
  XOctagon,
  Eye,
  MessageSquare,
  Send,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { SuspiciousCase } from '@/types/verification';

export default function SuspiciousPage() {
  const [cases, setCases] = useState<SuspiciousCase[]>([]);
  const [counts, setCounts] = useState({ total: 0, critical: 0, high: 0, medium: 0 });
  const [selectedCase, setSelectedCase] = useState<SuspiciousCase | null>(null);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const res = await api.getSuspiciousCases();
      if (res.success) {
        setCases(res.cases);
        setCounts(res.counts);
        if (res.cases.length > 0 && !selectedCase) {
          setSelectedCase(res.cases[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load suspicious cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedCase) return;

    try {
      const res = await api.addCaseNote(selectedCase.caseId, newNote.trim());
      if (res.success && res.note) {
        selectedCase.officerNotes.push(res.note);
        setNewNote('');
        loadCases();
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  return (
    <div className="ml-64 p-8 max-w-7xl space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-rose-400 font-semibold tracking-wider uppercase">
            Threat & Anomaly Operations
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
            High Vigilance Queue
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Suspicious Case Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Active security escalations requiring physical detention, forensic review, or vigilance inquiry
        </p>
      </div>

      {/* Severity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-surface-border">
          <span className="text-xs font-medium text-slate-400">Total Active Cases</span>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">{counts.total}</div>
          <span className="text-[10px] text-slate-500">Under active surveillance</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10">
          <span className="text-xs font-medium text-rose-400">Critical Severity</span>
          <div className="text-3xl font-extrabold font-mono text-rose-400 mt-1">{counts.critical}</div>
          <span className="text-[10px] text-slate-500">Immediate detention ordered</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10">
          <span className="text-xs font-medium text-amber-400">High Severity</span>
          <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1">{counts.high}</div>
          <span className="text-[10px] text-slate-500">Supervisor review pending</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 bg-blue-950/10">
          <span className="text-xs font-medium text-blue-400">Medium Severity</span>
          <div className="text-3xl font-extrabold font-mono text-blue-400 mt-1">{counts.medium}</div>
          <span className="text-[10px] text-slate-500">Flagged for document re-scan</span>
        </div>
      </div>

      {/* Main Investigation Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cases Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-surface-border overflow-hidden">
          <div className="p-4 border-b border-surface-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Active Suspicious Dockets</h3>
            <span className="text-xs font-mono text-slate-400">Click to inspect dossier</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-border bg-surface-elevated/40 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Detected Issue</th>
                  <th className="py-3 px-4">Risk</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {cases.map((c) => {
                  const isSelected = selectedCase?.caseId === c.caseId;
                  return (
                    <tr
                      key={c.caseId}
                      onClick={() => setSelectedCase(c)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-600/10' : 'hover:bg-surface-hover/50'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-blue-400">{c.caseId}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            c.severity === 'Critical'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : c.severity === 'High'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {c.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">{c.subjectName}</td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{c.detectedIssue}</td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-400">{c.riskScore}/100</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/verification/${c.verificationId}`}
                          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Selected Case Detail & Investigation Notes */}
        <div className="glass-panel-elevated p-6 rounded-2xl border border-surface-border space-y-5">
          {selectedCase ? (
            <>
              <div className="border-b border-surface-border pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400">{selectedCase.caseId}</span>
                  <span className="text-[10px] font-mono text-slate-400">{formatDate(selectedCase.timestamp)}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{selectedCase.subjectName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Assigned Officer: {selectedCase.assignedOfficer}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block font-mono">PRIMARY THREAT REASON:</span>
                  <p className="text-rose-300 font-semibold mt-0.5">{selectedCase.reason}</p>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block font-mono">FORENSIC ANOMALY:</span>
                  <p className="text-slate-200 mt-0.5">{selectedCase.detectedIssue}</p>
                </div>
              </div>

              {/* Investigation Log / Notes */}
              <div className="space-y-3 pt-3 border-t border-surface-border">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Investigation Field Notes</span>
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedCase.officerNotes.map((n, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-surface border border-surface-border text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-blue-400">{n.officer}</span>
                        <span>{formatDate(n.date)}</span>
                      </div>
                      <p className="text-slate-300">{n.note}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note Input */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Append observation note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              <div className="pt-2">
                <Link
                  href={`/verification/${selectedCase.verificationId}`}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-surface hover:bg-surface-hover border border-surface-border text-slate-200 flex items-center justify-center gap-2 transition-all"
                >
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span>Open Full Screening Dossier</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a case from the table to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
