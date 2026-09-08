'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  FileCheck2,
  ScanFace,
  Layers,
  Database,
  ArrowRight,
  CheckCircle2,
  Lock,
  Radio,
  FileText,
  Sliders,
  Scan,
  UserCheck,
  SearchCode,
  Hash,
  Gauge,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const steps = [
    { num: '01', title: 'Document', desc: 'Ingestion & parsing' },
    { num: '02', title: 'OCR', desc: 'MRZ data extraction' },
    { num: '03', title: 'Face', desc: 'Biometric matching' },
    { num: '04', title: 'Tampering', desc: 'Forensic ELA analysis' },
    { num: '05', title: 'Integrity', desc: 'SHA-256 blockchain' },
    { num: '06', title: 'Risk', desc: 'Transparent scoring' },
    { num: '07', title: 'Decision', desc: 'Officer clearance' }
  ];

  const features = [
    {
      icon: FileCheck2,
      title: 'Document Intelligence',
      desc: 'Deep neural OCR parsing of Machine Readable Zones (MRZ) and Visual Inspection Zones with automated checksum validation.',
      badge: 'ICAO 9303'
    },
    {
      icon: ScanFace,
      title: 'Face Verification',
      desc: '128-dimensional facial embedding comparison between credential photographs and live border checkpoint optical feeds.',
      badge: 'Biometric AI'
    },
    {
      icon: Layers,
      title: 'Tampering Detection',
      desc: 'Forensic Error Level Analysis (ELA) and font glyph inconsistency scanning to detect photo substitution and date alterations.',
      badge: 'Substrate ELA'
    },
    {
      icon: Database,
      title: 'Integrity Verification',
      desc: 'Cryptographic SHA-256 document hashing anchored into an immutable blockchain ledger to prevent credential recycling.',
      badge: 'SHA-256 Ledger'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070C18] via-[#0B132B] to-[#070C18] text-slate-100 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-surface-border/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-glow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-white">TRUSTFORGE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                SIH26188
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Ministry of Home Affairs • SSB Police-II Division</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-surface-border text-xs text-slate-300">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Demonstration Environment</span>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-glow active:scale-95"
          >
            <span>Officer Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>Smart India Hackathon 2026 Prototype Showcase</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Secure Identity.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
              Verified Documents.
            </span>{' '}
            Trusted Decisions.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Multi-layer identity and document screening system for high-throughput border checkpoints.
            Combining AI forensics, biometric cross-matching, and blockchain integrity.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-glow transition-all active:scale-95"
          >
            <span>Launch Secure Screening</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-surface-elevated hover:bg-surface-hover border border-surface-border text-slate-200 transition-all"
          >
            <span>View Operations Dashboard</span>
          </Link>
        </div>

        {/* Four Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-12 text-left">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-surface-border hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How TrustForge Works Workflow Strip */}
      <section className="max-w-6xl mx-auto px-6 py-14 border-t border-surface-border/60 text-center space-y-8">
        <div>
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
            Border Screening Architecture
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
            How TrustForge Verifies at the Frontier
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-elevated/80 border border-surface-border flex flex-col items-center justify-center relative"
            >
              <span className="text-[10px] font-mono text-blue-400 font-bold">{step.num}</span>
              <span className="text-sm font-bold text-white mt-1">{step.title}</span>
              <span className="text-[10px] text-slate-400 text-center mt-0.5">{step.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer & SIH Prototype Disclaimer */}
      <footer className="border-t border-surface-border py-8 px-6 bg-navy-950/80 text-center text-xs text-slate-400 space-y-3">
        <div className="max-w-4xl mx-auto p-3 rounded-xl bg-surface border border-slate-800 text-[11px] text-slate-400">
          <strong className="text-amber-400">SECURITY DISCLAIMER:</strong> This is a Smart India Hackathon 2026 prototype demonstration for Problem Statement ID <strong className="text-slate-200">SIH26188</strong> (Ministry of Home Affairs / Sashastra Seema Bal). This prototype uses synthetic test identities only and is not officially connected to live government registries (UIDAI, Passport Seva, or CCTNS).
        </div>
        <p>© 2026 TRUSTFORGE Team. Built for Smart India Hackathon.</p>
      </footer>
    </div>
  );
}
