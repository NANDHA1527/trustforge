'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, FileWarning, UserX, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function DemoScenarioBar() {
  const router = useRouter();
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);

  const runScenario = async (scenarioType: string, docType: string) => {
    setLoadingScenario(scenarioType);
    try {
      const res = await api.createVerification({
        documentType: docType,
        scenarioType: scenarioType
      });

      if (res.success && res.verification) {
        // Trigger automated pipeline run
        await api.processVerification(res.verification.verificationId);
        router.push(`/verification/${res.verification.verificationId}`);
      }
    } catch (err) {
      console.error('Failed to trigger scenario:', err);
    } finally {
      setLoadingScenario(null);
    }
  };

  return (
    <div className="bg-navy-950/90 border-t border-b border-blue-900/40 px-6 py-2 flex items-center justify-between gap-4 overflow-x-auto">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 shrink-0">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="tracking-wide uppercase text-[11px] text-blue-400 font-mono">1-Click SIH Scenarios:</span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto py-0.5">
        <button
          onClick={() => runScenario('GENUINE', 'Passport')}
          disabled={loadingScenario !== null}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          {loadingScenario === 'GENUINE' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
          <span>1. Genuine Passport</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">18/100</span>
        </button>

        <button
          onClick={() => runScenario('TAMPERED', 'Visa')}
          disabled={loadingScenario !== null}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          {loadingScenario === 'TAMPERED' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileWarning className="w-3.5 h-3.5 text-rose-400" />}
          <span>2. Tampered Document</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">82/100</span>
        </button>

        <button
          onClick={() => runScenario('FACE_MISMATCH', 'Passport')}
          disabled={loadingScenario !== null}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          {loadingScenario === 'FACE_MISMATCH' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserX className="w-3.5 h-3.5 text-rose-400" />}
          <span>3. Face Mismatch</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">68/100</span>
        </button>

        <button
          onClick={() => runScenario('REVIEW_REQUIRED', 'Identity Card')}
          disabled={loadingScenario !== null}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-950/40 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          {loadingScenario === 'REVIEW_REQUIRED' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
          <span>4. Review Required</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">48/100</span>
        </button>
      </div>
    </div>
  );
}
