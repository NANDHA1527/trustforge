'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, XOctagon, Info } from 'lucide-react';
import { RiskAssessmentData } from '@/types/verification';

interface Props {
  riskData?: RiskAssessmentData;
}

export default function RiskMeter({ riskData }: Props) {
  const totalScore = riskData?.totalScore ?? 18;
  const classification = riskData?.classification ?? (totalScore >= 61 ? 'SUSPICIOUS' : totalScore >= 31 ? 'REVIEW REQUIRED' : 'GENUINE');

  // Color selection
  const isHigh = totalScore >= 61;
  const isMedium = totalScore >= 31 && totalScore < 61;
  const isLow = totalScore < 31;

  const colorClass = isHigh ? 'text-rose-500' : isMedium ? 'text-amber-500' : 'text-emerald-500';
  const strokeColor = isHigh ? '#EF4444' : isMedium ? '#F59E0B' : '#10B981';
  const badgeBg = isHigh ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : isMedium ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  // SVG Gauge calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  // Use semi-circle or 75% arc
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(totalScore, 100)) / 100;

  return (
    <div className="glass-panel-elevated p-6 rounded-2xl border border-surface-border space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">Risk Assessment Engine</h3>
          <p className="text-xs text-slate-400">Multi-vector security clearance evaluation</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeBg}`}>
          {classification}
        </span>
      </div>

      {/* Large Visual Gauge */}
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
            {/* Background Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#1E2D4A"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={strokeColor}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-extrabold font-mono tracking-tight ${colorClass}`}>
              {totalScore}
            </span>
            <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
              / 100 Index
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">
              {isHigh ? 'Critical Risk' : isMedium ? 'Moderate Risk' : 'Low Risk'}
            </span>
          </div>
        </div>

        {/* Risk Threshold Legend */}
        <div className="flex items-center justify-between w-full max-w-xs text-[11px] font-mono text-slate-400 mt-2 px-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>0-30 Genuine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>31-60 Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>61-100 Suspicious</span>
          </div>
        </div>
      </div>

      {/* Weighted Category Vector Breakdown */}
      <div className="space-y-3 pt-2 border-t border-surface-border">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Weighted Subsystem Points
        </h4>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-surface/80 border border-surface-border">
            <span className="text-slate-400 text-[11px]">Doc Authenticity (Max 30)</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono font-bold text-slate-200">
                +{riskData?.breakdown.authenticityPoints ?? (isHigh ? 25 : 5)} pts
              </span>
              <span className="text-[10px] text-slate-400">OCR & MRZ</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface/80 border border-surface-border">
            <span className="text-slate-400 text-[11px]">Biometrics (Max 25)</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono font-bold text-slate-200">
                +{riskData?.breakdown.facePoints ?? (isHigh ? 25 : 4)} pts
              </span>
              <span className="text-[10px] text-slate-400">Face Vector</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface/80 border border-surface-border">
            <span className="text-slate-400 text-[11px]">Tampering Analysis (Max 25)</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono font-bold text-slate-200">
                +{riskData?.breakdown.tamperingPoints ?? (isHigh ? 25 : 4)} pts
              </span>
              <span className="text-[10px] text-slate-400">Forensics & ELA</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface/80 border border-surface-border">
            <span className="text-slate-400 text-[11px]">Hash & Integrity (Max 20)</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono font-bold text-slate-200">
                +{riskData?.breakdown.integrityPoints ?? (isHigh ? 20 : 0)} pts
              </span>
              <span className="text-[10px] text-slate-400">SHA-256 Ledger</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Risk Factors */}
      <div className="space-y-2 pt-2 border-t border-surface-border">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Explainable Factor Attribution</span>
        </h4>

        <div className="space-y-1.5">
          {(riskData?.riskFactors && riskData.riskFactors.length > 0) ? (
            riskData.riskFactors.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 p-2 rounded-md bg-surface/60 border border-surface-border text-xs"
              >
                <span className="text-slate-300 leading-tight">{factor.description}</span>
                <span className="font-mono font-bold text-rose-400 shrink-0">+{factor.points} pts</span>
              </div>
            ))
          ) : (
            <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No elevated anomaly factors detected across screening criteria.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
