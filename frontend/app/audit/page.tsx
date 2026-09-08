'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ScrollText,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  FileCheck2,
  Lock,
  Clock,
  Terminal,
  ArrowUpRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { AuditLog } from '@/types/verification';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, [search, actionFilter]);

  const loadAuditLogs = async () => {
    try {
      const res = await api.getAuditLogs({
        search: search || undefined,
        action: actionFilter !== 'ALL' ? actionFilter : undefined
      });
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error('Failed to load audit trail:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-64 p-8 max-w-7xl space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
              Immutable Forensic Log
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              WORM Log (Write Once Read Many)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            System Security Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cryptographically signed record of all system events, automated model evaluations, and officer verdicts
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl border border-surface-border flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Verification ID, Officer ID, or Action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Event Actions</option>
          <option value="DOCUMENT_UPLOADED">Document Uploaded</option>
          <option value="PIPELINE_EXECUTED">Pipeline Executed</option>
          <option value="OFFICER_DECISION_RECORDED">Officer Decision</option>
          <option value="OFFICER_LOGIN_AUTHENTICATED">Login Authenticated</option>
        </select>
      </div>

      {/* Audit Log Stream */}
      <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Chronological System Events</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{logs.length} Logged Entries</span>
        </div>

        <div className="divide-y divide-surface-border">
          {logs.map((log) => (
            <div
              key={log._id}
              className="p-4 hover:bg-surface-hover/40 transition-colors flex flex-wrap items-start justify-between gap-4 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center shrink-0 text-blue-400 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white uppercase tracking-wide">
                      {log.action}
                    </span>
                    {log.verificationId && log.verificationId !== 'SYSTEM' && (
                      <Link
                        href={`/verification/${log.verificationId}`}
                        className="font-mono text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>{log.verificationId}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {/* Details JSON or Stringified Summary */}
                  <div className="mt-1 font-mono text-[11px] text-slate-300 bg-surface/60 p-2 rounded-lg border border-slate-800/80 max-w-2xl overflow-x-auto">
                    {typeof log.details === 'object'
                      ? JSON.stringify(log.details)
                      : String(log.details || 'Event logged')}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono shrink-0">
                <span className="text-blue-400 font-bold block">{log.officerId}</span>
                <span className="text-slate-400 text-[10px] mt-0.5 block">{formatDate(log.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
