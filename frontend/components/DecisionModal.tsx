'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XOctagon, ShieldAlert, X, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  verificationId: string;
  onDecisionSubmitted: (decision: string) => void;
}

export default function DecisionModal({
  isOpen,
  onClose,
  verificationId,
  onDecisionSubmitted
}: Props) {
  const [selectedDecision, setSelectedDecision] = useState<'APPROVE' | 'REVIEW' | 'SUSPICIOUS'>('APPROVE');
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.submitOfficerDecision({
        verificationId,
        decision: selectedDecision,
        reason: reason || (selectedDecision === 'APPROVE' ? 'All criteria verified' : selectedDecision === 'REVIEW' ? 'Secondary supervisor check requested' : 'Suspected forgery or impersonation'),
        notes
      });

      if (res.success) {
        onDecisionSubmitted(selectedDecision);
        setShowConfirmation(false);
        onClose();
      }
    } catch (err) {
      console.error('Failed to submit officer decision:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel-elevated w-full max-w-lg rounded-2xl border border-surface-border p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Officer Clearance Decision</h3>
              <p className="text-xs text-slate-400 font-mono">Record: {verificationId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showConfirmation ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Clearance Verdict
              </label>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDecision('APPROVE')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    selectedDecision === 'APPROVE'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-glowEmerald'
                      : 'bg-surface border-surface-border text-slate-400 hover:bg-surface-hover'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-bold">Approve</span>
                  <span className="text-[10px] text-slate-400">Clear Entry</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDecision('REVIEW')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    selectedDecision === 'REVIEW'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-surface border-surface-border text-slate-400 hover:bg-surface-hover'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-xs font-bold">Manual Review</span>
                  <span className="text-[10px] text-slate-400">Secondary Check</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDecision('SUSPICIOUS')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    selectedDecision === 'SUSPICIOUS'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-glowRose'
                      : 'bg-surface border-surface-border text-slate-400 hover:bg-surface-hover'
                  }`}
                >
                  <XOctagon className="w-5 h-5" />
                  <span className="text-xs font-bold">Flag Suspicious</span>
                  <span className="text-[10px] text-slate-400">Hold & Escalate</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Primary Justification / Reason
              </label>
              <input
                type="text"
                placeholder={
                  selectedDecision === 'APPROVE'
                    ? 'e.g. Clean biometric match & cryptographic integrity'
                    : selectedDecision === 'REVIEW'
                    ? 'e.g. Scuffed passport laminate requires visual inspect'
                    : 'e.g. Confirmed date alteration & biometric mismatch'
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Officer Field Notes (Audit Logged)
              </label>
              <textarea
                rows={3}
                placeholder="Enter any observational notes or checkpoint details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-surface-hover border border-surface-border transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmation(true)}
                className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-md ${
                  selectedDecision === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : selectedDecision === 'REVIEW'
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                Confirm Verdict & Log Decision
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Step */
          <div className="space-y-4 py-2 text-center">
            <div
              className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center border ${
                selectedDecision === 'APPROVE'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : selectedDecision === 'REVIEW'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}
            >
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">
                Confirm {selectedDecision} Verdict?
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                This action will be permanently recorded in the cryptographic audit trail with your Officer ID (<strong className="text-blue-400">TF-1024</strong>) and timestamp.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-surface-hover border border-surface-border transition-colors"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Authorize & Commit to Ledger</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
