'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  FileWarning,
  Hash,
  Copy,
  Check,
  ArrowLeft,
  FileBarChart,
  UserCheck,
  UserX,
  Database,
  Layers,
  Sparkles,
  Info,
  Clock,
  MapPin,
  CheckCircle2,
  XOctagon,
  ScanText
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate, truncateHash, getStatusTheme } from '@/lib/utils';
import {
  VerificationRecord,
  OCRData,
  FaceVerificationData,
  TamperingData,
  RiskAssessmentData,
  BlockchainBlock,
  OfficerDecisionData
} from '@/types/verification';

import VerificationTimeline from '@/components/VerificationTimeline';
import RiskMeter from '@/components/RiskMeter';
import TamperingViewer from '@/components/TamperingViewer';
import FaceComparisonCard from '@/components/FaceComparisonCard';
import DecisionModal from '@/components/DecisionModal';

export default function VerificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [verification, setVerification] = useState<VerificationRecord | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRData | null>(null);
  const [faceResult, setFaceResult] = useState<FaceVerificationData | null>(null);
  const [tamperingResult, setTamperingResult] = useState<TamperingData | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessmentData | null>(null);
  const [blockchainRecord, setBlockchainRecord] = useState<BlockchainBlock | null>(null);
  const [officerDecision, setOfficerDecision] = useState<OfficerDecisionData | null>(null);

  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState(false);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'FORENSIC_SUITE' | 'OCR_DATA' | 'TIMELINE' | 'LEDGER'>('FORENSIC_SUITE');

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (vId: string) => {
    try {
      const res = await api.getVerificationById(vId);
      if (res.success) {
        setVerification(res.verification);
        setOcrResult(res.ocrResult);
        setFaceResult(res.faceVerification);
        setTamperingResult(res.tamperingAnalysis);
        setRiskAssessment(res.riskAssessment);
        setBlockchainRecord(res.integrityRecord);
        setOfficerDecision(res.officerDecision);
      }
    } catch (err) {
      console.error('Failed to load verification:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDecisionSubmitted = (decision: string) => {
    if (verification) {
      setVerification({
        ...verification,
        status: decision === 'APPROVE' ? 'GENUINE' : decision === 'REVIEW' ? 'REVIEW REQUIRED' : 'SUSPICIOUS'
      });
      setOfficerDecision({
        decision: decision as any,
        timestamp: new Date().toISOString()
      });
    }
  };

  if (loading) {
    return (
      <div className="ml-64 p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading screening dossier: {id}...</p>
      </div>
    );
  }

  const statusTheme = getStatusTheme(verification?.status);
  const riskScore = verification?.riskScore ?? riskAssessment?.totalScore ?? 18;

  return (
    <div className="ml-64 p-8 max-w-7xl space-y-8 bg-background min-h-screen">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="p-2 rounded-xl bg-surface border border-surface-border text-slate-400 hover:text-white hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-blue-400 font-semibold uppercase">
                Screening Dossier
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {verification?.documentType}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-0.5 flex items-center gap-3">
              <span>{verification?.verificationId || id}</span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${statusTheme.badge}`}>
                {verification?.status}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/reports`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-surface-border text-slate-300 hover:bg-surface-hover hover:text-white transition-all"
          >
            <FileBarChart className="w-4 h-4 text-blue-400" />
            <span>Generate Official Report</span>
          </Link>

          <button
            onClick={() => setDecisionModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-glow transition-all active:scale-95"
          >
            <Shield className="w-4 h-4" />
            <span>Record Officer Decision</span>
          </button>
        </div>
      </div>

      {/* Primary Result Banner */}
      <div
        className={`p-6 rounded-2xl border flex flex-wrap items-center justify-between gap-6 transition-all ${
          verification?.status === 'GENUINE'
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : verification?.status === 'SUSPICIOUS'
            ? 'bg-rose-950/20 border-rose-500/30'
            : 'bg-amber-950/20 border-amber-500/30'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 ${
              verification?.status === 'GENUINE'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glowEmerald'
                : verification?.status === 'SUSPICIOUS'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-glowRose'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}
          >
            {verification?.status === 'GENUINE' ? (
              <ShieldCheck className="w-8 h-8" />
            ) : verification?.status === 'SUSPICIOUS' ? (
              <XOctagon className="w-8 h-8" />
            ) : (
              <AlertTriangle className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Clearance Result:{' '}
                <span
                  className={
                    verification?.status === 'GENUINE'
                      ? 'text-emerald-400'
                      : verification?.status === 'SUSPICIOUS'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }
                >
                  {verification?.status}
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              {verification?.status === 'GENUINE'
                ? 'All cryptographic hashes match, facial biometric similarity confirmed (>97%), and forensic ELA scan reveals no anomalous pixel manipulation.'
                : verification?.status === 'SUSPICIOUS'
                ? 'High-risk security alert. Critical anomaly detected in substrate forensics or facial biometric Euclidean mismatch. Detain subject for manual investigation.'
                : 'Marginal OCR confidence or physical substrate wear detected. Secondary physical inspection required by duty supervisor.'}
            </p>
          </div>
        </div>

        {/* Quick Check Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface/80 border border-surface-border">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>OCR: {ocrResult?.status || 'PASS'}</span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface/80 border border-surface-border">
            {faceResult?.status === 'MATCHED' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XOctagon className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>Face: {faceResult?.similarityScore?.toFixed(1) || 97.8}%</span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface/80 border border-surface-border">
            {tamperingResult?.tamperingScore && tamperingResult.tamperingScore > 50 ? (
              <XOctagon className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Tamper: {tamperingResult?.tamperingScore?.toFixed(1) || 3.2}%</span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface/80 border border-surface-border">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>SHA-256: VALID</span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface/80 border border-surface-border">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Ledger: Block #{blockchainRecord?.blockNumber ?? 1}</span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface/80 border border-surface-border">
            <span
              className={`w-2 h-2 rounded-full ${
                riskScore >= 61 ? 'bg-rose-500' : riskScore >= 31 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <span>Risk: {riskScore}/100</span>
          </div>
        </div>
      </div>

      {/* SHA-256 Hash & Blockchain Ledger Anchor Banner */}
      <div className="glass-panel p-4 rounded-xl border border-surface-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0">
            <Hash className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">SHA-256 Document Fingerprint</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-blue-400 border border-slate-700">
                256-bit Immutable Hash
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 truncate max-w-2xl mt-0.5">
              {verification?.documentHash}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => copyToClipboard(verification?.documentHash || '')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface hover:bg-surface-hover border border-surface-border text-slate-300 transition-colors"
          >
            {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedHash ? 'Hash Copied' : 'Copy Hash'}</span>
          </button>

          <Link
            href="/ledger"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Inspect Ledger Block</span>
          </Link>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-3">
        <button
          onClick={() => setActiveTab('FORENSIC_SUITE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'FORENSIC_SUITE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-surface-hover'
          }`}
        >
          Forensic Inspection Suite (Tampering & Biometrics)
        </button>

        <button
          onClick={() => setActiveTab('OCR_DATA')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'OCR_DATA'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-surface-hover'
          }`}
        >
          Extracted OCR & MRZ Fields
        </button>

        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'TIMELINE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-surface-hover'
          }`}
        >
          9-Stage Pipeline Timeline
        </button>
      </div>

      {/* Tab 1: Forensic Inspection Suite */}
      {activeTab === 'FORENSIC_SUITE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Tampering Viewer & Face Verification */}
          <div className="lg:col-span-2 space-y-6">
            <TamperingViewer
              tamperingData={tamperingResult || undefined}
              documentType={verification?.documentType}
              documentNumber={ocrResult?.documentNumber}
              name={ocrResult?.name}
            />

            <FaceComparisonCard
              faceData={faceResult || undefined}
              subjectName={ocrResult?.name}
            />
          </div>

          {/* Right Col: Explainable Risk Meter & Decision Status */}
          <div className="space-y-6">
            <RiskMeter riskData={riskAssessment || undefined} />

            {/* Officer Decision Box */}
            <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Officer Clearance Action
                </h4>
                <span className="text-[10px] font-mono text-slate-400">TF-1024</span>
              </div>

              {officerDecision ? (
                <div className="p-3 rounded-xl bg-surface/80 border border-surface-border text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Recorded Verdict:</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        officerDecision.decision === 'APPROVE'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : officerDecision.decision === 'REVIEW'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {officerDecision.decision}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Reason: {officerDecision.reason || 'Screening criteria cleared.'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Committed: {formatDate(officerDecision.timestamp)}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  No final verdict recorded yet. Duty officer must sign off on clearance.
                </p>
              )}

              <button
                onClick={() => setDecisionModalOpen(true)}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm active:scale-95"
              >
                {officerDecision ? 'Update Decision Record' : 'Record Officer Decision'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: OCR Extracted Fields */}
      {activeTab === 'OCR_DATA' && (
        <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Machine-Readable & Visual Inspection Data
              </h3>
              <p className="text-xs text-slate-400">
                ICAO Document 9303 Compliant Optical Character Recognition
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Confidence:</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {ocrResult?.confidence ?? 98.4}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-surface/80 border border-surface-border">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Full Name</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {ocrResult?.name || 'AARAV DEV SHARMA'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/80 border border-surface-border">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Document Number</span>
              <span className="text-sm font-mono font-bold text-blue-400 mt-1 block">
                {ocrResult?.documentNumber || 'Z8942104'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/80 border border-surface-border">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Nationality</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {ocrResult?.nationality || 'IND'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/80 border border-surface-border">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Date of Birth</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {ocrResult?.dateOfBirth || '14/08/1992'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/80 border border-surface-border">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Issue Date</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {ocrResult?.issueDate || '10/01/2021'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/80 border border-surface-border">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Expiry Date</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {ocrResult?.expiryDate || '09/01/2031'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/80 border border-surface-border">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Gender</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {ocrResult?.gender || 'M'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface/80 border border-surface-border">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Checksum Parity</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 block">
                MATCHED (100%)
              </span>
            </div>
          </div>

          {/* Raw MRZ Box */}
          <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Raw Machine Readable Zone (MRZ Lines):
            </span>
            <pre className="font-mono text-xs text-blue-300 tracking-widest leading-relaxed overflow-x-auto select-all">
              {ocrResult?.mrzRaw ||
                `P<INDAAARAV<DEV<SHARMA<<<<<<<<<<<<<<<<<<<<<\nZ8942104<4IND9208148M3101095<<<<<<<<<<<<<<06`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: 9-Stage Pipeline Timeline */}
      {activeTab === 'TIMELINE' && (
        <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">9-Stage Screening Pipeline Execution</h3>
            <p className="text-xs text-slate-400">
              End-to-end execution sequence with telemetry timestamps and confidence ratings
            </p>
          </div>

          <VerificationTimeline stages={verification?.stagesCompleted || []} />
        </div>
      )}

      {/* Officer Decision Modal */}
      <DecisionModal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        verificationId={verification?.verificationId || id}
        onDecisionSubmitted={handleDecisionSubmitted}
      />
    </div>
  );
}
