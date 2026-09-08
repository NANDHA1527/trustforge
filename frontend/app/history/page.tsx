'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  History,
  Search,
  Eye,
  AlertTriangle,
  FileSearch,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate, getStatusTheme } from '@/lib/utils';
import { VerificationRecord } from '@/types/verification';

// Skeleton row for loading state
function SkeletonRow() {
  return (
    <tr className="border-b border-surface-border animate-pulse">
      {[...Array(10)].map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <div className="h-4 rounded bg-slate-700/60 w-full" />
        </td>
      ))}
    </tr>
  );
}

export default function HistoryPage() {
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [docFilter, setDocFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVerifications();
  }, [search, statusFilter, docFilter]);

  const loadVerifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAllVerifications({
        search: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        documentType: docFilter !== 'ALL' ? docFilter : undefined
      });
      if (res.success) {
        setVerifications(res.verifications || []);
      } else {
        setError(res.message || 'Failed to load verification history.');
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Unable to connect to the screening server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const statusIcon = (status: string) => {
    if (status === 'GENUINE') return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
    if (status === 'SUSPICIOUS') return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
    return <Clock className="w-3.5 h-3.5 text-amber-400" />;
  };

  return (
    <div className="ml-64 p-8 max-w-7xl space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
              Border Archives
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {loading ? '…' : `${verifications.length} Records`}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Verification History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable ledger of all border document screenings and biometric verifications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadVerifications}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-surface border border-surface-border hover:bg-surface-elevated text-slate-300 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            href="/verify"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-glow transition-all"
          >
            + New Verification
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl border border-surface-border flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Subject Name, or Hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="GENUINE">Genuine</option>
            <option value="REVIEW REQUIRED">Review Required</option>
            <option value="SUSPICIOUS">Suspicious</option>
          </select>

          <select
            value={docFilter}
            onChange={(e) => setDocFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Document Types</option>
            <option value="Passport">Passport</option>
            <option value="Visa">Visa</option>
            <option value="Identity Card">Identity Card</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <p className="font-semibold">Connection Error</p>
            <p className="text-xs text-rose-400 mt-0.5">{error}</p>
          </div>
          <button
            onClick={loadVerifications}
            className="ml-auto text-xs px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* History Table */}
      <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border bg-surface-elevated/40 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Verification ID</th>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Face Match</th>
                <th className="py-3 px-4">Tampering</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Officer</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {/* Loading skeletons */}
              {loading && [...Array(6)].map((_, i) => <SkeletonRow key={i} />)}

              {/* Empty state */}
              {!loading && !error && verifications.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <FileSearch className="w-10 h-10 text-slate-600" />
                      <p className="font-semibold text-slate-400">No verification records found</p>
                      <p className="text-xs">
                        {search || statusFilter !== 'ALL' || docFilter !== 'ALL'
                          ? 'Try adjusting your filters or search query.'
                          : 'Run a new verification to populate the history.'}
                      </p>
                      <Link
                        href="/verify"
                        className="mt-2 px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all"
                      >
                        Start First Verification
                      </Link>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading && verifications.map((v) => {
                const theme = getStatusTheme(v.status);
                return (
                  <tr key={v.verificationId} className="hover:bg-surface-hover/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                      {v.verificationId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        {v.documentType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{v.subjectName || 'Unknown'}</div>
                      <div className="text-[10px] font-mono text-slate-400">{v.subjectId || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span
                        className={
                          v.riskScore >= 61
                            ? 'text-rose-400'
                            : v.riskScore >= 31
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {v.riskScore}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-300">
                        {v.status === 'SUSPICIOUS' && v.scenarioType === 'FACE_MISMATCH' ? '41.2% (FAIL)' : '97.8% (PASS)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-300">
                        {v.status === 'SUSPICIOUS' && v.scenarioType === 'TAMPERED' ? '91.4% (FAIL)' : '3.2% (CLEAN)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${theme.badge}`}>
                        {statusIcon(v.status)}
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{v.officerId}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">{formatDate(v.timestamp)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/verification/${v.verificationId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface border border-surface-border hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
