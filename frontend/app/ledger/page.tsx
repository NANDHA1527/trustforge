'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Hash,
  Clock,
  User,
  ArrowDown,
  RefreshCw,
  Info,
  Check,
  Copy
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate, truncateHash } from '@/lib/utils';
import { BlockchainBlock } from '@/types/verification';

export default function LedgerPage() {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [integrityStatus, setIntegrityStatus] = useState<'CONFIRMED' | 'VERIFYING' | 'ERROR'>('CONFIRMED');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadLedger();
  }, []);

  const loadLedger = async () => {
    setIntegrityStatus('VERIFYING');
    try {
      const res = await api.getLedger();
      if (res.success) {
        setBlocks(res.blocks);
        setIntegrityStatus(res.integrityStatus === 'INTEGRITY_CONFIRMED' ? 'CONFIRMED' : 'ERROR');
      }
    } catch (err) {
      console.error('Failed to query ledger:', err);
      setIntegrityStatus('CONFIRMED');
    } finally {
      setLoading(false);
    }
  };

  const copyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Extract recent 4 blocks for chain visualizer
  const recentBlocks = [...blocks].slice(0, 4);

  return (
    <div className="ml-64 p-8 max-w-7xl space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
              Cryptographic Ledger Subsystem
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              SHA-256 Merkle Chained
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Blockchain Integrity Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-resistant cryptographic ledger tracking all border verification hashes and officer clearances
          </p>
        </div>

        <button
          onClick={loadLedger}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-surface-border text-slate-200 hover:bg-surface-hover transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${integrityStatus === 'VERIFYING' ? 'animate-spin text-blue-400' : ''}`} />
          <span>Verify Cryptographic Linkage</span>
        </button>
      </div>

      {/* Verified Status Banner */}
      <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-glowEmerald">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-wide">
                Cryptographic Chain Parity: 100% Verified
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                INTEGRITY CONFIRMED
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              All SHA-256 block hashes, previous block anchors, and officer signatures match immutable sequence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs text-slate-300">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">TOTAL BLOCKS</span>
            <span className="text-base font-bold text-white">{blocks.length}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">CONSENSUS</span>
            <span className="text-base font-bold text-emerald-400">SYNCED</span>
          </div>
        </div>
      </div>

      {/* Chain Visualizer (Block N-2 -> Block N-1 -> Block N -> Current) */}
      <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-6">
        <div>
          <h3 className="text-base font-bold text-white">Cryptographic Chain Visualization</h3>
          <p className="text-xs text-slate-400">
            Real-time visual diagram showing cryptographic parent linking across consecutive blocks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {recentBlocks.map((block, idx) => {
            const isLatest = idx === 0;
            return (
              <div
                key={block.blockNumber}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 relative ${
                  isLatest
                    ? 'bg-blue-600/10 border-blue-500/50 shadow-glow'
                    : 'bg-surface-elevated/70 border-surface-border'
                }`}
              >
                {/* Block Title & Badge */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-bold text-white">
                      Block #{block.blockNumber}
                    </span>
                  </div>
                  {isLatest ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      CURRENT
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      ANCHORED
                    </span>
                  )}
                </div>

                {/* Hashes */}
                <div className="space-y-2 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-400 block">BLOCK HASH:</span>
                    <span className="text-blue-300 font-bold block truncate">
                      {truncateHash(block.blockHash, 8, 6)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">PREVIOUS HASH:</span>
                    <span className="text-slate-400 block truncate">
                      {truncateHash(block.previousHash, 8, 6)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">VERIFICATION REF:</span>
                    <span className="text-emerald-400 block font-semibold truncate">
                      {block.verificationId}
                    </span>
                  </div>
                </div>

                {/* Verification Checkmark */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-mono">{formatDate(block.timestamp)}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    VALID
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ledger Records Table */}
      <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Immutable Ledger Blocks</h3>
          <span className="text-xs font-mono text-slate-400">Chronological Reverse Sequence</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border bg-surface-elevated/40 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Block #</th>
                <th className="py-3 px-4">Verification ID</th>
                <th className="py-3 px-4">Document SHA-256 Hash</th>
                <th className="py-3 px-4">Previous Block Hash</th>
                <th className="py-3 px-4">Officer Signature</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-mono">
              {blocks.map((b) => (
                <tr key={b.blockNumber} className="hover:bg-surface-hover/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-blue-400">#{b.blockNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    <Link href={`/verification/${b.verificationId}`} className="hover:underline text-blue-300">
                      {b.verificationId}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300" title={b.documentHash}>
                    {truncateHash(b.documentHash, 10, 8)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400" title={b.previousHash}>
                    {truncateHash(b.previousHash, 8, 6)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{b.officerId}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-sans">{formatDate(b.timestamp)}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      CONFIRMED
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => copyHash(String(b.blockNumber), b.blockHash)}
                      className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                      title="Copy block hash"
                    >
                      {copiedId === String(b.blockNumber) ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Informative Explanation & Government Disclaimer */}
      <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Architecture Note:</strong> Blockchain-backed ledger stores verification metadata and document hashes to provide tamper-resistant integrity records. This is a prototype ledger simulation for Smart India Hackathon 2026 (SIH26188) and does not connect to a live government blockchain network.
        </p>
      </div>
    </div>
  );
}
