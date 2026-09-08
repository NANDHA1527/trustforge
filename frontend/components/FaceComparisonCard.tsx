'use client';

import React from 'react';
import { UserCheck, UserX, ScanFace, Info, ShieldCheck, AlertOctagon } from 'lucide-react';
import { FaceVerificationData } from '@/types/verification';

interface Props {
  faceData?: FaceVerificationData;
  subjectName?: string;
}

export default function FaceComparisonCard({ faceData, subjectName = 'Aarav Dev Sharma' }: Props) {
  const similarityScore = faceData?.similarityScore ?? 97.8;
  const confidence = faceData?.confidence ?? 99.2;
  const status = faceData?.status ?? (similarityScore >= 70 ? 'MATCHED' : 'MISMATCH');

  const isMatched = status === 'MATCHED';

  return (
    <div className="glass-panel-elevated p-6 rounded-2xl border border-surface-border space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide">
              Facial Biometric Verification
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              128-D Vector Match
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Document credential photo vs. live immigration booth biometric capture
          </p>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
            isMatched
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {isMatched ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
          <span>{status}</span>
        </div>
      </div>

      {/* Side-by-Side Face Comparison Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Document Photo */}
        <div className="p-4 rounded-xl bg-surface/80 border border-surface-border flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-24 h-28 rounded-lg bg-navy-900 border border-blue-500/40 p-1 flex flex-col items-center justify-center relative mb-3">
            <div className="w-16 h-16 rounded-full bg-slate-700/80 border border-slate-600 flex items-center justify-center text-slate-200 font-bold text-lg">
              {subjectName.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            {/* Corner alignment markers */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-blue-400" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-blue-400" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-blue-400" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-blue-400" />
          </div>

          <span className="text-xs font-semibold text-white">Document Photo</span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5">ICAO ePassport Spec</span>
          <span className="text-[9px] font-mono text-emerald-400 mt-1">Resolution: 600 DPI</span>
        </div>

        {/* Live Facial Capture */}
        <div className="p-4 rounded-xl bg-surface/80 border border-surface-border flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-24 h-28 rounded-lg bg-navy-900 border border-purple-500/40 p-1 flex flex-col items-center justify-center relative mb-3">
            <div className="w-16 h-16 rounded-full bg-slate-700/80 border border-slate-600 flex items-center justify-center text-slate-200 font-bold text-lg">
              {isMatched
                ? subjectName.split(' ').map(n => n[0]).slice(0, 2).join('')
                : 'XX'}
            </div>
            {/* Live Camera Indicators */}
            <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[8px] font-mono text-rose-400">REC</span>
            </div>
            {/* Corner alignment markers */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-purple-400" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-purple-400" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-purple-400" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-purple-400" />
          </div>

          <span className="text-xs font-semibold text-white">Live Booth Capture</span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5">Booth Camera #03</span>
          <span className="text-[9px] font-mono text-purple-400 mt-1">Liveness: CONFIRMED</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-surface-border">
        <div className="p-3 rounded-lg bg-surface/60 border border-surface-border">
          <span className="text-[11px] text-slate-400 block">Biometric Similarity</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span
              className={`text-2xl font-mono font-bold ${
                isMatched ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {similarityScore.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400">(Threshold 70%)</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-surface/60 border border-surface-border">
          <span className="text-[11px] text-slate-400 block">Matcher Confidence</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-mono font-bold text-blue-400">
              {confidence.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400">Euclidean Distance</span>
          </div>
        </div>
      </div>

      {/* Mandatory Demo / Simulation Notice Banner */}
      <div className="p-2.5 rounded-lg bg-navy-950/80 border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          <strong className="text-slate-200">DEMO / SIMULATED BIOMETRIC RESULT</strong> — Evaluated against synthetic benchmark vectors for SIH26188 testing.
        </span>
      </div>
    </div>
  );
}
