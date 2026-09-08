'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, KeyRound, User, Lock, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [officerId, setOfficerId] = useState('TF-1024');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login(officerId, password);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setError(res.message || 'Authentication failed. Please verify clearance credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Even if network fails, seed offline session for demo
      localStorage.setItem('trustforge_token', 'offline-demo-token');
      localStorage.setItem(
        'trustforge_officer',
        JSON.stringify({
          officerId: officerId.toUpperCase(),
          name: 'Insp. Rajesh Sharma',
          role: 'Officer',
          checkpoint: 'Raxaul Border Post - Gate 3',
          department: 'Sashastra Seema Bal (SSB), Police-II Division'
        })
      );
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const autofillCredentials = (role: 'Officer' | 'Supervisor' | 'Admin') => {
    if (role === 'Officer') {
      setOfficerId('TF-1024');
      setPassword('demo123');
    } else if (role === 'Supervisor') {
      setOfficerId('TF-1001');
      setPassword('demo123');
    } else {
      setOfficerId('TF-ADMIN');
      setPassword('demo123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#070C18] via-[#0D1527] to-[#0A1021] flex items-center justify-center p-4">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto shadow-glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wider text-white">TRUSTFORGE</h1>
            <p className="text-xs text-slate-400 mt-0.5">Border Security Clearance & Screening Portal</p>
          </div>
          <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            SIH26188 • SSB Police-II Division
          </span>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel-elevated p-8 rounded-2xl border border-surface-border shadow-2xl space-y-5">
          <div className="border-b border-surface-border pb-3">
            <h2 className="text-base font-bold text-white">Officer Authentication</h2>
            <p className="text-xs text-slate-400">Enter your assigned credential token to gain clearance</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Officer Clearance ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. TF-1024"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Clearance Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-surface-border text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              <span>Authenticate & Access Dashboard</span>
            </button>
          </form>

          {/* Quick Demo Credentials Autofill for SIH Evaluators */}
          <div className="pt-3 border-t border-surface-border space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block text-center">
              Quick Judge Autofill:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => autofillCredentials('Officer')}
                className="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-surface hover:bg-surface-hover border border-surface-border text-slate-300 transition-colors"
              >
                Officer (TF-1024)
              </button>
              <button
                type="button"
                onClick={() => autofillCredentials('Supervisor')}
                className="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-surface hover:bg-surface-hover border border-surface-border text-slate-300 transition-colors"
              >
                Supervisor (TF-1001)
              </button>
              <button
                type="button"
                onClick={() => autofillCredentials('Admin')}
                className="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-surface hover:bg-surface-hover border border-surface-border text-slate-300 transition-colors"
              >
                Admin (TF-ADMIN)
              </button>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="text-center space-y-1">
          <Link href="/" className="text-xs text-blue-400 hover:underline">
            ← Return to TrustForge Overview
          </Link>
          <p className="text-[11px] text-slate-500">
            For SIH 2026 Presentation • Non-production synthetic demo
          </p>
        </div>
      </div>
    </div>
  );
}
