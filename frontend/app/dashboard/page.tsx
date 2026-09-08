'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  FileWarning,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  XOctagon,
  Eye,
  PlusCircle,
  Activity,
  Radio,
  FileText,
  TrendingUp,
  MapPin
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api } from '@/lib/api';
import { formatDate, truncateHash, getStatusTheme } from '@/lib/utils';
import { Officer, VerificationRecord, SuspiciousCase } from '@/types/verification';

export default function DashboardPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<any[]>([]);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [checkpointActivity, setCheckpointActivity] = useState<any[]>([]);
  const [recentVerifications, setRecentVerifications] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOfficer(api.getCurrentOfficer());
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
        setTrendData(res.trendData);
        setRiskDistribution(res.riskDistribution);
        setDocumentTypes(res.documentTypeDistribution);
        setCheckpointActivity(res.checkpointActivity);
        setRecentVerifications(res.recentVerifications);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];
  const DOC_COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4'];

  return (
    <div className="ml-64 p-8 space-y-8 bg-background min-h-screen">
      {/* Top Header & Greeting */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            Security Operations Command Center
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Good Evening, {officer?.name || 'Officer'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active clearance post: <strong className="text-slate-200">{officer?.checkpoint || 'Raxaul Border Post - Gate 3'}</strong> • Live Telemetry Stream
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/verify"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-glow transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Document Verification</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Screenings */}
        <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Screenings Today</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              {stats?.totalScreeningsToday ?? 1284}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
              +12.4% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Across 4 border checkpoints</p>
        </div>

        {/* Genuine */}
        <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Genuine Cleared</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              {stats?.genuineCount ?? 1102}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">85.8%</span>
          </div>
          <p className="text-[10px] text-slate-400">Direct green corridor clearance</p>
        </div>

        {/* Review Required */}
        <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Review Required</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              {stats?.reviewCount ?? 126}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">9.8%</span>
          </div>
          <p className="text-[10px] text-slate-400">Secondary visual inspection queued</p>
        </div>

        {/* Suspicious */}
        <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Suspicious / Flagged</span>
            <FileWarning className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-rose-400">
              {stats?.suspiciousCount ?? 56}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">4.4%</span>
          </div>
          <p className="text-[10px] text-slate-400">Critical forensic anomalies</p>
        </div>

        {/* Avg Processing Time */}
        <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg Pipeline Latency</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-cyan-400">
              {stats?.avgProcessingTimeSec ?? 1.8}s
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">Fast</span>
          </div>
          <p className="text-[10px] text-slate-400">9-stage automated inference</p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Throughput & Anomaly Trend (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-surface-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Screening Throughput & Anomaly Trend</h3>
              <p className="text-xs text-slate-400">Hourly volume of processed credentials vs flagged detections</p>
            </div>
            <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded bg-surface border border-surface-border">
              Today (06:00 - 20:00)
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="genuineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="suspiciousGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0D1527', borderColor: '#1E2D4A', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="genuine" stroke="#10B981" fillOpacity={1} fill="url(#genuineGrad)" name="Genuine" />
                <Area type="monotone" dataKey="suspicious" stroke="#EF4444" fillOpacity={1} fill="url(#suspiciousGrad)" name="Suspicious" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Risk Score Distribution</h3>
            <p className="text-xs text-slate-400">Breakdown of screening risk ratings</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0D1527', borderColor: '#1E2D4A', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-surface-border text-xs">
            {riskDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.category}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span>{item.count}</span>
                  <span className="text-slate-400 text-[10px]">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkpoint Posts Telemetry */}
      <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-white">Checkpoint Activity Status</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">All 4 Gate Relays Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {checkpointActivity.map((cp, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-surface-elevated/70 border border-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">{cp.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-400">Officers on Duty</span>
                <span className="font-mono font-semibold text-slate-200">{cp.activeOfficers}</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-400">Screenings Today</span>
                <span className="font-mono font-semibold text-blue-400">{cp.screeningsToday}</span>
              </div>
              <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-800">
                <span className="text-slate-400">Alert Rate</span>
                <span className="font-mono font-semibold text-rose-400">{cp.alertRate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Verifications Table */}
      <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Identity Verifications</h3>
            <p className="text-xs text-slate-400">Live stream of screened border crossing credentials</p>
          </div>

          <Link
            href="/history"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View Full History</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Verification ID</th>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Subject Name & ID</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Clearance Status</th>
                <th className="py-3 px-4">Officer</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {recentVerifications.map((v) => {
                const theme = getStatusTheme(v.status);
                return (
                  <tr key={v.verificationId} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                      {v.verificationId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        {v.documentType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{v.subjectName || 'Aarav Dev Sharma'}</div>
                      <div className="text-[10px] font-mono text-slate-400">{v.subjectId || 'SUB-9021'}</div>
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
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${theme.badge}`}>
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
