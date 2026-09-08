'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  User,
  Shield,
  KeyRound,
  Sliders,
  Bell,
  Smartphone,
  CheckCircle2,
  Lock,
  Radio,
  Server
} from 'lucide-react';
import { api } from '@/lib/api';
import { Officer } from '@/types/verification';

export default function SettingsPage() {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [faceThreshold, setFaceThreshold] = useState(70);
  const [tamperingThreshold, setTamperingThreshold] = useState(60);
  const [ocrThreshold, setOcrThreshold] = useState(75);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setOfficer(api.getCurrentOfficer());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="ml-64 p-8 max-w-5xl space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            Security Clearance Admin
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Officer Profile & System Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage officer credentials, security authentication parameters, and screening thresholds
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>System configuration parameters saved and synced across checkpoint terminals.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Officer Profile Card */}
        <div className="glass-panel-elevated p-6 rounded-2xl border border-surface-border space-y-5">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-glow">
              {officer?.name ? officer.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'RS'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{officer?.name || 'Insp. Rajesh Sharma'}</h3>
              <p className="text-xs font-mono text-blue-400 mt-0.5">{officer?.officerId || 'TF-1024'}</p>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Clearance: {officer?.role || 'Officer'}
            </span>
          </div>

          <div className="space-y-3 pt-4 border-t border-surface-border text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Station Assignment</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">
                {officer?.checkpoint || 'Raxaul Border Post - Gate 3'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Department Division</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">
                {officer?.department || 'Sashastra Seema Bal (SSB), Police-II Division'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Security Posture</span>
              <span className="font-semibold text-emerald-400 mt-0.5 block">
                Active Duty • Authenticated
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Security & Thresholds Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Security & 2FA */}
          <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-5">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Shield className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Security & Multi-Factor Clearance</h3>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-surface/80 border border-surface-border">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-slate-400">TOTP Hardware Token / Mobile Authenticator required</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  twoFactorEnabled ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Password Change placeholder */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-slate-300">Update Officer Clearance Passcode</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="password"
                  placeholder="Current Passcode"
                  className="px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
                <input
                  type="password"
                  placeholder="New Passcode (Min 8 chars)"
                  className="px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Screening Model Thresholds */}
          <form onSubmit={handleSave} className="glass-panel p-6 rounded-2xl border border-surface-border space-y-5">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Screening Pipeline Thresholds</h3>
            </div>

            <div className="space-y-4 text-xs">
              {/* Face similarity threshold */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-300">Face Biometric Similarity Threshold</span>
                  <span className="font-mono font-bold text-blue-400">{faceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={faceThreshold}
                  onChange={(e) => setFaceThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Scores below {faceThreshold}% trigger an automated BIOMETRIC_MISMATCH flag.
                </p>
              </div>

              {/* Tampering threshold */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-300">Tampering Detection ELA Noise Cap</span>
                  <span className="font-mono font-bold text-rose-400">{tamperingThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="80"
                  value={tamperingThreshold}
                  onChange={(e) => setTamperingThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Tampering scores above {tamperingThreshold}% trigger immediate high-priority case creation.
                </p>
              </div>

              {/* OCR threshold */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-300">Minimum OCR Confidence Threshold</span>
                  <span className="font-mono font-bold text-amber-400">{ocrThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  value={ocrThreshold}
                  onChange={(e) => setOcrThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Read accuracy below {ocrThreshold}% routes credential to secondary manual visual inspect.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                <span>AI Service Gateway: http://localhost:8000</span>
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-glow transition-all active:scale-95"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
