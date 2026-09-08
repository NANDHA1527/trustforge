'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileCheck2,
  FileWarning,
  UserX,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  File,
  X,
  Loader2,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '@/lib/api';

export default function VerifyPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documentType, setDocumentType] = useState<'Passport' | 'Visa' | 'Identity Card'>('Passport');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('GENUINE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds maximum allowed 10MB limit.');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Unsupported file format. Please upload JPEG, PNG, WEBP, or PDF.');
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
    setSelectedScenario('CUSTOM');
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectScenario = (scenario: string, docType: 'Passport' | 'Visa' | 'Identity Card') => {
    setSelectedScenario(scenario);
    setDocumentType(docType);
    clearFile();
    if (scenario === 'GENUINE') {
      setSubjectName('Aarav Dev Sharma');
      setSubjectId('SUB-IND-9021');
    } else if (scenario === 'TAMPERED') {
      setSubjectName('Viktor Alexander Petrov');
      setSubjectId('SUB-CAN-8812');
    } else if (scenario === 'FACE_MISMATCH') {
      setSubjectName('Alexander James Wright');
      setSubjectId('SUB-GBR-5520');
    } else if (scenario === 'REVIEW_REQUIRED') {
      setSubjectName('Mei-Ling Chen');
      setSubjectId('SUB-SGP-7714');
    }
  };

  const startVerification = async () => {
    setIsProcessing(true);
    try {
      const res = await api.createVerification({
        documentType,
        scenarioType: selectedScenario,
        subjectName: subjectName || undefined,
        subjectId: subjectId || undefined,
        file: selectedFile || undefined
      });

      if (res.success && res.verification) {
        const vId = res.verification.verificationId;
        // Trigger automated multi-stage processing
        await api.processVerification(vId);
        router.push(`/verification/${vId}`);
      }
    } catch (err) {
      console.error('Failed to initiate verification:', err);
      alert('Failed to initiate screening. Check server status.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="ml-64 p-8 max-w-5xl space-y-8 bg-background min-h-screen">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            Frontier Screening Point
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Pipeline v2.0
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          New Identity & Document Verification
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload physical document scan or select an SIH predefined scenario to execute the 9-stage screening pipeline.
        </p>
      </div>

      {/* Predefined SIH Demonstration Scenarios */}
      <div className="glass-panel-elevated p-6 rounded-2xl border border-surface-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-bold text-white">Predefined SIH Demo Scenarios</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Deterministic Test Cases</span>
        </div>

        <p className="text-xs text-slate-400">
          Select one of the 4 benchmark scenarios mandated by the SIH26188 problem statement for predictable evaluation without external API dependence.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Scenario 1 */}
          <button
            type="button"
            onClick={() => selectScenario('GENUINE', 'Passport')}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              selectedScenario === 'GENUINE'
                ? 'bg-emerald-500/10 border-emerald-500 shadow-glowEmerald'
                : 'bg-surface border-surface-border hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                18/100
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">1. Genuine Passport</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Valid ePassport. Biometrics: 97.8% match. Tampering: 3.2%. SHA-256 ledger confirmed.
            </p>
            {selectedScenario === 'GENUINE' && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          {/* Scenario 2 */}
          <button
            type="button"
            onClick={() => selectScenario('TAMPERED', 'Visa')}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              selectedScenario === 'TAMPERED'
                ? 'bg-rose-500/10 border-rose-500 shadow-glowRose'
                : 'bg-surface border-surface-border hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <FileWarning className="w-5 h-5 text-rose-400" />
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                82/100
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">2. Tampered Document</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Altered visa expiry date & forged digital seal. ELA Score: 91.4%. Hash mismatch.
            </p>
            {selectedScenario === 'TAMPERED' && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-400" />
            )}
          </button>

          {/* Scenario 3 */}
          <button
            type="button"
            onClick={() => selectScenario('FACE_MISMATCH', 'Passport')}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              selectedScenario === 'FACE_MISMATCH'
                ? 'bg-rose-500/10 border-rose-500 shadow-glowRose'
                : 'bg-surface border-surface-border hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <UserX className="w-5 h-5 text-rose-400" />
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                68/100
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">3. Face Mismatch</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Genuine substrate with impersonation. Biometric similarity drops to 41.2%.
            </p>
            {selectedScenario === 'FACE_MISMATCH' && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-400" />
            )}
          </button>

          {/* Scenario 4 */}
          <button
            type="button"
            onClick={() => selectScenario('REVIEW_REQUIRED', 'Identity Card')}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              selectedScenario === 'REVIEW_REQUIRED'
                ? 'bg-amber-500/10 border-amber-500 shadow-sm'
                : 'bg-surface border-surface-border hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                48/100
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">4. Review Required</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Scuffed card substrate. Marginal OCR confidence 71.3%. Secondary officer inspect.
            </p>
            {selectedScenario === 'REVIEW_REQUIRED' && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* Manual Upload & Parameters Form */}
      <div className="glass-panel p-6 rounded-2xl border border-surface-border space-y-6">
        <div>
          <h2 className="text-base font-bold text-white">Document Parameters & File Ingestion</h2>
          <p className="text-xs text-slate-400">Configure document type and attach scan or optical feed snapshot</p>
        </div>

        {/* Document Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Document Credential Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['Passport', 'Visa', 'Identity Card'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDocumentType(type)}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                  documentType === type
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-glow'
                    : 'bg-surface border-surface-border text-slate-400 hover:bg-surface-hover hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop Upload Box */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Upload Document Image / PDF (Optional if using preset)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-blue-400 bg-blue-500/10 scale-[1.01]'
                  : 'border-surface-border hover:border-blue-500/50 bg-surface/60 hover:bg-surface-hover/50'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">Drag & drop document scan here</h3>
              <p className="text-xs text-slate-400 mt-1">
                or <span className="text-blue-400 font-semibold underline">browse local files</span> from workstation
              </p>
              <p className="text-[10px] text-slate-500 mt-2 font-mono">
                Supported formats: JPEG, PNG, WEBP, PDF (Max file size: 10MB)
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-surface-elevated border border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <File className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-sm">{selectedFile.name}</h4>
                  <p className="text-[10px] font-mono text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearFile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Subject Identifier Inputs (Optional override) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Subject Name (Optional Override)
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Aarav Dev Sharma"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Subject ID / Reference Token
            </label>
            <input
              type="text"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              placeholder="e.g. SUB-IND-9021"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2 border-t border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Active Scenario: <strong className="text-white font-mono">{selectedScenario}</strong></span>
          </div>

          <button
            type="button"
            onClick={startVerification}
            disabled={isProcessing}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-glow transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing 9-Stage Pipeline...</span>
              </>
            ) : (
              <>
                <span>Start Verification Pipeline</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
