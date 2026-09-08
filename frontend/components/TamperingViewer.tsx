'use client';

import React, { useState } from 'react';
import { Layers, AlertTriangle, Eye, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { TamperingData } from '@/types/verification';

interface Props {
  tamperingData?: TamperingData;
  documentType?: string;
  documentNumber?: string;
  name?: string;
}

export default function TamperingViewer({
  tamperingData,
  documentType = 'Passport',
  documentNumber = 'Z8942104',
  name = 'AARAV DEV SHARMA'
}: Props) {
  const [activeLayer, setActiveLayer] = useState<'STANDARD' | 'ELA_HEATMAP' | 'BOUNDING_BOXES'>('BOUNDING_BOXES');

  const tamperingScore = tamperingData?.tamperingScore ?? 3.2;
  const isTampered = tamperingScore > 60 || tamperingData?.status === 'SUSPICIOUS_MODIFICATION_DETECTED';
  const isReview = tamperingScore >= 30 && tamperingScore <= 60;

  const detectedRegions = tamperingData?.detectedRegions ?? [];

  return (
    <div className="glass-panel-elevated p-6 rounded-2xl border border-surface-border space-y-5">
      {/* Header & Score */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide">
              Document Forensic & Tampering Detector
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              ELA Engine v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Error Level Analysis (ELA), glyph anti-aliasing inspection, and substrate artifact scan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Tampering Score</span>
            <span
              className={`text-xl font-mono font-black ${
                isTampered ? 'text-rose-500' : isReview ? 'text-amber-500' : 'text-emerald-500'
              }`}
            >
              {tamperingScore.toFixed(1)}%
            </span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${
              isTampered
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : isReview
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isTampered
              ? 'SUSPICIOUS MODIFICATION DETECTED'
              : isReview
              ? 'REVIEW REQUIRED'
              : 'NO MODIFICATION DETECTED'}
          </div>
        </div>
      </div>

      {/* Layer Toggle Switcher */}
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-surface/90 border border-surface-border">
        <span className="text-xs font-medium text-slate-400 px-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Forensic Lens:</span>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveLayer('STANDARD')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              activeLayer === 'STANDARD'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-surface-hover'
            }`}
          >
            Standard Scan
          </button>

          <button
            onClick={() => setActiveLayer('ELA_HEATMAP')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeLayer === 'ELA_HEATMAP'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-surface-hover'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>ELA Noise Heatmap</span>
          </button>

          <button
            onClick={() => setActiveLayer('BOUNDING_BOXES')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeLayer === 'BOUNDING_BOXES'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-surface-hover'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Flagged Anomaly Regions ({detectedRegions.length})</span>
          </button>
        </div>
      </div>

      {/* Forensic Document Canvas */}
      <div className="relative aspect-[16/9] w-full max-h-[380px] rounded-xl overflow-hidden border border-slate-700 bg-navy-950 flex flex-col justify-between p-6 shadow-inner select-none">
        {/* Background Substrate Pattern */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            activeLayer === 'ELA_HEATMAP'
              ? 'opacity-90 bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 mix-blend-color-dodge'
              : 'opacity-100 bg-[#0B152B]'
          }`}
        >
          {/* Security Guilloche Lines simulation */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* If ELA is active, show noisy spectral heatmap gradient overlay */}
          {activeLayer === 'ELA_HEATMAP' && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_60%,rgba(239,68,68,0.45)_0%,rgba(168,85,247,0.25)_40%,transparent_70%)] animate-pulse" />
          )}
        </div>

        {/* Document Header Mock */}
        <div className="relative z-10 flex items-start justify-between border-b border-blue-500/20 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">
                Official Border Credential
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {documentType.toUpperCase()}
              </span>
            </div>
            <h4 className="text-base font-bold text-white tracking-wider mt-0.5">{name}</h4>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400">DOC NO.</span>
            <p className="text-sm font-mono font-bold text-blue-300">{documentNumber}</p>
          </div>
        </div>

        {/* Document Body with Bounding Boxes */}
        <div className="relative z-10 grid grid-cols-3 gap-4 my-auto">
          {/* Photo Slot */}
          <div className="col-span-1 aspect-[3/4] max-h-[160px] rounded-lg bg-navy-900 border border-blue-500/30 p-2 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center text-slate-300 font-bold text-lg mb-2">
              {name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <span className="text-[9px] font-mono text-slate-400">ICAO 9303 PHOTO</span>
            <span className="text-[8px] font-mono text-emerald-400 mt-1">EMBEDDED CHIP OK</span>
          </div>

          {/* Visual Fields & Seal */}
          <div className="col-span-2 space-y-2.5">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-surface/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">NATIONALITY</span>
                <span className="font-mono font-semibold text-slate-200">IND / CAN / GBR</span>
              </div>
              <div className="p-2 rounded bg-surface/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">DATE OF BIRTH</span>
                <span className="font-mono font-semibold text-slate-200">14 AUG 1992</span>
              </div>
              <div className="p-2 rounded bg-surface/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ISSUE DATE</span>
                <span className="font-mono font-semibold text-slate-200">10 JAN 2021</span>
              </div>
              <div className="p-2 rounded bg-surface/60 border border-slate-800 relative">
                <span className="text-[10px] text-slate-400 block">EXPIRY DATE</span>
                <span className="font-mono font-semibold text-slate-200">09 JAN 2031</span>

                {/* Highlight altered box if tampered */}
                {isTampered && (activeLayer === 'BOUNDING_BOXES' || activeLayer === 'ELA_HEATMAP') && (
                  <div className="absolute inset-0 border-2 border-rose-500 rounded bg-rose-500/20 animate-pulse flex items-center justify-end pr-1">
                    <span className="text-[9px] font-bold font-mono text-rose-300 bg-rose-950 px-1 rounded border border-rose-500">
                      FLAGGED
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Seal */}
            <div className="relative p-2 rounded bg-surface/40 border border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">NATIONAL SECURITY WATERMARK</span>
              <span className="text-[10px] font-mono text-blue-400">DIFFRACTION GRATING</span>

              {isTampered && (activeLayer === 'BOUNDING_BOXES' || activeLayer === 'ELA_HEATMAP') && (
                <div className="absolute inset-0 border-2 border-dashed border-rose-500 rounded bg-rose-500/10 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-rose-300 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-500">
                    ELA RESIDUAL DISPARITY
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Machine-Readable Zone (MRZ) */}
        <div className="relative z-10 border-t border-slate-800 pt-2 font-mono text-[10px] tracking-widest text-slate-400 select-all overflow-hidden truncate">
          P&lt;IND{name.replace(/\s+/g, '&lt;')}{'<<<<<<<<<<<<<<<<<<<'}
          <br />
          {documentNumber}&lt;4IND9208148M3101095{'<<<<<<<<<<<<<<'}06
        </div>

        {/* Scanning beam overlay */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 scan-line pointer-events-none" />
      </div>

      {/* Forensic Report Table of Detected Regions */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          <span>Forensic Substrate Regions Inspected</span>
        </h4>

        {detectedRegions.length > 0 ? (
          <div className="space-y-2">
            {detectedRegions.map((reg, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-rose-300">{reg.region}</span>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{reg.description}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                  {reg.severity} SEVERITY
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No localized pixel tampering, font glyph mismatch, or digital overlays detected. Clean forensic substrate.</span>
          </div>
        )}
      </div>
    </div>
  );
}
