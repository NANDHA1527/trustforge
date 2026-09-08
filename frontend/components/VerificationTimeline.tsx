'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Loader2,
  FileText,
  Sliders,
  Scan,
  UserCheck,
  SearchCode,
  Hash,
  Link as ChainIcon,
  Gauge,
  Award
} from 'lucide-react';
import { VerificationStage } from '@/types/verification';

interface Props {
  stages: VerificationStage[];
  currentStageNumber?: number;
}

const stageIcons: { [key: number]: React.ComponentType<{ className?: string }> } = {
  1: FileText,
  2: Sliders,
  3: Scan,
  4: UserCheck,
  5: SearchCode,
  6: Hash,
  7: ChainIcon,
  8: Gauge,
  9: Award
};

export default function VerificationTimeline({ stages = [], currentStageNumber = 9 }: Props) {
  // Default fallback stages if verification is just starting
  const defaultStages: VerificationStage[] = [
    { stageNumber: 1, name: 'Document Ingestion', status: 'COMPLETED', durationMs: 85, confidence: 100, explanation: 'Document validated and loaded into volatile screening buffer' },
    { stageNumber: 2, name: 'Image Preprocessing', status: 'COMPLETED', durationMs: 140, confidence: 99, explanation: 'Perspective correction, de-skew, and illumination normalization' },
    { stageNumber: 3, name: 'OCR / Data Extraction', status: 'COMPLETED', durationMs: 380, confidence: 98, explanation: 'MRZ and Visual Inspection Zone (VIZ) parsed' },
    { stageNumber: 4, name: 'Face Verification', status: 'COMPLETED', durationMs: 460, confidence: 96, explanation: 'Facial euclidean similarity vector compared against live feed' },
    { stageNumber: 5, name: 'Forensic Tampering Detection', status: 'COMPLETED', durationMs: 580, confidence: 95, explanation: 'Error Level Analysis (ELA) and font glyph consistency scanner' },
    { stageNumber: 6, name: 'SHA-256 Hash Generation', status: 'COMPLETED', durationMs: 35, confidence: 100, explanation: 'Cryptographic digest computed for document fingerprinting' },
    { stageNumber: 7, name: 'Blockchain Verification', status: 'COMPLETED', durationMs: 210, confidence: 100, explanation: 'Integrity block generated and linked to distributed ledger' },
    { stageNumber: 8, name: 'Risk Scoring Engine', status: 'COMPLETED', durationMs: 65, confidence: 100, explanation: 'Multi-factor risk indexing across 4 weighted vectors' },
    { stageNumber: 9, name: 'Final Clearance Verdict', status: 'COMPLETED', durationMs: 40, confidence: 100, explanation: 'Automated policy evaluation complete. Awaiting officer sign-off.' }
  ];

  const displayStages = stages.length > 0 ? stages : defaultStages;

  return (
    <div className="space-y-3">
      {displayStages.map((stage, idx) => {
        const Icon = stageIcons[stage.stageNumber] || FileText;
        const isFinished = stage.status === 'COMPLETED';
        const isFlagged = stage.status === 'FLAGGED';
        const isRunning = stage.status === 'RUNNING';

        return (
          <div
            key={stage.stageNumber}
            className={`p-3.5 rounded-xl border transition-all ${
              isRunning
                ? 'bg-blue-600/10 border-blue-500/50 shadow-glow'
                : isFlagged
                ? 'bg-rose-950/20 border-rose-500/30'
                : 'bg-surface-elevated/60 border-surface-border'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isRunning
                      ? 'bg-blue-500/20 text-blue-400 animate-pulse border border-blue-500/40'
                      : isFlagged
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isFlagged ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">0{stage.stageNumber}.</span>
                    <h4 className="text-sm font-semibold text-slate-100">{stage.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{stage.explanation}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center justify-end gap-1.5">
                  {isFlagged ? (
                    <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      FLAGGED
                    </span>
                  ) : isRunning ? (
                    <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      PROCESSING
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      DONE
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 mt-1.5 text-[10px] font-mono text-slate-400">
                  <span>{stage.durationMs}ms</span>
                  <span>•</span>
                  <span className="text-blue-400">{stage.confidence}% conf</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
