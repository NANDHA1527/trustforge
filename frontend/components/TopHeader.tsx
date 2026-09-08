'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Clock, MapPin, Sparkles, CheckCircle2, AlertOctagon } from 'lucide-react';
import DemoScenarioBar from './DemoScenarioBar';

export default function TopHeader() {
  const pathname = usePathname();
  const [time, setTime] = useState<string>('');
  const [demoMode, setDemoMode] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour12: false }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 ml-64 bg-surface/80 border-b border-surface-border backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-2.5">
        {/* Checkpoint & Security Posture */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-elevated border border-surface-border text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">Raxaul Border Checkpoint — Gate 3</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Integrity Ledger: Online</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{time || '21:09:35 IST'}</span>
          </div>
        </div>

        {/* Demo Mode & Environment Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>SIH26188 Evaluation Environment</span>
          </div>

          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
              demoMode
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-surface-elevated text-slate-300 border-surface-border hover:bg-surface-hover'
            }`}
          >
            <span>SIH Demo Mode</span>
            <span className={`w-2 h-2 rounded-full ${demoMode ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
          </button>
        </div>
      </div>

      {/* Quick SIH Scenario Bar */}
      {demoMode && <DemoScenarioBar />}
    </header>
  );
}
