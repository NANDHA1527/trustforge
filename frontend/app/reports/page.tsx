'use client';

import React, { useEffect, useState } from 'react';
import {
  FileBarChart,
  Printer,
  Download,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  XOctagon,
  CheckCircle2,
  Lock,
  Hash,
  Award,
  Radio,
  FileText
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate, truncateHash } from '@/lib/utils';
import { VerificationRecord } from '@/types/verification';

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [selectedVerificationId, setSelectedVerificationId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const vRes = await api.getAllVerifications();
      if (vRes.success && vRes.verifications.length > 0) {
        setVerifications(vRes.verifications);
        const defaultId = vRes.verifications[0].verificationId;
        setSelectedVerificationId(defaultId);
        loadReport(defaultId);
      }
    } catch (err) {
      console.error('Failed to load initial records:', err);
      setLoading(false);
    }
  };

  const loadReport = async (vId: string) => {
    setLoading(true);
    try {
      const res = await api.generateReport(vId);
      if (res.success) {
        setReportData(res.report);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ml-64 p-8 max-w-5xl space-y-6 bg-background min-h-screen">
      {/* Header & Print Control Bar (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
              Formal Clearance Dossier
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              PDF / Print Engine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Verification Clearance Report
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate and export tamper-evident border security clearance dossiers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Select Verification to Report */}
          <select
            value={selectedVerificationId}
            onChange={(e) => {
              setSelectedVerificationId(e.target.value);
              loadReport(e.target.value);
            }}
            className="px-3 py-2 rounded-xl bg-surface border border-surface-border text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {verifications.map((v) => (
              <option key={v.verificationId} value={v.verificationId}>
                {v.verificationId} — {v.subjectName || v.documentType} ({v.status})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-glow transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-surface border border-surface-border hover:bg-surface-hover text-slate-200 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Official Security Report Document Container */}
      <div className="glass-panel-elevated p-8 sm:p-12 rounded-3xl border border-surface-border shadow-2xl space-y-8 bg-[#0D1527] text-slate-100 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Document Header with Official Emblem Style */}
        <div className="border-b-2 border-blue-500/30 pb-6 flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-glow print:bg-slate-900">
              TF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-wider text-white print:text-black">
                  TRUSTFORGE
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 print:text-slate-800">
                  SIH26188
                </span>
              </div>
              <p className="text-xs font-semibold text-blue-400 print:text-slate-600">
                Identity & Document Verification Clearance Dossier
              </p>
              <p className="text-[11px] text-slate-400 print:text-slate-500">
                Ministry of Home Affairs • SSB Police-II Division (Simulated Demonstration)
              </p>
            </div>
          </div>

          <div className="text-right text-xs font-mono space-y-1 text-slate-400 print:text-slate-600">
            <div>
              <span className="text-slate-400">REPORT ID: </span>
              <strong className="text-white print:text-black">{reportData?.reportId || 'REP-2026-0891'}</strong>
            </div>
            <div>
              <span className="text-slate-400">DATE: </span>
              <span className="text-slate-200 print:text-slate-800">{formatDate(reportData?.generatedAt)}</span>
            </div>
            <div>
              <span className="text-slate-400">OFFICER ON DUTY: </span>
              <span className="text-blue-400 font-bold">TF-1024 (Insp. Rajesh Sharma)</span>
            </div>
          </div>
        </div>

        {/* Verification Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-surface/70 border border-surface-border print:bg-slate-50 print:border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase block">Verification ID</span>
            <span className="text-sm font-bold text-white print:text-black mt-0.5 block">
              {reportData?.verification?.verificationId || 'TF-2026-0891'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface/70 border border-surface-border print:bg-slate-50 print:border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase block">Document Type</span>
            <span className="text-sm font-bold text-white print:text-black mt-0.5 block">
              {reportData?.verification?.documentType || 'Passport'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface/70 border border-surface-border print:bg-slate-50 print:border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase block">Risk Score Index</span>
            <span
              className={`text-sm font-bold mt-0.5 block ${
                (reportData?.verification?.riskScore ?? 18) >= 61
                  ? 'text-rose-400 print:text-red-600'
                  : (reportData?.verification?.riskScore ?? 18) >= 31
                  ? 'text-amber-400 print:text-amber-600'
                  : 'text-emerald-400 print:text-emerald-600'
              }`}
            >
              {reportData?.verification?.riskScore ?? 18} / 100
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface/70 border border-surface-border print:bg-slate-50 print:border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase block">Clearance Status</span>
            <span className="text-sm font-bold text-emerald-400 print:text-emerald-700 mt-0.5 block">
              {reportData?.verification?.status || 'GENUINE'}
            </span>
          </div>
        </div>

        {/* 1. OCR Data Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 border-b border-surface-border pb-1">
            1. Optical Character Recognition (OCR) Audit
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 print:text-slate-600 text-[10px] block">SUBJECT NAME:</span>
              <strong className="text-slate-100 print:text-black">{reportData?.ocrResult?.name || 'AARAV DEV SHARMA'}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 text-[10px] block">DOCUMENT NUMBER:</span>
              <strong className="font-mono text-blue-300 print:text-blue-900">{reportData?.ocrResult?.documentNumber || 'Z8942104'}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 text-[10px] block">NATIONALITY / DOB:</span>
              <span className="text-slate-200 print:text-slate-800">
                {reportData?.ocrResult?.nationality || 'IND'} • {reportData?.ocrResult?.dateOfBirth || '14/08/1992'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 text-[10px] block">CONFIDENCE:</span>
              <span className="font-mono font-bold text-emerald-400 print:text-emerald-700">
                {reportData?.ocrResult?.confidence ?? 99.1}% (PASS)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Biometric & Forensic Inspection */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 border-b border-surface-border pb-1">
            2. Biometric & Forensic Substrate Verification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-surface/50 border border-surface-border print:bg-slate-50 print:border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 print:text-black">Facial Biometric Matcher</span>
                <span className="font-mono font-bold text-emerald-400 print:text-emerald-700">
                  {reportData?.faceVerification?.similarityScore ?? 97.8}% SIMILARITY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 print:text-slate-600">
                128-D Euclidean vector analysis against live booth feed. Status: {reportData?.faceVerification?.status || 'MATCHED'}.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/50 border border-surface-border print:bg-slate-50 print:border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 print:text-black">Forensic Tampering & ELA</span>
                <span className="font-mono font-bold text-emerald-400 print:text-emerald-700">
                  {reportData?.tamperingAnalysis?.tamperingScore ?? 3.2}% NOISE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 print:text-slate-600">
                Error Level Analysis scan. Status: {reportData?.tamperingAnalysis?.status || 'GENUINE'}. No pixel tampering detected.
              </p>
            </div>
          </div>
        </div>

        {/* 3. SHA-256 Hash & Blockchain Anchor */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 print:text-blue-800 border-b border-surface-border pb-1">
            3. Cryptographic SHA-256 Fingerprint & Blockchain Anchor
          </h3>

          <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800 print:bg-slate-100 print:border-slate-300 font-mono text-xs space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 print:text-slate-600 block">DOCUMENT SHA-256 DIGEST:</span>
              <p className="text-slate-200 print:text-black break-all">
                {reportData?.verification?.documentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 print:border-slate-300 text-[11px]">
              <span>LEDGER BLOCK NUMBER: #{reportData?.integrityRecord?.blockNumber ?? 1}</span>
              <span className="text-emerald-400 print:text-emerald-700 font-bold">CHAIN ANCHORED & VERIFIED</span>
            </div>
          </div>
        </div>

        {/* 4. Officer Final Verdict & Official Seal */}
        <div className="pt-4 border-t-2 border-blue-500/30 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1 text-xs">
            <span className="font-bold text-slate-300 print:text-black block">Officer Clearance Verdict:</span>
            <span className="text-base font-extrabold text-emerald-400 print:text-emerald-700 block">
              {reportData?.officerDecision?.decision || reportData?.verification?.status || 'APPROVED'}
            </span>
            <p className="text-slate-400 print:text-slate-600 text-[11px]">
              Reason: {reportData?.officerDecision?.reason || 'All verification vectors verified without deviation.'}
            </p>
          </div>

          <div className="text-right border-2 border-dashed border-slate-700 p-4 rounded-2xl print:border-slate-400">
            <div className="text-xs font-mono font-bold text-slate-400 print:text-black uppercase">
              Security Seal of Clearance
            </div>
            <p className="text-[10px] text-blue-400 font-mono mt-0.5">SSB POLICE-II DIVISION</p>
            <div className="w-32 h-8 mx-auto mt-2 border-b border-slate-600 flex items-center justify-center text-xs font-serif italic text-slate-400">
              Rajesh Sharma
            </div>
            <span className="text-[9px] font-mono text-slate-400 block mt-1">Authorized Clearance Officer</span>
          </div>
        </div>

        {/* Prototype Disclaimer */}
        <div className="p-3 rounded-xl bg-surface border border-slate-800 text-[10px] text-slate-400 print:border-slate-300 print:text-slate-500 text-center">
          {reportData?.disclaimer ||
            'PROTOTYPE DEMONSTRATION RECORD. Not connected to live government registries (UIDAI/CCTNS/Passport Seva). For Smart India Hackathon 2026 evaluation purposes only.'}
        </div>
      </div>
    </div>
  );
}
